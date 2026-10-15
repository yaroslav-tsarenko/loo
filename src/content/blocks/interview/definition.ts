import type { Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import type { FlashcardUnit } from '../../model'
import { levelFrom, readMetaParagraph, splitTags } from '../meta'
import type { UnitDefinition } from '../types'

export const interviewDefinition: UnitDefinition = {
  type: 'interview',
  extract(node, ctx) {
    const children = node.children as RootContent[]
    const split = children.findIndex((c) => c.type === 'thematicBreak')
    if (split < 0) return null
    const meta = readMetaParagraph(children[0])
    const questionNodes = children.slice(meta ? 1 : 0, split)
    const titleText = toString({ type: 'paragraph', children: node.title }).trim()
    const questionText = titleText || toString({ type: 'root', children: questionNodes }).trim()
    if (!questionText) return null
    const answer: Root = { type: 'root', children: titleText ? [...questionNodes, ...children.slice(split + 1)] : children.slice(split + 1) }
    const { id, source } = ctx.resolveId(meta?.values.id ?? null, questionText)
    const unit: FlashcardUnit = {
      id,
      kind: 'flashcard',
      guideId: ctx.guideId,
      chapterId: ctx.chapterId,
      sectionSlug: ctx.sectionSlug,
      level: levelFrom([meta?.values.level ?? '']) ?? ctx.level,
      tags: splitTags(meta?.values.tags),
      idSource: source,
      frequency: meta?.values.frequency ?? null,
      qtype: 'співбесіда',
      question: node.title.length > 0 ? node.title : [{ type: 'text', value: questionText }],
      questionText,
      answer,
      origin: 'callout',
      searchText: `${questionText}\n${toString(answer)}`,
    }
    return unit
  },
}
