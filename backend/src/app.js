import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { FRONTEND_URL } from "./config/config.js";
import { errorMiddleware } from "./middlewares/error.js";
import { notfoundMiddleware } from "./middlewares/notfound.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";
import healthRouter from "./routes/health.js";
import messageRouter from "./routes/message.js";
import http from "http";
import { initializeSocket } from "./utils/socket.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT"]
    })
);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/request", requestRouter);
app.use("/api/user", userRouter);
app.use("/api/health", healthRouter);
app.use("/api/message", messageRouter);

app.use(errorMiddleware);
app.use(notfoundMiddleware);

const server = http.createServer(app);
initializeSocket(server);
export { app, server };
