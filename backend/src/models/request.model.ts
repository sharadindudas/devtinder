import { Document, ObjectId, Schema, models, model } from "mongoose";
import { User } from "./user.model";

interface ConnectionRequest extends Document {
    _id: ObjectId;
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

// Compound indexing
connectionRequestSchema.index({ senderId: 1, receiverId: 1 });

export const ConnectionRequestModel = models.ConnectionRequest || model<ConnectionRequest>("ConnectionRequest", connectionRequestSchema);
