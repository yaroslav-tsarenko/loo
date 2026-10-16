import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { faviconIco } from '@/ui/design/brand/favicon'
import { logoMarkSvg } from '@/ui/design/brand/mark-svg'
import { frameSpans, LOO_COLORS, LOO_EYES, LOO_GRID, LOO_MOODS, LOO_TIMELINES, looTimeline, MARK_BOX, markRects, poseRects, timelineTicks } from '@/ui/design/mascot/pixels'

describe('Loo pixel mascot', () => {
  it('every mood has a key frame and spans that tile its clock', () => {
    for (const mood of LOO_MOODS) {
      const t = LOO_TIMELINES[mood]
      expect(t.frames.length, mood).toBeGreaterThan(0)
      const spans = frameSpans(t)
      const ticks = timelineTicks(t)
      // each tick 0…ticks-1 is covered by exactly one frame
      for (let tick = 0; tick < ticks; tick++) {
        expect(spans.filter((s) => s.a <= tick && tick < s.a + s.h).length, `${mood} tick ${tick}`).toBe(1)
      }
      expect(spans[0]?.a).toBe(0)
    }
  })

  it('frames stay near the grid (only floating effects may poke out by a couple of cells)', () => {
    for (const mood of LOO_MOODS) {
      for (const f of LOO_TIMELINES[mood].frames) {
        for (const p of poseRects(f.pose, { hat: 'party', glasses: 'nerd', scarf: '#f00', hoodie: '#00f' })) {
          expect(p.w, mood).toBeGreaterThan(0)
          expect(p.x, mood).toBeGreaterThanOrEqual(0)
          expect(p.x + p.w, mood).toBeLessThanOrEqual(LOO_GRID)
          expect(p.y, mood).toBeGreaterThanOrEqual(-4)
          expect(p.y + p.h, mood).toBeLessThanOrEqual(LOO_GRID)
        }
      }
    }
  })

  it('eyes and bulb overrides apply to every frame of any mood', () => {
    const lit = (px: ReturnType<typeof poseRects>) => px.some((p) => p.c === LOO_COLORS.bulbOn && p.w === 2 && p.h === 2)
    for (const mood of LOO_MOODS) {
      for (const eyes of LOO_EYES) {
        const t = looTimeline(mood, { eyes })
        expect(t.frames.length).toBe(LOO_TIMELINES[mood].frames.length)
        for (const f of t.frames) expect(f.pose.eyes === eyes || (eyes === 'normal' && f.pose.eyes === 'blink'), `${mood}/${eyes}`).toBe(true)
      }
      const on = looTimeline(mood, { bulb: 'on' })
      expect(on.frames.every((f) => lit(poseRects(f.pose))), mood).toBe(true)
      const off = looTimeline(mood, { bulb: 'off' })
      expect(off.frames.some((f) => lit(poseRects(f.pose))), mood).toBe(false)
    }
    // eureka lights the bulb by itself
    expect(lit(poseRects(LOO_TIMELINES.eureka.frames[0]!.pose))).toBe(true)
  })

  it('logo mark fits its 16×16 crop and has no shadow', () => {
    const [x, y, w, h] = MARK_BOX
    for (const p of markRects()) {
      expect(p.c).not.toBe('currentColor')
      expect(p.x).toBeGreaterThanOrEqual(x)
      expect(p.y).toBeGreaterThanOrEqual(y)
      expect(p.x + p.w).toBeLessThanOrEqual(x + w)
      expect(p.y + p.h).toBeLessThanOrEqual(y + h)
    }
    expect(logoMarkSvg(64)).toContain('shape-rendering="crispEdges"')
  })

  it('src/app/favicon.ico matches the current pixels (regenerate: pnpm exec tsx scripts/favicon.ts)', () => {
    const committed = new Uint8Array(readFileSync(new URL('../../src/app/favicon.ico', import.meta.url)))
    expect(Buffer.from(committed).equals(Buffer.from(faviconIco()))).toBe(true)
  })
})
