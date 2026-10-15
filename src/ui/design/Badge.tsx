import type { HTMLAttributes, ReactNode } from 'react'
import { cx, type Tone } from './cx'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  children: ReactNode
}

/** Compact count/status marker: notification dots, "NEW", level tags. */
export function Badge({ tone = 'red', className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx('lu-badge', className)} data-tone={tone} {...rest}>
      {children}
    </span>
  )
}

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  /** Solid fill instead of the soft tint. */
  solid?: boolean
  icon?: ReactNode
  size?: 'sm' | 'md'
  children: ReactNode
}

/** Rounded label with an optional icon: topics, levels, rewards. */
export function Pill({ tone = 'gray', solid, icon, size = 'md', className, children, ...rest }: PillProps) {
  return (
    <span className={cx('lu-pill', className)} data-tone={tone} data-solid={solid ? '' : undefined} data-size={size} {...rest}>
      {icon ? <span className="lu-pill-icon">{icon}</span> : null}
      {children}
    </span>
  )
}
