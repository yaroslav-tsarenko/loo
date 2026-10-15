import type { Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import type { FlashcardUnit } from '../../model'
import { frequencyFrom, levelFrom, readMetaParagraph, splitTags } from '../meta'
import type { UnitDefinition } from '../types'

const QTYPE_KEYS = new Set(['type', 'тип'])

export const questionDefinition: UnitDefinition = {
  type: 'question',
  aliases: ['flashcard', 'card', 'faq'],
  extract(node, ctx) {
    const questionText = toString({ type: 'paragraph', children: node.title }).trim()
    if (!questionText) return null
    const children = node.children as RootContent[]
    const meta = readMetaParagraph(children[0])
    const answerNodes = meta ? children.slice(1) : children
    const flags = meta ? meta.flags.filter((f) => !meta.code.includes(f)) : []
    const explicit = meta?.values.id ?? meta?.code.find((c) => /^[\w.-]+$/.test(c) && /\d/.test(c)) ?? null
    const frequency = frequencyFrom([meta?.values.frequency ?? '', ...flags])
    const level = levelFrom([meta?.values.level ?? '', ...flags]) ?? ctx.level
    const qtypeFromKey = meta ? Object.entries(meta.values).find(([k]) => QTYPE_KEYS.has(k))?.[1] ?? null : null
    const qtype = qtypeFromKey ?? flags.find((f) => f && f.toLowerCase() !== frequency && !levelFrom([f])) ?? null
    const { id, source } = ctx.resolveId(explicit, questionText)
    const answer: Root = { type: 'root', children: answerNodes }
    const unit: FlashcardUnit = {
      id,
      kind: 'flashcard',
      guideId: ctx.guideId,
      chapterId: ctx.chapterId,
      sectionSlug: ctx.sectionSlug,
      level,
      tags: splitTags(meta?.values.tags),
      idSource: source,
      frequency,
      qtype: qtype ? qtype.toLowerCase() : null,
      question: node.title,
      questionText,
      answer,
      origin: 'callout',
      searchText: `${questionText}\n${toString(answer)}`,
    }
    return unit
  },
}
