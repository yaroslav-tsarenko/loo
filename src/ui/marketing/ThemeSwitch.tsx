'use client'

import '@/app/landing.css'
import { useSyncExternalStore } from 'react'
import { PixelIcon } from '@/ui/design/PixelIcon'
import { PUBLIC_THEME_EVENT, PUBLIC_THEME_KEY } from '@/ui/shell/constants'

type Scheme = 'light' | 'dark'

const DARK = '(prefers-color-scheme: dark)'

function subscribe(onChange: () => void) {
  const mq = matchMedia(DARK)
  mq.addEventListener('change', onChange)
  window.addEventListener(PUBLIC_THEME_EVENT, onChange)
  return () => {
    mq.removeEventListener('change', onChange)
    window.removeEventListener(PUBLIC_THEME_EVENT, onChange)
  }
}

function current(): Scheme {
  const set = document.documentElement.dataset.theme
  if (set === 'light' || set === 'dark') return set
  return matchMedia(DARK).matches ? 'dark' : 'light'
}

// Light ↔ dark for signed-out pages (PUBLIC_THEME_BOOT re-applies the choice before paint on the next visit).
export function ThemeSwitch() {
  const scheme = useSyncExternalStore(subscribe, current, () => null)
  const next: Scheme = scheme === 'dark' ? 'light' : 'dark'
  const toggle = () => {
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(PUBLIC_THEME_KEY, next)
    } catch {}
    window.dispatchEvent(new Event(PUBLIC_THEME_EVENT))
  }
  return (
    <button type="button" className="theme-switch" onClick={toggle} aria-label={next === 'dark' ? 'Темна тема' : 'Світла тема'} title={next === 'dark' ? 'Темна тема' : 'Світла тема'}>
      <PixelIcon name={scheme === 'dark' ? 'sun' : 'moon'} size={24} />
    </button>
  )
}
