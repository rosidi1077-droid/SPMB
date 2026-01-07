
import React, { useState, useEffect, useRef } from 'react';
import { Student, SchoolLevel, RegistrationStatus } from '../types';
import { SCHOOL_LEVELS, REQUIRED_DOCUMENTS } from '../constants';
import { summarizeRegistrations } from '../services/geminiService';

const AdminDashboard: React.FC = () => {
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
    },
    {
      id: '2',
      fullName: 'Siti Aminah',
      nickName: 'Siti',
      level: SchoolLevel.TK,
      parentPhone: '081233334444',
      registrationDate: '2023-11-02',
      status: RegistrationStatus.VERIFIED,
      documents: []
    }
  ]);

  const [aiSummary, setAiSummary] = useState<string>('Memuat ringkasan AI...');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await summarizeRegistrations(students);
      setAiSummary(summary);
    };
    fetchSummary();
  }, [students]);

  const handleStatusChange = (id: string, newStatus: RegistrationStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedStudent) return;
    const file = e.target.files[0];
    
    // In a real app, upload to storage. Here we just mock it.
    const newDoc = {
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type
    };

    setStudents(prev => prev.map(s => s.id === selectedStudent.id ? {
      ...s,
      documents: [...s.documents, newDoc]
    } : s));
    
    alert(`Berkas ${file.name} berhasil diunggah untuk ${selectedStudent.fullName}`);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Panel Administrasi SPMB</h2>
          <p className="text-slate-500">Kelola pendaftaran dan berkas murid baru</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            <i className="fas fa-plus mr-2"></i>Tambah Manual
          </button>
          <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors">
            <i className="fas fa-file-export mr-2"></i>Export Excel
          </button>
        </div>
      </div>

      {/* AI Summary Widget */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8 flex items-start space-x-4">
        <div className="bg-emerald-600 p-3 rounded-xl text-white">
          <i className="fas fa-robot text-xl"></i>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-emerald-900 mb-1">AI Insights & Statistics</h4>
          <p className="text-emerald-800 text-sm leading-relaxed">{aiSummary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Cards */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Pendaftar</p>
            <h3 className="text-3xl font-black text-slate-800">{students.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Menunggu</p>
            <h3 className="text-3xl font-black text-amber-500">{students.filter(s => s.status === RegistrationStatus.PENDING).length}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Terverifikasi</p>
            <h3 className="text-3xl font-black text-blue-500">{students.filter(s => s.status === RegistrationStatus.VERIFIED).length}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Diterima</p>
            <h3 className="text-3xl font-black text-emerald-500">{students.filter(s => s.status === RegistrationStatus.COMPLETED).length}</h3>
          </div>
        </div>

        {/* Student List Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nama Calon Murid</th>
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
                    <div className="text-xs text-slate-400">{student.parentPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold">{student.level}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={student.status}
                      onChange={(e) => handleStatusChange(student.id, e.target.value as RegistrationStatus)}
                      className={`text-xs font-bold border-none bg-transparent focus:ring-0 cursor-pointer ${
                        student.status === RegistrationStatus.COMPLETED ? 'text-emerald-600' :
                        student.status === RegistrationStatus.REJECTED ? 'text-red-500' :
                        student.status === RegistrationStatus.VERIFIED ? 'text-blue-500' : 'text-amber-500'
                      }`}
                    >
                      {Object.values(RegistrationStatus).map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-600">{student.documents.length} Dokumen</span>
                      <button 
                        onClick={() => { setSelectedStudent(student); setIsUploadModalOpen(true); }}
                        className="text-emerald-600 hover:text-emerald-700 p-1"
                        title="Bantu Unggah Berkas"
                      >
                        <i className="fas fa-cloud-upload-alt"></i>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fas fa-eye"></i></button>
                      <button className="text-slate-400 hover:text-emerald-600 transition-colors"><i className="fab fa-whatsapp"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Helper Upload Modal for Admin */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Bantu Unggah Berkas</h3>
            <p className="text-sm text-slate-500 mb-6">Pilih jenis berkas untuk <span className="font-bold">{selectedStudent?.fullName}</span></p>
            
            <div className="space-y-2 mb-6">
              {REQUIRED_DOCUMENTS.map(doc => (
                <button 
                  key={doc}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-sm font-medium border border-slate-100 flex justify-between items-center transition-colors"
                >
                  {doc}
                  <i className="fas fa-chevron-right text-slate-300"></i>
                </button>
              ))}
            </div>
            
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />
            
            <button 
              onClick={() => setIsUploadModalOpen(false)}
              className="w-full py-2 text-slate-400 text-sm hover:text-slate-600"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
