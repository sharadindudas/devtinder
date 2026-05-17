import { NAV_ITEMS } from "@/data/sidebar";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ProfileSettingsDropdown } from "./-components/profile-settings";

export const Route = createFileRoute("/_authenticated-layout/_main-layout")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-64 border-r hidden md:flex flex-col py-6 px-4 shrink-0">
        <div className="px-2 mb-10">
          <span className="text-lg font-bold tracking-tight">&lt;DevTinder /&gt;</span>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
              activeProps={{ className: "bg-accent text-foreground" }}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t pt-4">
          <ProfileSettingsDropdown />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b md:hidden flex items-center justify-between px-4 shrink-0">
          <span className="text-base font-bold tracking-tight">&lt;DevTinder /&gt;</span>
          <ProfileSettingsDropdown />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
