import { excerpt, parseFeed, stripHtml } from '../feed'
import { fetchText, safely } from '../http'
import { isNotableRelease, parseRelease } from '../release'
import type { NewsDraft } from '../types'

const REPOS: { repo: string; name: string }[] = [
  { repo: 'nodejs/node', name: 'Node.js' },
  { repo: 'microsoft/TypeScript', name: 'TypeScript' },
  { repo: 'vercel/next.js', name: 'Next.js' },
  { repo: 'facebook/react', name: 'React' },
  { repo: 'oven-sh/bun', name: 'Bun' },
  { repo: 'denoland/deno', name: 'Deno' },
  { repo: 'vitejs/vite', name: 'Vite' },
]

const CAP_PER_REPO = 3

function releaseTitle(name: string, raw: string): string {
  const r = parseRelease(raw)
  if (!r) return `${name} ${raw}`
  const channel = /\((Current|LTS)\)/i.exec(raw)?.[1]
  const lts = /'([A-Z][a-z]+)'/.exec(raw)?.[1]
  const pre = r.pre ? ` ${r.pre.replace(/\.0$/, '').toUpperCase().replace('BETA', 'Beta')}` : ''
  return `${name} ${r.version}${pre}${channel ? ` (${channel}${lts ? ` · ${lts}` : ''})` : ''}`
}

export function fetchGithubReleases(): Promise<NewsDraft[]>[] {
  return REPOS.map(({ repo, name }) =>
    safely(`github/${repo}`, async () => {
      const xml = await fetchText(`https://github.com/${repo}/releases.atom`)
      if (!xml) return []
      const out: NewsDraft[] = []
      for (const e of parseFeed(xml)) {
        // Monorepo side packages (react-devtools@…, vscode-typescript/…) are not product releases.
        if (/@\d|\//.test(e.title.split(' ')[0] ?? '')) continue
        // Release notes start with headings and commit hashes: keep just the prose.
        const text = stripHtml(e.html)
          .replace(/\[\s*[0-9a-f]{7,40}\s*\]/g, '')
          .replace(/\((SEMVER-(MAJOR|MINOR|PATCH))\)\s*/g, '')
          .replace(/^(Notable Changes|Highlights|What'?s Changed|Core Changes|Changes)\s*/i, '')
          .replace(/^[\s•*–—-]+/, '')
          .replace(/\s+/g, ' ')
          .trim()
        if (!isNotableRelease(e.title, text)) continue
        out.push({
          source: `github/${repo}`,
          title: releaseTitle(name, e.title),
          url: e.url,
          summary: text ? excerpt(text, 280) : undefined,
          score: 0,
          tags: ['release'],
          publishedAt: e.publishedAt ?? Date.now(),
        })
        if (out.length >= CAP_PER_REPO) break
      }
      return out
    }),
  )
}
