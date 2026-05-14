import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchUser } from "./index";

export const authQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: fetchUser,
  retry: 0
});

export const useAuthQuery = () => useQuery(authQueryOptions);
