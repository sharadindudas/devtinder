import * as v from "valibot";
import { emailSchema, passwordSchema } from "./common.schema";

export const SignupSchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Please provide a name"),
    v.minLength(2, "Name must be at least 2 characters"),
    v.maxLength(50, "Name must not exceed 50 characters")
  ),
  email: emailSchema,
  password: passwordSchema
});
export type SignupSchema = v.InferOutput<typeof SignupSchema>;

export const LoginSchema = v.object({
  email: emailSchema,
  password: passwordSchema
});
export type LoginSchema = v.InferOutput<typeof LoginSchema>;
