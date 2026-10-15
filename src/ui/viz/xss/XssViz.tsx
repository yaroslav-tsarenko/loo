'use client'

import { AnimatePresence, m } from 'motion/react'
import { ConsolePanel, Panel, SPRING } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { xssScenarios, type DomNode, type XssFrame } from './scenarios'

const SINK_LABEL: Record<NonNullable<XssFrame['sink']>['name'], string> = {
  innerHTML: 'innerHTML',
  textContent: 'textContent',
  DOMPurify: 'DOMPurify',
  setHTML: 'setHTML()',
  TrustedHTML: 'TrustedHTML',
}

function UrlBar({ frame }: { frame: XssFrame }) {
  return (
    <div className="viz-xss-url" data-stage={frame.stage} aria-label="Адресний рядок">
      <span aria-hidden="true">🔒</span>
      <span className="viz-xss-host">shop.example/search?q=</span>
      <m.mark key={frame.query} className="viz-xss-payload" initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={SPRING}>
        {frame.query}
      </m.mark>
    </div>
  )
}

function Flow({ frame }: { frame: XssFrame }) {
  const reached = { source: frame.stage !== 'url', q: frame.q !== null, sink: frame.sink !== null }
  return (
    <ol className="viz-xss-flow" aria-label="Шлях даних: source → sink">
      <li data-on={reached.source ? '' : undefined} data-tone="source">
        <span className="viz-xss-flow-kind">source</span>
        <code>location.search</code>
      </li>
      <li aria-hidden="true" className="viz-xss-flow-arrow">
        →
      </li>
      <li data-on={reached.q ? '' : undefined} data-tone="source">
        <span className="viz-xss-flow-kind">змінна</span>
        <code>q</code>
      </li>
      <li aria-hidden="true" className="viz-xss-flow-arrow">
        →
      </li>
      <li data-on={reached.sink ? '' : undefined} data-tone={frame.sink?.tone ?? 'danger'}>
        <span className="viz-xss-flow-kind">sink</span>
        <code>{frame.sink ? SINK_LABEL[frame.sink.name] : '…'}</code>
      </li>
    </ol>
  )
}

function Node({ node }: { node: DomNode }) {
  return (
    <m.li layout="position" className="viz-xss-node" data-tone={node.tone} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={SPRING}>
      {node.tag === '#text' ? (
        <code>
          <span className="viz-xss-tag">#text</span> {node.text}
        </code>
      ) : (
        <code>
          <span className="viz-xss-tag">&lt;{node.tag}</span>
          {node.attrs?.map((a) => (
            <span key={a.name} className="viz-xss-attr" data-danger={a.danger ? '' : undefined} data-removed={a.removed ? '' : undefined}>
              {' '}
              {a.name}=&quot;{a.value}&quot;
            </span>
          ))}
          <span className="viz-xss-tag">&gt;</span>
          {node.text ? (
            <>
              {node.text}
              <span className="viz-xss-tag">&lt;/{node.tag}&gt;</span>
            </>
          ) : null}
        </code>
      )}
      {node.flag ? <span className="viz-xss-flag">{node.flag}</span> : null}
    </m.li>
  )
}

function Tree({ frame }: { frame: XssFrame }) {
  return (
    <Panel title="DOM" emoji="🌳" hint={frame.tree ? 'що побудував браузер' : undefined} className="viz-xss-tree">
      <code className="viz-xss-root">
        <span className="viz-xss-tag">&lt;div id=&quot;results&quot;&gt;</span>
      </code>
      <ul>
        <AnimatePresence initial={false}>
          {(frame.tree ?? []).map((n) => (
            <Node key={`${n.id}-${n.tag}`} node={n} />
          ))}
        </AnimatePresence>
        {frame.tree === null ? <li className="viz-empty">нічого не вставлено</li> : null}
      </ul>
    </Panel>
  )
}

function Preview({ frame }: { frame: XssFrame }) {
  return (
    <Panel title="Сторінка" emoji="🖼️" className="viz-xss-preview" tone={frame.alert ? 'danger' : undefined}>
      <div className="viz-xss-page viz-rel">
        <div className="viz-xss-page-bar">🛍️ shop.example</div>
        <div className="viz-xss-page-body">
          {frame.page.length === 0 ? <span className="viz-empty">результатів ще немає</span> : null}
          {frame.page.map((p, i) =>
            p.kind === 'text' ? (
              <span key={i} className="viz-xss-page-text">
                {p.text}
              </span>
            ) : (
              <span key={i} className="viz-xss-broken" role="img" aria-label="зламане зображення">
                ⛔ x
              </span>
            ),
          )}
        </div>
        <AnimatePresence>
          {frame.alert ? (
            <m.div key="alert" className="viz-xss-alert" role="alertdialog" aria-label="Діалог alert" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={SPRING}>
              <span className="viz-muted">shop.example каже</span>
              <strong>{frame.alert}</strong>
              <span className="viz-xss-ok">OK</span>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
      {frame.verdict ? (
        <m.div key={frame.verdict.text} className="viz-xss-verdict" data-tone={frame.verdict.tone} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
          {frame.verdict.tone === 'danger' ? '💥 ' : frame.verdict.tone === 'blocked' ? '🛑 ' : '✅ '}
          {frame.verdict.text}
        </m.div>
      ) : null}
    </Panel>
  )
}

export function XssViz({ scenario }: VizProps) {
  const data = xssScenarios[scenario] ?? xssScenarios['dom-sink']!
  return (
    <StepPlayer
      scenario={data}
      label="DOM XSS: від source до sink"
      side={(f) => (
        <>
          <UrlBar frame={f} />
          <Flow frame={f} />
          <Tree frame={f} />
        </>
      )}
      below={(f) => (
        <div className="viz-xss-below">
          <Preview frame={f} />
          <ConsolePanel lines={f.output} error={f.error} />
        </div>
      )}
    />
  )
}
