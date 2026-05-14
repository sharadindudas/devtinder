import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated-layout")({
  component: RouteComponent
});

function RouteComponent() {
  return <Outlet />;
}
