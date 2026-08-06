/**
 * Single source of truth for this app's Multi-Zone base path.
 *
 * This app is served under /dashboard on the marketing site's domain
 * (see `basePath` in next.config.ts and the rewrite in apps/web/next.config.mjs).
 *
 * Next.js applies `basePath` to SOME APIs but not others. Knowing which is which
 * is the whole reason this module exists:
 *
 *   Automatic — do NOT wrap these, or you get /dashboard/dashboard/...
 *     <Link href="/settings">        router.push() / router.replace()
 *     usePathname()                 middleware matchers
 *     redirect() / notFound()       from next/navigation
 *
 *   NOT automatic — these helpers are required:
 *     fetch("/api/...")             a raw browser API, no Next router involved
 *     NextResponse.redirect(url)    you build the absolute URL yourself
 *     absolute URLs built by hand   e.g. `${window.location.origin}${path}`
 *     URLs sent to third parties    Supabase redirectTo, OAuth callbacks, QR codes
 *
 * Both halves verified empirically against a running server:
 *   - fetch: /api/teams -> 404, /dashboard/api/teams -> 401 (needs the prefix)
 *   - redirect: wrapping "/login" produced Location: /dashboard/dashboard/login
 */

/**
 * Must stay in sync with `basePath` in next.config.ts. Next does not expose the
 * configured basePath to server code at runtime, so it is duplicated here.
 */
export const BASE_PATH = "/dashboard";

/**
 * Prefix an app-absolute path with {@link BASE_PATH}.
 *
 * Used for `fetch()` targets, `redirect()` destinations, and any URL assembled
 * by hand rather than by the Next router.
 *
 * @param path An app-absolute path beginning with "/", e.g. "/api/teams" or
 *   "/login?error=1". Query strings and fragments are permitted.
 * @returns The same path prefixed with the base path, e.g. "/dashboard/api/teams".
 */
export function withBasePath(path: string): string {
  // Tolerate a missing leading slash rather than throwing. These helpers feed
  // redirect() on auth paths, and a crash there would lock users out over a typo.
  const normalized = path.startsWith("/") ? path : `/${path}`;

  // Idempotent: prefixing an already-prefixed path is a no-op. The check matches
  // only an exact BASE_PATH or a real segment boundary, so a future sibling route
  // like "/dashboard-settings" is still prefixed correctly.
  if (
    normalized === BASE_PATH ||
    normalized.startsWith(`${BASE_PATH}/`) ||
    normalized.startsWith(`${BASE_PATH}?`)
  ) {
    return normalized;
  }

  // "/" becomes "/dashboard", not "/dashboard/" — this is the post-login landing
  // path, and the un-slashed form keeps it consistent with every other route.
  return normalized === "/" ? BASE_PATH : `${BASE_PATH}${normalized}`;
}

/**
 * Build the absolute URL for a path, for QR codes and OAuth redirect targets
 * that must be scanned or visited from outside the app.
 *
 * Uses the marketing site's origin, which is correct: the browser is on the
 * public domain, not this zone's internal deployment URL.
 *
 * Browser-only — reads `window.location.origin`.
 */
export function absoluteUrl(path: string): string {
  return `${window.location.origin}${withBasePath(path)}`;
}
