import type { Metadata } from 'next'
import { PiStorefrontFill } from 'react-icons/pi'
import { t } from '@/i18n'
import { HEART_REFILL_MS, isSkin, MAX_FREEZES, MAX_HEARTS, purchaseBlock, SHOP_ITEMS, tryOn, type ShopItem, type SkinItem, type SkinSlot } from '@/game'
import { nowMs } from '@/server/clock'
import { requireUser, userScope } from '@/server/auth'
import { gameSnapshotIn, ownedItems } from '@/server/game'
import { Card } from '@/ui/design/Card'
import { GameIcon } from '@/ui/design/GameIcon'
import { Loo } from '@/ui/design/mascot/Loo'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { ShopButton } from '@/ui/game/ShopButton'
import { BoostLeft } from '@/ui/game/BoostLeft'

export const metadata: Metadata = { title: 'Крамниця' }

const SLOTS: readonly SkinSlot[] = ['hat', 'glasses', 'hoodie', 'scarf']

// 🛒 /shop: power-ups (🧊 freeze, ❤️ refill, ⚡ double XP) and Loo's wardrobe. Prices and rules: src/game/shop.ts.
export default async function ShopPage() {
  await requireUser()
  const now = nowMs()
  const { game, owned } = await userScope(async (tx, userId) => ({ game: await gameSnapshotIn(tx, userId, now), owned: await ownedItems(tx, userId) }), { tx: true })
  const wallet = { gems: game.gems, hearts: game.hearts.hearts, freezes: game.freezes, boostUntil: game.boostUntil, owned, now }
  const blocked = (item: ShopItem) => {
    const b = purchaseBlock(item, wallet)
    return b ? t(`game.shop.blocks.${b}`) : null
  }
  const powerups = SHOP_ITEMS.filter((i) => !isSkin(i))
  const skins = SHOP_ITEMS.filter(isSkin)
  const equipped = game.equipped as Partial<Record<SkinSlot, string>>
  const status = (item: ShopItem): string | null => {
    if (item.kind === 'freeze') return t('game.shop.freezes', { n: game.freezes, max: MAX_FREEZES })
    if (item.kind === 'refill') return game.hearts.hearts >= MAX_HEARTS ? t('game.hearts.full') : `${game.hearts.hearts}/${MAX_HEARTS} ❤️`
    return null
  }
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

      <Card variant="raised" className="shop-wallet" tone="blue">
        <Loo mood={game.gems >= 100 ? 'love' : 'happy'} size={96} />
        <div className="shop-wallet-body">
          <span className="shop-wallet-label">{t('game.shop.balance')}</span>
          <strong className="shop-wallet-gems tabular">
            <GameIcon name="gem" size={34} /> {game.gems}
          </strong>
          <span className="shop-wallet-meta">
            <span>
              <GameIcon name="heart" size={18} /> {game.hearts.hearts}/{MAX_HEARTS}
            </span>
            <span>🧊 {game.freezes}/{MAX_FREEZES}</span>
            {game.boostActive && game.boostUntil ? <BoostLeft until={game.boostUntil} /> : null}
          </span>
        </div>
      </Card>

      <h2 className="gsection-title">{t('game.shop.powerups')}</h2>
      <ul className="shop-grid" data-kind="powerups">
        {powerups.map((item) => (
          <li key={item.id}>
            <Card variant="raised" className="shop-item" as="article">
              <span className="shop-item-emoji" aria-hidden="true">
                {item.emoji}
              </span>
              <h3 className="shop-item-name">{t(`game.shop.items.${item.id as 'streak-freeze'}.name`)}</h3>
              <p className="shop-item-desc">{t(`game.shop.items.${item.id as 'streak-freeze'}.desc`)}</p>
              {status(item) ? <p className="shop-item-status">{status(item)}</p> : null}
              {item.kind === 'refill' && game.hearts.hearts < MAX_HEARTS ? <p className="shop-item-status">+1 ❤️ / {HEART_REFILL_MS / 3_600_000} год</p> : null}
              <ShopButton action="buy" itemId={item.id} price={item.price} blocked={blocked(item)} />
            </Card>
          </li>
        ))}
      </ul>

      <h2 className="gsection-title">{t('game.shop.looTitle')}</h2>
      <LooSays mood="wink" size={72} className="shop-loo-says">
        {t('game.shop.looLead')}
      </LooSays>
      {SLOTS.map((slot) => (
        <section key={slot} className="shop-slot" aria-labelledby={`slot-${slot}`}>
          <h3 className="shop-slot-title" id={`slot-${slot}`}>
            {t(`game.shop.slots.${slot}`)}
          </h3>
          <ul className="shop-grid" data-kind="skins">
            {skins
              .filter((s) => s.slot === slot)
              .map((item: SkinItem) => {
                const has = owned.has(item.id)
                const on = equipped[slot] === item.id
                return (
                  <li key={item.id}>
                    <Card variant="raised" className="shop-item shop-skin" as="article" tone={on ? 'green' : undefined}>
                      <Loo mood={on ? 'happy' : 'idle'} size={88} skin={tryOn(equipped, item)} animated={false} decorative />
                      <h4 className="shop-item-name">{t(`game.shop.items.${item.id as 'hat-crown'}.name`)}</h4>
                      {on ? <span className="shop-item-status">✓ {t('game.shop.equipped')}</span> : has ? <span className="shop-item-status">{t('game.shop.owned')}</span> : null}
                      {has ? <ShopButton action={on ? 'unequip' : 'equip'} itemId={item.id} slot={slot} /> : <ShopButton action="buy" itemId={item.id} price={item.price} blocked={blocked(item)} />}
                    </Card>
                  </li>
                )
              })}
          </ul>
        </section>
      ))}

      <h2 className="gsection-title">{t('game.shop.earnTitle')}</h2>
      <ul className="shop-earn">
        {(['lesson', 'test', 'mission', 'streak', 'achievements', 'league'] as const).map((k) => (
          <li key={k}>{t(`game.shop.earn.${k}`)}</li>
        ))}
      </ul>
    </div>
  )
}
