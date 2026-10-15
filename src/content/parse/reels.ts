import { createHash } from 'node:crypto'
import type { Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import type { Callout } from './nodes'

// [!reel] micro-facts collected from chapters for the vertical feed (see LEARNING_PLAYBOOK §4).
export const REEL_TYPES = new Set(['reel', 'fact', 'фішка'])

export interface Reel {
  id: string
  guideId: string
  chapterId: string
  sectionSlug: string | null
  emoji: string | null
  title: string
  body: Root
  text: string
}

// Leading emoji run, including combos like «🐌→🚀».
const LEADING_EMOJI = /^\s*((?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:\u{FE0F}|\u{200D}\p{Extended_Pictographic}|\s*[→←↔⇒➡️]\s*\p{Extended_Pictographic}|\p{Extended_Pictographic})*)\s*/u

export function collectReels(root: Root, guideId: string, chapterId: string): Reel[] {
  const out: Reel[] = []
  let sectionSlug: string | null = null
  const walk = (children: readonly RootContent[]) => {
    for (const node of children) {
      if (node.type === 'heading' && node.depth === 2) sectionSlug = (node.data?.hProperties as { id?: string } | undefined)?.id ?? null
      if (node.type === 'callout') {
        const callout = node as Callout
        if (REEL_TYPES.has(callout.calloutType)) {
          const raw = toString({ type: 'paragraph', children: callout.title }).trim()
          const emoji = LEADING_EMOJI.exec(raw)?.[1] ?? null
          const title = emoji ? raw.slice(LEADING_EMOJI.exec(raw)![0].length) : raw
          const body: Root = { type: 'root', children: callout.children as RootContent[] }
          const id = `reel-${createHash('sha1').update(`${chapterId}|${title}`).digest('hex').slice(0, 12)}`
          out.push({ id, guideId, chapterId, sectionSlug, emoji, title, body, text: toString(body).trim() })
          continue
        }
        walk(callout.children as RootContent[])
      }
    }
  }
  walk(root.children)
  return out
}
