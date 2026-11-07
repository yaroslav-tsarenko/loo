import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { PiCheckBold, PiLockSimpleFill, PiStorefrontFill } from 'react-icons/pi'
import { t } from '@/i18n'
import {
  GEAR_SLOTS,
  HEART_REFILL_MS,
  isConsumable,
  isGear,
  isSkin,
  MAX_FREEZES,
  MAX_HEARTS,
  minRank,
  minStep,
  purchaseBlock,
  rarityOf,
  SHOP_ITEMS,
  STAT_ICON,
  STATS,
  tryOn,
  WARRIOR_FROM,
  WARRIOR_ICON,
  type EquippedGear,
  type EquippedSkin,
  type GearItem,
  type ShopItem,
  type SkinItem,
  type SkinSlot,
  type Wallet,
} from '@/game'
import { nowMs } from '@/server/clock'
import { requireUser, userScope } from '@/server/auth'
import { gameSnapshotIn, ownedItems } from '@/server/game'
import { Card } from '@/ui/design/Card'
import { GameIcon } from '@/ui/design/GameIcon'
import { PixelIcon } from '@/ui/design/PixelIcon'
import { Loo } from '@/ui/design/mascot/Loo'
import { BoostLeft } from '@/ui/game/BoostLeft'
import { CurrencyIcon } from '@/ui/game/Currency'
import { ShopButton } from '@/ui/game/ShopButton'
import { ShopTryOnProvider, TryOnButton, TryOnStage } from '@/ui/game/ShopTryOn'
import { Icon } from '@/ui/icons/Icon'

export const metadata: Metadata = { title: 'Крамниця' }

const SKIN_SLOTS: readonly SkinSlot[] = ['hat', 'glasses', 'hoodie', 'scarf']

type ItemName = 'streak-freeze'
const itemName = (item: ShopItem) => t(`game.shop.items.${item.id as ItemName}.name`)

// /shop: consumables (bucks), gear by slot (stats for battles; epic / legendary for gems and a rank) and skins.
// Every card shows its price in its currency; the server re-checks everything (src/server/actions/shop.ts).
export default async function ShopPage() {
  await requireUser()
  const now = nowMs()
  const { game, owned } = await userScope(async (tx, userId) => ({ game: await gameSnapshotIn(tx, userId, now), owned: await ownedItems(tx, userId) }), { tx: true })
  const step = Math.max(game.step, game.rank.rank.index)
  const wallet: Wallet = { bucks: game.bucks, gems: game.gems, hearts: game.hearts.hearts, freezes: game.freezes, boostUntil: game.boostUntil, owned, step, now }
  const skin = game.equipped as EquippedSkin
  const gear = game.gear as EquippedGear

  const buy = (item: ShopItem) => {
    const rank = minRank(item)
    return (
      <ShopButton
        action="buy"
        itemId={item.id}
        price={item.price}
        currency={item.currency}
        balance={item.currency === 'gems' ? game.gems : game.bucks}
        block={purchaseBlock(item, wallet)}
        rankLabel={rank ? WARRIOR_FROM[rank] : null}
      />
    )
  }

  const status = (item: ShopItem): ReactNode => {
    if (item.kind === 'freeze') return t('game.shop.freezes', { n: game.freezes, max: MAX_FREEZES })
    if (item.kind === 'refill')
      return game.hearts.hearts >= MAX_HEARTS ? (
        t('game.hearts.full')
      ) : (
        <>
          <GameIcon name="heart" size={16} /> {game.hearts.hearts}/{MAX_HEARTS} · +1 / {HEART_REFILL_MS / 3_600_000} год
        </>
      )
    return null
  }

  // One wearable card: Loo with the item on top of the current outfit, rarity, stats, rank gate, price / equip.
  const wearable = (item: GearItem | SkinItem) => {
    const has = owned.has(item.id)
    const slotOn = isGear(item) ? gear[item.slot] : skin[item.slot]
    const on = slotOn === item.id
    const rarity = rarityOf(item)!
    const rank = minRank(item)
    const locked = !has && step < minStep(item)
    return (
      <li key={item.id}>
        <Card variant="raised" className="shop-item shop-wear" as="article" data-rarity={rarity} data-on={on ? '' : undefined}>
          <span className="shop-rarity">{t(`game.shop.rarity.${rarity}`)}</span>
          <Loo mood={on ? 'happy' : 'idle'} size={88} skin={tryOn(skin, gear, item)} animated={false} decorative />
          <h4 className="shop-item-name">{itemName(item)}</h4>
          {isGear(item) ? (
            <ul className="shop-stats" aria-label={t('game.shop.stats')}>
              {STATS.filter((s) => item.stats[s]).map((s) => (
                <li key={s} title={t(`game.stats.${s}.hint`)}>
                  <Icon name={STAT_ICON[s]} size={14} /> {t(`game.stats.${s}.name`)} <strong className="tabular">+{item.stats[s]}</strong>
                </li>
              ))}
            </ul>
          ) : null}
          {rank && !has ? (
            <p className="shop-item-rank" data-locked={locked ? '' : undefined}>
              <PiLockSimpleFill aria-hidden="true" /> {t('game.shop.needRank', { rank: WARRIOR_FROM[rank] })}
            </p>
          ) : null}
          {on ? (
            <span className="shop-item-status">
              <PiCheckBold aria-hidden="true" /> {t('game.shop.equipped')}
            </span>
          ) : has ? (
            <span className="shop-item-status">{t('game.shop.owned')}</span>
          ) : (
            <TryOnButton itemId={item.id} />
          )}
          {has ? <ShopButton action={on ? 'unequip' : 'equip'} itemId={item.id} slot={item.slot} /> : buy(item)}
        </Card>
      </li>
    )
  }

  const consumables = SHOP_ITEMS.filter(isConsumable)
  const gearItems = SHOP_ITEMS.filter(isGear)
  const skins = SHOP_ITEMS.filter(isSkin)

  return (
    <div className="page shop-page" data-width="wide">
      <header className="ghead">
        <span className="ghead-badge" data-tone="red" aria-hidden="true">
          <PiStorefrontFill size={38} />
        </span>
        <div className="ghead-text">
          <h1 className="ghead-title">{t('game.shop.title')}</h1>
          <p className="ghead-lead">{t('game.shop.lead')}</p>
        </div>
      </header>

      <ShopTryOnProvider skin={skin} gear={gear}>
        <div className="shop-top">
          <Card variant="raised" className="shop-wallet" tone="orange">
            <span className="shop-wallet-label">{t('game.shop.balance')}</span>
            <div className="shop-wallet-balances">
              <span className="shop-wallet-coin" data-currency="bucks">
                <CurrencyIcon currency="bucks" size={34} />
                <strong className="tabular">{game.bucks.toLocaleString('uk-UA')}</strong>
                <span className="shop-wallet-hint">
                  {t('game.bucks.title')} · {t('game.shop.bucksHint')}
                </span>
              </span>
              <span className="shop-wallet-coin" data-currency="gems">
                <CurrencyIcon currency="gems" size={34} />
                <strong className="tabular">{game.gems.toLocaleString('uk-UA')}</strong>
                <span className="shop-wallet-hint">
                  {t('game.gems.title')} · {t('game.shop.gemsHint')}
                </span>
              </span>
            </div>
            <span className="shop-wallet-meta">
              <span>
                <PixelIcon name={WARRIOR_ICON[game.rank.rank.rank]} size={18} /> {game.rank.rank.title}
              </span>
              <span>
                <GameIcon name="heart" size={18} /> {game.hearts.hearts}/{MAX_HEARTS}
              </span>
              <span>
                <PixelIcon name="freeze" size={18} /> {game.freezes}/{MAX_FREEZES}
              </span>
              {game.boostActive && game.boostUntil ? <BoostLeft until={game.boostUntil} /> : null}
            </span>
          </Card>
          <Card variant="raised" className="shop-stage-card">
            <TryOnStage step={step} />
          </Card>
        </div>

        <h2 className="gsection-title">{t('game.shop.consumables')}</h2>
        <ul className="shop-grid" data-kind="powerups">
          {consumables.map((item) => (
            <li key={item.id}>
              <Card variant="raised" className="shop-item" as="article">
                <span className="shop-item-art" aria-hidden="true">
                  {'icon' in item ? <Icon name={item.icon} size={48} /> : null}
                </span>
                <h3 className="shop-item-name">{itemName(item)}</h3>
                <p className="shop-item-desc">{t(`game.shop.items.${item.id as ItemName}.desc`)}</p>
                {status(item) ? <p className="shop-item-status">{status(item)}</p> : null}
                {buy(item)}
              </Card>
            </li>
          ))}
        </ul>

        <h2 className="gsection-title">{t('game.shop.gearTitle')}</h2>
        <p className="ghead-lead">{t('game.shop.gearLead')}</p>
        {GEAR_SLOTS.map((slot) => (
          <section key={slot} className="shop-slot" aria-labelledby={`gear-${slot}`}>
            <h3 className="shop-slot-title" id={`gear-${slot}`}>
              {t(`game.shop.gearSlots.${slot}`)}
            </h3>
            <ul className="shop-grid" data-kind="gear">
              {gearItems.filter((g) => g.slot === slot).map(wearable)}
            </ul>
          </section>
        ))}

        <h2 className="gsection-title">{t('game.shop.skinsTitle')}</h2>
        <p className="ghead-lead">{t('game.shop.looLead')}</p>
        {SKIN_SLOTS.map((slot) => (
          <section key={slot} className="shop-slot" aria-labelledby={`slot-${slot}`}>
            <h3 className="shop-slot-title" id={`slot-${slot}`}>
              {t(`game.shop.slots.${slot}`)}
            </h3>
            <ul className="shop-grid" data-kind="skins">
              {skins.filter((s) => s.slot === slot).map(wearable)}
            </ul>
          </section>
        ))}
      </ShopTryOnProvider>

      <h2 className="gsection-title">{t('game.shop.earnTitle')}</h2>
      <div className="shop-earn-cols">
        <ul className="shop-earn">
          {(['lesson', 'test', 'mission', 'practice'] as const).map((k) => (
            <li key={k}>
              <CurrencyIcon currency="bucks" size={18} /> {t(`game.shop.earn.${k}`)}
            </li>
          ))}
        </ul>
        <ul className="shop-earn">
          {(['exam', 'rank', 'streak', 'achievements', 'league'] as const).map((k) => (
            <li key={k}>
              <CurrencyIcon currency="gems" size={18} /> {t(`game.shop.earn.${k}`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
