import { body } from 'express-validator';

export const dersOlusturValidation = [
  body('isim').isString().notEmpty().withMessage('Ders ismi zorunludur.'),
  body('ders_suresi').isInt({ min: 1 }).withMessage('Ders süresi zorunlu ve pozitif bir sayı olmalıdır.')
];

export const dersGuncelleValidation = [
  body('isim').optional().isString().withMessage('Ders ismi string olmalıdır.'),
  body('ders_suresi').optional().isInt({ min: 1 }).withMessage('Ders süresi pozitif bir sayı olmalıdır.')
];
