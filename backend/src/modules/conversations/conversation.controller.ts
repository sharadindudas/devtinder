import { ConversationModel } from "../../models/conversation.model";
import { MessageModel } from "../../models/message.model";
import { AsyncHandler, ErrorHandler } from "../../utils/handlers";
import { sendResponse } from "../../utils/response";
import type { GetMessagesParamsSchema, GetMessagesQuerySchema } from "./conversation.validator";

export const getAllConversations = AsyncHandler(async (req, res, next) => {
  const loggedInUser = res.locals.user;

  const conversations = await ConversationModel.find({
    participants: loggedInUser._id
  })
    .populate("participants", "name avatar")
    .sort({ "lastMessage.sentAt": -1 });

  const conversationIds = conversations.map((conversation) => conversation._id);

  const unreadCounts = await MessageModel.aggregate([
    {
      $match: {
        conversationId: { $in: conversationIds },
        senderId: { $ne: loggedInUser._id },
        seenAt: null
      }
    },
    {
      $group: {
        _id: "$conversationId",
        count: { $sum: 1 }
      }
    }
  ]);

  const unreadCountMap = new Map(unreadCounts.map((item) => [item._id.toString(), item.count]));

  const conversationsData = conversations.map((conversation) => {
    const participants = conversation.participants;

    const otherUser = participants.find((participant) => !participant._id.equals(loggedInUser._id));

    return {
      conversationId: conversation._id,
      otherUser,
      lastMessage: conversation.lastMessage,
      createdAt: conversation.createdAt,
      unreadCount: unreadCountMap.get(conversation._id.toString()) || 0
    };
  });

  sendResponse(res, 200, "Fetched all conversations successfully", conversationsData);
});

export const getMessages = AsyncHandler(async (req, res, next) => {
  const loggedInUser = res.locals.user;
  const { conversationId } = res.locals.params as GetMessagesParamsSchema;
  const { limit = 20, cursor } = res.locals.query as GetMessagesQuerySchema;

  const conversation = await ConversationModel.findOne({
    _id: conversationId,
    participants: loggedInUser._id
  });

  if (!conversation) {
    throw new ErrorHandler("Conversation not found", 404);
  }

  const filterQuery: Record<string, unknown> = { conversationId };

  if (cursor) {
    filterQuery._id = { $lt: cursor };
  }

  const [_, messages] = await Promise.all([
    MessageModel.updateMany(
      {
        conversationId,
        senderId: { $ne: loggedInUser._id },
        seenAt: null
      },
      { $set: { seenAt: new Date() } }
    ),
    MessageModel.find(filterQuery).sort({ _id: -1 }).limit(limit).populate("senderId", "name avatar")
  ]);

  const hasMore = messages.length === limit;

  const lastMessage = messages[messages.length - 1];

  const nextCursor = hasMore && lastMessage ? lastMessage._id : null;

  sendResponse(res, 200, "Fetched messages successfully", {
    messages,
    hasMore,
    nextCursor
  });
});

