import 'server-only'
import type { Conn } from '@/db/client'
import { enrollmentsRead } from './courses/enrollment'
import { settledShellFrom, shellGameReads } from './game'
import { practiceRead } from './services/counts'
import { progressRead } from './services/library'
import { xpRead } from './services/progress'

// The app shell's reads (src/server/shell.ts), as a list to batch into the page's one transaction (src/server/base.ts
// → pageTx), and the settlement that may follow them (rank / streak freezes — writes only when something moved).
// Loaded lazily by base.ts, so the base module doesn't import the whole game / counts layer at startup.

export function shellReadList(db: Conn, userId: string, now: number) {
  return [xpRead(db, userId), practiceRead(db, userId, now), enrollmentsRead(db, userId), progressRead(db, userId), ...shellGameReads(db, userId, now)] as const
}

type Results<T extends readonly unknown[]> = { [K in keyof T]: T[K] extends { map: (rows: never[]) => infer V } ? V : never }
export type ShellParts = Results<ReturnType<typeof shellReadList>>

export async function settleShell(db: Conn, userId: string, now: number, parts: ShellParts) {
  const [xp, rows, enrollments, progress, rank, gameRow, goal, frozen] = parts
  const game = await settledShellFrom(db, userId, now, { rank, game: gameRow, goal, frozen })
  return { xp, rows, enrollments, progress, game }
}

export type ShellRead = Awaited<ReturnType<typeof settleShell>>
