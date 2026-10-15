import type { Metadata } from 'next'
import Link from 'next/link'
import { nowMs } from '@/server/clock'
import { getContent } from '@/server/content'
import { filterOptions } from '@/server/services/filter-options'
import { filtersToQuery, flashcardQueue, parseFilters } from '@/server/services/queue'
import { readSettings } from '@/server/settings'
import { count } from '@/ui/format'
import { FilterForm } from '@/ui/study/FilterForm'
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
  const queue = await flashcardQueue(snapshot, filters)
  const startHref = `/review?${filtersToQuery(filters, { start: '1' })}`

  if (params.start === '1' && queue.ids.length > 0) {
    const items = await renderStudyItems(snapshot, queue.ids)
    return (
      <div className="page page-study">
        <StudySession items={items} mode="flashcards" filters={{ ...filters }} restartHref={`${startHref}&r=${nowMs()}`} backHref={`/review?${filtersToQuery(filters)}`} backLabel="До фільтрів" />
      </div>
    )
  }

  const options = filterOptions(snapshot, 'flashcard', filters)
  return (
    <div className="page page-study">
      <header className="study-head">
        <h1 className="page-title">Картки</h1>
        <p className="page-lead">Питання → відповідь → чесна самооцінка. Картки повертаються за FSRS саме тоді, коли ви починаєте їх забувати.</p>
      </header>
      <div className="study-setup">
        <FilterForm
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
        <aside className="queue">
          <span className="eyebrow">У черзі</span>
          <p className="queue-num tabular">{queue.ids.length}</p>
          <dl className="queue-split">
            <div>
              <dt>до повторення</dt>
              <dd className="tabular">{queue.due}</dd>
            </div>
            <div>
              <dt>нових доступно</dt>
              <dd className="tabular">
                {Math.min(queue.fresh, queue.newLeft)}
                {queue.fresh > queue.newLeft ? <span className="muted"> з {queue.fresh}</span> : null}
              </dd>
            </div>
            <div>
              <dt>усього за фільтром</dt>
              <dd className="tabular">{queue.total}</dd>
            </div>
          </dl>
          {queue.ids.length > 0 ? (
            <Link className="ui-button queue-start" href={startHref}>
              Почати · {count(queue.ids.length, 'картка', 'картки', 'карток')}
            </Link>
          ) : (
            <p className="queue-empty">
              {queue.total === 0
                ? 'За цим фільтром карток немає.'
                : filters.mode === 'due'
                  ? 'На сьогодні все повторено. Можна вибрати «Усі за фільтром».'
                  : 'Черга порожня.'}
            </p>
          )}
          <p className="unit-meta queue-note">Нових карток на день: {settings.newCardsPerDay} — змінюється в налаштуваннях.</p>
        </aside>
      </div>
    </div>
  )
}
