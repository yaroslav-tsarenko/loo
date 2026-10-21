import { blogCategory } from '@/blog/categories'
import { allPosts } from '@/blog/posts'
import { SITE_URL } from '@/lib/site'

// RSS 2.0 of the blog (/blog/rss.xml): feed readers and search engines discover new posts from it.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET(): Promise<Response> {
  const posts = (await allPosts('uk')).slice(0, 50)
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(p.description)}</description>
      <category>${esc(blogCategory(p.category)?.title ?? p.category)}</category>
      <pubDate>${new Date(`${p.date}T07:00:00Z`).toUTCString()}</pubDate>${p.cover ? `\n      <enclosure url="${SITE_URL}${p.cover}" type="image/webp" length="0"/>` : ''}
    </item>`
    })
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Блог Loo</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Англійська, німецька, JavaScript, SQL і System Design простими словами</description>
    <language>uk</language>${posts[0] ? `\n    <lastBuildDate>${new Date(`${posts[0].updated ?? posts[0].date}T07:00:00Z`).toUTCString()}</lastBuildDate>` : ''}
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } })
}
