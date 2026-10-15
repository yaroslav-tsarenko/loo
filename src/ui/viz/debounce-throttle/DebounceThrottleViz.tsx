'use client'

import { Flame, RotateCcw, Zap } from 'lucide-react'
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { VizProps } from '../engine/types'
import { simulateDebounce, simulateThrottle } from './timing'

const WINDOW = 6000

function stamp(setEvents: Dispatch<SetStateAction<number[]>>, setNow: (t: number) => void) {
  const t = performance.now()
  setNow(t)
  setEvents((prev) => [...prev.slice(-400), t])
}

function Track({ title, emoji, caption, dots, now, bands = [], pendingAt, tone }: { title: string; emoji: string; caption: string; dots: readonly number[]; now: number; bands?: ReadonlyArray<[number, number]>; pendingAt?: number | null; tone: string }) {
  const start = now - WINDOW
  const pos = (t: number) => `${Math.max(0, Math.min(100, ((t - start) / WINDOW) * 100))}%`
  const visible = dots.filter((t) => t >= start && t <= now)
  return (
    <div className="viz-tl" data-tone={tone}>
      <div className="viz-tl-head">
        <span>
          <span aria-hidden="true">{emoji}</span> {title}
        </span>
        <span className="viz-tl-count tabular">{dots.length}</span>
      </div>
      <div className="viz-tl-track" aria-hidden="true">
        {bands
          .filter(([a, b]) => b >= start && a <= now)
          .map(([a, b]) => (
            <span key={a} className="viz-tl-band" style={{ left: pos(a), width: `calc(${pos(Math.min(b, now))} - ${pos(a)})` }} />
          ))}
        {visible.map((t) => (
          <span key={t} className="viz-tl-dot" style={{ left: pos(t) }} />
        ))}
        {pendingAt ? <span className="viz-tl-pending" style={{ left: pos(Math.min(pendingAt, now)) }} /> : null}
      </div>
      <p className="viz-tl-caption">{caption}</p>
    </div>
  )
}

export function DebounceThrottleViz(_props: VizProps) {
  const [events, setEvents] = useState<number[]>([])
  const [now, setNow] = useState(0)
  const [debounceMs, setDebounceMs] = useState(500)
  const [throttleMs, setThrottleMs] = useState(500)
  const [auto, setAuto] = useState(false)
  const burstTimers = useRef<number[]>([])
  const raf = useRef(0)

  const debounced = simulateDebounce(events, debounceMs, now)
  const throttled = simulateThrottle(events, throttleMs, now)
  const last = events.at(-1) ?? -Infinity
  const busy = auto || now - last < WINDOW + Math.max(debounceMs, throttleMs)

  // clock runs only while something is on screen
  useEffect(() => {
    if (!busy) return
    const tick = () => {
      setNow(performance.now())
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [busy])

  const fire = () => stamp(setEvents, setNow)

  const burst = () => {
    let at = 0
    for (let i = 0; i < 12; i++) {
      at += 40 + Math.round(Math.random() * 160)
      burstTimers.current.push(window.setTimeout(fire, at))
    }
  }

  useEffect(() => {
    if (!auto) return
    const kick = () => {
      let at = 0
      for (let i = 0; i < 10; i++) {
        at += 40 + Math.round(Math.random() * 160)
        burstTimers.current.push(window.setTimeout(() => stamp(setEvents, setNow), at))
      }
    }
    kick()
    const id = window.setInterval(kick, 3400)
    return () => window.clearInterval(id)
  }, [auto])

  useEffect(
    () => () => {
      for (const id of burstTimers.current) window.clearTimeout(id)
    },
    [],
  )

  const reset = () => {
    for (const id of burstTimers.current) window.clearTimeout(id)
    burstTimers.current = []
    setAuto(false)
    setEvents([])
  }

  return (
    <div className="viz-dt">
      <div className="viz-dt-actions">
        <button type="button" className="viz-fire" onClick={fire} aria-label="Згенерувати подію">
          <Flame size={20} strokeWidth={1.8} /> Подія
        </button>
        <button type="button" className="viz-btn viz-btn-text" onClick={burst} aria-label="Сплеск із 12 подій">
          <Zap size={16} strokeWidth={1.8} /> Сплеск
        </button>
        <button type="button" className="viz-btn viz-btn-text" aria-pressed={auto} onClick={() => setAuto((a) => !a)}>
          {auto ? '⏸ Авто' : '▶ Авто'}
        </button>
        <button type="button" className="viz-btn viz-btn-text" onClick={reset} aria-label="Очистити таймлайни">
          <RotateCcw size={16} strokeWidth={1.8} />
        </button>
      </div>
      <div className="viz-dt-sliders">
        <label className="viz-slider">
          <span>
            debounce <strong className="tabular">{debounceMs} мс</strong>
          </span>
          <input type="range" min={100} max={1500} step={50} value={debounceMs} onChange={(e) => setDebounceMs(Number(e.target.value))} />
        </label>
        <label className="viz-slider">
          <span>
            throttle <strong className="tabular">{throttleMs} мс</strong>
          </span>
          <input type="range" min={100} max={1500} step={50} value={throttleMs} onChange={(e) => setThrottleMs(Number(e.target.value))} />
        </label>
      </div>
      <div className="viz-tls">
        <Track title="Сирі події" emoji="🔥" tone="raw" caption="кожен клік, скрол чи натискання клавіші" dots={events} now={now} />
        <Track
          title={`debounce(fn, ${debounceMs})`}
          emoji="🧘"
          tone="debounce"
          caption={debounced.pendingAt ? `чекаю тиші ще ${Math.max(0, Math.round(debounced.pendingAt - now))} мс — кожна подія скидає таймер` : 'викликає fn один раз, коли події стихли на N мс'}
          dots={debounced.fired}
          now={now}
          bands={events.length > 0 && debounced.pendingAt ? [[last, debounced.pendingAt]] : []}
          pendingAt={debounced.pendingAt}
        />
        <Track
          title={`throttle(fn, ${throttleMs})`}
          emoji="🚦"
          tone="throttle"
          caption="не частіше ніж раз на N мс: перший виклик одразу, останній — у кінці вікна"
          dots={throttled.fired}
          now={now}
          bands={throttled.windows}
          pendingAt={throttled.pendingAt}
        />
      </div>
      <p className="viz-muted">
        Debounce — для пошуку під час набору й автозбереження. Throttle — для scroll, resize і mousemove, де потрібні регулярні оновлення.
      </p>
    </div>
  )
}
