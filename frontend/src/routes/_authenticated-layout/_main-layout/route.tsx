import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated-layout/_main-layout")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col p-4">
        <div className="text-xl font-bold mb-8">&lt;DevTinder /&gt;</div>
        <nav className="flex-1 space-y-2">
          <div className="p-2 bg-gray-100 rounded cursor-pointer font-medium">Feed</div>
          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer text-gray-600">Chat</div>
          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer text-gray-600">Profile</div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Placeholder (Mobile only) */}
        <header className="h-16 bg-white border-b md:hidden flex items-center px-4 font-bold">&lt;DevTinder /&gt;</header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet /> {/* /feed and /chat will render here */}
        </main>
      </div>
    </div>
  );
}
