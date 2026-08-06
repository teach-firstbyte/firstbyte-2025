"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useEffect, useRef } from "react";

// A useFormStatus adapter over Button. The spinner and the disabled/aria-busy
// wiring live in Button so there's a single source of truth; this only decides
// *when* the form is busy.
type SubmitButtonProps = Omit<ButtonProps, "pending">;

export function SubmitButton({
  children,
  className,
  variant,
  size,
  pendingLabel,
  onClick,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const clickedRef = useRef(false);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) clickedRef.current = false;
    wasPending.current = pending;
  }, [pending]);

  // useFormStatus reports per-form, not per-button, so every submit button in a
  // form sees pending. Only the one actually clicked should spin.
  const showPending = pending && clickedRef.current;

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      pending={showPending}
      pendingLabel={pendingLabel}
      // Deliberately the wider `pending`: every submit button in the form locks
      // while it's in flight, even though only the clicked one spins.
      disabled={disabled || pending}
      onClick={(e) => {
        clickedRef.current = true;
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
