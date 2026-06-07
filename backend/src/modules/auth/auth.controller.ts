import { NODE_ENV } from "../../config/config";
import { UserModel } from "../../models/user.model";
import { AsyncHandler, ErrorHandler } from "../../utils/handlers";
import { sendResponse } from "../../utils/response";
import { LoginSchema, SignupSchema, VerifyGoogleSchema } from "./auth.validator";

const authCookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "strict" as const,
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

export const verifyGoogle = AsyncHandler(async (req, res, next) => {
  const { code } = res.locals.body as VerifyGoogleSchema;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      redirect_uri: "postmessage",
      grant_type: "authorization_code"
    }).toString()
  });

  if (!tokenResponse.ok) {
    throw new ErrorHandler("Failed to securely exchange Google token.", 401);
  }

  const { access_token } = (await tokenResponse.json()) as { access_token: string };

  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  if (!profileResponse.ok) {
    throw new ErrorHandler("Failed to retrieve Google profile.", 401);
  }

  const profile = (await profileResponse.json()) as {
    sub: string;
    name: string;
    email: string;
    picture: string;
    email_verified: boolean;
  };

  if (!profile.email_verified) {
    throw new ErrorHandler("Google email address is not verified.", 403);
  }

  let user = await UserModel.findOne({ authProvider: "google", providerId: profile.sub });
  let isNewUser = false;

  if (!user) {
    const existingUser = await UserModel.findOne({ email: profile.email });

    if (existingUser) {
      throw new ErrorHandler("An account with this email already exists using a password.", 409);
    }

    user = await UserModel.create({
      name: profile.name,
      email: profile.email,
      avatar: profile.picture,
      authProvider: "google",
      providerId: profile.sub
    });

    isNewUser = true;
  }

  user.lastSeenAt = new Date();
  await user.save({ validateModifiedOnly: true });

  const token = user.generateJWT();
  res.cookie("devtinder_token", token, authCookieOptions);

  sendResponse(res, isNewUser ? 201 : 200, `${isNewUser ? "Registered" : "Logged in"} successfully`, { ...user.toObject(), isNewUser });
});
