import { Router } from 'express';
import { kayit, giris, refresh, logout } from './auth.controller';

const router = Router();

// POST http://localhost:3000/auth/kayit
router.post('/kayit', kayit);

// POST http://localhost:3000/auth/giris
router.post('/giris', giris);

// POST http://localhost:3000/auth/refresh
router.post('/refresh', refresh);

// POST http://localhost:3000/auth/logout
router.post('/logout', logout);

export default router;