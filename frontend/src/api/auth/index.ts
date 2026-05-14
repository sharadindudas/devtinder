import { apiClient } from "@/lib/api-client";
import type { LoginPayload, SignupPayload } from "@/types/auth";
import type { ApiResponse, User } from "@/types/common";

export const fetchUser = async (): Promise<User> => {
  const response = await apiClient.get("user/view").json<ApiResponse<User>>();
  return response.data;
};

export const loginUser = (payload: LoginPayload) => {
  return apiClient.post("auth/login", { json: payload }).json<ApiResponse<User>>();
};

export const signupUser = (payload: SignupPayload) => {
  return apiClient.post("auth/signup", { json: payload }).json<ApiResponse<User>>();
};

export const logoutUser = async (): Promise<void> => {
  await apiClient.post("auth/logout").json();
};
