import { getPrismaClient } from '../../core/config/prisma';

import { NotFoundError, UnauthorizedError } from '../errors/customErrors';

import { Roller } from '../../../generated/prisma/enums';

const prisma = getPrismaClient();


export const personelleriGetir = async (filtreRol?: Roller) => {
    const personeller = await prisma.kullanici.findMany({
        where: { 
            rol: filtreRol ? filtreRol : { in: ['MUDUR', 'OGRETMEN', 'PERSONEL'] }
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
            
            // öğretmenin Sınıf Bilgisi
            sinif: {
                select: {
                    id: true,
                    isim: true,
                    kapasite: true
                }
            },

            
            
            
        },
        orderBy: {
            createdAt: 'desc' // En son eklenen öğrenci en üstte gelsin
        }
    });
    if(!personeller || personeller.length === 0 ){
        // eğer öğretmen kaydı yoksa boş liste dön
        return [];
    }
    return personeller;
};

export const personelGetirById = async (personelNo: number) => {
    const personel = await prisma.kullanici.findFirst({
        where: {
            personelNo: personelNo,
            rol: {
                in: ["MUDUR", "OGRETMEN", "PERSONEL"]
            }
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

    return personel;
};