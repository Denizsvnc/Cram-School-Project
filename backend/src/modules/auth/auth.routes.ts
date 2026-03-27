import { Router } from 'express';
import { kayit, giris, refresh, logout } from './auth.controller';
import { registerValidation, loginValidation } from './auth.validate';
import validateRequest from '../../core/middlewares/validateRequest';

const router = Router();

// POST http://localhost:3000/auth/kayit
router.post('/kayit', registerValidation, validateRequest, kayit);

// POST http://localhost:3000/auth/giris
router.post('/giris', loginValidation, validateRequest, giris);

// POST http://localhost:3000/auth/refresh
router.post('/refresh', refresh);

// POST http://localhost:3000/auth/logout
router.post('/logout', logout);

export default router;