import { Document, Schema, Types, model } from "mongoose";

interface Message extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
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

messageSchema.index({ conversationId: 1, createdAt: -1 });

export const MessageModel = model<Message>("Message", messageSchema);
