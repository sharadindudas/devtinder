import { ErrorRequestHandler } from "express";
import { ErrorHandler } from "../utils/handlers";
import { ValidationError } from "yup";
import { logger } from "../utils/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware: ErrorRequestHandler = (err: ErrorHandler, _req, res, _next) => {
    // Log all errors
    console.error(err);
    logger.error(err.message);

    // Set default error values
    err.message ||= "Internal Server Error Occurred";
    err.statusCode ||= 500;

    // Yup validation error
    if (err instanceof ValidationError) {
        const message: string[] | string = [];
        if (err.errors.length > 1) {
            err.errors.forEach((e: string) => {
                message.push(e);
            });

            res.status(400).json({
                success: false,
                message
            });
        } else {
            err = new ErrorHandler(err.errors[0], 400);
        }
    }

    // Return the response
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
