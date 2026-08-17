"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Avatar renders through next/image rather than Radix's Avatar primitive.
 *
 * Radix's Avatar.Image decides when to swap in the fallback by preloading the
 * src itself with `new window.Image()`. That preload always fetches the raw
 * original, so routing it through next/image (even via asChild) downloads the
 * full-size file *and* the optimized one. Team headshots are the heaviest
 * assets on the site, so the loaded/error coordination is reimplemented here
 * with a small context and the primitive is dropped entirely.
 */
type AvatarStatus = "idle" | "loaded" | "error";

const AvatarContext = React.createContext<{
  status: AvatarStatus;
  setStatus: React.Dispatch<React.SetStateAction<AvatarStatus>>;
}>({ status: "idle", setStatus: () => {} });

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [status, setStatus] = React.useState<AvatarStatus>("idle");
  const value = React.useMemo(() => ({ status, setStatus }), [status]);

  return (
    <AvatarContext.Provider value={value}>
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className,
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
});
Avatar.displayName = "Avatar";

type AvatarImageProps = Omit<
  React.ComponentPropsWithoutRef<typeof Image>,
  "src" | "alt" | "width" | "height"
> & {
  src?: string | null;
  alt?: string;
  /**
   * Pixels to request from the optimizer, not the rendered size -- CSS still
   * controls display.
   *
   * Next builds a 1x/2x srcset from this and snaps each entry up to a
   * configured size, so the value matters more than it looks: 256 snaps its 2x
   * entry to 640, while 192 snaps to 384. The largest avatar on the site is
   * ~172px, so 192 keeps 2x displays sharp (384 >= 172*2) without shipping a
   * 640px image for a thumbnail.
   */
  width?: number;
  height?: number;
};

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, width = 192, height = 192, ...props }, ref) => {
    const { status, setStatus } = React.useContext(AvatarContext);

    // A new src deserves a fresh attempt, otherwise one broken photo would
    // suppress every later image in the same Avatar.
    React.useEffect(() => {
      setStatus("idle");
    }, [src, setStatus]);

    if (!src || status === "error") return null;

    return (
      <Image
        ref={ref}
        src={src}
        alt={alt ?? ""}
        width={width}
        height={height}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
      />
    );
  },
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { status } = React.useContext(AvatarContext);

  if (status === "loaded") return null;

  return (
    <div
      ref={ref}
      // Absolute so it sits behind a still-loading image instead of stacking
      // with it in flow and doubling the Avatar's height.
      className={cn(
        "absolute inset-0 flex h-full w-full items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
