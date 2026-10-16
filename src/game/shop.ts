import { boostFull } from './boost'
import { MAX_HEARTS } from './hearts'

// 🛒 Shop catalog and purchase rules. Prices are in gems; the server re-checks everything in one transaction.

export type SkinSlot = 'hat' | 'glasses' | 'hoodie' | 'scarf'
export type HatStyle = 'beanie' | 'cap' | 'crown' | 'party' | 'grad'
export type GlassesStyle = 'round' | 'shades' | 'nerd'

// Same shape as the mascot's LooSkin (src/ui/design/mascot/pixels.ts), without importing UI.
export interface SkinLook {
  hat?: HatStyle
  glasses?: GlassesStyle
  hoodie?: string
  scarf?: string
}

// Equipped item id per slot (user_state.skin).
export type EquippedSkin = Partial<Record<SkinSlot, string>>

interface ItemBase {
  id: string
  price: number
  emoji: string
}

export type ShopItem =
  | (ItemBase & { kind: 'freeze' })
  | (ItemBase & { kind: 'refill' })
  | (ItemBase & { kind: 'boost' })
  | (ItemBase & { kind: 'skin'; slot: 'hat'; style: HatStyle })
  | (ItemBase & { kind: 'skin'; slot: 'glasses'; style: GlassesStyle })
  | (ItemBase & { kind: 'skin'; slot: 'hoodie' | 'scarf'; color: string })

export type SkinItem = Extract<ShopItem, { kind: 'skin' }>

export const MAX_FREEZES = 2

export const SHOP_ITEMS: readonly ShopItem[] = [
  { id: 'streak-freeze', kind: 'freeze', price: 100, emoji: '🧊' },
  { id: 'heart-refill', kind: 'refill', price: 60, emoji: '❤️' },
  { id: 'double-xp', kind: 'boost', price: 80, emoji: '⚡' },
  { id: 'hat-beanie', kind: 'skin', slot: 'hat', style: 'beanie', price: 150, emoji: '🧢' },
  { id: 'hat-cap', kind: 'skin', slot: 'hat', style: 'cap', price: 150, emoji: '🧢' },
  { id: 'hat-party', kind: 'skin', slot: 'hat', style: 'party', price: 200, emoji: '🥳' },
  { id: 'hat-grad', kind: 'skin', slot: 'hat', style: 'grad', price: 300, emoji: '🎓' },
  { id: 'hat-crown', kind: 'skin', slot: 'hat', style: 'crown', price: 600, emoji: '👑' },
  { id: 'glasses-round', kind: 'skin', slot: 'glasses', style: 'round', price: 120, emoji: '👓' },
  { id: 'glasses-nerd', kind: 'skin', slot: 'glasses', style: 'nerd', price: 150, emoji: '🤓' },
  { id: 'glasses-shades', kind: 'skin', slot: 'glasses', style: 'shades', price: 200, emoji: '😎' },
  { id: 'hoodie-blue', kind: 'skin', slot: 'hoodie', color: '#1CB0F6', price: 250, emoji: '🧥' },
  { id: 'hoodie-red', kind: 'skin', slot: 'hoodie', color: '#FF4B4B', price: 250, emoji: '🧥' },
  { id: 'hoodie-green', kind: 'skin', slot: 'hoodie', color: '#58CC02', price: 250, emoji: '🧥' },
  { id: 'hoodie-black', kind: 'skin', slot: 'hoodie', color: '#2B2B3A', price: 300, emoji: '🧥' },
  { id: 'scarf-orange', kind: 'skin', slot: 'scarf', color: '#FF9600', price: 150, emoji: '🧣' },
  { id: 'scarf-pink', kind: 'skin', slot: 'scarf', color: '#FF86D0', price: 150, emoji: '🧣' },
  { id: 'scarf-yellow', kind: 'skin', slot: 'scarf', color: '#FFC800', price: 150, emoji: '🧣' },
]

const BY_ID = new Map(SHOP_ITEMS.map((i) => [i.id, i]))

export const shopItem = (id: string): ShopItem | null => BY_ID.get(id) ?? null

export const isSkin = (item: ShopItem): item is SkinItem => item.kind === 'skin'

export interface Wallet {
  gems: number
  hearts: number
  freezes: number
  boostUntil: number | null
  owned: ReadonlySet<string>
  now: number
}

export type PurchaseBlock = 'unknown' | 'funds' | 'max-freezes' | 'hearts-full' | 'boost-full' | 'owned'

export function purchaseBlock(item: ShopItem | null, w: Wallet): PurchaseBlock | null {
  if (!item) return 'unknown'
  if (item.kind === 'skin' && w.owned.has(item.id)) return 'owned'
  if (item.kind === 'freeze' && w.freezes >= MAX_FREEZES) return 'max-freezes'
  if (item.kind === 'refill' && w.hearts >= MAX_HEARTS) return 'hearts-full'
  if (item.kind === 'boost' && boostFull(w.boostUntil, w.now)) return 'boost-full'
  if (w.gems < item.price) return 'funds'
  return null
}

// Only owned skins can be equipped; one per slot. Unknown / unowned ids are dropped.
export function sanitizeEquipped(equipped: EquippedSkin, owned: ReadonlySet<string>): EquippedSkin {
  const out: EquippedSkin = {}
  for (const [slot, id] of Object.entries(equipped) as Array<[SkinSlot, string | undefined]>) {
    const item = id ? shopItem(id) : null
    if (item && isSkin(item) && item.slot === slot && owned.has(item.id)) out[slot] = item.id
  }
  return out
}

// What the mascot wears.
export function skinLook(equipped: EquippedSkin | null | undefined): SkinLook {
  const look: SkinLook = {}
  for (const id of Object.values(equipped ?? {})) {
    const item = id ? shopItem(id) : null
    if (!item || !isSkin(item)) continue
    if (item.slot === 'hat') look.hat = item.style
    else if (item.slot === 'glasses') look.glasses = item.style
    else look[item.slot] = item.color
  }
  return look
}

// The look with one item tried on (shop previews).
export function tryOn(equipped: EquippedSkin, item: SkinItem): SkinLook {
  return skinLook({ ...equipped, [item.slot]: item.id })
}
