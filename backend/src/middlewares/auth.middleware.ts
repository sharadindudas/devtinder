import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { UserModel } from "../models/user.model";
import { JWT_SECRET } from "../config/config";
import jwt from "jsonwebtoken";
import type { DecodedPayload } from "../types/common";

export const requireAuth = AsyncHandler(async (req, res, next) => {
  const { devtinderToken } = req.cookies;

  if (!devtinderToken) {
    throw new ErrorHandler("Please login to continue", 401);
  }

  const decodedPayload = jwt.verify(devtinderToken, JWT_SECRET) as DecodedPayload;

  const user = await UserModel.findById(decodedPayload._id);
  if (!user) throw new ErrorHandler("User does not exists", 404);

  res.locals.user = user;
  next();
});
