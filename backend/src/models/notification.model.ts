import { Document, type ObjectId, Schema, models, model } from "mongoose";

interface Notification extends Document {
  userId: ObjectId;
  type: "message" | "connection" | "match";
  referenceId: ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema: Schema<Notification> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: {
        values: ["message", "connection", "match"],
        message: `{VALUE} is not a valid notification type`
      },
      required: true
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, versionKey: false }
);

export const NotificationModel = models.Notification || model<Notification>("Notification", notificationSchema);
