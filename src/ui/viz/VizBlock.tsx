'use client'

import { LazyMotion, MotionConfig, domMax } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { vizInfo, vizScenario } from '@/content/blocks/viz/catalog'
import { Icon } from '@/ui/icons/Icon'
import { VIZ_COMPONENTS } from './components'

interface Props {
  vizId: string
  scenario?: string | null
  children?: ReactNode
  // showcase: hide the scenario switcher and render exactly `scenario`
  fixed?: boolean
}

export function VizBlock({ vizId, scenario = null, children, fixed = false }: Props) {
  const info = vizInfo(vizId)
  const [current, setCurrent] = useState(() => (info ? vizScenario(info, scenario).id : ''))
  const Component = VIZ_COMPONENTS[vizId]
  if (!info || !Component) {
    return (
      <aside className="callout" data-tone="quiet" data-type="viz">
        <div className="callout-content">
          <div className="callout-title">Візуалізацію «{vizId}» не знайдено</div>
          {children ? <div className="callout-body">{children}</div> : null}
        </div>
      </aside>
    )
  }
  const active = vizScenario(info, current)
  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">
        <figure className="viz-figure" data-viz={info.id} aria-label={`Візуалізація: ${info.title}`}>
          <div className="viz">
            <header className="viz-head">
              <span className="viz-emoji" aria-hidden="true">
                <Icon name={info.icon} size={26} />
              </span>
              <div className="viz-head-text">
                <h4 className="viz-title">{info.title}</h4>
                <p className="viz-subtitle">{active.description}</p>
              </div>
            </header>
            {!fixed && info.scenarios.length > 1 ? (
              <div className="viz-scenarios" role="group" aria-label="Сценарії">
                {info.scenarios.map((s) => (
                  <button key={s.id} type="button" className="viz-chip" aria-pressed={s.id === active.id} onClick={() => setCurrent(s.id)}>
                    {s.title}
                  </button>
                ))}
              </div>
            ) : null}
            <Component key={active.id} scenario={active.id} />
          </div>
          <figcaption className={children ? 'viz-figcaption' : 'sr-only'}>{children ?? `${info.title}: ${active.description}`}</figcaption>
        </figure>
      </MotionConfig>
    </LazyMotion>
  )
}
