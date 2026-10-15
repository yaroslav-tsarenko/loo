import type { Metadata } from 'next'
import Link from 'next/link'
import { count, desc, eq, gte } from 'drizzle-orm'
import { gatewayAuth, reelModels } from '@/ai/reels/generate'
import { splitBody } from '@/ai/reels/schema'
import { first, getDb } from '@/db/client'
import { generatedReels, settings } from '@/db/schema'
import { dayStartMs } from '@/progress/day'
import { nowMs } from '@/server/clock'
import { getContent } from '@/server/content'
import { relative } from '@/ui/format'
import { GenerateNow, HideButton } from '@/ui/feed/GeneratedAdmin'
import { chapterHref } from '@/ui/routes'

export const metadata: Metadata = { title: 'AI-фішки' }
// "Згенерувати зараз" runs the whole pipeline inside the server action.
export const maxDuration = 300

// Inline `code` only; the feed renders the full markdown.
function Prose({ text }: { text: string }) {
  return text.split(/`([^`]+)`/).map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))
}

export default async function GeneratedReelsPage() {
  const now = nowMs()
  const db = getDb()
  const [snapshot, rows, active, last] = await Promise.all([
    getContent(),
    db.select().from(generatedReels).where(gte(generatedReels.createdAt, dayStartMs(now))).orderBy(desc(generatedReels.createdAt)),
    first(db.select({ n: count() }).from(generatedReels).where(eq(generatedReels.status, 'active'))),
    first(db.select().from(settings).where(eq(settings.key, 'internal.reelsGeneratedAt'))),
  ])
  const { model, verifyModel } = reelModels()
  const auth = gatewayAuth()
  const lastRun = typeof last?.value === 'number' ? last.value : null

  return (
    <div className="page news-page gen-page">
      <header className="news-head">
        <h1 className="page-title">🤖 AI-фішки</h1>
        <p className="page-lead">
          Щоранку (06:30 UTC) модель пише 8–12 фішок: новини JS за 48 год і глибокі факти з твоїх слабких та поточних розділів. Кожну перевіряє друга модель і запуск коду в sandbox.
        </p>
        <div className="news-toolbar">
          <span className="unit-meta">
            {model} → {verifyModel} · активних {active?.n ?? 0}
            {lastRun ? ` · запуск ${relative(lastRun, now)}` : ''}
          </span>
          <GenerateNow />
        </div>
        {auth ? null : <p className="gen-warning">⚠️ AI Gateway не налаштовано: додай AI_GATEWAY_API_KEY у .env.local або зроби `vercel env pull` (VERCEL_OIDC_TOKEN).</p>}
      </header>

      <h2 className="section-title">
        Сьогодні <span className="news-group-count tabular">{rows.length}</span>
      </h2>
      {rows.length === 0 ? (
        <p className="empty-note">Сьогодні ще нічого не згенеровано.</p>
      ) : (
        <ul className="news-list">
          {rows.map((r) => {
            const { body, code } = splitBody(r.body)
            const chapter = r.chapterId ? snapshot.chapters.get(r.chapterId) : undefined
            return (
              <li key={r.id} className="gen-row" data-hidden={r.status === 'hidden' ? '' : undefined}>
                <span className="news-emoji" aria-hidden="true">
                  {r.emoji}
                </span>
                <div className="news-body">
                  <div className="gen-title">{r.title}</div>
                  <p className="gen-text">
                    <Prose text={body} />
                  </p>
                  {code ? <pre className="gen-code">{code}</pre> : null}
                  <div className="news-meta">
                    {r.topic}
                    {chapter ? (
                      <>
                        {' · '}
                        <Link href={chapterHref(snapshot, chapter)}>{chapter.title}</Link>
                      </>
                    ) : null}
                    {r.sourceUrl ? (
                      <>
                        {' · '}
                        <a href={r.sourceUrl} target="_blank" rel="noreferrer noopener">
                          {r.sourceTitle ?? 'джерело'} ↗
                        </a>
                      </>
                    ) : null}
                    {r.status === 'hidden' ? ' · 🙈 сховано' : ''}
                  </div>
                </div>
                {r.status === 'active' ? <HideButton id={r.id} /> : <span />}
              </li>
            )
          })}
        </ul>
      )}
      <p className="unit-meta gen-foot">
        <Link href="/feed">← До стрічки</Link>
      </p>
    </div>
  )
}
