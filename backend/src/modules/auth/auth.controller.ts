import { Request, Response } from 'express';
import * as authService from './auth.service';
import type {
  ApiErrorResponse,
  LoginRequestBody,
  RegisterRequestBody
} from '../../types';

export const kayit = async (
  req: Request<unknown, unknown, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  try {
    // req.body içindeki verileri servise yolluyoruz
    const newUser = await authService.kullaniciKayit(req.body);
    
    // 201 Created durum kodu ile başarılı yanıt dönüyoruz
    res.status(201).json({
      mesaj: 'Kayıt işlemi başarılı.',
      kullanici: newUser
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.';
    // Servisten dönen hata yı 400 olarak dön
    res.status(400).json({ hata: message } satisfies ApiErrorResponse);
  }
};

export const giris = async (
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ hata: 'Email ve şifre alanları zorunludur.' });
      return;
    }

    const result = await authService.kullaniciGiris(email, password);
    
    // http 200 dönüyoruz ve token'ı gönder
    res.status(200).json({
      mesaj: 'Giriş başarılı.',
      kullanici: result.user,
      role: result.role,
      token: result.token
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.';
    // http 401 dön yetkisiz erişim 
    res.status(401).json({ hata: message } satisfies ApiErrorResponse);
  }
};