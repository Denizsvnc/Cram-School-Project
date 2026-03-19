import { getPrismaClient } from '../../core/config/prisma';

import { NotFoundError, UnauthorizedError } from '../errors/customErrors';


const prisma = getPrismaClient();

export const ogrencileriGetir = async () => {
    const ogrenciler = await prisma.kullanici.findMany({
        where: { 
            rol: "OGRENCI" 
        },
        select: {
            id: true,
            isim: true,
            soy_isim: true,
            mail: true,
            tel_no: true,
            tc_no: true,
            dogum_tarihi: true,
            egitim_durumu: true,
            odeme_planı: true,
            odeme_durumu: true,
            createdAt: true, 
            
            // Öğrencinin Sınıf Bilgisi
            sinif: {
                select: {
                    id: true,
                    isim: true,
                    kapasite: true
                }
            },
            
            // eğer varsa  velisi 
            veli: {
                select: {
                    id: true,
                    isim: true,
                    soy_isim: true,
                    mail: true,
                    tel_no: true,
                    
                }
            },
            
            // Öğrencinin Sınav Notları ve Hangi Derse Ait Olduğu
            notlar: {
                select: {
                    id: true,
                    sinavAdi: true,
                    puan: true,
                    tarih: true,
                    ders: {
                        select: {
                            id: true,
                            isim: true,
                        }
                    }
                },
                orderBy: { tarih: 'desc' } // Notları en yeniden eskiye doğru sırala
            }
        },
        orderBy: {
            createdAt: 'desc' // En son eklenen öğrenci en üstte gelsin
        }
    });
    if(!ogrenciler || ogrenciler.length === 0 ){
        // eğer öğrenci kaydı yoksa boş liste dön
        return [];
    }
    return ogrenciler;
};

export const ogrenciGetirById = async (ogrenciNo: number) => {
    const ogrenci = await prisma.kullanici.findFirst({
        where: {
            ogrenciNo: ogrenciNo,
            rol: "OGRENCI"

        },
                select: {
            id: true,
            isim: true,
            soy_isim: true,
            mail: true,
            tel_no: true,
            tc_no: true,
            dogum_tarihi: true,
            egitim_durumu: true,
            odeme_planı: true,
            odeme_durumu: true,
            createdAt: true, 
            
            // Öğrencinin Sınıf Bilgisi
            sinif: {
                select: {
                    id: true,
                    isim: true,
                    kapasite: true
                }
            },
            
            // eğer varsa  velisi 
            veli: {
                select: {
                    id: true,
                    isim: true,
                    soy_isim: true,
                    mail: true,
                    tel_no: true,
                    
                }
            },
            
            // Öğrencinin Sınav Notları ve Hangi Derse Ait Olduğu
            notlar: {
                select: {
                    id: true,
                    sinavAdi: true,
                    puan: true,
                    tarih: true,
                    ders: {
                        select: {
                            id: true,
                            isim: true,
                        }
                    }
                },
                orderBy: { tarih: 'desc' } // Notları en yeniden eskiye doğru sırala
            }
            
        },
    });
    if(!ogrenci) {
        throw new NotFoundError(`${ogrenciNo} No'lu öğrenci bulunamadı.`);
    }
    return ogrenci;
}

