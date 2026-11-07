'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronsLeft } from 'lucide-react'
import { PiBooksFill, PiCheckBold, PiGearSixFill, PiMagnifyingGlassBold, PiPlusBold } from 'react-icons/pi'
import { useT } from '@/i18n/react'
import { switchCourse } from '@/server/actions/courses'
import { Icon } from '@/ui/icons/Icon'
import type { CSSProperties } from 'react'
import type { IconType } from 'react-icons'
import type { TheoryNode } from '@/server/courses/theory-core'
import { levelInfo } from '@/progress/levels'
import { Avatar } from '@/ui/design/Avatar'
import { Logo } from '@/ui/design/brand/Logo'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { RANKS } from '@/game/ranks'
import { LooCharacter } from '@/ui/game/LooCharacter'
import { OPEN_PALETTE, RANK_KEY } from './constants'
import { NAV } from './nav'
import { useLocale } from '@/i18n/react'
import { badgeLabel, navLabel } from './nav-i18n'
import { FALLBACK_ICON, NAV_ICONS } from './nav-icons'
import { IslandScroll } from './IslandScroll'
import { useCounts, usePractice } from './NavLinks'
import { setMobileSidebar, setSidebarOpen } from './sidebar-state'
import { TheoryTree } from './TheoryTree'
import { SoundToggle, ThemeToggle } from './Toggles'
import type { ThemeSetting } from '@/server/settings'

// The active course: heads the «Практика» block; its theory fills «Теорія».
export interface SidebarActiveCourse {
  id: string
  title: string
  icon: string | null
}

export interface SidebarTheory {
  courseId: string
  nodes: TheoryNode[]
}

export interface SidebarCourse {
  id: string
  title: string
  icon: string | null
  active: boolean
}

export interface SidebarRank {
  title: string
  index: number
}

// Level (from XP) + the warrior rank (src/game/ranks.ts; live through /api/counts) → «Мій Loo».
function LevelRow({ rank }: { rank?: SidebarRank }) {
  const t = useT()
  const { xp } = useFeedback()
  const counts = useCounts()
  const info = levelInfo(xp)
  const pct = Math.round(info.progress * 100)
  const live = RANKS[counts[RANK_KEY] ?? rank?.index ?? 0] ?? RANKS[0]!
  return (
    <Link href="/loo" className="sb-level" onClick={() => setMobileSidebar(false)} aria-label={t('shell.levelAria', { rank: live.title, level: info.level, pct })}>
      <span className="sb-level-badge sb-level-loo" aria-hidden="true">
        <LooCharacter step={live.index} size={34} animated={false} />
        <span className="tabular">{info.level}</span>
      </span>
      <span className="sb-level-body">
        <span className="sb-level-top">
          <span>{live.title}</span>
          <span className="tabular">{pct}%</span>
        </span>
        <ProgressBar value={info.progress} tone="yellow" size="sm" label={t('shell.levelProgress')} />
      </span>
    </Link>
  )
}

export interface SidebarAccount {
  name: string
  avatarUrl: string | null
}

// «Курси»: the learner's library with the active-course switcher (any number of courses).
function CourseRows({ courses }: { courses: SidebarCourse[] }) {
  const t = useT()
  return (
    <ul className="sb-courses">
      {courses.map((c) => (
        <li key={c.id}>
          {c.active ? (
            <Link href="/path" className="sb-course" data-active="" aria-current="true" onClick={() => setMobileSidebar(false)}>
              <span className="sb-course-icon">
                <Icon name={c.icon ?? 'px:book'} size={20} />
              </span>
              <span className="sb-course-title">{c.title}</span>
              <PiCheckBold className="sb-course-check" aria-label={t('shell.activeCourse')} />
            </Link>
          ) : (
            <form action={switchCourse}>
              <input type="hidden" name="course" value={c.id} />
              <input type="hidden" name="next" value="/path" />
              <button type="submit" className="sb-course" onClick={() => setMobileSidebar(false)}>
                <span className="sb-course-icon">
                  <Icon name={c.icon ?? 'px:book'} size={20} />
                </span>
                <span className="sb-course-title">{c.title}</span>
              </button>
            </form>
          )}
        </li>
      ))}
      <li>
        <Link href="/courses" className="sb-course sb-course-add" onClick={() => setMobileSidebar(false)}>
          <span className="sb-course-icon">
            <PiPlusBold size={16} aria-hidden="true" />
          </span>
          <span className="sb-course-title">{t('shell.catalog')}</span>
        </Link>
      </li>
    </ul>
  )
}

function decode(href: string): string {
  try {
    return decodeURIComponent(href)
  } catch {
    return href
  }
}

interface ItemProps {
  href: string
  label: string
  icon: IconType
  color: string
  active: boolean
  count?: number
  tone?: 'red' | 'gray'
  countLabel?: string
}

function NavItemLink({ href, label, icon: Glyph, color, active, count, tone = 'red', countLabel }: ItemProps) {
  return (
    <Link href={href} className="sb-item" data-active={active ? '' : undefined} aria-current={active ? 'page' : undefined} style={{ '--nav-c': color } as CSSProperties} onClick={() => setMobileSidebar(false)}>
      <span className="sb-item-icon">
        <Glyph size={28} aria-hidden="true" />
      </span>
      <span className="sb-item-label">{label}</span>
      {count ? (
        <span className="lu-badge sb-count" data-tone={tone} title={countLabel ? `${count} ${countLabel}` : undefined}>
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Link>
  )
}

// «Практика» of the active course: its own sections from course.yaml (src/ui/shell/course-nav.ts), with badges
// counted in that course only.
function PracticeBlock({ course, path }: { course: SidebarActiveCourse | null; path: string }) {
  const t = useT()
  const locale = useLocale()
  const practice = usePractice()
  const counts = useCounts()
  return (
    <nav className="sb-section sb-practice" aria-label={course ? `${t('shell.practice')}: ${course.title}` : t('shell.practice')}>
      <div className="sb-section-title sb-practice-title">
        {course ? (
          <Link href={`/courses/${course.id}`} className="sb-practice-course" title={course.title} onClick={() => setMobileSidebar(false)}>
            <Icon name={course.icon ?? 'px:book'} size={16} />
            <span>{course.title}</span>
          </Link>
        ) : (
          t('shell.practice')
        )}
      </div>
      <div className="sb-nav sb-nav-practice">
        {practice.map((item) => (
          <NavItemLink
            key={item.id}
            href={item.href}
            label={navLabel(item, locale)}
            icon={item.icon}
            color={item.color}
            active={item.match(path)}
            count={item.badge ? counts[item.badge.key] : undefined}
            tone={item.badge?.tone}
            countLabel={item.badge ? badgeLabel(item.badge, locale) : undefined}
          />
        ))}
      </div>
    </nav>
  )
}

export function Sidebar({
  course = null,
  theory = null,
  courses = [],
  theme,
  account,
  rank,
}: {
  course?: SidebarActiveCourse | null
  theory?: SidebarTheory | null
  courses?: SidebarCourse[]
  theme: ThemeSetting
  account?: SidebarAccount
  rank?: SidebarRank
}) {
  const t = useT()
  const locale = useLocale()
  const path = decode(usePathname())

  return (
    <>
      <div className="sb-scrim" onClick={() => setMobileSidebar(false)} aria-hidden="true" />
      <aside className="sidebar" aria-label={t('shell.nav')}>
        <div className="sb-head">
          <Link href="/" className="sb-brand" aria-label={t('shell.home')} onClick={() => setMobileSidebar(false)}>
            <Logo size={34} />
          </Link>
          <button type="button" className="sb-icon-button sb-collapse" aria-label={t('shell.collapse')} title={t('shell.collapseTitle')} onClick={() => setSidebarOpen(false)}>
            <ChevronsLeft size={18} strokeWidth={2} />
          </button>
        </div>
        <IslandScroll className="sb-scroll">
          <nav className="sb-nav" aria-label={t('shell.sections')}>
            <button type="button" className="sb-item sb-search" onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}>
              <span className="sb-item-icon">
                <PiMagnifyingGlassBold size={22} aria-hidden="true" />
              </span>
              <span className="sb-item-label">{t('shell.search')}</span>
              <kbd className="sb-kbd">⌘K</kbd>
            </button>
            {NAV.map((item) => {
              const { icon, color } = NAV_ICONS[item.href] ?? FALLBACK_ICON
              return <NavItemLink key={item.href} href={item.href} label={navLabel(item, locale)} icon={icon} color={color} active={item.match(path)} />
            })}
          </nav>
          <PracticeBlock course={course} path={path} />
          <div className="sb-section">
            <div className="sb-section-title">{t('shell.courses')}</div>
            <CourseRows courses={courses} />
          </div>
          <div className="sb-section sb-theory">
            <div className="sb-section-title">
              <span>{t('shell.theory')}</span>
              <Link href="/g" className="sb-section-link" title={t('shell.allGuides')} aria-label={t('shell.allGuides')} onClick={() => setMobileSidebar(false)}>
                <PiBooksFill size={16} aria-hidden="true" />
              </Link>
            </div>
            {theory ? (
              <TheoryTree key={theory.courseId} initial={theory.nodes} label={course ? `${t('shell.theory')}: ${course.title}` : t('shell.theory')} />
            ) : (
              <p className="sb-empty">
                <Link href="/courses" className="ui-link" onClick={() => setMobileSidebar(false)}>
                  {t('shell.pickCourse')}
                </Link>
              </p>
            )}
          </div>
        </IslandScroll>
        <div className="sb-foot">
          <LevelRow rank={rank} />
          <div className="sb-foot-tools">
            <SoundToggle />
            <ThemeToggle initial={theme} />
            <Link href="/settings" className="sb-icon-button" aria-label={t('shell.settings')} title={t('shell.settings')} onClick={() => setMobileSidebar(false)}>
              <PiGearSixFill size={20} />
            </Link>
            {account ? (
              <Link href="/account" className="sb-icon-button sb-account" aria-label={t('shell.account')} title={account.name} onClick={() => setMobileSidebar(false)}>
                <Avatar name={account.name} src={account.avatarUrl ?? undefined} size={26} />
              </Link>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  )
}
