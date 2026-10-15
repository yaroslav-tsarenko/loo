'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ClientEnhancer() {
  const router = useRouter()

  useEffect(() => {
    const onClick = async (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-copy]') : null
      if (!target) return
      const code = target.closest('figure')?.querySelector('pre code')
      if (!code) return
      try {
        await navigator.clipboard.writeText(code.textContent ?? '')
        target.dataset.copied = ''
        target.textContent = 'Скопійовано'
        window.setTimeout(() => {
          delete target.dataset.copied
          target.textContent = 'Копіювати'
        }, 1600)
      } catch {
        target.textContent = 'Не вдалося'
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    let timer: number | null = null
    const source = new EventSource('/api/events')
    source.addEventListener('content', () => {
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(() => router.refresh(), 150)
    })
    return () => {
      if (timer) window.clearTimeout(timer)
      source.close()
    }
  }, [router])

  return null
}
