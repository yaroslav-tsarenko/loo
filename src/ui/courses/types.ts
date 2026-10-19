// View models for the course UI (serializable; built on the server, rendered by client components).

export type CPState = 'done' | 'current' | 'open' | 'locked'

export interface CPNode {
  id: string
  type: 'lesson' | 'test' | 'exam'
  kind: string
  // icon ref for <Icon name> (src/content/icons.ts)
  icon: string
  title: string
  href: string
  minutes: number
  size: number
  done: boolean
  skipped: boolean
  current: boolean
  optional: boolean
  challenge: boolean
  perfect: boolean
  bestScore: number | null
}

export interface CPTopic {
  id: string
  chapterId: string
  number: number
  title: string
  icon: string
  theoryHref: string | null
  crowns: number
  ratio: number
  next: string | null
  state: CPState
  done: number
  total: number
  minutes: number
  counts: { quizzes: string; cards: string; tasks: string }
  nodes: CPNode[]
}

export interface CPSection {
  id: string
  index: number
  title: string
  icon: string | null
  description: string | null
  kind: 'path' | 'practice'
  // course.yaml `status: planned`: «скоро», no topics yet
  planned: boolean
  levelLabel: string
  state: CPState
  known: 'placement' | 'exam' | null
  ratio: number
  done: number
  total: number
  topics: CPTopic[]
  exam: CPNode | null
  // «Перескочити розділ» is available
  testOut: boolean
  // locked / credited sections ship their topics without lesson nodes (page weight); the client loads them on demand
  lazy?: boolean
}
