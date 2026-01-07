
import { SchoolLevel } from './types';

export const ADMIN_PHONE = '6281234567890'; // Replace with actual admin WhatsApp number
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
