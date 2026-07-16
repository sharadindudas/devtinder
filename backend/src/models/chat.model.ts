import { Document, Types, Schema, models, model } from "mongoose";
import { User } from "./user.model";

export interface Chat extends Document {
  _id: Types.ObjectId;
  roomId: string;
  participants: [User];
}

const chatSchema: Schema<Chat> = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ]
  },
  { timestamps: true, versionKey: false }
);

export const ChatModel = models.Chat || model<Chat>("Chat", chatSchema);
