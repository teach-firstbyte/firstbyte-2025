"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string | null;
  const confirm = formData.get("confirm") as string | null;

  if (!password || password.length < 6) {
    redirect("/reset-password?error=Password must be at least 6 characters");
  }

  if (password !== confirm) {
    redirect("/reset-password?error=Passwords do not match");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent("Please request a new password reset link.")}`,
    );
  }
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}
