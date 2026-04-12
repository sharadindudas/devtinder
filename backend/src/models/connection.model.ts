import { Schema, Types, model } from "mongoose";

interface Connection {
  users: Types.ObjectId[];
  status: "accepted" | "blocked";
  createdAt: Date;
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
        values: ["accepted", "blocked"],
        message: `{VALUE} is not a valid connection status`
      },
      required: true
    }
  },
  { timestamps: { createdAt: true }, versionKey: false }
);

connectionSchema.index({ users: 1 }, { unique: true });

export const ConnectionModel = model<Connection>("Connection", connectionSchema);
