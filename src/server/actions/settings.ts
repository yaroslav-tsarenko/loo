'use server'

import { access } from 'node:fs/promises'
import path from 'node:path'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { defaultVaultConfig, normalizeVaultPath } from '@/content/config'
import { getContentStore } from '@/content/store'
import { achievements, attempts, chapterProgress, dailyActivity, dailyMissions, lessonProgress, mistakes, newsReads, reelState, sessions, srsCards, taskState, xpLedger } from '@/db/schema'
import { requireAdmin, requireUser, userScope } from '../auth'
import { parseInput } from '../auth-guard'
import { DEFAULT_SETTINGS, writeSetting, writeVaultPath, type AppSettings, type UserSettingKey } from '../settings'

// Only user-facing settings are writable from the client; vaultPath has its own (admin) action and internal
// state (cooldowns) lives in system_state, which no action can reach.
const WRITABLE = Object.keys(DEFAULT_SETTINGS).filter((k) => k !== 'vaultPath') as UserSettingKey[]
const settingKey = z.enum(WRITABLE as [UserSettingKey, ...UserSettingKey[]])
const settingValue = z.union([z.string().max(20), z.number(), z.boolean()])

export async function updateSetting<K extends UserSettingKey>(rawKey: K, rawValue: AppSettings[K]): Promise<AppSettings[K]> {
  await requireUser()
  const key = parseInput(settingKey, rawKey) as K
  const value = parseInput(settingValue, rawValue) as AppSettings[K]
  // writeSetting coerces per key (type and range), falling back to the default.
  const saved = await writeSetting(key, value)
  // accent: the client already switched (SpeechSettings state) — re-rendering the layout would remount open players
  // (the placement test lost its run on every UK/US tap); the next full load reads the saved value.
  if (key === 'theme' || key === 'dailyGoal' || key === 'dailyMinutes' || key === 'haptics') revalidatePath('/', 'layout')
  return saved
}

export async function updateVaultPath(rawPath: string): Promise<{ ok: boolean; message: string }> {
  await requireAdmin()
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
  await writeVaultPath(trimmed ? target : null)
  const snapshot = await getContentStore().setConfig({ ...base, vaultPath: target })
  revalidatePath('/', 'layout')
  return { ok: true, message: `Знайдено посібників: ${snapshot.guides.length}` }
}

// Wipes the current user's learning progress (settings and profile stay).
export async function resetProgress(confirmation: string): Promise<{ ok: boolean }> {
  await requireUser()
  if (confirmation !== 'СКИНУТИ') return { ok: false }
  await userScope(
    async (tx, userId) => {
      await tx.delete(attempts).where(eq(attempts.userId, userId))
      await tx.delete(srsCards).where(eq(srsCards.userId, userId))
      await tx.delete(mistakes).where(eq(mistakes.userId, userId))
      await tx.delete(chapterProgress).where(eq(chapterProgress.userId, userId))
      await tx.delete(taskState).where(eq(taskState.userId, userId))
      await tx.delete(xpLedger).where(eq(xpLedger.userId, userId))
      await tx.delete(achievements).where(eq(achievements.userId, userId))
      await tx.delete(dailyActivity).where(eq(dailyActivity.userId, userId))
      await tx.delete(dailyMissions).where(eq(dailyMissions.userId, userId))
      await tx.delete(sessions).where(eq(sessions.userId, userId))
      await tx.delete(reelState).where(eq(reelState.userId, userId))
      await tx.delete(lessonProgress).where(eq(lessonProgress.userId, userId))
      await tx.delete(newsReads).where(eq(newsReads.userId, userId))
    },
    { tx: true },
  )
  revalidatePath('/', 'layout')
  return { ok: true }
}
