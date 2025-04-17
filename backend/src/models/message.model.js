import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide the sender id"]
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide the receiver id"]
        },
        message: {
            type: String,
            required: [true, "Please provide the message"],
            trim: true
        }
    },
    { timestamps: true, versionKey: false }
);

export const MessageModel = mongoose.model("Message", messageSchema);
