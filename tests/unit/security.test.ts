import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { runSnippet } from '@/ai/reels/code-check'
import { urlResponds } from '@/ai/reels/generate'
import { cronAuthorized, secretsEqual } from '@/lib/auth'
import { buildCsp, buildPublicCsp, RUNNER_WORKER_CSP } from '@/lib/csp'
import { isBarePath, isPublicRequest, isStaticPublic } from '@/lib/auth-paths'
import { isWithin, resolveInside } from '@/lib/path-guard'
import { clientIp, hitAll, hitRateLimit, MemoryRateLimitStore } from '@/lib/rate-limit'
import { safeRedirectPath } from '@/lib/redirect'
import { isSameOrigin } from '@/lib/same-origin'
import { safeExternalUrl, safeImageSrc, safeLinkHref } from '@/lib/url'
import { workerSource } from '@/ui/code/worker-source'

describe('url allow-listing', () => {
  it('keeps http(s) external urls and rejects everything else', () => {
    expect(safeExternalUrl('https://nodejs.org/en/blog')).toBe('https://nodejs.org/en/blog')
    expect(safeExternalUrl('  http://example.com/a?b=1  ')).toBe('http://example.com/a?b=1')
    for (const bad of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', ' javascript:alert(1)', 'java\tscript:alert(1)', 'data:text/html,<script>', 'vbscript:x', '//evil.com', '/relative', 'https://user:pw@evil.com', 'file:///etc/passwd', '', null, 42])
      expect(safeExternalUrl(bad), String(bad)).toBeNull()
  })

  it('allows relative, http(s), mailto and obsidian links in markdown only', () => {
    for (const ok of ['/g/js/intro', '#heading', '?q=1', 'Other note.md', './x', '../y', 'https://developer.mozilla.org', 'mailto:a@b.c', 'obsidian://open?vault=V&file=F'])
      expect(safeLinkHref(ok), ok).not.toBeNull()
    for (const bad of ['javascript:alert(1)', 'data:text/html;base64,PHNjcmlwdD4=', '//evil.com', '/\\evil.com', '\\\\evil.com', 'vbscript:msgbox', 'java\nscript:alert(1)', 'blob:https://x/y', 'Note: thing'])
      expect(safeLinkHref(bad), bad).toBeNull()
  })

  it('only same-origin or inline raster images', () => {
    expect(safeImageSrc('/api/vault-asset?path=a.png')).toBe('/api/vault-asset?path=a.png')
    expect(safeImageSrc('data:image/png;base64,iVBORw0KGgo=')).not.toBeNull()
    for (const bad of ['https://tracker.example/pixel.gif', '//evil.com/x.png', 'data:image/svg+xml;base64,PHN2Zz4=', 'javascript:alert(1)', '/\\evil'])
      expect(safeImageSrc(bad), bad).toBeNull()
  })
})

describe('safeRedirectPath', () => {
  it('keeps same-origin paths', () => {
    expect(safeRedirectPath('/g/js/intro?x=1#h')).toBe('/g/js/intro?x=1#h')
    expect(safeRedirectPath('/')).toBe('/')
  })

  it('rejects open redirects and odd inputs', () => {
    for (const bad of ['//evil.com', '/\\evil.com', '\\\\evil.com', '/\t/evil.com', '/\n/evil.com', 'https://evil.com', 'evil.com', 'javascript:alert(1)', '/login', '/signup', '/reset-password', '/auth/callback?code=x', '', undefined, 7, ['/a']])
      expect(safeRedirectPath(bad), JSON.stringify(bad)).toBe('/')
  })
})

describe('path guard', () => {
  let root: string
  let outside: string
  beforeAll(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'vault-'))
    outside = await mkdtemp(path.join(os.tmpdir(), 'outside-'))
    await mkdir(path.join(root, 'Guides'), { recursive: true })
    await writeFile(path.join(root, 'Guides', 'a.png'), 'x')
    await writeFile(path.join(outside, 'secret.png'), 'x')
    await symlink(path.join(outside, 'secret.png'), path.join(root, 'Guides', 'link.png'))
  })
  afterAll(async () => {
    await rm(root, { recursive: true, force: true })
    await rm(outside, { recursive: true, force: true })
  })

  it('resolves files inside the root', async () => {
    expect(await resolveInside(root, 'Guides/a.png')).toMatch(/Guides[\\/]a\.png$/)
  })

  it('blocks traversal, absolute paths, NUL bytes and symlink escapes', async () => {
    for (const bad of ['../outside/secret.png', 'Guides/../../x.png', path.join(outside, 'secret.png'), 'Guides/a.png\0.png', 'Guides/link.png', '', 'Guides/missing.png'])
      expect(await resolveInside(root, bad), bad).toBeNull()
  })

  it('isWithin is not fooled by sibling prefixes', () => {
    expect(isWithin('/vault', '/vault/a.png')).toBe(true)
    expect(isWithin('/vault', '/vault-evil/a.png')).toBe(false)
    expect(isWithin('/vault', '/vault')).toBe(false)
  })
})

describe('rate limiter', () => {
  it('allows up to the limit per window, then blocks until reset', async () => {
    const store = new MemoryRateLimitStore()
    const rule = { limit: 3, windowMs: 1000 }
    const results = []
    for (let i = 0; i < 4; i++) results.push(await hitRateLimit(store, 'k', rule, 0))
    expect(results.map((r) => r.allowed)).toEqual([true, true, true, false])
    expect(results[3]!.retryAfterMs).toBe(1000)
    expect((await hitRateLimit(store, 'k', rule, 1000)).allowed).toBe(true)
  })

  it('combines rules: any blocked rule blocks', async () => {
    const store = new MemoryRateLimitStore()
    const perIp = { limit: 10, windowMs: 1000 }
    const global = { limit: 2, windowMs: 5000 }
    const hit = (ip: string) => hitAll(store, [{ key: `ip:${ip}`, rule: perIp }, { key: 'global', rule: global }], 0)
    expect((await hit('a')).allowed).toBe(true)
    expect((await hit('b')).allowed).toBe(true)
    const third = await hit('c')
    expect(third.allowed).toBe(false)
    expect(third.retryAfterMs).toBe(5000)
  })

  it('bounds memory', async () => {
    const store = new MemoryRateLimitStore(10)
    for (let i = 0; i < 100; i++) await store.increment(`k${i}`, 1000, 0)
    expect((store as unknown as { windows: Map<string, unknown> }).windows.size).toBeLessThanOrEqual(10)
  })

  it('reads the client ip from proxy headers', () => {
    expect(clientIp(new Headers({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1' }))).toBe('1.2.3.4')
    expect(clientIp(new Headers({ 'x-real-ip': '5.6.7.8', 'x-forwarded-for': '1.2.3.4' }))).toBe('5.6.7.8')
    expect(clientIp(new Headers())).toBe('unknown')
  })
})

describe('cron secret', () => {
  it('is compared in constant time and fails closed', async () => {
    const secret = 's'.repeat(32)
    expect(await cronAuthorized(`Bearer ${secret}`, secret)).toBe(true)
    expect(await cronAuthorized(`Bearer ${secret}x`, secret)).toBe(false)
    expect(await cronAuthorized('Bearer ', secret)).toBe(false)
    expect(await cronAuthorized(null, secret)).toBe(false)
    expect(await cronAuthorized('Bearer undefined', undefined)).toBe(false)
    expect(await cronAuthorized('Bearer short', 'short')).toBe(false)
    expect(await secretsEqual('a', 'a')).toBe(true)
  })
})

describe('same-origin check', () => {
  it('accepts same host only', () => {
    expect(isSameOrigin(new Headers({ host: 'app.test', origin: 'https://app.test' }))).toBe(true)
    expect(isSameOrigin(new Headers({ host: 'app.test', origin: 'https://evil.test' }))).toBe(false)
    expect(isSameOrigin(new Headers({ host: 'app.test', origin: 'null' }))).toBe(false)
    expect(isSameOrigin(new Headers({ host: 'app.test', 'sec-fetch-site': 'same-origin' }))).toBe(true)
    expect(isSameOrigin(new Headers({ host: 'app.test', 'sec-fetch-site': 'cross-site' }))).toBe(false)
    expect(isSameOrigin(new Headers({ host: 'app.test' }))).toBe(false)
  })
})

describe('content security policy', () => {
  it('is nonce-based and strict in production', () => {
    const csp = buildCsp({ nonce: 'abc', dev: false, https: true })
    expect(csp).toContain("script-src 'self' 'nonce-abc' 'strict-dynamic'")
    expect(csp).not.toContain('unsafe-eval')
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("base-uri 'none'")
    expect(csp).toContain('upgrade-insecure-requests')
    expect(buildCsp({ nonce: 'abc', dev: true, https: false })).toContain("'unsafe-eval'")
    expect(buildCsp({ nonce: 'abc', dev: false, https: false })).not.toContain('upgrade-insecure-requests')
  })

  it('locks the runner worker down to eval only', () => {
    expect(RUNNER_WORKER_CSP).toBe("default-src 'none'; script-src 'unsafe-eval'")
  })
})

describe('code runner worker source', () => {
  it('is a self-contained script that scrubs network and storage globals', () => {
    const source = workerSource()
    expect(() => new Function(source)).not.toThrow()
    for (const name of ['fetch', 'XMLHttpRequest', 'WebSocket', 'importScripts', 'indexedDB', 'caches', 'navigator']) expect(source).toMatch(new RegExp(`["']${name}["']`))
  })
})

describe('reels code sandbox', () => {
  it('blocks host-realm escapes and keeps secrets out of reach', async () => {
    const escapes = [
      "console.log.constructor('return process')()",
      "this.constructor.constructor('return process')()",
      "Object.getPrototypeOf(globalThis).constructor.constructor('return process')()",
    ]
    for (const expr of escapes) {
      // A host Function would return the real process object; the context's own Function can't see it.
      expect(await runSnippet(`let r; try { r = typeof ${expr} } catch (e) { r = e.name } console.log(r)`), expr).toEqual({ status: 'ok', logs: ['ReferenceError'] })
    }
    const custom = await runSnippet("console.log({ [Symbol.for('nodejs.util.inspect.custom')]: (d, o, i) => typeof i })")
    expect(custom.status).toBe('ok')
    expect(custom.logs.join()).not.toContain('function')
  })

  it('still formats output like Node', async () => {
    expect(await runSnippet("console.log([1, { a: 2 }], 'x', new Set([1]))")).toEqual({ status: 'ok', logs: ["[ 1, { a: 2 } ] x Set(1) { 1 }"] })
  })
})

describe('reel reference links', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('never fetches hosts outside the allow-list, even via redirects', async () => {
    const calls: string[] = []
    vi.stubGlobal('fetch', async (url: string) => {
      calls.push(url)
      if (url.startsWith('https://developer.mozilla.org/')) return new Response(null, { status: 301, headers: { location: 'http://169.254.169.254/latest' } })
      return new Response(null, { status: 200 })
    })
    expect(await urlResponds('https://developer.mozilla.org/docs/x')).toBe(false)
    expect(await urlResponds('https://evil.example/x')).toBe(false)
    expect(calls).toEqual(['https://developer.mozilla.org/docs/x'])
  })
})

describe('failure-only rate limiting', () => {
  it('peekAll blocks only after the limit is used up and never counts by itself', async () => {
    const { MemoryRateLimitStore, peekAll, hitAll } = await import('@/lib/rate-limit')
    const store = new MemoryRateLimitStore()
    const checks = [{ key: 'signin:ip:1', rule: { limit: 2, windowMs: 60_000 } }]
    for (let i = 0; i < 10; i++) expect((await peekAll(store, checks, 1000)).allowed).toBe(true)
    await hitAll(store, checks, 1000)
    expect((await peekAll(store, checks, 1000)).allowed).toBe(true)
    await hitAll(store, checks, 1000)
    const blocked = await peekAll(store, checks, 1000)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterMs).toBe(60_000)
    expect((await peekAll(store, checks, 61_001)).allowed).toBe(true)
  })
})

describe('static public pages (prerendered: no nonce, no session check)', () => {
  it('are exactly the blog and the landing', () => {
    for (const p of ['/blog', '/blog/javascript', '/blog/javascript-array-methods', '/blog/about', '/welcome']) expect(isStaticPublic(p), p).toBe(true)
    for (const p of ['/', '/path', '/login', '/blog/../path', '/blog/A', '/welcome/x', '/api/counts', '/admin', '/g/js-start/01']) expect(isStaticPublic(p), p).toBe(false)
    expect(isPublicRequest('GET', '/welcome', false)).toBe(true)
    expect(isBarePath('/welcome')).toBe(true)
  })

  it('their CSP differs from the app policy only in script-src', () => {
    const app = buildCsp({ nonce: 'abc', dev: false, https: true, supabaseUrl: 'https://x.supabase.co' })
    const pub = buildPublicCsp({ dev: false, https: true, supabaseUrl: 'https://x.supabase.co' })
    expect(pub).toContain("script-src 'self' 'unsafe-inline';")
    expect(pub).not.toContain('nonce-')
    expect(pub).not.toContain('strict-dynamic')
    const rest = (csp: string) => csp.split('; ').filter((d) => !d.startsWith('script-src'))
    expect(rest(pub)).toEqual(rest(app))
    expect(pub).toContain("frame-ancestors 'none'")
  })
})
