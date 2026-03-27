import { param } from 'express-validator';

export const getOdemelerValidation = [
  param('id').isUUID().withMessage('Geçerli bir kullanıcı ID (UUID) girilmelidir.')
];

export const odemeIslemValidation = [
  param('id').isUUID().withMessage('Geçerli bir ödeme ID (UUID) girilmelidir.')
];
