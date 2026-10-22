import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import { describe, expect, it } from 'vitest'
import { BLOG_CATEGORIES, blogCategory } from '@/blog/categories'
import { articleFile, placeImages, qualityProblems, titleOverlap } from '@/blog/generate'
import { parsePost } from '@/blog/parse'
import { blogPageExists } from '@/blog/paths'
import { blogSlugs, manifestSource } from '../../scripts/blog-manifest'

const dir = path.join(process.cwd(), 'blog', 'uk')

describe('blog content', () => {
  it('every post loads, has a unique slug and existing images', async () => {
    const files = (await readdir(dir).catch(() => [] as string[])).filter((f) => f.endsWith('.md'))
    for (const f of files) {
      const slug = f.slice(0, -3)
      const post = parsePost(await readFile(path.join(dir, f), 'utf8'), slug, 'uk')
      expect(blogCategory(slug), `${slug} collides with a category`).toBeNull()
      const images = [post.cover, ...[...post.body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1])].filter(Boolean) as string[]
      for (const src of images) {
        expect(src, `${slug}: image outside public/blog`).toMatch(/^\/blog\/[a-z0-9-]+\/[a-z0-9-]+\.(webp|png|jpg)$/)
        await expect(readFile(path.join(process.cwd(), 'public', src)), `${slug}: missing ${src}`).resolves.toBeTruthy()
      }
      expect(post.body, `${slug}: leftover image placeholder`).not.toMatch(/\]\(img-\d\)/)
    }
  })

  it('topics name known categories', async () => {
    const topics = parseYaml(await readFile(path.join(process.cwd(), 'blog', 'topics.yaml'), 'utf8')) as Array<{ topic: string; category: string }>
    for (const t of topics) expect(blogCategory(t.category), t.topic).not.toBeNull()
    expect(new Set(topics.map((t) => t.topic)).size).toBe(topics.length)
  })

  it('the slug manifest is up to date (pnpm blog:manifest)', async () => {
    expect(await readFile(path.join(process.cwd(), 'src', 'blog', 'manifest.generated.ts'), 'utf8')).toBe(manifestSource(await blogSlugs()))
  })

  it('known blog pages exist, unknown ones are 404 in the proxy', async () => {
    const [slug] = await blogSlugs()
    for (const p of ['/blog/english', '/blog/about', '/blog/rss.xml', '/blog/opengraph-image', '/blog/english/opengraph-image', ...(slug ? [`/blog/${slug}`, `/blog/${slug}/opengraph-image`] : [])]) expect(blogPageExists(p), p).toBe(true)
    for (const p of ['/blog/no-such-post', '/blog/no-such-post/opengraph-image']) expect(blogPageExists(p), p).toBe(false)
    for (const p of ['/blog', '/blog/x/cover.webp', '/feed']) expect(blogPageExists(p), p).toBeNull()
  })

  it('category ids are url-safe', () => {
    for (const c of BLOG_CATEGORIES) expect(c.id).toMatch(/^[a-z][a-z-]+$/)
  })
})

describe('blog generator helpers', () => {
  it('swaps image placeholders and drops the ones without a file', () => {
    expect(placeImages('A\n\n![Схема](img-1)\n\n![Інша](img-2)\n\nB', { 'img-1': '/blog/x/img-1.webp' })).toBe('A\n\n![Схема](/blog/x/img-1.webp)\n\nB')
  })

  it('writes a file the site can load back', () => {
    const md = articleFile(
      {
        title: 'Тестова стаття про SQL JOIN',
        description: 'Опис для пошуковика достатньої довжини, щоб пройти перевірку схеми й показати сніпет у Google.',
        category: 'sql',
        tags: ['SQL'],
        keywords: ['sql join'],
        date: '2026-10-20',
        faq: [{ q: 'Що таке JOIN?', a: 'Це об’єднання рядків двох таблиць за умовою.' }],
        draft: false,
      },
      '## Розділ\n\nТекст: "лапки" і: двокрапка.',
    )
    const post = parsePost(md, 'test-join', 'uk')
    expect(post.title).toBe('Тестова стаття про SQL JOIN')
    expect(post.faq).toHaveLength(1)
    expect(post.body).toContain('## Розділ')
    expect(md).not.toContain('draft:')
  })

  it('quality gate: substance, required sections, no duplicates', () => {
    const para = 'Слово '.repeat(260)
    const good = ['## Що це', para, '## Як утворюється', para, '## Коли вживати', para, '## Типові помилки', para, '## Перевір себе', para, '## Коротко', '- підсумок'].join('\n\n')
    const faq = [1, 2, 3].map((i) => ({ q: `Питання номер ${i}?`, a: 'Відповідь достатньої довжини для перевірки.' }))
    expect(qualityProblems({ title: 'Present Perfect простими словами', body: good, faq }, [])).toEqual([])
    expect(qualityProblems({ title: 'X', body: '## Один\n\nкоротко', faq: [] }, []).length).toBeGreaterThan(3)
    const dup = qualityProblems({ title: 'Present Perfect простими словами з прикладами', body: good, faq }, [{ slug: 'pp', title: 'Present Perfect простими словами', category: 'english' }])
    expect(dup).toEqual(['near-duplicate of /blog/pp'])
    expect(titleOverlap('SQL JOIN з прикладами', 'Німецькі артиклі der die das')).toBe(0)
  })
})
