import { FileQuestion, RotateCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

/*
 * The three things the post list shows when it has no posts to show.
 * Each one says what happened and offers the next move.
 */

export function PostListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading posts</span>
      <div aria-hidden="true" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="rounded-lg border border-rule bg-surface p-6">
            <div className="h-5 w-4/5 animate-pulse rounded bg-rule" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-rule/70" />
              <div className="h-3 w-11/12 animate-pulse rounded bg-rule/70" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-rule/70" />
            </div>
            <div className="mt-6 h-3 w-28 animate-pulse rounded bg-rule/70" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PostListError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-lg border border-alarm/25 bg-alarm-wash px-6 py-16 text-center"
    >
      <WifiOff className="size-9 text-alarm" aria-hidden="true" />
      <div className="max-w-sm space-y-1">
        <h2 className="font-display text-xl font-semibold">Couldn't load the posts</h2>
        <p className="text-ink-soft">{message}</p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        <RotateCw aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
}

export function PostListEmpty({ search, onClear }: { search: string; onClear: () => void }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-rule-strong bg-surface/60 px-6 py-16 text-center"
    >
      <FileQuestion className="size-9 text-accent" aria-hidden="true" />
      <div className="max-w-sm space-y-1">
        <h2 className="font-display text-xl font-semibold">
          {search ? "Nothing matched that search" : "No posts yet"}
        </h2>
        <p className="text-ink-soft">
          {search
            ? `We looked for “${search}” and came up empty. Try a shorter or different word.`
            : "Once a post is published it will appear here."}
        </p>
      </div>
      {search && (
        <Button variant="outline" onClick={onClear}>
          Clear search
        </Button>
      )}
    </div>
  );
}
