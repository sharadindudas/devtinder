import { ChatModel } from "../models/chat.model";
import { AsyncHandler } from "../utils/handlers";

// Get all the chat messages
const getAllMessages = AsyncHandler(async (req, res) => {
    // Get data from request params
    const receiverId = req.params.userId;

    // Get logged in user's id
    const senderId = req.user._id;

    // Check if the chat exists between both users or not
    const chatExists = await ChatModel.findOne({
        participants: { $all: [senderId, receiverId] }
    }).populate({
        path: "messages",
        populate: { path: "senderId", select: "name photoUrl" }
    });
    if (!chatExists) {
        res.status(200).json({
            success: true,
            message: "Fetched all messages successfully",
            data: []
        });
        return;
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

export { getAllMessages };
