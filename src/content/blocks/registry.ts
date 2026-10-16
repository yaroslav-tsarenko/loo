import { diagramDefinition } from './diagram/definition'
import { exampleStyle } from './example/style'
import { figureDefinition } from './figure/definition'
import { importantStyle } from './important/style'
import { interviewDefinition } from './interview/definition'
import { interviewStyle } from './interview/style'
import { noteStyle } from './note/style'
import { failureStyle, successStyle } from './outcome/style'
import { pitfallStyle } from './pitfall/style'
import { questionDefinition } from './question/definition'
import { quizDefinition } from './quiz/definition'
import { reelStyle } from './reel/style'
import { solutionStyle } from './solution/style'
import { taskDefinition } from './task/definition'
import { tipStyle } from './tip/style'
import type { CalloutStyle, RenderBlockDefinition, UnitDefinition } from './types'
import { vizDefinition } from './viz/definition'
import { warningStyle } from './warning/style'

const unitDefinitions: readonly UnitDefinition[] = [questionDefinition, quizDefinition, taskDefinition, interviewDefinition]

const renderBlocks: readonly RenderBlockDefinition[] = [vizDefinition, figureDefinition, diagramDefinition]

const calloutStyles: readonly CalloutStyle[] = [
  tipStyle,
  warningStyle,
  importantStyle,
  exampleStyle,
  interviewStyle,
  pitfallStyle,
  noteStyle,
  successStyle,
  failureStyle,
  solutionStyle,
  reelStyle,
]

function index<T extends { type: string; aliases?: readonly string[] }>(items: readonly T[]): Map<string, T> {
  const map = new Map<string, T>()
  for (const item of items) {
    map.set(item.type, item)
    for (const alias of item.aliases ?? []) if (!map.has(alias)) map.set(alias, item)
  }
  return map
}

const unitsByType = index(unitDefinitions)
const stylesByType = index(calloutStyles)
const renderBlocksByType = index(renderBlocks)

export function unitDefinitionFor(type: string): UnitDefinition | undefined {
  return unitsByType.get(type)
}

export function renderBlockFor(type: string): RenderBlockDefinition | undefined {
  return renderBlocksByType.get(type)
}

export function calloutStyleFor(type: string): CalloutStyle {
  return stylesByType.get(type) ?? { type, label: type.charAt(0).toUpperCase() + type.slice(1), tone: 'quiet', icon: type === 'quote' || type === 'cite' ? 'quote' : 'info' }
}

export function unitCalloutTypes(): Set<string> {
  return new Set(unitsByType.keys())
}
