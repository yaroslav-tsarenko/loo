// Hearts: 5 max, a wrong answer in a lesson costs one, +1 every 4 hours (computed lazily from hearts_at).
// hearts_at anchors the refill clock: the moment the last refill tick happened (or the first heart was lost).

export const MAX_HEARTS = 5
export const HEART_REFILL_MS = 4 * 3_600_000

export interface HeartsState {
  hearts: number
  // epoch ms the refill clock started; null when full
  heartsAt: number | null
}

export interface HeartsView extends HeartsState {
  // when the next heart arrives (null when full)
  nextAt: number | null
  // when hearts are full again (null when full)
  fullAt: number | null
}

const clamp = (n: number) => Math.max(0, Math.min(MAX_HEARTS, Math.floor(n)))

// Applies the refills that happened since heartsAt.
export function settleHearts(state: HeartsState, now: number): HeartsView {
  const hearts = clamp(state.hearts)
  if (hearts >= MAX_HEARTS || state.heartsAt === null) {
    return hearts >= MAX_HEARTS ? { hearts: MAX_HEARTS, heartsAt: null, nextAt: null, fullAt: null } : withClock(hearts, now)
  }
  const elapsed = Math.max(0, now - state.heartsAt)
  const ticks = Math.floor(elapsed / HEART_REFILL_MS)
  const next = clamp(hearts + ticks)
  if (next >= MAX_HEARTS) return { hearts: MAX_HEARTS, heartsAt: null, nextAt: null, fullAt: null }
  return withClock(next, state.heartsAt + ticks * HEART_REFILL_MS)
}

function withClock(hearts: number, anchor: number): HeartsView {
  return { hearts, heartsAt: anchor, nextAt: anchor + HEART_REFILL_MS, fullAt: anchor + (MAX_HEARTS - hearts) * HEART_REFILL_MS }
}

// One wrong answer: the clock starts when the first heart is lost.
export function loseHeart(state: HeartsState, now: number): HeartsView {
  const s = settleHearts(state, now)
  if (s.hearts <= 0) return s
  return withClock(s.hearts - 1, s.heartsAt ?? now)
}

// Practice refill / shop refill. `n = MAX_HEARTS` refills to full.
export function gainHearts(state: HeartsState, now: number, n: number): HeartsView {
  const s = settleHearts(state, now)
  const hearts = clamp(s.hearts + n)
  if (hearts >= MAX_HEARTS) return { hearts: MAX_HEARTS, heartsAt: null, nextAt: null, fullAt: null }
  return withClock(hearts, s.heartsAt ?? now)
}

// A graded lesson needs at least one heart to start (and to keep answering).
export const canStartLesson = (state: HeartsState, now: number): boolean => settleHearts(state, now).hearts > 0

// Tests and exams cost no hearts, but starting one needs ≥ 1 heart (docs/ARCHITECTURE.md §6).
export const canStartTest = canStartLesson

// «Робота над помилками»: a finished practice session with at least this many answers refills one heart.
export const PRACTICE_MIN_ANSWERS = 5
export const PRACTICE_REFILL = 1
