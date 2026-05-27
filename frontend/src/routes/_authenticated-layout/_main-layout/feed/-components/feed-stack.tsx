import { useFeedQuery } from "@/api/feed/queries";
import { useSwipeMutation } from "@/api/swipes/mutations";
import type { FeedUser } from "@/types/feed";
import { Heart, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SwipeCard from "./swipe-card";

export default function FeedStack() {
  const [cards, setCards] = useState<FeedUser[]>([]);
  const seenIds = useRef(new Set<string>());

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useFeedQuery();
  const { mutate: swipe } = useSwipeMutation();

  useEffect(() => {
    if (!data) return;
    const newCards = data.pages.flatMap((page) => page.feed).filter((user) => !seenIds.current.has(user._id));

    if (newCards.length > 0) {
      newCards.forEach((user) => seenIds.current.add(user._id));
      setCards((prev) => [...prev, ...newCards]);
    }
  }, [data]);

  useEffect(() => {
    if (cards.length < 3 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [cards.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSwipe = (action: "like" | "pass", userId: string) => {
    swipe({ action, targetUserId: userId });
    setCards((prev) => prev.filter((card) => card._id !== userId));
  };

  const visibleCards = cards.slice(0, 3);
  const topCard = visibleCards[0];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-140 gap-3">
        <div className="w-72 h-120 rounded-2xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-140 gap-4 text-center">
        <div className="text-5xl">🎉</div>
        <h3 className="text-xl font-semibold">You've seen everyone!</h3>
        <p className="text-muted-foreground text-sm">Check back later for new developers.</p>
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className="flex items-center gap-2 text-sm text-primary hover:underline">
            <RotateCcw size={14} />
            Load more
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-72 h-120 md:w-80">
        {visibleCards.map((user, index) => (
          <SwipeCard
            key={user._id}
            user={user}
            index={index}
            isDraggable={index === 0}
            onSwipe={(action) => handleSwipe(action, user._id)}
          />
        ))}
      </div>

      {topCard && (
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleSwipe("pass", topCard._id)}
            className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-red-400 text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors shadow-md">
            <X size={24} />
          </button>

          <button
            onClick={() => handleSwipe("like", topCard._id)}
            className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-green-400 text-green-400 hover:bg-green-50 dark:hover:bg-green-950 transition-colors shadow-md">
            <Heart size={24} />
          </button>
        </div>
      )}
    </div>
  );
}

