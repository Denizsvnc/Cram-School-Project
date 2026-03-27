import { body } from 'express-validator';

export const kullaniciOlusturValidation = [
  body('isim').isString().notEmpty().withMessage('İsim zorunludur.'),
  body('soy_isim').isString().notEmpty().withMessage('Soyisim zorunludur.'),
  body('mail').isEmail().withMessage('Geçerli bir email giriniz.'),
  body('tc_no').isString().notEmpty().withMessage('TC Kimlik numarası zorunludur.'),
  body('rol').isString().notEmpty().withMessage('Rol zorunludur.')
];

export const kullaniciGuncelleValidation = [
  body('isim').optional().isString(),
  body('soy_isim').optional().isString(),
  body('mail').optional().isEmail(),
  body('tc_no').optional().isString(),
  body('rol').optional().isString()
];
