'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PiArrowSquareOutBold, PiEyeFill } from 'react-icons/pi'
import type { FlashRating } from '@/progress/types'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import type { FlashItem } from './render-items'
import { RateButtons } from './RateButtons'

const HOTKEYS: Record<string, FlashRating> = { '1': 'again', '2': 'hard', '3': 'good' }

// Two faces on one grid cell; flipping rotates the card in 3D. The hidden face is inert so focus and screen readers skip it.
export function FlashcardCard({ item, onRate, disabled }: { item: FlashItem; onRate: (rating: FlashRating, durationMs: number) => void; disabled: boolean }) {
  const [flipped, setFlipped] = useState(false)
  const started = useRef(0)
  const feedback = useFeedback()
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    started.current = Date.now()
    cardRef.current?.focus({ preventScroll: true })
  }, [item.unitId])

  const flip = useCallback(() => {
    if (flipped) return
    feedback.play('flip')
    setFlipped(true)
  }, [flipped, feedback])

  const rate = useCallback(
    (rating: FlashRating) => {
      if (!flipped || disabled) return
      onRate(rating, Date.now() - started.current)
    },
    [flipped, disabled, onRate],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === ' ' || e.key === 'Enter') {
        if (!flipped) {
          e.preventDefault()
          flip()
        }
      } else if (HOTKEYS[e.key]) {
        e.preventDefault()
        rate(HOTKEYS[e.key]!)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipped, flip, rate])

  const meta = (
    <div className="flashcard-meta">
      {item.level ? (
        <Pill size="sm" tone="purple">
          {item.level}
        </Pill>
      ) : null}
      {item.meta.map((m) => (
        <Pill key={m} size="sm">
          {m}
        </Pill>
      ))}
      <Link href={item.chapterHref} className="flashcard-source" target="_blank">
        {item.chapterTitle} <PiArrowSquareOutBold aria-hidden="true" />
      </Link>
    </div>
  )

  return (
    <>
      <div ref={cardRef} tabIndex={-1} className="flashcard" data-flipped={flipped ? '' : undefined}>
        <div className="flashcard-inner">
          <div className="flashcard-face flashcard-front" inert={flipped} aria-hidden={flipped || undefined}>
            {meta}
            <div className="flashcard-question">{item.question}</div>
            <Button variant="secondary" size="lg" block icon={<PiEyeFill size={20} />} onClick={flip}>
              Показати відповідь
            </Button>
            <span className="flashcard-hint">або Пробіл</span>
          </div>
          <div className="flashcard-face flashcard-back" inert={!flipped} aria-hidden={!flipped || undefined}>
            {meta}
            <div className="flashcard-question flashcard-question-small">{item.question}</div>
            {flipped ? <div className="flashcard-answer prose-flow">{item.answer}</div> : null}
          </div>
        </div>
      </div>
      {flipped ? <RateButtons onRate={rate} disabled={disabled} intervals={item.intervals} /> : null}
    </>
  )
}
