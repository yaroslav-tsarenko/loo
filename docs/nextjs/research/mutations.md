# Research: `mutations` — Мутації й форми (теми 21–25)

> Шляхи — відносно `node_modules/next/dist/docs/01-app/` (Next.js **16.3.8**). URL = `https://nextjs.org/docs/app/` +
> шлях без числових префіксів. `(не звірено з docs 16.3.8)` — не знайдено в бандлі.

## 1. Карта понять за темами

### 21 — Server Functions/Actions під капотом
1. Термінологія (`04-glossary.md`): **Server Function** — async-функція з `'use server'`; **Server Action** — Server Function, викликана через механізм дій React (`<form action>`, `<button formAction>`, transition) або передана як prop.
2. `'use server'` на початку файлу (усі експорти — дії) або inline на початку async-функції в Server Component.
3. Компіляція: у клієнтському бандлі тіло замінюється на **посилання** (action ID + диспетчер), що робить `POST` на **поточний маршрут сторінки** (`02-guides/server-actions.md#security`).
4. Action ID: зашифровані, недетерміновані, кешуються ≤ 14 днів, перегенеровуються при новій збірці; невикористані дії вирізаються (dead code elimination) — немає публічного endpoint.
5. Замикання (inline-дії): захоплені змінні **шифруються** і їздять клієнт ↔ сервер; ключ генерується на кожну збірку; при кількох інстансах — `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (base64, 16/24/32 байти; `openssl rand -base64 32`).
6. **Послідовна диспетчеризація** на клієнті: дії одного клієнта виконуються по черзі — `Promise.all` з клієнта не паралелить.
7. **Одна відповідь = дані + UI**: у тому ж Flight-стрімі повертаються return value і новий RSC payload маршруту, якщо дія викликала `updateTag`, `revalidatePath`, `refresh`, змінила cookies або `redirect`.
8. CSRF: лише POST; `Origin` порівнюється з `Host`/`X-Forwarded-Host`; `serverActions.allowedOrigins` для проксі/CDN; SameSite cookies.
9. Ліміт тіла 1MB (`serverActions.bodySizeLimit`).
10. Version skew: «Failed to find Server Action» після деплою; rolling deploys, стабільний ключ, UI-ретрай.
11. Безпека: кожна дія — публічний POST endpoint → authn/authz/валідація всередині.

### 22 — Форми
1. `<form action={serverAction}>` — дія отримує `FormData`; `Object.fromEntries(formData)` для багатьох полів.
2. Додаткові аргументи — `action.bind(null, id)` (працює в Server і Client, з progressive enhancement); hidden inputs — альтернатива (видно в HTML).
3. **Progressive enhancement**: форма з Server Action у Server Component працює без JS; у Client Component — дії ставляться в чергу до гідратації `(не звірено з docs 16.3.8 — є в react.dev)`.
4. `useActionState(action, initialState)` → `[state, formAction, pending]`; сигнатура дії змінюється на `(prevState, formData)`.
5. `useFormStatus()` з `react-dom` — `pending` (+ `data`, `method`, `action` у React 19) лише всередині дочірнього компонента форми.
6. `next/form` `<Form>`: `action` рядок → GET-навігація з searchParams + prefetch shared UI + client-side navigation; `action` функція → звичайна React-форма (`replace`/`scroll` ігноруються).
7. Програмна відправка: `form.requestSubmit()`; вкладені `formAction` на кнопках.
8. Activity (з CC): стан форм і `useActionState` **зберігається** при поверненні на сторінку — треба явне скидання.
9. Experimental `useOffline`: дія, перервана офлайном, лишається pending і завершується після відновлення мережі.

### 23 — Валідація й помилки
1. Клієнт: HTML-атрибути (`required`, `type="email"`) — UX, не безпека.
2. Сервер: Zod/Valibot `safeParse` → `{ success, error.flatten().fieldErrors }`; повертати стан полів + значення для повторного заповнення.
3. Очікувані помилки — **повертати значення** (`{ ok: false, errors }`), не кидати; неочікувані — throw → error boundary.
4. Перевірка схеми ≠ авторизація: валідна форма може посилатися на чужий рядок (IDOR). Брати з клієнта **ID + зміну**, решту читати з довіреного джерела за сесією.
5. Контроль return value: серіалізується клієнту — повертати DTO, не сирий запис.
6. `redirect()` кидає виняток → поза `try/catch` або `unstable_rethrow`; ревалідацію ставити **до** `redirect`.
7. Rate limiting для дорогих дій.

### 24 — Optimistic UI
1. `useOptimistic(state, updateFn)` → `[optimisticState, addOptimistic]`; викликати всередині Transition/дії.
2. Після завершення дії React повертається до «справжнього» стану з сервера — відкат автоматичний, якщо сервер не прийняв.
3. `useTransition` / `startTransition` для дій з обробників подій і `useEffect`.
4. Послідовна диспетчеризація + optimistic: черга оптимістичних оновлень.
5. Узгодження з кешем: `updateTag` у дії → відповідь уже містить свіже дерево.

### 25 — Файли й фонові задачі
1. Ліміт тіла Server Action 1MB за замовчуванням; Proxy буферизує до 10MB (`experimental.proxyClientMaxBodySize`).
2. Великі файли — пряме завантаження в об'єктне сховище (Vercel Blob client uploads, S3 presigned URL) повз функцію `(не звірено з docs 16.3.8)`.
3. Ліміти платформи на тіло запиту функції (Vercel — 4.5MB) `(не звірено з docs 16.3.8)`.
4. `after(callback)` з `next/server`: виконується **після** відповіді (або prerender); не робить маршрут динамічним; виконується навіть при помилці/`notFound`/`redirect`; можна вкладати; тривалість обмежена `maxDuration` маршруту/платформою.
5. `cookies()/headers()` **всередині** колбека `after`: у Route Handlers і Server Functions — можна; у Server Components (pages, layouts, `generateMetadata`) — runtime-помилка, треба прочитати до `after` і передати через замикання (`04-functions/after.md#with-request-apis`). Тривалість — `maxDuration` маршруту/платформи.
6. Graceful shutdown: сервер дочікується `after()` на `SIGTERM/SIGINT` (`02-guides/self-hosting.md`).
7. Для довгих/надійних задач — черги/workflow, а не `after` (Vercel Queues/Workflow `(не звірено з docs 16.3.8)`).

## 2. Поточні API-факти (16.3.8)

| Факт | Доказ |
|---|---|
| Визначення Server Function / Server Action | `04-glossary.md` |
| POST на маршрут сторінки, action ID, послідовна диспетчеризація, одна відповідь з UI | `02-guides/server-actions.md` |
| Ререндер у відповіді: `updateTag`, `revalidatePath`, `refresh`, cookies, `redirect`; **не** `revalidateTag` зі SWR | `server-actions.md#a-single-response-carries-data-and-ui` |
| CSRF: Origin vs Host/X-Forwarded-Host; `serverActions.allowedOrigins` з wildcard `*.` / `**.` | `05-config/01-next-config-js/serverActions.md` |
| `serverActions.bodySizeLimit` default 1MB | там само |
| Action ID кешуються ≤ 14 днів; DCE невикористаних | `02-guides/data-security.md#built-in-server-actions-security-features` |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (AES 16/24/32 байти, base64) | `data-security.md#overwriting-encryption-keys-advanced` |
| `import 'server-only'` можна і в DAL, і у `'use server'`-файлі | `data-security.md#using-a-data-access-layer-for-mutations` |
| TS-плагін: function-prop у Client Component дозволений, якщо ім'я `action` або `*Action` | `02-guides/server-and-client-boundary.md` |
| `useActionState` → `[state, formAction, pending]` | `02-guides/forms.md` |
| `next/form`: string action → GET + prefetch; function action → React form | `03-api-reference/02-components/form.md` |
| `updateTag`, `refresh` — тільки Server Actions | `04-functions/updateTag.md`, `04-functions/refresh.md` |
| `forbidden()`/`unauthorized()` можна кидати в Server Functions (experimental) | `04-functions/forbidden.md` |
| `after` стабільний з 15.1; Static export — не підтримується | `04-functions/after.md` |
| `useOffline` (experimental) ретраїть Server Actions | `02-guides/forms.md`, `02-guides/offline-support.md` |
| Cookies у Server Functions: `set/delete` ререндерить поточну сторінку | `04-functions/cookies.md#understanding-cookie-behavior-in-server-functions` |

## 3. Було → стало
| До | Зараз |
|---|---|
| 13: `experimental.serverActions` | 14: стабільні, за замовчуванням |
| `useFormState` (react-dom) | `useActionState` (react, React 19) з третім елементом `pending` |
| `router.refresh()` у клієнті після дії | `refresh()` у дії (один roundtrip) |
| `revalidateTag(tag)` у дії | `updateTag(tag)` для RYOW |
| `unstable_after` | `after` (15.1) |
| Розмонтування сторінки скидало форму | з CC + Activity — стан зберігається, скидати явно |

## 4. Пастки і продакшн-проблеми
- **Незахищена дія**: перевірка на рівні сторінки («форма показується лише адмінам») не захищає дію — її можна викликати прямим POST.
- **IDOR**: дія приймає весь об'єкт/`ownerId` з клієнта.
- **Повернення сирого запису БД** (хеш пароля, внутрішні поля).
- **Секрети в замиканні** inline-дії — шифруються, але docs прямо не радять покладатися.
- **Self-hosting на кількох інстансах без `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`** — помилки дешифрування замикань.
- **Деплой посеред сесії** — «Failed to find Server Action»; потрібен UI-ретрай і skew protection (`deploymentId`).
- **`Promise.all` дій з клієнта** — виконуються послідовно; повільний UI.
- **Server Action для читання даних** (замість Server Component/Route Handler) — POST, без кешування, послідовність.
- **`redirect()` у `try/catch`** — ковтається.
- **Ревалідація після `redirect`** — не виконається.
- **Body > 1MB** — дія падає; великі файли — пряме завантаження в сховище.
- **Matcher Proxy** не покриває маршрут, з якого викликається дія → обхід auth-перевірок Proxy.
- **Побічні ефекти під час рендеру** (мутації в Server Component) — `data-security.md#avoiding-side-effects-during-rendering`.
- **CSRF за reverse proxy**: неправильний `X-Forwarded-Host` → легітимні дії відхиляються; рішення — `allowedOrigins`, не вимикати перевірку.
- **Activity**: після успішної відправки повертаєшся — старе повідомлення «Збережено».

## 5. Interview angles
1. **Як виклик функції стає HTTP-запитом?** Компілятор, action ID, POST на маршрут, Flight-відповідь з return value і RSC payload.
2. **Які захисти дає фреймворк і чого недостатньо?** CSRF Origin/Host, ліміт тіла, шифровані ID, DCE, шифрування замикань — але authn/authz/валідація/обмеження return — на тобі.
3. **Чому дії послідовні і що з цього випливає?** Узгодженість дерева; паралелити всередині однієї дії.
4. **`useActionState` vs `useFormStatus` vs `useOptimistic`.** Стан результату, pending для кнопки, миттєвий UI з відкатом.
5. **Progressive enhancement.** Що працює без JS; `bind` vs hidden inputs; `next/form` для GET-пошуку.
6. **Очікувані vs неочікувані помилки у формі.** Повертати vs кидати; `error.js`/`catchError`.
7. **Де ставити `revalidate*`/`updateTag` відносно `redirect` і чому?**
8. **Як завантажити 500MB відео?** Presigned/client upload напряму в сховище, дія лише фіксує метадані; ліміти функцій.
9. **`after()` — для чого й чого не робити?** Логи, аналітика, інвалідація; не для критичних задач (немає гарантій ретраїв) — черги.
10. **Server Action vs Route Handler** для мутації від мобільного клієнта — Route Handler (публічний контракт, власна CSRF/auth).

## 6. Що може перевірити раннер
1. **Валідатор форми**: міні-схема (без Zod) `validate(formDataObject)` → `{ ok, fieldErrors, values }`; тести на кожне поле.
2. **Reducer для `useActionState`**: чиста функція `(prevState, payload) → newState` з RESET-дією.
3. **Безпечна дія (знайди баг)**: `updateItem({ session, input, db })` — тест падає, бо дія довіряє `input.ownerId`; виправлення — брати власника з сесії.
4. **DTO-фільтр**: `toUserDTO(row)` — не має пропускати `passwordHash`, `internalNotes`.
5. **Optimistic-черга**: модель `useOptimistic` — застосувати оптимістичні оновлення, потім підтвердити/відкотити за результатом сервера.
6. **Послідовна диспетчеризація**: реалізувати чергу дій (кожна чекає попередню) з fake timers; тест на порядок і загальний час.
7. **CSRF-перевірка**: `isAllowedOrigin(origin, host, allowedOrigins)` з wildcard `*.` і `**.` (точно за таблицею з `serverActions.md`).
8. **`bodySizeLimit` парсер**: `'1mb'`, `'500kb'`, число → байти.
9. **Rate limiter**: fixed window / token bucket з fake timers.
10. **`after`-модель**: колбеки виконуються після «відповіді», навіть при throw; вкладені `after`.

## 7. Джерела
- https://nextjs.org/docs/app/getting-started/mutating-data
- https://nextjs.org/docs/app/guides/server-actions · …/forms · …/data-security · …/offline-support
- https://nextjs.org/docs/app/api-reference/directives/use-server
- https://nextjs.org/docs/app/api-reference/components/form
- https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions
- https://nextjs.org/docs/app/api-reference/functions/after · …/updateTag · …/refresh · …/redirect · …/cookies
- https://react.dev/reference/rsc/server-functions · https://react.dev/reference/rsc/use-server
- https://react.dev/reference/react/useActionState · https://react.dev/reference/react-dom/hooks/useFormStatus · https://react.dev/reference/react/useOptimistic · https://react.dev/reference/react/useTransition
- https://zod.dev · https://valibot.dev
- https://nextjs.org/blog/security-nextjs-server-components-actions
- https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html · https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
- https://vercel.com/docs/vercel-blob/client-upload · https://vercel.com/docs/functions/limitations `(не звірено з docs 16.3.8)`

## 8. Виправлення до SYLLABUS
1. **Тема 21:** «замикання й шифрування» — додати точні факти: ключ на збірку, `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`, action ID ≤ 14 днів, DCE, **послідовна диспетчеризація** і «одна відповідь = дані + UI» — це центральні знання для senior, у SYLLABUS їх немає.
2. **Тема 22:** додати вплив Activity (з CC) на стан форм — нова поведінка 16.
3. **Тема 23:** додати «схема ≠ авторизація» (IDOR) і обмеження return values — docs роблять на цьому акцент.
4. **Тема 25:** ліміти: 1MB (дія), 10MB (буфер Proxy); пряме завантаження — Vercel-специфіка, позначати як платформну.
5. **§1 `mutations`:** додати `refresh()`/`updateTag` як інструменти оновлення UI після дії (зараз лише в `data`) — крос-посилання з темою 16; experimental `useOffline` — як «огляд».
