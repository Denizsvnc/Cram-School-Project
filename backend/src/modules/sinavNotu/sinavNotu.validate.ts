import { body } from 'express-validator';

export const sinavNotuOlusturValidation = [
  body('ogrenciId').isString().notEmpty().withMessage('Öğrenci ID zorunludur.'),
  body('dersId').isString().notEmpty().withMessage('Ders ID zorunludur.'),
  body('sinavAdi').isString().notEmpty().withMessage('Sınav adı zorunludur.'),
  body('puan').isNumeric().withMessage('Puan zorunlu ve sayısal olmalıdır.')
];

export const sinavNotuGuncelleValidation = [
  body('sinavAdi').optional().isString(),
  body('puan').optional().isNumeric()
];
