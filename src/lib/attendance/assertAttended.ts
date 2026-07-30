import { prisma } from "@/lib/prisma";
import { AttendanceStatus } from "@prisma/client";

export async function assertAttended(
  userId: number,
  meetingId: number,
): Promise<boolean> {
  const record = await prisma.attendance.findUnique({
    where: {
      userId_meetingId: { userId, meetingId },
    },
  });

  return record?.status === AttendanceStatus.PRESENT;
}
