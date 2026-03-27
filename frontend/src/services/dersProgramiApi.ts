import api from './api';

export const DersProgramiApi = {
    programEkle: async (data: { sinifId: string; dersId: string; ogretmenId: string; gun: number; baslangic: string; bitis: string }) => {
        const response = await api.post('/ders-programi', data);
        return response.data;
    },

    getOgretmenProgrami: async (ogretmenId: string) => {
        const response = await api.get(`/ders-programi/ogretmen/${ogretmenId}`);
        return response.data;
    },

    getSinifProgrami: async (sinifId: string) => {
        const response = await api.get(`/ders-programi/sinif/${sinifId}`);
        return response.data;
    },

    programSil: async (id: string) => {
        const response = await api.delete(`/ders-programi/${id}`);
        return response.data;
    }
};
