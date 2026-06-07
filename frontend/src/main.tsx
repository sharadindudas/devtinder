import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { queryClient } from "./lib/query-client.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "@/styles/index.css";
import { GOOGLE_CLIENT_ID } from "./config/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
