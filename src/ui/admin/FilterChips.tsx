import Link from 'next/link'
import { PiXBold } from 'react-icons/pi'

// Active filters as removable chips (each a link to the same view without it) + «Скинути все».
export interface Chip {
  key: string
  label: string
  value: string
  removeHref: string
}

export function FilterChips({ chips, clearHref }: { chips: Chip[]; clearHref: string }) {
  if (chips.length === 0) return null
  return (
    <div className="ana-chips" role="group" aria-label="Активні фільтри">
      {chips.map((c) => (
        <span key={c.key} className="ana-chip">
          <span className="ana-chip-key">{c.label}</span>
          <span className="ana-chip-value">{c.value}</span>
          <Link href={c.removeHref} className="ana-chip-x" aria-label={`Прибрати фільтр «${c.label}: ${c.value}»`} scroll={false}>
            <PiXBold aria-hidden="true" />
          </Link>
        </span>
      ))}
      {chips.length > 1 ? (
        <Link href={clearHref} className="ana-chip-clear" scroll={false}>
          Скинути все
        </Link>
      ) : null}
    </div>
  )
}
