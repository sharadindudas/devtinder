import { Document, Types, Schema, model } from "mongoose";
import { User } from "./user.model";
import { Chat } from "./chat.model";

export interface Message extends Document {
  _id: Types.ObjectId;
  chatId: Chat;
  senderId: User;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<Message> = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },
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

messageSchema.index({ chatId: 1, createdAt: -1 });

export const MessageModel = model<Message>("Message", messageSchema);
