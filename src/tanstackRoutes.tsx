/* eslint-disable react-refresh/only-export-components --
   This file is the TanStack Router route table, not a component module. */
import { lazy } from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { TanStackNavigation } from "@/navigation/tanstackRouter";
import { TANSTACK_BASEPATH } from "@/navigation/basepath";

/*
 * The same four pages, served by TanStack Router from /ts instead of the site
 * root. They are the identical components React Router uses: anything
 * router-specific goes through the navigation adapter, so neither router
 * needs its own copy of a page.
 */
const HomePage = lazy(() => import("@/pages/HomePage"));
const PostDetailPage = lazy(() => import("@/pages/PostDetailPage"));
const NewPostPage = lazy(() => import("@/pages/NewPostPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const rootRoute = createRootRoute({
  component: () => (
    <TanStackNavigation>
      <AppShell>
        <Outlet />
      </AppShell>
    </TanStackNavigation>
  ),
  // Rendered for any address under /ts that matches no route below.
  notFoundComponent: () => <NotFoundPage />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts/$postId",
  component: PostDetailPage,
});

const newPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/new",
  component: NewPostPage,
});

const routeTree = rootRoute.addChildren([indexRoute, postRoute, newPostRoute]);

export const tanstackRouter = createRouter({
  routeTree,
  basepath: TANSTACK_BASEPATH,
  defaultNotFoundComponent: () => <NotFoundPage />,

  /*
   * By default TanStack Router JSON-encodes search values, so ?page=2 is
   * written as ?page=%222%22 and reads back as the string '"2"'. The pages
   * treat the query string as plain text, the way React Router does, so
   * these two make both routers produce identical URLs.
   */
  parseSearch: (searchStr) => Object.fromEntries(new URLSearchParams(searchStr)),
  stringifySearch: (search) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(search ?? {})) {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    }
    const query = params.toString();
    return query ? `?${query}` : "";
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof tanstackRouter;
  }
}
