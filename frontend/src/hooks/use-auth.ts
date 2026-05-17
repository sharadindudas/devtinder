import { authQueryOptions, useAuthQuery } from "@/api/auth/queries";
import type { AuthContextData, AuthStatus } from "@/types/common";
import { useQueryClient } from "@tanstack/react-query";

export const useAuth = (): AuthContextData => {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useAuthQuery();

  const authStatus: AuthStatus = isLoading ? "PENDING" : user ? "AUTHENTICATED" : "UNAUTHENTICATED";

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

