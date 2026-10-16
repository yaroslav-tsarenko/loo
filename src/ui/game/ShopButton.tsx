'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { t } from '@/i18n'
import type { SkinSlot } from '@/game'
import { buyItem, equipSkin } from '@/server/actions/shop'
import { Button } from '@/ui/design/Button'
import { burst } from '@/ui/design/Confetti'
import { GameIcon } from '@/ui/design/GameIcon'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'

type Props =
  | { action: 'buy'; itemId: string; price: number; blocked: string | null }
  | { action: 'equip' | 'unequip'; itemId: string; slot: SkinSlot }

// Buy / equip / take off. The server re-checks everything; the page refreshes so the layout (Loo skin, gem chip) follows.
export function ShopButton(props: Props) {
  const router = useRouter()
  const feedback = useFeedback()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const ref = useRef<HTMLSpanElement>(null)

  const run = () =>
    start(async () => {
      setError(null)
      try {
        if (props.action === 'buy') {
          const out = await buyItem({ itemId: props.itemId })
          if (!out.ok) {
            setError(t(`game.shop.blocks.${out.reason}`))
            feedback.play('wrong')
            return
          }
          feedback.effects(out.effects)
          feedback.play('achievement')
          burst({ from: ref.current, count: 40, spread: 0.6 })
        } else {
          const out = await equipSkin({ slot: props.slot, itemId: props.action === 'equip' ? props.itemId : null })
          if (!out.ok) return setError(t('game.shop.error'))
          feedback.play('flip')
        }
        router.refresh()
      } catch {
        setError(t('game.shop.error'))
      }
    })

  return (
    <span className="shop-action" ref={ref}>
      {props.action === 'buy' ? (
        <Button size="sm" block onClick={run} loading={pending} disabled={Boolean(props.blocked)} variant={props.blocked ? 'secondary' : 'primary'} icon={props.blocked ? undefined : <GameIcon name="gem" size={18} />}>
          {props.blocked ?? props.price}
        </Button>
      ) : (
        <Button size="sm" block onClick={run} loading={pending} variant={props.action === 'equip' ? 'secondary' : 'ghost'}>
          {props.action === 'equip' ? t('game.shop.equip') : t('game.shop.unequip')}
        </Button>
      )}
      {error ? (
        <span className="shop-error" role="alert">
          {error}
        </span>
      ) : null}
    </span>
  )
}
