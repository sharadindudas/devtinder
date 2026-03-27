import type { ErrorRequestHandler } from "express";
import { ErrorHandler } from "../utils/handlers";
import { logger } from "../utils/logger";
import { ValiError } from "valibot";

export const errorMiddleware: ErrorRequestHandler = (err: ErrorHandler, req, res, next) => {
  console.error(err);
  logger.error(err.message);

  err.message ||= "Internal Server Error Occurred";
  err.statusCode ||= 500;

  if (err instanceof ValiError) {
    const message = err.issues?.[0]?.message || "Validation failed";
    return res.status(400).json({
      success: false,
      message
    });
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};
