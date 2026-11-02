/**
 * Shown by Suspense while a lazily-loaded route is still downloading.
 * Deliberately plain: it is usually on screen for a few hundred milliseconds.
 */
export function RouteFallback() {
  return (
    <div role="status" className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
      <span className="sr-only">Loading page</span>
      <div aria-hidden="true" className="mx-auto h-1 w-40 overflow-hidden rounded-full bg-rule">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
      </div>
    </div>
  );
}
