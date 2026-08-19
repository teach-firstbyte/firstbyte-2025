"use server";

import { createClient } from "@/lib/supabase/server";
import { syncUserToDb } from "@/lib/auth/sync-user";
import { redirect } from "next/navigation";
import { safeInternalPath } from "@/lib/paths";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name ?? undefined,
      },
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user && data.user.identities?.length === 0) {
    redirect(
      `/login?error=An account with this email already exists. Try logging in.`,
    );
  }

  redirect(`/check-email?email=${encodeURIComponent(email)}`);
}

export async function logIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // Hidden field from AuthForm, seeded by ?redirect= on the login URL. Re-checked
  // here because a server action's input is never trustworthy, whatever the page
  // did on the way in.
  const returnTo = safeInternalPath(formData.get("returnTo") as string | null);

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Preserve the destination so a typo'd password does not cost the deep link.
    const params = new URLSearchParams({ error: error.message });
    if (returnTo) params.set("redirect", returnTo);
    redirect(`/login?${params.toString()}`);
  }

  if (data.user) {
    await syncUserToDb(data.user);
  }

  // Non-approved users are bounced on to their status page by the gate on
  // whatever they land on, so this does not need to re-check status.
  redirect(returnTo ?? "/");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
