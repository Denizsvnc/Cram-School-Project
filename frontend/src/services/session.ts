import type { UserRole } from "./authApi";

export const kullaniciRolunuGetir = (): UserRole | null => {
    const rol = localStorage.getItem('role');
    if(!rol) {
        return null;
        
    }
    return rol as UserRole;
}   

export const tokenGetir = (): string => String(localStorage.getItem('token'));