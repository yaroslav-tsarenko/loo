import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { PiBrainFill, PiCardsThreeFill, PiCodeBlockFill, PiExamFill, PiHourglassFill, PiLightningFill, PiSealCheckFill } from 'react-icons/pi'
import type { LearningUnit } from '@/content/model'
import { LEVEL_LABEL } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { nowMs } from '@/server/clock'
import { getContent } from '@/server/content'
import { adaptiveContext, orderMistakes } from '@/server/courses/adaptive'
import { studyScope } from '@/server/courses/enrollment'
import { mistakesOverview } from '@/server/services/queue'
import { unitLabel } from '@/server/services/units-sync'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'
import { Card } from '@/ui/design/Card'
import type { Tone } from '@/ui/design/cx'
import { EmptyState } from '@/ui/design/EmptyState'
import type { LooMood } from '@/ui/design/mascot/Loo'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { Ring } from '@/ui/design/Ring'
import { count, relative } from '@/ui/format'
import { chapterHref } from '@/ui/routes'
import { renderStudyItems } from '@/ui/study/render-items'
import { StudySession } from '@/ui/study/StudySession'

export const metadata: Metadata = { title: 'Мої помилки' }

const KIND: Record<LearningUnit['kind'], { label: string; tone: Tone; icon: ReactNode }> = {
  flashcard: { label: 'Картка', tone: 'purple', icon: <PiCardsThreeFill /> },
  quiz: { label: 'Тест', tone: 'blue', icon: <PiExamFill /> },
  task: { label: 'Задача', tone: 'orange', icon: <PiCodeBlockFill /> },
}
const FIXED_TONES: readonly Tone[] = ['green', 'blue', 'purple', 'orange', 'pink', 'yellow']

// Loo's mood follows the pile: calm for a few, thoughtful for a stack, fired up when it's big.
function looFor(open: number, eligible: number): { mood: LooMood; text: string } {
  if (open <= 3) return { mood: 'happy', text: eligible > 0 ? 'Лише кілька помилок — закриємо за хвилину!' : 'Майже чисто. Ці питання ще відпочивають.' }
  if (open <= 15) return { mood: 'thinking', text: 'Помилки — найкоротший шлях до сильної памʼяті. Розберемо?' }
  return { mood: 'fire', text: `${open} — це купа досвіду. Потроху, по 10 за раз!` }
}

function unitHref(snapshot: ContentSnapshot, unit: LearningUnit): string {
  const chapter = snapshot.chapters.get(unit.chapterId)
  return chapter ? `${chapterHref(snapshot, chapter)}#u-${unit.id}` : '/'
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function MistakesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const snapshot = await getContent()
  const now = nowMs()
  // Mistakes of the active course first; ?all=1 shows every open mistake.
  const all = params.all === '1'
  const { pool } = await studyScope({ guide: null, chapter: null, all })
  // language course: the session goes by the learner's level ± 1 and topic trouble (src/course/select/adaptive.ts)
  const adaptive = !all ? await adaptiveContext() : null
  const overview = await mistakesOverview(snapshot, now - 7 * 86_400_000, adaptive ? { courseId: adaptive.bundle.course.id, now } : undefined)
  const everyRow = overview.open
  const rows = pool ? everyRow.filter((r) => pool.has(r.unit.id)) : everyRow
  const outside = everyRow.length - rows.length
  const eligible = rows.filter((r) => r.eligibleAt === null || r.eligibleAt <= now)
  const waiting = rows.length - eligible.length

  if (params.start === '1' && eligible.length > 0) {
    const ranked = adaptive && overview.signals ? orderMistakes(adaptive, eligible.map((r) => ({ id: r.unit.id, wrongCount: r.wrongCount, lastWrongAt: r.lastWrongAt })), overview.signals) : null
    const ids = (ranked ?? [...eligible].sort((a, b) => a.lastWrongAt - b.lastWrongAt).map((r) => r.unit.id)).slice(0, 40)
    const items = await renderStudyItems(snapshot, ids, now)
    return (
      <div className="page page-study">
        <StudySession items={items} mode="mistakes" filters={{ source: 'mistakes', all }} restartHref={`/mistakes?start=1${all ? '&all=1' : ''}&r=${now}`} backHref={all ? '/mistakes?all=1' : '/mistakes'} backLabel="До списку помилок" />
      </div>
    )
  }

  const topics = overview.topics.slice(0, 10)
  const resolved = overview.resolved
  const loo = looFor(rows.length, eligible.length)

  return (
    <div className="page mistakes-page">
      <header className="ghead">
        <div className="ghead-text">
          <h1 className="ghead-title">Мої помилки</h1>
          <p className="ghead-lead">
            Кожна неправильна відповідь, картка «Не знав» і задача, що не вийшла, потрапляє сюди. Питання виходить після двох правильних відповідей поспіль із перервою від 20 годин.
          </p>
          {outside > 0 || all ? (
            <nav className="gchips" aria-label="Які помилки">
              <Link className="gchip" href="/mistakes" aria-current={!all ? 'true' : undefined}>
                Цей курс
              </Link>
              <Link className="gchip" href="/mistakes?all=1" aria-current={all ? 'true' : undefined}>
                Усі курси{outside > 0 && !all ? ` · ще ${outside}` : ''}
              </Link>
            </nav>
          ) : null}
        </div>
      </header>

      {rows.length === 0 ? (
        <Card variant="raised" padding="lg" className="mistakes-empty">
          <EmptyState
            mood="cheer"
            title="Помилок немає — чистий аркуш!"
            action={
              <Button href="/quiz" icon={<PiExamFill size={20} />}>
                Перевірити себе
              </Button>
            }
          >
            Коли помилишся в тесті, оціниш картку як «Не знав» або задача не вийде — питання зʼявиться тут, і його можна буде відпрацювати окремою сесією.
          </EmptyState>
        </Card>
      ) : (
        <>
          <section className="mistakes-hero" aria-label="Робота над помилками">
            <LooSays mood={loo.mood} size={112} text={loo.text} className="mistakes-loo" />
            <Card variant="raised" tone="purple" padding="lg" className="mistakes-cta">
              <div className="mistakes-cta-top">
                <span className="mistakes-cta-icon" aria-hidden="true">
                  <PiBrainFill />
                </span>
                <div>
                  <h2 className="mistakes-cta-title">Робота над помилками</h2>
                  <p className="mistakes-cta-sub">
                    <span className="queue-num tabular">{rows.length}</span> {rows.length === 1 ? 'відкрита' : 'відкритих'}
                    {waiting > 0 ? (
                      <Pill size="sm" tone="gray" icon={<PiHourglassFill />}>
                        {waiting} чекають перерви
                      </Pill>
                    ) : null}
                  </p>
                </div>
              </div>
              {eligible.length > 0 ? (
                <Button href={all ? '/mistakes?start=1&all=1' : '/mistakes?start=1'} variant="super" size="lg" block icon={<PiLightningFill size={22} />}>
                  Пройти {count(eligible.length, 'помилку', 'помилки', 'помилок')}
                </Button>
              ) : (
                <Button size="lg" block disabled>
                  Усі відпочивають — повертайся пізніше
                </Button>
              )}
            </Card>
          </section>

          <section aria-labelledby="topics-title" className="gsection">
            <h2 id="topics-title" className="gsection-title">
              Де помиляєшся найчастіше
            </h2>
            <ul className="mistake-topics">
              {topics.map((t) => {
                const chapter = snapshot.chapters.get(t.chapterId)
                if (!chapter) return null
                const guide = snapshot.guideById.get(chapter.guideId)
                const fixed = t.ever > 0 ? (t.ever - t.open) / t.ever : 1
                return (
                  <li key={t.chapterId}>
                    <Card href={chapterHref(snapshot, chapter)} padding="sm" className="mistake-topic">
                      <Ring value={fixed} size={56} stroke={6} tone={t.open === 0 ? 'green' : fixed >= 0.5 ? 'yellow' : 'red'} label={`Виправлено ${t.ever - t.open} з ${t.ever}`}>
                        <span className="mistake-topic-open tabular">{t.open}</span>
                      </Ring>
                      <span className="mistake-topic-text">
                        <span className="mistake-topic-title">{chapter.kind === 'index' ? guide?.title : chapter.title}</span>
                        <span className="mistake-topic-meta">
                          {guide?.title} · <span className="tabular">{t.open}</span> відкрито з <span className="tabular">{t.ever}</span>
                        </span>
                      </span>
                    </Card>
                  </li>
                )
              })}
            </ul>
          </section>

          <section aria-labelledby="open-title" className="gsection">
            <h2 id="open-title" className="gsection-title">
              Відкриті <span className="gsection-count tabular">{rows.length}</span>
            </h2>
            <ul className="mistake-list">
              {rows.map((r) => {
                const kind = KIND[r.unit.kind]
                const resting = r.eligibleAt !== null && r.eligibleAt > now
                return (
                  <li key={r.unit.id} className="mistake-row">
                    <span className="mistake-kind" data-tone={kind.tone} title={kind.label} role="img" aria-label={kind.label}>
                      {kind.icon}
                    </span>
                    <span className="mistake-main">
                      <Link className="mistake-q" href={unitHref(snapshot, r.unit)}>
                        {unitLabel(r.unit)}
                      </Link>
                      <span className="mistake-meta">
                        {snapshot.chapters.get(r.unit.chapterId)?.title}
                        {r.unit.level ? ` · ${LEVEL_LABEL[r.unit.level]}` : ''} · {relative(r.lastWrongAt, now)}
                        {resting ? ` · наступна спроба ${relative(r.eligibleAt, now)}` : ''}
                      </span>
                    </span>
                    <span className="mistake-side">
                      <Pill size="sm" tone="red" className="tabular" title="Скільки разів помилився">
                        ×{r.wrongCount}
                      </Pill>
                      <span className="streak-pips" role="img" aria-label={`${r.correctStreak} з 2 правильних`}>
                        <i data-on={r.correctStreak >= 1 ? '' : undefined} />
                        <i data-on={r.correctStreak >= 2 ? '' : undefined} />
                      </span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>
        </>
      )}

      {resolved.length > 0 ? (
        <section aria-labelledby="resolved-title" className="gsection">
          <h2 id="resolved-title" className="gsection-title">
            Виправлено за тиждень
          </h2>
          <ul className="fixed-badges">
            {resolved.map((u, i) => (
              <li key={u.id}>
                <Link href={unitHref(snapshot, u)} className="fixed-badge" data-tone={FIXED_TONES[i % FIXED_TONES.length]}>
                  <PiSealCheckFill className="fixed-badge-icon" aria-hidden="true" />
                  <span>{unitLabel(u)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
