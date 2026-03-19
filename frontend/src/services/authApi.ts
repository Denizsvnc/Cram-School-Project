import axios from 'axios';
import api from './api';
import { oturumTemizle, tokenKaydet } from './session';

export type UserRole = 'YONETICI' | 'MUDUR' | 'OGRETMEN' | 'OGRENCI' | 'VELI' | 'PERSONEL';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
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
  maas?: string;
};

export type LoginResponse = {
  mesaj: string;
  kullanici: Record<string, unknown>;
  role: UserRole;
  accessToken: string;
  pp_url?: string;
};

export type RefreshResponse = {
  accessToken: string;
};

type ApiErrorBody = {
  hata?: string;
  message?: string;
};

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.hata ?? error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const girisYap = async (payload: LoginPayload) => {
  try {
    const { data } = await api.post<LoginResponse>('/auth/giris', payload);
    tokenKaydet(data.accessToken);
    return data;
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, 'Giris basarisiz.'));
  }
};

export const accessTokenYenile = async (): Promise<string> => {
  try {
    const { data } = await api.post<RefreshResponse>('/auth/refresh');
    tokenKaydet(data.accessToken);
    return data.accessToken;
  } catch (error: unknown) {
    oturumTemizle();
    throw new Error(getApiErrorMessage(error, 'Oturum yenilenemedi.'));
  }
};

export const cikisYap = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } finally {
    oturumTemizle();
  }
};

export const kayitOl = async (payload: RegisterPayload) => {
  try {
    const { data } = await api.post('/auth/kayit', payload);
    return data;
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, 'Kayit basarisiz.'));
  }
};