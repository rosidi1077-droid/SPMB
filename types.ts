
export enum SchoolLevel {
  TPA = 'TPA',
  TK = 'TK/PAUD',
  SD = 'SD',
  SMP = 'SMP',
  SMA = 'SMA'
}

export enum RegistrationStatus {
  PENDING = 'Menunggu',
  VERIFIED = 'Terverifikasi',
  REJECTED = 'Ditolak',
  COMPLETED = 'Diterima'
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  LEVEL_ADMIN = 'LEVEL_ADMIN'
}

export interface AdminUser {
  id: string;
  username: string;
  role: UserRole;
  assignedLevel?: SchoolLevel; // Null if Super Admin
}

export interface AppSettings {
  adminWhatsApp: string;
}

export interface Student {
  id: string;
  fullName: string;
  nickName: string;
  level: SchoolLevel;
  parentPhone: string;
  registrationDate: string;
  status: RegistrationStatus;
  documents: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

export interface WhatsAppMessage {
  fullName: string;
  nickName: string;
  level: string;
  parentPhone: string;
}
