'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { PiCheckBold, PiCodeBlockFill, PiEarFill, PiExamFill, PiHeadphonesFill, PiListChecksFill, PiMicrophoneFill, PiPuzzlePieceFill, PiTerminalWindowFill, PiXBold } from 'react-icons/pi'
import type { ExerciseView, QuizKey } from '@/content/blocks/quiz/view'
import type { QuizMode } from '@/content/model'
import { answerQuiz, type SpeechResult } from '@/server/actions/answers'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'
import type { Tone } from '@/ui/design/cx'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { DictationInput } from '@/ui/lang/DictationInput'
import { SpeakExercise, type SpeakVerdict, type SpeakView } from '@/ui/lang/SpeakExercise'
import { DEFAULT_SPEECH_LANG } from '@/ui/lang/speech/voices'
import type { Translate } from '@/i18n'
import { useT } from '@/i18n/react'
import { ActionBar, submitLabel } from './ActionBar'
import { LevelPill } from './LevelPill'
import { FillBlanks } from './exercises/FillBlanks'
import { OrderPuzzle } from './exercises/OrderPuzzle'

export interface QuizOptionView {
  id: string
  content: ReactNode
}

// The server's verdict (answerQuiz) or, for practice quizzes with a shipped key, the local one.
export interface QuizVerdict {
  // null: the host doesn't reveal correctness (placement) or the answer wasn't graded (out of hearts)
  correct: boolean | null
  key: QuizKey | null
  explanation: ReactNode
  outOfHearts?: boolean
  // [!speak]: the word-by-word verdict (answerQuiz → speakOutcome)
  speech?: SpeechResult
}

export interface QuizAnswerInput {
  unitId: string
  chosen: string[]
  text: string | null
  durationMs: number
}

export type QuizCheck = (answer: QuizAnswerInput) => Promise<QuizVerdict>

export interface QuizResult extends QuizAnswerInput {
  correct: boolean | null
  verdict: QuizVerdict
}

interface Props {
  unitId: string
  mode: QuizMode
  level: string | null
  multi: boolean
  free: boolean
  prompt: ReactNode
  body: ReactNode
  options: QuizOptionView[]
  // order / fill payload (shuffled view, no answers)
  exercise?: ExerciseView | null
  explanation?: ReactNode
  variant: 'inline' | 'session'
  sessionId?: string
  index?: number
  onResult?: (result: QuizResult) => void
  /** How the answer is graded. Default: answerQuiz as practice (records XP, no hearts). */
  check?: QuizCheck
  /** Where the check button goes (the lesson player's bottom bar). Defaults to in place. */
  actionsSlot?: Element | null
  /** `none`: the host shows the verdict and explanation itself (lesson player sheet). */
  verdict?: 'inline' | 'none'
  /** [!speak]: the phrase to say (mode 'speak'); `lang` — the course's target language (BCP 47 base). */
  speak?: SpeakView | null
  lang?: string | null
  /** single choice: a tap picked this option (not sent yet) — the placement test prefetches its next step */
  onChoose?: (chosen: string[]) => void
}

// `code`: the exercise fence names a programming language (```js order); language courses' sentences: none or ```text
const PLAIN_FENCE = /^(text|txt|plain|plaintext)$/i

function kindOf(mode: QuizMode, free: boolean, multi: boolean, code: boolean, t: Translate): { label: string; tone: Tone; icon: ReactNode } {
  if (mode === 'listen') return { label: free ? t('quiz.kind.dictation') : t('quiz.kind.listening'), tone: 'pink', icon: <PiHeadphonesFill /> }
  if (mode === 'pair') return { label: t('quiz.kind.pair'), tone: 'orange', icon: <PiEarFill /> }
  if (mode === 'speak') return { label: t('quiz.kind.speak'), tone: 'mint', icon: <PiMicrophoneFill /> }
  if (mode === 'order') return { label: code ? t('quiz.kind.orderCode') : t('quiz.kind.order'), tone: 'orange', icon: <PiPuzzlePieceFill /> }
  if (mode === 'fill') return { label: t('quiz.kind.fill'), tone: 'mint', icon: <PiCodeBlockFill /> }
  if (free || mode === 'output') return { label: t('quiz.kind.output'), tone: 'blue', icon: <PiTerminalWindowFill /> }
  if (multi) return { label: t('quiz.kind.multi'), tone: 'pink', icon: <PiListChecksFill /> }
  return { label: t('quiz.kind.single'), tone: 'violet', icon: <PiExamFill /> }
}

type Phase = 'open' | 'checking' | 'done'

export function QuizInline(props: Props) {
  const { unitId, mode, level, multi, free, prompt, body, options, variant, sessionId, onResult, actionsSlot, check } = props
  const showVerdict = props.verdict !== 'none'
  const exercise = props.exercise ?? null
  // [!listen] type: fill arrives as mode 'listen' with a fill exercise
  const interactive = mode === 'order' || mode === 'fill' || exercise !== null
  const [chosen, setChosen] = useState<string[]>([])
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<Phase>('open')
  const [verdict, setVerdict] = useState<QuizVerdict | null>(null)
  const [error, setError] = useState<string | null>(null)
  const started = useRef(0)
  useEffect(() => {
    started.current = Date.now()
  }, [])
  const headingId = useId()
  const feedback = useFeedback()
  const code = Boolean(exercise?.lang && !PLAIN_FENCE.test(exercise.lang))
  const t = useT()
  const kind = kindOf(mode, free, multi, code, t)
  const checked = phase !== 'open'
  const key = verdict?.key ?? null
  const correct = verdict?.correct ?? null

  const finish = (v: QuizVerdict, answer: QuizAnswerInput) => {
    setVerdict(v)
    setPhase('done')
    if (v.correct !== null) feedback.answer(v.correct)
    onResult?.({ ...answer, correct: v.correct, verdict: v })
  }

  const serverCheck: QuizCheck = async (answer) => {
    const out = await answerQuiz({ ...answer, sessionId: sessionId ?? null })
    feedback.effects(out.effects)
    return out
  }

  const submit = async (picked: string[], text: string | null) => {
    if (phase !== 'open') return
    setError(null)
    const answer: QuizAnswerInput = { unitId, chosen: picked, text, durationMs: Date.now() - started.current }
    // the press registers at once (pressed option + tick + haptic tap); the verdict follows from the server
    setPhase('checking')
    feedback.play('tap')
    try {
      finish(await (check ?? serverCheck)(answer), answer)
    } catch {
      setPhase('open')
      setError(t('quiz.checkError'))
    }
  }

  // A tap only selects (and can be changed); the answer button sends it — no instant check on tap.
  const toggle = (id: string) => {
    if (checked) return
    if (multi) setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
    else {
      setChosen((c) => (c[0] === id ? c : [id]))
      props.onChoose?.([id])
    }
    feedback.play('tap')
  }

  const handleKey = (e: { key: string; preventDefault: () => void }) => {
    if (checked || free || interactive) return
    const n = Number(e.key)
    if (n >= 1 && n <= options.length) {
      e.preventDefault()
      toggle(options[n - 1]!.id)
    } else if (e.key === 'Enter' && chosen.length > 0) {
      e.preventDefault()
      void submit(chosen, null)
    }
  }

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (variant !== 'session') handleKey(e)
  }

  useEffect(() => {
    if (variant !== 'session') return
    const listener = (e: globalThis.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      handleKey(e)
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  })

  const compact = variant === 'inline'
  const dictation = mode === 'listen' && free
  const verdictText =
    mode === 'speak'
      ? correct
        ? t('quiz.speakGood')
        : t('quiz.speakAgain')
      : correct
        ? interactive && code
          ? t('quiz.rightCode')
          : t('quiz.right')
        : dictation
          ? t('quiz.compareText')
          : free && key?.free
            ? t('quiz.wrongFree', { answer: key.free })
            : t('quiz.wrong')

  // [!speak]: the recogniser's alternatives go through the host's check (answerQuiz) as `chosen`
  const speakCheck = async (transcripts: string[], durationMs: number): Promise<SpeakVerdict> => {
    const v = await (check ?? serverCheck)({ unitId, chosen: transcripts, text: null, durationMs })
    return { correct: v.correct === true, score: v.speech?.score ?? null, words: v.speech?.words ?? null, hints: v.speech?.hints ?? [], transcript: v.speech?.transcript ?? null, selfAssessed: false }
  }
  const speakDone = (v: SpeakVerdict) => finish({ correct: v.correct, key: null, explanation: v.selfAssessed ? null : props.explanation ?? null }, { unitId, chosen: v.transcript ? [v.transcript] : [], text: null, durationMs: Date.now() - started.current })
  const state = phase === 'checking' ? 'checking' : phase === 'done' ? (correct === null ? 'answered' : correct ? 'correct' : 'wrong') : 'open'

  return (
    <section className="quiz" id={variant === 'inline' ? `u-${unitId}` : undefined} data-variant={variant} data-state={state} aria-labelledby={headingId} aria-busy={phase === 'checking' || undefined} onKeyDown={onKey}>
      <header className="quiz-head">
        <Pill tone={kind.tone} icon={kind.icon} size="sm" className="quiz-kind">
          {kind.label}
        </Pill>
        {level ? <LevelPill level={level} className="quiz-level" /> : null}
      </header>
      <div className="quiz-prompt" id={headingId}>
        {prompt}
      </div>
      {body ? <div className="quiz-body prose-flow">{body}</div> : null}
      {mode === 'speak' && props.speak ? (
        <SpeakExercise lang={props.lang ?? DEFAULT_SPEECH_LANG} spec={props.speak} check={speakCheck} onDone={speakDone} actionsSlot={actionsSlot} locked={phase === 'done'} />
      ) : interactive ? (
        exercise?.kind === 'order' ? (
          <OrderPuzzle exercise={exercise} checked={checked} want={key?.order ?? null} variant={variant} onSubmit={(codes) => void submit(codes, null)} actionsSlot={actionsSlot} />
        ) : exercise?.kind === 'fill' ? (
          <FillBlanks exercise={exercise} checked={checked} answers={key?.blanks ?? null} variant={variant} onSubmit={(values) => void submit(values, null)} actionsSlot={actionsSlot} />
        ) : (
          <p className="unit-meta">{t('quiz.inTests')}</p>
        )
      ) : dictation ? (
        <form
          className="quiz-free"
          onSubmit={(e) => {
            e.preventDefault()
            if (typed.trim()) void submit([], typed)
          }}
        >
          <DictationInput id={`${headingId}-answer`} value={typed} onChange={setTyped} disabled={checked} state={phase === 'done' && correct !== null ? (correct ? 'right' : 'wrong') : undefined} expected={key?.free ?? null} onSubmit={() => void submit([], typed)} lang={props.lang ?? DEFAULT_SPEECH_LANG} />
          {phase !== 'done' ? (
            <ActionBar slot={actionsSlot}>
              <Button type={actionsSlot ? 'button' : 'submit'} block={Boolean(actionsSlot)} size={actionsSlot ? 'lg' : compact ? 'sm' : 'md'} disabled={!typed.trim()} loading={phase === 'checking'} onClick={actionsSlot ? () => void submit([], typed) : undefined}>
                {submitLabel(variant, t)}
              </Button>
            </ActionBar>
          ) : null}
        </form>
      ) : free ? (
        <form
          className="quiz-free"
          onSubmit={(e) => {
            e.preventDefault()
            if (typed.trim()) void submit([], typed)
          }}
        >
          <label className="sr-only" htmlFor={`${headingId}-answer`}>
            {t('quiz.yourAnswer')}
          </label>
          <input
            id={`${headingId}-answer`}
            className="quiz-input"
            data-state={phase === 'done' && correct !== null ? (correct ? 'right' : 'wrong') : undefined}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={checked}
            placeholder={t('quiz.orderPlaceholder')}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="done"
          />
          {phase !== 'done' ? (
            actionsSlot ? (
              <ActionBar slot={actionsSlot}>
                <Button block size="lg" disabled={!typed.trim()} loading={phase === 'checking'} onClick={() => void submit([], typed)}>
                  {submitLabel(variant, t)}
                </Button>
              </ActionBar>
            ) : (
              <Button type="submit" size={compact ? 'sm' : 'md'} disabled={!typed.trim()} loading={phase === 'checking'}>
                {submitLabel(variant, t)}
              </Button>
            )
          ) : null}
        </form>
      ) : (
        <ol className="quiz-options" role={multi ? 'group' : 'radiogroup'} aria-labelledby={headingId}>
          {options.map((o, i) => {
            const picked = chosen.includes(o.id)
            const right = key?.options.includes(o.id) ?? false
            const optionState = phase === 'done' && key ? (right ? 'right' : picked ? 'wrong' : 'idle') : picked ? 'picked' : 'idle'
            return (
              <li key={o.id}>
                <button
                  type="button"
                  role={multi ? 'checkbox' : 'radio'}
                  aria-checked={picked}
                  className="quiz-option"
                  data-state={optionState}
                  data-pending={phase === 'checking' && picked ? '' : undefined}
                  onClick={() => toggle(o.id)}
                  disabled={checked}
                >
                  <span className="quiz-key" aria-hidden="true">
                    {optionState === 'right' ? <PiCheckBold /> : optionState === 'wrong' ? <PiXBold /> : multi && picked ? <PiCheckBold /> : i + 1}
                  </span>
                  <span className="quiz-option-text">{o.content}</span>
                  {phase === 'done' && key && right ? <span className="quiz-mark">{t('quiz.markRight')}</span> : null}
                  {phase === 'done' && key && picked && !right ? <span className="quiz-mark">{t('quiz.markPicked')}</span> : null}
                </button>
              </li>
            )
          })}
        </ol>
      )}
      {phase !== 'done' && !free && !interactive && mode !== 'speak' ? (
        <ActionBar slot={actionsSlot}>
          <Button block={Boolean(actionsSlot)} size={actionsSlot ? 'lg' : compact ? 'sm' : 'md'} disabled={chosen.length === 0} loading={phase === 'checking'} onClick={() => void submit(chosen, null)}>
            {submitLabel(variant, t)}
          </Button>
          {!actionsSlot && multi ? <span className="quiz-hint">{t('quiz.chosen', { n: chosen.length })}</span> : null}
        </ActionBar>
      ) : null}
      {error ? (
        <p className="quiz-error" role="alert">
          {error}
        </p>
      ) : null}
      {phase === 'done' && showVerdict && correct !== null ? (
        <div className="quiz-verdict" role="status">
          <LooSays className="quiz-loo" mood={correct ? 'happy' : 'sad'} size={compact ? 52 : 64}>
            <span className="quiz-verdict-line">{verdictText}</span>
          </LooSays>
          {verdict?.explanation ? <div className="quiz-explain prose-flow">{verdict.explanation}</div> : null}
        </div>
      ) : null}
    </section>
  )
}
