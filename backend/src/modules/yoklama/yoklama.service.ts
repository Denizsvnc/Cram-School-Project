import { getPrismaClient } from '../../core/config/prisma';
import { NotFoundError, UnauthorizedError } from '../errors/customErrors';
const prisma = getPrismaClient();

export const yoklamaOlustur = async (data: { ogrenciId: string; dersProgramiId: string; tarih?: Date | string; derseKatildiMi?: boolean }) => {
	return await prisma.yoklama.create({
		data: {
			ogrenciId: data.ogrenciId,
			dersProgramiId: data.dersProgramiId,
			...(data.tarih ? { tarih: data.tarih } : {}),
			...(data.derseKatildiMi !== undefined ? { derseKatildiMi: data.derseKatildiMi } : {})
		},
		include: { ogrenci: true, dersProgrami: true }
	});
};

export const yoklamaGuncelle = async (id: string, updateData: { tarih?: Date | string; derseKatildiMi?: boolean }) => {
	const mevcut = await prisma.yoklama.findUnique({ where: { id } });
	if (!mevcut) throw new NotFoundError('Yoklama kaydı bulunamadı.');
	return await prisma.yoklama.update({
		where: { id },
		data: {
			...(updateData.tarih !== undefined ? { tarih: updateData.tarih } : {}),
			...(updateData.derseKatildiMi !== undefined ? { derseKatildiMi: updateData.derseKatildiMi } : {})
		},
		include: { ogrenci: true, dersProgrami: true }
	});
};

export const yoklamaSil = async (id: string) => {
	const mevcut = await prisma.yoklama.findUnique({ where: { id } });
	if (!mevcut) throw new NotFoundError('Yoklama kaydı bulunamadı.');
	await prisma.yoklama.delete({ where: { id } });
	return { message: 'Yoklama kaydı silindi.' };
};

export const yoklamaGetir = async (id: string) => {
	const yoklama = await prisma.yoklama.findUnique({
		where: { id },
		include: { ogrenci: true, dersProgrami: true }
	});
	if (!yoklama) throw new NotFoundError('Yoklama kaydı bulunamadı.');
	return yoklama;
};

export const ogrenciYoklamalari = async (ogrenciId: string) => {
	return await prisma.yoklama.findMany({
		where: { ogrenciId },
		include: { dersProgrami: true }
	});
};

export const dersProgramiYoklamalari = async (dersProgramiId: string) => {
	return await prisma.yoklama.findMany({
		where: { dersProgramiId },
		include: { ogrenci: true }
	});
};