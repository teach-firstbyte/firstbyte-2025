import { requireApprovedUser } from "@/lib/auth/requireApprovedUser";
import { prisma } from "@/lib/prisma";
import { CheckInForm } from "./CheckInForm";
import { BackLink } from "@/components/BackLink";

export default async function CheckInPage({
  params,
  searchParams,
}: {
  params: Promise<{ meetingId: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { meetingId } = await params;
  const { code } = await searchParams;

  // Server-only: session + account-status gate. A QR deep link is the most
  // likely way an un-approved account reaches a dashboard route, so this needs
  // the same gate as everything else rather than a bare session check.
  const returnPath = `/check-in/${meetingId}${code ? `?code=${code}` : ""}`;
  await requireApprovedUser(returnPath);

  const parsedMeetingId = parseInt(meetingId);
  if (isNaN(parsedMeetingId)) {
    return <p className="p-6 text-center">Invalid meeting link.</p>;
  }

  // Server-only: fetch the meeting to show its title
  const meeting = await prisma.meeting.findUnique({
    where: { id: parsedMeetingId },
  });
  if (!meeting) {
    return <p className="p-6 text-center">Meeting not found.</p>;
  }

  // Hand off to the Client Component for the interactive part
  return (
    <div className="container mx-auto max-w-md p-6 space-y-6">
      <BackLink />
      <CheckInForm
        meetingId={parsedMeetingId}
        meetingTitle={meeting.title}
        initialCode={code ?? ""}
      />
    </div>
  );
}
