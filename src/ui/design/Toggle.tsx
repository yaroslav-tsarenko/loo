'use client'

import { useId, useState, type ReactNode } from 'react'
import { cx } from './cx'

interface ToggleProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
  className?: string
}

export function Toggle({ checked, defaultChecked = false, onCheckedChange, label, description, disabled, className }: ToggleProps) {
  const id = useId()
  const [inner, setInner] = useState(defaultChecked)
  const on = checked ?? inner
  return (
    <div className={cx('lu-toggle', className)}>
      <span className="lu-toggle-text">
        <label htmlFor={id} className="lu-toggle-label">
          {label}
        </label>
        {description ? (
          <span id={`${id}-d`} className="lu-toggle-desc">
            {description}
          </span>
        ) : null}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        aria-describedby={description ? `${id}-d` : undefined}
        disabled={disabled}
        className="lu-switch"
        onClick={() => {
          if (checked === undefined) setInner(!on)
          onCheckedChange?.(!on)
        }}
      >
        <span className="lu-switch-thumb" />
      </button>
    </div>
  )
}
