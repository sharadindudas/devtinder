import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide the sender id"]
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide the receiver id"]
        },
        status: {
            type: String,
            required: [true, "Please provide the status"],
            enum: {
                values: ["interested", "ignored", "accepted", "rejected"],
                message: `{VALUE} is not a valid status type`
            },
            trim: true
        }
    },
    { timestamps: true, versionKey: false }
);

export const ConnectionRequestModel = mongoose.model("Connection Request", connectionRequestSchema);
