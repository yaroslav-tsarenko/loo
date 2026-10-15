// Shared app icon artwork for icon.tsx / apple-icon.tsx (rendered by next/og).
export function BrandMark({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2383e2 0%, #9065b0 55%, #d9730d 100%)',
        borderRadius: size * 0.22,
        color: 'white',
        fontSize: size * 0.42,
        fontWeight: 800,
        letterSpacing: -size * 0.02,
        fontFamily: 'sans-serif',
      }}
    >
      {'{ }'}
    </div>
  )
}
