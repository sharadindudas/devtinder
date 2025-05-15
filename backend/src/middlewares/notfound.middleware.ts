import { RequestHandler } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notfoundMiddleware: RequestHandler = (_req, res, _next) => {
    // Return the response
    res.status(404).json({
        success: false,
        message: "Oops! Route not found"
    });
};
