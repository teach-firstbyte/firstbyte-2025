import * as React from "react";

import { cn } from "@/lib/utils";

// A CSS ring rather than lucide's Loader2 on purpose: buttonVariants sizes react
// to a direct <svg> child (`has-[>svg]:px-3`, `has-[>svg]:px-2.5`, ...), so an svg
// spinner would shift a button's horizontal padding the moment it goes pending.
// A <span> doesn't match those selectors, so the button only grows by the ring
// plus the base `gap-2`.
function Spinner({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="spinner"
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent",
        // Slow it down rather than stop it under reduced motion -- a static ring
        // reads as decoration and loses the affordance entirely.
        "motion-reduce:[animation-duration:1.5s]",
        className,
      )}
      {...props}
    />
  );
}

export { Spinner };
