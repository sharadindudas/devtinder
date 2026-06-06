import "dotenv/config";

export const NODE_ENV = process.env.NODE_ENV!,
  SERVER_URL = process.env.SERVER_URL!,
  PORT = process.env.PORT!,
  MONGODB_URL = process.env.MONGODB_URL!,
  JWT_SECRET = process.env.JWT_SECRET!,
  FRONTEND_URL = process.env.FRONTEND_URL!,
  REDIS_URL = process.env.REDIS_URL!,
  GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!,
  GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL!,
  GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!,
  GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!,
  GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL!;
