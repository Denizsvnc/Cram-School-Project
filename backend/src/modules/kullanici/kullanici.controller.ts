import { Request, Response, NextFunction } from 'express';
import { getPrismaClient } from '../../core/config/prisma';
import * as authService from '../auth/auth.service';
import { RegisterRequestBody } from '../../types';
import * as ogrenciService from './ogrenci.service';
import * as personelService from './personel.service';

import { Roller } from '../../../generated/prisma/enums';

export const ogrencileriGetir = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const ogrenciler = await ogrenciService.ogrencileriGetir();
        res.status(200).json({
            message: "Ogrenciler başarıyla getirildi.",
            ogrenciler: ogrenciler,
            toplamOgrenci: ogrenciler.length
        });
    } catch (err) { next(err); }

}

export const ogrenciGetirById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const ogrenciNoRaw = req.params.ogrenciNo as string;
        const ogrenciNo = parseInt(ogrenciNoRaw, 10);
        if (isNaN(ogrenciNo)) {
            res.status(400).json({ message: "Geçersiz öğrenci numarası." });
            return;
        }
        const ogrenci = await ogrenciService.ogrenciGetirById(ogrenciNo);
        res.status(200).json({
            message: `${ogrenciNo} No'lu öğrenci başarıyla getirildi.`,
            ogrenci: ogrenci
        });
    } catch (err) {
        next(err);
    }
}

export const ogrenciSil = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const ogrenciNoRaw = req.params.ogrenciNo as string;
        const ogrenciNo = parseInt(ogrenciNoRaw, 10);
        if (isNaN(ogrenciNo)) {
            res.status(400).json({ message: "Geçersiz öğrenci numarası." });
            return;
        }
        await ogrenciService.ogrenciSil(ogrenciNo);
        res.status(200).json({
            message: `${ogrenciNo} No'lu öğrenci başarıyla silindi.`
        });
    } catch (err) { next(err); }
}
export const ogrenciGuncelle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const ogrenciNoRaw = req.params.ogrenciNo as string;
        const ogrenciNo = parseInt(ogrenciNoRaw, 10);
        if (isNaN(ogrenciNo)) {
            res.status(400).json({ message: "Geçersiz öğrenci numarası." });
            return;
        }
        const guncelVeriler = req.body;
        const guncellenenOgrenci = await ogrenciService.ogrenciGuncelle(ogrenciNo, guncelVeriler);
        res.status(200).json({
            message: `${ogrenciNo} No'lu öğrenci başarıyla güncellendi.`,
            ogrenci: guncellenenOgrenci
        });
    } catch (err) { next(err); }
}
export const personelSil = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const personelNoRaw = req.params.personelNo as string;
        const personelNo = parseInt(personelNoRaw, 10);
        if (isNaN(personelNo)) {
            res.status(400).json({ message: "Geçersiz personel numarası." });
            return;
        }
        await personelService.personelSil(personelNo);
        res.status(200).json({
            message: `${personelNo} No'lu personel başarıyla silindi.`
        });
    } catch (err) { next(err); }
}

export const personelGuncelle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const personelNoRaw = req.params.personelNo as string;
        const personelNo = parseInt(personelNoRaw, 10);
        if (isNaN(personelNo)) {
            res.status(400).json({ message: "Geçersiz personel numarası." });
            return;
        }
        const guncelVeriler = req.body;
        const guncellenenPersonel = await personelService.personelGuncelle(personelNo, guncelVeriler);
        res.status(200).json({
            message: `${personelNo} No'lu personel başarıyla güncellendi.`,
            personel: guncellenenPersonel
        });
    } catch (err) { next(err); }
}

export const personelleriGetir = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { rol } = req.query;
        const filtreRol = rol ? (rol as Roller) : undefined;
        const personeller = await personelService.personelleriGetir(filtreRol);

        res.status(200).json({
            message: rol ? `${rol} listesi başarıyla getirildi.` : "Tüm personel listesi başarıyla getirildi.",
            personeller: personeller,
            count: personeller.length
        });
    } catch (err) {
        next(err);
    }
}
export const personelGetirById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const personelNoRaw = req.params.personelNo as string;
        const personelNo = parseInt(personelNoRaw, 10);
        if (isNaN(personelNo)) {
            res.status(400).json({ message: "Geçersiz Personel numarası." });
            return;
        }
        const personel = await personelService.personelGetirById(personelNo);
        res.status(200).json({
            message: `${personelNo} No'lu Personel başarıyla getirildi.`,
            personel: personel
        });
    } catch (err) {
        next(err);
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

export const velileriGetir = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const prisma = (await import('../../core/config/prisma')).getPrismaClient();
        const veliler = await prisma.kullanici.findMany({
            where: { rol: "VELI", aktifMi: true },
            select: {
                id: true, isim: true, soy_isim: true,
                mail: true, tel_no: true, tc_no: true,
                dogum_tarihi: true, egitim_durumu: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({
            message: "Veliler başarıyla getirildi.",
            veliler: veliler,
            count: veliler.length,
        });
    } catch (err) { next(err); }
};

export const veliGetirById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string;
        const prisma = (await import('../../core/config/prisma')).getPrismaClient();
        const veli = await prisma.kullanici.findUnique({
            where: { id, rol: "VELI" },
            select: {
                id: true, isim: true, soy_isim: true,
                mail: true, tel_no: true, tc_no: true,
                dogum_tarihi: true, egitim_durumu: true,
                rol: true, createdAt: true,
            }
        });
        if (!veli) {
            res.status(404).json({ message: "Veli bulunamadı." });
            return;
        }
        res.status(200).json({ message: "Veli getirildi.", veli });
    } catch (err) { next(err); }
};

export const veliSil = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string;
        const prisma = (await import('../../core/config/prisma')).getPrismaClient();
        await prisma.kullanici.update({
            where: { id, rol: "VELI" },
            data: { aktifMi: false }
        });
        res.status(200).json({ message: "Veli silindi." });
    } catch (err) { next(err); }
};

export const veliGuncelle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string;
        const guncelVeriler = req.body;
        const prisma = (await import('../../core/config/prisma')).getPrismaClient();
        const guncellenenVeli = await prisma.kullanici.update({
            where: { id, rol: "VELI" },
            data: guncelVeriler
        });
        res.status(200).json({ message: "Veli güncellendi.", veli: guncellenenVeli });
    } catch (err) { next(err); }
};

export const kullaniciOlustur = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Kullanıcı oluşturma isteği geldi:", req.body);

        // authService zaten yukarıda import edildi

        const userData: RegisterRequestBody = {
            email: req.body.mail, // Request body'de 'mail' geliyor, authService 'email' bekliyor
            password: 'sifre123', // Varsa
            rol: req.body.rol,
            isim: req.body.isim,
            soy_isim: req.body.soy_isim,
            tel_no: req.body.tel_no,
            tc_no: req.body.tc_no,
            dogum_tarihi: req.body.dogum_tarihi,
            egitim_durumu: req.body.egitim_durumu,
            odeme_plani: req.body.odeme_plani,
            odeme_durumu: req.body.odeme_durumu,
            maas: req.body.maas,
            veli_ID: req.body.veli_ID,
            ogrenci_ids: req.body.ogrenci_ids
        };

        const newUser = await authService.kullaniciKayit(userData);
        console.log("Kullanıcı başarıyla oluşturuldu:", newUser.id);
        res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu.", user: newUser });
    } catch (err: any) {
        console.error("Kullanıcı oluşturma hatası:", err);
        res.status(400).json({ message: err.message || "Kullanıcı oluşturulamadı." });
    }
};