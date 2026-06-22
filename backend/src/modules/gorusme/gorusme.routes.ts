import { Router } from 'express';
import { GorusmeController } from './gorusme.controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { Roller } from '../../../generated/prisma/enums';
import { yetkiKontrol } from '../../core/middlewares/role.middleware';

const router = Router();

// --- Sınav Takvimi ---
router.get('/sinav-takvimi', requireAuth, GorusmeController.getSinavTakvimi);
router.post('/sinav-takvimi', requireAuth, yetkiKontrol([Roller.OGRETMEN, Roller.YONETICI, Roller.MUDUR]), GorusmeController.createSinavTakvimi);
router.delete('/sinav-takvimi/:id', requireAuth, yetkiKontrol([Roller.OGRETMEN, Roller.YONETICI, Roller.MUDUR]), GorusmeController.deleteSinavTakvimi);

// --- Veli Görüşmeleri ---
router.get('/veli-gorusme', requireAuth, GorusmeController.getVeliGorusmeleri);
router.post('/veli-gorusme', requireAuth, yetkiKontrol([Roller.VELI]), GorusmeController.createVeliGorusme);
router.put('/veli-gorusme/:id/durum', requireAuth, yetkiKontrol([Roller.OGRETMEN]), GorusmeController.updateVeliGorusmeDurum);
router.delete('/veli-gorusme/:id', requireAuth, GorusmeController.deleteVeliGorusme);

export default router;
