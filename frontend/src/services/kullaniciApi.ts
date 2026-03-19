import api from './api';

export const KullaniciService = {
    getOgrenciler: async (rol?: string)=>{
        const response = await api.get('/kullanici/ogrenciler', {
            params:{rol}
        });
        return response.data;
    },
    getOgrenciById: async (ogrenciNo:number)=>{
        const response = await api.get(`/kullanici/ogrenci/${ogrenciNo}`);
        return response.data;
    },
    getPersoneller: async (rol?: string)=>{
        const response = await api.get('/kullanici/personeller', {
            params:{rol}
        });
        return response.data;
    },
    getPersonelById: async (personelNo:number)=>{
        const response = await api.get(`/kullanici/personel/${personelNo}`, {
            params:{personelNo}
        });
        return response.data;
    },
    getMudurler : async()=>{
        const response = await api.get("/kullanici/personel/mudurler", {
            params:{rol:"MUDUR"}
        });
        return response.data;
    },
    getOgretmenler : async()=>{
        const response = await api.get("/kullanici/personel/ogretmenler", {
            params:{rol:"OGRETMEN"}
        });
        return response.data;
    },
    getPersonelListesi : async()=>{
        const response = await api.get("/kullanici/personel/personeller", {
            params:{rol:"PERSONEL"}
        });
        return response.data;
    }

}