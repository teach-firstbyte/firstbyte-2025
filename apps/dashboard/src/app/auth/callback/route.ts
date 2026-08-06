import { createClient } from "@/lib/supabase/server";
import { syncUserToDb } from "@/lib/auth/sync-user";
import { NextResponse } from "next/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { withBasePath } from "@/lib/paths";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

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
      return NextResponse.redirect(`${origin}${withBasePath(next)}`);
    }
  } else if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error && data.user) {
      await syncUserToDb(data.user);
      return NextResponse.redirect(`${origin}${withBasePath(next)}`);
    }
  }

  // Something went wrong — send them back to login with an error
  return NextResponse.redirect(
    `${origin}${withBasePath("/login?error=Authentication link was invalid or expired")}`,
  );
}
