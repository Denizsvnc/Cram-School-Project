import {Router} from 'express';
import * as sinifController from './sinif.controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
const router = Router();

router.post('/', requireAuth, sinifController.sinifOlustur);
router.get('/liste', requireAuth, sinifController.siniflariGetir);
router.get('/detay/:isim', requireAuth, sinifController.sinifDetayGetir);
router.post('/ogrenci-ekle', requireAuth, sinifController.sinifaOgrenciEkle);
router.put('/ogrenci-cikar', requireAuth, sinifController.ogrenciyiSiniftanCikar);
router.delete('/:isim', requireAuth, sinifController.sinifSil);
router.get('/personel/:personelNo', requireAuth, sinifController.personelSiniflariGetir);
router.get('/ogrenciler/:isim', requireAuth, sinifController.sinifOgrencileriGetir);



export default router;