import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import type { Chapter, Guide } from '@/content/model'
import { loadSnapshot, type FullSnapshot } from '@/content/store'
import {
  checkCourse,
  compileCourseDetailed,
  courseKind,
  coursePractice,
  courseTheory,
  CourseBundleSchema,
  DEFAULT_PRACTICE,
  kindForSubject,
  parseCourseManifest,
  parseCourseYaml,
  PRACTICE_SECTIONS,
  resolvePractice,
  type CourseManifest,
} from '@/course'
import { courseListing, parseBundles } from '@/server/courses/bundles'
import { theoryTree, type TheorySource, type TheoryStatus } from '@/server/courses/theory-core'
import { practiceCounts } from '@/server/services/counts-core'
import { ALL_PRACTICE_NAV, FALLBACK_PRACTICE, PRACTICE_NAV, practiceNav } from '@/ui/shell/course-nav'
import { DUE_KEY, WORDS_KEY, MISTAKES_KEY, TASKS_KEY } from '@/ui/shell/constants'

const vaultPath = path.resolve(__dirname, '../fixtures/course-vault')
const yaml = readFileSync(path.join(vaultPath, 'Courses/fixture-course/course.yaml'), 'utf8')
let snap: FullSnapshot
let base: CourseManifest

beforeAll(async () => {
  snap = await loadSnapshot({ vaultPath, guidesDir: 'Guides' }, new Map(), 1)
  base = parseCourseYaml(yaml).manifest!
})

const manifest = (extra: Record<string, unknown>) => parseCourseManifest({ ...base, ...extra })

describe('course kind and practice sections', () => {
  it('derives the kind from the subject', () => {
    expect(kindForSubject('programming')).toBe('programming')
    expect(kindForSubject('language')).toBe('language')
    expect(kindForSubject('security')).toBe('general')
    expect(kindForSubject(undefined)).toBe('general')
  })

  it('uses the per-kind defaults, path always first', () => {
    expect(resolvePractice('programming')).toEqual(['path', 'cards', 'tests', 'tasks', 'mistakes', 'roadmap'])
    expect(resolvePractice('language')).toEqual(['path', 'words', 'listening', 'pronunciation', 'grammar', 'mistakes'])
    expect(resolvePractice('general')).toEqual(['path', 'cards', 'tests', 'mistakes'])
    for (const kind of ['programming', 'language', 'general'] as const) expect(resolvePractice(kind)[0]).toBe('path')
  })

  it('keeps the declared order, drops duplicates and unknown ids, puts path first', () => {
    expect(resolvePractice('programming', ['mistakes', 'cards', 'path', 'cards', 'nope'])).toEqual(['path', 'mistakes', 'cards'])
    expect(resolvePractice('language', ['grammar'])).toEqual(['path', 'grammar'])
    expect(resolvePractice('general', [])).toEqual(resolvePractice('general'))
  })

  it('resolves bundles compiled before kind / practice existed from the subject', () => {
    expect(courseKind({ subject: 'language' })).toBe('language')
    expect(coursePractice({ subject: 'language' })).toEqual(resolvePractice('language'))
    expect(coursePractice({ subject: 'programming', kind: 'general', practice: ['tests'] })).toEqual(['path', 'tests'])
  })
})

describe('course.yaml: kind, practice, theory', () => {
  it('parses the new fields and leaves them optional', () => {
    expect(base.kind).toBeUndefined()
    expect(base.practice).toBeUndefined()
    // `base` already has the IT ladder filled in; a language course defaults to CEFR
    const { manifest: m, errors } = manifest({ kind: 'language', levels: undefined, practice: ['path', 'words', 'grammar', 'mistakes'], theory: ['Alpha'] })
    expect(errors).toEqual([])
    expect(m!.kind).toBe('language')
    expect(m!.levels).toEqual(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    expect(m!.practice).toEqual(['path', 'words', 'grammar', 'mistakes'])
    expect(m!.theory).toEqual(['Alpha'])
  })

  it('rejects unknown kinds and sections, and duplicate sections', () => {
    const bad = manifest({ kind: 'cooking', practice: ['path', 'recipes'] })
    expect(bad.manifest).toBeNull()
    expect(bad.errors.join('\n')).toMatch(/kind/)
    expect(bad.errors.join('\n')).toMatch(/practice\.1/)
    const dup = manifest({ practice: ['cards', 'cards'] })
    expect(dup.errors.join('\n')).toMatch(/Дублікат розділу практики «cards»/)
  })

  it('compiles kind, practice and theory into the bundle (defaults: kind by subject, theory = section guides)', () => {
    const { bundle, issues } = compileCourseDetailed(base, snap)
    expect(issues.filter((i) => i.severity === 'error')).toEqual([])
    expect(bundle.course.kind).toBe('programming')
    expect(bundle.course.practice).toEqual(DEFAULT_PRACTICE.programming)
    expect(bundle.theory).toEqual(['alpha', 'bank'])
    expect(courseTheory(bundle)).toEqual(['alpha', 'bank'])
    expect(CourseBundleSchema.safeParse(bundle).success).toBe(true)
  })

  it('compiles a declared theory list (folder or id, deduped) and reports a missing guide', () => {
    const ok = compileCourseDetailed(manifest({ theory: ['Bank', 'alpha', 'Alpha'] }).manifest!, snap)
    expect(ok.bundle.theory).toEqual(['bank', 'alpha'])
    const missing = compileCourseDetailed(manifest({ theory: ['Alpha', 'Nowhere'] }).manifest!, snap)
    expect(missing.bundle.theory).toEqual(['alpha'])
    expect(missing.issues).toContainEqual(expect.objectContaining({ severity: 'error', code: 'missing-guide', where: 'theory' }))
  })

  it('falls back for older bundles without the new fields', () => {
    const { bundle } = compileCourseDetailed(base, snap)
    const old = JSON.parse(JSON.stringify(bundle)) as Record<string, unknown> & { course: Record<string, unknown> }
    delete old.theory
    delete old.course.kind
    delete old.course.practice
    const { courses, errors } = parseBundles([{ name: 'fixture-course.json', text: JSON.stringify(old) }])
    expect(errors).toEqual([])
    const parsed = courses.get('fixture-course')!.bundle
    expect(coursePractice(parsed.course)).toEqual(DEFAULT_PRACTICE.programming)
    expect(courseTheory(parsed)).toEqual(['alpha', 'bank'])
    expect(courseListing(courses.get('fixture-course')!).id).toBe('fixture-course')
  })

  it('warns when a practice section has nothing to draw from', () => {
    for (const chapters of ['1', '2', '3']) {
      const sections = [{ id: 'one', title: 'One', from: 'Alpha', chapters }]
      const { bundle, issues } = checkCourse({ ...base, sections, practice: ['path', 'tasks', 'tests'] }, snap)
      const warned = issues.some((i) => i.code === 'empty-practice' && i.message.includes('«tasks»'))
      expect(warned, `chapter ${chapters}`).toBe(bundle!.stats.tasks === 0)
    }
  })
})

describe('practice nav registry (src/ui/shell/course-nav.ts)', () => {
  it('has an entry for every section id', () => {
    expect(Object.keys(PRACTICE_NAV).sort()).toEqual([...PRACTICE_SECTIONS].sort())
    for (const def of Object.values(PRACTICE_NAV)) {
      expect(def.href).toMatch(/^\//)
      expect(def.match(def.href)).toBe(true)
      expect(def.label.length).toBeGreaterThan(0)
    }
  })

  it('renders a course’s sections in its order, skipping not-yet-ready ones', () => {
    expect(practiceNav(DEFAULT_PRACTICE.programming).map((i) => i.href)).toEqual(['/path', '/review', '/quiz', '/tasks', '/mistakes', '/roadmap'])
    const language = practiceNav(resolvePractice('language'))
    expect(language.map((i) => i.id)).toEqual(['path', 'words', 'listening', 'pronunciation', 'grammar', 'mistakes'])
    expect(language.map((i) => i.href)).toEqual(['/path', '/words', '/listening', '/pronunciation', '/grammar', '/mistakes'])
    expect(language.find((i) => i.id === 'words')!.badge?.key).toBe(WORDS_KEY)
  })

  it('shows one item per page (tests and grammar used to share /quiz; words now have /words)', () => {
    expect(practiceNav(['path', 'cards', 'words']).map((i) => i.id)).toEqual(['path', 'cards', 'words'])
    expect(new Set(ALL_PRACTICE_NAV.map((i) => i.href)).size).toBe(ALL_PRACTICE_NAV.length)
  })

  it('falls back to the subject-neutral set without an active course', () => {
    expect(FALLBACK_PRACTICE).toEqual(['path', 'cards', 'tests', 'mistakes'])
  })

  it('matches nested routes of a section only', () => {
    expect(PRACTICE_NAV.path.match('/test/abc')).toBe(true)
    expect(PRACTICE_NAV.cards.match('/review')).toBe(true)
    expect(PRACTICE_NAV.cards.match('/reviewer')).toBe(false)
  })
})

describe('course-scoped practice counts', () => {
  const rows = { due: ['a', 'b', 'x', 'gone'], mistakes: ['a', 'x', 'x2'], tasks: ['t1', 'tx'] }
  const exists = new Set(['a', 'b', 'x', 'x2', 't1', 'tx'])

  it('counts only the active course’s exercises that still exist', () => {
    const pool = new Set(['a', 'b', 't1'])
    expect(practiceCounts(rows, exists, pool)).toEqual({ [DUE_KEY]: 2, [MISTAKES_KEY]: 1, [TASKS_KEY]: 1 })
  })

  it('counts everything that exists without an active course', () => {
    expect(practiceCounts(rows, exists, null)).toEqual({ [DUE_KEY]: 3, [MISTAKES_KEY]: 3, [TASKS_KEY]: 2 })
  })
})

describe('theory tree (sidebar «Теорія»)', () => {
  const chapter = (id: string, guideId: string, number: number | null, title: string, kind: Chapter['kind'] = 'chapter'): Chapter =>
    ({ id, guideId, number, title, kind, slug: kind === 'index' ? [] : [id] }) as unknown as Chapter
  const guide = (g: Partial<Guide> & Pick<Guide, 'id' | 'title' | 'tree'>): Guide => ({ parts: [], icon: null, ...g }) as unknown as Guide

  function source(): TheorySource {
    const chapters = [
      chapter('g/_guide', 'g', null, 'Index', 'index'),
      chapter('c1', 'g', 1, 'One'),
      chapter('c2', 'g', 2, 'Two'),
      chapter('c3', 'g', 3, 'Three'),
      chapter('c9', 'g', null, 'Appendix'),
      chapter('h-over', 'h', 1, 'Basics overview', 'overview'),
      chapter('h1', 'h', 2, 'Inside'),
      chapter('h2', 'h', 3, 'Top level'),
    ]
    const g = guide({
      id: 'g',
      title: 'Guide G',
      icon: 'px:sprout',
      parts: [
        { icon: 'px:bricks', title: 'Part A', from: 1, to: 2 },
        { icon: null, title: 'Empty', from: 7, to: 8 },
        { icon: null, title: 'Part B', from: 3, to: 3 },
      ],
      tree: ['c1', 'c2', 'c3', 'c9'].map((id) => ({ kind: 'chapter' as const, id })),
    })
    const h = guide({
      id: 'h',
      title: 'Guide H',
      // folder-based guide: parts in _guide.md don't regroup real folders
      parts: [{ icon: null, title: 'Ignored', from: 1, to: 3 }],
      tree: [
        { kind: 'group', id: 'h/01 Basics', title: 'Basics', overviewId: 'h-over', children: [{ kind: 'chapter', id: 'h1' }] },
        { kind: 'chapter', id: 'h2' },
      ],
    })
    return { guideById: new Map([g, h].map((x) => [x.id, x])), chapters: new Map(chapters.map((c) => [c.id, c])) }
  }

  const status = new Map<string, TheoryStatus>([
    ['c1', 'studied'],
    ['c3', 'reading'],
    ['h-over', 'studied'],
    ['h1', 'studied'],
  ])

  it('shows only the requested guides, in order, with guide → part → chapter folders', () => {
    const [h, g] = theoryTree(source(), ['h', 'nope', 'g'], (id) => status.get(id))
    expect(g!.id).toBe('guide:g')
    expect(g!.href).toBe('/g/g')
    expect(g!.icon).toBe('px:sprout')
    expect(g!.children.map((n) => [n.kind, n.title])).toEqual([
      ['folder', 'Part A'],
      ['folder', 'Part B'],
      ['chapter', 'Appendix'],
    ])
    const [a, b] = g!.children
    expect(a!.id).toBe('g#part-1')
    expect(a!.icon).toBe('px:bricks')
    expect(a!.children.map((c) => [c.id, c.status])).toEqual([
      ['c1', 'studied'],
      ['c2', 'unread'],
    ])
    expect(b!.id).toBe('g#part-3')
    expect([a!.done, a!.total, b!.done, b!.total, g!.done, g!.total]).toEqual([1, 2, 0, 1, 1, 4])
    expect(h!.children.map((n) => [n.kind, n.title])).toEqual([
      ['folder', 'Basics'],
      ['chapter', 'Top level'],
    ])
  })

  it('keeps folder-based guides, with the overview as the folder page', () => {
    const [h] = theoryTree(source(), ['h'], (id) => status.get(id))
    const folder = h!.children[0]!
    expect(folder).toMatchObject({ kind: 'folder', id: 'h/01 Basics', href: '/g/h/h-over', status: 'studied', done: 2, total: 2 })
    expect(folder.children.map((c) => c.href)).toEqual(['/g/h/h1'])
    expect([h!.done, h!.total]).toEqual([2, 3])
  })

  it('builds the fixture course’s theory from the real content store', () => {
    const { bundle } = compileCourseDetailed(base, snap)
    const tree = theoryTree(snap, courseTheory(bundle), () => undefined)
    expect(tree.map((n) => n.title)).toEqual(['Alpha', 'Bank'])
    expect(tree[0]!.children).toHaveLength(3)
    expect(tree[0]!.children.every((c) => c.kind === 'chapter' && c.status === 'unread' && c.href?.startsWith('/g/alpha/'))).toBe(true)
    expect(tree.every((n) => n.done === 0 && n.total === n.children.length)).toBe(true)
  })
})
