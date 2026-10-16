// Checking language answers (docs/LANGUAGE_COURSE.md, docs/SPEECH.md §3): dictation ([!listen] type: dictation) and
// pronunciation ([!speak]). Pure and dependency-free: the server grades with it (gradeQuiz, checkSpeech) and the
// client reuses it only to draw a diff of an answer the server already judged.
//
// Both compare WORDS, not characters: text is normalised (case, punctuation, curly quotes, hyphens), contractions are
// expanded (I'm → i am, don't → do not), numbers become words (2 → two, 21st → twenty first) and a few UK/US spellings
// are unified (color → colour), so «I'm 2» and «I am two» are the same answer. Then the target and the answer are
// aligned (word-level Levenshtein) into ok / sub / del / ins.

export type WordOp = 'ok' | 'sub' | 'del' | 'ins'

// One word of the target as the learner sees it («meet,»), judged.
export interface DisplayWord {
  text: string
  ok: boolean
  // what was heard / typed in its place (sub), null when missing or right
  heard: string | null
}

export interface WordComparison {
  words: DisplayWord[]
  // share of the target's (normalised) words that matched, 0..1
  score: number
  // heard / typed words that aren't in the target
  extra: string[]
}

// ── Normalisation ─────────────────────────────────────────────────────────────────────────────────────────────

export function normalizeText(s: string): string {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[‘’ʼ`´]/g, "'")
    .replace(/[^\p{L}\p{N}'\s-]+/gu, ' ')
    .replace(/(^|\s)'+/g, '$1')
    .replace(/'+(?=\s|$)/g, '')
    .replace(/-+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const IRREGULAR: Record<string, string[]> = {
  "can't": ['can', 'not'],
  cannot: ['can', 'not'],
  "won't": ['will', 'not'],
  "shan't": ['shall', 'not'],
  "ain't": ['is', 'not'],
  "let's": ['let', 'us'],
  gonna: ['going', 'to'],
  wanna: ['want', 'to'],
  gotta: ['got', 'to'],
}

// `'s` is «is» only after these; elsewhere it's a possessive (Tom's) and stays one word
const S_IS = new Set(['it', 'he', 'she', 'that', 'what', 'there', 'here', 'who', 'where', 'how', 'when', 'why', 'this'])

const SUFFIXES: Array<[RegExp, string]> = [
  [/^(.+)n't$/, 'not'],
  [/^(.+)'re$/, 'are'],
  [/^(.+)'ve$/, 'have'],
  [/^(.+)'ll$/, 'will'],
  [/^(.+)'d$/, 'would'],
  [/^(.+)'m$/, 'am'],
]

function expand(token: string): string[] {
  const irregular = IRREGULAR[token]
  if (irregular) return irregular
  for (const [re, word] of SUFFIXES) {
    const m = re.exec(token)
    if (m) return [m[1]!, word]
  }
  const s = /^(.+)'s$/.exec(token)
  if (s && S_IS.has(s[1]!)) return [s[1]!, 'is']
  return [token.replace(/'/g, '')]
}

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

// 0 … 999 999 as words (105 → one hundred five)
export function numberWords(n: number): string[] {
  if (!Number.isInteger(n) || n < 0 || n > 999_999) return [String(n)]
  if (n < 20) return [ONES[n]!]
  if (n < 100) return n % 10 === 0 ? [TENS[n / 10]!] : [TENS[Math.floor(n / 10)]!, ONES[n % 10]!]
  if (n < 1000) return [ONES[Math.floor(n / 100)]!, 'hundred', ...(n % 100 ? numberWords(n % 100) : [])]
  return [...numberWords(Math.floor(n / 1000)), 'thousand', ...(n % 1000 ? numberWords(n % 1000) : [])]
}

const ORDINAL: Record<string, string> = { one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth' }

function ordinal(word: string): string {
  if (ORDINAL[word]) return ORDINAL[word]
  if (word.endsWith('y')) return `${word.slice(0, -1)}ieth`
  return `${word}th`
}

function numberish(token: string): string[] {
  if (/^\d{1,6}$/.test(token)) return numberWords(Number(token))
  const m = /^(\d{1,6})(st|nd|rd|th)$/.exec(token)
  if (m) {
    const words = numberWords(Number(m[1]))
    return [...words.slice(0, -1), ordinal(words.at(-1)!)]
  }
  return [token]
}

// US → UK (British spelling is the course default); both sides go through it, so either is accepted.
const SPELLING: Record<string, string> = {
  color: 'colour',
  colors: 'colours',
  favorite: 'favourite',
  favorites: 'favourites',
  center: 'centre',
  theater: 'theatre',
  meter: 'metre',
  meters: 'metres',
  liter: 'litre',
  gray: 'grey',
  organize: 'organise',
  realize: 'realise',
  apologize: 'apologise',
  traveled: 'travelled',
  traveling: 'travelling',
  neighbor: 'neighbour',
  neighbors: 'neighbours',
  honor: 'honour',
  humor: 'humour',
  labor: 'labour',
  okay: 'ok',
  mom: 'mum',
}

const NUMBER_WORDS = new Set([...ONES, ...TENS.filter(Boolean), 'hundred', 'thousand'])

// «I'm 21!» → ['i', 'am', 'twenty', 'one']
export function words(s: string): string[] {
  const out: string[] = []
  for (const raw of normalizeText(s).split(' ')) {
    if (!raw) continue
    for (const t of expand(raw)) for (const n of numberish(t)) if (n) out.push(SPELLING[n] ?? n)
  }
  // «a hundred and five» = «105»: drop the «and» inside a number only
  return out.filter((w, i) => !(w === 'and' && (out[i - 1] === 'hundred' || out[i - 1] === 'thousand') && NUMBER_WORDS.has(out[i + 1] ?? '')))
}

// ── Alignment ─────────────────────────────────────────────────────────────────────────────────────────────────

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    for (let j = 1; j <= b.length; j++) row[j] = Math.min(prev[j]! + 1, row[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1))
    prev = row
  }
  return prev[b.length]!
}

export interface AlignedOp {
  op: WordOp
  // index into the target / heard token lists (null for ins / del respectively)
  target: number | null
  heard: number | null
}

// Word-level Levenshtein with backtrace. `same` decides when two tokens count as the same word.
export function alignWords(target: readonly string[], heard: readonly string[], same: (a: string, b: string) => boolean = (a, b) => a === b): AlignedOp[] {
  const n = target.length
  const m = heard.length
  const d: number[][] = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)))
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) d[i]![j] = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + (same(target[i - 1]!, heard[j - 1]!) ? 0 : 1))
  const ops: AlignedOp[] = []
  let i = n
  let j = m
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i]![j] === d[i - 1]![j - 1]! + (same(target[i - 1]!, heard[j - 1]!) ? 0 : 1)) {
      ops.push({ op: same(target[i - 1]!, heard[j - 1]!) ? 'ok' : 'sub', target: i - 1, heard: j - 1 })
      i--
      j--
    } else if (i > 0 && d[i]![j] === d[i - 1]![j]! + 1) {
      ops.push({ op: 'del', target: i - 1, heard: null })
      i--
    } else {
      ops.push({ op: 'ins', target: null, heard: j - 1 })
      j--
    }
  }
  return ops.reverse()
}

// Words that sound the same: a speech recogniser may write either, the learner said it right.
const HOMOPHONES: readonly string[][] = [
  ['to', 'too', 'two'],
  ['there', 'their'],
  ['for', 'four'],
  ['right', 'write'],
  ['see', 'sea'],
  ['meet', 'meat'],
  ['hear', 'here'],
  ['know', 'no'],
  ['by', 'buy', 'bye'],
  ['i', 'eye'],
  ['one', 'won'],
  ['weather', 'whether'],
  ['eight', 'ate'],
  ['our', 'hour'],
  ['new', 'knew'],
  ['son', 'sun'],
  ['week', 'weak'],
  ['wait', 'weight'],
  ['whole', 'hole'],
  ['piece', 'peace'],
  ['blue', 'blew'],
  ['flower', 'flour'],
  ['where', 'wear'],
  ['which', 'witch'],
  ['would', 'wood'],
  ['be', 'bee'],
  ['dear', 'deer'],
  ['pair', 'pear'],
  ['plane', 'plain'],
  ['through', 'threw'],
  ['ok', 'okay'],
]
const SOUND = new Map<string, number>()
HOMOPHONES.forEach((group, i) => group.forEach((w) => SOUND.set(w, i)))

export const sameSound = (a: string, b: string): boolean => a === b || (SOUND.has(a) && SOUND.get(a) === SOUND.get(b))

// One slip in a long word (≥ 6 letters) is a typo, not a wrong word: «beautifull» ✓, «sheep» ≠ «ship».
export const typoTolerant = (a: string, b: string): boolean => a === b || (a.length >= 6 && b.length >= 6 && levenshtein(a, b) <= 1)

export interface CompareOptions {
  homophones?: boolean
  typos?: boolean
}

export function compareWords(target: string, heard: string, opts: CompareOptions = {}): WordComparison {
  const display = target.split(/\s+/).filter(Boolean)
  const owner: number[] = []
  const targetTokens: string[] = []
  display.forEach((w, i) => {
    for (const t of words(w)) {
      targetTokens.push(t)
      owner.push(i)
    }
  })
  const heardTokens = words(heard)
  const same = (a: string, b: string) => a === b || (opts.homophones === true && sameSound(a, b)) || (opts.typos === true && typoTolerant(a, b))
  const ops = alignWords(targetTokens, heardTokens, same)
  const okToken = new Array<boolean>(targetTokens.length).fill(false)
  const heardFor = new Map<number, string>()
  const extra: string[] = []
  for (const o of ops) {
    if (o.op === 'ok') okToken[o.target!] = true
    else if (o.op === 'sub') heardFor.set(o.target!, heardTokens[o.heard!]!)
    else if (o.op === 'ins') extra.push(heardTokens[o.heard!]!)
  }
  const out: DisplayWord[] = display.map((text, i) => {
    const mine = owner.map((o, k) => (o === i ? k : -1)).filter((k) => k >= 0)
    // punctuation-only «words» (—) are always fine
    const ok = mine.every((k) => okToken[k])
    const heardWords = mine.map((k) => heardFor.get(k)).filter((v): v is string => Boolean(v))
    return { text, ok, heard: ok || heardWords.length === 0 ? null : heardWords.join(' ') }
  })
  const okCount = okToken.filter(Boolean).length
  return { words: out, score: targetTokens.length > 0 ? okCount / targetTokens.length : 0, extra }
}

// ── Dictation ([!listen] type: dictation) ───────────────────────────────────────────────────────────────────────

export function dictationMatches(answer: string, expected: string, accept: readonly string[] = []): boolean {
  if (words(answer).length === 0) return false
  return [expected, ...accept].some((want) => {
    const c = compareWords(want, answer, { typos: true })
    return c.extra.length === 0 && c.words.every((w) => w.ok)
  })
}

// ── Pronunciation ([!speak]) ───────────────────────────────────────────────────────────────────────────────────

// Share of the target's words the recogniser must hear (4 of 5, every word of a 1–4-word phrase).
export const SPEAK_PASS = 0.8

export interface SpeechVerdict extends WordComparison {
  passed: boolean
  // the recognised alternative that matched best
  transcript: string
}

export function judgeSpeech(target: string, transcripts: readonly string[]): SpeechVerdict {
  let best: SpeechVerdict | null = null
  for (const transcript of transcripts.length > 0 ? transcripts : ['']) {
    const c = compareWords(target, transcript, { homophones: true })
    const tokens = words(target).length
    const passed = words(transcript).length > 0 && c.score >= SPEAK_PASS && c.extra.length <= Math.max(2, Math.ceil(tokens / 2))
    const verdict: SpeechVerdict = { ...c, passed, transcript }
    if (!best || Number(verdict.passed) > Number(best.passed) || (verdict.passed === best.passed && (verdict.score > best.score || (verdict.score === best.score && verdict.extra.length < best.extra.length)))) best = verdict
  }
  return best!
}

export interface HintSource {
  text: string
  ipa: string | null
  ipaUs?: string | null
  tip: string | null
}

// Spelling → the sound Ukrainian speakers most often replace (ENGLISH_SYLLABUS §1): a hint for a missed word.
const SOUND_RULES: Array<{ test: RegExp; hint: string }> = [
  { test: /th/, hint: 'th — кінчик язика між зубами: /θ/ (think) або /ð/ (this), не «с», «з», «ф» чи «д».' },
  { test: /^wh?(?!r)/, hint: 'w — округли губи, як для «у», і не торкайся зубами: /w/, а не «в».' },
  { test: /^h/, hint: 'h — легкий видих /h/, а не українське «г».' },
  { test: /ee|ea/, hint: 'Довге /iː/ — тягни звук: sheep, meet (коротке /ɪ/ — ship, it).' },
  { test: /ng$/, hint: 'ng у кінці — носовий /ŋ/, без «г» після нього.' },
  { test: /[^aeiou][bdgvz]$/, hint: 'Не оглушуй дзвінкий приголосний у кінці слова: bed ≠ bet, bag ≠ back.' },
]

const ipaWords = (ipa: string | null): string[] => (ipa ? ipa.replace(/^\/|\/$/g, '').trim().split(/\s+/) : [])

// Up to `max` hints for the words the recogniser missed: the word's IPA (from the phrase IPA, when it splits into the
// same number of words), the author's tip and the sound rules.
export function speechHints(verdict: WordComparison, source: HintSource, accent: 'uk' | 'us' = 'uk', max = 3): string[] {
  const missed = verdict.words.map((w, i) => ({ w, i })).filter((x) => !x.w.ok)
  if (missed.length === 0) return []
  const out: string[] = []
  if (source.tip) out.push(source.tip)
  const ipa = ipaWords(accent === 'us' ? source.ipaUs ?? source.ipa : source.ipa)
  const display = source.text.split(/\s+/).filter(Boolean)
  for (const { w, i } of missed) {
    const plain = normalizeText(w.text)
    if (ipa.length === display.length && ipa[i]) out.push(`«${plain}» — /${ipa[i]}/${w.heard ? ` (почуто «${w.heard}»)` : ''}`)
    else if (w.heard) out.push(`«${plain}»: почуто «${w.heard}»`)
    const rule = SOUND_RULES.find((r) => r.test.test(plain))
    if (rule) out.push(rule.hint)
  }
  return [...new Set(out)].slice(0, max)
}
