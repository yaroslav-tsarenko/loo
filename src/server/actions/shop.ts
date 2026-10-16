'use server'

import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { inventory } from '@/db/schema'
import { extendBoost, GEAR_SLOTS, isGear, isGearSlot, isSkin, MAX_HEARTS, purchaseBlock, sanitizeEquipped, sanitizeGear, shopItem, type EquippedGear, type EquippedSkin, type PurchaseBlock } from '@/game'
import type { Effect } from '@/progress/types'
import { requireUser, userScope } from '../auth'
import { parseInput } from '../auth-guard'
import { limitUser } from '../courses/limits'
import { addHearts, bucksOf, gemsOf, loadState, ownedItems, spendBucks, spendGems } from '../game'
import { saveState } from '../game/state'

// Shop: every purchase is one transaction under the learner's user_state row lock — balance check (from the ledger of
// the item's currency), rank requirement (user_state.evo_step), the −price entry and the item itself land together or
// not at all. Prices, currencies, limits and rank gates come from src/game/shop.ts only.

const itemId = z.string().min(1).max(60)
const buyInput = z.object({ itemId })
const SLOTS = ['hat', 'glasses', 'hoodie', 'scarf', ...GEAR_SLOTS] as const
const equipInput = z.object({ slot: z.enum(SLOTS), itemId: itemId.nullable() })

export type BuyResult = { ok: true; bucks: number; gems: number; effects: Effect[] } | { ok: false; reason: PurchaseBlock }

export async function buyItem(raw: { itemId: string }): Promise<BuyResult> {
  const user = await requireUser()
  const input = parseInput(buyInput, raw)
  await limitUser(user.id, 'shop')
  const item = shopItem(input.itemId)
  const now = Date.now()
  return userScope(
    async (tx, userId): Promise<BuyResult> => {
      const state = await loadState(tx, userId, now, { lock: true })
      const [bucks, gems, owned] = [await bucksOf(tx, userId), await gemsOf(tx, userId), await ownedItems(tx, userId)]
      const block = purchaseBlock(item, { bucks, gems, hearts: state.hearts.hearts, freezes: state.freezes, boostUntil: state.boostUntil, owned, step: state.evoStep, now })
      if (block || !item) return { ok: false, reason: block ?? 'unknown' }
      const move = { amount: item.price, reason: 'shop', refId: `${item.id}:${randomUUID()}`, now }
      if (item.currency === 'gems') await spendGems(tx, userId, move)
      else await spendBucks(tx, userId, move)
      const effects: Effect[] = [{ type: item.currency, amount: -item.price, reason: 'shop' }]
      if (item.kind === 'freeze') await saveState(tx, userId, { streakFreezes: state.freezes + 1 }, now)
      else if (item.kind === 'boost') await saveState(tx, userId, { doubleXpUntil: extendBoost(state.boostUntil, now) }, now)
      else if (item.kind === 'refill') {
        const after = await addHearts(tx, userId, MAX_HEARTS, now)
        effects.push({ type: 'hearts', hearts: after.hearts, delta: after.hearts - state.hearts.hearts })
      } else {
        await tx.insert(inventory).values({ userId, itemId: item.id, acquiredAt: now }).onConflictDoNothing()
        // New things go straight on.
        if (isSkin(item)) await saveState(tx, userId, { skin: { ...state.skin, [item.slot]: item.id } }, now)
        else if (isGear(item)) await saveState(tx, userId, { gear: { ...state.gear, [item.slot]: item.id } }, now)
      }
      const left = item.currency === 'gems' ? { bucks, gems: gems - item.price } : { bucks: bucks - item.price, gems }
      return { ok: true, ...left, effects }
    },
    { tx: true },
  )
}

// Put on an owned skin / piece of gear (or take a slot off with null). Gear is re-checked against the rank.
export async function equipItem(raw: { slot: (typeof SLOTS)[number]; itemId: string | null }): Promise<{ ok: boolean }> {
  const user = await requireUser()
  const input = parseInput(equipInput, raw)
  await limitUser(user.id, 'shop')
  const now = Date.now()
  return userScope(
    async (tx, userId) => {
      const state = await loadState(tx, userId, now, { lock: true })
      const owned = await ownedItems(tx, userId)
      const slot = input.slot
      if (isGearSlot(slot)) {
        const next: EquippedGear = { ...state.gear, [slot]: input.itemId ?? undefined }
        if (input.itemId === null) delete next[slot]
        const clean = sanitizeGear(next, owned, state.evoStep)
        if (input.itemId !== null && clean[slot] !== input.itemId) return { ok: false }
        await saveState(tx, userId, { gear: clean }, now)
        return { ok: true }
      }
      const next: EquippedSkin = { ...state.skin, [slot]: input.itemId ?? undefined }
      if (input.itemId === null) delete next[slot]
      const clean = sanitizeEquipped(next, owned)
      if (input.itemId !== null && clean[slot] !== input.itemId) return { ok: false }
      await saveState(tx, userId, { skin: clean }, now)
      return { ok: true }
    },
    { tx: true },
  )
}
