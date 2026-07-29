import type { AttendanceStatus, Prisma } from "@prisma/client";

export type MemberAttendanceKey = 
    | "PRESENT" 
    | "ABSENT" 
    | "REGISTERED"
    | "NOT_RECORDED"

export const MEMBER_ATTENDANCE_KEYS: MemberAttendanceKey[] = [
    "PRESENT",
    "ABSENT",
    "REGISTERED",
    "NOT_RECORDED"
]

export const MEMBER_ATTENDANCE_LABELS: Record<MemberAttendanceKey, string> = {
    PRESENT: "Present",
    ABSENT: "Absent",
    REGISTERED: "Registered",
    NOT_RECORDED: "Not recorded",
};

/** Validates a raw searchParams value against the member key union. */
export function parseFilter(
    raw: string | string[] | undefined
): MemberAttendanceKey | undefined {
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (!value) return undefined;
    return (MEMBER_ATTENDANCE_KEYS as string[]).includes(value)
        ? (value as MemberAttendanceKey)
        : undefined;
}

/** Maps a filter key to a Prisma where fragment. Pass the same cutoff as displayKey */
export function keyToWhere(
    key: MemberAttendanceKey,
    cutoff: Date
): Prisma.AttendanceWhereInput {
    switch (key) {
        case "PRESENT":
            return { status: "PRESENT" };
        case "ABSENT":
            return { status: "ABSENT" };
        case "REGISTERED":
            return { 
                status: "REGISTERED",
                meeting: { scheduledAt: { gte: cutoff } },
            };
        case "NOT_RECORDED":
            return {
                status: "REGISTERED",
                meeting: { scheduledAt: { lt: cutoff } },
            };
    }
}

/** Maps a stored row to the key it displays as. Pass the same cutoff as keyToWhere. */
export function displayKey(
    status: AttendanceStatus,
    scheduledAt: Date,
    cutoff: Date
): MemberAttendanceKey {
    if (status === "PRESENT") return "PRESENT";
    if (status === "ABSENT") return "ABSENT";
    return scheduledAt < cutoff ? "NOT_RECORDED" : "REGISTERED"
}