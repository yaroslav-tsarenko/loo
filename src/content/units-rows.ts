import { createHash } from 'node:crypto'
import { brotliCompressSync, brotliDecompressSync } from 'node:zlib'
import type { IdSource, LearningUnit, Level, UnitMeta } from './model'
import { unitMeta } from './unit-meta'

// What the `units` table mirrors of the content (src/server/services/units-sync.ts). Computed at build time
// (pnpm content:snapshot → units-sync.json.br) so a server does not hash and label every unit to find out that the
// table is up to date.

export interface UnitRow {
  id: string
  kind: LearningUnit['kind']
  guideId: string
  chapterId: string
  level: Level | null
  frequency: string | null
  qtype: string | null
  label: string
  idSource: IdSource
}

export function rowOfMeta(meta: UnitMeta): UnitRow {
  return {
    id: meta.id,
    kind: meta.kind,
    guideId: meta.guideId,
    chapterId: meta.chapterId,
    level: meta.level ?? null,
    frequency: meta.kind === 'flashcard' ? meta.frequency : null,
    qtype: meta.kind === 'flashcard' ? meta.qtype : meta.kind === 'quiz' ? meta.mode : meta.difficulty,
    label: meta.label,
    idSource: meta.idSource,
  }
}

export const unitRow = (unit: LearningUnit): UnitRow => rowOfMeta(unitMeta(unit))

// Hashes whole rows, so a change of any mirrored column (kind, qtype, frequency, guide …) reaches the table.
export function unitsFingerprint(rows: Iterable<UnitRow>): string {
  const hash = createHash('sha1')
  for (const row of rows) hash.update(`${JSON.stringify(row)}\n`)
  return hash.digest('hex')
}

// units-sync.json.br: the rows plus the fingerprint they hash to
export function encodeUnitsSync(rows: readonly UnitRow[]): Buffer {
  return brotliCompressSync(Buffer.from(JSON.stringify({ fingerprint: unitsFingerprint(rows), rows })))
}

export function decodeUnitsSync(data: Buffer): { fingerprint: string; rows: UnitRow[] } {
  return JSON.parse(brotliDecompressSync(data).toString('utf8')) as { fingerprint: string; rows: UnitRow[] }
}
