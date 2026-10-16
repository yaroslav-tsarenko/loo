import 'server-only'
import type { Chapter, Guide, TreeNode } from '@/content/model'
import type { ContentSnapshot } from '@/content/store'
import { chapterHref, guideHref } from '@/ui/routes'
import { pageProgress, nextChapterFor, readableChapters, todaySummary, type ChapterStatus, type ProgressRow } from './library'
import { chapterAccuracy, openMistakesByChapter, weakChapters } from './stats'

export interface RoadNode {
  id: string
  title: string
  href: string
  status: ChapterStatus
  weak: boolean
  current: boolean
  hasPrereq: boolean
}

export interface RoadPart {
  title: string | null
  nodes: RoadNode[]
}

export interface Lane {
  guide: Guide
  parts: RoadPart[]
  studied: number
  total: number
  prerequisites: Guide[]
  blocked: boolean
}

export interface Recommendation {
  kind: 'review' | 'mistakes' | 'next' | 'prerequisite' | 'weak' | 'start'
  title: string
  reason: string
  href: string
}

export interface Roadmap {
  lanes: Lane[]
  current: { chapter: Chapter; guide: Guide } | null
  recommendations: Recommendation[]
  cycles: string[]
}

function orderGuides(snapshot: ContentSnapshot): { ordered: Guide[]; cycles: string[] } {
  const byId = snapshot.guideById
  const visited = new Set<string>()
  const onStack = new Set<string>()
  const ordered: Guide[] = []
  const cycles: string[] = []
  const visit = (g: Guide) => {
    if (visited.has(g.id)) return
    if (onStack.has(g.id)) {
      cycles.push(g.title)
      return
    }
    onStack.add(g.id)
    for (const p of g.prerequisites) {
      const dep = byId.get(p)
      if (dep) visit(dep)
    }
    onStack.delete(g.id)
    visited.add(g.id)
    ordered.push(g)
  }
  snapshot.guides.forEach(visit)
  return { ordered, cycles }
}

function guideDone(snapshot: ContentSnapshot, guide: Guide, progress: Map<string, ProgressRow>): number {
  const chapters = readableChapters(snapshot, guide)
  if (chapters.length === 0) return 1
  return chapters.filter((c) => progress.get(c.id)?.status === 'studied').length / chapters.length
}

export async function buildRoadmap(snapshot: ContentSnapshot): Promise<Roadmap> {
  const [progress, accuracy, open, today, weak] = await Promise.all([
    pageProgress(),
    chapterAccuracy(),
    openMistakesByChapter(snapshot),
    todaySummary(snapshot),
    weakChapters(snapshot, 2),
  ])
  const { ordered, cycles } = orderGuides(snapshot)
  const lastOpened = [...progress.entries()].filter(([id]) => snapshot.chapters.get(id)?.kind !== 'index').sort((a, b) => b[1].lastOpenedAt - a[1].lastOpenedAt)[0]
  const currentChapter = lastOpened ? snapshot.chapters.get(lastOpened[0]) ?? null : null
  const currentGuide = currentChapter ? snapshot.guideById.get(currentChapter.guideId) ?? null : null

  const node = (chapter: Chapter): RoadNode => {
    const a = accuracy.get(chapter.id)
    return {
      id: chapter.id,
      title: chapter.title,
      href: chapterHref(snapshot, chapter),
      status: progress.get(chapter.id)?.status ?? 'unread',
      weak: (open.get(chapter.id) ?? 0) > 0 || (a !== undefined && a.total >= 3 && (a.rate ?? 1) < 0.6),
      current: currentChapter?.id === chapter.id,
      hasPrereq: chapter.prerequisites.length > 0,
    }
  }

  const lanes: Lane[] = ordered.map((guide) => {
    const parts: RoadPart[] = []
    const loose: RoadNode[] = []
    const collect = (nodes: TreeNode[], out: RoadNode[]) => {
      for (const n of nodes) {
        if (n.kind === 'chapter') {
          const c = snapshot.chapters.get(n.id)
          if (c) out.push(node(c))
        } else {
          const part: RoadPart = { title: n.title, nodes: [] }
          parts.push(part)
          if (n.overviewId) {
            const c = snapshot.chapters.get(n.overviewId)
            if (c) part.nodes.push(node(c))
          }
          collect(n.children, part.nodes)
        }
      }
    }
    collect(guide.tree, loose)
    if (loose.length > 0) parts.unshift({ title: null, nodes: loose })
    for (let i = parts.length - 1; i >= 0; i--) if (parts[i]!.nodes.length === 0) parts.splice(i, 1)
    const all = parts.flatMap((p) => p.nodes)
    const prerequisites = guide.prerequisites.map((id) => snapshot.guideById.get(id)).filter((g): g is Guide => Boolean(g))
    return {
      guide,
      parts,
      studied: all.filter((n) => n.status === 'studied').length,
      total: all.length,
      prerequisites,
      blocked: prerequisites.some((p) => guideDone(snapshot, p, progress) < 0.8),
    }
  })

  const recs: Recommendation[] = []
  if (today.due > 0) recs.push({ kind: 'review', title: `Повторити ${today.due} карт${today.due === 1 ? 'ку' : today.due < 5 ? 'ки' : 'ок'}`, reason: 'FSRS каже, що саме зараз ви почнете їх забувати', href: '/review' })
  if (today.mistakes > 0) recs.push({ kind: 'mistakes', title: 'Пройти «Мої помилки»', reason: `${today.mistakes} відкритих — закривайте, поки свіже`, href: '/mistakes' })
  if (currentGuide) {
    const next = nextChapterFor(snapshot, currentGuide, progress)
    if (next) {
      const unmet = next.prerequisites.map((id) => snapshot.chapters.get(id)).filter((c): c is Chapter => Boolean(c) && progress.get(c!.id)?.status !== 'studied')
      if (unmet[0]) recs.push({ kind: 'prerequisite', title: unmet[0].title, reason: `Потрібно для «${next.title}»`, href: chapterHref(snapshot, unmet[0]) })
      else recs.push({ kind: 'next', title: next.title, reason: `Наступний розділ у «${currentGuide.title}»`, href: chapterHref(snapshot, next) })
    }
  }
  for (const w of weak) {
    recs.push({
      kind: 'weak',
      title: w.chapter.title,
      reason: w.accuracy.total > 0 ? `Точність ${Math.round((w.accuracy.rate ?? 0) * 100)}%${w.open ? ` · помилок: ${w.open}` : ''}` : `Відкритих помилок: ${w.open}`,
      href: chapterHref(snapshot, w.chapter),
    })
  }
  const startable = lanes.find((l) => l.studied === 0 && !l.blocked && l.guide.id !== currentGuide?.id && l.total > 0)
  if (startable) {
    const first = nextChapterFor(snapshot, startable.guide, progress)
    recs.push({ kind: 'start', title: `Почати «${startable.guide.title}»`, reason: startable.prerequisites.length ? 'Передумови закрито' : 'Ще не розпочато', href: first ? chapterHref(snapshot, first) : guideHref(startable.guide.id) })
  }
  return { lanes, current: currentChapter && currentGuide ? { chapter: currentChapter, guide: currentGuide } : null, recommendations: recs.slice(0, 6), cycles }
}
