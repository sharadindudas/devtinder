import { NODE_ENV } from "../config/config";
import { UserModel } from "../models/user.model";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { LoginSchema, SignupSchema } from "../validations/auth.schema";

export const signup = AsyncHandler(async (req, res, next) => {
  const { name, email, password } = res.locals.validatedData as SignupSchema;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new ErrorHandler("Email is already registered", 409);
  }

  const newUser = await UserModel.create({
    name,
    email,
    password
  });

  newUser.password = undefined!;

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    data: newUser
  });
});

export const login = AsyncHandler(async (req, res, next) => {
  const { email, password } = res.locals.validatedData as LoginSchema;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ErrorHandler("User does not exist", 404);
  }

  const isValidPassword = await user.validatePassword(password);
  if (!isValidPassword) {
    throw new ErrorHandler("Invalid Credentials", 401);
  }

  const token = user.generateJWT();

  user.password = undefined!;

  res
    .cookie("devtinderToken", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .status(200)
    .json({
      success: true,
      message: "Logged in successfully",
      data: user
    });
});

export const logout = AsyncHandler(async (req, res, next) => {
  res
    .clearCookie("devtinderToken", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: NODE_ENV === "production"
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully"
    });
});
