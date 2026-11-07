import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PiArrowLeftBold, PiArrowRightBold, PiCheckBold, PiCodeBlockFill, PiPencilSimpleFill, PiTestTubeFill, PiXBold } from 'react-icons/pi'
import { DIFFICULTIES, DIFFICULTY_LABEL, type TaskUnit } from '@/content/model'
import { getContent } from '@/server/content'
import { studyScope } from '@/server/courses/enrollment'
import { matchUnits, parseFilters, taskStates } from '@/server/services/queue'
import { renderStudyItems } from '@/ui/study/render-items'
import { TaskInline } from '@/ui/study/TaskInline'
import { Pill } from '@/ui/design/Badge'
import { Card } from '@/ui/design/Card'
import type { Tone } from '@/ui/design/cx'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { chapterHref } from '@/ui/routes'

export const metadata: Metadata = { title: 'Задачі' }

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const STATUS_LABEL = { open: 'в роботі', solved: 'розв’язано', failed: 'не вийшло', new: 'нова' } as const
const STATUS_ICON = { open: <PiPencilSimpleFill />, solved: <PiCheckBold />, failed: <PiXBold />, new: <PiCodeBlockFill /> } as const
const DIFF_TONE: Record<string, Tone> = { easy: 'green', medium: 'orange', hard: 'red' }

export default async function TasksPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const snapshot = await getContent()
  const filters = parseFilters(params, 200)
  const scope = await studyScope(filters)
  const tasks = matchUnits(snapshot, { ...filters, types: [], size: 500 }, 'task', scope.pool) as TaskUnit[]
  const states = await taskStates(tasks.map((t) => t.id))
  const unitParam = typeof params.unit === 'string' ? params.unit : null
  const allQuery = filters.all ? 'scope=all&' : ''
  const guideQuery = `${allQuery}${filters.guide ? `guide=${encodeURIComponent(filters.guide)}&` : ''}`

  if (unitParam) {
    const unit = snapshot.units.get(unitParam)
    if (!unit || unit.kind !== 'task') notFound()
    const [item] = await renderStudyItems(snapshot, [unit.id])
    if (!item || item.kind !== 'task') notFound()
    const state = states.get(unit.id) ?? (await taskStates([unit.id])).get(unit.id)
    const pos = tasks.findIndex((t) => t.id === unit.id)
    const prev = pos > 0 ? tasks[pos - 1] : null
    const next = pos >= 0 && pos < tasks.length - 1 ? tasks[pos + 1] : null
    const chapter = snapshot.chapters.get(unit.chapterId)
    return (
      <div className="page task-page">
        <nav className="gcrumbs" aria-label="Навігація">
          <Link className="gcrumb" href={`/tasks?${guideQuery}`}>
            <PiArrowLeftBold aria-hidden="true" /> Задачі
          </Link>
          {chapter ? (
            <Link className="gcrumb" href={chapterHref(snapshot, chapter)}>
              {chapter.title}
            </Link>
          ) : null}
        </nav>
        <div className="task-page-body">
          <TaskInline
            key={unit.id}
            unitId={unit.id}
            title={item.title}
            difficulty={item.difficulty}
            difficultyKey={item.difficultyKey}
            level={item.level}
            statement={item.statement}
            hints={item.hints}
            solution={item.solution}
            initialDraft={state?.draft ?? ''}
            initialHints={state?.hintsRevealed ?? 0}
            initialStatus={state?.status}
            code={item.code}
            variant="inline"
          />
        </div>
        <nav className="gpager" aria-label="Сусідні задачі">
          {prev ? (
            <Card href={`/tasks?${guideQuery}unit=${encodeURIComponent(prev.id)}`} padding="sm" className="gpager-link">
              <span className="gpager-dir">
                <PiArrowLeftBold aria-hidden="true" /> Попередня
              </span>
              <span className="gpager-title">{prev.titleText}</span>
            </Card>
          ) : (
            <span />
          )}
          {next ? (
            <Card href={`/tasks?${guideQuery}unit=${encodeURIComponent(next.id)}`} padding="sm" className="gpager-link gpager-next">
              <span className="gpager-dir">
                Наступна <PiArrowRightBold aria-hidden="true" />
              </span>
              <span className="gpager-title">{next.titleText}</span>
            </Card>
          ) : null}
        </nav>
      </div>
    )
  }

  const solved = tasks.filter((t) => states.get(t.id)?.status === 'solved').length
  // Guides of the active course (all guides with «Усі курси» or without a course); a picked outside guide stays.
  const guides = snapshot.guides.filter((g) => (!scope.guides || scope.guides.has(g.id) || g.id === filters.guide) && [...snapshot.units.values()].some((u) => u.kind === 'task' && u.guideId === g.id))
  return (
    <div className="page tasks-page">
      <header className="ghead">
        <span className="ghead-badge" data-tone="orange" aria-hidden="true">
          <PiCodeBlockFill size={38} />
        </span>
        <div className="ghead-text">
          <h1 className="ghead-title">Задачі</h1>
          <p className="ghead-lead">Спершу пишеш рішення сам, підказки відкриваються по одній. Задачі з автотестами перевіряються прямо в браузері, решта — порівнянням з еталоном. Кожна підказка зменшує XP на 20%.</p>
        </div>
      </header>
      <Card variant="raised" className="tasks-progress">
        <div className="tasks-progress-top">
          <span className="tasks-progress-label">Розв’язано</span>
          <span className="tasks-progress-num tabular">
            {solved}
            <small>/{tasks.length}</small>
          </span>
        </div>
        <ProgressBar value={tasks.length ? solved / tasks.length : 0} label="Розв’язано задач" size="lg" />
        {guides.length > 0 || scope.course ? (
          <nav className="gchips" aria-label="Матеріали">
            <Link className="gchip" href={filters.all ? '/tasks?scope=all' : '/tasks'} aria-current={!filters.guide ? 'true' : undefined}>
              {scope.course && !filters.all ? 'Увесь курс' : 'Усі'}
            </Link>
            {guides.map((g) => (
              <Link
                key={g.id}
                className="gchip"
                href={filters.guide === g.id ? `/tasks?${allQuery}` : `/tasks?${allQuery}guide=${encodeURIComponent(g.id)}`}
                aria-current={filters.guide === g.id ? 'true' : undefined}
              >
                {g.title}
              </Link>
            ))}
            {scope.course ? (
              <Link className="gchip" href={filters.all ? '/tasks' : '/tasks?scope=all'} title={filters.all ? scope.course.title : 'Задачі всіх курсів і посібників'}>
                {filters.all ? 'Лише цей курс' : 'Усі курси'}
              </Link>
            ) : null}
          </nav>
        ) : null}
      </Card>
      {DIFFICULTIES.map((d) => {
        const group = tasks.filter((t) => t.difficulty === d)
        if (group.length === 0) return null
        const done = group.filter((t) => states.get(t.id)?.status === 'solved').length
        return (
          <section key={d} aria-labelledby={`d-${d}`} className="gsection">
            <h2 id={`d-${d}`} className="gsection-title">
              <Pill tone={DIFF_TONE[d] ?? 'gray'} solid size="sm">
                {DIFFICULTY_LABEL[d]}
              </Pill>
              <span className="gsection-count tabular">
                {done}/{group.length}
              </span>
            </h2>
            <ul className="task-cards">
              {group.map((t) => {
                const state = states.get(t.id)
                const status = state?.status ?? 'new'
                const chapter = snapshot.chapters.get(t.chapterId)
                return (
                  <li key={t.id}>
                    <Card href={`/tasks?${guideQuery}unit=${encodeURIComponent(t.id)}`} padding="sm" className="task-card" data-status={status}>
                      <span className="task-card-status" role="img" aria-label={STATUS_LABEL[status]} title={STATUS_LABEL[status]}>
                        {STATUS_ICON[status]}
                      </span>
                      <span className="task-card-text">
                        <span className="task-card-title">{t.titleText}</span>
                        <span className="task-card-meta">
                          {chapter?.title}
                          {state && state.hintsRevealed > 0 ? ` · підказок: ${state.hintsRevealed}` : ''}
                        </span>
                      </span>
                      {t.code?.tests ? (
                        <Pill size="sm" tone="blue" icon={<PiTestTubeFill />} className="task-card-tests" title="Перевіряється автотестами">
                          тести
                        </Pill>
                      ) : null}
                    </Card>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
      {tasks.length === 0 ? <p className="empty-note">Задач поки немає. Додайте callout [!task] у будь-який розділ — формат у CONTENT_SPEC.md.</p> : null}
    </div>
  )
}
