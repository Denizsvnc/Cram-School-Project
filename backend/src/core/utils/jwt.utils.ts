import jwt from "jsonwebtoken";
import type { TokenPayload } from "../../types";

// 1. Access Token: Kısa ömürlü (Örn: 15 dakika)
export const generateAccessToken = (payload: TokenPayload): string => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    if (!secretKey) {
        throw new Error("ACCESS_TOKEN_SECRET tanımlı değil.");
    }

    try {
        // expiresIn: "15m" (15 dakika) olarak ayarlandı
        return jwt.sign(payload, secretKey, { expiresIn: "15m" });
    } catch (error) {
        console.error("Access Token oluşturma hatası:", error);
        throw new Error("Access Token oluşturulurken bir hata oluştu.");
    }
};

// 2. Refresh Token: Uzun ömürlü (Örn: 7 gün)
export const generateRefreshToken = (payload: TokenPayload): string => {
    const secretKey = process.env.REFRESH_TOKEN_SECRET;

    if (!secretKey) {
        throw new Error("REFRESH_TOKEN_SECRET tanımlı değil.");
    }

    try {
        // expiresIn: "7d" (7 gün) olarak ayarlandı
        return jwt.sign(payload, secretKey, { expiresIn: "7d" });
    } catch (error) {
        console.error("Refresh Token oluşturma hatası:", error);
        throw new Error("Refresh Token oluşturulurken bir hata oluştu.");
    }
};

// 3. Token Doğrulama
export const verifyToken = (token: string, isRefresh: boolean = false): TokenPayload => {
    const secretKey = isRefresh ? process.env.REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET;

    if (!secretKey) {
        throw new Error("Gerekli SECRET_KEY tanımlı değil.");
    }

    try {
        return jwt.verify(token, secretKey) as TokenPayload;
    } catch (error) {
        throw new Error("Geçersiz veya süresi dolmuş token.");
    }
};