import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { AccountStatus } from "@prisma/client";
import { requireOfficerApi } from "@/lib/auth/requireOfficerApi";
import { isOfficer, OFFICER_ROLES } from "@/lib/auth/roles";

/**
 * Decides an account: approve it, deny it, or put it back in the queue.
 *
 * Deliberately separate from the team-request decisions in
 * PATCH /api/team-members/[id]. Approving a person and approving each team
 * they asked to join are independent calls, so an officer can let someone in
 * without granting every team they picked.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user: officer, error } = await requireOfficerApi();
    if (error) return error;

    const { id } = await params;
    const targetId = parseInt(id);

    if (isNaN(targetId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 },
      );
    }

    const validStatuses = Object.values(AccountStatus);
    if (!validStatuses.includes(status as AccountStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Deciding your own account is never legitimate, and it is how an officer
    // locks themselves out with one misclick.
    if (targetId === officer.id) {
      return NextResponse.json(
        { error: "You cannot change your own account status" },
        { status: 400 },
      );
    }

    const target = await prisma.user.findUnique({ where: { id: targetId } });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Denying the last approved officer leaves the queue permanently
    // unworkable -- nobody left who can approve anyone, including the person
    // who could undo this.
    if (status !== AccountStatus.APPROVED && isOfficer(target)) {
      const remaining = await prisma.user.count({
        where: {
          role: { in: OFFICER_ROLES },
          status: AccountStatus.APPROVED,
          id: { not: target.id },
        },
      });
      if (remaining === 0) {
        return NextResponse.json(
          { error: "Cannot deny the last approved officer" },
          { status: 409 },
        );
      }
    }

    const decided = status !== AccountStatus.PENDING;

    const updated = await prisma.user.update({
      where: { id: targetId },
      data: {
        status: status as AccountStatus,
        // Putting someone back in the queue clears the decision rather than
        // leaving a stale officer and timestamp on the row.
        decidedAt: decided ? new Date() : null,
        decidedById: decided ? officer.id : null,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/users/[id]/status", error);
    return NextResponse.json(
      { error: "Failed to update account status" },
      { status: 500 },
    );
  }
}
