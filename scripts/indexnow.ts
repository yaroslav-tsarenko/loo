// Tells Bing, Yandex, Seznam & co. (IndexNow) about new or updated URLs — they crawl them within minutes instead of
// days. Google does not take IndexNow; it learns from the sitemap (Search Console) and links. docs/BLOG.md.
//
//   pnpm indexnow /blog/some-post /blog/sql          — after those pages are live
//   pnpm indexnow --wait /blog/some-post             — first wait (≤ 10 min) until the URL answers 200 (fresh deploy)
import { readFile } from 'node:fs/promises'

const SITE = (process.env.SITE_URL ?? 'https://playloo.app').replace(/\/$/, '')
const args = process.argv.slice(2)
const wait = args.includes('--wait')
const paths = args.filter((a) => a.startsWith('/'))
if (paths.length === 0) {
  console.log('indexnow: nothing to submit')
  process.exit(0)
}
const key = (await readFile('public/blog/indexnow.txt', 'utf8')).trim()
const urls = [...new Set([...paths, '/blog', '/sitemap.xml'])].map((p) => `${SITE}${p}`)

if (wait) {
  const first = `${SITE}${paths[0]}`
  const deadline = Date.now() + 10 * 60_000
  for (;;) {
    const res = await fetch(first, { method: 'HEAD', cache: 'no-store' }).catch(() => null)
    if (res?.ok) break
    if (Date.now() > deadline) {
      console.warn(`indexnow: ${first} is still not live, giving up`)
      process.exit(0)
    }
    await new Promise((r) => setTimeout(r, 20_000))
  }
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/blog/indexnow.txt`, urlList: urls }),
})
console.log(`indexnow: ${res.status} for ${urls.length} URLs`)
