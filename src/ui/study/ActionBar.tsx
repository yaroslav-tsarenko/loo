'use client'

import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '@/ui/design/cx'

// Check/submit row of an exercise. Inside the lesson player it docks into the bottom bar (`slot`), elsewhere it renders in place.
export function ActionBar({ slot, className, children }: { slot?: Element | null; className?: string; children: ReactNode }) {
  if (slot) return createPortal(<div className={cx('quiz-actions', className)} data-docked="">{children}</div>, slot)
  return <div className={cx('quiz-actions', className)}>{children}</div>
}

// The answer button: in lessons / tests the learner picks (and may change) an answer, then «Далі» sends it and shows the
// verdict — the next «Далі» moves on. In articles the same button reads «Відповісти». Never an instant check on tap.
export const submitLabel = (variant: 'inline' | 'session'): string => (variant === 'session' ? 'Далі' : 'Відповісти')
