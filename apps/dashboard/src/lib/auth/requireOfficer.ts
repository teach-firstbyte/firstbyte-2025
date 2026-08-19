import { redirect } from "next/navigation";
import { requireApprovedUser } from "./requireApprovedUser";
import { isOfficer } from "./roles";

// Rebuilt on requireApprovedUser so the four officer-only pages inherit the
// account-status gate with no edits at their call sites.
export async function requireOfficer() {
  const user = await requireApprovedUser();
  if (!isOfficer(user)) redirect("/");
  return user;
}
