'use client'

import type { FlashRating } from '@/progress/types'
import { Button } from '@/ui/design/Button'
import { LooArt } from '@/ui/design/mascot/LooArt'
import type { LooMood } from '@/ui/design/mascot/Loo'
import { interval } from '@/ui/format'

// Loo's face tells the rating at a glance (instead of emoji faces).
const RATINGS: Array<{ key: FlashRating; mood: LooMood; label: string; hotkey: string }> = [
  { key: 'again', mood: 'dizzy', label: 'Не знав', hotkey: '1' },
  { key: 'hard', mood: 'thinking', label: 'Важко', hotkey: '2' },
  { key: 'good', mood: 'cheer', label: 'Знав', hotkey: '3' },
]

interface Props {
  onRate: (rating: FlashRating) => void
  disabled?: boolean
  /** Next-review previews (ms) shown under each label. */
  intervals?: Record<FlashRating, number>
  /** Highlight the picked rating (feed keeps the buttons on screen after rating). */
  chosen?: FlashRating | null
  hotkeys?: boolean
  label?: string
  className?: string
}

// Three colored 3D buttons: red «Не знав», orange «Важко», green «Знав».
export function RateButtons({ onRate, disabled, intervals, chosen, hotkeys = true, label = 'Наскільки добре ви знали відповідь', className }: Props) {
  return (
    <div className={className ? `rate-row ${className}` : 'rate-row'} role="group" aria-label={label}>
      {RATINGS.map((r) => (
        <Button
          key={r.key}
          className="rate-btn"
          data-rating={r.key}
          data-chosen={chosen === r.key ? '' : undefined}
          data-dim={chosen && chosen !== r.key ? '' : undefined}
          disabled={disabled}
          onClick={() => onRate(r.key)}
          aria-keyshortcuts={hotkeys ? r.hotkey : undefined}
        >
          <span className="rate-emoji" aria-hidden="true">
            <LooArt mood={r.mood} size={30} animated={false} decorative />
          </span>
          <span className="rate-text">
            <span className="rate-label">{r.label}</span>
            {intervals ? <span className="rate-interval">через {interval(intervals[r.key])}</span> : null}
          </span>
          {hotkeys ? (
            <kbd className="rate-key" aria-hidden="true">
              {r.hotkey}
            </kbd>
          ) : null}
        </Button>
      ))}
    </div>
  )
}
