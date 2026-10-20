import type { Metadata } from 'next'
import { BLOG_CATEGORIES } from '@/blog/categories'
import { allPosts } from '@/blog/posts'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { BlogCard, CategoryChip } from '@/ui/blog/BlogCard'
import { BlogCta } from '@/ui/blog/BlogCta'
import { JsonLd } from '@/ui/seo/JsonLd'

const TITLE = 'Блог Loo — англійська, JavaScript, SQL і System Design простими словами'
const DESCRIPTION = 'Статті українською: граматика англійської й німецької, JavaScript і SQL з прикладами коду, System Design і поради, як вчитися ефективно.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/blog' },
  openGraph: { type: 'website', url: '/blog', title: TITLE, description: DESCRIPTION },
}

export default async function BlogIndex() {
  const posts = await allPosts('uk')
  const [first, ...rest] = posts
  const used = new Set(posts.map((p) => p.category))
  return (
    <main className="blog-main">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Blog', name: `Блог ${SITE_NAME}`, url: `${SITE_URL}/blog`, inLanguage: 'uk', description: DESCRIPTION }} />
      <section className="blog-hero">
        <span className="landing-eyebrow">Блог Loo</span>
        <h1 className="blog-hero-title">Пояснюємо складне простими словами</h1>
        <p className="blog-hero-lead">{DESCRIPTION}</p>
        <nav className="blog-chips" aria-label="Категорії">
          {BLOG_CATEGORIES.filter((c) => used.has(c.id)).map((c) => (
            <CategoryChip key={c.id} id={c.id} />
          ))}
        </nav>
      </section>
      {first ? (
        <>
          <BlogCard post={first} featured />
          <div className="blog-grid">
            {rest.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </>
      ) : (
        <p className="blog-empty">Перші статті вже пишуться — заглядай незабаром.</p>
      )}
      <BlogCta category={null} />
    </main>
  )
}
