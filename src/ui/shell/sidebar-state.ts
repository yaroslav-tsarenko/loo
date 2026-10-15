'use client'

import { useSyncExternalStore } from 'react'

import { SIDEBAR_KEY as KEY } from './constants'
const EVENT = 'sidebar-change'

function subscribe(callback: () => void): () => void {
  window.addEventListener(EVENT, callback)
  return () => window.removeEventListener(EVENT, callback)
}

function read(): boolean {
  return document.documentElement.dataset.sidebar !== 'closed'
}

export function useSidebarOpen(): boolean {
  return useSyncExternalStore(subscribe, read, () => true)
}

export function setSidebarOpen(open: boolean): void {
  document.documentElement.dataset.sidebar = open ? 'open' : 'closed'
  try {
    window.localStorage.setItem(KEY, open ? 'open' : 'closed')
  } catch {}
  window.dispatchEvent(new Event(EVENT))
}

export function setMobileSidebar(open: boolean): void {
  document.documentElement.dataset.drawer = open ? 'open' : 'closed'
  window.dispatchEvent(new Event(EVENT))
}
