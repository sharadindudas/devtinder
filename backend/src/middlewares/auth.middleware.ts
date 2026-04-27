import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import { UserModel } from "../models/user.model";
import type { JwtUserPayload } from "../types/express";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";

export const requireAuth = AsyncHandler(async (req, res, next) => {
  const { devtinderToken } = req.cookies;

  if (!devtinderToken) {
    throw new ErrorHandler("Please login to continue", 401);
  }

  const decodedPayload = jwt.verify(devtinderToken, JWT_SECRET) as JwtUserPayload;

  const user = await UserModel.findById(decodedPayload._id);
  if (!user) throw new ErrorHandler("User does not exists", 404);

  res.locals.user = user;
  next();
});
