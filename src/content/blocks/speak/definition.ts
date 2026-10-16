import type { Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import type { QuizUnit, SpeakSpec } from '../../model'
import { FieldBag, ipaOf, isSlow, readFields } from '../lang/fields'
import { levelFrom, splitTags } from '../meta'
import type { UnitDefinition } from '../types'

// `> [!speak] Скажи вголос` + `text: Nice to meet you.` — a pronunciation attempt (docs/LANGUAGE_COURSE.md). The browser
// recognises the learner's speech (Web Speech API, docs/SPEECH.md); the server compares the transcript word by word
// with `text` (src/content/blocks/lang/grade.ts) and grants XP only on its own verdict (src/server/actions/speech.ts).
// A quiz of mode 'speak' for the engine — never part of topic tests, exams or placement (needs a microphone).

const KEYS = new Set(['level', 'id', 'text', 'ipa', 'ipa-us', 'tip', 'uk', 'tr', 'speed', 'tags', 'lang'])

export const MAX_SPEAK_CHARS = 200

export const speakDefinition: UnitDefinition = {
  type: 'speak',
  aliases: ['say', 'вимова', 'скажи'],
  extract(node, ctx) {
    const promptText = toString({ type: 'paragraph', children: node.title }).trim() || 'Скажи вголос'
    const { fields, rest } = readFields(node.children as RootContent[], KEYS)
    const f = new FieldBag(fields)
    const text = f.text('text')
    if (!text) {
      ctx.report?.('error', `[!speak] «${promptText}»: немає text: (що сказати)`)
      return null
    }
    if (text.length > MAX_SPEAK_CHARS) ctx.report?.('warning', `[!speak] «${promptText}»: фраза довша за ${MAX_SPEAK_CHARS} символів — розбий на кілька`)
    const tip = f.get('tip')
    const spec: SpeakSpec = {
      text,
      ipa: ipaOf(f.text('ipa')),
      ipaUs: ipaOf(f.text('ipa-us')),
      tip: tip?.text ?? null,
      translation: f.text('uk', 'tr'),
      slow: isSlow(f.text('speed')),
    }
    const explanation: Root | null = tip ? { type: 'root', children: [{ type: 'paragraph', children: tip.phrasing }] } : null
    const { id, source } = ctx.resolveId(f.text('id'), `speak:${text}`)
    const unit: QuizUnit = {
      id,
      kind: 'quiz',
      guideId: ctx.guideId,
      chapterId: ctx.chapterId,
      sectionSlug: ctx.sectionSlug,
      level: levelFrom([f.text('level') ?? '']) ?? ctx.level,
      tags: splitTags(f.text('tags') ?? undefined),
      idSource: source,
      mode: 'speak',
      prompt: node.title.length > 0 ? node.title : [{ type: 'text', value: promptText }],
      promptText,
      body: { type: 'root', children: rest },
      options: [],
      freeAnswer: null,
      explanation,
      exercise: null,
      speak: spec,
      ...(f.text('lang') ? { lang: f.text('lang')! } : {}),
      searchText: `${promptText}\n${text}`,
    }
    return unit
  },
}
