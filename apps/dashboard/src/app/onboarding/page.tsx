import { AccountStatus } from "@prisma/client";
import { requireSignedInUser } from "@/lib/auth/requireApprovedUser";
import { assertStatusAllowed } from "@/lib/auth/accountGate";
import { SubmitButton } from "@/components/SubmitButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { logOut } from "../login/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function OnboardingPage() {
  // requireSignedInUser, not requireApprovedUser -- gating this page on being
  // approved is exactly what would produce a redirect loop.
  const user = await requireSignedInUser("/onboarding");

  // PENDING is allowed here: that is the "edit my submission" affordance.
  assertStatusAllowed(user, [AccountStatus.ONBOARDING, AccountStatus.PENDING]);

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tell us about yourself</CardTitle>
          <CardDescription>
            One more step before an officer reviews your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Signed in as {user.email}.
          </p>
        </CardContent>
      </Card>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <form>
          <SubmitButton
            formAction={logOut}
            variant="brand"
            className="text-sm px-3 py-1.5 rounded-md"
            pendingLabel="Logging Out..."
          >
            Log out
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
