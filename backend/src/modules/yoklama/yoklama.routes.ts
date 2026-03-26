import { Router } from 'express';
import * as yoklamaController from './yoklama.controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { Roller } from '../../../generated/prisma/enums';
import { yetkiKontrol } from '../../core/middlewares/role.middleware';
const router = Router();

router.post('/olustur', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), yoklamaController.yoklamaOlustur);

router.put('/:id', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), yoklamaController.yoklamaGuncelle);

router.delete('/:id', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), yoklamaController.yoklamaSil);

router.get('/:id', requireAuth, yetkiKontrol([
	Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN, Roller.OGRENCI, Roller.VELI
]), yoklamaController.yoklamaGetir);

router.get('/ogrenci/:ogrenciId', requireAuth, yetkiKontrol([
	Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN, Roller.OGRENCI, Roller.VELI
]), yoklamaController.ogrenciYoklamalari);

router.get('/ders-programi/:dersProgramiId', requireAuth, yetkiKontrol([
	Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN
]), yoklamaController.dersProgramiYoklamalari);

export default router;