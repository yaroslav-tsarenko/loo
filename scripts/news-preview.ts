import { collectNews } from '../src/news/collect'
import { sourceLabel, TAG_META } from '../src/news/types'

// Usage: pnpm news:preview — fetches all news sources (no DB) and prints counts and the top 10.
const started = Date.now()
const { items, fetched } = await collectNews(started)
console.log(`\nFetched in ${Date.now() - started} ms`)
for (const [source, n] of Object.entries(fetched).sort()) console.log(`  ${source.padEnd(12)} ${n}`)
console.log(`  ${'after dedupe'.padEnd(12)} ${items.length}\n`)
const byTag = new Map<string, number>()
for (const item of items) for (const t of item.tags) byTag.set(t, (byTag.get(t) ?? 0) + 1)
console.log([...byTag].map(([t, n]) => `${TAG_META[t as keyof typeof TAG_META].label} (${t}) ${n}`).join(' · '), '\n')
const limit = Number(process.argv[2] ?? 10)
for (const item of [...items].sort((a, b) => b.rank - a.rank).slice(0, limit)) {
  const age = Math.round((started - item.publishedAt) / 3_600_000)
  console.log(`${String(item.rank).padStart(3)} [${TAG_META[item.tags[0]!].label}] ${item.title}`)
  console.log(`      ${sourceLabel(item.source)} · ${age} год тому · [${item.tags.join(', ')}] · ${item.url}`)
}
