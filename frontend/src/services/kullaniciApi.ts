import api from './api';
import type { Kullanici } from './types/kullanici.types';
export const KullaniciService = {
    getOgrenciler: async (rol?: string) => {
        const response = await api.get('/kullanici/ogrenciler', { params: { rol } });
        return response.data;
    },
    getOgrenciById: async (ogrenciNo: number) => {
        const response = await api.get(`/kullanici/ogrenci/${ogrenciNo}`);
        return response.data;
    },
    ogrenciSil: async (ogrenciNo: number) => {
        const response = await api.delete(`/kullanici/ogrenci/${ogrenciNo}`);
        return response.data;
    },
    ogrenciGuncelle: async (ogrenciNo: number, guncelVeriler: Partial<Omit<Kullanici, 'id' | 'ogrenciNo' | 'rol' | 'createdAt'>>) => {
        const response = await api.patch(`/kullanici/ogrenci/${ogrenciNo}`, guncelVeriler);
        return response.data;
    },
    getPersoneller: async (rol?: string) => {
        const response = await api.get('/kullanici/personeller', { params: { rol } });
        return response.data;
    },

    getPersonelById: async (personelNo: number) => {
        // Gereksiz 'params' temizlendi, sadece URL içindeki path param yeterli
        const response = await api.get(`/kullanici/personel/${personelNo}`);
        return response.data;
    },
    personelSil: async (personelNo: number) => {
        const response = await api.delete(`/kullanici/personel/${personelNo}`);
        return response.data;
    },
    personelGuncelle: async (personelNo: number, guncelVeriler: Partial<Omit<Kullanici, 'id' | 'personelNo' | 'rol' | 'createdAt'>>) => {
        const response = await api.patch(`/kullanici/personel/${personelNo}`, guncelVeriler);
        return response.data;
    },
    getMudurler: async () => {
        const response = await api.get("/kullanici/personel/mudurler");
        return response.data;
    },
    getOgretmenler: async () => {
        const response = await api.get("/kullanici/personel/ogretmenler");
        return response.data;
    },

    getPersonelListesi: async () => {
        const response = await api.get("/kullanici/personel/personeller");
        return response.data;
    }
};