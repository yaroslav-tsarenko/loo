import 'server-only'
import { connection } from 'next/server'
import { defaultVaultConfig, normalizeVaultPath } from '@/content/config'
import { getContentStore, type ChapterDocument, type ContentSnapshot } from '@/content/store'
import { readVaultPath } from './settings'
import { syncUnits } from './services/units-sync'
import { searchContent } from '@/content/search'

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
  await syncUnits(snapshot)
  warmSearch(snapshot)
  return snapshot
}

export async function getDocument(chapterId: string): Promise<ChapterDocument | null> {
  await boot()
  return getContentStore().document(chapterId)
}

const warmed = new WeakSet<ContentSnapshot>()

function warmSearch(snapshot: ContentSnapshot): void {
  if (warmed.has(snapshot)) return
  warmed.add(snapshot)
  setTimeout(() => searchContent(snapshot, 'warm'), 1500)
}
