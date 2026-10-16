'use client'

import { useCallback, useSyncExternalStore } from 'react'

// Expanded nodes of the sidebar trees, persisted in localStorage and shared by every tree on the page.
const OPEN_KEY = 'sidebar-open-nodes'
const OPEN_EVENT = 'sidebar-open-nodes'

function subscribe(cb: () => void) {
  window.addEventListener(OPEN_EVENT, cb)
  return () => window.removeEventListener(OPEN_EVENT, cb)
}

function read(): string {
  try {
    return window.localStorage.getItem(OPEN_KEY) ?? '[]'
  } catch {
    return '[]'
  }
}

function parse(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw)
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
  } catch {
    return []
  }
}

export type SetOpen = (ids: string | readonly string[], open?: boolean) => void

// [open ids, set(ids, open?)] — without `open` a single id toggles.
export function useOpenNodes(): [ReadonlySet<string>, SetOpen] {
  const raw = useSyncExternalStore(subscribe, read, () => '[]')
  const set = new Set(parse(raw))
  const update = useCallback<SetOpen>((ids, open) => {
    const current = new Set(parse(read()))
    const list = typeof ids === 'string' ? [ids] : ids
    let changed = false
    for (const id of list) {
      const next = open ?? !current.has(id)
      if (next === current.has(id)) continue
      changed = true
      if (next) current.add(id)
      else current.delete(id)
    }
    if (!changed) return
    try {
      window.localStorage.setItem(OPEN_KEY, JSON.stringify([...current]))
    } catch {}
    window.dispatchEvent(new Event(OPEN_EVENT))
  }, [])
  return [set, update]
}
