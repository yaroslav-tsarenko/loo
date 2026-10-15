'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { PiXBold } from 'react-icons/pi'
import { IconButton } from './Button'
import { cx } from './cx'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  /** Sticky action row (buttons). */
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Native <dialog>: focus trap, Esc and top layer for free. Bottom sheet on phones, centered dialog from 640px.
export function Sheet({ open, onClose, title, description, children, footer, size = 'md', className }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={cx('lu-sheet', className)}
      data-size={size}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={() => {
        if (open) onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="lu-sheet-panel">
        <span className="lu-sheet-handle" aria-hidden="true" />
        <header className="lu-sheet-head">
          <h2 id={titleId} className="lu-sheet-title">
            {title}
          </h2>
          <IconButton label="Закрити" icon={<PiXBold size={20} />} onClick={onClose} />
        </header>
        {description ? (
          <p id={descId} className="lu-sheet-desc">
            {description}
          </p>
        ) : null}
        {children ? <div className="lu-sheet-body">{children}</div> : null}
        {footer ? <footer className="lu-sheet-foot">{footer}</footer> : null}
      </div>
    </dialog>
  )
}
