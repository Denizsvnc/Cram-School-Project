import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import * as izinController from './izin.controller';

const router = Router();

// Öğretmen / Personel kendi izinlerini oluşturur ve görür
router.post('/', requireAuth, izinController.izinTalebiOlustur);
router.get('/benimkiler', requireAuth, izinController.kendiIzinTaleplerimiGetir);

// Yönetici ve Müdürler tüm izinleri görür ve onaylar
router.get('/', requireAuth, izinController.tumIzinTalepleriniGetir);
router.patch('/:id/durum', requireAuth, izinController.izinTalebiDurumGuncelle);

export default router;
