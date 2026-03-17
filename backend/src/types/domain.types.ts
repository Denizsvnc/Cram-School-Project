import type {
  Kullanici,
  Sinif,
  Ders,
  DersProgrami,
  SinavNotu,
  Yoklama
} from '../../generated/prisma/client';
import type { Roller } from '../../generated/prisma/enums';

export type UserRole = Roller;

export type KullaniciEntity = Kullanici;
export type SinifEntity = Sinif;
export type DersEntity = Ders;
export type DersProgramiEntity = DersProgrami;
export type SinavNotuEntity = SinavNotu;
export type YoklamaEntity = Yoklama;

export type SafeKullanici = Omit<KullaniciEntity, 'sifre'>;
