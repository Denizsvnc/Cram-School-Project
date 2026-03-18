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

export const kullaniciKayit = async (data: RegisterRequestBody): Promise<RegisterServiceResponse> => {
  const prisma = getPrismaClient();
  const maasZorunluRoller = new Set(['OGRETMEN', 'MUDUR', 'PERSONEL']);

  // mail veya tc_no daha önce kayıtlı mı kontrol et
  const existingUser = await prisma.kullanici.findFirst({
    where: {
      OR: [{ mail: data.email }, { tc_no: data.tc_no }]
    }
  });

  if (existingUser) {
    throw new Error('Bu email veya TC Kimlik numarası zaten sistemde kayıtlı.');
  }

  if (maasZorunluRoller.has(data.rol) && !data.maas?.trim()) {
    throw new Error('Bu rol için maas alanı zorunludur.');
  }

  if (data.rol === 'OGRENCI') {
    if (!data.odeme_planı?.trim() || typeof data.odeme_durumu !== 'boolean') {
      throw new Error('Ogrenci kaydi icin odeme_plani ve odeme_durumu alanlari zorunludur.');
    }
  }


  const odemePlani = data.rol === 'OGRENCI' ? data.odeme_planı!.trim() : '';
  const odemeDurumu = data.rol === 'OGRENCI' ? data.odeme_durumu! : false;
  const maas = maasZorunluRoller.has(data.rol) ? data.maas!.trim() : '';

  // şifreyi hashle ve 10 turda üret
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  // 3. Kullanıcıyı veritabanına kaydet
  const newUser = await prisma.kullanici.create({
    data: {
      mail: data.email,
      sifre: hashedPassword,
      rol: data.rol,
      isim: data.isim,
      soy_isim: data.soy_isim,
      tel_no: data.tel_no,
      tc_no: data.tc_no,
      dogum_tarihi: new Date(data.dogum_tarihi), 
      egitim_durumu: data.egitim_durumu,
      odeme_planı: odemePlani,
      odeme_durumu: odemeDurumu,
      maas,

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