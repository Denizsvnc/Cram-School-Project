import { body } from 'express-validator';

export const dersProgramiOlusturValidation = [
  body('sinifId').isString().notEmpty().withMessage('Sınıf ID zorunludur.'),
  body('dersId').isString().notEmpty().withMessage('Ders ID zorunludur.'),
  body('ogretmenId').isString().notEmpty().withMessage('Öğretmen ID zorunludur.'),
  body('gun').isInt({ min: 1, max: 7 }).withMessage('Gün 1-7 arası bir sayı olmalıdır.'),
  body('baslangic').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Başlangıç saati HH:mm formatında olmalıdır.'),
  body('bitis').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Bitiş saati HH:mm formatında olmalıdır.')
];

export const dersProgramiGuncelleValidation = [
  body('sinifId').optional().isString(),
  body('dersId').optional().isString(),
  body('ogretmenId').optional().isString(),
  body('gun').optional().isInt({ min: 1, max: 7 }),
  body('baslangic').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
  body('bitis').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
];
