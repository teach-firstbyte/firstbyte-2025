import { redirect } from "next/navigation";
import type { User } from "@prisma/client";
import { getSession } from "./getSession";
import { syncUserToDb } from "./sync-user";
import { isApproved, STATUS_HOME } from "./accountGate";

/**
 * Signed in, with no status gate. For /onboarding and /pending only -- gating
 * those with requireApprovedUser is exactly what produces a redirect loop.
 *
 * Heals the orphaned case (Supabase session but no users row) by creating the
 * row, which is what /auth/callback already does. Previously getCurrentUser()
 * returned null here and sent the user to /login, where they still had a valid
 * session, straight back to the same null.
 */
export async function requireSignedInUser(returnTo?: string): Promise<User> {
  const session = await getSession();

  if (session.kind === "anonymous") {
    redirect(
      returnTo ? `/login?redirect=${encodeURIComponent(returnTo)}` : "/login",
    );
  }

  return session.kind === "known"
    ? session.user
    : await syncUserToDb(session.authUser);
}

/**
 * The full gate: signed in AND approved. Every dashboard page uses this.
 *
 * `returnTo` is only worth passing for deep links someone may hit while signed
 * out (the check-in QR flow); everything else can land on "/" and be routed on
 * from there.
 */
export async function requireApprovedUser(returnTo?: string): Promise<User> {
  const user = await requireSignedInUser(returnTo);

  if (!isApproved(user)) {
    redirect(STATUS_HOME[user.status]);
  }

  return user;
}
