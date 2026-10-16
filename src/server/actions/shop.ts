'use server'

import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { inventory } from '@/db/schema'
import { extendBoost, isSkin, MAX_HEARTS, purchaseBlock, sanitizeEquipped, shopItem, type EquippedSkin, type PurchaseBlock, type SkinSlot } from '@/game'
import type { Effect } from '@/progress/types'
import { requireUser, userScope } from '../auth'
import { parseInput } from '../auth-guard'
import { limitUser } from '../courses/limits'
import { addHearts, gemsOf, loadState, ownedItems, spendGems } from '../game'
import { saveState } from '../game/state'

// 🛒 Shop: every purchase is one transaction under the learner's user_state row lock — balance check (gem ledger),
// the −💎 entry and the item itself land together or not at all. Prices and limits come from src/game/shop.ts only.

const itemId = z.string().min(1).max(60)
const buyInput = z.object({ itemId })
const equipInput = z.object({ slot: z.enum(['hat', 'glasses', 'hoodie', 'scarf']), itemId: itemId.nullable() })

export type BuyResult = { ok: true; gems: number; effects: Effect[] } | { ok: false; reason: PurchaseBlock }

export async function buyItem(raw: { itemId: string }): Promise<BuyResult> {
  const user = await requireUser()
  const input = parseInput(buyInput, raw)
  await limitUser(user.id, 'shop')
  const item = shopItem(input.itemId)
  const now = Date.now()
  return userScope(
    async (tx, userId): Promise<BuyResult> => {
      const state = await loadState(tx, userId, now, { lock: true })
      const gems = await gemsOf(tx, userId)
      const owned = await ownedItems(tx, userId)
      const block = purchaseBlock(item, { gems, hearts: state.hearts.hearts, freezes: state.freezes, boostUntil: state.boostUntil, owned, now })
      if (block || !item) return { ok: false, reason: block ?? 'unknown' }
      await spendGems(tx, userId, { amount: item.price, reason: 'shop', refId: `${item.id}:${randomUUID()}`, now })
      const effects: Effect[] = [{ type: 'gems', amount: -item.price, reason: 'shop' }]
      if (item.kind === 'freeze') await saveState(tx, userId, { streakFreezes: state.freezes + 1 }, now)
      else if (item.kind === 'boost') await saveState(tx, userId, { doubleXpUntil: extendBoost(state.boostUntil, now) }, now)
      else if (item.kind === 'refill') {
        const after = await addHearts(tx, userId, MAX_HEARTS, now)
        effects.push({ type: 'hearts', hearts: after.hearts, delta: after.hearts - state.hearts.hearts })
      } else if (isSkin(item)) {
        await tx.insert(inventory).values({ userId, itemId: item.id, acquiredAt: now }).onConflictDoNothing()
        // New clothes go straight on.
        await saveState(tx, userId, { skin: { ...state.skin, [item.slot]: item.id } }, now)
      }
      return { ok: true, gems: gems - item.price, effects }
    },
    { tx: true },
  )
}

// Put on an owned skin (or take a slot off with null).
export async function equipSkin(raw: { slot: SkinSlot; itemId: string | null }): Promise<{ ok: boolean }> {
  const user = await requireUser()
  const input = parseInput(equipInput, raw)
  await limitUser(user.id, 'shop')
  const now = Date.now()
  return userScope(
    async (tx, userId) => {
      const state = await loadState(tx, userId, now, { lock: true })
      const next: EquippedSkin = { ...state.skin, [input.slot]: input.itemId ?? undefined }
      if (input.itemId === null) delete next[input.slot]
      const clean = sanitizeEquipped(next, await ownedItems(tx, userId))
      if (input.itemId !== null && clean[input.slot] !== input.itemId) return { ok: false }
      await saveState(tx, userId, { skin: clean }, now)
      return { ok: true }
    },
    { tx: true },
  )
}
