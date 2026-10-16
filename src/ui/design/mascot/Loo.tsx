import type { CSSProperties } from 'react'
import { cx } from '../cx'
import { frameSpans, LOO_GRID, looTimeline, poseRects, timelineTicks, type LooBulb, type LooEyes, type LooMood, type LooSkin, type Px } from './pixels'

export { LOO_EYES, LOO_MOODS, type LooBulb, type LooEyes, type LooGlasses, type LooHat, type LooMood, type LooSkin } from './pixels'

export const LOO_LABEL: Record<LooMood, string> = {
  idle: 'Loo',
  happy: 'Loo радіє',
  cheer: 'Loo святкує',
  sad: 'Loo сумує',
  thinking: 'Loo думає',
  sleeping: 'Loo спить',
  wave: 'Loo вітається',
  fire: 'Loo палає — серія!',
  eureka: 'Loo: еврика!',
  wink: 'Loo підморгує',
  dizzy: 'У Loo паморочиться в голові',
  love: 'Loo закоханий',
  surprised: 'Loo здивований',
}

export const LOO_EYES_LABEL: Record<LooEyes, string> = {
  normal: 'звичайні',
  wink: 'підморгує',
  squint: 'рішучий >-<',
  happy: 'радісні ^^',
  sleepy: 'сонні --',
  dizzy: 'x x',
  skeptical: 'скептичні ¬¬',
  surprised: 'здивовані OO',
  love: 'закохані',
  sparkle: 'сяючі (еврика)',
}

export function LooPixels({ px }: { px: readonly Px[] }) {
  return (
    <>
      {px.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill={p.c} fillOpacity={p.o} />
      ))}
    </>
  )
}

/** Loo's key pose for a mood, without the ground shadow — for the logo mark and other static spots. */
export function LooHead({ mood = 'idle', skin, eyes, bulb }: { mood?: LooMood; skin?: LooSkin; eyes?: LooEyes; bulb?: LooBulb }) {
  const pose = looTimeline(mood, { eyes, bulb }).frames[0]?.pose
  return pose ? <LooPixels px={poseRects(pose, skin).filter((p) => p.c !== 'currentColor')} /> : null
}

interface LooProps {
  mood?: LooMood
  size?: number
  skin?: LooSkin
  /** Eye expression layer; every mood has its own default (idle → normal holes, eureka → sparkle…). */
  eyes?: LooEyes
  /** Antenna bulb: off, on (lit with rays) or flicker. Moods light it themselves for eureka moments. */
  bulb?: LooBulb
  /** Turn off motion (static illustrations, lists). Reduced-motion users never get it. */
  animated?: boolean
  /** Hide from assistive tech when the surrounding text already says it. */
  decorative?: boolean
  label?: string
  className?: string
}

// Frame animation without client JS: every frame is server-rendered as its own <g>, and one CSS clock
// (--loo-f, stepped 0…ticks-1) shows the frame whose span covers the current tick. Without the clock —
// animated={false}, reduced motion, no CSS yet — the tick is 0 and the key frame shows.
export function Loo({ mood = 'idle', size = 120, skin, eyes, bulb, animated = true, decorative, label, className }: LooProps) {
  const t = looTimeline(mood, { eyes, bulb })
  const live = animated && t.frames.length > 1
  const ticks = timelineTicks(t)
  const spans = frameSpans(t)
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': label ?? LOO_LABEL[mood] }
  const clock = live ? ({ '--loo-n': ticks, '--loo-dur': `${ticks * t.tick}ms` } as CSSProperties) : undefined
  return (
    <svg
      className={cx('loo', className)}
      data-mood={mood}
      data-animated={live ? '' : undefined}
      width={size}
      height={size}
      viewBox={`0 0 ${LOO_GRID} ${LOO_GRID}`}
      shapeRendering="crispEdges"
      style={clock}
      focusable="false"
      {...a11y}
    >
      {live ? (
        t.frames.map((f, i) => (
          <g key={i} className="loo-frame" style={{ '--a': spans[i]?.a, '--h': spans[i]?.h } as CSSProperties}>
            <LooPixels px={poseRects(f.pose, skin)} />
          </g>
        ))
      ) : t.frames[0] ? (
        <LooPixels px={poseRects(t.frames[0].pose, skin)} />
      ) : null}
    </svg>
  )
}
