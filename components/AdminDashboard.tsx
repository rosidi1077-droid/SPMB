
import React, { useState, useEffect, useRef } from 'react';
import { Student, SchoolLevel, RegistrationStatus, UserRole, AdminUser, AppSettings } from '../types.ts';
import { REQUIRED_DOCUMENTS, SCHOOL_LEVELS, DEFAULT_ADMIN_PHONE, getAdminPhone } from '../constants.tsx';
import { summarizeRegistrations } from '../services/geminiService.ts';

const AdminDashboard: React.FC = () => {
  // State Utama
  const [activeTab, setActiveTab] = useState<'registrations' | 'users' | 'settings'>('registrations');
  const [settings, setSettings] = useState<AppSettings>({ adminWhatsApp: getAdminPhone() });
  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('spmb_admins');
    return saved ? JSON.parse(saved) : [{ id: 'sa-1', username: 'superadmin', role: UserRole.SUPER_ADMIN }];
  });
  
  // Data Pendaftar (Simulasi)
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      fullName: 'Budi Santoso',
      nickName: 'Budi',
      level: SchoolLevel.SD,
      parentPhone: '081211112222',
      registrationDate: '2023-11-01',
      status: RegistrationStatus.PENDING,
      documents: []
    }
  ]);

  const [aiSummary, setAiSummary] = useState<string>('Memuat ringkasan AI...');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New User Form State
  const [newUser, setNewUser] = useState({ username: '', role: UserRole.LEVEL_ADMIN, assignedLevel: SchoolLevel.SD });

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await summarizeRegistrations(students);
      setAiSummary(summary);
    };
    fetchSummary();
  }, [students]);

  // Simpan data ke localStorage saat berubah
  useEffect(() => {
    localStorage.setItem('spmb_admins', JSON.stringify(admins));
    localStorage.setItem('spmb_settings', JSON.stringify(settings));
  }, [admins, settings]);

  const handleStatusChange = (id: string, newStatus: RegistrationStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username) return;
    const admin: AdminUser = {
      id: Date.now().toString(),
      username: newUser.username,
      role: newUser.role,
      assignedLevel: newUser.role === UserRole.LEVEL_ADMIN ? newUser.assignedLevel : undefined
    };
    setAdmins([...admins, admin]);
    setNewUser({ ...newUser, username: '' });
  };

  const handleRemoveAdmin = (id: string) => {
    if (confirm('Hapus akun admin ini?')) {
      setAdmins(admins.filter(a => a.id !== id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedStudent) return;
    const file = e.target.files[0];
    const newDoc = {
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type
    };
    setStudents(prev => prev.map(s => s.id === selectedStudent.id ? {
      ...s,
      documents: [...s.documents, newDoc]
    } : s));
    alert(`Berkas ${file.name} berhasil diunggah.`);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Panel Kendali Utama</h2>
          <p className="text-slate-500">Yayasan Pendidikan Dhia El Widad</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <button 
            onClick={() => setActiveTab('registrations')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'registrations' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-users mr-2"></i>Pendaftar
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-user-shield mr-2"></i>Manajemen Akun
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-cog mr-2"></i>Pengaturan
          </button>
        </div>
      </div>

      {activeTab === 'registrations' && (
        <>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8 flex items-start space-x-4">
            <div className="bg-emerald-600 p-3 rounded-xl text-white shadow-lg"><i className="fas fa-robot"></i></div>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-900">Asisten AI</h4>
              <p className="text-emerald-800 text-sm italic">"{aiSummary}"</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Calon Murid</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Jenjang</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Berkas</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{student.fullName}</div>
                      <div className="text-xs text-slate-400 flex items-center mt-1">
                        <i className="fab fa-whatsapp mr-1 text-emerald-500"></i> {student.parentPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2 py-1 rounded-md border border-blue-100 uppercase">
                        {student.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={student.status}
                        onChange={(e) => handleStatusChange(student.id, e.target.value as RegistrationStatus)}
                        className="text-xs font-bold text-slate-700 bg-slate-100 border-none rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {Object.values(RegistrationStatus).map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${student.documents.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                          {student.documents.length} File
                        </span>
                        <button 
                          onClick={() => { setSelectedStudent(student); setIsUploadModalOpen(true); }} 
                          className="w-8 h-8 rounded-full bg-slate-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center"
                          title="Bantu Upload Berkas"
                        >
                          <i className="fas fa-upload"></i>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => window.open(`https://wa.me/${student.parentPhone}`, '_blank')}
                        className="text-emerald-500 hover:text-emerald-700 p-2"
                      >
                        <i className="fab fa-whatsapp text-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Buat Akun Admin</h3>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Username</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: admin_sd_dida"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Role</label>
                  <select 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                  >
                    <option value={UserRole.LEVEL_ADMIN}>Admin Jenjang</option>
                    <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                  </select>
                </div>
                {newUser.role === UserRole.LEVEL_ADMIN && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Jenjang Tugas</label>
                    <select 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      value={newUser.assignedLevel}
                      onChange={(e) => setNewUser({...newUser, assignedLevel: e.target.value as SchoolLevel})}
                    >
                      {SCHOOL_LEVELS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                )}
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                  Tambahkan Akun
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Username</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Jenjang</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {admins.map(admin => (
                    <tr key={admin.id}>
                      <td className="px-6 py-4 font-bold text-slate-800">{admin.username}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-md border uppercase ${admin.role === UserRole.SUPER_ADMIN ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                          {admin.role === UserRole.SUPER_ADMIN ? 'Super Admin' : 'Jenjang Admin'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {admin.role === UserRole.SUPER_ADMIN ? 'Semua Jenjang' : admin.assignedLevel}
                      </td>
                      <td className="px-6 py-4">
                        {admin.username !== 'superadmin' && (
                          <button onClick={() => handleRemoveAdmin(admin.id)} className="text-red-400 hover:text-red-600">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Pengaturan Global</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nomor WhatsApp Admin Utama</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-lg"
                    placeholder="628XXXXXXXXX"
                    value={settings.adminWhatsApp}
                    onChange={(e) => setSettings({ adminWhatsApp: e.target.value.replace(/[^0-9]/g, '') })}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">Gunakan format internasional tanpa tanda + atau spasi (contoh: 628123456789).</p>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Penting:</strong> Nomor ini akan muncul di tombol WhatsApp di seluruh halaman pendaftaran murid baru. Pastikan nomor selalu aktif.
                </p>
              </div>

              <button 
                onClick={() => {
                  alert('Pengaturan berhasil disimpan!');
                  localStorage.setItem('spmb_settings', JSON.stringify(settings));
                }}
                className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 transition-all"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Upload Berkas Orang Tua</h3>
            <div className="space-y-2 mb-6">
              {REQUIRED_DOCUMENTS.map(doc => (
                <button key={doc} onClick={() => fileInputRef.current?.click()} className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 text-sm font-medium border border-slate-100 flex justify-between items-center group hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                  {doc} <i className="fas fa-plus text-slate-300 group-hover:text-emerald-500"></i>
                </button>
              ))}
            </div>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <button onClick={() => setIsUploadModalOpen(false)} className="w-full py-2 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors">Tutup Jendela</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
