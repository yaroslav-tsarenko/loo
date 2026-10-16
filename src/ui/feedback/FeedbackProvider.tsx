'use client'

import dynamic from 'next/dynamic'
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Effect } from '@/progress/types'
import { updateSetting } from '@/server/actions/settings'
import { haptic, type HapticName } from './haptics'
import { SoundEngine, type SoundName } from './sound'

const FeedbackLayer = dynamic(() => import('./FeedbackLayer').then((m) => m.FeedbackLayer), { ssr: false })

export interface Toast {
  id: number
  effect: Effect
}

interface FeedbackApi {
  xp: number
  sound: boolean
  toggleSound: () => void
  play: (name: SoundName) => void
  answer: (correct: boolean) => void
  effects: (list: readonly Effect[]) => void
}

const FeedbackContext = createContext<FeedbackApi | null>(null)

export function useFeedback(): FeedbackApi {
  const ctx = use(FeedbackContext)
  if (!ctx) throw new Error('FeedbackProvider missing')
  return ctx
}

const HAPTIC_FOR: Partial<Record<SoundName, HapticName>> = {
  correct: 'success',
  wrong: 'error',
  flip: 'flip',
  xp: 'xp',
  combo: 'combo',
  complete: 'complete',
  level: 'complete',
  achievement: 'complete',
  goal: 'success',
}

// Buttons that deserve a light tap when pressed.
const TAP_TARGETS = ".lu-btn, .lu-ibtn, .lu-card[data-variant='interactive'], .quiz-option, .order-piece, .fill-chip, .home-continue, .lesson-bubble, .budget-chip, .chip-check, .gchip"

export function FeedbackProvider({ children, initialXp, sound, volume, haptics = true }: { children: ReactNode; initialXp: number; sound: boolean; volume: number; haptics?: boolean }) {
  const engine = useRef<SoundEngine | null>(null)
  const [enabled, setEnabled] = useState(sound)
  const [xp, setXp] = useState(initialXp)
  const [seenInitial, setSeenInitial] = useState(initialXp)
  if (seenInitial !== initialXp) {
    setSeenInitial(initialXp)
    setXp(initialXp)
  }
  const [toasts, setToasts] = useState<Toast[]>([])
  const [layer, setLayer] = useState(false)
  const counter = useRef(0)

  const getEngine = useCallback(() => {
    if (!engine.current) engine.current = new SoundEngine()
    engine.current.enabled = enabled
    engine.current.setVolume(volume)
    return engine.current
  }, [enabled, volume])

  const play = useCallback(
    (name: SoundName) => {
      getEngine().play(name)
      const h = HAPTIC_FOR[name]
      if (haptics && h) haptic(h)
    },
    [getEngine, haptics],
  )

  useEffect(() => {
    if (!haptics) return
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest(TAP_TARGETS)) haptic('tap')
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [haptics])

  const answer = useCallback((correct: boolean) => play(correct ? 'correct' : 'wrong'), [play])

  const effects = useCallback(
    (list: readonly Effect[]) => {
      if (list.length === 0) return
      window.dispatchEvent(new Event('progress:changed'))
      let gained = 0
      const shown: Toast[] = []
      for (const effect of list) {
        if (effect.type === 'xp') gained += effect.amount
        if (effect.type === 'mistake-added' || effect.type === 'hearts') continue
        shown.push({ id: ++counter.current, effect })
      }
      if (gained > 0) setXp((v) => v + gained)
      if (list.some((e) => e.type === 'level-up' || e.type === 'rank-up' || e.type === 'evolution')) window.setTimeout(() => play('level'), 350)
      else if (list.some((e) => e.type === 'achievement')) window.setTimeout(() => play('achievement'), 350)
      else if (list.some((e) => e.type === 'daily-goal' || e.type === 'mission')) window.setTimeout(() => play('goal'), 350)
      const merged = mergeXp(shown)
      if (merged.length > 0) {
        setLayer(true)
        setToasts((t) => [...t, ...merged].slice(-6))
      }
    },
    [play],
  )

  const toggleSound = useCallback(() => {
    setEnabled((v) => {
      const next = !v
      void updateSetting('sound', next)
      return next
    })
  }, [])

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const api = useMemo<FeedbackApi>(() => ({ xp, sound: enabled, toggleSound, play, answer, effects }), [xp, enabled, toggleSound, play, answer, effects])

  return (
    <FeedbackContext value={api}>
      {children}
      {layer ? <FeedbackLayer toasts={toasts} onDismiss={dismiss} /> : null}
    </FeedbackContext>
  )
}

// One «+N XP», one «+N bucks» and one «+N gems» toast per batch.
const SUMMED = ['xp', 'bucks', 'gems'] as const
function mergeXp(list: Toast[]): Toast[] {
  const total = (type: (typeof SUMMED)[number]) => list.reduce((sum, t) => sum + (t.effect.type === type ? t.effect.amount : 0), 0)
  const rest = list.filter((t) => !(SUMMED as readonly string[]).includes(t.effect.type))
  const out: Toast[] = []
  for (const type of SUMMED) {
    const firstOf = list.find((t) => t.effect.type === type)
    const amount = total(type)
    if (firstOf && amount > 0) out.push({ id: firstOf.id, effect: { type, amount, reason: 'total' } })
  }
  return [...out, ...rest]
}
