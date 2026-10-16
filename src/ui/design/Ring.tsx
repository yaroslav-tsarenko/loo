import type { ReactNode } from 'react'
import { clamp01, cx, type Tone } from './cx'

interface RingProps {
  value: number
  size?: number
  stroke?: number
  tone?: Tone
  label: string
  children?: ReactNode
  className?: string
}

// Circular progress (lesson nodes, daily goal). Center slot holds an icon or number.
export function Ring({ value, size = 64, stroke = 7, tone = 'violet', label, children, className }: RingProps) {
  const v = clamp01(value)
  const r = (size - stroke) / 2
  return (
    <span className={cx('lu-ring', className)} data-tone={tone} style={{ width: size, height: size }} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="lu-ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle className="lu-ring-fill" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} pathLength={100} strokeDasharray="100" strokeDashoffset={100 - v * 100} />
      </svg>
      {children != null ? <span className="lu-ring-center">{children}</span> : null}
    </span>
  )
}
