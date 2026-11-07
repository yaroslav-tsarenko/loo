'use client'

import { createContext, useContext } from 'react'

interface SyncValue {
  chapter: number
  setChapter: (i: number) => void
}

const SyncContext = createContext<SyncValue | null>(null)

export function useTheaterSync(): SyncValue | null {
  return useContext(SyncContext)
}
