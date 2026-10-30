import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import type { ContentSnapshot } from '@/content/store'
import { checkCourse, type CourseBundle } from '@/course'
import { loadCourseSource, loadIconCatalog, resolveCourse } from '../../scripts/lib/course-source'

// Golden test (docs/NEXTJS_SYLLABUS.md §7): skills as course data must not change the compiled English and JavaScript
// bundles, except the added `course.skills`. The fixture was written from the base commit 76dcf19 (before the
// refactor): a sha256 of the canonical bundle JSON with the added fields removed, plus a few counts for a readable
// failure. Needs the content vault (VAULT_PATH, default ./content); skipped without it. GOLDEN_WRITE=1 rewrites it.

const FIXTURE = path.join(__dirname, 'fixtures', 'course-golden.json')
const COURSES = ['english-a1-c2', 'javascript-noob-to-god'] as const
const vault = process.env.VAULT_PATH ?? 'content'
const hasVault = existsSync(path.join(vault, 'Guides')) && existsSync(path.join(vault, 'courses', COURSES[0], 'course.yaml'))

interface Golden {
  sha256: string
  sections: number
  topics: number
  exercises: number
  placement: number
}

type WithAdded<T> = T & { skills?: unknown; skill?: unknown }

// The fields this refactor adds: course.skills, topic.skill (absent in these two courses).
function stripAdded(bundle: CourseBundle): unknown {
  const { skills: _skills, ...course } = bundle.course as WithAdded<CourseBundle['course']>
  return {
    ...bundle,
    course,
    sections: bundle.sections.map((s) => ({
      ...s,
      topics: s.topics.map((t) => {
        const { skill: _skill, ...rest } = t as WithAdded<typeof t>
        return rest
      }),
    })),
  }
}

let snapshotOnce: Promise<ContentSnapshot> | undefined

async function golden(id: string): Promise<Golden> {
  const pkg = await resolveCourse(id)
  if (!pkg) throw new Error(`no course ${id}`)
  // official courses share one vault snapshot: load it once
  snapshotOnce ??= loadCourseSource(pkg).then((s) => s.snapshot)
  const snapshot = await snapshotOnce
  const { bundle } = checkCourse(pkg.source, snapshot, { icons: await loadIconCatalog() })
  if (!bundle) throw new Error(`${id}: no bundle`)
  const json = JSON.stringify(stripAdded(bundle))
  return {
    sha256: createHash('sha256').update(json).digest('hex'),
    sections: bundle.sections.length,
    topics: bundle.sections.reduce((n, s) => n + s.topics.length, 0),
    exercises: Object.keys(bundle.exercises).length,
    placement: Object.values(bundle.placement.pool).reduce((n, ids) => n + (ids?.length ?? 0), 0),
  }
}

describe.skipIf(!hasVault)('golden bundles (English, JavaScript)', () => {
  for (const id of COURSES) {
    it(`${id} compiles exactly as before`, { timeout: 120_000 }, async () => {
      process.env.VAULT_PATH ??= vault
      const now = await golden(id)
      const fixture: Record<string, Golden> = existsSync(FIXTURE) ? JSON.parse(readFileSync(FIXTURE, 'utf8')) : {}
      if (process.env.GOLDEN_WRITE === '1') {
        fixture[id] = now
        writeFileSync(FIXTURE, `${JSON.stringify(fixture, null, 2)}\n`)
      }
      expect(now).toEqual(fixture[id])
    })
  }
})
