import { Request, Response, NextFunction } from 'express';
import * as sinifService from './sinif.service';

export const sinifOlustur = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const isimRaw = req.body.isim;
        const isim = Array.isArray(isimRaw) ? isimRaw[0] : isimRaw;
        const kapasite = req.body.kapasite;
        if (!isim || !kapasite) {
            res.status(400).json({ message: "Sınıf ismi ve kapasite gereklidir." });
            return;
        }
        const yeniSinif = await sinifService.sinifOlustur(isim, kapasite);
        res.status(201).json({
            message : "Sınıf başarıyla oluşturuldu.",
            sinif : yeniSinif
        });
    } catch (err) { next(err); }
}

export const sinifaOgrenciEkle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
            const isimRaw = req.body.isim;
            if (!isimRaw) {
                res.status(400).json({ message: "Sınıf ismi gereklidir." });
                return;
            }
            const isim = Array.isArray(isimRaw) ? isimRaw[0] : isimRaw;
            const ogrenciNoRaw = req.body.ogrenciNo;
            if (!ogrenciNoRaw) {
                res.status(400).json({ message: "Öğrenci numarası gereklidir." });
                return;
            }
            const ogrenciNo = Array.isArray(ogrenciNoRaw) ? parseInt(ogrenciNoRaw[0], 10) : parseInt(ogrenciNoRaw, 10);
            if (isNaN(ogrenciNo)) {
                res.status(400).json({ message: "Geçersiz öğrenci numarası." });
                return;
            }
        const guncellenenOgrenci = await sinifService.sinifaOgrenciEkle(isim, ogrenciNo);
        res.status(200).json({
            message : `Öğrenci başarıyla ${isim} sınıfına eklendi.`,
            ogrenci : guncellenenOgrenci
        });
    } catch (err) { next(err); }
}

export const ogrenciyiSiniftanCikar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
       
        const ogrenciNoRaw = req.body.ogrenciNo;
        if (!ogrenciNoRaw) {
            res.status(400).json({ message: "Öğrenci numarası gereklidir." });
            return;
        }
        const ogrenciNo = Array.isArray(ogrenciNoRaw) ? parseInt(ogrenciNoRaw[0], 10) : parseInt(ogrenciNoRaw, 10);
        if (isNaN(ogrenciNo)) {
            res.status(400).json({ message: "Geçersiz öğrenci numarası." });
            return;
        }

        const guncellenenOgrenci = await sinifService.ogrenciyiSiniftanCikar(ogrenciNo);
        res.status(200).json({
            message: `Öğrenci başarıyla sınıftan çıkarıldı.`,
            ogrenci: guncellenenOgrenci
        });
    } catch (err) { next(err); }
}

export const siniflariGetir = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const siniflar = await sinifService.siniflariGetir();
        res.status(200).json({
            message : "Sınıflar başarıyla getirildi.",
            siniflar : siniflar,
            toplamSinif: siniflar.length
    });
    } catch (err) { next(err); }
}

export const sinifDetayGetir = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try{
        const isimRaw = req.params.isim;
        const isim = Array.isArray(isimRaw) ? isimRaw[0] : isimRaw;
        if (!isim) {
            res.status(400).json({ message: "Sınıf ismi gereklidir." });
            return;
        }
        const sinifDetay = await sinifService.sinifDetayGetir(isim);
        res.status(200).json({
            message : `${isim} sınıfının detayları başarıyla getirildi.`,
            sinif : sinifDetay
        });
    } catch (err) { next(err); }
}

export const sinifSil = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const isimRaw = req.params.isim;
        const isim = Array.isArray(isimRaw) ? isimRaw[0] : isimRaw;
        if (!isim) {
            res.status(400).json({ message: "Sınıf ismi gereklidir." });
            return;
        }
        await sinifService.sinifSil(isim);
        res.status(200).json({
            message : `${isim} sınıfı başarıyla silindi.`
        });
    } catch (err) { next(err); }
}

export const personelSiniflariGetir = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const personelNoRaw = req.params.personelNo as string;
        const personelNo = parseInt(personelNoRaw, 10);
        if (isNaN(personelNo)) {
            res.status(400).json({ message: "Geçersiz personel numarası." });
            return;
        }
        const siniflar = await sinifService.personelSiniflariGetir(personelNo);
        res.status(200).json({
            message : `Personel ${personelNo} numaralı personelin sınıfları başarıyla getirildi.`,
            siniflar : siniflar,
            toplamSinif: siniflar.siniflar.length
        });
    } catch (err) { next(err); }
}

export const sinifOgrencileriGetir = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const isimRaw = req.params.isim;
        const isim = Array.isArray(isimRaw) ? isimRaw[0] : isimRaw;
        if (!isim) {
            res.status(400).json({ message: "Sınıf ismi gereklidir." });
            return;
        }
        const ogrenciler = await sinifService.sinifOgrencileriGetir(isim);
        res.status(200).json({
            message : `Sınıfın öğrencileri başarıyla getirildi.`,
            result : ogrenciler,
        });
    } catch (err) { next(err); }
}