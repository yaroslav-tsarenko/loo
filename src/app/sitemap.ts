import type { MetadataRoute } from 'next'
import { BLOG_CATEGORIES } from '@/blog/categories'
import { allPosts } from '@/blog/posts'
import { SITE_URL } from '@/lib/site'

// Public, indexable pages: landing, blog (index, categories, posts), sign-up and legal pages.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await allPosts('uk')
  const latest = posts[0]?.updated ?? posts[0]?.date
  const url = (path: string) => `${SITE_URL}${path}`
  return [
    { url: url('/'), changeFrequency: 'weekly', priority: 1 },
    { url: url('/blog'), lastModified: latest, changeFrequency: 'daily', priority: 0.9 },
    ...BLOG_CATEGORIES.filter((c) => posts.some((p) => p.category === c.id)).map((c) => {
      const newest = posts.find((p) => p.category === c.id)
      return { url: url(`/blog/${c.id}`), lastModified: newest?.updated ?? newest?.date, changeFrequency: 'weekly' as const, priority: 0.7 }
    }),
    ...posts.map((p) => ({
      url: url(`/blog/${p.slug}`),
      lastModified: p.updated ?? p.date,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      ...(p.cover ? { images: [url(p.cover)] } : {}),
    })),
    { url: url('/signup'), changeFrequency: 'yearly', priority: 0.5 },
    { url: url('/privacy'), changeFrequency: 'yearly', priority: 0.2 },
    { url: url('/terms'), changeFrequency: 'yearly', priority: 0.2 },
  ]
}
