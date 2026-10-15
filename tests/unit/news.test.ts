import { describe, expect, it } from 'vitest'
import { cleanSummary, rankDrafts } from '@/news/collect'
import { dedupe, isNearDuplicate, releaseKey, titleSimilarity } from '@/news/dedupe'
import { decodeEntities, excerpt, parseFeed, stripHtml } from '@/news/feed'
import { classify, lowValuePenalty, popularity, rankScore, recency } from '@/news/rank'
import { isNotableRelease, parseRelease } from '@/news/release'
import { primaryTag, sourceLabel, type NewsDraft } from '@/news/types'
import { canonicalUrl, newsId } from '@/news/url'

const NOW = Date.parse('2026-10-15T12:00:00Z')
const HOUR = 3_600_000

function draft(over: Partial<NewsDraft>): NewsDraft {
  return { source: 'hn', title: 'Untitled', url: 'https://example.com/a', score: 0, tags: [], publishedAt: NOW - HOUR, ...over }
}

describe('feed parser', () => {
  it('parses RSS items with CDATA, entities and dc:creator', () => {
    const xml = `<?xml version="1.0"?><rss version="2.0"><channel>
      <title>Blog</title><link>https://blog.example</link>
      <atom:link href="https://blog.example/feed" rel="self"/>
      <item>
        <title><![CDATA[Announcing TypeScript 7.0 & <b>tsgo</b>]]></title>
        <link>https://devblogs.example/ts-7?utm_source=rss</link>
        <dc:creator><![CDATA[Daniel R]]></dc:creator>
        <pubDate>Wed, 08 Jul 2026 15:58:29 +0000</pubDate>
        <category><![CDATA[TypeScript]]></category>
        <description>&lt;p&gt;Fast &amp;amp; native &#8212; it&#x2019;s here&lt;/p&gt;</description>
      </item>
      <item><title>No link</title></item>
    </channel></rss>`
    const entries = parseFeed(xml)
    expect(entries).toHaveLength(1)
    const [e] = entries
    expect(e!.title).toBe('Announcing TypeScript 7.0 & tsgo')
    expect(e!.url).toBe('https://devblogs.example/ts-7?utm_source=rss')
    expect(e!.author).toBe('Daniel R')
    expect(e!.publishedAt).toBe(Date.parse('2026-07-08T15:58:29Z'))
    expect(e!.categories).toEqual(['TypeScript'])
    expect(stripHtml(e!.html)).toBe('Fast & native — it’s here')
  })

  it('falls back to a permalink guid when <link> is missing', () => {
    const [e] = parseFeed('<rss><channel><item><title>T</title><guid isPermaLink="true">https://x.dev/p</guid></item></channel></rss>')
    expect(e!.url).toBe('https://x.dev/p')
  })

  it('parses Atom entries: alternate link, author name, published/updated', () => {
    const xml = `<feed xmlns="http://www.w3.org/2005/Atom">
      <link href="https://v8.dev/blog.atom" rel="self"/>
      <entry>
        <title type="html">How we made &lt;code&gt;JSON.stringify&lt;/code&gt; fast</title>
        <link rel="replies" href="https://v8.dev/blog/json#comments"/>
        <link rel="alternate" type="text/html" href="https://v8.dev/blog/json-stringify"/>
        <updated>2025-08-04T00:00:00Z</updated>
        <author><name>Patrick T</name></author>
        <category label="internals" term="internals"/>
        <content type="html">&lt;p&gt;Twice as fast&lt;/p&gt;</content>
      </entry>
      <entry>
        <title>Bare link</title>
        <link href="https://example.com/bare"/>
        <published>2026-10-01T10:00:00Z</published>
        <updated>2026-10-02T10:00:00Z</updated>
      </entry>
    </feed>`
    const [a, b] = parseFeed(xml)
    expect(a!.title).toBe('How we made JSON.stringify fast')
    expect(a!.url).toBe('https://v8.dev/blog/json-stringify')
    expect(a!.author).toBe('Patrick T')
    expect(a!.categories).toEqual(['internals'])
    expect(stripHtml(a!.html)).toBe('Twice as fast')
    expect(b!.url).toBe('https://example.com/bare')
    expect(b!.publishedAt).toBe(Date.parse('2026-10-01T10:00:00Z'))
  })

  it('never throws on garbage', () => {
    expect(parseFeed('')).toEqual([])
    expect(parseFeed('<html><body>nope</body></html>')).toEqual([])
    expect(parseFeed('<rss><item><title>broken')).toEqual([])
  })

  it('decodes entities and makes excerpts', () => {
    expect(decodeEntities('&lt;a&gt; &quot;x&quot; &#39;y&#39; &#x1F680; &nbsp;&unknown;')).toBe('<a> "x" \'y\' 🚀  &unknown;')
    expect(stripHtml('<p>a</p><!-- c --><script>bad()</script><p>b&amp;c</p>')).toBe('a b&c')
    expect(excerpt('one two three four five', 12)).toBe('one two…')
    expect(excerpt('short', 12)).toBe('short')
  })
})

describe('canonical URLs', () => {
  it('normalizes protocol, host, tracking params, hash and trailing slashes', () => {
    expect(canonicalUrl('http://www.Example.com/Post/?utm_source=x&b=2&a=1&hl=en#top')).toBe('https://example.com/Post?a=1&b=2')
    expect(canonicalUrl('https://example.com/')).toBe('https://example.com')
    expect(canonicalUrl('https://news.ycombinator.com/item?id=123')).toBe('https://news.ycombinator.com/item?id=123')
    expect(canonicalUrl('https://example.com:443/a//b///')).toBe('https://example.com/a/b')
  })

  it('rejects non-http URLs', () => {
    expect(canonicalUrl('javascript:alert(1)')).toBeNull()
    expect(canonicalUrl('not a url')).toBeNull()
  })

  it('gives the same id to equivalent URLs', () => {
    const a = newsId(canonicalUrl('http://www.example.com/x/?utm_medium=rss')!)
    const b = newsId(canonicalUrl('https://example.com/x')!)
    expect(a).toBe(b)
    expect(a).toMatch(/^[0-9a-f]{40}$/)
  })
})

describe('releases', () => {
  it('parses versions from different title styles', () => {
    expect(parseRelease('2026-10-14, Version 26.12.0 (Current), @richardlau')).toMatchObject({ major: 26, minor: 12, patch: 0, pre: null })
    expect(parseRelease('TypeScript 6.0 Beta')).toMatchObject({ version: '6.0', pre: 'beta' })
    expect(parseRelease('v8.0.0-beta.3')).toMatchObject({ pre: 'beta.3' })
    expect(parseRelease('no version here')).toBeNull()
  })

  it('keeps majors/minors, first betas and security patches; skips canaries and patches', () => {
    expect(isNotableRelease('v16.4.0', '')).toBe(true)
    expect(isNotableRelease('Bun v1.4', '')).toBe(true)
    expect(isNotableRelease('v16.4.1', 'Bug fixes')).toBe(false)
    expect(isNotableRelease('v16.4.1', 'This release contains security fixes for CVE-2026-1234')).toBe(true)
    expect(isNotableRelease('v16.5.0-canary.14', '')).toBe(false)
    expect(isNotableRelease('TypeScript 7.0 Beta', '')).toBe(true)
    expect(isNotableRelease('v8.0.0-beta.3', '')).toBe(false)
  })
})

describe('ranking and tagging', () => {
  it('normalizes popularity per source', () => {
    expect(popularity({ source: 'hn', score: 400, title: '' })).toBeCloseTo(1)
    expect(popularity({ source: 'hn', score: 20, title: '' })).toBeLessThan(popularity({ source: 'reddit/javascript', score: 20, title: '' }))
    expect(popularity({ source: 'github/nodejs/node', score: 0, title: 'Node.js 27.0.0' })).toBeGreaterThan(popularity({ source: 'github/nodejs/node', score: 0, title: 'Node.js 26.12.0' }))
    expect(popularity({ source: 'v8', score: 0, title: '' })).toBeGreaterThan(popularity({ source: 'chrome', score: 0, title: '' }))
  })

  it('decays with age', () => {
    expect(recency(NOW, NOW)).toBe(1)
    expect(recency(NOW - 36 * HOUR, NOW)).toBeCloseTo(0.5)
  })

  it('boosts learning value and penalizes noise', () => {
    const deep = rankScore(draft({ title: 'Inside the V8 event loop: memory and performance deep dive', score: 50 }), NOW)
    const plain = rankScore(draft({ title: 'My weekend with a new laptop', score: 50 }), NOW)
    const hiring = rankScore(draft({ title: 'Acme is hiring senior JavaScript engineers', score: 50 }), NOW)
    expect(deep).toBeGreaterThan(plain)
    expect(hiring).toBeLessThan(plain)
    expect(lowValuePenalty('10 JavaScript tips you need')).toBeGreaterThan(0)
    expect(lowValuePenalty('Show HN: my SaaS for invoices')).toBeGreaterThan(lowValuePenalty('Show HN: a tiny JS parser'))
    expect(lowValuePenalty('How React reconciles lists')).toBe(0)
  })

  it('keeps scores within 0..100', () => {
    expect(rankScore(draft({ title: 'TC39 proposal: Temporal stage 4, V8 memory performance security CVE deep dive', score: 10_000 }), NOW)).toBeLessThanOrEqual(100)
    expect(rankScore(draft({ title: 'Who is hiring? jobs freelance salary', publishedAt: NOW - 400 * HOUR }), NOW)).toBe(0)
  })

  it('tags items by topic in importance order', () => {
    expect(classify(draft({ title: 'TC39 advances the Temporal proposal to stage 4' }))).toEqual(['proposal'])
    expect(classify(draft({ title: 'Node.js 26.12.0 (Current)' }))[0]).toBe('release')
    expect(classify(draft({ title: 'October 2026 security releases', summary: 'Fixes CVE-2026-1111' }))[0]).toBe('security')
    expect(classify(draft({ title: 'How to speed up Vite builds' }))).toEqual(['perf', 'tooling', 'tutorial'])
    expect(classify(draft({ title: 'Ask HN: Is Deno still worth it?' }))).toContain('discussion')
    expect(classify(draft({ title: 'Something happened' }))).toEqual(['news'])
    expect(classify(draft({ source: 'reddit/node', title: 'Weekly thread' }))).toEqual(['discussion'])
    expect(classify(draft({ source: 'v8', title: 'Faster closures', tags: ['deep-dive'] }))).toEqual(['perf', 'deep-dive'])
  })

  it('exposes emoji tag and source labels for the UI', () => {
    expect(primaryTag(['perf', 'tooling'])).toBe('perf')
    expect(primaryTag(['unknown'])).toBe('news')
    expect(sourceLabel('reddit/typescript')).toBe('r/typescript')
    expect(sourceLabel('github/vitejs/vite')).toBe('GitHub · vite')
    expect(sourceLabel('v8')).toBe('V8 blog')
  })
})

describe('dedupe', () => {
  it('detects near-duplicate titles and same releases', () => {
    expect(titleSimilarity('Announcing TypeScript 7.0', 'TypeScript 7.0')).toBe(1)
    expect(titleSimilarity('React Compiler 1.0 is stable', 'Svelte 6 is stable')).toBeLessThan(0.5)
    expect(releaseKey('Node.js 26.12.0 (Current)')).toBe('node@26.12')
    expect(releaseKey('Node.js v26.12.0')).toBe('node@26.12')
    expect(isNearDuplicate({ title: 'Node.js 26.12.0 (Current)', tags: ['release'] }, { title: 'Node.js v26.12.0', tags: ['release', 'perf'] })).toBe(true)
    expect(isNearDuplicate({ title: 'What React 19.3 means for forms', tags: ['tutorial'] }, { title: 'React 19.3', tags: ['release'] })).toBe(false)
  })

  it('merges same URL and near-duplicates, preferring the announcement over the GitHub page', () => {
    const items = rankDrafts(
      [
        draft({ source: 'hn', title: 'Vite 8 is out', url: 'https://vite.dev/blog/v8?utm_source=hn', score: 300 }),
        draft({ source: 'reddit/javascript', title: 'Vite 8 is out!', url: 'http://www.vite.dev/blog/v8/', score: 40 }),
        draft({ source: 'github/nodejs/node', title: 'Node.js 26.12.0 (Current)', url: 'https://github.com/nodejs/node/releases/tag/v26.12.0', tags: ['release'] }),
        draft({ source: 'nodejs', title: 'Node.js 26.12.0 (Current)', url: 'https://nodejs.org/en/blog/release/v26.12.0', tags: ['release'] }),
        draft({ source: 'devto', title: 'Old news', publishedAt: NOW - 30 * 24 * HOUR }),
      ],
      NOW,
    )
    expect(items).toHaveLength(2)
    expect(items.find((i) => i.title.startsWith('Vite'))!.source).toBe('hn')
    expect(items.find((i) => i.title.startsWith('Node'))!.source).toBe('nodejs')
  })

  it('is stable for unique items', () => {
    const items = rankDrafts([draft({ title: 'A about closures', url: 'https://a.dev/1' }), draft({ title: 'B about generators', url: 'https://b.dev/2' })], NOW)
    expect(dedupe(items)).toHaveLength(2)
  })
})

describe('summaries', () => {
  it('drops summaries that just repeat the title', () => {
    expect(cleanSummary('EyeZen v1.2.0: Local-First Workspace', 'EyeZen v1.2.0: Local-First Works...')).toBeUndefined()
    expect(cleanSummary('Vite 8', 'Vite 8: Rolldown is now the default bundler')).toBe('Rolldown is now the default bundler')
    expect(cleanSummary('Vite 8', 'Rolldown by default')).toBe('Rolldown by default')
    expect(cleanSummary('Vite 8', '   ')).toBeUndefined()
    expect(cleanSummary('Vite 8', 'Rolldown')).toBe('Rolldown')
    expect(cleanSummary('React', 'Reactive streams intro')).toBe('Reactive streams intro')
    expect(cleanSummary('EyeZen v1.2.0: Local-First', 'EyeZen v1.2.0: Local-First   EyeZen v1.2.0...')).toBeUndefined()
    expect(cleanSummary('EyeZen v1.2.0: Bringing Local-First', 'EyeZen v1.2.0...')).toBeUndefined()
  })
})
