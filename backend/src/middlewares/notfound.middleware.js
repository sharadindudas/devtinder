export const notfoundMiddleware = (req, res, next) => {
    // Return the response
    res.status(404).json({
        success: false,
        message: "Oops! Route not found"
    });
};
