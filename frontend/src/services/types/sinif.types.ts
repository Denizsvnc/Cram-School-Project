import type { Kullanici } from "./kullanici.types";

export interface Sinif {
    id: string;
    isim: string;
    kapasite: number;
    aktifMi: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SinifListeItem extends Pick<Sinif, 'id' | 'isim' | 'kapasite'> {
    _count: {
        ogrenciler: number;
    };
}

export interface SinifDetay extends Sinif {
    ogrenciler: Kullanici[];
}

export interface SinifOlusturInput {
    isim: string;
    kapasite: number;
}

export interface OgrenciAtaInput {
    isim: string;     
    ogrenciNo: number; 
}

export interface OgretmenSinifProgrami {
    gun: string;
    baslangic: string;
    bitis: string;
    dersIsmi: string;
    sinifIsmi: string;
}

export interface PersonelSiniflariResponse {
    personel: Partial<Kullanici>;
    siniflar: OgretmenSinifProgrami[];
}