import { getPrismaClient } from '../../core/config/prisma';

import { NotFoundError, UnauthorizedError } from '../errors/customErrors';

const prisma = getPrismaClient();

export const sinifOlustur = async (isim: string, kapasite: number) => {
    const mevcut = await prisma.sinif.findUnique({ where: { isim } });
    if (mevcut) throw new Error(`${isim} isimli sınıf zaten mevcut.`);

    return await prisma.sinif.create({
        data: { isim, kapasite }
    });
};

export const sinifaOgrenciEkle = async (sinifIsmi: string, ogrenciNo: number) => {
    const sinif = await prisma.sinif.findUnique({
        where: { isim: sinifIsmi },
        select: { 
            id: true, 
            kapasite: true,
            _count: { select: { ogrenciler: true } } 
        }
    });

    if (!sinif) throw new NotFoundError(`${sinifIsmi} isimli sınıf bulunamadı.`);

    if (sinif._count.ogrenciler >= sinif.kapasite) {
        throw new Error("Sınıf kapasitesi dolu.");
    }

    return await prisma.kullanici.update({
        where: { ogrenciNo },
        data: { 
            sinifId: sinif.id
        }
    });
};

export const ogrenciyiSiniftanCikar = async (ogrenciNo: number) => {
    const ogrenci = await prisma.kullanici.findFirst({
        where: { ogrenciNo, rol: "OGRENCI", aktifMi: true }
    });

    if (!ogrenci) throw new NotFoundError("Aktif bir öğrenci bulunamadı.");

    return await prisma.kullanici.update({
        where: { ogrenciNo },
        data: { sinifId: null }
    });
}

export const siniflariGetir = async ()=>{
    const siniflar = await prisma.sinif.findMany({
        where: { aktifMi: true },
        select: {
            id: true,
            isim: true,
            kapasite: true,
            _count: {
                select: { ogrenciler: true }
            }
        }
    })
    if(siniflar.length === 0) {
        throw new NotFoundError("Aktif sınıf bulunamadı.");
    }
    return siniflar;
}

export const sinifDetayGetir = async (isim: string) => {
    const sinif = await prisma.sinif.findUnique({
        where: { isim: isim, aktifMi: true },
        select: {
            id: true,
            isim: true,
            kapasite: true,
            ogrenciler: {
                where: { aktifMi: true },
                select: {
                    id: true,
                    isim: true,
                    soy_isim: true,
                    ogrenciNo: true,
                    mail: true,
                    tel_no: true,
                    tc_no: true,
                    dogum_tarihi: true,
                    egitim_durumu: true,
                    odeme_plani: true,
                    odeme_durumu: true,
                    rol: true,
                    aktifMi: true,
                    createdAt: true,
                    veli: {
                        select: {
                            id: true,
                            isim: true,
                            soy_isim: true,
                            mail: true,
                            tel_no: true,
                        }
                    },
                    notlar: {
                        select: {
                            id: true,
                            sinavAdi: true,
                            puan: true,
                            tarih: true,
                            ders: {
                                select: { isim: true }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!sinif) {
        throw new NotFoundError("Sınıf bulunamadı.");
    }

    return sinif;
};

export const sinifSil = async (sinifId: string) => {
    const sinif = await prisma.sinif.findUnique({
        where: { id: sinifId }
    });

    if (!sinif) {
        throw new NotFoundError("Sınıf bulunamadı.");
    }

    await prisma.sinif.update({
        where: { id: sinifId },
        data: { aktifMi: false }
    });
        return { message: "Sınıf başarıyla silindi." };
};

export const personelSiniflariGetir = async (personelNo: number) => {
    const personel = await prisma.kullanici.findFirst({
        where: {
            personelNo: personelNo,
            rol: {
                in: ["MUDUR", "OGRETMEN", "PERSONEL"]
            },
            aktifMi: true
        },
        select: {
            id: true,
            personelNo: true, 
            isim: true,
            soy_isim: true,
            mail: true,
            tel_no: true,
            tc_no: true,
            dogum_tarihi: true,
            egitim_durumu: true,
            maas: true, 
            createdAt: true,
            ogretmenProgramlari: {
                select: {
                    gun: true,
                    baslangic: true,
                    bitis: true,
                    ders: {
                        select: { isim: true }
                    },
                    sinif: {
                        select: { isim: true }
                    }
                }
            }
        },
    });

    if (!personel) {
        throw new NotFoundError(`${personelNo} No'lu personel bulunamadı.`);
    }

    const siniflar = personel.ogretmenProgramlari.map(p => ({
        gun: p.gun,
        baslangic: p.baslangic,
        bitis: p.bitis,
        dersIsmi: p.ders.isim,
        sinifIsmi: p.sinif.isim
    }));

    if (siniflar.length === 0) {    
        throw new NotFoundError("Bu personele atanmış sınıf bulunamadı.");
    }

    return {
        personel: {
            id: personel.id,
            personelNo: personel.personelNo,
            isim: personel.isim,
            soy_isim: personel.soy_isim,
            mail: personel.mail,
            tel_no: personel.tel_no,
            tc_no: personel.tc_no,
            dogum_tarihi: personel.dogum_tarihi,
            egitim_durumu: personel.egitim_durumu,
            maas: personel.maas,
            createdAt: personel.createdAt           
        },
        siniflar: siniflar
    };
    
}

export const sinifOgrencileriGetir = async (isim: string) => {
    const sinif = await prisma.sinif.findUnique({
        where: { isim:isim, aktifMi: true },
        select: {
            id: true,
            isim: true,
            kapasite: true,     
            ogrenciler: {
                where: { aktifMi: true },
                select: {   
                    id: true,
                    isim: true,
                    soy_isim: true,
                    ogrenciNo: true,
                    mail: true,
                    tel_no: true,
                    tc_no: true,
                    dogum_tarihi: true,
                    egitim_durumu: true,
                    odeme_plani: true,
                    odeme_durumu: true,
                    rol: true,
                    aktifMi: true,
                    createdAt: true,
                    veli: { 
                        select: {
                            id: true,
                            isim: true,         
                            soy_isim: true,
                            mail: true,
                            tel_no: true,           
                        }       

                    },
                    notlar: {
                        select: {   
                            id: true,
                            sinavAdi: true,
                            puan: true,
                            tarih: true,
                            ders: {
                                select: { isim: true }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!sinif) {
        throw new NotFoundError("Sınıf bulunamadı.");
    }

    if (sinif.ogrenciler.length === 0) {
        throw new NotFoundError("Bu sınıfa kayıtlı aktif öğrenci bulunamadı.");
    }   
    return sinif.ogrenciler;
}

