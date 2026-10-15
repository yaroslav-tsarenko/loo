import type { BlockContent, DefinitionContent, Parent, PhrasingContent } from 'mdast'
import type {} from 'mdast-util-to-hast'

export type CalloutFold = 'open' | 'closed' | null

export interface Callout extends Parent {
  type: 'callout'
  calloutType: string
  fold: CalloutFold
  title: PhrasingContent[]
  children: Array<BlockContent | DefinitionContent>
}

export interface WikiLink {
  type: 'wikiLink'
  target: string
  heading: string | null
  alias: string | null
  embed: boolean
  width: number | null
}

export interface Tag {
  type: 'tag'
  value: string
}

export interface Mark extends Parent {
  type: 'mark'
  children: PhrasingContent[]
}

export interface UnitRef {
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

export interface IdMarker {
  type: 'idMarker'
  value: string
}

declare module 'mdast' {
  interface RootContentMap {
    callout: Callout
    unitRef: UnitRef
    vizRef: VizRef
    figureRef: FigureRef
    idMarker: IdMarker
    wikiLink: WikiLink
    tag: Tag
    mark: Mark
  }
  interface BlockContentMap {
    callout: Callout
    unitRef: UnitRef
    vizRef: VizRef
    figureRef: FigureRef
    idMarker: IdMarker
  }
  interface PhrasingContentMap {
    wikiLink: WikiLink
    tag: Tag
    mark: Mark
  }
}
