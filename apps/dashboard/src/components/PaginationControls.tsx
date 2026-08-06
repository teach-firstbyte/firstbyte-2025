"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { useAsyncAction } from "@/hooks/useAsyncAction";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export function PaginationControls({
  page,
  totalPages,
  hasPrev,
  hasNext,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const nav = useAsyncAction();

  // Wrapping router.push in the transition keeps `pending` true until the new
  // page's RSC payload commits, so the spinner covers the whole refetch rather
  // than just the click.
  const goToPage = (targetPage: number, key: "prev" | "next") => {
    const params = new URLSearchParams(searchParams);
    params.set("page", targetPage.toString());
    nav.run(async () => {
      router.push(`${pathname}?${params.toString()}`);
    }, key);
  };

  return (
    <div className="flex items-center justify-between gap-4 mt-4">
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        {/* `!hasPrev` is boundary logic, not pending state -- both need to
            disable, hence the OR. */}
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrev || nav.pending}
          pending={nav.isPendingKey("prev")}
          pendingLabel={null}
          onClick={() => goToPage(page - 1, "prev")}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext || nav.pending}
          pending={nav.isPendingKey("next")}
          pendingLabel={null}
          onClick={() => goToPage(page + 1, "next")}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
