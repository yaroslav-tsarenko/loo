'use client'

import { useId, useState, type KeyboardEvent, type ReactNode } from 'react'

// Small tabs inside a breakdown card (entry/exit pages, UTM source/medium/campaign). The panels are rendered on the
// server; this only switches which one is visible.
export function Tabs({ title, tabs }: { title: string; tabs: Array<{ id: string; label: string; content: ReactNode }> }) {
  const [current, setCurrent] = useState(tabs[0]?.id ?? '')
  const id = useId()

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === current)
    const to = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null
    if (to === null) return
    e.preventDefault()
    const next = tabs[(to + tabs.length) % tabs.length]!
    setCurrent(next.id)
    document.getElementById(`${id}-${next.id}`)?.focus()
  }

  return (
    <>
      <div className="ana-card-head">
        <h2 className="ana-h2">{title}</h2>
        <div className="ana-seg" role="tablist" aria-label={title} onKeyDown={onKey}>
          {tabs.map((t) => (
            <button
              key={t.id}
              id={`${id}-${t.id}`}
              type="button"
              role="tab"
              className="ana-seg-btn"
              aria-selected={t.id === current}
              aria-controls={`${id}-${t.id}-panel`}
              tabIndex={t.id === current ? 0 : -1}
              onClick={() => setCurrent(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((t) => (
        <div key={t.id} id={`${id}-${t.id}-panel`} role="tabpanel" aria-labelledby={`${id}-${t.id}`} hidden={t.id !== current}>
          {t.content}
        </div>
      ))}
    </>
  )
}
