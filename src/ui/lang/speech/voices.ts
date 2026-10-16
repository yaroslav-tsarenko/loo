// Pure helpers of the speech layer (no DOM): which BCP 47 voice language to use and which system voice is best.
// Unit-tested; the browser provider (./browser.ts) feeds them window.speechSynthesis.getVoices().

export type Accent = 'en-GB' | 'en-US'

const REGION: Record<string, string> = { de: 'de-DE', fr: 'fr-FR', it: 'it-IT', es: 'es-ES', pl: 'pl-PL', pt: 'pt-PT', uk: 'uk-UA', ja: 'ja-JP', zh: 'zh-CN' }

// target `en` + accent → en-GB / en-US; `de` → de-DE; a target with a region keeps it.
export function voiceLang(target: string | null | undefined, accent: Accent = 'en-GB'): string {
  const lang = (target || 'en').trim()
  if (lang.includes('-')) return lang
  if (lang.toLowerCase() === 'en') return accent
  return REGION[lang.toLowerCase()] ?? lang
}

export const baseLang = (lang: string): string => lang.toLowerCase().replace('_', '-').split('-')[0]!

export interface VoiceLike {
  name: string
  lang: string
  localService?: boolean
  default?: boolean
}

// macOS novelty voices and robotic engines: never the default choice
const NOVELTY = /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|ralph|fred|junior|kathy|grandma|grandpa|rocko|shelley|sandy|flo|eddy|reed)\b/i
const ROBOTIC = /(compact|eloquence|espeak)/i
const NATURAL = /(natural|neural|premium|enhanced|google|siri|online)/i

export function voiceScore(voice: VoiceLike, lang: string): number {
  const want = lang.toLowerCase().replace('_', '-')
  const have = voice.lang.toLowerCase().replace('_', '-')
  if (baseLang(have) !== baseLang(want)) return -Infinity
  let score = have === want ? 100 : 40
  if (NATURAL.test(voice.name)) score += 20
  if (ROBOTIC.test(voice.name)) score -= 30
  if (NOVELTY.test(voice.name)) score -= 60
  if (voice.localService) score += 2
  if (voice.default) score += 1
  return score
}

// The best voice for `lang` (exact region first, then the same language), or null — the caller shows a text fallback.
export function pickVoice<V extends VoiceLike>(voices: readonly V[], lang: string, avoid?: string): V | null {
  let best: V | null = null
  let bestScore = -Infinity
  for (const v of voices) {
    const s = voiceScore(v, lang) - (avoid && v.name === avoid ? 50 : 0)
    if (s > bestScore) {
      best = v
      bestScore = s
    }
  }
  return bestScore === -Infinity ? null : best
}

// Speech rate: normal is a touch slower than native speed for learners; «повільно» for A1 and the slow button.
export const RATE = { normal: 0.92, slow: 0.68 } as const
