import 'server-only'
import { sql } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { readSystem } from '../settings'

// The admin-session generation (system_state 'admin_session_epoch'): admin cookies carry the epoch they were signed
// in; bumping it signs every admin session out (src/lib/admin-token.ts).
const KEY = 'admin_session_epoch'

export async function adminEpoch(): Promise<number> {
  const v = await readSystem(KEY)
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 ? v : 0
}

export async function revokeAdminSessions(): Promise<number> {
  // system: global state, not a learner's row
  const rows = (await getDb().execute(sql`
    insert into system_state (key, value) values (${KEY}, '1'::jsonb)
    on conflict (key) do update set value = to_jsonb(coalesce((system_state.value)::text::int, 0) + 1)
    returning value`)) as unknown as Array<{ value: number }>
  return Number(rows[0]?.value ?? 0)
}

// A TOTP code may be used once: the last accepted step is stored, older or equal steps are refused (a code seen over
// the owner's shoulder, or replayed from a log, is dead).
const TOTP_KEY = 'admin_totp_last_step'

export async function claimTotpStep(step: number): Promise<boolean> {
  const rows = (await getDb().execute(sql`
    insert into system_state (key, value) values (${TOTP_KEY}, to_jsonb(${step}::int))
    on conflict (key) do update set value = excluded.value
      where coalesce((system_state.value)::text::int, -1) < ${step}
    returning value`)) as unknown as unknown[]
  return rows.length > 0
}
