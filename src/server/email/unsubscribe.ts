import 'server-only'
import { eq } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { emailTokens, userSettings } from '@/db/schema'

// Unsubscribe links carry an opaque per-learner token (email_tokens, created by the reminder worker).
// Server-only: the owner connection reads the token table, which no client role can see.
const TOKEN = /^[A-Za-z0-9_-]{16,64}$/

export async function userForToken(token: string | null | undefined): Promise<string | null> {
  if (!token || !TOKEN.test(token)) return null
  // cross-user: the link carries only the token; it identifies the learner
  const rows = await getDb().select({ userId: emailTokens.userId }).from(emailTokens).where(eq(emailTokens.token, token)).limit(1)
  return rows[0]?.userId ?? null
}

/** Turns reminder emails off for the token's learner. Returns false for an unknown token. */
export async function unsubscribe(token: string | null | undefined): Promise<boolean> {
  const userId = await userForToken(token)
  if (!userId) return false
  await getDb()
    .insert(userSettings)
    .values({ userId, key: 'emailReminders', value: false })
    .onConflictDoUpdate({ target: [userSettings.userId, userSettings.key], set: { value: false } })
  return true
}
