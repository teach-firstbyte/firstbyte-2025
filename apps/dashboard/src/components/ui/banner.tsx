import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Surfaces are built from an alpha tint of the tone rather than a fixed light
// shade, so they composite over --background and stay legible in both themes.
const bannerVariants = cva(
  "rounded-md border px-4 py-3 text-sm [&_a]:underline [&_a]:underline-offset-4",
  {
    variants: {
      variant: {
        warning: "border-warning/40 bg-warning/10 text-warning-foreground",
        destructive: "border-destructive/40 bg-destructive/10 text-destructive",
        success: "border-success/40 bg-success/10 text-success-foreground",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  },
);

function Banner({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof bannerVariants>) {
  return (
    <div
      data-slot="banner"
      role="status"
      className={cn(bannerVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Banner, bannerVariants };
