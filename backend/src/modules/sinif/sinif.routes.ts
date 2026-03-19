import {Router} from 'express';
import * as sinifController from './sinif.controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { Roller } from '../../../generated/prisma/enums';
import { yetkiKontrol } from '../../core/middlewares/role.middleware';
const router = Router();

router.post('/', requireAuth, sinifController.sinifOlustur);
router.get('/liste', requireAuth, sinifController.siniflariGetir);
router.get('/detay/:isim', requireAuth, sinifController.sinifDetayGetir);

router.post('/ogrenci-ekle', requireAuth,yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), sinifController.sinifaOgrenciEkle);
router.put('/ogrenci-cikar', requireAuth,yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), sinifController.ogrenciyiSiniftanCikar);
router.delete('/:isim', requireAuth,yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), sinifController.sinifSil);
router.get('/personel/:personelNo', requireAuth,yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN]), sinifController.personelSiniflariGetir);
router.get('/ogrenciler/:isim', requireAuth,yetkiKontrol([Roller.YONETICI, Roller.MUDUR, Roller.OGRETMEN, Roller.PERSONEL]), sinifController.sinifOgrencileriGetir);



export default router;