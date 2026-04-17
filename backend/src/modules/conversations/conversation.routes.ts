import { Router } from "express";
import { createConversation, getAllConversations, getMessages } from "./conversation.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { CreateConversationSchema, GetConversationMessagesSchema } from "./conversation.validator";

const conversationRouter = Router();

conversationRouter.post("/", requireAuth, validationMiddleware("body", CreateConversationSchema), createConversation);
conversationRouter.get("/", requireAuth, getAllConversations);
conversationRouter.get("/:conversationId/messages", requireAuth, validationMiddleware("params", GetConversationMessagesSchema), getMessages);

export default conversationRouter;

