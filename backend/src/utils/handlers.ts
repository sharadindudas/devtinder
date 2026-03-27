import type { NextFunction, Request, RequestHandler, Response } from "express";

const AsyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

class ErrorHandler extends Error {
  constructor(
    public override message: string,
    public statusCode: number
  ) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { AsyncHandler, ErrorHandler };
