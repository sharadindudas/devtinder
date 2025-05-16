import "dotenv/config";

export const NODE_ENV = process.env.NODE_ENV!,
    SERVER_URL = process.env.SERVER_URL!,
    PORT = process.env.PORT!,
    MONGODB_URL = process.env.MONGODB_URL!,
    JWT_SECRET = process.env.JWT_SECRET!,
    FRONTEND_URL = process.env.FRONTEND_URL!;
