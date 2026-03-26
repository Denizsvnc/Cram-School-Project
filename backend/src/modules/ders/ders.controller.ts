import type { AuthRequest } from '../../core/middlewares/auth.middleware';
import { Request, Response, NextFunction } from 'express';

import * as dersService from "./ders.service";

export const dersOlustur = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const dersData = req.body;
        const ders = await dersService.dersOlustur(dersData);
        res.status(201).json(ders); 
    } catch (err) { next(err); }
}
export const kendiDerslerim = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const kullanici = req.kullanici;
        if (!kullanici) return res.status(401).json({ hata: 'Yetkisiz.' });
        const dersler = await dersService.kendiDerslerim(kullanici.id, kullanici.role);
        res.json(dersler);
    } catch (err) { next(err); }
};
export const dersGetirIsimle = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let { dersIsmi } = req.params;
        if (typeof dersIsmi !== 'string') {
            throw new Error('dersIsmi parametresi eksik veya hatalı.');
        }
        const ders = await dersService.dersGetirIsimle(dersIsmi);
        res.json(ders); 
    } catch (err) { next(err); }
}

export const dersGuncelle = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let { dersId } = req.params;
        if (typeof dersId !== 'string' || isNaN(Number(dersId))) {
            throw new Error('dersId parametresi eksik veya hatalı.');
        }
        const dersData = req.body;
        const updatedDers = await dersService.dersGuncelle(Number(dersId), dersData);
        res.json(updatedDers); 
    } catch (err) { next(err); }
}

export const dersSil = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let { dersId } = req.params;
        if (typeof dersId !== 'string' || isNaN(Number(dersId))) {
            throw new Error('dersId parametresi eksik veya hatalı.');
        }
        await dersService.dersSil(Number(dersId));
        res.status(204).send(); 
    } catch (err) { next(err); }
}

export const tumDersleriGetir = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const dersler = await dersService.tumDersleriGetir();
        res.json(dersler); 
    } catch (err) { next(err); }
}

