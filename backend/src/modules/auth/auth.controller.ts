import { Request, Response } from 'express';
import * as authService from './auth.service';
import type {
  ApiErrorResponse,
  LoginRequestBody,
  RegisterRequestBody
} from '../../types';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const buildRefreshCookieOptions = () => ({
  httpOnly: true,
 
  secure: false, 
  sameSite: 'lax' as const,
  maxAge: REFRESH_COOKIE_MAX_AGE,
  path: '/' 
});

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

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, buildRefreshCookieOptions());
    
    // Sadece access token döner
    res.status(200).json({
      mesaj: 'Giriş başarılı.',
      kullanici: result.user,
      role: result.role,
      accessToken: result.accessToken,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.';
    // http 401 dön yetkisiz erişim 
    res.status(401).json({ hata: message } satisfies ApiErrorResponse);
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

    if (!refreshToken) {
      res.status(401).json({ hata: 'Refresh token bulunamadi.' } satisfies ApiErrorResponse);
      return;
    }

    const result = await authService.tokenYenile(refreshToken);
    res.status(200).json({ accessToken: result.accessToken });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.';
    res.status(401).json({ hata: message } satisfies ApiErrorResponse);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

    if (refreshToken) {
      await authService.cikisYap(refreshToken);
    }

    res.clearCookie(REFRESH_COOKIE_NAME, {
      ...buildRefreshCookieOptions(),
      maxAge: undefined
    });

    res.status(204).send();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.';
    res.status(500).json({ hata: message } satisfies ApiErrorResponse);
  }
};