import { Document, Schema, Types, model } from "mongoose";
import { User } from "./user.model";

interface ConnectionRequest extends Document {
  _id: Types.ObjectId;
  senderId: User;
  receiverId: User;
  status: string;
}

const connectionRequestSchema: Schema<ConnectionRequest> = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is not a valid status type`
      },
      trim: true
    }
  },
  { timestamps: true, versionKey: false }
);

connectionRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

export const ConnectionRequestModel = model<ConnectionRequest>("ConnectionRequest", connectionRequestSchema);
