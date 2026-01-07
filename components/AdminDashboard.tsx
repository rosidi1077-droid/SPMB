
import React, { useState, useEffect, useRef } from 'react';
import { Student, SchoolLevel, RegistrationStatus, UserRole, AdminUser, AppSettings } from '../types.ts';
import { REQUIRED_DOCUMENTS, SCHOOL_LEVELS, DEFAULT_ADMIN_PHONE, getAdminPhone } from '../constants.tsx';
import { summarizeRegistrations } from '../services/geminiService.ts';

const AdminDashboard: React.FC = () => {
  // State Login Simulasi (Untuk demonstrasi hak akses)
  const [currentUser, setCurrentUser] = useState<AdminUser>(() => {
    const saved = localStorage.getItem('spmb_admins');
    const admins = saved ? JSON.parse(saved) : [];
    return admins.find((a: AdminUser) => a.username === 'superadmin') || { id: 'sa-1', username: 'superadmin', role: UserRole.SUPER_ADMIN };
  });

  const [activeTab, setActiveTab] = useState<'registrations' | 'users' | 'settings'>('registrations');
  const [settings, setSettings] = useState<AppSettings>({ adminWhatsApp: getAdminPhone() });
  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('spmb_admins');
    return saved ? JSON.parse(saved) : [{ id: 'sa-1', username: 'superadmin', role: UserRole.SUPER_ADMIN }];
  });
  
  // Data Pendaftar
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('spmb_students');
    return saved ? JSON.parse(saved) : [];
  });

  const [aiSummary, setAiSummary] = useState<string>('Menganalisis data pendaftar...');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [newUser, setNewUser] = useState({ username: '', role: UserRole.LEVEL_ADMIN, assignedLevel: SchoolLevel.SD });
  const [newStudent, setNewStudent] = useState({ fullName: '', nickName: '', level: SchoolLevel.SD, parentPhone: '' });

  // Update Jenjang otomatis di form jika admin adalah Admin Jenjang
  useEffect(() => {
    if (currentUser.role === UserRole.LEVEL_ADMIN && currentUser.assignedLevel) {
      setNewStudent(prev => ({ ...prev, level: currentUser.assignedLevel! }));
    }
  }, [currentUser, isAddStudentModalOpen]);

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await summarizeRegistrations(students);
      setAiSummary(summary);
    };
    fetchSummary();
  }, [students]);

  // Simpan data
  useEffect(() => {
    localStorage.setItem('spmb_admins', JSON.stringify(admins));
    localStorage.setItem('spmb_settings', JSON.stringify(settings));
    localStorage.setItem('spmb_students', JSON.stringify(students));
  }, [admins, settings, students]);

  // Filter murid berdasarkan hak akses
  const filteredStudents = students.filter(s => {
    if (currentUser.role === UserRole.SUPER_ADMIN) return true;
    return s.level === currentUser.assignedLevel;
  });

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

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const student: Student = {
      id: Date.now().toString(),
      fullName: newStudent.fullName,
      nickName: newStudent.nickName,
      level: newStudent.level,
      parentPhone: newStudent.parentPhone,
      registrationDate: new Date().toISOString().split('T')[0],
      status: RegistrationStatus.PENDING,
      documents: []
    };
    setStudents([student, ...students]);
    setIsAddStudentModalOpen(false);
    setNewStudent({ fullName: '', nickName: '', level: currentUser.assignedLevel || SchoolLevel.SD, parentPhone: '' });
    alert("Murid baru berhasil ditambahkan!");
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
      {/* Admin Switcher (Hanya untuk testing/demo) */}
      <div className="mb-6 bg-slate-800 text-white p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold">
            {currentUser.username[0].toUpperCase()}
          </div>
          <div>
            <p className="text-xs opacity-60">Masuk Sebagai:</p>
            <p className="font-bold leading-none">{currentUser.username} ({currentUser.role === UserRole.SUPER_ADMIN ? 'Super' : currentUser.assignedLevel})</p>
          </div>
        </div>
        <select 
          className="bg-slate-700 text-xs py-1 px-3 rounded-lg border-none outline-none"
          onChange={(e) => {
            const admin = admins.find(a => a.id === e.target.value);
            if (admin) setCurrentUser(admin);
          }}
          value={currentUser.id}
        >
          {admins.map(a => <option key={a.id} value={a.id}>{a.username}</option>)}
        </select>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Panel Kendali</h2>
          <p className="text-slate-500">{currentUser.role === UserRole.SUPER_ADMIN ? 'Yayasan Dhia El Widad' : `Admin Jenjang ${currentUser.assignedLevel}`}</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <button onClick={() => setActiveTab('registrations')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'registrations' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
            <i className="fas fa-users mr-2"></i>Pendaftar
          </button>
          {currentUser.role === UserRole.SUPER_ADMIN && (
            <>
              <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                <i className="fas fa-user-shield mr-2"></i>Akun Admin
              </button>
              <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                <i className="fas fa-cog mr-2"></i>Pengaturan
              </button>
            </>
          )}
        </div>
      </div>

      {activeTab === 'registrations' && (
        <>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-emerald-600 p-3 rounded-xl text-white shadow-lg"><i className="fas fa-robot"></i></div>
              <div>
                <h4 className="font-bold text-emerald-900">Asisten AI</h4>
                <p className="text-emerald-800 text-sm italic">"{aiSummary}"</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAddStudentModalOpen(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center space-x-2"
            >
              <i className="fas fa-user-plus"></i>
              <span>Tambah Murid Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nama Calon Murid</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Jenjang</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Dokumen</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Kontak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Belum ada data pendaftar.</td>
                    </tr>
                  ) : filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{student.fullName}</div>
                        <div className="text-[10px] text-slate-400 uppercase mt-1">Reg: {student.registrationDate}</div>
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
                          >
                            <i className="fas fa-upload"></i>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => window.open(`https://wa.me/${student.parentPhone}`, '_blank')} className="text-emerald-500 hover:text-emerald-700">
                          <i className="fab fa-whatsapp text-xl"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* MODAL: Tambah Murid Manual */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddStudentModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-emerald-700 p-6 text-white">
              <h3 className="text-xl font-bold">Pendaftaran Manual</h3>
              <p className="text-emerald-100 text-xs">Isi identitas pendaftar secara langsung</p>
            </div>
            <form onSubmit={handleAddStudent} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Lengkap Murid</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500" value={newStudent.fullName} onChange={(e) => setNewStudent({...newStudent, fullName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Jenjang</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    disabled={currentUser.role === UserRole.LEVEL_ADMIN}
                    value={newStudent.level}
                    onChange={(e) => setNewStudent({...newStudent, level: e.target.value as SchoolLevel})}
                  >
                    {SCHOOL_LEVELS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Panggilan</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500" value={newStudent.nickName} onChange={(e) => setNewStudent({...newStudent, nickName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nomor WA Orang Tua (Untuk Verifikasi)</label>
                <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="628..." value={newStudent.parentPhone} onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})} />
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setIsAddStudentModalOpen(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all">Batal</button>
                <button type="submit" className="flex-[2] bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">Simpan Pendaftar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs lain (Hanya Super Admin) */}
      {activeTab === 'users' && currentUser.role === UserRole.SUPER_ADMIN && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Buat Akun Admin</h3>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <input type="text" className="w-full px-4 py-2 rounded-xl border border-slate-200" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} />
                <select className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}>
                  <option value={UserRole.LEVEL_ADMIN}>Admin Jenjang</option>
                  <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                </select>
                {newUser.role === UserRole.LEVEL_ADMIN && (
                  <select className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white" value={newUser.assignedLevel} onChange={(e) => setNewUser({...newUser, assignedLevel: e.target.value as SchoolLevel})}>
                    {SCHOOL_LEVELS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                )}
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl">Tambahkan Akun</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Username</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Akses</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {admins.map(admin => (
                    <tr key={admin.id}>
                      <td className="px-6 py-4 font-bold text-slate-800">{admin.username}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-md border uppercase ${admin.role === UserRole.SUPER_ADMIN ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                          {admin.role === UserRole.SUPER_ADMIN ? 'Super' : admin.assignedLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {admin.username !== 'superadmin' && (
                          <button onClick={() => setAdmins(admins.filter(a => a.id !== admin.id))} className="text-red-400"><i className="fas fa-trash"></i></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && currentUser.role === UserRole.SUPER_ADMIN && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Nomor WhatsApp Utama</h3>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-lg mb-4"
            value={settings.adminWhatsApp}
            onChange={(e) => setSettings({ adminWhatsApp: e.target.value.replace(/[^0-9]/g, '') })}
          />
          <button 
            onClick={() => { localStorage.setItem('spmb_settings', JSON.stringify(settings)); alert('Disimpan!'); }}
            className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl"
          >
            Simpan Konfigurasi
          </button>
        </div>
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Upload Berkas: {selectedStudent?.fullName}</h3>
            <div className="space-y-2 mb-6">
              {REQUIRED_DOCUMENTS.map(doc => (
                <button key={doc} onClick={() => fileInputRef.current?.click()} className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 text-sm border border-slate-100 flex justify-between items-center hover:bg-emerald-50 transition-all">
                  {doc} <i className="fas fa-plus text-slate-300"></i>
                </button>
              ))}
            </div>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <button onClick={() => setIsUploadModalOpen(false)} className="w-full py-2 text-slate-400 font-medium">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
