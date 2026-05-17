import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/common";
import type { FeedResponse } from "@/types/feed";

export const fetchFeed = async (page: number = 1) => {
  const response = await apiClient.get("feed", { searchParams: { page, limit: 10 } }).json<ApiResponse<FeedResponse>>();
  return response.data;
};

