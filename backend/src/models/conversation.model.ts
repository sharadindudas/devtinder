import { Document, type ObjectId, Schema, models, model } from "mongoose";

interface Conversation extends Document {
  participants: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
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
  { timestamps: true, versionKey: false }
);

export const ConversationModel = models.Conversation || model<Conversation>("Conversation", conversationSchema);
