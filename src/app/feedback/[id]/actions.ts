'use server'

import { assertAttended } from "@/lib/attendance/assertAttended";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { validateFeedbackInput } from "@/lib/feedback/validateFeedbackInput";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type ActionResult = { success?: boolean; error?: string }

export async function submitFeedback(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
    const user = await getCurrentUser();
    if (!user) redirect('/login')

    const raw = Object.fromEntries(formData);
    const result = validateFeedbackInput(raw)
    if (!result.ok) return { error: result.error }

    if (!(await assertAttended(user.id, result.data.meetingId))) return { error: "You haven't attended this meeting." }

    try {
        const existing = await prisma.feedback.findFirst({
            where: { authorId: user.id, meetingId: result.data.meetingId },
        });
        if (existing) return { error: "You've already left feedback for this meeting." };
        
        await prisma.feedback.create({
            data: {
                meetingId: result.data.meetingId,
                authorId: user.id,
                rating: result.data.rating,
                comment: result.data.comment,
                category: result.data.category,
                isAnonymous: result.data.isAnonymous,
            },
        });
    } catch {
        return { error: "Failed to submit feedback" };
    }

    return { success: true };
}