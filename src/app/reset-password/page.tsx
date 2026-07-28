import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
  } from '@/components/ui/card'
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/SubmitButton"
import { updatePassword } from "./actions"

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = await searchParams

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect(`/forgot-password?error=${encodeURIComponent('Please request a new password reset link')}`)
    }

    return (
        <div className="container mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
            <Card>
                <CardHeader>
                <CardTitle>Set a new password</CardTitle>
                <CardDescription>Enter and confirm your new password.</CardDescription>
                </CardHeader>
                <CardContent>
                {error && (
                    <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
                    {error}
                    </div>
                )}
                <form action={updatePassword} className="space-y-3">
                    <Input name="password" type="password" placeholder="New password" required minLength={6} />
                    <Input name="confirm" type="password" placeholder="Confirm new password" required minLength={6} />
                    <SubmitButton className="w-full" pendingLabel="Updating password...">Update password</SubmitButton>
                </form>
                </CardContent>
            </Card>
        </div>
    )
}