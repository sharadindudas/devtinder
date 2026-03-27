import * as v from "valibot";
import { passwordSchema } from "./common.schema";

export const EditProfileSchema = v.object({
  bio: v.optional(v.pipe(v.string(), v.maxLength(300, "Bio cannot exceed 300 characters"))),
  githubUrl: v.optional(v.pipe(v.string(), v.url("Please provide a valid URL"))),
  avatarUrl: v.optional(v.pipe(v.string(), v.url("Please provide a valid image URL"))),
  experienceLevel: v.optional(v.picklist(["beginner", "intermediate", "advanced"], "Invalid experience level")),
  skills: v.optional(v.array(v.string())),
  interests: v.optional(v.array(v.string()))
});
export type EditProfileSchema = v.InferOutput<typeof EditProfileSchema>;

export const ChangePasswordSchema = v.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema
});
export type ChangePasswordSchema = v.InferOutput<typeof ChangePasswordSchema>;
