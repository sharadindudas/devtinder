import * as v from "valibot";
import { objectId } from "../../validations/common";

export const GetMessagesParamsSchema = v.object({
  conversationId: objectId("conversation")
});
export type GetMessagesParamsSchema = v.InferOutput<typeof GetMessagesParamsSchema>;

export const GetMessagesQuerySchema = v.object({
  cursor: v.optional(v.pipe(v.string(), v.trim())),
  limit: v.optional(
    v.pipe(
      v.string(),
      v.transform((input) => Number(input)),
      v.minValue(1, "Limit must be at least 1"),
      v.maxValue(20, "Limit must not exceed 20")
    )
  )
});
export type GetMessagesQuerySchema = v.InferOutput<typeof GetMessagesQuerySchema>;

