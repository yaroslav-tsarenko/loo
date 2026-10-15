import type { EaseName } from '../types'

export interface Point {
  x: number
  y: number
}

export interface Rect {
  left: number
  top: number
  width: number
  height: number
}

export const eases: Record<EaseName, (t: number) => number> = {
  linear: (t) => t,
  in: (t) => t * t * t,
  out: (t) => 1 - Math.pow(1 - t, 3),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
}

// Slight overshoot near the end, like a real hand on a trackpad.
export function cursorEase(p: number): number {
  if (p <= 0) return 0
  if (p >= 1) return 1
  const split = 0.84
  const peak = 1.025
  if (p < split) return eases.inOut(p / split) * peak
  const t = (p - split) / (1 - split)
  return peak - (peak - 1) * (1 - Math.pow(1 - t, 2))
}

export function arcControls(a: Point, b: Point, bend: number): [Point, Point] {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dist = Math.hypot(dx, dy) || 1
  const nx = -dy / dist
  const ny = dx / dist
  const off = Math.min(110, dist * 0.16) * bend
  return [
    { x: a.x + dx * 0.28 + nx * off, y: a.y + dy * 0.28 + ny * off },
    { x: a.x + dx * 0.74 + nx * off * 0.55, y: a.y + dy * 0.74 + ny * off * 0.55 },
  ]
}

export function bezierPoint(a: Point, c1: Point, c2: Point, b: Point, t: number): Point {
  const u = 1 - t
  return {
    x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
    y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
  }
}

export function aimPoint(rect: Rect): Point {
  const fx = rect.width > 220 ? Math.min(0.5, 110 / rect.width) : 0.5
  return { x: rect.left + rect.width * fx, y: rect.top + rect.height * 0.55 }
}

export function travelMs(from: Point, to: Point): number {
  const d = Math.hypot(to.x - from.x, to.y - from.y)
  if (d < 2) return 0
  return Math.round(Math.min(950, Math.max(420, 340 + d * 0.55)))
}

// Deterministic jitter so typing feels human but replays identically.
export function charDelay(ch: string, i: number, base: number): number {
  const jitter = (((Math.sin(i * 12.9898) * 43758.5453) % 1) + 1) % 1
  const pause = ch === ' ' ? 1.7 : ch === ',' || ch === '.' || ch === ';' ? 2.6 : ch === '\n' ? 4 : 1
  return base * (0.7 + jitter * 0.6) * pause
}

export const timing = {
  lead: 450,
  press: 120,
  release: 240,
  char: 52,
  stream: 16,
  scroll: 560,
  highlight: 2100,
  highlightGap: 260,
  tail: 2400,
  fade: 380,
} as const
