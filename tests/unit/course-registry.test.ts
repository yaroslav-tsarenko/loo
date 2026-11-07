import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

// The registry lists courses from the catalog and parses a bundle only when it is asked for, keeping at most
// COURSE_CACHE_MAX of them (src/server/courses/registry.ts).
async function freshRegistry(max: string) {
  vi.resetModules()
  vi.stubEnv('COURSE_CACHE_MAX', max)
  delete (globalThis as Record<symbol, unknown>)[Symbol.for('levelup.course-registry')]
  return import('@/server/courses/registry')
}

afterEach(() => {
  vi.unstubAllEnvs()
  delete (globalThis as Record<symbol, unknown>)[Symbol.for('levelup.course-registry')]
})

describe('course registry', () => {
  it('lists every course without parsing a bundle', async () => {
    const reg = await freshRegistry('8')
    const list = await reg.listCourses()
    expect(list.map((c) => c.id)).toEqual(expect.arrayContaining(['javascript-noob-to-god', 'english-a1-c2']))
    const state = (globalThis as Record<symbol, { bundles: Map<string, unknown> }>)[Symbol.for('levelup.course-registry')]
    expect(state?.bundles.size).toBe(0)
  })

  it('loads a bundle on first use, once, and evicts the least recently used past the limit', async () => {
    const reg = await freshRegistry('1')
    const js = await reg.getCourse('javascript-noob-to-god')
    expect(js?.course.id).toBe('javascript-noob-to-god')
    expect(await reg.getCourse('javascript-noob-to-god')).toBe(js)
    const next = await reg.getCourse('nextjs-zero-to-pro')
    expect(next?.course.id).toBe('nextjs-zero-to-pro')
    const state = (globalThis as Record<symbol, { bundles: Map<string, unknown> }>)[Symbol.for('levelup.course-registry')]
    expect([...(state?.bundles.keys() ?? [])]).toEqual(['nextjs-zero-to-pro'])
    expect(await reg.getCourse('no-such-course')).toBeNull()
    expect((await reg.courseFor('javascript-noob-to-god:start:jss-ch-01:start-1'))?.course.id).toBe('javascript-noob-to-god')
  })
})
