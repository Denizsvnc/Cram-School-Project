import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../core/middlewares/auth.middleware';
import { OdevService } from './odev.service';
import { getPrismaClient } from '../../core/config/prisma';

const prisma = getPrismaClient();

export const OdevController = {
  // --- Ödev Controller Metotları ---

  async createOdev(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.kullanici;
      if (!user) {
        res.status(401).json({ hata: 'Yetkisiz erişim. Lütfen giriş yapın.' });
        return;
      }

      const { baslik, aciklama, teslimTarihi, sinifId, dersId } = req.body;
      if (!baslik || !teslimTarihi || !sinifId || !dersId) {
        res.status(400).json({ hata: 'Başlık, teslim tarihi, sınıf ve ders alanları zorunludur.' });
        return;
      }

      const yeniOdev = await OdevService.createOdev(
        user.id,
        baslik,
        aciklama || '',
        new Date(teslimTarihi),
        sinifId,
        dersId
      );
      res.status(201).json(yeniOdev);
    } catch (e) {
      next(e);
    }
  },

  async getOgretmenOdevleri(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.kullanici;
      if (!user) {
        res.status(401).json({ hata: 'Yetkisiz erişim. Lütfen giriş yapın.' });
        return;
      }

      const odevler = await OdevService.listOdevlerByOgretmen(user.id);
      res.json(odevler);
    } catch (e) {
      next(e);
    }
  },

  async getOgrenciOdevleri(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.kullanici;
      if (!user) {
        res.status(401).json({ hata: 'Yetkisiz erişim. Lütfen giriş yapın.' });
        return;
      }

      const ogrenci = await prisma.kullanici.findUnique({
        where: { id: user.id },
        select: { sinifId: true }
      });

      if (!ogrenci || !ogrenci.sinifId) {
        res.json([]);
        return;
      }

      const odevler = await OdevService.listOdevlerBySinif(ogrenci.sinifId, user.id);
      res.json(odevler);
    } catch (e) {
      next(e);
    }
  },

  async getVeliOdevleri(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { ogrenciId } = req.params;
      if (!ogrenciId) {
        res.status(400).json({ hata: 'Öğrenci ID gereklidir.' });
        return;
      }

      const ogrenci = await prisma.kullanici.findUnique({
        where: { id: ogrenciId as string },
        select: { sinifId: true }
      });

      if (!ogrenci || !ogrenci.sinifId) {
        res.json([]);
        return;
      }

      const odevler = await OdevService.listOdevlerBySinif(ogrenci.sinifId, ogrenciId as string);
      res.json(odevler);
    } catch (e) {
      next(e);
    }
  },

  async getOdevTeslimler(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { odevId } = req.params;
      if (!odevId) {
        res.status(400).json({ hata: 'Ödev ID gereklidir.' });
        return;
      }

      const teslimler = await OdevService.getOdevTeslimler(odevId as string);
      res.json(teslimler);
    } catch (e) {
      next(e);
    }
  },

  async toggleOgrenciOdevTeslim(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.kullanici;
      if (!user) {
        res.status(401).json({ hata: 'Yetkisiz erişim. Lütfen giriş yapın.' });
        return;
      }

      const { odevId } = req.params;
      const { tamamlandi } = req.body;

      if (!odevId || tamamlandi === undefined) {
        res.status(400).json({ hata: 'Ödev ID ve tamamlandı durumu gereklidir.' });
        return;
      }

      const sonuc = await OdevService.toggleTeslimDurumu(odevId as string, user.id, !!tamamlandi);
      res.json(sonuc);
    } catch (e) {
      next(e);
    }
  },

  async updateTeslimByTeacher(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { teslimId } = req.params;
      const { tamamlandi } = req.body;

      if (!teslimId || tamamlandi === undefined) {
        res.status(400).json({ hata: 'Teslim ID ve tamamlandı durumu gereklidir.' });
        return;
      }

      const sonuc = await OdevService.updateTeslimByTeacher(teslimId as string, !!tamamlandi);
      res.json(sonuc);
    } catch (e) {
      next(e);
    }
  },

  async deleteOdev(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ hata: 'Ödev ID gereklidir.' });
        return;
      }

      await OdevService.deleteOdev(id as string);
      res.json({ success: true, message: 'Ödev başarıyla silindi.' });
    } catch (e) {
      next(e);
    }
  },

  // --- Materyal Controller Metotları ---

  async createMateryal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.kullanici;
      if (!user) {
        res.status(401).json({ hata: 'Yetkisiz erişim. Lütfen giriş yapın.' });
        return;
      }

      const { baslik, aciklama, dosyaUrl, sinifId, dersId } = req.body;
      if (!baslik || !dosyaUrl || !sinifId || !dersId) {
        res.status(400).json({ hata: "Başlık, dosya URL'i, sınıf ve ders alanları zorunludur." });
        return;
      }

      const yeniMateryal = await OdevService.createMateryal(
        user.id,
        baslik,
        aciklama,
        dosyaUrl,
        sinifId,
        dersId
      );
      res.status(201).json(yeniMateryal);
    } catch (e) {
      next(e);
    }
  },

  async getOgrenciMateryalleri(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.kullanici;
      if (!user) {
        res.status(401).json({ hata: 'Yetkisiz erişim. Lütfen giriş yapın.' });
        return;
      }

      const ogrenci = await prisma.kullanici.findUnique({
        where: { id: user.id },
        select: { sinifId: true }
      });

      if (!ogrenci || !ogrenci.sinifId) {
        res.json([]);
        return;
      }

      const materyaller = await OdevService.listMateryalBySinif(ogrenci.sinifId);
      res.json(materyaller);
    } catch (e) {
      next(e);
    }
  },

  async getVeliMateryalleri(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { ogrenciId } = req.params;
      if (!ogrenciId) {
        res.status(400).json({ hata: 'Öğrenci ID gereklidir.' });
        return;
      }

      const ogrenci = await prisma.kullanici.findUnique({
        where: { id: ogrenciId as string },
        select: { sinifId: true }
      });

      if (!ogrenci || !ogrenci.sinifId) {
        res.json([]);
        return;
      }

      const materyaller = await OdevService.listMateryalBySinif(ogrenci.sinifId);
      res.json(materyaller);
    } catch (e) {
      next(e);
    }
  },

  async getOgretmenMateryalleri(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.kullanici;
      if (!user) {
        res.status(401).json({ hata: 'Yetkisiz erişim. Lütfen giriş yapın.' });
        return;
      }

      const materyaller = await OdevService.listMateryalByOgretmen(user.id);
      res.json(materyaller);
    } catch (e) {
      next(e);
    }
  },

  async deleteMateryal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ hata: 'Materyal ID gereklidir.' });
        return;
      }

      await OdevService.deleteMateryal(id as string);
      res.json({ success: true, message: 'Ders materyali başarıyla silindi.' });
    } catch (e) {
      next(e);
    }
  }
};
