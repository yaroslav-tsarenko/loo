import type { Metadata } from 'next'
import { PiCardsThreeFill } from 'react-icons/pi'
import { nowMs } from '@/server/clock'
import { getContent } from '@/server/content'
import { studyScope } from '@/server/courses/enrollment'
import { filterOptions } from '@/server/services/filter-options'
import { filtersToQuery, flashcardQueue, parseFilters } from '@/server/services/queue'
import { readSettings } from '@/server/settings'
import { count } from '@/ui/format'
import { FilterForm } from '@/ui/study/FilterForm'
import { QueueCard } from '@/ui/study/QueueCard'
import { renderStudyItems } from '@/ui/study/render-items'
import { StudySession } from '@/ui/study/StudySession'

export const metadata: Metadata = { title: 'Картки' }

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function ReviewPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const snapshot = await getContent()
  const settings = await readSettings()
  const filters = parseFilters(params, settings.sessionSize)
  if (filters.chapter && !filters.guide) filters.guide = snapshot.chapters.get(filters.chapter)?.guideId ?? null
  const scope = await studyScope(filters)
  const queue = await flashcardQueue(snapshot, filters, undefined, scope)
  const startHref = `/review?${filtersToQuery(filters, { start: '1' })}`

  if (params.start === '1' && queue.ids.length > 0) {
    const items = await renderStudyItems(snapshot, queue.ids)
    return (
      <div className="page page-study">
        <StudySession items={items} mode="flashcards" filters={{ ...filters }} restartHref={`${startHref}&r=${nowMs()}`} backHref={`/review?${filtersToQuery(filters)}`} backLabel="До фільтрів" />
      </div>
    )
  }

  const options = filterOptions(snapshot, 'flashcard', filters, scope)
  return (
    <div className="page page-study">
      <header className="ghead">
        <span className="ghead-badge" data-tone="blue" aria-hidden="true">
          <PiCardsThreeFill size={38} />
        </span>
        <div className="ghead-text">
          <h1 className="ghead-title">Картки</h1>
          <p className="ghead-lead">Питання → відповідь → чесна самооцінка. Картки повертаються за FSRS саме тоді, коли ти починаєш їх забувати.</p>
        </div>
      </header>
      <div className="study-setup">
        <FilterForm
          allLabel={scope ? 'Увесь активний курс' : undefined}
          action="/review"
          guides={options.guides}
          chapters={options.chapters}
          levels={options.levels}
          frequencies={options.frequencies}
          types={{ label: 'Тип', options: options.types }}
          modes={[
            { value: 'due', label: 'За розкладом' },
            { value: 'all', label: 'Усі за фільтром' },
          ]}
          sizes={[10, 20, 40]}
          values={{ guide: filters.guide, chapter: filters.chapter, levels: filters.levels, frequencies: filters.frequencies, types: filters.types, mode: filters.mode, size: filters.size }}
        />
        <QueueCard
          eyebrow="У черзі"
          count={queue.ids.length}
          rows={[
            { label: 'до повторення', value: queue.due, tone: 'orange' },
            {
              label: 'нових доступно',
              value: (
                <>
                  {Math.min(queue.fresh, queue.newLeft)}
                  {queue.fresh > queue.newLeft ? <span className="muted"> з {queue.fresh}</span> : null}
                </>
              ),
              tone: 'blue',
            },
            { label: 'усього за фільтром', value: queue.total, tone: 'gray' },
          ]}
          start={queue.ids.length > 0 ? { href: startHref, label: `Почати · ${count(queue.ids.length, 'картка', 'картки', 'карток')}` } : null}
          empty={queue.total === 0 ? 'За цим фільтром карток немає.' : filters.mode === 'due' ? 'На сьогодні все повторено! Можна вибрати «Усі за фільтром».' : 'Черга порожня.'}
          note={<>Нових карток на день: {settings.newCardsPerDay} — змінюється в налаштуваннях.</>}
        />
      </div>
    </div>
  )
}
