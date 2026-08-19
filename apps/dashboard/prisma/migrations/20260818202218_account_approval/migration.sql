-- CreateEnum
CREATE TYPE "account_status" AS ENUM ('ONBOARDING', 'PENDING', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "team_member_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- ---------------------------------------------------------------------------
-- team_members
--
-- The APPROVED default is correct for existing rows: every membership that
-- exists today was created by an officer through the Assign Teams modal. It is
-- also the permanent default, so officer-initiated writes keep working with no
-- code change -- only the onboarding action opts into PENDING.
-- ---------------------------------------------------------------------------
ALTER TABLE "team_members" ADD COLUMN     "decided_at" TIMESTAMP(3),
ADD COLUMN     "decided_by_id" INTEGER,
ADD COLUMN     "status" "team_member_status" NOT NULL DEFAULT 'APPROVED';

-- Backfill the audit timestamp. decided_by_id stays NULL: these predate the
-- approval flow, so there is no officer to attribute them to.
UPDATE "team_members" SET "decided_at" = "joined_at" WHERE "decided_at" IS NULL;

-- ---------------------------------------------------------------------------
-- users
--
-- Added NULLABLE and WITHOUT a default, backfilled, then constrained. The
-- three-step order is the whole point.
--
-- Prisma generated this as a single
--     ADD COLUMN "status" ... NOT NULL DEFAULT 'ONBOARDING'
-- which would stamp ONBOARDING onto every existing member and bounce the entire
-- club into the onboarding flow the moment this deploys. Rows that predate the
-- approval flow are by definition already-approved members.
--
-- Adding the default only AFTER the backfill means it can apply to future
-- inserts and nothing else.
-- ---------------------------------------------------------------------------
ALTER TABLE "users" ADD COLUMN     "decided_at" TIMESTAMP(3),
ADD COLUMN     "decided_by_id" INTEGER,
ADD COLUMN     "grad_year" INTEGER,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "preferred_name" TEXT,
ADD COLUMN     "pronouns" TEXT,
ADD COLUMN     "status" "account_status",
ADD COLUMN     "submitted_at" TIMESTAMP(3);

UPDATE "users"
   SET "status"       = 'APPROVED',
       "submitted_at" = "created_at",
       "decided_at"   = "created_at"
 WHERE "status" IS NULL;

ALTER TABLE "users"
  ALTER COLUMN "status" SET NOT NULL,
  ALTER COLUMN "status" SET DEFAULT 'ONBOARDING';

-- CreateIndex
CREATE INDEX "team_members_status_idx" ON "team_members"("status");

-- CreateIndex
CREATE INDEX "users_status_submitted_at_idx" ON "users"("status", "submitted_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_decided_by_id_fkey" FOREIGN KEY ("decided_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_decided_by_id_fkey" FOREIGN KEY ("decided_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
