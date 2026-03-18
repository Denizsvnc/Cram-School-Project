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
  odeme_planı?: string;
  odeme_durumu?: boolean;
  maas?: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterServiceResponse extends SafeKullanici {}

export interface LoginServiceResponse {
  user: SafeKullanici;
  role: UserRole;
  token: string;
}

export interface ApiErrorResponse {
  hata: string;
}
