'use client'

import { AnimatePresence, m } from 'motion/react'
import { Panel, SPRING, TokenList, VizGlyph } from './Panel'
import type { Token } from './types'

// Call stack drawn top-down: the last pushed frame is on top.
export function StackPanel({ stack, returning, hidden, error, title = 'Call Stack' }: { stack: readonly Token[]; returning?: string; hidden?: number; error?: string; title?: string }) {
  const top = stack.at(-1)?.id ?? null
  const shown = hidden ? [...stack.slice(0, -1), { id: '__hidden', label: `⋯ ще ${hidden.toLocaleString('uk-UA')} кадрів`, hint: '' }, stack.at(-1)!] : stack
  return (
    <Panel title={title} icon="px:pancakes" hint={stack.length > 0 ? `глибина ${stack.length + (hidden ?? 0)}` : undefined} className="viz-stack" tone={error ? 'danger' : undefined}>
      <AnimatePresence initial={false}>
        {returning ? (
          <m.div key={returning} className="viz-return" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={SPRING}>
            <VizGlyph icon="pi:PiArrowBendUpLeftBold" size={14} /> return <code>{returning}</code>
          </m.div>
        ) : null}
      </AnimatePresence>
      <TokenList items={shown} reverse activeId={top} tone="stack" empty="стек порожній" />
    </Panel>
  )
}
