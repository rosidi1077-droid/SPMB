
import React, { useState } from 'react';
import { SchoolLevel } from '../types.ts';
import { SCHOOL_LEVELS, ADMIN_PHONE } from '../constants.tsx';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLevel?: SchoolLevel;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, initialLevel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    nickName: '',
    level: initialLevel || SchoolLevel.SD,
    parentPhone: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Halo Admin SPMB Yayasan Dhia El Widad, saya ingin mendaftarkan calon murid baru:
    
*Nama Lengkap:* ${formData.fullName}
*Nama Panggilan:* ${formData.nickName}
*Jenjang:* ${formData.level}
*No HP Orang Tua:* ${formData.parentPhone}

Mohon petunjuk untuk langkah selanjutnya. Terima kasih.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodedMessage}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-emerald-700 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Daftar Cepat</h2>
          <p className="text-emerald-100 text-sm">Lanjutkan pendaftaran di WhatsApp</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            type="text"
            required
            className="w-full px-4 py-2 rounded-lg border"
            placeholder="Nama Lengkap Anak"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border"
              placeholder="Panggilan"
              value={formData.nickName}
              onChange={(e) => setFormData({...formData, nickName: e.target.value})}
            />
            <select
              className="w-full px-4 py-2 rounded-lg border"
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value as SchoolLevel})}
            >
              {SCHOOL_LEVELS.map(level => <option key={level.id} value={level.id}>{level.name}</option>)}
            </select>
          </div>
          <input
            type="tel"
            required
            className="w-full px-4 py-2 rounded-lg border"
            placeholder="No WhatsApp Orang Tua"
            value={formData.parentPhone}
            onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
          />
          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2">
            <i className="fab fa-whatsapp"></i> <span>Kirim ke WhatsApp</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
