import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { logger } from "./logger";
import { FRONTEND_URL, JWT_SECRET } from "../config/config";
import jwt from "jsonwebtoken";
import type { JwtUserPayload } from "../types/express";
import { redis } from "../config/redis";
import { ConnectionModel } from "../models/connection.model";
import { ConversationModel } from "../models/conversation.model";
import { MessageModel } from "../models/message.model";

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      credentials: true
    }
  });

  io.use((socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return next(new Error("Authentication error: No cookies found"));

      const parsedCookies = Object.fromEntries(
        cookies.split("; ").map((c) => {
          const [key, value] = c.split("=");
          return [key, value];
        })
      );

      const token = parsedCookies.devtinderToken;
      if (!token) return next(new Error("Authentication error: Token missing"));

      const decodedPayload = jwt.verify(token, JWT_SECRET) as JwtUserPayload;

      socket.data.userId = decodedPayload._id;

      next();
    } catch (error) {
      logger.error("Socket authentication failed", error);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.data.userId;
    logger.info(`User ${userId} connected: ${socket.id}`);

    socket.join(userId);

    await redis.sadd(`user_sockets:${userId}`, socket.id);

    await redis.sadd("online_users", userId);

    socket.on("sendMessage", async ({ targetUserId, content }) => {
      try {
        const [user1, user2] = [userId.toString(), targetUserId.toString()].sort();

        const isConnected = await ConnectionModel.exists({
          user1,
          user2,
          status: "accepted"
        });

        if (!isConnected) {
          return socket.emit("messageError", { message: "You are not connected to this user" });
        }

        const conversation = await ConversationModel.findOneAndUpdate(
          {
            participants: { $all: [userId, targetUserId] }
          },
          {
            $setOnInsert: {
              participants: [userId, targetUserId]
            }
          },
          {
            new: true,
            upsert: true
          }
        );

        const message = await MessageModel.create({
          conversationId: conversation._id,
          senderId: userId,
          content
        });

        const populatedMessage = await message.populate("senderId", "name avatarUrl");

        io.to(targetUserId).emit("receiveMessage", populatedMessage);

        socket.emit("messageSent", populatedMessage);
      } catch (err) {
        logger.error("Error in sendMessage event:", err);
        socket.emit("messageError", { message: "An error occurred while sending the message." });
      }
    });

    socket.on("disconnect", async () => {
      logger.info(`User ${userId} disconnected`);

      await redis.srem(`user_sockets:${userId}`, socket.id);

      const remaining = await redis.scard(`user_sockets:${userId}`);

      if (remaining === 0) {
        await redis.srem("online_users", userId);
      }
    });
  });

  return io;
};

