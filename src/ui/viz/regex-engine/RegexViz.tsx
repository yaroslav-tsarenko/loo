'use client'

import { useState } from 'react'
import { Badge, Panel, TokenList } from '../engine/Panel'
import { StepPlayer } from '../engine/StepPlayer'
import type { VizProps } from '../engine/types'
import { REGEX_EXAMPLES, buildRegexScenario, explosionTable, type RegexFrame } from './scenarios'

const KIND: Record<RegexFrame['kind'], { label: string; tone: 'ok' | 'fail' | 'back' | 'info' }> = {
  start: { label: 'старт', tone: 'info' },
  'char-ok': { label: 'символ ✓', tone: 'ok' },
  'char-fail': { label: 'провал', tone: 'fail' },
  'anchor-ok': { label: 'якір ✓', tone: 'ok' },
  'anchor-fail': { label: 'якір ✗', tone: 'fail' },
  'quant-stop': { label: 'жадібно взято', tone: 'info' },
  'give-back': { label: 'backtrack', tone: 'back' },
  'lazy-rest': { label: 'лінивий: далі', tone: 'info' },
  'lazy-more': { label: 'backtrack', tone: 'back' },
  'alt-next': { label: 'backtrack', tone: 'back' },
  success: { label: 'збіг ✓', tone: 'ok' },
  'no-match': { label: 'збігу немає', tone: 'fail' },
  skip: { label: 'пропуск »', tone: 'info' },
}

function PatternView({ f }: { f: RegexFrame }) {
  const [a, b] = f.span ?? [-1, -1]
  const tone = KIND[f.kind].tone
  return (
    <div className="viz-rx-cells viz-rx-pattern" aria-label={`Шаблон /${f.pattern}/`}>
      <span className="viz-rx-slash">/</span>
      {f.pattern.split('').map((c, i) => (
        <span key={i} className="viz-rx-cell" data-active={i >= a && i < b ? tone : undefined}>
          {c}
        </span>
      ))}
      <span className="viz-rx-slash">/</span>
    </div>
  )
}

function InputView({ f }: { f: RegexFrame }) {
  const matched = f.result !== null
  const cells = [...f.input.split(''), '']
  return (
    <div className="viz-rx-cells viz-rx-input" role="img" aria-label={`Рядок «${f.input}», позиція ${f.pos}, старт ${f.start}`}>
      {cells.map((c, i) => {
        const inAttempt = i >= f.start && i < f.pos
        const state = matched && inAttempt ? 'match' : i === f.pos && f.kind !== 'skip' ? KIND[f.kind].tone : inAttempt ? 'taken' : i < f.start ? 'past' : undefined
        return (
          <span key={i} className="viz-rx-slot">
            <span className="viz-rx-cell" data-state={state} data-end={c === '' ? '' : undefined}>
              {c === '' ? '⊣' : c === ' ' ? '␣' : c}
            </span>
            <span className="viz-rx-index">{i}</span>
            {i === f.start ? <span className="viz-rx-start" aria-hidden="true">▲</span> : null}
          </span>
        )
      })}
    </div>
  )
}

function Explosion() {
  const rows = explosionTable()
  const max = Math.max(...rows.map((r) => r.nested))
  return (
    <Panel title="Скільки кроків: (a+)+b проти a+b" icon="px:bomb" hint="рядок 'a'.repeat(n) + 'c'">
      <div className="viz-rx-chart" role="table" aria-label="Кількість кроків залежно від довжини рядка">
        <div className="viz-rx-chart-row viz-muted" role="row">
          <span role="columnheader">n</span>
          <span role="columnheader">кроки нашої моделі</span>
        </div>
        {rows.map((r) => (
          <div key={r.n} className="viz-rx-chart-row" role="row">
            <span role="rowheader" className="tabular">
              {r.n}
            </span>
            <span role="cell" className="viz-rx-bars">
              <span className="viz-rx-bar" data-tone="nested">
                <span style={{ width: `${(r.nested / max) * 100}%` }} />
                <code className="tabular">{r.nested.toLocaleString('uk-UA')}</code>
              </span>
              <span className="viz-rx-bar" data-tone="flat">
                <span style={{ width: `${(r.flat / max) * 100}%` }} />
                <code className="tabular">{r.flat.toLocaleString('uk-UA')}</code>
              </span>
            </span>
          </div>
        ))}
      </div>
      <p className="viz-muted">
        <span className="viz-rx-key" data-tone="nested" /> <code>(a+)+b</code> — кожна нова «a» майже подвоює роботу (2ⁿ розбиттів). <span className="viz-rx-key" data-tone="flat" /> <code>a+b</code> — росте поліноміально. Справжній рушій (V8 Irregexp) рахує інакше, але експонента та сама.
      </p>
    </Panel>
  )
}

function Stage({ f }: { f: RegexFrame }) {
  const kind = KIND[f.kind]
  return (
    <>
      <Panel title="Шаблон" icon="pi:PiPuzzlePieceFill" hint={f.kind === 'skip' ? undefined : f.span ? 'активний токен підсвічено' : undefined}>
        <PatternView f={f} />
      </Panel>
      <Panel title="Рядок" icon="px:letterTile" hint={`▲ старт ${f.start} · позиція ${f.pos}`}>
        <InputView f={f} />
      </Panel>
      <div className="viz-rx-status">
        <span className="viz-rx-counter tabular" aria-label={`Кроків: ${f.step}`}>
          <span className="viz-muted">кроків</span> <strong>{f.step}</strong>
        </span>
        <Badge tone={kind.tone === 'ok' ? 'success' : kind.tone === 'info' ? 'accent' : undefined}>
          <span data-rx-tone={kind.tone}>{kind.label}</span>
        </Badge>
      </div>
    </>
  )
}

export function RegexViz(_props: VizProps) {
  const [id, setId] = useState<string>(REGEX_EXAMPLES[0]!.id)
  const ex = REGEX_EXAMPLES.find((e) => e.id === id) ?? REGEX_EXAMPLES[0]!
  const scenario = buildRegexScenario(ex.id)
  return (
    <>
      <div className="viz-presets" role="group" aria-label="Приклад">
        <span className="viz-presets-label">Приклад:</span>
        {REGEX_EXAMPLES.map((e) => (
          <button key={e.id} type="button" className="viz-chip viz-chip-code" aria-pressed={e.id === ex.id} onClick={() => setId(e.id)}>
            <code>/{e.pattern}/</code> <span className="viz-muted">{e.title}</span>
          </button>
        ))}
      </div>
      <StepPlayer
        key={ex.id}
        scenario={scenario}
        label={`Пошук /${ex.pattern}/ у «${ex.input}»`}
        side={(f) => <Stage f={f} />}
        below={(f) => (
          <Panel title="Журнал" icon="px:scroll" hint="останні кроки">
            <TokenList items={f.log} />
          </Panel>
        )}
      />
      {ex.id === 'catastrophic' || ex.id === 'safe' ? (
        <div className="viz-rx-after">
          <Explosion />
        </div>
      ) : null}
    </>
  )
}
