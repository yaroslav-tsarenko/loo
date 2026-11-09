import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Chapter, Guide } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { getChapterUnits, getContent, getDocument } from '@/server/content'
import { chapterLanguages, hreflangAlternates, langParam, localizedDocument } from '@/server/content-i18n'
import { uiLocale } from '@/server/locale'
import { chapterNumberMap, nextChapterFor, pageProgress, readableChapters, treeView } from '@/server/services/library'
import { count, minutes } from '@/ui/format'
import { renderMdast } from '@/ui/markdown/render'
import { BookOpen, CircleCheck, CircleDot, Clock, CodeXml, FileText, Layers, Link2, ListChecks } from 'lucide-react'
import { MarkStudied } from '@/ui/reader/MarkStudied'
import { PageToc } from '@/ui/reader/PageToc'
import { ReadingTracker } from '@/ui/reader/ReadingTracker'
import { chapterHref, guideHref } from '@/ui/routes'
import { PageTopbar } from '@/ui/shell/PageTopbar'
import { Tag } from '@/ui/Tag'
import { Button } from '@/ui/design/Button'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { Loo } from '@/ui/design/mascot/Loo'
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

type Search = Promise<Record<string, string | string[] | undefined>>

export async function generateMetadata({ params, searchParams }: { params: Promise<Params>; searchParams: Search }): Promise<Metadata> {
  const snapshot = await getContent()
  const found = locate(snapshot, await params)
  if (!found) return { title: 'Не знайдено' }
  const { chapter, guide } = found
  if (!chapter) return { title: guide.title }
  // translations (docs/COURSE_FORMAT.md «Переклад»): hreflang alternates only for languages the page really exists in
  const langs = await chapterLanguages(snapshot, chapter, langParam(await searchParams))
  const title = (langs.lang ? snapshot.translations.get(chapter.id)?.get(langs.lang)?.title : null) ?? chapter.title
  const languages = hreflangAlternates(chapterHref(snapshot, chapter), langs)
  return { title: chapter.kind !== 'index' ? `${title} · ${guide.title}` : guide.title, ...(languages ? { alternates: { languages } } : {}) }
}

export default async function GuidePage({ params, searchParams }: { params: Promise<Params>; searchParams: Search }) {
  const snapshot = await getContent()
  const found = locate(snapshot, await params)
  if (!found) notFound()
  const { guide, chapter } = found
  const progress = await pageProgress()
  const tree = treeView(snapshot, guide, progress)
  const numbers = chapterNumberMap(tree)
  if (!chapter || chapter.kind === 'index') return <GuideOverview snapshot={snapshot} guide={guide} index={chapter} tree={tree} progress={progress} />

  const source = await getDocument(chapter.id)
  if (!source) notFound()
  // the learner's UI language when a course offers it and the topic is translated (or ?lang=); else the source
  const [langs, locale] = await Promise.all([chapterLanguages(snapshot, chapter, langParam(await searchParams)), uiLocale()])
  const localized = langs.lang ? await localizedDocument(chapter.id, langs.lang, langs.source) : null
  const doc = localized ?? source
  const title = localized?.title ?? chapter.title
  // the chapter's unit bodies, loaded once for the unit blocks of the page
  const bodies = localized?.units ?? new Map((await getChapterUnits(chapter.id)).map((u) => [u.id, u]))
  const content = await renderMdast(doc.root, { snapshot, chapter, depth: 0, variant: 'reader', units: bodies, locale })
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
      <PageTopbar crumbs={[{ label: guide.title, href: guideHref(guide.id) }, ...(part ? [{ label: part }] : []), { label: title }]}>
        <MarkStudied chapterId={chapter.id} studied={status === 'studied'} nextHref={next ? chapterHref(snapshot, next) : null} prevHref={prev ? chapterHref(snapshot, prev) : null} />
      </PageTopbar>
      <ReadingTracker chapterId={chapter.id} />
      <article className="page reader" data-reading="" lang={localized?.lang ?? langs.source}>
        <header className="reader-hero">
          <div className="reader-hero-text">
            <div className="reader-kicker">
              <Link className="reader-guide" href={guideHref(guide.id)}>
                <BookOpen size={15} strokeWidth={2.2} aria-hidden="true" />
                {guide.title}
              </Link>
              {part ? <span className="reader-part">{part}</span> : null}
            </div>
            <h1 className="page-title reader-title">
              {number ? <span className="reader-num tabular">{number}</span> : null}
              {title}
            </h1>
            <div className="reader-meta">
              <span className="reader-chip">
                <Clock size={14} strokeWidth={2.2} aria-hidden="true" />
                <span className="sr-only">Читати:</span>~{minutes(chapter.estimatedMinutes)}
              </span>
              {status === 'studied' ? (
                <span className="reader-chip" data-tone="green">
                  <CircleCheck size={14} strokeWidth={2.4} aria-hidden="true" />
                  Вивчено
                </span>
              ) : status === 'reading' ? (
                <span className="reader-chip" data-tone="blue">
                  <CircleDot size={14} strokeWidth={2.4} aria-hidden="true" />
                  Читаю
                </span>
              ) : (
                <span className="reader-chip">
                  <CircleDot size={14} strokeWidth={2.2} aria-hidden="true" />
                  Не почато
                </span>
              )}
            </div>
          </div>
          <span className="reader-hero-loo" aria-hidden="true">
            <Loo mood={status === 'studied' ? 'happy' : status === 'reading' ? 'thinking' : 'wave'} size={88} decorative />
          </span>
        </header>
        {flash + quizzes + tasks > 0 ? (
          <nav className="reader-practice" aria-label="Практика за розділом">
            <span className="reader-practice-label">Практика:</span>
            {flash ? (
              <Link href={`/review?chapter=${encodeURIComponent(chapter.id)}`} className="reader-practice-link" data-tone="violet">
                <Layers size={16} strokeWidth={2.2} aria-hidden="true" />
                {count(flash, 'картка', 'картки', 'карток')}
              </Link>
            ) : null}
            {quizzes ? (
              <Link href={`/quiz?chapter=${encodeURIComponent(chapter.id)}`} className="reader-practice-link" data-tone="mint">
                <ListChecks size={16} strokeWidth={2.2} aria-hidden="true" />
                {count(quizzes, 'тест', 'тести', 'тестів')}
              </Link>
            ) : null}
            {tasks ? (
              <Link href={`/tasks?guide=${encodeURIComponent(guide.id)}`} className="reader-practice-link" data-tone="orange">
                <CodeXml size={16} strokeWidth={2.2} aria-hidden="true" />
                {count(tasks, 'задача', 'задачі', 'задач')}
              </Link>
            ) : null}
          </nav>
        ) : null}
        {chapter.tags.length > 0 ? (
          <div className="reader-tags" aria-label="Теги">
            {chapter.tags.slice(0, 8).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        ) : null}
        <div className="prose-read">{content}</div>
        <footer className="chapter-foot">
          <div className="reader-end" data-done={status === 'studied' ? '' : undefined}>
            <Loo mood={status === 'studied' ? 'cheer' : 'happy'} size={56} decorative animated={false} />
            <div>
              <p className="reader-end-title">{status === 'studied' ? 'Розділ уже вивчено' : 'Кінець розділу'}</p>
              <p className="reader-end-sub">
                {status === 'studied' ? (
                  'Можна закріпити картками або йти далі.'
                ) : (
                  <>
                    Познач його як вивчений — кнопка вгорі або клавіша <kbd>M</kbd>.
                  </>
                )}
              </p>
            </div>
          </div>
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
  progress: Awaited<ReturnType<typeof pageProgress>>
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
      <div className="page reader reader-guide-page">
        <header className="reader-hero">
          <div className="reader-hero-text">
            <div className="reader-kicker">
              <span className="reader-guide">
                <BookOpen size={15} strokeWidth={2.2} aria-hidden="true" />
                Посібник
              </span>
            </div>
            <h1 className="page-title reader-title">{guide.title}</h1>
            {guide.description ? <p className="reader-lead">{guide.description}</p> : null}
            <div className="reader-meta">
              <span className="reader-chip">
                <FileText size={14} strokeWidth={2.2} aria-hidden="true" />
                {count(chapters.length, 'розділ', 'розділи', 'розділів')}
              </span>
              <span className="reader-chip">
                <Clock size={14} strokeWidth={2.2} aria-hidden="true" />~{minutes(guide.estimatedMinutes)}
              </span>
            </div>
            <div className="reader-progress">
              <ProgressBar value={pct} size="sm" tone={studied === chapters.length && studied > 0 ? 'green' : 'violet'} label="Прогрес посібника" valueText={`${studied} з ${chapters.length}`} className="reader-progress-bar" />
              <span className="reader-progress-text tabular">
                {studied} з {chapters.length}
              </span>
            </div>
          </div>
          <span className="reader-hero-loo" aria-hidden="true">
            <Loo mood={studied > 0 ? 'happy' : 'wave'} size={88} decorative />
          </span>
        </header>
        <div className="guide-actions">
          {next ? (
            <Button href={chapterHref(snapshot, next)} className="reader-continue">
              {studied > 0 || progress.get(next.id) ? 'Продовжити' : 'Почати'}: {next.title}
            </Button>
          ) : null}
          {flash ? (
            <Button variant="ghost" href={`/review?guide=${encodeURIComponent(guide.id)}`}>
              Картки посібника
            </Button>
          ) : null}
        </div>
        {flash + quizzes + tasks > 0 ? (
          <nav className="reader-practice" aria-label="Практика за посібником">
            <span className="reader-practice-label">Практика:</span>
            {flash ? (
              <Link href={`/review?guide=${encodeURIComponent(guide.id)}`} className="reader-practice-link" data-tone="violet">
                <Layers size={16} strokeWidth={2.2} aria-hidden="true" />
                {count(flash, 'картка', 'картки', 'карток')}
              </Link>
            ) : null}
            {quizzes ? (
              <Link href={`/quiz?guide=${encodeURIComponent(guide.id)}`} className="reader-practice-link" data-tone="mint">
                <ListChecks size={16} strokeWidth={2.2} aria-hidden="true" />
                {count(quizzes, 'тест', 'тести', 'тестів')}
              </Link>
            ) : null}
            {tasks ? (
              <Link href={`/tasks?guide=${encodeURIComponent(guide.id)}`} className="reader-practice-link" data-tone="orange">
                <CodeXml size={16} strokeWidth={2.2} aria-hidden="true" />
                {count(tasks, 'задача', 'задачі', 'задач')}
              </Link>
            ) : null}
          </nav>
        ) : null}
        <h2 className="section-title reader-contents-title">Зміст</h2>
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

