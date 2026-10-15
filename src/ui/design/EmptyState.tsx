import type { ReactNode } from 'react'
import { cx } from './cx'
import { Loo, type LooMood } from './mascot/Loo'

interface EmptyStateProps {
  title: ReactNode
  children?: ReactNode
  mood?: LooMood
  /** Button(s) below the text. */
  action?: ReactNode
  /** Replace Loo with any illustration (icon, emoji). */
  art?: ReactNode
  className?: string
}

export function EmptyState({ title, children, mood = 'sleeping', action, art, className }: EmptyStateProps) {
  return (
    <div className={cx('lu-empty', className)}>
      <div className="lu-empty-art">{art ?? <Loo mood={mood} size={128} decorative />}</div>
      <h3 className="lu-empty-title">{title}</h3>
      {children ? <div className="lu-empty-text">{children}</div> : null}
      {action ? <div className="lu-empty-action">{action}</div> : null}
    </div>
  )
}
