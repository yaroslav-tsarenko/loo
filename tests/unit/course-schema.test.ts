import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  expandRange,
  iconExists,
  iconNamesFromSource,
  levelRank,
  parseCourseIcon,
  parseCourseManifest,
  parseCourseYaml,
  toCourseLevel,
  topicKeyFor,
} from '@/course'

const yaml = readFileSync(path.resolve(__dirname, '../fixtures/course-vault/Courses/fixture-course/course.yaml'), 'utf8')

describe('course.yaml schema', () => {
  it('parses the fixture and fills defaults', () => {
    const { manifest, errors } = parseCourseYaml(yaml)
    expect(errors).toEqual([])
    expect(manifest!.id).toBe('fixture-course')
    expect(manifest!.levels).toEqual(['noob', 'junior', 'middle', 'senior', 'god'])
    expect(manifest!.language).toBe('uk')
    expect(manifest!.sections.map((s) => [s.id, s.kind])).toEqual([
      ['basics', 'path'],
      ['advanced', 'path'],
      ['practice', 'practice'],
    ])
    expect(manifest!.exams).toEqual({ topic: { questions: 4, pass: 0.75 }, section: { questions: 6, pass: 0.8, testOut: true } })
    expect(manifest!.placement).toEqual({ enabled: true, maxQuestions: 12, perLevel: 3 })
  })

  it('defaults exams and placement when omitted', () => {
    const { manifest } = parseCourseManifest({ id: 'x', version: '1.0.0', title: 'X', sections: [{ id: 'a', title: 'A', from: 'G' }] })
    expect(manifest!.exams.topic).toEqual({ questions: 10, pass: 0.8 })
    expect(manifest!.exams.section).toEqual({ questions: 25, pass: 0.8, testOut: true })
    expect(manifest!.placement.maxQuestions).toBe(20)
  })

  it('reports readable errors', () => {
    const { manifest, errors } = parseCourseManifest({
      id: 'Bad_Id',
      version: '1',
      title: 'X',
      color: 'yellow',
      sections: [
        { id: 'a', title: 'A', from: 'G', chapters: 'one-two' },
        { id: 'a', title: 'B', from: 'G', kind: 'quiz' },
      ],
    })
    expect(manifest).toBeNull()
    const text = errors.join('\n')
    expect(text).toMatch(/^id: /m)
    expect(text).toMatch(/^version: /m)
    expect(text).toMatch(/^color: /m)
    expect(text).toMatch(/^sections\.0\.chapters: /m)
    expect(text).toMatch(/^sections\.1\.kind: /m)
    expect(parseCourseYaml('id: [unclosed').errors[0]).toMatch(/^course\.yaml: /)
    expect(parseCourseYaml('- a\n- b').errors).toEqual(['course.yaml: очікується обʼєкт'])
  })

  it('flags duplicate section ids', () => {
    const { errors } = parseCourseManifest({ id: 'x', version: '1.0.0', title: 'X', sections: [{ id: 'a', title: 'A', from: 'G' }, { id: 'a', title: 'B', from: 'H' }] })
    expect(errors).toEqual(['sections.1.id: Дублікат id розділу «a»'])
  })

  it('expands chapter ranges', () => {
    expect(expandRange('1-7')).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(expandRange('1-3, 5')).toEqual([1, 2, 3, 5])
    expect(expandRange('3')).toEqual([3])
    expect(expandRange(4)).toEqual([4])
    expect(expandRange([3, 1, 3])).toEqual([1, 3])
  })
})

describe('levels', () => {
  it('maps legacy guide levels onto noob → god', () => {
    expect(toCourseLevel('junior')).toBe('junior')
    expect(toCourseLevel('middle')).toBe('middle')
    expect(toCourseLevel('senior')).toBe('senior')
    expect(toCourseLevel('techlead')).toBe('god')
    expect(toCourseLevel('Tech Lead')).toBe('god')
    expect(toCourseLevel('beginner')).toBe('noob')
    expect(toCourseLevel('noob')).toBe('noob')
    expect(toCourseLevel('expert')).toBeNull()
    expect(toCourseLevel(null)).toBeNull()
    expect(levelRank('noob')).toBeLessThan(levelRank('god'))
  })
})

describe('icons', () => {
  it('parses refs and checks against a catalog', () => {
    expect(parseCourseIcon('si:SiJavascript')).toEqual({ set: 'si', name: 'SiJavascript' })
    expect(parseCourseIcon('🌱')).toEqual({ set: 'emoji', name: '🌱' })
    expect(parseCourseIcon('emoji:🔥')).toEqual({ set: 'emoji', name: '🔥' })
    expect(parseCourseIcon('fa:FaBeer')).toBeNull()
    expect(parseCourseIcon('si:lowercase')).toBeNull()
    const catalog = { si: new Set(['SiJavascript']) }
    expect(iconExists('si:SiJavascript', catalog)).toBe(true)
    expect(iconExists('si:SiNope', catalog)).toBe(false)
    expect(iconExists('pi:PiAnything', catalog)).toBe(true)
    expect(iconExists('not an icon')).toBe(false)
  })

  it('reads icon names from a set source file', () => {
    const source = `import x from 'y'\nexport const SI = {\n  SiReact,\n  SiVue: { icon: SiVue, label: 'Vue' },\n}\nexport function other() {}\n`
    expect([...iconNamesFromSource(source, 'SI')]).toEqual(['SiReact', 'SiVue'])
    const real = readFileSync(path.resolve(__dirname, '../../src/ui/icons/sets/si.tsx'), 'utf8')
    expect(iconNamesFromSource(real, 'SI').has('SiJavascript')).toBe(true)
  })
})

describe('ids', () => {
  it('keeps explicit chapter ids and derives safe keys for path ids', () => {
    expect(topicKeyFor('jsd-ch-05', 'javascript', 5)).toBe('jsd-ch-05')
    expect(topicKeyFor('js-interview/JS Interview Q&A - 01. Типи', 'js-interview', 1)).toBe('js-interview-01')
    const hashed = topicKeyFor('docs/Огляд', 'docs', null)
    expect(hashed).toMatch(/^docs-[0-9a-f]{6}$/)
    expect(topicKeyFor('docs/Огляд', 'docs', null)).toBe(hashed)
  })
})
