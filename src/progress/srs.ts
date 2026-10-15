import { createEmptyCard, fsrs, generatorParameters, Rating, type Card, type Grade } from 'ts-fsrs'
import type { FlashRating } from './types'

export interface SrsCard {
  due: number
  stability: number
  difficulty: number
  elapsedDays: number
  scheduledDays: number
  learningSteps: number
  reps: number
  lapses: number
  state: number
  lastReview: number | null
}

const scheduler = fsrs(generatorParameters({ request_retention: 0.9, enable_fuzz: false, enable_short_term: true, maximum_interval: 365 }))

const GRADE: Record<FlashRating, Grade> = { again: Rating.Again, hard: Rating.Hard, good: Rating.Good }

function toCard(card: SrsCard): Card {
  const base: Card = {
    due: new Date(card.due),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsedDays,
    scheduled_days: card.scheduledDays,
    learning_steps: card.learningSteps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
  }
  if (card.lastReview !== null) base.last_review = new Date(card.lastReview)
  return base
}

function fromCard(card: Card): SrsCard {
  return {
    due: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReview: card.last_review ? card.last_review.getTime() : null,
  }
}

export function newCard(now: number): SrsCard {
  return fromCard(createEmptyCard(new Date(now)))
}

export function review(card: SrsCard | null, rating: FlashRating, now: number): SrsCard {
  const current = card ? toCard(card) : createEmptyCard(new Date(now))
  const { card: next } = scheduler.next(current, new Date(now), GRADE[rating])
  return fromCard(next)
}

export function previewIntervals(card: SrsCard | null, now: number): Record<FlashRating, number> {
  const current = card ? toCard(card) : createEmptyCard(new Date(now))
  const preview = scheduler.repeat(current, new Date(now))
  return {
    again: preview[Rating.Again].card.due.getTime() - now,
    hard: preview[Rating.Hard].card.due.getTime() - now,
    good: preview[Rating.Good].card.due.getTime() - now,
  }
}

export function isDue(card: SrsCard | null, now: number): boolean {
  return card === null || card.due <= now
}
