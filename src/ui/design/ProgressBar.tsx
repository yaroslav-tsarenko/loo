import type { CSSProperties } from 'react'
import { clamp01, cx, type Tone } from './cx'

interface ProgressBarProps {
  /** 0…1 */
  value: number
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  /** Moving diagonal stripes on the fill (for active/boosted states). */
  striped?: boolean
  label: string
  /** Visible value text, e.g. "12/20". */
  valueText?: string
  className?: string
}

// Rounded game bar with a glossy highlight; width animates with a little overshoot.
export function ProgressBar({ value, tone = 'green', size = 'md', striped, label, valueText, className }: ProgressBarProps) {
  const v = clamp01(value)
  return (
    <div
      className={cx('lu-progress', className)}
      data-tone={tone}
      data-size={size}
      data-striped={striped ? '' : undefined}
      data-empty={v === 0 ? '' : undefined}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
      aria-valuetext={valueText}
      style={{ '--v': v } as CSSProperties}
    >
      <span className="lu-progress-fill" />
      {valueText ? <span className="lu-progress-text">{valueText}</span> : null}
    </div>
  )
}
