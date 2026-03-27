import { Router } from 'express';
import * as kullaniciController from './kullanici.controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { Roller } from '../../../generated/prisma/enums';
import { yetkiKontrol } from '../../core/middlewares/role.middleware';
import { kullaniciOlusturValidation, kullaniciGuncelleValidation } from './kullanici.validate';
import validateRequest from '../../core/middlewares/validateRequest';

const router = Router();

// Yeni Kullanıcı Ekleme
router.post('/ekle', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciOlusturValidation, validateRequest, kullaniciController.kullaniciOlustur);

// Öğrenci rotaları
router.get('/ogrenciler', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), kullaniciController.ogrencileriGetir);
router.get('/ogrenci/:ogrenciNo', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), kullaniciController.ogrenciGetirById);
router.delete("/ogrenci/:ogrenciNo", requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciController.ogrenciSil);
router.put("/ogrenci/:ogrenciNo", requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciGuncelleValidation, validateRequest, kullaniciController.ogrenciGuncelle);

// Personel listeleme rotaları
router.get('/personeller', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciController.personelleriGetir);
router.get('/mudurler', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciController.mudurleriGetir);
router.get('/ogretmenler', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciController.ogretmenleriGetir);
router.get('/personel-listesi', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciController.personellerGetir);

// Veli rotaları
router.get('/veliler', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciController.velileriGetir);
router.get('/veli/:id', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciController.veliGetirById);
router.get('/veli/:id', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciController.veliGetirById);
router.delete('/veli/:id', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciController.veliSil);
router.patch('/veli/:id', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciGuncelleValidation, validateRequest, kullaniciController.veliGuncelle);

// Parametrik personel rotaları
router.get('/personel/:personelNo', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciController.personelGetirById);
router.delete("/personel/:personelNo", requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciController.personelSil);
router.patch("/personel/:personelNo", requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), kullaniciGuncelleValidation, validateRequest, kullaniciController.personelGuncelle);

export default router;