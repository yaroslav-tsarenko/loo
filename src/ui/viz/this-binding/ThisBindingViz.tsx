'use client'

import { AnimatePresence, m } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { ConsolePanel, Panel, SPRING, VizGlyph } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { FIRST, PRESETS, QUESTIONS, RESULTS, isResult, type QuestionId, type ResultId } from './rules'
import { thisScenarios, type ThisFrame } from './scenarios'

type Answers = Partial<Record<QuestionId, boolean>>

function walk(answers: Answers): { path: QuestionId[]; result: ResultId | null } {
  const path: QuestionId[] = []
  let node: QuestionId | ResultId = FIRST
  while (!isResult(node)) {
    path.push(node)
    const answer: boolean | undefined = answers[node]
    if (answer === undefined) return { path, result: null }
    node = answer ? QUESTIONS[node].yes : QUESTIONS[node].no
  }
  return { path, result: node }
}

function RulesTree() {
  const [answers, setAnswers] = useState<Answers>({})
  const [preset, setPreset] = useState<number | null>(null)
  const { path, result } = walk(answers)
  const outcome = result ? RESULTS[result] : null

  const answer = (q: QuestionId, value: boolean) => {
    const next: Answers = {}
    for (const id of path) {
      if (id === q) break
      next[id] = answers[id]
    }
    next[q] = value
    setAnswers(next)
    setPreset(null)
  }

  return (
    <div className="viz-rules">
      <div className="viz-presets" role="group" aria-label="Приклади викликів">
        <span className="viz-presets-label">Приклад:</span>
        {PRESETS.map((p, i) => (
          <button
            key={p.code}
            type="button"
            className="viz-chip viz-chip-code"
            aria-pressed={preset === i}
            onClick={() => {
              setAnswers(p.answers)
              setPreset(i)
            }}
          >
            <code>{p.code}</code>
          </button>
        ))}
      </div>
      <ol className="viz-tree">
        <AnimatePresence initial={false}>
          {path.map((q, i) => {
            const value = answers[q]
            return (
              <m.li key={q} className="viz-tree-node" data-answered={value !== undefined ? '' : undefined} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0, transition: { ...SPRING, delay: preset !== null ? i * 0.08 : 0 } }} exit={{ opacity: 0, y: -6 }}>
                <span className="viz-tree-q">
                  <span className="viz-tree-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  {QUESTIONS[q].text}
                </span>
                <span className="viz-tree-answers" role="group" aria-label={QUESTIONS[q].text}>
                  <button type="button" className="viz-yn" data-yes="" aria-pressed={value === true} onClick={() => answer(q, true)}>
                    Так
                  </button>
                  <button type="button" className="viz-yn" aria-pressed={value === false} onClick={() => answer(q, false)}>
                    Ні
                  </button>
                </span>
              </m.li>
            )
          })}
        </AnimatePresence>
      </ol>
      <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {outcome ? (
            <m.div key={outcome.id + String(preset)} className="viz-result" initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1, transition: { ...SPRING, delay: preset !== null ? path.length * 0.08 : 0 } }} exit={{ opacity: 0, y: -6 }}>
              <div className="viz-result-head">
                <span className="viz-result-emoji" aria-hidden="true">
                  <VizGlyph icon={outcome.icon} size={28} />
                </span>
                <div>
                  <div className="viz-result-title">{outcome.title}</div>
                  <div className="viz-result-value">
                    this = <code>{preset !== null ? PRESETS[preset]!.thisValue : outcome.value}</code>
                  </div>
                </div>
              </div>
              <p>{outcome.explain}</p>
              <pre className="viz-snippet">
                <code>{outcome.example}</code>
              </pre>
            </m.div>
          ) : (
            <m.p key="hint" className="viz-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Відповідай на питання згори вниз — порядок і є пріоритетом правил.
            </m.p>
          )}
        </AnimatePresence>
      </div>
      <div className="viz-row">
        <span className="viz-muted">Пріоритет: стрілка → new → call/apply/bind → obj.fn() → звичайний виклик</span>
        <button
          type="button"
          className="viz-btn viz-btn-text"
          onClick={() => {
            setAnswers({})
            setPreset(null)
          }}
          aria-label="Почати спочатку"
        >
          <RotateCcw size={16} strokeWidth={1.8} /> Спочатку
        </button>
      </div>
    </div>
  )
}

function ThisCard({ frame }: { frame: ThisFrame }) {
  return (
    <Panel title="this у цьому виклику" icon="px:target">
      <AnimatePresence mode="wait" initial={false}>
        <m.div key={`${frame.call ?? ''}|${frame.thisValue ?? ''}|${frame.line}`} className="viz-this" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={SPRING}>
          {frame.call ? (
            <>
              <div className="viz-this-row">
                <span className="viz-muted">виклик</span>
                <code>{frame.call}</code>
              </div>
              <div className="viz-this-row">
                <span className="viz-muted">правило</span>
                <span>{frame.rule}</span>
              </div>
              <div className="viz-this-value" data-empty={frame.thisValue === 'undefined' ? '' : undefined}>
                this = <code>{frame.thisValue}</code>
              </div>
            </>
          ) : (
            <p className="viz-muted">Тут немає виклику — this ще не визначено. Він з’являється лише в момент виклику.</p>
          )}
        </m.div>
      </AnimatePresence>
    </Panel>
  )
}

export function ThisBindingViz({ scenario }: VizProps) {
  if (scenario === 'rules' || !thisScenarios[scenario]) return <RulesTree />
  return <StepPlayer scenario={thisScenarios[scenario]!} label="this" side={(f) => <ThisCard frame={f} />} below={(f) => <ConsolePanel lines={f.output} />} />
}
