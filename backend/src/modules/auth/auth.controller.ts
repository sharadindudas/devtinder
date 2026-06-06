import { UserModel } from "../../models/user.model";
import { authCookieOptions, oAuthStateCookieOptions } from "../../utils/cookie";
import { AsyncHandler, ErrorHandler } from "../../utils/handlers";
import { sendResponse } from "../../utils/response";
import { LoginSchema, SignupSchema } from "./auth.validator";
import crypto from "crypto";

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

  res.cookie("devtinder_token", token, authCookieOptions);

  sendResponse(res, 201, "Registered successfully", newUser);
});

export const login = AsyncHandler(async (req, res, next) => {
  const { email, password } = res.locals.body as LoginSchema;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ErrorHandler("Invalid Credentials", 401);
  }

  const isValidPassword = await user.validatePassword(password);

  if (!isValidPassword) {
    throw new ErrorHandler("Invalid Credentials", 401);
  }

  user.lastSeenAt = new Date();

  await user.save({ validateModifiedOnly: true });

  const token = user.generateJWT();

  res.cookie("devtinder_token", token, authCookieOptions);

  sendResponse(res, 200, "Logged in successfully", user);
});

export const logout = AsyncHandler(async (req, res, next) => {
  res.clearCookie("devtinder_token", authCookieOptions);

  sendResponse(res, 200, "Logged out successfully");
});

export const googleRedirect = AsyncHandler(async (req, res, next) => {
  const state = crypto.randomBytes(16).toString("hex");

  res.cookie("oauth_state", state, oAuthStateCookieOptions);

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state
  };

  const queryString = new URLSearchParams(options).toString();
  console.log(`${rootUrl}?${queryString}`);

  res.redirect(`${rootUrl}?${queryString}`);
});
