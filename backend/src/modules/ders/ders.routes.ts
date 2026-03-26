
import {Router} from 'express';
import * as dersController from './ders.controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { Roller } from '../../../generated/prisma/enums';
import { yetkiKontrol } from '../../core/middlewares/role.middleware';
const router = Router();

router.get('/tum-dersler', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), dersController.tumDersleriGetir);
router.post('/olustur', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), dersController.dersOlustur);
router.get('/isim/:dersIsmi', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), dersController.dersGetirIsimle);
router.put('/:dersId', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), dersController.dersGuncelle);
router.delete('/:dersId', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), dersController.dersSil);

// Öğrenci ve veli kendi derslerini görebilir
router.get('/kendi-derslerim', requireAuth, yetkiKontrol([Roller.OGRENCI, Roller.VELI]), dersController.kendiDerslerim);
export default router;