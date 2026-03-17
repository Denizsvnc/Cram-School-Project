import { Router } from 'express';
import { kayit, giris } from './auth.controller';

const router = Router();

// POST http://localhost:3005/kayit
router.post('/kayit', kayit);

// POST http://localhost:3005/giris
router.post('/giris', giris);

export default router;