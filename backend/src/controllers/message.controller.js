import { ChatModel } from "../models/chat.model.js";
import { AsyncHandler } from "../utils/handlers.js";

// Get messages
const getMessages = AsyncHandler(async (req, res, next) => {
    // Get data from request params
    const { userId: receiverId } = req.params;

    // Get logged in user's id
    const senderId = req.user._id;

    // Check if the chat exists between both users or not
    const chatExists = await ChatModel.findOne({
        participants: { $all: [senderId, receiverId] }
    }).populate({
        path: "messages",
        populate: [
            { path: "senderId", select: "name photoUrl" },
            { path: "receiverId", select: "name photoUrl" }
        ]
    });
    if (!chatExists) {
        return res.status(200).json({
            success: true,
            message: "Fetched all messages successfully",
            data: []
        });
    }

    // Send the messages data
    const messages = chatExists.messages;

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched all messages successfully",
        data: messages
    });
});

export { getMessages };
