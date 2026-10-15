import 'server-only'
import { createHash } from 'node:crypto'
import { eq, inArray, sql } from 'drizzle-orm'
import { first, getDb } from '@/db/client'
import { attempts, mistakes, settings, srsCards, taskState, unitAliases, units } from '@/db/schema'
import { similarity } from '@/content/ids'
import type { LearningUnit, QuizUnit } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'

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
  const stored = await first(db.select().from(settings).where(eq(settings.key, FINGERPRINT_KEY)))
  if (stored?.value === print) return void done()
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
      await tx.update(attempts).set({ unitId: unit.id }).where(eq(attempts.unitId, oldId))
      const hasSrs = await first(tx.select().from(srsCards).where(eq(srsCards.unitId, unit.id)))
      if (!hasSrs) await tx.update(srsCards).set({ unitId: unit.id }).where(eq(srsCards.unitId, oldId))
      const hasMistake = await first(tx.select().from(mistakes).where(eq(mistakes.unitId, unit.id)))
      if (!hasMistake) await tx.update(mistakes).set({ unitId: unit.id }).where(eq(mistakes.unitId, oldId))
      const hasTask = await first(tx.select().from(taskState).where(eq(taskState.unitId, unit.id)))
      if (!hasTask) await tx.update(taskState).set({ unitId: unit.id }).where(eq(taskState.unitId, oldId))
      await tx.insert(unitAliases).values({ oldId, newId: unit.id, reason: `similarity ${best.score.toFixed(2)}`, createdAt: now }).onConflictDoNothing()
      await tx.delete(units).where(eq(units.id, oldId))
      console.info(`[content] прогрес ${oldId} → ${unit.id} (текст питання змінено, схожість ${best.score.toFixed(2)})`)
    }
    await tx.insert(settings).values({ key: FINGERPRINT_KEY, value: print }).onConflictDoUpdate({ target: settings.key, set: { value: print } })
  })
  done()
}
