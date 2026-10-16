import type { ListItem, Paragraph, PhrasingContent, Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import type { FlashcardUnit, WordExample, WordSpec } from '../../model'
import { FieldBag, boldWords, ipaOf, readFields, splitTranslation } from '../lang/fields'
import { levelFrom, splitTags } from '../meta'
import type { UnitDefinition } from '../types'

// `> [!word] apple` — a vocabulary SRS card (docs/LANGUAGE_COURSE.md). Front: the word, audio, IPA; back: translation,
// examples, forms, note. It is a flashcard for the engine (FSRS, XP, «Слова»), qtype «слово».

export const WORD_QTYPE = 'слово'

const KEYS = new Set(['ipa', 'ipa-us', 'pos', 'level', 'id', 'uk', 'tr', 'translation', 'example', 'forms', 'note', 'tags', 'lang'])

const text = (value: string): PhrasingContent => ({ type: 'text', value })
const para = (...children: PhrasingContent[]): Paragraph => ({ type: 'paragraph', children })

// Plain markdown of the back side: what any generic card view (feed, search) shows; WordCard renders WordSpec itself.
function answerRoot(spec: WordSpec, rest: RootContent[]): Root {
  const children: RootContent[] = []
  if (spec.translations.length > 0) children.push(para({ type: 'strong', children: [text(spec.translations.join('; '))] }))
  if (spec.examples.length > 0) {
    const items: ListItem[] = spec.examples.map((e) => ({ type: 'listItem', spread: false, children: [para(text(e.tr ? `${e.en} — ${e.tr}` : e.en))] }))
    children.push({ type: 'list', ordered: false, spread: false, children: items })
  }
  if (spec.forms) children.push(para({ type: 'emphasis', children: [text(spec.forms)] }))
  if (spec.note) children.push(para(text(spec.note)))
  return { type: 'root', children: [...children, ...rest] }
}

export const wordDefinition: UnitDefinition = {
  type: 'word',
  aliases: ['слово', 'vocab'],
  extract(node, ctx) {
    const word = toString({ type: 'paragraph', children: node.title }).trim()
    if (!word) {
      ctx.report?.('error', '[!word] без слова в заголовку')
      return null
    }
    const { fields, rest } = readFields(node.children as RootContent[], KEYS)
    const f = new FieldBag(fields)
    const translations = (f.text('uk', 'tr', 'translation') ?? '')
      .split(';')
      .map((t) => t.trim())
      .filter(Boolean)
    const examples: WordExample[] = f.all('example').map((e) => {
      const [en, tr] = splitTranslation(e.text)
      return { en, tr, bold: boldWords(e.phrasing) }
    })
    const spec: WordSpec = {
      word,
      ipa: ipaOf(f.text('ipa')),
      ipaUs: ipaOf(f.text('ipa-us')),
      pos: f.text('pos'),
      translations,
      examples,
      forms: f.text('forms'),
      note: f.text('note'),
    }
    if (translations.length === 0) ctx.report?.('warning', `[!word] «${word}»: немає перекладу (uk:)`)
    if (!spec.ipa) ctx.report?.('warning', `[!word] «${word}»: немає транскрипції (ipa:)`)
    const { id, source } = ctx.resolveId(f.text('id'), `word:${word}`)
    const answer = answerRoot(spec, rest)
    const unit: FlashcardUnit = {
      id,
      kind: 'flashcard',
      guideId: ctx.guideId,
      chapterId: ctx.chapterId,
      sectionSlug: ctx.sectionSlug,
      level: levelFrom([f.text('level') ?? '']) ?? ctx.level,
      tags: splitTags(f.text('tags') ?? undefined),
      idSource: source,
      frequency: null,
      qtype: WORD_QTYPE,
      question: node.title,
      questionText: word,
      answer,
      origin: 'callout',
      word: spec,
      ...(f.text('lang') ? { lang: f.text('lang')! } : {}),
      searchText: `${word}\n${translations.join('; ')}\n${examples.map((e) => e.en).join('\n')}`,
    }
    return unit
  },
}
