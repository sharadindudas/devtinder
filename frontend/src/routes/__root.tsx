import type { AuthContextData } from "@/types/common";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";

export interface MyRouterContext {
  auth: AuthContextData | null;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  )
});
