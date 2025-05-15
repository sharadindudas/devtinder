import "dotenv/config";

export const PORT = process.env.PORT,
    MONGODB_URL = process.env.MONGODB_URL,
    JWT_SECRET = process.env.JWT_SECRET,
    FRONTEND_URL = process.env.FRONTEND_URL;
