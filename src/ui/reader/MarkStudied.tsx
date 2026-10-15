'use client'

import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { markChapter } from '@/server/actions/study'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'

export function MarkStudied({ chapterId, studied, nextHref, prevHref }: { chapterId: string; studied: boolean; nextHref: string | null; prevHref: string | null }) {
  const [done, setDone] = useState(studied)
  const [pending, start] = useTransition()
  const feedback = useFeedback()
  const router = useRouter()

  const [seen, setSeen] = useState(studied)
  if (seen !== studied) {
    setSeen(studied)
    setDone(studied)
  }

  const toggle = () =>
    start(async () => {
      const next = !done
      setDone(next)
      const effects = await markChapter({ chapterId, studied: next })
      if (next) feedback.play('correct')
      feedback.effects(effects)
      router.refresh()
    })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'm' || e.key === 'ь') toggle()
      if (e.key === ']' && nextHref) router.push(nextHref)
      if (e.key === '[' && prevHref) router.push(prevHref)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <button type="button" className="topbar-button" data-done={done ? '' : undefined} aria-pressed={done} disabled={pending} onClick={toggle} title="Клавіша M" aria-label={done ? 'Вивчено' : 'Позначити як вивчене'}>
      <Check size={15} strokeWidth={2} aria-hidden="true" />
      <span className="topbar-label">{done ? 'Вивчено' : 'Позначити як вивчене'}</span>
    </button>
  )
}
