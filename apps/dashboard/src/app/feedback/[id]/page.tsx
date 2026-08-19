import { BackLink } from "@/components/BackLink";
import { assertAttended } from "@/lib/attendance/assertAttended";
import { requireApprovedUser } from "@/lib/auth/requireApprovedUser";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FeedbackForm } from "@/components/FeedbackForm";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetingId = parseInt(id);

  if (isNaN(meetingId))
    return <p className="p-6 text-center">Invalid meeting.</p>;

  const user = await requireApprovedUser(`/feedback/${id}`);

  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
  });

  if (!meeting) notFound();

  const attended = await assertAttended(user.id, meetingId);
  if (!attended) {
    return (
      <p className="p-6 text-center">
        You need to have attended this meeting to leave feedback.
      </p>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <BackLink />
      <FeedbackForm meetingId={meetingId}></FeedbackForm>
    </div>
  );
}
