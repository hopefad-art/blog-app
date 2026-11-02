import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RouterProvider as TanStackRouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { router } from "@/routes";
import { tanstackRouter } from "@/tanstackRoutes";
import { TANSTACK_BASEPATH } from "@/navigation/basepath";
import "./index.css";

/*
 * The app ships with both routers. Addresses under /ts are served by TanStack
 * Router, everything else by React Router. Only one is mounted at a time,
 * because two routers cannot both own the browser's history for the same
 * paths. Both render the same pages.
 */
const useTanStack = window.location.pathname.startsWith(TANSTACK_BASEPATH);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {useTanStack ? (
        <TanStackRouterProvider router={tanstackRouter} />
      ) : (
        <RouterProvider router={router} />
      )}
    </QueryClientProvider>
  </StrictMode>,
);
