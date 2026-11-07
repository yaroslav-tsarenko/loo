'use client'

import { LazyErrorScreen as ErrorScreen } from '@/ui/errors/LazyErrorScreen'

// Outside the app shell: catches failures of the (app) layout itself (the session or the shell's reads — a database
// outage) and of the public pages.
export default function RootError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorScreen {...props} />
}
