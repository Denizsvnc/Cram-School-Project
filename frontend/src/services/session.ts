import { jwtDecode } from 'jwt-decode';
import type { UserRole } from "./authApi";

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const tokenGetir = (): string | null => sessionStorage.getItem('token');

export const tokenKaydet = (token: string): void => {
    sessionStorage.setItem('token', token);
};

export const tokenTemizle = (): void => {
    sessionStorage.removeItem('token');
};

export const oturumTemizle = (): void => {
    tokenTemizle();
};

export const kullaniciRolunuGetir = (): UserRole | null => {
    const token = tokenGetir();
    if (!token) return null;
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        return decoded.role;
    } catch {
        return null;
    }
};

export const getCurrentUser = (): TokenPayload | null => {
    const token = tokenGetir();
    if (!token) return null;
    try {
        return jwtDecode<TokenPayload>(token);
    } catch {
        return null;
    }
};