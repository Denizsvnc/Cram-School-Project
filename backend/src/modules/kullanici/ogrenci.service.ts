import { Kullanici } from '../../../generated/prisma/browser';
import { getPrismaClient } from '../../core/config/prisma';

import { NotFoundError, UnauthorizedError } from '../errors/customErrors';


const prisma = getPrismaClient();

export const ogrencileriGetir = async () => {
    const ogrenciler = await prisma.kullanici.findMany({
        where: { 
            rol: "OGRENCI",
            aktifMi: true
        },
        select: {
            id: true,
            isim: true,
            soy_isim: true,
            mail: true,
            tel_no: true,
            tc_no: true,
            ogrenciNo: true,
            dogum_tarihi: true,
            egitim_durumu: true,
            odeme_plani: true,
            odeme_durumu: true,
            odeme_tutari: true,
            taksit_sayisi: true,
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
            rol: "OGRENCI",
            aktifMi: true

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
            odeme_plani: true,
            odeme_durumu: true,
            odeme_tutari: true,
            taksit_sayisi: true,
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

export const ogrenciSil = async (ogrenciNo: number)=>{
    const ogrenci = await prisma.kullanici.findFirst({
        where: {
            ogrenciNo: ogrenciNo,
            rol: "OGRENCI"
        },
    });

    if(!ogrenci) {
        throw new NotFoundError(`${ogrenciNo} No'lu öğrenci bulunamadı.`);
    }
    return await prisma.kullanici.update({
        where:{
            ogrenciNo
        },
        data:{
            rol: "ESKI_OGRENCI",
            aktifMi: false
        }
            
    })
}

export const ogrenciGuncelle = async (ogrenciNo: number, guncelVeriler: Partial<Omit<Kullanici, 'id' | 'ogrenciNo' | 'rol' | 'createdAt'>>) => {
    const ogrenci = await prisma.kullanici.findFirst({
        where: {
            ogrenciNo: ogrenciNo,
            rol: "OGRENCI",
            aktifMi: true
        },
    });

    if(!ogrenci) {
        throw new NotFoundError(`${ogrenciNo} No'lu öğrenci bulunamadı.`);
    }

    const updated = await prisma.kullanici.update({
        where: { ogrenciNo: ogrenciNo },
        data: guncelVeriler
    });

    // Sınıfta hiç ödeme kaydı yoksa, ödeme planına göre otomatik oluştur
    const existingPayments = await prisma.odeme.count({
        where: { kullaniciId: updated.id }
    });

    if (existingPayments === 0) {
        const tutar = updated.odeme_tutari ? Number(updated.odeme_tutari) : 0;
        if (tutar > 0) {
            const odemePlani = updated.odeme_plani || '';
            const odemeDurumu = updated.odeme_durumu || false;
            
            if (odemePlani === 'Peşin') {
                await prisma.odeme.create({
                    data: {
                        kullaniciId: updated.id,
                        miktar: tutar,
                        durum: odemeDurumu ? 'ONAYLANDI' : 'BEKLIYOR',
                        aciklama: 'Peşin Ödeme',
                        sonOdemeTarihi: odemeDurumu ? new Date() : null
                    }
                });
            } else if (odemePlani === 'Aylık') {
                const taksitSayisi = updated.taksit_sayisi ? Number(updated.taksit_sayisi) : 1;
                const taksitMiktari = Math.round((tutar / taksitSayisi) * 100) / 100;
                const taksitler = [];
                const bugun = new Date();
                for (let i = 1; i <= taksitSayisi; i++) {
                    const sonTarih = new Date(bugun.getFullYear(), bugun.getMonth() + i - 1, bugun.getDate());
                    taksitler.push({
                        kullaniciId: updated.id,
                        miktar: i === taksitSayisi ? (tutar - (taksitMiktari * (taksitSayisi - 1))) : taksitMiktari,
                        durum: (i === 1 && odemeDurumu) ? 'ONAYLANDI' : 'BEKLIYOR',
                        aciklama: `${i}. Taksit`,
                        sonOdemeTarihi: (i === 1 && odemeDurumu) ? new Date() : null,
                        tarih: sonTarih
                    });
                }
                await prisma.odeme.createMany({
                    data: taksitler
                });
            }
        }
    }

    return updated;
};
