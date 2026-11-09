import 'server-only'
import { createHash } from 'node:crypto'
import { count, desc, gte, lt } from 'drizzle-orm'
import { first, getDb } from '@/db/client'
import { generatedReels } from '@/db/schema'
import { systemLatestNews } from '@/news/queries'
import { dayKey, dayStartMs } from '@/progress/day'
import { forEachGuideText, getContent } from '@/server/content'
import { FEED_GUIDES } from '@/server/services/feed'
import { readableChapters } from '@/server/services/library'
import { writeSystem } from '@/server/settings'
import { dedupeByTitle, normalizeTitle } from './dedupe'
import { gatewayAuth, generateReels, reelModels, type Dropped, type Usage } from './generate'
import { pickTopics, type ChapterCandidate } from './topics'

const DAY_MS = 86_400_000
const RETENTION_MS = 60 * DAY_MS
const MAX_PER_DAY = 12
// A second cron hit (Vercel may retry) does not double the day's batch.
const ENOUGH_TODAY = 8
export const GENERATED_AT_KEY = 'internal.reelsGeneratedAt'

export interface ReelsSummary {
  ok: boolean
  skipped?: 'no-credentials' | 'already-generated' | 'no-topics'
  model: string
  inserted: number
  titles: string[]
  dropped: Dropped[]
  deleted: number
  usage: { generate: Usage; verify: Usage }
  durationMs: number
}

export function generatedReelId(title: string, day: string): string {
  return `ai-${createHash('sha1').update(`${day}|${normalizeTitle(title)}`).digest('hex')}`
}

const NO_USAGE = { generate: { inputTokens: 0, outputTokens: 0, totalTokens: 0 }, verify: { inputTokens: 0, outputTokens: 0, totalTokens: 0 } }

export async function generateDailyReels(now: number, opts: { force?: boolean } = {}): Promise<ReelsSummary> {
  const started = Date.now()
  const { model, verifyModel } = reelModels()
  const base = { model, inserted: 0, titles: [], dropped: [], deleted: 0, usage: NO_USAGE }
  if (!gatewayAuth()) {
    console.warn('[reels] skipped: no AI Gateway credentials — set AI_GATEWAY_API_KEY or run `vercel env pull` for VERCEL_OIDC_TOKEN')
    return { ...base, ok: false, skipped: 'no-credentials', durationMs: 0 }
  }
  const db = getDb()
  const today = dayKey(now)
  if (!opts.force) {
    const row = await first(db.select({ n: count() }).from(generatedReels).where(gte(generatedReels.createdAt, dayStartMs(now))))
    if ((row?.n ?? 0) >= ENOUGH_TODAY) {
      console.log('[reels] skipped: already generated today', { count: row?.n })
      return { ...base, ok: true, skipped: 'already-generated', durationMs: Date.now() - started }
    }
  }

  const snapshot = await getContent()
  // Reels are shared by every learner, so topics come from news and the course itself, not from anyone's progress.
  const [news, existing] = await Promise.all([
    systemLatestNews(40),
    db
      .select({ title: generatedReels.title, chapterId: generatedReels.chapterId, sourceUrl: generatedReels.sourceUrl, createdAt: generatedReels.createdAt })
      .from(generatedReels)
      .where(gte(generatedReels.createdAt, now - RETENTION_MS))
      .orderBy(desc(generatedReels.createdAt)),
  ])

  const guides = FEED_GUIDES.map((id) => snapshot.guideById.get(id)).filter((g) => g !== undefined)
  const candidates: ChapterCandidate[] = guides.flatMap((g) => readableChapters(snapshot, g).map((c) => ({ id: c.id, guideId: c.guideId, title: c.title })))

  const reelTitlesByChapter = new Map<string, string[]>()
  const add = (chapterId: string | null, title: string) => {
    if (!chapterId) return
    reelTitlesByChapter.set(chapterId, [...(reelTitlesByChapter.get(chapterId) ?? []), title])
  }
  for (const r of snapshot.reels) add(r.chapterId, r.title)
  for (const r of existing) add(r.chapterId, r.title)

  // the cron is the only reader of the chapter texts: guide by guide, only the guides the feed draws from
  const plainText = new Map<string, string>()
  await forEachGuideText((guideId, texts) => {
    if (FEED_GUIDES.includes(guideId)) for (const [id, text] of texts) plainText.set(id, text)
  })

  const plan = pickTopics({
    now,
    news,
    weak: [],
    current: [],
    candidates,
    plainText,
    reelTitlesByChapter,
    recentChapterIds: new Set(existing.filter((r) => r.createdAt > now - 7 * DAY_MS && r.chapterId).map((r) => r.chapterId!)),
    coveredUrls: new Set(existing.flatMap((r) => (r.sourceUrl ? [r.sourceUrl] : []))),
    seed: Math.floor(now / DAY_MS),
  })
  if (plan.ask === 0) {
    console.log('[reels] skipped: nothing to write about')
    return { ...base, ok: true, skipped: 'no-topics', durationMs: Date.now() - started }
  }
  console.log('[reels] plan', { model, verifyModel, ask: plan.ask, news: plan.news.map((n) => n.title), chapters: plan.chapters.map((c) => `${c.title} (${c.reason}×${c.reels})`) })

  const result = await generateReels(plan, {
    model,
    verifyModel,
    today,
    avoidTitles: existing.filter((r) => r.createdAt > now - 14 * DAY_MS).map((r) => r.title),
  })

  const known = [...existing.map((r) => r.title), ...snapshot.reels.map((r) => r.title)]
  const { kept, dropped: dupes } = dedupeByTitle(result.reels, known)
  const dropped: Dropped[] = [...result.dropped, ...dupes.map((d) => ({ title: d.item.title, stage: 'dedupe' as const, reason: `дубль «${d.duplicateOf}»` }))]
  const batch = kept.slice(0, MAX_PER_DAY)

  if (batch.length) {
    await db
      .insert(generatedReels)
      .values(batch.map((r, i) => ({ id: generatedReelId(r.title, today), ...r, model, status: 'active' as const, createdAt: now + i })))
      .onConflictDoNothing()
  }
  const deleted = await db.delete(generatedReels).where(lt(generatedReels.createdAt, now - RETENTION_MS)).returning({ id: generatedReels.id })
  await writeSystem(GENERATED_AT_KEY, now)

  const summary: ReelsSummary = {
    ok: true,
    model,
    inserted: batch.length,
    titles: batch.map((r) => `${r.emoji} ${r.title}`),
    dropped,
    deleted: deleted.length,
    usage: result.usage,
    durationMs: Date.now() - started,
  }
  console.log('[reels] done', { inserted: summary.inserted, dropped: dropped.length, deleted: summary.deleted, durationMs: summary.durationMs })
  console.log('[reels] token usage', { [model]: result.usage.generate, [verifyModel]: result.usage.verify })
  if (dropped.length) console.log('[reels] dropped', dropped)
  return summary
}
