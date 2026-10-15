'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { hideGeneratedReel, markReelsSeen, toggleReel } from '@/server/actions/feed'
import { rateFlashcard } from '@/server/actions/study'
import type { FlashRating } from '@/progress/types'
import type { FeedSlide, ReelSlide } from '@/server/services/feed'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import type { FlashItem } from '@/ui/study/render-items'
import { QuizInline } from '@/ui/study/QuizInline'

const SEEN_AFTER_MS = 1200

function useReelTracking(onSeen: (id: string) => void) {
  const timers = useRef(new Map<string, number>())
  const observer = useRef<IntersectionObserver | null>(null)
  useEffect(() => {
    const pending = timers.current
    observer.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.reel
          if (!id) continue
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            if (!pending.has(id)) pending.set(id, window.setTimeout(() => onSeen(id), SEEN_AFTER_MS))
          } else if (pending.has(id)) {
            window.clearTimeout(pending.get(id))
            pending.delete(id)
          }
        }
      },
      { threshold: [0, 0.6, 1] },
    )
    return () => {
      observer.current?.disconnect()
      for (const t of pending.values()) window.clearTimeout(t)
      pending.clear()
    }
  }, [onSeen])
  return useCallback((el: HTMLElement | null) => {
    if (el) observer.current?.observe(el)
  }, [])
}

function AiBadge({ slide }: { slide: ReelSlide }) {
  if (!slide.sourceUrl) return <span className="reel-ai">🤖 AI</span>
  return (
    <a className="reel-ai" href={slide.sourceUrl} target="_blank" rel="noreferrer noopener" title={slide.sourceTitle ?? undefined}>
      🤖 AI · джерело ↗
    </a>
  )
}

function ReelCard({ slide }: { slide: ReelSlide }) {
  const [liked, setLiked] = useState(slide.liked)
  const [saved, setSaved] = useState(slide.saved)
  const [hidden, setHidden] = useState(false)
  const feedback = useFeedback()
  const isNews = slide.chapterHref === '/news'
  if (hidden)
    return (
      <article className="reel reel-hidden" style={{ '--reel-hue': slide.hue } as React.CSSProperties}>
        <div className="reel-main">
          <div className="reel-emoji" aria-hidden="true">
            🙈
          </div>
          <h2 className="reel-title">Сховано</h2>
          <p className="feed-end-text">Ця AI-фішка більше не з’явиться у стрічці. Гортай далі 👇</p>
        </div>
      </article>
    )
  const share = async () => {
    const text = `${slide.emoji} ${slide.title}`
    if (navigator.share) await navigator.share({ title: text, text }).catch(() => undefined)
    else await navigator.clipboard?.writeText(text)
  }
  return (
    <article className="reel" style={{ '--reel-hue': slide.hue } as React.CSSProperties}>
      <div className="reel-main">
        <div className="reel-tags">
          <span className="reel-chip">⚡ Фішка · {slide.chapterTitle}</span>
          {slide.ai ? <AiBadge slide={slide} /> : null}
        </div>
        <div className="reel-emoji" aria-hidden="true">
          {slide.emoji}
        </div>
        <h2 className="reel-title">{slide.title}</h2>
        <div className="reel-body prose-flow">{slide.body}</div>
      </div>
      <div className="reel-rail" role="group" aria-label="Дії">
        <button
          type="button"
          className="reel-action"
          aria-pressed={liked}
          onClick={() => {
            setLiked(!liked)
            if (!liked) feedback.play('correct')
            void toggleReel(slide.id, 'liked', !liked)
          }}
        >
          <span aria-hidden="true">{liked ? '❤️' : '🤍'}</span>
          <span className="reel-action-label">Клас</span>
        </button>
        <button
          type="button"
          className="reel-action"
          aria-pressed={saved}
          onClick={() => {
            setSaved(!saved)
            void toggleReel(slide.id, 'saved', !saved)
          }}
        >
          <span aria-hidden="true">{saved ? '🔖' : '📑'}</span>
          <span className="reel-action-label">{saved ? 'Збережено' : 'Зберегти'}</span>
        </button>
        {slide.chapterHref ? (
          <Link href={slide.chapterHref} className="reel-action">
            <span aria-hidden="true">{isNews ? '📰' : '📖'}</span>
            <span className="reel-action-label">{isNews ? 'Новини' : 'Розділ'}</span>
          </Link>
        ) : null}
        <button type="button" className="reel-action" onClick={share}>
          <span aria-hidden="true">📤</span>
          <span className="reel-action-label">Поділитись</span>
        </button>
        {slide.ai ? (
          <button
            type="button"
            className="reel-action"
            onClick={() => {
              setHidden(true)
              void hideGeneratedReel(slide.id)
            }}
          >
            <span aria-hidden="true">🙈</span>
            <span className="reel-action-label">Сховати</span>
          </button>
        ) : null}
      </div>
    </article>
  )
}

const RATINGS: Array<{ key: FlashRating; emoji: string; label: string }> = [
  { key: 'again', emoji: '😵', label: 'Не знав' },
  { key: 'hard', emoji: '🤔', label: 'Важко' },
  { key: 'good', emoji: '😎', label: 'Знав' },
]

function CardSlide({ item, onDone }: { item: FlashItem; onDone: () => void }) {
  const [open, setOpen] = useState(false)
  const [rated, setRated] = useState<FlashRating | null>(null)
  const started = useRef(0)
  const feedback = useFeedback()
  useEffect(() => {
    started.current = Date.now()
  }, [])
  const rate = useCallback(
    (rating: FlashRating) => {
      if (rated) return
      setRated(rating)
      feedback.answer(rating !== 'again')
      void rateFlashcard({ unitId: item.unitId, rating, durationMs: Date.now() - started.current, sessionId: null }).then((effects) => feedback.effects(effects))
      window.setTimeout(onDone, 450)
    },
    [rated, feedback, item.unitId, onDone],
  )
  return (
    <article className="feed-card">
      <span className="reel-chip">🧠 Перевір себе · {item.chapterTitle}</span>
      <div className="feed-card-question">{item.question}</div>
      {open ? (
        <>
          <div className="feed-card-answer prose-flow">{item.answer}</div>
          <div className="feed-rate" role="group" aria-label="Наскільки добре ти знав">
            {RATINGS.map((r) => (
              <button key={r.key} type="button" className="feed-rate-button" data-rating={r.key} data-chosen={rated === r.key ? '' : undefined} disabled={rated !== null} onClick={() => rate(r.key)}>
                <span aria-hidden="true">{r.emoji}</span>
                {r.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <button
          type="button"
          className="feed-reveal"
          onClick={() => {
            feedback.play('flip')
            setOpen(true)
          }}
        >
          👀 Показати відповідь
        </button>
      )}
    </article>
  )
}

function Slide({ index, children, reelId, track }: { index: number; children: ReactNode; reelId?: string; track: (el: HTMLElement | null) => void }) {
  return (
    <section className="feed-slide" data-index={index} data-reel={reelId} ref={reelId ? track : undefined}>
      {children}
    </section>
  )
}

export function Feed({ slides, nextHref, seenToday, target }: { slides: FeedSlide[]; nextHref: string; seenToday: number; target: number }) {
  const feedback = useFeedback()
  const scroller = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(seenToday)
  const queue = useRef(new Set<string>())
  const recorded = useRef(new Set<string>())

  const flush = useCallback(() => {
    const ids = [...queue.current]
    if (ids.length === 0) return
    queue.current.clear()
    void markReelsSeen(ids).then((effects) => feedback.effects(effects))
  }, [feedback])

  const onSeen = useCallback((id: string) => {
    if (recorded.current.has(id)) return
    recorded.current.add(id)
    queue.current.add(id)
    setSeen((n) => n + 1)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(flush, 3000)
    const onHide = () => document.visibilityState === 'hidden' && flush()
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onHide)
      flush()
    }
  }, [flush])

  const track = useReelTracking(onSeen)

  const scrollBy = useCallback((dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ top: dir * el.clientHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault()
        scrollBy(1)
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault()
        scrollBy(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scrollBy])

  return (
    <div className="feed-shell">
      <header className="feed-hud">
        <Link href="/" className="feed-hud-close" aria-label="На головну">
          ✕
        </Link>
        <span className="feed-hud-count tabular" aria-live="polite">
          ⚡ {Math.min(seen, target)}/{target} фішок сьогодні
        </span>
      </header>
      <div className="feed" ref={scroller}>
        {slides.map((slide, i) => {
          if (slide.kind === 'reel')
            return (
              <Slide key={slide.id} index={i} reelId={slide.id} track={track}>
                <ReelCard slide={slide} />
              </Slide>
            )
          if (slide.kind === 'flashcard')
            return (
              <Slide key={slide.item.unitId} index={i} track={track}>
                <CardSlide item={slide.item} onDone={() => scrollBy(1)} />
              </Slide>
            )
          const q = slide.item
          return (
            <Slide key={q.unitId} index={i} track={track}>
              <article className="feed-card feed-quiz">
                <span className="reel-chip">🎲 Квіз · {q.chapterTitle}</span>
                <QuizInline
                  unitId={q.unitId}
                  mode={q.mode}
                  level={q.level}
                  prompt={q.prompt}
                  body={q.body}
                  explanation={q.explanation}
                  options={q.options}
                  freeAnswer={q.freeAnswer}
                  exercise={q.exercise}
                  variant="inline"
                />
              </article>
            </Slide>
          )
        })}
        <section className="feed-slide">
          <article className="feed-card feed-end">
            <div className="reel-emoji" aria-hidden="true">
              🎉
            </div>
            <h2 className="reel-title">Порцію подолано</h2>
            <p className="feed-end-text">Мозок отримав {slides.length} мікродоз знань. Ще одну?</p>
            <Link href={nextHref} className="mission-cta">
              Ще порція ⚡
            </Link>
            <Link href="/" className="feed-end-home">
              На головну
            </Link>
          </article>
        </section>
      </div>
    </div>
  )
}
