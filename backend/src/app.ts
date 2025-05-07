import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { FRONTEND_URL } from "./config/config";
import http from "http";

// Middleware imports
import { errorMiddleware } from "./middlewares/error.middleware";
import { notfoundMiddleware } from "./middlewares/notfound.middleware";

// Route imports
import authRouter from "./routes/auth.routes";
import profileRouter from "./routes/profile.routes";
import userRouter from "./routes/user.routes";
import requestRouter from "./routes/request.routes";
import { initializeSocket } from "./utils/socket";
import chatRouter from "./routes/chat.routes";

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
app.use("/api/v1/user", userRouter);
app.use("/api/v1/request", requestRouter);
app.use("/api/v1/chat", chatRouter);

// Error handling middleware
app.use(errorMiddleware);
app.use(notfoundMiddleware);

// Creating http server
const server = http.createServer(app);

// Connection to web socket
initializeSocket(server);

export { app, server };
