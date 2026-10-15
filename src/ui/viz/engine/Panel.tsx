'use client'

import { AnimatePresence, m } from 'motion/react'
import type { ReactNode } from 'react'
import type { Token } from './types'

export const SPRING = { type: 'spring' as const, stiffness: 380, damping: 32, mass: 0.8 }

export function Panel({ title, emoji, hint, tone, className, children }: { title: string; emoji?: string; hint?: string; tone?: string; className?: string; children: ReactNode }) {
  return (
    <section className={`viz-panel${className ? ` ${className}` : ''}`} data-tone={tone} aria-label={title}>
      <header className="viz-panel-head">
        {emoji ? <span aria-hidden="true">{emoji}</span> : null}
        <span>{title}</span>
        {hint ? <span className="viz-panel-hint">{hint}</span> : null}
      </header>
      <div className="viz-panel-body">{children}</div>
    </section>
  )
}

// Animated list of tokens. Shared `layoutId`s let a token fly between lists
// (Web APIs → task queue → stack) inside one <LayoutGroup>.
export function TokenList({
  items,
  empty = 'порожньо',
  direction = 'column',
  reverse = false,
  tone,
  activeId,
}: {
  items: readonly Token[]
  empty?: string
  direction?: 'column' | 'row'
  reverse?: boolean
  tone?: string
  activeId?: string | null
}) {
  const list = reverse ? [...items].reverse() : items
  return (
    <div className="viz-tokens" data-dir={direction}>
      <AnimatePresence initial={false} mode="popLayout">
        {list.map((t) => (
          <m.div
            key={t.id}
            layout="position"
            layoutId={t.id}
            className="viz-token"
            data-tone={tone}
            data-active={activeId === t.id ? '' : undefined}
            initial={{ opacity: 0, scale: 0.85, y: direction === 'column' ? -8 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={SPRING}
          >
            <span className="viz-token-label">{t.label}</span>
            {t.hint ? <span className="viz-token-hint">{t.hint}</span> : null}
          </m.div>
        ))}
      </AnimatePresence>
      {list.length === 0 ? <span className="viz-empty">{empty}</span> : null}
    </div>
  )
}

export function ConsolePanel({ lines, error }: { lines: readonly string[]; error?: string | null }) {
  return (
    <Panel title="Console" emoji="🖥️" className="viz-console">
      <div className="viz-console-lines" role="log" aria-label="Вивід консолі">
        <AnimatePresence initial={false}>
          {lines.map((line, i) => (
            <m.div key={`${i}:${line}`} className="viz-console-line" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
              <span className="viz-console-caret" aria-hidden="true">
                ›
              </span>
              {line}
            </m.div>
          ))}
          {error ? (
            <m.div key="error" className="viz-console-line" data-error="" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
              <span className="viz-console-caret" aria-hidden="true">
                ✕
              </span>
              {error}
            </m.div>
          ) : null}
        </AnimatePresence>
        {lines.length === 0 && !error ? <span className="viz-empty">поки тихо</span> : null}
      </div>
    </Panel>
  )
}

export function Badge({ children, tone }: { children: ReactNode; tone?: string }) {
  return (
    <span className="viz-badge" data-tone={tone}>
      {children}
    </span>
  )
}
