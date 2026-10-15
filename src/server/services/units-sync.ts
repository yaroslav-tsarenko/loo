import 'server-only'
import { createHash } from 'node:crypto'
import { and, eq, inArray, sql } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { attempts, mistakes, srsCards, taskState, unitAliases, units } from '@/db/schema'
import { similarity } from '@/content/ids'
import type { LearningUnit, QuizUnit } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { readSystem, writeSystem } from '../settings'

const syncedKey = Symbol.for('interview-prep.units-synced')
type GlobalWithSync = typeof globalThis & { [syncedKey]?: { version: number; vault: string } }

export const ALIAS_THRESHOLD = 0.85
const FINGERPRINT_KEY = 'internal.unitsFingerprint'

// First meaningful line of an order/fill exercise, blanks masked
function exerciseLine(unit: QuizUnit): string | undefined {
  const ex = unit.exercise
  if (!ex) return undefined
  const text = ex.kind === 'order' ? ex.pieces.find((p) => !p.distractor)?.code ?? '' : ex.segments.map((s) => (s.kind === 'text' ? s.value : '___')).join('')
  return text.split('\n').find((l) => l.trim())?.trim()
}

export function unitLabel(unit: LearningUnit): string {
  if (unit.kind === 'quiz') {
    const code = unit.body.children.find((n) => n.type === 'code')
    const firstLine = code && code.type === 'code' ? code.value.split('\n').find((l) => l.trim())?.trim() : exerciseLine(unit)
    const text = unit.promptText.length < 40 && firstLine ? `${unit.promptText} ${firstLine}` : unit.promptText
    return text.slice(0, 240)
  }
  const text = unit.kind === 'flashcard' ? unit.questionText : unit.titleText
  return text.slice(0, 240)
}

function unitValues(unit: LearningUnit, now: number) {
  return {
    kind: unit.kind,
    guideId: unit.guideId,
    chapterId: unit.chapterId,
    level: unit.level,
    frequency: unit.kind === 'flashcard' ? unit.frequency : null,
    qtype: unit.kind === 'flashcard' ? unit.qtype : unit.kind === 'quiz' ? unit.mode : unit.difficulty,
    label: unitLabel(unit),
    idSource: unit.idSource,
    lastSeen: now,
    missingSince: null,
  }
}

function fingerprint(snapshot: ContentSnapshot): string {
  const hash = createHash('sha1')
  for (const unit of snapshot.units.values()) hash.update(`${unit.id}|${unit.chapterId}|${unit.level}|${unitLabel(unit)}\n`)
  return hash.digest('hex')
}

export async function syncUnits(snapshot: ContentSnapshot): Promise<void> {
  const g = globalThis as GlobalWithSync
  const marker = g[syncedKey]
  if (marker && marker.version === snapshot.version && marker.vault === snapshot.config.vaultPath) return
  const done = () => (g[syncedKey] = { version: snapshot.version, vault: snapshot.config.vaultPath })
  const print = fingerprint(snapshot)
  const db = getDb()
  if ((await readSystem(FINGERPRINT_KEY)) === print) return void done()
  const now = Date.now()
  await db.transaction(async (tx) => {
    const existing = new Map((await tx.select().from(units)).map((u) => [u.id, u]))
    const fresh: LearningUnit[] = []
    const rows = [...snapshot.units.values()].map((unit) => {
      if (!existing.has(unit.id) && unit.idSource === 'hash') fresh.push(unit)
      return { id: unit.id, firstSeen: existing.get(unit.id)?.firstSeen ?? now, ...unitValues(unit, now) }
    })
    for (let i = 0; i < rows.length; i += 500) {
      await tx
        .insert(units)
        .values(rows.slice(i, i + 500))
        .onConflictDoUpdate({
          target: units.id,
          set: {
            kind: sql`excluded.kind`,
            guideId: sql`excluded.guide_id`,
            chapterId: sql`excluded.chapter_id`,
            level: sql`excluded.level`,
            frequency: sql`excluded.frequency`,
            qtype: sql`excluded.qtype`,
            label: sql`excluded.label`,
            idSource: sql`excluded.id_source`,
            lastSeen: sql`excluded.last_seen`,
            missingSince: sql`null`,
          },
        })
    }
    const missing = [...existing.values()].filter((row) => !snapshot.units.has(row.id))
    const newlyMissing = missing.filter((row) => row.missingSince === null).map((row) => row.id)
    for (let i = 0; i < newlyMissing.length; i += 500) {
      await tx.update(units).set({ missingSince: now }).where(inArray(units.id, newlyMissing.slice(i, i + 500)))
    }
    const used = new Set<string>()
    for (const unit of fresh) {
      const label = unitLabel(unit)
      let best: { id: string; score: number } | null = null
      for (const row of missing) {
        if (used.has(row.id)) continue
        if (row.idSource !== 'hash' || row.kind !== unit.kind || row.chapterId !== unit.chapterId) continue
        const score = similarity(label, row.label)
        if (score >= ALIAS_THRESHOLD && (!best || score > best.score)) best = { id: row.id, score }
      }
      if (!best) continue
      const oldId = best.id
      used.add(oldId)
      // Content migration for every learner (system job, runs as the table owner): progress follows the renamed
      // unit; a user who already has a row for the new id keeps it, and the old row stays as an orphan.
      // cross-user: units are shared content, the rename applies to all users.
      await tx.update(attempts).set({ unitId: unit.id }).where(eq(attempts.unitId, oldId))
      // cross-user: see above.
      await tx.update(srsCards).set({ unitId: unit.id }).where(and(eq(srsCards.unitId, oldId), sql`not exists (select 1 from srs_cards s2 where s2.user_id = "srs_cards"."user_id" and s2.unit_id = ${unit.id})`))
      // cross-user: see above.
      await tx.update(mistakes).set({ unitId: unit.id }).where(and(eq(mistakes.unitId, oldId), sql`not exists (select 1 from mistakes m2 where m2.user_id = "mistakes"."user_id" and m2.unit_id = ${unit.id})`))
      // cross-user: see above.
      await tx.update(taskState).set({ unitId: unit.id }).where(and(eq(taskState.unitId, oldId), sql`not exists (select 1 from task_state t2 where t2.user_id = "task_state"."user_id" and t2.unit_id = ${unit.id})`))
      await tx.insert(unitAliases).values({ oldId, newId: unit.id, reason: `similarity ${best.score.toFixed(2)}`, createdAt: now }).onConflictDoNothing()
      await tx.delete(units).where(eq(units.id, oldId))
      console.info(`[content] прогрес ${oldId} → ${unit.id} (текст питання змінено, схожість ${best.score.toFixed(2)})`)
    }
    await writeSystem(FINGERPRINT_KEY, print, tx)
  })
  done()
}
