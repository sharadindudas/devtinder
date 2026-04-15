import { Types } from "mongoose";
import * as v from "valibot";

export const RemoveConnectionSchema = v.object({
  connectionId: v.pipe(
    v.string(),
    v.check((id) => Types.ObjectId.isValid(id), "Please provide a valid connection id")
  )
});
export type RemoveConnectionSchema = v.InferOutput<typeof RemoveConnectionSchema>;

