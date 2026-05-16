import * as v from "valibot";

export const OnboardingSchema = v.object({
  bio: v.optional(v.pipe(v.string(), v.minLength(10, "Bio must be at least 10 characters"), v.maxLength(300, "Bio cannot exceed 300 characters"))),
  github: v.optional(v.pipe(v.string(), v.url("Please provide a valid URL"))),
  avatar: v.optional(v.pipe(v.string())),
  experienceLevel: v.picklist(["beginner", "intermediate", "advanced"], "Invalid experience level"),
  skills: v.pipe(v.array(v.string()), v.minLength(1, "Please select at least one skill")),
  interests: v.pipe(v.array(v.string()), v.minLength(1, "Please select at least one interest"))
});
export type OnboardingSchema = v.InferOutput<typeof OnboardingSchema>;

