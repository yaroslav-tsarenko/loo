// DOM model for the propagation demo + pure dispatch that follows the DOM spec order:
// capture pass (root → parent of target), target (capture listeners first, then the rest),
// bubble pass (parent → root, only if event.bubbles). stopPropagation is checked per node.

export interface DomNode {
  id: string
  tag: string
  text?: string
  children?: readonly DomNode[]
}

export interface Listener {
  id: string
  node: string
  capture: boolean
  label: string
  // calls event.stopPropagation()
  stops?: boolean
}

// event.eventPhase: 0 NONE, 1 CAPTURING_PHASE, 2 AT_TARGET, 3 BUBBLING_PHASE
export type EventPhase = 0 | 1 | 2 | 3

export interface Invocation {
  listener: string
  node: string
  phase: 1 | 2 | 3
}

// Ids from the root down to the target ([] if the target is not in the tree).
export function pathTo(root: DomNode, targetId: string): string[] {
  if (root.id === targetId) return [root.id]
  for (const child of root.children ?? []) {
    const rest = pathTo(child, targetId)
    if (rest.length > 0) return [root.id, ...rest]
  }
  return []
}

export function findNode(root: DomNode, id: string): DomNode | null {
  if (root.id === id) return root
  for (const child of root.children ?? []) {
    const hit = findNode(child, id)
    if (hit) return hit
  }
  return null
}

export function dispatch(path: readonly string[], listeners: readonly Listener[], bubbles = true): Invocation[] {
  const out: Invocation[] = []
  const target = path.at(-1)
  if (target === undefined) return out
  let stopped = false
  // one "invoke" per node per pass; the stop flag is checked before each one
  const invoke = (node: string, phase: 1 | 2 | 3, capture: boolean) => {
    if (stopped) return
    for (const l of listeners) {
      if (l.node !== node || l.capture !== capture) continue
      out.push({ listener: l.id, node, phase })
      if (l.stops) stopped = true
    }
  }
  for (const node of path.slice(0, -1)) invoke(node, 1, true)
  invoke(target, 2, true)
  invoke(target, 2, false)
  if (bubbles) for (const node of path.slice(0, -1).reverse()) invoke(node, 3, false)
  return out
}
