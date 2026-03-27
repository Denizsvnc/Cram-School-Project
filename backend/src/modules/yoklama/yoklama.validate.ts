import { body } from 'express-validator';

export const yoklamaOlusturValidation = [
  body('ogrenciId').isString().notEmpty().withMessage('Öğrenci ID zorunludur.'),
  body('dersProgramiId').isString().notEmpty().withMessage('Ders Programı ID zorunludur.'),
  body('tarih').optional().isISO8601().withMessage('Tarih geçerli bir ISO formatında olmalıdır.'),
  body('derseKatildiMi').optional().isBoolean().withMessage('Derse katıldı mı alanı boolean olmalıdır.')
];

export const yoklamaGuncelleValidation = [
  body('tarih').optional().isISO8601(),
  body('derseKatildiMi').optional().isBoolean()
];
