'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { BookOpen, Check, ChevronRight, ChevronsLeft, FileText } from 'lucide-react'
import { PiCheckBold, PiGearSixFill, PiMagnifyingGlassBold, PiPlusBold } from 'react-icons/pi'
import { t } from '@/i18n'
import { switchCourse } from '@/server/actions/courses'
import { Icon } from '@/ui/icons/Icon'
import type { CSSProperties } from 'react'
import type { TreeViewNode } from '@/server/services/library'
import { levelInfo } from '@/progress/levels'
import { Avatar } from '@/ui/design/Avatar'
import { Logo } from '@/ui/design/brand/Logo'
import { GameIcon } from '@/ui/design/GameIcon'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { RANKS } from '@/game/ranks'
import { OPEN_PALETTE, RANK_KEY } from './constants'
import { NAV } from './nav'
import { FALLBACK_ICON, NAV_ICONS } from './nav-icons'
import { PROGRESS_EVENT, useCounts } from './NavLinks'
import { setMobileSidebar, setSidebarOpen } from './sidebar-state'
import { SoundToggle, ThemeToggle } from './Toggles'
import type { ThemeSetting } from '@/server/settings'

export interface SidebarGuide {
  id: string
  title: string
  href: string
}

export interface SidebarCourse {
  id: string
  title: string
  icon: string | null
  active: boolean
}

const OPEN_KEY = 'sidebar-open-nodes'
const OPEN_EVENT = 'sidebar-open-nodes'

function subscribeOpen(cb: () => void) {
  window.addEventListener(OPEN_EVENT, cb)
  return () => window.removeEventListener(OPEN_EVENT, cb)
}

function readOpen(): string {
  try {
    return window.localStorage.getItem(OPEN_KEY) ?? '[]'
  } catch {
    return '[]'
  }
}

function useOpenNodes(): [Set<string>, (id: string, open?: boolean) => void] {
  const raw = useSyncExternalStore(subscribeOpen, readOpen, () => '[]')
  let parsed: string[] = []
  try {
    parsed = JSON.parse(raw) as string[]
  } catch {
    parsed = []
  }
  const set = new Set(parsed)
  const toggle = useCallback((id: string, open?: boolean) => {
    const current = new Set(JSON.parse(readOpen()) as string[])
    const next = open ?? !current.has(id)
    if (next) current.add(id)
    else current.delete(id)
    try {
      window.localStorage.setItem(OPEN_KEY, JSON.stringify([...current]))
    } catch {}
    window.dispatchEvent(new Event(OPEN_EVENT))
  }, [])
  return [set, toggle]
}

const trees = new globalThis.Map<string, TreeViewNode[]>()

function useTree(guideId: string, enabled: boolean): TreeViewNode[] | null {
  const [nodes, setNodes] = useState<TreeViewNode[] | null>(trees.get(guideId) ?? null)
  useEffect(() => {
    if (!enabled) return
    let alive = true
    const load = () =>
      fetch(`/api/tree/${encodeURIComponent(guideId)}`, { cache: 'no-store' })
        .then((r) => r.json() as Promise<{ nodes: TreeViewNode[] }>)
        .then((d) => {
          trees.set(guideId, d.nodes)
          if (alive) setNodes(d.nodes)
        })
        .catch(() => {})
    load()
    window.addEventListener(PROGRESS_EVENT, load)
    return () => {
      alive = false
      window.removeEventListener(PROGRESS_EVENT, load)
    }
  }, [guideId, enabled])
  return nodes
}

function decode(href: string): string {
  try {
    return decodeURIComponent(href)
  } catch {
    return href
  }
}

function containsPath(nodes: TreeViewNode[], path: string): string[] {
  for (const n of nodes) {
    if (n.href && decode(n.href) === path) return [n.id]
    const inner = containsPath(n.children, path)
    if (inner.length > 0) return [n.id, ...inner]
  }
  return []
}

function TreeRows({ nodes, depth, path, open, toggle }: { nodes: TreeViewNode[]; depth: number; path: string; open: Set<string>; toggle: (id: string, open?: boolean) => void }) {
  return (
    <>
      {nodes.map((n) => {
        const expandable = n.kind === 'group' && n.children.length > 0
        const isOpen = expandable && open.has(n.id)
        const active = n.href !== null && decode(n.href) === path
        return (
          <div key={n.id} role="treeitem" aria-expanded={expandable ? isOpen : undefined} aria-selected={active}>
            <div className="sb-row" data-active={active ? '' : undefined} style={{ paddingLeft: 8 + depth * 14 }}>
              <button
                type="button"
                className="sb-toggle"
                data-expandable={expandable ? '' : undefined}
                aria-label={expandable ? `${isOpen ? 'Згорнути' : 'Розгорнути'} ${n.title}` : undefined}
                tabIndex={expandable ? 0 : -1}
                onClick={() => expandable && toggle(n.id)}
              >
                <FileText className="sb-page-icon" size={16} strokeWidth={1.6} aria-hidden="true" />
                {expandable ? <ChevronRight className="sb-chevron" data-open={isOpen ? '' : undefined} size={16} strokeWidth={1.8} aria-hidden="true" /> : null}
              </button>
              {n.href ? (
                <Link href={n.href} className="sb-label" onClick={() => setMobileSidebar(false)}>
                  {n.title}
                </Link>
              ) : (
                <button type="button" className="sb-label" onClick={() => toggle(n.id)}>
                  {n.title}
                </button>
              )}
              {n.status === 'studied' ? <Check className="sb-done" size={14} strokeWidth={2} aria-label="вивчено" /> : null}
            </div>
            {isOpen ? (
              <div role="group">
                <TreeRows nodes={n.children} depth={depth + 1} path={path} open={open} toggle={toggle} />
              </div>
            ) : null}
          </div>
        )
      })}
    </>
  )
}

function GuideRow({ guide, path, open, toggle }: { guide: SidebarGuide; path: string; open: Set<string>; toggle: (id: string, open?: boolean) => void }) {
  const key = `guide:${guide.id}`
  const inside = path === decode(guide.href) || path.startsWith(`${decode(guide.href)}/`)
  const isOpen = open.has(key)
  const nodes = useTree(guide.id, isOpen || inside)
  const revealed = useRef<string | null>(null)

  useEffect(() => {
    if (!inside || !nodes || revealed.current === path) return
    revealed.current = path
    const trail = containsPath(nodes, path).slice(0, -1)
    toggle(key, true)
    for (const id of trail) toggle(id, true)
  }, [inside, nodes, path, key, toggle])

  const shown = isOpen
  return (
    <div role="treeitem" aria-expanded={shown} aria-selected={path === decode(guide.href)}>
      <div className="sb-row" data-active={path === decode(guide.href) ? '' : undefined}>
        <button type="button" className="sb-toggle" data-expandable="" aria-label={`${shown ? 'Згорнути' : 'Розгорнути'} ${guide.title}`} onClick={() => toggle(key, !shown)}>
          <BookOpen className="sb-page-icon" size={16} strokeWidth={1.6} aria-hidden="true" />
          <ChevronRight className="sb-chevron" data-open={shown ? '' : undefined} size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <Link href={guide.href} className="sb-label" onClick={() => setMobileSidebar(false)}>
          {guide.title}
        </Link>
      </div>
      {shown ? (
        <div role="group">
          {nodes ? (
            nodes.length > 0 ? (
              <TreeRows nodes={nodes} depth={1} path={path} open={open} toggle={toggle} />
            ) : (
              <p className="sb-empty">Немає сторінок</p>
            )
          ) : (
            <p className="sb-empty">Завантаження…</p>
          )}
        </div>
      ) : null}
    </div>
  )
}

export interface SidebarRank {
  title: string
  emoji: string
  index: number
}

// Level (from XP) + the game rank (src/game/ranks.ts; live through /api/counts).
function LevelRow({ rank }: { rank?: SidebarRank }) {
  const { xp } = useFeedback()
  const counts = useCounts()
  const info = levelInfo(xp)
  const pct = Math.round(info.progress * 100)
  const live = RANKS[counts[RANK_KEY] ?? rank?.index ?? 0] ?? RANKS[0]!
  return (
    <Link href="/profile" className="sb-level" onClick={() => setMobileSidebar(false)} aria-label={`Рівень ${info.level}, ранг ${live.title}, ${pct}% до наступного рівня`}>
      <span className="sb-level-badge" aria-hidden="true">
        <GameIcon name="bolt" size={22} />
        <span className="tabular">{info.level}</span>
      </span>
      <span className="sb-level-body">
        <span className="sb-level-top">
          <span>
            <span aria-hidden="true">{live.emoji}</span> {live.title}
          </span>
          <span className="tabular">{pct}%</span>
        </span>
        <ProgressBar value={info.progress} tone="yellow" size="sm" label="Прогрес рівня" />
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
  return (
    <ul className="sb-courses">
      {courses.map((c) => (
        <li key={c.id}>
          {c.active ? (
            <Link href="/path" className="sb-course" data-active="" aria-current="true" onClick={() => setMobileSidebar(false)}>
              <span className="sb-course-icon">
                <Icon name={c.icon ?? '📘'} size={20} />
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
                  <Icon name={c.icon ?? '📘'} size={20} />
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

export function Sidebar({ guides, courses = [], theme, account, rank }: { guides: SidebarGuide[]; courses?: SidebarCourse[]; theme: ThemeSetting; account?: SidebarAccount; rank?: SidebarRank }) {
  const raw = usePathname()
  const path = decode(raw)
  const counts = useCounts()
  const [open, toggle] = useOpenNodes()

  return (
    <>
      <div className="sb-scrim" onClick={() => setMobileSidebar(false)} aria-hidden="true" />
      <aside className="sidebar" aria-label="Навігація">
        <div className="sb-head">
          <Link href="/" className="sb-brand" aria-label="Levelup — на головну" onClick={() => setMobileSidebar(false)}>
            <Logo size={34} />
          </Link>
          <button type="button" className="sb-icon-button sb-collapse" aria-label="Сховати бічну панель" title="Сховати бічну панель (⌘\)" onClick={() => setSidebarOpen(false)}>
            <ChevronsLeft size={18} strokeWidth={2} />
          </button>
        </div>
        <div className="sb-scroll">
        <nav className="sb-nav" aria-label="Розділи">
          <button type="button" className="sb-item sb-search" onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}>
            <span className="sb-item-icon">
              <PiMagnifyingGlassBold size={22} aria-hidden="true" />
            </span>
            <span className="sb-item-label">Пошук</span>
            <kbd className="sb-kbd">⌘K</kbd>
          </button>
          {NAV.map((item) => {
            const { icon: Icon, color } = NAV_ICONS[item.href] ?? FALLBACK_ICON
            const count = counts[item.href]
            const active = item.match(path)
            return (
              <Link key={item.href} href={item.href} className="sb-item" data-active={active ? '' : undefined} aria-current={active ? 'page' : undefined} style={{ '--nav-c': color } as CSSProperties} onClick={() => setMobileSidebar(false)}>
                <span className="sb-item-icon">
                  <Icon size={28} aria-hidden="true" />
                </span>
                <span className="sb-item-label">{item.label}</span>
                {count ? <span className="lu-badge sb-count" data-tone="red">{count > 99 ? '99+' : count}</span> : null}
              </Link>
            )
          })}
        </nav>
        <div className="sb-section">
          <div className="sb-section-title">{t('shell.courses')}</div>
          <CourseRows courses={courses} />
        </div>
        <div className="sb-section">
          <div className="sb-section-title">{t('shell.theory')}</div>
          <div role="tree" aria-label={t('shell.theory')}>
            {guides.map((g) => (
              <GuideRow key={g.id} guide={g} path={path} open={open} toggle={toggle} />
            ))}
          </div>
        </div>
        </div>
        <div className="sb-foot">
          <LevelRow rank={rank} />
          <div className="sb-foot-tools">
            <SoundToggle />
            <ThemeToggle initial={theme} />
            <Link href="/settings" className="sb-icon-button" aria-label="Налаштування" title="Налаштування" onClick={() => setMobileSidebar(false)}>
              <PiGearSixFill size={20} />
            </Link>
            {account ? (
              <Link href="/account" className="sb-icon-button sb-account" aria-label="Профіль і акаунт" title={account.name} onClick={() => setMobileSidebar(false)}>
                <Avatar name={account.name} src={account.avatarUrl ?? undefined} size={26} />
              </Link>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  )
}
