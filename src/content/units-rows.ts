import { createHash } from 'node:crypto'
import { brotliCompressSync, brotliDecompressSync } from 'node:zlib'
import type { IdSource, LearningUnit, Level } from './model'
import { unitLabel } from './unit-label'

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

export function unitRow(unit: LearningUnit): UnitRow {
  return {
    id: unit.id,
    kind: unit.kind,
    guideId: unit.guideId,
    chapterId: unit.chapterId,
    level: unit.level ?? null,
    frequency: unit.kind === 'flashcard' ? unit.frequency : null,
    qtype: unit.kind === 'flashcard' ? unit.qtype : unit.kind === 'quiz' ? unit.mode : unit.difficulty,
    label: unitLabel(unit),
    idSource: unit.idSource,
  }
}

export function unitsFingerprint(rows: Iterable<Pick<UnitRow, 'id' | 'chapterId' | 'level' | 'label'>>): string {
  const hash = createHash('sha1')
  for (const row of rows) hash.update(`${row.id}|${row.chapterId}|${row.level ?? ''}|${row.label}\n`)
  return hash.digest('hex')
}

// units-sync.json.br: the rows plus the fingerprint they hash to
export function encodeUnitsSync(rows: readonly UnitRow[]): Buffer {
  return brotliCompressSync(Buffer.from(JSON.stringify({ fingerprint: unitsFingerprint(rows), rows })))
}

export function decodeUnitsSync(data: Buffer): { fingerprint: string; rows: UnitRow[] } {
  return JSON.parse(brotliDecompressSync(data).toString('utf8')) as { fingerprint: string; rows: UnitRow[] }
}
