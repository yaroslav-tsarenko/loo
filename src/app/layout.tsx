import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import Link from 'next/link'
import { cookies, headers } from 'next/headers'
import type { ReactNode } from 'react'
import { getDb } from '@/db/client'
import { authMode, SESSION_COOKIE, verifySessionToken } from '@/lib/auth'
import { getContent } from '@/server/content'
import { navCounts } from '@/server/services/counts'
import { totalXp } from '@/server/services/progress'
import { readSettings } from '@/server/settings'
import { FeedbackProvider } from '@/ui/feedback/FeedbackProvider'
import { CommandPalette } from '@/ui/search/CommandPalette'
import { ClientEnhancer } from '@/ui/shell/ClientEnhancer'
import { SIDEBAR_BOOT } from '@/ui/shell/constants'
import { BottomNav, CountsProvider } from '@/ui/shell/NavLinks'
import { Sidebar } from '@/ui/shell/Sidebar'
import { AutoTopbar } from '@/ui/shell/AutoTopbar'
import { guideHref } from '@/ui/routes'
import './globals.css'

// Rounded display face for game chrome (buttons, nav, stats). The reader keeps its system stack.
const nunito = Nunito({ subsets: ['latin', 'cyrillic'], variable: '--font-nunito', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'Levelup', template: '%s · Levelup' },
  description: 'Levelup — навчання як гра: статті, візуалізації, щоденні місії і повторення',
  applicationName: 'Levelup',
  appleWebApp: { capable: true, title: 'Levelup', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#191919' },
  ],
}

async function isSignedIn(): Promise<boolean> {
  const mode = authMode()
  if (mode === 'open') return true
  if (mode === 'locked') return false
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value)
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // proxy.ts only lets signed-out visitors reach /login, which renders without the app shell or DB.
  if (!(await isSignedIn())) {
    return (
      <html lang="uk" data-theme="system" className={nunito.variable}>
        <body>{children}</body>
      </html>
    )
  }
  const snapshot = await getContent()
  const [settings, xp, counts, nonce] = await Promise.all([readSettings(), totalXp(getDb()), navCounts(snapshot), headers().then((h) => h.get('x-nonce') ?? undefined)])
  const guides = snapshot.guides.map((g) => ({ id: g.id, title: g.title, href: guideHref(g.id) }))
  return (
    <html lang="uk" data-theme={settings.theme} className={nunito.variable} suppressHydrationWarning>
      <head>
        {/* Static string (no user input); allowed by the per-request CSP nonce from proxy.ts. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: SIDEBAR_BOOT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          До вмісту
        </a>
        <FeedbackProvider initialXp={xp} sound={settings.sound} volume={settings.volume} haptics={settings.haptics}>
          <CountsProvider initial={counts}>
            <div className="app">
              <Sidebar guides={guides} theme={settings.theme} />
              <main id="main" className="frame">
                <AutoTopbar />
                {snapshot.error ? (
                  <div className="vault-error" role="alert">
                    <strong>Vault не знайдено.</strong> {snapshot.error}.{' '}
                    <Link className="ui-link" href="/settings">
                      Вказати шлях
                    </Link>
                  </div>
                ) : null}
                {children}
              </main>
            </div>
            <BottomNav />
            <CommandPalette />
          </CountsProvider>
        </FeedbackProvider>
        <ClientEnhancer />
      </body>
    </html>
  )
}
