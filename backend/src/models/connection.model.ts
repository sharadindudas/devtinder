import { Document, Schema, Types, model } from "mongoose";

interface Connection extends Document {
  user1: Types.ObjectId;
  user2: Types.ObjectId;
  status: "accepted" | "blocked";
  createdAt: Date;
}

const connectionSchema: Schema<Connection> = new Schema(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "blocked"],
        message: `{VALUE} is not a valid connection status`
      },
      required: true
    }
  },
  { timestamps: { createdAt: true }, versionKey: false }
);

connectionSchema.index({ user1: 1, user2: 1 }, { unique: true });

export const ConnectionModel = model<Connection>("Connection", connectionSchema);
