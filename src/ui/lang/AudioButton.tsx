'use client'

import { useEffect, useRef, useState } from 'react'
import { PiSpeakerHighFill, PiStopFill } from 'react-icons/pi'
import type { AudioLine } from '@/content/model'
import { speechLines } from '@/server/actions/speech'
import { PixelIcon } from '@/ui/design/PixelIcon'
import { speechProvider } from './speech/browser'
import { baseLang, voiceLang } from './speech/voices'
import { useSpeechSettings, useVoiceCount } from './SpeechSettings'

// Play button for course audio (docs/SPEECH.md, v1 = the browser's own voices). Speaks `text` / `lines`, or — for
// graded listening items — fetches the lines from the server only when pressed (`unitId`), so the transcript is never
// part of the page. Normal and slow speed; an en-GB / en-US switch for English; a kind fallback when there's no voice.

interface Props {
  // public text (a word, an example, a phrase to repeat)
  text?: string
  lines?: readonly AudioLine[]
  // secret text: fetched on play (listening items, minimal pairs)
  unitId?: string
  // the course's target language (BCP 47 base, e.g. `en`)
  lang: string
  // play slowly by default (A1 listening: `speed: slow`)
  slow?: boolean
  size?: 'sm' | 'md' | 'lg'
  showSlow?: boolean
  accentSwitch?: boolean
  label?: string
  className?: string
}

type Phase = 'idle' | 'loading' | 'playing'

export function AudioButton({ text, lines, unitId, lang, slow = false, size = 'md', showSlow = true, accentSwitch = false, label = 'Прослухати', className }: Props) {
  const { accent, setAccent } = useSpeechSettings()
  const voices = useVoiceCount()
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)
  const fetched = useRef<{ lines: AudioLine[]; slow: boolean } | null>(null)
  const abort = useRef<AbortController | null>(null)
  const provider = speechProvider()
  const target = voiceLang(lang, accent)
  // voices -1: server render / hydration; 0: still loading (Chrome) — treat as available until known
  const noVoice = voices > 0 && !provider.hasVoice(target)
  const unsupported = voices === -2

  useEffect(() => () => abort.current?.abort(), [])

  const play = async (slowly: boolean) => {
    if (phase === 'playing') {
      abort.current?.abort()
      provider.cancel()
      setPhase('idle')
      return
    }
    setError(null)
    let toSay: readonly AudioLine[] = lines ?? (text ? [{ speaker: null, text }] : [])
    let slowDefault = slow
    if (unitId && !lines && !text) {
      if (!fetched.current) {
        setPhase('loading')
        try {
          fetched.current = await speechLines({ unitId })
        } catch {
          setPhase('idle')
          setError('Не вдалося завантажити аудіо. Спробуй ще раз.')
          return
        }
      }
      toSay = fetched.current.lines
      slowDefault = fetched.current.slow || slow
    }
    if (toSay.length === 0) return
    const controller = new AbortController()
    abort.current = controller
    setPhase('playing')
    await provider.speak(toSay, { lang: target, slow: slowly || slowDefault, signal: controller.signal })
    if (abort.current === controller) setPhase('idle')
  }

  if (unsupported || noVoice) {
    return (
      <span className={`lang-audio lang-audio-missing ${className ?? ''}`} data-size={size} role="note">
        <PiSpeakerHighFill aria-hidden="true" />
        <span>
          {unsupported ? 'Цей браузер не вміє озвучувати текст' : `На пристрої немає голосу ${target}`}
          {text ? (
            <>
              {' — '}
              <q lang={lang}>{text}</q>
            </>
          ) : (
            '. Спробуй Chrome, Edge або Safari чи додай голос у налаштуваннях системи.'
          )}
        </span>
      </span>
    )
  }

  return (
    <span className={`lang-audio ${className ?? ''}`} data-size={size} data-phase={phase}>
      <button type="button" className="lang-audio-play" onClick={(e) => {
          // inside a <summary> (word cards in articles) the click must not toggle the card
          e.preventDefault()
          void play(false)
        }} aria-label={phase === 'playing' ? 'Зупинити' : label} title={phase === 'playing' ? 'Зупинити' : label} aria-busy={phase === 'loading' || undefined}>
        {phase === 'playing' ? <PiStopFill aria-hidden="true" /> : <PiSpeakerHighFill aria-hidden="true" />}
      </button>
      {showSlow ? (
        <button type="button" className="lang-audio-slow" onClick={(e) => {
            e.preventDefault()
            void play(true)
          }} aria-label="Повільно" title="Повільно" disabled={phase === 'loading'}>
          <PixelIcon name="tortoise" size={size === 'lg' ? 26 : 20} />
        </button>
      ) : null}
      {accentSwitch && baseLang(lang) === 'en' ? (
        <span className="lang-accent" role="radiogroup" aria-label="Акцент">
          {(['en-GB', 'en-US'] as const).map((a) => (
            <button key={a} type="button" role="radio" aria-checked={accent === a} data-on={accent === a ? '' : undefined} onClick={(e) => {
                e.preventDefault()
                setAccent(a)
              }} title={a === 'en-GB' ? 'Британський акцент' : 'Американський акцент'}>
              {a === 'en-GB' ? 'UK' : 'US'}
            </button>
          ))}
        </span>
      ) : null}
      {error ? (
        <span className="lang-audio-error" role="alert">
          {error}
        </span>
      ) : null}
    </span>
  )
}
