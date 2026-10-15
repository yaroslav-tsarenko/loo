import { cx, type Tone } from './cx'

const PALETTE: readonly Tone[] = ['green', 'blue', 'orange', 'purple', 'pink', 'red', 'yellow']

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? '?'
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + second).toUpperCase()
}

function toneFor(name: string): Tone {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) | 0
  return PALETTE[Math.abs(h) % PALETTE.length]!
}

interface AvatarProps {
  name: string
  /** Same-origin image URL; falls back to initials. */
  src?: string
  size?: number
  tone?: Tone
  /** Colored ring, e.g. for the current user or a league position. */
  ring?: Tone
  className?: string
}

export function Avatar({ name, src, size = 44, tone, ring, className }: AvatarProps) {
  return (
    <span className={cx('lu-avatar', className)} data-tone={tone ?? toneFor(name)} data-ring={ring} style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }} role="img" aria-label={name}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- tiny avatar, no optimizer config for user images yet
        <img src={src} alt="" width={size} height={size} />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  )
}
