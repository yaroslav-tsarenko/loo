# SPEECH — озвучка (TTS) і перевірка вимови (STT) для мовних курсів

> **Рішення власника (2026-10-16): v1 — безкоштовно.** Озвучка — `speechSynthesis` браузера (en-GB / en-US голоси
> пристрою, перемикач акценту), перевірка вимови — Web Speech `SpeechRecognition` у браузері (Chrome/Edge/Safari;
> де немає — режим «послухай і порівняй» із самооцінкою). Код іде через шар `SpeechProvider` (`browser` зараз,
> `gateway` пізніше), тож AI-голоси + кеш у **Supabase Storage** (не Vercel Blob) підключаться без переробок, коли
> зʼявиться бюджет на кредити AI Gateway. Ключі інших проєктів не використовуємо.


## Реалізація v1 (browser, безкоштовно) — що зроблено

**Шар `SpeechProvider`** (`src/ui/lang/speech/provider.ts`): `speak(lines, {lang, slow})`, `cancel()`, `hasVoice(lang)`,
`recognize({lang, onPartial, onLevel, maxMs, signal})`. Зараз одна реалізація — `browser`
(`src/ui/lang/speech/browser.ts`); `speechProvider()` — єдина точка, де пізніше зʼявиться `gateway` (AI Gateway TTS/STT +
кеш у Supabase Storage, §2–5 нижче — як research для v2). Компоненти про провайдера не знають.

- **Мова голосу** — `target` курсу (`course.yaml target: en`, у bundle `course.target`; для статей — курс, що навчає
  посібник, `src/server/courses/target.ts`; блок може перевизначити `lang:`), для англійської — акцент учня
  (`user_settings.accent`: `en-GB` за замовчуванням / `en-US`; перемикач UK | US біля кнопки ▶ і в налаштуваннях).
  `voiceLang()` / `pickVoice()` (`src/ui/lang/speech/voices.ts`, чисті, з тестами): точний регіон → та сама мова;
  бонус «natural / neural / premium / enhanced / Google / Siri», штраф для compact / eSpeak і «іграшкових» голосів macOS.
  Діалоги (`audio: A: … / B: …`) — другий мовець отримує інший голос тієї ж мови.
- **Швидкість**: звичайно 0.92, повільно 0.68 (кнопка-черепаха; `speed: slow` у блоці — повільно за замовчуванням).
- **Деградація TTS**: немає `speechSynthesis` → «Цей браузер не вміє озвучувати текст» (+ сам текст, якщо він публічний —
  слово, приклад); немає голосу потрібної мови → «На пристрої немає голосу en-GB…» з порадою (Chrome / Edge / Safari чи
  голос у налаштуваннях системи). Голоси Chrome вантажаться асинхронно — `voiceschanged` перемальовує кнопку.
- **Розпізнавання** — `SpeechRecognition` / `webkitSpeechRecognition` (lang = голос, `maxAlternatives: 3`, проміжний
  текст показується наживо); паралельно `getUserMedia` + `AnalyserNode` малюють рівень мікрофона й одразу звільняють
  його. Помилки — людською мовою: доступ заборонено (як дозволити), немає мікрофона, тиша, немає мережі.
  Немає API (Firefox), відмовили в доступі чи «Не можу зараз говорити» → **«послухай і повтори»** із самооцінкою
  («Вийшло схоже» / «Ще потренуюсь») — без XP.
- **Сервер** не отримує аудіо взагалі: лише до 5 варіантів транскрипту (≤ 500 символів кожен, zod), `answerQuiz →
  speakOutcome` порівнює їх пословно з `text` вправи (`judgeSpeech`, поріг 80 %), повертає по словах ok / пропуск /
  «почуто X» і підказки (IPA слова з `ipa`, `tip`, типові звуки). XP — лише за вердиктом сервера; rate limit
  `speak` 20/хв і `speakDay` 400/добу (+ загальний `answer` 120/хв). Промах нічого не коштує (ні ❤️, ні «Мої помилки»).
- **Тексти аудіювання** (`[!listen]`, `[!pair]`) у сторінку не потрапляють: `speechLines({unitId})` віддає їх лише після
  ▶ (rate limit `audio` 240/хв). Для браузерного TTS це неминуче (текст потрібен синтезатору) — v2 віддаватиме аудіо.
- **Permissions-Policy**: `microphone=(self)` (було `microphone=()`), `next.config.ts`.
- Нових пакетів, ключів і платних викликів немає.

---

Статус research нижче: 2026-10-16. Коду ще немає. Усе позначене **[перевірено]** я запускав наживо через AI Gateway з OIDC проєкту (`ai@6.0.307`, `@ai-sdk/gateway@3.0.215`). Сукупна вартість цих тестів: менше за $0.01. Решта взята з офіційних доків (посилання в §9).

---

## 0. TL;DR

**v1 (зараз, рішення власника — безкоштовно):**

| Що | Рішення v1 |
|---|---|
| TTS | Браузерний `speechSynthesis` (голоси en-GB / en-US пристрою, перемикач акценту в налаштуваннях, повільний режим). Без сервера й без ключів. |
| STT / вимова | Web Speech `SpeechRecognition` у браузері (Chrome / Edge / Safari); на сервер іде лише текст (zod, ліміти). Оцінка — **word-level diff** + IPA-підказки з контенту, лише на сервері. Firefox / без мікрофона — «послухай і повтори» із самооцінкою, без XP. |
| Сховище аудіо | Не потрібне (нічого не генеруємо й не зберігаємо; аудіо учня не завантажується). |
| Нові пакети / env | Немає. |

**v2 (коли буде бюджет; код уже має шар `SpeechProvider` → провайдер `gateway`):**

| Що | Рішення v2 |
|---|---|
| TTS | **AI Gateway** → `microsoft/mai-voice-2.1-flash` (`en-GB-*`, `en-US-*`, `de-DE-*`, `fr-FR-*`), запасний `openai/tts-1`. |
| STT | **AI Gateway** → `openai/gpt-4o-mini-transcribe`; таймінги слів — `openai/whisper-1`. |
| Сховище аудіо | **Supabase Storage** (публічний бакет), незмінні шляхи з content-hash, індекс і lock у Postgres (`speech_clips`). Vercel Blob — лише на плані Pro. |
| Генерація | Pre-generation скриптом (`speech:build`), on-demand як fallback, браузер — останній fallback. |
| Оцінка вимови | word-level diff; далі — Azure Pronunciation Assessment (фонеми). |
| Env | Опційно `SPEECH_TTS_MODEL`, `SPEECH_STT_MODEL`; для Azure — `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`. |

---|---|
| TTS | **AI Gateway** → `microsoft/mai-voice-2.1-flash` (голоси з локаллю: `en-GB-*`, `en-US-*`, `de-DE-*`, `fr-FR-*`). Запасний варіант: `openai/tts-1`. Новий AI-пакет не потрібен. |
| STT | **AI Gateway** → `openai/gpt-4o-mini-transcribe` (дешевий і точний). Якщо потрібні таймінги слів, `openai/whisper-1`. |
| Сховище аудіо | **Vercel Blob, public store**, незмінні шляхи з content-hash; індекс і lock у Postgres (`speech_clips`) |
| Генерація | Переважно **pre-generation** окремим скриптом (`speech:build`). On-demand на першому запиті з row-lock лишається як fallback. Браузерний `speechSynthesis` вмикаємо тільки як останній fallback. |
| Оцінка вимови | v1: transcript → **word-level diff** + **IPA-підказки** з контенту чи словника. v2: **Azure Pronunciation Assessment** (фонеми, IPA), прямий ключ Azure. |
| Нові пакети | лише `@vercel/blob` (2.8.2). `ai` вже є, а `@ai-sdk/gateway` вже приходить транзитивно. |
| Нові env | `BLOB_STORE_ID` (додається автоматично при connect store, OIDC). Опційно `SPEECH_TTS_MODEL`, `SPEECH_STT_MODEL`. Для v2: `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`. |

---

## 1. Чи вміє AI Gateway TTS/STT? Так

Gateway офіційно підтримує модальності **Text to Speech** і **Speech to Text** (обидві у **beta**: доступ відкривають поступово). Для нашої команди обидві вже працюють **[перевірено]**.

### 1.1 Моделі (живий список `https://ai-gateway.vercel.sh/v1/models`, станом на 2026-10-16)

**Speech (TTS)**, ціна за символ вхідного тексту:

| Model ID | $/1M символів | Нотатки |
|---|---|---|
| `openai/tts-1` | 15 | голоси `alloy, ash, coral, echo, fable, nova, onyx, sage, shimmer`; акцент явно не задається. `instructions` не підтримує, `speed` підтримує |
| `openai/tts-1-hd` | 30 | те саме, вища якість |
| `microsoft/mai-voice-2.1-flash` / `-2-flash` | 15 | **голоси з локаллю** (`en-US-Ethan`, `en-GB-Emily`…), `providerOptions.azure.style` |
| `microsoft/mai-voice-2.1` / `-2` | 22 | вища якість (long-form) |
| `google/gemini-3.8-flash(-lite)-tts` | токени (audio out $6–9/1M) | `instructions` (можна попросити "British RP accent"), **multi-speaker dialogue** в одному запиті. **Потрібні платні кредити** (на free tier зараз помилка) **[перевірено]** |
| `fish-audio/*`, `spacexai/grok-tts` | 10–15 | не оцінював |

**Чого на Gateway немає:** `gpt-4o-mini-tts`, ElevenLabs, Deepgram. Вони доступні лише напряму через `@ai-sdk/openai`, `@ai-sdk/elevenlabs` чи `@ai-sdk/deepgram` з власним API-ключем. ElevenLabs є у Vercel Marketplace як connectable account: інтеграція лише додає `ELEVENLABS_API_KEY`, білінг лишається в ElevenLabs.

**Transcription (STT)**:

| Model ID | Ціна | Webm/mp4 з браузера | Таймінги слів |
|---|---|---|---|
| `openai/gpt-4o-mini-transcribe` | audio-токени, **≈$0.00006–0.00008 за 2–3 с** [перевірено] | так [перевірено] | ні (`segments: []`) |
| `openai/gpt-4o-transcribe` | ≈2× від mini | так | ні |
| `openai/whisper-1` | $0.0001/с ($0.006/хв) | так [перевірено] | **так**, `timestampGranularities: ['word']` → `segments[]` по словах [перевірено] |
| `microsoft/mai-transcribe-2` | $0.1/год | **ні** (тільки WAV/MP3/FLAC/Ogg-Opus) | так, через `providerMetadata.azure.phrases` |
| `google/gemini-3.5-transcribe`, `fish-audio/transcribe-1`, `spacexai/grok-stt` | різні | не перевіряв | — |

**Confidence чи logprobs через Gateway не приходять.** Я пробував `include: ['logprobs']`: у відповіді лише `text`, `segments`, `language`, `durationInSeconds` **[перевірено]**.

### 1.2 API в AI SDK (версія проєкту `ai@6.0.307`)

- `experimental_generateSpeech` і `experimental_transcribe` експортуються з `ai` (у v6 з префіксом `experimental_`; в `ai@7` вони вже стабільні, `generateSpeech` і `transcribe`).
- **Рядковий model ID працює**: глобальний провайдер = Gateway, `resolveSpeechModel` чи `resolveTranscriptionModel` у `node_modules/ai/dist`. Явний `gateway.speechModel(...)` не обов'язковий.
- Auth такий самий, як у `src/ai/reels/generate.ts`: на Vercel OIDC, локально `VERCEL_OIDC_TOKEN` або `AI_GATEWAY_API_KEY`. Локальний OIDC-токен живе ~12 год. Якщо бачите `GatewayAuthenticationError: No authentication provided`, виконайте `vercel env pull`.
- `experimental_streamTranscribe` (streaming STT через WebSocket, browser token) є тільки в `ai@7`. Для v1 він не потрібен.

```ts
import { experimental_generateSpeech as generateSpeech, experimental_transcribe as transcribe } from 'ai'

const { audio } = await generateSpeech({ model: 'microsoft/mai-voice-2.1-flash', text, voice: 'en-GB-Emily' }) // audio.uint8Array, audio.mediaType = 'audio/mpeg'
const r = await transcribe({ model: 'openai/gpt-4o-mini-transcribe', audio: bytes, providerOptions: { openai: { language: 'en' } } })
```

### 1.3 Голоси British/American, male/female

MAI-Voice кодує акцент у назві голосу, і це найкращий збіг із вимогою. Gateway **прийняв** такі голоси і повернув різне аудіо **[перевірено]**: `en-GB-Emily`, `en-GB-Harry`, `en-US-Olivia`, `en-US-Ethan`. `en-GB-SoniaNeural` (класичний Azure neural) він відхиляє.
⚠️ Офіційного переліку en-GB голосів MAI у доках немає, а стать і акцент я не перевіряв на слух. **Семпли лежать у `/tmp/speechprobe/mai-*.mp3`: власнику варто їх прослухати.**

Пропонована мапа (alias → voice), щоб у контенті не світились імена провайдера:

| alias | v1 (MAI) | fallback (`openai/tts-1`) |
|---|---|---|
| `en-GB-f` | `en-GB-Emily` | `fable` (звучить «британськи», це суб'єктивно) |
| `en-GB-m` | `en-GB-Harry` | `fable` |
| `en-US-f` | `en-US-Olivia` (або дефолтний `en-US-Harper`) | `nova` |
| `en-US-m` | `en-US-Ethan` | `onyx` |
| `de-DE-*`, `fr-FR-*` | дефолти `de-DE-Mia`, `fr-FR-Soleil` + інші за каталогом | — |

Якщо якість чи акцент MAI не влаштують, є два варіанти: (a) Gemini TTS з `instructions` після поповнення кредитів, (b) ElevenLabs напряму (`@ai-sdk/elevenlabs`, Marketplace, `ELEVENLABS_API_KEY`). Кеш (§2) від провайдера не залежить, тож міняється лише генератор.

**Діалоги:** генеруйте кожну репліку окремо голосом свого персонажа і програвайте послідовно. Так кожна репліка кешується окремо, виходить дешевше, і будь-яка репліка доступна для «повторити». Gemini multi-speaker знадобиться лише для природних переходів, і він платний.

---

## 2. Сховище: Vercel Blob

### 2.1 Public чи private

| | Public store | Private store |
|---|---|---|
| Читання | будь-хто з URL, напряму з CDN | лише через наш Function (`get()` + stream) |
| Вартість доставки | Blob Data Transfer (~$0.05/GB iad1, у ~3× дешевше за FDT) | BDT **плюс** Fast Data Transfer відповіді функції, ще й CPU функції |
| Для чого | **згенероване аудіо курсу** (публічний, незмінний контент) | записи учнів, якщо колись зберігатимемо (у v1 не зберігаємо) |

Режим доступу задається на рівні **store** і не змінюється. Тому якщо колись знадобляться обидва режими, заводимо два stores.

### 2.2 Ціни й ліміти (з доків Blob)

- Storage $0.023/GB-міс; Simple ops $0.40/1M (тільки cache MISS і `head`); **Advanced ops (upload) $5/1M**; Data transfer ~$0.05/GB.
- CDN кешує blob **до 1 місяця за замовчуванням** (`cacheControlMaxAge` при `put`). Cache HIT не тарифікується як operation.
- ⚠️ **Hobby:** включено 1 GB storage, 10 GB transfer, **2 000 advanced ops/міс**. Якщо ліміт перевищено, **Blob блокується на 30 днів**. Pre-gen 10–20 тис. кліпів = 10–20 тис. uploads, тож **на Hobby так робити не можна**: потрібен Pro, або Supabase Storage (public bucket) як альтернатива з тією ж схемою ключів.
- Rate limit advanced ops: Hobby 15/с, Pro 75/с. Pre-gen скрипт має мати concurrency ≤ 8.
- Розмір кліпу MAI mp3 (24 kHz) ≈ **20 KB/с** [перевірено]: слово ≈ 20 KB, речення ≈ 60–80 KB. Тобто 1 000 слів ≈ 20 MB, 1 000 речень ≈ 70 MB. Сховище коштує копійки.
- Auth: при «Connect to Project» Vercel додає `BLOB_STORE_ID` і працює через OIDC. Локально це працює після `vercel env pull`. `BLOB_READ_WRITE_TOKEN` потрібен лише поза Vercel чи CI.

### 2.3 Схема ключів (generate once)

```
key  = sha256(JSON.stringify({ v: 1, model, voice, format: 'mp3', speed ?? 1, style ?? null, text: normalize(text) }))
path = speech/v1/{lang}/{voiceAlias}/{key[0..2]}/{key}.mp3
normalize = NFC, trim, collapse whitespace   (регістр і пунктуацію НЕ чіпаємо: вони впливають на інтонацію)
```

- Шлях незмінний: `addRandomSuffix: false`, `allowOverwrite: false`, `contentType: 'audio/mpeg'`. Blob сам відхилить повторний `put` того самого шляху, і цю помилку трактуємо як «вже є».
- `v` у хеші це версія, яку піднімаємо, щоб масово перегенерувати все (наприклад, після зміни моделі). Старі файли видаляються скриптом (delete безкоштовний).
- Індекс у Postgres (drizzle), щоб не платити за `head()` і мати lock:

```
speech_clips(key text pk, lang, voice_alias, model, voice, text, url, bytes int, duration_ms int,
             status 'pending'|'ready'|'failed', locked_at timestamptz, created_at)
```

### 2.4 Pre-generation чи on-demand

| | Pre-generation (рекомендовано для контенту курсу) | On-demand + lock |
|---|---|---|
| Як | `pnpm speech:build`: обходить course YAML (words, examples, dialogues), рахує key, генерує те, чого ще немає в `speech_clips` | `GET /api/speech/tts`: якщо немає, генеруємо на першому запиті |
| Плюси | нуль затримки для учня, передбачувана вартість, ревʼю якості до релізу | покриває текст, якого немає в контенті (нові приклади, user courses) |
| Мінуси | потрібен окремий крок і кредити | перший запит чекає ~1.2–2 с [перевірено]; ризик cost abuse |

**Не вбудовуйте генерацію у `vercel-build`.** Білд не повинен залежати від платного API і його rate limits. Окремий скрипт ідемпотентний, і його можна запускати вручну або в CI після `course:build`.

**Lock для on-demand** (row-based, без утримання зʼєднання):
1. `INSERT … (key, status='pending', locked_at=now()) ON CONFLICT (key) DO UPDATE SET locked_at=now() WHERE speech_clips.status <> 'ready' AND speech_clips.locked_at < now() - interval '60 seconds' RETURNING key`. Якщо повернувся рядок, ми переможець.
2. Переможець генерує, робить `put` і ставить `status='ready', url=…`.
3. Решта отримує `202` (клієнт грає `speechSynthesis` і пробує ще раз через 2 с) або коротко поллить рядок до 3 с.

---

## 3. Розпізнавання мовлення: браузер чи сервер

> v1 (рішення власника): розпізнавання — у браузері, див. «Реалізація v1» вгорі. Нижче — аргументи за серверне STT для v2.

**Тільки сервер.** Web Speech API `SpeechRecognition` нестабільний між браузерами (Firefox його не має, Chrome шле аудіо в Google), не дає контролю моделі, таймінгів чи логів. Тому в браузері лише **запис**, а розпізнавання робить наш route handler через Gateway.

### 3.1 Запис у браузері (MediaRecorder)

- Chrome, Edge, Firefox: `audio/webm;codecs=opus`. Safari (macOS/iOS): `audio/mp4` (AAC); нові Safari вміють і webm/opus. Обираємо через `MediaRecorder.isTypeSupported([...])`, мімтайп передаємо разом із файлом.
- OpenAI transcription (і через Gateway) **приймає обидва формати** [перевірено: webm/opus і mp4/aac → ідеальний транскрипт]. MAI-Transcribe webm і mp4 **не** приймає.
- Розміри: opus ~16–32 kbps, тож 15 с ≈ 30–60 KB. Обмежуємо запис **≤ 15 с** на клієнті й **≤ 1 MB** на сервері. Ліміт body у Vercel Function становить **4.5 MB**, а сам Gateway шле аудіо як base64 у JSON (+33%).
- Latency [перевірено, кліп 2 с]: STT 0.7–1.9 с плюс upload. UX ціль: < 2.5 с від «стоп» до результату.

### 3.2 Що можна отримати з транскрипції

- `whisper-1`: таймінги **кожного слова** (`segments[]` = `{text, startSecond, endSecond}`). Знадобляться, щоб підсвітити слово і відтворити саме його з запису учня.
- `gpt-4o-*-transcribe`: тільки `text`, зате точніше й дешевше.
- **Confidence немає** (див. §1.1).
- ⚠️ Важливий нюанс: ці моделі навчені видавати *правильний* текст і «виправляють» акцент. Тому text diff ловить **грубі** помилки (інше слово, мінімальні пари `ship`/`sheep`, пропущене чи вставлене слово), а **не** тонкі фонемні. Отже **не передавайте target text у `prompt`**: це підштовхне модель «почути» правильне.

### 3.3 Фонемна оцінка

| Варіант | Що дає | Ціна / інтеграція |
|---|---|---|
| **Text diff + IPA hints (v1)** | match / substitution / omission / insertion по словах. Для замін показуємо IPA target і IPA почутого слова, звідти підказка на кшталт `/ɪ/ vs /iː/` чи «дифтонг /əʊ/ (UK) vs /oʊ/ (US)» | майже безкоштовно. IPA береться з контенту (поле `ipa_uk`, `ipa_us` у словниковій статті) або зі словника (CMUdict для US, ARPAbet→IPA; для UK зберігати IPA в контенті) |
| **Azure Pronunciation Assessment (v2)** | scripted-режим з `ReferenceText`: Accuracy, Fluency, Completeness, PronScore; **Granularity=Phoneme**; **IPA**-алфавіт з `NBestPhonemes` (що саме прозвучало замість очікуваної фонеми); miscue (Omission, Insertion); Prosody **тільки en-US** | «costs the same as speech to text» (Azure Standard STT, ~$1 за аудіо-годину, ціну звірити на сторінці Azure). **Не через Gateway і не через AI SDK**: Azure Speech SDK або REST з `AZURE_SPEECH_KEY` і `AZURE_SPEECH_REGION`. Аудіо ≤ 30 с для miscue. Формат: WAV PCM 16 kHz або Ogg/Opus, тобто webm/mp4 треба або перекодувати, або писати в браузері PCM через AudioWorklet і кодувати WAV |
| Speechace та аналоги | схожий phoneme scoring | окремий vendor і ключ; розглядати лише якщо Azure не підійде |

**Рекомендація:** v1 робимо як text diff + IPA. Перед v2 треба зібрати golden set із ~50 записів (свідомі помилки: `ship`/`sheep`, `th`→`s`/`f`, `w`/`v`, дифтонги) і порівняти на ньому `gpt-4o-mini-transcribe`, `whisper-1` та Azure PA. Azure додаємо, лише якщо diff пропускає важливі помилки.

---

## 4. Приватність і безпека

- **Ключі тільки на сервері.** Gateway auth (OIDC чи `AI_GATEWAY_API_KEY`) і Blob (OIDC чи `BLOB_READ_WRITE_TOKEN`) ніколи не потрапляють у `NEXT_PUBLIC_*`, а модулі з викликами мають `import 'server-only'` (як у `src/server/*`).
- **Auth:** обидва endpoint викликають `requireUser()` (`src/server/auth/index.ts`).
- **Rate limits** через наявні `hitAll(dbRateLimitStore, …)` (`src/lib/rate-limit.ts`, `src/server/rate-limit-store.ts`):
  - `speech-check:<userId>`: 20/хв і 400/добу;
  - `speech-tts-gen:<userId>`: 30/год (рахуємо **тільки генерацію**, cache hit безкоштовний) плюс глобальний `speech-tts-gen:global` 2 000/добу як запобіжник вартості.
- **Cost abuse TTS:** не дозволяйте озвучувати довільний текст. Довжина ≤ 300 символів, voice тільки з allowlist aliasів. Найкраще приймати `itemId`, а текст брати з БД чи контенту. Якщо вже приймаєте `text`, генеруйте лише тоді, коли його хеш є в корпусі курсу. Для всього іншого відповідаємо 404, і клієнт грає `speechSynthesis`.
- **Gateway budget:** у дашборді AI Gateway поставте бюджет на проєкт. Це soft cap.
- **Записи учнів (голос це персональні дані):** у v1 **не зберігаємо**. Буфер живе в памʼяті запиту, у БД пишемо тільки `{itemId, score, diff}`, без транскрипту. AI Gateway за замовчуванням ZDR: «permanently deletes your prompts and responses after requests complete». Для жорсткішої гарантії на рівні провайдера є `providerOptions: { gateway: { zeroDataRetention: true } }` (маршрутизує лише до провайдерів із ZDR-угодою; підтримку для `openai/*` STT перевірити перед вмиканням). Якщо колись зберігатимемо записи, то лише в private store з TTL-чисткою (cron) і згодою користувача.
- Сторінці з мікрофоном потрібен `Permissions-Policy: microphone=(self)`. Перевірте, що `src/proxy.ts` чи headers не забороняють його повністю.

---

## 5. Ескіз endpoints (v1)

```
GET /api/speech/tts?text=<…>&voice=en-GB-f      (або ?item=<itemId>&voice=…)
  1. requireUser()
  2. voice ∈ ALIASES; text = normalize(text), 1..300 chars
  3. key = hash(...); row = speech_clips[key]
       ready      → 302 Location: row.url   (Cache-Control: public, max-age=86400; blob URL сам кешується CDN)
       not found  → якщо текст не в корпусі і не admin → 404 (клієнт: speechSynthesis)
                  → hitAll(rate limits) → 429
                  → acquire row-lock (§2.4) → generateSpeech({ model: SPEECH_TTS_MODEL, text, voice })
                  → put(path, audio.uint8Array, { access: 'public', contentType: 'audio/mpeg', addRandomSuffix: false })
                  → update row ready → 302
       pending    → 202 { retryAfter: 2 }
  export const maxDuration = 30

POST /api/speech/check        multipart/form-data: audio (Blob), itemId | target, lang
  1. requireUser(); hitAll(rate limits) → 429
  2. audio.size ≤ 1 MB; type ∈ {audio/webm, audio/mp4, audio/ogg, audio/wav, audio/mpeg}
  3. target = із контенту за itemId (довіряємо серверу, а не клієнту)
  4. r = await transcribe({ model: SPEECH_STT_MODEL, audio: new Uint8Array(await audio.arrayBuffer()),
                            providerOptions: { openai: { language: 'en' } }, abortSignal: AbortSignal.timeout(15_000) })
  5. diff = alignWords(normalizeForCompare(target), normalizeForCompare(r.text))
       normalizeForCompare: lowercase, strip punctuation, contractions (I'm→i am), numbers→words, UK/US spelling map (colour/color)
       alignWords: Levenshtein по словах → [{ target, heard, op: 'ok'|'sub'|'del'|'ins' }]
  6. hints = для op='sub': ipa(target) vs ipa(heard) → різниця фонем → текстова підказка
  7. → { transcript: r.text, words: diff, score: ok/targetWords, hints }   (аудіо ніде не зберігається)
  export const maxDuration = 30
```

Клієнт: `<audio src="/api/speech/tts?...">` працює напряму завдяки 302. Якщо прийшли 404, 202 чи помилка, спрацьовує `speechSynthesis` з `voice.lang` = `en-GB` / `en-US`.

Залежності: `pnpm add @vercel/blob`. Store створюється в дашборді (Storage → Blob → **public**, регіон як у функцій, `iad1` за замовчуванням) → Connect to Project → `vercel env pull`.

Env:

```
# вже є: VERCEL_OIDC_TOKEN (локально, з vercel env pull) або AI_GATEWAY_API_KEY
BLOB_STORE_ID=...                       # додається автоматично при connect store
SPEECH_TTS_MODEL=microsoft/mai-voice-2.1-flash
SPEECH_STT_MODEL=openai/gpt-4o-mini-transcribe
# v2: AZURE_SPEECH_KEY=..., AZURE_SPEECH_REGION=westeurope
# опційно: ELEVENLABS_API_KEY (Marketplace), якщо MAI-голоси не влаштують
```

---

## 6. Вартість (оцінка)

Припущення: «слово»-кліп ≈ 8 символів, речення ≈ 50 символів, спроба вимови ≈ 4 с аудіо.

| Що | На 1 000 | Розрахунок |
|---|---|---|
| TTS слів, 1 голос, MAI-flash чи tts-1 | **≈ $0.12** | 8k chars × $15/1M |
| TTS речень, 1 голос | **≈ $0.75** | 50k × $15/1M (MAI 2.1 non-flash ≈ $1.10) |
| ×4 голоси (UK/US × m/f) | ×4 | розумніше так: слова в 2 акцентах, речення в 1 голосі, діалоги розкидати по голосах |
| STT `gpt-4o-mini-transcribe` | **≈ $0.10–0.15** | факт: $0.00006–0.00008 за 2–3 с |
| STT `whisper-1` | **≈ $0.40** | $0.0001/с × 4 с |
| Azure PA (v2) | ≈ $1.1 | ~$1/год × 4 с (звірити ціну Azure) |
| Blob storage | ≈ $0.002/міс (слова), ≈ $0.002/міс (речення) | 20 MB / 70 MB × $0.023/GB |
| Blob transfer | ≈ $0.001 / $0.0035 за 1 000 прослуховувань | 20 / 70 MB × $0.05/GB |

Повний A1→C2 корпус (умовно 8 000 слів × 2 голоси + 15 000 речень × 1 голос ≈ 0.9 M символів) обійдеться в **≈ $15** разової генерації та ~1.3 GB у Blob. Перегенерація з новою моделлю коштує стільки ж. Дорожче за саму генерацію Blob uploads на Hobby (див. §2.2).

---

## 7. Відкриті питання і ризики

1. **Акцент і стать** голосів `en-GB-Emily` і `en-GB-Harry` перевірити на слух (`/tmp/speechprobe/`). Офіційного списку en-GB голосів MAI в доках немає.
2. **План Vercel:** на Hobby pre-gen упреться в 2 000 uploads/міс, і Blob заблокується на 30 днів. Потрібен Pro, або сховище Supabase Storage.
3. **AI Gateway кредити:** команда зараз на free tier (Gemini TTS відмовив). Pre-gen і prod-трафік потребують top-up або auto-recharge, а також budget.
4. Speech і transcription на Gateway зараз у **beta**. Тримати `SPEECH_*_MODEL` в env, щоб перемкнутися на іншу модель або на прямий провайдер без змін коду.
5. Апгрейд на `ai@7` прибере префікс `experimental_` і дасть `streamTranscribe`, але для v1 він не обовʼязковий.

---

## 8. План робіт

1. Створити Blob store (public) і connect, `pnpm add @vercel/blob`, міграція `speech_clips`.
2. `src/server/speech/` (`server-only`): `voices.ts` (aliases), `key.ts`, `tts.ts` (generate → put → row), `check.ts` (transcribe → diff → hints).
3. `scripts/speech-build.ts` + `"speech:build"` (concurrency 4–8, dry-run з підрахунком символів і вартості).
4. Route handlers `src/app/api/speech/tts/route.ts` і `src/app/api/speech/check/route.ts`, rate limits.
5. UI: кнопка ▶ з fallback на `speechSynthesis`; рекордер з `isTypeSupported` і лімітом 15 с; рендер diff та IPA-підказок.
6. Golden set записів і порівняння STT-моделей, потім рішення про Azure PA (v2).

---

## 9. Джерела

- AI Gateway, modalities: https://vercel.com/docs/ai-gateway/modalities
- AI Gateway Text to Speech: https://vercel.com/docs/ai-gateway/modalities/text-to-speech
- AI Gateway Speech to Text: https://vercel.com/docs/ai-gateway/modalities/speech-to-text
- AI Gateway security / ZDR: https://vercel.com/docs/ai-gateway/security-and-compliance
- Живий список моделей і цін: https://ai-gateway.vercel.sh/v1/models
- AI SDK Speech / Transcription (локально): `node_modules/ai/docs/03-ai-sdk-core/37-speech.mdx`, `36-transcription.mdx`; https://ai-sdk.dev/docs/ai-sdk-core/speech, https://ai-sdk.dev/docs/ai-sdk-core/transcription
- AI SDK Azure provider (MAI-Voice / MAI-Transcribe): https://ai-sdk.dev/providers/ai-sdk-providers/azure
- Gateway provider source: `node_modules/.pnpm/@ai-sdk+gateway@3.0.215*/node_modules/@ai-sdk/gateway/src/gateway-{speech,transcription}-model.ts`
- Vercel Blob: https://vercel.com/docs/vercel-blob · pricing і ліміти: https://vercel.com/docs/vercel-blob/usage-and-pricing
- Vercel Functions limits (4.5 MB body, maxDuration): https://vercel.com/docs/functions/limitations
- ElevenLabs у Marketplace: https://vercel.com/marketplace/elevenlabs
- Azure Pronunciation Assessment: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment
