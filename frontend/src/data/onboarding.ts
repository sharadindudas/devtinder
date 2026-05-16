import type { OnboardingSchema } from "@/validations/onboarding";

export const STEP_FIELDS: Record<number, (keyof OnboardingSchema)[]> = {
  1: ["bio", "github"],
  2: ["experienceLevel", "skills"]
};

export const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" }
];

