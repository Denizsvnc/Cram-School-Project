import {Router} from 'express';
import * as kullaniciController from './kullanici.controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
const router = Router();

router.get('/ogrenciler', requireAuth, kullaniciController.ogrencileriGetir);
router.get('/ogrenci/:ogrenciNo', requireAuth, kullaniciController.ogrenciGetirById);

router.get('/personeller', requireAuth, kullaniciController.personelleriGetir);
router.get('/personel/:personelNo', requireAuth, kullaniciController.personelGetirById);

router.get('/personel/mudurler', requireAuth, kullaniciController.mudurleriGetir);
router.get('/personel/ogretmenler', requireAuth, kullaniciController.ogretmenleriGetir);
router.get('/personel/personeller', requireAuth, kullaniciController.personellerGetir);

export default router;