import type { Response } from "express";

export const sendResponse = (res: Response, statusCode: number, message: string, data?: unknown) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

