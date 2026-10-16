import type { Chapter, Guide } from '@/content/model'

interface HasGuides {
  guideById: Map<string, Guide>
}

export function guideHref(guideId: string): string {
  return `/g/${encodeURIComponent(guideId)}`
}

export function chapterHref(_snapshot: HasGuides | null, chapter: Pick<Chapter, 'guideId' | 'slug' | 'kind'>): string {
  const base = guideHref(chapter.guideId)
  if (chapter.kind === 'index' || chapter.slug.length === 0) return base
  return `${base}/${chapter.slug.map(encodeURIComponent).join('/')}`
}

// Anchor of a course topic on /path (`/path#topic-…`): links from the profile's strong / weak topics.
export function topicAnchor(topicId: string): string {
  return `topic-${topicId.replace(/[^a-zA-Z0-9_-]+/g, '-')}`
}
