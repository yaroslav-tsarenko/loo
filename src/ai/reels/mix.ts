// Feed mixing: one generated reel after every `every` guide reels, starting with a generated one
// so today's fresh reel shows up first. Leftovers of either queue go to the end.
export function interleave<T>(guide: readonly T[], generated: readonly T[], every = 2): T[] {
  const out: T[] = []
  let g = 0
  let a = 0
  while (g < guide.length || a < generated.length) {
    if (a < generated.length) out.push(generated[a++]!)
    for (let i = 0; i < every && g < guide.length; i++) out.push(guide[g++]!)
    if (g >= guide.length) while (a < generated.length) out.push(generated[a++]!)
  }
  return out
}

export const GENERATED_ID = /^ai-[0-9a-f]{40}$/
export const REEL_ID = /^(?:reel-[0-9a-f]{12}|ai-[0-9a-f]{40})$/
