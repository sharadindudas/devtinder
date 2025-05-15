import { Server } from "socket.io";
import crypto from "crypto";
import { FRONTEND_URL } from "../config/config.js";
import { ConnectionRequestModel } from "../models/request.model.js";
import { ErrorHandler } from "./handlers.js";
import { ChatModel } from "../models/chat.model.js";
import { MessageModel } from "../models/message.model.js";

const getRoomId = (senderId, receiverId) => {
    return crypto.createHash("sha256").update([senderId, receiverId].sort().join("$")).digest("hex").slice(0, 10);
};

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: FRONTEND_URL,
            credentials: true,
            methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
        }
    });

    io.on("connection", async (socket) => {
        console.log("User connected", socket.id);

        socket.on("joinChat", async ({ name, senderId, receiverId }) => {
            try {
                // Check if both the users are connected or not
                const connectionRequestExists = await ConnectionRequestModel.findOne({
                    $or: [
                        { senderId, receiverId, status: "accepted" },
                        { senderId: receiverId, receiverId: senderId, status: "accepted" }
                    ]
                });
                if (!connectionRequestExists) {
                    socket.emit("error", "You are not connected to the user");
                    return;
                }

                // Create and join the room
                const roomId = getRoomId(senderId, receiverId);
                socket.join(roomId);
                console.log(`${name} joined the room: ${roomId}`);
            } catch (err) {
                if (err instanceof Error) {
                    throw new ErrorHandler(err.message, 400);
                }
            }
        });

        socket.on("sendMessage", async ({ message, senderId, receiverId }) => {
            try {
                // Check if the chat between both users exists or not
                let chatExists = await ChatModel.findOne({
                    participants: { $all: [senderId, receiverId] }
                });
                // If chat doesn't exists, create a new chat
                if (!chatExists) {
                    chatExists = new ChatModel({
                        participants: [senderId, receiverId]
                    });
                }

                // Create a new message
                const newMessage = new MessageModel({
                    senderId,
                    receiverId,
                    message
                });
                // If new message is created, push it to chat messages
                if (newMessage) {
                    chatExists.messages.push(newMessage._id);
                }

                // Save all the data
                await Promise.all([chatExists.save(), newMessage.save()]);

                // Send the message data
                const newMessageData = await newMessage.populate({ path: "senderId", select: "name photoUrl" });

                // Create and send the message to the room
                const roomId = getRoomId(senderId, receiverId);
                io.to(roomId).emit("messageReceived", newMessageData);
            } catch (err) {
                if (err instanceof Error) {
                    throw new ErrorHandler(err.message, 400);
                }
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
        });
    });
};

export { initializeSocket };
