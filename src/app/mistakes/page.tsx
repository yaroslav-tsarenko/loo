import type { Metadata } from 'next'
import Link from 'next/link'
import type { LearningUnit } from '@/content/model'
import { LEVEL_LABEL } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { nowMs } from '@/server/clock'
import { getContent } from '@/server/content'
import { mistakeTopics, openMistakeRows, recentlyResolved } from '@/server/services/queue'
import { unitLabel } from '@/server/services/units-sync'
import { count, relative } from '@/ui/format'
import { chapterHref } from '@/ui/routes'
import { renderStudyItems } from '@/ui/study/render-items'
import { StudySession } from '@/ui/study/StudySession'

export const metadata: Metadata = { title: 'Мої помилки' }

const KIND_LABEL = { flashcard: 'Картка', quiz: 'Тест', task: 'Задача' } as const

function unitHref(snapshot: ContentSnapshot, unit: LearningUnit): string {
  const chapter = snapshot.chapters.get(unit.chapterId)
  return chapter ? `${chapterHref(snapshot, chapter)}#u-${unit.id}` : '/'
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function MistakesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const snapshot = await getContent()
  const now = nowMs()
  const rows = await openMistakeRows(snapshot)
  const eligible = rows.filter((r) => r.eligibleAt === null || r.eligibleAt <= now)
  const waiting = rows.length - eligible.length

  if (params.start === '1' && eligible.length > 0) {
    const ids = [...eligible].sort((a, b) => a.lastWrongAt - b.lastWrongAt).slice(0, 40).map((r) => r.unit.id)
    const items = await renderStudyItems(snapshot, ids, now)
    return (
      <div className="page page-study">
        <StudySession items={items} mode="mistakes" filters={{ source: 'mistakes' }} restartHref={`/mistakes?start=1&r=${now}`} backHref="/mistakes" backLabel="До списку помилок" />
      </div>
    )
  }

  const topics = (await mistakeTopics(snapshot)).slice(0, 10)
  const maxOpen = Math.max(1, ...topics.map((t) => t.open))
  const resolved = await recentlyResolved(snapshot, now - 7 * 86_400_000)

  return (
    <div className="page mistakes-page">
      <header className="mistakes-head">
        <div>
          <h1 className="page-title">Мої помилки</h1>
          <p className="page-lead">
            Сюди потрапляє кожна неправильна відповідь у тесті, картка з оцінкою «Не знав» і задача, яка не вийшла. Питання виходить звідси після двох правильних відповідей поспіль із перервою щонайменше 20 годин.
          </p>
        </div>
        <div className="mistakes-cta">
          <span className="queue-num tabular">{rows.length}</span>
          <span className="unit-meta">{rows.length === 0 ? 'відкритих помилок немає' : `відкрито${waiting > 0 ? ` · ${waiting} чекають перерви` : ''}`}</span>
          {eligible.length > 0 ? (
            <Link className="ui-button" href="/mistakes?start=1">
              Пройти {count(eligible.length, 'помилку', 'помилки', 'помилок')}
            </Link>
          ) : null}
        </div>
      </header>

      {rows.length === 0 ? (
        <p className="empty-note">
          Поки чисто. Коли помилитесь у тесті, оціните картку як «Не знав» або задача не вийде — питання з&apos;явиться тут, і його можна буде пройти окремою сесією.
        </p>
      ) : (
        <>
          <section aria-labelledby="topics-title">
            <h2 id="topics-title" className="section-title rule-title">
              Де помиляєтесь найчастіше
            </h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Розділ</th>
                  <th scope="col" className="num">
                    Відкрито
                  </th>
                  <th scope="col" className="num">
                    Усього
                  </th>
                  <th scope="col" className="bar-col">
                    <span className="sr-only">Частка</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {topics.map((t) => {
                  const chapter = snapshot.chapters.get(t.chapterId)
                  if (!chapter) return null
                  const guide = snapshot.guideById.get(chapter.guideId)
                  return (
                    <tr key={t.chapterId}>
                      <td>
                        <Link className="ui-link" href={chapterHref(snapshot, chapter)}>
                          {chapter.kind === 'index' ? guide?.title : chapter.title}
                        </Link>
                        <span className="cell-sub">{guide?.title}</span>
                      </td>
                      <td className="num tabular">{t.open}</td>
                      <td className="num tabular muted">{t.ever}</td>
                      <td className="bar-col">
                        <span className="bar" data-tone="danger" aria-hidden="true">
                          <span style={{ transform: `scaleX(${t.open / maxOpen})` }} />
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>

          <section aria-labelledby="open-title">
            <h2 id="open-title" className="section-title rule-title">
              Відкриті
            </h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Питання</th>
                  <th scope="col">Тип</th>
                  <th scope="col" className="num">
                    Помилок
                  </th>
                  <th scope="col">До виходу</th>
                  <th scope="col">Остання</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.unit.id}>
                    <td>
                      <Link className="ui-link" href={unitHref(snapshot, r.unit)}>
                        {unitLabel(r.unit)}
                      </Link>
                      <span className="cell-sub">
                        {snapshot.chapters.get(r.unit.chapterId)?.title}
                        {r.unit.level ? ` · ${LEVEL_LABEL[r.unit.level]}` : ''}
                      </span>
                    </td>
                    <td className="muted">{KIND_LABEL[r.unit.kind]}</td>
                    <td className="num tabular">{r.wrongCount}</td>
                    <td>
                      <span className="streak-dots" aria-label={`${r.correctStreak} з 2 правильних`}>
                        <i data-on={r.correctStreak >= 1 ? '' : undefined} />
                        <i data-on={r.correctStreak >= 2 ? '' : undefined} />
                      </span>
                      {r.eligibleAt && r.eligibleAt > now ? <span className="cell-sub">наступна спроба {relative(r.eligibleAt, now)}</span> : null}
                    </td>
                    <td className="muted">{relative(r.lastWrongAt, now)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      {resolved.length > 0 ? (
        <section aria-labelledby="resolved-title">
          <h2 id="resolved-title" className="section-title rule-title">
            Закриті за тиждень
          </h2>
          <ul className="resolved-list">
            {resolved.map((u) => (
              <li key={u.id}>
                <Link className="ui-link" href={unitHref(snapshot, u)}>
                  {unitLabel(u)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
