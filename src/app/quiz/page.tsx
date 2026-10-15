import type { Metadata } from 'next'
import Link from 'next/link'
import { nowMs } from '@/server/clock'
import { getContent } from '@/server/content'
import { filterOptions } from '@/server/services/filter-options'
import { filtersToQuery, parseFilters, practiceQueue } from '@/server/services/queue'
import { count } from '@/ui/format'
import { FilterForm } from '@/ui/study/FilterForm'
import { renderStudyItems } from '@/ui/study/render-items'
import { StudySession } from '@/ui/study/StudySession'

export const metadata: Metadata = { title: 'Тести' }

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function QuizPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const snapshot = await getContent()
  const filters = parseFilters(params, 10)
  if (filters.chapter && !filters.guide) filters.guide = snapshot.chapters.get(filters.chapter)?.guideId ?? null
  const seed = Number(params.r) || Math.floor(nowMs() / 60_000)
  const queue = await practiceQueue(snapshot, filters, 'quiz', seed)
  const startHref = `/quiz?${filtersToQuery(filters, { start: '1' })}`

  if (params.start === '1' && queue.ids.length > 0) {
    const items = await renderStudyItems(snapshot, queue.ids)
    return (
      <div className="page page-study">
        <StudySession items={items} mode="quiz" filters={{ ...filters }} restartHref={`${startHref}&r=${nowMs()}`} backHref={`/quiz?${filtersToQuery(filters)}`} backLabel="До фільтрів" />
      </div>
    )
  }

  const options = filterOptions(snapshot, 'quiz', filters)
  return (
    <div className="page page-study">
      <header className="study-head">
        <h1 className="page-title">Тести</h1>
        <p className="page-lead">Сесія з N питань: миттєва перевірка, пояснення після кожної відповіді і розбір наприкінці. Спершу йдуть питання, де ви помилялись, потім нові.</p>
      </header>
      <div className="study-setup">
        <FilterForm
          action="/quiz"
          guides={options.guides}
          chapters={options.chapters}
          levels={options.levels}
          types={{ label: 'Формат', options: options.quizModes }}
          sizes={[5, 10, 20]}
          values={{ guide: filters.guide, chapter: filters.chapter, levels: filters.levels, frequencies: [], types: filters.types, mode: filters.mode, size: filters.size }}
        />
        <aside className="queue">
          <span className="eyebrow">У сесії</span>
          <p className="queue-num tabular">{queue.ids.length}</p>
          <dl className="queue-split">
            <div>
              <dt>з помилками раніше</dt>
              <dd className="tabular">{queue.wrong}</dd>
            </div>
            <div>
              <dt>ще не відповідали</dt>
              <dd className="tabular">{queue.unseen}</dd>
            </div>
            <div>
              <dt>усього за фільтром</dt>
              <dd className="tabular">{queue.total}</dd>
            </div>
          </dl>
          {queue.ids.length > 0 ? (
            <Link className="ui-button queue-start" href={startHref}>
              Почати · {count(queue.ids.length, 'питання', 'питання', 'питань')}
            </Link>
          ) : (
            <p className="queue-empty">За цим фільтром тестів немає.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
