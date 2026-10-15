import Link from 'next/link'
import { BookOpen, CalendarClock, FileText, Hash, Layers, Percent } from 'lucide-react'
import { getContent } from '@/server/content'
import { libraryRows, todaySummary } from '@/server/services/library'
import { availableReelCount } from '@/server/services/feed'
import { getMission, MAIN_TRACK } from '@/server/services/mission'
import { readSettings } from '@/server/settings'
import { MissionCard } from '@/ui/mission/MissionCard'
import { count, minutes, percent, relative } from '@/ui/format'
import { chapterHref, guideHref } from '@/ui/routes'

function greeting(now: Date): string {
  const h = now.getHours()
  if (h < 5) return 'Нічна сесія 🌙'
  if (h < 12) return 'Доброго ранку ☀️'
  if (h < 18) return 'Гарного дня 🚀'
  return 'Добрий вечір 🌆'
}

const TILES = [
  { href: '/feed', emoji: '📱', title: 'Стрічка', sub: 'гортай і вчись' },
  { href: '/roadmap', emoji: '🗺️', title: 'Шлях', sub: 'де ти зараз' },
  { href: '/news', emoji: '📰', title: 'Новини', sub: 'що нового в JS' },
  { href: '/profile', emoji: '📊', title: 'Прогрес', sub: 'статистика' },
]

export default async function LibraryPage() {
  const snapshot = await getContent()
  const [rows, today, settings] = await Promise.all([libraryRows(snapshot), todaySummary(snapshot), readSettings()])
  const mission = await getMission(snapshot, availableReelCount(snapshot))
  const firstNext = rows.find((r) => r.nextChapter)?.nextChapter ?? null
  const continueTarget = today.continueChapter
    ? { href: today.continueChapter.href, title: today.continueChapter.chapter.title, meta: `${today.continueChapter.guide.title} · ${today.continueChapter.scrollPct}%`, label: 'Продовжити читання' }
    : firstNext
      ? { href: chapterHref(snapshot, firstNext), title: firstNext.title, meta: snapshot.guideById.get(firstNext.guideId)?.title ?? '', label: 'Почати з' }
      : null

  return (
    <>
      <div className="page" data-width="wide">
        <h1 className="page-title">{greeting(new Date())}</h1>
        <p className="page-lead">
          {count(snapshot.guides.length, 'посібник', 'посібники', 'посібників')} · {count(snapshot.units.size, 'навчальна одиниця', 'навчальні одиниці', 'навчальних одиниць')} ·{' '}
          {today.due > 0 ? `${count(today.due, 'картка чекає', 'картки чекають', 'карток чекають')} на повторення` : 'повторення на сьогодні закрито'}
        </p>

        {mission.cursor.lesson ? (
          <Link href={`/learn/${encodeURIComponent(mission.cursor.lesson.id)}`} className="course-hero">
            <span className="course-hero-emoji" aria-hidden="true">
              {MAIN_TRACK.emoji}
            </span>
            <span className="course-hero-text">
              <span className="eyebrow">
                {MAIN_TRACK.title} · урок {mission.cursor.total - mission.cursor.remaining + 1} з {mission.cursor.total}
              </span>
              <span className="course-hero-title">
                {mission.cursor.lesson.emoji} {mission.cursor.lesson.title}
              </span>
              <span className="course-hero-sub">{mission.cursor.chapterTitle}</span>
              <span className="course-hero-bar" aria-hidden="true">
                <span style={{ transform: `scaleX(${(mission.cursor.total - mission.cursor.remaining) / Math.max(1, mission.cursor.total)})` }} />
              </span>
            </span>
            <span className="course-hero-go">Далі</span>
          </Link>
        ) : null}

        <MissionCard mission={mission} dailyMinutes={settings.dailyMinutes} streak={today.streak} />

        <nav className="home-tiles" aria-label="Швидкий доступ">
          {TILES.map((t) => (
            <Link key={t.href} href={t.href} className="home-tile">
              <span className="home-tile-emoji" aria-hidden="true">
                {t.emoji}
              </span>
              <span className="home-tile-title">{t.title}</span>
              <span className="home-tile-sub">{t.sub}</span>
            </Link>
          ))}
        </nav>

        {continueTarget ? (
          <Link href={continueTarget.href} className="page-link continue-link">
            <FileText size={18} strokeWidth={1.6} aria-hidden="true" />
            <span className="page-link-title">{continueTarget.title}</span>
            <span className="page-link-meta">
              {continueTarget.label} · {continueTarget.meta}
            </span>
          </Link>
        ) : null}

        <h2 className="db-title">Посібники</h2>
        <div className="db-scroll">
          <table className="db">
            <thead>
              <tr>
                <th scope="col" className="db-name">
                  <span className="db-th">
                    <BookOpen size={14} strokeWidth={1.8} aria-hidden="true" />
                    Назва
                  </span>
                </th>
                <th scope="col">
                  <span className="db-th">
                    <Hash size={14} strokeWidth={1.8} aria-hidden="true" />
                    Розділи
                  </span>
                </th>
                <th scope="col" className="db-progress">
                  <span className="db-th">
                    <Percent size={14} strokeWidth={1.8} aria-hidden="true" />
                    Прочитано
                  </span>
                </th>
                <th scope="col">
                  <span className="db-th">
                    <Layers size={14} strokeWidth={1.8} aria-hidden="true" />
                    Практика
                  </span>
                </th>
                <th scope="col">
                  <span className="db-th">
                    <Percent size={14} strokeWidth={1.8} aria-hidden="true" />
                    Точність
                  </span>
                </th>
                <th scope="col">
                  <span className="db-th">
                    <CalendarClock size={14} strokeWidth={1.8} aria-hidden="true" />
                    Відкривали
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const pct = row.chapters > 0 ? row.studied / row.chapters : 0
                return (
                  <tr key={row.guide.id}>
                    <td className="db-name">
                      <Link href={guideHref(row.guide.id)} className="db-title-link">
                        <FileText size={16} strokeWidth={1.6} aria-hidden="true" />
                        <span>{row.guide.title}</span>
                      </Link>
                      <span className="db-open" aria-hidden="true">
                        Відкрити
                      </span>
                    </td>
                    <td className="tabular">
                      {row.chapters}
                      <span className="db-sub"> · ~{minutes(row.guide.estimatedMinutes)}</span>
                    </td>
                    <td className="db-progress">
                      <span className="progress-inline">
                        <span className="bar" aria-hidden="true">
                          <span style={{ transform: `scaleX(${pct})` }} />
                        </span>
                        <span className="tabular">{Math.round(pct * 100)}%</span>
                      </span>
                    </td>
                    <td>
                      <span className="prop-tags">
                        {row.units.flashcard ? <span className="tag-pill" data-color="blue">{count(row.units.flashcard, 'картка', 'картки', 'карток')}</span> : null}
                        {row.units.quiz ? <span className="tag-pill" data-color="purple">{count(row.units.quiz, 'тест', 'тести', 'тестів')}</span> : null}
                        {row.units.task ? <span className="tag-pill" data-color="orange">{count(row.units.task, 'задача', 'задачі', 'задач')}</span> : null}
                        {row.due > 0 ? <span className="tag-pill" data-color="red">{row.due} до повторення</span> : null}
                      </span>
                    </td>
                    <td className="tabular">{row.answered > 0 ? percent(row.accuracy) : <span className="db-sub">—</span>}</td>
                    <td className="db-sub">{relative(row.lastOpenedAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="db-count">
          Кількість <span className="tabular">{rows.length}</span>
        </p>
        {rows.length === 0 && !snapshot.error ? (
          <p className="empty-note">У папці Guides/ поки немає посібників. Створіть підпапку з .md-файлами — вона з&apos;явиться тут без перезапуску.</p>
        ) : null}
      </div>
    </>
  )
}
