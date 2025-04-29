import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import http from "http";
import { initializeSocket } from "./utils/socket.js";
import { FRONTEND_URL } from "./config/config.js";

// Middleware imports
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notfoundMiddleware } from "./middlewares/notfound.middleware.js";

// Route imports
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import requestRouter from "./routes/request.routes.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";

// Express initialization
const app = express();

// Global middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
    })
);
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10000,
        message: "Too many requests from this IP, please try again later"
    })
);

// Api routes
app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/request", requestRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

// Error middlewares
app.use(errorMiddleware);
app.use(notfoundMiddleware);

// Creating http server
const server = http.createServer(app);
initializeSocket(server);

export { app, server };
