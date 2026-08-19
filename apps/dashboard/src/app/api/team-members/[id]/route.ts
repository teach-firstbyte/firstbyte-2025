import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { TeamRole, TeamMemberStatus } from "@prisma/client";
import { requireOfficerApi } from "@/lib/auth/requireOfficerApi";

/**
 * Gets a single team member by id, including their user and team.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { error } = await requireOfficerApi();
    if (error) return error;

    const { id } = await params;
    const teamMemberId = parseInt(id);

    if (isNaN(teamMemberId)) {
      return NextResponse.json(
        { error: "Invalid team member ID" },
        { status: 400 },
      );
    }

    const teamMember = await prisma.teamMember.findUnique({
      where: { id: teamMemberId },
      include: { user: true, team: true },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(teamMember, { status: 200 });
  } catch (error) {
    console.error("GET /api/team-members/[id]", error);
    return NextResponse.json(
      { error: "Failed to get team member" },
      { status: 500 },
    );
  }
}

/**
 * Updates a team membership: its role (promote MEMBER to LEAD) and/or its
 * status (decide a join request from onboarding). Both are optional, but at
 * least one must be present -- one endpoint rather than two so approving,
 * rejecting, and reversing a decision all go through the same place.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user: officer, error } = await requireOfficerApi();
    if (error) return error;

    const { id } = await params;
    const teamMemberId = parseInt(id);

    if (isNaN(teamMemberId)) {
      return NextResponse.json(
        { error: "Invalid team member ID" },
        { status: 400 },
      );
    }

    const { role, status } = await request.json();

    if (role === undefined && status === undefined) {
      return NextResponse.json(
        { error: "role or status is required" },
        { status: 400 },
      );
    }

    const validRoles = Object.values(TeamRole);
    if (role !== undefined && !validRoles.includes(role as TeamRole)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 },
      );
    }

    const validStatuses = Object.values(TeamMemberStatus);
    if (
      status !== undefined &&
      !validStatuses.includes(status as TeamMemberStatus)
    ) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const existing = await prisma.teamMember.findUnique({
      where: { id: teamMemberId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    const decided = status !== undefined && status !== TeamMemberStatus.PENDING;

    const updated = await prisma.teamMember.update({
      where: { id: teamMemberId },
      data: {
        ...(role !== undefined ? { role: role as TeamRole } : {}),
        ...(status !== undefined
          ? {
              status: status as TeamMemberStatus,
              // Back to PENDING clears the decision rather than leaving a
              // stale officer and timestamp on the row.
              decidedAt: decided ? new Date() : null,
              decidedById: decided ? officer.id : null,
            }
          : {}),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH team-member error:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { error } = await requireOfficerApi();
    if (error) return error;

    const { id } = await params;
    const teamMemberId = parseInt(id);

    if (isNaN(teamMemberId)) {
      return NextResponse.json(
        { error: "Invalid team member ID" },
        { status: 400 },
      );
    }

    const existingTeamMember = await prisma.teamMember.findUnique({
      where: { id: teamMemberId },
    });

    if (!existingTeamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    await prisma.teamMember.delete({
      where: { id: teamMemberId },
    });

    return NextResponse.json(
      {
        message: "Team member deleted successfully",
        teamMember: existingTeamMember,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("DELETE /api/team-members/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 },
    );
  }
}
