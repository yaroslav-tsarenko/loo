import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PiArrowRightBold, PiBookOpenTextFill, PiPlusBold } from 'react-icons/pi'
import { LEVEL_LABEL } from '@/course'
import { t } from '@/i18n'
import { getProfile, getUser } from '@/server/auth'
import { availableReelCount } from '@/server/services/feed'
import { homeData } from '@/server/services/home'
import { readSettings } from '@/server/settings'
import { shellData } from '@/server/shell'
import { Pill } from '@/ui/design/Badge'
import { Card } from '@/ui/design/Card'
import type { Tone } from '@/ui/design/cx'
import type { LooMood } from '@/ui/design/mascot/Loo'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { PixelIcon, type PixelIconName } from '@/ui/design/PixelIcon'
import { Ring } from '@/ui/design/Ring'
import { Icon } from '@/ui/icons/Icon'
import { MissionCard } from '@/ui/mission/MissionCard'
import { CoachCard } from '@/ui/stats/CoachCard'
import { count, relative } from '@/ui/format'
import { Landing } from '@/ui/marketing/Landing'

// Loo greets by time of day (server clock, like before).
function greeting(now: Date): { title: string; mood: LooMood; icon: PixelIconName } {
  const h = now.getHours()
  if (h < 5) return { title: 'Нічна сесія?', mood: 'sleeping', icon: 'moon' }
  if (h < 12) return { title: 'Доброго ранку!', mood: 'wave', icon: 'sun' }
  if (h < 18) return { title: 'Гарного дня!', mood: 'happy', icon: 'rocket' }
  return { title: 'Добрий вечір!', mood: 'wave', icon: 'moon' }
}

const TILES: Array<{ href: string; icon: string; tone: Tone; title: string; sub: string }> = [
  { href: '/feed', icon: 'pi:PiLightningFill', tone: 'yellow', title: 'Стрічка', sub: 'гортай і вчись' },
  { href: '/path', icon: 'pi:PiMapTrifoldFill', tone: 'green', title: 'Карта', sub: 'де ти зараз' },
  { href: '/news', icon: 'pi:PiNewspaperFill', tone: 'blue', title: 'Новини', sub: 'що нового в Loo' },
  { href: '/profile', icon: 'pi:PiChartBarFill', tone: 'purple', title: 'Прогрес', sub: 'статистика' },
]

// `/` is the landing for signed-out visitors and the app home ("Сьогодні") for signed-in users.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!(await getUser())) return <Landing notice={(await searchParams).deleted === '1' ? 'deleted' : undefined} />
  const profile = await getProfile()
  if (profile?.bannedAt) redirect('/banned')
  if (profile && !profile.onboarding.completedAt) redirect('/onboarding')
  return <LibraryPage />
}

async function LibraryPage() {
  // The shell's data (library, settled streak) is already read with the layout; the page's own reads are ONE
  // transaction (src/server/services/home.ts).
  const [shell, settings] = await Promise.all([shellData(), readSettings()])
  if (!shell) redirect('/login')
  const { snapshot, library, active } = shell
  const { today, mission, coach } = await homeData(snapshot, { settings, active, reels: await availableReelCount(snapshot), streak: shell.game.streak.current })
  const continueTarget = today.continueChapter
    ? { href: today.continueChapter.href, title: today.continueChapter.chapter.title, meta: `${today.continueChapter.guide.title} · ${today.continueChapter.scrollPct}%`, label: 'Продовжити читання' }
    : null

  const hello = greeting(new Date())
  const cursor = mission.cursor
  const courseRatio = (cursor.total - cursor.remaining) / Math.max(1, cursor.total)

  return (
    <>
      <div className="page home" data-width="wide">
        <header className="home-hello">
          <LooSays mood={hello.mood} size={92} className="home-hello-loo">
            <h1 className="home-hello-title">
              {hello.title} <PixelIcon name={hello.icon} size={28} className="home-hello-icon" />
            </h1>
            <p className="home-hello-lead">
              {today.due > 0 ? `${count(today.due, 'картка чекає', 'картки чекають', 'карток чекають')} на повторення` : 'Повторення на сьогодні закрито'} ·{' '}
              {count(library.length, 'курс', 'курси', 'курсів')} у бібліотеці
            </p>
          </LooSays>
        </header>

        <div className="home-grid">
          <div className="home-main">
            {cursor.course && cursor.href ? (
              <Link href={cursor.href} className="home-continue">
                <Ring value={courseRatio} size={72} stroke={7} tone="yellow" label={`Курс ${cursor.course.title}: ${Math.round(courseRatio * 100)}%`} className="home-continue-ring">
                  <Icon name={cursor.course.icon ?? 'px:book'} size={34} />
                </Ring>
                <span className="home-continue-text">
                  <span className="home-continue-eyebrow">
                    {cursor.course.title} · урок {Math.min(cursor.total, cursor.total - cursor.remaining + 1)} з {cursor.total}
                  </span>
                  <span className="home-continue-title">
                    {cursor.icon ? <Icon name={cursor.icon} size={22} /> : null} {cursor.title}
                  </span>
                  <span className="home-continue-sub">{cursor.topicTitle}</span>
                </span>
                <span className="home-continue-go">
                  Далі <PiArrowRightBold aria-hidden="true" />
                </span>
              </Link>
            ) : !cursor.course ? (
              <Link href="/courses" className="home-continue">
                <span className="home-continue-text">
                  <span className="home-continue-eyebrow">Бібліотека порожня</span>
                  <span className="home-continue-title">
                    <Icon name="px:books" size={22} /> Обери свій перший курс
                  </span>
                  <span className="home-continue-sub">Карта, місії й стрічка підлаштуються під нього</span>
                </span>
                <span className="home-continue-go">
                  Курси <PiArrowRightBold aria-hidden="true" />
                </span>
              </Link>
            ) : null}

            <CoachCard coach={coach} variant="compact" />

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
          {t('courses.library')} <span className="gsection-count tabular">{library.length}</span>
        </h2>
        <ul className="home-guides home-courses">
          {library.map((c) => (
            <li key={c.id}>
              <Card href={c.enrollment.active ? '/path' : `/courses/${c.id}`} padding="sm" className="guide-card" tone={c.enrollment.active ? 'violet' : undefined}>
                <span className="guide-card-head">
                  <span className="guide-card-icon" aria-hidden="true">
                    <Icon name={c.icon ?? 'px:book'} size={26} />
                  </span>
                  <span className="guide-card-text">
                    <span className="guide-card-title">{c.title}</span>
                    <span className="guide-card-meta">{c.subtitle}</span>
                  </span>
                </span>
                <span className="guide-card-pills">
                  {c.enrollment.active ? (
                    <Pill size="sm" tone="violet" solid>
                      {t('courses.active')}
                    </Pill>
                  ) : (
                    <Pill size="sm">{t('courses.enrolled')}</Pill>
                  )}
                  <Pill size="sm" tone="purple">
                    {LEVEL_LABEL[c.enrollment.level]}
                  </Pill>
                  {c.enrollment.lastOpenedAt ? <Pill size="sm">{relative(c.enrollment.lastOpenedAt)}</Pill> : null}
                </span>
              </Card>
            </li>
          ))}
          <li>
            <Card href="/courses" padding="sm" className="guide-card home-course-add">
              <span className="guide-card-head">
                <span className="guide-card-icon" aria-hidden="true">
                  <PiPlusBold />
                </span>
                <span className="guide-card-text">
                  <span className="guide-card-title">{t('shell.catalog')}</span>
                  <span className="guide-card-meta">{t('courses.lead')}</span>
                </span>
              </span>
            </Card>
          </li>
        </ul>
      </div>
    </>
  )
}
