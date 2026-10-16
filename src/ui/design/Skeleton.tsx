import type { CSSProperties } from 'react'
import { Loo } from './mascot/Loo'

// Route skeletons (app/**/loading.tsx): the page's shape in soft surface blocks with Loo thinking in the header,
// shown the instant a link is pressed while the server renders the real page — no spinner. Blocks pulse gently (not
// at all with reduced motion).

export type SkeletonVariant = 'page' | 'path' | 'player' | 'reader' | 'list'

function Block({ w, h, r, className }: { w?: string; h: number; r?: 'sm' | 'pill' | 'lg'; className?: string }) {
  const style: CSSProperties = { width: w ?? '100%', height: h }
  return <span className={className ? `lu-skel ${className}` : 'lu-skel'} data-r={r} style={style} aria-hidden="true" />
}

function Head() {
  return (
    <div className="lu-skel-head">
      <Loo mood="thinking" size={64} decorative />
      <div className="lu-skel-stack">
        <Block w="min(320px, 70%)" h={30} />
        <Block w="min(520px, 90%)" h={16} r="sm" />
      </div>
    </div>
  )
}

export function PageSkeleton({ variant = 'page', label = 'Завантаження…' }: { variant?: SkeletonVariant; label?: string }) {
  return (
    <div className="page lu-skel-page" data-width={variant === 'reader' || variant === 'player' ? undefined : 'wide'} data-variant={variant} aria-busy="true">
      <span className="sr-only" role="status">
        {label}
      </span>
      {variant === 'player' ? (
        <>
          <div className="lu-skel-row">
            <Block w="36px" h={36} r="pill" />
            <Block h={14} r="pill" />
            <Block w="72px" h={28} r="pill" />
          </div>
          <Block h={260} r="lg" className="lu-skel-hero" />
          <div className="lu-skel-stack">
            <Block h={56} />
            <Block h={56} />
            <Block h={56} />
          </div>
        </>
      ) : variant === 'reader' ? (
        <>
          <Block w="min(420px, 80%)" h={34} />
          <div className="lu-skel-stack">
            {[100, 96, 98, 72, 0, 100, 94, 88, 60].map((w, i) => (w === 0 ? <span key={i} className="lu-skel-gap" /> : <Block key={i} w={`${w}%`} h={16} r="sm" />))}
          </div>
          <Block h={180} r="lg" />
        </>
      ) : variant === 'path' ? (
        <>
          <Head />
          <div className="lu-skel-grid" data-cols="3">
            <Block h={84} r="lg" />
            <Block h={84} r="lg" />
            <Block h={84} r="lg" />
          </div>
          <div className="lu-skel-path">
            {/* zigzag like the real path (CSS nth-child offsets) */}
            {Array.from({ length: 7 }, (_, i) => (
              <Block key={i} w="72px" h={72} r="pill" className="lu-skel-node" />
            ))}
          </div>
        </>
      ) : (
        <>
          <Head />
          <div className="lu-skel-grid" data-cols={variant === 'list' ? '2' : '3'}>
            <Block h={variant === 'list' ? 260 : 150} r="lg" />
            <Block h={variant === 'list' ? 260 : 150} r="lg" />
            {variant === 'list' ? null : <Block h={150} r="lg" />}
          </div>
          <Block h={120} r="lg" />
        </>
      )}
    </div>
  )
}
