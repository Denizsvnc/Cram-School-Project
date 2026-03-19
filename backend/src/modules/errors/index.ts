import { HTTP_ERRORS, HttpStatusCode } from "./httpErrors";

export class HttpError extends Error {
  public statusCode: HttpStatusCode;

  constructor(statusCode: HttpStatusCode, message?: string) {
    super(message || HTTP_ERRORS[statusCode]);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
