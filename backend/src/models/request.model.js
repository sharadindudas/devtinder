import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
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

export const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
