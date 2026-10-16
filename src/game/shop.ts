import { boostFull } from './boost'
import type { Currency } from './gems'
import { MAX_HEARTS } from './hearts'
import { rankStart } from './ranks'
import type { WarriorRank } from './evolution'

// Shop catalog and purchase rules (docs/ECONOMY.md). Every item has a price in ONE currency; the server re-checks
// everything in one transaction. Three groups: consumables, gear (battle stats, drawn on Loo) and skins (cosmetic).

export type SkinSlot = 'hat' | 'glasses' | 'hoodie' | 'scarf'
export type HatStyle = 'beanie' | 'cap' | 'crown' | 'party' | 'grad'
export type GlassesStyle = 'round' | 'shades' | 'nerd'

export const GEAR_SLOTS = ['head', 'body', 'weapon', 'amulet', 'aura'] as const
export type GearSlot = (typeof GEAR_SLOTS)[number]

// What each gear item looks like on Loo (src/ui/design/mascot/pixels.ts draws them).
export interface GearLooks {
  head: 'leather' | 'iron' | 'knight' | 'crown'
  body: 'leather' | 'chain' | 'plate' | 'royal'
  weapon: 'wood' | 'iron' | 'staff' | 'legend'
  amulet: 'warm' | 'lamp' | 'storm' | 'sun'
  aura: 'spark' | 'charge' | 'arcane' | 'legend'
}

// Same shape as the mascot's LooSkin (src/ui/design/mascot/pixels.ts), without importing UI.
export interface SkinLook extends Partial<GearLooks> {
  hat?: HatStyle
  glasses?: GlassesStyle
  hoodie?: string
  scarf?: string
}

// Equipped item id per slot: skins in user_state.skin, gear in user_state.gear.
export type EquippedSkin = Partial<Record<SkinSlot, string>>
export type EquippedGear = Partial<Record<GearSlot, string>>

export const RARITIES = ['common', 'rare', 'epic', 'legendary'] as const
export type Rarity = (typeof RARITIES)[number]

// Battle stats (docs/BATTLES.md): points scale damage / defence etc. No caps — a character may get very strong;
// fairness comes from matchmaking by power and bosses tiered by section / difficulty.
export const STATS = ['attack', 'defense', 'energy', 'focus', 'speed'] as const
export type StatId = (typeof STATS)[number]
export type GearStats = Record<StatId, number>

export const STAT_ICON: Record<StatId, string> = { attack: 'px:sword', defense: 'px:shield', energy: 'px:heart', focus: 'px:target', speed: 'px:bolt' }


// Epic gear from Лицар, legendary from Чемпіон (the grind matters).
export const RARITY_MIN_RANK: Partial<Record<Rarity, WarriorRank>> = { epic: 'knight', legendary: 'champion' }
// Common / rare cost bucks, epic / legendary gems (skins: common → bucks, rare → gems).
export const RARITY_CURRENCY: Record<Rarity, Currency> = { common: 'bucks', rare: 'bucks', epic: 'gems', legendary: 'gems' }

interface ItemBase {
  id: string
  price: number
  currency: Currency
}

type GearItemOf<S extends GearSlot> = ItemBase & { kind: 'gear'; slot: S; look: GearLooks[S]; rarity: Rarity; stats: Partial<GearStats>; icon: string }

export type GearItem = { [S in GearSlot]: GearItemOf<S> }[GearSlot]

// Consumables carry an icon ref (`px:freeze`, src/ui/icons); skins and gear are also shown on Loo himself.
export type ShopItem =
  | (ItemBase & { kind: 'freeze'; icon: string })
  | (ItemBase & { kind: 'refill'; icon: string })
  | (ItemBase & { kind: 'boost'; icon: string })
  | (ItemBase & { kind: 'skin'; rarity: 'common' | 'rare'; slot: 'hat'; style: HatStyle })
  | (ItemBase & { kind: 'skin'; rarity: 'common' | 'rare'; slot: 'glasses'; style: GlassesStyle })
  | (ItemBase & { kind: 'skin'; rarity: 'common' | 'rare'; slot: 'hoodie' | 'scarf'; color: string })
  | GearItem

export type SkinItem = Extract<ShopItem, { kind: 'skin' }>

export const MAX_FREEZES = 2

const gear = <S extends GearSlot>(id: string, slot: S, look: GearLooks[S], rarity: Rarity, price: number, stats: Partial<GearStats>, icon: string): GearItemOf<S> => ({
  id,
  kind: 'gear',
  slot,
  look,
  rarity,
  price,
  currency: RARITY_CURRENCY[rarity],
  stats,
  icon,
})

export const SHOP_ITEMS: readonly ShopItem[] = [
  { id: 'streak-freeze', kind: 'freeze', price: 200, currency: 'bucks', icon: 'px:freeze' },
  { id: 'heart-refill', kind: 'refill', price: 120, currency: 'bucks', icon: 'px:potionHeart' },
  { id: 'double-xp', kind: 'boost', price: 150, currency: 'bucks', icon: 'px:potionXp' },

  gear('helm-leather', 'head', 'leather', 'common', 250, { defense: 2, energy: 2 }, 'px:helmet'),
  gear('helm-iron', 'head', 'iron', 'rare', 700, { defense: 5, energy: 3 }, 'px:helmet'),
  gear('helm-knight', 'head', 'knight', 'epic', 900, { defense: 8, energy: 4, focus: 2 }, 'px:helmet'),
  gear('crown-sun', 'head', 'crown', 'legendary', 2_500, { focus: 8, defense: 6, energy: 6 }, 'px:crown'),
  gear('armor-leather', 'body', 'leather', 'common', 300, { defense: 3, energy: 1 }, 'px:armor'),
  gear('armor-chain', 'body', 'chain', 'rare', 800, { defense: 5, energy: 3 }, 'px:armor'),
  gear('armor-plate', 'body', 'plate', 'epic', 1_000, { defense: 9, energy: 5 }, 'px:armor'),
  gear('armor-royal', 'body', 'royal', 'legendary', 2_800, { defense: 8, energy: 6, attack: 6 }, 'px:armor'),
  gear('sword-wood', 'weapon', 'wood', 'common', 200, { attack: 3, speed: 1 }, 'px:sword'),
  gear('sword-iron', 'weapon', 'iron', 'rare', 750, { attack: 6, speed: 2 }, 'px:sword'),
  gear('staff-storm', 'weapon', 'staff', 'epic', 950, { focus: 8, attack: 6 }, 'px:staff'),
  gear('sword-legend', 'weapon', 'legend', 'legendary', 3_000, { attack: 12, speed: 4, focus: 4 }, 'px:sword'),
  gear('bulb-warm', 'amulet', 'warm', 'common', 250, { focus: 2, energy: 2 }, 'px:amulet'),
  gear('bulb-lamp', 'amulet', 'lamp', 'rare', 800, { focus: 5, energy: 3 }, 'px:amulet'),
  gear('bulb-storm', 'amulet', 'storm', 'epic', 900, { speed: 8, focus: 6 }, 'px:amulet'),
  gear('bulb-sun', 'amulet', 'sun', 'legendary', 2_600, { focus: 10, energy: 5, speed: 5 }, 'px:amulet'),
  gear('aura-spark', 'aura', 'spark', 'common', 300, { speed: 3, focus: 1 }, 'px:spark'),
  gear('aura-charge', 'aura', 'charge', 'rare', 900, { speed: 5, attack: 3 }, 'px:spark'),
  gear('aura-arcane', 'aura', 'arcane', 'epic', 1_100, { attack: 8, focus: 6 }, 'px:spark'),
  gear('aura-legend', 'aura', 'legend', 'legendary', 3_200, { attack: 4, defense: 4, energy: 4, focus: 4, speed: 4 }, 'px:spark'),

  { id: 'hat-beanie', kind: 'skin', rarity: 'common', slot: 'hat', style: 'beanie', price: 250, currency: 'bucks' },
  { id: 'hat-cap', kind: 'skin', rarity: 'common', slot: 'hat', style: 'cap', price: 300, currency: 'bucks' },
  { id: 'hat-party', kind: 'skin', rarity: 'common', slot: 'hat', style: 'party', price: 400, currency: 'bucks' },
  { id: 'hat-grad', kind: 'skin', rarity: 'common', slot: 'hat', style: 'grad', price: 600, currency: 'bucks' },
  { id: 'hat-crown', kind: 'skin', rarity: 'rare', slot: 'hat', style: 'crown', price: 300, currency: 'gems' },
  { id: 'glasses-round', kind: 'skin', rarity: 'common', slot: 'glasses', style: 'round', price: 250, currency: 'bucks' },
  { id: 'glasses-nerd', kind: 'skin', rarity: 'common', slot: 'glasses', style: 'nerd', price: 300, currency: 'bucks' },
  { id: 'glasses-shades', kind: 'skin', rarity: 'common', slot: 'glasses', style: 'shades', price: 450, currency: 'bucks' },
  { id: 'hoodie-blue', kind: 'skin', rarity: 'common', slot: 'hoodie', color: '#1CB0F6', price: 450, currency: 'bucks' },
  { id: 'hoodie-red', kind: 'skin', rarity: 'common', slot: 'hoodie', color: '#FF4B4B', price: 500, currency: 'bucks' },
  { id: 'hoodie-green', kind: 'skin', rarity: 'common', slot: 'hoodie', color: '#58CC02', price: 550, currency: 'bucks' },
  { id: 'hoodie-black', kind: 'skin', rarity: 'rare', slot: 'hoodie', color: '#2B2B3A', price: 150, currency: 'gems' },
  { id: 'scarf-orange', kind: 'skin', rarity: 'common', slot: 'scarf', color: '#FF9600', price: 300, currency: 'bucks' },
  { id: 'scarf-pink', kind: 'skin', rarity: 'common', slot: 'scarf', color: '#FF86D0', price: 350, currency: 'bucks' },
  { id: 'scarf-yellow', kind: 'skin', rarity: 'common', slot: 'scarf', color: '#FFC800', price: 400, currency: 'bucks' },
]

const BY_ID = new Map(SHOP_ITEMS.map((i) => [i.id, i]))

export const shopItem = (id: string): ShopItem | null => BY_ID.get(id) ?? null

export const isSkin = (item: ShopItem): item is SkinItem => item.kind === 'skin'
export const isGear = (item: ShopItem): item is GearItem => item.kind === 'gear'
export const isConsumable = (item: ShopItem): boolean => item.kind === 'freeze' || item.kind === 'refill' || item.kind === 'boost'
export const rarityOf = (item: ShopItem): Rarity | null => (isGear(item) || isSkin(item) ? item.rarity : null)
export const isGearSlot = (s: string): s is GearSlot => (GEAR_SLOTS as readonly string[]).includes(s)

// The step (0…55) an item needs: epic → Лицар I, legendary → Чемпіон I, else 0.
export function minStep(item: ShopItem): number {
  if (!isGear(item)) return 0
  const rank = RARITY_MIN_RANK[item.rarity]
  return rank ? rankStart(rank) : 0
}

export const minRank = (item: ShopItem): WarriorRank | null => (isGear(item) ? (RARITY_MIN_RANK[item.rarity] ?? null) : null)

export interface Wallet {
  bucks: number
  gems: number
  hearts: number
  freezes: number
  boostUntil: number | null
  owned: ReadonlySet<string>
  // the learner's character step (user_state.evo_step)
  step: number
  now: number
}

export type PurchaseBlock = 'unknown' | 'no-bucks' | 'no-gems' | 'rank' | 'max-freezes' | 'hearts-full' | 'boost-full' | 'owned'

export function purchaseBlock(item: ShopItem | null, w: Wallet): PurchaseBlock | null {
  if (!item) return 'unknown'
  if ((isSkin(item) || isGear(item)) && w.owned.has(item.id)) return 'owned'
  if (w.step < minStep(item)) return 'rank'
  if (item.kind === 'freeze' && w.freezes >= MAX_FREEZES) return 'max-freezes'
  if (item.kind === 'refill' && w.hearts >= MAX_HEARTS) return 'hearts-full'
  if (item.kind === 'boost' && boostFull(w.boostUntil, w.now)) return 'boost-full'
  if (item.currency === 'bucks' && w.bucks < item.price) return 'no-bucks'
  if (item.currency === 'gems' && w.gems < item.price) return 'no-gems'
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

// Owned gear of the right slot whose rank requirement is met; one per slot.
export function sanitizeGear(equipped: EquippedGear, owned: ReadonlySet<string>, step: number): EquippedGear {
  const out: EquippedGear = {}
  for (const [slot, id] of Object.entries(equipped) as Array<[GearSlot, string | undefined]>) {
    const item = id ? shopItem(id) : null
    if (item && isGear(item) && item.slot === slot && owned.has(item.id) && step >= minStep(item)) out[slot] = item.id
  }
  return out
}

const gearOf = (id: string | undefined): GearItem | null => {
  const item = id ? shopItem(id) : null
  return item && isGear(item) ? item : null
}

// Sum of the equipped gear (uncapped).
export function gearStats(equipped: EquippedGear | null | undefined): GearStats {
  const out: GearStats = { attack: 0, defense: 0, energy: 0, focus: 0, speed: 0 }
  for (const slot of GEAR_SLOTS) {
    const item = gearOf(equipped?.[slot])
    if (item?.slot !== slot) continue
    for (const s of STATS) out[s] += item.stats[s] ?? 0
  }
  return out
}

export const statTotal = (stats: GearStats): number => STATS.reduce((sum, s) => sum + stats[s], 0)

// What the mascot wears: skins + gear looks.
export function skinLook(equipped: EquippedSkin | null | undefined, equippedGear?: EquippedGear | null): SkinLook {
  const look: SkinLook = {}
  for (const id of Object.values(equipped ?? {})) {
    const item = id ? shopItem(id) : null
    if (!item || !isSkin(item)) continue
    if (item.slot === 'hat') look.hat = item.style
    else if (item.slot === 'glasses') look.glasses = item.style
    else look[item.slot] = item.color
  }
  for (const slot of GEAR_SLOTS) {
    const item = gearOf(equippedGear?.[slot])
    if (item?.slot === slot) Object.assign(look, { [slot]: item.look })
  }
  return look
}

// The look with one item tried on (shop previews).
export function tryOn(equipped: EquippedSkin, equippedGear: EquippedGear, item: SkinItem | GearItem): SkinLook {
  return isGear(item) ? skinLook(equipped, { ...equippedGear, [item.slot]: item.id }) : skinLook({ ...equipped, [item.slot]: item.id }, equippedGear)
}
