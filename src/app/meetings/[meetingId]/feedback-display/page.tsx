import { BackLink } from "@/components/BackLink";
import { requireOfficer } from "@/lib/auth/requireOfficer";
import { prisma } from "@/lib/prisma";
import { FeedbackQR } from "./FeedbackQR";

export default async function FeedbackDisplayPage({ params }: { params: Promise<{ meetingId: string }>}) {
    await requireOfficer();
    const { meetingId } = await params;

    const parsedMeetingId = parseInt(meetingId);
    if (isNaN(parsedMeetingId)) {
        return <p className="p-6 text-center">Invalid meeting.</p>
    }

    const meeting = await prisma.meeting.findUnique({ where: { id: parsedMeetingId }});
    if (!meeting) {
        return <p className="p-6 text-center">Meeting not found.</p>
    }

    const path = `/feedback/${parsedMeetingId}`;

    return (
        <div className="container mx-auto max-w-md p-6 space-y-6">
            <BackLink />
            <FeedbackQR meetingTitle={meeting.title} path={path} />
        </div>
    )
}