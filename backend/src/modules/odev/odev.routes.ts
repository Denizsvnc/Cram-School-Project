import { Router } from 'express';
import { OdevController } from './odev.controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { Roller } from '../../../generated/prisma/enums';
import { yetkiKontrol } from '../../core/middlewares/role.middleware';

const router = Router();

// --- Ödev Rotaları ---
router.post('/', requireAuth, yetkiKontrol([Roller.OGRETMEN, Roller.YONETICI, Roller.MUDUR]), OdevController.createOdev);
router.get('/ogretmen', requireAuth, yetkiKontrol([Roller.OGRETMEN, Roller.YONETICI, Roller.MUDUR]), OdevController.getOgretmenOdevleri);
router.get('/ogrenci', requireAuth, yetkiKontrol([Roller.OGRENCI]), OdevController.getOgrenciOdevleri);
router.get('/veli/:ogrenciId', requireAuth, yetkiKontrol([Roller.VELI, Roller.YONETICI, Roller.MUDUR]), OdevController.getVeliOdevleri);
router.get('/:odevId/teslimler', requireAuth, yetkiKontrol([Roller.OGRETMEN, Roller.YONETICI, Roller.MUDUR]), OdevController.getOdevTeslimler);
router.post('/ogrenci/teslim/:odevId', requireAuth, yetkiKontrol([Roller.OGRENCI]), OdevController.toggleOgrenciOdevTeslim);
router.put('/teslim/:teslimId', requireAuth, yetkiKontrol([Roller.OGRETMEN, Roller.YONETICI, Roller.MUDUR]), OdevController.updateTeslimByTeacher);
router.delete('/:id', requireAuth, yetkiKontrol([Roller.OGRETMEN, Roller.YONETICI, Roller.MUDUR]), OdevController.deleteOdev);

// --- Materyal Rotaları ---
router.post('/materyal', requireAuth, yetkiKontrol([Roller.OGRETMEN, Roller.YONETICI, Roller.MUDUR]), OdevController.createMateryal);
router.get('/materyal/ogrenci', requireAuth, yetkiKontrol([Roller.OGRENCI]), OdevController.getOgrenciMateryalleri);
router.get('/materyal/veli/:ogrenciId', requireAuth, yetkiKontrol([Roller.VELI, Roller.YONETICI, Roller.MUDUR]), OdevController.getVeliMateryalleri);
router.get('/materyal/ogretmen', requireAuth, yetkiKontrol([Roller.OGRETMEN, Roller.YONETICI, Roller.MUDUR]), OdevController.getOgretmenMateryalleri);
router.delete('/materyal/:id', requireAuth, yetkiKontrol([Roller.OGRETMEN, Roller.YONETICI, Roller.MUDUR]), OdevController.deleteMateryal);

export default router;
