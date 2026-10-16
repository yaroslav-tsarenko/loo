'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { PiCaretRightBold } from 'react-icons/pi'
import type { TheoryNode, TheoryStatus } from '@/server/courses/theory-core'
import { PixelIcon } from '@/ui/design/PixelIcon'
import { Icon } from '@/ui/icons/Icon'
import { PROGRESS_EVENT } from './NavLinks'
import { useOpenNodes, type SetOpen } from './open-nodes'
import { setMobileSidebar } from './sidebar-state'

// Sidebar «Теорія» of the active course as a code-editor explorer: guide → part → chapter, collapsible, expand state
// persisted, the current chapter highlighted and revealed. WAI-ARIA tree: one tab stop, arrows move, Right/Left
// expand/collapse (or step in/out), Home/End, Enter opens, Space toggles.

const STATUS_LABEL: Record<TheoryStatus, string> = { studied: 'вивчено', reading: 'читаю', unread: 'не прочитано' }

function decode(href: string): string {
  try {
    return decodeURIComponent(href)
  } catch {
    return href
  }
}

interface Row {
  node: TheoryNode
  level: number
  parent: string | null
  posinset: number
  setsize: number
  expandable: boolean
  expanded: boolean
}

// Rows the user can currently see, in order (for keyboard navigation).
function visibleRows(nodes: readonly TheoryNode[], open: ReadonlySet<string>, level = 1, parent: string | null = null, out: Row[] = []): Row[] {
  nodes.forEach((node, i) => {
    const expandable = node.children.length > 0
    const expanded = expandable && open.has(node.id)
    out.push({ node, level, parent, posinset: i + 1, setsize: nodes.length, expandable, expanded })
    if (expanded) visibleRows(node.children, open, level + 1, node.id, out)
  })
  return out
}

// Nodes from a root down to the node whose page is `path`.
function trailTo(nodes: readonly TheoryNode[], path: string): TheoryNode[] {
  for (const n of nodes) {
    if (n.href !== null && decode(n.href) === path) return [n]
    const inner = trailTo(n.children, path)
    if (inner.length > 0) return [n, ...inner]
  }
  return []
}

// Chapter status stays live: a server re-render of the layout (router.refresh after «вивчено») brings a fresh tree,
// progress events and opening a chapter of the tree (it becomes «читаю») refetch it.
function useLiveTheory(courseId: string, initial: TheoryNode[], activeId: string | null): TheoryNode[] {
  const [nodes, setNodes] = useState(initial)
  const [seed, setSeed] = useState(initial)
  if (seed !== initial) {
    setSeed(initial)
    setNodes(initial)
  }
  useEffect(() => {
    let alive = true
    let timer = 0
    const load = () =>
      fetch('/api/theory', { cache: 'no-store' })
        .then((r) => r.json() as Promise<{ theory: { courseId: string; nodes: TheoryNode[] } | null }>)
        .then((d) => {
          // another tab switched the course: the layout re-renders this tree with a new key, ignore the mismatch
          if (alive && d.theory?.courseId === courseId) setNodes(d.theory.nodes)
        })
        .catch(() => {})
    if (activeId) timer = window.setTimeout(load, 2500)
    window.addEventListener(PROGRESS_EVENT, load)
    return () => {
      alive = false
      window.clearTimeout(timer)
      window.removeEventListener(PROGRESS_EVENT, load)
    }
  }, [courseId, activeId])
  return nodes
}

function NodeIcon({ node, expanded }: { node: TheoryNode; expanded: boolean }) {
  if (node.kind === 'chapter') return <span className="tt-dot" data-status={node.status ?? 'unread'} aria-hidden="true" />
  if (node.kind === 'guide') return <Icon name={node.icon ?? 'px:book'} size={16} className="tt-icon" />
  return (
    <span className="tt-icon" aria-hidden="true">
      <PixelIcon name={expanded ? 'folderOpen' : 'folder'} size={16} />
    </span>
  )
}

interface ItemProps {
  row: Row
  rows: Map<string, Row>
  open: ReadonlySet<string>
  setOpen: SetOpen
  path: string
  focus: string | null
  idPrefix: string
  index: Map<string, number>
}

function TreeItem({ row, rows, open, setOpen, path, focus, idPrefix, index }: ItemProps) {
  const { node, level, expandable, expanded } = row
  const active = node.href !== null && decode(node.href) === path
  const labelId = `${idPrefix}-${index.get(node.id) ?? 0}`
  const complete = node.total > 0 && node.done === node.total
  return (
    <li
      role="treeitem"
      className="tt-item"
      data-tid={node.id}
      tabIndex={focus === node.id ? 0 : -1}
      aria-level={level}
      aria-posinset={row.posinset}
      aria-setsize={row.setsize}
      aria-expanded={expandable ? expanded : undefined}
      aria-selected={active}
      aria-current={active ? 'page' : undefined}
      aria-labelledby={labelId}
    >
      <div className="tt-row" data-kind={node.kind} data-active={active ? '' : undefined} style={{ '--tt-level': level } as CSSProperties}>
        {expandable ? (
          <button type="button" className="tt-chevron" data-open={expanded ? '' : undefined} tabIndex={-1} aria-hidden="true" onClick={() => setOpen(node.id, !expanded)}>
            <PiCaretRightBold size={11} />
          </button>
        ) : (
          <span className="tt-chevron" aria-hidden="true" />
        )}
        <NodeIcon node={node} expanded={expanded} />
        {node.href ? (
          <Link href={node.href} className="tt-label" id={labelId} tabIndex={-1} title={node.title} onClick={() => setMobileSidebar(false)}>
            {node.title}
            {node.status ? <span className="sr-only">, {STATUS_LABEL[node.status]}</span> : null}
          </Link>
        ) : (
          <button type="button" className="tt-label" id={labelId} tabIndex={-1} title={node.title} onClick={() => setOpen(node.id, !expanded)}>
            {node.title}
          </button>
        )}
        {node.kind !== 'chapter' && node.total > 0 ? (
          <span className="tt-meta tabular" data-complete={complete ? '' : undefined} title={`Вивчено ${node.done} з ${node.total}`}>
            {node.done}/{node.total}
          </span>
        ) : null}
      </div>
      {expanded ? (
        <ul role="group" className="tt-group" style={{ '--tt-level': level } as CSSProperties}>
          {node.children.map((child) => (
            <TreeItem key={child.id} row={rows.get(child.id)!} rows={rows} open={open} setOpen={setOpen} path={path} focus={focus} idPrefix={idPrefix} index={index} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function indexAll(nodes: readonly TheoryNode[], out = new Map<string, number>()): Map<string, number> {
  for (const n of nodes) {
    out.set(n.id, out.size)
    indexAll(n.children, out)
  }
  return out
}

export function TheoryTree({ courseId, initial, label }: { courseId: string; initial: TheoryNode[]; label: string }) {
  const path = decode(usePathname())
  // the page's node is looked up in the server tree (structure never changes between refetches, only status)
  const nodes = useLiveTheory(courseId, initial, trailTo(initial, path).at(-1)?.id ?? null)
  const router = useRouter()
  const [open, setOpen] = useOpenNodes()
  const [focused, setFocused] = useState<string | null>(null)
  const tree = useRef<HTMLUListElement>(null)
  const revealed = useRef<string | null>(null)
  const idPrefix = useId()

  const visible = visibleRows(nodes, open)
  const rows = new Map(visible.map((r) => [r.node.id, r]))
  const index = indexAll(nodes)
  const trail = trailTo(nodes, path)
  const activeId = trail.at(-1)?.id ?? null
  // one tab stop: the last focused row if still visible, else the current page, else the first guide
  const focus = (focused && rows.has(focused) ? focused : null) ?? (activeId && rows.has(activeId) ? activeId : null) ?? visible[0]?.node.id ?? null

  // Reveal the current page once per navigation (the learner may collapse it afterwards).
  useEffect(() => {
    if (trail.length === 0 || revealed.current === path) return
    revealed.current = path
    setOpen(
      trail.filter((n) => n.children.length > 0).map((n) => n.id),
      true,
    )
  }, [path, trail, setOpen])

  // …and scroll it into view once it is rendered (once per page, so it never fights the learner's own scrolling).
  const activeShown = activeId !== null && rows.has(activeId)
  const scrolled = useRef<string | null>(null)
  useEffect(() => {
    if (!activeShown || !activeId || scrolled.current === activeId) return
    scrolled.current = activeId
    tree.current?.querySelector<HTMLElement>(`[data-tid="${CSS.escape(activeId)}"] > .tt-row`)?.scrollIntoView({ block: 'nearest' })
  }, [activeId, activeShown])

  const moveTo = (id: string | undefined) => {
    if (!id) return
    setFocused(id)
    tree.current?.querySelector<HTMLElement>(`[data-tid="${CSS.escape(id)}"]`)?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const target = e.target instanceof HTMLElement ? e.target.closest<HTMLElement>('[role="treeitem"]') : null
    const id = target?.dataset.tid
    const row = id ? rows.get(id) : undefined
    if (!row) return
    const at = visible.indexOf(row)
    let handled = true
    switch (e.key) {
      case 'ArrowDown':
        moveTo(visible[at + 1]?.node.id)
        break
      case 'ArrowUp':
        moveTo(visible[at - 1]?.node.id)
        break
      case 'Home':
        moveTo(visible[0]?.node.id)
        break
      case 'End':
        moveTo(visible.at(-1)?.node.id)
        break
      case 'ArrowRight':
        if (row.expandable && !row.expanded) setOpen(row.node.id, true)
        else if (row.expanded) moveTo(row.node.children[0]?.id)
        break
      case 'ArrowLeft':
        if (row.expanded) setOpen(row.node.id, false)
        else moveTo(row.parent ?? undefined)
        break
      case 'Enter':
        if (row.node.href) {
          setMobileSidebar(false)
          router.push(row.node.href)
        } else if (row.expandable) setOpen(row.node.id, !row.expanded)
        break
      case ' ':
        if (row.expandable) setOpen(row.node.id, !row.expanded)
        break
      default:
        handled = false
    }
    if (handled) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  if (nodes.length === 0) return <p className="sb-empty">У курсі немає статей</p>
  return (
    <ul
      ref={tree}
      role="tree"
      aria-label={label}
      className="tt"
      onKeyDown={onKeyDown}
      onFocus={(e) => {
        const id = e.target instanceof HTMLElement && e.target.getAttribute('role') === 'treeitem' ? e.target.dataset.tid : undefined
        if (id) setFocused(id)
      }}
    >
      {nodes.map((n) => (
        <TreeItem key={n.id} row={rows.get(n.id)!} rows={rows} open={open} setOpen={setOpen} path={path} focus={focus} idPrefix={idPrefix} index={index} />
      ))}
    </ul>
  )
}
