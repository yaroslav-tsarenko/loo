// Pure helpers of the speech layer (no DOM): which BCP 47 voice language to use and which system voice is best.
// Unit-tested; the browser provider (./browser.ts) feeds them window.speechSynthesis.getVoices().

// The accent setting is English-only (user settings `accent`); every other target has one voice language (de → de-DE).
export type Accent = 'en-GB' | 'en-US'

// Last resort when nothing names the spoken language (a block outside any language course): the course's `target`
// (course.yaml) and a block's own `lang:` always win.
export const DEFAULT_SPEECH_LANG = 'en'

const REGION: Record<string, string> = { de: 'de-DE', fr: 'fr-FR', it: 'it-IT', es: 'es-ES', pl: 'pl-PL', pt: 'pt-PT', uk: 'uk-UA', ja: 'ja-JP', zh: 'zh-CN' }

// target `en` + accent → en-GB / en-US; `de` → de-DE (the accent is ignored); a target with a region keeps it.
export function voiceLang(target: string | null | undefined, accent: Accent = 'en-GB'): string {
  const lang = (target || DEFAULT_SPEECH_LANG).trim()
  if (lang.includes('-')) return lang
  if (lang.toLowerCase() === 'en') return accent
  return REGION[lang.toLowerCase()] ?? lang
}

export const baseLang = (lang: string): string => lang.toLowerCase().replace('_', '-').split('-')[0]!

// The UK / US switch and the accent setting only mean something for English.
export const hasAccentChoice = (target: string | null | undefined): boolean => baseLang(target || DEFAULT_SPEECH_LANG) === 'en'

// Settings «Акцент англійської»: hidden when the learner's language courses are all non-English (a German-only
// learner); shown when one of them is English, or there are none (nothing to judge by — as before).
export const showsAccentSetting = (targets: readonly string[]): boolean => targets.length === 0 || targets.some(hasAccentChoice)

// «…говори англійською»: the target language in Ukrainian (instrumental case); null for a language not listed
const NAME_UK: Record<string, string> = {
  en: 'англійською',
  de: 'німецькою',
  fr: 'французькою',
  es: 'іспанською',
  it: 'італійською',
  pl: 'польською',
  pt: 'португальською',
  uk: 'українською',
  ja: 'японською',
  zh: 'китайською',
}
export const languageNameUk = (target: string | null | undefined): string | null => NAME_UK[baseLang(target || DEFAULT_SPEECH_LANG)] ?? null

// Which IPA an IpaChip shows: the US one only with the US accent (or when it's the only one); no US variant → no
// region tag at all (German and other targets have one transcription).
export function ipaShown(ipa: string | null, ipaUs: string | null | undefined, accent: Accent): { text: string | null; region: 'UK' | 'US' | null } {
  const text = accent === 'en-US' && ipaUs ? ipaUs : ipa ?? ipaUs ?? null
  const region = accent === 'en-US' && ipaUs ? 'US' : ipaUs ? 'UK' : null
  return { text, region }
}

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
