import { Router } from 'express';
import * as sinavNotuController from './sinavNotu.controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { Roller } from '../../../generated/prisma/enums';
import { yetkiKontrol } from '../../core/middlewares/role.middleware';
import { sinavNotuOlusturValidation, sinavNotuGuncelleValidation } from './sinavNotu.validate';
import validateRequest from '../../core/middlewares/validateRequest';

const router = Router();

// Sınav notu oluşturma (Yönetici, Müdür, Öğretmen)
router.post('/olustur', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), sinavNotuOlusturValidation, validateRequest, sinavNotuController.notOlustur);

// Sınav notu güncelleme (Yönetici, Müdür, Öğretmen)
router.put('/:id', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), sinavNotuGuncelleValidation, validateRequest, sinavNotuController.notGuncelle);

// Sınav notu silme (Yönetici, Müdür, Öğretmen)
router.delete('/:id', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), sinavNotuController.notSil);

// Tek sınav notu getirme (Tüm roller erişebilir)
router.get('/:id', requireAuth, yetkiKontrol([
	Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN, Roller.OGRENCI, Roller.VELI
]), sinavNotuController.notGetir);

// Öğrencinin tüm sınav notları (Yönetici, Müdür, Öğretmen, Öğrenci, Veli)
router.get('/ogrenci/:ogrenciId', requireAuth, yetkiKontrol([
	Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN, Roller.OGRENCI, Roller.VELI
]), sinavNotuController.ogrenciNotlari);

// Dersin tüm sınav notları (Yönetici, Müdür, Öğretmen)
router.get('/ders/:dersId', requireAuth, yetkiKontrol([
	Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN
]), sinavNotuController.dersNotlari);

export default router;