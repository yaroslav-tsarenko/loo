import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadSnapshot } from '@/content/store'

describe('chapter slug', () => {
  it('uses frontmatter `slug:` when present, the file name otherwise', async () => {
    const snap = await loadSnapshot({ vaultPath: path.resolve(__dirname, '../fixtures/slug-vault'), guidesDir: 'Guides' }, new Map(), 1)
    const byTitle = new Map([...snap.chapters.values()].map((c) => [c.title, c.slug.join('/')]))
    expect(byTitle.get('Перша тема')).toBe('01-first-topic')
    expect(byTitle.get('Друга тема')).toBe('02-друга-тема')
  })
})
