import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { CourseBundleSchema, type CourseBundle } from '@/course'
import { lookup } from '@/course/select/lookup'
import { stillCompleted } from '@/course/select/completed'

const bundle: CourseBundle = CourseBundleSchema.parse(JSON.parse(readFileSync('content/courses/javascript-noob-to-god.json', 'utf8')))
const lessons = [...lookup(bundle).lessons.values()]
const withUnits = lessons.find((l) => l.items.filter((i) => i.kind === 'unit').length >= 3)!
const units = withUnits.items.flatMap((i) => (i.kind === 'unit' ? [i.id] : []))

describe('completed lessons after the course changed (src/course/select/completed.ts)', () => {
  it('unchanged content: still completed', () => {
    expect(stillCompleted(bundle, [{ id: withUnits.id, unitIds: units }], new Set()).has(withUnits.id)).toBe(true)
  })

  it('content shifted from a neighbour the learner already did: still completed', () => {
    const before = [...units.slice(0, -1), 'old-shifted-away']
    expect(stillCompleted(bundle, [{ id: withUnits.id, unitIds: before }], new Set([units.at(-1)!])).has(withUnits.id)).toBe(true)
  })

  it('a genuinely new exercise: the lesson opens again', () => {
    const before = units.slice(0, -1)
    expect(stillCompleted(bundle, [{ id: withUnits.id, unitIds: before }], new Set()).has(withUnits.id)).toBe(false)
  })

  it('an exercise skipped in its own lesson (e.g. speaking): still completed', () => {
    expect(stillCompleted(bundle, [{ id: withUnits.id, unitIds: units }], new Set(units.slice(1))).has(withUnits.id)).toBe(true)
  })

  it('rows from before unit ids were stored keep counting; unknown lessons pass through', () => {
    const out = stillCompleted(bundle, [{ id: withUnits.id, unitIds: null }, { id: 'gone:lesson', unitIds: ['x'] }], new Set())
    expect([...out].sort()).toEqual(['gone:lesson', withUnits.id].sort())
  })
})
