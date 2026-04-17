import { ConversationModel } from "../../models/conversation.model";
import { UserModel } from "../../models/user.model";
import { AsyncHandler, ErrorHandler } from "../../utils/handlers";
import { sendResponse } from "../../utils/response";
import type { CreateConversationSchema } from "./conversation.validator";

export const createConversation = AsyncHandler(async (req, res, next) => {
  const { participantId } = res.locals.validatedData as CreateConversationSchema;

  const loggedInUser = res.locals.user;

  const participantExists = await UserModel.findById(participantId);
  if (!participantExists) {
    throw new ErrorHandler("Participant not found", 404);
  }

  const conversationExists = await ConversationModel.findOne({
    participants: { $all: [loggedInUser._id, participantId] }
  });
  if (conversationExists) {
    throw new ErrorHandler("Conversation already exists", 409);
  }

  const sortedIds = [loggedInUser._id.toString(), participantId.toString()].sort();

  const newConversation = await ConversationModel.create({
    participants: sortedIds
  });

  sendResponse(res, 201, "Created conversation successfully", newConversation);
});

export const getAllConversations = AsyncHandler(async (req, res, next) => {});

export const getMessages = AsyncHandler(async (req, res, next) => {});

