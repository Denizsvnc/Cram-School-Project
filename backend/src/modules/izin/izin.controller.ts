import { Request, Response, NextFunction } from 'express';
import * as izinService from './izin.service';

export const izinTalebiOlustur = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // req.kullanici JWT middleware'den gelecek
        const kullaniciId = (req as any).kullanici.id;
        const { baslangic, bitis, sebep } = req.body;

        if (!baslangic || !bitis || !sebep) {
            res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
            return;
        }

        const talep = await izinService.izinTalebiOlustur(kullaniciId, new Date(baslangic), new Date(bitis), sebep);
        res.status(201).json({ message: "İzin talebiniz başarıyla oluşturuldu.", talep });
    } catch (err) {
        next(err);
    }
};

export const kendiIzinTaleplerimiGetir = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const kullaniciId = (req as any).kullanici.id;
        const talepler = await izinService.kullaniciIzinTalepleriniGetir(kullaniciId);
        res.status(200).json(talepler);
    } catch (err) {
        next(err);
    }
};

export const tumIzinTalepleriniGetir = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const talepler = await izinService.tumIzinTalepleriniGetir();
        res.status(200).json(talepler);
    } catch (err) {
        next(err);
    }
};

export const izinTalebiDurumGuncelle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { durum } = req.body;

        if (!durum || !["ONAYLANDI", "REDDEDILDI"].includes(durum)) {
            res.status(400).json({ message: "Geçersiz durum." });
            return;
        }

        const guncellenen = await izinService.izinTalebiDurumGuncelle(id || '', durum);
        res.status(200).json({ message: `İzin talebi ${durum.toLowerCase()} olarak güncellendi.`, talep: guncellenen });
    } catch (err: any) {
        if (err.message === "Bu talep zaten sonuçlandırılmış." || err.message === "İzin talebi bulunamadı.") {
            res.status(400).json({ message: err.message });
            return;
        }
        next(err);
    }
};
