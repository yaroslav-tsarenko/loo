import 'server-only'
import { cache } from 'react'
import type { Level } from '@/course'
import type { ContentSnapshot } from '@/content/store'
import { getUser } from './auth/session'
import { activeCourse, exerciseIds, type ActiveCourse } from './courses/enrollment'
import { libraryFrom, type LibraryCourse } from './courses/library'
import { theoryFrom, type ActiveTheory } from './courses/theory'
import { getContent } from './content'
import { pageTx } from './base'
import type { PlayerGame, ShellGame } from './game'
import { navCountsFrom } from './services/counts'
import type { ProgressRow } from './services/library'

// Everything the app shell ((app) layout) shows for a signed-in learner, read in the page's ONE transaction (with the
// base rows — src/server/base.ts → pageTx): XP, practice badges,
// game state (rank settled silently, streak freezes applied), the library and the chapter progress behind the
// sidebar's «Теорія». All reads go out together (pipelined), so the shell costs ~3 database round trips instead of
// the ~100 it took as eight separate transactions on a single pooled connection.
//
// Cached per request: pages read xp / library / game / progress from here instead of querying them again.
// Await it at the top level of a page or layout only — never inside a userScope transaction.

export interface ShellData {
  snapshot: ContentSnapshot
  active: ActiveCourse | null
  xp: number
  counts: Record<string, number>
  library: LibraryCourse[]
  game: ShellGame
  progress: Map<string, ProgressRow>
  theory: ActiveTheory | null
  // every open mistake, any course (the players' «Робота над помилками» link)
  openMistakes: number
}

export const shellData = cache(async (): Promise<ShellData | null> => {
  const user = await getUser()
  if (!user) return null
  // the shell's reads ride in the page's one transaction, together with the base rows (src/server/base.ts → pageTx)
  const [snapshot, active, page] = await Promise.all([getContent(), activeCourse(), pageTx()])
  if (!page) return null
  const read = page.shell
  const pool = active ? exerciseIds(active.bundle) : null
  return {
    snapshot,
    active,
    xp: read.xp,
    counts: navCountsFrom(snapshot, pool, read.rows, read.game),
    library: await libraryFrom(read.enrollments),
    game: read.game,
    progress: read.progress,
    theory: active ? theoryFrom(snapshot, active, read.progress) : null,
    openMistakes: read.rows.mistakes.length,
  }
})

// What the lesson / test players need up front (playerGame() without a query: the shell has it all).
export function playerGameFrom(shell: ShellData): PlayerGame {
  const { hearts, bucks } = shell.game
  return { hearts: { hearts: hearts.hearts, nextAt: hearts.nextAt }, bucks, practiceHref: shell.openMistakes > 0 ? '/mistakes' : '/quiz' }
}

// The learner's level in a course from the shell's library (learnerLevel() without a query).
export function learnerLevelFrom(shell: ShellData, courseId: string, fallback: () => Promise<Level>): Promise<Level> {
  const enrolled = shell.library.find((c) => c.id === courseId)
  return enrolled ? Promise.resolve(enrolled.enrollment.level) : fallback()
}
