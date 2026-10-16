import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { faviconIco } from '@/ui/design/brand/favicon'
import { logoMarkSvg } from '@/ui/design/brand/mark-svg'
import { frameSpans, LOO_COLORS, LOO_EYES, LOO_FORM_LABEL, LOO_FORMS, LOO_GRID, LOO_MOODS, LOO_TIMELINES, looTimeline, MARK_BOX, markRects, poseRects, timelineTicks, type LooSkin } from '@/ui/design/mascot/pixels'
import { LOO_FORMS as INDEX_FORMS, LOO_FORM_LABEL as INDEX_LABELS } from '@/ui/design/mascot/LooArt'

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

  describe('evolution forms', () => {
    const SKINS: (LooSkin | undefined)[] = [undefined, { hat: 'beanie', glasses: 'nerd', hoodie: '#00f' }, { hat: 'party', glasses: 'round', scarf: '#f00' }, { hat: 'grad', glasses: 'shades' }]

    it('exports the ordered forms with Ukrainian labels', () => {
      expect(LOO_FORMS).toEqual(['egg', 'pixel', 'block', 'lamp', 'charged', 'armored', 'crowned', 'legendary'])
      expect(Object.values(LOO_FORM_LABEL)).toEqual(['Яйце', 'Піксель', 'Блок', 'Ламповий', 'Заряджений', 'Броньований', 'Коронований', 'Легендарний'])
      expect(INDEX_FORMS).toBe(LOO_FORMS)
      expect(INDEX_LABELS).toBe(LOO_FORM_LABEL)
    })

    it("'block' is the default look", () => {
      for (const mood of LOO_MOODS) {
        const pose = LOO_TIMELINES[mood].frames[0]!.pose
        expect(poseRects(pose, undefined, { form: 'block' })).toEqual(poseRects(pose))
      }
    })

    it('every form renders every frame of every mood (and every eye expression, every skin) near the grid', () => {
      const bad: string[] = []
      const check = (label: string, px: ReturnType<typeof poseRects>) => {
        if (px.length < 10) bad.push(`${label}: empty`)
        for (const p of px) if (!(p.w > 0 && p.h > 0 && p.x >= -1 && p.x + p.w <= LOO_GRID + 1 && p.y >= -4 && p.y + p.h <= LOO_GRID)) bad.push(`${label}: ${JSON.stringify(p)}`)
      }
      for (const form of LOO_FORMS) {
        for (const mood of LOO_MOODS) {
          for (const [i, f] of LOO_TIMELINES[mood].frames.entries()) for (const skin of SKINS) check(`${form}/${mood}/${i}`, poseRects(f.pose, skin, { form, tier: 3 }))
          for (const eyes of LOO_EYES) check(`${form}/${mood}/${eyes}`, poseRects(looTimeline(mood, { eyes }).frames[0]!.pose, undefined, { form, tier: 1 }))
        }
      }
      expect(bad.slice(0, 5)).toEqual([])
    })

    it('forms look different from each other, and tiers add detail', () => {
      const idle = LOO_TIMELINES.idle.frames[0]!.pose
      const key = (form: (typeof LOO_FORMS)[number], tier?: 1 | 2 | 3) => JSON.stringify(poseRects(idle, undefined, { form, tier }))
      expect(new Set(LOO_FORMS.map((f) => key(f))).size).toBe(LOO_FORMS.length)
      for (const form of LOO_FORMS) expect(new Set([key(form), key(form, 1), key(form, 2), key(form, 3)]).size, form).toBe(4)
    })

    it('legendary always lights its bulb; the logo mark stays the block form', () => {
      const sleeping = LOO_TIMELINES.sleeping.frames[0]!.pose
      expect(poseRects(sleeping, undefined, { form: 'legendary' }).some((p) => p.cls === 'loo-aura')).toBe(true)
      expect(markRects()).toEqual(poseRects({ eyes: 'normal', arms: ['rest', 'rest'], spring: 'a', cheeks: true, bulb: 'on' }).filter((p) => p.c !== 'currentColor' && p.c !== LOO_COLORS.glow))
    })
  })
})
