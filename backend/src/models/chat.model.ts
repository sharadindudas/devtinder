import { Document, ObjectId, Schema, models, model } from "mongoose";
import { User } from "./user.model";
import { Message } from "./message.model";

interface Chat extends Document {
    _id: ObjectId;
    participants: [User];
    messages: [Message];
}

const chatSchema: Schema<Chat> = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: "Message",
                default: []
            }
        ]
    },
    { timestamps: true, versionKey: false }
);

export const ChatModel = models.Chat || model<Chat>("Chat", chatSchema);
