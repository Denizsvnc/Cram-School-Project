import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Geçerli bir email giriniz.'),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı.'),
  body('rol').notEmpty().withMessage('Rol alanı zorunludur.'),
  body('isim').notEmpty().withMessage('İsim alanı zorunludur.'),
  body('soy_isim').notEmpty().withMessage('Soyisim alanı zorunludur.'),
  body('tel_no').notEmpty().withMessage('Telefon numarası zorunludur.'),
  body('tc_no').notEmpty().withMessage('TC Kimlik numarası zorunludur.'),
  body('dogum_tarihi').notEmpty().withMessage('Doğum tarihi zorunludur.'),
  body('egitim_durumu').notEmpty().withMessage('Eğitim durumu zorunludur.'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Geçerli bir email giriniz.'),
  body('password').notEmpty().withMessage('Şifre zorunludur.')
];
