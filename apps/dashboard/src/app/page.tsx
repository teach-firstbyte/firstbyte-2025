import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { OfficerDashboard } from "./OfficerDashboard";
import { isOfficer } from "@/lib/auth/roles";
import { MemberDashboard } from "./MemberDashboard";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return isOfficer(user) ? (
    <OfficerDashboard />
  ) : (
    <MemberDashboard user={user} />
  );
}
