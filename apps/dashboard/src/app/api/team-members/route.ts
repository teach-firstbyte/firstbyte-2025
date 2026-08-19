import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { TeamRole, TeamMemberStatus } from "@prisma/client";
import { requireOfficerApi } from "@/lib/auth/requireOfficerApi";

/**
 * Gets all team members, including their user and team.
 * @returns The list of team members
 */
export async function GET(): Promise<NextResponse> {
  try {
    const { error } = await requireOfficerApi();
    if (error) return error;

    const teamMembers = await prisma.teamMember.findMany({
      include: {
        user: true,
        team: true,
      },
    });
    return NextResponse.json(teamMembers, { status: 200 });
  } catch (error) {
    console.error("GET /api/team-members failed:", error);
    return NextResponse.json(
      { error: "Failed to get team members" },
      { status: 500 },
    );
  }
}

/**
 * Creates a new team member
 * @param request - The request object
 * @returns The response object
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { user: officer, error } = await requireOfficerApi();
    if (error) return error;

    // Validate the request body
    const { userId, teamId, role } = await request.json();

    // Check if the userId and teamId are provided
    if (!userId || !teamId || !role) {
      return NextResponse.json(
        { error: "userId, teamId, and role are required" },
        { status: 400 },
      );
    }

    // Validate and parse userId and teamId as integers
    const parsedUserId: number = parseInt(userId);
    const parsedTeamId: number = parseInt(teamId);

    if (isNaN(parsedUserId) || isNaN(parsedTeamId)) {
      return NextResponse.json(
        { error: "userId and teamId must be valid integers" },
        { status: 400 },
      );
    }

    // Validate role using Prisma enum
    const validRoles = Object.values(TeamRole);
    if (role && !validRoles.includes(role as TeamRole)) {
      return NextResponse.json(
        {
          error: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const existing = await prisma.teamMember.findUnique({
      where: { userId_teamId: { userId: parsedUserId, teamId: parsedTeamId } },
    });

    // Only an APPROVED row is really "already a member". A PENDING request
    // means the user asked to join and an officer is now assigning them, which
    // is an approval, not a conflict -- rejecting it with a 409 would block the
    // officer from acting on exactly the request they are responding to. A
    // REJECTED row is reversed the same way.
    if (existing && existing.status === TeamMemberStatus.APPROVED) {
      return NextResponse.json(
        { error: "This user is already a member of this team" },
        { status: 409 },
      );
    }

    if (existing) {
      const approved = await prisma.teamMember.update({
        where: { id: existing.id },
        data: {
          role: role as TeamRole,
          status: TeamMemberStatus.APPROVED,
          decidedAt: new Date(),
          decidedById: officer.id,
        },
      });
      return NextResponse.json(approved, { status: 200 });
    }

    // Status set explicitly rather than leaning on the schema default, so this
    // path does not silently change if that default is ever flipped.
    const teamMember = await prisma.teamMember.create({
      data: {
        userId: parsedUserId,
        teamId: parsedTeamId,
        role: role as TeamRole,
        status: TeamMemberStatus.APPROVED,
        decidedAt: new Date(),
        decidedById: officer.id,
      },
    });

    // Return the team member if successful!
    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error("POST /api/team-members failed", error);
    // Return an error response if failed to create team member!
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 },
    );
  }
}
