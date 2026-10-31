// The speech layer of language courses (docs/SPEECH.md). v1 is FREE: the browser's own speechSynthesis (TTS) and
// Web Speech SpeechRecognition (ASR). Everything goes through `SpeechProvider`, so AI voices via the AI Gateway (with
// a Supabase Storage cache) can be added later as a `gateway` provider without touching the components.

export interface SpokenLine {
  speaker: string | null
  text: string
}

// unavailable: the recogniser exists but this browser / mode won't run it although the microphone is allowed (iOS home-
// screen app, Chrome on iOS, Dictation off in iOS settings — `service-not-allowed`)
export type RecognitionError = 'unsupported' | 'denied' | 'unavailable' | 'no-mic' | 'silence' | 'network' | 'aborted' | 'error'

export interface RecognitionResult {
  // alternatives, best first
  transcripts: string[]
}

export interface RecognizeOptions {
  lang: string
  // live (interim) transcript
  onPartial?: (text: string) => void
  // microphone level 0..1, ~30×/s
  onLevel?: (level: number) => void
  maxMs?: number
  signal?: AbortSignal
}

export interface SpeakOptions {
  lang: string
  slow?: boolean
  signal?: AbortSignal
}

export interface SpeechProvider {
  id: 'browser' | 'gateway'
  canSpeak(): boolean
  // resolves when the last line is spoken (or cancelled)
  speak(lines: readonly SpokenLine[], opts: SpeakOptions): Promise<void>
  cancel(): void
  // a voice exists for this language (voices load asynchronously — call again after `voiceschanged`)
  hasVoice(lang: string): boolean
  canRecognize(): boolean
  recognize(opts: RecognizeOptions): Promise<RecognitionResult>
}

export class RecognitionFailure extends Error {
  constructor(readonly reason: RecognitionError) {
    super(reason)
  }
}
