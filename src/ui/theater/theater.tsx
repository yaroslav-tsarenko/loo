'use client'

import type { ReactNode } from 'react'
import { figureInfo, figureScenario } from '@/content/blocks/figure/catalog'
import { TheaterStage } from './stage'
import type { TheaterDevice } from './types'

export interface TheaterProps {
  figure: string
  scenario?: string | null
  device?: TheaterDevice | null
  caption?: ReactNode
  autoPlay?: boolean
  loop?: boolean
  showSteps?: boolean
  className?: string
}

// Public entry: a scripted figure from the catalog (see content/blocks/figure/catalog.ts).
export function Theater({ figure, scenario = null, device = null, caption, autoPlay = true, loop = true, showSteps = false, className }: TheaterProps) {
  const info = figureInfo(figure)
  if (!info) return null
  const meta = figureScenario(info, scenario)
  return (
    <TheaterStage
      key={meta.id}
      sceneId={info.id}
      scenario={meta.id}
      device={device ?? info.device}
      url={info.url}
      title={`${info.title}: ${meta.description}`}
      caption={caption}
      autoPlay={autoPlay}
      loop={loop}
      showSteps={showSteps}
      className={className}
    />
  )
}
