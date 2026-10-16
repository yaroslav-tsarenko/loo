'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { diagramFrames, type DiagramEdge, type DiagramFrame, type DiagramNode, type DiagramSpec } from '@/content/diagram/spec'
import { Icon } from '@/ui/icons'
import { ZoomPan } from './ZoomPan'

// `[!diagram]` figure: boxes and arrows laid out by HTML/CSS (src/app/diagram.css) and played step by step — nodes
// appear, values travel along arrows into the next box, the running code line lights up, variables change in place,
// and every step says in words what just happened. Plays by itself while on screen (one at a time is enough: it
// pauses off-screen), stops for good once the reader takes the controls; reduced motion → manual only.

const STEP_MS = 2600
const END_PAUSE_MS = 4000

type Ctx = { frame: DiagramFrame; edges: readonly DiagramEdge[]; step: number }

function CodeLines({ code, lines }: { code: string; lines: readonly number[] | undefined }) {
  return (
    <code className="dg-code">
      {code.split('\n').map((l, i) => (
        <span key={i} className="dg-line" data-on={lines?.includes(i + 1) ? '' : undefined}>
          {l || ' '}
        </span>
      ))}
    </code>
  )
}

function Box({ node, ctx, children }: { node: DiagramNode; ctx: Ctx; children?: ReactNode }) {
  const { frame } = ctx
  const shown = frame.visible.has(node.id)
  const text = frame.texts.get(node.id) ?? node.text
  const incoming = frame.moves.filter((m) => m.to === node.id)
  return (
    <div className="dg-node" data-tone={node.tone ?? 'violet'} data-shown={shown ? '' : undefined} data-focus={frame.focus.has(node.id) ? '' : undefined} aria-hidden={shown ? undefined : true}>
      {node.label ? <span className="dg-label">{node.label}</span> : null}
      {node.icon || text || node.code ? (
        <span className="dg-body">
          {node.icon ? <Icon name={node.icon} size={24} className="dg-icon" /> : null}
          {node.code ? (
            <CodeLines code={node.code} lines={frame.lines.get(node.id)} />
          ) : text ? (
            // keyed by value: a new value pops in
            <span key={text} className="dg-text" data-changed={frame.texts.has(node.id) ? '' : undefined}>
              {text}
            </span>
          ) : null}
        </span>
      ) : null}
      {node.note ? <span className="dg-note">{node.note}</span> : null}
      {incoming.map((m, i) => (
        <span key={`${ctx.step}-${i}`} className="dg-arrive" style={{ '--d': `${i * 120}ms` } as CSSProperties}>
          {m.value}
        </span>
      ))}
      {children}
    </div>
  )
}

function Arrow({ edge, ctx, dir }: { edge: DiagramEdge; ctx: Ctx; dir: 'x' | 'y' }) {
  const shown = ctx.frame.visible.has(edge.from) && ctx.frame.visible.has(edge.to)
  const moving = ctx.frame.moves.filter((m) => (m.from === edge.from && m.to === edge.to) || (m.from === edge.to && m.to === edge.from))
  return (
    <span className="dg-arrow" data-dir={dir} data-shown={shown ? '' : undefined} data-live={moving.length ? '' : undefined} data-tone={edge.tone} data-dashed={edge.dashed ? '' : undefined} aria-hidden="true">
      <i />
      {edge.label ? <span className="dg-arrow-label">{edge.label}</span> : null}
      {moving.map((m, i) => (
        <span key={`${ctx.step}-${i}`} className="dg-chip" data-back={m.from === edge.to ? '' : undefined}>
          {m.value}
        </span>
      ))}
    </span>
  )
}

const edgeBetween = (edges: readonly DiagramEdge[], a: string, b: string) => edges.find((e) => e.from === a && e.to === b) ?? edges.find((e) => e.from === b && e.to === a)

// flow (left → right, vertical on phones) and stack (top → bottom): arrows between neighbours
function Sequence({ nodes, ctx, kind }: { nodes: readonly DiagramNode[]; ctx: Ctx; kind: 'flow' | 'stack' }) {
  const explicit = ctx.edges.length > 0
  return (
    <div className={`dg-seq dg-${kind}`}>
      {nodes.map((n, i) => {
        const prev = nodes[i - 1]
        const edge = prev ? (edgeBetween(ctx.edges, prev.id, n.id) ?? (explicit ? undefined : { from: prev.id, to: n.id })) : undefined
        return (
          <div key={n.id} className="dg-seq-item">
            {edge ? <Arrow edge={edge} ctx={ctx} dir={kind === 'flow' ? 'x' : 'y'} /> : prev ? <span className="dg-gap" /> : null}
            <Box node={n} ctx={ctx} />
          </div>
        )
      })}
    </div>
  )
}

function Tree({ nodes, ctx, parent, nest }: { nodes: readonly DiagramNode[]; ctx: Ctx; parent: string | undefined; nest: boolean }) {
  const kids = nodes.filter((n) => n.parent === parent)
  if (kids.length === 0) return null
  if (nest) {
    return (
      <div className="dg-nest-kids">
        {kids.map((n) => (
          <Box key={n.id} node={n} ctx={ctx}>
            <Tree nodes={nodes} ctx={ctx} parent={n.id} nest />
          </Box>
        ))}
      </div>
    )
  }
  return (
    <ul className="dg-tree">
      {kids.map((n) => (
        <li key={n.id}>
          <Box node={n} ctx={ctx} />
          <Tree nodes={nodes} ctx={ctx} parent={n.id} nest={false} />
        </li>
      ))}
    </ul>
  )
}

function Compare({ spec, ctx }: { spec: DiagramSpec; ctx: Ctx }) {
  const keys = spec.columns ? Object.keys(spec.columns) : [...new Set(spec.nodes.map((n) => n.col ?? '·'))]
  return (
    <div className="dg-compare" style={{ '--cols': keys.length } as CSSProperties}>
      {keys.map((k) => (
        <div key={k} className="dg-col">
          {spec.columns?.[k] ? <span className="dg-col-head">{spec.columns[k]}</span> : null}
          <Sequence nodes={spec.nodes.filter((n) => (n.col ?? '·') === k)} ctx={ctx} kind="stack" />
        </div>
      ))}
    </div>
  )
}

function Timeline({ nodes, ctx }: { nodes: readonly DiagramNode[]; ctx: Ctx }) {
  return (
    <ol className="dg-timeline">
      {nodes.map((n) => (
        <li key={n.id} data-shown={ctx.frame.visible.has(n.id) ? '' : undefined}>
          <span className="dg-tick">{n.at ?? ''}</span>
          <Box node={n} ctx={ctx} />
        </li>
      ))}
    </ol>
  )
}

// Autoplay while ≥ 45% visible; `manual` once the reader touches the controls.
function useAutoplay(ref: React.RefObject<HTMLElement | null>, count: number, step: number, setStep: (n: number) => void, manual: boolean, remount: unknown) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || count < 2 || manual || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => setVisible(Boolean(e?.isIntersecting)), { threshold: 0.45 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, count, manual, remount])
  const playing = visible && !manual && count > 1
  useEffect(() => {
    if (!playing) return
    const last = step >= count - 1
    const t = setTimeout(() => setStep(last ? 0 : step + 1), last ? END_PAUSE_MS : STEP_MS)
    return () => clearTimeout(t)
  }, [playing, step, count, setStep])
  return playing
}

export function Diagram({ spec, children }: { spec: DiagramSpec; children?: ReactNode }) {
  const frames = useMemo(() => diagramFrames(spec), [spec])
  const [step, setStep] = useState(0)
  const [manual, setManual] = useState(false)
  const [expanded, setExpanded] = useState(false)
  // height the figure had in the article: a placeholder keeps it while the figure is shown full screen
  const [inlineHeight, setInlineHeight] = useState(0)
  const expand = (open: boolean) => {
    if (open) setInlineHeight(ref.current?.offsetHeight ?? 0)
    setExpanded(open)
  }
  const ref = useRef<HTMLElement>(null)
  const stepped = frames.length > 1
  const playing = useAutoplay(ref, frames.length, step, setStep, manual, expanded)
  const frame = frames[Math.min(step, frames.length - 1)]!
  const ctx: Ctx = { frame, edges: spec.edges ?? [], step }
  const go = (to: number) => {
    setManual(true)
    setStep(Math.max(0, Math.min(frames.length - 1, to)))
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(step + 1)
    else if (e.key === 'ArrowLeft') go(step - 1)
    else return
    e.preventDefault()
  }
  // full screen: Esc closes, the page underneath doesn't scroll
  useEffect(() => {
    if (!expanded) return
    const onEsc = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setExpanded(false)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onEsc)
    }
  }, [expanded])
  const roots = spec.layout === 'tree' || spec.layout === 'nest'
  const body =
    spec.layout === 'compare' ? (
      <Compare spec={spec} ctx={ctx} />
    ) : spec.layout === 'timeline' ? (
      <Timeline nodes={spec.nodes} ctx={ctx} />
    ) : roots ? (
      <div className={`dg-${spec.layout}-root`}>
        <Tree nodes={spec.nodes} ctx={ctx} parent={undefined} nest={spec.layout === 'nest'} />
      </div>
    ) : (
      <Sequence nodes={spec.nodes} ctx={ctx} kind={spec.layout === 'stack' ? 'stack' : 'flow'} />
    )
  // edges between non-neighbours can't be drawn as arrows in a sequence: list them under the picture
  const order = (id: string) => spec.nodes.findIndex((n) => n.id === id)
  const extra = spec.layout === 'flow' || spec.layout === 'stack' ? (spec.edges ?? []).filter((e) => Math.abs(order(e.from) - order(e.to)) > 1) : []
  const name = (id: string) => {
    const n = spec.nodes.find((x) => x.id === id)
    return n?.label ?? n?.text ?? id
  }
  const figure = (
    <figure ref={ref} className="dg" data-layout={spec.layout} data-playing={playing ? '' : undefined} data-expanded={expanded ? '' : undefined} role={expanded ? 'dialog' : undefined} aria-modal={expanded ? true : undefined} tabIndex={stepped ? 0 : undefined} onKeyDown={stepped ? onKey : undefined} aria-label={spec.title || undefined}>
      <ZoomPan key={expanded ? 'full' : 'inline'} expanded={expanded} onExpand={expand} head={<div className="dg-title">{spec.title}</div>}>
        <div className="dg-canvas">{body}</div>
      </ZoomPan>
      {extra.length > 0 ? (
        <ul className="dg-links">
          {extra.map((e, i) => (
            <li key={i} data-shown={frame.visible.has(e.from) && frame.visible.has(e.to) ? '' : undefined}>
              {name(e.from)} → {name(e.to)}
              {e.label ? `: ${e.label}` : ''}
            </li>
          ))}
        </ul>
      ) : null}
      {stepped ? (
        <div className="dg-steps">
          <p className="dg-step-note" aria-live={playing ? 'off' : 'polite'}>
            <span className="dg-step-num">{step + 1}</span>
            <span key={step} className="dg-step-text">
              {frame.note ?? ''}
            </span>
          </p>
          <div className="dg-progress" aria-hidden="true">
            <i key={`${step}-${playing}`} data-run={playing ? '' : undefined} style={{ '--dur': `${step >= frames.length - 1 ? END_PAUSE_MS : STEP_MS}ms` } as CSSProperties} />
          </div>
          <div className="dg-controls">
            <button type="button" className="lu-btn" data-variant="ghost" data-size="sm" onClick={() => go(step - 1)} disabled={step === 0}>
              <span className="lu-btn-content">
                <span className="lu-btn-label">Назад</span>
              </span>
            </button>
            <span className="dg-dots" aria-label={`Крок ${step + 1} з ${frames.length}`}>
              {frames.map((_, i) => (
                <button key={i} type="button" className="dg-dot" data-on={i === step ? '' : undefined} data-done={i < step ? '' : undefined} onClick={() => go(i)} aria-label={`Крок ${i + 1}`} />
              ))}
            </span>
            <button type="button" className="lu-btn" data-size="sm" onClick={() => go(step + 1 >= frames.length ? 0 : step + 1)}>
              <span className="lu-btn-content">
                <span className="lu-btn-label">{step + 1 >= frames.length ? 'Спочатку' : 'Далі'}</span>
              </span>
            </button>
          </div>
        </div>
      ) : null}
      {children ? <figcaption className="dg-caption">{children}</figcaption> : null}
    </figure>
  )
  // Full screen goes through a portal: an ancestor with its own stacking context / containing block (the reader
  // column) would otherwise trap `position: fixed`.
  if (expanded && typeof document !== 'undefined') {
    return (
      <>
        <div className="dg-placeholder" style={{ height: inlineHeight }} aria-hidden="true" />
        {createPortal(
          <>
            <div className="dg-scrim" onClick={() => setExpanded(false)} aria-hidden="true" />
            {figure}
          </>,
          document.body,
        )}
      </>
    )
  }
  return figure
}
