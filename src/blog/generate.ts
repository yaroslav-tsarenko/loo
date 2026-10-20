import { generateText, Output, type LanguageModel } from 'ai'
import { stringify } from 'yaml'
import { z } from 'zod'
import { blogCategory } from './categories'
import { frontmatterSchema, SLUG, type BlogFrontmatter } from './parse'

// Blog article generation (docs/BLOG.md): a writer pass and an editor pass on Claude (Vercel AI Gateway), then
// illustrations (OpenAI Images, scripts/blog-write.ts). Pure apart from the model calls, which are injected.

// «openai/…» runs on OpenAI directly (scripts/blog-write.ts); gateway ids like anthropic/claude-sonnet-5.5 need paid
// AI Gateway credits.
export const DEFAULT_BLOG_MODEL = 'openai/gpt-5.5'

export interface BlogTopic {
  topic: string
  category: string
  /** Search phrases the article should rank for. */
  keywords?: string[]
  /** Extra guidance for the writer. */
  notes?: string
}

export interface ExistingPost {
  slug: string
  title: string
  category: string
}

const illustrationSchema = z.object({
  id: z.string().regex(/^img-[1-3]$/).describe('Placeholder id used in the body as ![alt](img-1)'),
  prompt: z.string().min(40).max(900).describe('English prompt for the illustration: the scene, objects and metaphor. No text in the image.'),
  alt: z.string().min(10).max(160).describe('Ukrainian alt text / caption'),
})

export const draftSchema = z.object({
  slug: z.string().regex(SLUG).max(70).describe('Latin kebab-case URL slug with the main keyword, e.g. present-perfect-prostymy-slovamy'),
  title: z.string().min(20).max(70).describe('SEO title in Ukrainian, ≤ 65 chars, main keyword first'),
  description: z.string().min(120).max(165).describe('Meta description in Ukrainian, 140–160 chars, promise + keyword'),
  tags: z.array(z.string().min(2).max(30)).min(3).max(6),
  keywords: z.array(z.string().min(3).max(70)).min(4).max(10).describe('Ukrainian search phrases people type into Google'),
  coverPrompt: z.string().min(60).max(900).describe('English prompt for the cover illustration. No text in the image.'),
  coverAlt: z.string().min(10).max(160),
  illustrations: z.array(illustrationSchema).max(2),
  faq: z.array(z.object({ q: z.string().min(10).max(160), a: z.string().min(40).max(600) })).min(3).max(5),
  body: z.string().min(4000).describe('The article body in Markdown, without the H1 title'),
})
export type Draft = z.infer<typeof draftSchema>

const editSchema = z.object({
  issues: z.array(z.string()).describe('What you fixed or verified, one short line each (English)'),
  body: z.string().min(4000).describe('The full corrected article body in Markdown'),
  faq: draftSchema.shape.faq,
})

const STYLE_GUIDE = `
You write for Loo (playloo.app), a gamified learning app for Ukrainians: English, German, JavaScript, SQL, System Design.
Language: modern literary Ukrainian — natural, warm, clear; address the reader as «ти». Strictly no russisms or
surzhyk (e.g. «наступний», not «слідуючий»; «захід», not «мероприятие»; «у тому числі» → «зокрема»). Correct
Ukrainian IT terminology (функція, змінна, масив, об'єкт, запит, індекс); keep established English terms in Latin
where Ukrainian developers do (callback, Promise, JOIN, API) and explain them on first use.

Quality bar: the best article on this topic in Ukrainian on the internet — better than a tutor's handout.
- Answer the search intent in the first 2–3 short paragraphs (what it is, when to use it, why it matters).
- Structure with ## sections (5–9) and ### subsections where useful. No H1 (the page renders the title).
- Teach with many concrete examples. Language articles: every rule gets 3+ example sentences with a Ukrainian
  translation (format: **English sentence** — переклад), plus a table of forms where it helps; mark typical
  mistakes of Ukrainian speakers (interference from Ukrainian). Programming articles: runnable, modern code
  (ES2023+, PostgreSQL 16+) in fenced blocks with the language tag (js, ts, sql, bash) and comments in Ukrainian;
  show the output in a comment; build from simple to real-world.
- Use Markdown tables for comparisons, numbered lists for steps.
- Use callouts sparingly (Obsidian syntax): > [!tip] Порада, > [!warning] Увага, > [!pitfall] Типова помилка,
  > [!example] Приклад, > [!note] Нотатка. Only these types.
- Include a section «Типові помилки» and a short practice section «Перевір себе» with 3–5 tasks; put the answers in a
  folded callout: > [!solution]- Відповіді
- Finish with «Коротко» — 4–6 bullet takeaways.
- 1600–2600 words. Dense with value, no filler, no clichés («у сучасному світі», «не секрет, що»), no emoji.
- Facts must be correct. No invented statistics, studies or quotes. External links only to authoritative sources
  you are sure exist (MDN, PostgreSQL docs, Cambridge/Oxford dictionaries, Duden) and only if they truly help.
- Do not advertise Loo in the body; the page adds its own call to action.
`.trim()

export function writerPrompt(topic: BlogTopic, existing: readonly ExistingPost[]): string {
  const category = blogCategory(topic.category)
  const links = existing
    .slice(0, 60)
    .map((p) => `- /blog/${p.slug} — ${p.title}`)
    .join('\n')
  return `${STYLE_GUIDE}

Write a blog article.
Topic: ${topic.topic}
Category: ${category?.title ?? topic.category}
${topic.keywords?.length ? `Target search phrases: ${topic.keywords.join('; ')}` : ''}
${topic.notes ? `Notes from the editor: ${topic.notes}` : ''}

Illustrations: up to 2 inline images where a picture genuinely explains the idea (a timeline, a metaphor, a
diagram-like scene). Put each on its own line in the body as ![alt](img-1), ![alt](img-2) with the same alt as in
\`illustrations\`. Image prompts (cover too) describe a clean editorial illustration of the concept — objects, scene,
metaphor; never ask for text, letters, code or UI screenshots in the image.

${links ? `Existing articles on the blog — link 1–3 of them inline where truly relevant (Markdown links to the path):\n${links}` : ''}`
}

export function editorPrompt(topic: BlogTopic, draft: Draft): string {
  return `${STYLE_GUIDE}

You are the senior editor and subject-matter expert. Review this draft about «${topic.topic}» and return the full
corrected body and FAQ.
Check and fix: factual and grammatical correctness of every rule and example (English/German examples must be
natural and correct; code must run and the shown output must be exact), Ukrainian language quality (russisms,
surzhyk, calques, awkward phrasing), terminology consistency, logical flow, missing important cases or exceptions,
the required sections («Типові помилки», «Перевір себе» with folded answers, «Коротко»). Keep the image
placeholders (![…](img-N)) and internal links as they are. Do not shorten the article; improve it.

Title: ${draft.title}

${draft.body}

FAQ:
${draft.faq.map((f) => `- ${f.q}\n  ${f.a}`).join('\n')}`
}

export interface WrittenArticle {
  draft: Draft
  issues: string[]
}

export async function writeArticle(model: LanguageModel, topic: BlogTopic, existing: readonly ExistingPost[]): Promise<WrittenArticle> {
  const first = await generateText({ model, output: Output.object({ schema: draftSchema }), prompt: writerPrompt(topic, existing), maxOutputTokens: 32_000 })
  const draft = first.output
  const edit = await generateText({ model, output: Output.object({ schema: editSchema }), prompt: editorPrompt(topic, draft), maxOutputTokens: 32_000 })
  return { draft: { ...draft, body: edit.output.body, faq: edit.output.faq }, issues: edit.output.issues }
}

/** Image style shared by every blog picture, so the blog looks like one publication. */
export const IMAGE_STYLE =
  'Style: clean modern editorial flat illustration with subtle pixel-art accents (small square pixels on edges and sparkles), soft violet (#7c4dff) and mint (#2dd4bf) accents with warm yellow highlights on a light neutral off-white background, generous negative space, friendly and calm, no text, no letters, no numbers, no logos, no watermark.'

/** Body with image placeholders swapped for the written files; unknown placeholders are dropped. */
export function placeImages(body: string, files: Record<string, string>): string {
  return body
    .replace(/!\[([^\]]*)\]\((img-[1-3])\)/g, (_m, alt: string, id: string) => (files[id] ? `![${alt}](${files[id]})` : ''))
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** The markdown file: validated frontmatter + body. Throws when the frontmatter would not load. */
export function articleFile(fm: BlogFrontmatter, body: string): string {
  const checked = frontmatterSchema.parse(fm)
  const data = Object.fromEntries(Object.entries(checked).filter(([k, v]) => v !== undefined && !(k === 'draft' && v === false) && !(Array.isArray(v) && v.length === 0)))
  return `---\n${stringify(data, { lineWidth: 0 }).trim()}\n---\n\n${body.trim()}\n`
}
