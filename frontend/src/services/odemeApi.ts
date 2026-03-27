import api from './api';

export interface Odeme {
    id: string;
    kullaniciId: string;
    miktar: number;
    tarih: string;
    sonOdemeTarihi: string | null;
    durum: 'BEKLIYOR' | 'ODENDI' | 'ONAYLANDI' | 'IPTAL';
    aciklama: string | null;
    kullanici?: any; // e.g. details of the user when populated
}

export const OdemeApi = {
    getKullaniciOdemeler: async (kullaniciId: string): Promise<Odeme[]> => {
        const response = await api.get(`/odeme/kullanici/${kullaniciId}`);
        return response.data;
    },

    getBekleyenOdemeler: async (): Promise<Odeme[]> => {
        const response = await api.get('/odeme/bekleyenler');
        return response.data;
    },

    odemeYap: async (odemeId: string): Promise<Odeme> => {
        const response = await api.post(`/odeme/yap/${odemeId}`);
        return response.data;
    },

    odemeOnayla: async (odemeId: string): Promise<{ success: boolean; message: string; odeme: Odeme }> => {
        const response = await api.put(`/odeme/onayla/${odemeId}`);
        return response.data;
    }
};
