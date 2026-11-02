import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageMeta } from "@/types/post";

interface Props {
  meta: PageMeta;
  onPageChange: (page: number) => void;
  /** True while the next page is still in flight. */
  busy?: boolean;
}

export function Pagination({ meta, onPageChange, busy }: Props) {
  if (meta.totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={!meta.hasPreviousPage || busy}
        onClick={() => onPageChange(meta.page - 1)}
      >
        <ChevronLeft aria-hidden="true" />
        Previous
      </Button>

      <p aria-live="polite" className="text-sm text-ink-soft">
        Page {meta.page} of {meta.totalPages}
      </p>

      <Button
        variant="outline"
        size="sm"
        disabled={!meta.hasNextPage || busy}
        onClick={() => onPageChange(meta.page + 1)}
      >
        Next
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  );
}
