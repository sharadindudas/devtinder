import * as v from "valibot";
import { objectId } from "../../validations/common";

export const RemoveConnectionSchema = v.object({
  connectionId: objectId("connection")
});
export type RemoveConnectionSchema = v.InferOutput<typeof RemoveConnectionSchema>;

