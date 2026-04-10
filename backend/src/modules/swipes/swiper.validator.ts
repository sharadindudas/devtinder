import * as v from "valibot";
import { Types } from "mongoose";

export const SwipeUserSchema = v.object({
  action: v.picklist(["like", "pass"], "Please provide the swipe action"),
  targetUserId: v.pipe(
    v.string(),
    v.check((id) => Types.ObjectId.isValid(id), "Please provide a valid user id")
  )
});
export type SwipeUserSchema = v.InferOutput<typeof SwipeUserSchema>;
