import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/common";
import type { SwipeResponse } from "@/types/swipe";

export const swipeOnUser = ({ action, targetUserId }: { action: "like" | "pass"; targetUserId: string }) => {
  return apiClient.post(`swipes/${action}/${targetUserId}`).json<ApiResponse<SwipeResponse>>();
};

