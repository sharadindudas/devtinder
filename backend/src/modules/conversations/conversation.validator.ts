import * as v from "valibot";
import { objectId } from "../../validations/common";

export const CreateConversationSchema = v.object({
  participantId: objectId("participant")
});
export type CreateConversationSchema = v.InferOutput<typeof CreateConversationSchema>;

export const GetConversationMessagesSchema = v.object({
  conversationId: objectId("conversation")
});
export type GetConversationMessagesSchema = v.InferOutput<typeof GetConversationMessagesSchema>;

