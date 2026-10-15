import 'server-only'
import { isNull, lte } from 'drizzle-orm'
import { getDb } from '@/db/client'
import { mistakes, srsCards } from '@/db/schema'
import type { ContentSnapshot } from '@/content/store'

export async function navCounts(snapshot: ContentSnapshot, now = Date.now()): Promise<Record<string, number>> {
  const db = getDb()
  const [due, open] = await Promise.all([
    db.select({ id: srsCards.unitId }).from(srsCards).where(lte(srsCards.due, now)),
    db.select({ id: mistakes.unitId }).from(mistakes).where(isNull(mistakes.resolvedAt)),
  ])
  return {
    '/review': due.filter((r) => snapshot.units.has(r.id)).length,
    '/mistakes': open.filter((r) => snapshot.units.has(r.id)).length,
  }
}
