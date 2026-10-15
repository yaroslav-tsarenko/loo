'use client'

import { LayoutGroup } from 'motion/react'
import { ChevronLeft, ChevronRight, Pause, Play, SkipBack } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { useElection, usePageHidden, useReducedMotionPref } from '@/ui/theater/election'
import { CodeView } from './CodeView'
import type { Frame, StepScenario } from './types'

const SPEEDS = [0.5, 1, 1.5, 2] as const
// pause on the last frame before an untouched autoplay loops
const LOOP_PAUSE = 2800

// Reading time grows with the explanation length; speed divides it.
function dwell(note: string, speed: number): number {
  return Math.max(1500, 800 + note.length * 18) / speed
}

export interface StepPlayerProps<F extends Frame> {
  scenario: StepScenario<F>
  label: string
  // next to the code (right on wide screens, below on narrow)
  side?: (frame: F, index: number) => ReactNode
  // full width under code + side
  below?: (frame: F, index: number) => ReactNode
  hideCode?: boolean
}

export function StepPlayer<F extends Frame>({ scenario, label, side, below, hideCode }: StepPlayerProps<F>) {
  const total = scenario.frames.length
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  // once the reader touches any control, autoplay is off for good
  const [touched, setTouched] = useState(false)
  const [speed, setSpeed] = useState<number>(1)
  const groupId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const reduced = useReducedMotionPref()
  const hidden = usePageHidden()
  const { ratio, elected } = useElection(rootRef)
  const frame = scenario.frames[Math.min(index, total - 1)]!
  const atEnd = index >= total - 1
  // autoplay while visible and elected (one animated illustration at a time)
  const auto = !touched && !reduced && !hidden && elected && ratio > 0.05
  const running = playing || auto

  useEffect(() => {
    if (!running) return
    if (atEnd) {
      const t = auto && !playing ? window.setTimeout(() => setIndex(0), LOOP_PAUSE) : window.setTimeout(() => setPlaying(false), 0)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setIndex((i) => Math.min(i + 1, total - 1)), dwell(frame.note, speed))
    return () => window.clearTimeout(t)
  }, [running, auto, playing, atEnd, frame.note, speed, total])

  const clamp = (i: number) => Math.max(0, Math.min(total - 1, i))
  const go = (next: number) => setIndex(clamp(next))
  const step = (delta: number) => {
    setTouched(true)
    setPlaying(false)
    setIndex((i) => clamp(i + delta))
  }
  const reset = () => {
    setTouched(true)
    setPlaying(false)
    go(0)
  }
  const toggle = () => {
    setTouched(true)
    if (running) return setPlaying(false)
    if (atEnd) go(0)
    setPlaying(true)
  }
  const cycleSpeed = () => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s as (typeof SPEEDS)[number]) + 1) % SPEEDS.length]!)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'SELECT') return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      step(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      step(-1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      reset()
    } else if (e.key === 'End') {
      e.preventDefault()
      setTouched(true)
      setPlaying(false)
      go(total - 1)
    } else if ((e.key === ' ' || e.key === 'Spacebar') && target === e.currentTarget) {
      e.preventDefault()
      toggle()
    }
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return
    swipe.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current
    swipe.current = null
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1)
  }

  return (
    <div ref={rootRef} className="viz-player" data-auto={auto ? '' : undefined} tabIndex={0} onKeyDown={onKeyDown} aria-roledescription="покрокова візуалізація" aria-label={`${label}. Стрілки ← → — кроки, пробіл — автопрогравання`}>
      <LayoutGroup id={groupId}>
        <div className="viz-swipe" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipe.current = null)}>
          <div className="viz-stage" data-split={side && !hideCode ? '' : undefined}>
            {hideCode ? null : <CodeView code={scenario.code} line={frame.line} />}
            {side ? <div className="viz-side">{side(frame, index)}</div> : null}
          </div>
          {below ? <div className="viz-below">{below(frame, index)}</div> : null}
        </div>
      </LayoutGroup>
      <div className="viz-dock">
        <div className="viz-note">
          <span className="viz-note-step tabular" aria-hidden="true">
            {index + 1}/{total}
          </span>
          <p aria-live={auto ? 'off' : 'polite'} aria-atomic="true">
            <span className="sr-only">
              Крок {index + 1} з {total}.{' '}
            </span>
            {frame.note}
          </p>
        </div>
        <div className="viz-controls">
          <button type="button" className="viz-btn" onClick={reset} disabled={index === 0 && !running} aria-label="На початок">
            <SkipBack size={18} strokeWidth={1.8} />
          </button>
          <button type="button" className="viz-btn" onClick={() => step(-1)} disabled={index === 0} aria-label="Крок назад">
            <ChevronLeft size={20} strokeWidth={1.8} />
          </button>
          <button type="button" className="viz-btn" data-primary="" onClick={() => step(1)} disabled={atEnd} aria-label="Наступний крок">
            <ChevronRight size={20} strokeWidth={1.8} />
          </button>
          <button type="button" className="viz-btn" onClick={toggle} aria-label={running ? 'Пауза' : 'Автопрогравання'} aria-pressed={running}>
            {running ? <Pause size={18} strokeWidth={1.8} /> : <Play size={18} strokeWidth={1.8} />}
          </button>
          <input
            className="viz-scrub"
            type="range"
            min={0}
            max={Math.max(0, total - 1)}
            value={index}
            onChange={(e) => {
              setTouched(true)
              setPlaying(false)
              go(Number(e.target.value))
            }}
            aria-label="Крок"
            aria-valuetext={`Крок ${index + 1} з ${total}`}
            style={{ ['--fill' as string]: `${total > 1 ? (index / (total - 1)) * 100 : 100}%` }}
          />
          <button type="button" className="viz-btn viz-speed tabular" onClick={cycleSpeed} aria-label={`Швидкість ${speed}×, змінити`}>
            {speed}×
          </button>
        </div>
      </div>
    </div>
  )
}
