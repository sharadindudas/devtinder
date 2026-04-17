import { Document, model, Schema, Types } from "mongoose";

interface Swipe extends Document {
  userId: Types.ObjectId;
  targetUserId: Types.ObjectId;
  action: "like" | "pass";
  createdAt: Date;
}

const swipeSchema: Schema<Swipe> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      enum: {
        values: ["like", "pass"],
        message: `{VALUE} is not a valid swipe action`
      },
      required: true
    }
  },
  { timestamps: { updatedAt: false }, versionKey: false }
);

swipeSchema.index({ userId: 1, targetUserId: 1 }, { unique: true });

export const SwipeModel = model<Swipe>("Swipe", swipeSchema);
