import { authQueryOptions, useAuthQuery } from "@/api/auth/queries";
import type { AuthContextData, AuthStatus } from "@/types/common";
import { useQueryClient } from "@tanstack/react-query";

export const useAuth = (): AuthContextData => {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isSuccess } = useAuthQuery();

  const authStatus: AuthStatus = isLoading ? "PENDING" : isSuccess && user ? "AUTHENTICATED" : "UNAUTHENTICATED";

  const ensureData = async () => {
    try {
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

