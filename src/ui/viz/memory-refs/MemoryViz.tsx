'use client'

import { ConsolePanel } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { MemoryStage } from './MemoryStage'
import { memoryScenarios } from './scenarios'

export function MemoryViz({ scenario }: VizProps) {
  const data = memoryScenarios[scenario] ?? memoryScenarios['copy-primitive-vs-object']!
  return <StepPlayer scenario={data} label="Значення і посилання" side={(f) => <ConsolePanel lines={f.output} />} below={(f) => <MemoryStage frame={f} />} />
}
