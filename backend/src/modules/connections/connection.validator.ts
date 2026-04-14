import { Types } from "mongoose";
import * as v from "valibot";

export const DeleteConnectionSchema = v.object({
  connectionId: v.pipe(
    v.string(),
    v.check((id) => Types.ObjectId.isValid(id), "Please provide a valid connection id")
  )
});
export type DeleteConnectionSchema = v.InferOutput<typeof DeleteConnectionSchema>;

