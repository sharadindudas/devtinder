import { apiClient } from "@/lib/api-client";
import type { ApiResponse, User } from "@/types/common";
import type { OnboardingSchema } from "@/validations/onboarding";

export const updateProfile = (payload: Partial<OnboardingSchema> & { isOnboarded: boolean }) => {
  return apiClient.patch("user/edit", { json: payload }).json<ApiResponse<User>>();
};

