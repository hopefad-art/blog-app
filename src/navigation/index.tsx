/* eslint-disable react-refresh/only-export-components --
   This module is the navigation adapter: the provider and the hook that reads
   it have to live together, and the hook is the point of the file. */
import { createContext, use, type ComponentType, type ReactNode } from "react";

/**
 * The app is served by two routers: React Router at `/` and TanStack Router
 * at `/ts`. Page components must not import from either library directly, or
 * they would only work under one of them. Instead they take everything they
 * need from this adapter, and each router supplies its own implementation.
 *
 * The surface is deliberately small: it is only what the four pages actually
 * use, not a general wrapper around routing.
 */
export interface Navigation {
  /** Path of the current page, without the router's basepath. */
  pathname: string;
  /** Dynamic segments of the matched route, such as postId. */
  params: Record<string, string | undefined>;
  /** Read-only view of the query string. */
  search: URLSearchParams;
  /** Go to a path within the same router. */
  navigate: (to: string, options?: { replace?: boolean }) => void;
  /** Replace the whole query string on the current page. */
  setSearch: (next: Record<string, string>, options?: { replace?: boolean }) => void;
  /** Step back through browser history. */
  back: () => void;
}

export interface NavigationContextValue extends Navigation {
  /** The active router's own Link, so links stay client-side. */
  Link: ComponentType<{ to: string; className?: string; children: ReactNode }>;
  /** Which router is rendering, for the switch in the header. */
  flavour: "react-router" | "tanstack-router";
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({
  value,
  children,
}: {
  value: NavigationContextValue;
  children: ReactNode;
}) {
  return <NavigationContext value={value}>{children}</NavigationContext>;
}

export function useNavigation(): NavigationContextValue {
  const context = use(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used inside a NavigationProvider.");
  }
  return context;
}

/** A link that works under whichever router is currently mounted. */
export function AppLink(props: { to: string; className?: string; children: ReactNode }) {
  const { Link } = useNavigation();
  return <Link {...props} />;
}
