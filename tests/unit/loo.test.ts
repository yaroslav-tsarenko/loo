import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { faviconIco } from '@/ui/design/brand/favicon'
import { logoMarkSvg } from '@/ui/design/brand/mark-svg'
import { frameSpans, LOO_COLORS, LOO_EYES, LOO_GRID, LOO_STAGE_LABEL, LOO_STAGES, LOO_MOODS, LOO_TIMELINES, looTimeline, MARK_BOX, markRects, poseRects, timelineTicks, type LooSkin } from '@/ui/design/mascot/pixels'
import { LOO_STAGES as INDEX_STAGES, LOO_STAGE_LABEL as INDEX_LABELS } from '@/ui/design/mascot/LooArt'

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

  describe('growth stages and gear', () => {
    const SKINS: (LooSkin | undefined)[] = [
      undefined,
      { hat: 'beanie', glasses: 'nerd', hoodie: '#00f' },
      { hat: 'party', glasses: 'round', scarf: '#f00' },
      { hat: 'grad', glasses: 'shades' },
      { head: 'leather', body: 'leather', weapon: 'wood', amulet: 'warm', aura: 'spark' },
      { head: 'iron', body: 'chain', weapon: 'iron', amulet: 'lamp', aura: 'charge', hoodie: '#f0f' },
      { head: 'knight', body: 'plate', weapon: 'staff', amulet: 'storm', aura: 'arcane', scarf: '#0f0' },
      { head: 'crown', body: 'royal', weapon: 'legend', amulet: 'sun', aura: 'legend', glasses: 'round', hat: 'cap' },
    ]
    const GEAR: LooSkin[] = [
      { head: 'leather' }, { head: 'iron' }, { head: 'knight' }, { head: 'crown' },
      { body: 'leather' }, { body: 'chain' }, { body: 'plate' }, { body: 'royal' },
      { weapon: 'wood' }, { weapon: 'iron' }, { weapon: 'staff' }, { weapon: 'legend' },
      { amulet: 'warm' }, { amulet: 'lamp' }, { amulet: 'storm' }, { amulet: 'sun' },
      { aura: 'spark' }, { aura: 'charge' }, { aura: 'arcane' }, { aura: 'legend' },
    ]

    it('exports the ordered stages with Ukrainian labels', () => {
      expect(LOO_STAGES).toEqual(['egg', 'small', 'normal'])
      expect(Object.values(LOO_STAGE_LABEL)).toEqual(['Яйце', 'Малий Loo', 'Loo'])
      expect(INDEX_STAGES).toBe(LOO_STAGES)
      expect(INDEX_LABELS).toBe(LOO_STAGE_LABEL)
    })

    it("'normal' is the default look", () => {
      for (const mood of LOO_MOODS) {
        const pose = LOO_TIMELINES[mood].frames[0]!.pose
        expect(poseRects(pose, undefined, { stage: 'normal' })).toEqual(poseRects(pose))
      }
    })

    it('every stage renders every frame of every mood (and every eye expression, every skin and gear set) near the grid', () => {
      const bad: string[] = []
      const check = (label: string, px: ReturnType<typeof poseRects>) => {
        if (px.length < 10) bad.push(`${label}: empty`)
        for (const p of px) if (!(p.w > 0 && p.h > 0 && p.x >= -1 && p.x + p.w <= LOO_GRID + 1 && p.y >= -4 && p.y + p.h <= LOO_GRID)) bad.push(`${label}: ${JSON.stringify(p)}`)
      }
      for (const stage of LOO_STAGES) {
        for (const mood of LOO_MOODS) {
          for (const [i, f] of LOO_TIMELINES[mood].frames.entries()) for (const skin of SKINS) check(`${stage}/${mood}/${i}`, poseRects(f.pose, skin, { stage }))
          for (const eyes of LOO_EYES) check(`${stage}/${mood}/${eyes}`, poseRects(looTimeline(mood, { eyes }).frames[0]!.pose, undefined, { stage }))
        }
      }
      expect(bad.slice(0, 5)).toEqual([])
    })

    it('stages look different, and every gear piece changes the drawing', () => {
      const idle = LOO_TIMELINES.idle.frames[0]!.pose
      const key = (skin: LooSkin | undefined, stage: (typeof LOO_STAGES)[number] = 'normal') => JSON.stringify(poseRects(idle, skin, { stage }))
      expect(new Set(LOO_STAGES.map((st) => key(undefined, st))).size).toBe(LOO_STAGES.length)
      expect(new Set([key(undefined), ...GEAR.map((g) => key(g))]).size).toBe(GEAR.length + 1)
    })

    it('head gear replaces the hat; the legendary aura glows; the logo mark stays plain', () => {
      const idle = LOO_TIMELINES.idle.frames[0]!.pose
      expect(poseRects(idle, { head: 'iron', hat: 'party' })).toEqual(poseRects(idle, { head: 'iron' }))
      const sleeping = LOO_TIMELINES.sleeping.frames[0]!.pose
      expect(poseRects(sleeping, { aura: 'legend' }).some((p) => p.cls === 'loo-aura')).toBe(true)
      expect(poseRects(sleeping).some((p) => p.cls === 'loo-aura')).toBe(false)
      expect(markRects()).toEqual(poseRects({ eyes: 'normal', arms: ['rest', 'rest'], spring: 'a', cheeks: true, bulb: 'on' }).filter((p) => p.c !== 'currentColor' && p.c !== LOO_COLORS.glow))
    })
  })
})
