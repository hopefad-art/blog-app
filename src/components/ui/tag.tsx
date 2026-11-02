import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Small label for a tag or category. */
export function Tag({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-rule bg-paper px-2.5 py-0.5 text-xs font-medium text-ink-soft",
        className,
      )}
      {...props}
    />
  );
}
