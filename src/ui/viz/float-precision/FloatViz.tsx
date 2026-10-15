'use client'

import { m } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { Badge, Panel, SPRING } from '../engine/Panel'
import type { VizProps } from '../engine/types'
import { FLOAT_PRESETS, decompose, evaluate, exactDecimal, formula, nextDown, nextUp, shortest, significandValue, ulpDistance, ulpPower, type FloatKind, type FloatParts } from './ieee754'

const KIND_LABEL: Record<FloatKind, string> = {
  zero: 'нуль',
  subnormal: 'денормалізоване',
  normal: 'нормалізоване',
  infinity: 'нескінченність',
  nan: 'NaN',
}

const FIELDS = [
  { id: 'sign', label: 'знак', from: 0, to: 1 },
  { id: 'exp', label: 'експонента · 11', from: 1, to: 12 },
  { id: 'frac', label: 'мантиса · 52', from: 12, to: 64 },
] as const

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
const sup = (n: number) => String(n).replace(/[-\d]/g, (c) => SUP[c] ?? c)

// 1e-7 → 0.0000001 (to compare console output with the exact expansion)
function plain(s: string): string {
  const match = /^(-?)(\d+)(?:\.(\d+))?e([+-]\d+)$/.exec(s)
  if (!match) return s
  const [, sign = '', int = '', frac = '', e = '0'] = match
  const digits = int + frac
  const point = int.length + Number(e)
  if (point <= 0) return `${sign}0.${'0'.repeat(-point)}${digits}`
  if (point >= digits.length) return sign + digits + '0'.repeat(point - digits.length)
  return `${sign}${digits.slice(0, point)}.${digits.slice(point)}`
}

function chunks(from: number, to: number): Array<[number, number]> {
  const out: Array<[number, number]> = []
  for (let i = from; i < to; i += 4) out.push([i, Math.min(i + 4, to)])
  return out
}

function BitRow({ parts, against, label }: { parts: FloatParts; against?: FloatParts; label?: string }) {
  return (
    <div className="viz-fp-bits" role="img" aria-label={`${label ?? 'Біти'}: ${parts.binary.slice(0, 1)} ${parts.binary.slice(1, 12)} ${parts.binary.slice(12)}`}>
      {FIELDS.map((f) => (
        <span key={f.id} className="viz-fp-field" data-field={f.id}>
          {chunks(f.from, f.to).map(([a, b]) => (
            <span key={a} className="viz-fp-chunk">
              {parts.binary
                .slice(a, b)
                .split('')
                .map((bit, j) => {
                  const i = a + j
                  const diff = against && against.binary[i] !== bit
                  return (
                    <span key={i} className="viz-fp-bit" data-on={bit === '1' ? '' : undefined} data-diff={diff ? '' : undefined}>
                      {bit}
                    </span>
                  )
                })}
            </span>
          ))}
        </span>
      ))}
    </div>
  )
}

function FormulaView({ parts }: { parts: FloatParts }) {
  const f = formula(parts)
  const s = parts.sign ? '−' : '+'
  if (f.kind === 'nan') return <p className="viz-fp-formula">експонента = 2047 (усі одиниці), мантиса ≠ 0 → <strong>NaN</strong></p>
  if (f.kind === 'infinity') return <p className="viz-fp-formula">експонента = 2047 (усі одиниці), мантиса = 0 → <strong>{s}Infinity</strong></p>
  if (f.kind === 'zero') return <p className="viz-fp-formula">експонента = 0 і мантиса = 0 → <strong>{parts.sign ? '−0' : '+0'}</strong>: окремий біт знаку, тому нулів два</p>
  const sig = significandValue(parts)
  return (
    <div className="viz-fp-formula">
      <code>
        (−1)<sup>{parts.sign}</sup> × <span data-field="frac">{f.significand}</span>₂ × 2<sup>{f.kind === 'normal' ? `${f.stored} − 1023` : '−1022'}</sup>
      </code>
      <code>
        = {s}
        {sig} × 2{sup(f.power ?? 0)}
      </code>
      <p className="viz-muted">{f.kind === 'normal' ? 'Провідна 1 прихована — її не зберігають, тож точність 53 біти.' : 'Денормалізоване: експонента 0, прихованої 1 немає, степінь зафіксовано на −1022.'}</p>
    </div>
  )
}

function ExactView({ x }: { x: number }) {
  const exact = exactDecimal(x)
  const printed = shortest(x)
  if (!Number.isFinite(x)) return null
  const expanded = plain(printed)
  const same = expanded === exact
  let common = 0
  while (common < exact.length && exact[common] === expanded[common]) common++
  return (
    <Panel title="Що насправді лежить у пам’яті" emoji="🔎" hint={same ? 'точно' : 'наближено'}>
      <p className="viz-fp-exact">
        <code>
          {exact.slice(0, common)}
          <mark data-tone={same ? 'success' : 'danger'}>{exact.slice(common)}</mark>
        </code>
      </p>
      <p className="viz-muted">
        {same ? (
          <>
            console.log(…) → <code>{printed}</code> — і це рівно те саме число.
          </>
        ) : (
          <>
            console.log(…) → <code>{printed}</code>: найкоротший рядок, з якого відновиться той самий double. Сам double — інший.
          </>
        )}
      </p>
    </Panel>
  )
}

function Neighbours({ x }: { x: number }) {
  const power = ulpPower(x)
  if (power === null) return null
  const prev = nextDown(x)
  const next = nextUp(x)
  const gap = 2 ** power
  return (
    <Panel title="Сусіди на «лінійці»" emoji="📏" hint={`крок = 2${sup(power)}`}>
      <div className="viz-fp-ruler">
        <div className="viz-fp-tick">
          <span className="viz-muted">попередній</span>
          <code>{shortest(prev)}</code>
        </div>
        <div className="viz-fp-tick" data-current="">
          <span className="viz-muted">це число</span>
          <code>{shortest(x)}</code>
        </div>
        <div className="viz-fp-tick">
          <span className="viz-muted">наступний</span>
          <code>{shortest(next)}</code>
        </div>
      </div>
      <p className="viz-muted">
        Між ними немає жодного double. Крок (ULP) ≈ <code>{shortest(gap)}</code>
        {Number.isInteger(x) && Math.abs(x) >= 2 ** 53 ? ' — уже більший за 1, тож не кожне ціле має свій double.' : '; що далі від нуля, то він більший.'}
      </p>
    </Panel>
  )
}

function Compare() {
  const sum = decompose(0.1 + 0.2)
  const target = decompose(0.3)
  const diff = Math.abs(sum.value - target.value)
  return (
    <Panel title="0.1 + 0.2 проти 0.3" emoji="⚖️" hint={`різниця ${ulpDistance(sum.value, target.value)} ULP`}>
      <div className="viz-fp-compare">
        <span className="viz-fp-compare-label">
          <code>0.1 + 0.2</code> <code className="viz-muted">0x{sum.hex}</code>
        </span>
        <BitRow parts={sum} against={target} label="0.1 + 0.2" />
        <span className="viz-fp-compare-label">
          <code>0.3</code> <code className="viz-muted">0x{target.hex}</code>
        </span>
        <BitRow parts={target} against={sum} label="0.3" />
      </div>
      <ul className="viz-fp-facts">
        <li>
          <code>0.1 + 0.2 === 0.3</code> <strong>{String(sum.value === target.value)}</strong>
        </li>
        <li>
          <code>Math.abs(0.1 + 0.2 - 0.3)</code> <strong>{shortest(diff)}</strong>
        </li>
        <li>
          <code>… {'<'} Number.EPSILON</code> <strong>{String(diff < Number.EPSILON)}</strong>
        </li>
      </ul>
      <p className="viz-muted">Біти відрізняються лише в кінці мантиси: це сусідні поділки. Порівнюй з допуском, а не через ===.</p>
    </Panel>
  )
}

// live facts: the value is computed here, not hardcoded
const FACTS: Record<string, Array<[string, () => unknown]>> = {
  '1': [
    ['1 + Number.EPSILON > 1', () => 1 + Number.EPSILON > 1],
    ['1 + Number.EPSILON / 2 === 1', () => 1 + Number.EPSILON / 2 === 1],
  ],
  '0.5': [['0.5 + 0.25 === 0.75', () => 0.5 + 0.25 === 0.75]],
  '-0': [
    ['-0 === 0', () => -0 === 0],
    ['Object.is(-0, 0)', () => Object.is(-0, 0)],
    ['1 / -0', () => 1 / -0],
  ],
  nan: [
    ['NaN === NaN', () => Number.NaN === Number.NaN],
    ['Number.isNaN(NaN)', () => Number.isNaN(NaN)],
    ['[NaN].includes(NaN)', () => [NaN].includes(NaN)],
  ],
  inf: [
    ['Number.MAX_VALUE * 2', () => Number.MAX_VALUE * 2],
    ['-1 / 0', () => -1 / 0],
  ],
  '2^53': [
    ['2 ** 53 + 1 === 2 ** 53', () => 2 ** 53 + 1 === 2 ** 53],
    ['Number.isSafeInteger(2 ** 53)', () => Number.isSafeInteger(2 ** 53)],
  ],
  '2^53+1': [
    ['2 ** 53 + 1', () => 2 ** 53 + 1],
    ['2 ** 53 + 2', () => 2 ** 53 + 2],
  ],
  eps: [
    ['Number.EPSILON === 2 ** -52', () => Number.EPSILON === 2 ** -52],
    ['1 + Number.EPSILON / 2 === 1', () => 1 + Number.EPSILON / 2 === 1],
  ],
  maxsafe: [
    ['Number.isSafeInteger(Number.MAX_SAFE_INTEGER)', () => Number.isSafeInteger(Number.MAX_SAFE_INTEGER)],
    ['MAX_SAFE_INTEGER + 1 === MAX_SAFE_INTEGER + 2', () => Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2],
  ],
  min: [
    ['Number.MIN_VALUE / 2', () => Number.MIN_VALUE / 2],
    ['Number.MIN_VALUE > 0', () => Number.MIN_VALUE > 0],
  ],
}

const show = (v: unknown) => (typeof v === 'number' ? shortest(v) : String(v))
const COMPARE_IDS = new Set(['0.1', '0.2', 'sum', '0.3'])

interface Choice {
  id: string | null
  label: string
  value: number
}

export function FloatViz(_props: VizProps) {
  const first = FLOAT_PRESETS[0]!
  const [choice, setChoice] = useState<Choice>({ id: first.id, label: first.label, value: first.value })
  const [draft, setDraft] = useState('')
  const [error, setError] = useState(false)
  const parts = decompose(choice.value)
  const preset = FLOAT_PRESETS.find((p) => p.id === choice.id)
  const facts = choice.id ? FACTS[choice.id] : undefined
  const showCompare = choice.id ? COMPARE_IDS.has(choice.id) : [0.1, 0.2, 0.3, 0.1 + 0.2].includes(choice.value)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const v = evaluate(draft)
    if (v === null) return setError(true)
    setError(false)
    setChoice({ id: null, label: draft.trim(), value: v })
  }

  return (
    <div className="viz-fp">
      <div className="viz-presets" role="group" aria-label="Число">
        <span className="viz-presets-label">Число:</span>
        {FLOAT_PRESETS.map((p) => (
          <button key={p.id} type="button" className="viz-chip viz-chip-code" aria-pressed={choice.id === p.id} onClick={() => setChoice({ id: p.id, label: p.label, value: p.value })}>
            <code>{p.label}</code>
          </button>
        ))}
      </div>
      <form className="viz-field" onSubmit={submit}>
        <input
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          value={draft}
          placeholder="своє: 1.1 * 3, 2 ** -3, 1e21…"
          aria-label="Своє число або вираз"
          aria-invalid={error || undefined}
          onChange={(e) => {
            setDraft(e.target.value)
            setError(false)
          }}
        />
        <button type="submit" className="viz-btn viz-btn-text" disabled={!draft.trim()}>
          Показати
        </button>
      </form>
      {error ? <p className="viz-field-error">Не розібрав. Підтримуються числа, + − * / **, дужки, NaN, Infinity і Number.EPSILON / MAX_SAFE_INTEGER / MIN_VALUE.</p> : null}

      <m.div key={`${choice.label}`} className="viz-fp-head" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} aria-live="polite">
        <code className="viz-fp-value">{choice.label}</code>
        {choice.label !== shortest(choice.value) ? <span className="viz-muted">→ {shortest(choice.value)}</span> : null}
        <Badge tone={parts.kind === 'normal' ? 'accent' : undefined}>{KIND_LABEL[parts.kind]}</Badge>
        {Number.isInteger(choice.value) ? <Badge tone={Number.isSafeInteger(choice.value) ? 'success' : undefined}>{Number.isSafeInteger(choice.value) ? 'безпечне ціле' : 'не safe integer'}</Badge> : null}
      </m.div>

      <Panel title="64 біти" emoji="🧮" hint={`0x${parts.hex}`}>
        <div className="viz-fp-legend" aria-hidden="true">
          {FIELDS.map((f) => (
            <span key={f.id} data-field={f.id}>
              {f.label}
            </span>
          ))}
        </div>
        <BitRow parts={parts} />
        <dl className="viz-fp-dl">
          <div data-field="sign">
            <dt>знак</dt>
            <dd>
              {parts.sign} → {parts.sign ? 'мінус' : 'плюс'}
            </dd>
          </div>
          <div data-field="exp">
            <dt>експонента</dt>
            <dd>
              {parts.exponent}
              {parts.kind === 'normal' ? ` − 1023 = ${String(parts.exponent - 1023).replace('-', '−')}` : parts.exponent === 2047 ? ' (спеціальне значення)' : ' (0 → денормалізоване або нуль)'}
            </dd>
          </div>
          <div data-field="frac">
            <dt>мантиса</dt>
            <dd>{parts.fraction === 0n ? 'усі нулі' : `остання 1 — біт №${parts.binary.slice(12).replace(/0+$/, '').length}`}</dd>
          </div>
        </dl>
        <FormulaView parts={parts} />
      </Panel>

      <ExactView x={choice.value} />
      <Neighbours x={choice.value} />
      {showCompare ? <Compare /> : null}
      {facts ? (
        <Panel title="Перевір у консолі" emoji="🖥️">
          <ul className="viz-fp-facts">
            {facts.map(([code, run]) => (
              <li key={code}>
                <code>{code}</code> <strong>{show(run())}</strong>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
      {preset ? (
        <p className="viz-note viz-fp-insight">
          <span aria-hidden="true">💡</span> {preset.insight}
        </p>
      ) : null}
    </div>
  )
}
