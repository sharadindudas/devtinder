import { CookieOptions, RequestHandler, Response } from "express";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/types";
import { LoginSchema, LoginSchemaType, SignupSchema, SignupSchemaType } from "../validations/auth.schema";
import { UserModel } from "../models/user.model";
import { NODE_ENV } from "../config/config";

const isProduction = NODE_ENV === "production";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax"
};

const signup = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  const { name, email, password, age, gender } = await SignupSchema.validate(req.body as SignupSchemaType, {
    abortEarly: false,
    stripUnknown: true
  });

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    throw new ErrorHandler("User already exists", 409);
  }

  const newUser = await UserModel.create({
    name,
    email,
    password,
    age,
    gender
  });

  newUser.password = undefined!;

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    data: newUser
  });
});

const login = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  const { email, password } = await LoginSchema.validate(req.body as LoginSchemaType, { abortEarly: false, stripUnknown: true });

  const userExists = await UserModel.findOne({ email });
  if (!userExists) {
    throw new ErrorHandler("User does not exists", 404);
  }

  const isValidPassword = await userExists.validatePassword(password);
  if (!isValidPassword) {
    throw new ErrorHandler("Invalid Credentials", 401);
  }

  const token = userExists.generateJWT();

  userExists.password = undefined!;

  res
    .cookie("devtinderToken", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .status(200)
    .json({
      success: true,
      message: "Logged in successfully",
      data: userExists
    });
});

const logout: RequestHandler = (_req, res: Response<ApiResponse>) => {
  res.clearCookie("devtinderToken", cookieOptions).status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

export { signup, login, logout };
