import { RequestHandler } from "express";

export const notfoundMiddleware: RequestHandler = (_req, res, _next) => {
    // Return the response
    res.status(404).json({
        success: false,
        message: "Oops! Route not found"
    });
};
