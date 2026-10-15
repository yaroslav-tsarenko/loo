import 'server-only'
import { cache } from 'react'
import { and, eq } from 'drizzle-orm'
import { first, getDb, type Conn } from '@/db/client'
import { systemState, userSettings } from '@/db/schema'
import { userScope } from './auth'
import { getUser } from './auth/session'

export type ThemeSetting = 'system' | 'light' | 'dark'

export interface AppSettings {
  vaultPath: string | null
  theme: ThemeSetting
  sound: boolean
  volume: number
  dailyGoal: number
  newCardsPerDay: number
  sessionSize: number
  dailyMinutes: number
  haptics: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  vaultPath: null,
  theme: 'system',
  sound: true,
  volume: 0.6,
  dailyGoal: 20,
  newCardsPerDay: 20,
  sessionSize: 20,
  dailyMinutes: 20,
  haptics: true,
}

export type UserSettingKey = Exclude<keyof AppSettings, 'vaultPath'>

function coerce<K extends keyof AppSettings>(key: K, value: unknown): AppSettings[K] {
  const fallback = DEFAULT_SETTINGS[key]
  switch (key) {
    case 'vaultPath':
      return (typeof value === 'string' && value.trim() ? value.trim() : null) as AppSettings[K]
    case 'theme':
      return (value === 'light' || value === 'dark' || value === 'system' ? value : fallback) as AppSettings[K]
    case 'sound':
    case 'haptics':
      return (typeof value === 'boolean' ? value : fallback) as AppSettings[K]
    case 'volume':
      return (typeof value === 'number' && value >= 0 && value <= 1 ? value : fallback) as AppSettings[K]
    default:
      return (typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= 500 ? value : fallback) as AppSettings[K]
  }
}

// ── System state (server-only keys: cooldowns, fingerprints, local vault path) ─────────────────────────────────

export async function readSystem(key: string, conn: Conn = getDb()): Promise<unknown> {
  return (await first(conn.select().from(systemState).where(eq(systemState.key, key))))?.value
}

export async function writeSystem(key: string, value: unknown, conn: Conn = getDb()): Promise<void> {
  if (value === null || value === undefined) await conn.delete(systemState).where(eq(systemState.key, key))
  else await conn.insert(systemState).values({ key, value }).onConflictDoUpdate({ target: systemState.key, set: { value } })
}

// Local vault path (admin, local dev only): global, not per user.
export async function readVaultPath(): Promise<string | null> {
  // Deployed builds always read ./content (see src/server/content.ts): skip the lookup.
  if (process.env.VERCEL) return null
  return coerce('vaultPath', await readSystem('vaultPath'))
}

export async function writeVaultPath(value: string | null): Promise<void> {
  await writeSystem('vaultPath', coerce('vaultPath', value))
}

// ── Per-user settings ──────────────────────────────────────────────────────────────────────────────────────────

export async function settingsFor(conn: Conn, userId: string): Promise<AppSettings> {
  const rows = await conn.select().from(userSettings).where(eq(userSettings.userId, userId))
  const out: AppSettings = { ...DEFAULT_SETTINGS }
  for (const row of rows) {
    if (row.key in DEFAULT_SETTINGS && row.key !== 'vaultPath') {
      const key = row.key as UserSettingKey
      ;(out as unknown as Record<string, unknown>)[key] = coerce(key, row.value)
    }
  }
  return out
}

// The current user's settings (defaults when signed out) plus the global vault path. Deduplicated per request.
export const readSettings = cache(async (): Promise<AppSettings> => {
  const [user, vaultPath] = await Promise.all([getUser(), readVaultPath()])
  if (!user) return { ...DEFAULT_SETTINGS, vaultPath }
  return { ...(await userScope((db, userId) => settingsFor(db, userId))), vaultPath }
})

export async function writeSetting<K extends UserSettingKey>(key: K, value: AppSettings[K]): Promise<AppSettings[K]> {
  const clean = coerce(key, value)
  await userScope(async (db, userId) => {
    if (clean === null) await db.delete(userSettings).where(and(eq(userSettings.userId, userId), eq(userSettings.key, key)))
    else await db.insert(userSettings).values({ userId, key, value: clean }).onConflictDoUpdate({ target: [userSettings.userId, userSettings.key], set: { value: clean } })
  })
  return clean
}
