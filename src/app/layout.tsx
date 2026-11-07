import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Noto_Color_Emoji, Onest, Pixelify_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { Tracker } from '@/ui/analytics/Tracker'
import './globals.css'

// docs/DESIGN.md: Onest for all text, JetBrains Mono for code, Pixelify Sans only for the wordmark.
const onest = Onest({ subsets: ['latin', 'cyrillic'], variable: '--font-onest', display: 'swap' })
const pixel = Pixelify_Sans({ subsets: ['latin', 'cyrillic'], weight: '700', variable: '--font-pixel', display: 'swap', preload: false })
const mono = JetBrains_Mono({ subsets: ['latin', 'cyrillic'], variable: '--font-jbmono', display: 'swap', preload: false })
// Any emoji left in content renders in Google's Noto set, never the platform's (Apple) glyphs. Split by unicode-range,
// so a page only downloads the chunks it uses.
const emoji = Noto_Color_Emoji({ weight: '400', subsets: ['emoji'], variable: '--font-emoji', display: 'swap', preload: false })
const fonts = `${onest.variable} ${pixel.variable} ${mono.variable} ${emoji.variable}`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Loo — навчання як гра: англійська, JavaScript і не тільки', template: '%s · Loo' },
  description: 'Loo — навчання як гра: короткі уроки, тести, задачі, серії й ліги — шлях воїна від Новобранця до Легенди',
  applicationName: 'Loo',
  keywords: ['вивчення англійської', 'англійська онлайн', 'JavaScript з нуля', 'курси програмування', 'навчання як гра', 'Loo'],
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'uk_UA' },
  twitter: { card: 'summary_large_image' },
  appleWebApp: { capable: true, title: 'Loo', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f3ff' },
    { media: '(prefers-color-scheme: dark)', color: '#16112b' },
  ],
}

// Static on purpose: no session, no headers(). The prerendered public pages (/blog, /welcome) render inside it as
// static HTML that a CDN can cache. Everything per-request — the session, the app shell, the CSP nonce, the learner's
// theme and language — lives in the (app) group's layout (src/app/(app)/layout.tsx). Theme boot scripts are in the
// group layouts too: the dynamic ones carry the nonce, the static ones run under the public pages' policy (src/lib/csp.ts).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" data-theme="system" className={fonts} suppressHydrationWarning>
      <body>
        {children}
        <Tracker />
      </body>
    </html>
  )
}
