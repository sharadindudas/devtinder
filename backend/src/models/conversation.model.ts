import { Schema, Types, model } from "mongoose";

interface Conversation {
  participants: Types.ObjectId[];
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
    ]
  },
  { timestamps: { createdAt: true }, versionKey: false }
);

conversationSchema.index({ participants: 1 }, { unique: true });

export const ConversationModel = model<Conversation>("Conversation", conversationSchema);
