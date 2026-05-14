import { QueryClient } from "@tanstack/react-query";
import { isHTTPError } from "ky";

const shouldRetry = (failureCount: number, error: unknown) => {
  if (isHTTPError(error) && [401, 403, 404].includes(error.response.status)) {
    return false;
  }
  return failureCount < 3;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: shouldRetry,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: false
    }
  }
});
