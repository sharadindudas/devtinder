import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { UserModel } from "../models/user.model";
import { DecodedPayload } from "../@types/types";
import { JWT_SECRET } from "../config/config";
import jwt from "jsonwebtoken";

export const userAuth = AsyncHandler(async (req, _res, next) => {
    // Get token from request cookies
    const { devtinderToken } = req.cookies;

    // Validation of token
    if (!devtinderToken) {
        throw new ErrorHandler("Please login to continue", 401);
    }

    // Decode the token
    const decodedPayload = jwt.verify(devtinderToken, JWT_SECRET) as DecodedPayload;

    // Get the user details
    const user = await UserModel.findById(decodedPayload._id);
    if (!user) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Pass the decoded payload and user details
    req.decoded = decodedPayload;
    req.user = user;

    // Move to next handler function
    next();
});
