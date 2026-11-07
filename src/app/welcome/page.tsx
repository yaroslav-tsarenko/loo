import type { Metadata } from 'next'
import { Landing } from '@/ui/marketing/Landing'
import { PublicThemeBoot } from '@/ui/marketing/PublicThemeBoot'

// The landing, prerendered. A signed-out `GET /` is rewritten here by the proxy (src/proxy.ts), so the most visited
// page is static HTML from the CDN, without the session check, the app's JS or a function call per view. `/welcome`
// itself is only an internal address: canonical is `/`.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

export default function WelcomePage() {
  return (
    <>
      <PublicThemeBoot />
      <Landing />
    </>
  )
}
