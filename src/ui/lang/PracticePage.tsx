import 'server-only'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { PiEarFill, PiHeadphonesFill, PiMicrophoneFill, PiTextAaFill, PiTranslateFill } from 'react-icons/pi'
import { lookup } from '@/course'
import type { LearningUnit } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { nowMs } from '@/server/clock'
import { getContent } from '@/server/content'
import { adaptiveContext, adaptiveQueue, newWordOrder } from '@/server/courses/adaptive'
import { activeScope, studyScope } from '@/server/courses/enrollment'
import { speechLangFor } from '@/server/courses/target'
import { filterOptions } from '@/server/services/filter-options'
import { filtersToQuery, flashcardQueue, matchUnits, parseFilters, practiceQueue, type StudyFilters } from '@/server/services/queue'
import { readSettings } from '@/server/settings'
import { t } from '@/i18n'
import { EmptyState } from '@/ui/design/EmptyState'
import { count } from '@/ui/format'
import { chapterHref } from '@/ui/routes'
import { FilterForm } from '@/ui/study/FilterForm'
import { QueueCard } from '@/ui/study/QueueCard'
import { renderStudyItems } from '@/ui/study/render-items'
import { StudySession } from '@/ui/study/StudySession'
import { AudioButton } from './AudioButton'
import { IpaChip } from './IpaChip'

// Practice sections of language courses (docs/COURSE_FORMAT.md §2.1, src/ui/shell/course-nav.ts): one hub per section,
// scoped to the active course — «Слова» (SRS of [!word] cards with audio), «Аудіювання» ([!listen]), «Вимова»
// ([!speak] + [!pair]) and «Граматика й тести» (tests of the course's grammar topics + their topic tests).

export type LangSection = 'words' | 'listening' | 'pronunciation' | 'grammar'

type Params = Record<string, string | string[] | undefined>

interface SectionDef {
  path: string
  title: string
  lead: string
  tone: 'blue' | 'pink' | 'orange' | 'purple'
  icon: ReactNode
  // units the section draws from
  test: (u: LearningUnit, grammarChapters: ReadonlySet<string> | null) => boolean
  kind: 'flashcard' | 'quiz'
  empty: string
}

const LANGUAGE_MODES = new Set(['listen', 'pair', 'speak'])

const SECTIONS: Record<LangSection, SectionDef> = {
  words: {
    path: '/words',
    title: 'Слова',
    lead: 'Картки слів із вимовою: слово → переклад, приклади, форми. Повертаються за розкладом FSRS саме тоді, коли ти починаєш їх забувати.',
    tone: 'blue',
    icon: <PiTranslateFill size={38} />,
    test: (u) => u.kind === 'flashcard' && u.word !== undefined,
    kind: 'flashcard',
    empty: 'У цьому курсі ще немає карток слів.',
  },
  listening: {
    path: '/listening',
    title: 'Аудіювання',
    lead: 'Слухай і обирай почуте, відповідай на питання, пиши диктант. Можна слухати кілька разів і повільніше. Перевіряє сервер.',
    tone: 'pink',
    icon: <PiHeadphonesFill size={38} />,
    test: (u) => u.kind === 'quiz' && u.mode === 'listen',
    kind: 'quiz',
    empty: 'У цьому курсі ще немає вправ на аудіювання.',
  },
  pronunciation: {
    path: '/pronunciation',
    title: 'Вимова',
    lead: 'Скажи фразу в мікрофон — розпізнавання в браузері, сервер порівняє пословно й підкаже звуки. Мінімальні пари тренують слух: ship чи sheep?',
    tone: 'orange',
    icon: <PiMicrophoneFill size={38} />,
    test: (u) => u.kind === 'quiz' && (u.mode === 'speak' || u.mode === 'pair'),
    kind: 'quiz',
    empty: 'У цьому курсі ще немає вправ на вимову.',
  },
  grammar: {
    path: '/grammar',
    title: 'Граматика й тести',
    lead: 'Тести з граматичних тем курсу: обери відповідь, заповни пропуски, склади речення. Нижче — тести тем.',
    tone: 'purple',
    icon: <PiTextAaFill size={38} />,
    test: (u, grammar) => u.kind === 'quiz' && !LANGUAGE_MODES.has(u.mode) && (!grammar || grammar.has(u.chapterId)),
    kind: 'quiz',
    empty: 'У цьому курсі ще немає граматичних тестів.',
  },
}

const PRONUNCIATION_TYPES = [
  { value: 'speak', label: 'Скажи вголос' },
  { value: 'pair', label: 'Мінімальні пари' },
]

// Chapters of the active course tagged `grammar` (ENGLISH_SYLLABUS: tags [english, a1, grammar, …]); null = none tagged.
function grammarChapters(snapshot: ContentSnapshot, chapterIds: readonly string[]): ReadonlySet<string> | null {
  const tagged = chapterIds.filter((id) => snapshot.chapters.get(id)?.tags.some((t) => t.toLowerCase() === 'grammar' || t.toLowerCase() === 'граматика'))
  return tagged.length > 0 ? new Set(tagged) : null
}

export async function LangPracticePage({ section, params }: { section: LangSection; params: Params }) {
  const def = SECTIONS[section]
  const snapshot = await getContent()
  const settings = await readSettings()
  const filters: StudyFilters = parseFilters(params, def.kind === 'flashcard' ? settings.sessionSize : 10)
  if (filters.chapter && !filters.guide) filters.guide = snapshot.chapters.get(filters.chapter)?.guideId ?? null
  const active = await activeScope()
  const scope = await studyScope(filters)
  const chapterIds = active ? active.bundle.sections.flatMap((s) => s.topics.map((t) => t.chapterId)) : []
  const grammar = section === 'grammar' ? grammarChapters(snapshot, chapterIds) : null
  // the section's units inside the scope (the active course, or everything with «усі курси»)
  const pool = new Set<string>()
  for (const u of snapshot.units.values()) if ((!scope.pool || scope.pool.has(u.id)) && def.test(u, grammar)) pool.add(u.id)
  if (section === 'pronunciation') filters.types = filters.types.filter((t) => t === 'speak' || t === 'pair')
  const queryFilters = { ...filters }
  if (section === 'words') filters.types = []
  if (section === 'pronunciation' && filters.types.length === 0) filters.types = ['speak', 'pair']
  const startHref = `${def.path}?${filtersToQuery(queryFilters, { start: '1' })}`
  const seed = Number(params.r) || Math.floor(nowMs() / 60_000)
  // language course in its own scope: sessions under the learner's per-skill level ± 1, weighted towards topics with
  // mistakes (src/course/select/adaptive.ts); «усі курси» keeps the classic queues
  const adaptive = !filters.all ? await adaptiveContext() : null
  const flash = def.kind === 'flashcard' ? await flashcardQueue(snapshot, filters, undefined, pool, adaptive ? newWordOrder(adaptive) : undefined) : null
  const explicit = Boolean(filters.guide || filters.chapter || filters.levels.length > 0)
  const smart = def.kind === 'quiz' && adaptive ? await adaptiveQueue(adaptive, matchUnits(snapshot, filters, 'quiz', pool).map((u) => u.id), filters.size, seed, explicit, nowMs()) : null
  const quiz = def.kind === 'quiz' ? (smart ?? (await practiceQueue(snapshot, filters, 'quiz', seed, pool))) : null
  const ids = flash?.ids ?? quiz?.ids ?? []

  if (params.start === '1' && ids.length > 0) {
    const items = await renderStudyItems(snapshot, ids)
    return (
      <div className="page page-study">
        <StudySession items={items} mode={def.kind === 'flashcard' ? 'flashcards' : 'quiz'} filters={{ ...queryFilters, section }} restartHref={`${startHref}&r=${nowMs()}`} backHref={`${def.path}?${filtersToQuery(queryFilters)}`} backLabel={def.title} />
      </div>
    )
  }

  const options = filterOptions(snapshot, def.kind, filters, pool, scope.guides)
  const header = (
    <header className="ghead">
      <span className="ghead-badge" data-tone={def.tone} aria-hidden="true">
        {def.icon}
      </span>
      <div className="ghead-text">
        <h1 className="ghead-title">{def.title}</h1>
        <p className="ghead-lead">{def.lead}</p>
      </div>
    </header>
  )
  if (pool.size === 0 && !scope.all) {
    return (
      <div className="page page-study">
        {header}
        <EmptyState title={def.empty} mood="thinking" />
      </div>
    )
  }
  const values = { guide: filters.guide, chapter: filters.chapter, levels: filters.levels, frequencies: [], types: section === 'pronunciation' ? queryFilters.types : [], mode: filters.mode, size: filters.size }
  const form = (
    <FilterForm
      allLabel={scope.course && !scope.all ? 'Увесь курс' : undefined}
      course={scope.course ? { title: scope.course.title, all: scope.all } : undefined}
      action={def.path}
      guides={options.guides}
      chapters={options.chapters}
      levels={options.levels}
      types={section === 'pronunciation' ? { label: 'Вправи', options: PRONUNCIATION_TYPES } : undefined}
      modes={
        def.kind === 'flashcard'
          ? [
              { value: 'due', label: 'За розкладом' },
              { value: 'all', label: 'Усі за фільтром' },
            ]
          : undefined
      }
      sizes={def.kind === 'flashcard' ? [10, 20, 40] : [5, 10, 20]}
      values={values}
    />
  )
  const queue = flash ? (
    <QueueCard
      eyebrow="У черзі"
      count={flash.ids.length}
      rows={[
        { label: 'до повторення', value: flash.due, tone: 'orange' },
        { label: 'нових доступно', value: Math.min(flash.fresh, flash.newLeft), tone: 'blue' },
        { label: 'усього слів', value: flash.total, tone: 'gray' },
      ]}
      start={flash.ids.length > 0 ? { href: startHref, label: `Почати · ${count(flash.ids.length, 'слово', 'слова', 'слів')}` } : null}
      empty={flash.total === 0 ? 'За цим фільтром слів немає.' : 'На сьогодні все повторено! Можна вибрати «Усі за фільтром».'}
      note={
        <>
          Нових карток на день: {settings.newCardsPerDay} — змінюється в налаштуваннях.
          {adaptive ? <> {t('skills.wordsFirst', { level: adaptive.skills.view.skills.find((v) => v.skill === 'vocabulary')?.level ?? adaptive.skills.view.overall })}</> : null}
        </>
      }
    />
  ) : quiz ? (
    <QueueCard
      eyebrow="У сесії"
      count={quiz.ids.length}
      rows={[
        { label: 'з помилками раніше', value: quiz.wrong, tone: 'red' },
        { label: 'ще не пробував', value: quiz.unseen, tone: 'blue' },
        { label: 'усього за фільтром', value: quiz.total, tone: 'gray' },
      ]}
      start={quiz.ids.length > 0 ? { href: startHref, label: `Почати · ${count(quiz.ids.length, 'вправа', 'вправи', 'вправ')}` } : null}
      empty="За цим фільтром вправ немає."
      note={smart?.range ? t(smart.widened ? 'skills.bandWide' : 'skills.band', smart.range) : undefined}
    />
  ) : null
  return (
    <div className="page page-study">
      {header}
      <div className="study-setup">
        {form}
        {queue}
      </div>
      {section === 'words' ? <Vocabulary snapshot={snapshot} pool={pool} /> : null}
      {section === 'grammar' && active ? <TopicTests snapshot={snapshot} grammar={grammar} /> : null}
      {section === 'pronunciation' ? (
        <p className="unit-meta">
          <PiEarFill aria-hidden="true" /> Мікрофон працює в Chrome, Edge і Safari; запис нікуди не надсилається — на сервер іде лише розпізнаний текст. Без мікрофона — режим «послухай і повтори».
        </p>
      ) : null}
    </div>
  )
}

// The course's words by topic, with audio: a quick dictionary to listen through.
async function Vocabulary({ snapshot, pool }: { snapshot: ContentSnapshot; pool: ReadonlySet<string> }) {
  const byChapter = new Map<string, LearningUnit[]>()
  for (const id of pool) {
    const u = snapshot.units.get(id)
    if (!u) continue
    const list = byChapter.get(u.chapterId) ?? []
    list.push(u)
    byChapter.set(u.chapterId, list)
  }
  const chapters = [...byChapter.keys()].map((id) => snapshot.chapters.get(id)).filter((c) => c !== undefined)
  chapters.sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
  if (chapters.length === 0) return null
  const lang = await speechLangFor(byChapter.get(chapters[0]!.id)![0]!)
  return (
    <section aria-labelledby="vocab-title">
      <h2 id="vocab-title" className="section-title rule-title">
        Словник курсу
      </h2>
      {chapters.map((c) => (
        <details key={c.id} className="issue-group">
          <summary>
            <span>{c.title}</span>
            <span className="tabular unit-meta">{byChapter.get(c.id)!.length}</span>
          </summary>
          <ul className="lang-vocab">
            {byChapter.get(c.id)!.map((u) =>
              u.kind === 'flashcard' && u.word ? (
                <li key={u.id}>
                  <AudioButton text={u.word.word} lang={u.lang ?? lang} size="sm" showSlow={false} label={`Прослухати «${u.word.word}»`} />
                  <Link href={`${chapterHref(snapshot, c)}#u-${u.id}`} className="lang-vocab-word" lang={u.lang ?? lang}>
                    {u.word.word}
                  </Link>
                  <IpaChip ipa={u.word.ipa} ipaUs={u.word.ipaUs} />
                  <span className="lang-vocab-tr">{u.word.translations.join('; ')}</span>
                </li>
              ) : null,
            )}
          </ul>
        </details>
      ))}
    </section>
  )
}

// Topic tests of the active course's grammar topics (all topics when none is tagged `grammar`).
async function TopicTests({ snapshot, grammar }: { snapshot: ContentSnapshot; grammar: ReadonlySet<string> | null }) {
  const active = await activeScope()
  if (!active) return null
  const topics = [...lookup(active.bundle).topics.values()].filter((t) => t.test && (!grammar || grammar.has(t.chapterId)))
  if (topics.length === 0) return null
  return (
    <section aria-labelledby="grammar-tests">
      <h2 id="grammar-tests" className="section-title rule-title">
        Тести тем
      </h2>
      <ul className="lang-topics">
        {topics.map((t) => (
          <li key={t.id}>
            <Link href={`/test/${encodeURIComponent(t.test!.id)}`}>
              <span>{snapshot.chapters.get(t.chapterId)?.title ?? t.title}</span>
              <small className="tabular">{count(t.test!.questions, 'питання', 'питання', 'питань')}</small>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
