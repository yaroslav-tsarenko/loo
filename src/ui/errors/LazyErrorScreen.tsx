'use client'

import dynamic from 'next/dynamic'

// Error boundaries are part of every page's bundle; the screen they show (Loo, buttons) is not — it loads only when
// something actually failed (~9 KB gzip less on every page, docs/PERFORMANCE.md).
export const LazyErrorScreen = dynamic(() => import('./ErrorScreen').then((m) => m.ErrorScreen), {
  loading: () => (
    <div className="page error-screen" role="alert">
      <p className="page-lead">Щось пішло не так. Оновлюю…</p>
    </div>
  ),
})
