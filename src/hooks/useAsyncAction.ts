"use client";

import * as React from "react";

// Pending state for client-side mutations, which can't use useFormStatus because
// they aren't server-action form submissions.
//
// Actions are tracked per key, so independent targets run concurrently -- an
// officer marking attendance down a list must not be blocked by the previous
// row's request still being in flight. Only a repeat of the *same* key is
// suppressed.

type Key = string | number;
// Actions called without a key share this one slot, so a keyless action is still
// protected against double-submits.
type InternalKey = Key | typeof SINGLETON;
const SINGLETON = Symbol("useAsyncAction.singleton");

export function useAsyncAction() {
  const [pending, startTransition] = React.useTransition();
  const [pendingKeys, setPendingKeys] = React.useState<
    ReadonlySet<InternalKey>
  >(() => new Set());
  const [error, setError] = React.useState<string | null>(null);

  // A ref rather than `pendingKeys`, because refs update synchronously. Two
  // clicks in the same tick both see the *old* render's state, and the disabled
  // attribute hasn't been applied yet either -- so a fast double-click on one
  // target would otherwise fire its request twice.
  const inFlight = React.useRef<Set<InternalKey>>(new Set());

  const run = React.useCallback((fn: () => Promise<void>, key?: Key) => {
    const k: InternalKey = key ?? SINGLETON;
    if (inFlight.current.has(k)) return;
    inFlight.current.add(k);

    setError(null);
    setPendingKeys((prev) => new Set(prev).add(k));

    startTransition(async () => {
      try {
        await fn();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        inFlight.current.delete(k);
        setPendingKeys((prev) => {
          const next = new Set(prev);
          next.delete(k);
          return next;
        });
      }
    });
  }, []);

  return {
    /** True while any action is in flight. */
    pending,
    /** True only for the given target, so several can show pending at once. */
    isPendingKey: (key: Key) => pendingKeys.has(key),
    error,
    setError,
    run,
  };
}
