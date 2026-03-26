import * as sinavNotuService from './sinavNotu.service';
import { Request, Response, NextFunction } from 'express';

export const notOlustur = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const not = await sinavNotuService.notOlustur(req.body);
        res.status(201).json(not);
    } catch (err) {
        next(err);
    }
};

export const notGuncelle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const not = await sinavNotuService.notGuncelle(id || '', req.body);
        res.json(not);
    } catch (err) {
        next(err);
    }
};

export const notSil = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const result = await sinavNotuService.notSil(id || '');
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const notGetir = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const not = await sinavNotuService.notGetir(id || '');
        res.json(not);
    } catch (err) {
        next(err);
    }
};

export const ogrenciNotlari = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ogrenciId = Array.isArray(req.params.ogrenciId) ? req.params.ogrenciId[0] : req.params.ogrenciId;
        const notlar = await sinavNotuService.ogrenciNotlari(ogrenciId || '');
        res.json(notlar);
    } catch (err) {
        next(err);
    }
};

export const dersNotlari = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dersId = Array.isArray(req.params.dersId) ? req.params.dersId[0] : req.params.dersId;
        const notlar = await sinavNotuService.dersNotlari(dersId || '');
        res.json(notlar);
    } catch (err) {
        next(err);
    }
};
