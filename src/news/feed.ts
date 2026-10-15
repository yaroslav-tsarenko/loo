// Tiny dependency-free RSS 2.0 / Atom parser. Good enough for well-formed feeds; never throws.

export interface FeedEntry {
  title: string
  url: string
  // Decoded HTML body (description / summary / content), tags not stripped.
  html: string
  author: string | null
  publishedAt: number | null
  categories: string[]
}

const NAMED: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  laquo: '«',
  raquo: '»',
  middot: '·',
  bull: '•',
  copy: '©',
  reg: '®',
  trade: '™',
  times: '×',
  rarr: '→',
  larr: '←',
  zwj: '‍',
  zwnj: '‌',
}

export function decodeEntities(input: string): string {
  return input.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (whole, body: string) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10)
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole
    }
    return NAMED[body.toLowerCase()] ?? whole
  })
}

// Text content of an XML node: CDATA sections are taken verbatim, the rest is entity-decoded.
function nodeText(raw: string): string {
  let out = ''
  let rest = raw
  for (;;) {
    const start = rest.indexOf('<![CDATA[')
    if (start === -1) break
    const end = rest.indexOf(']]>', start + 9)
    if (end === -1) break
    out += decodeEntities(rest.slice(0, start)) + rest.slice(start + 9, end)
    rest = rest.slice(end + 3)
  }
  return (out + decodeEntities(rest)).trim()
}

export function stripHtml(html: string): string {
  const text = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6]|tr|br)\s*>|<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
  return decodeEntities(text).replace(/\s+/g, ' ').trim()
}

// Plain-text excerpt cut at a word boundary.
export function excerpt(text: string, max = 280): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const space = cut.lastIndexOf(' ')
  return `${(space > max * 0.5 ? cut.slice(0, space) : cut).replace(/[\s,.;:—–-]+$/, '')}…`
}

function escapeName(name: string): string {
  return name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function blocks(xml: string, name: string): string[] {
  const re = new RegExp(`<${escapeName(name)}(?:\\s[^>]*)?(?<!/)>([\\s\\S]*?)</${escapeName(name)}>`, 'gi')
  return [...xml.matchAll(re)].map((m) => m[1] ?? '')
}

function child(xml: string, name: string): string | null {
  const re = new RegExp(`<${escapeName(name)}(?:\\s[^>]*)?(?<!/)>([\\s\\S]*?)</${escapeName(name)}>`, 'i')
  const m = re.exec(xml)
  return m ? nodeText(m[1] ?? '') : null
}

function attrs(tag: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) out[m[1]!.toLowerCase()] = decodeEntities(m[3] ?? m[4] ?? '')
  return out
}

function atomLink(entry: string): string | null {
  let fallback: string | null = null
  for (const m of entry.matchAll(/<link\b([^>]*?)\/?>/gi)) {
    const a = attrs(m[1] ?? '')
    if (!a.href) continue
    const rel = a.rel ?? 'alternate'
    if (rel === 'alternate' && (!a.type || a.type.includes('html'))) return a.href
    if (!fallback && rel !== 'self' && rel !== 'replies' && rel !== 'enclosure') fallback = a.href
  }
  return fallback
}

function date(value: string | null): number | null {
  if (!value) return null
  const ms = Date.parse(value.trim())
  return Number.isFinite(ms) ? ms : null
}

function categories(entry: string): string[] {
  const out: string[] = []
  for (const m of entry.matchAll(/<category\b([^>]*?)(?:\/>|>([\s\S]*?)<\/category>)/gi)) {
    const a = attrs(m[1] ?? '')
    const value = (a.term ?? a.label ?? nodeText(m[2] ?? '')).trim()
    if (value) out.push(value)
  }
  return out
}

function parseRssItem(item: string): FeedEntry | null {
  const title = stripHtml(child(item, 'title') ?? '')
  let url = (child(item, 'link') ?? '').trim()
  if (!url) {
    const guid = (child(item, 'guid') ?? '').trim()
    if (/^https?:\/\//.test(guid)) url = guid
  }
  if (!url) url = atomLink(item) ?? ''
  if (!title || !url) return null
  const html = child(item, 'description') ?? child(item, 'content:encoded') ?? ''
  const author = child(item, 'dc:creator') ?? child(item, 'author')
  return {
    title,
    url,
    html,
    author: author ? stripHtml(author) || null : null,
    publishedAt: date(child(item, 'pubDate') ?? child(item, 'dc:date') ?? child(item, 'published')),
    categories: categories(item),
  }
}

function parseAtomEntry(entry: string): FeedEntry | null {
  const title = stripHtml(child(entry, 'title') ?? '')
  const url = atomLink(entry) ?? ''
  if (!title || !url) return null
  const authorBlock = blocks(entry, 'author')[0]
  const author = authorBlock ? (child(authorBlock, 'name') ?? nodeText(authorBlock)) : null
  return {
    title,
    url,
    html: child(entry, 'summary') ?? child(entry, 'content') ?? '',
    author: author ? stripHtml(author) || null : null,
    publishedAt: date(child(entry, 'published') ?? child(entry, 'updated')),
    categories: categories(entry),
  }
}

export function parseFeed(xml: string): FeedEntry[] {
  try {
    const items = blocks(xml, 'item')
    if (items.length > 0) return items.map(parseRssItem).filter((e): e is FeedEntry => e !== null)
    return blocks(xml, 'entry')
      .map(parseAtomEntry)
      .filter((e): e is FeedEntry => e !== null)
  } catch (error) {
    console.error('[news] feed parse failed', error)
    return []
  }
}
