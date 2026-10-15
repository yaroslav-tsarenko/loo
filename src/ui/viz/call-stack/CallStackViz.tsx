'use client'

import { ConsolePanel } from '../engine/Panel'
import { StackPanel } from '../engine/StackPanel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { callStackScenarios } from './scenarios'

export function CallStackViz({ scenario }: VizProps) {
  const data = callStackScenarios[scenario] ?? callStackScenarios['nested-calls']!
  return (
    <StepPlayer
      scenario={data}
      label="Call Stack"
      side={(f) => <StackPanel stack={f.stack} returning={f.returning} hidden={f.hidden} error={f.error} />}
      below={(f) => <ConsolePanel lines={f.output} error={f.error} />}
    />
  )
}
