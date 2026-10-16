import type { Chapter, Guide, TreeNode } from '@/content/model'
import { chapterHref, guideHref } from '@/ui/routes'

// Sidebar «Теорія» of the active course: guide → part / folder → chapter, like a code editor's explorer.
// Framework-free for unit tests; I/O in ./theory.ts, the client tree in src/ui/shell/TheoryTree.tsx.

export type TheoryStatus = 'unread' | 'reading' | 'studied'

export interface TheoryNode {
  kind: 'guide' | 'folder' | 'chapter'
  // stable key for the persisted expand state: `guide:<id>`, `<guide>#part-<n>` / `<guide>/<dir>`, chapter id
  id: string
  title: string
  href: string | null
  // icon ref (guide icon, part icon); null → the tree's default glyph
  icon: string | null
  // chapters (and folders with an overview page)
  status: TheoryStatus | null
  // studied / all chapters below (a chapter counts itself)
  done: number
  total: number
  children: TheoryNode[]
}

export interface TheorySource {
  guideById: ReadonlyMap<string, Guide>
  chapters: ReadonlyMap<string, Chapter>
}

type StatusOf = (chapterId: string) => TheoryStatus | undefined

function tally(nodes: readonly TheoryNode[]): { done: number; total: number } {
  return nodes.reduce((acc, n) => ({ done: acc.done + n.done, total: acc.total + n.total }), { done: 0, total: 0 })
}

function chapterNode(chapter: Chapter, statusOf: StatusOf): TheoryNode {
  const status = statusOf(chapter.id) ?? 'unread'
  return { kind: 'chapter', id: chapter.id, title: chapter.title, href: chapterHref(null, chapter), icon: null, status, done: status === 'studied' ? 1 : 0, total: 1, children: [] }
}

function walk(source: TheorySource, nodes: readonly TreeNode[], statusOf: StatusOf): TheoryNode[] {
  const out: TheoryNode[] = []
  for (const node of nodes) {
    if (node.kind === 'chapter') {
      const chapter = source.chapters.get(node.id)
      if (chapter && chapter.kind !== 'index') out.push(chapterNode(chapter, statusOf))
      continue
    }
    const children = walk(source, node.children, statusOf)
    const overview = node.overviewId ? source.chapters.get(node.overviewId) : undefined
    const status = overview ? statusOf(overview.id) ?? 'unread' : null
    const own = overview ? { done: status === 'studied' ? 1 : 0, total: 1 } : { done: 0, total: 0 }
    const sum = tally(children)
    if (children.length === 0 && !overview) continue
    out.push({ kind: 'folder', id: node.id, title: node.title, href: overview ? chapterHref(null, overview) : null, icon: null, status, done: sum.done + own.done, total: sum.total + own.total, children })
  }
  return out
}

// A flat guide with `parts` in _guide.md («🧱 Ядро мови: 1-7») gets one folder per part; chapters outside every
// part stay at the guide's root, after the parts. Folder-based guides keep their own folders.
function withParts(guide: Guide, nodes: TheoryNode[], source: TheorySource): TheoryNode[] {
  if (guide.parts.length === 0 || nodes.some((n) => n.kind !== 'chapter')) return nodes
  const used = new Set<string>()
  const folders: TheoryNode[] = []
  guide.parts.forEach((part, i) => {
    const children = nodes.filter((n) => {
      const number = source.chapters.get(n.id)?.number
      return number !== null && number !== undefined && number >= part.from && number <= part.to && !used.has(n.id)
    })
    if (children.length === 0) return
    for (const c of children) used.add(c.id)
    folders.push({ kind: 'folder', id: `${guide.id}#part-${i + 1}`, title: part.title, href: null, icon: part.icon, status: null, ...tally(children), children })
  })
  return [...folders, ...nodes.filter((n) => !used.has(n.id))]
}

export function theoryTree(source: TheorySource, guideIds: readonly string[], statusOf: StatusOf): TheoryNode[] {
  const out: TheoryNode[] = []
  for (const id of guideIds) {
    const guide = source.guideById.get(id)
    if (!guide) continue
    const children = withParts(guide, walk(source, guide.tree, statusOf), source)
    out.push({ kind: 'guide', id: `guide:${guide.id}`, title: guide.title, href: guideHref(guide.id), icon: guide.icon, status: null, ...tally(children), children })
  }
  return out
}

