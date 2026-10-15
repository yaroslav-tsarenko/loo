import type { Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import Link from 'next/link'
import { getContentStore } from '@/content/store'
import { headingSlug } from '@/content/render/to-hast'
import { chapterHref } from '@/ui/routes'
import { renderMdast, type RenderEnv } from './render'

function sectionOf(root: Root, heading: string): Root {
  const wanted = headingSlug(heading)
  const children = root.children
  const start = children.findIndex((n) => n.type === 'heading' && headingSlug(toString(n)) === wanted)
  if (start < 0) return { type: 'root', children: [] }
  const first = children[start] as Extract<RootContent, { type: 'heading' }>
  let end = start + 1
  while (end < children.length) {
    const n = children[end]!
    if (n.type === 'heading' && n.depth <= first.depth) break
    end++
  }
  return { type: 'root', children: children.slice(start + 1, end) }
}

export async function EmbedBlock({ target, heading, env }: { target: string; heading: string | null; env: RenderEnv }) {
  const res = env.snapshot.links.resolve(target, env.chapter.path)
  const chapter = res.kind === 'guide-file' ? env.snapshot.chapterByPath.get(res.path) : undefined
  if (!chapter) {
    return <p className="wikilink-broken">Вбудовування «{target}» не знайдено</p>
  }
  const href = `${chapterHref(env.snapshot, chapter)}${heading ? `#${headingSlug(heading)}` : ''}`
  if (env.depth >= 3 || chapter.id === env.chapter.id) {
    return (
      <p>
        <Link className="wikilink" href={href}>{chapter.title}</Link>
      </p>
    )
  }
  const doc = await getContentStore().document(chapter.id)
  if (!doc) return null
  const root = heading ? sectionOf(doc.root, heading) : doc.root
  const content = await renderMdast(root, { ...env, chapter, depth: env.depth + 1 })
  return (
    <aside className="embed">
      <div className="embed-head">
        <span className="eyebrow">Вбудовано</span>
        <Link className="ui-link" href={href}>
          {chapter.title}
          {heading ? ` · ${heading}` : ''}
        </Link>
      </div>
      <div className="embed-body">{content}</div>
    </aside>
  )
}
