import { logoMarkDataUri } from '@/ui/design/brand/mark-svg'

// Shared app icon artwork for icon.tsx / apple-icon.tsx (rendered by next/og): pixel Loo with a white sticker
// outline on the feather-green tile — violet on green is the strongest pop, and the white ring keeps the pale bulb and
// the dark lip from melting into the tile. (The 16/32px favicon skips the tile: see src/ui/design/brand/favicon.ts.) The mark is 18 cells (16 + outline) at a whole number of px per cell, centered
// on whole pixels, so every cell lands crisp.
export function BrandMark({ size }: { size: number }) {
  const cell = Math.floor((size * 0.8) / 18)
  const mark = cell * 18
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #6BE012 0%, #58CC02 55%, #46A302 100%)',
        borderRadius: size * 0.22,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
      <img src={logoMarkDataUri(mark, { outline: '#FFFFFF' })} width={mark} height={mark} alt="" style={{ marginTop: (size - mark) % 2 }} />
    </div>
  )
}
