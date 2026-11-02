import { Suspense, type ReactNode } from "react";
import { Header } from "./Header";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RouteFallback } from "@/components/RouteFallback";
import { useNavigation } from "@/navigation";

/**
 * The page shell both routers render into. Each router supplies its own
 * Outlet as children, so everything inside here is router-agnostic.
 *
 * The Error Boundary and Suspense boundary are keyed on the pathname, so
 * moving to another page clears a previous error rather than leaving the
 * whole app stuck on the error screen.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useNavigation();

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<RouteFallback />}>{children}</Suspense>
        </ErrorBoundary>
      </main>

      <footer className="border-t border-rule py-8">
        <p className="mx-auto max-w-6xl px-4 text-sm text-ink-soft sm:px-6">
          Inkworld reads from the public posts API at api.oluwasetemi.dev.
        </p>
      </footer>
    </div>
  );
}
