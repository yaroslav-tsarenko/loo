// A least-recently-used cache with a byte budget (insertion order of a Map is the recency). The caller estimates the
// cost of an entry; entries are evicted from the least recently used until the total fits. An entry larger than the
// whole budget is not cached.
export class ByteLru<V> {
  private readonly map = new Map<string, { value: V; cost: number }>()
  bytes = 0
  evictions = 0

  constructor(public budget: number) {}

  get size(): number {
    return this.map.size
  }

  get(key: string): V | undefined {
    const hit = this.map.get(key)
    if (!hit) return undefined
    this.map.delete(key)
    this.map.set(key, hit)
    return hit.value
  }

  has(key: string): boolean {
    return this.map.has(key)
  }

  // false: the entry is larger than the budget and was not kept
  set(key: string, value: V, cost: number): boolean {
    this.delete(key)
    if (cost > this.budget) return false
    this.map.set(key, { value, cost })
    this.bytes += cost
    while (this.bytes > this.budget) {
      const oldest = this.map.keys().next().value
      if (oldest === undefined) break
      this.delete(oldest)
      this.evictions++
    }
    return true
  }

  delete(key: string): void {
    const hit = this.map.get(key)
    if (!hit) return
    this.map.delete(key)
    this.bytes -= hit.cost
  }

  clear(): void {
    this.map.clear()
    this.bytes = 0
  }

  keys(): string[] {
    return [...this.map.keys()]
  }
}

// MB from an environment variable (a number), else the default
export function budgetFromEnv(name: string, fallbackMb: number): number {
  const raw = Number(process.env[name])
  return (Number.isFinite(raw) && raw >= 0 && process.env[name] !== undefined && process.env[name] !== '' ? raw : fallbackMb) * 1_000_000
}
