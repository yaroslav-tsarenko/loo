import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { BlogCta } from '@/ui/blog/BlogCta'
import { JsonLd } from '@/ui/seo/JsonLd'

const TITLE = 'Про блог Loo: хто пише і як ми готуємо статті'
const DESCRIPTION = 'Редакційна політика блогу Loo: як створюються статті, хто їх перевіряє, як ми виправляємо помилки і чому ми відкрито кажемо про використання ШІ.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/blog/about' },
  openGraph: { type: 'website', url: '/blog/about', title: TITLE, description: DESCRIPTION },
}

// Editorial policy (E-E-A-T): who stands behind the articles, how they are made, how to report a mistake.
export default function BlogAbout() {
  return (
    <main className="blog-main blog-post-main">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: TITLE,
          url: `${SITE_URL}/blog/about`,
          inLanguage: 'uk',
          about: { '@type': 'Organization', name: `Редакція ${SITE_NAME}`, url: `${SITE_URL}/blog/about`, email: 'hello@playloo.app' },
        }}
      />
      <article className="blog-article">
        <header className="blog-article-head">
          <nav className="blog-crumbs" aria-label="Навігація">
            <Link href="/blog">Блог</Link>
          </nav>
          <h1 className="blog-article-title">Про блог Loo</h1>
          <p className="blog-article-lead">{DESCRIPTION}</p>
        </header>
        <div className="prose-read blog-prose">
          <h2 id="hto">Хто ми</h2>
          <p>
            Loo — українська освітня платформа, де мови й програмування вчать як гру: короткі уроки, вправи з миттєвою перевіркою, серії, ліги й боси. Блог — частина цієї роботи:
            тут ми пояснюємо теми, з якими найчастіше застрягають учні курсів «Англійська A1→C2» і «JavaScript Zero→Pro», а також SQL, System Design і німецьку.
          </p>
          <h2 id="yak">Як створюються статті</h2>
          <ol>
            <li>Тему обираємо з реальних запитань учнів і того, що люди шукають українською.</li>
            <li>Чернетку готує мовна модель за нашим стайлгайдом: відповідь на запитання — одразу, багато прикладів, робочий код, типові помилки, вправи з відповідями.</li>
            <li>Другий прохід — редакторська перевірка фактів, прикладів, коду й української мови (без русизмів і кальок).</li>
            <li>Автоматичні перевірки не пропустять статтю без змістовних розділів, вправ чи підсумку, а також дубль уже наявної теми.</li>
            <li>Ілюстрації створюються спеціально для кожної статті.</li>
          </ol>
          <p>Ми відкрито кажемо, що використовуємо штучний інтелект: він допомагає писати більше й ретельніше, але відповідальність за кожен текст — на нас.</p>
          <h2 id="pomylky">Знайшли помилку?</h2>
          <p>
            Напишіть на <a href="mailto:hello@playloo.app">hello@playloo.app</a> — виправимо й оновимо дату редакції статті. Ми регулярно переглядаємо старі тексти й доповнюємо їх.
          </p>
        </div>
      </article>
      <BlogCta category={null} />
    </main>
  )
}
