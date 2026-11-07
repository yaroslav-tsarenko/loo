import type { Metadata } from 'next'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { notFound } from 'next/navigation'
import { extractDiagrams } from '@/content/diagram/extract'
import { parseDiagram } from '@/content/diagram/spec'
import { Diagram } from '@/ui/diagram/Diagram'

export const metadata: Metadata = { title: 'Усі схеми' }

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

// Dev-only: every [!diagram] from the synced content on one page, for visual QA (fit, overflow, steps).
export default function AllDiagramsPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  const root = join(process.cwd(), 'content', 'Guides')
  const items = walk(root)
    .sort()
    .flatMap((file) => extractDiagrams(readFileSync(file, 'utf8')).map((d) => ({ file: relative(root, file), ...d })))
  return (
    <div className="page">
      <h1 className="page-title">Усі схеми · {items.length}</h1>
      <p className="page-lead">
        Кожен <code>[!diagram]</code> зі статей (content/Guides після <code>pnpm content:sync</code>). Лише dev-режим.
      </p>
      <div className="prose-read">
        {items.map((d, i) => {
          const r = d.yaml ? parseDiagram(d.title, d.yaml) : null
          return (
            <section key={`${d.file}:${d.line}`} className="dg-gallery-item" data-file={d.file} data-index={i}>
              <p className="viz-showcase-meta">
                <code>
                  {d.file}:{d.line}
                </code>
              </p>
              {r?.ok ? <Diagram spec={r.spec} /> : <p>Помилка: {r ? r.error : 'немає yaml'}</p>}
            </section>
          )
        })}
      </div>
    </div>
  )
}
