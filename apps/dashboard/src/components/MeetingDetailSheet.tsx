"use client";

import { Badge } from "@/components/ui/badge";
import { AttendanceStatusBadge } from "@/components/AttendanceStatusBadge";
import { MeetingStatusBadge } from "@/components/MeetingStatusBadge";
import { DetailSheet } from "@/components/ui/detail-sheet";
import {
  DetailEmpty,
  DetailField,
  DetailGrid,
  DetailSection,
} from "@/components/ui/detail";
import { formatDateTime } from "@/lib/format";
import type { Meeting } from "@/types/dashboard";

interface MeetingDetailSheetProps {
  meeting: Meeting | null;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus: (event: Event) => void;
}

export function MeetingDetailSheet({
  meeting,
  onOpenChange,
  onCloseAutoFocus,
}: MeetingDetailSheetProps) {
  return (
    <DetailSheet
      record={meeting}
      onOpenChange={onOpenChange}
      onCloseAutoFocus={onCloseAutoFocus}
      title={(m) => m.title}
      description={(m) => m.type.replace(/_/g, " ")}
    >
      {(m) => {
        const present = m.attendance.filter(
          (record) => record.status === "PRESENT",
        ).length;

        return (
          <>
            <DetailSection title="Overview">
              <DetailGrid>
                <DetailField
                  label="Description"
                  value={m.description}
                  className="sm:col-span-2"
                />
                <DetailField label="Status">
                  <MeetingStatusBadge scheduledAt={m.scheduledAt} />
                </DetailField>
                <DetailField label="Type">
                  <Badge variant="outline">{m.type.replace(/_/g, " ")}</Badge>
                </DetailField>
                <DetailField label="Team" value={m.team?.name} />
                <DetailField label="Location" value={m.location} />
                <DetailField
                  label="Required"
                  value={m.isRequired ? "Yes" : "No"}
                />
                <DetailField label="Max capacity" value={m.maxCapacity} />
                <DetailField label="Meeting ID" value={m.id} />
              </DetailGrid>
            </DetailSection>

            <DetailSection title="Timing">
              <DetailGrid>
                <DetailField
                  label="Scheduled"
                  value={formatDateTime(m.scheduledAt)}
                />
                <DetailField
                  label="Started"
                  value={formatDateTime(m.startedAt)}
                />
                <DetailField label="Ended" value={formatDateTime(m.endedAt)} />
                <DetailField
                  label="Created"
                  value={formatDateTime(m.createdAt)}
                />
              </DetailGrid>
            </DetailSection>

            <DetailSection
              title={`Attendance (${present} of ${m.attendance.length} present)`}
            >
              {m.attendance.length === 0 ? (
                <DetailEmpty>
                  No attendance records for this meeting.
                </DetailEmpty>
              ) : (
                <ul className="space-y-2">
                  {m.attendance.map((record) => (
                    <li
                      key={record.id}
                      className="space-y-2 rounded-md border p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {record.user.name ?? record.user.email}
                          </div>
                          {record.user.name && (
                            <div className="truncate text-xs text-muted-foreground">
                              {record.user.email}
                            </div>
                          )}
                        </div>
                        <AttendanceStatusBadge status={record.status} />
                      </div>
                      <DetailGrid className="gap-2">
                        <DetailField
                          label="Checked in"
                          value={formatDateTime(record.checkedInAt)}
                        />
                        <DetailField
                          label="Checked out"
                          value={formatDateTime(record.checkedOutAt)}
                        />
                        <DetailField
                          label="Notes"
                          value={record.notes}
                          className="sm:col-span-2"
                        />
                      </DetailGrid>
                    </li>
                  ))}
                </ul>
              )}
            </DetailSection>
          </>
        );
      }}
    </DetailSheet>
  );
}
