"use client";

import { useRouter } from "next/navigation";
import { DetailSheet } from "@/components/ui/detail-sheet";
import {
  DetailEmpty,
  DetailField,
  DetailGrid,
  DetailSection,
} from "@/components/ui/detail";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { withBasePath } from "@/lib/paths";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { AccountStatusBadge, TeamRequestBadge } from "./AccountStatusBadge";
import type { PendingUser } from "@/types/dashboard";

interface ApprovalDetailSheetProps {
  user: PendingUser | null;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus: (event: Event) => void;
}

async function patch(url: string, body: unknown) {
  const res = await fetch(withBasePath(url), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "That change could not be saved.");
  }
}

export function ApprovalDetailSheet({
  user,
  onOpenChange,
  onCloseAutoFocus,
}: ApprovalDetailSheetProps) {
  const router = useRouter();
  // Keyed per membership, so an officer working down the team list isn't
  // blocked by the previous row still being in flight.
  const action = useAsyncAction();

  const decideTeam = (membershipId: number, status: string) => {
    action.run(async () => {
      await patch(`/api/team-members/${membershipId}`, { status });
      router.refresh();
    }, membershipId);
  };

  const decideAccount = (targetId: number, status: string) => {
    action.run(async () => {
      await patch(`/api/users/${targetId}/status`, { status });
      router.refresh();
      onOpenChange(false);
    }, `account-${targetId}`);
  };

  return (
    <DetailSheet
      record={user}
      onOpenChange={onOpenChange}
      onCloseAutoFocus={onCloseAutoFocus}
      title={(u) => u.preferredName ?? u.name ?? u.email}
      description={() => "Review this account"}
    >
      {(u) => (
        <>
          <DetailSection title="Account">
            <DetailGrid>
              <DetailField label="Status">
                <AccountStatusBadge status={u.status} />
              </DetailField>
              <DetailField label="Full name" value={u.name} />
              <DetailField label="Preferred name" value={u.preferredName} />
              <DetailField label="Pronouns" value={u.pronouns} />
              <DetailField label="Email">
                <a
                  href={`mailto:${u.email}`}
                  className="text-primary hover:underline"
                >
                  {u.email}
                </a>
              </DetailField>
              <DetailField label="Graduation year" value={u.gradYear} />
              <DetailField label="Major" value={u.major} />
              <DetailField
                label="Submitted"
                value={u.submittedAt ? formatDateTime(u.submittedAt) : null}
              />
            </DetailGrid>
          </DetailSection>

          <DetailSection
            title={`Team requests (${u.teamMemberships.length})`}
            aria-label="Team requests"
          >
            {u.teamMemberships.length === 0 ? (
              <DetailEmpty>No teams requested.</DetailEmpty>
            ) : (
              <ul className="space-y-2">
                {u.teamMemberships.map((m) => (
                  <li
                    key={m.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="min-w-0 truncate text-sm font-medium">
                        {m.team.name}
                      </span>
                      <TeamRequestBadge status={m.status} />
                    </span>
                    <span className="flex gap-2">
                      {m.status !== "APPROVED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={action.isPendingKey(m.id)}
                          onClick={() => decideTeam(m.id, "APPROVED")}
                        >
                          Approve
                        </Button>
                      )}
                      {m.status !== "REJECTED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={action.isPendingKey(m.id)}
                          onClick={() => decideTeam(m.id, "REJECTED")}
                        >
                          Reject
                        </Button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </DetailSection>

          {action.error && (
            <p className="text-sm text-destructive">{action.error}</p>
          )}

          <DetailSection title="Decision">
            <div className="flex flex-wrap gap-2">
              {u.status !== "APPROVED" && (
                <Button
                  variant="brand"
                  disabled={action.pending}
                  onClick={() => decideAccount(u.id, "APPROVED")}
                >
                  Approve account
                </Button>
              )}
              {u.status !== "DENIED" && (
                <Button
                  variant="destructive"
                  disabled={action.pending}
                  onClick={() => decideAccount(u.id, "DENIED")}
                >
                  Deny account
                </Button>
              )}
              {u.status !== "PENDING" && (
                <Button
                  variant="outline"
                  disabled={action.pending}
                  onClick={() => decideAccount(u.id, "PENDING")}
                >
                  Put back in queue
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Approving the account does not approve their teams — decide those
              above.
            </p>
          </DetailSection>
        </>
      )}
    </DetailSheet>
  );
}
