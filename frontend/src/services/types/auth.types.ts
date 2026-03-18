export type LoginPayload = {
  email: string;
  password: string;
  rol: string;
};

export type RegisterPayload = {
    email: string;
    password: string;
    isim: string;
    soy_isim: string;
    tel_no: string;
    tc_no: string;
    dogum_tarihi: string;
    egitim_durumu: string;
};

export interface LoginResponse {
  kullanici: {
    id: string;
    mail: string;
    isim: string;
    soy_isim: string;
    tel_no: string;
    tc_no: string;
    dogum_tarihi: string;
    egitim_durumu: string;
    odeme_planı: string;
    odeme_durumu: boolean;
    maas: string;
    rol: string;
  };
  role: string;
  token: string;
}

export interface RegisterResponse {
  id: string;
  mail: string;
  isim: string;
  soy_isim: string;
  tel_no: string;
  tc_no: string;
  dogum_tarihi: string;
  egitim_durumu: string;
  odeme_planı: string;
  odeme_durumu: boolean;
  maas: string;
  rol: string;
};