import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PiArrowRightBold, PiBookOpenTextFill } from 'react-icons/pi'
import { getProfile, getUser } from '@/server/auth'
import { getContent } from '@/server/content'
import { libraryRows, todaySummary } from '@/server/services/library'
import { availableReelCount } from '@/server/services/feed'
import { getMission, MAIN_TRACK } from '@/server/services/mission'
import { readSettings } from '@/server/settings'
import { Pill } from '@/ui/design/Badge'
import { Card } from '@/ui/design/Card'
import type { Tone } from '@/ui/design/cx'
import type { LooMood } from '@/ui/design/mascot/Loo'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { Ring } from '@/ui/design/Ring'
import { Icon } from '@/ui/icons/Icon'
import { guideIcon, trackIcon } from '@/ui/icons/tracks'
import { MissionCard } from '@/ui/mission/MissionCard'
import { count, minutes, percent, relative } from '@/ui/format'
import { Landing } from '@/ui/marketing/Landing'
import { chapterHref, guideHref } from '@/ui/routes'

// Loo greets by time of day (server clock, like before).
function greeting(now: Date): { title: string; mood: LooMood } {
  const h = now.getHours()
  if (h < 5) return { title: 'Нічна сесія? 🌙', mood: 'sleeping' }
  if (h < 12) return { title: 'Доброго ранку! ☀️', mood: 'wave' }
  if (h < 18) return { title: 'Гарного дня! 🚀', mood: 'happy' }
  return { title: 'Добрий вечір! 🌆', mood: 'wave' }
}

const TILES: Array<{ href: string; icon: string; tone: Tone; title: string; sub: string }> = [
  { href: '/feed', icon: 'pi:PiLightningFill', tone: 'yellow', title: 'Стрічка', sub: 'гортай і вчись' },
  { href: '/roadmap', icon: 'pi:PiMapTrifoldFill', tone: 'green', title: 'Мапа', sub: 'де ти зараз' },
  { href: '/news', icon: 'pi:PiNewspaperFill', tone: 'blue', title: 'Новини', sub: 'що нового в JS' },
  { href: '/profile', icon: 'pi:PiChartBarFill', tone: 'purple', title: 'Прогрес', sub: 'статистика' },
]

// `/` is the landing for signed-out visitors and the app home ("Сьогодні") for signed-in users.
export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!(await getUser())) return <Landing notice={(await searchParams).deleted === '1' ? 'deleted' : undefined} />
  const profile = await getProfile()
  if (profile && !profile.onboarding.completedAt) redirect('/onboarding')
  return <LibraryPage />
}

async function LibraryPage() {
  const snapshot = await getContent()
  const [rows, today, settings] = await Promise.all([libraryRows(snapshot), todaySummary(snapshot), readSettings()])
  const mission = await getMission(snapshot, availableReelCount(snapshot))
  const firstNext = rows.find((r) => r.nextChapter)?.nextChapter ?? null
  const continueTarget = today.continueChapter
    ? { href: today.continueChapter.href, title: today.continueChapter.chapter.title, meta: `${today.continueChapter.guide.title} · ${today.continueChapter.scrollPct}%`, label: 'Продовжити читання' }
    : firstNext
      ? { href: chapterHref(snapshot, firstNext), title: firstNext.title, meta: snapshot.guideById.get(firstNext.guideId)?.title ?? '', label: 'Почати з' }
      : null

  const hello = greeting(new Date())
  const cursor = mission.cursor
  const courseRatio = (cursor.total - cursor.remaining) / Math.max(1, cursor.total)

  return (
    <>
      <div className="page home" data-width="wide">
        <header className="home-hello">
          <LooSays mood={hello.mood} size={92} className="home-hello-loo">
            <h1 className="home-hello-title">{hello.title}</h1>
            <p className="home-hello-lead">
              {today.due > 0 ? `${count(today.due, 'картка чекає', 'картки чекають', 'карток чекають')} на повторення` : 'Повторення на сьогодні закрито'} · {count(snapshot.guides.length, 'посібник', 'посібники', 'посібників')} ·{' '}
              {count(snapshot.units.size, 'вправа', 'вправи', 'вправ')}
            </p>
          </LooSays>
        </header>

        <div className="home-grid">
          <div className="home-main">
            {cursor.lesson ? (
              <Link href={`/learn/${encodeURIComponent(cursor.lesson.id)}`} className="home-continue">
                <Ring value={courseRatio} size={72} stroke={7} tone="yellow" label={`Курс ${MAIN_TRACK.title}: ${Math.round(courseRatio * 100)}%`} className="home-continue-ring">
                  <Icon name={trackIcon(MAIN_TRACK.id, MAIN_TRACK.emoji)} size={34} />
                </Ring>
                <span className="home-continue-text">
                  <span className="home-continue-eyebrow">
                    {MAIN_TRACK.title} · урок {cursor.total - cursor.remaining + 1} з {cursor.total}
                  </span>
                  <span className="home-continue-title">
                    {cursor.lesson.emoji} {cursor.lesson.title}
                  </span>
                  <span className="home-continue-sub">{cursor.chapterTitle}</span>
                </span>
                <span className="home-continue-go">
                  Далі <PiArrowRightBold aria-hidden="true" />
                </span>
              </Link>
            ) : null}

            <MissionCard mission={mission} dailyMinutes={settings.dailyMinutes} streak={today.streak} />
          </div>

          <aside className="home-side">
            <nav className="home-tiles" aria-label="Швидкий доступ">
              {TILES.map((t) => (
                <Card key={t.href} href={t.href} padding="sm" className="home-tile">
                  <span className="home-tile-icon" data-tone={t.tone} aria-hidden="true">
                    <Icon name={t.icon} size={26} />
                  </span>
                  <span className="home-tile-title">{t.title}</span>
                  <span className="home-tile-sub">{t.sub}</span>
                </Card>
              ))}
            </nav>

            {continueTarget ? (
              <Card href={continueTarget.href} padding="sm" className="home-reading">
                <span className="home-reading-icon" aria-hidden="true">
                  <PiBookOpenTextFill />
                </span>
                <span className="home-reading-text">
                  <span className="home-reading-label">{continueTarget.label}</span>
                  <span className="home-reading-title">{continueTarget.title}</span>
                  <span className="home-reading-meta">{continueTarget.meta}</span>
                </span>
              </Card>
            ) : null}
          </aside>
        </div>

        <h2 className="gsection-title home-guides-title">
          Посібники <span className="gsection-count tabular">{rows.length}</span>
        </h2>
        <ul className="home-guides">
          {rows.map((row) => {
            const pct = row.chapters > 0 ? row.studied / row.chapters : 0
            return (
              <li key={row.guide.id}>
                <Card href={guideHref(row.guide.id)} padding="sm" className="guide-card">
                  <span className="guide-card-head">
                    <span className="guide-card-icon" aria-hidden="true">
                      <Icon name={guideIcon(row.guide.id)} size={26} />
                    </span>
                    <span className="guide-card-text">
                      <span className="guide-card-title">{row.guide.title}</span>
                      <span className="guide-card-meta tabular">
                        {Math.round(pct * 100)}% · {count(row.chapters, 'розділ', 'розділи', 'розділів')} · ~{minutes(row.guide.estimatedMinutes)}
                        {row.answered > 0 ? ` · точність ${percent(row.accuracy)}` : ''}
                        {row.lastOpenedAt ? ` · ${relative(row.lastOpenedAt)}` : ''}
                      </span>
                    </span>
                  </span>
                  <ProgressBar value={pct} size="sm" tone={pct >= 1 ? 'yellow' : 'green'} label={`Прочитано ${Math.round(pct * 100)}%`} />
                  {row.units.flashcard || row.units.quiz || row.units.task || row.due > 0 ? (
                    <span className="guide-card-pills">
                      {row.units.flashcard ? (
                        <Pill size="sm" tone="purple">
                          {count(row.units.flashcard, 'картка', 'картки', 'карток')}
                        </Pill>
                      ) : null}
                      {row.units.quiz ? (
                        <Pill size="sm" tone="blue">
                          {count(row.units.quiz, 'тест', 'тести', 'тестів')}
                        </Pill>
                      ) : null}
                      {row.units.task ? (
                        <Pill size="sm" tone="orange">
                          {count(row.units.task, 'задача', 'задачі', 'задач')}
                        </Pill>
                      ) : null}
                      {row.due > 0 ? (
                        <Pill size="sm" tone="red" solid>
                          {row.due} до повторення
                        </Pill>
                      ) : null}
                    </span>
                  ) : null}
                </Card>
              </li>
            )
          })}
        </ul>
        {rows.length === 0 && !snapshot.error ? (
          <p className="empty-note">У папці Guides/ поки немає посібників. Створіть підпапку з .md-файлами — вона з&apos;явиться тут без перезапуску.</p>
        ) : null}
      </div>
    </>
  )
}
