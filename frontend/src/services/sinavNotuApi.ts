import api from './api';

export const tumSinavNotlariniGetir = async () => {
    const response = await api.get('/sinav-notu/');
    return response.data;
};

export const sinavNotuOlustur = async (sinavNotuData: { ogrenciId: number; dersId: number; not: number; }) => {
    const response = await api.post('/sinav-notu/olustur', sinavNotuData);
    return response.data;
};

export const sinavNotuGetir = async (sinavNotuId: number) => {
    const response = await api.get(`/sinav-notu/${sinavNotuId}`);
    return response.data;
};

export const sinavNotuGuncelle = async (sinavNotuId: number, guncelVeriler: Partial<{ ogrenciId: number; dersId: number; not: number; }>) => {
    const response = await api.put(`/sinav-notu/${sinavNotuId}`, guncelVeriler);
    return response.data;
};

export const sinavNotuSil = async (sinavNotuId: number) => {
    await api.delete(`/sinav-notu/${sinavNotuId}`);
};

export const ogrenciyeAitNotlariGetir = async (ogrenciId: number) => {
    const response = await api.get(`/sinav-notu/ogrenci/${ogrenciId}`);
    return response.data;
};

export const derseAitNotlariGetir = async (dersId: number) => {
    const response = await api.get(`/sinav-notu/ders/${dersId}`);
    return response.data;
};