'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { isBarePath } from '@/lib/auth-paths'
import { AutoTopbar } from './AutoTopbar'

// The signed-in app chrome (sidebar, top bar, bottom nav). Auth pages and onboarding render full-screen even for a
// signed-in user; decided on the client so soft navigation between the two re-renders correctly.
export function AppFrame({ sidebar, banner, after, children }: { sidebar: ReactNode; banner?: ReactNode; after?: ReactNode; children: ReactNode }) {
  const pathname = usePathname()
  if (isBarePath(pathname)) return <>{children}</>
  return (
    <>
      <div className="app">
        {sidebar}
        <main id="main" className="frame">
          <AutoTopbar />
          {banner}
          {children}
        </main>
      </div>
      {after}
    </>
  )
}
