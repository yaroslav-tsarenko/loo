import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { courseIndexText } from '../../scripts/lib/course-index'

// The server lists courses from content/courses/index.json and loads a bundle only when it's used
// (src/server/courses/registry.ts). A bundle committed without re-running course:build would leave the catalog stale.
describe('course catalog', () => {
  it('index.json matches the bundles on disk (pnpm course:build rewrites it)', async () => {
    expect(readFileSync('content/courses/index.json', 'utf8')).toBe(await courseIndexText('content/courses'))
  })

  it('lists every course with its guides and the marketplace card', () => {
    const index = JSON.parse(readFileSync('content/courses/index.json', 'utf8')) as { courses: Array<{ id: string; guides: string[]; listing: { id: string } }> }
    expect(index.courses.length).toBeGreaterThanOrEqual(4)
    for (const c of index.courses) {
      expect(c.listing.id).toBe(c.id)
      expect(c.guides.length, c.id).toBeGreaterThan(0)
    }
  })
})
