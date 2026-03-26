import { getPrismaClient } from '../../core/config/prisma';
import { NotFoundError, UnauthorizedError } from '../errors/customErrors';
const prisma = getPrismaClient();

export const notOlustur = async (notData: { ogrenciId: string; dersId: string; sinavAdi: string; puan: number; tarih?: Date | string }) => {
    const existingNot = await prisma.sinavNotu.findFirst({
        where: {
            ogrenciId: notData.ogrenciId,
            dersId: notData.dersId,
            sinavAdi: notData.sinavAdi
        },
    });
    if (existingNot) {
        throw new UnauthorizedError('Bu öğrenci için bu derse ait bu sınav adıyla bir sınav notu zaten mevcut.');
    }
    return await prisma.sinavNotu.create({
        data: {
            ogrenciId: notData.ogrenciId,
            dersId: notData.dersId,
            sinavAdi: notData.sinavAdi,
            puan: notData.puan,
            ...(notData.tarih ? { tarih: notData.tarih } : {})
        },
        include: { ogrenci: true, ders: true }
    });
}

export const notGuncelle = async (id: string, updateData: { puan?: number; sinavAdi?: string; tarih?: Date | string }) => {
    const existingNot = await prisma.sinavNotu.findUnique({
        where: { id },
    });
    if (!existingNot) {
        throw new NotFoundError('Sınav notu bulunamadı.');
    }
    return await prisma.sinavNotu.update({
        where: { id },
        data: {
            ...(updateData.puan !== undefined ? { puan: updateData.puan } : {}),
            ...(updateData.sinavAdi !== undefined ? { sinavAdi: updateData.sinavAdi } : {}),
            ...(updateData.tarih !== undefined ? { tarih: updateData.tarih } : {})
        },
        include: { ogrenci: true, ders: true }
    });
}

export const notSil = async (id: string) => {
    const existingNot = await prisma.sinavNotu.findUnique({
        where: { id },
    });
    if (!existingNot) {
        throw new NotFoundError('Sınav notu bulunamadı.');
    }
    await prisma.sinavNotu.delete({
        where: { id },
    });
    return { message: 'Sınav notu başarıyla silindi.' };
}

export const notGetir = async (id: string) => {
    const not = await prisma.sinavNotu.findUnique({
        where: { id },
        include: { ogrenci: true, ders: true }
    });
    if (!not) {
        throw new NotFoundError('Sınav notu bulunamadı.');
    }
    return not;
}

export const ogrenciNotlari = async (ogrenciId: string) => {
    return await prisma.sinavNotu.findMany({
        where: { ogrenciId },
        include: { ders: true }
    });
}

export const dersNotlari = async (dersId: string) => {
    return await prisma.sinavNotu.findMany({
        where: { dersId },
        include: { ogrenci: true }
    });
}

// Duplicate notGuncelle removed