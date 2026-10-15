'use client'

import type { ReactNode } from 'react'
import { figureInfo, figureScenario } from '@/content/blocks/figure/catalog'
import { Theater } from './theater'
import type { TheaterDevice } from './types'

// [!figure] in markdown → a scripted scene in a device frame with the author's caption.
export function FigureBlock({ scene, scenario = null, device = null, children }: { scene: string; scenario?: string | null; device?: TheaterDevice | null; children?: ReactNode }) {
  const info = figureInfo(scene)
  if (!info) {
    return (
      <aside className="callout" data-tone="quiet" data-type="figure">
        <div className="callout-content">
          <div className="callout-title">Сцену «{scene}» не знайдено</div>
          {children ? <div className="callout-body">{children}</div> : null}
        </div>
      </aside>
    )
  }
  const meta = figureScenario(info, scenario)
  return (
    <div className="th-figure" data-figure={info.id}>
      <Theater figure={info.id} scenario={meta.id} device={device} caption={children ?? undefined} />
    </div>
  )
}
