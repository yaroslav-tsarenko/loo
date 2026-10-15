// Object graph for the reachability demo + pure mark phase.

export interface GraphNode {
  id: string
  label: string
  emoji: string
  x: number
  y: number
  root?: boolean
}

export interface GraphEdge {
  id: string
  from: string
  to: string
  label: string
}

export const NODES: readonly GraphNode[] = [
  { id: 'global', label: 'globalThis', emoji: '🌐', x: 40, y: 80, root: true },
  { id: 'stack', label: 'стек', emoji: '📚', x: 40, y: 220, root: true },
  { id: 'parent', label: 'parent', emoji: '👨', x: 140, y: 30 },
  { id: 'child', label: 'child', emoji: '👶', x: 250, y: 30 },
  { id: 'user', label: 'user', emoji: '👤', x: 140, y: 130 },
  { id: 'cart', label: 'cart', emoji: '🛒', x: 240, y: 110 },
  { id: 'apple', label: 'apple', emoji: '🍎', x: 330, y: 80 },
  { id: 'book', label: 'book', emoji: '📕', x: 330, y: 150 },
  { id: 'avatar', label: 'avatar', emoji: '🖼️', x: 240, y: 190 },
  { id: 'session', label: 'session', emoji: '🔑', x: 140, y: 240 },
  { id: 'temp', label: 'temp', emoji: '🗑️', x: 320, y: 245 },
]

export const EDGES: readonly GraphEdge[] = [
  { id: 'g-user', from: 'global', to: 'user', label: 'globalThis.user' },
  { id: 'g-family', from: 'global', to: 'parent', label: 'globalThis.family' },
  { id: 'p-child', from: 'parent', to: 'child', label: 'parent.child' },
  { id: 'c-parent', from: 'child', to: 'parent', label: 'child.parent' },
  { id: 'u-cart', from: 'user', to: 'cart', label: 'user.cart' },
  { id: 'c-apple', from: 'cart', to: 'apple', label: 'cart.items[0]' },
  { id: 'c-book', from: 'cart', to: 'book', label: 'cart.items[1]' },
  { id: 'u-avatar', from: 'user', to: 'avatar', label: 'user.avatar' },
  { id: 's-session', from: 'stack', to: 'session', label: 'let session' },
  { id: 'session-user', from: 'session', to: 'user', label: 'session.user' },
]

// Breadth-first mark from the roots; returns nodes in visiting order.
export function markOrder(cut: ReadonlySet<string>, gone: ReadonlySet<string>): string[] {
  const order: string[] = []
  const seen = new Set<string>()
  const queue = NODES.filter((n) => n.root).map((n) => n.id)
  while (queue.length > 0) {
    const id = queue.shift()!
    if (seen.has(id) || gone.has(id)) continue
    seen.add(id)
    order.push(id)
    for (const e of EDGES) if (e.from === id && !cut.has(e.id)) queue.push(e.to)
  }
  return order
}
