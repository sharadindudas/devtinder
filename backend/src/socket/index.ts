import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { logger } from "../utils/logger";
import { FRONTEND_URL } from "../config/config";

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    logger.info(`A user connected to the phone line! Id: ${socket.id}`);

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

