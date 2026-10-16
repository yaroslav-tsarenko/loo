'use client'

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { updateSetting } from '@/server/actions/settings'
import type { Accent } from './speech/voices'

// Learner's speech preferences on the client: the English accent (en-GB / en-US, stored in user settings as
// `accent`). Root layout provides it; AudioButton / IpaChip / SpeakExercise read it.

interface SpeechSettings {
  accent: Accent
  setAccent: (accent: Accent) => void
}

const Ctx = createContext<SpeechSettings>({ accent: 'en-GB', setAccent: () => {} })

export function SpeechSettingsProvider({ accent: initial, children }: { accent: Accent; children: ReactNode }) {
  // follows the server value after a settings change elsewhere (router.refresh), keeps a local pick until then
  const [state, setState] = useState({ initial, accent: initial })
  if (state.initial !== initial) setState({ initial, accent: initial })
  const accent = state.initial !== initial ? initial : state.accent
  const setAccent = useCallback((next: Accent) => {
    setState((s) => ({ ...s, accent: next }))
    void updateSetting('accent', next).catch(() => {})
  }, [])
  const value = useMemo(() => ({ accent, setAccent }), [accent, setAccent])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useSpeechSettings = (): SpeechSettings => useContext(Ctx)

// Re-renders when the browser's voice list changes (voices load asynchronously in Chrome).
function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return () => {}
  window.speechSynthesis.addEventListener('voiceschanged', cb)
  return () => window.speechSynthesis.removeEventListener('voiceschanged', cb)
}
const voiceCount = () => ('speechSynthesis' in window ? window.speechSynthesis.getVoices().length : -2)

// -1 on the server and while hydrating, -2 in a browser without speechSynthesis, else the number of system voices
export const useVoiceCount = (): number => useSyncExternalStore(subscribe, voiceCount, () => -1)
