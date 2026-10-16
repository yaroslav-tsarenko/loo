import type { IdSource, Level, LearningUnit } from '../model'
import type { BlockContent } from 'mdast'
import type { Callout } from '../parse/nodes'

export interface ExtractContext {
  guideId: string
  chapterId: string
  chapterPath: string
  sectionSlug: string | null
  level: Level | null
  resolveId: (explicit: string | null, basis: string) => { id: string; source: IdSource }
  // authoring problems of a block (content:check, course:check, settings → «Проблеми контенту»)
  report?: (severity: 'warning' | 'error', message: string) => void
}

export interface UnitDefinition {
  type: string
  aliases?: readonly string[]
  extract: (node: Callout, ctx: ExtractContext) => LearningUnit | null
}

// Rendering block: callout → custom mdast node drawn by the UI (not a learning unit)
export interface RenderBlockDefinition {
  type: string
  aliases?: readonly string[]
  transform: (node: Callout) => { node: BlockContent; warnings: string[] }
}

export type CalloutTone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'quiet'

export type CalloutIcon = 'lightbulb' | 'alert' | 'star' | 'flask' | 'messages' | 'octagon' | 'info' | 'check' | 'x' | 'key' | 'quote' | 'zap'

export interface CalloutStyle {
  type: string
  aliases?: readonly string[]
  label: string
  tone: CalloutTone
  icon: CalloutIcon
  collectsKeyPoints?: boolean
}
