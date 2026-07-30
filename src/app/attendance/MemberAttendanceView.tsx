import { BackLink } from "@/components/BackLink";
import { MemberAttendanceTable } from "@/components/MemberAttendanceTable";
import { MemberStatusFilter } from "@/components/MemberStatusFilter";
import { PaginationControls } from "@/components/PaginationControls";
import { getAttendanceCutoff } from "@/lib/attendance/cutoff";
import {
  keyToWhere,
  parseFilter,
  displayKey,
} from "@/lib/attendance/member-status";
import { getPagination } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { MemberAttendanceRow } from "@/types/dashboard";
import { Prisma, User } from "@prisma/client";
import { Suspense } from "react";

const PAGE_SIZE = 25;

export async function MemberAttendanceView({
  user,
  searchParams,
}: {
  user: User;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let rows: MemberAttendanceRow[] = [];
  let total = 0;
  let dbUnavailable = false;
  let page = 1;
  let totalPages = 1;
  let hasPrev = false;
  let hasNext = false;
  let filtersActive = false;

  try {
    const params = await searchParams;
    const cutoff = getAttendanceCutoff();

    const rawPageParam = Array.isArray(params.page)
      ? params.page[0]
      : params.page;
    const rawPage = parseInt(rawPageParam ?? "");

    const filter = parseFilter(params.status);

    const AND: Prisma.AttendanceWhereInput[] = [{ userId: user.id }];
    if (filter) AND.push(keyToWhere(filter, cutoff));
    const where: Prisma.AttendanceWhereInput = { AND };

    total = await prisma.attendance.count({ where });

    const pagination = getPagination({
      page: rawPage,
      pageSize: PAGE_SIZE,
      total,
    });
    page = pagination.page;
    totalPages = pagination.totalPages;
    hasPrev = pagination.hasPrev;
    hasNext = pagination.hasNext;
    const { skip, take } = pagination;

    const records = await prisma.attendance.findMany({
      where,
      select: {
        id: true,
        meetingId: true,
        status: true,
        meeting: { select: { title: true, scheduledAt: true } },
      },
      orderBy: [{ meeting: { scheduledAt: "desc" } }, { id: "desc" }],
      skip,
      take,
    });

    // Which of this page's attended meetings already have feedback from this member?
    const presentMeetingIds = records
      .filter((r) => r.status === "PRESENT")
      .map((r) => r.meetingId);

    let feedbackMeetingIds = new Set<number>();
    if (presentMeetingIds.length > 0) {
      const existing = await prisma.feedback.findMany({
        where: { authorId: user.id, meetingId: { in: presentMeetingIds } },
        select: { meetingId: true },
      });
      feedbackMeetingIds = new Set(existing.map((f) => f.meetingId));
    }

    rows = records.map((r) => ({
      id: r.id,
      meetingId: r.meetingId,
      displayStatus: displayKey(r.status, r.meeting.scheduledAt, cutoff),
      hasFeedback: feedbackMeetingIds.has(r.meetingId),
      meeting: {
        title: r.meeting.title,
        scheduledAt: r.meeting.scheduledAt,
      },
    }));

    filtersActive = Boolean(filter);
  } catch (error) {
    dbUnavailable = true;
    console.error("Member attendance query failed:", error);
  }

  const emptyMessage = filtersActive
    ? "No records match this filter."
    : "You have no attendance records yet.";

  return (
    <div className="container mx-auto p-6">
      {dbUnavailable && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900 mb-4">
          Could not load your attendance right now. Showing an empty view until
          the connection is restored.
        </div>
      )}
      <BackLink />
      <div className="mt-4 mb-4">
        <Suspense fallback={<div className="h-9" />}>
          <MemberStatusFilter />
        </Suspense>
      </div>
      <div className="mt-4">
        <MemberAttendanceTable rows={rows} emptyMessage={emptyMessage} />
      </div>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
    </div>
  );
}
