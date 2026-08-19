import { AccountStatus } from "@prisma/client";
import { requireSignedInUser } from "@/lib/auth/requireApprovedUser";
import { assertStatusAllowed } from "@/lib/auth/accountGate";
import { SubmitButton } from "@/components/SubmitButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Banner } from "@/components/ui/banner";
import { logOut } from "../login/actions";

export default async function PendingPage() {
  const user = await requireSignedInUser("/pending");
  assertStatusAllowed(user, [AccountStatus.PENDING, AccountStatus.DENIED]);

  const denied = user.status === AccountStatus.DENIED;

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      {denied ? (
        <Banner variant="destructive">
          Your request to join FirstByte was not approved. If you think this is
          a mistake, reach out to an officer.
        </Banner>
      ) : (
        <Banner variant="warning">
          Your account is waiting for an officer to review it. You&apos;ll get
          access as soon as it&apos;s approved.
        </Banner>
      )}
      <p className="text-sm text-muted-foreground">
        Signed in as {user.email}.
      </p>
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
