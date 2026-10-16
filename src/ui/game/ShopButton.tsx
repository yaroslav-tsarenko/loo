'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { PiCheckBold, PiLockSimpleFill } from 'react-icons/pi'
import { t } from '@/i18n'
import type { Currency, GearSlot, PurchaseBlock, SkinSlot } from '@/game'
import { buyItem, equipItem } from '@/server/actions/shop'
import { Button } from '@/ui/design/Button'
import { burst } from '@/ui/design/Confetti'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { Price } from './Currency'

type Props =
  | { action: 'buy'; itemId: string; price: number; currency: Currency; balance: number; block: PurchaseBlock | null; rankLabel?: string | null }
  | { action: 'equip' | 'unequip'; itemId: string; slot: SkinSlot | GearSlot }

// Buy / equip / take off. Every buy button carries its price (currency icon + number): active when affordable, a grey
// disabled one with «ще N» and a balance bar when not, a lock when the rank is too low. The server re-checks
// everything; the page refreshes so the layout (Loo's look, balance chips) follows.
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
          const out = await equipItem({ slot: props.slot, itemId: props.action === 'equip' ? props.itemId : null })
          if (!out.ok) return setError(t('game.shop.error'))
          feedback.play('flip')
        }
        router.refresh()
      } catch {
        setError(t('game.shop.error'))
      }
    })

  if (props.action !== 'buy') {
    return (
      <span className="shop-action" ref={ref}>
        <Button size="sm" block onClick={run} loading={pending} variant={props.action === 'equip' ? 'secondary' : 'ghost'} icon={props.action === 'unequip' ? <PiCheckBold aria-hidden="true" /> : undefined}>
          {props.action === 'equip' ? t('game.shop.equip') : t('game.shop.unequip')}
        </Button>
        {error ? (
          <span className="shop-error" role="alert">
            {error}
          </span>
        ) : null}
      </span>
    )
  }

  const { price, currency, balance, block } = props
  const funds = block === 'no-bucks' || block === 'no-gems'
  const price$ = <Price currency={currency} amount={price} size={18} />
  let body
  if (!block) {
    body = (
      <Button size="sm" block onClick={run} loading={pending} variant="primary" aria-label={`${t('game.shop.buy')}: ${price}`}>
        <span className="shop-buy-label">
          {t('game.shop.buy')} · {price$}
        </span>
      </Button>
    )
  } else if (funds || block === 'rank') {
    body = (
      <>
        <Button size="sm" block variant="secondary" disabled className="shop-buy-off" icon={block === 'rank' ? <PiLockSimpleFill aria-hidden="true" /> : undefined} title={t(`game.shop.blocks.${block}`)}>
          {price$}
        </Button>
        {block === 'rank' ? (
          <span className="shop-need">{props.rankLabel ? t('game.shop.needRank', { rank: props.rankLabel }) : t('game.shop.blocks.rank')}</span>
        ) : (
          <span className="shop-need">
            <ProgressBar value={balance / price} size="sm" tone={currency === 'gems' ? 'blue' : 'orange'} label={t(`game.shop.blocks.${block}`)} />
            <span className="tabular">{t('game.shop.left', { n: (price - balance).toLocaleString('uk-UA') })}</span>
          </span>
        )}
      </>
    )
  } else {
    body = (
      <Button size="sm" block variant="secondary" disabled>
        {t(`game.shop.blocks.${block}`)}
      </Button>
    )
  }
  return (
    <span className="shop-action" ref={ref}>
      {body}
      {error ? (
        <span className="shop-error" role="alert">
          {error}
        </span>
      ) : null}
    </span>
  )
}
