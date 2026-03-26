import { Router } from 'express';
import * as dersProramiController from './dersProgrami.controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { Roller } from '../../../generated/prisma/enums';
import { yetkiKontrol } from '../../core/middlewares/role.middleware';
const router = Router();

router.post('/olustur', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), dersProramiController.programOlustur);
router.put('/:id', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), dersProramiController.programGuncelle);
router.delete('/:id', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), dersProramiController.programSil);
router.get('/:id', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN, Roller.OGRENCI, Roller.VELI]), dersProramiController.programGetir);
router.get('/sinif/:sinifId', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), dersProramiController.sinifProgramlari);
router.get('/ders/:dersId', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), dersProramiController.dersProgramlari);    



export default router;