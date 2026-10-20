# Блог і SEO

## Що де живе

| Що | Де |
|---|---|
| Статті | `blog/uk/<slug>.md` — markdown з frontmatter (схема — `src/blog/parse.ts`) |
| Ілюстрації | `public/blog/<slug>/cover.webp`, `img-1.webp`, `img-2.webp` (1536×1024, webp) |
| Категорії | `src/blog/categories.ts` (id = сегмент URL, не збігається зі slug статей) |
| Черга тем | `blog/topics.yaml` — `topic`, `category`, `keywords`, `notes`; після генерації `status: done` + `slug` |
| Сторінки | `/blog`, `/blog/<категорія>`, `/blog/<slug>` (`src/app/blog/`), публічні (`src/lib/auth-paths.ts`) |
| Генератор | `pnpm blog:write` (`scripts/blog-write.ts`, промпти — `src/blog/generate.ts`) |
| Автопублікація | GitHub Actions `.github/workflows/blog.yml` |

Статті лежать у git, а не в базі: їх видно в рев'ю, вони версіонуються, сторінки читають файли з диска (жодних запитів
до БД), картинки віддає CDN Vercel. Тіло рендериться тим самим конвеєром, що й гайди: callout-и `> [!tip]`, підсвітка
коду, таблиці; h2/h3 отримують id для змісту.

## Генерація

```bash
pnpm blog:write                                    # наступна тема з черги
pnpm blog:write --count 3 --category sql           # кілька однієї категорії
pnpm blog:write --topic "Future Simple" --category english
pnpm blog:write --no-images                        # лише текст
```

1. **Автор** (`gpt-5.5`, OpenAI) пише статтю за стайлгайдом: відповідь на пошуковий запит у перших абзацах, 5–9
   розділів, багато прикладів (мовні — з перекладом, код — робочий і з виводом), таблиці, «Типові помилки», «Перевір
   себе» з відповідями у згорнутому callout, «Коротко», FAQ, 1–3 внутрішні посилання на наявні статті.
2. **Редактор** (та сама модель, другий прохід) перевіряє факти, приклади, код, українську (русизми, суржик, кальки)
   і повертає виправлений текст.
3. **Ілюстрації** — `gpt-image-2`: обкладинка + до 2 ілюстрацій у спільному стилі (`IMAGE_STYLE`: світлий фон,
   фіолетовий і м'ятний акценти, піксельні деталі, без тексту), стиснення в webp через sharp.
4. Frontmatter валідується тією ж схемою, що й на сайті; файл, який сайт не прочитає, не запишеться.

Вартість ≈ $0.3–0.5 за статтю (два проходи тексту + 3 картинки). Інша модель тексту — `BLOG_MODEL`
(`openai/<id>` — напряму в OpenAI; `anthropic/claude-sonnet-5.5` — через Vercel AI Gateway, потрібні платні кредити
Gateway). Ключ — `OPENAI_API_KEY` у `.env.local`.

**Перед публікацією варто прочитати статтю.** Модель пише сильно, але відповідальність за факти — наша. Правки —
прямо в markdown.

## Автопублікація (GitHub Actions)

`.github/workflows/blog.yml` працює сам: щодня о 06:20 UTC пише `BLOG_DAILY_COUNT` статей (змінна репозиторію,
за замовчуванням 1) з черги й публікує. Пауза — змінна `BLOG_PAUSED` = `true`. Вручну: Actions → blog → Run
workflow (кількість, категорія або своя тема). Потрібен секрет `OPENAI_API_KEY` з кредитами (≈ $12/міс при 1 статті
на день). Невдалий запуск нічого не комітить, тема лишається в черзі, GitHub надсилає лист власнику. Workflow генерує, проганяє `tests/unit/blog.test.ts` і комітить у `main` від імені власника
(Vercel на Hobby деплоїть лише коміти автора, прив'язаного до акаунта) — далі Vercel деплоїть сам.

## SEO

- `metadataBase` = `SITE_URL` (`src/lib/site.ts`), OpenGraph/Twitter за замовчуванням у `src/app/layout.tsx`.
- OG-картки 1200×630 (`src/app/og-card.tsx`): сайт (`/opengraph-image`), блог, кожна категорія і стаття — з
  заголовком, категорією й піксельним Loo; шрифт Onest підтягується з Google Fonts під час збірки.
- `/sitemap.xml` (`src/app/sitemap.ts`): головна, блог, категорії зі статтями, статті (з обкладинками), реєстрація,
  юридичні сторінки. `/robots.txt` відкриває сайт і закриває `/api/`, `/auth/`, `/unsubscribe`.
- JSON-LD (`src/ui/seo/JsonLd.tsx`): WebSite + EducationalOrganization на лендингу, Blog на `/blog`, BlogPosting +
  BreadcrumbList + FAQPage у статтях.
- Canonical на кожній публічній сторінці.

Після першого деплою: додати сайт у [Google Search Console](https://search.google.com/search-console) (DNS-запис
TXT у Cloudflare) і надіслати `https://playloo.app/sitemap.xml`.

## Англійська аудиторія (надалі)

Локаль закладена: `blog/<locale>/`, `BLOG_LOCALES` у `src/blog/parse.ts`. Для `en` — додати локаль, маршрути
`/en/blog…`, `hreflang` в `alternates.languages` і англійський стайлгайд у генераторі.
