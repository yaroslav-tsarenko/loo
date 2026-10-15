import 'server-only'
import { eq } from 'drizzle-orm'
import { getDb } from '@/db/client'
import {
  achievements,
  attempts,
  chapterProgress,
  dailyActivity,
  dailyMissions,
  lessonProgress,
  mistakes,
  newsReads,
  profiles,
  reelState,
  sessions,
  srsCards,
  taskState,
  userSettings,
  xpLedger,
} from '@/db/schema'
import { writeSystem } from '../settings'
import { userScope } from '../auth'

// GDPR export: everything stored about the signed-in user (docs/SECURITY.md §4.8).
export async function exportUserData(): Promise<Record<string, unknown>> {
  return userScope(
    async (db, userId) => ({
      format: 'levelup/user-export',
      version: 2,
      exportedAt: new Date().toISOString(),
      userId,
      profile: (await db.select().from(profiles).where(eq(profiles.id, userId)))[0] ?? null,
      settings: await db.select().from(userSettings).where(eq(userSettings.userId, userId)),
      attempts: await db.select().from(attempts).where(eq(attempts.userId, userId)),
      srsCards: await db.select().from(srsCards).where(eq(srsCards.userId, userId)),
      mistakes: await db.select().from(mistakes).where(eq(mistakes.userId, userId)),
      chapterProgress: await db.select().from(chapterProgress).where(eq(chapterProgress.userId, userId)),
      lessonProgress: await db.select().from(lessonProgress).where(eq(lessonProgress.userId, userId)),
      taskState: await db.select().from(taskState).where(eq(taskState.userId, userId)),
      xpLedger: await db.select().from(xpLedger).where(eq(xpLedger.userId, userId)),
      achievements: await db.select().from(achievements).where(eq(achievements.userId, userId)),
      dailyActivity: await db.select().from(dailyActivity).where(eq(dailyActivity.userId, userId)),
      dailyMissions: await db.select().from(dailyMissions).where(eq(dailyMissions.userId, userId)),
      sessions: await db.select().from(sessions).where(eq(sessions.userId, userId)),
      reelState: await db.select().from(reelState).where(eq(reelState.userId, userId)),
      newsReads: await db.select().from(newsReads).where(eq(newsReads.userId, userId)),
    }),
    { tx: true },
  )
}

// "Delete my account": removes the profile, and ON DELETE CASCADE removes every per-user row. The Supabase Auth
// user itself can only be deleted with the secret (service-role) key, which this app deliberately doesn't hold:
// the request is recorded in system_state for the owner (Dashboard → Authentication → Users → Delete user, which
// also fires the on_auth_user_deleted trigger). Signing in again before that starts a fresh, empty profile.
export async function deleteUserData(userId: string): Promise<void> {
  // cross-user: system write — the profile row is not deletable by the `authenticated` role (no DELETE grant).
  await getDb().delete(profiles).where(eq(profiles.id, userId))
  await writeSystem(`deletion:${userId}`, { requestedAt: Date.now() })
}
