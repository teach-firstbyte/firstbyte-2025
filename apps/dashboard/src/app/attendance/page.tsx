import { requireApprovedUser } from "@/lib/auth/requireApprovedUser";
import { isOfficer } from "@/lib/auth/roles";
import { OfficerAttendanceView } from "./OfficerAttendanceView";
import { MemberAttendanceView } from "./MemberAttendanceView";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await requireApprovedUser("/attendance");

  if (isOfficer(user)) {
    return <OfficerAttendanceView searchParams={searchParams} />;
  }

  return <MemberAttendanceView user={user} searchParams={searchParams} />;
}
