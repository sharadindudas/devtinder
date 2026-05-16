import type { User } from "@/types/common";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated-layout")({
  beforeLoad: async ({ context, location }) => {
    let user = context.queryClient.getQueryData<User>(["auth"]) ?? null;

    if (!user && context.auth?.authStatus === "PENDING") {
      user = await context.auth.ensureData();
    }

    if (!user) {
      throw redirect({ to: "/login" });
    }

    if (!user.isOnboarded && location.pathname !== "/onboarding") {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: RouteComponent
});

function RouteComponent() {
  return <Outlet />;
}
