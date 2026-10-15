import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Chapter, Guide } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { getContent, getDocument } from '@/server/content'
import { chapterNumberMap, chapterProgressMap, nextChapterFor, readableChapters, treeView } from '@/server/services/library'
import { count, minutes } from '@/ui/format'
import { renderMdast } from '@/ui/markdown/render'
import { BookOpen, CircleDot, Clock, FileText, Hash, Layers, Link2 } from 'lucide-react'
import { MarkStudied } from '@/ui/reader/MarkStudied'
import { PageToc } from '@/ui/reader/PageToc'
import { ReadingTracker } from '@/ui/reader/ReadingTracker'
import { chapterHref, guideHref } from '@/ui/routes'
import { PageTopbar } from '@/ui/shell/PageTopbar'
import { Tag } from '@/ui/Tag'
import type { ReactNode } from 'react'

interface Params {
  guide: string
  slug?: string[]
}

function decode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function locate(snapshot: ContentSnapshot, params: Params): { guide: Guide; chapter: Chapter | null } | null {
  const guide = snapshot.guideById.get(decode(params.guide))
  if (!guide) return null
  const slug = (params.slug ?? []).map(decode)
  if (slug.length === 0) return { guide, chapter: guide.indexChapterId ? snapshot.chapters.get(guide.indexChapterId) ?? null : null }
  const wanted = slug.join('/').normalize('NFC')
  for (const id of guide.chapterIds) {
    const chapter = snapshot.chapters.get(id)
    if (chapter && chapter.slug.join('/').normalize('NFC') === wanted) return { guide, chapter }
  }
  return null
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const snapshot = await getContent()
  const found = locate(snapshot, await params)
  if (!found) return { title: 'Не знайдено' }
  return { title: found.chapter && found.chapter.kind !== 'index' ? `${found.chapter.title} · ${found.guide.title}` : found.guide.title }
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const snapshot = await getContent()
  const found = locate(snapshot, await params)
  if (!found) notFound()
  const { guide, chapter } = found
  const progress = await chapterProgressMap()
  const tree = treeView(snapshot, guide, progress)
  const numbers = chapterNumberMap(tree)
  if (!chapter || chapter.kind === 'index') return <GuideOverview snapshot={snapshot} guide={guide} index={chapter} tree={tree} progress={progress} />

  const doc = await getDocument(chapter.id)
  if (!doc) notFound()
  const content = await renderMdast(doc.root, { snapshot, chapter, depth: 0, variant: 'reader' })
  const order = readableChapters(snapshot, guide)
  const position = order.findIndex((c) => c.id === chapter.id)
  const prev = position > 0 ? order[position - 1]! : null
  const next = position >= 0 && position < order.length - 1 ? order[position + 1]! : null
  const units = snapshot.unitsByChapter.get(chapter.id) ?? []
  const flash = units.filter((u) => u.kind === 'flashcard').length
  const quizzes = units.filter((u) => u.kind === 'quiz').length
  const tasks = units.filter((u) => u.kind === 'task').length
  const backlinks = (snapshot.backlinks.get(chapter.id) ?? []).map((id) => snapshot.chapters.get(id)).filter((c): c is Chapter => Boolean(c))
  const status = progress.get(chapter.id)?.status ?? 'unread'
  const number = numbers.get(chapter.id) ?? null
  const part = findPart(guide, chapter.id)

  return (
    <>
      <PageTopbar crumbs={[{ label: guide.title, href: guideHref(guide.id) }, ...(part ? [{ label: part }] : []), { label: chapter.title }]}>
        <MarkStudied chapterId={chapter.id} studied={status === 'studied'} nextHref={next ? chapterHref(snapshot, next) : null} prevHref={prev ? chapterHref(snapshot, prev) : null} />
      </PageTopbar>
      <ReadingTracker chapterId={chapter.id} />
      <article className="page" data-reading="">
        <h1 className="page-title">{chapter.title}</h1>
        <dl className="props">
          <Prop icon={<BookOpen size={16} strokeWidth={1.6} />} label="Посібник">
            <Link className="prop-link" href={guideHref(guide.id)}>
              {guide.title}
            </Link>
          </Prop>
          {number ? (
            <Prop icon={<Hash size={16} strokeWidth={1.6} />} label="Розділ">
              <span className="tabular">{number}</span>
              {part ? <span className="prop-muted"> · {part}</span> : null}
            </Prop>
          ) : null}
          <Prop icon={<Clock size={16} strokeWidth={1.6} />} label="Читати">
            ~{minutes(chapter.estimatedMinutes)}
          </Prop>
          <Prop icon={<CircleDot size={16} strokeWidth={1.6} />} label="Статус">
            {status === 'studied' ? <Tag color="green">Вивчено</Tag> : status === 'reading' ? <Tag color="blue">Читаю</Tag> : <Tag color="gray">Не почато</Tag>}
          </Prop>
          {flash + quizzes + tasks > 0 ? (
            <Prop icon={<Layers size={16} strokeWidth={1.6} />} label="Практика">
              <span className="prop-tags">
                {flash ? (
                  <Link href={`/review?chapter=${encodeURIComponent(chapter.id)}`} className="prop-chip">
                    {count(flash, 'картка', 'картки', 'карток')}
                  </Link>
                ) : null}
                {quizzes ? (
                  <Link href={`/quiz?chapter=${encodeURIComponent(chapter.id)}`} className="prop-chip">
                    {count(quizzes, 'тест', 'тести', 'тестів')}
                  </Link>
                ) : null}
                {tasks ? (
                  <Link href={`/tasks?guide=${encodeURIComponent(guide.id)}`} className="prop-chip">
                    {count(tasks, 'задача', 'задачі', 'задач')}
                  </Link>
                ) : null}
              </span>
            </Prop>
          ) : null}
          {chapter.tags.length > 0 ? (
            <Prop icon={<Hash size={16} strokeWidth={1.6} />} label="Теги">
              <span className="prop-tags">
                {chapter.tags.slice(0, 8).map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </span>
            </Prop>
          ) : null}
        </dl>
        <div className="page-divider" />
        <div className="prose-read">{content}</div>
        <footer className="chapter-foot">
          {backlinks.length > 0 ? (
            <section className="backlinks" aria-label="Згадується в">
              <div className="section-title">
                <Link2 size={14} strokeWidth={1.8} aria-hidden="true" /> {count(backlinks.length, 'зворотне посилання', 'зворотні посилання', 'зворотних посилань')}
              </div>
              {backlinks.slice(0, 12).map((b) => (
                <PageLink key={b.id} href={chapterHref(snapshot, b)} title={b.title} />
              ))}
            </section>
          ) : null}
          <nav className="pager" aria-label="Сусідні розділи">
            {prev ? (
              <Link href={chapterHref(snapshot, prev)} className="pager-link" rel="prev">
                <span className="pager-dir">
                  <kbd>[</kbd> Попередній
                </span>
                <span className="pager-title">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={chapterHref(snapshot, next)} className="pager-link pager-next" rel="next">
                <span className="pager-dir">
                  Наступний <kbd>]</kbd>
                </span>
                <span className="pager-title">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        </footer>
      </article>
      <PageToc headings={doc.headings} />
    </>
  )
}

function Prop({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="prop">
      <dt className="prop-name">
        <span aria-hidden="true">{icon}</span>
        {label}
      </dt>
      <dd className="prop-value">{children}</dd>
    </div>
  )
}

function PageLink({ href, title, meta }: { href: string; title: string; meta?: ReactNode }) {
  return (
    <Link href={href} className="page-link">
      <FileText size={18} strokeWidth={1.6} aria-hidden="true" />
      <span className="page-link-title">{title}</span>
      {meta ? <span className="page-link-meta">{meta}</span> : null}
    </Link>
  )
}

function findPart(guide: Guide, chapterId: string): string | null {
  let found: string | null = null
  const walk = (nodes: Guide['tree'], trail: string | null) => {
    for (const n of nodes) {
      if (n.kind === 'chapter' && n.id === chapterId) found = trail
      if (n.kind === 'group') {
        if (n.overviewId === chapterId) found = trail
        walk(n.children, n.title)
      }
    }
  }
  walk(guide.tree, null)
  return found
}

async function GuideOverview({
  snapshot,
  guide,
  index,
  tree,
  progress,
}: {
  snapshot: ContentSnapshot
  guide: Guide
  index: Chapter | null
  tree: ReturnType<typeof treeView>
  progress: Awaited<ReturnType<typeof chapterProgressMap>>
}) {
  const chapters = readableChapters(snapshot, guide)
  const studied = chapters.filter((c) => progress.get(c.id)?.status === 'studied').length
  const next = nextChapterFor(snapshot, guide, progress)
  const units = [...snapshot.units.values()].filter((u) => u.guideId === guide.id)
  const flash = units.filter((u) => u.kind === 'flashcard').length
  const quizzes = units.filter((u) => u.kind === 'quiz').length
  const tasks = units.filter((u) => u.kind === 'task').length
  const doc = index ? await getDocument(index.id) : null
  const intro = doc && index ? await renderMdast(doc.root, { snapshot, chapter: index, depth: 0, variant: 'reader' }) : null
  const pct = chapters.length ? studied / chapters.length : 0

  return (
    <>
      <PageTopbar crumbs={[{ label: 'Бібліотека', href: '/' }, { label: guide.title }]} />
      <div className="page">
        <h1 className="page-title">{guide.title}</h1>
        {guide.description ? <p className="page-lead">{guide.description}</p> : null}
        <dl className="props">
          <Prop icon={<FileText size={16} strokeWidth={1.6} />} label="Розділів">
            {chapters.length}
          </Prop>
          <Prop icon={<Clock size={16} strokeWidth={1.6} />} label="Час">
            ~{minutes(guide.estimatedMinutes)}
          </Prop>
          <Prop icon={<CircleDot size={16} strokeWidth={1.6} />} label="Прогрес">
            <span className="progress-inline">
              <span className="bar" aria-hidden="true">
                <span style={{ transform: `scaleX(${pct})` }} />
              </span>
              <span className="tabular">
                {studied} з {chapters.length}
              </span>
            </span>
          </Prop>
          {flash + quizzes + tasks > 0 ? (
            <Prop icon={<Layers size={16} strokeWidth={1.6} />} label="Практика">
              <span className="prop-tags">
                {flash ? (
                  <Link href={`/review?guide=${encodeURIComponent(guide.id)}`} className="prop-chip">
                    {count(flash, 'картка', 'картки', 'карток')}
                  </Link>
                ) : null}
                {quizzes ? (
                  <Link href={`/quiz?guide=${encodeURIComponent(guide.id)}`} className="prop-chip">
                    {count(quizzes, 'тест', 'тести', 'тестів')}
                  </Link>
                ) : null}
                {tasks ? (
                  <Link href={`/tasks?guide=${encodeURIComponent(guide.id)}`} className="prop-chip">
                    {count(tasks, 'задача', 'задачі', 'задач')}
                  </Link>
                ) : null}
              </span>
            </Prop>
          ) : null}
        </dl>
        <div className="guide-actions">
          {next ? (
            <Link className="ui-button" href={chapterHref(snapshot, next)}>
              {studied > 0 || progress.get(next.id) ? 'Продовжити' : 'Почати'}: {next.title}
            </Link>
          ) : null}
          {flash ? (
            <Link className="ui-button" data-variant="ghost" href={`/review?guide=${encodeURIComponent(guide.id)}`}>
              Картки посібника
            </Link>
          ) : null}
        </div>
        <div className="page-divider" />
        <section className="guide-contents" aria-label="Зміст">
          <GuideContents nodes={tree} />
        </section>
        {intro ? (
          <details className="guide-intro">
            <summary>
              <span className="toggle-arrow" aria-hidden="true" />
              Нотатки до посібника
            </summary>
            <div className="prose-read">{intro}</div>
          </details>
        ) : null}
      </div>
    </>
  )
}

function StatusTag({ status }: { status: string | null }) {
  if (status === 'studied') return <Tag color="green">вивчено</Tag>
  if (status === 'reading') return <Tag color="blue">читаю</Tag>
  return null
}

function GuideContents({ nodes }: { nodes: ReturnType<typeof treeView> }) {
  return (
    <div className="contents">
      {nodes.map((n) =>
        n.kind === 'chapter' ? (
          <PageLink key={n.id} href={n.href ?? '#'} title={n.title} meta={<StatusTag status={n.status} />} />
        ) : (
          <details key={n.id} className="contents-part" open>
            <summary>
              <span className="toggle-arrow" aria-hidden="true" />
              <span className="contents-part-title">{n.title}</span>
              <span className="contents-part-count tabular">{n.children.length}</span>
            </summary>
            <div className="contents-part-body">
              {n.href ? <PageLink href={n.href} title={`Огляд: ${n.title}`} meta={<StatusTag status={n.status} />} /> : null}
              <GuideContents nodes={n.children} />
            </div>
          </details>
        ),
      )}
    </div>
  )
}

