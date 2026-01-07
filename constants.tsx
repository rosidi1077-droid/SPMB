
import { SchoolLevel } from './types.ts';

// Default values (Digunakan jika storage kosong)
export const DEFAULT_ADMIN_PHONE = '6281234567890'; 
export const YAYASAN_NAME = 'YAYASAN PENDIDIKAN DHIA EL WIDAD';

export const SCHOOL_LEVELS = [
  { id: SchoolLevel.TPA, name: 'TPA', description: 'Taman Penitipan Anak' },
  { id: SchoolLevel.TK, name: 'TK/PAUD', description: 'Taman Kanak-kanak / PAUD' },
  { id: SchoolLevel.SD, name: 'SD', description: 'Sekolah Dasar' },
  { id: SchoolLevel.SMP, name: 'SMP', description: 'Sekolah Menengah Pertama' },
  { id: SchoolLevel.SMA, name: 'SMA', description: 'Sekolah Menengah Atas' },
];

export const REQUIRED_DOCUMENTS = [
  'Kartu Keluarga (KK)',
  'Akte Kelahiran',
  'Ijazah Terakhir (Jika Ada)',
  'Foto Ukuran 3x4'
];

// Helper untuk mengambil config yang tersimpan atau default
export const getAdminPhone = () => {
  const saved = localStorage.getItem('spmb_settings');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed.adminWhatsApp || DEFAULT_ADMIN_PHONE;
    } catch (e) {
      return DEFAULT_ADMIN_PHONE;
    }
  }
  return DEFAULT_ADMIN_PHONE;
};
