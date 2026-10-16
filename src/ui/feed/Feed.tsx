'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { PiArrowSquareOutBold, PiBookOpenTextFill, PiBookmarkSimpleBold, PiBookmarkSimpleFill, PiEyeFill, PiEyeSlashFill, PiNewspaperFill, PiRobotFill, PiShareFatFill, PiXBold } from 'react-icons/pi'
import { hideGeneratedReel, markReelsSeen, toggleReel } from '@/server/actions/feed'
import { rateFlashcard } from '@/server/actions/study'
import type { FlashRating } from '@/progress/types'
import type { FeedSlide, ReelSlide } from '@/server/services/feed'
import { Pill } from '@/ui/design/Badge'
import { Button, IconButton } from '@/ui/design/Button'
import { GameIcon } from '@/ui/design/GameIcon'
import { Loo } from '@/ui/design/mascot/Loo'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { Icon } from '@/ui/icons/Icon'
import type { FlashItem } from '@/ui/study/render-items'
import { QuizInline } from '@/ui/study/QuizInline'
import { RateButtons } from '@/ui/study/RateButtons'

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
  const pill = (
    <Pill size="sm" tone="purple" solid icon={<PiRobotFill />} className="reel-ai">
      AI{slide.sourceUrl ? ' · джерело' : ''}
      {slide.sourceUrl ? <PiArrowSquareOutBold aria-hidden="true" /> : null}
    </Pill>
  )
  if (!slide.sourceUrl) return pill
  return (
    <a className="reel-ai-link" href={slide.sourceUrl} target="_blank" rel="noreferrer noopener" title={slide.sourceTitle ?? undefined}>
      {pill}
    </a>
  )
}

function RailAction({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="reel-action">
      {children}
      <span className="reel-action-label" aria-hidden="true">
        {label}
      </span>
    </span>
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
      <article className="reel reel-hidden" style={{ '--reel-hue': slide.hue } as CSSProperties}>
        <div className="reel-main">
          <Loo mood="sleeping" size={120} />
          <h2 className="reel-title">Сховано</h2>
          <p className="feed-end-text">Ця AI-фішка більше не з’явиться у стрічці. Гортай далі</p>
        </div>
      </article>
    )
  const share = async () => {
    const text = slide.title
    if (navigator.share) await navigator.share({ title: text, text }).catch(() => undefined)
    else await navigator.clipboard?.writeText(text)
  }
  return (
    <article className="reel" style={{ '--reel-hue': slide.hue } as CSSProperties}>
      <div className="reel-main">
        <div className="reel-tags">
          <span className="reel-chip">
            <GameIcon name="bolt" size={16} /> Фішка · {slide.chapterTitle}
          </span>
          {slide.ai ? <AiBadge slide={slide} /> : null}
        </div>
        <div className="reel-emoji" aria-hidden="true">
          <Icon name={slide.icon} size={80} />
        </div>
        <h2 className="reel-title">{slide.title}</h2>
        <div className="reel-body prose-flow">{slide.body}</div>
      </div>
      <div className="reel-rail" role="group" aria-label="Дії">
        <RailAction label="Клас">
          <IconButton
            label={liked ? 'Прибрати вподобання' : 'Клас'}
            round
            size="lg"
            variant="ghost"
            aria-pressed={liked}
            className="reel-btn"
            data-on={liked ? '' : undefined}
            icon={<GameIcon name="heart" size={26} muted={!liked} />}
            onClick={() => {
              setLiked(!liked)
              if (!liked) feedback.play('correct')
              void toggleReel(slide.id, 'liked', !liked)
            }}
          />
        </RailAction>
        <RailAction label={saved ? 'Збережено' : 'Зберегти'}>
          <IconButton
            label={saved ? 'Збережено' : 'Зберегти'}
            round
            size="lg"
            variant={saved ? 'secondary' : 'ghost'}
            aria-pressed={saved}
            className="reel-btn"
            icon={saved ? <PiBookmarkSimpleFill size={24} /> : <PiBookmarkSimpleBold size={24} />}
            onClick={() => {
              setSaved(!saved)
              void toggleReel(slide.id, 'saved', !saved)
            }}
          />
        </RailAction>
        {slide.chapterHref ? (
          <RailAction label={isNews ? 'Новини' : 'Розділ'}>
            <Link href={slide.chapterHref} className="lu-ibtn reel-btn" data-variant="ghost" data-size="lg" data-round="" aria-label={isNews ? 'Новини' : 'Відкрити розділ'}>
              {isNews ? <PiNewspaperFill size={24} /> : <PiBookOpenTextFill size={24} />}
            </Link>
          </RailAction>
        ) : null}
        <RailAction label="Поділитись">
          <IconButton label="Поділитись" round size="lg" variant="ghost" className="reel-btn" icon={<PiShareFatFill size={24} />} onClick={share} />
        </RailAction>
        {slide.ai ? (
          <RailAction label="Сховати">
            <IconButton
              label="Сховати"
              round
              size="lg"
              variant="ghost"
              className="reel-btn"
              icon={<PiEyeSlashFill size={24} />}
              onClick={() => {
                setHidden(true)
                void hideGeneratedReel(slide.id)
              }}
            />
          </RailAction>
        ) : null}
      </div>
    </article>
  )
}

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
    <article className="feed-card feed-flash" data-open={open ? '' : undefined}>
      <span className="reel-chip">
        <Icon name="px:brain" size={16} /> Перевір себе · {item.chapterTitle}
      </span>
      <div className="feed-card-question">{item.question}</div>
      {open ? (
        <>
          <div className="feed-card-answer prose-flow">{item.answer}</div>
          <RateButtons onRate={rate} disabled={rated !== null} chosen={rated} hotkeys={false} label="Наскільки добре ти знав" />
        </>
      ) : (
        <Button
          variant="secondary"
          size="lg"
          block
          icon={<PiEyeFill size={20} />}
          onClick={() => {
            feedback.play('flip')
            setOpen(true)
          }}
        >
          Показати відповідь
        </Button>
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
        <Link href="/" className="lu-ibtn feed-hud-close" data-variant="ghost" data-round="" aria-label="На головну">
          <PiXBold size={22} />
        </Link>
        <span className="feed-hud-count tabular" aria-live="polite">
          <GameIcon name="bolt" size={20} />
          <span className="feed-hud-track" aria-hidden="true">
            <span style={{ width: `${Math.min(1, seen / Math.max(1, target)) * 100}%` }} />
          </span>
          {Math.min(seen, target)}/{target}
          <span className="sr-only"> фішок сьогодні</span>
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
                <span className="reel-chip">
                  <Icon name="px:dice" size={16} /> Квіз · {q.chapterTitle}
                </span>
                <QuizInline unitId={q.unitId} mode={q.mode} multi={q.multi} free={q.free} level={q.level} prompt={q.prompt} body={q.body} options={q.options} exercise={q.exercise} variant="inline" />
              </article>
            </Slide>
          )
        })}
        <section className="feed-slide">
          <article className="feed-card feed-end">
            <Loo mood="cheer" size={140} />
            <h2 className="reel-title">Порцію подолано!</h2>
            <p className="feed-end-text">Мозок отримав {slides.length} мікродоз знань. Ще одну?</p>
            <Button href={nextHref} size="lg" block icon={<GameIcon name="bolt" size={22} />}>
              Ще порція
            </Button>
            <Link href="/" className="feed-end-home">
              На головну
            </Link>
          </article>
        </section>
      </div>
    </div>
  )
}
