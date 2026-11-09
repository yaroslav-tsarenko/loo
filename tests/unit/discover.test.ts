import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
import { LinkIndex } from '@/content/links'
import type { Chapter, FlashcardUnit, TreeNode } from '@/content/model'
import { loadSnapshot, type FullSnapshot } from '@/content/store'
import { parseName, titleFrom } from '@/content/discover/names'
import { similarity } from '@/content/ids'

const vaultPath = path.resolve(__dirname, '../fixtures/vault')
let snap: FullSnapshot

beforeAll(async () => {
  snap = await loadSnapshot({ vaultPath, guidesDir: 'Guides' }, new Map(), 1)
})

function titles(nodes: TreeNode[], depth = 0): string[] {
  return nodes.flatMap((n) =>
    n.kind === 'chapter' ? [`${'  '.repeat(depth)}${snap.chapters.get(n.id)!.title}`] : [`${'  '.repeat(depth)}[${n.title}]`, ...titles(n.children, depth + 1)],
  )
}

describe('names', () => {
  it('parses numbered names and strips guide prefixes', () => {
    expect(parseName('PostgreSQL - 09. Індекси', 'PostgreSQL')).toEqual({ number: 9, rest: 'Індекси' })
    expect(parseName('04 - Null safety', 'Kotlin')).toEqual({ number: 4, rest: 'Null safety' })
    expect(parseName('State - A Components Memory', 'React')).toEqual({ number: null, rest: 'State - A Components Memory' })
    expect(titleFrom('Kotlin - основи від нуля', 'Kotlin - основи від нуля', 'Kotlin')).toBe('Основи від нуля')
  })
})

describe('guide discovery', () => {
  it('finds all guides, ordering by explicit order then title', () => {
    expect(snap.guides.map((g) => g.id)).toEqual(['bank', 'docs', 'flat', 'nested'])
    expect(snap.guideById.get('bank')!.title).toBe('Bank Q&A')
  })

  it('orders flat chapters by number, keeps index out of the tree', () => {
    const flat = snap.guideById.get('flat')!
    expect(titles(flat.tree)).toEqual(['Перший', 'Другий розділ', 'Senior interview Q&A'])
    expect(snap.chapters.get(flat.indexChapterId!)!.kind).toBe('index')
    expect(flat.description).toBe('Плаский посібник для тестів.')
  })

  it('builds nested parts with folder notes as overviews', () => {
    const nested = snap.guideById.get('nested')!
    expect(titles(nested.tree)).toEqual(['Огляд курсу', '[Start]', '  Що таке', '  Налаштування', '[Core]', '  Типи', '  [Просунуте]', '    Generics'])
    const advanced = (nested.tree[2] as Extract<TreeNode, { kind: 'group' }>).children[1] as Extract<TreeNode, { kind: 'group' }>
    expect(advanced.overviewId).toBeTruthy()
    expect(snap.chapters.get(advanced.overviewId!)!.slug).toEqual(['02-core', 'advanced'])
    expect(nested.chapterIds.map((id) => snap.chapters.get(id)!.title)).toContain('Просунуте')
  })

  it('creates unique slugs and resolves prerequisites and frontmatter', () => {
    const second = [...snap.chapters.values()].find((c) => c.title === 'Другий розділ') as Chapter
    const first = [...snap.chapters.values()].find((c) => c.title === 'Перший') as Chapter
    expect(second).toMatchObject({ level: 'middle', estimatedMinutes: 7 })
    expect(second.prerequisites).toEqual([first.id])
    const slugs = [...snap.chapters.values()].map((c) => `${c.guideId}/${c.slug.join('/')}`)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('records backlinks and broken links', () => {
    const first = [...snap.chapters.values()].find((c) => c.title === 'Перший')!
    const second = [...snap.chapters.values()].find((c) => c.title === 'Другий розділ')!
    expect(snap.backlinks.get(second.id)).toContain(first.id)
    expect(snap.issues.some((i) => i.code === 'broken-link' && i.message.includes('Не існує'))).toBe(true)
    expect(snap.issues.some((i) => i.message.includes('not a link'))).toBe(false)
  })
})

describe('units across sources', () => {
  it('merges questions.json without overriding markdown', () => {
    expect((snap.units.get('bk-01-001') as FlashcardUnit).questionText).toBe('Яка різниця між == і ===?')
    const fromJson = snap.units.get('bk-01-099') as FlashcardUnit
    expect(fromJson).toMatchObject({ origin: 'json', level: 'middle', frequency: 'рідко' })
    expect(snap.chapters.get(fromJson.chapterId)!.title).toBe('Основи')
    expect(snap.units.get('bk-02-001')!.chapterId).toBe(snap.guideById.get('bank')!.indexChapterId)
  })

  it('extracts every unit type from the bank chapter', () => {
    const kinds = [...snap.units.values()].filter((u) => u.guideId === 'bank').map((u) => u.kind)
    expect(kinds.filter((k) => k === 'flashcard')).toHaveLength(6)
    expect(kinds.filter((k) => k === 'quiz')).toHaveLength(3)
    expect(kinds.filter((k) => k === 'task')).toHaveLength(1)
  })

  it('uses heading Q&A for files named like interview banks', () => {
    const qa = [...snap.units.values()].filter((u) => u.guideId === 'flat')
    expect(qa.map((u) => u.id)).toContain('flat-qa-001')
    expect(qa).toHaveLength(2)
  })
})

describe('link index', () => {
  const index = new LinkIndex(
    ['Guides/A/Зміст.md', 'Guides/B/Зміст.md', 'Guides/A/Sub/Note.md', 'Guides/B/Note.md', 'Other/Free.md', 'Guides/A/img.png'],
    ['Guides/A/Зміст.md', 'Guides/B/Зміст.md', 'Guides/A/Sub/Note.md', 'Guides/B/Note.md'],
  )
  it('prefers the nearest file with the same name', () => {
    expect(index.resolve('Зміст', 'Guides/B/x.md')).toEqual({ kind: 'guide-file', path: 'Guides/B/Зміст.md' })
    expect(index.resolve('Note', 'Guides/A/Sub/y.md')).toEqual({ kind: 'guide-file', path: 'Guides/A/Sub/Note.md' })
  })
  it('resolves full paths, outside notes, assets and misses', () => {
    expect(index.resolve('Guides/B/Note', 'Guides/A/x.md')).toEqual({ kind: 'guide-file', path: 'Guides/B/Note.md' })
    expect(index.resolve('Free', 'Guides/A/x.md')).toEqual({ kind: 'vault-file', path: 'Other/Free.md' })
    expect(index.resolve('img.png', 'Guides/A/x.md')).toEqual({ kind: 'vault-file', path: 'Guides/A/img.png' })
    expect(index.resolve('Nope', 'Guides/A/x.md')).toEqual({ kind: 'missing' })
  })
})

describe('similarity', () => {
  it('scores near-identical questions high', () => {
    expect(similarity('Як працює event loop у браузері?', 'Як працює event loop в браузері?')).toBeGreaterThan(0.85)
    expect(similarity('Що таке замикання?', 'Як працює CORS?')).toBeLessThan(0.4)
  })
})
