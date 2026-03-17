import bcrypt from 'bcrypt';
import { generateToken } from "../../core/utils/jwt.utils";
import { getPrismaClient } from '../../core/config/prisma';
import type {
  LoginServiceResponse,
  RegisterRequestBody,
  RegisterServiceResponse
} from '../../types';

export const kullaniciKayit = async (data: RegisterRequestBody): Promise<RegisterServiceResponse> => {
  const prisma = getPrismaClient();

  // mail veya tc_no daha önce kayıtlı mı kontrol et
  const existingUser = await prisma.kullanici.findFirst({
    where: {
      OR: [{ mail: data.email }, { tc_no: data.tc_no }]
    }
  });

  if (existingUser) {
    throw new Error('Bu email veya TC Kimlik numarası zaten sistemde kayıtlı.');
  }

  // şifreyi hashle ve 10 turda üret
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  // 3. Kullanıcıyı veritabanına kaydet
  const newUser = await prisma.kullanici.create({
    data: {
      mail: data.email,
      sifre: hashedPassword,
      isim: data.isim,
      soy_isim: data.soy_isim,
      tel_no: data.tel_no,
      tc_no: data.tc_no,
      dogum_tarihi: new Date(data.dogum_tarihi), 
      egitim_durumu: data.egitim_durumu,
      odeme_planı: data.odeme_planı,
      odeme_durumu: data.odeme_durumu,
      maas: data.maas,

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

  // token üret
  const tokenPayload = { id: user.id, email: user.mail, role };
  const token = generateToken(tokenPayload);

  // 4. Şifreyi gizleyerek kullanıcı ve token bilgilerini döndür
  const { sifre: _sifre, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    role,
    token
  };
};