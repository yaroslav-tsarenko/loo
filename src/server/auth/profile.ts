import 'server-only'
import { cache } from 'react'
import { and, eq, isNull, ne } from 'drizzle-orm'
import { first, getDb } from '@/db/client'
import { profiles, type ProfileRole } from '@/db/schema'
import { isAdminEmail } from '@/lib/admin'
import { userBase } from '../base'
import { claimLegacyData } from './claim'
import { getUser, type AuthUser } from './session'

export type Profile = typeof profiles.$inferSelect

function fallbackName(user: AuthUser): string | null {
  return user.name ?? (user.email ? user.email.split('@')[0]!.slice(0, 60) : null)
}

// Creates the profile on first sign-in (system write: there is no profile to scope by yet). For a verified
// ADMIN_EMAILS address it also grants the admin role and claims the legacy single-user progress.
// Called from the sign-in flows (password, OAuth/email callback) and lazily by getProfile().
export async function ensureProfile(user: AuthUser, opts: { verifiedEmail?: boolean } = {}): Promise<Profile> {
  const db = getDb()
  const now = Date.now()
  const admin = Boolean(opts.verifiedEmail) && isAdminEmail(user.email)
  const role: ProfileRole = admin ? 'admin' : 'user'
  // cross-user: profile creation by id (= the verified auth user id), before any user scope exists.
  await db.insert(profiles).values({ id: user.id, displayName: fallbackName(user), avatarUrl: user.avatarUrl, role, createdAt: now, updatedAt: now }).onConflictDoNothing()
  if (admin) {
    // cross-user: role is server-only; promoted here for ADMIN_EMAILS (never demoted automatically).
    await db.update(profiles).set({ role: 'admin', updatedAt: now }).where(and(eq(profiles.id, user.id), ne(profiles.role, 'admin')))
    await claimLegacyData(db, user.id)
  }
  if (user.avatarUrl) {
    // cross-user: keep the OAuth avatar unless the user set one.
    await db.update(profiles).set({ avatarUrl: user.avatarUrl }).where(and(eq(profiles.id, user.id), isNull(profiles.avatarUrl)))
  }
  // cross-user: read back the row just written for this user id.
  const row = await first(db.select().from(profiles).where(eq(profiles.id, user.id)))
  if (!row) throw new Error('Profile not created')
  return row
}

// The signed-in user's profile (created on demand). Read with the settings and the active enrollment in one
// transaction (src/server/base.ts); deduplicated per request.
export const getProfile = cache(async (): Promise<Profile | null> => (await userBase())?.profile ?? null)

export async function isAdmin(): Promise<boolean> {
  const user = await getUser()
  if (!user) return false
  if (user.dev) return true
  return (await getProfile())?.role === 'admin'
}
