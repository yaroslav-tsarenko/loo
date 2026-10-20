import { cx } from '../cx'
import { LooPixels } from '../mascot/LooArt'
import { MARK_BOX, markRects } from '../mascot/pixels'

/** Pixel Loo on its own (16×16 cells, lit bulb to boots) — header logo, favicon-sized brand spots. Crispest at multiples of 16px. */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg className={cx('lu-logomark', className)} width={size} height={size} viewBox={MARK_BOX.join(' ')} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <LooPixels px={markRects()} />
    </svg>
  )
}

/** Wordmark: «loo» in the pixel display face, Loo violet. */
export function Wordmark({ height = 26, className }: { height?: number; className?: string }) {
  return (
    <svg className={cx('lu-wordmark', className)} height={height} width={(height * 40) / 30} viewBox="0 0 40 30" role="img" aria-label="Loo" focusable="false">
      <text x={0} y={23} className="lu-wordmark-level" textLength={38} lengthAdjust="spacingAndGlyphs">
        loo
      </text>
    </svg>
  )
}

export function Logo({ size = 32, wordmark = true, className }: { size?: number; wordmark?: boolean; className?: string }) {
  return (
    <span className={cx('lu-logo', className)}>
      <LogoMark size={size} />
      {wordmark ? <Wordmark height={Math.round(size * 0.78)} /> : <span className="sr-only">Loo</span>}
    </span>
  )
}
