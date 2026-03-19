import api from './api';

import type { SinifListeItem, SinifDetay } from './types/sinif.types';
import type { Kullanici } from './types/kullanici.types';

export const SinifApi = {
    sinifOlustur: async (data: { isim: string; kapasite: number }) => {
        const response = await api.post('/sinif', data);
        return response.data;
    },

    getSiniflar: async (): Promise<{ siniflar: SinifListeItem[], toplamSinif: number }> => {
        const response = await api.get('/sinif/liste');
        return response.data;
    },

    getSinifDetay: async (isim: string): Promise<{ sinif: SinifDetay }> => {
        const response = await api.get(`/sinif/detay/${encodeURIComponent(isim)}`);
        return response.data;
    },

    ogrenciEkle: async (data: { isim: string; ogrenciNo: number }) => {
        const response = await api.post('/sinif/ogrenci-ekle', data);
        return response.data;
    },

    ogrenciCikar: async (ogrenciNo: number) => {
        const response = await api.put('/sinif/ogrenci-cikar', { ogrenciNo });
        return response.data;
    },

    sinifSil: async (isim: string) => {
        const response = await api.delete(`/sinif/${encodeURIComponent(isim)}`);
        return response.data;
    },

    getPersonelSiniflari: async (personelNo: number) => {
        const response = await api.get(`/sinif/personel/${personelNo}`);
        return response.data;
    },

    getSinifOgrencileri: async (isim: string): Promise<Kullanici[]> => {
        const response = await api.get(`/sinif/ogrenciler/${encodeURIComponent(isim)}`);
        return response.data.result;
    }
};