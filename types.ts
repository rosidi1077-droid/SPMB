
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
