import { Document, Schema, Types, model } from "mongoose";

interface Block extends Document {
  blockerId: Types.ObjectId;
  blockedId: Types.ObjectId;
  createdAt: Date;
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
  { timestamps: { updatedAt: false }, versionKey: false }
);

blockSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });

export const BlockModel = model<Block>("Block", blockSchema);
