'use client'

import { Check } from 'lucide-react'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface SyncValue {
  chapter: number
  setChapter: (i: number) => void
}

const SyncContext = createContext<SyncValue | null>(null)

// Lets a step list outside the figure follow the playing scene.
export function TheaterSync({ children }: { children: ReactNode }) {
  const [chapter, setChapter] = useState(-1)
  const value = useMemo(() => ({ chapter, setChapter }), [chapter])
  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>
}

export function useTheaterSync(): SyncValue | null {
  return useContext(SyncContext)
}

export function TheaterSteps({ steps }: { steps: string[] }) {
  const sync = useTheaterSync()
  const active = sync?.chapter ?? -1
  return (
    <ol className="th-steps">
      {steps.map((text, i) => (
        <li key={text} aria-current={active === i ? 'step' : undefined} data-done={active > i ? '' : undefined}>
          <span className="th-steps-num" aria-hidden="true">
            {active > i ? <Check size={13} /> : i + 1}
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ol>
  )
}
