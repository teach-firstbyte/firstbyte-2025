"use client";

import { useActionState } from "react";
// Values and type both from @/lib/enums -- @prisma/client does not belong in a
// client component. See the note in that file.
import { TEAM_MEMBER_STATUS, type TeamMemberStatusValue } from "@/lib/enums";
import { saveOnboarding } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export type OnboardingTeam = {
  id: number;
  name: string;
  description: string | null;
};

export type OnboardingRequest = {
  teamId: number;
  status: TeamMemberStatusValue;
};

export type OnboardingDefaults = {
  preferredName: string | null;
  pronouns: string | null;
  gradYear: number | null;
  major: string | null;
};

export function OnboardingForm({
  teams,
  requests,
  defaults,
  isEditing,
}: {
  teams: OnboardingTeam[];
  requests: OnboardingRequest[];
  defaults: OnboardingDefaults;
  // true once the account is PENDING -- the form is the same, only the
  // wording and the primary button change.
  isEditing: boolean;
}) {
  const [state, formAction] = useActionState(saveOnboarding, {});

  const statusByTeam = new Map(requests.map((r) => [r.teamId, r.status]));

  // A team an officer has already approved or rejected renders as a read-only
  // badge, because the action refuses to change those rows -- the UI should not
  // offer what the server will ignore.
  const decided = (status: TeamMemberStatusValue | undefined) =>
    status === TEAM_MEMBER_STATUS.APPROVED ||
    status === TEAM_MEMBER_STATUS.REJECTED;

  return (
    <form action={formAction} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">
          Which teams are you interested in?
        </legend>
        <p className="text-sm text-muted-foreground">
          Pick at least one. An officer reviews each request separately.
        </p>
        <div className="space-y-2">
          {teams.map((team) => {
            const status = statusByTeam.get(team.id);
            return (
              <label
                key={team.id}
                className="flex items-start gap-3 rounded-md border p-3"
              >
                {decided(status) ? (
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-0.5 h-4 w-4"
                  />
                ) : (
                  <input
                    type="checkbox"
                    name="teams"
                    value={team.id}
                    defaultChecked={status === TEAM_MEMBER_STATUS.PENDING}
                    className="mt-0.5 h-4 w-4"
                  />
                )}
                <span className="min-w-0 space-y-0.5">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {team.name}
                    {status === TEAM_MEMBER_STATUS.APPROVED && (
                      <Badge>Approved</Badge>
                    )}
                    {status === TEAM_MEMBER_STATUS.REJECTED && (
                      <Badge variant="destructive">Not approved</Badge>
                    )}
                  </span>
                  {team.description && (
                    <span className="block text-sm text-muted-foreground">
                      {team.description}
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="preferredName" className="block text-sm font-medium">
            Preferred name
          </label>
          <Input
            id="preferredName"
            name="preferredName"
            defaultValue={defaults.preferredName ?? ""}
            placeholder="What should we call you?"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="pronouns" className="block text-sm font-medium">
            Pronouns
          </label>
          <Input
            id="pronouns"
            name="pronouns"
            defaultValue={defaults.pronouns ?? ""}
            placeholder="they/them"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="gradYear" className="block text-sm font-medium">
            Graduation year
          </label>
          <Input
            id="gradYear"
            name="gradYear"
            type="number"
            inputMode="numeric"
            defaultValue={defaults.gradYear ?? ""}
            placeholder="2029"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="major" className="block text-sm font-medium">
            Major
          </label>
          <Input
            id="major"
            name="major"
            defaultValue={defaults.major ?? ""}
            placeholder="Computer Science"
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Everything except your team picks is optional.
      </p>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-muted-foreground">
          Saved. Come back any time to finish.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <SubmitButton
          name="intent"
          value="submit"
          variant="brand"
          pendingLabel="Submitting..."
        >
          {isEditing ? "Save changes" : "Submit for approval"}
        </SubmitButton>
        {!isEditing && (
          <SubmitButton
            name="intent"
            value="save"
            variant="outline"
            pendingLabel="Saving..."
          >
            Save and finish later
          </SubmitButton>
        )}
      </div>
    </form>
  );
}
