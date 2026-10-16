import type { Currency } from '@/game'
import { cx } from '@/ui/design/cx'
import { GameIcon } from '@/ui/design/GameIcon'
import { PixelIcon } from '@/ui/design/PixelIcon'

const NAME: Record<Currency, string> = { bucks: 'баксів', gems: 'кристалів' }

// Bucks = the pixel coin, gems = the blue crystal: every price says which one it is.
export function CurrencyIcon({ currency, size = 18, className }: { currency: Currency; size?: number; className?: string }) {
  return currency === 'bucks' ? <PixelIcon name="buck" size={size} className={className} /> : <GameIcon name="gem" size={size} className={className} />
}

export function Price({ currency, amount, size = 18, className }: { currency: Currency; amount: number; size?: number; className?: string }) {
  return (
    <span className={cx('lu-price', className)} data-currency={currency} aria-label={`${amount} ${NAME[currency]}`}>
      <CurrencyIcon currency={currency} size={size} />
      <span className="tabular" aria-hidden="true">
        {amount.toLocaleString('uk-UA')}
      </span>
    </span>
  )
}
