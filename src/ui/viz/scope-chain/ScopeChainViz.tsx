'use client'

import { AnimatePresence, m } from 'motion/react'
import { Arrows, type ArrowLink } from '../engine/Arrows'
import { ConsolePanel, Panel, SPRING, VizGlyph } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { scopeChainScenarios, type ScopeEnv, type ScopeFrame } from './scenarios'

function EnvBox({ env, frame }: { env: ScopeEnv; frame: ScopeFrame }) {
  const children = frame.envs.filter((e) => e.outer === env.id)
  const outer = frame.envs.find((e) => e.id === env.outer)
  const lookup = frame.lookup
  const inPath = lookup?.path.includes(env.id) ?? false
  const found = lookup?.found === env.id
  return (
    <m.div
      layout="position"
      className="viz-env"
      data-active={frame.active === env.id ? '' : undefined}
      data-path={inPath ? '' : undefined}
      data-found={found ? '' : undefined}
      data-dead={env.dead ? '' : undefined}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: env.dead ? 0.45 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={SPRING}
    >
      <div className="viz-env-head" data-anchor={`env-${env.id}`}>
        <span className="viz-env-name">{env.name}</span>
        <span className="viz-env-outer">outer → {outer ? outer.name : 'null'}</span>
      </div>
      {env.note ? <p className="viz-env-note">{env.note}</p> : null}
      <ul className="viz-vars">
        {env.vars.map((v) => {
          const hit = found && lookup?.name === v.name
          return (
            <li key={v.name} data-captured={v.captured ? '' : undefined} data-tdz={v.tdz ? '' : undefined} data-hit={hit ? '' : undefined}>
              <code className="viz-var-name">{v.name}</code>
              <span className="viz-var-eq" aria-hidden="true">
                =
              </span>
              <m.span key={v.value} className="viz-var-val" data-changed={v.changed ? '' : undefined} data-anchor={v.fn ? `ref-${env.id}-${v.name}` : undefined} initial={v.changed ? { scale: 1.25 } : false} animate={{ scale: 1 }} transition={SPRING}>
                {v.value}
              </m.span>
              {v.captured ? <span className="viz-var-flag">
                  <VizGlyph icon="pi:PiPaperclipBold" size={12} /> у замиканні
                </span> : null}
            </li>
          )
        })}
        {env.vars.length === 0 ? <li className="viz-empty">власних змінних немає</li> : null}
      </ul>
      {children.length > 0 ? (
        <div className="viz-env-children">
          <AnimatePresence initial={false} mode="popLayout">
            {children.map((c) => (
              <EnvBox key={c.id} env={c} frame={frame} />
            ))}
          </AnimatePresence>
        </div>
      ) : null}
    </m.div>
  )
}

function ScopeStage({ frame }: { frame: ScopeFrame }) {
  const roots = frame.envs.filter((e) => !e.outer || !frame.envs.some((x) => x.id === e.outer))
  const links: ArrowLink[] = []
  // with many closures arrows become a tangle: chips name their env instead
  const drawFnArrows = frame.fns.length <= 2
  if (drawFnArrows) {
    for (const fn of frame.fns) links.push({ from: `fn-${fn.id}`, to: `env-${fn.env}`, tone: 'muted' })
    for (const env of frame.envs) for (const v of env.vars) if (v.fn) links.push({ from: `ref-${env.id}-${v.name}`, to: `fn-${v.fn}`, tone: 'muted' })
  }
  const path = frame.lookup?.path ?? []
  for (let i = 0; i + 1 < path.length; i++) {
    const from = frame.envs.find((e) => e.id === path[i])
    if (from?.outer === path[i + 1]) links.push({ from: `env-${path[i]}`, to: `env-${path[i + 1]}`, tone: 'accent', dashed: true })
  }
  return (
    <Panel title="Лексичні оточення" icon="px:matryoshka" hint={frame.lookup ? `шукаємо «${frame.lookup.name}»` : undefined} className="viz-scope">
      <div className="viz-rel">
        {roots.map((r) => (
          <EnvBox key={r.id} env={r} frame={frame} />
        ))}
        {frame.fns.length > 0 ? (
          <div className="viz-fns" aria-label="Функції-об’єкти">
            <span className="viz-fns-title">
              <VizGlyph icon="pi:PiFunctionBold" size={12} /> функції в пам’яті · стрілка = [[Environment]]
            </span>
            <div className="viz-fns-list">
              <AnimatePresence initial={false}>
                {frame.fns.map((fn) => (
                  <m.span key={fn.id} className="viz-fn" data-anchor={`fn-${fn.id}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
                    {fn.label}
                    <span className="viz-fn-env"> → {frame.envs.find((e) => e.id === fn.env)?.name ?? fn.env}</span>
                  </m.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : null}
        <Arrows links={links} />
      </div>
    </Panel>
  )
}

export function ScopeChainViz({ scenario }: VizProps) {
  const data = scopeChainScenarios[scenario] ?? scopeChainScenarios['closure-counter']!
  return <StepPlayer scenario={data} label="Scope chain" side={(f) => <ScopeStage frame={f} />} below={(f) => <ConsolePanel lines={f.output} />} />
}
