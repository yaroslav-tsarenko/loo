'use client'

import { m } from 'motion/react'
import { useState } from 'react'
import { Panel, SPRING } from '../engine/Panel'
import type { VizProps } from '../engine/types'
import { MAX_INPUT, UNICODE_PRESETS, analyze, visible, type Grapheme } from './analyze'

const byteHex = (b: number) => b.toString(16).toUpperCase().padStart(2, '0')

function GraphemeBlock({ g, index }: { g: Grapheme; index: number }) {
  const many = g.codePoints.length > 1
  return (
    <m.li className="viz-uni-g" data-many={many ? '' : undefined} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { ...SPRING, delay: Math.min(index, 8) * 0.04 } }}>
      <div className="viz-uni-glyph" aria-label={`Графема ${index + 1}: ${g.text}`}>
        {g.text === ' ' ? '␣' : g.text}
      </div>
      <ul className="viz-uni-cps">
        {g.codePoints.map((cp, i) => (
          <li key={i} className="viz-uni-cp">
            <span className="viz-uni-cp-char" aria-hidden="true">
              {visible(cp.char)}
            </span>
            <code className="viz-uni-cp-label">{cp.label}</code>
            {cp.role ? <span className="viz-uni-role">{cp.role}</span> : null}
            <span className="viz-uni-row" aria-label={`UTF-16: ${cp.units.map((u) => u.hex).join(' ')}`}>
              {cp.units.map((u, j) => (
                <code key={j} className="viz-uni-unit" data-kind={u.kind} title={u.kind === 'high' ? 'старший сурогат' : u.kind === 'low' ? 'молодший сурогат' : 'BMP'}>
                  {u.hex}
                </code>
              ))}
            </span>
            <span className="viz-uni-row" aria-label={`UTF-8: ${cp.bytes.map(byteHex).join(' ')}`}>
              {cp.bytes.map((b, j) => (
                <code key={j} className="viz-uni-byte">
                  {byteHex(b)}
                </code>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </m.li>
  )
}

function ArrayView({ items }: { items: readonly string[] }) {
  return (
    <span className="viz-uni-array">
      [
      {items.map((s, i) => (
        <code key={i} data-broken={/\\u[Dd][89A-Fa-f]/.test(s) || s.startsWith('◌') ? '' : undefined}>
          &apos;{s}&apos;
        </code>
      ))}
      ]
    </span>
  )
}

export function UnicodeViz(_props: VizProps) {
  const first = UNICODE_PRESETS[3]!
  const [text, setText] = useState(first.text)
  const [presetId, setPresetId] = useState<string | null>(first.id)
  const a = analyze(text)
  const preset = UNICODE_PRESETS.find((p) => p.id === presetId)
  const isCafe = presetId === 'cafe-nfc' || presetId === 'cafe-nfd'
  const precomposed: string = 'caf\u00E9'
  const decomposed: string = 'cafe\u0301'
  const segments = a.graphemes.map((g) => visible(g.text))

  return (
    <div className="viz-uni">
      <div className="viz-presets" role="group" aria-label="Рядок">
        <span className="viz-presets-label">Рядок:</span>
        {UNICODE_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className="viz-chip"
            aria-pressed={presetId === p.id}
            onClick={() => {
              setText(p.text)
              setPresetId(p.id)
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="viz-field">
        <input
          type="text"
          value={text}
          maxLength={MAX_INPUT}
          autoComplete="off"
          spellCheck={false}
          aria-label="Свій рядок"
          placeholder="введи свій рядок"
          onChange={(e) => {
            setText(e.target.value)
            setPresetId(null)
          }}
        />
      </div>

      <div className="viz-uni-counts" role="list" aria-label="Довжина рядка різними способами">
        <div role="listitem" data-tone="units">
          <code>s.length</code>
          <strong className="tabular">{a.counts.length}</strong>
          <span>UTF-16 code units</span>
        </div>
        <div role="listitem" data-tone="cps">
          <code>[...s].length</code>
          <strong className="tabular">{a.counts.codePoints}</strong>
          <span>code points</span>
        </div>
        <div role="listitem" data-tone="graphemes">
          <code>Intl.Segmenter</code>
          <strong className="tabular">{a.counts.graphemes}</strong>
          <span>графеми — «символи» для людини</span>
        </div>
        <div role="listitem" data-tone="bytes">
          <code>TextEncoder</code>
          <strong className="tabular">{a.counts.bytes}</strong>
          <span>байти UTF-8 (byteLength)</span>
        </div>
      </div>

      <Panel title="Графема → code points → UTF-16 → UTF-8" emoji="🔬" hint={a.text ? undefined : 'порожній рядок'}>
        <div className="viz-uni-legend" aria-hidden="true">
          <span data-tone="cps">U+… code point</span>
          <span data-tone="units">UTF-16 unit</span>
          <span data-tone="surrogate">сурогатна пара</span>
          <span data-tone="bytes">UTF-8 байт</span>
        </div>
        <ul className="viz-uni-graphemes">
          {a.graphemes.map((g, i) => (
            <GraphemeBlock key={`${i}:${g.text}`} g={g} index={i} />
          ))}
        </ul>
      </Panel>

      <Panel title="Що ріже рядок" emoji="✂️">
        <ul className="viz-uni-ops">
          <li>
            <code>s.split(&apos;&apos;)</code>
            <ArrayView items={a.split} />
            <span className="viz-muted">ріже по code units: сурогатні пари й склеєні символи розпадаються</span>
          </li>
          <li>
            <code>[...s]</code>
            <ArrayView items={[...a.text].map(visible)} />
            <span className="viz-muted">ітератор іде по code points: пари цілі, але ZWJ, наголоси й модифікатори — окремо</span>
          </li>
          <li>
            <code>Intl.Segmenter</code>
            <ArrayView items={segments} />
            <span className="viz-muted">графеми — те, що бачить людина</span>
          </li>
          <li>
            <code>s.slice(0, 1)</code>
            <span className="viz-uni-array">
              <code data-broken={/\\u[Dd][89A-Fa-f]/.test(a.sliceFirst) ? '' : undefined}>&apos;{a.sliceFirst}&apos;</code>
            </span>
            <span className="viz-muted">slice, substring і s[i] рахують code units</span>
          </li>
        </ul>
      </Panel>

      <Panel title="Нормалізація" emoji="🧽">
        <ul className="viz-fp-facts">
          <li>
            <code>s.normalize(&apos;NFC&apos;).length</code> <strong>{a.nfc.length}</strong>
          </li>
          <li>
            <code>s.normalize(&apos;NFD&apos;).length</code> <strong>{a.nfd.length}</strong>
          </li>
          <li>
            <code>s === s.normalize(&apos;NFC&apos;)</code> <strong>{String(a.text === a.nfc.text)}</strong>
          </li>
          {isCafe ? (
            <>
              <li>
                <code>&apos;café&apos; (NFC) === &apos;café&apos; (NFD)</code> <strong>{String(precomposed === decomposed)}</strong>
              </li>
              <li>
                <code>… після .normalize() обох</code> <strong>{String(precomposed.normalize() === decomposed.normalize())}</strong>
              </li>
            </>
          ) : null}
        </ul>
        <p className="viz-muted">NFC складає «букву + знак» в одну готову літеру, де вона існує; NFD розкладає. Порівнюй і зберігай рядки в одній формі (зазвичай NFC).</p>
      </Panel>

      {preset ? (
        <p className="viz-note viz-fp-insight">
          <span aria-hidden="true">💡</span> {preset.insight}
        </p>
      ) : null}
    </div>
  )
}
