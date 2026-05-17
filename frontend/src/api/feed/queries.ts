import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeed } from ".";

export const useFeedQuery = () =>
  useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => fetchFeed(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.pagination.hasMore ? allPages.length + 1 : undefined)
  });

