import { ConversationModel } from "../../models/conversation.model";
import { AsyncHandler } from "../../utils/handlers";
import { sendResponse } from "../../utils/response";

export const getAllConversations = AsyncHandler(async (req, res, next) => {
  const loggedInUser = res.locals.user;

  const conversations = await ConversationModel.find({
    participants: loggedInUser._id
  })
    .populate("participants", "name avatar")
    .sort({ "lastMessage.sentAt": -1 });

  const conversationsData = conversations.map((conversation) => {
    const participants = conversation.participants;

    const otherUser = participants.find((participant) => !participant._id.equals(loggedInUser._id));

    return {
      conversationId: conversation._id,
      otherUser,
      lastMessage: conversation.lastMessage,
      createdAt: conversation.createdAt
    };
  });

  sendResponse(res, 200, "Fetched all conversations successfully", conversationsData);
});

export const getMessages = AsyncHandler(async (req, res, next) => {});

