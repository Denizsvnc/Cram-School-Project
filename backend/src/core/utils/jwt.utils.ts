import jwt, { SignOptions } from "jsonwebtoken";
import type { TokenPayload } from "../../types";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_EXPIRES_IN: string = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN: string = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

// 1. Access token kısa omurlu
export const generateAccessToken = (payload: TokenPayload): string => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    if (!secretKey) {
        throw new Error("ACCESS_TOKEN_SECRET tanımlı değil.");
    }

    try {
        // NonNullable kullanarak undefined ihtimalini tipten çıkartıyoruz
        return jwt.sign(payload, secretKey, { 
            expiresIn: ACCESS_TOKEN_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>
        });
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
        // Burada da aynı şekilde NonNullable kullanıyoruz
        return jwt.sign(payload, secretKey, { 
            expiresIn: REFRESH_TOKEN_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>
        });
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