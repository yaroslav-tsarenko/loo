import dynamic from 'next/dynamic'
import type { CSSProperties } from 'react'
import { parseIconRef } from './ref'
import type { LucideName } from './sets/lucide'
import type { PiName } from './sets/pi'
import type { SiName } from './sets/si'
import type { TbName } from './sets/tb'

// Each set is its own chunk: a page that only shows emoji never downloads brand SVGs.
const SiGlyph = dynamic(() => import('./sets/si'))
const PiGlyph = dynamic(() => import('./sets/pi'))
const TbGlyph = dynamic(() => import('./sets/tb'))
const LucideGlyph = dynamic(() => import('./sets/lucide'))

export type IconName = `si:${SiName}` | `pi:${PiName}` | `tb:${TbName}` | `lucide:${LucideName}` | `emoji:${string}`

export interface IconProps {
  /** `si:SiReact`, `pi:PiFireFill`, `tb:TbBrain`, `lucide:Flame`, `emoji:🔥` or a bare emoji. Unknown strings render the fallback. */
  name: IconName | (string & {})
  size?: number
  /** Accessible name. Without it the icon is decorative. */
  label?: string
  /** Brand icons: drop the brand color and inherit currentColor. */
  mono?: boolean
  /** Tint for non-brand icons (any CSS color, e.g. `var(--lu-orange)`). */
  color?: string
  fallback?: string
  className?: string
}

export function Icon({ name, size = 20, label, mono, color, fallback = '•', className }: IconProps) {
  const ref = parseIconRef(name)
  const style = { '--lu-icon-size': `${size}px`, color } as CSSProperties
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const }
  const cls = className ? `lu-icon ${className}` : 'lu-icon'
  if (!ref || ref.set === 'emoji') {
    return (
      <span className={cls} data-emoji="" style={style} {...a11y}>
        {ref?.name ?? fallback}
      </span>
    )
  }
  const glyph = { name: ref.name, size, mono }
  return (
    <span className={cls} style={style} {...a11y}>
      {ref.set === 'si' ? <SiGlyph {...glyph} /> : ref.set === 'pi' ? <PiGlyph {...glyph} /> : ref.set === 'tb' ? <TbGlyph {...glyph} /> : <LucideGlyph {...glyph} />}
    </span>
  )
}
