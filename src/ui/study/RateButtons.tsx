'use client'

import type { FlashRating } from '@/progress/types'
import { Button } from '@/ui/design/Button'
import { LooArt } from '@/ui/design/mascot/LooArt'
import type { LooMood } from '@/ui/design/mascot/Loo'
import { interval } from '@/ui/format'
import type { MessageKey } from '@/i18n'
import { useT } from '@/i18n/react'

// Loo's face tells the rating at a glance (instead of emoji faces).
const RATINGS: Array<{ key: FlashRating; mood: LooMood; label: MessageKey; hotkey: string }> = [
  { key: 'again', mood: 'dizzy', label: 'rate.again', hotkey: '1' },
  { key: 'hard', mood: 'thinking', label: 'rate.hard', hotkey: '2' },
  { key: 'good', mood: 'cheer', label: 'rate.good', hotkey: '3' },
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
export function RateButtons({ onRate, disabled, intervals, chosen, hotkeys = true, label, className }: Props) {
  const t = useT()
  return (
    <div className={className ? `rate-row ${className}` : 'rate-row'} role="group" aria-label={label ?? t('rate.label')}>
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
            <span className="rate-label">{t(r.label)}</span>
            {intervals ? <span className="rate-interval">{t('lesson.inTime', { time: interval(intervals[r.key]) })}</span> : null}
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
