import 'server-only'
import type { Root } from 'mdast'
import type { ReactNode } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { toJsxRuntime, type Components } from 'hast-util-to-jsx-runtime'
import type { Chapter } from '@/content/model'
import type { WikiLink } from '@/content/parse/nodes'
import { headingSlug, highlightTree, mdastToHast, type LinkTarget } from '@/content/render/to-hast'
import type { ContentSnapshot } from '@/content/store'
import { chapterHref } from '@/ui/routes'
import { CalloutIcon } from './CalloutIcon'
import { EmbedBlock } from './EmbedBlock'
import { UnitBlock } from './UnitBlock'
import { FigureBlock } from '@/ui/theater/FigureBlock'
import { VizBlock } from '@/ui/viz/VizBlock'

export interface RenderEnv {
  snapshot: ContentSnapshot
  chapter: Chapter
  depth: number
  variant: 'reader' | 'card'
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
  const tree = await highlightTree(hast)
  const components = {
    'x-icon': (props: Record<string, unknown>) => <CalloutIcon name={String(props['data-name'] ?? 'info')} />,
    'x-unit': (props: Record<string, unknown>) => <UnitBlock unitId={String(props['data-unit'] ?? '')} env={env} />,
    'x-viz': (props: Record<string, unknown> & { children?: ReactNode }) => (
      <VizBlock vizId={String(props['data-viz'] ?? '')} scenario={props['data-scenario'] ? String(props['data-scenario']) : null}>
        {props.children}
      </VizBlock>
    ),
    'x-figure': (props: Record<string, unknown> & { children?: ReactNode }) => (
      <FigureBlock
        scene={String(props['data-scene'] ?? '')}
        scenario={props['data-scenario'] ? String(props['data-scenario']) : null}
        device={props['data-device'] ? (String(props['data-device']) as 'desktop' | 'phone' | 'auto') : null}
      >
        {props.children}
      </FigureBlock>
    ),
    'x-embed': (props: Record<string, unknown>) => (
      <EmbedBlock target={String(props['data-target'] ?? '')} heading={String(props['data-heading'] ?? '') || null} env={env} />
    ),
    table: (props: Record<string, unknown>) => (
      <div className="table-wrap">
        <table {...props} />
      </div>
    ),
    a: (props: Record<string, unknown> & { href?: string }) => {
      const href = props.href ?? ''
      const external = /^https?:\/\//.test(href)
      return <a {...props} {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})} />
    },
  } as unknown as Components
  return toJsxRuntime(tree, { Fragment, jsx, jsxs, components, passKeys: true })
}
