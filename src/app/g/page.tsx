import type { Metadata } from 'next'
import { PiBooksFill } from 'react-icons/pi'
import { courseTheory } from '@/course'
import { getContent } from '@/server/content'
import { activeCourse } from '@/server/courses/enrollment'
import { libraryRows, type GuideRow } from '@/server/services/library'
import { Card } from '@/ui/design/Card'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { count } from '@/ui/format'
import { Icon } from '@/ui/icons/Icon'
import { guideHref } from '@/ui/routes'

export const metadata: Metadata = { title: 'Посібники' }

function GuideCard({ row }: { row: GuideRow }) {
  const { guide } = row
  return (
    <li>
      <Card href={guideHref(guide.id)} padding="sm" className="guide-card">
        <span className="guide-card-icon" aria-hidden="true">
          <Icon name={guide.icon ?? 'px:book'} size={28} />
        </span>
        <span className="guide-card-body">
          <span className="guide-card-title">{guide.title}</span>
          {guide.description ? <span className="guide-card-desc">{guide.description}</span> : null}
          <span className="guide-card-meta tabular">
            {row.studied}/{count(row.chapters, 'розділ', 'розділи', 'розділів')} вивчено
          </span>
          <ProgressBar value={row.chapters ? row.studied / row.chapters : 0} size="sm" tone={row.studied === row.chapters && row.chapters > 0 ? 'green' : 'violet'} label={`${guide.title}: вивчено`} />
        </span>
      </Card>
    </li>
  )
}

// Every guide in the vault. The sidebar «Теорія» shows only the active course's guides; the rest live here.
export default async function GuidesPage() {
  const snapshot = await getContent()
  const [rows, active] = await Promise.all([libraryRows(snapshot), activeCourse()])
  const own = active ? courseTheory(active.bundle) : []
  const byId = new Map(rows.map((r) => [r.guide.id, r]))
  const mine = own.map((id) => byId.get(id)).filter((r): r is GuideRow => r !== undefined)
  const others = rows.filter((r) => !own.includes(r.guide.id))
  return (
    <div className="page guides-page" data-width="wide">
      <header className="ghead">
        <span className="ghead-badge" data-tone="violet" aria-hidden="true">
          <PiBooksFill size={38} />
        </span>
        <div className="ghead-text">
          <h1 className="ghead-title">Посібники</h1>
          <p className="ghead-lead">Уся теорія платформи. У бічній панелі — лише посібники активного курсу; решта тут.</p>
        </div>
      </header>
      {mine.length > 0 ? (
        <section aria-labelledby="guides-course" className="gsection">
          <h2 id="guides-course" className="gsection-title">
            Курс «{active!.bundle.course.title}» <span className="gsection-count tabular">{mine.length}</span>
          </h2>
          <ul className="guide-grid">
            {mine.map((r) => (
              <GuideCard key={r.guide.id} row={r} />
            ))}
          </ul>
        </section>
      ) : null}
      {others.length > 0 ? (
        <section aria-labelledby="guides-other" className="gsection">
          <h2 id="guides-other" className="gsection-title">
            {mine.length > 0 ? 'Інші посібники' : 'Усі посібники'} <span className="gsection-count tabular">{others.length}</span>
          </h2>
          <ul className="guide-grid">
            {others.map((r) => (
              <GuideCard key={r.guide.id} row={r} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
