'use server'

import { access } from 'node:fs/promises'
import path from 'node:path'
import { revalidatePath } from 'next/cache'
import { defaultVaultConfig, normalizeVaultPath } from '@/content/config'
import { getContentStore } from '@/content/store'
import { getDb } from '@/db/client'
import { achievements, attempts, chapterProgress, dailyActivity, dailyMissions, mistakes, reelState, sessions, srsCards, taskState, unitAliases, xpLedger } from '@/db/schema'
import { writeSetting, type AppSettings } from '../settings'

export async function updateSetting<K extends Exclude<keyof AppSettings, 'vaultPath'>>(key: K, value: AppSettings[K]): Promise<AppSettings[K]> {
  const saved = await writeSetting(key, value)
  if (key === 'theme' || key === 'dailyGoal' || key === 'dailyMinutes' || key === 'haptics') revalidatePath('/', 'layout')
  return saved
}

export async function updateVaultPath(raw: string): Promise<{ ok: boolean; message: string }> {
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
