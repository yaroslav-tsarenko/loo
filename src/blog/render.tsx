import 'server-only'
import type { Element, ElementContent, Root as HastRoot } from 'hast'
import type { ReactNode } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { toJsxRuntime, type Components } from 'hast-util-to-jsx-runtime'
import { parseMarkdown } from '@/content/parse/markdown'
import { headingSlug, highlightTree, mdastToHast } from '@/content/render/to-hast'
import { safeImageSrc, safeLinkHref } from '@/lib/url'
import { CalloutIcon } from '@/ui/markdown/CalloutIcon'

// A blog post body → React, through the guides' markdown pipeline (callouts `> [!tip]`, shiki code, GFM tables) minus
// the vault features (wiki links render as plain text). h2/h3 get ids for the table of contents and deep links.

export interface TocItem {
  id: string
  text: string
  depth: 2 | 3
}

function textOf(node: ElementContent | HastRoot): string {
  if (node.type === 'text') return node.value
  if ('children' in node) return (node.children as ElementContent[]).map(textOf).join('')
  return ''
}

function addHeadingIds(tree: HastRoot): TocItem[] {
  const toc: TocItem[] = []
  const seen = new Map<string, number>()
  const walk = (node: HastRoot | Element) => {
    for (const child of node.children) {
      if (child.type !== 'element') continue
      if (child.tagName === 'h2' || child.tagName === 'h3') {
        const text = textOf(child).trim()
        const base = headingSlug(text) || 'section'
        const n = seen.get(base) ?? 0
        seen.set(base, n + 1)
        const id = n ? `${base}-${n}` : base
        child.properties = { ...child.properties, id }
        toc.push({ id, text, depth: child.tagName === 'h2' ? 2 : 3 })
      } else {
        walk(child)
      }
    }
  }
  walk(tree)
  return toc
}

const components = {
  'x-icon': (props: Record<string, unknown>) => <CalloutIcon name={String(props['data-name'] ?? 'info')} />,
  table: (props: Record<string, unknown>) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  a: ({ href, ...props }: Record<string, unknown> & { href?: unknown; children?: ReactNode }) => {
    const safe = safeLinkHref(href)
    if (!safe) return <span className="link-blocked">{props.children}</span>
    const external = /^https?:\/\//i.test(safe) && !safe.startsWith('https://playloo.app')
    return <a {...props} href={safe} {...(external ? { target: '_blank', rel: 'noopener' } : {})} />
  },
  img: ({ src, alt, ...props }: Record<string, unknown> & { src?: unknown; alt?: unknown }) => {
    const safe = safeImageSrc(src)
    const label = typeof alt === 'string' ? alt : ''
    if (!safe) return null
    return (
      // a span, not <figure>: markdown puts images inside <p>
      <span className="blog-figure">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp from public/blog */}
        <img {...props} src={safe} alt={label} loading="lazy" decoding="async" />
        {label ? <span className="blog-figure-caption">{label}</span> : null}
      </span>
    )
  },
} as unknown as Components

export async function renderPostBody(markdown: string): Promise<{ content: ReactNode; toc: TocItem[] }> {
  const { root } = parseMarkdown(markdown)
  const hast = mdastToHast(root, { resolveLink: (link) => ({ kind: 'missing', href: null, label: link.alias ?? link.target, title: null }) })
  const tree = await highlightTree(hast)
  const toc = addHeadingIds(tree)
  return { content: toJsxRuntime(tree, { Fragment, jsx, jsxs, components, passKeys: true }), toc }
}
