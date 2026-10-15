import { toString } from 'mdast-util-to-string'
import type { Callout, VizRef } from '../../parse/nodes'
import { readMetaLine } from '../render-meta'
import type { RenderBlockDefinition } from '../types'
import { vizInfo } from './catalog'

export interface VizSpec {
  id: string
  scenario: string | null
  known: boolean
  scenarioKnown: boolean
}

// `> [!viz] event-loop` + optional `> scenario: promise-vs-timeout`; the rest is a caption
export function readVizCallout(node: Callout): { spec: VizSpec; rest: Callout['children'] } {
  const id = toString({ type: 'paragraph', children: node.title }).trim().toLowerCase()
  const { values, rest } = readMetaLine(node)
  const scenario = values.scenario?.trim().toLowerCase() || null
  const info = vizInfo(id)
  const scenarioKnown = scenario === null || Boolean(info?.scenarios.some((s) => s.id === scenario))
  return { spec: { id, scenario, known: Boolean(info), scenarioKnown }, rest }
}

export const vizDefinition: RenderBlockDefinition = {
  type: 'viz',
  aliases: ['visualization', 'візуалізація'],
  transform(node) {
    const { spec, rest } = readVizCallout(node)
    const warnings: string[] = []
    if (!spec.id) warnings.push('[!viz] без id візуалізації')
    else if (!spec.known) warnings.push(`Невідома візуалізація «${spec.id}»`)
    else if (!spec.scenarioKnown) warnings.push(`Візуалізація «${spec.id}» не має сценарію «${spec.scenario}» — показано типовий`)
    const ref: VizRef = { type: 'vizRef', vizId: spec.id, scenario: spec.scenarioKnown ? spec.scenario : null, known: spec.known, children: rest }
    return { node: ref, warnings }
  },
}
