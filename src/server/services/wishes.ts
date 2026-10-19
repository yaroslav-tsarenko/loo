import 'server-only'
import { sql } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { profiles } from '@/db/schema'

// «Хочу це» votes from onboarding (profiles.onboarding.wishes, ids from src/course/catalog-soon.ts WISH_IDS), counted
// across all learners — what to launch next. System read (no user scope): call it from admin-only code.
export async function countWishes(): Promise<Array<{ id: string; votes: number }>> {
  const wish = sql<string>`w.id`
  const rows = await getDb()
    .select({ id: wish, votes: sql<number>`count(*)::int` })
    .from(sql`${profiles}, jsonb_array_elements_text(coalesce(${profiles.onboarding} -> 'wishes', '[]'::jsonb)) as w(id)`)
    .groupBy(wish)
    .orderBy(sql`count(*) desc`, wish)
  return rows
}
