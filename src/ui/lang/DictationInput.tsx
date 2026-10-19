'use client'

import { useRef, useState, useSyncExternalStore } from 'react'
import { PiMicrophoneFill, PiStopFill } from 'react-icons/pi'
import { compareWords } from '@/content/blocks/lang/grade'
import { useSpeechSettings } from './SpeechSettings'
import { speechProvider } from './speech/browser'
import { RecognitionFailure, type RecognitionError } from './speech/provider'
import { voiceLang } from './speech/voices'

// Dictation answer ([!listen] type: dictation). Type it — or say it: the mic button runs the browser's recogniser
// (same free Web Speech API as [!speak]) and puts what it heard into the field, where the learner can still fix it
// before «Перевірити» (kids at A1 can answer without typing). The server checks the text either way.
// After the server's verdict, the expected text is shown word by word: what the learner missed or misspelled is marked
// (same normalisation as the server: case, punctuation, I'm = I am).

const ERRORS: Partial<Record<RecognitionError, string>> = {
  unsupported: 'Цей браузер не розпізнає мовлення — надрукуй відповідь.',
  denied: 'Немає доступу до мікрофона. Дозволь його для сайту або надрукуй відповідь.',
  'no-mic': 'Мікрофон не знайдено — надрукуй відповідь.',
  silence: 'Нічого не почув. Скажи ще раз, трохи голосніше.',
  network: 'Розпізнавання мовлення потребує інтернету.',
  error: 'Не вдалося розпізнати. Спробуй ще раз або надрукуй.',
}

const noop = () => () => {}

// «i am twenty one years old» → «I am twenty one years old»
const sentence = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

export function DictationInput({ id, value, onChange, disabled, state, expected, onSubmit, lang = 'en' }: { id: string; value: string; onChange: (v: string) => void; disabled: boolean; state?: 'right' | 'wrong'; expected: string | null; onSubmit: () => void; lang?: string }) {
  const diff = expected && state === 'wrong' ? compareWords(expected, value, { typos: true }) : null
  const { accent } = useSpeechSettings()
  const provider = speechProvider()
  // null while hydrating: the mic appears only where the browser can recognise speech
  const canRecognize = useSyncExternalStore(noop, () => provider.canRecognize(), () => null)
  const [listening, setListening] = useState(false)
  const [partial, setPartial] = useState('')
  const [error, setError] = useState<string | null>(null)
  const abort = useRef<AbortController | null>(null)

  const listen = async () => {
    if (listening) {
      abort.current?.abort()
      return
    }
    setError(null)
    setPartial('')
    provider.cancel()
    const controller = new AbortController()
    abort.current = controller
    setListening(true)
    try {
      const { transcripts } = await provider.recognize({ lang: voiceLang(lang, accent), onPartial: setPartial, signal: controller.signal, maxMs: 15000 })
      const best = transcripts[0]?.trim()
      if (best) onChange(sentence(best))
    } catch (e) {
      const reason = e instanceof RecognitionFailure ? e.reason : 'error'
      if (reason !== 'aborted') setError(ERRORS[reason] ?? ERRORS.error!)
    } finally {
      setListening(false)
      setPartial('')
    }
  }

  return (
    <div className="lang-dictation">
      <label className="sr-only" htmlFor={id}>
        Що ти почув?
      </label>
      <div className="lang-dictation-row">
        <textarea
          id={id}
          className="quiz-input lang-dictation-input"
          data-state={state}
          value={listening && partial ? sentence(partial) : value}
          rows={2}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (value.trim()) onSubmit()
            }
          }}
          disabled={disabled}
          readOnly={listening}
          placeholder={canRecognize ? 'Надрукуй або скажи, що почув' : 'Надрукуй, що почув — англійською'}
          autoComplete="off"
          autoCapitalize="sentences"
          spellCheck={false}
          lang="en"
          enterKeyHint="done"
        />
        {canRecognize && !disabled ? (
          <button type="button" className="lang-mic lang-mic-sm" data-on={listening ? '' : undefined} onClick={() => void listen()} aria-label={listening ? 'Зупинити запис' : 'Сказати відповідь голосом'} title={listening ? 'Зупинити' : 'Сказати голосом'}>
            {listening ? <PiStopFill aria-hidden="true" /> : <PiMicrophoneFill aria-hidden="true" />}
          </button>
        ) : null}
      </div>
      {listening ? (
        <p className="lang-dictation-status" role="status" aria-live="polite">
          Слухаю… говори англійською
        </p>
      ) : error ? (
        <p className="quiz-error" role="alert">
          {error}
        </p>
      ) : null}
      {diff ? (
        <p className="lang-diff" aria-label="Правильний текст">
          {diff.words.map((w, i) => (
            <span key={i} className="lang-diff-word" data-ok={w.ok ? '' : undefined} title={w.ok ? undefined : w.heard ? `у тебе: ${w.heard}` : 'пропущено'}>
              {w.text}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  )
}
