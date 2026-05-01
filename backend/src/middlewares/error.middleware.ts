import type { ErrorRequestHandler } from "express";
import { ErrorHandler } from "../utils/handlers";
import { logger } from "../utils/logger";
import { ValiError } from "valibot";

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  logger.error(err.message);

  if (err instanceof ValiError) {
    const message = err.issues?.[0]?.message || "Validation failed";
    return res.status(400).json({
      success: false,
      message
    });
  }

  if (err instanceof ErrorHandler) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  res.status(500).json({
    success: false,
    message: err?.message || "Internal Server Error Occurred"
  });
};
