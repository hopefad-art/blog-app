/* eslint-disable react-refresh/only-export-components --
   This file is the React Router route table, not a component module. */
import { lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ReactRouterNavigation } from "@/navigation/reactRouter";

/*
 * Every page is loaded lazily, so a first visit only downloads the code for
 * the page being shown. AppShell wraps its children in Suspense, which shows
 * the route fallback while a chunk is still arriving.
 */
const HomePage = lazy(() => import("@/pages/HomePage"));
const PostDetailPage = lazy(() => import("@/pages/PostDetailPage"));
const NewPostPage = lazy(() => import("@/pages/NewPostPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function Layout() {
  return (
    <ReactRouterNavigation>
      <AppShell>
        <Outlet />
      </AppShell>
    </ReactRouterNavigation>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      // Dynamic segment: accepts a post id or a slug.
      { path: "posts/:postId", element: <PostDetailPage /> },
      { path: "new", element: <NewPostPage /> },
      // Catch-all. Any address that matched nothing above lands here.
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
