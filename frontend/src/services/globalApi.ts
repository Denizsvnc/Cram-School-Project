import api from './api';

// Sınıf API
export const getSiniflar = () => api.get('/sinif/liste');
export const createSinif = (data: any) => api.post('/sinif/', data);
export const deleteSinif = (isim: string) => api.delete(`/sinif/${isim}`);

// Ders Programı API
export const createDersProgrami = (data: any) => api.post('/ders-programi/olustur', data);
export const updateDersProgrami = (id: string, data: any) => api.put(`/ders-programi/${id}`, data);
export const deleteDersProgrami = (id: string) => api.delete(`/ders-programi/${id}`);

// Yoklama API
export const createYoklama = (data: any) => api.post('/yoklama/olustur', data);
export const updateYoklama = (id: string, data: any) => api.put(`/yoklama/${id}`, data);
export const deleteYoklama = (id: string) => api.delete(`/yoklama/${id}`);

// Genel Sağlık
export const getHealth = () => api.get('/saglik');
