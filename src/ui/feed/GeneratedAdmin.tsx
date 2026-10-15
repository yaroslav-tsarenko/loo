'use client'

import { Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { hideGeneratedReel } from '@/server/actions/feed'
import { generateReelsNow } from '@/server/actions/reels'

export function GenerateNow() {
  const [pending, start] = useTransition()
  const [note, setNote] = useState<string | null>(null)
  const router = useRouter()

  const run = () =>
    start(async () => {
      setNote(null)
      try {
        const res = await generateReelsNow()
        if (res.ok) {
          setNote(`Додано ${res.inserted}, відсіяно ${res.dropped} · ${res.tokens.toLocaleString('uk-UA')} токенів`)
          router.refresh()
        } else if (res.reason === 'cooldown') setNote(`Можна ще раз через ${Math.ceil(res.retryInMs / 60_000)} хв`)
        else setNote(res.message)
      } catch {
        setNote('Не вдалося згенерувати. Спробуйте пізніше')
      }
    })

  return (
    <div className="news-refresh">
      <button type="button" className="ui-button" onClick={run} disabled={pending}>
        <Sparkles size={14} strokeWidth={1.8} className={pending ? 'news-spin' : undefined} aria-hidden="true" />
        {pending ? 'Генерую… (до 2 хв)' : 'Згенерувати зараз'}
      </button>
      <span className="news-refresh-note" role="status">
        {note}
      </span>
    </div>
  )
}

export function HideButton({ id }: { id: string }) {
  const [pending, start] = useTransition()
  const router = useRouter()
  return (
    <button
      type="button"
      className="ui-button"
      data-variant="ghost"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await hideGeneratedReel(id)
          router.refresh()
        })
      }
    >
      🙈 Сховати
    </button>
  )
}
