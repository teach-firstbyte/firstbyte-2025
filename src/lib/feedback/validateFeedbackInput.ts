import { FeedbackCategory } from "@prisma/client";

type ValidateResult = 
    | { ok: true; 
        data: { meetingId: number; 
                rating: number | null; 
                category: FeedbackCategory | null; 
                comment: string | null; 
                isAnonymous: boolean }
        }
    | { ok: false; error: string };

const isBlank = (v: unknown): boolean => v === undefined || v === null || v === "";

export function validateFeedbackInput(raw: Record<string, unknown>): ValidateResult {
    if (isBlank(raw.meetingId)) {
        return { ok: false, error: "meetingId is required"}
    }
    const meetingId = Number(raw.meetingId);
    if (!Number.isInteger(meetingId)) {
        return { ok: false, error: "meetingId must be a valid integer" }
    }

    let rating: number | null = null;
    if (!isBlank(raw.rating)) {
        rating = Number(raw.rating);
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return { ok: false, error: "rating must be an integer between 1 and 5" };
        }
    }

    let category: FeedbackCategory | null = null;
    if (!isBlank(raw.category)) {
        if (!Object.values(FeedbackCategory).includes(raw.category as FeedbackCategory)) {
            return {
                ok: false,
                error: `Invalid category. Must be one of: ${Object.values(FeedbackCategory).join(", ")}`,
            }
        }
    }
    category = raw.category as FeedbackCategory;

    const comment = isBlank(raw.comment) ? null : String(raw.comment);

    const isAnonymous = raw.isAnonymous === true || raw.isAnonymous === "true" || raw.isAnonymous === "on"
    
    return { ok: true, data: { meetingId, rating, category, comment, isAnonymous } };
}