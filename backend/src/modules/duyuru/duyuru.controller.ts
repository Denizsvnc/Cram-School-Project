import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../core/middlewares/auth.middleware';
import { DuyuruService } from './duyuru.service';
import { Roller } from '../../../generated/prisma/enums';

export const DuyuruController = {
  async getDuyurular(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.kullanici;
      if (!user) {
        res.status(401).json({ hata: 'Yetkisiz erişim. Lütfen giriş yapın.' });
        return;
      }

      // Yonetici ve Mudur tum duyurulari gorebilsin, digerleri rollerine gore
      if (user.role === Roller.YONETICI || user.role === Roller.MUDUR) {
        const duyurular = await DuyuruService.listAll();
        res.json(duyurular);
        return;
      } else {
        const duyurular = await DuyuruService.listForRole(user.role);
        res.json(duyurular);
        return;
      }
    } catch (e) {
      next(e);
    }
  },

  async duyuruOlustur(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.kullanici;
      if (!user) {
        res.status(401).json({ hata: 'Yetkisiz erişim. Lütfen giriş yapın.' });
        return;
      }

      const { baslik, icerik, hedefRol } = req.body;
      if (!baslik || !icerik) {
        res.status(400).json({ hata: 'Başlık ve içerik alanları zorunludur.' });
        return;
      }

      const yeniDuyuru = await DuyuruService.create(user.id, baslik, icerik, hedefRol || 'HEPSI');
      res.status(201).json(yeniDuyuru);
    } catch (e) {
      next(e);
    }
  },

  async duyuruSil(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ hata: 'Duyuru ID gereklidir.' });
        return;
      }

      await DuyuruService.delete(id as string);
      res.json({ success: true, message: 'Duyuru başarıyla silindi.' });
    } catch (e) {
      next(e);
    }
  }
};
