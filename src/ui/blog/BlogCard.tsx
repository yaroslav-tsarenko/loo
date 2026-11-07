import Image from 'next/image'
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
    // Covers are 1536×1024 webp; next/image serves a width that fits the slot (srcset, AVIF/WebP, CDN-cached), so a
    // phone loads ~640 px instead of the full file for every card. `eager` = the featured card and the article header.
    return (
      <Image
        className="blog-cover"
        src={post.cover}
        alt={post.coverAlt ?? ''}
        width={1536}
        height={1024}
        sizes={eager ? '(max-width: 800px) 100vw, 760px' : '(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 400px'}
        preload={eager}
      />
    )
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
