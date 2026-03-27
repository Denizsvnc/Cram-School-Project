import api from './api';

export const YoklamaApi = {
    yoklamaGir: async (data: { ogrenciId: string; dersProgramiId: string; derseKatildiMi: boolean }) => {
        const response = await api.post('/yoklama', data);
        return response.data;
    },

    getYoklamalarByOgrenci: async (ogrenciId: string) => {
        const response = await api.get(`/yoklama/ogrenci/${ogrenciId}`);
        return response.data;
    },

    getYoklamalarByDersProgrami: async (dersProgramiId: string) => {
        const response = await api.get(`/yoklama/ders-programi/${dersProgramiId}`);
        return response.data;
    }
};
