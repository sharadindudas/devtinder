import { createFileRoute } from "@tanstack/react-router";
import FeedStack from "./-components/feed-stack";

export const Route = createFileRoute("/_authenticated-layout/_main-layout/feed/")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Find Your Match</h1>
        <p className="text-sm text-muted-foreground mt-1">Swipe right to connect, left to pass</p>
      </div>

      <FeedStack />
    </div>
  );
}
