import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import http from "http";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notfoundMiddleware } from "./middlewares/notfound.middleware";
import { morganMiddleware } from "./middlewares/morgan.middleware";
import authRouter from "./routes/auth.routes";
import profileRouter from "./routes/profile.routes";
import userRouter from "./routes/user.routes";
import requestRouter from "./routes/request.routes";
import chatRouter from "./routes/chat.routes";
import healthRouter from "./routes/health.routes";
import { FRONTEND_URL } from "./config/config";
import { initializeSocket } from "./utils/socket";
import { setupSwagger } from "./config/swagger";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(cors({ origin: FRONTEND_URL, credentials: true, methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"] }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 10000, message: "Too many requests from this IP, please try again later" }));
app.use(morganMiddleware);

setupSwagger(app);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/request", requestRouter);
app.use("/api/v1/chat", chatRouter);

app.use(errorMiddleware);
app.use(notfoundMiddleware);

const server = http.createServer(app);
initializeSocket(server);

export { app, server };
