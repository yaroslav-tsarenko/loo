import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FIGURE_CATALOG } from '@/content/blocks/figure/catalog'
import { DIAGRAM_EXAMPLES } from '@/content/diagram/examples'
import { parseDiagram } from '@/content/diagram/spec'
import { Diagram } from '@/ui/diagram/Diagram'
import { VIZ_CATALOG } from '@/content/blocks/viz/catalog'
import { Icon } from '@/ui/icons/Icon'
import { CalloutIcon } from '@/ui/markdown/CalloutIcon'
import { FigureBlock } from '@/ui/theater/FigureBlock'
import { VizBlock } from '@/ui/viz/VizBlock'

export const metadata: Metadata = { title: 'Візуалізації' }

// Dev-only gallery of every [!viz] id and scenario. Does not touch the vault or DB.
export default function VizShowcasePage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <div className="page">
      <h1 className="page-title">Візуалізації</h1>
      <p className="page-lead">
        Усі <code>[!viz]</code> і сценарії для візуальної перевірки. Сторінка доступна лише в dev-режимі.
      </p>
      <nav className="viz-showcase-toc" aria-label="Візуалізації">
        {VIZ_CATALOG.map((v) => (
          <a key={v.id} className="viz-chip" href={`#${v.id}`}>
            <Icon name={v.icon} size={16} /> {v.id}
          </a>
        ))}
        {FIGURE_CATALOG.map((f) => (
          <a key={f.id} className="viz-chip" href={`#figure-${f.id}`}>
            <Icon name={f.icon} size={16} /> {f.id}
          </a>
        ))}
        <a className="viz-chip" href="#reel">
          <Icon name="px:bolt" size={16} /> reel
        </a>
      </nav>
      <div className="prose-read">
        <h2 className="viz-showcase-part" id="diagrams">
          Діаграми [!diagram]
        </h2>
        {DIAGRAM_EXAMPLES.map((d) => {
          const r = parseDiagram(d.title, d.yaml)
          return r.ok ? <Diagram key={d.title} spec={r.spec} /> : <p key={d.title}>Помилка: {r.error}</p>
        })}
        {VIZ_CATALOG.map((v) => (
          <section key={v.id} id={v.id} className="viz-showcase-section">
            <h2 className="viz-showcase-h">
              <Icon name={v.icon} size={24} /> {v.title}
            </h2>
            <p className="viz-muted">{v.description}</p>
            {v.scenarios.map((s, i) => (
              <div key={s.id}>
                <p className="viz-showcase-meta">
                  <code>
                    [!viz] {v.id} · scenario: {s.id}
                  </code>
                  {i === 0 ? ' · типовий' : null} · {s.mode === 'steps' ? 'покроковий' : 'інтерактивний'}
                </p>
                <VizBlock vizId={v.id} scenario={s.id} fixed />
              </div>
            ))}
          </section>
        ))}
        <h2 className="viz-showcase-part">Сцени [!figure]</h2>
        {FIGURE_CATALOG.map((f) => (
          <section key={f.id} id={`figure-${f.id}`} className="viz-showcase-section">
            <h2 className="viz-showcase-h">
              <Icon name={f.icon} size={24} /> {f.title}
            </h2>
            <p className="viz-muted">{f.description}</p>
            {f.scenarios.map((s, i) => (
              <div key={s.id}>
                <p className="viz-showcase-meta">
                  <code>
                    [!figure] {f.id} · scenario: {s.id}
                  </code>
                  {i === 0 ? ' · типовий' : null}
                </p>
                <FigureBlock scene={f.id} scenario={s.id}>
                  <p>{s.description}</p>
                </FigureBlock>
              </div>
            ))}
          </section>
        ))}
        <section id="reel" className="viz-showcase-section">
          <h2 className="viz-showcase-h">
            <Icon name="px:bolt" size={24} /> [!reel]
          </h2>
          <aside className="callout" data-tone="accent" data-type="reel">
            <CalloutIcon name="zap" />
            <div className="callout-content">
              <div className="callout-title">typeof null — це баг віком 30 років</div>
              <div className="callout-body">
                <p>
                  У першій реалізації JS значення мали тег типу, і тег об’єкта був <code>000</code>. <code>null</code> — нульовий вказівник — теж мав <code>000</code>.
                </p>
              </div>
            </div>
          </aside>
        </section>
        <section id="unknown" className="viz-showcase-section">
          <h2>Невідомий id</h2>
          <p className="viz-showcase-meta">
            <code>[!viz] does-not-exist</code>
          </p>
          <VizBlock vizId="does-not-exist">
            <p>Текст автора всередині блоку не губиться.</p>
          </VizBlock>
        </section>
      </div>
    </div>
  )
}
