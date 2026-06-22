import { Router } from 'express';
import { DuyuruController } from './duyuru.controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { Roller } from '../../../generated/prisma/enums';
import { yetkiKontrol } from '../../core/middlewares/role.middleware';

const router = Router();

// Duyuruları Listele (giriş yapmış olan herkes kendi rolüne göre çeker)
router.get('/', requireAuth, DuyuruController.getDuyurular);

// Duyuru Ekle (Yalnızca Yönetici ve Müdür)
router.post('/', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), DuyuruController.duyuruOlustur);

// Duyuru Sil (Yalnızca Yönetici ve Müdür)
router.delete('/:id', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), DuyuruController.duyuruSil);

export default router;
