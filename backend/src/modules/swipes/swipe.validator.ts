import * as v from "valibot";
import { objectId } from "../../validations/common";

export const SwipeUserSchema = v.object({
  action: v.picklist(["like", "pass"], "Please provide the swipe action"),
  targetUserId: objectId("user")
});
export type SwipeUserSchema = v.InferOutput<typeof SwipeUserSchema>;
