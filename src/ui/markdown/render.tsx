import 'server-only'
import type { Root } from 'mdast'
import type { ReactNode } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { toJsxRuntime, type Components } from 'hast-util-to-jsx-runtime'
import type { Chapter, LearningUnit } from '@/content/model'
import type { Locale } from '@/i18n'
import type { WikiLink } from '@/content/parse/nodes'
import { headingSlug, highlightTree, mdastToHast, type LinkTarget } from '@/content/render/to-hast'
import type { ContentSnapshot } from '@/content/store'
import { safeImageSrc, safeLinkHref } from '@/lib/url'
import { chapterHref } from '@/ui/routes'
import { PixelIcon, PIXEL_ICONS } from '@/ui/design/PixelIcon'
import type { DiagramSpec } from '@/content/diagram/spec'
import { CalloutIcon } from './CalloutIcon'
import { emojiToIcons } from './emoji-icons'
import { EmbedBlock } from './EmbedBlock'
import { LazyDiagram, LazyFigureBlock, LazyVizBlock } from './lazy-blocks'
import { UnitBlock } from './UnitBlock'

export interface RenderEnv {
  snapshot: ContentSnapshot
  chapter: Chapter
  depth: number
  variant: 'reader' | 'card'
  // a translated page (src/server/content-i18n.ts): its units — translated texts, source ids
  units?: ReadonlyMap<string, LearningUnit>
  // the reader's UI locale (enum-like content meta, «not translated yet»)
  locale?: Locale
}

function obsidianHref(snapshot: ContentSnapshot, vaultPath: string): string {
  const vault = snapshot.config.vaultPath.split(/[\\/]/).filter(Boolean).at(-1) ?? ''
  return `obsidian://open?vault=${encodeURIComponent(vault)}&file=${encodeURIComponent(vaultPath.replace(/\.md$/i, ''))}`
}

export function resolveWikiLink(env: RenderEnv, link: WikiLink): LinkTarget {
  const { snapshot, chapter } = env
  const res = snapshot.links.resolve(link.target, chapter.path)
  const label = link.alias ?? (link.heading && !link.target ? link.heading : link.target.split('/').at(-1) ?? link.target)
  if (res.kind === 'missing') return { kind: 'missing', href: null, label, title: null }
  if (res.kind === 'vault-file') return { kind: 'outside', href: obsidianHref(snapshot, res.path), label, title: 'Відкрити в Obsidian' }
  const target = snapshot.chapterByPath.get(res.path)
  if (!target) return { kind: 'missing', href: null, label, title: null }
  const hash = link.heading ? `#${headingSlug(link.heading)}` : ''
  const niceLabel = link.alias ?? (link.heading && !link.target ? link.heading : target.title)
  return { kind: 'internal', href: `${chapterHref(snapshot, target)}${hash}`, label: niceLabel, title: null }
}

export async function renderMdast(root: Root, env: RenderEnv): Promise<ReactNode> {
  const hast = mdastToHast(root, { resolveLink: (link) => resolveWikiLink(env, link) })
  const tree = emojiToIcons(await highlightTree(hast))
  const components = {
    'x-icon': (props: Record<string, unknown>) => <CalloutIcon name={String(props['data-name'] ?? 'info')} />,
    // an author's emoji swapped for our pixel icon (emoji-icons.ts); the emoji stays as the accessible name
    'x-px': (props: Record<string, unknown>) => {
      const name = PIXEL_ICONS.find((n) => n === props['data-name'])
      return name ? <PixelIcon name={name} size={20} className="px-emoji" /> : <>{String(props['data-emoji'] ?? '')}</>
    },
    'x-diagram': (props: Record<string, unknown> & { children?: ReactNode }) => {
      const spec = JSON.parse(String(props['data-spec'] ?? '{}')) as DiagramSpec
      return <LazyDiagram spec={spec}>{props.children}</LazyDiagram>
    },
    'x-unit': (props: Record<string, unknown>) => <UnitBlock unitId={String(props['data-unit'] ?? '')} env={env} />,
    'x-viz': (props: Record<string, unknown> & { children?: ReactNode }) => (
      <LazyVizBlock vizId={String(props['data-viz'] ?? '')} scenario={props['data-scenario'] ? String(props['data-scenario']) : null}>
        {props.children}
      </LazyVizBlock>
    ),
    'x-figure': (props: Record<string, unknown> & { children?: ReactNode }) => (
      <LazyFigureBlock
        scene={String(props['data-scene'] ?? '')}
        scenario={props['data-scenario'] ? String(props['data-scenario']) : null}
        device={props['data-device'] ? (String(props['data-device']) as 'desktop' | 'phone' | 'auto') : null}
      >
        {props.children}
      </LazyFigureBlock>
    ),
    'x-embed': (props: Record<string, unknown>) => (
      <EmbedBlock target={String(props['data-target'] ?? '')} heading={String(props['data-heading'] ?? '') || null} env={env} />
    ),
    table: (props: Record<string, unknown>) => (
      <div className="table-wrap">
        <table {...props} />
      </div>
    ),
    // Content (and, later, user-uploaded courses / model output) decides these URLs: allow-list the schemes.
    a: ({ href, ...props }: Record<string, unknown> & { href?: unknown; children?: ReactNode }) => {
      const safe = safeLinkHref(href)
      if (!safe) return <span className="link-blocked">{props.children}</span>
      const external = /^https?:\/\//i.test(safe)
      return <a {...props} href={safe} {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})} />
    },
    img: ({ src, alt, ...props }: Record<string, unknown> & { src?: unknown; alt?: unknown }) => {
      const safe = safeImageSrc(src)
      const label = typeof alt === 'string' ? alt : ''
      // eslint-disable-next-line @next/next/no-img-element
      return safe ? <img {...props} src={safe} alt={label} /> : <span className="img-blocked">{label ? `[${label}]` : null}</span>
    },
  } as unknown as Components
  return toJsxRuntime(tree, { Fragment, jsx, jsxs, components, passKeys: true })
}
