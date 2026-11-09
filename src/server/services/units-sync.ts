import 'server-only'
import { and, eq, inArray, sql } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { attempts, mistakes, srsCards, taskState, unitAliases, units } from '@/db/schema'
import { similarity } from '@/content/ids'
import type { ContentSnapshot, UnitsSyncSource } from '@/content/store'
import type { UnitRow } from '@/content/units-rows'
import { readSystem, writeSystem } from '../settings'

const syncedKey = Symbol.for('interview-prep.units-synced')
type GlobalWithSync = typeof globalThis & { [syncedKey]?: { version: number; vault: string } }

export const ALIAS_THRESHOLD = 0.85
// versioned with the fingerprint's format (it hashes whole rows since v2): a deployment of another format sharing this
// database (a preview, a rollback) keeps its own key and does not make this one resync on every cold start
const FINGERPRINT_KEY = 'internal.unitsFingerprint.v2'

function unitValues(row: UnitRow, now: number) {
  const { kind, guideId, chapterId, level, frequency, qtype, label, idSource } = row
  return { kind, guideId, chapterId, level, frequency, qtype, label, idSource, lastSeen: now, missingSince: null }
}

// `source`: the fingerprint comes from the build (manifest.json), so the common case — the table is up to date after a
// deploy — reads one setting and no unit. The rows are loaded only when it is behind.
export async function syncUnits(snapshot: ContentSnapshot, source: UnitsSyncSource): Promise<void> {
  const g = globalThis as GlobalWithSync
  const marker = g[syncedKey]
  if (marker && marker.version === snapshot.version && marker.vault === snapshot.config.vaultPath) return
  const done = () => (g[syncedKey] = { version: snapshot.version, vault: snapshot.config.vaultPath })
  const print = source.fingerprint()
  const db = getDb()
  if ((await readSystem(FINGERPRINT_KEY)) === print) return void done()
  const now = Date.now()
  await db.transaction(async (tx) => {
    const existing = new Map((await tx.select().from(units)).map((u) => [u.id, u]))
    const content = await source.rows()
    const fresh: UnitRow[] = []
    const rows = content.map((unit) => {
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
    const present = new Set(content.map((unit) => unit.id))
    const missing = [...existing.values()].filter((row) => !present.has(row.id))
    const newlyMissing = missing.filter((row) => row.missingSince === null).map((row) => row.id)
    for (let i = 0; i < newlyMissing.length; i += 500) {
      await tx.update(units).set({ missingSince: now }).where(inArray(units.id, newlyMissing.slice(i, i + 500)))
    }
    const used = new Set<string>()
    for (const unit of fresh) {
      let best: { id: string; score: number } | null = null
      for (const row of missing) {
        if (used.has(row.id)) continue
        if (row.idSource !== 'hash' || row.kind !== unit.kind || row.chapterId !== unit.chapterId) continue
        const score = similarity(unit.label, row.label)
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
