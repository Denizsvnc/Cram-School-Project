import { getPrismaClient } from '../../core/config/prisma';
import { NotFoundError, UnauthorizedError } from '../errors/customErrors';
const prisma = getPrismaClient();

// Ders programı oluştur
export const programOlustur = async (programData: {sinifId: string, dersId: string, baslangic: string, bitis: string, ogretmenId: string, gun: number}) => {
    const existingProgram = await prisma.dersProgrami.findFirst({
        where: {
            sinifId: programData.sinifId,
            dersId: programData.dersId,
            ogretmenId: programData.ogretmenId,
            baslangic: programData.baslangic,
            bitis: programData.bitis,
            gun: programData.gun
        },
    });
    if (existingProgram) {
        throw new UnauthorizedError('Bu ders programı zaten mevcut.');
    }
    return await prisma.dersProgrami.create({
        data: programData,
        include: { sinif: true, ders: true, ogretmen: true }
    });
};

// Ders programı güncelle
export const programGuncelle = async (id: string, updateData: Partial<{sinifId: string, dersId: string, baslangic: string, bitis: string, ogretmenId: string, gun: number}>) => {
    const program = await prisma.dersProgrami.findUnique({ where: { id } });
    if (!program) throw new NotFoundError('Ders programı bulunamadı.');
    return await prisma.dersProgrami.update({
        where: { id },
        data: updateData,
        include: { sinif: true, ders: true, ogretmen: true }
    });
};

// Ders programı sil
export const programSil = async (id: string) => {
    const program = await prisma.dersProgrami.findUnique({ where: { id } });
    if (!program) throw new NotFoundError('Ders programı bulunamadı.');
    await prisma.dersProgrami.delete({ where: { id } });
    return { mesaj: 'Ders programı silindi.' };
};

// Tekil ders programı getir (ilişkili)
export const programGetir = async (id: string) => {
    const program = await prisma.dersProgrami.findUnique({
        where: { id },
        include: { sinif: true, ders: true, ogretmen: true }
    });
    if (!program) throw new NotFoundError('Ders programı bulunamadı.');
    return program;
};

// Sınıfa göre programlar
export const sinifProgramlari = async (sinifId: string) => {
    return await prisma.dersProgrami.findMany({
        where: { sinifId },
        include: { sinif: true, ders: true, ogretmen: true }
    });
};

// Derse göre programlar
export const dersProgramlari = async (dersId: string) => {
    return await prisma.dersProgrami.findMany({
        where: { dersId },
        include: { sinif: true, ders: true, ogretmen: true }
    });
};

// Öğretmene göre programlar
export const ogretmenProgramlari = async (ogretmenId: string) => {
    return await prisma.dersProgrami.findMany({
        where: { ogretmenId },
        include: { sinif: true, ders: true, ogretmen: true }
    });
};

// Tüm programlar (ilişkili)
export const tumProgramlar = async () => {
    return await prisma.dersProgrami.findMany({
        include: { sinif: true, ders: true, ogretmen: true }
    });
};
