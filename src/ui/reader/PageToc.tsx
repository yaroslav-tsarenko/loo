'use client'

import { useEffect, useState } from 'react'
import type { Heading } from '@/content/model'

export function PageToc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.slug ?? null)

  useEffect(() => {
    const elements = headings.map((h) => document.getElementById(h.slug)).filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-56px 0px -70% 0px', threshold: 0 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null
  const shown = headings.slice(0, 40)
  return (
    <nav className="toc" aria-label="На цій сторінці">
      <div className="toc-lines" aria-hidden="true">
        {shown.map((h) => (
          <span key={h.slug} className="toc-line" data-depth={h.depth} data-active={active === h.slug ? '' : undefined} />
        ))}
      </div>
      <div className="toc-panel">
        {shown.map((h) => (
          <a key={h.slug} href={`#${h.slug}`} className="toc-item" data-depth={h.depth} aria-current={active === h.slug ? 'location' : undefined}>
            {h.text}
          </a>
        ))}
      </div>
    </nav>
  )
}
