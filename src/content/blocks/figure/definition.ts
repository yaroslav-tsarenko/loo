import { toString } from 'mdast-util-to-string'
import type { Callout, FigureRef } from '../../parse/nodes'
import { readMetaLine } from '../render-meta'
import type { RenderBlockDefinition } from '../types'
import { figureInfo, type FigureDevice } from './catalog'

const DEVICES: readonly FigureDevice[] = ['desktop', 'phone', 'auto']

export interface FigureSpec {
  id: string
  scenario: string | null
  device: FigureDevice | null
  known: boolean
  scenarioKnown: boolean
}

// `> [!figure] devtools-console` + optional `> scenario: promise-order · device: desktop`
export function readFigureCallout(node: Callout): { spec: FigureSpec; rest: Callout['children'] } {
  const id = toString({ type: 'paragraph', children: node.title }).trim().toLowerCase()
  const { values, rest } = readMetaLine(node)
  const scenario = values.scenario?.trim().toLowerCase() || null
  const rawDevice = values.device?.trim().toLowerCase() ?? null
  const device = rawDevice && (DEVICES as readonly string[]).includes(rawDevice) ? (rawDevice as FigureDevice) : null
  const info = figureInfo(id)
  const scenarioKnown = scenario === null || Boolean(info?.scenarios.some((s) => s.id === scenario))
  return { spec: { id, scenario, device, known: Boolean(info), scenarioKnown }, rest }
}

export const figureDefinition: RenderBlockDefinition = {
  type: 'figure',
  aliases: ['scene', 'сцена'],
  transform(node) {
    const { spec, rest } = readFigureCallout(node)
    const warnings: string[] = []
    if (!spec.id) warnings.push('[!figure] без id сцени')
    else if (!spec.known) warnings.push(`Невідома сцена «${spec.id}»`)
    else if (!spec.scenarioKnown) warnings.push(`Сцена «${spec.id}» не має сценарію «${spec.scenario}» — показано типовий`)
    const ref: FigureRef = { type: 'figureRef', sceneId: spec.id, scenario: spec.scenarioKnown ? spec.scenario : null, device: spec.device, known: spec.known, children: rest }
    return { node: ref, warnings }
  },
}
