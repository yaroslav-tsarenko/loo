import { blogCategory, BLOG_CATEGORIES } from '@/blog/categories'
import { allPosts, getPost } from '@/blog/posts'
import { ogCard, OG_SIZE } from '../../og-card'

export const alt = 'Стаття в блозі Loo'
export const size = OG_SIZE
export const contentType = 'image/png'

export async function generateStaticParams() {
  return [...BLOG_CATEGORIES.map((c) => ({ slug: c.id })), ...(await allPosts('uk')).map((p) => ({ slug: p.slug }))]
}

export default async function BlogOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = blogCategory(slug)
  if (category) return ogCard({ eyebrow: 'Блог Loo', eyebrowColor: category.color, title: category.title, subtitle: 'Статті й пояснення українською' })
  const post = await getPost(slug)
  const c = post ? blogCategory(post.category) : null
  return ogCard({
    eyebrow: c?.short ?? 'Блог Loo',
    eyebrowColor: c?.color,
    title: post?.title ?? 'Блог Loo',
    meta: post ? `${post.readingMinutes} хв читання` : undefined,
  })
}
