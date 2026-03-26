import { Request, Response, NextFunction } from 'express';
import * as dersProgrami from './dersrProgrami.service';

export const programOlustur = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const programData = req.body;
        const program = await dersProgrami.programOlustur(programData);
        res.status(201).json(program); 
    } catch (err) { next(err); }
}

export const programGuncelle = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let { id } = req.params;
        if (typeof id !== 'string') {
            throw new Error('id parametresi eksik veya hatalı.');
        }
        const updateData = req.body;
        const updatedProgram = await dersProgrami.programGuncelle(id, updateData);
        res.json(updatedProgram); 
    } catch (err) { next(err); }
}

export const programSil = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let { id } = req.params;
        if (typeof id !== 'string') {
            throw new Error('id parametresi eksik veya hatalı.');
        }
        const sonuc = await dersProgrami.programSil(id);
        res.json(sonuc); 
    } catch (err) { next(err); }
}

export const programGetir = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let { id } = req.params;
        if (typeof id !== 'string') {
            throw new Error('id parametresi eksik veya hatalı.');
        }
        const program = await dersProgrami.programGetir(id);
        res.json(program); 
    } catch (err) { next(err); }
}

export const sinifProgramlari = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let { sinifId } = req.params;
        if (typeof sinifId !== 'string') {
            throw new Error('sinifId parametresi eksik veya hatalı.');
        }
        const programlar = await dersProgrami.sinifProgramlari(sinifId);
        res.json(programlar); 
    } catch (err) { next(err); }
}

export const dersProgramlari = async (req: Request, res: Response, next: NextFunction) => { 
    try{
        let { dersId } = req.params;
        if (typeof dersId !== 'string') {
            throw new Error('dersId parametresi eksik veya hatalı.');
        }
        const programlar = await dersProgrami.dersProgramlari(dersId);
        res.json(programlar); 
    } catch (err) { next(err); }
}

export const ogretmenProgramlari = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let { ogretmenId } = req.params;
        if (typeof ogretmenId !== 'string') {
            throw new Error('ogretmenId parametresi eksik veya hatalı.');
        }
        const programlar = await dersProgrami.ogretmenProgramlari(ogretmenId);
        res.json(programlar); 
    } catch (err) { next(err); }
}