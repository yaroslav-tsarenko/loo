import 'server-only'
import { cache } from 'react'
import { connection } from 'next/server'
import { defaultVaultConfig, normalizeVaultPath } from '@/content/config'
import type { LearningUnit } from '@/content/model'
import type { Reel } from '@/content/parse/reels'
import { getContentStore, type ChapterDocument, type ContentSnapshot } from '@/content/store'
import { readVaultPath } from './settings'
import { syncUnits } from './services/units-sync'

const bootKey = Symbol.for('interview-prep.boot')
type GlobalWithBoot = typeof globalThis & { [bootKey]?: Promise<void>; [key: symbol]: unknown }

async function boot(): Promise<void> {
  const g = globalThis as GlobalWithBoot
  if (!g[bootKey]) {
    g[bootKey] = (async () => {
      const vaultPath = await readVaultPath()
      const store = getContentStore()
      // On Vercel the guides always come from ./content (VAULT_PATH); a local vault path saved in settings is ignored.
      if (vaultPath && !process.env.VERCEL) {
        const base = defaultVaultConfig()
        await store.setConfig({ ...base, vaultPath: normalizeVaultPath(vaultPath) })
      }
    })()
  }
  return g[bootKey]
}

export async function getContent(): Promise<ContentSnapshot> {
  await connection()
  await boot()
  const snapshot = await getContentStore().get()
  await syncUnits(snapshot, await getContentStore().unitsSync())
  return snapshot
}

export async function getDocument(chapterId: string): Promise<ChapterDocument | null> {
  await boot()
  return getContentStore().document(chapterId)
}


// Unit and reel bodies. `cache()` makes the components of one render that ask for the same ids share one promise.
export const getUnit = cache(async (id: string): Promise<LearningUnit | null> => {
  await boot()
  return getContentStore().unit(id)
})

const unitsKey = (ids: readonly string[]) => ids.join('\n')
const unitsOf = cache(async (key: string): Promise<Map<string, LearningUnit>> => {
  await boot()
  return getContentStore().units(key ? key.split('\n') : [])
})
// `cache()` compares arguments by identity, so the ids go in as one string
export const getUnits = (ids: readonly string[]): Promise<Map<string, LearningUnit>> => unitsOf(unitsKey(ids))

export const getChapterUnits = cache(async (chapterId: string): Promise<LearningUnit[]> => {
  await boot()
  return getContentStore().chapterUnits(chapterId)
})

export async function getReels(ids: readonly string[]): Promise<Map<string, Reel>> {
  await boot()
  return getContentStore().reels(ids)
}

export async function getChapterReels(chapterId: string): Promise<Reel[]> {
  await boot()
  return getContentStore().chapterReels(chapterId)
}

export async function getPlacementUnits(guideId: string): Promise<Map<string, LearningUnit>> {
  await boot()
  return getContentStore().placementUnits(guideId)
}

export async function getPlacementUnit(id: string): Promise<LearningUnit | null> {
  await boot()
  return getContentStore().placementUnit(id)
}
