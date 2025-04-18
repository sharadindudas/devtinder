import { Server } from "socket.io";
import { FRONTEND_URL } from "../config/config.js";
import { ConnectionRequestModel } from "../models/connectionRequest.model.js";
import crypto from "crypto";
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

        socket.on("joinChat", async (data) => {
            try {
                // Get data from client
                const { name, senderId, receiverId } = data;

                // Check if both the users are connected or not
                const connectionRequestExists = await ConnectionRequestModel.findOne({
                    $or: [
                        { senderId, receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ]
                });
                if (!connectionRequestExists) {
                    socket.emit("error", "You are not connected to the user");
                    return;
                }

                // Create a room and join the room
                const roomId = getRoomId(senderId, receiverId);
                console.log(`${name} joined the room: ${roomId}`);
                socket.join(roomId);
            } catch (err) {
                throw new ErrorHandler(err.message, 400);
            }
        });

        socket.on("sendMessage", async (data) => {
            try {
                // Get data from client
                const { senderId, receiverId, message } = data;

                // Check if the chat exists between both users or not
                let chatExists = await ChatModel.findOne({
                    participants: { $all: [senderId, receiverId] }
                });
                if (!chatExists) {
                    chatExists = new ChatModel({
                        participants: [senderId, receiverId]
                    });
                }

                // Create a new message and save it
                const newMessage = new MessageModel({
                    senderId,
                    receiverId,
                    message
                });
                if (newMessage) {
                    chatExists.messages.push(newMessage._id);
                }
                await Promise.all([chatExists.save(), newMessage.save()]);

                // Send the message data
                const newMessageData = await newMessage.populate([
                    { path: "senderId", select: "name photoUrl" },
                    { path: "receiverId", select: "name photoUrl" }
                ]);

                // Create the room
                const roomId = getRoomId(senderId, receiverId);

                // Send the message to the room
                io.to(roomId).emit("messageReceived", newMessageData);
            } catch (err) {
                throw new ErrorHandler(err.message, 400);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
        });
    });
};

export { initializeSocket };
