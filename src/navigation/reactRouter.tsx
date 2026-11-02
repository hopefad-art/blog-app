import { useMemo, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { NavigationProvider, type NavigationContextValue } from "./index";

/** Supplies the navigation adapter from React Router's own hooks. */
export function ReactRouterNavigation({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const value = useMemo<NavigationContextValue>(
    () => ({
      flavour: "react-router",
      pathname,
      params,
      search: searchParams,
      navigate: (to, options) => navigate(to, { replace: options?.replace }),
      setSearch: (next, options) => setSearchParams(next, { replace: options?.replace }),
      back: () => navigate(-1),
      Link,
    }),
    [navigate, params, pathname, searchParams, setSearchParams],
  );

  return <NavigationProvider value={value}>{children}</NavigationProvider>;
}
