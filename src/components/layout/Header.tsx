import { PenLine } from "lucide-react";
import { AppLink, useNavigation } from "@/navigation";
import { TANSTACK_BASEPATH } from "@/navigation/basepath";
import { cn } from "@/lib/utils";

/**
 * Shared by both routers. Which one is active comes from the navigation
 * adapter, so the nav highlighting works the same either way.
 */
export function Header() {
  const { pathname, flavour } = useNavigation();
  const onTanStack = flavour === "tanstack-router";

  const navClass = (active: boolean) =>
    cn(
      "inline-flex h-10 items-center rounded px-3 text-[0.95rem] font-medium transition-colors",
      active ? "bg-accent-wash text-accent-deep" : "text-ink hover:bg-accent-wash",
    );

  return (
    <header className="border-b border-rule bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <AppLink to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight">Inkworld</span>
          <span className="hidden text-sm text-ink-soft sm:inline">
            notes on writing for the web
          </span>
        </AppLink>

        <div className="flex items-center gap-3">
          {/* The same app is served by two routers. This moves between them,
              which is a full page load because each owns its own route tree. */}
          <a
            href={onTanStack ? "/" : `${TANSTACK_BASEPATH}/`}
            className="hidden rounded-full border border-rule px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink md:inline-flex"
            title="Switch which router serves the app"
          >
            Router: {onTanStack ? "TanStack" : "React Router"}
          </a>

          <nav aria-label="Primary" className="flex items-center gap-1">
            <AppLink to="/" className={navClass(pathname === "/")}>
              Posts
            </AppLink>
            <AppLink
              to="/new"
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded px-4 text-[0.95rem] font-medium transition-colors",
                pathname === "/new"
                  ? "border border-rule-strong bg-surface text-ink"
                  : "bg-accent text-white hover:bg-accent-deep",
              )}
            >
              <PenLine className="size-4" aria-hidden="true" />
              Write
            </AppLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
