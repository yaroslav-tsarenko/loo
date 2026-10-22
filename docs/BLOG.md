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

## Як ми публікуємо

Основний процес — сесія з Claude Code щопонеділка, щосереди й щоп'ятниці:

1. Тему обираємо за попитом (пошукові запити, новини, дослідження ринку) з `blog/topics.yaml` або нову.
2. Claude пише статтю за стайлгайдом (`STYLE_GUIDE` у `src/blog/generate.ts`), перевіряє факти за першоджерелами й
   дає посилання на них.
3. Ілюстрації — піксельні сцени в стилі Loo, без OpenAI: набір `scripts/blog-art/kit.ts` (полотно, Loo, блоки,
   підписи, іскри) і файл сцен на статтю `scripts/blog-art/<slug>.ts` →
   `pnpm tsx scripts/blog-art/<slug>.ts` пише `public/blog/<slug>/cover.webp`, `img-1.webp`…
4. `pnpm blog:manifest` (список slug-ів для proxy: невідомі `/blog/<slug>` → справжній 404), перевірки:
   `qualityProblems`, `pnpm vitest run tests/unit/blog.test.ts`, перегляд сторінки.
5. Коміт у `main` → Vercel деплоїть → `pnpm indexnow /blog/<slug>` → Search Console → «Перевірка URL» → «Надіслати
   запит на індексування».

Тема в `blog/topics.yaml` позначається `status: done` + `slug`.

## Генерація через OpenAI (резервний варіант)

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

`.github/workflows/blog.yml` запускається щодня о 06:20 UTC, але публікує лише в дні зі змінної репозиторію
`BLOG_DAYS` (ISO-дні тижня; за замовчуванням `1,3,5` — пн/ср/пт), по `BLOG_DAILY_COUNT` статей (за замовчуванням 1).
Пауза — `BLOG_PAUSED` = `true`. Вручну: Actions → blog → Run workflow (кількість, категорія або своя тема).
Потрібен секрет `OPENAI_API_KEY` з кредитами. Workflow генерує, проганяє `tests/unit/blog.test.ts`, комітить у `main`
від імені власника (Vercel на Hobby деплоїть лише коміти автора, прив'язаного до акаунта), чекає, поки сторінка
з'явиться на проді, і пінгує IndexNow. Тема, що впала, лишається в черзі; вдалі статті все одно публікуються, а
запуск позначається як невдалий (GitHub надсилає лист).

### Темп і як не стати «контент-фермою»

Google не рахує статті на день — він карає масовий одноманітний контент без цінності (політика «scaled content
abuse»), незалежно від того, писала людина чи ШІ. Тому:

- **Темп із прогрівом.** Новий домен: 3 статті на тиждень (`BLOG_DAYS=1,3,5`) 1–2 місяці. Коли в Search Console
  з'являться покази й більшість статей «Indexed» — `1,2,3,4,5`, далі щодня. Рівний ритм, без сплесків.
- **Фільтр якості** (`qualityProblems` у `src/blog/generate.ts`) перед публікацією: ≥ 1 200 слів прози, ≥ 5
  розділів, «Типові помилки», «Перевір себе», «Коротко», ≥ 3 FAQ, без шаблонів асистента, без дубля наявної статті
  (перетин слів заголовка ≥ 75 % — канібалізація запитів). Дві спроби, далі тема отримує `status: skipped` з причиною
  (виправити тему й прибрати `status` — і вона повернеться в чергу).
- **Кластери й перелінкування:** категорії, «Читай також», 1–3 внутрішні посилання від автора в тексті.
- **Прозорість (E-E-A-T):** `/blog/about` — хто пише, як, що з ШІ, куди писати про помилку; автор у JSON-LD —
  «Редакція Loo» з посиланням туди.
- **Оновлення, а не лише нове:** виправили статтю — поставте `updated: YYYY-MM-DD` у frontmatter (йде в
  `dateModified`, sitemap `lastmod` і «Оновлено …» на сторінці).

## SEO

- `metadataBase` = `SITE_URL` (`src/lib/site.ts`), OpenGraph/Twitter за замовчуванням у `src/app/layout.tsx`.
- OG-картки 1200×630 (`src/app/og-card.tsx`): сайт (`/opengraph-image`), блог, кожна категорія і стаття — з
  заголовком, категорією й піксельним Loo; шрифт Onest підтягується з Google Fonts під час збірки.
- `/sitemap.xml` (`src/app/sitemap.ts`): головна, блог, категорії зі статтями, статті (з обкладинками), реєстрація,
  юридичні сторінки. `/robots.txt` відкриває сайт і закриває `/api/`, `/auth/`, `/unsubscribe`.
- JSON-LD (`src/ui/seo/JsonLd.tsx`): WebSite + EducationalOrganization на лендингу, Blog на `/blog`, BlogPosting +
  BreadcrumbList + FAQPage у статтях.
- Canonical на кожній публічній сторінці; порожні категорії — `noindex` до першої статті.
- RSS `/blog/rss.xml` (посилання в `<head>` блогу).
- IndexNow (`scripts/indexnow.ts`, ключ `public/indexnow.txt`): Bing, Yandex та ін. дізнаються про нову статтю
  за хвилини. Google IndexNow не приймає — йому sitemap у Search Console і посилання.

Після першого деплою: додати сайт у [Google Search Console](https://search.google.com/search-console) (DNS-запис
TXT у Cloudflare) і надіслати `https://playloo.app/sitemap.xml`.

## Англійська аудиторія (надалі)

Локаль закладена: `blog/<locale>/`, `BLOG_LOCALES` у `src/blog/parse.ts`. Для `en` — додати локаль, маршрути
`/en/blog…`, `hreflang` в `alternates.languages` і англійський стайлгайд у генераторі.
