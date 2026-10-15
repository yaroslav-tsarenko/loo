// A tiny backtracking regex engine (a model of how Irregexp-style engines search).
// Supports literals, ., [classes], \d \w \s (+ negations), escapes, groups (…) / (?:…),
// alternation |, quantifiers * + ? {n,m} and their lazy forms, anchors ^ $.
// No flags (no i / m / s / u), so . excludes line terminators and ^ $ mean string edges.

export type Span = readonly [number, number]

type Node =
  | { t: 'atom'; test: (c: string) => boolean; label: string; span: Span }
  | { t: 'start' | 'end'; span: Span }
  | { t: 'seq'; items: Node[]; span: Span }
  | { t: 'alt'; options: Node[]; span: Span }
  | { t: 'group'; body: Node; span: Span }
  | { t: 'quant'; body: Node; min: number; max: number; greedy: boolean; span: Span }

const DIGIT = (c: string) => c >= '0' && c <= '9'
const WORD = (c: string) => DIGIT(c) || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'
const SPACE = (c: string) => /\s/.test(c)
const LINE_END = (c: string) => c === '\n' || c === '\r' || c === '\u2028' || c === '\u2029'
const ESCAPES: Record<string, (c: string) => boolean> = {
  d: DIGIT,
  D: (c) => !DIGIT(c),
  w: WORD,
  W: (c) => !WORD(c),
  s: SPACE,
  S: (c) => !SPACE(c),
}
const CONTROL: Record<string, string> = { n: '\n', t: '\t', r: '\r', f: '\f', v: '\v', '0': '\0' }

export class RegexSyntaxError extends Error {}

export function parse(pattern: string): Node {
  let i = 0
  const peek = () => pattern[i]

  const alternation = (): Node => {
    const from = i
    const options = [sequence()]
    while (peek() === '|') {
      i++
      options.push(sequence())
    }
    return options.length === 1 ? options[0]! : { t: 'alt', options, span: [from, i] }
  }

  const sequence = (): Node => {
    const from = i
    const items: Node[] = []
    while (i < pattern.length && peek() !== '|' && peek() !== ')') items.push(quantified())
    return items.length === 1 ? items[0]! : { t: 'seq', items, span: [from, i] }
  }

  const quantified = (): Node => {
    const from = i
    const body = atom()
    let min = -1
    let max = -1
    const c = peek()
    if (c === '*') [min, max] = [0, Infinity]
    else if (c === '+') [min, max] = [1, Infinity]
    else if (c === '?') [min, max] = [0, 1]
    else if (c === '{') {
      const m = /^\{(\d+)(?:(,)(\d*))?\}/.exec(pattern.slice(i))
      if (m) {
        min = Number(m[1])
        max = m[2] ? (m[3] ? Number(m[3]) : Infinity) : min
        i += m[0].length - 1
      }
    }
    if (min < 0) return body
    if (body.t === 'start' || body.t === 'end') throw new RegexSyntaxError('Nothing to repeat')
    i++
    let greedy = true
    if (peek() === '?') {
      greedy = false
      i++
    }
    return { t: 'quant', body, min, max, greedy, span: [from, i] }
  }

  const escape = (): { test: (c: string) => boolean; label: string } => {
    const c = pattern[i++]
    if (c === undefined) throw new RegexSyntaxError('\\ at end of pattern')
    const cls = ESCAPES[c]
    if (cls) return { test: cls, label: `\\${c}` }
    const ch = CONTROL[c] ?? c
    return { test: (x) => x === ch, label: `\\${c}` }
  }

  const charClass = (from: number): Node => {
    i++ // [
    let negate = false
    if (peek() === '^') {
      negate = true
      i++
    }
    const tests: Array<(c: string) => boolean> = []
    let first = true
    while (i < pattern.length && (peek() !== ']' || first)) {
      first = false
      let lo: string
      if (peek() === '\\') {
        i++
        const e = escape()
        if (e.label.length === 2 && ESCAPES[e.label[1]!]) {
          tests.push(e.test)
          continue
        }
        lo = CONTROL[e.label[1]!] ?? e.label[1]!
      } else lo = pattern[i++]!
      if (peek() === '-' && pattern[i + 1] !== undefined && pattern[i + 1] !== ']') {
        i++
        let hi = pattern[i++]!
        if (hi === '\\') hi = CONTROL[pattern[i]!] ?? pattern[i++]!
        if (hi < lo) throw new RegexSyntaxError('Range out of order in character class')
        tests.push((c) => c >= lo && c <= hi)
      } else {
        const ch = lo
        tests.push((c) => c === ch)
      }
    }
    if (peek() !== ']') throw new RegexSyntaxError('Unterminated character class')
    i++
    const label = pattern.slice(from, i)
    return { t: 'atom', test: (c) => tests.some((t) => t(c)) !== negate, label, span: [from, i] }
  }

  const atom = (): Node => {
    const from = i
    const c = peek()
    if (c === '(') {
      i++
      if (pattern.startsWith('?:', i)) i += 2
      else if (peek() === '?') throw new RegexSyntaxError('Lookarounds are not supported')
      const body = alternation()
      if (peek() !== ')') throw new RegexSyntaxError('Unterminated group')
      i++
      return { t: 'group', body, span: [from, i] }
    }
    if (c === '[') return charClass(from)
    if (c === '^') {
      i++
      return { t: 'start', span: [from, i] }
    }
    if (c === '$') {
      i++
      return { t: 'end', span: [from, i] }
    }
    if (c === '.') {
      i++
      return { t: 'atom', test: (x) => !LINE_END(x), label: '.', span: [from, i] }
    }
    if (c === '\\') {
      i++
      const e = escape()
      return { t: 'atom', ...e, span: [from, i] }
    }
    if (c === '*' || c === '+' || c === '?' || c === ')') throw new RegexSyntaxError(`Unexpected ${c}`)
    i++
    return { t: 'atom', test: (x) => x === c, label: c!, span: [from, i] }
  }

  const root = alternation()
  if (i < pattern.length) throw new RegexSyntaxError(`Unexpected ${peek()}`)
  return root
}

// ── tracing matcher ───────────────────────────────────────────────

export type TraceKind =
  | 'start' // new attempt from a start position
  | 'char-ok'
  | 'char-fail'
  | 'anchor-ok'
  | 'anchor-fail'
  | 'quant-stop' // greedy: cannot repeat more, continue with the rest
  | 'give-back' // greedy: rest failed, give one repetition back
  | 'lazy-rest' // lazy: try the rest first
  | 'lazy-more' // lazy: rest failed, take one more repetition
  | 'alt-next' // alternative failed, try the next one
  | 'success'
  | 'no-match'

export interface TraceEvent {
  kind: TraceKind
  span: Span | null
  // position in the input
  pos: number
  // start of the current attempt
  start: number
  label: string
  // quantifier repetitions / alternative index
  count?: number
  ch?: string
}

export interface MatchResult {
  match: { index: number; text: string } | null
  steps: number
  // stopped early because the step budget ran out
  aborted: boolean
  events: TraceEvent[]
}

class Abort extends Error {}

export interface RunOptions {
  // record at most this many events (the step counter keeps going)
  record?: number
  // give up after this many steps
  maxSteps?: number
}

export function run(pattern: string, input: string, { record = Infinity, maxSteps = 5_000_000 }: RunOptions = {}): MatchResult {
  const root = parse(pattern)
  const events: TraceEvent[] = []
  let steps = 0
  let start = 0
  const emit = (e: Omit<TraceEvent, 'start'>) => {
    steps++
    if (events.length < record) events.push({ ...e, start })
    if (steps > maxSteps) throw new Abort()
  }

  type K = (pos: number) => boolean
  const label = (n: Node) => pattern.slice(n.span[0], n.span[1])

  const m = (node: Node, pos: number, k: K): boolean => {
    switch (node.t) {
      case 'atom': {
        const ch = input[pos]
        if (ch !== undefined && node.test(ch)) {
          emit({ kind: 'char-ok', span: node.span, pos, label: node.label, ch })
          return k(pos + 1)
        }
        emit({ kind: 'char-fail', span: node.span, pos, label: node.label, ...(ch !== undefined ? { ch } : {}) })
        return false
      }
      case 'start':
      case 'end': {
        const ok = node.t === 'start' ? pos === 0 : pos === input.length
        emit({ kind: ok ? 'anchor-ok' : 'anchor-fail', span: node.span, pos, label: node.t === 'start' ? '^' : '$' })
        return ok && k(pos)
      }
      case 'seq': {
        const go = (idx: number, p: number): boolean => (idx === node.items.length ? k(p) : m(node.items[idx]!, p, (q) => go(idx + 1, q)))
        return go(0, pos)
      }
      case 'alt': {
        for (let idx = 0; idx < node.options.length; idx++) {
          const opt = node.options[idx]!
          if (idx > 0) emit({ kind: 'alt-next', span: opt.span, pos, label: label(opt), count: idx })
          if (m(opt, pos, k)) return true
        }
        return false
      }
      case 'group':
        return m(node.body, pos, k)
      case 'quant': {
        const { body, min, max, greedy } = node
        const name = label(node)
        // ES RepeatMatcher: once min is reached, an iteration that matched empty fails
        const loop = (count: number, p: number): boolean => {
          if (greedy) {
            let deeper = false
            if (count < max) {
              const more = m(body, p, (q) => {
                if (q === p && count >= min) return false
                deeper = true
                return loop(count + 1, q)
              })
              if (more) return true
            }
            if (count < min) return false
            emit({ kind: deeper ? 'give-back' : 'quant-stop', span: node.span, pos: p, label: name, count })
            return k(p)
          }
          if (count >= min) {
            emit({ kind: 'lazy-rest', span: node.span, pos: p, label: name, count })
            if (k(p)) return true
            if (count < max) emit({ kind: 'lazy-more', span: node.span, pos: p, label: name, count })
          }
          if (count >= max) return false
          return m(body, p, (q) => (q === p && count >= min ? false : loop(count + 1, q)))
        }
        return loop(0, pos)
      }
    }
  }

  try {
    for (start = 0; start <= input.length; start++) {
      emit({ kind: 'start', span: null, pos: start, label: '' })
      let end = -1
      if (m(root, start, (p) => ((end = p), true))) {
        emit({ kind: 'success', span: [0, pattern.length], pos: end, label: pattern })
        return { match: { index: start, text: input.slice(start, end) }, steps, aborted: false, events }
      }
    }
    start = input.length
    emit({ kind: 'no-match', span: null, pos: input.length, label: '' })
    return { match: null, steps, aborted: false, events }
  } catch (e) {
    if (e instanceof Abort) return { match: null, steps, aborted: true, events }
    throw e
  }
}

export function countSteps(pattern: string, input: string, maxSteps = 5_000_000): number {
  return run(pattern, input, { record: 0, maxSteps }).steps
}
