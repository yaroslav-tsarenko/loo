import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
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

export const metadata: Metadata = {
  title: { default: 'Interview Prep 2.0', template: '%s · Interview Prep' },
  description: 'Тренажер інженерного мислення: статті, візуалізації, щоденні місії і повторення',
  applicationName: 'Interview Prep',
  appleWebApp: { capable: true, title: 'Prep', statusBarStyle: 'black-translucent' },
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
      <html lang="uk" data-theme="system">
        <body>{children}</body>
      </html>
    )
  }
  const snapshot = await getContent()
  const [settings, xp, counts] = await Promise.all([readSettings(), totalXp(getDb()), navCounts(snapshot)])
  const guides = snapshot.guides.map((g) => ({ id: g.id, title: g.title, href: guideHref(g.id) }))
  return (
    <html lang="uk" data-theme={settings.theme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SIDEBAR_BOOT }} />
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
