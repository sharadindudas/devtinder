import http from "http";
import crypto from "crypto";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { FRONTEND_URL, JWT_SECRET } from "../config/config";
import { RequestModel } from "../models/request.model";
import { ChatModel } from "../models/chat.model";
import { MessageModel } from "../models/message.model";
import { DecodedPayload } from "../@types/types";
import { logger } from "./logger";

const getRoomId = (senderId: string, receiverId: string) => {
  return crypto.createHash("sha256").update([senderId, receiverId].sort().join("$")).digest("hex").slice(0, 10);
};

const parseCookies = (cookieHeader = ""): Record<string, string> => {
  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (key) acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
};

const areConnected = async (senderId: string, receiverId: string) => {
  return RequestModel.findOne({
    $or: [
      { senderId, receiverId, status: "accepted" },
      { senderId: receiverId, receiverId: senderId, status: "accepted" }
    ]
  });
};

export const initializeSocket = (server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => {
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
    }
  });

  io.use((socket, next) => {
    try {
      const { devtinderToken } = parseCookies(socket.handshake.headers.cookie);
      if (!devtinderToken) {
        return next(new Error("Please login to continue"));
      }
      const decoded = jwt.verify(devtinderToken, JWT_SECRET) as DecodedPayload;
      socket.data.userId = decoded._id;
      next();
    } catch {
      next(new Error("Invalid or expired session"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const senderId: string = socket.data.userId;
    logger.info("User connected", socket.id);

    socket.on("joinChat", async ({ receiverId }: { receiverId: string }) => {
      try {
        if (!receiverId) return;

        const connectionExists = await areConnected(senderId, receiverId);
        if (!connectionExists) {
          socket.emit("error", "You are not connected to the user");
          return;
        }

        const roomId = getRoomId(senderId, receiverId);
        socket.join(roomId);
      } catch (err) {
        socket.emit("error", err instanceof Error ? err.message : "Failed to join chat");
      }
    });

    socket.on("sendMessage", async ({ message, receiverId }: { message: string; receiverId: string }) => {
      try {
        if (!message?.trim() || !receiverId) return;

        const connectionExists = await areConnected(senderId, receiverId);
        if (!connectionExists) {
          socket.emit("error", "You are not connected to the user");
          return;
        }

        const roomId = getRoomId(senderId, receiverId);

        const chat = await ChatModel.findOneAndUpdate(
          { roomId },
          { $setOnInsert: { roomId, participants: [senderId, receiverId] } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const newMessage = await MessageModel.create({
          chatId: chat._id,
          senderId,
          message
        });

        const newMessageData = await newMessage.populate({ path: "senderId", select: "name photoUrl" });

        io.to(roomId).emit("messageReceived", newMessageData);
      } catch (err) {
        socket.emit("error", err instanceof Error ? err.message : "Failed to send message");
      }
    });

    socket.on("disconnect", () => {
      logger.info("User disconnected", socket.id);
    });
  });
};
