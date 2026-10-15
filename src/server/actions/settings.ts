'use server'

import { access } from 'node:fs/promises'
import path from 'node:path'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { defaultVaultConfig, normalizeVaultPath } from '@/content/config'
import { getContentStore } from '@/content/store'
import { getDb } from '@/db/client'
import { achievements, attempts, chapterProgress, dailyActivity, dailyMissions, mistakes, reelState, sessions, srsCards, taskState, unitAliases, xpLedger } from '@/db/schema'
import { parseInput, requireSession } from '../auth-guard'
import { DEFAULT_SETTINGS, writeSetting, type AppSettings } from '../settings'

// Only user-facing settings are writable from the client; vaultPath has its own action and
// "internal.*" keys (cooldowns) must never be reachable from here.
const WRITABLE = Object.keys(DEFAULT_SETTINGS).filter((k) => k !== 'vaultPath') as Exclude<keyof AppSettings, 'vaultPath'>[]
const settingKey = z.enum(WRITABLE as [Exclude<keyof AppSettings, 'vaultPath'>, ...Exclude<keyof AppSettings, 'vaultPath'>[]])
const settingValue = z.union([z.string().max(20), z.number(), z.boolean()])

export async function updateSetting<K extends Exclude<keyof AppSettings, 'vaultPath'>>(rawKey: K, rawValue: AppSettings[K]): Promise<AppSettings[K]> {
  await requireSession()
  const key = parseInput(settingKey, rawKey) as K
  const value = parseInput(settingValue, rawValue) as AppSettings[K]
  // writeSetting coerces per key (type and range), falling back to the default.
  const saved = await writeSetting(key, value)
  if (key === 'theme' || key === 'dailyGoal' || key === 'dailyMinutes' || key === 'haptics') revalidatePath('/', 'layout')
  return saved
}

export async function updateVaultPath(rawPath: string): Promise<{ ok: boolean; message: string }> {
  await requireSession()
  // Deployed builds always read ./content: a server-side path from the client is never honoured there.
  if (process.env.VERCEL) return { ok: false, message: 'На сервері посібники беруться з ./content — шлях до vault змінюється лише локально' }
  const raw = parseInput(z.string().max(1024), rawPath)
  const trimmed = raw.trim()
  const base = defaultVaultConfig()
  const target = trimmed ? normalizeVaultPath(trimmed) : base.vaultPath
  try {
    await access(path.join(target, base.guidesDir))
  } catch {
    return { ok: false, message: `У ${target} немає папки ${base.guidesDir}/` }
  }
  await writeSetting('vaultPath', trimmed ? target : null)
  const snapshot = await getContentStore().setConfig({ ...base, vaultPath: target })
  revalidatePath('/', 'layout')
  return { ok: true, message: `Знайдено посібників: ${snapshot.guides.length}` }
}

export async function resetProgress(confirmation: string): Promise<{ ok: boolean }> {
  await requireSession()
  if (confirmation !== 'СКИНУТИ') return { ok: false }
  const db = getDb()
  await db.transaction(async (tx) => {
    for (const table of [attempts, srsCards, mistakes, chapterProgress, taskState, xpLedger, achievements, dailyActivity, sessions, unitAliases, dailyMissions, reelState]) {
      await tx.delete(table)
    }
  })
  revalidatePath('/', 'layout')
  return { ok: true }
}
