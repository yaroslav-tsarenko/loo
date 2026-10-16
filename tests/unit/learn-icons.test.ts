import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { CourseBundleSchema } from '@/course'
import { FIGURE_CATALOG } from '@/content/blocks/figure/catalog'
import { EMOJI_ICON_TABLE, EXAM_ICON, iconRef, LESSON_ICONS, REEL_FALLBACK_ICON, SECTION_FALLBACK_ICON, TEST_ICON, TOPIC_FALLBACK_ICONS } from '@/content/icons'
import { STAGES, TRACKS } from '@/content/tracks'
import { messages } from '@/i18n'
import { TAG_META } from '@/news/types'
import { BUDGETS, STEP_ICONS } from '@/progress/mission'
import { hasIcon } from '@/ui/icons/catalog'
import { parseIconRef } from '@/ui/icons/ref'

// pictographs, except typographic © ® ™
const PICTO = /(?![\u00A9\u00AE\u2122])\p{Extended_Pictographic}/u

// Every icon the learning UI renders must be a real library / pixel icon, never an emoji.
function expectIcon(ref: string, where: string) {
  expect(parseIconRef(ref)?.set, `${where}: ${ref}`).not.toBe('emoji')
  expect(hasIcon(ref), `${where}: unknown icon ${ref}`).toBe(true)
}

describe('learning icon refs', () => {
  it('resolve to known icons', () => {
    for (const [k, v] of Object.entries(LESSON_ICONS)) expectIcon(v, `lesson ${k}`)
    for (const v of [TEST_ICON, EXAM_ICON, SECTION_FALLBACK_ICON, REEL_FALLBACK_ICON, ...TOPIC_FALLBACK_ICONS]) expectIcon(v, 'fallback')
    for (const [k, v] of Object.entries(EMOJI_ICON_TABLE)) expectIcon(v, `emoji ${k}`)
    for (const t of TRACKS) expectIcon(t.icon, `track ${t.id}`)
    for (const [k, s] of Object.entries(STAGES)) expectIcon(s.icon, `stage ${k}`)
    for (const [k, m] of Object.entries(TAG_META)) expectIcon(m.icon, `news ${k}`)
    for (const b of BUDGETS) expectIcon(b.icon, `budget ${b.id}`)
    for (const [k, v] of Object.entries(STEP_ICONS)) expectIcon(v, `mission step ${k}`)
    for (const f of FIGURE_CATALOG) expectIcon(f.icon, `figure ${f.id}`)
    for (const [dim, set] of Object.entries(messages().stats.tiers)) {
      for (const [id, tier] of Object.entries(set as Record<string, unknown>)) {
        if (tier && typeof tier === 'object' && 'icon' in tier) expectIcon((tier as { icon: string }).icon, `tier ${dim}.${id}`)
      }
    }
  })

  it('normalises author emoji', () => {
    expect(iconRef('⚙️')).toBe('px:gear')
    expect(iconRef('🏗️')).toBe('px:blocks')
    expect(iconRef('emoji:🔥')).toBe('px:fire')
    expect(iconRef('🐌→🚀')).toBe('px:rocket')
    expect(iconRef('si:SiReact')).toBe('si:SiReact')
    expect(iconRef('px:sprout')).toBe('px:sprout')
    expect(iconRef('🦄')).toBeNull()
    expect(iconRef('🦄', 'px:bulb')).toBe('px:bulb')
    expect(iconRef(null, 'px:map')).toBe('px:map')
  })

  it('keeps emoji out of the UI strings', () => {
    const walk = (v: unknown, at: string): void => {
      if (typeof v === 'string') expect(PICTO.test(v), `${at}: ${v}`).toBe(false)
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (k !== 'game') walk(x, `${at}.${k}`)
    }
    // the game section (uk-game.ts) has its own owner
    walk(messages(), 'uk')
  })

  it('compiled official course carries icon refs only', () => {
    const file = path.resolve('content/courses/javascript-noob-to-god.json')
    const bundle = CourseBundleSchema.parse(JSON.parse(readFileSync(file, 'utf8')))
    if (bundle.course.icon) expectIcon(bundle.course.icon, 'course')
    for (const s of bundle.sections) {
      if (s.icon) expectIcon(s.icon, `section ${s.key}`)
      for (const t of s.topics) {
        if (t.icon) expectIcon(t.icon, `topic ${t.key}`)
        for (const l of t.lessons) expectIcon(l.icon, `lesson ${l.id}`)
      }
    }
  })
})
