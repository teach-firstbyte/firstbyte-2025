import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { isOfficer } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { OfficerAttendanceView } from "./OfficerAttendanceView";
import { MemberAttendanceView } from "./MemberAttendanceView";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (isOfficer(user)) {
    return <OfficerAttendanceView searchParams={searchParams} />;
  }

  return <MemberAttendanceView user={user} searchParams={searchParams} />;
}
