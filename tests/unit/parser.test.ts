import { describe, expect, it } from 'vitest'
import type { Root } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { extractFile } from '@/content/parse/extract'
import { parseMarkdown } from '@/content/parse/markdown'
import type { Callout } from '@/content/parse/nodes'
import { scanFile } from '@/content/parse/scan'
import { unitCalloutTypes } from '@/content/blocks/registry'
import type { FlashcardUnit, QuizUnit, TaskUnit } from '@/content/model'

function parse(md: string) {
  return parseMarkdown(md)
}

function extract(md: string, fileName = 'Test - 01. Файл') {
  const { root, meta } = parse(md)
  return extractFile({ root, meta, guideId: 'g', chapterId: 'g/ch', path: `Guides/G/${fileName}.md`, fileName })
}

function find<T>(root: Root, type: string): T[] {
  const out: T[] = []
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const n = node as { type?: string; children?: unknown[] }
    if (n.type === type) out.push(node as T)
    n.children?.forEach(walk)
  }
  walk(root)
  return out
}

describe('frontmatter', () => {
  it('normalizes known fields and ignores junk', () => {
    const { meta } = parse('---\ntitle: Замикання\norder: "4"\nlevel: Tech Lead\ntags: [a, "#b"]\nprerequisites:\n  - "[[X]]"\nestimatedMinutes: 35\nfoo: bar\n---\n# H')
    expect(meta).toMatchObject({ title: 'Замикання', order: 4, level: 'techlead', tags: ['a', 'b'], prerequisites: ['[[X]]'], estimatedMinutes: 35 })
  })

  it('reports broken yaml without throwing', () => {
    const r = parse('---\ntitle: Асинхронність: Promise\n---\ntext')
    expect(r.metaError).toBeTruthy()
    expect(r.meta.tags).toEqual([])
  })
})

describe('callouts', () => {
  it('parses type, fold state and inline title', () => {
    const { root } = parse('> [!warning]- Обережно з `this`\n> Тіло\n\n> [!tip]+\n> Порада\n\n> [!note]\n> Просто')
    const callouts = find<Callout>(root, 'callout')
    expect(callouts.map((c) => [c.calloutType, c.fold])).toEqual([
      ['warning', 'closed'],
      ['tip', 'open'],
      ['note', null],
    ])
    expect(toString({ type: 'paragraph', children: callouts[0]!.title })).toBe('Обережно з this')
    expect(toString(callouts[0]!.children[0]!)).toBe('Тіло')
    expect(callouts[1]!.title).toEqual([])
  })

  it('keeps the second line of the header paragraph as body', () => {
    const { root } = parse('> [!question]- Питання?\n> *часто · теорія* · `x-1`\n>\n> Відповідь')
    const [c] = find<Callout>(root, 'callout')
    expect(toString(c!.children[0]!)).toBe('часто · теорія · x-1')
    expect(toString(c!.children[1]!)).toBe('Відповідь')
  })

  it('handles nested callouts', () => {
    const { root } = parse('> [!task] Задача\n> Умова\n>\n> > [!hint]- Підказка\n> > Текст')
    const callouts = find<Callout>(root, 'callout')
    expect(callouts.map((c) => c.calloutType)).toEqual(['task', 'hint'])
  })

  it('leaves plain blockquotes alone', () => {
    const { root } = parse('> Цитата [!not]')
    expect(find(root, 'callout')).toHaveLength(0)
    expect(find(root, 'blockquote')).toHaveLength(1)
  })
})

describe('inline obsidian syntax', () => {
  it('parses wiki-links with alias, heading and embeds', () => {
    const { root } = parse('[[A]] [[B|бе]] [[C#Розділ]] [[#Локальний]] ![[D]] ![[img.png|300]]')
    const links = find<{ target: string; alias: string | null; heading: string | null; embed: boolean; width: number | null }>(root, 'wikiLink')
    expect(links.map((l) => [l.target, l.alias, l.heading, l.embed, l.width])).toEqual([
      ['A', null, null, false, null],
      ['B', 'бе', null, false, null],
      ['C', null, 'Розділ', false, null],
      ['', null, 'Локальний', false, null],
      ['D', null, null, true, null],
      ['img.png', null, null, true, 300],
    ])
  })

  it('ignores wiki-links in code', () => {
    const { root } = parse('`[[inline]]`\n\n```js\nconst a = [[1]]\n```')
    expect(find(root, 'wikiLink')).toHaveLength(0)
  })

  it('parses tags, highlights and strips comments', () => {
    const { root } = parse('Текст #js/core і ==важливо== %%секрет%% #123 C#')
    expect(find<{ value: string }>(root, 'tag').map((t) => t.value)).toEqual(['js/core'])
    expect(find(root, 'mark')).toHaveLength(1)
    expect(toString(root)).not.toContain('секрет')
  })

  it('turns id comments into markers', () => {
    const { root } = parse('## Питання\n%% id: qa-7 %%\n\nВідповідь')
    expect(find<{ value: string }>(root, 'idMarker')[0]?.value).toBe('qa-7')
  })
})

describe('flashcards', () => {
  const md = `## 🟢 Junior

> [!question]- Яка різниця між \`==\` і \`===\`?
> *дуже часто · порівняння* · \`js-01-003\`
>
> Відповідь.

## 🟣 Tech Lead

> [!question]- Як вибрати стратегію?
> *рідко · практика*
>
> Залежить.

## Інше

> [!question] Без рівня
> level: senior · id: q-3
>
> Текст`

  it('extracts meta, level from heading and explicit id', () => {
    const result = extract(md)
    const [a, b, c] = result.units as FlashcardUnit[]
    expect(a).toMatchObject({ id: 'js-01-003', level: 'junior', frequency: 'дуже часто', qtype: 'порівняння', idSource: 'explicit', questionText: 'Яка різниця між == і ===?' })
    expect(b).toMatchObject({ level: 'techlead', frequency: 'рідко', qtype: 'практика', idSource: 'hash' })
    expect(c).toMatchObject({ id: 'q-3', level: 'senior' })
    expect(result.issues.filter((i) => i.code === 'missing-id')).toHaveLength(1)
  })

  it('replaces unit callouts with references and strips emoji from level headings', () => {
    const result = extract(md)
    expect(find(result.root, 'unitRef')).toHaveLength(3)
    expect(result.headings.map((h) => h.text)).toEqual(['Junior', 'Tech Lead', 'Інше'])
  })

  it('keeps hash ids stable when only the answer changes', () => {
    const a = extract(md).units[1]!.id
    const b = extract(md.replace('Залежить.', 'Залежить від контексту і команди.')).units[1]!.id
    const c = extract(md.replace('Як вибрати стратегію?', 'Як обрати стратегію?')).units[1]!.id
    expect(a).toBe(b)
    expect(a).not.toBe(c)
    expect(a).toMatch(/^h:[0-9a-f]{10}$/)
  })
})

describe('quiz', () => {
  it('parses single, multi and output quizzes', () => {
    const result = extract(`> [!quiz] Що поверне \`typeof null\`?
> level: junior · id: q1
> - [ ] "null"
> - [x] "object"
>
> **Пояснення:** баг.

> [!quiz] Оберіть усі
> id: q2
> - [x] a
> - [x] b
> - [ ] c

> [!quiz] Що виведе код?
> level: middle · type: output · id: q3
>
> \`\`\`js
> console.log(1)
> \`\`\`
>
> **Відповідь:** \`1\``)
    const [q1, q2, q3] = result.units as QuizUnit[]
    expect(q1).toMatchObject({ id: 'q1', mode: 'single', level: 'junior' })
    expect(q1!.options.map((o) => o.correct)).toEqual([false, true])
    expect(toString(q1!.explanation!)).toBe('баг.')
    expect(q2!.mode).toBe('multi')
    expect(q3).toMatchObject({ mode: 'output', freeAnswer: '1', options: [] })
    expect(q3!.body.children[0]!.type).toBe('code')
  })

  it('flags quizzes without a correct option', () => {
    const result = extract('> [!quiz] Питання\n> id: q9\n> - [ ] a\n> - [ ] b')
    expect(result.issues.some((i) => i.code === 'quiz-no-correct')).toBe(true)
  })
})

describe('task', () => {
  it('collects hints in order and the solution', () => {
    const result = extract(`> [!task] Реалізуй \`once\`
> level: middle · difficulty: hard · id: t1 · tags: closures, fp
>
> Умова.
>
> > [!hint]- Підказка 1
> > Перша
>
> > [!hint]- Підказка 2
> > Друга
>
> > [!solution]- Рішення
> > Код`)
    const [t] = result.units as TaskUnit[]
    expect(t).toMatchObject({ id: 't1', difficulty: 'hard', level: 'middle', tags: ['closures', 'fp'], titleText: 'Реалізуй once' })
    expect(t!.hints.map((h) => toString(h))).toEqual(['Перша', 'Друга'])
    expect(toString(t!.solution!)).toBe('Код')
    expect(toString(t!.statement)).toBe('Умова.')
  })
})

describe('heading Q&A files', () => {
  it('turns H2 sections into flashcards and skips sources', () => {
    const result = extract('# X\n\n## 1. Що таке MVCC?\n%% id: pg-1 %%\n\nВерсії.\n\n## 2. Друге?\n\nТекст.\n\n## Джерела\n\n- a', 'PostgreSQL - 25. Senior interview Q&A')
    const units = result.units as FlashcardUnit[]
    expect(units.map((u) => [u.id.startsWith('h:') ? 'hash' : u.id, u.questionText, u.level])).toEqual([
      ['pg-1', 'Що таке MVCC?', 'senior'],
      ['hash', 'Друге?', 'senior'],
    ])
  })

  it('does not apply heading mode to ordinary chapters', () => {
    expect(extract('## Розділ\n\nТекст', 'Node.js - 04. Event loop').units).toHaveLength(0)
  })
})

describe('light scan', () => {
  it('ignores fenced code, finds h1, lead, links and unit callouts', () => {
    const info = scanFile('---\ntags: [x]\n---\n# PostgreSQL - 09. Індекси\n\n> Перший абзац.\n\n```sql\n[[fake]]\n# not heading\n```\n\n[[Real]] `[[code]]` #tag\n\n> [!quiz] Q\n> - [x] a', unitCalloutTypes())
    expect(info.h1).toBe('PostgreSQL - 09. Індекси')
    expect(info.lead).toBe('Перший абзац.')
    expect(info.links.map((l) => l.target)).toEqual(['Real'])
    expect(info.tags.sort()).toEqual(['tag', 'x'])
    expect(info.codeBlocks).toBe(1)
    expect(info.hasUnitCallouts).toBe(true)
  })
})
