import { BLOG_CATEGORIES } from './categories'
import { BLOG_SLUGS } from './manifest.generated'

/** Static routes under /blog/ that a post slug must not shadow. */
export const RESERVED = new Set(['about', 'rss', 'rss.xml', 'opengraph-image', 'twitter-image'])

const PAGE = /^\/blog\/([^/]+)(?:\/opengraph-image)?$/
const known = new Set<string>([...BLOG_CATEGORIES.map((c) => c.id), ...BLOG_SLUGS, ...RESERVED])

/**
 * For /blog/<segment> pages (and their OG cards): whether that page exists. null for any other path.
 * The proxy answers a real 404 for unknown ones (a missing post would otherwise stream as 200 + noindex — a soft
 * 404 for Google, because the root loading.tsx starts the response before the page calls notFound()).
 */
export function blogPageExists(pathname: string): boolean | null {
  const m = PAGE.exec(pathname)
  if (!m) return null
  return known.has(m[1]!)
}
