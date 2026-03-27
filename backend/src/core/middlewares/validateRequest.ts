import { Request, Response, NextFunction } from "express";
import { validationResult } from 'express-validator';

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.array().map((err) => ({
                field: (err as any).param || (err as any).path || '',
                message: err.msg
            }))
        });
    }
    next();
};

export default validateRequest;