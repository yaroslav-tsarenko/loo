'use client'

import { AnimatePresence, m } from 'motion/react'
import { ConsolePanel, SPRING, VizGlyph } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { HttpMessage } from './HttpMessage'
import { corsScenarios, type CorsFrame } from './scenarios'

function Sequence({ f }: { f: CorsFrame }) {
  const open = f.active ?? f.msgs.at(-1)?.id ?? null
  return (
    <div className="viz-seq">
      <div className="viz-seq-actors">
        <span>
          <VizGlyph icon="px:monitor" /> Браузер
          <small>app.example</small>
        </span>
        <span>
          <VizGlyph icon="px:database" /> Сервер
          <small>api.example</small>
        </span>
      </div>
      <ol className="viz-seq-body" aria-label="Обмін HTTP-повідомленнями">
        <AnimatePresence initial={false} mode="popLayout">
          {f.msgs.map((msg) => (
            <m.li key={msg.id} layout="position" className="viz-seq-row" data-dir={msg.dir} initial={{ opacity: 0, x: msg.dir === 'req' ? -24 : 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
              <span className="viz-seq-arrow" aria-hidden="true" />
              <HttpMessage msg={msg} active={f.active === msg.id} compact={msg.id !== open} />
            </m.li>
          ))}
        </AnimatePresence>
        {f.msgs.length === 0 ? <li className="viz-empty viz-seq-empty">запитів ще не було</li> : null}
      </ol>
      <AnimatePresence initial={false}>
        {f.verdict ? (
          <m.div key={`${f.verdict.ok}:${f.verdict.text}`} className="viz-cors-check" data-ok={f.verdict.ok ? '' : undefined} role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
            <VizGlyph icon="px:shield" size={20} />
            <span>
              CORS-перевірка{f.verdict.preflight ? ' preflight' : ''}: <VizGlyph icon={f.verdict.ok ? 'pi:PiCheckCircleFill' : 'pi:PiProhibitFill'} size={14} /> {f.verdict.text}
            </span>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function CorsViz({ scenario }: VizProps) {
  const data = corsScenarios[scenario] ?? corsScenarios.simple!
  return <StepPlayer scenario={data} label="CORS" side={(f) => <Sequence f={f} />} below={(f) => <ConsolePanel lines={f.output} error={f.error} />} />
}
