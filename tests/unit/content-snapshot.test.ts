import { cpSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { buildPrebuilt, ContentStore, prebuiltPath } from '@/content/store'

// The build-time content snapshot (pnpm content:snapshot → src/content/store.ts): a cold server loads the parsed vault
// instead of parsing it, gets exactly the same snapshot, and ignores a snapshot that no longer matches the vault.

const dir = mkdtempSync(path.join(tmpdir(), 'levelup-snapshot-'))
cpSync(path.resolve(__dirname, '../fixtures/vault'), dir, { recursive: true })
const config = { vaultPath: dir, guidesDir: 'Guides' }

afterAll(() => rmSync(dir, { recursive: true, force: true }))

const plain = (x: unknown) => JSON.stringify(x, (k, v: unknown) => (v instanceof Map ? [...v.entries()] : v instanceof Set ? [...v] : k === 'version' || k === 'scanMs' ? undefined : v))

describe('prebuilt content snapshot', () => {
  it('loads the same snapshot the parser builds, documents included', async () => {
    const { data } = await buildPrebuilt(config)
    const file = prebuiltPath(config)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, data)
    const parsed = await new ContentStore(config, false).get()
    const fromFile = new ContentStore(config, false, file)
    const loaded = await fromFile.get()
    const usedFile = (store: ContentStore) => (store as unknown as { prebuiltFiles: unknown }).prebuiltFiles !== null
    expect(usedFile(fromFile)).toBe(true)
    expect(plain(loaded.guides)).toBe(plain(parsed.guides))
    expect(plain([...loaded.units.values()])).toBe(plain([...parsed.units.values()]))
    expect(plain([...loaded.chapters.values()])).toBe(plain([...parsed.chapters.values()]))
    expect(loaded.config).toEqual(config)
    expect(typeof loaded.links.constructor).toBe('function')
    expect(loaded.links.constructor.name).toBe('LinkIndex')
    const chapter = [...loaded.chapters.values()].find((c) => c.kind !== 'index')!
    expect(plain((await fromFile.document(chapter.id))?.root)).toBe(plain((await new ContentStore(config, false).document(chapter.id))?.root))
  })

  it('is ignored once the vault changed (the listing no longer matches)', async () => {
    const guides = path.join(dir, 'Guides')
    const guide = readdirSync(guides).find((n) => !n.startsWith('.'))!
    writeFileSync(path.join(guides, guide, 'zz-new-note.md'), '# New\n\nFresh text.\n')
    const store = new ContentStore(config, false, prebuiltPath(config))
    const snapshot = await store.get()
    expect((store as unknown as { prebuiltFiles: unknown }).prebuiltFiles).toBeNull()
    expect([...snapshot.chapters.values()].some((c) => c.title === 'New' || c.path.endsWith('zz-new-note.md'))).toBe(true)
  })
})
