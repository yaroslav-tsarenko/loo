import 'server-only'
import { eq } from 'drizzle-orm'
import { getDb } from '@/db/client'
import {
  achievements,
  analyticsEvents,
  attempts,
  buckLedger,
  chapterProgress,
  dailyActivity,
  dailyMissions,
  emailLog,
  enrollments,
  examResults,
  frozenDays,
  gemLedger,
  inventory,
  leagueMembers,
  lessonProgress,
  mistakes,
  newsReads,
  profiles,
  reelState,
  sessions,
  srsCards,
  taskState,
  topicResults,
  userSettings,
  userState,
  xpLedger,
} from '@/db/schema'
import { writeSystem } from '../settings'
import { userScope } from '../auth'

// GDPR export: everything stored about the signed-in user (docs/SECURITY.md §4.8).
export async function exportUserData(): Promise<Record<string, unknown>> {
  const own = await userScope(
    async (db, userId) => ({
      format: 'levelup/user-export',
      version: 5,
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
      enrollments: await db.select().from(enrollments).where(eq(enrollments.userId, userId)),
      topicResults: await db.select().from(topicResults).where(eq(topicResults.userId, userId)),
      examResults: await db.select().from(examResults).where(eq(examResults.userId, userId)),
      gameState: await db.select().from(userState).where(eq(userState.userId, userId)),
      gemLedger: await db.select().from(gemLedger).where(eq(gemLedger.userId, userId)),
      inventory: await db.select().from(inventory).where(eq(inventory.userId, userId)),
      frozenDays: await db.select().from(frozenDays).where(eq(frozenDays.userId, userId)),
      leagues: await db.select().from(leagueMembers).where(eq(leagueMembers.userId, userId)),
      buckLedger: await db.select().from(buckLedger).where(eq(buckLedger.userId, userId)),
    }),
    { tx: true },
  )
  // server-only tables (no learner grant): read as the system, after the learner's transaction, filtered to them
  const userId = String(own.userId)
  return { ...own, ...(await systemRowsOf(userId)) }
}

async function systemRowsOf(userId: string) {
  // cross-user: system reads of server-only tables, filtered to this learner (their own data export)
  const db = getDb()
  return {
    emailLog: await db.select().from(emailLog).where(eq(emailLog.userId, userId)),
    analyticsEvents: await db.select().from(analyticsEvents).where(eq(analyticsEvents.userId, userId)),
  }
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
