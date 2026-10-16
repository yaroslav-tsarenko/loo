export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

export type Tone = 'violet' | 'mint' | 'green' | 'blue' | 'red' | 'yellow' | 'orange' | 'purple' | 'pink' | 'gray'

export const TONES: readonly Tone[] = ['violet', 'mint', 'green', 'blue', 'red', 'yellow', 'orange', 'purple', 'pink', 'gray']

export function clamp01(v: number): number {
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0
}
