import { AsyncHandler, ErrorHandler } from "../utils/handlers.js";
import { JWT_SECRET } from "../config/config.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

const userAuth = AsyncHandler(async (req, res, next) => {
    // Get token from request cookies
    const { devtinderToken } = req.cookies;

    // Validation of token
    if (!devtinderToken) {
        throw new ErrorHandler("Please login to continue", 401);
    }

    // Decode the token
    const decodedPayload = jwt.verify(devtinderToken, JWT_SECRET);

    // Get user data
    const user = await UserModel.findById(decodedPayload._id);
    if (!user) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Pass the user data inside request object
    req.user = user;

    // Move to next handler function
    next();
});

export { userAuth };
