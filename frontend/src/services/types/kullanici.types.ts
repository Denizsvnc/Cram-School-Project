export const Roller = {
    YONETICI: "YONETICI",
    MUDUR: "MUDUR",
    OGRETMEN: "OGRETMEN",
    PERSONEL: "PERSONEL",
    OGRENCI: "OGRENCI",
    VELI: "VELI",
    ESKI_OGRENCI: "ESKI_OGRENCI",
    ESKI_PERSONEL: "ESKI_PERSONEL",
    ESKI_VELI: "ESKI_VELI"
} as const;

export type Roller = typeof Roller[keyof typeof Roller];

export interface SinifDetay {
    id: string;
    isim: string;
    kapasite: number;
}

export interface DersDetay {
    id: string;
    isim: string;
}

export interface NotDetay {
    id: string;
    sinavAdi: string;
    puan: number;
    tarih: string;
    ders: DersDetay;
}

// kullanıcı Tipi
export interface Kullanici {
    id: string;
    isim: string;
    soy_isim: string;
    mail: string;
    tel_no?: string;
    tc_no?: string;
    dogum_tarihi?: string;
    egitim_durumu?: string;
    odeme_plani?: string;
    odeme_durumu?: boolean;
    maas?: string;
    
    ogrenciNo?: number;
    personelNo?: number;
    
    rol: Roller;
    aktifMi: boolean;
    createdAt: string;


    sinifId?: string;
    sinif?: SinifDetay;
    veli_ID?: string;
    ogrenci_ids?: string[];
    veli?: Partial<Kullanici>; // Velinin  bilgileri
    notlar?: NotDetay[];
}


export type OgrenciGuncelleInput = Partial<Omit<Kullanici, 'id' | 'ogrenciNo' | 'rol' | 'createdAt'>>;
export type PersonelGuncelleInput = Partial<Omit<Kullanici, 'id' | 'personelNo' | 'rol' | 'createdAt'>>;