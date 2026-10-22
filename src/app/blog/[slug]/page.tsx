import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogCategory, BLOG_CATEGORIES, type BlogCategory } from '@/blog/categories'
import { allPosts, getPost, relatedPosts, type BlogPost } from '@/blog/posts'
import { renderPostBody } from '@/blog/render'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { BlogCard, BlogCover, CategoryChip } from '@/ui/blog/BlogCard'
import { BlogCta } from '@/ui/blog/BlogCta'
import { blogDate, readingTime } from '@/ui/blog/format'
import { JsonLd } from '@/ui/seo/JsonLd'

// /blog/<slug> is a post, or a category page when the segment is a category id (post slugs never collide with
// categories: src/blog/posts.ts).

type Params = { params: Promise<{ slug: string }> }

// Only known categories and posts exist: anything else is a real 404 before rendering (the root loading.tsx would
// otherwise start streaming with 200 and turn notFound() into a soft 404).
export const dynamicParams = false

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return [...BLOG_CATEGORIES.map((c) => ({ slug: c.id })), ...(await allPosts('uk')).map((p) => ({ slug: p.slug }))]
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const category = blogCategory(slug)
  if (category) {
    const title = `${category.title}: статті й пояснення українською`
    const empty = !(await allPosts('uk')).some((p) => p.category === category.id)
    return {
      title,
      // an empty category page is thin content: keep it out of the index until the first post lands
      ...(empty ? { robots: { index: false, follow: true } } : {}),
      description: category.description,
      alternates: { canonical: `/blog/${category.id}` },
      openGraph: { type: 'website', url: `/blog/${category.id}`, title, description: category.description },
    }
  }
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      section: blogCategory(post.category)?.title,
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  }
}

export default async function BlogSlugPage({ params }: Params) {
  const { slug } = await params
  const category = blogCategory(slug)
  if (category) return <CategoryPage category={category} />
  const post = await getPost(slug)
  if (!post) notFound()
  return <PostPage post={post} />
}

async function CategoryPage({ category }: { category: BlogCategory }) {
  const posts = (await allPosts('uk')).filter((p) => p.category === category.id)
  return (
    <main className="blog-main">
      <JsonLd data={breadcrumbs([{ name: 'Блог', path: '/blog' }, { name: category.title, path: `/blog/${category.id}` }])} />
      <section className="blog-hero">
        <nav className="blog-crumbs" aria-label="Навігація">
          <Link href="/blog">Блог</Link>
        </nav>
        <h1 className="blog-hero-title">{category.title}</h1>
        <p className="blog-hero-lead">{category.description}</p>
      </section>
      {posts.length > 0 ? (
        <div className="blog-grid">
          {posts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      ) : (
        <p className="blog-empty">Статті цієї категорії вже пишуться — заглядай незабаром.</p>
      )}
      <BlogCta category={category.id} />
    </main>
  )
}

async function PostPage({ post }: { post: BlogPost }) {
  const [{ content, toc }, posts] = await Promise.all([renderPostBody(post.body), allPosts('uk')])
  const category = blogCategory(post.category)
  const related = relatedPosts(post, posts)
  const url = `${SITE_URL}/blog/${post.slug}`
  const toc2 = toc.filter((t) => t.depth === 2)
  return (
    <main className="blog-main blog-post-main">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.updated ?? post.date,
            inLanguage: post.locale,
            mainEntityOfPage: url,
            url,
            image: [post.cover ? `${SITE_URL}${post.cover}` : `${url}/opengraph-image`],
            keywords: post.keywords.join(', '),
            articleSection: category?.title,
            author: { '@type': 'Organization', name: `Редакція ${SITE_NAME}`, url: `${SITE_URL}/blog/about` },
            publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon` } },
          },
          breadcrumbs([
            { name: 'Блог', path: '/blog' },
            ...(category ? [{ name: category.title, path: `/blog/${category.id}` }] : []),
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          ...(post.faq.length > 0
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: post.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
                },
              ]
            : []),
        ]}
      />
      <article className="blog-article">
        <header className="blog-article-head">
          <nav className="blog-crumbs" aria-label="Навігація">
            <Link href="/blog">Блог</Link>
            {category ? (
              <>
                {' / '}
                <Link href={`/blog/${category.id}`}>{category.title}</Link>
              </>
            ) : null}
          </nav>
          <h1 className="blog-article-title">{post.title}</h1>
          <p className="blog-article-lead">{post.description}</p>
          <div className="blog-card-meta">
            <CategoryChip id={post.category} />
            <time dateTime={post.date}>{blogDate(post.date)}</time>
            <span>{readingTime(post.readingMinutes)}</span>
            <Link href="/blog/about" className="blog-byline">
              Редакція Loo
            </Link>
          </div>
          {post.updated && post.updated !== post.date ? (
            <p className="blog-updated">
              Оновлено <time dateTime={post.updated}>{blogDate(post.updated)}</time>
            </p>
          ) : null}
        </header>
        <BlogCover post={post} eager />
        <div className="blog-article-grid">
          {toc2.length >= 3 ? (
            <details className="blog-toc" open>
              <summary>Зміст</summary>
              <ol>
                {toc2.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.text}</a>
                  </li>
                ))}
              </ol>
            </details>
          ) : null}
          <div className="prose-read blog-prose">{content}</div>
        </div>
        {post.faq.length > 0 ? (
          <section className="blog-faq" aria-labelledby="faq">
            <h2 id="faq">Часті запитання</h2>
            {post.faq.map((f) => (
              <details key={f.q} className="blog-faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </section>
        ) : null}
      </article>
      <BlogCta category={post.category} />
      {related.length > 0 ? (
        <section className="blog-related" aria-labelledby="related">
          <h2 id="related">Читай також</h2>
          <div className="blog-grid">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}

function breadcrumbs(items: Array<{ name: string; path: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
  }
}
