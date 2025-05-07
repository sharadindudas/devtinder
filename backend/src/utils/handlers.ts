import { NextFunction, Request, RequestHandler, Response } from "express";

// Async await handler
const AsyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

// Error handler
class ErrorHandler extends Error {
    constructor(
        public message: string,
        public statusCode: number
    ) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export { AsyncHandler, ErrorHandler };
