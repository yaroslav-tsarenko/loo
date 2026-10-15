import 'server-only'
import { sql } from 'drizzle-orm'
import type { Db } from '@/db/client'
import { LEGACY_USER_ID } from '@/lib/supabase/config'
import { claimStatements } from './claim-sql'

// Moves the single-user era's progress (owned by the legacy placeholder) to `userId`, then drops the placeholder.
// System operation (runs as the table owner, outside RLS): only called for a verified ADMIN_EMAILS sign-in.
export async function claimLegacyData(db: Db, userId: string): Promise<boolean> {
  if (userId === LEGACY_USER_ID) return false
  return db.transaction(async (tx) => {
    const legacy = await tx.execute(sql`select 1 from profiles where id = ${LEGACY_USER_ID} for update`)
    if ((legacy as unknown as unknown[]).length === 0) return false
    for (const statement of claimStatements(userId)) await tx.execute(statement)
    await tx.execute(sql`delete from profiles where id = ${LEGACY_USER_ID}`)
    console.info('[auth] legacy progress claimed by admin', { userId })
    return true
  })
}
