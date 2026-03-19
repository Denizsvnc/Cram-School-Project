import {Router} from 'express';
import * as kullaniciController from './kullanici.controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
const router = Router();

router.get('/ogrenciler', requireAuth, kullaniciController.ogrencileriGetir);
router.get('/ogrenci/:ogrenciNo', requireAuth, kullaniciController.ogrenciGetirById);
router.delete("/ogrenci/:ogrenciNo", requireAuth, kullaniciController.ogrenciSil);
router.put("/ogrenci/:ogrenciNo", requireAuth, kullaniciController.ogrenciGuncelle);

router.get('/personeller', requireAuth, kullaniciController.personelleriGetir);
router.get('/personel/:personelNo', requireAuth, kullaniciController.personelGetirById);
router.delete("/personel/:personelNo", requireAuth, kullaniciController.personelSil);
router.put("/personel/:personelNo", requireAuth, kullaniciController.personelGuncelle);

router.get('/personel/mudurler', requireAuth, kullaniciController.mudurleriGetir);
router.get('/personel/ogretmenler', requireAuth, kullaniciController.ogretmenleriGetir);
router.get('/personel/personeller', requireAuth, kullaniciController.personellerGetir);

export default router;