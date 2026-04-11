import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { FRONTEND_URL } from "./config/config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { morganMiddleware } from "./middlewares/morgan.middleware";
import { notfoundMiddleware } from "./middlewares/notfound.middleware";
import authRouter from "./modules/auth/auth.routes";
import healthRouter from "./modules/health/health.routes";
import swipeRouter from "./modules/swipes/swipe.routes";
import userRouter from "./modules/users/user.routes";
import feedRouter from "./modules/feed/feed.routes";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(cors({ origin: FRONTEND_URL, credentials: true, methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"] }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 10000, message: "Too many requests from this IP, please try again later" }));
app.use(morganMiddleware);

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/swipes", swipeRouter);
app.use("/api/v1/feed", feedRouter);

app.use(errorMiddleware);
app.use(notfoundMiddleware);

export default app;
