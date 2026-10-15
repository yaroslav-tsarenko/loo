import { parseRelease, SECURITY_RE } from './release'
import { NEWS_TAGS, type NewsDraft, type NewsTag } from './types'

const HOUR = 3_600_000
const HALF_LIFE_H = 36

type Rule = readonly [RegExp, number]

// Learning value for someone aiming at senior/top-engineer level.
const BOOSTS: readonly Rule[] = [
  [/\b(ECMAScript|ES20\d\d|ESNext|TC39)\b/i, 0.15],
  [/\bproposals?\b|\bstage [0-4]\b/i, 0.08],
  [/\bperformance\b|\bperf\b|\bfaster\b|\bbenchmarks?\b|\blatency\b/i, 0.08],
  [/\bmemory\b|\bleaks?\b|garbage collect|\bGC\b|\bheap\b/i, 0.1],
  [/event loop|microtasks?|\blibuv\b|worker threads?/i, 0.12],
  [/\bV8\b|\bJIT\b|JavaScriptCore|SpiderMonkey|\bbytecode\b|\bJS engine/i, 0.1],
  [/\bNode(?:\.js)? ?v?2\d\b/i, 0.1],
  [/\bTypeScript ?[5-7](?:\.\d+)?\b|\bTS ?[5-7]\.\d\b|\btsgo\b/i, 0.1],
  [/\bReact 19|React Compiler|Server Components|\bRSC\b/i, 0.08],
  [SECURITY_RE, 0.12],
  [/supply.chain|malicious (npm )?packages?|\bnpm worm/i, 0.08],
  [/\bTemporal\b|\bSignals?\b|\bdecorators\b|import attributes|iterator helpers|resource management|\busing declarations?\b|\bShadowRealm\b|\bAsyncContext\b|\bRecords? (?:and|&) Tuples\b/i, 0.1],
  [/WebAssembly|\bWasm\b|WebGPU/i, 0.05],
  [/deep dive|deep-dive|internals|under the hood|\bhow .{3,40} works\b|in depth/i, 0.1],
  [/\bstreams?\b|\bconcurrency\b|\bpromises?\b|\bclosures?\b|\bprototypes?\b|\bgenerators?\b/i, 0.04],
]
const MAX_BOOST = 0.35

const PENALTIES: readonly Rule[] = [
  [/\bhiring\b|who is hiring|\bjobs?\b|for hire|\bsalary\b|freelanc|\binternships?\b|\bresume\b/i, 0.6],
  [/^show hn\b/i, 0.06],
  [/^show hn\b.*\b(saas|startup|my (app|product|tool)|side project|launch(ed)?|waitlist|pricing)\b/i, 0.2],
  [/\b(top\s*)?\d+\s+(\w+\s+){0,2}(tips|tricks|ways|things|reasons|tools|libraries|mistakes|hacks|features|packages|extensions|repos|resources|projects)\b/i, 0.1],
  [/you won'?t believe|stop using|\bis dead\b|never use|nobody (tells|talks)|game.?changer|mind.?blow|\bsecrets?\b|must.know|\binsane\b|\b10x\b|🔥|🤯|\?!|!\?/i, 0.15],
  [/for (absolute )?beginners|what is javascript|javascript basics|learn javascript in/i, 0.08],
  [/vibe.?cod|\bchatgpt prompts?\b|\bmemes?\b/i, 0.1],
  [/\b(crypto|nft|web3|blockchain)\b/i, 0.1],
  // HN title search for "react" also finds the verb.
  [/\breact(?:ed|ing|s)? to\b/i, 0.3],
]

const TAG_RULES: readonly [NewsTag, RegExp][] = [
  ['release', /\b(announcing|released?|release notes|is (?:now )?(?:out|available|stable)|now available|what'?s new in|new in chrome)\b|^(Node(?:\.js)?|TypeScript|React|Deno|Bun|Vite|Next\.js) v?\d+(\.\d+)*/i],
  ['security', /security|CVE-\d{4}-\d+|vulnerab|supply.chain|malicious (npm )?packages?|\bXSS\b|\bCSRF\b|prototype pollution|\bRCE\b/i],
  ['proposal', /\b(TC39|ECMAScript|ES20\d\d|ESNext|WHATWG|W3C|Interop 20\d\d)\b|\bproposals?\b|\bstage [0-4]\b|\bspec(ification)?\b/i],
  ['perf', /\bperformance\b|\bperf\b|\bfaster\b|\bspeed(?:s|ing)? up\b|\bbenchmarks?\b|\bmemory\b|\boptimi[sz]|\blatency\b|bundle size|\bleaks?\b/i],
  ['deep-dive', /deep dive|deep-dive|internals|under the hood|\bhow .{3,40} works\b|in depth|event loop|\bV8\b|\bJIT\b|\bJS engine|\bbytecode\b/i],
  ['tooling', /\b(vite|vitest|webpack|rspack|rolldown|rollup|esbuild|swc|oxc|oxlint|biome|eslint|prettier|turbopack|pnpm|npm|yarn|bundlers?|linters?|formatters?|monorepos?|devtools|CLI|tsgo|tsc|deno|bun|playwright|jest)\b/i],
  ['tutorial', /\bhow (?:to|i|we)\b|\bguide\b|\btutorial\b|step.by.step|\blearn(?:ing)?\b|\bbuild(?:ing)? (?:a|an|your)\b|introduction to|\bexplained\b|cheat ?sheet|\bpatterns?\b|\bbest practices\b/i],
  ['discussion', /^ask hn\b|\?\s*$/i],
]

// Per-source popularity → 0..1. Editorial feeds get a fixed authority prior instead.
const PRIOR: Record<string, number> = {
  v8: 0.85,
  typescript: 0.8,
  react: 0.8,
  jsweekly: 0.7,
  nodeweekly: 0.6,
  nodejs: 0.6,
  webdev: 0.5,
  chrome: 0.45,
}
const SCALE: Record<string, number> = { hn: 400, reddit: 250, devto: 150 }

function family(source: string): string {
  return source.split('/')[0] ?? source
}

export function popularity(d: Pick<NewsDraft, 'source' | 'score' | 'title'>): number {
  const fam = family(d.source)
  const scale = SCALE[fam]
  if (scale) return Math.min(1, Math.log1p(Math.max(0, d.score)) / Math.log1p(scale))
  if (fam === 'github') {
    const r = parseRelease(d.title)
    if (!r) return 0.5
    if (r.pre) return 0.55
    if (r.minor === 0 && r.patch === 0) return 0.9
    return r.patch === 0 ? 0.65 : 0.7
  }
  return PRIOR[d.source] ?? 0.5
}

export function recency(publishedAt: number, now: number): number {
  const ageH = Math.max(0, now - publishedAt) / HOUR
  return 0.5 ** (ageH / HALF_LIFE_H)
}

function sum(rules: readonly Rule[], text: string): number {
  let total = 0
  for (const [re, w] of rules) if (re.test(text)) total += w
  return total
}

export function learningBoost(text: string): number {
  return Math.min(MAX_BOOST, sum(BOOSTS, text))
}

export function lowValuePenalty(title: string): number {
  return sum(PENALTIES, title)
}

// Ordered by importance (first tag drives the emoji); at most 3, never empty.
export function classify(d: Pick<NewsDraft, 'source' | 'title' | 'summary' | 'tags'>): NewsTag[] {
  const found = new Set<NewsTag>()
  for (const t of d.tags) if ((NEWS_TAGS as readonly string[]).includes(t)) found.add(t as NewsTag)
  const text = `${d.title}\n${d.summary ?? ''}`
  for (const [tag, re] of TAG_RULES) {
    // Discussion and release are judged by the title only: summaries are too noisy.
    const target = tag === 'discussion' || tag === 'release' ? d.title : text
    if (re.test(target)) found.add(tag)
  }
  if (family(d.source) === 'reddit' && found.size === 0) found.add('discussion')
  if (d.source === 'devto' && found.size === 0) found.add('tutorial')
  const ordered = NEWS_TAGS.filter((t) => found.has(t) && t !== 'news')
  return ordered.length ? ordered.slice(0, 3) : ['news']
}

export function rankScore(d: NewsDraft, now: number): number {
  const text = `${d.title}\n${d.summary ?? ''}`
  const raw = 0.55 * popularity(d) + 0.25 * recency(d.publishedAt, now) + learningBoost(text) - lowValuePenalty(d.title)
  return Math.max(0, Math.min(100, Math.round(raw * 100)))
}
