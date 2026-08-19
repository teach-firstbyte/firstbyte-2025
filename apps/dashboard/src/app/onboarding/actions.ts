"use server";

import { AccountStatus, TeamMemberStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSignedInUser } from "@/lib/auth/requireApprovedUser";
import { validateOnboardingInput } from "@/lib/onboarding/validateOnboardingInput";

type ActionResult = { success?: boolean; error?: string };

// Editable right up until an officer acts. PENDING stays editable so someone
// waiting in the queue can fix a typo or change which teams they asked for.
const EDITABLE: AccountStatus[] = [
  AccountStatus.ONBOARDING,
  AccountStatus.PENDING,
];

// Thrown inside the transaction when an officer decided the account mid-edit.
const CLOSED = "ONBOARDING_CLOSED";

export async function saveOnboarding(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireSignedInUser("/onboarding");
  if (!EDITABLE.includes(user.status)) {
    return { error: "This submission can no longer be edited." };
  }

  const intent = formData.get("intent") === "submit" ? "submit" : "save";

  const parsed = validateOnboardingInput(formData);
  if (!parsed.ok) return { error: parsed.error };
  const { teamIds, preferredName, pronouns, gradYear, major } = parsed.data;

  if (intent === "submit" && teamIds.length === 0) {
    return { error: "Pick at least one team you're interested in." };
  }

  // The checkbox values are client input: confirm every id is a real, active
  // team before any of them becomes a membership row.
  const validTeams = await prisma.team.findMany({
    where: { id: { in: teamIds }, isActive: true },
    select: { id: true },
  });
  if (validTeams.length !== teamIds.length) {
    return {
      error: "One of those teams is no longer available. Reload and try again.",
    };
  }
  const validIds = validTeams.map((t) => t.id);

  try {
    await prisma.$transaction(async (tx) => {
      // Re-read inside the transaction: an officer may have decided this
      // account between the gate check above and here.
      const fresh = await tx.user.findUniqueOrThrow({ where: { id: user.id } });
      if (!EDITABLE.includes(fresh.status)) throw new Error(CLOSED);

      // Drop de-selected teams, but only rows still PENDING. An APPROVED or
      // REJECTED row is an officer's decision and is not the user's to undo.
      await tx.teamMember.deleteMany({
        where: {
          userId: user.id,
          status: TeamMemberStatus.PENDING,
          teamId: { notIn: validIds },
        },
      });

      // upsert, not create: @@unique([userId, teamId]) means a double-submit
      // would otherwise throw P2002. The empty `update` is also what stops a
      // re-submit from downgrading an already-APPROVED row back to PENDING.
      for (const teamId of validIds) {
        await tx.teamMember.upsert({
          where: { userId_teamId: { userId: user.id, teamId } },
          update: {},
          create: {
            userId: user.id,
            teamId,
            status: TeamMemberStatus.PENDING,
          },
        });
      }

      await tx.user.update({
        where: { id: user.id },
        data: {
          preferredName,
          pronouns,
          gradYear,
          major,
          // Only the submit intent enters the review queue, and only from
          // ONBOARDING -- re-submitting while already PENDING must not reset
          // the officer's place in the queue.
          ...(intent === "submit" && fresh.status === AccountStatus.ONBOARDING
            ? { status: AccountStatus.PENDING, submittedAt: new Date() }
            : {}),
        },
      });
    });
  } catch (e) {
    if (e instanceof Error && e.message === CLOSED) {
      return { error: "An officer has already reviewed your account." };
    }
    console.error("saveOnboarding failed:", e);
    return { error: "Could not save your submission. Try again." };
  }

  revalidatePath("/onboarding");
  revalidatePath("/pending");

  // Outside the try/catch and outside the transaction: redirect() works by
  // throwing NEXT_REDIRECT, so a catch would swallow it and a transaction
  // would roll back.
  if (intent === "submit") redirect("/pending");

  return { success: true };
}
