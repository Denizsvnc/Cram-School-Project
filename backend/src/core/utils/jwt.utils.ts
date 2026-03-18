import jwt from "jsonwebtoken";
import type { TokenPayload } from "../../types";

export const generateToken = (payload: TokenPayload) : string => {
    const secretKey = process.env.JWT_SECRET_KEY;

    if(!secretKey) {
        throw new Error("JWT_SECRET_KEY tanımlı değil.");
    }
    else {
        try {
            return jwt.sign(payload, secretKey, {expiresIn: "1h"});
        } catch (error) {
            console.error("Token oluşturma hatası:", error);
            throw new Error("Token oluşturulurken bir hata oluştu.");
        }
    }
}