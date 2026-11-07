import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/server/content'
import { buildRoadmap } from '@/server/services/roadmap'
import { trackPath } from '@/server/services/path'
import { shellData } from '@/server/shell'
import { TRACKS } from '@/content/tracks'
import { levelInfo } from '@/progress/levels'
import { PixelIcon } from '@/ui/design/PixelIcon'
import { EngineerMap, type TrackCard } from '@/ui/roadmap/EngineerMap'
import { chapterHref, guideHref } from '@/ui/routes'

export const metadata: Metadata = { title: 'Мапа інженера' }

const KIND_LABEL = { review: 'Повторення', mistakes: 'Помилки', next: 'Далі', prerequisite: 'Спершу', weak: 'Підтягнути', start: 'Новий посібник' } as const

export default async function RoadmapPage() {
  const snapshot = await getContent()
  const [map, xp, cards] = await Promise.all([
    buildRoadmap(snapshot),
    shellData().then((s) => s?.xp ?? 0),
    Promise.all(
      TRACKS.map(async (track): Promise<TrackCard> => {
        const available = track.guides.some((g) => snapshot.guideById.has(g))
        if (!available) return { track, available, lessonsDone: 0, lessonsTotal: 0, crowns: 0, maxCrowns: 0, ratio: 0, currentTitle: null }
        const p = await trackPath(snapshot, track)
        return { track, available, lessonsDone: p.lessonsDone, lessonsTotal: p.lessonsTotal, crowns: p.crowns, maxCrowns: p.maxCrowns, ratio: p.ratio, currentTitle: p.lessonsDone > 0 ? p.current?.chapter.title ?? null : null }
      }),
    ),
  ])
  return (
    <div className="page roadmap">
      <h1 className="page-title">
        <PixelIcon name="map" size={36} className="page-title-icon" />
        Мапа інженера
      </h1>
      <p className="page-lead">Усі треки від нуля до Pro. Обери трек — відкриється його шлях з уроками.</p>
      <EngineerMap cards={cards} level={levelInfo(xp)} />
      <header className="roadmap-head">
        <h2 className="section-title rule-title">Детально по розділах</h2>
        <p className="page-lead">
          {map.current ? (
            <>
              Ви зараз у «{map.current.guide.title}»:{' '}
              <Link className="ui-link" href={chapterHref(snapshot, map.current.chapter)}>
                {map.current.chapter.title}
              </Link>
              .
            </>
          ) : (
            'Ще нічого не відкривали — почніть з рекомендації праворуч.'
          )}
        </p>
      </header>
      <div className="roadmap-body">
        <section className="lanes" aria-label="Посібники і розділи">
          <p className="lanes-legend unit-meta">
            <span className="road-cell" data-status="studied" /> вивчено <span className="road-cell" data-status="reading" /> читаю <span className="road-cell" /> попереду{' '}
            <span className="road-cell" data-weak="" /> слабка тема <span className="road-cell" data-current="" /> ви тут
          </p>
          {map.lanes.map((lane) => (
            <article key={lane.guide.id} className="lane" data-blocked={lane.blocked ? '' : undefined}>
              <header className="lane-head">
                <Link className="lane-title" href={guideHref(lane.guide.id)}>
                  {lane.guide.title}
                </Link>
                <span className="tabular unit-meta">
                  {lane.studied}/{lane.total}
                </span>
                {lane.prerequisites.length > 0 ? <span className="unit-meta">після: {lane.prerequisites.map((p) => p.title).join(', ')}</span> : null}
              </header>
              <div className="lane-parts">
                {lane.parts.map((part, i) => (
                  <div key={i} className="lane-part">
                    {part.title ? <span className="lane-part-title">{part.title}</span> : null}
                    <ol className="road-cells">
                      {part.nodes.map((n) => (
                        <li key={n.id}>
                          <Link
                            href={n.href}
                            className="road-cell"
                            data-status={n.status}
                            data-weak={n.weak ? '' : undefined}
                            data-current={n.current ? '' : undefined}
                            title={`${n.title}${n.status === 'studied' ? ' — вивчено' : n.status === 'reading' ? ' — читаю' : ''}${n.weak ? ' · слабка тема' : ''}`}
                            aria-label={`${n.title}${n.status === 'studied' ? ', вивчено' : n.status === 'reading' ? ', читаю' : ''}${n.weak ? ', слабка тема' : ''}`}
                          />
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
        <aside className="recs" aria-labelledby="recs-title">
          <h2 id="recs-title" className="section-title rule-title">
            Що далі
          </h2>
          {map.recommendations.length === 0 ? (
            <p className="empty-note">Усе закрито. Додайте новий посібник у vault.</p>
          ) : (
            <ol className="rec-list">
              {map.recommendations.map((r, i) => (
                <li key={`${r.kind}-${i}`} data-kind={r.kind}>
                  <span className="eyebrow">{KIND_LABEL[r.kind]}</span>
                  <Link className="rec-title" href={r.href}>
                    {r.title}
                  </Link>
                  <span className="cell-sub">{r.reason}</span>
                </li>
              ))}
            </ol>
          )}
          {map.cycles.length > 0 ? <p className="unit-meta">Цикл у prerequisites: {map.cycles.join(', ')}</p> : null}
        </aside>
      </div>
    </div>
  )
}
