import type { User } from "@/types/common";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    let user = context.queryClient.getQueryData<User>(["auth"]) ?? null;

    if (!user && context.auth?.authStatus === "PENDING") {
      user = await context.auth.ensureData();
    }

    if (user?.isOnboarded) {
      throw redirect({ to: "/feed" });
    }

    throw redirect({ to: "/onboarding" });
  }
});

