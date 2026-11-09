import { cpSync, mkdirSync, readFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { buildPrebuilt, buildUnitsSync, ContentStore, manifestPath, prebuiltPath, unitsSyncPath } from '@/content/store'
import { unitLabel } from '@/content/unit-label'
import { unitRow, unitsFingerprint } from '@/content/units-rows'

// What syncUnits reads of the content (src/server/services/units-sync.ts): the build's rows and fingerprint (manifest.json
// + units-sync.json.br) when the prebuilt snapshot is in use, the units in memory otherwise — the same rows either way.

const dir = mkdtempSync(path.join(tmpdir(), 'levelup-units-sync-'))
cpSync(path.resolve(__dirname, '../fixtures/vault'), dir, { recursive: true })
const config = { vaultPath: dir, guidesDir: 'Guides' }

afterAll(() => rmSync(dir, { recursive: true, force: true }))

async function writeBuild(): Promise<void> {
  const { data, snapshot, fingerprint } = await buildPrebuilt(config)
  const sync = buildUnitsSync(snapshot, fingerprint)
  mkdirSync(path.dirname(prebuiltPath(config)), { recursive: true })
  writeFileSync(prebuiltPath(config), data)
  writeFileSync(unitsSyncPath(config), sync.data)
  writeFileSync(manifestPath(config), JSON.stringify(sync.manifest))
}

describe('units sync source', () => {
  it('rows carry what the units table mirrors, with the unit label', async () => {
    const store = new ContentStore(config, false)
    const unit = (await store.unit([...(await store.get()).units.keys()][0]!))!
    expect(unitRow(unit)).toMatchObject({ id: unit.id, kind: unit.kind, guideId: unit.guideId, chapterId: unit.chapterId, label: unitLabel(unit), idSource: unit.idSource })
  })

  it('the manifest source gives the same fingerprint and rows as the units in memory', async () => {
    await writeBuild()
    const live = await (await new ContentStore(config, false).unitsSync()).rows()
    const prebuilt = new ContentStore(config, false, prebuiltPath(config))
    const source = await prebuilt.unitsSync()
    expect(source.fingerprint()).toBe(JSON.parse(readFileSync(manifestPath(config), 'utf8')).unitsFingerprint)
    expect(source.fingerprint()).toBe(unitsFingerprint(live))
    expect(await source.rows()).toEqual(live)
  })

  it('a stale or missing manifest falls back to the units in memory', async () => {
    await writeBuild()
    writeFileSync(manifestPath(config), JSON.stringify({ format: 1, fingerprint: 'other', unitsFingerprint: 'x', builtAt: '', units: 0 }))
    const store = new ContentStore(config, false, prebuiltPath(config))
    const source = await store.unitsSync()
    expect(source.fingerprint()).toBe(unitsFingerprint(await source.rows()))
    expect(source.fingerprint()).not.toBe('x')
  })

  it('a rows file that does not match the manifest is not trusted', async () => {
    await writeBuild()
    writeFileSync(unitsSyncPath(config), Buffer.from('garbage'))
    const source = await new ContentStore(config, false, prebuiltPath(config)).unitsSync()
    expect((await source.rows()).length).toBeGreaterThan(0)
  })
})

describe('units fingerprint', () => {
  it('changes with any mirrored column of any row', () => {
    const base = { id: 'a', kind: 'quiz', guideId: 'g', chapterId: 'c', level: null, frequency: null, qtype: 'single', label: 'L', idSource: 'explicit' } as const
    const print = unitsFingerprint([base])
    expect(unitsFingerprint([{ ...base }])).toBe(print)
    for (const change of [{ qtype: 'multi' }, { frequency: 'часто' }, { guideId: 'h' }, { kind: 'task' }, { idSource: 'hash' }, { level: 'junior' }] as const) {
      expect(unitsFingerprint([{ ...base, ...change }]), JSON.stringify(change)).not.toBe(print)
    }
  })
})
