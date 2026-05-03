import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { getAllConversations, getMessages } from "./conversation.controller";
import { GetMessagesParamsSchema, GetMessagesQuerySchema } from "./conversation.validator";

const conversationRouter = Router();

conversationRouter.get("/", requireAuth, getAllConversations);
conversationRouter.get(
  "/:conversationId/messages",
  requireAuth,
  validationMiddleware("params", GetMessagesParamsSchema),
  validationMiddleware("query", GetMessagesQuerySchema),
  getMessages
);

export default conversationRouter;

