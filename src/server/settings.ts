import 'server-only'
import { cache } from 'react'
import { eq } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { settings } from '@/db/schema'

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

// Deduplicated per request: many server components read settings during one render.
export const readSettings = cache(async (): Promise<AppSettings> => {
  const rows = await getDb().select().from(settings)
  const out: AppSettings = { ...DEFAULT_SETTINGS }
  for (const row of rows) {
    if (row.key in DEFAULT_SETTINGS) {
      const key = row.key as keyof AppSettings
      ;(out as unknown as Record<string, unknown>)[key] = coerce(key, row.value)
    }
  }
  return out
})

export async function writeSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<AppSettings[K]> {
  const clean = coerce(key, value)
  const db = getDb()
  if (clean === null) await db.delete(settings).where(eq(settings.key, key))
  else await db.insert(settings).values({ key, value: clean }).onConflictDoUpdate({ target: settings.key, set: { value: clean } })
  return clean
}
