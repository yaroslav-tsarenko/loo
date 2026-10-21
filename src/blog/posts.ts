import 'server-only'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { BLOG_CATEGORIES } from './categories'
import { parsePost, SLUG, type BlogLocale, type BlogPost } from './parse'

// Blog posts are markdown files in git: blog/<locale>/<slug>.md, images in public/blog/<slug>/ (docs/BLOG.md).
// Written by `pnpm blog:write` (scripts/blog-write.ts) or by hand; shipped with every server function
// (next.config.ts → outputFileTracingIncludes).

export { BLOG_LOCALES, frontmatterSchema, parsePost, SLUG, type BlogFrontmatter, type BlogLocale, type BlogPost } from './parse'

/** Static pages under /blog that a post slug must not shadow. */
export const RESERVED = new Set(['about', 'rss'])

const dir = (locale: BlogLocale) => path.join(process.cwd(), 'blog', locale)

async function load(locale: BlogLocale): Promise<BlogPost[]> {
  let files: string[]
  try {
    files = (await readdir(dir(locale))).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }
  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = file.slice(0, -3)
      if (!SLUG.test(slug)) throw new Error(`blog/${locale}/${file}: slug must be lowercase latin, digits and dashes`)
      if (BLOG_CATEGORIES.some((c) => c.id === slug) || RESERVED.has(slug)) throw new Error(`blog/${locale}/${file}: slug collides with a category or a blog page`)
      return parsePost(await readFile(path.join(dir(locale), file), 'utf8'), slug, locale)
    }),
  )
  return posts.sort((a, b) => (b.date === a.date ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date)))
}

// Parsed once per server instance in production; re-read on every request in dev (edit → refresh).
const cache = new Map<BlogLocale, Promise<BlogPost[]>>()

export async function allPosts(locale: BlogLocale = 'uk', { drafts = false } = {}): Promise<BlogPost[]> {
  let posts = process.env.NODE_ENV === 'production' ? cache.get(locale) : undefined
  if (!posts) {
    posts = load(locale)
    if (process.env.NODE_ENV === 'production') cache.set(locale, posts)
  }
  const list = await posts
  return drafts ? list : list.filter((p) => !p.draft)
}

export async function getPost(slug: string, locale: BlogLocale = 'uk'): Promise<BlogPost | null> {
  if (!SLUG.test(slug)) return null
  return (await allPosts(locale)).find((p) => p.slug === slug) ?? null
}

/** Posts sharing the category first, then the most tags in common; never the post itself. */
export function relatedPosts(post: BlogPost, posts: readonly BlogPost[], limit = 3): BlogPost[] {
  const tags = new Set(post.tags)
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, score: (p.category === post.category ? 10 : 0) + p.tags.filter((t) => tags.has(t)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
    .slice(0, limit)
    .map((x) => x.p)
}
