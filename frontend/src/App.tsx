import { queryClient } from "@/lib/query-client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAuth } from "./hooks/use-auth";

const router = createRouter({
  routeTree,
  context: {
    auth: null,
    queryClient
  }
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const auth = useAuth();
  return (
    <RouterProvider
      router={router}
      context={{ auth, queryClient }}
    />
  );
}

export default App;
