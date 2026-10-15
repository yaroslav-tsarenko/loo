'use client'

import { cloneElement, isValidElement, useId, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { cx } from './cx'

interface TooltipProps {
  content: ReactNode
  /** A single focusable element; it receives aria-describedby. */
  children: ReactElement<{ 'aria-describedby'?: string }>
  side?: 'top' | 'bottom'
  delay?: number
}

export function Tooltip({ content, children, side = 'top', delay = 250 }: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const show = (now: boolean) => {
    window.clearTimeout(timer.current)
    if (now) setOpen(true)
    else timer.current = window.setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    window.clearTimeout(timer.current)
    setOpen(false)
  }
  const trigger = isValidElement(children) ? cloneElement(children, { 'aria-describedby': id }) : children
  return (
    <span className="lu-tip-wrap" onPointerEnter={() => show(false)} onPointerLeave={hide} onFocus={() => show(true)} onBlur={hide} onKeyDown={(e) => e.key === 'Escape' && hide()}>
      {trigger}
      <span id={id} role="tooltip" className="lu-tip" data-side={side} data-open={open ? '' : undefined}>
        {content}
      </span>
    </span>
  )
}

interface PopoverProps {
  /** Content of the trigger button. */
  trigger: ReactNode
  triggerLabel?: string
  children: ReactNode
  align?: 'start' | 'center' | 'end'
  className?: string
}

// HTML popover API: light dismiss, Esc and top layer are native; we only place it under the trigger.
export function Popover({ trigger, triggerLabel, children, align = 'center', className }: PopoverProps) {
  const id = useId()
  const btn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const place = () => {
    const b = btn.current?.getBoundingClientRect()
    const p = panel.current
    if (!b || !p) return
    const w = p.offsetWidth
    const left = align === 'start' ? b.left : align === 'end' ? b.right - w : b.left + b.width / 2 - w / 2
    p.style.left = `${Math.max(8, Math.min(left, window.innerWidth - w - 8))}px`
    p.style.top = `${b.bottom + 10}px`
    p.style.setProperty('--lu-pop-arrow', `${b.left + b.width / 2 - Math.max(8, Math.min(left, window.innerWidth - w - 8))}px`)
  }

  return (
    <>
      <button ref={btn} type="button" className="lu-pop-trigger" popoverTarget={id} aria-expanded={open} aria-label={triggerLabel}>
        {trigger}
      </button>
      <div
        ref={panel}
        id={id}
        popover="auto"
        className={cx('lu-pop', className)}
        onToggle={(e) => {
          const next = e.newState === 'open'
          setOpen(next)
          if (next) place()
        }}
      >
        {children}
      </div>
    </>
  )
}
