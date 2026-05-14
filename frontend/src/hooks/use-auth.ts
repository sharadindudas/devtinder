import { authQueryOptions, useAuthQuery } from "@/api/auth/queries";
import type { User } from "@/types/common";
import { useQueryClient } from "@tanstack/react-query";

export type AuthStatus = "PENDING" | "AUTHENTICATED" | "UNAUTHENTICATED";

export interface AuthContextData {
  user: User | null;
  authStatus: AuthStatus;
  ensureData: () => Promise<User | null>;
}

export const useAuth = (): AuthContextData => {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isSuccess } = useAuthQuery();

  const authStatus: AuthStatus = isLoading ? "PENDING" : isSuccess && user ? "AUTHENTICATED" : "UNAUTHENTICATED";

  const ensureData = async () => {
    try {
      const data = queryClient.getQueryData<User>(["auth"]);
      if (data) return data;
      return await queryClient.fetchQuery(authQueryOptions);
    } catch {
      return null;
    }
  };

  return {
    user: user || null,
    authStatus,
    ensureData
  };
};

