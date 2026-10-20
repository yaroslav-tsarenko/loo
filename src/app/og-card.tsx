import { ImageResponse } from 'next/og'
import { logoMarkDataUri } from '@/ui/design/brand/mark-svg'

// Social cards (Open Graph / Twitter, 1200×630) rendered by next/og: the neutral night canvas of the public pages,
// pixel Loo, Onest text. Used by app/opengraph-image.tsx and the blog's per-post cards.

export const OG_SIZE = { width: 1200, height: 630 }

// Onest from Google Fonts, subset to the card's text (next/og needs TTF/OTF; the bundled default font has no
// Cyrillic). Prerendered at build time, so this runs once per card per deploy.
async function onest(weight: 600 | 800, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Onest:wght@${weight}&text=${encodeURIComponent(text)}`)).text()
    const url = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(css)?.[1]
    if (!url) return null
    const res = await fetch(url)
    return res.ok ? await res.arrayBuffer() : null
  } catch {
    return null
  }
}

export interface OgCardProps {
  /** Small label above the title (category, section). */
  eyebrow?: string
  eyebrowColor?: string
  title: string
  subtitle?: string
  /** Footer note on the right, e.g. «8 хв читання». */
  meta?: string
}

const BAR = ['#7c4dff', '#7c4dff', '#7c4dff', '#7c4dff', '#2dd4bf', '#2dd4bf', '#ffc800', '#3b3b44', '#3b3b44', '#3b3b44']

export async function ogCard({ eyebrow, eyebrowColor = '#7c4dff', title, subtitle, meta }: OgCardProps): Promise<ImageResponse> {
  const text = `Loo playloo.app ${eyebrow ?? ''} ${title} ${subtitle ?? ''} ${meta ?? ''}`
  const [bold, semi] = await Promise.all([onest(800, text), onest(600, text)])
  const fonts = [
    ...(bold ? [{ name: 'Onest', data: bold, weight: 800 as const, style: 'normal' as const }] : []),
    ...(semi ? [{ name: 'Onest', data: semi, weight: 600 as const, style: 'normal' as const }] : []),
  ]
  const titleSize = title.length > 70 ? 54 : title.length > 40 ? 64 : 76
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px 48px',
          background: '#0e0e12',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          fontFamily: 'Onest',
          color: '#f4f4f6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
          <img src={logoMarkDataUri(72)} width={72} height={72} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>Loo</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: '#a9a8b4' }}>playloo.app</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 840 }}>
            {eyebrow ? (
              <div style={{ display: 'flex' }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#fff', background: eyebrowColor, padding: '8px 18px', borderRadius: 12, borderBottom: '5px solid rgba(0,0,0,0.3)' }}>
                  {eyebrow}
                </span>
              </div>
            ) : null}
            <span style={{ fontSize: titleSize, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</span>
            {subtitle ? <span style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.35, color: '#a9a8b4' }}>{subtitle}</span> : null}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
          <img src={logoMarkDataUri(216, { outline: '#ffffff' })} width={216} height={216} alt="" style={{ flexShrink: 0 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {BAR.map((c, i) => (
              <div key={i} style={{ width: 44, height: 14, borderRadius: 4, background: c }} />
            ))}
          </div>
          {meta ? <span style={{ fontSize: 24, fontWeight: 600, color: '#a9a8b4' }}>{meta}</span> : null}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  )
}
