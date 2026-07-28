import { BackLink } from "@/components/BackLink"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function CheckEmailPage({
    searchParams,
} : {
    searchParams: Promise<{ email?: string }>
}) {
    const { email } = await searchParams

    return (
        <div className="container mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Check your email</CardTitle>
                    <CardDescription>
                        {email
                            ? `We sent a confirmation link to ${email}`
                            : `We sent you a confirmation link.`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <p>
                        Click the link in that email to activate your account. If you don't see it, check your spam folder.
                    </p>
                    <BackLink href="/login" label="Back to Login" />
                </CardContent>
            </Card>
        </div>
    )
}