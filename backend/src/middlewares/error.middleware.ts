import { ErrorRequestHandler } from "express";
import { ErrorHandler } from "../utils/handlers";
import { ValidationError } from "yup";
import { logger } from "../utils/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware: ErrorRequestHandler = (err: ErrorHandler, _req, res, _next) => {
  console.error(err);
  logger.error(err.message);

  err.message ||= "Internal Server Error Occurred";
  err.statusCode ||= 500;

  if ((err as unknown as { code?: number }).code === 11000) {
    const field = Object.keys((err as unknown as { keyValue?: Record<string, unknown> }).keyValue || {})[0];
    err = new ErrorHandler(field === "email" ? "User already exists" : "This record already exists", 409);
  }

  if (err instanceof ValidationError) {
    if (err.errors.length > 1) {
      res.status(400).json({
        success: false,
        message: err.errors
      });
      return;
    }
    err = new ErrorHandler(err.errors[0], 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};
