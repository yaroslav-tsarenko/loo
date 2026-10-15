import type { ReactNode } from 'react'

// Big tappable radio / checkbox tiles (no JS: styled via :has(:checked) in auth.css).
export function ChoiceGroup({ legend, hint, children, wide }: { legend: string; hint?: string; children: ReactNode; wide?: boolean }) {
  return (
    <fieldset className="choice-group" data-wide={wide ? '' : undefined}>
      <legend className="choice-legend">{legend}</legend>
      {hint ? <p className="choice-hint">{hint}</p> : null}
      <div className="choice-grid">{children}</div>
    </fieldset>
  )
}

export function Choice({ type, name, value, defaultChecked, required, title, sub }: { type: 'radio' | 'checkbox'; name: string; value: string; defaultChecked?: boolean; required?: boolean; title: ReactNode; sub?: ReactNode }) {
  return (
    <label className="choice">
      <input type={type} name={name} value={value} defaultChecked={defaultChecked} required={required} />
      <span className="choice-title">{title}</span>
      {sub ? <span className="choice-sub">{sub}</span> : null}
    </label>
  )
}
