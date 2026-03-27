import { Document, type ObjectId, Schema, models, model } from "mongoose";

interface Connection extends Document {
  users: ObjectId[];
  status: "pending" | "accepted" | "rejected" | "blocked";
  createdAt: Date;
  updatedAt: Date;
}

const connectionSchema: Schema<Connection> = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected", "blocked"],
        message: `{VALUE} is not a valid connection status`
      },
      default: "pending",
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

export const ConnectionModel = models.Connection || model<Connection>("Connection", connectionSchema);
