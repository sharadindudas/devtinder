import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
                default: []
            }
        ]
    },
    { timestamps: true, versionKey: false }
);

export const ChatModel = mongoose.model("Chat", chatSchema);
