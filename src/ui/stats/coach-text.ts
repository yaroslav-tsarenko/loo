import { messages, t } from '@/i18n'
import type { CoachGoal, CoachProgress } from '@/progress/stats'
import { percent } from '@/ui/format'
import { nouns, seconds } from './format'

export interface CoachText {
  title: string
  sub: string
  why: string
  progress: string
}

function groupLabel(group: string): string {
  return (messages().coach.groups as Record<string, string>)[group] ?? group
}

function daysAgo(n: number): string {
  if (n <= 0) return 'сьогодні'
  if (n === 1) return 'вчора'
  return `${n} ${n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'дні' : n % 10 === 1 && n % 100 !== 11 ? 'день' : 'днів'} тому`
}

// The goal as words: structured goal (stored per day) → localized title, one-line context and the «why».
export function coachText(goal: CoachGoal, progress: CoachProgress): CoachText {
  const n = messages().coach.nouns
  const m = goal.metric
  const why = t(`coach.why.${goal.dimension}`)
  let title: string
  let sub: string
  switch (m.type) {
    case 'speed': {
      const delta = (goal.baseline - goal.target) / 1000
      title = t('coach.goals.speed', { delta: delta.toFixed(1), group: groupLabel(m.group) })
      sub = t('coach.subs.speed', { target: seconds(goal.target), base: seconds(goal.baseline), min: m.minCount })
      break
    }
    case 'cards':
      title = t('coach.goals.retention', { n: nouns(goal.target, n.cards) })
      sub = t('coach.subs.retention', { base: goal.baseline })
      break
    case 'mistakeFixes':
      title = t('coach.goals.mistakeFixes', { n: nouns(goal.target, n.mistakes), topic: goal.topic?.title ?? '', acc: percent(goal.topic?.accuracy ?? null) })
      sub = t('coach.subs.mistakeFixes')
      break
    case 'topicCorrect':
      title = t('coach.goals.topicCorrect', { n: nouns(goal.target, n.correct), topic: goal.topic?.title ?? '', acc: percent(goal.topic?.accuracy ?? null) })
      sub = t('coach.subs.topicCorrect')
      break
    case 'newLessons':
      title = t('coach.goals.coverage')
      sub = goal.baseline < 0 ? t('coach.subs.coverageNever') : t('coach.subs.coverage', { days: daysAgo(goal.baseline) })
      break
    case 'answers':
      if (goal.dimension === 'start') {
        title = t('coach.goals.start', { n: nouns(goal.target, n.answers) })
        sub = t('coach.subs.start')
      } else if (goal.dimension === 'consistency') {
        title = t('coach.goals.consistency', { n: nouns(goal.target, n.answers) })
        sub = t('coach.subs.consistency', { active: goal.baseline })
      } else {
        title = t('coach.goals.volume', { n: nouns(goal.target, n.answers), base: goal.baseline })
        sub = t('coach.subs.volume')
      }
      break
  }
  const progressText =
    m.type === 'speed'
      ? progress.value !== null && (progress.n ?? 0) >= m.minCount
        ? t('coach.speedProgress', { value: seconds(progress.value), n: progress.n ?? 0, min: m.minCount })
        : t('coach.speedWaiting', { n: progress.n ?? 0, min: m.minCount })
      : t('coach.progress', { value: progress.value ?? 0, target: goal.target })
  return { title, sub, why, progress: progressText }
}
