import { logoMarkDataUri } from '@/ui/design/brand/mark-svg'

// Shared app icon artwork for icon.tsx / apple-icon.tsx (rendered by next/og): Loo's head on a feather-green tile.
export function BrandMark({ size }: { size: number }) {
  const mark = Math.round(size * 0.78)
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
      <img src={logoMarkDataUri(mark)} width={mark} height={mark} alt="" />
    </div>
  )
}
