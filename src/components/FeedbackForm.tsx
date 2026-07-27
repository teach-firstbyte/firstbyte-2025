'use client'

import { submitFeedback } from "@/app/feedback/[id]/actions"
import { useActionState } from "react";
import { SubmitButton } from "./SubmitButton";
import { FeedbackCategory } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function FeedbackForm({ meetingId }: { meetingId: number }) {
    const [state, formAction] = useActionState(submitFeedback, {});

    if (state.success) {
        return (
            <Card>
                <CardContent className="py-8 text-center space-y-1">
                    <p className="font-medium">Thanks -- your feedback was recorded.</p>
                    <p className="text-sm text-muted-foreground">You can close this page.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Share your feedback</CardTitle>
                <CardDescription>All fields are optional — tell us what you thought.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-5">
                    <input type="hidden" name="meetingId" value={meetingId} />

                    <div className="space-y-1.5">
                        <label htmlFor="rating" className="block text-sm font-medium">Rating</label>
                        <select
                            id="rating"
                            name="rating"
                            defaultValue=""
                            className="w-full border rounded p-2 bg-transparent"
                        >
                            <option value="">No rating</option>
                            <option value="1">1 — Poor</option>
                            <option value="2">2 — Fair</option>
                            <option value="3">3 — Good</option>
                            <option value="4">4 — Great</option>
                            <option value="5">5 — Excellent</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="category" className="block text-sm font-medium">Category</label>
                        <select
                            id="category"
                            name="category"
                            defaultValue=""
                            className="w-full border rounded p-2 bg-transparent"
                        >
                            <option value="">Select a category</option>
                            <option value="CONTENT">Content</option>
                            <option value="LOGISTICS">Logistics</option>
                            <option value="ENGAGEMENT">Engagement</option>
                            <option value="OVERALL">Overall</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="comment" className="block text-sm font-medium">Comments</label>
                        <textarea
                            id="comment"
                            name="comment"
                            rows={4}
                            placeholder="What worked, what didn't…"
                            className="w-full border rounded p-2 bg-transparent resize-y"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="isAnonymous" className="h-4 w-4" />
                        Submit anonymously
                    </label>

                    {state.error && <p className="text-sm text-destructive">{state.error}</p>}

                    <SubmitButton pendingLabel="Submitting…">Submit feedback</SubmitButton>
                </form>
            </CardContent>
        </Card>
    )
}