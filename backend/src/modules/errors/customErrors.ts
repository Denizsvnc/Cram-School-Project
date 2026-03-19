import { HttpError } from "./HttpError";

export class NotFoundError extends HttpError {
  constructor(message?: string) {
    super(404, message || "Kayıt bulunamadı");
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message?: string) {
    super(401, message || "Giriş yapmanız gerekiyor");
  }
}