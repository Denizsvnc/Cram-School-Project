import { Request, Response, NextFunction } from 'express';
import { Roller } from '../../../generated/prisma/enums';
import { UnauthorizedError } from '../../modules/errors/customErrors';

export const yetkiKontrol = (izinVerilenRoller: Roller[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
     
        const kullanici = (req as any).kullanici;

        if (!kullanici) {
            return next(new UnauthorizedError("Giriş yapmanız gerekiyor."));
        }

        if (!izinVerilenRoller.includes(kullanici.role)) {
            return res.status(403).json({ 
                message: "Bu işlem için yetkiniz bulunmamaktadır." 
            });
        }

        next();
    };
};