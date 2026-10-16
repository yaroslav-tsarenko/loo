import type { Metadata } from 'next'
import Link from 'next/link'
import { count, desc, eq, gte } from 'drizzle-orm'
import { gatewayAuth, reelModels } from '@/ai/reels/generate'
import { splitBody } from '@/ai/reels/schema'
import { first, getDb } from '@/db/client'
import { generatedReels } from '@/db/schema'
import { iconRef, REEL_FALLBACK_ICON } from '@/content/icons'
import { safeExternalUrl } from '@/lib/url'
import { dayStartMs } from '@/progress/day'
import { requireAdmin } from '@/server/auth'
import { nowMs } from '@/server/clock'
import { getContent } from '@/server/content'
import { readSystem } from '@/server/settings'
import { relative } from '@/ui/format'
import { GenerateNow, HideButton } from '@/ui/feed/GeneratedAdmin'
import { Icon } from '@/ui/icons/Icon'
import { chapterHref } from '@/ui/routes'

export const metadata: Metadata = { title: 'AI-фішки' }
// "Згенерувати зараз" runs the whole pipeline inside the server action.
export const maxDuration = 300

// Inline `code` only; the feed renders the full markdown.
function Prose({ text }: { text: string }) {
  return text.split(/`([^`]+)`/).map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))
}

// Admin tool: review today's AI reels, take one down for everyone, run the generator.
export default async function GeneratedReelsPage() {
  await requireAdmin()
  const now = nowMs()
  const db = getDb()
  const [snapshot, rows, active, last] = await Promise.all([
    getContent(),
    db.select().from(generatedReels).where(gte(generatedReels.createdAt, dayStartMs(now))).orderBy(desc(generatedReels.createdAt)),
    first(db.select({ n: count() }).from(generatedReels).where(eq(generatedReels.status, 'active'))),
    readSystem('internal.reelsGeneratedAt'),
  ])
  const { model, verifyModel } = reelModels()
  const auth = gatewayAuth()
  const lastRun = typeof last === 'number' ? last : null

  return (
    <div className="page news-page gen-page">
      <header className="news-head">
        <h1 className="page-title">
          <Icon name="pi:PiRobotFill" size={36} className="page-title-icon" />
          AI-фішки
        </h1>
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
        {auth ? null : <p className="gen-warning">
            <Icon name="px:warning" size={18} /> AI Gateway не налаштовано: додай AI_GATEWAY_API_KEY у .env.local або зроби `vercel env pull` (VERCEL_OIDC_TOKEN).</p>}
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
                  <Icon name={iconRef(r.emoji, REEL_FALLBACK_ICON)!} size={24} />
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
                    {safeExternalUrl(r.sourceUrl) ? (
                      <>
                        {' · '}
                        <a href={safeExternalUrl(r.sourceUrl)!} target="_blank" rel="noreferrer noopener">
                          {r.sourceTitle ?? 'джерело'} ↗
                        </a>
                      </>
                    ) : null}
                    {r.status === 'hidden' ? ' · сховано' : ''}
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
