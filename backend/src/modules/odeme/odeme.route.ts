import { Router } from 'express';
import { OdemeController } from './odeme.controller';
import { getOdemelerValidation, odemeIslemValidation } from './odeme.validate';
import validateRequest from '../../core/middlewares/validateRequest';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { Roller } from '../../../generated/prisma/enums';
import { yetkiKontrol } from '../../core/middlewares/role.middleware';

const router = Router();

router.get('/finansal-ozet', requireAuth, yetkiKontrol([Roller.YONETICI, Roller.MUDUR]), OdemeController.getFinansalOzet);
router.get('/kullanici/:id', getOdemelerValidation, validateRequest, OdemeController.getOdemeler);
router.get('/bekleyenler', OdemeController.getBekleyenOdemeler);
router.post('/yap/:id', odemeIslemValidation, validateRequest, OdemeController.odemeYap);
router.put('/onayla/:id', odemeIslemValidation, validateRequest, OdemeController.odemeOnayla);

export const odemeRouter = router;
