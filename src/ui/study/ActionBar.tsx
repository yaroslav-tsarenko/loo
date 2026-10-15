'use client'

import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '@/ui/design/cx'

// Check/submit row of an exercise. Inside the lesson player it docks into the bottom bar (`slot`), elsewhere it renders in place.
export function ActionBar({ slot, className, children }: { slot?: Element | null; className?: string; children: ReactNode }) {
  if (slot) return createPortal(<div className={cx('quiz-actions', className)} data-docked="">{children}</div>, slot)
  return <div className={cx('quiz-actions', className)}>{children}</div>
}
