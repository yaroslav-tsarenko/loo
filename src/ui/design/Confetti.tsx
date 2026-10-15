'use client'

import { useEffect, useRef } from 'react'

const COLORS = ['#58CC02', '#1CB0F6', '#FF4B4B', '#FFC800', '#FF9600', '#CE82FF', '#FF86D0']

export interface BurstOptions {
  /** Element to burst from; defaults to the top-center of the viewport. */
  from?: Element | null
  /** Viewport point (px) when no element is given. */
  x?: number
  y?: number
  count?: number
  /** 0…1, how wide the cone is. */
  spread?: number
}

interface Bit {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  vr: number
  w: number
  h: number
  color: string
  round: boolean
}

// ~2 KB canvas burst. No-ops under prefers-reduced-motion; canvas removes itself when done.
export function burst({ from, x, y, count = 90, spread = 0.7 }: BurstOptions = {}): void {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = from?.getBoundingClientRect()
  const ox = rect ? rect.left + rect.width / 2 : (x ?? window.innerWidth / 2)
  const oy = rect ? rect.top + rect.height / 2 : (y ?? window.innerHeight * 0.35)
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const canvas = document.createElement('canvas')
  canvas.className = 'lu-confetti'
  canvas.setAttribute('aria-hidden', 'true')
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return
  }
  ctx.scale(dpr, dpr)
  const bits: Bit[] = Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 2 * spread * 0.5
    const speed = 7 + Math.random() * 9
    return {
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 6,
      color: COLORS[i % COLORS.length]!,
      round: Math.random() < 0.3,
    }
  })
  const start = performance.now()
  const life = 1900
  const frame = (now: number) => {
    const t = now - start
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - life * 0.6) / (life * 0.4))
    for (const b of bits) {
      b.vy += 0.32
      b.vx *= 0.985
      b.vy *= 0.985
      b.x += b.vx
      b.y += b.vy
      b.r += b.vr
      ctx.save()
      ctx.translate(b.x, b.y)
      ctx.rotate(b.r)
      ctx.fillStyle = b.color
      if (b.round) {
        ctx.beginPath()
        ctx.arc(0, 0, b.h / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * Math.abs(Math.cos(b.r * 2)) + 1)
      }
      ctx.restore()
    }
    if (t < life) requestAnimationFrame(frame)
    else canvas.remove()
  }
  requestAnimationFrame(frame)
}

/** Fires a burst whenever `trigger` changes to a truthy value (e.g. a counter or "lesson done" flag). */
export function Confetti({ trigger, count, spread }: { trigger: unknown; count?: number; spread?: number }) {
  const anchor = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (trigger) burst({ from: anchor.current, count, spread })
  }, [trigger, count, spread])
  return <span ref={anchor} className="lu-confetti-anchor" aria-hidden="true" />
}
