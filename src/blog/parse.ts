import { parse as parseYaml } from 'yaml'
import { z } from 'zod'
import { blogCategory } from './categories'

// Blog post files: frontmatter schema and parsing (shared by the site, src/blog/posts.ts, and the generator,
// scripts/blog-write.ts — so no server-only imports here).

export const BLOG_LOCALES = ['uk'] as const
export type BlogLocale = (typeof BLOG_LOCALES)[number]

export const SLUG = /^[a-z0-9][a-z0-9-]{1,99}$/

const day = z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date().transform((d) => d.toISOString().slice(0, 10))])

export const frontmatterSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(50).max(200),
  category: z.string().refine((id) => blogCategory(id) !== null, 'unknown category'),
  tags: z.array(z.string().min(1).max(40)).max(12).default([]),
  keywords: z.array(z.string().min(1).max(80)).max(20).default([]),
  date: day,
  updated: day.optional(),
  cover: z.string().regex(/^\/blog\/[a-z0-9-]+\/[a-z0-9-]+\.(webp|png|jpg)$/).optional(),
  coverAlt: z.string().max(200).optional(),
  faq: z.array(z.object({ q: z.string().min(5).max(200), a: z.string().min(10).max(1200) })).max(10).default([]),
  draft: z.boolean().default(false),
})

export type BlogFrontmatter = z.infer<typeof frontmatterSchema>

export interface BlogPost extends BlogFrontmatter {
  slug: string
  locale: BlogLocale
  /** Markdown body without the frontmatter. */
  body: string
  readingMinutes: number
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export function parsePost(source: string, slug: string, locale: BlogLocale): BlogPost {
  const match = FRONTMATTER.exec(source)
  if (!match) throw new Error(`blog/${locale}/${slug}.md: no frontmatter`)
  const parsed = frontmatterSchema.safeParse(parseYaml(match[1]!))
  if (!parsed.success) throw new Error(`blog/${locale}/${slug}.md: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`)
  const body = source.slice(match[0].length)
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length
  return { ...parsed.data, slug, locale, body, readingMinutes: Math.max(1, Math.round(words / 180)) }
}
