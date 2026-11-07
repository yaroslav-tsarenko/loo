'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'
import { Button } from '@/ui/design/Button'
import { EmptyState } from '@/ui/design/EmptyState'

// What a learner sees instead of Next's bare «Application error»: Loo, what happened in plain words, a retry and a
// way out. Used by the route error boundaries (src/app/error.tsx, src/app/(app)/error.tsx, the players').
// `digest` is the server's id of the failure (the same id is in the server log) — shown so a report can be matched.

export interface ErrorScreenProps {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
  text?: string
  back?: { href: string; label: string }
}

export function ErrorScreen({ error, reset, title = 'Щось пішло не так', text = 'Ми вже бачимо помилку. Спробуй ще раз — зазвичай це минає за мить.', back = { href: '/', label: 'На головну' } }: ErrorScreenProps) {
  const router = useRouter()
  const [pending, start] = useTransition()
  useEffect(() => {
    console.error('[error boundary]', error.digest ?? '', error)
  }, [error])
  // A server component failed: re-render it on the server (router.refresh) and then reset the boundary.
  const retry = () =>
    start(() => {
      router.refresh()
      reset()
    })
  return (
    <div className="page error-screen" role="alert">
      <EmptyState
        mood="dizzy"
        title={title}
        action={
          <>
            <Button onClick={retry} loading={pending}>
              Спробувати ще раз
            </Button>
            <Button href={back.href} variant="ghost">
              {back.label}
            </Button>
          </>
        }
      >
        <p>{text}</p>
        {error.digest ? <p className="error-digest">Код помилки: {error.digest}</p> : null}
      </EmptyState>
    </div>
  )
}
