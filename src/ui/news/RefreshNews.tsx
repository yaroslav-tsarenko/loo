'use client'

import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { refreshNews } from '@/server/actions/news'

export function RefreshNews() {
  const [pending, start] = useTransition()
  const [note, setNote] = useState<string | null>(null)
  const router = useRouter()

  const run = () =>
    start(async () => {
      setNote(null)
      try {
        const res = await refreshNews()
        setNote(res.ok ? `Оновлено: ${res.upserted} матеріалів` : `Можна оновити через ${Math.ceil(res.retryInMs / 60_000)} хв`)
        if (res.ok) router.refresh()
      } catch {
        setNote('Не вдалося оновити. Спробуйте пізніше')
      }
    })

  return (
    <div className="news-refresh">
      <button type="button" className="ui-button" data-variant="ghost" onClick={run} disabled={pending}>
        <RefreshCw size={14} strokeWidth={1.8} className={pending ? 'news-spin' : undefined} aria-hidden="true" />
        {pending ? 'Збираю…' : 'Оновити'}
      </button>
      <span className="news-refresh-note" role="status">
        {note}
      </span>
    </div>
  )
}
