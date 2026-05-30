import { NODE_ENV } from "../../config/config";
import { UserModel } from "../../models/user.model";
import { AsyncHandler, ErrorHandler } from "../../utils/handlers";
import { sendResponse } from "../../utils/response";
import { LoginSchema, SignupSchema } from "./auth.validator";

const cookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const signup = AsyncHandler(async (req, res, next) => {
  const { name, email, password } = res.locals.body as SignupSchema;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new ErrorHandler("Email is already registered", 409);
  }

  const newUser = await UserModel.create({
    name,
    email,
    password
  });

  const token = newUser.generateJWT();

  res.cookie("devtinderToken", token, cookieOptions);

  sendResponse(res, 201, "Registered successfully", newUser);
});

export const login = AsyncHandler(async (req, res, next) => {
  const { email, password } = res.locals.body as LoginSchema;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ErrorHandler("User does not exist", 404);
  }

  const isValidPassword = await user.validatePassword(password);
  if (!isValidPassword) {
    throw new ErrorHandler("Invalid Credentials", 401);
  }

  user.lastSeenAt = new Date();
  await user.save({ validateModifiedOnly: true });

  const token = user.generateJWT();

  res.cookie("devtinderToken", token, cookieOptions);

  sendResponse(res, 200, "Logged in successfully", user);
});

export const logout = AsyncHandler(async (req, res, next) => {
  res.clearCookie("devtinderToken", cookieOptions);

  sendResponse(res, 200, "Logged out successfully");
});
