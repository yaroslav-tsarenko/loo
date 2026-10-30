import type { BlockContent, DefinitionContent, Parent, PhrasingContent } from 'mdast'
import type {} from 'mdast-util-to-hast'
import type { Node } from 'unist'

export type CalloutFold = 'open' | 'closed' | null

export interface Callout extends Parent {
  type: 'callout'
  calloutType: string
  fold: CalloutFold
  title: PhrasingContent[]
  children: Array<BlockContent | DefinitionContent>
}

export interface WikiLink extends Node {
  type: 'wikiLink'
  target: string
  heading: string | null
  alias: string | null
  embed: boolean
  width: number | null
}

export interface Tag extends Node {
  type: 'tag'
  value: string
}

export interface Mark extends Parent {
  type: 'mark'
  children: PhrasingContent[]
}

export interface UnitRef extends Node {
  type: 'unitRef'
  unitId: string
}

export interface VizRef extends Parent {
  type: 'vizRef'
  vizId: string
  scenario: string | null
  known: boolean
  children: Array<BlockContent | DefinitionContent>
}

export interface FigureRef extends Parent {
  type: 'figureRef'
  sceneId: string
  scenario: string | null
  device: 'desktop' | 'phone' | 'auto' | null
  known: boolean
  children: Array<BlockContent | DefinitionContent>
}

export interface DiagramRef extends Parent {
  type: 'diagramRef'
  /** parsed `[!diagram]` (src/content/diagram/spec.ts); null when the yaml is missing or invalid */
  spec: import('../diagram/spec').DiagramSpec | null
  error: string | null
  children: Array<BlockContent | DefinitionContent>
}

// A block shown in the source language inside a translated page (src/content/i18n/localize.ts): the translation has
// no such segment yet. `label` is the «not translated yet» note in the reader's UI locale.
export interface I18nFallback extends Parent {
  type: 'i18nFallback'
  lang: string
  label: string
  // the UI locale of `label`
  labelLang: string
  children: Array<BlockContent | DefinitionContent>
}

export interface IdMarker extends Node {
  type: 'idMarker'
  value: string
}

declare module 'mdast' {
  interface RootContentMap {
    callout: Callout
    unitRef: UnitRef
    vizRef: VizRef
    figureRef: FigureRef
    diagramRef: DiagramRef
    idMarker: IdMarker
    i18nFallback: I18nFallback
    wikiLink: WikiLink
    tag: Tag
    mark: Mark
  }
  interface BlockContentMap {
    callout: Callout
    unitRef: UnitRef
    vizRef: VizRef
    figureRef: FigureRef
    diagramRef: DiagramRef
    idMarker: IdMarker
    i18nFallback: I18nFallback
  }
  interface PhrasingContentMap {
    wikiLink: WikiLink
    tag: Tag
    mark: Mark
  }
}
