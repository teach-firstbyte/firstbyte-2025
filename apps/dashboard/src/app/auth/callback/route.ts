import { createClient } from "@/lib/supabase/server";
import { syncUserToDb } from "@/lib/auth/sync-user";
import { NextResponse } from "next/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { withBasePath } from "@/lib/paths";

/**
 * Redirect to a path within this zone.
 *
 * Deliberately emits a RELATIVE Location header instead of using
 * NextResponse.redirect(), which requires an absolute URL.
 *
 * This route is reached through apps/web's rewrite, so `new URL(request.url)`
 * reports the dashboard's own internal host (its .vercel.app URL in production),
 * not the public domain. Building an absolute redirect from it ejected users
 * from firstbyte.org onto the raw internal deployment URL partway through login,
 * and leaked that URL publicly.
 *
 * A relative Location is resolved by the browser against the URL it actually
 * requested, so the public origin is preserved without having to trust
 * x-forwarded-* headers.
 */
function redirectWithinZone(path: string): NextResponse {
  return new NextResponse(null, {
    status: 307,
    headers: { Location: withBasePath(path) },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const nextParam = searchParams.get("next") ?? "/";
  const next =
    nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/";

  const supabase = await createClient();

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      await syncUserToDb(data.user);
      return redirectWithinZone(next);
    }
  } else if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error && data.user) {
      await syncUserToDb(data.user);
      return redirectWithinZone(next);
    }
  }

  // Something went wrong — send them back to login with an error
  return redirectWithinZone(
    "/login?error=Authentication link was invalid or expired",
  );
}
