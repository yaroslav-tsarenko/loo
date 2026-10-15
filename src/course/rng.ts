// Deterministic randomness for tests/exams: same seed → same questions, on server and client alike.

export type Seed = string | number

// FNV-1a, 32-bit
export function hash32(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function hashHex(text: string, length = 8): string {
  let out = ''
  let salt = 0
  while (out.length < length) out += hash32(`${salt++}|${text}`).toString(16).padStart(8, '0')
  return out.slice(0, length)
}

// mulberry32
export function rng(seed: Seed): () => number {
  let a = typeof seed === 'number' ? seed >>> 0 : hash32(seed)
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}
