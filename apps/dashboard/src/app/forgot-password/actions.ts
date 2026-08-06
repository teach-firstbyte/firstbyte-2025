"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { withBasePath } from "@/lib/paths";

/**
 * The origin a user's browser actually sees, for URLs that leave the app.
 *
 * This app runs as a Multi-Zone behind apps/web, so the request's own `host` and
 * `origin` headers are the dashboard's INTERNAL host (its .vercel.app URL in
 * production). A password-reset link built from those would arrive in someone's
 * inbox pointing at the internal deployment rather than firstbyte.org.
 *
 * NEXT_PUBLIC_APP_URL is the explicit, deterministic answer and must be set to
 * the public origin. The x-forwarded-host fallback covers the case where it is
 * missing, since Next sets that header when proxying to an external rewrite
 * destination.
 */
async function publicOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, "");

  const h = await headers();
  const forwardedHost = h.get("x-forwarded-host");
  if (forwardedHost) {
    const proto = h.get("x-forwarded-proto") ?? "https";
    return `${proto}://${forwardedHost}`;
  }
  return h.get("origin") ?? `http://${h.get("host")}`;
}

export async function requestPasswordReset(formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim();
  if (!email) {
    redirect("/forgot-password?error=Email is required");
  }

  const origin = await publicOrigin();

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    // Absolute, and prefixed with the zone's base path: this URL lands in the
    // user's inbox and is opened against the public domain, where a bare
    // /auth/callback would 404.
    redirectTo: `${origin}${withBasePath("/auth/callback?next=/reset-password")}`,
  });

  redirect("/forgot-password?sent=1");
}
