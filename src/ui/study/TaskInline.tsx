'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { isRunnable } from '@/content/blocks/task/code'
import type { TaskCode } from '@/content/model'
import { finishTask, saveTaskDraft } from '@/server/actions/study'
import { CodeEditor } from '@/ui/code/CodeEditor'
import { runInWorker, type RunHandle, type RunReport } from '@/ui/code/runner'
import { TestReport } from '@/ui/code/TestReport'
import { highlightCode } from '@/ui/code/tokens'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { Tag, tagColor } from '@/ui/Tag'

export interface TaskResult {
  unitId: string
  solved: boolean
  hintsUsed: number
  durationMs: number
}

interface Props {
  unitId: string
  title: ReactNode
  difficulty: string
  difficultyKey: 'easy' | 'medium' | 'hard'
  level: string | null
  statement: ReactNode
  hints: ReactNode[]
  solution: ReactNode
  variant: 'inline' | 'session'
  code?: TaskCode | null
  initialDraft?: string
  initialHints?: number
  initialStatus?: 'open' | 'solved' | 'failed'
  sessionId?: string
  onResult?: (result: TaskResult) => void
}

export function TaskInline(props: Props) {
  const { unitId, title, difficulty, difficultyKey, level, statement, hints, solution, variant, sessionId, onResult, code } = props
  const testable = Boolean(code?.tests) && isRunnable(code?.lang ?? '')
  const starter = code?.starter ?? ''
  const initialDraft = props.initialDraft || starter
  const [revealed, setRevealed] = useState(props.initialHints ?? 0)
  const [draft, setDraft] = useState(initialDraft)
  const [showSolution, setShowSolution] = useState(testable ? props.initialStatus === 'failed' : props.initialStatus !== undefined && props.initialStatus !== 'open')
  const [status, setStatus] = useState<'open' | 'solved' | 'failed'>(props.initialStatus ?? 'open')
  const [report, setReport] = useState<RunReport | null>(null)
  const [running, setRunning] = useState(false)
  const [stuckOn, setStuckOn] = useState<string | null>(null)
  const started = useRef(0)
  useEffect(() => {
    started.current = Date.now()
  }, [])
  const headingId = useId()
  const feedback = useFeedback()
  const saveTimer = useRef<number | null>(null)
  const handle = useRef<RunHandle | null>(null)
  useEffect(() => () => handle.current?.cancel(), [])

  useEffect(() => {
    if (variant !== 'session' && draft === initialDraft && revealed === (props.initialHints ?? 0)) return
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => void saveTaskDraft({ unitId, hintsRevealed: revealed, draft }), 800)
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [draft, revealed, unitId, variant, initialDraft, props.initialHints])

  const assess = (solved: boolean) => {
    if (status !== 'open') return
    setStatus(solved ? 'solved' : 'failed')
    feedback.answer(solved)
    const result: TaskResult = { unitId, solved, hintsUsed: revealed, durationMs: Date.now() - started.current }
    if (onResult) onResult(result)
    else void finishTask({ ...result, sessionId: sessionId ?? null }).then((e) => feedback.effects(e))
  }

  const runTests = () => {
    if (!code?.tests || running) return
    setRunning(true)
    setReport(null)
    setStuckOn(null)
    let current: string | null = null
    const run = runInWorker(draft, code.tests, (event) => {
      if (event.type === 'start') current = event.name
      else if (event.type === 'test') current = null
    })
    handle.current = run
    void run.done.then((result) => {
      if (handle.current !== run) return
      handle.current = null
      setRunning(false)
      setReport(result)
      setStuckOn(result.status === 'timeout' ? current : null)
      if (result.status === 'passed') assess(true)
    })
  }

  const giveUp = () => {
    setShowSolution(true)
    assess(false)
  }

  const retry = () => {
    setStatus('open')
    setShowSolution(false)
    setRevealed(0)
    setReport(null)
    if (testable) setDraft(starter)
    started.current = Date.now()
  }

  const verdict =
    status === 'solved'
      ? testable
        ? `🎉 Усі тести зелені — зараховано${revealed > 0 ? ` · підказок: ${revealed}` : ' без підказок'}!`
        : `Зараховано${revealed > 0 ? ` · підказок: ${revealed}` : ' без підказок'}.`
      : 'Задачу додано в «Мої помилки».'

  return (
    <section className="task" id={variant === 'inline' ? `u-${unitId}` : undefined} data-variant={variant} data-status={status} aria-labelledby={headingId}>
      <header className="task-head">
        <span className="eyebrow">{testable ? 'Задача · з автотестами' : 'Задача'}</span>
        <Tag color={tagColor(difficultyKey)}>{difficulty}</Tag>
        {level ? <Tag>{level}</Tag> : null}
      </header>
      <h3 className="task-title" id={headingId}>
        {title}
      </h3>
      <div className="task-statement prose-flow">{statement}</div>

      {hints.length > 0 ? (
        <div className="task-hints">
          {hints.slice(0, revealed).map((hint, i) => (
            <div className="task-hint" key={i}>
              <span className="eyebrow">Підказка {i + 1}</span>
              <div className="prose-flow">{hint}</div>
            </div>
          ))}
          {revealed < hints.length && !showSolution && status === 'open' ? (
            <button type="button" className="ui-button" data-variant="ghost" onClick={() => setRevealed((n) => n + 1)}>
              {revealed === 0 ? 'Потрібна підказка' : 'Ще підказка'}
              <span className="task-hint-count">
                {revealed + 1} з {hints.length}
              </span>
            </button>
          ) : null}
        </div>
      ) : null}

      {testable && code?.tests ? (
        <div className="task-work">
          <div className="task-code-head">
            <label className="eyebrow" htmlFor={`${headingId}-draft`}>
              Твій код
            </label>
            {starter && draft !== starter && status === 'open' ? (
              <button type="button" className="ui-link task-reset" onClick={() => setDraft(starter)}>
                ↺ До заготовки
              </button>
            ) : null}
          </div>
          <CodeEditor id={`${headingId}-draft`} value={draft} onChange={setDraft} onRun={runTests} label="Твій код" />
          <details className="task-tests">
            <summary>🧪 Тести, які має пройти код</summary>
            <pre className="task-tests-code">{highlightCode(code.tests)}</pre>
          </details>
          <div className="task-actions">
            <button type="button" className="ui-button" onClick={runTests} disabled={running}>
              ▶️ Запустити тести <kbd className="task-run-kbd">⌘↵</kbd>
            </button>
            {status === 'open' ? (
              <button type="button" className="ui-button" data-variant="ghost" onClick={giveUp} disabled={!solution}>
                🏳️ Здаюсь
              </button>
            ) : null}
            {status === 'solved' && solution ? (
              <button type="button" className="ui-button" data-variant="ghost" onClick={() => setShowSolution((v) => !v)}>
                {showSolution ? 'Сховати еталон' : 'Порівняти з еталоном'}
              </button>
            ) : null}
          </div>
          <TestReport report={report} running={running} stuckOn={stuckOn} />
        </div>
      ) : (
        <div className="task-work">
          <label className="eyebrow" htmlFor={`${headingId}-draft`}>
            Ваше рішення
          </label>
          <textarea
            id={`${headingId}-draft`}
            className="task-draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            rows={Math.min(18, Math.max(6, draft.split('\n').length + 1))}
            placeholder="Напишіть рішення тут, потім порівняйте з еталоном"
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault()
                const el = e.currentTarget
                const { selectionStart, selectionEnd } = el
                const next = `${draft.slice(0, selectionStart)}  ${draft.slice(selectionEnd)}`
                setDraft(next)
                requestAnimationFrame(() => el.setSelectionRange(selectionStart + 2, selectionStart + 2))
              }
            }}
          />
          {!showSolution ? (
            <div className="task-actions">
              <button type="button" className="ui-button" onClick={() => setShowSolution(true)} disabled={!solution}>
                Порівняти з рішенням
              </button>
              <span className="unit-meta">{draft.trim() && draft !== starter ? 'Чернетка зберігається автоматично' : 'Спершу спробуйте самі'}</span>
            </div>
          ) : null}
        </div>
      )}

      {showSolution && solution ? (
        <div className="task-compare">
          <div className="task-compare-col">
            <span className="eyebrow">Ваше</span>
            {draft.trim() ? <pre className="task-mine">{draft}</pre> : <p className="unit-meta">Без власної спроби</p>}
          </div>
          <div className="task-compare-col">
            <span className="eyebrow">Еталон</span>
            <div className="prose-flow">{solution}</div>
          </div>
        </div>
      ) : null}

      {status === 'open' && showSolution && !testable ? (
        <div className="task-assess" role="group" aria-label="Самооцінка">
          <span>Вийшло?</span>
          <button type="button" className="ui-button" data-variant="ghost" onClick={() => assess(false)}>
            Ні, не вийшло
          </button>
          <button type="button" className="ui-button" onClick={() => assess(true)}>
            Так, розв’язав
          </button>
        </div>
      ) : null}
      {status !== 'open' && (showSolution || testable) ? (
        <div className="task-verdict-row">
          <p className="task-verdict" role="status">
            {verdict}
          </p>
          {variant === 'inline' ? (
            <button type="button" className="ui-link retry" onClick={retry}>
              Розв’язати ще раз
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
