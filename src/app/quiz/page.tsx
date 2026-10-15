import type { Metadata } from 'next'
import { PiExamFill } from 'react-icons/pi'
import { nowMs } from '@/server/clock'
import { getContent } from '@/server/content'
import { filterOptions } from '@/server/services/filter-options'
import { filtersToQuery, parseFilters, practiceQueue } from '@/server/services/queue'
import { count } from '@/ui/format'
import { FilterForm } from '@/ui/study/FilterForm'
import { QueueCard } from '@/ui/study/QueueCard'
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
      <header className="ghead">
        <span className="ghead-badge" data-tone="purple" aria-hidden="true">
          <PiExamFill size={38} />
        </span>
        <div className="ghead-text">
          <h1 className="ghead-title">Тести</h1>
          <p className="ghead-lead">Сесія з N питань: миттєва перевірка, пояснення після кожної відповіді й розбір наприкінці. Спершу питання, де ти помилявся, потім нові.</p>
        </div>
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
        <QueueCard
          eyebrow="У сесії"
          count={queue.ids.length}
          rows={[
            { label: 'з помилками раніше', value: queue.wrong, tone: 'red' },
            { label: 'ще не відповідали', value: queue.unseen, tone: 'blue' },
            { label: 'усього за фільтром', value: queue.total, tone: 'gray' },
          ]}
          start={queue.ids.length > 0 ? { href: startHref, label: `Почати · ${count(queue.ids.length, 'питання', 'питання', 'питань')}` } : null}
          empty="За цим фільтром тестів немає."
        />
      </div>
    </div>
  )
}
