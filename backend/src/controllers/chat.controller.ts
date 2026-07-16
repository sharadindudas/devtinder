import { Response } from "express";
import { ChatModel } from "../models/chat.model";
import { MessageModel } from "../models/message.model";
import { AsyncHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/types";
import { PaginationSchema } from "../validations/common.schema";

const getAllMessages = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  const receiverId = req.params.userId;

  const senderId = req.user._id;

  const { page, limit } = await PaginationSchema.validate(req.query, { abortEarly: false, stripUnknown: true });
  const skip = (page - 1) * limit;

  const chatExists = await ChatModel.findOne({
    participants: { $all: [senderId, receiverId] }
  });
  if (!chatExists) {
    res.status(200).json({
      success: true,
      message: "Fetched all messages successfully",
      data: [],
      pagination: { currentPage: page, totalPages: 0, totalMessages: 0, hasMore: false }
    });
    return;
  }

  const [messages, totalMessages] = await Promise.all([
    MessageModel.find({ chatId: chatExists._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "senderId", select: "name photoUrl" }),
    MessageModel.countDocuments({ chatId: chatExists._id })
  ]);

  res.status(200).json({
    success: true,
    message: "Fetched all messages successfully",
    data: messages.reverse(),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
      totalMessages,
      hasMore: page * limit < totalMessages
    }
  });
});

export { getAllMessages };
