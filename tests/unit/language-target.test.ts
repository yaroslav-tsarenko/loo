import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { compareWords, dictationMatches, foldGerman, judgeSpeech, speechHints, words } from '@/content/blocks/lang/grade'
import { loadSnapshot, type FullSnapshot } from '@/content/store'
import { CourseBundleSchema, compileCourse, examBand, parseCourseManifest, parseCourseYaml, skillsView, initialSkills, type CourseManifestInput, type Level } from '@/course'
import { messages, t } from '@/i18n'
import { hasAccentChoice, ipaShown, languageNameUk, showsAccentSetting, voiceLang } from '@/ui/lang/speech/voices'

// A language course for any target (docs/LANGUAGE_COURSE.md «Нова мова: що задати»): the exam mapping is course data
// (course.yaml `exam:`), speech follows `target`, the accent is English-only, grading folds German. The English course
// must not change: same bundle (plus `exam`), same IELTS texts.

vi.mock('@/server/actions/settings', () => ({ updateSetting: async () => ({ ok: true }) }))
vi.mock('@/server/actions/speech', () => ({ speechLines: async () => ({ lines: [], slow: false }) }))
const { DictationInput } = await import('@/ui/lang/DictationInput')
const { AudioButton } = await import('@/ui/lang/AudioButton')
const { skillsNote } = await import('@/ui/courses/SkillLevels')

const ROOT = path.resolve(__dirname, '../..')
const englishYaml = () => readFileSync(path.join(ROOT, 'content/courses/english-a1-c2/course.yaml'), 'utf8')
const CEFR: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

// The CEFR ↔ IELTS table the app had in code before it became course data (src/course/select/ielts.ts).
const OLD_IELTS: Record<string, string> = { A1: 'нижче 4.0', A2: 'нижче 4.0', B1: '4.0–5.0', B2: '5.5–6.5', C1: '7.0–8.0', C2: '8.5–9.0' }

// Placeholders only — the German syllabus supplies the real values.
const GERMAN_EXAM = {
  id: 'goethe',
  name: 'Goethe-Zertifikat',
  bands: { A1: 'A1 (placeholder 1)', A2: 'A2', B1: 'B1', B2: 'B2', C1: 'C1', C2: 'C2 (placeholder GDS)' },
  also: { B2: 'TestDaF TDN 3 (placeholder)', C1: 'DSH-2 (placeholder)' },
}

function germanManifest(extra: Partial<CourseManifestInput> = {}): CourseManifestInput {
  return {
    id: 'deutsch-test',
    version: '0.1.0',
    title: 'Deutsch test',
    subject: 'language',
    kind: 'language',
    language: 'uk',
    target: 'de',
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    sections: [{ id: 'a1', title: 'A1', from: 'English', chapters: 101, level: 'A1' }],
    exam: GERMAN_EXAM,
    ...extra,
  }
}

describe('English course: exam mapping is IELTS, byte-identical texts', () => {
  const manifest = parseCourseYaml(englishYaml())
  const exam = manifest.manifest?.exam

  it('course.yaml parses and declares IELTS', () => {
    expect(manifest.errors).toEqual([])
    expect(exam?.id).toBe('ielts')
    expect(exam?.name).toBe('IELTS')
  })

  it('every CEFR level has the same band as the old hard-coded table', () => {
    for (const level of CEFR) expect(examBand(exam, level)).toEqual({ exam: 'IELTS', label: OLD_IELTS[level] })
    expect(examBand(exam, 'middle')).toBeNull()
  })

  it('UI strings render exactly as before', () => {
    const b2 = examBand(exam, 'B2')!
    expect(t('skills.exam', { exam: b2.exam, band: b2.label })).toBe('IELTS ~5.5–6.5')
    expect(t('placement.exam', { exam: b2.exam, band: b2.label })).toBe('IELTS орієнтовно: 5.5–6.5')
    expect(` · ${t('skills.exam', { exam: b2.exam, band: b2.label })}`).toBe(' · IELTS ~5.5–6.5')
    expect(skillsNote(b2)).toBe('Оновлюється після кожного тесту теми й екзамену. IELTS — лише орієнтир: письмо й говоріння тут не оцінюються.')
    expect(exam?.note).toBe('Лише орієнтир за шкалою Cambridge / British Council. IELTS ще оцінює письмо й говоріння — цей тест їх не перевіряє.')
    const m = messages().onboarding
    expect(m.purposes.exam.replace('{exam}', 'IELTS')).toBe('Іспит (IELTS)')
    expect(m.react.purposes.exam.replace('{exam}', 'IELTS')).toBe('IELTS? Готуймося разом!')
  })

  it('the committed bundle carries the same exam (pnpm course:build) and still validates', () => {
    const bundle = JSON.parse(readFileSync(path.join(ROOT, 'content/courses/english-a1-c2.json'), 'utf8'))
    expect(bundle.course.exam).toEqual(exam)
    expect(bundle.course.target).toBe('en')
    expect(CourseBundleSchema.safeParse(bundle).success).toBe(true)
  })
})

describe('exam mapping changes nothing else in a compiled bundle', () => {
  let snap: FullSnapshot
  const vaultPath = path.resolve(__dirname, '../fixtures/lang-vault')
  const yaml = () => readFileSync(path.join(vaultPath, 'Courses/english-test/course.yaml'), 'utf8')
  beforeAll(async () => {
    snap = await loadSnapshot({ vaultPath, guidesDir: 'Guides' }, new Map(), 1)
  })

  it('with and without `exam:` the bundles differ only in course.exam', () => {
    const plain = parseCourseYaml(yaml()).manifest!
    const withExam = parseCourseYaml(`${yaml()}\nexam: { id: ielts, name: IELTS, below: 'нижче 4.0', bands: { B1: '4.0–5.0' } }\n`).manifest!
    const a = compileCourse(plain, snap)
    const b = compileCourse(withExam, snap)
    expect(a.course.exam).toBeUndefined()
    expect(b.course.exam?.name).toBe('IELTS')
    const { exam: _exam, ...rest } = b.course
    expect(JSON.stringify({ ...b, course: rest })).toBe(JSON.stringify(a))
  })

  it('a course without `exam:` shows no exam line', () => {
    expect(examBand(undefined, 'B2')).toBeNull()
    const levels = [...CEFR]
    expect(skillsView(initialSkills({ level: 'B1' }, levels), levels).exam).toBeNull()
    expect(skillsNote(null)).toBe('Оновлюється після кожного тесту теми й екзамену.')
  })
})

describe('German course: exam mapping as data', () => {
  it('validates a Goethe mapping with extra labels and carries it into the bundle meta', () => {
    const { manifest, errors } = parseCourseManifest(germanManifest())
    expect(errors).toEqual([])
    expect(manifest!.exam).toEqual(GERMAN_EXAM)
    expect(examBand(manifest!.exam, 'A1')).toEqual({ exam: 'Goethe-Zertifikat', label: 'A1 (placeholder 1)' })
    expect(examBand(manifest!.exam, 'B2')?.label).toBe('B2 · TestDaF TDN 3 (placeholder)')
    expect(examBand(manifest!.exam, 'C1')?.label).toBe('C1 · DSH-2 (placeholder)')
  })

  it('a level without a band and without `below` has no exam line', () => {
    const { manifest } = parseCourseManifest(germanManifest({ exam: { id: 'goethe', name: 'Goethe-Zertifikat', bands: { B1: 'B1' } } }))
    expect(examBand(manifest!.exam, 'A1')).toBeNull()
    expect(examBand(manifest!.exam, 'B1')?.label).toBe('B1')
  })

  it('rejects bad mappings: IT levels as keys, an exam on a programming course, a missing name', () => {
    expect(parseCourseManifest(germanManifest({ exam: { id: 'goethe', name: 'Goethe', bands: { middle: 'x' } as never } })).errors.length).toBeGreaterThan(0)
    expect(parseCourseManifest(germanManifest({ exam: { id: 'goethe', bands: {} } as never })).errors.length).toBeGreaterThan(0)
    const js = parseCourseManifest({ id: 'js', version: '1.0.0', title: 'JS', subject: 'programming', sections: [{ id: 's', title: 'S', from: 'JS' }], exam: GERMAN_EXAM })
    expect(js.errors.some((e) => e.startsWith('exam:'))).toBe(true)
  })

  it('the generic placement note names the course exam', () => {
    expect(t('placement.examNote', { exam: 'Goethe-Zertifikat' })).toBe('Лише орієнтир. Goethe-Zertifikat ще оцінює письмо й говоріння — цей тест їх не перевіряє.')
  })
})

describe('speech follows the target: voice, accent, dictation', () => {
  it('German always speaks de-DE, whatever the English accent setting', () => {
    expect(voiceLang('de', 'en-GB')).toBe('de-DE')
    expect(voiceLang('de', 'en-US')).toBe('de-DE')
    expect(voiceLang('de-AT', 'en-US')).toBe('de-AT')
    // English unchanged
    expect(voiceLang('en', 'en-US')).toBe('en-US')
    expect(voiceLang('en')).toBe('en-GB')
    expect(voiceLang(null)).toBe('en-GB')
  })

  it('the accent choice exists for English only', () => {
    expect(hasAccentChoice('en')).toBe(true)
    expect(hasAccentChoice('de')).toBe(false)
    expect(showsAccentSetting(['de'])).toBe(false)
    expect(showsAccentSetting(['de', 'en'])).toBe(true)
    expect(showsAccentSetting(['en'])).toBe(true)
    expect(showsAccentSetting([])).toBe(true)
  })

  it('the accent switch is rendered for English and hidden for German', () => {
    const en = renderToStaticMarkup(createElement(AudioButton, { text: 'hello', lang: 'en', accentSwitch: true }))
    const de = renderToStaticMarkup(createElement(AudioButton, { text: 'Hallo', lang: 'de', accentSwitch: true }))
    expect(en).toContain('lang-accent')
    expect(de).not.toContain('lang-accent')
  })

  it('IPA: no US variant → no UK / US tag, the single transcription is shown', () => {
    expect(ipaShown('/ˈhaləʊ/', null, 'en-US')).toEqual({ text: '/ˈhaləʊ/', region: null })
    expect(ipaShown('/ˈhaləʊ/', '/həˈloʊ/', 'en-US')).toEqual({ text: '/həˈloʊ/', region: 'US' })
    expect(ipaShown('/ˈhaləʊ/', '/həˈloʊ/', 'en-GB')).toEqual({ text: '/ˈhaləʊ/', region: 'UK' })
  })

  it('dictation names the target language and sets the field language', () => {
    expect(languageNameUk('en')).toBe('англійською')
    expect(languageNameUk('de')).toBe('німецькою')
    expect(languageNameUk('de-DE')).toBe('німецькою')
    expect(languageNameUk('xx')).toBeNull()
    const props = { id: 'd', value: '', onChange: () => {}, disabled: false, expected: null, onSubmit: () => {} }
    const de = renderToStaticMarkup(createElement(DictationInput, { ...props, lang: 'de' }))
    expect(de).toContain('lang="de"')
    expect(de).toContain('Надрукуй, що почув — німецькою')
    const en = renderToStaticMarkup(createElement(DictationInput, { ...props, lang: 'en' }))
    expect(en).toContain('lang="en"')
    expect(en).toContain('Надрукуй, що почув — англійською')
    // no lang passed: the last-resort default is English, as before
    expect(renderToStaticMarkup(createElement(DictationInput, props))).toContain('lang="en"')
  })
})

describe('German speech normalisation', () => {
  it('ignores case and punctuation, folds ß and umlauts', () => {
    expect(words('Die Straße ist schön!', 'de')).toEqual(['die', 'strasse', 'ist', 'schoen'])
    expect(words('DIE STRASSE IST SCHOEN', 'de')).toEqual(['die', 'strasse', 'ist', 'schoen'])
    expect(foldGerman('mädchen über größe')).toBe('maedchen ueber groesse')
    expect(words('Wie geht’s?', 'de-DE')).toEqual(['wie', 'gehts'])
  })

  it('dictation and speech accept umlaut / ß spellings as the same word', () => {
    expect(dictationMatches('Das Maedchen isst Suessigkeiten', 'Das Mädchen isst Süßigkeiten.', [], 'de')).toBe(true)
    expect(dictationMatches('das mädchen isst', 'Das Mädchen isst Süßigkeiten.', [], 'de')).toBe(false)
    expect(judgeSpeech('Ich heiße Anna.', ['ich heisse anna'], 'de').passed).toBe(true)
    expect(compareWords('Grüß Gott', 'gruess gott', { lang: 'de' }).score).toBe(1)
  })

  it('English rules stay off for German: no contractions, number words, spelling or homophones', () => {
    // numbers stay digits (no «two»), «meter» is not respelled «metre», «I'm» is not expanded
    expect(words('2 Meter', 'de')).toEqual(['2', 'meter'])
    expect(words("I'm", 'de')).toEqual(['im'])
    // an English homophone pair (see / sea) is not a match in German — «See» is a German word (lake)
    expect(compareWords('Der See', 'der sea', { homophones: true, lang: 'de' }).score).toBe(0.5)
    expect(compareWords('the see', 'the sea', { homophones: true, lang: 'en' }).score).toBe(1)
    // English sound hints («th — …») are not given for German words
    const v = compareWords('Thema', '', { lang: 'de' })
    expect(speechHints(v, { text: 'Thema', ipa: null, tip: null }, 'uk', 3, 'de').some((h) => h.startsWith('th —'))).toBe(false)
  })

  it('English is unchanged with lang `en` and with no lang at all', () => {
    for (const lang of ['en', 'en-GB', undefined, null]) {
      expect(words("I'm 21, it's my favorite color", lang)).toEqual(['i', 'am', 'twenty', 'one', 'it', 'is', 'my', 'favourite', 'colour'])
      expect(judgeSpeech('I want to go', ['i want two go'], lang).passed).toBe(true)
    }
    expect(words('Straße')).toEqual(['straße'])
  })
})
