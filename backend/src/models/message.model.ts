import { Document, ObjectId, Schema, models, model } from "mongoose";
import { User } from "./user.model";

export interface Message extends Document {
    _id: ObjectId;
    senderId: User;
    message: string;
}

const messageSchema: Schema<Message> = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            required: [true, "Please provide the message"],
            trim: true
        }
    },
    { timestamps: true, versionKey: false }
);

export const MessageModel = models.Message || model<Message>("Message", messageSchema);
