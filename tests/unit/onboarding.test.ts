import { describe, expect, it } from 'vitest'
import { DIRECTIONS, directionOf, MAX_WISHES, SOON_OPTIONS, soonOptionsFor, WISH_IDS, coursesIn } from '@/course/catalog-soon'
import { messages } from '@/i18n'
import { onboardingInput, purposeFits } from '@/server/services/onboarding-input'
import { GENERAL_PURPOSES, goalOf, GOALS, LANGUAGE_PURPOSES, PROGRAMMING_PURPOSES, PURPOSES, purposesFor, ROLES } from '@/server/services/preferences'
import { FLAG_ICONS } from '@/ui/design/pixel-icons/flags'
import { PIXEL_PALETTE } from '@/ui/design/pixel-icons/palette'
import { hasIcon } from '@/ui/icons/catalog'
import { parseIconRef } from '@/ui/icons/ref'

const PICTO = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u
const valid = { minutes: '10', purpose: 'exam', role: 'student', wishes: [], course: 'english-a1-c2', start: 'placement', next: '/' }

describe('onboarding input', () => {
  it('accepts the wizard payload and coerces minutes', () => {
    const r = onboardingInput.safeParse(valid)
    expect(r.success).toBe(true)
    expect(r.data).toMatchObject({ minutes: 10, purpose: 'exam', role: 'student', wishes: [], course: 'english-a1-c2', start: 'placement' })
  })

  it('keeps course and start optional, wishes default to none', () => {
    const r = onboardingInput.safeParse({ minutes: '5', purpose: 'self', role: 'other' })
    expect(r.success).toBe(true)
    expect(r.data?.wishes).toEqual([])
    expect(r.data?.course).toBeUndefined()
  })

  it('rejects anything outside the enums', () => {
    for (const bad of [
      { minutes: '7' },
      { minutes: 'ten' },
      { purpose: 'job' },
      { purpose: undefined },
      { role: 'ceo' },
      { role: undefined },
      { start: 'middle' },
      { course: 'Not A Slug' },
      { course: 'x'.repeat(65) },
      { wishes: ['lang-xx'] },
      { wishes: ['<script>'] },
    ]) {
      expect(onboardingInput.safeParse({ ...valid, ...bad }).success, JSON.stringify(bad)).toBe(false)
    }
  })

  it('validates wishes against the «скоро» catalog, collapses duplicates and caps the list', () => {
    const r = onboardingInput.safeParse({ ...valid, wishes: ['lang-de', 'prog-python', 'lang-de', 'music'] })
    expect(r.data?.wishes).toEqual(['lang-de', 'prog-python', 'music'])
    const many = Array.from({ length: MAX_WISHES + 1 }, (_, i) => WISH_IDS[i % WISH_IDS.length])
    expect(onboardingInput.safeParse({ ...valid, wishes: many }).success).toBe(false)
  })
})

describe('purpose → goal', () => {
  it('maps every purpose onto an existing goal', () => {
    for (const p of PURPOSES) expect(GOALS).toContain(goalOf(p))
  })

  it('uses the expected coarse goals', () => {
    expect(goalOf('relocate')).toBe('job')
    expect(goalOf('work')).toBe('job')
    expect(goalOf('first-job')).toBe('job')
    expect(goalOf('interview')).toBe('job')
    expect(goalOf('promotion')).toBe('grow')
    expect(goalOf('exam')).toBe('school')
    expect(goalOf('school')).toBe('school')
    expect(goalOf('study')).toBe('school')
    expect(goalOf('travel')).toBe('fun')
    expect(goalOf('self')).toBe('fun')
  })

  it('offers purposes by subject and checks them on the server', () => {
    expect(purposesFor('language')).toEqual(LANGUAGE_PURPOSES)
    expect(purposesFor('programming')).toEqual(PROGRAMMING_PURPOSES)
    expect(purposesFor('psychology')).toEqual(GENERAL_PURPOSES)
    expect(purposesFor(null)).toEqual(GENERAL_PURPOSES)
    expect(purposeFits('exam', 'language')).toBe(true)
    expect(purposeFits('exam', 'programming')).toBe(false)
    expect(purposeFits('first-job', 'programming')).toBe(true)
    expect(purposeFits('relocate', undefined)).toBe(false)
    expect(purposeFits('self', undefined)).toBe(true)
  })

  it('has a label and a Loo reaction for every purpose and role, without emoji', () => {
    const m = messages().onboarding
    for (const p of PURPOSES) {
      expect(m.purposes[p]).toBeTruthy()
      expect(m.react.purposes[p]).toBeTruthy()
    }
    for (const r of ROLES) {
      expect(m.roles[r]).toBeTruthy()
      expect(m.react.roles[r]).toBeTruthy()
    }
    expect(JSON.stringify(m)).not.toMatch(PICTO)
  })
})

describe('«скоро» catalog', () => {
  const courses = [
    { id: 'english-a1-c2', subject: 'language', target: 'en' },
    { id: 'javascript-noob-to-god', subject: 'programming' },
  ]

  it('has unique ids, real icons and no emoji', () => {
    expect(new Set(WISH_IDS).size).toBe(WISH_IDS.length)
    for (const item of [...DIRECTIONS, ...SOON_OPTIONS]) {
      expect(parseIconRef(item.icon)?.set, item.id).not.toBe('emoji')
      expect(hasIcon(item.icon), `${item.id}: ${item.icon}`).toBe(true)
      expect(item.label).not.toMatch(PICTO)
    }
    for (const o of SOON_OPTIONS) expect(DIRECTIONS.map((d) => d.id)).toContain(o.direction)
  })

  it('opens a direction only when a listed course has its subject', () => {
    expect(directionOf({ subject: 'language' })).toBe('languages')
    expect(directionOf({ subject: 'programming' })).toBe('programming')
    expect(directionOf({ subject: 'other' })).toBe('other')
    expect(coursesIn('languages', courses).map((c) => c.id)).toEqual(['english-a1-c2'])
    expect(coursesIn('psychology', courses)).toEqual([])
  })

  it('hides a «скоро» option once a matching course exists', () => {
    expect(soonOptionsFor('languages', courses).map((o) => o.id)).toContain('lang-de')
    const withGerman = [...courses, { id: 'deutsch-a1-b2', subject: 'language', target: 'de-DE' }]
    expect(soonOptionsFor('languages', withGerman).map((o) => o.id)).not.toContain('lang-de')
    const withPython = [...courses, { id: 'python-basics', subject: 'programming' }]
    expect(soonOptionsFor('programming', withPython).map((o) => o.id)).not.toContain('prog-python')
    // `java` must not swallow `javascript-…`
    expect(soonOptionsFor('programming', courses).map((o) => o.id)).toContain('prog-java')
  })
})

describe('flag icons', () => {
  it('are 16×16 grids in the shared palette with a k outline', () => {
    for (const [name, grid] of Object.entries(FLAG_ICONS)) {
      expect(grid, name).toHaveLength(16)
      for (const row of grid) {
        expect(row, name).toHaveLength(16)
        for (const c of row) if (c !== '.') expect(PIXEL_PALETTE[c], `${name}: ${c}`).toBeDefined()
      }
      expect(grid[2], name).toBe('.kkkkkkkkkkkkkk.')
      expect(grid[13], name).toBe('.kkkkkkkkkkkkkk.')
    }
  })
})
