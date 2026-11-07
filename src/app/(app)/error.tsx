'use client'

import { LazyErrorScreen as ErrorScreen } from '@/ui/errors/LazyErrorScreen'

// A page failed: the sidebar and the bottom bar stay, the page area shows Loo and a retry.
export default function AppError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorScreen {...props} />
}
