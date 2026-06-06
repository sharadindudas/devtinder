import { NODE_ENV } from "../config/config";

export const authCookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const oAuthStateCookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 5 * 60 * 1000
};

