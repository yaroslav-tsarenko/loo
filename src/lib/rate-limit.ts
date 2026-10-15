// Fixed-window rate limiter. The store does the atomic increment (Postgres in prod, memory in tests).

export interface RateLimitStore {
  // Increments the counter for `key`, starting a new window when the old one has ended.
  increment(key: string, windowMs: number, now: number): Promise<{ count: number; resetAt: number }>
}

export interface RateLimitRule {
  limit: number
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterMs: number
}

export async function hitRateLimit(store: RateLimitStore, key: string, rule: RateLimitRule, now = Date.now()): Promise<RateLimitResult> {
  const { count, resetAt } = await store.increment(key, rule.windowMs, now)
  const allowed = count <= rule.limit
  return { allowed, remaining: Math.max(0, rule.limit - count), retryAfterMs: allowed ? 0 : Math.max(0, resetAt - now) }
}

// All rules are counted; the request passes only if every one allows it.
export async function hitAll(store: RateLimitStore, checks: { key: string; rule: RateLimitRule }[], now = Date.now()): Promise<RateLimitResult> {
  const results = await Promise.all(checks.map((c) => hitRateLimit(store, c.key, c.rule, now)))
  const blocked = results.filter((r) => !r.allowed)
  if (blocked.length === 0) return { allowed: true, remaining: Math.min(...results.map((r) => r.remaining)), retryAfterMs: 0 }
  return { allowed: false, remaining: 0, retryAfterMs: Math.max(...blocked.map((r) => r.retryAfterMs)) }
}

export class MemoryRateLimitStore implements RateLimitStore {
  private readonly windows = new Map<string, { count: number; resetAt: number }>()

  constructor(private readonly maxKeys = 10_000) {}

  async increment(key: string, windowMs: number, now: number): Promise<{ count: number; resetAt: number }> {
    const current = this.windows.get(key)
    const next = !current || current.resetAt <= now ? { count: 1, resetAt: now + windowMs } : { count: current.count + 1, resetAt: current.resetAt }
    this.windows.set(key, next)
    if (this.windows.size > this.maxKeys) this.prune(now)
    return next
  }

  private prune(now: number): void {
    for (const [k, v] of this.windows) if (v.resetAt <= now) this.windows.delete(k)
    // Still too many live keys: drop the oldest insertions.
    for (const k of this.windows.keys()) {
      if (this.windows.size <= this.maxKeys) break
      this.windows.delete(k)
    }
  }
}

// Client IP for rate-limit keys. On Vercel x-forwarded-for / x-real-ip are set by the edge and can't be spoofed;
// elsewhere they are client-controlled, so a global rule must back up the per-IP one.
export function clientIp(headers: Headers): string {
  const real = headers.get('x-real-ip')?.trim()
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = real || forwarded || 'unknown'
  return ip.slice(0, 64)
}
