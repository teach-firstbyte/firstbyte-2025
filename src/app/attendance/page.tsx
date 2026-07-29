import { AttendanceTable } from "@/components/AttendanceTable";
import { BackLink } from "@/components/BackLink";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";
import { StatusFilter } from "@/components/StatusFilter";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { requireOfficer } from "@/lib/auth/requireOfficer";
import { isOfficer } from "@/lib/auth/roles";
import { getPagination } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { Attendance } from "@/types/dashboard";
import { AttendanceStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OfficerAttendanceView } from "./OfficerAttendanceView";
import { MemberDashboard } from "../MemberDashboard";
import { MemberAttendanceView } from "./MemberAttendanceView";

const PAGE_SIZE = 25;

export default async function AttendancePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/login")

    if (isOfficer(user)) {
        return <OfficerAttendanceView searchParams={searchParams} />;
    }

    return <MemberAttendanceView user={user} searchParams={searchParams} />
}