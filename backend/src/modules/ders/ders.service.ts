import { getPrismaClient } from '../../core/config/prisma';

import { NotFoundError, UnauthorizedError } from '../errors/customErrors';

const prisma = getPrismaClient();
// create, read, update, delete 
export const dersOlustur = async (dersData: {isim: string, ders_suresi: number}) =>{
    const existingDers = await prisma.ders.findUnique({
        where: { isim: dersData.isim },
    });

    if (existingDers) {
        throw new UnauthorizedError('Bu isimde bir ders zaten mevcut.');
    }
    const ders = await prisma.ders.create({
        data: dersData,
    });
    return ders;
}

// dersin isminden id sini çek
const dersToId = async (dersIsmi: string) => {
    const ders = await prisma.ders.findUnique({
        where: { isim: dersIsmi }
    });
    if (!ders) throw new NotFoundError(`${dersIsmi} isimli ders bulunamadı.`);
    return ders;
};

export const dersGetirIsimle = async (dersIsmı: string)=>{
    return await dersToId(dersIsmı);
}

export const dersGuncelle = async (dersId: number, dersData: {isim?: string, ders_suresi?: number}) =>{
    const ders = await prisma.ders.findUnique({
        where: { id: dersId.toString() },
    });
    if (!ders) {
        throw new NotFoundError('Ders bulunamadı.');
    }
    const updatedDers = await prisma.ders.update({
        where: { id: dersId.toString() },
        data: dersData,
    });
    return updatedDers;
}

export const dersSil = async (dersId: number) =>{
    const ders = await prisma.ders.findUnique({
        where: { id: dersId.toString() },
    });
    if (!ders) {
        throw new NotFoundError('Ders bulunamadı.');
    }
    await prisma.ders.delete({
        where: { id: dersId.toString() },
    });
}

export const kendiDerslerim = async (kullaniciId: string, rol: string) => {
    if (rol === 'OGRENCI') {
        // Öğrencinin bağlı olduğu sınıfın programındaki dersler
        const ogrenci = await prisma.kullanici.findUnique({
            where: { id: kullaniciId },
            include: {
                sinif: {
                    include: {
                        programlar: {
                            include: { ders: true }
                        }
                    }
                }
            }
        });
        if (!ogrenci?.sinif) return [];
        // Sınıf programındaki dersleri unique olarak döndür
        const dersler = ogrenci.sinif.programlar.map(p => p.ders);
        // Aynı dersi birden fazla kez alma ihtimaline karşı unique
        const uniqueDersler = Array.from(new Map(dersler.map(d => [d.id, d])).values());
        return uniqueDersler;
    } else if (rol === 'VELI') {
        // Velinin öğrencilerinin dersleri
        const veli = await prisma.kullanici.findUnique({
            where: { id: kullaniciId },
            include: {
                ogrenciler: {
                    include: {
                        sinif: {
                            include: {
                                programlar: {
                                    include: { ders: true }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!veli) return [];
        // Tüm öğrencilerin derslerini topla
        const dersler = veli.ogrenciler.flatMap(ogr => ogr.sinif?.programlar.map(p => p.ders) || []);
        // Unique dersler
        const uniqueDersler = Array.from(new Map(dersler.map(d => [d.id, d])).values());
        return uniqueDersler;
    }
    return [];
};

export const tumDersleriGetir = async () =>{
    return await prisma.ders.findMany();
}   

