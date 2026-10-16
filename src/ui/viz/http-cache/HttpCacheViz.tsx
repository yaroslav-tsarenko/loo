'use client'

import { AnimatePresence, m } from 'motion/react'
import { HttpMessage } from '../cors/HttpMessage'
import { Badge, ConsolePanel, SPRING, VizGlyph } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizIcon, VizProps } from '../engine/types'
import { ageOf, decide, type Decision } from './cache'
import { httpCacheScenarios, type CacheFrame } from './scenarios'

const SCALE = 120
const DECISION: Record<Decision, { label: string; icon?: VizIcon }> = {
  miss: { label: '∅ miss' },
  fresh: { label: 'fresh', icon: 'pi:PiCheckCircleFill' },
  stale: { label: 'stale', icon: 'pi:PiTimerFill' },
}

function Clock({ f }: { f: CacheFrame }) {
  const state = f.decision ?? (f.entry ? decide(f.entry, f.t) : 'miss')
  const age = f.entry ? ageOf(f.entry, f.t) : 0
  const pos = (s: number) => `${(Math.min(s, SCALE) / SCALE) * 100}%`
  return (
    <div className="viz-hc-clock">
      <div className="viz-hc-clock-row">
        <span className="viz-hc-time tabular">
          <VizGlyph icon="px:clock" size={14} /> t = {f.t} с
        </span>
        <span className="viz-hc-decision" data-state={state}>
          {DECISION[state].icon ? <VizGlyph icon={DECISION[state].icon} size={12} /> : null} {DECISION[state].label}
        </span>
      </div>
      {f.entry && !f.entry.noCache ? (
        <div className="viz-hc-fresh" role="img" aria-label={`Вік запису ${age} с, max-age ${f.entry.maxAge} с`}>
          <span className="viz-hc-fresh-zone" style={{ width: pos(f.entry.maxAge) }} />
          <m.span className="viz-hc-age" initial={false} animate={{ left: pos(age) }} transition={SPRING} />
          <span className="viz-hc-fresh-label">
            вік {age} с · max-age {f.entry.maxAge}
          </span>
        </div>
      ) : (
        <p className="viz-muted">{f.entry?.noCache ? 'no-cache: свіжість не рахується, лише ревалідація' : 'у кеші нічого немає'}</p>
      )}
    </div>
  )
}

function Wire({ f, hop }: { f: CacheFrame; hop: 'page' | 'server' }) {
  const msg = f.hop === hop ? f.msg : null
  return (
    <div className="viz-hc-wire" data-on={msg ? '' : undefined}>
      <AnimatePresence mode="wait" initial={false}>
        {msg ? (
          <m.div key={msg.id + hop} className="viz-hc-msg" initial={{ opacity: 0, y: msg.dir === 'req' ? -10 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
            <span className="viz-hc-arrow" aria-hidden="true">
              {msg.dir === 'req' ? '↓' : '↑'}
            </span>
            <HttpMessage msg={msg} active />
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function Stack({ f }: { f: CacheFrame }) {
  const e = f.entry
  return (
    <div className="viz-hc-stack">
      <div className="viz-hc-box" data-active={f.hop === 'page' ? '' : undefined}>
        <span className="viz-hc-box-head">
          <VizGlyph icon="px:monitor" /> Сторінка
        </span>
        <code className="viz-muted">fetch(&apos;/app.js&apos;)</code>
      </div>
      <Wire f={f} hop="page" />
      <div className="viz-hc-box" data-tone="cache" data-active={f.decision ? '' : undefined}>
        <span className="viz-hc-box-head">
          <VizGlyph icon="px:floppy" /> HTTP-кеш браузера
        </span>
        {e ? (
          <span className="viz-hc-entry">
            <code>/app.js</code> <Badge>ETag {e.etag}</Badge> {e.noCache ? <Badge>no-cache</Badge> : <Badge>свіжий до t = {e.storedAt + e.maxAge} с</Badge>}
          </span>
        ) : (
          <span className="viz-empty">порожньо</span>
        )}
      </div>
      <Wire f={f} hop="server" />
      <div className="viz-hc-box" data-active={f.hop === 'server' ? '' : undefined}>
        <span className="viz-hc-box-head">
          <VizGlyph icon="px:database" /> Сервер
        </span>
        <span className="viz-hc-entry">
          <code>/app.js</code> <Badge tone="accent">ETag {f.server}</Badge>
        </span>
      </div>
    </div>
  )
}

export function HttpCacheViz({ scenario }: VizProps) {
  const data = httpCacheScenarios[scenario] ?? httpCacheScenarios.revalidation!
  return (
    <StepPlayer
      scenario={data}
      label="HTTP-кеш і ревалідація"
      side={(f) => (
        <>
          <Clock f={f} />
          <Stack f={f} />
        </>
      )}
      below={(f) => <ConsolePanel lines={f.output} />}
    />
  )
}
