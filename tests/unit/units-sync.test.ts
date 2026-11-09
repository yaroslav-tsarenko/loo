import { PGlite } from '@electric-sql/pglite'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { attempts, profiles, unitAliases, units } from '@/db/schema'
import type { ContentSnapshot, UnitsSyncSource } from '@/content/store'
import { unitsFingerprint, type UnitRow } from '@/content/units-rows'

// syncUnits (src/server/services/units-sync.ts) against a real Postgres engine (PGlite): the `units` table mirrors the
// rows of the content source, and progress follows a renamed hash-id unit.

vi.mock('server-only', () => ({}))
const pg = new PGlite()
const db = drizzle(pg)
const system = new Map<string, unknown>()
vi.mock('@/db/client', () => ({ getDb: () => db }))
vi.mock('@/server/settings', () => ({
  readSystem: async (key: string) => system.get(key),
  writeSystem: async (key: string, value: unknown) => void system.set(key, value),
}))

const { syncUnits } = await import('@/server/services/units-sync')

const row = (id: string, label: string, over: Partial<UnitRow> = {}): UnitRow => ({ id, kind: 'quiz', guideId: 'g', chapterId: 'g/c1', level: null, frequency: null, qtype: 'single', label, idSource: 'explicit', ...over })

let version = 0
function source(rows: UnitRow[]): UnitsSyncSource {
  return { fingerprint: () => unitsFingerprint(rows), rows: async () => rows }
}
// a new snapshot version defeats the in-process marker, like a new deploy
const snapshot = (): ContentSnapshot => ({ version: ++version, config: { vaultPath: '/vault', guidesDir: 'Guides' } }) as ContentSnapshot

beforeAll(async () => {
  await migrate(db, { migrationsFolder: 'drizzle' })
}, 60_000)

beforeEach(async () => {
  system.clear()
  await db.delete(unitAliases)
  await db.delete(attempts)
  await db.delete(units)
})

describe('syncUnits', () => {
  it('writes the rows of the source and its fingerprint', async () => {
    const rows = [row('a', 'First question'), row('b', 'Second', { kind: 'flashcard', qtype: 'definition', frequency: 'часто', level: 'junior' })]
    await syncUnits(snapshot(), source(rows))
    const stored = await db.select().from(units)
    expect(stored.map((u) => u.id).sort()).toEqual(['a', 'b'])
    expect(stored.find((u) => u.id === 'b')).toMatchObject({ kind: 'flashcard', guideId: 'g', chapterId: 'g/c1', level: 'junior', frequency: 'часто', qtype: 'definition', label: 'Second', idSource: 'explicit', missingSince: null })
    expect(system.get('internal.unitsFingerprint')).toBe(unitsFingerprint(rows))
  })

  it('does not read the rows while the fingerprint is current', async () => {
    const rows = [row('a', 'First question')]
    await syncUnits(snapshot(), source(rows))
    const rowsOf = vi.fn(async () => rows)
    await syncUnits(snapshot(), { fingerprint: () => unitsFingerprint(rows), rows: rowsOf })
    expect(rowsOf).not.toHaveBeenCalled()
  })

  it('marks units that left the content as missing, and clears it when they come back', async () => {
    await syncUnits(snapshot(), source([row('a', 'First question'), row('b', 'Second')]))
    await syncUnits(snapshot(), source([row('a', 'First question')]))
    expect((await db.select().from(units).where(eq(units.id, 'b')))[0]!.missingSince).not.toBeNull()
    await syncUnits(snapshot(), source([row('a', 'First question'), row('b', 'Second')]))
    expect((await db.select().from(units).where(eq(units.id, 'b')))[0]!.missingSince).toBeNull()
  })

  it('moves progress to a renamed hash-id unit with a similar label, and records the alias', async () => {
    const label = 'Що виведе typeof null у JavaScript?'
    await syncUnits(snapshot(), source([row('h:old', label, { idSource: 'hash' }), row('keep', 'Unrelated')]))
    const userId = '00000000-0000-4000-8000-000000000001'
    await db.insert(profiles).values({ id: userId, createdAt: 1, updatedAt: 1 }).onConflictDoNothing()
    await db.insert(attempts).values({ userId, unitId: 'h:old', kind: 'quiz', outcome: 'correct', correct: true, guideId: 'g', chapterId: 'g/c1', answeredAt: 1, day: '2026-11-09' })
    await syncUnits(snapshot(), source([row('h:new', 'Що виведе typeof null у JavaScript??', { idSource: 'hash' }), row('keep', 'Unrelated')]))
    expect((await db.select().from(units)).map((u) => u.id).sort()).toEqual(['h:new', 'keep'])
    expect((await db.select().from(attempts))[0]!.unitId).toBe('h:new')
    expect(await db.select().from(unitAliases)).toMatchObject([{ oldId: 'h:old', newId: 'h:new' }])
  })

  it('does not alias units of another kind or chapter', async () => {
    const label = 'Що виведе typeof null у JavaScript?'
    await syncUnits(snapshot(), source([row('h:old', label, { idSource: 'hash' })]))
    await syncUnits(snapshot(), source([row('h:new', label, { idSource: 'hash', chapterId: 'g/c2' })]))
    expect(await db.select().from(unitAliases)).toEqual([])
    expect((await db.select().from(units)).find((u) => u.id === 'h:old')!.missingSince).not.toBeNull()
  })
})
