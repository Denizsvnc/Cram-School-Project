import { Request, Response, NextFunction } from 'express';
import { OdemeService } from './odeme.service';

export const OdemeController = {
  getOdemeler: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const odemeler = await OdemeService.getOdemelerByKullaniciId(id as string);
      res.json(odemeler);
    } catch (e) {
      next(e);
    }
  },

  getBekleyenOdemeler: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const odemeler = await OdemeService.getBekleyenOdemeler();
      res.json(odemeler);
    } catch (e) {
      next(e);
    }
  },

  odemeYap: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const odeme = await OdemeService.odemeYap(id as string);
      res.json(odeme);
    } catch (e) {
      next(e);
    }
  },

  odemeOnayla: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const odeme = await OdemeService.odemeOnayla(id as string);
      res.json({ success: true, message: 'Ödeme onaylandı', odeme });
    } catch (e) {
      next(e);
    }
  }
};
