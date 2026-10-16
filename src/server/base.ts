import 'server-only'
import { cache } from 'react'
import { eq } from 'drizzle-orm'
import { profiles } from '@/db/schema'
import { ensureProfile, type Profile } from './auth/profile'
import { getUser } from './auth/session'
import { activeRead, fixActive, type Enrollment } from './courses/enrollment'
import { skillStatesRead } from './courses/skills'
import { read as dbRead, readAll } from './db/batch'
import { withUser } from './db/with-user'
import { settingsRead, type AppSettings } from './settings'

// The signed-in learner's base rows — profile, settings and the active enrollment — read together in ONE transaction
// (one RLS setup, the three selects in one statement: 4 round trips instead of ~12). getProfile(), readSettings() and
// activeCourse() all derive from it, so a page render pays for it once (React cache), and actions get the same three
// rows in a single trip.
//
// Never await it (or anything built on it) inside a userScope transaction: with one pooled connection a cached
// promise started outside would wait for the connection that transaction holds.

export interface UserBase {
  profile: Profile
  settings: Omit<AppSettings, 'vaultPath'>
  // the active enrollment (pre-course-platform learners are enrolled into the default course on first read)
  active: Enrollment | null
  // per-skill level estimates of language courses: course id → stored jsonb (src/server/courses/skills.ts)
  skillStates: Map<string, unknown>
}

export const userBase = cache(async (): Promise<UserBase | null> => {
  const user = await getUser()
  if (!user) return null
  const read = await withUser(
    user,
    async (db) => {
      // one statement (src/server/db/batch.ts)
      const [profile, settings, active, skillStates] = await readAll(db, [
        dbRead(db.select().from(profiles).where(eq(profiles.id, user.id)), (rows) => rows[0]),
        settingsRead(db, user.id),
        activeRead(db, user.id),
        skillStatesRead(db, user.id),
      ])
      // rare: no active course yet (fix-up writes, same transaction)
      return { profile, settings, active: active ?? (await fixActive(db, user.id, profile ?? null)), skillStates }
    },
    { tx: true },
  )
  // First sign-in: the profile is created by the system, outside the user's scope (a new profile has no onboarding,
  // so the fix-up above had nothing to enroll).
  const profile = read.profile ?? (await ensureProfile(user))
  return { profile, settings: read.settings, active: read.active ?? null, skillStates: read.skillStates }
})
