'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

// First-party analytics (docs/ANALYTICS.md): page views, clicks (what was clicked and where on the screen) and time
// on page, batched and sent with navigator.sendBeacon to /api/a. A random visitor id lives in localStorage, a
// session id in sessionStorage (new after 30 min idle). No third parties, nothing on the admin area itself.

type Ev = { t: 'pageview' | 'click' | 'leave'; p: string; at: number; ti?: string; r?: string; u?: Record<string, string>; tg?: Record<string, string | number>; d?: number }

const SESSION_IDLE_MS = 30 * 60_000
const FLUSH_MS = 5_000

const rid = () => {
  const b = new Uint8Array(12)
  crypto.getRandomValues(b)
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function ids(): { v: string; s: string } {
  try {
    let v = localStorage.getItem('loo.vid')
    if (!v) localStorage.setItem('loo.vid', (v = rid()))
    const now = Date.now()
    const raw = sessionStorage.getItem('loo.sid')
    const [sid, last] = raw ? raw.split('|') : []
    const s = sid && Number(last) > now - SESSION_IDLE_MS ? sid : rid()
    sessionStorage.setItem('loo.sid', `${s}|${now}`)
    return { v, s }
  } catch {
    return { v: 'anonymous0', s: 'anonymous0' }
  }
}

const here = () => location.pathname + location.search

function label(el: Element): string | undefined {
  const text = el.getAttribute('aria-label') || el.getAttribute('title') || (el as HTMLElement).innerText || el.getAttribute('value') || ''
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean ? clean.slice(0, 80) : undefined
}

function hrefOf(el: Element): string | undefined {
  const raw = el.getAttribute('href')
  if (!raw) return undefined
  try {
    const url = new URL(raw, location.href)
    return (url.origin === location.origin ? url.pathname + url.search : url.host + url.pathname).slice(0, 300)
  } catch {
    return undefined
  }
}

export function Tracker() {
  const path = usePathname()
  const queue = useRef<Ev[]>([])
  const pageStart = useRef(0)
  const firstView = useRef(true)
  // the page being viewed (its «leave» is sent when the route changes, after the URL already shows the next one)
  const viewing = useRef('')

  // sending + clicks + leave: one set of listeners for the whole visit
  useEffect(() => {
    const flush = () => {
      if (queue.current.length === 0) return
      const { v, s } = ids()
      const body = JSON.stringify({ v, s, sc: `${screen.width}x${screen.height}`, l: navigator.language.slice(0, 20), e: queue.current.splice(0, 30) })
      const blob = new Blob([body], { type: 'text/plain' })
      if (!navigator.sendBeacon?.('/api/a', blob)) void fetch('/api/a', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'text/plain' } }).catch(() => {})
    }
    const onClick = (e: MouseEvent) => {
      if (location.pathname.startsWith('/admin')) return
      const el = (e.target as Element | null)?.closest?.('a,button,[role="button"],[data-track],summary,input[type="submit"],input[type="button"]')
      if (!el) return
      queue.current.push({
        t: 'click',
        p: here(),
        at: Date.now(),
        tg: {
          ...(label(el) ? { label: label(el)! } : {}),
          ...(hrefOf(el) ? { href: hrefOf(el)! } : {}),
          tag: el.tagName.toLowerCase(),
          ...(el.getAttribute('data-track') ? { track: el.getAttribute('data-track')!.slice(0, 60) } : {}),
          x: Math.round((e.clientX / Math.max(1, innerWidth)) * 1000) / 10,
          y: Math.round((e.clientY / Math.max(1, innerHeight)) * 1000) / 10,
          pageY: Math.round(scrollY + e.clientY),
        },
      })
      if (queue.current.length >= 20) flush()
    }
    const onHide = () => {
      if (document.visibilityState !== 'hidden') return
      if (!location.pathname.startsWith('/admin') && pageStart.current) queue.current.push({ t: 'leave', p: here(), at: Date.now(), d: Date.now() - pageStart.current })
      flush()
    }
    const timer = window.setInterval(flush, FLUSH_MS)
    document.addEventListener('click', onClick, { capture: true, passive: true })
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('click', onClick, { capture: true })
      document.removeEventListener('visibilitychange', onHide)
      flush()
    }
  }, [])

  // a page view on every route change
  useEffect(() => {
    if (path.startsWith('/admin')) return
    const now = Date.now()
    // the same page again within a second (a re-run effect, a double render) is not a new view
    if (viewing.current === here() && now - pageStart.current < 1000) return
    if (pageStart.current && viewing.current && now - pageStart.current >= 500) queue.current.push({ t: 'leave', p: viewing.current, at: now, d: now - pageStart.current })
    pageStart.current = now
    viewing.current = here()
    const ev: Ev = { t: 'pageview', p: here(), at: now, ti: document.title.slice(0, 200) }
    if (firstView.current) {
      firstView.current = false
      if (document.referrer) {
        try {
          const ref = new URL(document.referrer)
          if (ref.origin !== location.origin) ev.r = (ref.host + ref.pathname).slice(0, 512)
        } catch {
          // ignore
        }
      }
      const utm: Record<string, string> = {}
      new URLSearchParams(location.search).forEach((value, key) => {
        if (key.startsWith('utm_') && Object.keys(utm).length < 6) utm[key.slice(0, 30)] = value.slice(0, 120)
      })
      if (Object.keys(utm).length > 0) ev.u = utm
    }
    queue.current.push(ev)
  }, [path])

  return null
}
