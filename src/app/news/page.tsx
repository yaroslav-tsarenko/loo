import type { Metadata } from 'next'
import Link from 'next/link'
import { dayKey, shiftDay } from '@/progress/day'
import { savedNews, savedNewsCount, weekNews, type NewsItem } from '@/news/queries'
import { isNewsTag, NEWS_TAGS, primaryTag, sourceLabel, TAG_META, type NewsTag } from '@/news/types'
import { nowMs } from '@/server/clock'
import { count, relative } from '@/ui/format'
import { NewsRow } from '@/ui/news/NewsRow'
import { RefreshNews } from '@/ui/news/RefreshNews'

export const metadata: Metadata = { title: 'Що нового в JS' }
// The manual refresh server action runs the full ingest.
export const maxDuration = 60

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function href(tab: 'feed' | 'saved', tag: NewsTag | null): string {
  const params = new URLSearchParams()
  if (tab === 'saved') params.set('tab', 'saved')
  if (tag) params.set('tag', tag)
  const qs = params.toString()
  return qs ? `/news?${qs}` : '/news'
}

function group(items: NewsItem[], now: number): { title: string; items: NewsItem[] }[] {
  const today = dayKey(now)
  const yesterday = shiftDay(today, -1)
  const weekAgo = shiftDay(today, -7)
  const buckets = [
    { title: 'Сьогодні', items: [] as NewsItem[] },
    { title: 'Вчора', items: [] as NewsItem[] },
    { title: 'Цього тижня', items: [] as NewsItem[] },
    { title: 'Раніше', items: [] as NewsItem[] },
  ]
  for (const item of items) {
    const day = dayKey(item.publishedAt)
    const i = day >= today ? 0 : day === yesterday ? 1 : day > weekAgo ? 2 : 3
    buckets[i]!.items.push(item)
  }
  return buckets.filter((b) => b.items.length > 0)
}

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const tab = params.tab === 'saved' ? 'saved' : 'feed'
  const tag = typeof params.tag === 'string' && isNewsTag(params.tag) ? params.tag : null
  const now = nowMs()
  const [all, savedTotal] = await Promise.all([tab === 'saved' ? savedNews() : weekNews(now), savedNewsCount()])

  const tagCounts = new Map<NewsTag, number>()
  for (const item of all) for (const t of item.tags) if (isNewsTag(t)) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
  const items = tag ? all.filter((i) => i.tags.includes(tag)) : all
  const groups = group(items, now)
  const unread = all.filter((i) => i.readAt === null).length
  const updatedAt = all.reduce((max, i) => Math.max(max, i.fetchedAt), 0)

  return (
    <div className="page news-page">
      <header className="news-head">
        <h1 className="page-title">📰 Що нового в JS</h1>
        <p className="page-lead">Щоденна добірка з Hacker News, Reddit, dev.to, блогів V8, Node.js, TypeScript, React, Chrome і релізів на GitHub. Корисне для росту — вище, шум — нижче.</p>
        <div className="news-toolbar">
          <span className="unit-meta">
            {tab === 'feed' ? `${count(all.length, 'матеріал', 'матеріали', 'матеріалів')} за тиждень · ${unread} непрочитаних` : count(all.length, 'збережений', 'збережені', 'збережених')}
            {updatedAt ? ` · оновлено ${relative(updatedAt, now)}` : ''}
          </span>
          <RefreshNews />
        </div>
      </header>

      <nav className="news-tabs" aria-label="Розділи новин">
        <Link href={href('feed', tag)} className="news-tab" aria-current={tab === 'feed' ? 'page' : undefined}>
          Стрічка
        </Link>
        <Link href={href('saved', tag)} className="news-tab" aria-current={tab === 'saved' ? 'page' : undefined}>
          Збережене{savedTotal ? <span className="news-tab-count tabular">{savedTotal}</span> : null}
        </Link>
      </nav>

      {tagCounts.size > 0 ? (
        <nav className="news-chips" aria-label="Фільтр за темою">
          <Link href={href(tab, null)} className="news-chip" aria-current={tag === null ? 'true' : undefined}>
            Усі <span className="tabular">{all.length}</span>
          </Link>
          {NEWS_TAGS.filter((t) => tagCounts.has(t)).map((t) => (
            <Link key={t} href={href(tab, t)} className="news-chip" aria-current={tag === t ? 'true' : undefined}>
              <span aria-hidden="true">{TAG_META[t].emoji}</span> {TAG_META[t].label} <span className="tabular">{tagCounts.get(t)}</span>
            </Link>
          ))}
        </nav>
      ) : null}

      {groups.length === 0 ? (
        <p className="empty-note">
          {tab === 'saved'
            ? 'Тут з’являться матеріали, які ви збережете закладкою — вони не видаляються через 30 днів.'
            : tag
              ? 'За тиждень немає матеріалів з цією темою.'
              : 'Новин ще немає. Добірка збирається щоранку; натисніть «Оновити», щоб зібрати її зараз.'}
        </p>
      ) : (
        groups.map((g) => (
          <section key={g.title} aria-label={g.title}>
            <h2 className="section-title">
              {g.title} <span className="news-group-count tabular">{g.items.length}</span>
            </h2>
            <ul className="news-list">
              {g.items.map((item) => {
                const t = primaryTag(item.tags)
                return (
                  <NewsRow
                    key={item.id}
                    id={item.id}
                    url={item.url}
                    title={item.title}
                    emoji={TAG_META[t].emoji}
                    tagLabel={TAG_META[t].label}
                    summary={item.summary}
                    source={sourceLabel(item.source)}
                    when={relative(item.publishedAt, now)}
                    score={item.score}
                    read={item.readAt !== null}
                    saved={item.saved}
                  />
                )
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
