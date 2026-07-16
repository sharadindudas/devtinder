import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { UserModel } from "../models/user.model";
import { DecodedPayload } from "../@types/types";
import { JWT_SECRET } from "../config/config";
import jwt from "jsonwebtoken";

export const userAuth = AsyncHandler(async (req, _res, next) => {
  const { devtinderToken } = req.cookies;

  if (!devtinderToken) {
    throw new ErrorHandler("Please login to continue", 401);
  }

  const decodedPayload = jwt.verify(devtinderToken, JWT_SECRET) as DecodedPayload;

  const user = await UserModel.findById(decodedPayload._id);
  if (!user) {
    throw new ErrorHandler("User does not exists", 404);
  }

  req.decoded = decodedPayload;
  req.user = user;

  next();
});
