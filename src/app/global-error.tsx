'use client'

import './globals.css'

// The last resort: the root layout itself failed, so this renders its own <html>. No shell, no providers — plain
// markup on the design tokens, a reload and a link home.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="uk" data-theme="system">
      <body>
        <main className="page error-screen" role="alert" style={{ maxWidth: 520, margin: '15vh auto', padding: '0 20px', textAlign: 'center' }}>
          <h1 className="page-title">Щось пішло не так</h1>
          <p className="page-lead">Loo вже розбирається. Спробуй оновити сторінку.</p>
          {error.digest ? <p className="error-digest">Код помилки: {error.digest}</p> : null}
          <p style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button type="button" className="lu-btn" data-variant="primary" data-size="md" onClick={() => reset()}>
              Спробувати ще раз
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full reload is the point here */}
            <a className="lu-btn" data-variant="ghost" data-size="md" href="/">
              На головну
            </a>
          </p>
        </main>
      </body>
    </html>
  )
}
