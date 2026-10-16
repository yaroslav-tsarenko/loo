'use client'

import { createContext, use, useState, type ReactNode } from 'react'
import { PiArrowCounterClockwiseBold, PiTShirtFill } from 'react-icons/pi'
import { t } from '@/i18n'
import { gearStats, isGear, shopItem, skinLook, STAT_ICON, STATS, type EquippedGear, type EquippedSkin } from '@/game'
import { Button } from '@/ui/design/Button'
import { Icon } from '@/ui/icons/Icon'
import { LooCharacter } from './LooCharacter'

// Live preview in /shop: «Приміряти» puts an item on the big Loo (on top of what's equipped) without buying it, and
// the battle stats show the difference. Pure rules from src/game, so nothing here touches the server.

interface Outfit {
  skin: EquippedSkin
  gear: EquippedGear
}

const TryOnContext = createContext<{ base: Outfit; trial: Outfit | null; tryOn: (id: string) => void; reset: () => void } | null>(null)

export function ShopTryOnProvider({ skin, gear, children }: { skin: EquippedSkin; gear: EquippedGear; children: ReactNode }) {
  const base = { skin, gear }
  const [trial, setTrial] = useState<Outfit | null>(null)
  const tryOn = (id: string) => {
    const item = shopItem(id)
    if (!item) return
    setTrial((cur) => {
      const from = cur ?? base
      if (isGear(item)) return { ...from, gear: { ...from.gear, [item.slot]: item.id } }
      if (item.kind === 'skin') return { ...from, skin: { ...from.skin, [item.slot]: item.id } }
      return cur
    })
  }
  return <TryOnContext value={{ base, trial, tryOn, reset: () => setTrial(null) }}>{children}</TryOnContext>
}

function useTryOn() {
  const ctx = use(TryOnContext)
  if (!ctx) throw new Error('ShopTryOnProvider missing')
  return ctx
}

// The big Loo + battle stats of the outfit on him (tried-on items show the change against what's equipped).
export function TryOnStage({ step }: { step: number }) {
  const { base, trial, reset } = useTryOn()
  const outfit = trial ?? base
  const now = gearStats(base.gear)
  const next = gearStats(outfit.gear)
  return (
    <div className="shop-stage" data-trial={trial ? '' : undefined}>
      <p className="shop-stage-label">{trial ? t('game.shop.preview') : t('game.shop.equipped')}</p>
      <LooCharacter step={step} mood={trial ? 'love' : 'happy'} size={168} skin={skinLook(outfit.skin, outfit.gear)} />
      <ul className="shop-stage-stats" aria-label={t('game.shop.stats')}>
        {STATS.map((s) => {
          const diff = next[s] - now[s]
          return (
            <li key={s} title={t(`game.stats.${s}.hint`)}>
              <Icon name={STAT_ICON[s]} size={18} />
              <span className="shop-stat-name">{t(`game.stats.${s}.name`)}</span>
              <span className="tabular">{next[s]}</span>
              {diff !== 0 ? (
                <span className="shop-stat-diff tabular" data-up={diff > 0 ? '' : undefined}>
                  {diff > 0 ? `+${diff}` : diff}
                </span>
              ) : null}
            </li>
          )
        })}
      </ul>
      {trial ? (
        <Button size="sm" variant="ghost" onClick={reset} icon={<PiArrowCounterClockwiseBold aria-hidden="true" />}>
          {t('game.shop.previewReset')}
        </Button>
      ) : null}
    </div>
  )
}

export function TryOnButton({ itemId }: { itemId: string }) {
  const { tryOn } = useTryOn()
  return (
    <button type="button" className="shop-tryon" onClick={() => tryOn(itemId)} title={t('game.shop.tryOn')}>
      <PiTShirtFill aria-hidden="true" /> {t('game.shop.tryOn')}
    </button>
  )
}
