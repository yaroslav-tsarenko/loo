'use client'

import { useRef, useState, useSyncExternalStore } from 'react'
import { PiArrowClockwiseBold, PiCheckBold, PiMicrophoneFill, PiMicrophoneSlashFill, PiStopFill } from 'react-icons/pi'
import type { DisplayWord } from '@/content/blocks/lang/grade'
import { Button } from '@/ui/design/Button'
import { ActionBar } from '@/ui/study/ActionBar'
import { AudioButton } from './AudioButton'
import { IpaChip } from './IpaChip'
import { useSpeechSettings } from './SpeechSettings'
import { speechProvider } from './speech/browser'
import { RecognitionFailure, type RecognitionError } from './speech/provider'
import { voiceLang } from './speech/voices'

// [!speak]: say the phrase aloud. The browser recognises it (Web Speech API, lang = the course's target + accent);
// only the transcript goes to the server, which compares it word by word and grants XP on its own verdict
// (answerQuiz → speakOutcome). No recogniser (Firefox…), no microphone or no permission → «послухай і повтори» with
// a self-assessment: practice without XP.

export interface SpeakView {
  text: string
  ipa: string | null
  ipaUs: string | null
  translation: string | null
  slow: boolean
}

export interface SpeakVerdict {
  correct: boolean
  score: number | null
  words: DisplayWord[] | null
  hints: string[]
  transcript: string | null
  // self-assessed (no recogniser / no microphone): never XP
  selfAssessed: boolean
}

interface Props {
  lang: string
  spec: SpeakView
  // server check of the recogniser's alternatives (best first)
  check: (transcripts: string[], durationMs: number) => Promise<SpeakVerdict>
  onDone: (verdict: SpeakVerdict) => void
  actionsSlot?: Element | null
  // the host has the verdict: no more attempts here
  locked?: boolean
}

const ERRORS: Record<RecognitionError, string> = {
  unsupported: 'Цей браузер не розпізнає мовлення.',
  denied: 'Немає доступу до мікрофона. Дозволь його для сайту (значок біля адреси) і спробуй ще раз — або тренуйся без мікрофона.',
  'no-mic': 'Мікрофон не знайдено. Підключи його або тренуйся без мікрофона.',
  silence: 'Нічого не почув. Говори трохи голосніше й ближче до мікрофона.',
  network: 'Розпізнавання мовлення потребує інтернету. Перевір зʼєднання.',
  aborted: 'Запис зупинено.',
  error: 'Не вдалося розпізнати мовлення. Спробуй ще раз.',
}

const MAX_TRIES = 3

const noop = () => () => {}

type Phase = 'idle' | 'listening' | 'checking' | 'result'

export function SpeakExercise({ lang, spec, check, onDone, actionsSlot, locked = false }: Props) {
  const { accent } = useSpeechSettings()
  const provider = speechProvider()
  // null while hydrating
  const canRecognize = useSyncExternalStore(noop, () => provider.canRecognize(), () => null)
  const [manual, setManual] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [level, setLevel] = useState(0)
  const [partial, setPartial] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [verdict, setVerdict] = useState<SpeakVerdict | null>(null)
  const [tries, setTries] = useState(0)
  const abort = useRef<AbortController | null>(null)
  const started = useRef(0)
  const target = voiceLang(lang, accent)
  const fallback = manual || canRecognize === false

  const listen = async () => {
    if (phase === 'listening') {
      abort.current?.abort()
      return
    }
    setError(null)
    setPartial('')
    setVerdict(null)
    provider.cancel()
    const controller = new AbortController()
    abort.current = controller
    started.current = Date.now()
    setPhase('listening')
    try {
      const { transcripts } = await provider.recognize({ lang: target, onPartial: setPartial, onLevel: setLevel, signal: controller.signal, maxMs: 4000 + spec.text.length * 120 })
      setPhase('checking')
      const v = await check(transcripts, Date.now() - started.current)
      setTries((n) => n + 1)
      setVerdict(v)
      setPhase('result')
      if (v.correct) onDone(v)
    } catch (e) {
      const reason = e instanceof RecognitionFailure ? e.reason : 'error'
      setPhase('idle')
      if (reason !== 'aborted') setError(ERRORS[reason])
      if (reason === 'denied' || reason === 'no-mic' || reason === 'unsupported') setManual(true)
    }
  }

  const words = verdict?.words
  const done = verdict?.correct === true
  const selfAssess = (correct: boolean) => onDone({ correct, score: null, words: null, hints: [], transcript: null, selfAssessed: true })

  return (
    <div className="lang-speak" data-phase={phase}>
      <div className="lang-speak-target">
        <p className="lang-speak-text" lang={lang}>
          {words
            ? words.map((w, i) => (
                <span key={i} className="lang-diff-word" data-ok={w.ok ? '' : undefined} title={w.ok ? undefined : w.heard ? `почуто: ${w.heard}` : 'не почуто'}>
                  {w.text}
                </span>
              ))
            : spec.text}
        </p>
        <span className="lang-speak-meta">
          <IpaChip ipa={spec.ipa} ipaUs={spec.ipaUs} />
          <AudioButton text={spec.text} lang={lang} slow={spec.slow} size="sm" accentSwitch label="Прослухати зразок" />
        </span>
        {spec.translation ? <p className="lang-speak-tr">{spec.translation}</p> : null}
      </div>

      {fallback ? (
        <div className="lang-speak-fallback">
          <p>
            <PiMicrophoneSlashFill aria-hidden="true" /> {canRecognize === false ? 'Цей браузер не розпізнає мовлення (працює в Chrome, Edge, Safari).' : 'Тренування без мікрофона.'} Послухай зразок і
            повтори вголос кілька разів, потім чесно оціни себе — XP за самооцінку не нараховується.
          </p>
          {error ? (
            <p className="quiz-error" role="alert">
              {error}
            </p>
          ) : null}
          {locked ? null : (
            <ActionBar slot={actionsSlot}>
              <Button variant="secondary" size={actionsSlot ? 'lg' : 'md'} block={Boolean(actionsSlot)} onClick={() => selfAssess(false)}>
                Ще потренуюсь
              </Button>
              <Button size={actionsSlot ? 'lg' : 'md'} block={Boolean(actionsSlot)} icon={<PiCheckBold />} onClick={() => selfAssess(true)}>
                Вийшло схоже
              </Button>
            </ActionBar>
          )}
        </div>
      ) : (
        <div className="lang-speak-mic">
          <button
            type="button"
            className="lang-mic"
            data-on={phase === 'listening' ? '' : undefined}
            onClick={() => void listen()}
            disabled={phase === 'checking' || done || locked || canRecognize === null}
            aria-label={phase === 'listening' ? 'Зупинити запис' : 'Сказати'}
            style={{ ['--level' as string]: String(level) }}
          >
            {phase === 'listening' ? <PiStopFill aria-hidden="true" /> : <PiMicrophoneFill aria-hidden="true" />}
          </button>
          <span className="lang-meter" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} data-on={phase === 'listening' && level * 8 > i ? '' : undefined} />
            ))}
          </span>
          <p className="lang-speak-status" role="status" aria-live="polite">
            {phase === 'listening' ? partial || 'Слухаю… говори' : phase === 'checking' ? 'Перевіряю…' : done ? 'Чудова вимова!' : verdict ? `Розпізнано ${Math.round((verdict.score ?? 0) * 100)}% слів${verdict.transcript ? ` · почуто: «${verdict.transcript}»` : ''}` : 'Натисни мікрофон і скажи фразу'}
          </p>
          {error ? (
            <p className="quiz-error" role="alert">
              {error}
            </p>
          ) : null}
          {verdict && !verdict.correct && verdict.hints.length > 0 ? (
            <ul className="lang-hints">
              {verdict.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          ) : null}
          {verdict && !verdict.correct && !locked ? (
            <ActionBar slot={actionsSlot}>
              {tries < MAX_TRIES ? (
                <Button size={actionsSlot ? 'lg' : 'md'} block={Boolean(actionsSlot)} icon={<PiArrowClockwiseBold />} onClick={() => void listen()}>
                  Ще раз
                </Button>
              ) : null}
              <Button variant="ghost" size={actionsSlot ? 'lg' : 'md'} block={Boolean(actionsSlot)} onClick={() => onDone(verdict)}>
                Далі
              </Button>
            </ActionBar>
          ) : null}
          {phase === 'idle' && !verdict && !locked ? (
            <button type="button" className="ui-link as-button lang-speak-skip" onClick={() => setManual(true)}>
              Не можу зараз говорити
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}
