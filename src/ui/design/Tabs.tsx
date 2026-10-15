'use client'

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from './cx'

export interface TabItem {
  id: string
  label: ReactNode
  icon?: ReactNode
  panel: ReactNode
}

interface TabsProps {
  items: readonly TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (id: string) => void
  label: string
  className?: string
}

// Segmented pill tabs with roving focus (←/→/Home/End).
export function Tabs({ items, value, defaultValue, onValueChange, label, className }: TabsProps) {
  const base = useId()
  const [inner, setInner] = useState(defaultValue ?? items[0]?.id ?? '')
  const active = value ?? inner
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (id: string) => {
    if (value === undefined) setInner(id)
    onValueChange?.(id)
  }

  const onKey = (e: KeyboardEvent, index: number) => {
    const last = items.length - 1
    const next = e.key === 'ArrowRight' ? (index === last ? 0 : index + 1) : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1
    if (next < 0) return
    e.preventDefault()
    const item = items[next]
    if (!item) return
    select(item.id)
    refs.current[next]?.focus()
  }

  return (
    <div className={cx('lu-tabs', className)}>
      <div role="tablist" aria-label={label} className="lu-tablist">
        {items.map((item, i) => {
          const selected = item.id === active
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${base}-t-${item.id}`}
              aria-controls={`${base}-p-${item.id}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              className="lu-tab"
              onClick={() => select(item.id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {item.icon ? <span className="lu-tab-icon">{item.icon}</span> : null}
              {item.label}
            </button>
          )
        })}
      </div>
      {items.map((item) => (
        <div key={item.id} role="tabpanel" id={`${base}-p-${item.id}`} aria-labelledby={`${base}-t-${item.id}`} hidden={item.id !== active} className="lu-tabpanel" tabIndex={0}>
          {item.panel}
        </div>
      ))}
    </div>
  )
}
