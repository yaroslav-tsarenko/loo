import Link from 'next/link'
import { plural } from '@/ui/format'
import { CountUp } from './CountUp'
import { cx } from './cx'
import { GameIcon, type GameIconName } from './GameIcon'

export type StatKind = 'streak' | 'gems' | 'hearts' | 'xp'

const ICON: Record<StatKind, GameIconName> = { streak: 'fire', gems: 'gem', hearts: 'heart', xp: 'bolt' }

function describe(kind: StatKind, n: number, active: boolean): string {
  switch (kind) {
    case 'streak':
      return `Серія: ${n} ${plural(n, 'день', 'дні', 'днів')}${active ? '' : ', сьогодні ще не зараховано'}`
    case 'gems':
      return `Кристали: ${n}`
    case 'hearts':
      return `Сердечка: ${n} з 5`
    case 'xp':
      return `Досвід: ${n} XP`
  }
}

interface StatChipProps {
  kind: StatKind
  value: number
  /** Streak: lit only when today's goal is met (grey flame otherwise). */
  active?: boolean
  href?: string
  size?: 'sm' | 'md'
  className?: string
}

export function StatChip({ kind, value, active = true, href, size = 'md', className }: StatChipProps) {
  const label = describe(kind, value, active)
  const body = (
    <>
      <GameIcon name={ICON[kind]} size={size === 'sm' ? 20 : 24} muted={!active} />
      <CountUp value={value} />
    </>
  )
  const props = { className: cx('lu-stat', className), 'data-kind': kind, 'data-size': size, 'data-off': active ? undefined : '', title: label, 'aria-label': label }
  return href ? (
    <Link href={href} {...props}>
      {body}
    </Link>
  ) : (
    <span role="img" {...props}>
      {body}
    </span>
  )
}
