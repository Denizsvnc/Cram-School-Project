import type { SafeKullanici, UserRole } from './domain.types';

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface RegisterRequestBody {
  email: string;
  password: string;
  rol: UserRole;
  isim: string;
  soy_isim: string;
  tel_no: string;
  tc_no: string;
  dogum_tarihi: string;
  egitim_durumu: string;
  odeme_plani?: string;
  odeme_durumu?: boolean;
  odeme_tutari?: number;
  taksit_sayisi?: number;
  maas?: string;
  maas_odendi_mi?: boolean;
  izin_hakki?: number;
  kullanilan_izin?: number;
  veli_ID?: string;
  ogrenci_ids?: string[];
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterServiceResponse extends SafeKullanici {}

export interface LoginServiceResponse {
  user: SafeKullanici;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshServiceResponse {
  accessToken: string;
}

export interface ApiErrorResponse {
  hata: string;
}
