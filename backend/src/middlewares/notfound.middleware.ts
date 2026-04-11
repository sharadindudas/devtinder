import type { RequestHandler } from "express";

export const notfoundMiddleware: RequestHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Oops! Route not found"
  });
};
