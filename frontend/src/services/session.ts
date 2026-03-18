import type { UserRole } from "./authApi";

export const kullaniciRolunuGetir = (): UserRole | null => {
    const rol = sessionStorage.getItem('role');
    if(!rol) {
        return null;
        
    }
    return rol as UserRole;
}   

export const tokenGetir = (): string | null => sessionStorage.getItem('token');

export const tokenKaydet = (token: string): void => {
    sessionStorage.setItem('token', token);
};

export const tokenTemizle = (): void => {
    sessionStorage.removeItem('token');
};

export const rolKaydet = (rol: UserRole): void => {
    sessionStorage.setItem('role', rol);
};

export const rolTemizle = (): void => {
    sessionStorage.removeItem('role');
};

export const oturumTemizle = (): void => {
    tokenTemizle();
    rolTemizle();
};