import { sql, type SQL } from 'drizzle-orm'
import { LEGACY_USER_ID } from '@/lib/supabase/config'

// SQL for moving the legacy owner's rows to a real user (pure: unit-tested; executed by claim.ts).
// Per-user tables and their natural keys (besides user_id). Surrogate-key tables (attempts, xp_ledger, sessions) can
// always be moved; for the rest, rows the target user already has win and the legacy duplicates are dropped.
export const CLAIM_TABLES: ReadonlyArray<{ table: string; keys: readonly string[] }> = [
  { table: 'sessions', keys: [] },
  { table: 'attempts', keys: [] },
  { table: 'xp_ledger', keys: [] },
  { table: 'srs_cards', keys: ['unit_id'] },
  { table: 'mistakes', keys: ['unit_id'] },
  { table: 'chapter_progress', keys: ['chapter_id'] },
  { table: 'task_state', keys: ['unit_id'] },
  { table: 'achievements', keys: ['id'] },
  { table: 'daily_activity', keys: ['day'] },
  { table: 'daily_missions', keys: ['day'] },
  { table: 'reel_state', keys: ['reel_id'] },
  { table: 'lesson_progress', keys: ['lesson_id'] },
  { table: 'news_reads', keys: ['news_id'] },
  { table: 'user_settings', keys: ['key'] },
]

export function claimStatements(userId: string): SQL[] {
  const out: SQL[] = []
  for (const { table, keys } of CLAIM_TABLES) {
    const t = sql.identifier(table)
    if (keys.length > 0) {
      const cols = sql.raw(keys.map((k) => `"${k}"`).join(', '))
      out.push(sql`delete from ${t} where user_id = ${LEGACY_USER_ID} and (${cols}) in (select ${cols} from ${t} where user_id = ${userId})`)
    }
    out.push(sql`update ${t} set user_id = ${userId} where user_id = ${LEGACY_USER_ID}`)
  }
  return out
}

