import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Root } from 'mdast'
import { beforeAll, describe, expect, it } from 'vitest'
import { checkTranslation, segmentDocument, sourceSlugs, stampLock, type Finding } from '@/content/i18n/check'
import { codeSkeleton, compareFences, fencesOf, sameTaskCode } from '@/content/i18n/code'
import { glossaryMisses, parseGlossary } from '@/content/i18n/glossary'
import { localizeDocument } from '@/content/i18n/localize'
import { headingSlugs } from '@/content/i18n/segments'
import { extractFile } from '@/content/parse/extract'
import { parseMarkdown } from '@/content/parse/markdown'
import { mdastToHast } from '@/content/render/to-hast'
import { ContentStore, loadSnapshot, type ContentSnapshot } from '@/content/store'
import { compileCourse, parseCourseManifest, parseCourseYaml } from '@/course'
import { contentLanguage, courseHreflangs, courseLanguages, localizedCourse } from '@/course/i18n'
import '@/i18n/register'
import { contentMeta, coverage, messages, resolveLocale, t } from '@/i18n'
import { HARNESS_UK } from '@/i18n/harness-text'
import { runSuite, type HarnessHost } from '@/ui/code/harness'

// Content i18n foundation (docs/COURSE_FORMAT.md «Переклад курсів (i18n)», docs/NEXTJS_SYLLABUS.md §8).

const vault = path.resolve(__dirname, '../fixtures/i18n-vault')
const SRC = readFileSync(path.join(vault, 'Guides/Demo/Demo - 01. Межа.md'), 'utf8')
const TR = readFileSync(path.join(vault, 'Guides/Demo/_i18n/en/Demo - 01. Межа.md'), 'utf8')
const GLOSSARY = parseGlossary('keepLatin: [Server Component]\nterms:\n  межа: boundary\n')

const kinds = (findings: readonly Finding[]) => findings.map((f) => `${f.severity}:${f.kind}:${f.segment ?? ''}`)

describe('segments', () => {
  const doc = segmentDocument(SRC)
  it('ids: heading paths, prose #pN per section, exercises by id; code belongs to its paragraph', () => {
    expect(doc.segments.map((s) => s.id)).toEqual([
      '#p1',
      'перше',
      'перше#p1',
      'перше#p2',
      'demo-01-quiz-01',
      'перше#p3',
      'друге',
      'друге#p1',
      'demo-01-task-01',
      'друге#p2',
      'друге#p3',
    ])
    const list = doc.segments.find((s) => s.id === 'перше#p2')!
    expect(list.signature).toBe('list:ul+code')
    expect(list.nodes).toHaveLength(2)
  })

  it('editing one paragraph changes only its hash; whitespace does not count', () => {
    const edited = segmentDocument(SRC.replace('Абзац другого розділу.', 'Абзац другого розділу, змінений.'))
    const before = new Map(doc.segments.map((s) => [s.id, s.hash]))
    const changed = edited.segments.filter((s) => before.get(s.id) !== s.hash).map((s) => s.id)
    expect(changed).toEqual(['друге#p1'])
    const spaced = segmentDocument(SRC.replace('Перший абзац про Server Component.', 'Перший   абзац\nпро Server Component.'))
    expect(spaced.segments.map((s) => s.hash)).toEqual(doc.segments.map((s) => s.hash))
  })

  it('a new paragraph renumbers only its own section', () => {
    const added = segmentDocument(SRC.replace('Абзац другого розділу.', 'Новий абзац.\n\nАбзац другого розділу.'))
    const first = (d: typeof doc) => d.segments.filter((s) => s.id.startsWith('перше') || s.id === '#p1').map((s) => `${s.id}=${s.hash}`)
    expect(first(added)).toEqual(first(doc))
  })

  it('a translation is segmented with the source heading slugs', () => {
    const tr = segmentDocument(TR, { headingSlugs: sourceSlugs(doc) })
    expect(tr.segments.map((s) => s.id)).toEqual(doc.segments.map((s) => s.id).filter((id) => id !== 'друге#p3'))
  })
})

describe('code comparison', () => {
  it('task code: only comments and test titles may differ', () => {
    expect(sameTaskCode("// мій\nfunction one() {}\ntest('один', () => expect(one()).toBe(1))", "// mine\nfunction one() {}\ntest('one', () => expect(one()).toBe(1))", 'js')).toBe(true)
    expect(sameTaskCode("expect(f()).toBe('так')", "expect(f()).toBe('yes')", 'js')).toBe(false)
    expect(sameTaskCode("describe(`група`, () => {})", "describe(`group`, () => {})", 'ts')).toBe(true)
  })

  it('theory examples: strings, comments and JSX text are prose; identifiers are not', () => {
    const a = { lang: 'tsx', value: "// привіт\nconst label = 'Привіт'\nreturn <p>Привіт!</p>", role: 'lenient' as const }
    expect(codeSkeleton(a)).toBe(codeSkeleton({ ...a, value: "// hi\nconst label = 'Hello'\nreturn <p>Hello!</p>" }))
    expect(codeSkeleton(a)).not.toBe(codeSkeleton({ ...a, value: "const title = 'Hello'\nreturn <p>Hello!</p>" }))
  })

  it('fences: roles by context; text fences and diagram labels are prose', () => {
    const md = "> [!task] T\n> ```js starter\n> f()\n> ```\n\n```text\nбудь-що\n```\n\n> [!diagram] D\n> ```yaml\n> nodes:\n>   - { id: a, label: \"сервер\" }\n> ```\n\n```js\nconst a = 1\n```"
    expect(fencesOf(md).map((f) => f.role)).toEqual(['strict', 'prose', 'diagram', 'lenient'])
    const diagram = (label: string, id = 'a') => fencesOf(`> [!diagram] D\n> \`\`\`yaml\n> nodes:\n>   - { id: ${id}, label: "${label}" }\n> \`\`\``)
    expect(compareFences(diagram('сервер'), diagram('server'))).toEqual([])
    expect(compareFences(diagram('сервер'), diagram('server', 'b'))).toHaveLength(1)
  })

  it('exercise fences: order pieces / distractors and fill answers must match', () => {
    const order = (body: string) => fencesOf(`> [!quiz] Q\n> \`\`\`order\n${body.split('\n').map((l) => `> ${l}`).join('\n')}\n> \`\`\``)
    expect(compareFences(order('Перший\nДругий ✗'), order('First\nSecond ✗'))).toEqual([])
    expect(compareFences(order('Перший\nДругий ✗'), order('First\nSecond'))).toHaveLength(1)
    const fill = (body: string) => fencesOf(`\`\`\`js fill\n${body}\n\`\`\``)
    expect(compareFences(fill("// так\nconst x = [[1]]"), fill("// yes\nconst x = [[1]]"))).toEqual([])
    expect(compareFences(fill('const x = [[1]]'), fill('const x = [[2]]'))).toHaveLength(1)
  })
})

describe('glossary', () => {
  it('keepLatin terms stay Latin; terms use their rendering (inflected source forms count)', () => {
    expect(glossaryMisses(GLOSSARY, 'Про Server Component і межу.', 'About the server component and the boundary.')).toEqual([])
    expect(glossaryMisses(GLOSSARY, 'Про Server Component і межі.', 'About a серверний компонент and a border.').map((m) => m.term)).toEqual(['Server Component', 'межа'])
    // link targets / anchors left in the source language are not judged
    expect(glossaryMisses(GLOSSARY, 'Див. розділ.', 'See [[#Межа і все|the section]].')).toEqual([])
  })
})

describe('i18n:check', () => {
  it('the fixture translation: no errors; the untranslated last paragraph and the missing lock are warnings', () => {
    const r = checkTranslation({ source: SRC, translated: TR, lock: null, glossary: GLOSSARY })
    expect(kinds(r.findings)).toEqual(['warning:untranslated:друге#p3', 'warning:unstamped:'])
    expect(r).toMatchObject({ segments: 11, translated: 10 })
  })

  it('stamp → clean; a later source edit makes that segment stale', () => {
    const src = segmentDocument(SRC)
    const lock = stampLock(src, segmentDocument(TR, { headingSlugs: sourceSlugs(src) }))
    expect(lock.sourceId).toBe('demo-01')
    expect(Object.keys(lock.segments)).toHaveLength(10)
    expect(kinds(checkTranslation({ source: SRC, translated: TR, lock, glossary: null }).findings)).toEqual(['warning:untranslated:друге#p3'])
    const edited = SRC.replace('Абзац другого розділу.', 'Абзац другого розділу (оновлено).')
    expect(kinds(checkTranslation({ source: edited, translated: TR, lock, glossary: null }).findings)).toEqual(['warning:stale:друге#p1', 'warning:untranslated:друге#p3'])
  })

  it('structure: an extra paragraph, a renamed exercise id, a dropped heading are errors', () => {
    const extra = TR.replace('A paragraph of the second section.', 'A paragraph of the second section.\n\nAn extra one.\n\nAnd another.\n\nAnd one more.')
    expect(kinds(checkTranslation({ source: SRC, translated: extra, lock: null, glossary: null }).findings).filter((k) => k.startsWith('error'))).toContain('error:structure:друге#p4')
    const renamed = TR.replace('id: demo-01-quiz-01', 'id: demo-01-quiz-99')
    expect(kinds(checkTranslation({ source: SRC, translated: renamed, lock: null, glossary: null }).findings)).toContain('error:structure:demo-01-quiz-99')
    const noHeading = TR.replace('## Second\n', '')
    expect(checkTranslation({ source: SRC, translated: noHeading, lock: null, glossary: null }).findings.some((f) => f.severity === 'error' && f.kind === 'structure')).toBe(true)
    const wrongKey = TR.replace('> - [ ] one\n> - [x] two', '> - [x] one\n> - [ ] two')
    expect(kinds(checkTranslation({ source: SRC, translated: wrongKey, lock: null, glossary: null }).findings)).toContain('error:structure:demo-01-quiz-01')
  })

  it('code: a changed task literal or a renamed identifier in an example is an error', () => {
    const literal = TR.replace('expect(one()).toBe(1)', 'expect(one()).toBe(2)')
    expect(kinds(checkTranslation({ source: SRC, translated: literal, lock: null, glossary: null }).findings)).toContain('error:code:demo-01-task-01')
    const ident = TR.replace("const x = 'a string'", "const y = 'a string'")
    expect(kinds(checkTranslation({ source: SRC, translated: ident, lock: null, glossary: null }).findings)).toContain('error:code:перше#p2')
  })

  it('a copied, untranslated paragraph and a glossary miss are warnings', () => {
    const copied = TR.replace('An intro to the boundary topic.', 'Вступ до теми про межу.')
    expect(kinds(checkTranslation({ source: SRC, translated: copied, lock: null, glossary: null }).findings)).toContain('warning:untranslated:#p1')
    const latin = TR.replace('about a Server Component', 'about a server-side component')
    expect(kinds(checkTranslation({ source: SRC, translated: latin, lock: null, glossary: GLOSSARY }).findings)).toContain('warning:glossary:перше#p1')
  })
})

function extracted(markdown: string) {
  const { root, meta } = parseMarkdown(markdown)
  const r = extractFile({ root, meta, guideId: 'demo', chapterId: 'demo-01', path: 'x.md', fileName: 'x' })
  return { root: r.root, headings: r.headings, units: new Map(r.units.map((u) => [u.id, u])) }
}

describe('display: fallback rendering', () => {
  const source = extracted(SRC)
  const doc = localizeDocument(source, extracted(TR), { sourceLang: 'uk', label: 'not translated yet', labelLang: 'en' })!

  it('translated segments come from the translation; the missing one stays Ukrainian with a marker', () => {
    expect(doc.missing).toEqual(['друге#p3'])
    const fallback = doc.root.children.filter((n) => n.type === 'i18nFallback')
    expect(fallback).toHaveLength(1)
    const html = JSON.stringify(mdastToHast(doc.root, { resolveLink: () => ({ kind: 'missing', href: null, label: '', title: null }) }).tree)
    expect(html).toContain('i18n-fallback')
    expect(html).toContain('not translated yet')
    expect(html).toContain('Останній абзац')
    expect(html).toContain('The first paragraph')
    expect(html).not.toContain('Перший абзац')
  })

  it('headings keep the source slugs (anchors, TOC); the TOC shows translated text; own anchors are retargeted', () => {
    expect(headingSlugs(doc.root as Root)).toEqual(headingSlugs(source.root))
    expect(doc.headings.map((h) => h.text)).toEqual(['First', 'Second'])
    const link = JSON.stringify(doc.root).match(/"type":"wikiLink"[^}]*/)![0]
    expect(link).toContain('"heading":"Друге"')
    expect(link).toContain('"alias":"Second"')
  })

  it('exercises: translated texts, the same ids, option ids, key, task code and hints', () => {
    const quiz = doc.units.get('demo-01-quiz-01')!
    const src = source.units.get('demo-01-quiz-01')!
    if (quiz.kind !== 'quiz' || src.kind !== 'quiz') throw new Error('quiz')
    expect(quiz.promptText).toBe('What is 1 + 1?')
    expect(quiz.options.map((o) => [o.id, o.correct])).toEqual(src.options.map((o) => [o.id, o.correct]))
    expect(quiz.id).toBe(src.id)
    const task = doc.units.get('demo-01-task-01')!
    if (task.kind !== 'task') throw new Error('task')
    expect(task.titleText).toBe('Return one')
    expect(task.code?.tests).toContain("test('returns 1'")
    expect(task.hints).toHaveLength(1)
  })

  it('a translated task whose tests differ is shown in the source language', () => {
    const changed = localizeDocument(source, extracted(TR.replace('toBe(1))', 'toBe(2))')), { sourceLang: 'uk', label: 'x', labelLang: 'en' })!
    const task = changed.units.get('demo-01-task-01')!
    if (task.kind !== 'task') throw new Error('task')
    expect(task.titleText).toBe('Поверни один')
    expect(task.code?.tests).toContain("test('повертає 1'")
  })
})

describe('content store: _i18n is not a chapter', () => {
  let snap: ContentSnapshot
  beforeAll(async () => {
    snap = await loadSnapshot({ vaultPath: vault, guidesDir: 'Guides' }, new Map(), 1)
  })

  it('translations are excluded from chapters, units, plain text, reels and links; no duplicate ids', () => {
    expect([...snap.chapters.values()].map((c) => c.path).some((p) => p.includes('_i18n'))).toBe(false)
    expect(snap.issues.filter((i) => i.code === 'duplicate-id' || i.code === 'i18n')).toEqual([])
    expect(snap.reels.every((r) => !r.title.includes('Fact'))).toBe(true)
    expect([...snap.plainText.values()].join(' ')).not.toContain('boundary')
    // the wiki-link by file name resolves to the source topic, not its translation
    const index = snap.chapters.get(snap.guides[0]!.indexChapterId!)!
    expect(index.outgoingLinks).toEqual(['Guides/Demo/Demo - 01. Межа.md'])
  })

  it('the translation is known by source topic id, with its title and localized slug', () => {
    const info = snap.translations.get('demo-01')?.get('en')
    expect(info).toMatchObject({ lang: 'en', title: 'The boundary', slug: 'the-boundary', path: 'Guides/Demo/_i18n/en/Demo - 01. Межа.md' })
    expect(Object.keys(info!.lock!)).toHaveLength(10)
  })

  it('ContentStore.localizedDocument merges the topic; reels keep their source ids', async () => {
    const store = new ContentStore({ vaultPath: vault, guidesDir: 'Guides' }, false)
    const doc = await store.localizedDocument('demo-01', 'en', { sourceLang: 'uk', label: 'not translated yet', labelLang: 'en' })
    expect(doc?.title).toBe('The boundary')
    expect(doc?.missing).toEqual(['друге#p3'])
    const reel = (await store.get()).reels.find((r) => r.chapterId === 'demo-01')!
    expect(doc?.reels.get(reel.id)?.title).toBe('Fact')
    expect(await store.localizedDocument('demo-01', 'de', { sourceLang: 'uk', label: '', labelLang: 'en' })).toBeNull()
  })
})

describe('manifest: localized fields', () => {
  const yaml = readFileSync(path.join(vault, 'Courses/demo-course/course.yaml'), 'utf8')
  const { manifest, errors } = parseCourseYaml(yaml)

  it('maps resolve to source strings; the other languages go to the side map', () => {
    expect(errors).toEqual([])
    expect(manifest).toMatchObject({ title: 'Демо-курс', description: 'Опис', sourceLanguage: 'uk', languages: ['uk', 'en'] })
    expect(manifest!.sections[0]!.title).toBe('Основи')
    expect(manifest!.skills![0]!.title).toBe('Рендеринг')
    expect(manifest!.i18n).toEqual({
      course: { title: { en: 'Demo course' }, description: { en: 'Description' }, slug: { en: 'demo-course-en' } },
      sections: { basics: { title: { en: 'Basics' } } },
      skills: { rendering: { title: { en: 'Rendering' } } },
    })
  })

  it('a map without the source language, or with an unlisted language, is an error', () => {
    const base = { id: 'x', version: '1.0.0', sections: [{ id: 's', title: 'S', from: 'G' }] }
    expect(parseCourseManifest({ ...base, title: { en: 'X' }, languages: ['uk', 'en'] }).errors.join()).toContain('мовою джерела')
    expect(parseCourseManifest({ ...base, title: { uk: 'X', de: 'Y' } }).errors.join()).toContain('«de» не в languages')
    expect(parseCourseManifest({ ...base, title: 'X', languages: ['en'] }).errors.join()).toContain('мову джерела')
  })

  it('a course without translations has no new fields (bundles stay byte-identical)', () => {
    const plain = parseCourseManifest({ id: 'x', version: '1.0.0', title: 'X', sections: [{ id: 's', title: 'S', from: 'G' }] }).manifest!
    expect(plain.i18n).toBeNull()
    expect(plain.languages).toEqual(['uk'])
  })

  it('the bundle keeps source strings and carries `i18n`, `languages`; course texts localize per field', async () => {
    const snap = await loadSnapshot({ vaultPath: vault, guidesDir: 'Guides' }, new Map(), 1)
    const bundle = compileCourse(manifest!, snap)
    expect(bundle.course.title).toBe('Демо-курс')
    expect(bundle.course.languages).toEqual(['uk', 'en'])
    expect('sourceLanguage' in bundle.course).toBe(false)
    expect(bundle.i18n?.sections.basics?.title).toEqual({ en: 'Basics' })
    const en = localizedCourse(bundle, 'en')
    expect([en.title, en.subtitle, en.section('basics', { title: 'Основи', description: null }).title]).toEqual(['Demo course', null, 'Basics'])
    expect(localizedCourse(bundle, null).title).toBe('Демо-курс')
    expect(courseHreflangs(bundle)).toEqual(['uk', 'en'])
  })
})

describe('locale resolution', () => {
  it('profiles.locale → UI locale (null / unknown → uk)', () => {
    expect([resolveLocale(null), resolveLocale(undefined), resolveLocale('en'), resolveLocale('fr')]).toEqual(['uk', 'uk', 'en', 'uk'])
  })

  it('en falls back to uk key by key; placeholders work', () => {
    expect(t('lesson.next', undefined, 'en')).toBe('Next lesson')
    expect(t('placement.question', { n: 3 }, 'en')).toBe('Question 3')
    // a key the en dictionary doesn't have yet → uk
    expect(t('auth.login.title', undefined, 'en')).toBe(t('auth.login.title'))
    expect(messages('en').auth.login.title).toBe(messages('uk').auth.login.title)
    expect(contentMeta('дуже часто', 'en')).toBe('very often')
    expect(contentMeta('невідоме', 'en')).toBe('невідоме')
  })

  it('en covers the shell, course page, lesson player, task runner, harness and placement completely', () => {
    for (const area of ['shell', 'nav', 'navBadge', 'courses', 'tests', 'lesson', 'quiz', 'rate', 'task', 'harness', 'placement', 'skills', 'i18n', 'contentMeta', 'game.hearts']) {
      const c = coverage('en', area)
      expect(c.translated, area).toBe(c.total)
    }
    expect(Object.keys(HARNESS_UK).sort()).toEqual(Object.keys(messages('en').harness).sort())
  })

  it('the course decides the content language: listed and translated → the UI locale, else the source', () => {
    const course = { language: 'uk', languages: ['uk', 'en'] }
    expect(courseLanguages(course)).toEqual({ source: 'uk', languages: ['uk', 'en'] })
    expect(contentLanguage(course, 'en', ['uk', 'en'])).toBe('en')
    expect(contentLanguage(course, 'en', ['uk'])).toBeNull()
    expect(contentLanguage(course, 'uk')).toBeNull()
    expect(contentLanguage({ language: 'uk' }, 'en')).toBeNull()
  })
})

describe('harness texts', () => {
  const host: HarnessHost = { setTimeout, clearTimeout: (id) => clearTimeout(id as never), setInterval, clearInterval: (id) => clearInterval(id as never), now: Date.now }
  it('runs with the English texts', async () => {
    const report = await runSuite('', 'const x = 1', () => {}, host, 300, messages('en').harness)
    expect(report.error).toBe('The tests have no test(…)')
    const failed = await runSuite('', "test('t', () => expect(() => 1).toThrow())", () => {}, host, 300, messages('en').harness)
    expect(failed.tests[0]!.received).toBe('the function threw nothing')
  })
})

// Review fixes: when in doubt, show the source — a translation never changes what is graded or where a heading points.
describe('display: when in doubt, the source', () => {
  const source = extracted(SRC)
  const opts = { sourceLang: 'uk', label: 'x', labelLang: 'en' }
  const quizOf = (md: string) => localizeDocument(source, extracted(md), opts)!.units.get('demo-01-quiz-01')!

  it('a moved [x] or reordered options → the source quiz', () => {
    const moved = quizOf(TR.replace('> - [ ] one\n> - [x] two', '> - [x] one\n> - [ ] two'))
    const reordered = quizOf(TR.replace('> - [ ] one\n> - [x] two', '> - [x] two\n> - [ ] one'))
    for (const q of [moved, reordered]) expect(q.kind === 'quiz' && q.promptText).toBe('Скільки буде 1 + 1?')
    expect(quizOf(TR).kind === 'quiz' && (quizOf(TR) as { promptText: string }).promptText).toBe('What is 1 + 1?')
  })

  it('an output quiz whose code differs → the source quiz', () => {
    const src = SRC.replace('> - [ ] один', '> ```js\n> console.log(1 + 1)\n> ```\n>\n> - [ ] один')
    const tr = TR.replace('> - [ ] one', '> ```js\n> console.log(1 + 2)\n> ```\n>\n> - [ ] one')
    const q = localizeDocument(extracted(src), extracted(tr), opts)!.units.get('demo-01-quiz-01')!
    expect(q.kind === 'quiz' && q.promptText).toBe('Скільки буде 1 + 1?')
  })

  it('order: a changed code piece → the source exercise', () => {
    const md = (q: string, pieces: string) => `---\nid: o\n---\n# T\n\n## A\n\n> [!quiz] ${q}\n> type: order · id: o-quiz-01\n>\n> \`\`\`js order\n${pieces}\n> \`\`\`\n`
    const src = extracted(md('Склади', "> const a = 1\n> log(a) // ✗"))
    const same = localizeDocument(src, extracted(md('Assemble', "> const a = 1 // first\n> log(a) // ✗")), opts)!.units.get('o-quiz-01')!
    const other = localizeDocument(src, extracted(md('Assemble', "> const b = 1\n> log(a) // ✗")), opts)!.units.get('o-quiz-01')!
    expect(same.kind === 'quiz' && same.promptText).toBe('Assemble')
    expect(other.kind === 'quiz' && other.promptText).toBe('Склади')
  })

  it('a task whose reference solution or hint code differs → the source task', () => {
    const solution = localizeDocument(source, extracted(TR.replace('function one() { return 1 }', 'function one() { return 2 }')), opts)!.units.get('demo-01-task-01')!
    expect(solution.kind === 'task' && solution.titleText).toBe('Поверни один')
  })

  it('a missing ## heading → no translated page at all', () => {
    expect(localizeDocument(source, extracted(TR.replace('## Second\n', '')), opts)).toBeNull()
    expect(localizeDocument(source, extracted(TR.replace('## Second', '### Second')), opts)).toBeNull()
  })

  it('a section whose blocks do not line up falls back whole (its heading stays translated)', () => {
    const shifted = TR.replace('The first paragraph about a Server Component.\n\n', '')
    const doc = localizeDocument(source, extracted(shifted), opts)!
    expect(doc.missing).toEqual(expect.arrayContaining(['перше#p1', 'перше#p2', 'demo-01-quiz-01', 'перше#p3']))
    expect(doc.missing).not.toContain('перше')
    // the quiz sits in a fallback block: its source texts
    expect((doc.units.get('demo-01-quiz-01') as { promptText: string }).promptText).toBe('Скільки буде 1 + 1?')
  })

  it('the lock: unstamped or stale segments are shown in the source language', () => {
    const src = segmentDocument(SRC)
    const lock = stampLock(src, segmentDocument(TR, { headingSlugs: sourceSlugs(src) })).segments
    const ok = localizeDocument(source, extracted(TR), { ...opts, lock, sourceText: SRC })!
    expect(ok.missing).toEqual(['друге#p3'])
    const edited = SRC.replace('Абзац другого розділу.', 'Абзац другого розділу (оновлено).')
    const stale = localizeDocument(extracted(edited), extracted(TR), { ...opts, lock, sourceText: edited })!
    expect(stale.missing).toEqual(['друге#p1', 'друге#p3'])
    const { 'demo-01-quiz-01': _quiz, ...partial } = lock
    const unstamped = localizeDocument(source, extracted(TR), { ...opts, lock: partial, sourceText: SRC })!
    expect(unstamped.missing).toContain('demo-01-quiz-01')
    expect((unstamped.units.get('demo-01-quiz-01') as { promptText: string }).promptText).toBe('Скільки буде 1 + 1?')
  })

  it('only links to this topic are retargeted', () => {
    const other = TR.replace('see [[#Second]]', 'see [[Other topic#Second]]')
    const doc = localizeDocument(source, extracted(other), opts)!
    expect(JSON.stringify(doc.root)).toContain('"target":"Other topic","heading":"Second"')
    const self = localizeDocument(source, extracted(TR.replace('see [[#Second]]', 'see [[Demo - 01. Межа#Second]]')), { ...opts, isSelf: (t: string) => t === 'Demo - 01. Межа' })!
    expect(JSON.stringify(self.root)).toContain('"heading":"Друге"')
  })

  it('the store shows nothing without a lock', async () => {
    const snap = await loadSnapshot({ vaultPath: vault, guidesDir: 'Guides' }, new Map(), 1)
    const info = snap.translations.get('demo-01')!.get('en')!
    expect(info.lock).not.toBeNull()
    const store = new ContentStore({ vaultPath: vault, guidesDir: 'Guides' }, false)
    const s = await store.get()
    s.translations.get('demo-01')!.get('en')!.lock = null
    expect(await store.localizedDocument('demo-01', 'en', opts)).toBeNull()
  })
})

describe('code comparison: review pairs', () => {
  const lenient = (value: string, lang = 'tsx') => codeSkeleton({ lang, value, role: 'lenient' })
  it('directives and module specifiers are code; comparison operators are not JSX text', () => {
    expect(lenient("'use client'\nexport const A = 1")).not.toBe(lenient("'use server'\nexport const A = 1"))
    expect(lenient("'use cache'\nexport const A = 1")).not.toBe(lenient("'use cache: private'\nexport const A = 1"))
    expect(lenient("import { useRouter } from 'next/navigation'")).not.toBe(lenient("import { useRouter } from 'next/router'"))
    expect(lenient("const m = await import('./a')")).not.toBe(lenient("const m = await import('./b')"))
    expect(lenient("const fs = require('node:fs')", 'js')).not.toBe(lenient("const fs = require('fs')", 'js'))
    expect(lenient('if (a > b && c < d) go()')).not.toBe(lenient('if (a > z || y < d) go()'))
    // genuine JSX text still translates
    expect(lenient('return <p className="x">Привіт, {name}!</p>')).toBe(lenient('return <p className="x">Hello, {name}!</p>'))
  })

  it('strict: newlines count; a regex literal is not a comment', () => {
    const strict = (value: string) => codeSkeleton({ lang: 'js', value, role: 'strict' })
    expect(strict('const a = 1\nconst b = 2')).not.toBe(strict('const a = 1 const b = 2'))
    expect(strict('const re = /\\/\\// // a comment\nre.test(x)')).toBe(strict('const re = /\\/\\// // коментар\nre.test(x)'))
    expect(strict('const re = /\\/\\//g')).not.toBe(strict('const re = /\\/\\/x/g'))
    expect(strict('const half = a / 2 // half\nconst q = b / 3')).toBe(strict('const half = a / 2 // половина\nconst q = b / 3'))
  })
})
