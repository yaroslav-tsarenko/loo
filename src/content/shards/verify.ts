import path from 'node:path'
import type { VaultConfig } from '../config'
import { searchIn, searchIndexFor } from '../search'
import { ContentStore, loadSnapshot, prebuiltPath, toIndex } from '../store'
import { packSha1, shardsDir } from './read'

// Equivalence of the shards with the full parse (pnpm content:measure --verify, tests/unit/content-shards.test.ts):
// everything the app reads through the store must come out the same from both. JSON drops `undefined` keys, so the
// comparison is on JSON-normalised values.

const plain = (x: unknown) =>
  JSON.stringify(x, (k, v: unknown) => (v instanceof Map ? [...v.entries()] : v instanceof Set ? [...v] : k === 'version' || k === 'scanMs' || k === 'config' || k === 'absolute' || k === 'file' ? undefined : v))

export const VERIFY_QUERIES = ['present perfect', 'event loop', 'Perfekt', 'closure', 'що таке', 'next', 'der die das', 'a', 'promise', 'hello', 'promis', 'closur', 'перфект', 'zzqq event', 'der die das fehlt']

export async function verifyShards(config: VaultConfig): Promise<string[]> {
  const problems: string[] = []
  const check = (what: string, a: unknown, b: unknown) => {
    if (plain(a) !== plain(b)) problems.push(`${what} differs`)
  }
  const full = await loadSnapshot(config, new Map(), 1)
  const index = toIndex(full)
  const store = new ContentStore(config, false, prebuiltPath(config), true)
  const loaded = await store.get()
  if (!store.shardStats()) return ['the store did not take the shards (missing, stale or another V8)']
  for (const key of ['guides', 'chapters', 'chapterByPath', 'units', 'unitsByChapter', 'placementUnits', 'placementChapters', 'reels', 'translations', 'backlinks', 'links', 'issues', 'error'] as const) {
    check(`index.${key}`, loaded[key], index[key])
  }
  for (const [chapterId, units] of full.unitsByChapter) {
    check(`chapterUnits(${chapterId})`, await store.chapterUnits(chapterId), units)
  }
  const reelsByChapter = new Map<string, typeof full.reels>()
  for (const reel of full.reels) reelsByChapter.set(reel.chapterId, [...(reelsByChapter.get(reel.chapterId) ?? []), reel])
  for (const chapter of full.chapters.keys()) check(`chapterReels(${chapter})`, await store.chapterReels(chapter), reelsByChapter.get(chapter) ?? [])
  const ids = [...full.units.keys()]
  const bodies = await store.units(ids)
  for (const id of ids) check(`unit(${id})`, bodies.get(id), full.units.get(id))
  check('reels(ids)', [...(await store.reels(full.reels.map((r) => r.id))).values()], full.reels)
  for (const [id, unit] of full.placementUnits) check(`placementUnit(${id})`, await store.placementUnit(id), unit)
  const texts = new Map<string, string>()
  await store.forEachGuideText((_guide, t) => {
    for (const [id, text] of t) texts.set(id, text)
  })
  // the order chapters are listed in differs between the two (by guide here)
  check('plainText', [...texts].sort(), [...full.plainText].sort())
  const dir = shardsDir(config)
  const manifest = JSON.parse(await (await import('node:fs/promises')).readFile(path.join(dir, 'manifest.json'), 'utf8')) as { shards: { guides: Array<{ pack: string; sha1: string }> } }
  for (const g of manifest.shards.guides) if ((await packSha1(dir, g.pack)) !== g.sha1) problems.push(`pack ${g.pack} sha1 differs`)
  // search: the prebuilt index must rank like the one built from the parse
  const built = await searchIndexFor(full)
  const loadedIndex = await store.searchIndex()
  for (const q of VERIFY_QUERIES) {
    const a = searchIn(loadedIndex, q)
    const b = searchIn(built, q)
    // same hits in the same order; scores agree up to float noise (the sums run in another order after a JSON round trip)
    const strip = (hits: typeof a) => hits.map(({ score: _score, ...rest }) => rest)
    const close = a.length === b.length && a.every((h, i) => Math.abs(h.score - b[i]!.score) <= 1e-9 * Math.max(1, Math.abs(h.score)))
    if (JSON.stringify(strip(a)) !== JSON.stringify(strip(b)) || !close) problems.push(`search «${q}» differs`)
  }
  return problems
}
