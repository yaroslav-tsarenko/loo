import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { CourseBundleSchema, placementResult, placementTest, rng, type CourseBundle, type Level, type PlacementAnswer, type PlacementOptions } from '@/course'

// English placement replay (docs/NEXTJS_SYLLABUS.md §7, test 2): skills as course data must not change the English
// placement test. Synthetic learners (a true level, per-skill offsets, a «Не знаю» habit) answer the real compiled bank;
// the questions asked and the result must be the ones the base commit (76dcf19) produced — the fixture stores a sha256
// of each run plus its level and question count. GOLDEN_WRITE=1 rewrites it.

const FIXTURE = path.join(__dirname, 'fixtures', 'placement-replay.json')
const bundle: CourseBundle = CourseBundleSchema.parse(JSON.parse(readFileSync(path.resolve(__dirname, '../../content/courses/english-a1-c2.json'), 'utf8')))
const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

interface Run {
  sha256: string
  level: Level
  asked: number
}

function simulate(trueRank: number, k: number, opts: PlacementOptions): { ids: string[]; result: unknown } {
  const r = rng(`replay|${trueRank}|${k}|${opts.followUp ? 1 : 0}`)
  const offsets: Record<string, number> = { grammar: (r() - 0.5) * 1.2, vocabulary: (r() - 0.5) * 1.2, reading: (r() - 0.5) * 1.2, listening: (r() - 0.5) * 1.2 }
  const dontKnowRate = k % 3 === 0 ? 0.3 : 0
  const answers: PlacementAnswer[] = []
  const seed = `user-${k}:placement:n${trueRank}`
  for (let i = 0; i < 80; i++) {
    const step = placementTest(bundle, answers, seed, opts)
    if (step.done || !step.next) break
    const item = bundle.placement.bank![step.next]!
    const theta = trueRank + 0.5 + (offsets[item.skill] ?? 0)
    const b = CEFR.indexOf(item.level as (typeof CEFR)[number]) + 0.25 + 0.3 * (item.diff - 2)
    const p = 0.25 + 0.75 / (1 + Math.exp(-2.77 * (theta - b)))
    const right = r() < p
    if (!right && r() < dontKnowRate) answers.push({ exerciseId: step.next, correct: false, dontKnow: true })
    else answers.push({ exerciseId: step.next, correct: right })
  }
  return { ids: answers.map((a) => `${a.exerciseId}${a.dontKnow ? '?' : a.correct ? '+' : '-'}`), result: placementResult(bundle, answers) }
}

function runs(): Record<string, Run> {
  const out: Record<string, Run> = {}
  for (let trueRank = -1; trueRank <= 6; trueRank++) {
    for (let k = 0; k < 6; k++) {
      for (const followUp of [false, true]) {
        const { ids, result } = simulate(trueRank, k, { followUp })
        const json = JSON.stringify({ ids, result })
        out[`${trueRank}:${k}:${followUp ? 'f' : 'm'}`] = { sha256: createHash('sha256').update(json).digest('hex'), level: (result as { level: Level }).level, asked: ids.length }
      }
    }
  }
  return out
}

describe('English placement replay', () => {
  it('asks the same questions and gives the same results as before', () => {
    expect(bundle.placement.bank).toBeDefined()
    const now = runs()
    if (process.env.GOLDEN_WRITE === '1') writeFileSync(FIXTURE, `${JSON.stringify(now, null, 1)}\n`)
    const before = JSON.parse(readFileSync(FIXTURE, 'utf8')) as Record<string, Run>
    expect(Object.keys(now).length).toBe(96)
    expect(now).toEqual(before)
  })
})
