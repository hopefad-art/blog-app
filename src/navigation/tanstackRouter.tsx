import { useMemo, type ReactNode } from "react";
import { Link, useNavigate, useParams, useRouterState } from "@tanstack/react-router";
import { NavigationProvider, type NavigationContextValue } from "./index";
import { TANSTACK_BASEPATH } from "./basepath";

/**
 * Supplies the same navigation adapter from TanStack Router's hooks, so the
 * page components behave identically under either router.
 *
 * `strict: false` on useParams is what lets one adapter serve every route:
 * without it TanStack Router expects the exact route id at each call site.
 */
export function TanStackNavigation({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as Record<string, string | undefined>;

  // location.pathname includes the basepath, so strip it to get a path the
  // shared components can compare against (they know nothing about /ts).
  const rawPathname = useRouterState({ select: (state) => state.location.pathname });
  const pathname = rawPathname.startsWith(TANSTACK_BASEPATH)
    ? rawPathname.slice(TANSTACK_BASEPATH.length) || "/"
    : rawPathname;
  const searchStr = useRouterState({ select: (state) => state.location.searchStr });

  const value = useMemo<NavigationContextValue>(
    () => ({
      flavour: "tanstack-router",
      pathname,
      params,
      search: new URLSearchParams(searchStr),
      navigate: (to, options) => {
        // Split any query string off the target, since TanStack Router takes
        // the path and the search object separately.
        const [path, query = ""] = to.split("?");
        void navigate({
          to: path,
          search: Object.fromEntries(new URLSearchParams(query)),
          replace: options?.replace,
        });
      },
      setSearch: (next, options) =>
        void navigate({ to: pathname, search: next, replace: options?.replace }),
      back: () => window.history.back(),
      Link: ({ to, className, children: linkChildren }) => (
        <Link to={to} className={className}>
          {linkChildren}
        </Link>
      ),
    }),
    [navigate, params, pathname, searchStr],
  );

  return <NavigationProvider value={value}>{children}</NavigationProvider>;
}
