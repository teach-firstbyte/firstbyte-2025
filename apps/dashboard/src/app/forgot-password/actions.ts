"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { withBasePath } from "@/lib/paths";

export async function requestPasswordReset(formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim();
  if (!email) {
    redirect("/forgot-password?error=Email is required");
  }

  const h = await headers();
  const origin = h.get("origin") ?? `http://${h.get("host")}`;

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    // Must include the zone's base path: this URL lands in the user's inbox and
    // is opened against the public domain, where /auth/callback alone would 404.
    redirectTo: `${origin}${withBasePath("/auth/callback?next=/reset-password")}`,
  });

  redirect("/forgot-password?sent=1");
}
