'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export interface HowStep {
  title: string
  body: string
  icon: ReactNode
  /** Decorative Loo scene for the step (server-rendered, passed through). */
  scene: ReactNode
}

// «Як це працює» as a scroll story: a pixel path runs down the middle and fills as you scroll, each step reveals once
// and its scene layers drift at different speeds (parallax). One passive scroll listener + rAF writes CSS vars:
//   --fill on the section (0…1 of the path), --o on each step (−1…1: offset of its centre from the viewport centre).
// Without JS (or before hydration) everything is simply visible; reduced motion keeps the reveal but drops movement.
export function HowItWorks({ title, lead, steps }: { title: string; lead: string; steps: readonly HowStep[] }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = ref.current
    const list = root?.querySelector<HTMLElement>('.how-steps')
    if (!root || !list) return
    const items = [...list.querySelectorAll<HTMLElement>('.how-step')]
    root.dataset.js = ''
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const box = list.getBoundingClientRect()
      const fill = Math.min(1, Math.max(0, (vh * 0.6 - box.top) / box.height))
      root.style.setProperty('--fill', fill.toFixed(3))
      for (const el of items) {
        const r = el.getBoundingClientRect()
        const o = (r.top + r.height / 2 - vh / 2) / vh
        el.style.setProperty('--o', Math.min(1, Math.max(-1, o)).toFixed(3))
        if (r.top < vh * 0.85) el.dataset.in = ''
        el.toggleAttribute('data-reached', r.top + r.height * 0.3 < vh * 0.6)
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section ref={ref} className="how" aria-labelledby="landing-how">
      <header className="how-head">
        <h2 id="landing-how" className="landing-h2">
          {title}
        </h2>
        <p className="landing-sub">{lead}</p>
      </header>
      <div className="how-track">
        <span className="how-rail" aria-hidden="true">
          <span className="how-rail-fill" />
        </span>
        <ol className="how-steps">
          {steps.map((s, i) => (
            <li key={s.title} className="how-step" data-side={i % 2 ? 'right' : 'left'} style={{ '--i': i } as CSSProperties}>
              <div className="how-scene" aria-hidden="true">
                {s.scene}
              </div>
              <span className="how-node" aria-hidden="true">
                {i + 1}
              </span>
              <div className="how-text">
                <span className="how-icon" aria-hidden="true">
                  {s.icon}
                </span>
                <span className="how-num">Крок {i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
