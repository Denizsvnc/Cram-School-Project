import type { NextFunction, Request, Response } from "express";
import type { TokenPayload } from "../../types";
import { verifyToken } from '../utils/jwt.utils';

export interface AuthRequest extends Request {
    kullanici?: TokenPayload;
}

const isTokenPayload = (value: unknown): value is TokenPayload => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Partial<TokenPayload>;
  return (
    typeof payload.id === "string" &&
    typeof payload.email === "string" &&
    typeof payload.role === "string"
  );
};

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ hata: 'Yetkisiz erişim. Lütfen giriş yapın.' });
    return;
  }

  // tokenı ayir ve al
  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ hata: 'Token bulunamadı.' });
    return;
  }

  try {
    // Access tokenı doğrula (cookie kullanılmaz)
    const decoded = verifyToken(token, false);
    if (!isTokenPayload(decoded)) {
      res.status(401).json({ hata: 'Gecersiz token icerigi.' });
      return;
    }

    // veriyi req objesine ekle
    req.kullanici = decoded;
    
    // controllera gec
    next();
  } catch (error) {
    res.status(401).json({ hata: 'Geçersiz veya süresi dolmuş token.' });
    return;
  }
};