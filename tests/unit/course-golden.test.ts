import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import type { ContentSnapshot } from '@/content/store'
import { buildCoursePath, checkCourse, CourseBundleSchema, DEFAULT_SKILLS, LANGUAGE_SKILL_MODEL, skillModelOf, type CourseBundle, type Level, type PathProgress, type ResultRecord } from '@/course'
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

const compiled = new Map<string, CourseBundle>()

async function golden(id: string): Promise<Golden> {
  const pkg = await resolveCourse(id)
  if (!pkg) throw new Error(`no course ${id}`)
  // official courses share one vault snapshot: load it once
  snapshotOnce ??= loadCourseSource(pkg).then((s) => s.snapshot)
  const snapshot = await snapshotOnce
  const { bundle } = checkCourse(pkg.source, snapshot, { icons: await loadIconCatalog() })
  if (!bundle) throw new Error(`${id}: no bundle`)
  compiled.set(id, bundle)
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

  // stripAdded must not hide a regression: the added fields are exactly what's expected
  it('JavaScript gains no skills; English gets the five defaults and the language model', { timeout: 120_000 }, async () => {
    process.env.VAULT_PATH ??= vault
    const js = compiled.get('javascript-noob-to-god') ?? (await golden('javascript-noob-to-god'), compiled.get('javascript-noob-to-god')!)
    const en = compiled.get('english-a1-c2') ?? (await golden('english-a1-c2'), compiled.get('english-a1-c2')!)
    expect('skills' in js.course).toBe(false)
    expect(js.sections.flatMap((s) => s.topics).some((t) => 'skill' in t)).toBe(false)
    expect(Object.values(js.exercises).some((e) => 'skill' in e)).toBe(false)
    expect(js.placement.perSkill).toBeUndefined()
    expect(js.placement.skills).toBeUndefined()
    expect(en.course.skills).toEqual(DEFAULT_SKILLS.language.learner)
    expect(en.sections.flatMap((s) => s.topics).some((t) => 'skill' in t)).toBe(false)
    expect(en.placement.perSkill).toBeUndefined()
    expect(en.placement.skills).toBeUndefined()
    expect(skillModelOf(en)).toEqual({ skills: [...LANGUAGE_SKILL_MODEL.skills], overall: [...LANGUAGE_SKILL_MODEL.overall] })
  })

  // content i18n (docs/NEXTJS_SYLLABUS.md §8): courses without translations gain no field at all — the sha above is
  // over the whole bundle (stripAdded only removes the skills fields), so it is byte-identical except those
  it('i18n adds nothing to courses without translations', { timeout: 120_000 }, async () => {
    process.env.VAULT_PATH ??= vault
    for (const id of COURSES) {
      const b = compiled.get(id) ?? (await golden(id), compiled.get(id)!)
      expect('i18n' in b, id).toBe(false)
      expect('languages' in b.course, id).toBe(false)
      expect('sourceLanguage' in b.course, id).toBe(false)
    }
  })
})

// The path of both real bundles (committed JSON, no vault needed) under a few progress states, with skills null:
// the same view as the base commit's buildCoursePath (the fixture was written by running 76dcf19's path.ts), minus
// the added fields
// (`recommended`, topic `known`).
const PATH_FIXTURE = path.join(__dirname, 'fixtures', 'path-golden.json')
const LEVEL: Record<(typeof COURSES)[number], Level> = { 'english-a1-c2': 'A2', 'javascript-noob-to-god': 'middle' }

function states(b: CourseBundle): Record<string, PathProgress> {
  const first = b.sections.find((s) => s.kind === 'path' && s.status !== 'planned' && s.topics.length > 1)!
  const [t1, t2] = first.topics
  const empty = (): PathProgress => ({ lessons: new Set(), perfect: new Set(), studied: new Set(), tests: new Map(), exams: new Map() })
  const passed: ResultRecord = { bestScore: 0.9, passed: true }
  const mid = empty()
  for (const l of t1!.lessons) (mid.lessons as Set<string>).add(l.id)
  if (t1!.test) (mid.tests as Map<string, ResultRecord>).set(t1!.test.id, passed)
  const second = t2!.lessons.find((l) => l.kind !== 'theory')
  if (second) (mid.lessons as Set<string>).add(second.id)
  ;(mid.studied as Set<string>).add(t2!.chapterId)
  const exam = { ...mid, exams: new Map(first.exam ? [[first.exam.id, { ...passed, testOut: false }]] : []) }
  return { empty: empty(), mid, exam, placed: { ...empty(), placementSection: 2 } }
}

function stripPath(view: unknown): unknown {
  const v = structuredClone(view) as { recommended?: unknown; sections: Array<{ topics: Array<{ known?: unknown }> }> }
  delete v.recommended
  for (const s of v.sections) for (const t of s.topics) delete t.known
  return v
}

describe('golden path view (skills null)', () => {
  for (const id of COURSES) {
    it(`${id}: buildCoursePath as before`, () => {
      const b = CourseBundleSchema.parse(JSON.parse(readFileSync(path.resolve(__dirname, `../../content/courses/${id}.json`), 'utf8')))
      const now: Record<string, string> = {}
      for (const [name, progress] of Object.entries(states(b))) {
        const view = buildCoursePath(b, LEVEL[id], { ...progress, skills: null })
        now[`${id}:${name}`] = createHash('sha256').update(JSON.stringify(stripPath(view))).digest('hex')
      }
      const fixture: Record<string, string> = existsSync(PATH_FIXTURE) ? JSON.parse(readFileSync(PATH_FIXTURE, 'utf8')) : {}
      if (process.env.GOLDEN_WRITE === '1') writeFileSync(PATH_FIXTURE, `${JSON.stringify({ ...fixture, ...now }, null, 2)}\n`)
      for (const [k, v] of Object.entries(now)) expect(v, k).toBe(fixture[k])
    })
  }
})
