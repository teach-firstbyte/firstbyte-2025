import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requestPasswordReset } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { BackLink } from "@/components/BackLink";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;

  return (
    <div className="container mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <div className="mb-4 self-start">
        <BackLink href="/login" label="Back to Log in" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-muted-foreground">
              If an account exists for that email, we&apos;ve sent a password
              reset link. Check your inbox.
            </p>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
                  {error}
                </div>
              )}
              <form action={requestPasswordReset} className="space-y-3">
                <Input name="email" type="email" placeholder="Email" required />
                <SubmitButton className="w-full" pendingLabel="Sending link...">
                  Send reset link
                </SubmitButton>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
