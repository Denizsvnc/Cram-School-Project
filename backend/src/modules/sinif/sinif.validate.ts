import { body } from 'express-validator';

export const sinifOlusturValidation = [
  body('isim').isString().notEmpty().withMessage('Sınıf ismi zorunludur.'),
  body('kapasite').isInt({ min: 1 }).withMessage('Kapasite zorunlu ve pozitif bir sayı olmalıdır.')
];

export const sinifGuncelleValidation = [
  body('isim').optional().isString(),
  body('kapasite').optional().isInt({ min: 1 })
];
