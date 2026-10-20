import Link from 'next/link'
import type { CSSProperties } from 'react'
import { blogCategory } from '@/blog/categories'
import type { BlogPost } from '@/blog/posts'
import { LooArt } from '@/ui/design/mascot/LooArt'
import { blogDate, readingTime } from './format'

export function CategoryChip({ id, link = true }: { id: string; link?: boolean }) {
  const c = blogCategory(id)
  if (!c) return null
  const style = { '--chip': c.color } as CSSProperties
  return link ? (
    <Link href={`/blog/${c.id}`} className="blog-chip" style={style}>
      {c.short}
    </Link>
  ) : (
    <span className="blog-chip" style={style}>
      {c.short}
    </span>
  )
}

export function BlogCover({ post, eager = false }: { post: BlogPost; eager?: boolean }) {
  const c = blogCategory(post.category)
  if (post.cover) {
    // eslint-disable-next-line @next/next/no-img-element -- pre-sized webp from public/blog
    return <img className="blog-cover" src={post.cover} alt={post.coverAlt ?? ''} width={1536} height={1024} loading={eager ? 'eager' : 'lazy'} decoding="async" {...(eager ? { fetchPriority: 'high' as const } : {})} />
  }
  return (
    <div className="blog-cover blog-cover-empty" style={{ '--chip': c?.color ?? '#7c4dff' } as CSSProperties} aria-hidden="true">
      <LooArt mood="happy" size={96} decorative animated={false} />
    </div>
  )
}

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <article className="blog-card" data-featured={featured || undefined}>
      <Link href={`/blog/${post.slug}`} className="blog-card-media" tabIndex={-1} aria-hidden="true">
        <BlogCover post={post} eager={featured} />
      </Link>
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <CategoryChip id={post.category} />
          <span>{readingTime(post.readingMinutes)}</span>
        </div>
        <h3 className="blog-card-title">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="blog-card-desc">{post.description}</p>
        <time className="blog-card-date" dateTime={post.date}>
          {blogDate(post.date)}
        </time>
      </div>
    </article>
  )
}
