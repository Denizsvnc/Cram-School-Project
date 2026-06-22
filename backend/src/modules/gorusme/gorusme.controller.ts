import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../core/middlewares/auth.middleware';
import { GorusmeService } from './gorusme.service';
import { Roller } from '../../../generated/prisma/enums';

export const GorusmeController = {
  // --- Sınav Takvimi ---

  async getSinavTakvimi(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const takvim = await GorusmeService.listSinavTakvimi();
      res.json(takvim);
    } catch (e) {
      next(e);
    }
  },

  async createSinavTakvimi(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { sinavAdi, tarih, dersId } = req.body;
      if (!sinavAdi || !tarih || !dersId) {
        res.status(400).json({ hata: 'Sınav adı, tarih ve ders alanları zorunludur.' });
        return;
      }

      const yeniSinav = await GorusmeService.createSinavTakvimi(
        sinavAdi,
        new Date(tarih),
        dersId
      );
      res.status(201).json(yeniSinav);
    } catch (e) {
      next(e);
    }
  },

  async deleteSinavTakvimi(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ hata: 'Sınav ID gereklidir.' });
        return;
      }

      await GorusmeService.deleteSinavTakvimi(id as string);
      res.json({ success: true, message: 'Sınav takvimden başarıyla kaldırıldı.' });
    } catch (e) {
      next(e);
    }
  },

  // --- Veli Görüşmeleri ---

  async getVeliGorusmeleri(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.kullanici;
      if (!user) {
        res.status(401).json({ hata: 'Yetkisiz erişim. Lütfen giriş yapın.' });
        return;
      }

      if (user.role === Roller.VELI) {
        const gorusmeler = await GorusmeService.listVeliGorusmeleriByVeli(user.id);
        res.json(gorusmeler);
      } else if (user.role === Roller.OGRETMEN) {
        const gorusmeler = await GorusmeService.listVeliGorusmeleriByOgretmen(user.id);
        res.json(gorusmeler);
      } else if (user.role === Roller.YONETICI || user.role === Roller.MUDUR) {
        const gorusmeler = await GorusmeService.listAllVeliGorusmeleri();
        res.json(gorusmeler);
      } else {
        res.status(403).json({ hata: 'Bu işlem için yetkiniz bulunmamaktadır.' });
      }
    } catch (e) {
      next(e);
    }
  },

  async createVeliGorusme(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.kullanici;
      if (!user || user.role !== Roller.VELI) {
        res.status(403).json({ hata: 'Yalnızca veliler görüşme talebi oluşturabilir.' });
        return;
      }

      const { ogretmenId, tarih, saat, aciklama } = req.body;
      if (!ogretmenId || !tarih || !saat) {
        res.status(400).json({ hata: 'Öğretmen, tarih ve saat alanları zorunludur.' });
        return;
      }

      const yeniGorusme = await GorusmeService.createVeliGorusme(
        user.id,
        ogretmenId,
        new Date(tarih),
        saat,
        aciklama
      );
      res.status(201).json(yeniGorusme);
    } catch (e) {
      next(e);
    }
  },

  async updateVeliGorusmeDurum(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.kullanici;
      if (!user || user.role !== Roller.OGRETMEN) {
        res.status(403).json({ hata: 'Görüşme durumunu yalnızca görüşülen öğretmen güncelleyebilir.' });
        return;
      }

      const { id } = req.params;
      const { durum } = req.body; // ONAYLANDI, REDDEDILDI
      if (!id || !durum) {
        res.status(400).json({ hata: 'Görüşme ID ve yeni durum gereklidir.' });
        return;
      }

      if (durum !== 'ONAYLANDI' && durum !== 'REDDEDILDI') {
        res.status(400).json({ hata: 'Geçersiz durum değeri.' });
        return;
      }

      const gorusme = await GorusmeService.updateVeliGorusmeDurum(id as string, durum as string);
      res.json(gorusme);
    } catch (e) {
      next(e);
    }
  },

  async deleteVeliGorusme(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ hata: 'Görüşme ID gereklidir.' });
        return;
      }

      await GorusmeService.deleteVeliGorusme(id as string);
      res.json({ success: true, message: 'Görüşme başarıyla silindi.' });
    } catch (e) {
      next(e);
    }
  }
};
