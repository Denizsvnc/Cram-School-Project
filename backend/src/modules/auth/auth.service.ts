import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
} from '../../core/utils/jwt.utils';
import { getPrismaClient } from '../../core/config/prisma';
import type {
  LoginServiceResponse,
  RefreshServiceResponse,
  RegisterRequestBody,
  RegisterServiceResponse
} from '../../types';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const yeniOgrenciNoUret = async (): Promise<number> => {
    const prisma = getPrismaClient();
    const result = await prisma.kullanici.aggregate({
        _max: { ogrenciNo: true }
    });
    return (result._max.ogrenciNo || 0) + 1;
};
const yeniPersonelNoUret = async (): Promise<number> => {
    const prisma = getPrismaClient();
    const result = await prisma.kullanici.aggregate({
        _max: { personelNo: true }
    });
    return (result._max.personelNo || 0) + 1;
};
export const kullaniciKayit = async (data: RegisterRequestBody): Promise<RegisterServiceResponse> => {
  const prisma = getPrismaClient();
  const maasZorunluRoller = new Set(['OGRETMEN', 'MUDUR', 'PERSONEL']);
  const ogrenciNoZorunluRoller = new Set(['OGRENCI']);
  const personelNoZorunluRoller = new Set(['MUDUR', 'OGRETMEN', 'PERSONEL']);

 
  // TC No ve Telefon numaralarını temizle (boşlukları sil)
  data.tc_no = data.tc_no?.replace(/\s/g, '').trim();
  data.tel_no = data.tel_no?.replace(/\s/g, '').trim();

  // mail veya tc_no daha önce kayıtlı mı kontrol et
  const existingUser = await prisma.kullanici.findFirst({
    where: {
      OR: [{ mail: data.email }, { tc_no: data.tc_no }]
    }
  });

  if (existingUser) {
    console.warn("Kullanıcı zaten mevcut (Email veya TC):", { mail: data.email, tc: data.tc_no });
    throw new Error('Bu email veya TC Kimlik numarası zaten sistemde kayıtlı.');
  }
  const isOgrenci = data.rol === 'OGRENCI';
  const isPersonel = personelNoZorunluRoller.has(data.rol);
  if (maasZorunluRoller.has(data.rol) && !data.maas?.trim()) {
    throw new Error('Bu rol için maas alanı zorunludur.');
  }

  if (data.rol === 'OGRENCI') {
    if (!data.odeme_plani?.trim() || typeof data.odeme_durumu !== 'boolean') {
      throw new Error('Ogrenci kaydi icin odeme_plani ve odeme_durumu alanlari zorunludur.');
    }
    
  }


  const odemePlani = data.rol === 'OGRENCI' ? data.odeme_plani!.trim() : '';
  const odemeDurumu = data.rol === 'OGRENCI' ? data.odeme_durumu! : false;
  const maas = maasZorunluRoller.has(data.rol) ? data.maas!.trim() : '';

  // şifreyi hashle ve 10 turda üret
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  const uretilenNo = isOgrenci ? await yeniOgrenciNoUret() : null
  const uretilenPersonelNo = isPersonel ? await yeniPersonelNoUret() : null

  //  Kullanıcıyı veritabanına kaydet
  const newUser = await prisma.kullanici.create({
    data: {
      mail: data.email,
      sifre: hashedPassword,
      rol: data.rol,
      isim: data.isim,
      soy_isim: data.soy_isim,
      tel_no: data.tel_no,
      tc_no: data.tc_no,
      dogum_tarihi: data.dogum_tarihi ? new Date(data.dogum_tarihi) : new Date(), 
      egitim_durumu: data.egitim_durumu,
      odeme_plani: odemePlani,
      odeme_durumu: odemeDurumu,
      odeme_tutari: data.rol === 'OGRENCI' && data.odeme_tutari ? data.odeme_tutari : null,
      taksit_sayisi: data.rol === 'OGRENCI' && data.taksit_sayisi ? data.taksit_sayisi : null,
      maas,
      maas_odendi_mi: maasZorunluRoller.has(data.rol) ? (data.maas_odendi_mi ?? false) : null,
      izin_hakki: maasZorunluRoller.has(data.rol) ? (data.izin_hakki ?? 14) : null,
      kullanilan_izin: maasZorunluRoller.has(data.rol) ? (data.kullanilan_izin ?? 0) : null,
      ogrenciNo: uretilenNo,
      personelNo: uretilenPersonelNo,
      ...(data.rol === 'OGRENCI' && data.veli_ID ? { veli_ID: data.veli_ID } : {}),
      ...(data.rol === 'VELI' && data.ogrenci_ids ? {
        ogrenciler: {
          connect: data.ogrenci_ids.map(id => ({ id }))
        }
      } : {})
    }
  });

  // şifreyi backend de tutarak döndür
  const { sifre, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const kullaniciGiris = async (mail: string, sifre: string): Promise<LoginServiceResponse> => {
  const prisma = getPrismaClient();

  // Kullanıcıyı mail ile bul
  const user = await prisma.kullanici.findUnique({
    where: { mail }
  });
  
  if (!user) {
    throw new Error('Geçersiz email veya şifre.');
  }

  // şifreyi doğrula
  const isMatch = await bcrypt.compare(sifre, user.sifre);
  
  if (!isMatch) {
    throw new Error('Geçersiz email veya şifre.');
  }

  const role = user.rol;

  // Access ve Refresh token üret
  const tokenPayload = { id: user.id, email: user.mail, role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  await prisma.session.create({
    data: {
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      userId: user.id
    }
  });

  // Şifreyi gizleyerek kullanıcı ve token bilgilerini döndür
  const { sifre: _sifre, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    role,
    accessToken,
    refreshToken,
  };
};

export const tokenYenile = async (refreshToken: string): Promise<RefreshServiceResponse> => {
  const prisma = getPrismaClient();

  const payload = verifyToken(refreshToken, true);

  const activeSession = await prisma.session.findUnique({
    where: { refreshToken },
    include: {
      user: true
    }
  });

  if (!activeSession || activeSession.expiresAt <= new Date()) {
    throw new Error('Refresh token gecersiz veya suresi dolmus.');
  }

  const nextAccessToken = generateAccessToken({
    id: payload.id,
    email: payload.email,
    role: payload.role
  });

  return { accessToken: nextAccessToken };
};

export const cikisYap = async (refreshToken: string): Promise<void> => {
  const prisma = getPrismaClient();

  await prisma.session.deleteMany({
    where: { refreshToken }
  });
};