import type { ReactNode } from 'react'
import { cx } from './cx'

export type GameIconName = 'fire' | 'gem' | 'heart' | 'bolt' | 'crown' | 'chest'

// Two-tone game glyphs for stats and rewards (24×24). Colors are fixed so they read the same on any surface.
const ART: Record<GameIconName, ReactNode> = {
  fire: (
    <>
      <path d="M12 1.6c.7 3.4 2.8 5 4.6 6.9 1.7 1.8 2.9 3.9 2.9 6.3 0 4.3-3.3 7.6-7.5 7.6s-7.5-3.3-7.5-7.6c0-2.4 1-4.2 2.6-5.7.3 1.8 1.2 3 2.4 3.6C9.2 9.1 10 5 12 1.6z" fill="#FF8A3D" />
      <path d="M12 11.6c1.8 1.5 3.3 2.9 3.3 5 0 2.2-1.5 3.8-3.3 3.8s-3.3-1.6-3.3-3.6c0-1.1.5-2 1.3-2.7.2.9.7 1.5 1.2 1.7-.1-1.6.2-3 .8-4.2z" fill="#FFC23D" />
      <path d="M8.2 11.4c-.9 1-1.4 2.2-1.4 3.6" stroke="#fff" strokeOpacity=".55" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </>
  ),
  gem: (
    <>
      <path d="M6.6 3h10.8l5.1 6.2L12 21.6 1.5 9.2z" fill="#3B9EFF" />
      <path d="M6.6 3h10.8l5.1 6.2H1.5z" fill="#6BB8FF" />
      <path d="M8.4 9.2h7.2L12 19.6z" fill="#8FCAFF" />
      <path d="M8.4 9.2 10.3 3h3.4l1.9 6.2z" fill="#BFE0FF" />
      <path d="M4.6 8.3 6.9 5.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  heart: (
    <>
      <path d="M12 21.2C9.6 19.8 4.1 16.3 2.1 11.6.6 8 2.8 4.2 6.6 4.2c2.2 0 4.2 1.2 5.4 3 1.2-1.8 3.2-3 5.4-3 3.8 0 6 3.8 4.5 7.4-2 4.7-7.5 8.2-9.9 9.6z" fill="#FF5A6E" />
      <path d="M21.9 11.6c-2 4.7-7.5 8.2-9.9 9.6-2.4-1.4-7.9-4.9-9.9-9.6 2.8 3.9 7.2 6.6 9.9 7.9 2.7-1.3 7.1-4 9.9-7.9z" fill="#D93C52" />
      <ellipse cx="7.3" cy="8.6" rx="2" ry="1.3" transform="rotate(-35 7.3 8.6)" fill="#fff" fillOpacity=".7" />
    </>
  ),
  bolt: (
    <>
      <path d="M13.8 1.8 3.8 13.6h6.8l-1.4 8.6L20.2 9.8h-6.9z" fill="#FFC23D" />
      <path d="M13.3 9.8h6.9L9.2 22.2l1.4-8.6z" fill="#DB9B12" />
      <path d="M11.6 4.6 7.2 10" stroke="#fff" strokeOpacity=".7" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  crown: (
    <>
      <path d="M2.5 7.5 7.4 12 12 4.5l4.6 7.5 4.9-4.5-2 11.5h-15z" fill="#FFC23D" />
      <path d="M4.5 16h15l-.5 3h-14z" fill="#DB9B12" />
      <circle cx="12" cy="13.6" r="1.6" fill="#FF5A6E" />
      <circle cx="7.4" cy="15" r="1.1" fill="#3B9EFF" />
      <circle cx="16.6" cy="15" r="1.1" fill="#2DD4BF" />
    </>
  ),
  chest: (
    <>
      <path d="M3 10h18v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5z" fill="#C8792B" />
      <path d="M3 10c0-3.6 2.4-6 6-6h6c3.6 0 6 2.4 6 6z" fill="#E08E3B" />
      <path d="M3 10h18v2.4H3z" fill="#FFC23D" />
      <rect x="10" y="9.2" width="4" height="5.6" rx="1" fill="#FFC23D" stroke="#B57400" strokeWidth=".8" />
    </>
  ),
}

export function GameIcon({ name, size = 24, muted, label, className }: { name: GameIconName; size?: number; muted?: boolean; label?: string; className?: string }) {
  return (
    <svg className={cx('lu-gicon', className)} data-muted={muted ? '' : undefined} width={size} height={size} viewBox="0 0 24 24" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
      {ART[name]}
    </svg>
  )
}
