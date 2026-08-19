import { prisma } from "@/lib/prisma";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// upsert rather than find-then-create: two parallel requests for a brand-new
// OAuth user both miss the lookup and race into create, and the loser fails the
// email unique constraint with P2002.
export async function syncUserToDb(supabaseUser: SupabaseUser) {
  return prisma.user.upsert({
    where: { email: supabaseUser.email! },
    update: {},
    create: {
      email: supabaseUser.email!,
      name: supabaseUser.user_metadata?.full_name ?? null,
      // role defaults to NORTHEASTERN_STUDENT, status to ONBOARDING
    },
  });
}
