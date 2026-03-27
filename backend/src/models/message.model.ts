import { Document, type ObjectId, Schema, models, model } from "mongoose";

interface Message extends Document {
  conversationId: ObjectId;
  senderId: ObjectId;
  content: string;
  deliveredAt?: Date;
  seenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<Message> = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    deliveredAt: {
      type: Date
    },
    seenAt: {
      type: Date
    }
  },
  { timestamps: true, versionKey: false }
);

export const MessageModel = models.Message || model<Message>("Message", messageSchema);
