import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DIFFICULTIES, DIFFICULTY_LABEL, type TaskUnit } from '@/content/model'
import { getContent } from '@/server/content'
import { matchUnits, parseFilters, taskStates } from '@/server/services/queue'
import { renderStudyItems } from '@/ui/study/render-items'
import { TaskInline } from '@/ui/study/TaskInline'
import { chapterHref } from '@/ui/routes'
import { Tag, tagColor } from '@/ui/Tag'

export const metadata: Metadata = { title: 'Задачі' }

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const STATUS_LABEL = { open: 'в роботі', solved: 'розв’язано', failed: 'не вийшло' } as const

export default async function TasksPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const snapshot = await getContent()
  const filters = parseFilters(params, 200)
  const tasks = matchUnits(snapshot, { ...filters, types: [], size: 500 }, 'task') as TaskUnit[]
  const states = await taskStates(tasks.map((t) => t.id))
  const unitParam = typeof params.unit === 'string' ? params.unit : null
  const guideQuery = filters.guide ? `guide=${encodeURIComponent(filters.guide)}&` : ''

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
        <div className="reader-crumbs">
          <Link className="ui-link" href={`/tasks?${guideQuery}`}>
            Задачі
          </Link>
          {chapter ? (
            <>
              <span aria-hidden="true">/</span>
              <Link className="ui-link" href={chapterHref(snapshot, chapter)}>
                {chapter.title}
              </Link>
            </>
          ) : null}
        </div>
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
        <nav className="pager" aria-label="Сусідні задачі">
          {prev ? (
            <Link className="pager-link" href={`/tasks?${guideQuery}unit=${encodeURIComponent(prev.id)}`}>
              <span className="eyebrow">Попередня</span>
              <span className="pager-title">{prev.titleText}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link className="pager-link pager-next" href={`/tasks?${guideQuery}unit=${encodeURIComponent(next.id)}`}>
              <span className="eyebrow">Наступна</span>
              <span className="pager-title">{next.titleText}</span>
            </Link>
          ) : null}
        </nav>
      </div>
    )
  }

  const solved = tasks.filter((t) => states.get(t.id)?.status === 'solved').length
  return (
    <div className="page tasks-page">
      <header className="study-head">
        <h1 className="page-title">Задачі</h1>
        <p className="page-lead">
          Спершу пишете рішення самі, підказки відкриваються по одній. Задачі з 🧪 перевіряються автотестами прямо в браузері, решта — порівнянням з еталоном і чесною самооцінкою. Кожна підказка зменшує XP на 20%.
        </p>
        <p className="chapter-meta">
          <span>
            Розв’язано {solved} з {tasks.length}
          </span>
          {snapshot.guides
            .filter((g) => [...snapshot.units.values()].some((u) => u.kind === 'task' && u.guideId === g.id))
            .map((g) => (
              <Link key={g.id} className="ui-link" href={filters.guide === g.id ? '/tasks' : `/tasks?guide=${encodeURIComponent(g.id)}`} aria-current={filters.guide === g.id ? 'true' : undefined}>
                {filters.guide === g.id ? `× ${g.title}` : g.title}
              </Link>
            ))}
        </p>
      </header>
      {DIFFICULTIES.map((d) => {
        const group = tasks.filter((t) => t.difficulty === d)
        if (group.length === 0) return null
        return (
          <section key={d} aria-labelledby={`d-${d}`}>
            <h2 id={`d-${d}`} className="section-title rule-title">
              <Tag color={tagColor(d)}>{DIFFICULTY_LABEL[d]}</Tag>
              <span className="tabular">{group.length}</span>
            </h2>
            <table className="data-table">
              <tbody>
                {group.map((t) => {
                  const state = states.get(t.id)
                  const chapter = snapshot.chapters.get(t.chapterId)
                  return (
                    <tr key={t.id}>
                      <td>
                        <Link className="ui-link task-link" href={`/tasks?${guideQuery}unit=${encodeURIComponent(t.id)}`}>
                          {t.titleText}
                        </Link>
                        {t.code?.tests ? <span title="Перевіряється автотестами"> 🧪</span> : null}
                        <span className="cell-sub">{chapter?.title}</span>
                      </td>
                      <td className="task-state" data-status={state?.status ?? 'new'}>
                        {state ? STATUS_LABEL[state.status] : 'нова'}
                        {state && state.hintsRevealed > 0 ? <span className="cell-sub">підказок: {state.hintsRevealed}</span> : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        )
      })}
      {tasks.length === 0 ? <p className="empty-note">Задач поки немає. Додайте callout [!task] у будь-який розділ — формат у CONTENT_SPEC.md.</p> : null}
    </div>
  )
}
