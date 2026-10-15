import { cpSync, mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { loadSnapshot } from '@/content/store'

const dir = mkdtempSync(path.join(os.tmpdir(), 'vault-'))
cpSync(path.resolve(__dirname, '../../templates/Новий посібник'), path.join(dir, 'Guides', 'Новий посібник'), { recursive: true })

afterAll(() => rmSync(dir, { recursive: true, force: true }))

describe('guide template', () => {
  it('is a valid guide with every unit type and no content issues', async () => {
    const snap = await loadSnapshot({ vaultPath: dir, guidesDir: 'Guides' }, new Map(), 1)
    const guide = snap.guideById.get('new-guide')!
    expect(guide.title).toBe('Новий посібник')
    expect(guide.chapterIds).toHaveLength(2)
    const kinds = [...snap.units.values()].map((u) => u.kind).sort()
    expect(kinds).toEqual(['flashcard', 'flashcard', 'flashcard', 'flashcard', 'flashcard', 'flashcard', 'quiz', 'quiz', 'quiz', 'quiz', 'quiz', 'task', 'task'])
    expect(snap.issues.filter((i) => i.code !== 'missing-id')).toEqual([])
    const second = snap.chapters.get(guide.chapterIds[1]!)!
    expect(second.prerequisites).toEqual([guide.chapterIds[0]])
  })
})
