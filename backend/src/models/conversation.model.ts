import { Document, Schema, Types, model } from "mongoose";

interface Conversation extends Document {
  participants: Types.ObjectId[];
  lastMessage?: {
    content: string;
    senderId: Types.ObjectId;
    sentAt: Date;
  };
  createdAt: Date;
}

const conversationSchema: Schema<Conversation> = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    lastMessage: {
      content: String,
      senderId: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      sentAt: Date
    }
  },
  { timestamps: { updatedAt: false }, versionKey: false }
);

conversationSchema.index({ participants: 1 });

export const ConversationModel = model<Conversation>("Conversation", conversationSchema);
