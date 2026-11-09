import { readFileSync } from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import { compareWords, dictationMatches, judgeSpeech, normalizeText, numberWords, speechHints, words } from '@/content/blocks/lang/grade'
import { splitTranslation } from '@/content/blocks/lang/fields'
import { parsePairTitle } from '@/content/blocks/pair/definition'
import { gradeQuiz } from '@/content/blocks/quiz/grade'
import { gradedQuiz, gradeWithKey, quizKey, quizShape } from '@/content/blocks/quiz/view'
import { parseName } from '@/content/discover/names'
import type { FlashcardUnit, QuizUnit } from '@/content/model'
import { toLevel } from '@/content/parse/markdown'
import { loadSnapshot, type FullSnapshot } from '@/content/store'
import { unitMeta } from '@/content/unit-meta'
import {
  buildCoursePath,
  checkCourse,
  compileCourse,
  courseLadder,
  courseLevels,
  CourseBundleSchema,
  LEVEL_LABEL,
  levelRank,
  levelShort,
  parseCourseManifest,
  parseCourseYaml,
  placementCandidates,
  sectionForLevel,
  startSection,
  toCourseLevel,
  toLadder,
  type CourseBundle,
} from '@/course'
import { courseRankLabel, levelLabel, levelTag } from '@/game'
import { xpForAttempt } from '@/progress/xp'
import { languageCounts } from '@/server/services/counts-core'
import { pickVoice, voiceLang } from '@/ui/lang/speech/voices'
import { LISTEN_KEY, PRON_KEY, WORDS_KEY } from '@/ui/shell/constants'

const vaultPath = path.resolve(__dirname, '../fixtures/lang-vault')
let snap: FullSnapshot
let bundle: CourseBundle

const unit = <T extends 'flashcard' | 'quiz'>(id: string) => snap.units.get(id) as T extends 'quiz' ? QuizUnit : FlashcardUnit

beforeAll(async () => {
  snap = await loadSnapshot({ vaultPath, guidesDir: 'Guides' }, new Map(), 1)
  bundle = compileCourse(parseCourseYaml(readFileSync(path.join(vaultPath, 'Courses/english-test/course.yaml'), 'utf8')).manifest!, snap)
})

describe('CEFR ladder', () => {
  it('parses CEFR levels in content and courses', () => {
    expect(toLevel('A1')).toBe('A1')
    expect(toLevel('b2')).toBe('B2')
    expect(toLevel('junior')).toBe('junior')
    expect(toLevel('D1')).toBeNull()
    expect(toCourseLevel('c1')).toBe('C1')
    expect(toCourseLevel('techlead')).toBe('god')
  })

  it('ranks inside a ladder and maps between ladders by rank', () => {
    expect(levelRank('A1')).toBe(0)
    expect(levelRank('C2')).toBe(5)
    expect(levelRank('god')).toBe(4)
    expect(toLadder('noob', 'cefr')).toBe('A1')
    expect(toLadder('junior', 'cefr')).toBe('A2')
    expect(toLadder('C2', 'it')).toBe('god')
    expect(toLadder('B1', 'cefr')).toBe('B1')
    expect(toCourseLevel('junior', 'cefr')).toBe('A2')
  })

  it('labels CEFR levels and maps the per-course rank of language courses', () => {
    expect(LEVEL_LABEL.A1).toBe('A1 · Початковий')
    expect(levelLabel('C2')).toBe('C2 · Вільне володіння')
    expect(levelTag('B1')).toBe('рівень B1')
    expect(levelLabel('senior')).toBe('Senior')
    expect(levelShort('A1')).toBe('A1')
    expect(levelShort('noob')).toBe('Trainee')
    expect(courseRankLabel('trainee', 'cefr')).toBe('A1 · Початковий')
    expect(courseRankLabel('principal', 'cefr')).toBe('C2 · Вільне володіння')
    expect(courseRankLabel('senior')).toBe('Senior')
  })

  it('defaults a language course to A1…C2 and rejects levels of the other ladder', () => {
    const base = { id: 'x', version: '1.0.0', title: 'X', sections: [{ id: 'a', title: 'A', from: 'G' }] }
    expect(parseCourseManifest({ ...base, kind: 'language' }).manifest!.levels).toEqual(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    expect(parseCourseManifest({ ...base, subject: 'programming' }).manifest!.levels).toEqual(['noob', 'junior', 'middle', 'senior', 'god'])
    expect(parseCourseManifest({ ...base, kind: 'language', levels: ['noob'] }).errors[0]).toMatch(/levels\.0/)
    expect(parseCourseManifest({ ...base, sections: [{ id: 'a', title: 'A', from: 'G', level: 'A1' }] }).errors[0]).toMatch(/sections\.0\.level/)
    expect(courseLadder({ kind: 'language' })).toBe('cefr')
    expect(courseLevels({ kind: 'programming', levels: ['junior', 'noob'] })).toEqual(['noob', 'junior'])
  })

  it('gives CEFR exercises base XP', () => {
    expect(xpForAttempt({ unitId: 'u', kind: 'quiz', outcome: 'correct', level: 'A1', quizMode: 'single', hintsUsed: 0, at: 0 }, { everCorrect: false, lastCorrectDay: null })).toBe(10)
    expect(xpForAttempt({ unitId: 'u', kind: 'quiz', outcome: 'correct', level: 'C2', quizMode: 'speak', hintsUsed: 0, at: 0 }, { everCorrect: false, lastCorrectDay: null })).toBe(42)
  })
})

describe('names: CEFR topic numbering', () => {
  it('reads `English - A1 - 01. Title` as 101', () => {
    expect(parseName('English - A1 - 01. Алфавіт, звуки й IPA', 'English')).toEqual({ number: 101, rest: 'Алфавіт, звуки й IPA', label: 'a1-01' })
    expect(parseName('English - C2 - 22. Підсумок', 'English')).toMatchObject({ number: 622, rest: 'Підсумок' })
    expect(parseName('English - b1 - 5 Title', 'English')).toMatchObject({ number: 305 })
    // plain numbering unchanged
    expect(parseName('PostgreSQL - 09. Індекси', 'PostgreSQL')).toEqual({ number: 9, rest: 'Індекси' })
  })

  it('numbers chapters without frontmatter `order` and keeps the level in the slug', () => {
    const hello = [...snap.chapters.values()].find((c) => c.title === 'Привітання')!
    expect(hello.number).toBe(101)
    expect(hello.slug.at(-1)).toBe('a1-01-привітання')
    expect(hello.level).toBe('A1')
  })
})

describe('language blocks: parsing', () => {
  it('[!word] → a flashcard with the word spec', () => {
    const w = unit<'flashcard'>('en-a1-hello-w01')
    expect(w.kind).toBe('flashcard')
    expect(w.qtype).toBe('слово')
    expect(w.level).toBe('A1')
    expect(w.word).toEqual({
      word: 'hello',
      ipa: '/həˈləʊ/',
      ipaUs: '/həˈloʊ/',
      pos: 'interj',
      translations: ['привіт', 'добрий день'],
      examples: [
        { en: 'Hello, I’m Anna.'.replace('’', "'"), tr: 'Привіт, я Анна.', bold: ['Hello'] },
        { en: 'Are you sure? — Yes, I am.', tr: 'Ти впевнений? — Так.', bold: ['sure'] },
      ],
      forms: 'hello → hellos',
      note: 'Нейтральне вітання.',
    })
  })

  it('splits an example from its translation at the right dash', () => {
    expect(splitTranslation('I eat an apple. — Я їм яблуко.')).toEqual(['I eat an apple.', 'Я їм яблуко.'])
    expect(splitTranslation('Bye!')).toEqual(['Bye!', null])
  })

  it('[!listen] → quiz mode listen: choice, dictation, dialogue answer', () => {
    const choice = unit<'quiz'>('en-a1-hello-l01')
    expect(choice.mode).toBe('listen')
    expect(choice.listen).toEqual({ type: 'choice', lines: [{ speaker: null, text: 'Nice to meet you.' }], slow: true, accept: [] })
    expect(choice.options.map((o) => o.correct)).toEqual([false, true, false])
    // the transcript never goes into search
    expect(choice.searchText).not.toContain('meet')
    const dictation = unit<'quiz'>('en-a1-hello-l02')
    expect(dictation.listen!.type).toBe('dictation')
    expect(dictation.freeAnswer).toBe("I'm 21 years old.")
    expect(dictation.listen!.accept).toEqual(['I am twenty-one.'])
    const dialogue = unit<'quiz'>('en-a1-hello-l03')
    expect(dialogue.listen!.type).toBe('answer')
    expect(dialogue.listen!.lines).toEqual([
      { speaker: 'A', text: 'Where are you from?' },
      { speaker: 'B', text: "I'm from Ukraine." },
    ])
    expect(dialogue.explanation).not.toBeNull()
  })

  it('[!listen] type: fill — a form completed while listening (IELTS form completion)', () => {
    const form = unit<'quiz'>('en-a1-hello-l05')
    expect(form.mode).toBe('listen')
    expect(form.listen!.type).toBe('fill')
    expect(form.exercise?.kind).toBe('fill')
    // the fence is the exercise, not part of the body
    expect(JSON.stringify(form.body)).not.toContain('Kovalenko')
    // case, spacing and a final full stop don't matter; alternatives count
    expect(gradeQuiz(form, { chosen: ['kovalenko', 'kiev.'] })).toBe(true)
    expect(gradeQuiz(form, { chosen: ['Kovalenko', 'Lviv'] })).toBe(false)
    // the graded payload has the form without its answers
    const payload = JSON.stringify(gradedQuiz(form))
    expect(payload).toContain('Name: Anna')
    expect(payload).not.toMatch(/Kovalenko|Kyiv|Kiev/)
    expect(quizKey(form).blanks).toEqual([['Kovalenko'], ['Kyiv', 'Kiev']])
  })

  it('[!pair] and [!speak]', () => {
    const pair = unit<'quiz'>('en-a1-hello-p01')
    expect(pair.mode).toBe('pair')
    expect(pair.pair).toEqual({ words: [{ word: 'ship', ipa: '/ʃɪp/' }, { word: 'sheep', ipa: '/ʃiːp/' }], say: 'sheep', tip: '[ɪ] коротке, [iː] довге.' })
    expect(pair.options.map((o) => o.correct)).toEqual([false, true])
    expect(parsePairTitle('thirteen vs thirty')).toEqual([
      { word: 'thirteen', ipa: null },
      { word: 'thirty', ipa: null },
    ])
    expect(parsePairTitle('just one')).toBeNull()
    const speak = unit<'quiz'>('en-a1-hello-s01')
    expect(speak.mode).toBe('speak')
    expect(speak.speak).toEqual({ text: 'Nice to meet you.', ipa: '/naɪs tə miːt juː/', ipaUs: null, tip: '«meet» — довге [iː].', translation: 'Приємно познайомитися.', slow: false })
  })

  it('reports authoring problems', () => {
    const messages = snap.issues.map((i) => `${i.severity}:${i.message}`)
    expect(messages).toContainEqual(expect.stringMatching(/^error:\[!listen\] «Без аудіо»: немає рядка audio/))
    expect(messages).toContainEqual(expect.stringMatching(/^error:\[!pair\] «thirteen — thirty»: say «forty»/))
    expect(messages).toContainEqual(expect.stringMatching(/^warning:\[!word\] «bye»: немає перекладу/))
    expect(snap.units.has('en-a1-hello-l04')).toBe(false)
  })
})

describe('language answers: grading', () => {
  it('normalises case, punctuation, contractions, numbers and spelling', () => {
    expect(normalizeText('  “Hello,”  WORLD!! ')).toBe('hello world')
    expect(words("I'm 21, she's fine & they don't")).toEqual(['i', 'am', 'twenty', 'one', 'she', 'is', 'fine', 'they', 'do', 'not'])
    expect(words("Tom's car can't go")).toEqual(['toms', 'car', 'can', 'not', 'go'])
    expect(words('the 21st of May')).toEqual(['the', 'twenty', 'first', 'of', 'may'])
    expect(words('a hundred and five')).toEqual(['a', 'hundred', 'five'])
    expect(words('bread and butter')).toEqual(['bread', 'and', 'butter'])
    expect(words('my favorite color')).toEqual(words('My favourite colour.'))
    expect(numberWords(105)).toEqual(['one', 'hundred', 'five'])
    expect(numberWords(1990)).toEqual(['one', 'thousand', 'nine', 'hundred', 'ninety'])
  })

  it('checks a dictation without case / punctuation, with one-letter typos in long words', () => {
    expect(dictationMatches('are you ready', 'Are you ready?')).toBe(true)
    expect(dictationMatches('I am not sure', "I'm not sure.")).toBe(true)
    expect(dictationMatches('I am 21 years old', "I'm twenty-one years old.")).toBe(true)
    expect(dictationMatches('She is beautifull', 'She is beautiful.')).toBe(true)
    expect(dictationMatches('a ship', 'a sheep')).toBe(false)
    expect(dictationMatches('are you', 'Are you ready?')).toBe(false)
    expect(dictationMatches('are you ready now', 'Are you ready?')).toBe(false)
    expect(dictationMatches('', 'Are you ready?')).toBe(false)
    expect(dictationMatches('I am twenty one', "I'm 21 years old.", ['I am twenty-one.'])).toBe(true)
  })

  it('compares speech word by word: homophones are fine, misses are marked', () => {
    const ok = judgeSpeech('Nice to meet you.', ['nice two meat you'])
    expect(ok.passed).toBe(true)
    expect(ok.words.every((w) => w.ok)).toBe(true)
    const miss = judgeSpeech('I live in a big house.', ['I leave in a big house'])
    expect(miss.passed).toBe(true)
    expect(miss.words.map((w) => w.ok)).toEqual([true, false, true, true, true, true])
    expect(miss.words[1]).toEqual({ text: 'live', ok: false, heard: 'leave' })
    const fail = judgeSpeech('Nice to meet you.', ['nice to'])
    expect(fail.passed).toBe(false)
    expect(fail.score).toBe(0.5)
    expect(judgeSpeech('Nice to meet you.', []).passed).toBe(false)
    // the best alternative wins
    expect(judgeSpeech('Thank you.', ['tank you', 'thank you']).transcript).toBe('thank you')
    const c = compareWords('a cat', 'a big cat')
    expect(c.extra).toEqual(['big'])
  })

  it('gives IPA and sound hints for missed words', () => {
    const v = judgeSpeech('Nice to meet you.', ['nice to'])
    const hints = speechHints(v, { text: 'Nice to meet you.', ipa: '/naɪs tə miːt juː/', tip: 'tip!' })
    expect(hints[0]).toBe('tip!')
    expect(hints).toContain('«meet» — /miːt/')
    expect(hints.some((h) => h.includes('/iː/'))).toBe(true)
    expect(hints.length).toBeLessThanOrEqual(3)
    expect(speechHints(judgeSpeech('think', ['sink']), { text: 'think', ipa: null, tip: null })).toContainEqual(expect.stringMatching(/^th/))
    expect(speechHints(judgeSpeech('hi', ['hi']), { text: 'hi', ipa: null, tip: null })).toEqual([])
  })

  it('grades listening, pairs and never speaking as a quiz', () => {
    expect(gradeQuiz(unit<'quiz'>('en-a1-hello-l01'), { chosen: ['b'] })).toBe(true)
    expect(gradeQuiz(unit<'quiz'>('en-a1-hello-l01'), { chosen: ['a'] })).toBe(false)
    expect(gradeQuiz(unit<'quiz'>('en-a1-hello-l02'), { chosen: [], text: 'i am 21 years old' })).toBe(true)
    expect(gradeQuiz(unit<'quiz'>('en-a1-hello-l02'), { chosen: [], text: 'i am 20 years old' })).toBe(false)
    expect(gradeQuiz(unit<'quiz'>('en-a1-hello-p01'), { chosen: ['b'] })).toBe(true)
    expect(gradeQuiz(unit<'quiz'>('en-a1-hello-p01'), { chosen: ['a'] })).toBe(false)
    expect(gradeQuiz(unit<'quiz'>('en-a1-hello-s01'), { chosen: ['Nice to meet you.'], text: 'Nice to meet you.' })).toBe(false)
  })

  it('ships no answer key or transcript in graded payloads', () => {
    for (const id of ['en-a1-hello-l01', 'en-a1-hello-l02', 'en-a1-hello-p01']) {
      const payload = JSON.stringify(gradedQuiz(unit<'quiz'>(id)))
      expect(payload).not.toMatch(/meet|years|sheep|correct/i)
    }
    const dictation = unit<'quiz'>('en-a1-hello-l02')
    const key = quizKey(dictation)
    expect(key.free).toBe("I'm 21 years old.")
    expect(key.accept).toEqual(['I am twenty-one.'])
    expect(gradeWithKey(quizShape(dictation), key, { chosen: [], text: 'I am twenty one' })).toBe(true)
  })
})

describe('language course: compile, path, placement, validation', () => {
  it('maps blocks to exercise kinds and keeps [!speak] out of tests', () => {
    expect(CourseBundleSchema.safeParse(bundle).success).toBe(true)
    const kind = (id: string) => bundle.exercises[id]!.kind
    expect([kind('en-a1-hello-w01'), kind('en-a1-hello-l01'), kind('en-a1-hello-p01'), kind('en-a1-hello-s01'), kind('en-a1-hello-q01')]).toEqual(['word', 'listen', 'pair', 'speak', 'quiz'])
    const a1 = bundle.sections[0]!.topics[0]!
    expect(a1.number).toBe(101)
    expect(a1.level).toBe('A1')
    expect(a1.test!.pool).not.toContain('en-a1-hello-s01')
    expect(a1.test!.pool).toEqual(expect.arrayContaining(['en-a1-hello-l01', 'en-a1-hello-l02', 'en-a1-hello-p01', 'en-a1-hello-q01']))
    // speak still has a lesson
    expect(a1.lessons.some((l) => l.items.some((i) => i.id === 'en-a1-hello-s01'))).toBe(true)
    expect(bundle.course.target).toBe('en')
    expect(bundle.course.levels).toEqual(['A1', 'A2', 'B1'])
    expect(bundle.stats.words).toBe(2)
    expect(bundle.stats.byLevel).toMatchObject({ A1: 10, A2: 4 })
    expect(Object.keys(bundle.stats.byLevel)).not.toContain('noob')
  })

  it('builds placement over CEFR with listening items but no dictation or speaking', () => {
    const pool = bundle.placement.pool
    expect(pool.A1).toEqual(expect.arrayContaining(['en-a1-hello-l01', 'en-a1-hello-l03', 'en-a1-hello-p01']))
    expect(pool.A1).not.toContain('en-a1-hello-l02')
    expect(pool.A1).not.toContain('en-a1-hello-s01')
    expect(pool.A2).toEqual(expect.arrayContaining(['en-a2-past-l01', 'en-a2-past-q01']))
    expect(pool.B1 ?? []).toEqual([])
    expect(placementCandidates(bundle, 'seed').length).toBeGreaterThan(0)
    expect(startSection(bundle, 'A1').id).toBe('english-test:a2')
    expect(sectionForLevel(bundle, 'A2').id).toBe('english-test:a2')
    expect(sectionForLevel(bundle, 'A1').id).toBe('english-test:a1')
    // planned sections are never a start section
    expect(startSection(bundle, 'C2').id).toBe('english-test:a2')
  })

  it('shows planned sections as «скоро»: locked, empty, no errors', () => {
    const b1 = bundle.sections[2]!
    expect(b1).toMatchObject({ status: 'planned', topics: [], exam: null, level: 'B1' })
    const view = buildCoursePath(bundle, 'A1', { lessons: new Set(), studied: new Set(), tests: new Map(), exams: new Map() })
    expect(view.sections[2]).toMatchObject({ planned: true, state: 'locked', total: 0 })
    expect(view.current?.sectionId).toBe('english-test:a1')
    const check = checkCourse(readFileSync(path.join(vaultPath, 'Courses/english-test/course.yaml'), 'utf8'), snap)
    const errors = check.issues.filter((i) => i.severity === 'error' && i.code !== 'content')
    expect(errors).toEqual([])
    // words count as cards; listening and speaking counted for language topics
    const minimum = check.issues.find((i) => i.code === 'minimum' && i.where === 'english-test:a1:en-a1-hello')
    expect(minimum?.message).toMatch(/картки \(слова\) 2\/6/)
    expect(minimum?.message).not.toMatch(/аудіювання|вимова/)
    // no thin-placement warning for planned B1…C2
    expect(check.issues.find((i) => i.code === 'thin-placement')).toBeUndefined()
  })
})

describe('speech helpers and badges', () => {
  it('chooses the voice language and the best system voice', () => {
    expect(voiceLang('en', 'en-US')).toBe('en-US')
    expect(voiceLang('en')).toBe('en-GB')
    expect(voiceLang('de')).toBe('de-DE')
    expect(voiceLang('pt-BR')).toBe('pt-BR')
    const voices = [
      { name: 'Albert', lang: 'en-US' },
      { name: 'Daniel', lang: 'en-GB' },
      { name: 'Google UK English Female', lang: 'en-GB' },
      { name: 'Samantha', lang: 'en-US' },
      { name: 'Anna', lang: 'de-DE' },
    ]
    expect(pickVoice(voices, 'en-GB')!.name).toBe('Google UK English Female')
    expect(pickVoice(voices, 'en-US')!.name).toBe('Samantha')
    expect(pickVoice(voices, 'en-AU')!.lang.startsWith('en')).toBe(true)
    expect(pickVoice(voices, 'fr-FR')).toBeNull()
    expect(pickVoice(voices, 'en-GB', 'Google UK English Female')!.name).toBe('Daniel')
  })

  it('counts due words and open listening / minimal-pair mistakes of the course', () => {
    const rows = { due: ['en-a1-hello-w01', 'en-a1-hello-q01'], mistakes: ['en-a1-hello-l01', 'en-a1-hello-p01', 'en-a1-hello-q02'] }
    const metas = new Map([...snap.units].map(([id, u]) => [id, unitMeta(u)]))
    expect(languageCounts(rows, metas, null)).toEqual({ [WORDS_KEY]: 1, [LISTEN_KEY]: 1, [PRON_KEY]: 1 })
    expect(languageCounts(rows, metas, new Set(['en-a1-hello-q01']))).toEqual({ [WORDS_KEY]: 0, [LISTEN_KEY]: 0, [PRON_KEY]: 0 })
  })
})
