'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { FlashRating } from '@/progress/types'
import { interval } from '@/ui/format'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { Tag } from '@/ui/Tag'
import type { FlashItem } from './render-items'

const RATINGS: Array<{ key: FlashRating; label: string; hotkey: string }> = [
  { key: 'again', label: 'Не знав', hotkey: '1' },
  { key: 'hard', label: 'Важко', hotkey: '2' },
  { key: 'good', label: 'Знав', hotkey: '3' },
]

type Phase = 'front' | 'out' | 'in' | 'back'

export function FlashcardCard({ item, onRate, disabled }: { item: FlashItem; onRate: (rating: FlashRating, durationMs: number) => void; disabled: boolean }) {
  const [phase, setPhase] = useState<Phase>('front')
  const started = useRef(0)
  const feedback = useFeedback()
  const cardRef = useRef<HTMLDivElement>(null)
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    started.current = Date.now()
    cardRef.current?.focus({ preventScroll: true })
  }, [item.unitId])

  const flip = useCallback(() => {
    if (phase !== 'front') return
    feedback.play('flip')
    setPhase(reduce.current ? 'back' : 'out')
  }, [phase, feedback])

  const rate = useCallback(
    (rating: FlashRating) => {
      if ((phase !== 'back' && phase !== 'in') || disabled) return
      onRate(rating, Date.now() - started.current)
    },
    [phase, disabled, onRate],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === ' ' || e.key === 'Enter') {
        if (phase === 'front') {
          e.preventDefault()
          flip()
        }
      } else if (e.key === '1' || e.key === '2' || e.key === '3') {
        e.preventDefault()
        rate(RATINGS[Number(e.key) - 1]!.key)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, flip, rate])

  const showBack = phase === 'in' || phase === 'back'

  return (
    <div
      ref={cardRef}
      tabIndex={-1}
      className="flashcard"
      data-phase={phase}
      onAnimationEnd={() => {
        if (phase === 'out') setPhase('in')
        else if (phase === 'in') setPhase('back')
      }}
    >
      <div className="flashcard-meta">
        {item.level ? <Tag>{item.level}</Tag> : null}
        {item.meta.map((m) => (
          <Tag key={m}>{m}</Tag>
        ))}
        <Link href={item.chapterHref} className="flashcard-source" target="_blank">
          {item.chapterTitle}
        </Link>
      </div>
      {!showBack ? (
        <>
          <div className="flashcard-question">{item.question}</div>
          <button type="button" className="flashcard-reveal" onClick={flip}>
            Показати відповідь <kbd>Пробіл</kbd>
          </button>
        </>
      ) : (
        <>
          <div className="flashcard-question flashcard-question-small">{item.question}</div>
          <div className="flashcard-answer prose-flow">{item.answer}</div>
          <div className="flashcard-rate" role="group" aria-label="Наскільки добре ви знали відповідь">
            {RATINGS.map((r) => (
              <button key={r.key} type="button" className="rate-button" data-rating={r.key} onClick={() => rate(r.key)} disabled={(phase !== 'back' && phase !== 'in') || disabled}>
                <span className="rate-label">{r.label}</span>
                <span className="rate-interval">через {interval(item.intervals[r.key])}</span>
                <kbd>{r.hotkey}</kbd>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
