// Writes blog articles (docs/BLOG.md): Claude writes and edits (Vercel AI Gateway), OpenAI Images draws the cover and
// illustrations, the result lands in blog/uk/<slug>.md + public/blog/<slug>/*.webp and the topic is marked done.
//
//   pnpm blog:write                              — the next pending topic from blog/topics.yaml
//   pnpm blog:write --count 3 --category sql     — several, of one category
//   pnpm blog:write --topic "Future Simple" --category english   — an ad-hoc topic
//   pnpm blog:write --no-images                  — text only (cover falls back to the category card)
//
// Env: OPENAI_API_KEY (text with gpt-5.5 and the images). BLOG_MODEL picks another text model: «openai/<id>» goes
// to OpenAI directly, anything else («anthropic/claude-sonnet-5.5») through the Vercel AI Gateway (needs paid
// gateway credits: AI_GATEWAY_API_KEY or VERCEL_OIDC_TOKEN). BLOG_IMAGE_MODEL overrides gpt-image-2.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModel } from 'ai'
import sharp from 'sharp'
import { parse as parseYaml, stringify } from 'yaml'
import { gatewayAuth } from '@/ai/reels/generate'
import { blogCategory } from '@/blog/categories'
import { articleFile, DEFAULT_BLOG_MODEL, IMAGE_STYLE, placeImages, qualityProblems, writeArticle, type BlogTopic, type ExistingPost } from '@/blog/generate'
import { parsePost, SLUG } from '@/blog/parse'
import { RESERVED } from '@/blog/paths'
import { blogSlugs, manifestSource } from './blog-manifest'

const args = process.argv.slice(2)
const opt = (name: string) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}
const COUNT = Math.max(1, Math.min(10, Number(opt('--count') ?? 1)))
const CATEGORY = opt('--category')
const TOPIC = opt('--topic')
const IMAGES = !args.includes('--no-images')
const MODEL = process.env.BLOG_MODEL?.trim() || DEFAULT_BLOG_MODEL

function textModel(id: string): LanguageModel {
  if (!id.startsWith('openai/')) {
    if (!gatewayAuth()) throw new Error(`${id} goes through the AI Gateway: set AI_GATEWAY_API_KEY or run \`vercel env pull\``)
    return id
  }
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')
  return createOpenAI({ apiKey })(id.slice('openai/'.length))
}
const IMAGE_MODEL = process.env.BLOG_IMAGE_MODEL?.trim() || 'gpt-image-2'

const ROOT = process.cwd()
const POSTS_DIR = path.join(ROOT, 'blog', 'uk')
const TOPICS = path.join(ROOT, 'blog', 'topics.yaml')

interface TopicEntry extends BlogTopic {
  status?: 'done' | 'skipped'
  slug?: string
  /** Why the quality gate skipped it (fix the topic and remove `status` to retry). */
  reason?: string
}

async function existingPosts(): Promise<ExistingPost[]> {
  const files = (await readdir(POSTS_DIR).catch(() => [] as string[])).filter((f) => f.endsWith('.md'))
  return Promise.all(
    files.map(async (f) => {
      const p = parsePost(await readFile(path.join(POSTS_DIR, f), 'utf8'), f.slice(0, -3), 'uk')
      return { slug: p.slug, title: p.title, category: p.category }
    }),
  )
}

async function image(prompt: string, file: string): Promise<boolean> {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) throw new Error('OPENAI_API_KEY is not set (or pass --no-images)')
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: IMAGE_MODEL, prompt: `${prompt}\n\n${IMAGE_STYLE}`, size: '1536x1024', quality: 'medium', n: 1 }),
    signal: AbortSignal.timeout(180_000),
  })
  const body = (await res.json().catch(() => ({}))) as { data?: Array<{ b64_json?: string }>; error?: { message?: string } }
  const b64 = body.data?.[0]?.b64_json
  if (!res.ok || !b64) {
    console.warn(`  ⚠️  image failed (${res.status}): ${body.error?.message ?? 'no data'}`)
    return false
  }
  // 1536×1024 → webp ~100–200 KB; served as-is from public/blog (no runtime optimisation needed).
  await sharp(Buffer.from(b64, 'base64')).resize({ width: 1536, withoutEnlargement: true }).webp({ quality: 80 }).toFile(file)
  return true
}

function uniqueSlug(slug: string, taken: Set<string>): string {
  let s = slug.slice(0, 70).replace(/-+$/, '')
  for (let i = 2; taken.has(s); i++) s = `${slug.slice(0, 66)}-${i}`
  return s
}

async function main(): Promise<void> {
  const model = textModel(MODEL)
  const topics = (parseYaml(await readFile(TOPICS, 'utf8')) ?? []) as TopicEntry[]
  const queue: TopicEntry[] = TOPIC
    ? [{ topic: TOPIC, category: CATEGORY ?? 'learning' }]
    : topics.filter((t) => !t.status && (!CATEGORY || t.category === CATEGORY)).slice(0, COUNT)
  if (queue.length === 0) return console.log('Немає тем у черзі.')
  await mkdir(POSTS_DIR, { recursive: true })
  const existing = await existingPosts()
  const taken = new Set(existing.map((p) => p.slug))
  const today = new Date().toISOString().slice(0, 10)

  let failed = 0
  for (const topic of queue) {
    try {
      await writeOne(topic)
    } catch (error) {
      // one bad topic (model hiccup, no credits) must not lose the others; the topic stays pending
      failed++
      console.error(`  ❌ ${topic.topic}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  if (failed > 0) process.exitCode = 1

  async function saveTopics(): Promise<void> {
    const header = (await readFile(TOPICS, 'utf8')).split('\n').filter((l) => l.startsWith('#')).join('\n')
    await writeFile(TOPICS, `${header}\n\n${stringify(topics, { lineWidth: 0 })}`)
  }

  async function writeOne(topic: TopicEntry): Promise<void> {
    if (!blogCategory(topic.category)) throw new Error(`Unknown category «${topic.category}» for «${topic.topic}»`)
    console.log(`\n✍️  ${topic.topic}  [${topic.category}]  (${MODEL})`)
    const started = Date.now()
    // Two attempts to pass the quality gate; a topic that fails both is skipped so the queue keeps moving.
    let written = await writeArticle(model, topic, existing)
    let problems = qualityProblems(written.draft, existing)
    if (problems.length > 0) {
      console.log(`  ↻ не пройшла перевірку якості (${problems.join('; ')}), ще одна спроба`)
      written = await writeArticle(model, topic, existing)
      problems = qualityProblems(written.draft, existing)
    }
    if (problems.length > 0) {
      const entry = topics.find((t) => t.topic === topic.topic)
      if (entry) Object.assign(entry, { status: 'skipped', reason: problems.join('; ') })
      await saveTopics()
      throw new Error(`skipped by the quality gate: ${problems.join('; ')}`)
    }
    const { draft, issues } = written
    const slug = uniqueSlug(SLUG.test(draft.slug) && !blogCategory(draft.slug) && !RESERVED.has(draft.slug) ? draft.slug : `post-${Date.now()}`, taken)
    console.log(`  текст готовий за ${Math.round((Date.now() - started) / 1000)} с, редактор: ${issues.length} правок → ${slug}`)

    const files: Record<string, string> = {}
    let cover: string | undefined
    if (IMAGES) {
      const dir = path.join(ROOT, 'public', 'blog', slug)
      await mkdir(dir, { recursive: true })
      const jobs = [{ id: 'cover', prompt: draft.coverPrompt }, ...draft.illustrations.map((i) => ({ id: i.id, prompt: i.prompt }))]
      const done = await Promise.all(jobs.map(async (j) => ((await image(j.prompt, path.join(dir, `${j.id}.webp`))) ? j.id : null)))
      for (const id of done) if (id && id !== 'cover') files[id] = `/blog/${slug}/${id}.webp`
      if (done.includes('cover')) cover = `/blog/${slug}/cover.webp`
      console.log(`  ілюстрації: ${done.filter(Boolean).length}/${jobs.length}`)
    }

    const md = articleFile(
      {
        title: draft.title,
        description: draft.description,
        category: topic.category,
        tags: draft.tags,
        keywords: [...new Set([...(topic.keywords ?? []), ...draft.keywords])].slice(0, 20),
        date: today,
        cover,
        coverAlt: cover ? draft.coverAlt : undefined,
        faq: draft.faq,
        draft: false,
      },
      placeImages(draft.body, files),
    )
    parsePost(md, slug, 'uk') // the site must be able to load it
    await writeFile(path.join(POSTS_DIR, `${slug}.md`), md)
    taken.add(slug)
    existing.unshift({ slug, title: draft.title, category: topic.category })
    const entry = topics.find((t) => t.topic === topic.topic)
    if (entry) Object.assign(entry, { status: 'done', slug })
    await saveTopics()
    await writeFile(path.join(ROOT, 'src', 'blog', 'manifest.generated.ts'), manifestSource(await blogSlugs()))
    console.log(`  ✅ blog/uk/${slug}.md`)
  }
}

await main()
