import type { IconType } from 'react-icons'
import {
  PiBandaidsFill,
  PiCardsThreeFill,
  PiCodeBlockFill,
  PiHeadphonesFill,
  PiListChecksFill,
  PiMapTrifoldFill,
  PiMicrophoneFill,
  PiPathFill,
  PiTextAaFill,
  PiTranslateFill,
} from 'react-icons/pi'
import { DEFAULT_PRACTICE, resolvePractice, type PracticeSectionId } from '@/course/practice'
import { DUE_KEY, LISTEN_KEY, MISTAKES_KEY, PRON_KEY, TASKS_KEY, WORDS_KEY } from './constants'
import type { NavItem } from './nav'

// UI registry of practice sections (src/course/schema/practice.ts): what the sidebar «Практика» block, the mobile
// tabs and the top bar show for each section id a course declares in course.yaml `practice:`. A new section is one
// entry here (the `satisfies` below makes a missing one a type error) — the shell has no per-course code paths.

export interface PracticeBadge {
  // key in the /api/counts payload (src/server/services/counts-core.ts), counted in the active course only
  key: typeof DUE_KEY | typeof MISTAKES_KEY | typeof TASKS_KEY | typeof WORDS_KEY | typeof LISTEN_KEY | typeof PRON_KEY
  tone: 'red' | 'gray'
  // accessible meaning of the number
  label: string
}

export interface PracticeNavItem extends NavItem {
  id: PracticeSectionId
  icon: IconType
  // icon colour, always on (like the global items in nav-icons.ts)
  color: string
  badge: PracticeBadge | null
  // false: the page doesn't exist yet. A course may already declare the section; the shell skips it until it ships.
  ready: boolean
}

const DUE: PracticeBadge = { key: DUE_KEY, tone: 'red', label: 'до повторення' }
const MISTAKES: PracticeBadge = { key: MISTAKES_KEY, tone: 'red', label: 'відкритих помилок' }
const TASKS: PracticeBadge = { key: TASKS_KEY, tone: 'gray', label: 'задач у роботі' }
const WORDS: PracticeBadge = { key: WORDS_KEY, tone: 'red', label: 'слів до повторення' }
const LISTEN: PracticeBadge = { key: LISTEN_KEY, tone: 'red', label: 'помилок на слух' }
const PRON: PracticeBadge = { key: PRON_KEY, tone: 'red', label: 'помилок у парах звуків' }

const at = (...prefixes: string[]) => (path: string) => prefixes.some((p) => path === p || path.startsWith(`${p}/`))

export const PRACTICE_NAV = {
  path: { href: '/path', label: 'Шлях', short: 'Шлях', match: at('/path', '/test'), icon: PiPathFill, color: 'var(--lu-green)', badge: null, ready: true },
  cards: { href: '/review', label: 'Картки', short: 'Картки', match: at('/review'), icon: PiCardsThreeFill, color: 'var(--lu-blue)', badge: DUE, ready: true },
  tests: { href: '/quiz', label: 'Тести', short: 'Тести', match: at('/quiz'), icon: PiListChecksFill, color: 'var(--lu-purple)', badge: null, ready: true },
  mistakes: { href: '/mistakes', label: 'Мої помилки', short: 'Помилки', match: at('/mistakes'), icon: PiBandaidsFill, color: 'var(--lu-red)', badge: MISTAKES, ready: true },
  tasks: { href: '/tasks', label: 'Задачі', short: 'Задачі', match: at('/tasks'), icon: PiCodeBlockFill, color: 'var(--lu-yellow-lip)', badge: TASKS, ready: true },
  roadmap: { href: '/roadmap', label: 'Мапа інженера', short: 'Мапа', match: at('/roadmap'), icon: PiMapTrifoldFill, color: 'var(--lu-green-lip)', badge: null, ready: true },
  // Language courses (docs/LANGUAGE_COURSE.md): [!word] SRS with audio, [!listen], [!speak] + [!pair], grammar tests.
  words: { href: '/words', label: 'Слова', short: 'Слова', match: at('/words'), icon: PiTranslateFill, color: 'var(--lu-blue)', badge: WORDS, ready: true },
  listening: { href: '/listening', label: 'Аудіювання', short: 'Слухати', match: at('/listening'), icon: PiHeadphonesFill, color: 'var(--lu-pink)', badge: LISTEN, ready: true },
  pronunciation: { href: '/pronunciation', label: 'Вимова', short: 'Вимова', match: at('/pronunciation'), icon: PiMicrophoneFill, color: 'var(--lu-orange)', badge: PRON, ready: true },
  grammar: { href: '/grammar', label: 'Граматика й тести', short: 'Граматика', match: at('/grammar'), icon: PiTextAaFill, color: 'var(--lu-purple)', badge: null, ready: true },
} satisfies Record<PracticeSectionId, Omit<PracticeNavItem, 'id'>>

// The sections a course shows, in its order: unknown and not-yet-ready ones dropped, one item per page.
export function practiceNav(ids: readonly PracticeSectionId[]): PracticeNavItem[] {
  const seen = new Set<string>()
  const out: PracticeNavItem[] = []
  for (const id of ids) {
    const def = PRACTICE_NAV[id]
    if (!def?.ready || seen.has(def.href)) continue
    seen.add(def.href)
    out.push({ id, ...def })
  }
  return out
}

// Without an active course (new learner, empty library): the subject-neutral set.
export const FALLBACK_PRACTICE: readonly PracticeSectionId[] = resolvePractice('general', DEFAULT_PRACTICE.general)

// Every section once, for labels of pages outside the active course (top bar).
export const ALL_PRACTICE_NAV: readonly PracticeNavItem[] = practiceNav(Object.keys(PRACTICE_NAV) as PracticeSectionId[])
