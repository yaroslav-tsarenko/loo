import { cx } from '../cx'
import { LooPixels } from '../mascot/Loo'
import { MARK_BOX, markRects } from '../mascot/pixels'

/** Pixel Loo on its own (16×16 cells, lit bulb to boots) — header logo, favicon-sized brand spots. Crispest at multiples of 16px. */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg className={cx('lu-logomark', className)} width={size} height={size} viewBox={MARK_BOX.join(' ')} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <LooPixels px={markRects()} />
    </svg>
  )
}

/** Wordmark: rounded heavy lowercase, "up" lifted in streak orange. */
export function Wordmark({ height = 26, className }: { height?: number; className?: string }) {
  return (
    <svg className={cx('lu-wordmark', className)} height={height} width={(height * 107) / 30} viewBox="0 0 107 30" role="img" aria-label="Levelup" focusable="false">
      <text x={0} y={23} className="lu-wordmark-level" textLength={62} lengthAdjust="spacingAndGlyphs">
        level
      </text>
      <text x={62.5} y={21} className="lu-wordmark-up" textLength={31} lengthAdjust="spacingAndGlyphs">
        up
      </text>
      <path d="M96.5 9.5 101 4.5l4.5 5M101 5v12" className="lu-wordmark-arrow" />
    </svg>
  )
}

export function Logo({ size = 32, wordmark = true, className }: { size?: number; wordmark?: boolean; className?: string }) {
  return (
    <span className={cx('lu-logo', className)}>
      <LogoMark size={size} />
      {wordmark ? <Wordmark height={Math.round(size * 0.78)} /> : <span className="sr-only">Levelup</span>}
    </span>
  )
}
