import { Router } from 'express';
import { OdemeController } from './odeme.controller';
import { getOdemelerValidation, odemeIslemValidation } from './odeme.validate';
import validateRequest from '../../core/middlewares/validateRequest';

const router = Router();

router.get('/kullanici/:id', getOdemelerValidation, validateRequest, OdemeController.getOdemeler);
router.get('/bekleyenler', OdemeController.getBekleyenOdemeler);
router.post('/yap/:id', odemeIslemValidation, validateRequest, OdemeController.odemeYap);
router.put('/onayla/:id', odemeIslemValidation, validateRequest, OdemeController.odemeOnayla);

export const odemeRouter = router;
