import { PUBLIC_THEME_BOOT } from '@/ui/shell/constants'

// The visitor's light/dark choice (ThemeSwitch → localStorage) before first paint, on the prerendered public pages.
// No nonce: those pages are static HTML and run under the public policy (src/lib/csp.ts → buildPublicCsp).
export function PublicThemeBoot() {
  return <script dangerouslySetInnerHTML={{ __html: PUBLIC_THEME_BOOT }} />
}
