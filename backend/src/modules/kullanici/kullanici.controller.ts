import { Request, Response, NextFunction } from 'express';
import * as ogrenciService from './ogrenci.service';
import * as personelService from './personel.service';


import { Roller } from '../../../generated/prisma/enums';

export const ogrencileriGetir = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const ogrenciler = await ogrenciService.ogrencileriGetir();
        res.status(200).json({
            message : "Ogrenciler başarıyla getirildi.",
            ogrenciler : ogrenciler,
            toplamOgrenci: ogrenciler.length
        });
    } catch (err) { next(err); }

}

export const ogrenciGetirById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const ogrenciNoRaw = req.params.ogrenciNo as string; 
        const ogrenciNo = parseInt(ogrenciNoRaw, 10);
        if (isNaN(ogrenciNo)) {
            res.status(400).json({ message: "Geçersiz öğrenci numarası." });
            return;
        }
        const ogrenci = await ogrenciService.ogrenciGetirById(ogrenciNo);
        res.status(200).json({
            message : `${ogrenciNo} No'lu öğrenci başarıyla getirildi.`,
            ogrenci : ogrenci
        }); 
    } catch (err) { next(err);
    }
}

export const personelleriGetir = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const { rol } = req.query;
        const filtreRol = rol ? (rol as Roller) : undefined;
        const personeller = await personelService.personelleriGetir();
        res.status(200).json({
            message: rol ? `${rol} listesi getirildi.` : "Tüm personel listesi getirildi.",
            personeller : personeller,
            toplamOgretmen: personeller.length
        });
    } catch (err) { next(err); }
}

export const personelGetirById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const personelNoRaw = req.params.personelNo as string; 
        const personelNo = parseInt(personelNoRaw, 10);
        if (isNaN(personelNo)) {
            res.status(400).json({ message: "Geçersiz öğrenci numarası." });
            return;
        }
        const personel = await personelService.personelGetirById(personelNo);
        res.status(200).json({
            message : `${personelNo} No'lu Personel başarıyla getirildi.`,
            personel : personel
        }); 
    } catch (err) { next(err);
    }
}

export const mudurleriGetir = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const personeller = await personelService.personelleriGetir("MUDUR");
        res.status(200).json({ title: "Müdür Listesi", count: personeller.length, personeller });
    } catch (err) { next(err); }
};

// Sadece Öğretmenleri Getir
export const ogretmenleriGetir = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const personeller = await personelService.personelleriGetir("OGRETMEN");
        res.status(200).json({ title: "Öğretmen Listesi", count: personeller.length, personeller });
    } catch (err) { next(err); }
};
// sadece personel rolündeki kullanıcıları getir
export const personellerGetir = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const personeller = await personelService.personelleriGetir("PERSONEL");
        res.status(200).json({ title: "Personel Listesi", count: personeller.length, personeller });
    } catch (err) { next(err); }
};