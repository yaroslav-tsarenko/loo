import 'server-only'
import { cache } from 'react'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { profiles } from '@/db/schema'
import { ensureProfile, type Profile } from './auth/profile'
import { getUser } from './auth/session'
import { activeRead, fixActive, type Enrollment } from './courses/enrollment'
import { skillStatesRead } from './courses/skills'
import { read as dbRead, readAll } from './db/batch'
import { withUser } from './db/with-user'
import { settingsRead, type AppSettings } from './settings'
import type { ShellRead } from './page-shell'

// The signed-in learner's base rows — profile, settings and the active enrollment — read together in ONE transaction
// (one RLS setup, the three selects in one statement: 4 round trips instead of ~12); on a page render, in the same
// transaction as the app shell's reads (pageTx below). getProfile(), readSettings() and
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

function baseReadList(db: Parameters<Parameters<typeof withUser>[1]>[0], userId: string) {
  return [
    dbRead(db.select().from(profiles).where(eq(profiles.id, userId)), (rows) => rows[0]),
    settingsRead(db, userId),
    activeRead(db, userId),
    skillStatesRead(db, userId),
  ] as const
}

// A page render (the proxy marks it: GET, not /api, not a server action) needs the base rows AND the app shell's
// reads (src/server/shell.ts). They go out together: ONE transaction, one statement — instead of a transaction for
// userBase and another for shellData. Actions and route handlers only pay for the base rows.
async function isPageRender(): Promise<boolean> {
  try {
    return (await headers()).get('x-page-render') === '1'
  } catch {
    return false // outside a request (after(), scripts)
  }
}

export interface PageTx {
  base: UserBase
  shell: ShellRead
  // when the shell's reads were taken (the badges / game state are relative to it)
  now: number
}

export const pageTx = cache(async (): Promise<PageTx | null> => {
  const user = await getUser()
  if (!user) return null
  const { shellReadList, settleShell } = await import('./page-shell')
  const now = Date.now()
  const read = await withUser(
    user,
    async (db) => {
      const [profile, settings, active, skillStates, ...shellParts] = await readAll(db, [...baseReadList(db, user.id), ...shellReadList(db, user.id, now)])
      // first sign-in: no profile yet, and the shell's settlement writes rows that reference it — read the shell
      // again below, once the profile exists
      if (!profile) return { profile, settings, active: active ?? null, skillStates, shell: null }
      const fixed = active ?? (await fixActive(db, user.id, profile))
      const shell = await settleShell(db, user.id, now, shellParts)
      return { profile, settings, active: fixed, skillStates, shell }
    },
    { tx: true },
  )
  const profile = read.profile ?? (await ensureProfile(user))
  const shell =
    read.shell ??
    (await withUser(user, async (db) => settleShell(db, user.id, now, await readAll(db, shellReadList(db, user.id, now))), { tx: true }))
  return { base: { profile, settings: read.settings, active: read.active ?? null, skillStates: read.skillStates }, shell, now }
})

export const userBase = cache(async (): Promise<UserBase | null> => {
  const user = await getUser()
  if (!user) return null
  if (await isPageRender()) return (await pageTx())?.base ?? null
  const read = await withUser(
    user,
    async (db) => {
      // one statement (src/server/db/batch.ts)
      const [profile, settings, active, skillStates] = await readAll(db, baseReadList(db, user.id))
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
