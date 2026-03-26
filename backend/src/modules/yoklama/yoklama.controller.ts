
import * as yoklamaService from './yoklama.service';
import { Request, Response, NextFunction } from 'express';

export const yoklamaOlustur = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const yoklama = await yoklamaService.yoklamaOlustur(req.body);
		res.status(201).json(yoklama);
	} catch (err) {
		next(err);
	}
};

export const yoklamaGuncelle = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
		const yoklama = await yoklamaService.yoklamaGuncelle(id || '', req.body);
		res.json(yoklama);
	} catch (err) {
		next(err);
	}
};

export const yoklamaSil = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
		const result = await yoklamaService.yoklamaSil(id || '');
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export const yoklamaGetir = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
		const yoklama = await yoklamaService.yoklamaGetir(id || '');
		res.json(yoklama);
	} catch (err) {
		next(err);
	}
};

export const ogrenciYoklamalari = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const ogrenciId = Array.isArray(req.params.ogrenciId) ? req.params.ogrenciId[0] : req.params.ogrenciId;
		const yoklamalar = await yoklamaService.ogrenciYoklamalari(ogrenciId || '');
		res.json(yoklamalar);
	} catch (err) {
		next(err);
	}
};

export const dersProgramiYoklamalari = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const dersProgramiId = Array.isArray(req.params.dersProgramiId) ? req.params.dersProgramiId[0] : req.params.dersProgramiId;
		const yoklamalar = await yoklamaService.dersProgramiYoklamalari(dersProgramiId || '');
		res.json(yoklamalar);
	} catch (err) {
		next(err);
	}
};