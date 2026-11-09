import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import type { LearningUnit } from '@/content/model'
import { loadSnapshot, type FullSnapshot } from '@/content/store'
import { checkCourse, parseCourseYaml, validateCourse, type CourseIssue, type CourseManifestInput, type CourseSource } from '@/course'

const vaultPath = path.resolve(__dirname, '../fixtures/course-vault')
const yaml = readFileSync(path.join(vaultPath, 'Courses/fixture-course/course.yaml'), 'utf8')
let snap: FullSnapshot

beforeAll(async () => {
  snap = await loadSnapshot({ vaultPath, guidesDir: 'Guides' }, new Map(), 1)
})

const base = (sections: CourseManifestInput['sections'], extra: Partial<CourseManifestInput> = {}): CourseManifestInput => ({ id: 'v', version: '1.0.0', title: 'V', sections, ...extra })
const codes = (issues: CourseIssue[], severity: 'error' | 'warning') => issues.filter((i) => i.severity === severity).map((i) => i.code)

describe('validateCourse', () => {
  it('passes the fixture course with warnings only', () => {
    const { bundle, issues } = checkCourse(yaml, snap, { icons: { si: new Set(['SiJavascript']) } })
    expect(bundle).not.toBeNull()
    expect(codes(issues, 'error')).toEqual([])
    expect(new Set(codes(issues, 'warning'))).toEqual(new Set(['minimum', 'thin-exam', 'no-level', 'thin-placement']))
    expect(issues.find((i) => i.code === 'no-level')!.message).toContain('bk-01-000')
  })

  it('reports schema errors without compiling', () => {
    const { bundle, issues } = checkCourse(base([]), snap)
    expect(bundle).toBeNull()
    expect(issues).toEqual([{ severity: 'error', code: 'schema', message: expect.stringMatching(/^sections:/) }])
  })

  it('reports missing guides and chapter ranges', () => {
    const issues = validateCourse(
      base([
        { id: 'a', title: 'A', from: 'Nope' },
        { id: 'b', title: 'B', from: 'Alpha', chapters: '2-5' },
        { id: 'c', title: 'C', from: 'Alpha', chapters: '7-8' },
      ]),
      snap,
    )
    expect(codes(issues, 'error')).toEqual(['missing-guide', 'missing-chapter', 'missing-chapter', 'empty-range'])
    expect(issues.find((i) => i.code === 'missing-chapter')!.message).toContain('немає тем 4, 5')
  })

  it('reports a chapter used twice and duplicate exercise ids', () => {
    const twice = validateCourse(
      base([
        { id: 'a', title: 'A', from: 'Alpha', chapters: 1 },
        { id: 'b', title: 'B', from: 'alpha', chapters: '1-2' },
      ]),
      snap,
    )
    expect(codes(twice, 'error')).toEqual(['duplicate-topic'])

    // a unit that also appears in another chapter of the course
    const third = [...snap.chapters.values()].find((c) => c.id === 'al-ch-03')!
    const stray = snap.units.get('al-01-quiz-01') as LearningUnit
    const source: CourseSource = { ...snap, unitsByChapter: new Map([...snap.unitsByChapter, [third.id, [...snap.unitsByChapter.get(third.id)!, stray]]]) }
    const dup = validateCourse(base([{ id: 'a', title: 'A', from: 'Alpha' }]), source)
    expect(dup.filter((i) => i.code === 'duplicate-id').map((i) => i.message)).toEqual([expect.stringContaining('al-01-quiz-01')])
  })

  it('checks icons against the catalog', () => {
    const manifest = base([{ id: 'a', title: 'A', icon: 'pi:PiNope', from: 'Alpha', chapters: 3 }], { icon: 'si:SiNope' })
    const catalog = { si: new Set(['SiJavascript']), pi: new Set(['PiFireFill']) }
    expect(validateCourse(manifest, snap, { icons: catalog }).filter((i) => i.code === 'unknown-icon').map((i) => i.where)).toEqual(['course.yaml', 'sections.a'])
    // without a catalog only the syntax is checked
    expect(validateCourse(manifest, snap).some((i) => i.code === 'unknown-icon')).toBe(false)
    expect(validateCourse(base([{ id: 'a', title: 'A', icon: 'lol', from: 'Alpha', chapters: 3 }]), snap).map((i) => i.code)).toContain('unknown-icon')
  })

  it('warns about §4 minimums, including illustrations when counted', () => {
    const manifest = base([{ id: 'a', title: 'A', from: 'Alpha', chapters: 1 }], { subject: 'programming' })
    expect(validateCourse(manifest, snap).filter((i) => i.code === 'minimum')).toEqual([])
    const withFigures = validateCourse(manifest, snap, { figures: new Map([['al-ch-01', 0]]) })
    expect(withFigures.filter((i) => i.code === 'minimum').map((i) => i.message)).toEqual(['«Перша»: мало вправ — ілюстрації 0/1'])
  })

  it('passes content-parser issues of the course chapters through', () => {
    const chapter = [...snap.chapters.values()].find((c) => c.id === 'al-ch-03')!
    const source: CourseSource = {
      ...snap,
      issues: [
        { severity: 'error', code: 'quiz-no-correct', path: chapter.path, message: 'Тест без правильної відповіді' },
        { severity: 'error', code: 'quiz-no-correct', path: 'Guides/Other/x.md', message: 'чужий' },
      ],
    }
    const issues = validateCourse(base([{ id: 'a', title: 'A', from: 'Alpha', chapters: 3 }]), source)
    expect(issues.filter((i) => i.code === 'content')).toEqual([{ severity: 'error', code: 'content', where: chapter.path, message: 'quiz-no-correct: Тест без правильної відповіді' }])
  })

  it('parses the manifest from YAML text', () => {
    expect(parseCourseYaml(yaml).manifest!.title).toBe('Fixture Course')
  })
})
