'use client'

import { pickVoice, RATE } from './voices'
import { RecognitionFailure, type RecognitionResult, type RecognizeOptions, type SpeakOptions, type SpeechProvider, type SpokenLine } from './provider'

// Browser implementation of SpeechProvider: speechSynthesis + (webkit)SpeechRecognition. Recognition sends audio to
// the browser vendor's service in Chrome / Edge / Safari; our server never receives audio — only the transcript.

interface RecognitionAlternative {
  transcript: string
}
interface RecognitionEventLike {
  resultIndex: number
  results: ArrayLike<ArrayLike<RecognitionAlternative> & { isFinal: boolean }>
}
interface RecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: RecognitionEventLike) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}
type RecognitionCtor = new () => RecognitionLike

function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

const synth = (): SpeechSynthesis | null => (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null)

function speakOne(s: SpeechSynthesis, line: SpokenLine, voice: SpeechSynthesisVoice | null, lang: string, slow: boolean): Promise<void> {
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(line.text)
    u.lang = voice?.lang ?? lang
    if (voice) u.voice = voice
    u.rate = slow ? RATE.slow : RATE.normal
    u.onend = () => resolve()
    u.onerror = () => resolve()
    s.speak(u)
  })
}

// A meter of the microphone level while recognition runs (a second capture of the same mic; released at the end).
async function levelMeter(onLevel: (level: number) => void): Promise<() => void> {
  if (!navigator.mediaDevices?.getUserMedia) return () => {}
  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (error) {
    const name = error instanceof DOMException ? error.name : ''
    throw new RecognitionFailure(name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'no-mic')
  }
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) {
    stream.getTracks().forEach((t) => t.stop())
    return () => {}
  }
  const ctx = new Ctx()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 512
  ctx.createMediaStreamSource(stream).connect(analyser)
  const data = new Uint8Array(analyser.fftSize)
  let frame = 0
  const tick = () => {
    analyser.getByteTimeDomainData(data)
    let sum = 0
    for (const v of data) sum += ((v - 128) / 128) ** 2
    onLevel(Math.min(1, Math.sqrt(sum / data.length) * 4))
    frame = requestAnimationFrame(tick)
  }
  tick()
  return () => {
    cancelAnimationFrame(frame)
    stream.getTracks().forEach((t) => t.stop())
    void ctx.close()
    onLevel(0)
  }
}

export const browserSpeech: SpeechProvider = {
  id: 'browser',
  canSpeak: () => synth() !== null,
  hasVoice(lang) {
    const s = synth()
    return s !== null && pickVoice(s.getVoices(), lang) !== null
  },
  async speak(lines, opts: SpeakOptions) {
    const s = synth()
    if (!s) return
    s.cancel()
    const voices = s.getVoices()
    const first = pickVoice(voices, opts.lang)
    // dialogues: the second speaker gets another voice of the same language when there is one
    const second = pickVoice(voices, opts.lang, first?.name) ?? first
    const speakers = [...new Set(lines.map((l) => l.speaker).filter(Boolean))]
    for (const line of lines) {
      if (opts.signal?.aborted) break
      const voice = line.speaker && speakers.indexOf(line.speaker) % 2 === 1 ? second : first
      await speakOne(s, line, voice, opts.lang, opts.slow === true)
    }
  },
  cancel: () => synth()?.cancel(),
  canRecognize: () => recognitionCtor() !== null,
  async recognize(opts: RecognizeOptions): Promise<RecognitionResult> {
    const Ctor = recognitionCtor()
    if (!Ctor) throw new RecognitionFailure('unsupported')
    const stopMeter = opts.onLevel ? await levelMeter(opts.onLevel) : () => {}
    return new Promise<RecognitionResult>((resolve, reject) => {
      const rec = new Ctor()
      rec.lang = opts.lang
      rec.interimResults = true
      rec.maxAlternatives = 3
      rec.continuous = false
      let finals: string[] = []
      let settled = false
      const timer = window.setTimeout(() => rec.stop(), opts.maxMs ?? 8000)
      const done = (fn: () => void) => {
        if (settled) return
        settled = true
        window.clearTimeout(timer)
        stopMeter()
        fn()
      }
      opts.signal?.addEventListener('abort', () => {
        rec.abort()
        done(() => reject(new RecognitionFailure('aborted')))
      })
      rec.onresult = (e) => {
        let interim = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const result = e.results[i]!
          if (result.isFinal) finals = Array.from({ length: result.length }, (_, k) => result[k]!.transcript.trim()).filter(Boolean)
          else interim += result[0]?.transcript ?? ''
        }
        opts.onPartial?.(finals[0] ?? interim)
      }
      rec.onerror = (e) => {
        const map: Record<string, RecognitionFailure['reason']> = {
          'not-allowed': 'denied',
          'service-not-allowed': 'denied',
          'audio-capture': 'no-mic',
          'no-speech': 'silence',
          network: 'network',
          aborted: 'aborted',
        }
        done(() => reject(new RecognitionFailure(map[e.error] ?? 'error')))
      }
      rec.onend = () => done(() => (finals.length > 0 ? resolve({ transcripts: finals }) : reject(new RecognitionFailure('silence'))))
      try {
        rec.start()
      } catch {
        done(() => reject(new RecognitionFailure('error')))
      }
    })
  },
}

// `gateway` (AI voices, docs/SPEECH.md §5) is not wired in v1: every caller gets the browser provider.
export function speechProvider(): SpeechProvider {
  return browserSpeech
}
