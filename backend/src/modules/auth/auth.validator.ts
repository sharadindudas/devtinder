import * as v from "valibot";
import { emailSchema, nameSchema, passwordSchema } from "../../validations/common";

export const SignupSchema = v.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema
});
export type SignupSchema = v.InferOutput<typeof SignupSchema>;

export const LoginSchema = v.object({
  email: emailSchema,
  password: passwordSchema
});
export type LoginSchema = v.InferOutput<typeof LoginSchema>;
