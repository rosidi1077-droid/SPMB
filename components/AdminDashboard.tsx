
import React, { useState, useEffect, useRef } from 'react';
import { Student, SchoolLevel, RegistrationStatus } from '../types.ts';
import { REQUIRED_DOCUMENTS } from '../constants.tsx';
import { summarizeRegistrations } from '../services/geminiService.ts';

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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Panel Administrasi</h2>
        <p className="text-slate-500">Kelola pendaftar dan bantu upload berkas</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8 flex items-start space-x-4">
        <div className="bg-emerald-600 p-3 rounded-xl text-white"><i className="fas fa-robot"></i></div>
        <div className="flex-1">
          <h4 className="font-bold text-emerald-900">AI Assistant</h4>
          <p className="text-emerald-800 text-sm">{aiSummary}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nama</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Jenjang</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Dokumen</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4">
                  <div className="font-bold">{student.fullName}</div>
                  <div className="text-xs text-slate-400">{student.parentPhone}</div>
                </td>
                <td className="px-6 py-4"><span className="text-xs font-semibold">{student.level}</span></td>
                <td className="px-6 py-4">
                  <select 
                    value={student.status}
                    onChange={(e) => handleStatusChange(student.id, e.target.value as RegistrationStatus)}
                    className="text-xs border-none bg-transparent"
                  >
                    {Object.values(RegistrationStatus).map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{student.documents.length} File</span>
                    <button onClick={() => { setSelectedStudent(student); setIsUploadModalOpen(true); }} className="text-emerald-600"><i className="fas fa-upload"></i></button>
                  </div>
                </td>
                <td className="px-6 py-4"><i className="fab fa-whatsapp text-emerald-500 cursor-pointer"></i></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Upload Berkas Orang Tua</h3>
            <div className="space-y-2 mb-6">
              {REQUIRED_DOCUMENTS.map(doc => (
                <button key={doc} onClick={() => fileInputRef.current?.click()} className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 text-sm font-medium border border-slate-100 flex justify-between items-center">
                  {doc} <i className="fas fa-plus text-slate-300"></i>
                </button>
              ))}
            </div>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <button onClick={() => setIsUploadModalOpen(false)} className="w-full py-2 text-slate-400 text-sm">Batal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
