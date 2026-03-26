import api from './api';

export const DersService = {
    tumDersleriGetir: async () => {
        const response = await api.get('/ders/tum-dersler');
        return response.data;
    },
    dersOlustur: async (dersData: { ad: string; }) => {
        const response = await api.post('/ders/olustur', dersData);
        return response.data;
    },
    dersGetirIsimle: async (dersIsmi: string) => {
        const response = await api.get(`/ders/isim/${dersIsmi}`);
        return response.data;
    },
    dersGuncelle: async (dersId: number, guncelVeriler: Partial<{ ad: string }>) => {
        const response = await api.put(`/ders/${dersId}`, guncelVeriler);
        return response.data;
    },
    dersSil: async (dersId: number) => {
        await api.delete(`/ders/${dersId}`);
    },
    kendiDerslerim: async () => {
        const response = await api.get('/ders/kendi-derslerim');
        return response.data;
    }
}