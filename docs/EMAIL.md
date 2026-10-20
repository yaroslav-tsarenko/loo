# Пошта Loo — акаунт-листи, нагадування, вхідні адреси

## Що де живе

| Що | Де | Як |
|---|---|---|
| Домен | `playloo.app` (Hostinger), DNS у Cloudflare | Vercel: `@` і `www` → CNAME на Vercel (DNS only), `www` → `playloo.app` 308 |
| Вхідна пошта | Cloudflare Email Routing | `hello@`, `support@`, `news@` → Gmail власника; `noreply@` → drop; catch-all вимкнено |
| Відправка | Resend, домен `playloo.app`, регіон eu-west-1 | DKIM `resend._domainkey`, SPF `send`/`rsend` (CNAME), DMARC `p=none`; трекінг кліків/відкриттів вимкнено |
| Листи акаунта | Supabase Auth → SMTP Resend | шаблони `docs/emails/*.html` (`pnpm emails:build`), теми — `docs/emails/subjects.json` |
| Нагадування | Render cron `loo-reminders` (`render.yaml`) | `scripts/reminders.ts` щогодини, логіка — `src/email/reminders.ts` |

Верстка всіх листів одна — `src/email/layout.ts`: лише таблиці й inline-стилі (Gmail вирізає SVG і веб-шрифти), тож
піксельний Loo і напис «LOO» складені з клітинок таблиці.

## Supabase SMTP (один раз, вручну)

Authentication → Emails → SMTP Settings → Enable custom SMTP:
Sender `hello@playloo.app`, name `Loo`, host `smtp.resend.com`, port `465`, user `resend`, password — API-ключ Resend
(Sending access, домен playloo.app). Потім Templates: для кожного шаблону тема з `subjects.json` і тіло з HTML-файлу.
Посилання ведуть на `/auth/confirm?token_hash=…` — відкриваються з будь-якого пристрою (не потрібен той самий браузер).

## Нагадування

Щогодини о :05 UTC воркер дивиться київську годину і вирішує, чий слот настав:

| Год (Київ) | Вид | Кому |
|---|---|---|
| 12:00 | `mission` | серії ще немає, був учора, сьогодні ні — будуємо звичку |
| 18:00 | `comeback` | останній візит рівно 2, 6 або 29 днів тому |
| 19:00 | `streak` | серія ≥ 1 дня, а сьогоднішня ціль не виконана |

Правила: лише підтверджена пошта; не частіше одного нагадування на день (`email_log.day`); кожен лист рівно раз —
рядок `email_log (user_id, kind, ref)` вставляється до відправки, тож два паралельні запуски не дублюють; пропущений
запуск = пропущений слот (краще мовчати, ніж запізнитись). Налаштування `emailReminders` (перемикач у /settings)
вимикає все.

**Відписка.** У кожному листі — посилання на сторінку `/unsubscribe?t=<token>` і заголовки `List-Unsubscribe` (→ `/api/email/unsubscribe?t=<token>`) +
`List-Unsubscribe-Post` (вимога Gmail/Yahoo до масових відправників). Токен — випадковий рядок у `email_tokens`
(серверна таблиця, без грантів для клієнтських ролей), тож Vercel і Render не ділять жодного секрету. GET лише
показує сторінку `/unsubscribe` з кнопкою (сканери посилань не відпишуть людину), POST вимикає `emailReminders`.

### Запуск і перевірка

```bash
pnpm reminders --dry-run --hour 19     # хто що отримав би о 19:00, нічого не надсилає й не пише
pnpm reminders --preview you@mail.com  # зразки всіх нагадувань на одну адресу (без бази)
pnpm reminders                         # справжній запуск (DATABASE_URL, RESEND_API_KEY)
```

### Render

Render → New → Blueprint → репозиторій → `render.yaml` створює cron `loo-reminders` (Frankfurt, starter, ≈ $1/міс).
Render попросить два секрети: `DATABASE_URL` (Supabase pooler, як у Vercel) і `RESEND_API_KEY`. `TZ=UTC` — щоб межі
днів збігалися з застосунком на Vercel (`src/progress/day.ts`). Чому Render, а не Vercel Cron: на безкоштовному
тарифі Vercel крон — лише раз на добу, а нагадуванням потрібен щогодинний.

## Ліміти й надалі

- Resend Free: 3 000 листів/міс, 100/добу. Коли нагадувань більше — Pro ($20 за 50 000).
- Розсилки й новини (`news@`) — через Resend Broadcasts з окремою аудиторією й обовʼязковою відпискою.
- DMARC: після тижня без проблем можна посилити до `p=quarantine`.
