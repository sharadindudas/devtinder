import { Document, type ObjectId, Schema, models, model } from "mongoose";

interface Swipe extends Document {
  userId: ObjectId;
  targetUserId: ObjectId;
  action: "like" | "pass";
  createdAt: Date;
  updatedAt: Date;
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
  { timestamps: true, versionKey: false }
);

swipeSchema.index({ userId: 1, targetUserId: 1 }, { unique: true });

export const SwipeModel = models.Swipe || model<Swipe>("Swipe", swipeSchema);
