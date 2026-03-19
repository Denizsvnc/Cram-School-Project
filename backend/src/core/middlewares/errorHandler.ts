import { Request, Response, NextFunction } from "express";
import { HttpError } from "../../modules/errors/HttpError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Bizim özel hatamızsa
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      mesaj: err.message,
      statusCode: err.statusCode,
    });
  }

  // Beklenmeyen hata
  console.error(err);

  return res.status(500).json({
    success: false,
    mesaj: "Beklenmeyen sunucu hatası",
  });
};