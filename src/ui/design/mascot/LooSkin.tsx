'use client'

import { createContext, use, type ReactNode } from 'react'
import type { LooSkin } from './pixels'

// The signed-in learner's equipped Loo skin (bought in /shop), provided once by the root layout.
const LooSkinContext = createContext<LooSkin | undefined>(undefined)

export function LooSkinProvider({ skin, children }: { skin: LooSkin | undefined; children: ReactNode }) {
  return <LooSkinContext value={skin}>{children}</LooSkinContext>
}

export function useLooSkin(): LooSkin | undefined {
  return use(LooSkinContext)
}
