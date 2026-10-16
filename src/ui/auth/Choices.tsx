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

// `icon`: a pixel icon / Loo form shown before the title (never an emoji in the title text).
export function Choice({ type, name, value, defaultChecked, required, title, sub, icon }: { type: 'radio' | 'checkbox'; name: string; value: string; defaultChecked?: boolean; required?: boolean; title: ReactNode; sub?: ReactNode; icon?: ReactNode }) {
  return (
    <label className="choice">
      <input type={type} name={name} value={value} defaultChecked={defaultChecked} required={required} />
      <span className="choice-title">
        {icon ? (
          <span className="choice-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {title}
      </span>
      {sub ? <span className="choice-sub">{sub}</span> : null}
    </label>
  )
}
