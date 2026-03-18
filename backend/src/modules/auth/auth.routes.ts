import { Router } from 'express';
import { kayit, giris, refresh, logout } from './auth.controller';

const router = Router();

// POST http://localhost:3005/kayit
router.post('/kayit', kayit);

// POST http://localhost:3005/giris
router.post('/giris', giris);

// POST http://localhost:3005/refresh
router.post('/refresh', refresh);

// POST http://localhost:3005/logout
router.post('/logout', logout);

export default router;