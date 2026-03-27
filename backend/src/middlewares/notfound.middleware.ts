import type { RequestHandler } from "express";

export const notfoundMiddleware: RequestHandler = (_req, res, _next) => {
  res.status(404).json({
    success: false,
    message: "Oops! Route not found"
  });
};
