import { Document, type ObjectId, Schema, models, model } from "mongoose";

interface Block extends Document {
  blockerId: ObjectId;
  blockedId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const blockSchema: Schema<Block> = new Schema(
  {
    blockerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    blockedId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

blockSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });

export const BlockModel = models.Block || model<Block>("Block", blockSchema);
