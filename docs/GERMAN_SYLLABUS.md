# GERMAN_SYLLABUS — програма курсу «Deutsch A1 → C2»

Повна карта курсу `deutsch-a1-c2`: шість рівнів CEFR, посібник «Deutschland: історія й культура», розділ іспитів,
банк вступного тесту. Для кожного рівня — обсяг граматики, теми лексики, фокус вимови, цілі «я вмію» й упорядкований
список тем (статей) з кількістю блоків.

- Формат статей і мовні блоки `[!word]` `[!listen]` `[!speak]` `[!pair]` — [LANGUAGE_COURSE.md](./LANGUAGE_COURSE.md).
- Базові блоки `[!quiz]` (single / multi / `type: fill` / `type: order`), `[!reel]`, `[!diagram]` — [CONTENT_SPEC.md](../CONTENT_SPEC.md).
- Пакет курсу, розділи, тести тем, екзамени, вступний тест — [COURSE_FORMAT.md](./COURSE_FORMAT.md).
- Зразок формату — курс англійської: [ENGLISH_SYLLABUS.md](./ENGLISH_SYLLABUS.md) (ця програма повторює його структуру).
- Маніфест: `content/courses/deutsch-a1-c2/course.yaml` (§11).

**Статус (2026-10-31):** програму складено, контенту ще немає. Обсяг — паритет з англійським курсом:
**166 мовних тем** + **33 розділи «Deutschland»** + **12 тем іспитів** = 211 статей,
≈ **11383 вправи** (з них мовні теми — 9231) і ≈ **5480 карток `[!word]`** (мовні теми — 4530).
Вступний тест — 42 питання на рівень. Вправи тут рахуються як W + L + S + P + Q (як і в англійському курсі, де
`[!word]` — теж вправа типу `word`).

> Робочий порядок: усі скрипти — з `VAULT_PATH=content` (джерело правди курсу — тека `content/` цього worktree),
> **`content:sync` не запускати**. Перевірка: `VAULT_PATH=content pnpm course:check deutsch-a1-c2`.

---

## 1. Принципи

1. **Учень — україномовний.** Пояснення українською, приклади німецькою з перекладом. Кожна стаття має блок
   «Типові помилки українців» (`[!pitfall]`, 3–4 на тему) — наскрізний список пасток у §1.1.
2. **Одна стаття = одна тема рівня**, 25–45 хв. Короткі пояснення, таблиці відмінювання, `[!diagram]` для структур
   (`flow` — побудова речення й Satzklammer, `compare` — «A vs B», `timeline` — часи).
3. **Чотири навички в кожній темі.** Граматична тема має слова, аудіювання, вимову й тести; тематична — граматику
   в контексті. Окремі теми `listening` і `skills` тренують стратегії.
4. **Рід — частина слова.** Кожен іменник у `[!word]` — **з артиклем у заголовку й множиною в `forms:`**
   (`> [!word] der Tisch` · `forms: die Tische`). Ніколи не «Tisch — стіл». У поясненнях і таблицях дотримуємося
   однієї колірної конвенції в `[!diagram]`: `tone: blue` — der, `tone: red` — die, `tone: green` — das,
   `tone: violet` — множина. Дієслова — з трьома формами (`forms: fahren → fuhr → ist gefahren`), у Präsens з
   чергуванням — ще й 3-тя особа (`forms: er fährt · fuhr · ist gefahren`); прийменникові — з відмінком
   (`warten auf + Akk`).
5. **Вимова — окрема наскрізна доріжка** (§3), вплетена в A1–A2 і продовжена на B1+.
6. **Реальні ситуації** — у кожній тематичній статті розділ «Ситуація» (діалог `audio: A: … / B: …` + `[!speak]`
   репліки учня). Багато учнів уже живуть у Німеччині, Австрії чи Швейцарії, тож ситуації — це **Behörde, Arzt,
   Wohnungssuche, Bewerbung, Bahn, Bank, Schule / Kita, Krankenkasse**, а не лише туризм (A2-29, B1-16, B1-18, B1-26, B2-28).
7. **Норма — німецька стандартна мова Німеччини** (Bundesdeutsch). Австрійські й швейцарські варіанти — у `note:`
   картки, як UK / US в англійському курсі: `note: AT der Jänner; CH ohne ß — die Strasse`. Позначки: `DE`, `AT`, `CH`.
   Приклади: Jänner / Januar, Paradeiser / Tomate, Erdäpfel / Kartoffeln, Semmel / Brötchen, Grüß Gott, Grüezi, Servus,
   Velo / Fahrrad, parkieren / parken, Matura / Abitur, heuer / dieses Jahr.
8. **Landeskunde в кожному рівні.** Кожна тематична (`vocabulary`) і `skills`-тема має розділ «Landeskunde» —
   короткий текст **німецькою** про Німеччину / Австрію / Швейцарію з 2–3 `[!quiz]` на розуміння: A1 40–60 слів,
   A2 80–120, B1 150–200, B2 200–280, C1 350–450, C2 450–600. Тексти не повторюють розділи «Deutschland» (§9), а
   посилаються на них (`[[Deutschland - B1 - 13. …]]`).
9. **Кожен рівень закривається темою `review`**: змішаний тест рівня, диктант, мінімальні пари, чекліст «я вмію»;
   з B1 — міні-тест у форматі іспиту рівня (§10). Екзамен розділу (25 питань, test-out) збирає платформа.
10. **Виробничі блоки `[!write]` / `[!talk]` — пізніше.** Вони будуються на іншій гілці для англійської й тут ще
    не існують. Теми письма й говоріння зараз тренують те, що вміє платформа: аналіз зразка, `type: order` (структура
    листа), `type: fill` (Redemittel), single / multi (регістр, помилки), `[!speak]` (усні репліки). **Не плануємо
    контенту, що залежить від `[!write]` / `[!talk]`**; коли блоки зʼявляться — окрема хвиля додасть по 1–2 такі
    завдання в теми `skills` B1–C2 і в розділ іспитів.

### 1.1 Типові помилки українців (наскрізний список для `[!pitfall]`)

| Пастка | Приклад помилки → норма | Де вперше |
|---|---|---|
| Рід не збігається з українським | ~~der Mädchen~~ → **das** Mädchen; die Sonne (укр. «сонце» — сер. р.); der Mond збігається з «місяць» — випадково, не правило; das Kind; der Tisch, але die Tür | A1-06 |
| Артикль пропущено (в українській артиклів немає) | ~~Ich habe Auto~~ → Ich habe **ein** Auto; але Ich bin Lehrer (професія без артикля) | A1-03, A1-06 |
| Дієслово не на своєму місці | ~~Heute ich lerne~~ → Heute **lerne** ich (V2); ~~weil ich habe keine Zeit~~ → weil ich keine Zeit **habe** | A1-09, A2-11 |
| Розірвана дужка | ~~Ich rufe an dich~~ → Ich **rufe** dich **an**; ~~Ich kann schwimmen gut~~ → Ich kann gut **schwimmen** | A1-16, A1-19 |
| Відмінок після прийменника «за українським» | ~~mit Auto~~ / ~~mit den Auto~~ → mit **dem** Auto; ~~für mir~~ → für **mich**; ~~ich gehe in Büro~~ → ins Büro | A2-06, A2-08 |
| Керування дієслів | ~~Ich helfe dich~~ → Ich helfe **dir**; ~~Ich warte dich~~ → Ich warte **auf dich**; ~~fragen bei jemandem~~ → jemanden fragen | A2-05, B1-06 |
| Вік і стани через haben | ~~Ich habe 20 Jahre~~ → Ich **bin** 20 (Jahre alt); ~~Ich habe kalt~~ → **Mir ist** kalt (а «Ich bin kalt» = я холодна людина) | A1-04, A1-11 |
| «Йти» на транспорті | ~~Ich gehe mit dem Bus nach Berlin~~ → Ich **fahre** …; gehen = пішки | A1-24 |
| Заперечення | ~~Ich habe nicht Zeit~~ → Ich habe **keine** Zeit; подвійне заперечення ~~Ich habe nichts nicht~~ | A1-11 |
| «Свій» | ~~Sie liebt sein Mann~~ → Sie liebt **ihren** Mann (немає універсального «свій») | A1-21 |
| Звук h ≠ «г» | Hund, Haus — видих [h], не дзвінке українське [ɦ]; g = «ґ» (gut), ch = [ç] / [x], не «х» усюди | A1-17 |
| ü / ö | ü ≠ «ю», ö ≠ «йо»: über [ˈyːbɐ], schön [ʃøːn]; Mutter / Mütter, schon / schön | A1-10 |
| Довгота голосних і оглушення | Staat / Stadt; Tag [taːk], Hund [hʊnt] — оглушуємо в кінці (на відміну від англ.), але не всередині (Tage) | A1-05, A1-23 |
| ei / ie | Wein [vaɪn] ≠ Wien [viːn]; Bier ≠ Bein | A1-10 |
| Хибні друзі | Magazin (= журнал / склад, не магазин → das Geschäft, der Laden), Familienname (= прізвище), Dom (= собор, не дім), Akademiker (= людина з вищою освітою, не академік), Konkurs (= банкрутство, не конкурс → der Wettbewerb), Termin (= запис, зустріч, не «термін» → die Frist), Stuhl (= стілець, не стіл), Billion (= трильйон!), Kran (= підйомний кран; кран води → der Wasserhahn), Artist (= циркач), Konserve (тут збіг — консерви, але рід die і розмовне die Dose) | A1–B2, C2-18 |
| Кальки | ~~eine Entscheidung machen~~ → treffen; ~~ein Foto machen~~ — ок, але ~~eine Frage geben~~ → stellen; ~~Ich bin einverstanden mit dir~~ — ок, ~~Ich stimme dich zu~~ → Ich stimme **dir** zu | B2-23, C1-03 |
| du / Sie | надмірне du в Behörde; Sie з малої; «ви» до однієї людини = Sie, до кількох друзів = ihr | A1-02 |
| Велика літера | усі іменники з великої (das Essen, beim Laufen), прикметники національності — з малої (ukrainisch) | A1-29 |

### 1.2 Що в німецькому курсі інакше, ніж в англійському

- **Відмінки й рід** — найважче для учня, тож на них більше тем (A1-06, A1-11, A1-15, A2-05, A2-06, A2-08, A2-15,
  A2-17, A2-19, B1-03) і в кожній з них `[!diagram]` таблиця.
- **Порядок слів** — друга головна складність (V2, Satzklammer, дієслово в кінці підрядного, TeKaMoLo) — окремі
  теми A1-09, A1-16, A2-11, B1-19, C1-07, C2-01.
- **Модальні частки** (doch, mal, ja, eben, halt…) — те, чого немає в підручниковому перекладі; B1-25, C1-04.
- **Читання за правилами** — німецьке письмо майже фонетичне, тому IPA потрібна для довготи, наголосу, ch і
  запозичень, а не для кожного слова (у `[!word]` поле `ipa:` усе одно обовʼязкове — звідти підказки `[!speak]`).

## 2. Конвенції для авторів статей

### 2.1 Файл і frontmatter

```
content/Guides/Deutsch/Deutsch - A1 - 03. Особові займенники й дієслово sein.md
content/Guides/Deutschland/Deutschland - B1 - 13. 1989–1990 — мирна революція й обʼєднання.md
content/Guides/Deutsch Prüfungen/Deutsch Prüfungen - C1 - 01. TestDaF — чотири частини й TDN 3–5.md
content/Guides/Deutsch/_placement/A1.md … C2.md
```

- Ім'я: `<Посібник> - <LEVEL> - NN. <Назва>.md`; назва — українською (нім. терміни дозволені), **без**
  `: / \ ? * " < > | # ^ [ ]` (Obsidian їх не дозволяє — тому «du і Sie», а не «du/Sie»; «wo (Dativ) і wohin», без «?»).
- Номер розділу = рівень × 100 + NN (A1 → 101–130, A2 → 201–230, B1 → 301–330, B2 → 401–429, C1 → 501–525,
  C2 → 601–622); парсер читає його з назви, `order:` не потрібен (якщо вказаний — перемагає).
- `id` теми: `de-<рівень>-<slug>` (slug — колонка «id» у таблицях): `id: de-a1-sein`. Розділи «Deutschland» —
  `dl-<рівень>-NN` (`dl-b1-13`), іспити — `dp-<рівень>-NN` (`dp-c1-01`).
- `level:` — CEFR. У Deutschland — рівень **німецького шару** розділу (слова, цитати, Lesetext), а не складність
  української оповіді.
- `tags`: перший тег виду визначає `topic.kind` (LANGUAGE_COURSE «Етап 2»): `[deutsch, a1, grammar, artikel]`;
  Deutschland — `[deutsch, landeskunde, skills, b1, geschichte]`; іспити — `[deutsch, exam, skills, c1, testdaf]`.

```yaml
---
title: Особові займенники й дієслово sein
id: de-a1-sein
level: A1
icon: px:letterTile
tags: [deutsch, a1, grammar, sein, pronomen]
prerequisites: ["[[Deutsch - A1 - 02. Hallo — привітання, країни, мови, du і Sie]]"]
estimatedMinutes: 35
---
```

### 2.2 Id блоків

`<id теми>-<тип><NN>`, стабільні (на них тримаються прогрес і SRS):

| Блок | Суфікс | Приклад |
|---|---|---|
| `[!word]` | `w` | `de-a1-essen-w07` |
| `[!listen]` | `l` | `de-a1-essen-l03` |
| `[!speak]` | `s` | `de-a1-essen-s02` |
| `[!pair]` | `p` | `de-a1-umlaute-p11` |
| `[!quiz]` (будь-який `type`) | `q` | `de-a1-sein-q05` |
| `[!question]-` (картка правила, необовʼязково) | `c` | `de-a1-sein-c01` |
| Вступний тест | `de-pl-<рівень>-<g\|v\|r\|l>NN` | `de-pl-b1-g07` |

Розділи Deutschland: `dl-b1-13-w04`; іспити: `dp-c1-01-q12`.
**Одне слово — одна картка на весь курс** (і мовні теми, і Deutschland, і іспити): якщо слово вже було, не дублюй
`[!word]`, лише вживай у прикладах. Заголовок картки іменника — з артиклем: `der Bahnhof` і `die Bahn` — різні картки,
`Bahnhof` без артикля — помилка формату.

### 2.3 Картка слова для німецької

```md
> [!word] der Bahnhof
> ipa: /ˈbaːnˌhoːf/ · pos: noun · level: A1 · id: de-a1-stadt-w05
> uk: вокзал
> forms: die Bahnhöfe
> example: Der **Bahnhof** ist gleich um die Ecke. — Вокзал зовсім поруч, за рогом.
> note: AT auch: der Bahnhof; CH: der Bahnhof / umg. «Bahnhof» = SBB-Station. Hauptbahnhof = Hbf.
```

- `ipa:` — одна, стандартна вимова (Duden, Bundesdeutsch); **без `ipa-us:`** і без інших варіантів IPA. Австрійська /
  швейцарська вимова, якщо помітно інша, — словами в `note:` (`note: AT [ˈkaːfeː] — наголос на кінці: Kaffee`).
- `pos:` як в англійському курсі; для іменника рід видно з артикля в заголовку.
- `forms:` — множина іменника; три форми дієслова (з `ist` для sein-Perfekt); неправильні ступені прикметника.
- Прийменникові дієслова — у заголовку з прийменником і відмінком: `> [!word] warten auf (+ Akk)`.

### 2.4 Анатомія статті

1. **Результати** — `[!success]` «Після цієї теми ти зможеш…» (2–5 «я вмію»).
2. **Передбач** — 1 `[!quiz]` або `[!listen]` до теорії.
3. **Пояснення** — українською; таблиця форм; `[!diagram]` (відмінки — таблиця з кольорами роду, порядок слів — `flow`).
4. **Приклади** — 6–12 речень `нім. — укр.`
5. **Слова** — `[!word]` (колонка W).
6. **Слухаємо** — `[!listen]` (L): `choice` → `dictation` → `answer` / `fill`; A1 — `speed: slow`.
7. **Вимова** — `[!pair]` (P) і `[!speak]` (S).
8. **Типові помилки українців** — 3–4 `[!pitfall]` (§1.1).
9. **Ситуація** — короткий діалог (тематичні теми).
10. **Landeskunde** — текст німецькою + 2–3 `[!quiz]` (тематичні й skills-теми; §1 п. 8).
11. **Практика** — `[!quiz]` (Q): ≈ 50 % single / multi (їх бере вступний тест і тест теми), решта `type: fill`
    (` ```text fill ` з `[[…]]`, для A1–A2 часто `· bank`; закінчення відмінків — ідеальне поле для fill) і
    `type: order` (порядок слів — головна вправа німецького курсу).
12. **Фішки** — 3 `[!reel]` (етимологія, культура, «чому так»).
13. **Джерела** — «Джерела та що почитати» (§16).

Мінімуми `course:check`: ≥ 6 тестів, ≥ 6 карток, ≥ 3 фішки, ≥ 1 `[!diagram]` / `[!viz]` / `[!figure]` на тему.
Тест теми — 10 питань, тож у кожній темі **≥ 10 `[!quiz]`** (у таблицях Q = 12–18, review — 30).
Орієнтири на тему (як у англійському курсі): 12–18 quiz, 6–8 listen, 6–8 speak, 3–4 pitfall, 3 reel, 1–3 diagram,
10–60 words.

### 2.5 Легенда колонок

**Вид:** `grammar` · `vocabulary` · `pronunciation` · `listening` · `skills` · `review`.
**ch** — номер розділу (рівень × 100 + NN). **W** — `[!word]` · **L** — `[!listen]` · **S** — `[!speak]` ·
**P** — `[!pair]` · **Q** — `[!quiz]`. Файл: `Deutsch - <рівень> - NN. <Назва>.md`. Кількості орієнтовні (±20 %).

---

### 2.6 Уточнення після хвилі 0 (модельні уроки; обовʼязкові для всіх авторів)

1. **IPA** — нотація Duden, з позначкою нескладовості: [aɪ̯ aʊ̯ ɔʏ̯ ɐ̯], [ʁ], [x], [ç].
2. **Жіночі форми професій** (die Lehrerin, die Studentin) — у `note:` картки чоловічої форми, не окремою карткою; `forms:` — лише множина.
3. **Іменник без множини:** `forms: — (без множини)`.
4. **`forms:` дієслова:** правильні й сильні — `fahren → fuhr → ist gefahren`; неправильні в Präsens — `ich bin · du bist · er ist · war · ist gewesen`.
5. **`level:` картки** — власний CEFR-рівень слова, а не рівень теми (die Möglichkeit у темі A1 → `level: A2`).
6. **Мікс тестів:** ≥ 50 % single/multi, ≥ 4 `fill`/`order` (замість «≈ 50 %»).
7. **«Ситуація»** у граматичних темах — бажана, не обовʼязкова.
8. **Кольори в `[!diagram]` для членів речення:** підмет/займенник — мʼятний, дієслово — помаранчевий, решта — сірий; для роду — §1 п. 4. Скрізь текстова мітка поруч із кольором.
9. **Джерела:** curl → 200; виняток — goethe.de (захист від ботів, 403 для curl): посилання дозволені, якщо сторінка відкривається в браузері.
10. **«Одне слово — одна картка»:** перед карткою перевір `grep -r "\[!word\] <слово>" content/Guides/Deutsch content/Guides/Deutschland`. Уже закартковані в A1-06: das Kind, der Tisch, der Stuhl, die Tür, das Handy, das Museum (A1-08, A1-20, A1-24 — лише в прикладах).
10a. **Дубль картки:** слово належить темі з **меншим номером** (порядок курсу: A1-01 … C2-22, потім Deutschland); пізніша тема прибирає свою картку й лишає слово в прикладах. `pos:` для чисел — `num`, для артиклів і `kein` — `art`; країни й мови без артикля в заголовку (Deutschland, Deutsch).
11. **`_guide.md` з повним списком тем** дає попередження `broken-link`, доки хвилі не допишуть теми, — це очікувано.

### 2.7 Правила після рецензії хвилі 0 (обовʼязкові; мають пріоритет над §2.4–§2.6, якщо розходяться)

1. **Транскрипція.** IPA — лише в `/…/` (картка, `[!speak]`) або `[…]` (текст); кириличне наближення — лише в «…»
   (*Kind — «кінт»*, ніколи «[кінт]»). `ts`, `pf`, `tʃ` без дужки-звʼязки; `ʔ` — лише всередині складних слів;
   вторинний наголос `ˌ` — лише в складних словах із 3+ складами; дифтонги — aɪ̯ aʊ̯ ɔʏ̯. Умлаути кирилицею не передаємо.
2. **Правила роду — з чесним рівнем надійності.** «Без винятків» — лише зменшувальні -chen/-lein (суфікс! der Kuchen —
   ні), -ung, -heit, -keit, -schaft, субстантивовані інфінітиви. Решта — «тенденція» з ≥ 1 винятком рівня A1–A2 (на суфікс або на групу суфіксів).
   Таблиця, схема й підсумок мають однаковий поділ.
3. **Кольори `[!diagram]`:** blue/red/green/violet — лише рід і множина; mint/orange/gray — лише члени речення;
   інше (кроки, хронологія) — yellow, pink або gray.
4. **Ситуація = звук:** діалог — `[!listen]` з `audio: A:/B:` і `type: answer`, далі 1–2 `[!speak]`. `type: choice` — лише
   коли варіанти — дослівні німецькі речення з аудіо. `[!example]` — лише для текстів для читання.
5. **Тести:** `type:` завжди явно. У `bank:` — лише справжні дистрактори, регістр як у позиції пропуску; `bank` без
   дистрактора не допускається. Хибні варіанти — реальні помилки українців, без жартівливих.
6. **Темп:** A1–A2 — `speed: slow` у кожному `[!listen]` і `[!speak]`; з B1 — без `speed`.
7. **Рівень картки в Deutschland:** реалії (der Mauerfall, die Treuhand) — рівень розділу; загальномовні слова —
   справжній CEFR-рівень; якщо слово ще буде в мовній темі, картку має раніша в порядку курсу.
8. **Id за порядком читання:** `qNN`, `lNN`, `sNN`, `wNN` — у порядку появи у файлі; після публікації не змінюються.
9. **Множина завжди в `forms:`** (`forms: die …` або `forms: — (без множини)`); `forms:` можна опустити лише при `pos: phrase`.
10. **Факти й цитати (Deutschland):** число точніше за «десятки тисяч» — з джерелом; оцінки натовпу — «за оцінками /
    близько», розбіжні — діапазоном; крилаті вислови — за первинним джерелом (архів промови, фонд особи), спірну
    атрибуцію називай прямо; Голокост і погроми — ніколи у `[!reel]`.
11. **Українські паралелі — симетричні:** громадянський рух показуємо з обох боків; лише події й дати з джерелами,
    без оцінок сучасної політики.
12. **Джерела:** маркований список без емодзі-маркерів; посилання на конкретну статтю словника, не на пошук чи огляд.
13. **Апостроф:** лише ʼ (U+02BC) в українському тексті.
14. **Абсолютні формулювання в A1–B1** («завжди / ніколи / без винятків / лише») — тільки для справді безвиняткових
    правил; інакше «зазвичай / майже завжди» + приклад винятку (незлічувані без артикля; *Wie geht's?*).

15. **h кирилицею:** «видих [h]» або легке «х» (Haus — «хаус», видихом); ніколи «г». Кінцеве g = [k] — «к», не «ґ»
    (Tag — «так»); «ґ» — лише для початкового [ɡ].
16. **Діалог «Ситуації» у тематичних (vocabulary/skills) темах** — завжди з 1–2 `[!speak]` після нього.
17. **Голосні в кирилиці:** «е» як у «день» (не «лес»); [eː] — описом «довге напружене е»; без «є», «ә», «ьо».

18. **ʔ і ˌ уточнено:** `ʔ` — усередині складних слів і після префікса перед коренем, що починається з голосного
    (beˈʔantwɔʁtn̩, ˈaʊ̯sʔaʁbaɪ̯tn̩); у відокремлюваних дієсловах `ˌ` не ставимо (ˈaʊ̯fʃteːən); `ˌ` — лише в складних
    іменниках із 3+ складами.

### 9.0 Анатомія розділу Deutschland (уточнення після хвилі 0, модель — B1-13)

> Кількості Q і reels у таблицях §9.2–§9.4 — орієнтир; мінімуми §9.0 (12–14 тестів, 5 фішок) мають пріоритет.

Результати → Передбач → **Оповідь** (`###` на подію; оригінальні цитати з перекладом) → `[!diagram]` timeline →
Приклади → Слова → Слухаємо → Вимова (лише `[!speak]`) → **«Типові помилки й пастки»** (хибні уявлення, пастки
термінів і ≥ 1 мовна пастка) → **Landeskunde-Text** (німецькою, рівень розділу) + 3 `[!quiz]` на розуміння → Практика →
Фішки (**5** `[!reel]`; у B1-10, B1-11 — жодних) → Джерела → `[!important]` Підсумок. Тестів **12–14** (з них 1 «передбач»
і 3 на Landeskunde-Text). Слова, що стосуються кількох розділів, «належать» першому за номером (B1-12 — die Mauer,
der Mauerbau, die Stasi; B1-13 — der Mauerfall, die Wende, die Wiedervereinigung); пізніші розділи їх лише вживають.

## 3. Доріжка «Вимова» (наскрізна)

| Рівень | № | Тема | Що відпрацьовуємо |
|---|---|---|---|
| A1 | 01 | Alphabet, звуки й вимова літер | назви літер, буквування, ä ö ü ß, як читати IPA |
| A1 | 05 | Довгі й короткі голосні | Miete / Mitte, Staat / Stadt, сигнали довготи, [ə] |
| A1 | 10 | Умлаути й дифтонги | [yː ʏ øː œ ɛː], ei [aɪ] vs ie [iː], eu / äu [ɔʏ], au |
| A1 | 17 | Приголосні ch, r, h | [ç] / [x], [ʁ] і вокалізоване [ɐ], [h] ≠ «г», g = «ґ» |
| A1 | 23 | Оглушення в кінці, sp, st, z, v, w | Auslautverhärtung, [ʃp ʃt], [ts], v = [f], w = [v] |
| A2 | 03 | Наголос у слові | корінь, відокремлювані префікси, іншомовні суфікси |
| A2 | 13 | Наголос у реченні, ритм і редуковане -e | змістові / службові слова, -en, -er |
| A2 | 18 | Мелодія речення | ↘ W-питання, ↗ Ja / Nein, ввічливе ↗ |
| A2 | 26 | Правопис і правила читання | ß / ss, ie, Dehnungs-h, велика літера |
| B1 | 05 | Твердий приступ і збіг приголосних | Knacklaut — німецька не «зливає» слова; Herbststurm |
| B1 | 13 | Розмовні скорочення | hab', 'ne, haste, gibt's, isses |
| B2 | 11 | Іншомовні слова й англіцизми | Restaurant, Chance, Computer, рід англіцизмів |
| B2 | 12 | Регіональна вимова | -ig [ɪk], Tach, nich, st на півночі |
| C1 | 10 | Емфатична інтонація й контрастивний наголос | частки в інтонації, іронія |
| C2 | 11 | Варіанти мови — Австрія, Швейцарія, діалекти | плюрицентрична норма, Mundart на слух |
| C2 | 13 | Просодія на рівні носія | паузи, темп, публічний виступ |

Плюс у кожній статті — 4–8 `[!speak]` і, де доречно, `[!pair]` (Bier / Bär, Kuchen / Küchen, Hölle / Höhle, Bahn / Bann).

---

## 4. A1 — Початковий (Breakthrough) · Goethe-Zertifikat A1: Start Deutsch 1

**Ціль рівня:** розуміти й уживати знайомі щоденні вирази; представитися, ставити й відповідати на прості питання;
спілкуватися, якщо співрозмовник говорить повільно. **Лексика:** ≈ 650–750 слів (активно ≈ 500).

- **Граматика:** особові займенники й sein, haben; Präsens (правильні, з чергуванням, відокремлювані); артикль і рід,
  ein / kein; Nominativ і Akkusativ; множина; V2, W-Fragen, Ja / Nein-Fragen, doch; модальні дієслова; присвійні артиклі;
  Imperativ; прийменники часу; Perfekt (перші кроки); gern / lieber.
- **Лексика:** знайомство, країни й мови; числа, вік; сімʼя; час і дата; розпорядок дня; їжа й кафе; квартира;
  одяг і покупки; місто й транспорт; хобі й погода.
- **Вимова:** алфавіт; довгота; умлаути й дифтонги; ch, r, h; оглушення, sp / st, z, v, w.
- **Аудіювання / читання / письмо / говоріння:** як у Start Deutsch 1 — імена, числа, ціни, час; вивіски,
  оголошення, записки; формуляр і записка ≈ 30 слів; представитися, попросити щось, спитати / відповісти.

| № | ch | Назва | Вид | id | Зміст | W | L | S | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 101 | Alphabet, звуки й вимова літер | pronunciation | `de-a1-alphabet` | 26 літер + ä ö ü ß, назви літер (A [aː], E [eː], I [iː], J [jɔt], V [faʊ], W [veː], Y [ˈʏpsilɔn]), буквування імені й email (Wie schreibt man das?), літера ≠ звук, як читати IPA в картках, звуки, яких немає в українській | 12 | 8 | 6 | 4 | 12 |
| 02 | 102 | Hallo — привітання, країни, мови, du і Sie | vocabulary | `de-a1-hallo` | Hallo / Guten Tag / Tschüs / Auf Wiedersehen, Wie geht's? / Wie geht es Ihnen?, Ich heiße…, Woher kommst du?, 25 країн + мови (die Ukraine — Ukrainisch, aus der Ukraine), du vs Sie з першого дня; DACH: Servus, Grüß Gott, Grüezi, Moin | 40 | 6 | 8 | 0 | 12 |
| 03 | 103 | Особові займенники й дієслово sein | grammar | `de-a1-sein` | ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind; sie = вона / вони / Ви; заперечення nicht; чому «я студент» → Ich bin Student (без артикля при професії) | 12 | 6 | 6 | 0 | 14 |
| 04 | 104 | Числа, вік і номер телефону | vocabulary | `de-a1-zahlen` | 0–100, einundzwanzig (одиниці перед десятками!), сотні й тисячі, вік — Ich bin 25 (Jahre alt), не «ich habe 25», номери телефону (zwo), Wie alt bist du? | 35 | 10 | 6 | 4 | 12 |
| 05 | 105 | Довгі й короткі голосні | pronunciation | `de-a1-vokale` | довгота розрізняє слова: Miete/Mitte, Staat/Stadt, Ofen/offen, bieten/bitten; сигнали довготи (ie, h, подвоєння aa ee oo) і короткості (подвоєний приголосний, ck, tz); ненаголошене -e [ə] | 24 | 6 | 10 | 14 | 12 |
| 06 | 106 | Артикль і рід — der, die, das, ein, eine | grammar | `de-a1-artikel` | три роди, означений і неозначений артикль, рід — частина слова (вчити der Tisch, а не Tisch); правила роду: -ung/-heit/-keit/-schaft/-ion → die, -chen/-lein → das, дні/місяці/пори року → der; das Mädchen, die Sonne, der Mond; кольорова схема в `[!diagram]` | 30 | 5 | 5 | 0 | 16 |
| 07 | 107 | Präsens — правильні дієслова | grammar | `de-a1-praesens` | закінчення -e -st -t -en -t -en, wohnen / heißen / arbeiten (du arbeitest), sie wohnt / sie wohnen / Sie wohnen; Präsens = і «зараз», і найближче майбутнє | 20 | 5 | 6 | 0 | 14 |
| 08 | 108 | Сімʼя, люди й зовнішність | vocabulary | `de-a1-familie` | члени родини, die Eltern, die Geschwister, зовнішність (groß, blond, lange Haare), характер (nett, lustig), базові частини тіла; Landeskunde: «Familie Müller» — текст 50 слів | 40 | 6 | 6 | 0 | 12 |
| 09 | 109 | Питання й місце дієслова — V2 і W-Fragen | grammar | `de-a1-fragen` | дієслово — завжди на 2-му місці (V2), інверсія Heute lerne ich…, W-Fragen (wer, was, wo, woher, wohin, wann, wie, warum), Ja/Nein-Fragen з дієсловом на 1-му місці, відповідь doch | 12 | 6 | 6 | 0 | 16 |
| 10 | 110 | Умлаути й дифтонги — ä, ö, ü, ei, eu, au | pronunciation | `de-a1-umlaute` | ü = «і» губами «у», ö = «е» губами «о», ä; ei [aɪ] ≠ ie [iː] (Bein/Bier), eu/äu [ɔʏ], au; schön/schon, Mutter/Mütter, Tür/Tier | 24 | 6 | 10 | 12 | 12 |
| 11 | 111 | haben, знахідний відмінок і kein | grammar | `de-a1-akkusativ` | haben (du hast, er hat); Akkusativ: лише der → den / einen; kein / keine / keinen vs nicht; Ich habe einen Bruder; пастки «Ich habe kalt», «ich habe 20 Jahre» | 15 | 5 | 6 | 0 | 16 |
| 12 | 112 | Час, дні, місяці й дата | vocabulary | `de-a1-zeit` | Wie spät ist es? офіційно (14:30 — vierzehn Uhr dreißig) і розмовно (halb drei = 2:30, не 3:30!, Viertel nach / vor), дні, місяці, порядкові (am dritten Mai), роки (zweitausendsechsundzwanzig); österr. Jänner | 40 | 8 | 6 | 2 | 12 |
| 13 | 113 | Аудіювання — імена, числа, ціни й час | listening | `de-a1-hoeren-zahlen` | диктанти: імена по літерах, телефони, ціни (3,50 € — drei Euro fünfzig), час і дата, email (at, Punkt); стратегія «слухай ключове слово»; формат Start Deutsch 1 Hören | 8 | 18 | 3 | 2 | 12 |
| 14 | 114 | Дієслова з чергуванням — fahren, essen, lesen, nehmen | grammar | `de-a1-vokalwechsel` | a → ä (fahren, schlafen), e → i (essen, sprechen, nehmen), e → ie (lesen, sehen), лише du й er/sie/es; wissen, mögen | 20 | 5 | 6 | 0 | 14 |
| 15 | 115 | Множина іменників | grammar | `de-a1-plural` | 5 типів множини (-e, -er, -(e)n, -s, без закінчення) + умлаут, die у множині для всіх родів, підказки за родом і закінченням, Plural вчимо разом зі словом (`forms:`) | 25 | 4 | 4 | 0 | 14 |
| 16 | 116 | Розпорядок дня й відокремлювані дієслова | grammar | `de-a1-trennbar` | aufstehen, anrufen, einkaufen, fernsehen: Ich stehe um 7 Uhr auf — перша Satzklammer; частота (immer, oft, manchmal, nie); `[!diagram]` «дужка речення» | 35 | 6 | 6 | 0 | 14 |
| 17 | 117 | Приголосні ch, r, h | pronunciation | `de-a1-konsonanten` | ich-Laut [ç] (ich, Milch, -ig) і ach-Laut [x] (Buch, acht), r горловий [ʁ] і вокалізований -er [ɐ] (Vater), h — видих, не українське «г» [ɦ], g = «ґ»; Hund/und | 24 | 6 | 12 | 14 | 12 |
| 18 | 118 | Їжа, напої й у кафе | vocabulary | `de-a1-essen` | продукти, страви, напої, Frühstück / Mittagessen / Abendessen; Ich hätte gern…, Ich nehme…, Zahlen, bitte! / Zusammen oder getrennt?, Trinkgeld; DACH: Paradeiser, Erdäpfel, Semmel, Brötchen | 45 | 6 | 8 | 0 | 12 |
| 19 | 119 | Модальні дієслова — können, müssen, wollen, dürfen, möchten | grammar | `de-a1-modalverben` | ich kann / du kannst, інфінітив у кінці (Ich muss heute arbeiten), möchte як ввічливе «хотів би», dürfen vs können, nicht müssen ≠ «не можна» | 15 | 6 | 6 | 0 | 16 |
| 20 | 120 | Квартира, кімнати й меблі — es gibt | vocabulary | `de-a1-wohnung` | кімнати, меблі, es gibt + Akkusativ, прикметники (hell, groß, teuer), Wohnungsanzeige (3-Zi.-Whg., 70 m², KM); Landeskunde: Wohnen in Deutschland — оренда частіше за власність | 40 | 6 | 6 | 0 | 14 |
| 21 | 121 | Присвійні артиклі — mein, dein, sein, ihr, unser | grammar | `de-a1-possessiv` | усі особи, закінчення як у ein / kein, sein vs ihr (його / її), Ihr (Ваш), Akkusativ meinen; пастка «свій» → sein / ihr / mein | 10 | 5 | 5 | 0 | 14 |
| 22 | 122 | Одяг, кольори й у магазині | vocabulary | `de-a1-kleidung` | одяг, кольори, розміри; Was kostet…?, Kann ich das anprobieren?, Die Hose ist zu groß, Kasse, Umtausch; Größe 38 | 40 | 6 | 8 | 0 | 12 |
| 23 | 123 | Оглушення в кінці, sp, st, z, v, w | pronunciation | `de-a1-auslaut` | Auslautverhärtung: Tag [k], Hund [t], ab [p] (але Tage [g]); sp-/st- на початку = «шп / шт»; z = «ц», v = «ф», w = «в»; sch, -tion [tsi̯oːn] | 20 | 6 | 10 | 12 | 12 |
| 24 | 124 | Місто, транспорт і дорога — Imperativ | vocabulary | `de-a1-stadt` | місця в місті, транспорт (mit dem Bus, zu Fuß), Imperativ Sie / du / ihr (Gehen Sie geradeaus! Nimm den Bus!), Entschuldigung, wo ist…?; Fahrkarte, Haltestelle | 40 | 8 | 6 | 0 | 12 |
| 25 | 125 | Прийменники часу — am, um, im, von … bis, vor, nach | grammar | `de-a1-zeitpraep` | um 8 Uhr / am Montag / am Morgen / im Mai / im Sommer / 2026 без прийменника; von 9 bis 17 Uhr, vor / nach dem Essen (перший погляд на Dativ); `[!diagram]` «від точки до періоду» | 12 | 4 | 4 | 0 | 16 |
| 26 | 126 | Perfekt — перші кроки | grammar | `de-a1-perfekt` | Was hast du gemacht? haben / sein + Partizip II (gemacht, gegessen, gefahren), sein для руху й зміни стану; Partizip у кінці речення; у розмові Perfekt = основний минулий час | 20 | 6 | 6 | 0 | 16 |
| 27 | 127 | Вільний час, хобі й погода — gern, lieber | vocabulary | `de-a1-freizeit` | хобі й спорт, gern / lieber / am liebsten, spielen / machen / gehen, погода (Es regnet, Es ist sonnig), пори року, Wie ist das Wetter? | 40 | 6 | 6 | 0 | 12 |
| 28 | 128 | Аудіювання — щоденні діалоги | listening | `de-a1-hoeren-dialoge` | короткі діалоги: кафе, магазин, вулиця, знайомство, телефон; choice / answer / dictation, `speed: slow` (§2.7.6); відповіді учня через `[!speak]` | 10 | 18 | 6 | 0 | 12 |
| 29 | 129 | Читання й письмо — формуляр, оголошення, коротке повідомлення | skills | `de-a1-lesen-schreiben` | вивіски, оголошення, меню, SMS; Formular (Vorname, Nachname, Geburtsdatum, Wohnort) і коротка записка ≈ 30 слів — як у Start Deutsch 1 Schreiben; велика літера в іменниках, Sie з великої; Landeskunde: оголошення на дверях будинку | 20 | 4 | 3 | 0 | 14 |
| 30 | 130 | Підсумок A1 — тест рівня | review | `de-a1-review` | змішані тести з усіх тем (choice / fill / order), диктант, мінімальні пари, чекліст «я вмію» A1; без нового матеріалу | 0 | 10 | 6 | 6 | 30 |

**Підсумок A1:** 30 тем · grammar 12 · vocabulary 9 · pronunciation 5 · listening 2 · skills 1 · review 1 · 728 `[!word]` · 206 `[!listen]` · 191 `[!speak]` · 70 `[!pair]` · 418 `[!quiz]` · **1613 вправ**.

---

## 5. A2 — Елементарний (Waystage) · Goethe-Zertifikat A2

**Ціль рівня:** розуміти речення й часті вирази з найближчих сфер; спілкуватися в рутинних ситуаціях; розповідати
про минуле, оточення, плани. **Лексика:** + ≈ 800 (разом ≈ 1500).

- **Граматика:** Perfekt (повністю) і Präteritum sein / haben / модальних; Dativ (артиклі, займенники, дієслова);
  прийменники з Dativ / Akkusativ і Wechselpräpositionen; Komparation; підрядні з weil / dass / wenn; ob й непрямі
  питання; зворотні дієслова; відмінювання прикметників (усі три типи); займенники в усіх відмінках і порядок
  обʼєктів; Futur I / Präsens для майбутнього; сполучники позиції 0 і прислівники з інверсією.
- **Лексика:** біографія; подорожі й Bahn; робота; здоровʼя й лікар; почуття; гроші й послуги; свята.
- **Ситуації:** Bürgeramt / Anmeldung, огляд квартири, аптека, банк (A2-29).
- **Вимова:** наголос у слові й реченні; інтонація; правопис.

| № | ch | Назва | Вид | id | Зміст | W | L | S | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 201 | Perfekt — haben чи sein і Partizip II | grammar | `de-a2-perfekt` | ge-…-t, ge-…-en, без ge- (-ieren, be-/ver-/er-), відокремлювані (eingekauft), haben vs sein (gehen, fahren, bleiben, passieren), 60 найчастіших неправильних (`forms:` fahren → fuhr → ist gefahren) | 40 | 6 | 6 | 0 | 16 |
| 02 | 202 | Präteritum sein, haben і модальних — war, hatte, konnte | grammar | `de-a2-praeteritum-basis` | чому war / hatte / musste звучать навіть у розмові; Ich war gestern krank; Präteritum модальних (wollte, durfte, sollte) без умлаута | 12 | 6 | 6 | 0 | 14 |
| 03 | 203 | Наголос у слові | pronunciation | `de-a2-wortakzent` | наголос на корені (ˈarbeiten), відокремлювані префікси наголошені (ˈanrufen), невідокремлювані — ні (verˈstehen), іншомовні -ieren / -tion / -ität / -ei наголошені; позначки ˈ ˌ в IPA | 24 | 6 | 10 | 6 | 12 |
| 04 | 204 | Біографія й життєві події | vocabulary | `de-a2-lebenslauf` | geboren, zur Schule gehen, die Ausbildung machen, studieren, umziehen, heiraten; дати й роки; zuerst / dann / danach; Landeskunde: шкільна система (Grundschule → Gymnasium / Realschule) — текст 80 слів | 40 | 6 | 6 | 0 | 12 |
| 05 | 205 | Давальний відмінок — Dativ | grammar | `de-a2-dativ` | dem / der / dem / den + -n; einem / einer; mir, dir, ihm, ihr; дієслова з Dativ (helfen, danken, gefallen, gehören, schmecken); Wie geht es dir?; `[!diagram]` таблиця відмінків | 20 | 5 | 6 | 0 | 16 |
| 06 | 206 | Прийменники з Dativ і з Akkusativ | grammar | `de-a2-praep-kasus` | aus, bei, mit, nach, seit, von, zu (+ злиття zum, zur, beim, vom) / durch, für, gegen, ohne, um; seit + Dativ (seit zwei Jahren); пастка «mit Auto» → mit dem Auto | 15 | 4 | 4 | 0 | 18 |
| 07 | 207 | Подорожі, вокзал і Deutsche Bahn | vocabulary | `de-a2-reisen` | Fahrkarte, Gleis, umsteigen, Verspätung, Anschluss, Deutschlandticket, Hin- und Rückfahrt, Unterkunft, buchen; ÖBB / SBB; Landeskunde: Pünktlichkeit der Bahn — текст із цифрами | 45 | 6 | 6 | 0 | 12 |
| 08 | 208 | Прийменники місця — wo (Dativ) і wohin (Akkusativ) | grammar | `de-a2-wechselpraep` | in, an, auf, über, unter, vor, hinter, neben, zwischen; Ich bin im Büro / Ich gehe ins Büro; liegen / legen, stehen / stellen, sitzen / setzen, hängen; `[!diagram]` compare «де?» vs «куди?» | 25 | 5 | 6 | 0 | 18 |
| 09 | 209 | Аудіювання — оголошення й інструкції | listening | `de-a2-hoeren-durchsagen` | вокзал, аеропорт, супермаркет, прогноз погоди, автовідповідач; номер колії / рейсу / час; формат Goethe A2 Hören | 12 | 18 | 3 | 0 | 12 |
| 10 | 210 | Ступені порівняння — groß, größer, am größten | grammar | `de-a2-komparation` | -er / am -sten, умлаут (alt → älter), gut → besser → am besten, viel → mehr, gern → lieber; als / so … wie; пастка «größer wie» | 25 | 5 | 6 | 0 | 16 |
| 11 | 211 | Підрядні речення з weil, dass, wenn — дієслово в кінці | grammar | `de-a2-nebensaetze` | дієслово в кінці підрядного, кома обовʼязкова, підрядне спереду → Wenn ich Zeit habe, komme ich; weil vs denn; `[!diagram]` flow «головне + підрядне» | 12 | 6 | 6 | 0 | 18 |
| 12 | 212 | Робота, професії й навчання | vocabulary | `de-a2-arbeit` | професії з -in (Lehrer / Lehrerin), робоче місце, обовʼязки, Teilzeit / Vollzeit, Minijob; Was sind Sie von Beruf?; Landeskunde: duale Ausbildung | 45 | 6 | 6 | 0 | 12 |
| 13 | 213 | Наголос у реченні, ритм і редуковане -e | pronunciation | `de-a2-satzakzent` | змістові слова наголошені, службові слабкі; ритм німецької vs української; -en [ən]/[n̩], -er [ɐ], Schwa | 16 | 8 | 10 | 4 | 12 |
| 14 | 214 | Зворотні дієслова — sich freuen, sich waschen | grammar | `de-a2-reflexiv` | mich / dich / sich / uns / euch / sich, Dativ-рефлексив (Ich wasche mir die Hände), sich freuen auf / über (перший погляд), дієслова, які в українській не зворотні, і навпаки | 20 | 5 | 6 | 0 | 16 |
| 15 | 215 | Відмінювання прикметників I — після der, die, das | grammar | `de-a2-adj-bestimmt` | слабка відміна: -e / -en; der neue Tisch, den neuen Tisch, mit dem neuen Tisch; правило «5 × -e, решта -en»; `[!diagram]` таблиця | 20 | 5 | 5 | 0 | 16 |
| 16 | 216 | Здоровʼя, тіло й у лікаря | vocabulary | `de-a2-arzt` | частини тіла, симптоми (Ich habe Kopfschmerzen, Mir ist schlecht, Mein Bauch tut weh), Hausarzt, Termin, Krankenkasse, Versichertenkarte, Krankschreibung, Rezept; Apotheke ≠ Drogerie; Notruf 112 | 45 | 6 | 6 | 0 | 12 |
| 17 | 217 | Відмінювання прикметників II — після ein і без артикля | grammar | `de-a2-adj-unbestimmt` | мішана й сильна відміна: ein neuer Tisch, ein neues Auto, frisches Brot, mit kaltem Wasser; як «артикль-сигнал» переходить на прикметник | 15 | 5 | 5 | 0 | 18 |
| 18 | 218 | Мелодія речення — інтонація | pronunciation | `de-a2-intonation` | ↘ у W-питаннях і твердженнях, ↗ у Ja/Nein-питаннях, переліки, ввічливе ↗ (Wie bitte?), емоції (Echt? Wirklich?) | 10 | 8 | 12 | 4 | 12 |
| 19 | 219 | Займенники в усіх відмінках і порядок об'єктів | grammar | `de-a2-pronomen` | ich / mich / mir … sie / sie / ihnen, Ihnen; Ich gebe ihm das Buch → Ich gebe es ihm (займенник Akk перед Dat); man, es як формальний підмет | 10 | 5 | 6 | 0 | 16 |
| 20 | 220 | Почуття, характер і стосунки | vocabulary | `de-a2-gefuehle` | емоції (froh, traurig, wütend, aufgeregt), характер (schüchtern, großzügig), sich verlieben, sich streiten, Wie fühlst du dich? | 40 | 6 | 6 | 0 | 12 |
| 21 | 221 | Аудіювання — телефонні розмови й повідомлення | listening | `de-a2-hoeren-telefon` | запис до лікаря, бронювання, Mailbox; Kann ich bitte … sprechen?, Ich rufe zurück; записати ім'я, номер, час (`[!listen] type: fill`) | 15 | 18 | 6 | 0 | 12 |
| 22 | 222 | Майбутнє — werden і Präsens | grammar | `de-a2-zukunft` | Präsens + маркер часу (Morgen fahre ich…) як норма, Futur I werden + Infinitiv для планів і обіцянок, werden = «ставати» (Ich werde Arzt) | 10 | 5 | 5 | 0 | 14 |
| 23 | 223 | Сполучники — und, aber, denn, sondern і deshalb, trotzdem | grammar | `de-a2-konnektoren` | позиція 0 (und, aber, oder, denn, sondern) vs прислівники з інверсією (deshalb, trotzdem, dann, danach); aber vs sondern | 20 | 4 | 5 | 0 | 16 |
| 24 | 224 | Гроші, банк, пошта й послуги | vocabulary | `de-a2-geld` | bar / mit Karte zahlen, das Girokonto, die Überweisung, die IBAN, Pfand, Kassenbon, Paket abholen, Reklamation; Landeskunde: «Nur Bares ist Wahres» — готівка в Німеччині | 40 | 6 | 6 | 0 | 12 |
| 25 | 225 | Непрямі питання — Wissen Sie, wo…, ob | grammar | `de-a2-indirekte-fragen` | Können Sie mir sagen, wann der Zug fährt?; ob для так / ні-питань; дієслово в кінці; ввічливість у Behörde | 10 | 5 | 6 | 0 | 16 |
| 26 | 226 | Правопис і правила читання — ß, ss, ie, німе h | pronunciation | `de-a2-rechtschreibung` | ß після довгого голосного (Straße, aber Fluss), Dehnungs-h, ie, ä vs e, велика літера іменників, у Швейцарії без ß | 30 | 6 | 8 | 8 | 12 |
| 27 | 227 | Свята й традиції | vocabulary | `de-a2-feste` | Weihnachten, Advent, Silvester, Ostern, Karneval / Fasching, Geburtstag, Frohe Weihnachten!, Herzlichen Glückwunsch!; Landeskunde: Weihnachtsmarkt — текст 100 слів; посилання на «Deutschland» A2-05, 06 | 40 | 6 | 6 | 0 | 12 |
| 28 | 228 | Читання й письмо — email, запрошення, форум | skills | `de-a2-lesen-schreiben` | короткі статті й листи (gist / detail), неформальний email (Liebe…, Viele Grüße), запрошення й відповідь, допис ≈ 40 слів — формат Goethe A2 Schreiben; Landeskunde: оголошення в Kleinanzeigen | 20 | 4 | 3 | 0 | 14 |
| 29 | 229 | Ситуації — Bürgeramt, Anmeldung, огляд квартири, аптека | skills | `de-a2-situationen` | рольові діалоги: Anmeldung der Wohnung (Meldebescheinigung, Termin online), огляд квартири, аптека, банк — Ich möchte ein Konto eröffnen; формули ввічливості | 35 | 10 | 12 | 0 | 12 |
| 30 | 230 | Підсумок A2 — тест рівня | review | `de-a2-review` | змішані тести, Perfekt і 60 неправильних, відмінки й прийменники, диктант, вимова, чекліст «я вмію» A2 | 0 | 10 | 6 | 6 | 30 |

**Підсумок A2:** 30 тем · grammar 14 · vocabulary 7 · pronunciation 4 · listening 2 · skills 2 · review 1 · 711 `[!word]` · 201 `[!listen]` · 190 `[!speak]` · 28 `[!pair]` · 440 `[!quiz]` · **1570 вправ**.

---

## 6. B1 — Середній (Threshold) · Goethe B1, telc Deutsch B1, DTZ, ÖSD ZB1

**Ціль:** розуміти головне в чіткому мовленні; впоратися з більшістю ситуацій побуту в DACH; звʼязно описувати
досвід і обґрунтовувати думку. **Лексика:** + ≈ 1000 (разом ≈ 2500). Рівень B1 — вимога для натуралізації в
Німеччині та типова ціль інтеграційного курсу (DTZ); рецензент перевіряє формулювання на дату публікації.

- **Граматика:** Präteritum; Plusquamperfekt і часові підрядні (als / wenn / nachdem / bevor / seit / bis);
  Genitiv і прийменники з Genitiv; дієслова з прийменниками й da- / wo-сполуки; відносні речення (з прийменником,
  dessen / deren, wo, was); Infinitiv mit zu; um … zu / damit / ohne … zu / statt … zu; Konjunktiv II (теперішній);
  Passiv Präsens / Präteritum; TeKaMoLo і місце nicht; парні сполучники; прикметник / Partizip як іменник;
  модальні частки I.
- **Лексика:** стосунки; медіа; довкілля й Mülltrennung; Bewerbung; Wohnungssuche; установи й страхування;
  словотвір I; Redemittel думки.
- **Формат іспиту з B1:** у темах B1-09, 21, 27, 28, 29 — завдання в форматі Goethe / telc B1 (§10).

| № | ch | Назва | Вид | id | Зміст | W | L | S | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 301 | Präteritum — оповідь у минулому | grammar | `de-b1-praeteritum` | правильні (-te) й неправильні (ging, kam, sah) у письмовій оповіді, Perfekt vs Präteritum (розмова / текст, північ / південь); Landeskunde: казка братів Грімм — адаптований текст | 45 | 6 | 6 | 0 | 16 |
| 02 | 302 | Plusquamperfekt і часові речення — als, wenn, nachdem, bevor | grammar | `de-b1-plusquamperfekt` | hatte / war + Partizip II; als (один раз у минулому) vs wenn (щоразу); nachdem, bevor, während, seit, bis, sobald; `[!diagram]` timeline | 12 | 6 | 6 | 0 | 16 |
| 03 | 303 | Родовий відмінок — Genitiv | grammar | `de-b1-genitiv` | des Mannes, der Frau, des Kindes, -s / -es, Annas Buch, wessen?, von + Dativ у розмові; wegen, trotz, während, statt + Genitiv | 15 | 5 | 5 | 0 | 16 |
| 04 | 304 | Стосунки, сімʼя й спільне життя | vocabulary | `de-b1-beziehungen` | Partnerschaft, Ehe, WG, Patchworkfamilie, sich trennen, sich verstehen mit, Konflikte; Landeskunde: «Wie Deutsche zusammenleben» — статистика | 45 | 6 | 6 | 0 | 12 |
| 05 | 305 | Твердий приступ і збіг приголосних | pronunciation | `de-b1-knacklaut` | Knacklaut — німецька не «зливає» слова (be|achten, am |Abend), групи приголосних (Herbststurm, du kämpfst), pf, ts, -ng без [g] | 10 | 10 | 12 | 6 | 12 |
| 06 | 306 | Дієслова з прийменниками — warten auf, sich interessieren für | grammar | `de-b1-verben-praep` | 50 найчастіших (denken an, sich freuen auf / über, Angst haben vor, teilnehmen an), відмінок після прийменника, worauf? / darauf, auf wen? (про людей) | 40 | 5 | 6 | 0 | 18 |
| 07 | 307 | Медіа, інтернет і технології | vocabulary | `de-b1-medien` | soziale Netzwerke, posten, teilen, Datenschutz, das Handy, Streaming, Fake News; Landeskunde: Rundfunkbeitrag і громадське мовлення (ARD, ZDF) | 45 | 6 | 6 | 0 | 12 |
| 08 | 308 | Відносні речення — der, die, das, з прийменником, wo, was | grammar | `de-b1-relativsaetze` | Relativpronomen у Nom / Akk / Dat (denen!), dessen / deren (Genitiv), mit dem, wo для місця, was після alles / nichts / das Beste; кома | 12 | 5 | 5 | 0 | 18 |
| 09 | 309 | Аудіювання — радіо, новини, подкасти | listening | `de-b1-hoeren-nachrichten` | новини повільним темпом (формат Langsam gesprochene Nachrichten), подкасти; gist → detail, передбачення змісту; формат Goethe B1 Hören Teil 1–4 | 15 | 18 | 3 | 0 | 12 |
| 10 | 310 | Інфінітив із zu | grammar | `de-b1-infinitiv-zu` | Ich habe vor, … zu; Es ist wichtig, … zu; Lust / Zeit haben, … zu; anzurufen (zu всередині відокремлюваних); коли без zu (модальні, lassen, gehen) | 15 | 5 | 5 | 0 | 16 |
| 11 | 311 | Мета й спосіб — um … zu, damit, ohne … zu, statt … zu | grammar | `de-b1-um-zu` | um … zu (той самий підмет) vs damit (різні), ohne … zu / ohne dass, statt … zu / statt dass; пастка «für zu» | 10 | 5 | 5 | 0 | 16 |
| 12 | 312 | Довкілля, природа й сортування сміття | vocabulary | `de-b1-umwelt` | Klima, Energie sparen, Müll trennen (Gelber Sack, Biotonne, Altglas), Pfandflasche, Naturschutz; Landeskunde: Mülltrennung — текст і схема | 45 | 6 | 6 | 0 | 12 |
| 13 | 313 | Розмовні скорочення — hab', 'ne, haste, gibt's | pronunciation | `de-b1-reduktionen` | редукції швидкого мовлення (ich hab', 'ne Frage, haste mal, isses, nich), коли їх не пишуть; впізнавання на слух | 15 | 12 | 10 | 4 | 12 |
| 14 | 314 | Konjunktiv II — würde, hätte, wäre і ввічливість | grammar | `de-b1-konjunktiv2` | würde + Infinitiv, hätte, wäre, könnte, müsste, sollte; Könnten Sie…?, Ich hätte gern…, Du solltest…; поради й прохання | 12 | 6 | 6 | 0 | 18 |
| 15 | 315 | Нереальні умови й бажання — Wenn ich … hätte | grammar | `de-b1-irreal` | Wenn ich mehr Zeit hätte, würde ich…; Ich wünschte, …; Wenn … doch nur …!; реальні vs нереальні умови; `[!diagram]` compare | 10 | 6 | 6 | 0 | 16 |
| 16 | 316 | Робота, резюме й співбесіда | vocabulary | `de-b1-bewerbung` | Stellenanzeige, Bewerbung, Anschreiben, tabellarischer Lebenslauf, Vorstellungsgespräch, Probezeit, Arbeitsvertrag, Gehalt brutto / netto, Arbeitszeugnis; Landeskunde: Anerkennung ukrainischer дипломів | 50 | 6 | 8 | 0 | 12 |
| 17 | 317 | Пасив — Präsens і Präteritum | grammar | `de-b1-passiv` | wird gemacht, wurde gebaut, von + Dativ, коли пасив природніший (процеси, правила, новини); Hier wird nicht geraucht | 15 | 5 | 5 | 0 | 18 |
| 18 | 318 | Пошук житла — оренда, Kaution, WG | vocabulary | `de-b1-wohnungssuche` | Kaltmiete / Warmmiete, Nebenkosten, Kaution, Mietvertrag, Schufa, Besichtigung, Nachmieter, Hausordnung, Ruhezeiten; Landeskunde: «Mieten in München» — текст з оголошеннями | 45 | 6 | 8 | 0 | 12 |
| 19 | 319 | Порядок слів у середині речення — TeKaMoLo, місце nicht | grammar | `de-b1-wortstellung` | Mittelfeld: Temporal – Kausal – Modal – Lokal, Dativ перед Akkusativ (іменники), займенники вперед, nicht перед тим, що заперечує; `[!diagram]` flow | 10 | 4 | 5 | 0 | 18 |
| 20 | 320 | Парні сполучники — sowohl … als auch, weder … noch, je … desto | grammar | `de-b1-zweiteilig` | entweder … oder, nicht nur … sondern auch, zwar … aber, je … desto / umso; порядок слів після desto | 15 | 4 | 4 | 0 | 16 |
| 21 | 321 | Аудіювання — інтервʼю й розмови носіїв | listening | `de-b1-hoeren-interviews` | інтервʼю, розмови 2–3 мовців, думки й ставлення, нотатки; формат telc B1 Hörverstehen (richtig / falsch) | 15 | 18 | 4 | 0 | 12 |
| 22 | 322 | Прикметник і дієприкметник як іменник | grammar | `de-b1-adj-nomen` | der / die Deutsche, ein Deutscher, die Bekannten, das Gute, etwas Neues; Partizip I / II як прикметник (das lachende Kind, die geschlossene Tür) | 20 | 4 | 4 | 0 | 16 |
| 23 | 323 | Словотвір I — складні слова й суфікси | vocabulary | `de-b1-wortbildung` | Komposita (останнє слово дає рід: das Haus + die Tür = die Haustür), Fugen-s (Arbeitsplatz), -ung, -heit, -keit, -schaft, -er, -lich, -bar, -ig; читання довгих слів | 50 | 4 | 4 | 0 | 14 |
| 24 | 324 | Мовні звороти B1 — думка, згода, незгода | vocabulary | `de-b1-redemittel` | Meiner Meinung nach…, Ich bin der Meinung, dass…, Da stimme ich zu, Das sehe ich anders, Einerseits … andererseits; 40 сталих виразів | 45 | 6 | 6 | 0 | 14 |
| 25 | 325 | Модальні частки I — doch, mal, ja, denn | grammar | `de-b1-partikeln` | Komm doch mal vorbei!, Das ist ja toll!, Wie heißt du denn?; що вони додають (мʼякість, здивування) і чому їх немає в підручниковому перекладі | 20 | 8 | 8 | 0 | 16 |
| 26 | 326 | Установи й страхування — Ausländerbehörde, Jobcenter, Krankenkasse | skills | `de-b1-behoerden` | Termin vereinbaren, Antrag stellen, Unterlagen, Aufenthaltstitel, Bescheid, Frist; Haftpflichtversicherung; лист від установи — як читати; Landeskunde: «Behördendeutsch» (факти про статус українців перевіряє рецензент на дату публікації) | 45 | 6 | 6 | 0 | 12 |
| 27 | 327 | Письмо — особистий і офіційний лист, допис на форумі | skills | `de-b1-schreiben` | структура (Anrede, Betreff, Grußformel), formell vs informell, абзаци, звʼязки; три завдання як у Goethe B1 Schreiben (email 80 слів, Forumsbeitrag 80, formelle Mail 40) | 25 | 3 | 3 | 0 | 14 |
| 28 | 328 | Читання — статті, оголошення, правила | skills | `de-b1-lesen` | gist / detail / selektiv, здогадка з контексту, richtig / falsch; п'ять частин як у Goethe B1 Lesen; Landeskunde: тексти про Bundesländer | 25 | 3 | 3 | 0 | 14 |
| 29 | 329 | Говоріння — спланувати разом, презентація, думка | skills | `de-b1-sprechen` | gemeinsam etwas planen, Präsentation з 5 слайдів, реагування на питання; формат Goethe і telc B1 Sprechen; фрази-заповнювачі (also, na ja, sozusagen) | 25 | 8 | 14 | 0 | 12 |
| 30 | 330 | Підсумок B1 — тест рівня | review | `de-b1-review` | змішаний тест, аудіювання, вимова, мінітест у форматі Goethe B1 (Lesen + Hören), чекліст «я вмію» B1 | 0 | 10 | 6 | 4 | 30 |

**Підсумок B1:** 30 тем · grammar 14 · vocabulary 7 · pronunciation 2 · listening 2 · skills 4 · review 1 · 751 `[!word]` · 202 `[!listen]` · 181 `[!speak]` · 14 `[!pair]` · 452 `[!quiz]` · **1600 вправ**.

---

## 7. B2 — Вище середнього (Vantage) · Goethe B2, telc B2, ÖSD ZB2, TestDaF TDN 3, DSH-1

**Ціль:** розуміти основний зміст складних текстів; спілкуватися спонтанно з носіями; детально писати й
аргументувати. **Лексика:** + ≈ 1800 (разом ≈ 4300).

- **Граматика:** система часів і Futur II; Passiv усіх часів, з модальним, Vorgangs- і Zustandspassiv;
  Passiversatzformen; Konjunktiv II минулого (з подвійним інфінітивом); als ob, zu … als dass; Konjunktiv I і
  непряма мова; субʼєктивні модальні; конектори; Partizipialattribute; Nominalisierung I.
- **Лексика:** робота, наука, суспільство й право, здоровʼя, економіка, культура; префіксальні дієслова;
  Redewendungen; Funktionsverbgefüge I; словотвір II.
- **Вимова:** іншомовні слова; регіональна вимова. **Аудіювання:** лекції, фільми, ток-шоу.

| № | ch | Назва | Вид | id | Зміст | W | L | S | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 401 | Система часів і Futur II | grammar | `de-b2-zeiten` | усі шість часів, Perfekt vs Präteritum у регіонах і жанрах, Futur I / II для припущень (Er wird schon angekommen sein), `[!diagram]` карта часів | 10 | 6 | 6 | 0 | 18 |
| 02 | 402 | Пасив II — усі часи, з модальним, Zustandspassiv | grammar | `de-b2-passiv` | ist gebaut worden, wird gebaut werden, muss repariert werden, Vorgangspassiv vs Zustandspassiv (wird geöffnet / ist geöffnet), безособовий пасив (Es wird getanzt) | 15 | 5 | 5 | 0 | 18 |
| 03 | 403 | Замінники пасиву — man, sich lassen, sein + zu, -bar | grammar | `de-b2-passiversatz` | Das lässt sich lösen, Das ist zu erledigen, Das ist machbar, man; коли що вживати; Amtsdeutsch-приклади | 20 | 4 | 4 | 0 | 16 |
| 04 | 404 | Konjunktiv II минулого — hätte gemacht, wäre gekommen | grammar | `de-b2-konjunktiv2-vergangenheit` | нереальне минуле, докір і жаль (Du hättest anrufen sollen — подвійний інфінітив), Wenn ich das gewusst hätte… | 10 | 6 | 6 | 0 | 18 |
| 05 | 405 | Нереальні порівняння й наслідки — als ob, zu … als dass | grammar | `de-b2-als-ob` | als ob / als wenn / als + V2 (Er tut, als wäre er krank), zu … als dass, ohne dass, sodass / so … dass | 10 | 5 | 5 | 0 | 16 |
| 06 | 406 | Konjunktiv I — непряма мова в новинах | grammar | `de-b2-konjunktiv1` | er sei, er habe, er komme; Ersatz через Konjunktiv II; дієслова-вводи (sagen, behaupten, betonen); новинний стиль ZDF / Tagesschau | 20 | 6 | 5 | 0 | 18 |
| 07 | 407 | Субʼєктивні модальні — soll, will, muss, dürfte | grammar | `de-b2-modal-subjektiv` | Er soll reich sein (кажуть), Sie will das gesehen haben (стверджує), Das muss / dürfte / kann stimmen — шкала впевненості | 15 | 6 | 6 | 0 | 16 |
| 08 | 408 | Конектори й підрядні — obwohl, indem, sodass, falls | grammar | `de-b2-konnektoren` | obwohl / trotzdem / trotz, während (час і контраст), indem / dadurch dass, sodass, falls / sofern, anstatt dass; таблиця «сполучник — прислівник — прийменник» | 30 | 4 | 4 | 0 | 18 |
| 09 | 409 | Дієприкметникові означення — перші кроки | grammar | `de-b2-partizipialattribute` | das lachende Kind → das laut lachende Kind → das über den Witz laut lachende Kind; Partizip I / II, розгортання у відносне речення | 15 | 4 | 4 | 0 | 16 |
| 10 | 410 | Номіналізація I — Verbalstil і Nominalstil | grammar | `de-b2-nominalisierung` | beim Fahren, nach dem Essen, die Entscheidung treffen; перетворення weil → wegen, wenn → bei, obwohl → trotz; газетний стиль | 30 | 3 | 3 | 0 | 16 |
| 11 | 411 | Іншомовні слова й англіцизми — вимова й рід | pronunciation | `de-b2-fremdwoerter` | Restaurant, Chance, Computer, das Handy, der Laptop, downloaden (hat gedownloadet), рід англіцизмів; Denglisch | 30 | 8 | 10 | 4 | 12 |
| 12 | 412 | Регіональна вимова — Північ, Південь, Схід | pronunciation | `de-b2-regional` | -ig як [ɪk] на півдні, Tach / nich / ne, st на півночі, саксонське й баварське забарвлення; розуміти, не копіювати | 15 | 14 | 6 | 4 | 12 |
| 13 | 413 | Аудіювання — лекції й конспект | listening | `de-b2-hoeren-vortraege` | signposting (zunächst, im Folgenden, zusammenfassend), конспект, структура доповіді; формат Goethe B2 Hören Teil 4 | 20 | 16 | 3 | 0 | 12 |
| 14 | 414 | Аудіювання — фільми, серіали й ток-шоу | listening | `de-b2-hoeren-filme` | природний темп, перебивання, гумор, розмовна лексика; уривки в стилі Tatort і ток-шоу | 20 | 18 | 6 | 0 | 12 |
| 15 | 415 | Робота — наради, переговори, ділове листування | vocabulary | `de-b2-arbeitswelt` | Besprechung, Tagesordnung, Frist, verhandeln, Rückmeldung, Betriebsrat, Kündigungsfrist, Homeoffice; Sehr geehrte Damen und Herren… | 50 | 6 | 8 | 0 | 12 |
| 16 | 416 | Наука, технології й майбутнє | vocabulary | `de-b2-wissenschaft` | Forschung, KI, Raumfahrt, Medizin; Landeskunde: Fraunhofer, Max-Planck — текст | 45 | 6 | 6 | 0 | 12 |
| 17 | 417 | Суспільство, політика й право | vocabulary | `de-b2-gesellschaft` | Bundestag, Wahl, Partei, Gericht, Gesetz, Klage, Grundrechte; Landeskunde: як голосують німці (Erst- und Zweitstimme) | 50 | 6 | 6 | 0 | 12 |
| 18 | 418 | Здоровʼя, психологія й спосіб життя | vocabulary | `de-b2-gesundheit` | Stress, Burnout, Vorsorge, Kur, Ernährung, Sport im Verein; Landeskunde: Vereinskultur | 45 | 6 | 6 | 0 | 12 |
| 19 | 419 | Гроші, економіка й споживання | vocabulary | `de-b2-wirtschaft` | Inflation, Steuer, Steuererklärung, Rente, Kredit, Nachhaltigkeit, Konsum; Landeskunde: Mittelstand | 45 | 6 | 6 | 0 | 12 |
| 20 | 420 | Мистецтво, культура й рецензії | vocabulary | `de-b2-kultur` | кіно, книжки, музика, театр, лексика оцінки (überzeugend, langatmig); Landeskunde: Berlinale | 45 | 6 | 6 | 0 | 12 |
| 21 | 421 | Префіксальні дієслова — über-, um-, durch-, unter- | vocabulary | `de-b2-praefixverben` | відокремлювані й невідокремлювані з тими самими префіксами: ˈumfahren vs umˈfahren, übersetzen, wiederholen; наголос змінює значення | 50 | 6 | 8 | 0 | 16 |
| 22 | 422 | Фразеологізми й сталі вирази B2 | vocabulary | `de-b2-redewendungen` | Daumen drücken, Tomaten auf den Augen haben, ins Fettnäpfchen treten, die Nase voll haben; парні вирази (ab und zu, nach und nach) | 45 | 6 | 8 | 0 | 14 |
| 23 | 423 | Сполуки іменника з дієсловом I — Funktionsverbgefüge | vocabulary | `de-b2-nvv` | eine Entscheidung treffen, in Frage kommen, zur Verfügung stehen, Kritik üben, einen Antrag stellen; дієслово ↔ сполука | 50 | 4 | 4 | 0 | 14 |
| 24 | 424 | Словотвір II — un-, miss-, ver-, zer- і -los, -haft, -mäßig | vocabulary | `de-b2-wortbildung` | заперечні й модифікувальні префікси, суфікси прикметників, конверсія (das Laufen), значення ver- (verkaufen, sich verlaufen) | 50 | 4 | 4 | 0 | 14 |
| 25 | 425 | Письмо — есе-аргумент, допис, офіційна скарга | skills | `de-b2-schreiben` | Erörterung / Forumsbeitrag ≈ 150 слів, formelle Mail ≈ 100 слів (як у Goethe B2 Schreiben), структура, звʼязність, регістр | 30 | 3 | 3 | 0 | 14 |
| 26 | 426 | Говоріння — доповідь, дискусія, аргументація | skills | `de-b2-sprechen` | Vortrag ≈ 4 хв, дискусія з партнером, контраргументи, ввічлива незгода; формат Goethe B2 Sprechen | 30 | 8 | 14 | 0 | 12 |
| 27 | 427 | Читання — довгі тексти, позиції й висновки | skills | `de-b2-lesen` | inference, позиція автора, gapped text, matching; формат Goethe B2 Lesen | 30 | 3 | 3 | 0 | 14 |
| 28 | 428 | Ситуації — суперечка з орендодавцем, скарга, банк, батьківські збори | skills | `de-b2-situationen` | складні побутові й робочі діалоги, Widerspruch, Mängelanzeige, Kündigung, Elternabend, ескалація скарги | 35 | 10 | 12 | 0 | 12 |
| 29 | 429 | Підсумок B2 — тест рівня | review | `de-b2-review` | змішаний тест, аудіювання, вимова, міні-Goethe B2 (Lesen + Hören), чекліст «я вмію» B2 | 0 | 10 | 6 | 4 | 30 |

**Підсумок B2:** 29 тем · grammar 10 · vocabulary 10 · pronunciation 2 · listening 2 · skills 4 · review 1 · 860 `[!word]` · 195 `[!listen]` · 173 `[!speak]` · 12 `[!pair]` · 430 `[!quiz]` · **1670 вправ**.

---

## 8. C1 і C2

### 8.1 C1 — Просунутий · Goethe C1, telc C1 (Hochschule), ÖSD ZC1, TestDaF TDN 4–5, DSH-2

**Ціль:** розуміти довгі складні тексти й імпліцитні значення; висловлюватися вільно; гнучко вживати мову в
академічних і професійних цілях. **Лексика:** + ≈ 2000 (разом ≈ 6000+).

- **Граматика:** розширені Partizipialattribute й Gerundiv; Nominal- / Verbalstil; Funktionsverbgefüge II;
  модальні частки II; непряма мова повністю; умова без wenn; Vorfeld, Ausklammerung, тема-рема; когезія;
  прийменники писемної мови (Genitiv).
- **Лексика:** ідіоми; мова науки (DSH / TestDaF); професійна комунікація; синоніми й конотації; колокації;
  суспільні дебати; словотвір III. **Регістр:** du / Sie, Amtsdeutsch, Umgangssprache, Jugendsprache.

| № | ch | Назва | Вид | id | Зміст | W | L | S | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 501 | Розширені дієприкметникові означення й звороти | grammar | `de-c1-partizip` | die von der Regierung beschlossenen Maßnahmen, das zu lösende Problem (Gerundiv), Partizipialsätze (Von der Arbeit erschöpft, ging er…) | 12 | 4 | 4 | 0 | 16 |
| 02 | 502 | Nominalstil і Verbalstil — перетворення | grammar | `de-c1-nominalstil` | обидва напрями, Genitivketten, прийменникові групи; коли номінальний стиль доречний (наука, право) і коли шкодить | 30 | 3 | 3 | 0 | 16 |
| 03 | 503 | Сполуки іменника з дієсловом II | grammar | `de-c1-fvg` | zur Verfügung stellen, in Kraft treten, zur Anwendung kommen (пасивне значення), in Betracht ziehen; 60 сполук | 40 | 4 | 4 | 0 | 16 |
| 04 | 504 | Модальні частки II — eben, halt, wohl, schon, ruhig, bloß | grammar | `de-c1-partikeln` | Das ist eben so, Komm ruhig rein, Was machst du bloß?, Er wird wohl krank sein; частки в інтонації | 20 | 10 | 10 | 0 | 16 |
| 05 | 505 | Непряма мова — Konjunktiv I і II, вводи | grammar | `de-c1-indirekte-rede` | повна система, Ersatzformen, дієслова-вводи (einräumen, bestreiten, hervorheben), непряма мова в Wissenschaft і Presse | 25 | 6 | 5 | 0 | 16 |
| 06 | 506 | Умова без wenn — Sollte…, Hätte ich…, angenommen | grammar | `de-c1-konditional` | Sollten Sie Fragen haben…, Hätte ich das gewusst…, vorausgesetzt, dass; im Falle / bei + Nominalisierung | 12 | 5 | 5 | 0 | 16 |
| 07 | 507 | Будова речення — Vorfeld, Ausklammerung, тема й рема | grammar | `de-c1-satzbau` | що ставити на перше місце, es як заповнювач, винесення за дужку (Ausklammerung), відомe → нове | 10 | 5 | 5 | 0 | 16 |
| 08 | 508 | Звʼязність тексту — конектори, відсилання, wobei | grammar | `de-c1-kohaerenz` | dieser / jener / Letzterer, dabei, wobei, wodurch, Pronominaladverbien, Rekurrenz, текст як ланцюг | 30 | 3 | 3 | 0 | 16 |
| 09 | 509 | Прийменники писемної мови — angesichts, aufgrund, hinsichtlich | grammar | `de-c1-genitiv-praep` | angesichts, aufgrund, hinsichtlich, bezüglich, zufolge, mittels, ungeachtet, infolge; Genitiv vs Dativ у розмові | 30 | 3 | 3 | 0 | 16 |
| 10 | 510 | Емфатична інтонація й контрастивний наголос | pronunciation | `de-c1-intonation` | Ich habe DAS nicht gesagt, іронія, ввічливість, частки в інтонації | 8 | 12 | 14 | 6 | 12 |
| 11 | 511 | Аудіювання — швидка розмова й регіональне забарвлення | listening | `de-c1-hoeren-schnell` | перекриття реплік, розмовні форми, австрійське й швейцарське забарвлення стандарту | 20 | 18 | 4 | 4 | 12 |
| 12 | 512 | Аудіювання — лекції, дебати, подкасти | listening | `de-c1-hoeren-vorlesung` | структура аргументу, позиція мовця, нотатки; формати TestDaF Hören і DSH Hörverstehen | 25 | 16 | 3 | 0 | 12 |
| 13 | 513 | Фразеологізми — тіло, тварини, кольори, їжа | vocabulary | `de-c1-idiome` | 50 ідіом з контекстом і регістром (jemandem einen Bären aufbinden, alles in Butter, blau machen) | 50 | 6 | 8 | 0 | 14 |
| 14 | 514 | Мова науки — лексика для університету | vocabulary | `de-c1-wissenschaftssprache` | Hypothese, belegen, erörtern, untersuchen, Befund, Ansatz; для DSH і TestDaF | 60 | 4 | 4 | 0 | 14 |
| 15 | 515 | Професійна комунікація — переговори, фідбек | vocabulary | `de-c1-beruf` | Moderation, Feedback, diplomatische Formulierungen, E-Mail-Ton, Duzen im Büro | 45 | 6 | 10 | 0 | 12 |
| 16 | 516 | Синоніми, конотації й відтінки значень | vocabulary | `de-c1-nuancen` | sparsam / geizig, ehrgeizig / verbissen, позитив / негатив, регістр синонімів | 50 | 4 | 4 | 0 | 16 |
| 17 | 517 | Колокації писемної мови | vocabulary | `de-c1-kollokationen` | Kritik üben, Bilanz ziehen, Maßnahmen ergreifen, eine Rolle spielen, scharf kritisieren | 60 | 4 | 4 | 0 | 14 |
| 18 | 518 | Регістр — du і Sie, Amtsdeutsch, розмовна й молодіжна мова | skills | `de-c1-register` | перемикання стилю, Duzen / Siezen у DACH, канцелярит ↔ звичайна мова, Jugendsprache (lost, cringe, Digga) | 40 | 6 | 6 | 0 | 14 |
| 19 | 519 | Письмо — Erörterung, Stellungnahme, опис графіка | skills | `de-c1-schreiben` | структура C1, когезія, опис діаграми (TestDaF Schreiben), 250+ слів | 30 | 3 | 3 | 0 | 14 |
| 20 | 520 | Письмо — заява про роботу, діловий лист, скарга C1 | skills | `de-c1-korrespondenz` | Anschreiben, Bewerbung, Absage, Mahnung, Beschwerde на C1; стиль DIN 5008 | 35 | 3 | 3 | 0 | 14 |
| 21 | 521 | Читання — складні тексти, аргументація, підтекст | skills | `de-c1-lesen` | імпліцитне, іронія, логіка аргументу; формати Goethe C1, TestDaF Lesen | 35 | 3 | 3 | 0 | 14 |
| 22 | 522 | Говоріння — презентація, дискусія, модерація | skills | `de-c1-sprechen` | Vortrag, Q&A, ведення дискусії, медіація; формати Goethe C1 і TestDaF Sprechen | 30 | 8 | 16 | 0 | 12 |
| 23 | 523 | Суспільні дебати — міграція, цифровізація, клімат, памʼять | vocabulary | `de-c1-debatten` | лексика суспільних дебатів, Erinnerungskultur, баланс думок | 50 | 6 | 8 | 0 | 12 |
| 24 | 524 | Словотвір III — фахові складні слова, be-, ent-, er-, -ismus | vocabulary | `de-c1-wortbildung` | значення префіксів be- / ent- / er-, латинські суфікси, розшифровка фахових Komposita | 50 | 4 | 4 | 0 | 14 |
| 25 | 525 | Підсумок C1 — тест рівня | review | `de-c1-review` | змішаний тест, аудіювання, вимова, міні-TestDaF / Goethe C1 (Lesen + Hören), чекліст «я вмію» C1 | 0 | 10 | 6 | 4 | 30 |

**Підсумок C1:** 25 тем · grammar 9 · vocabulary 7 · pronunciation 1 · listening 2 · skills 5 · review 1 · 797 `[!word]` · 156 `[!listen]` · 142 `[!speak]` · 14 `[!pair]` · 374 `[!quiz]` · **1483 вправи**.

### 8.2 C2 — Вільне володіння · Goethe-Zertifikat C2: Großes Deutsches Sprachdiplom, DSH-3

**Ціль:** розуміти практично все; резюмувати з різних джерел; висловлюватися спонтанно й дуже точно, розрізняючи
тонкі відтінки. **Лексика:** + ≈ 3000 (разом ≈ 9000+, рецептивно більше).

- **Граматика:** стилістичний порядок слів і емфаза; тонкощі часів і модальності; Schachtelsätze й паралелізм;
  Konjunktiv у літературі, праві й інструкціях.
- **Лексика:** Amtsdeutsch і юридична мова; прислівʼя й крилаті вислови; розмовна мова й сленг; етимологія;
  точність і евфемізми; хибні друзі (систематизація); фахова німецька.
- **Вимова:** варіанти мови DACH; просодія виступу. **Навички:** гумор, читання літератури, стилістика, жанри,
  виступ і переговори, культурні коди, медіація з української.

| № | ch | Назва | Вид | id | Зміст | W | L | S | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 601 | Стилістичний порядок слів — емфаза й Vorfeld | grammar | `de-c2-wortstellung` | Geschenkt hat er mir nichts, фронтування, Ausklammerung як стиль | 8 | 5 | 6 | 0 | 16 |
| 02 | 602 | Тонкощі часів і модальності | grammar | `de-c2-tempus-nuancen` | історичний Präsens, Futur як припущення, Konjunktiv-нюанси, Präteritum vs Perfekt як стиль | 8 | 6 | 6 | 0 | 16 |
| 03 | 603 | Складні речення — вкладення, паралелізм, ланцюги означень | grammar | `de-c2-satzgefuege` | Schachtelsatz, паралелізм, ритм речення; читати Канта й Томаса Манна | 10 | 4 | 4 | 0 | 14 |
| 04 | 604 | Konjunktiv у літературі, праві й рецептах | grammar | `de-c2-konjunktiv-stil` | Man nehme…, Es lebe…, Gott sei Dank, Konjunktiv I у законах і інструкціях | 12 | 4 | 4 | 0 | 16 |
| 05 | 605 | Канцелярська й юридична мова | vocabulary | `de-c2-amtsdeutsch` | Bescheid, Widerspruch, Frist, Paragraf, Antragsteller, unverzüglich; як читати рішення Behörde | 50 | 4 | 4 | 0 | 14 |
| 06 | 606 | Прислівʼя, крилаті вислови й цитати | vocabulary | `de-c2-sprichwoerter` | Goethe, Schiller, Luther-Bibel, Brecht; Ende gut, alles gut; Das also war des Pudels Kern | 50 | 6 | 8 | 0 | 14 |
| 07 | 607 | Розмовна мова, молодіжна мова й сленг | vocabulary | `de-c2-umgangssprache` | Umgangssprache DACH, Jugendwort des Jahres, регіоналізми; коли доречно | 50 | 8 | 6 | 0 | 14 |
| 08 | 608 | Етимологія — германські корені й запозичення | vocabulary | `de-c2-etymologie` | індоєвропейські родичі (Mutter — мати), латинь, французька, англійська, слов'янські запозичення (Grenze, Quark, Gurke) | 60 | 3 | 3 | 0 | 14 |
| 09 | 609 | Точність — пом'якшення, евфемізми, іронія | vocabulary | `de-c2-praezision` | nicht ganz unproblematisch, suboptimal, freigestellt werden; Litotes | 40 | 6 | 6 | 0 | 14 |
| 10 | 610 | Гумор, іронія й гра слів | skills | `de-c2-humor` | Kabarett, Wortspiele, Loriot, німецький гумор — стереотипи й реальність | 30 | 8 | 6 | 0 | 12 |
| 11 | 611 | Варіанти мови — Австрія, Швейцарія, діалекти | pronunciation | `de-c2-varietaeten` | плюрицентрична німецька, австрійська й швейцарська норма, Hochdeutsch vs Mundart, впізнавання на слух | 30 | 18 | 6 | 6 | 12 |
| 12 | 612 | Аудіювання — радіо, кабаре, ток-шоу | listening | `de-c2-hoeren-radio` | кілька мовців, шум, натяки, швидкий темп; формат Goethe C2 Hören | 25 | 18 | 3 | 0 | 12 |
| 13 | 613 | Просодія на рівні носія — виступ, паузи, риторика | pronunciation | `de-c2-prosodie` | членування, паузи, темп, емфаза у виступі | 10 | 10 | 16 | 4 | 12 |
| 14 | 614 | Читання — художня література, есеїстика, юридичні тексти | skills | `de-c2-lesen` | стиль автора, архаїзми, юридичні конструкції; формат Goethe C2 Lesen | 40 | 3 | 3 | 0 | 14 |
| 15 | 615 | Письмо — стилістика й редагування | skills | `de-c2-stil` | ясність, ритм, переформулювання (як у GDS Schreiben Teil 1), редагування власного тексту | 30 | 2 | 2 | 0 | 14 |
| 16 | 616 | Письмо — рецензія, лист до редакції, коментар, есе | skills | `de-c2-genres` | жанрові конвенції, заголовок, лід; Leserbrief / Rezension як у GDS Schreiben Teil 2 | 30 | 2 | 2 | 0 | 14 |
| 17 | 617 | Говоріння — виступ, дебати, переговори | skills | `de-c2-sprechen` | 5-хвилинна доповідь, Pro-und-Kontra, буферні фрази, імпровізація; формат GDS Sprechen | 30 | 8 | 16 | 0 | 12 |
| 18 | 618 | Хибні друзі й кальки — пастки для українців | vocabulary | `de-c2-falsche-freunde` | систематизація з усіх рівнів: Magazin, Dom, Akademiker, Konkurs, Termin, Billion, Stuhl, Familienname, Kran; кальки «eine Entscheidung machen» | 50 | 4 | 4 | 0 | 16 |
| 19 | 619 | Культурні коди — ввічливість, прямота, табу | skills | `de-c2-kulturcodes` | прямота як ввічливість, Smalltalk, табу-теми, Duzen; DACH-відмінності | 35 | 6 | 6 | 0 | 12 |
| 20 | 620 | Фахова німецька — IT, право, медицина, догляд, техніка | vocabulary | `de-c2-fachsprache` | ключова лексика галузей, Anerkennung, Fachsprachprüfung для лікарів (огляд), як учити фахову лексику далі | 60 | 6 | 6 | 0 | 12 |
| 21 | 621 | Медіація — переказ, резюме, усний переклад у побуті | skills | `de-c2-mediation` | CEFR Companion Volume: резюмувати з української німецькою, пояснити лист Behörde рідним, спростити для аудиторії | 25 | 6 | 8 | 0 | 12 |
| 22 | 622 | Підсумок C2 — екзамен рівня | review | `de-c2-review` | змішаний тест, аудіювання, вимова, міні-GDS (Lesen + Hören), чекліст «я вмію» C2 | 0 | 12 | 8 | 4 | 30 |

**Підсумок C2:** 22 теми · grammar 4 · vocabulary 7 · pronunciation 2 · listening 1 · skills 7 · review 1 · 683 `[!word]` · 149 `[!listen]` · 133 `[!speak]` · 14 `[!pair]` · 316 `[!quiz]` · **1295 вправ**.

**Разом:** A1 30 · A2 30 · B1 30 · B2 29 · C1 25 · C2 22 = **166 мовних тем** (як в англійському курсі).

### 8.3 Обсяги курсу (усі блоки)

| Блок | Тем | Вид | W | L | S | P | Q | Вправ |
|---|---|---|---|---|---|---|---|---|
| A1 | 30 | grammar 12 · vocabulary 9 · pronunciation 5 · listening 2 · skills 1 · review 1 | 728 | 206 | 191 | 70 | 418 | 1613 |
| A2 | 30 | grammar 14 · vocabulary 7 · pronunciation 4 · listening 2 · skills 2 · review 1 | 711 | 201 | 190 | 28 | 440 | 1570 |
| B1 | 30 | grammar 14 · vocabulary 7 · pronunciation 2 · listening 2 · skills 4 · review 1 | 751 | 202 | 181 | 14 | 452 | 1600 |
| B2 | 29 | grammar 10 · vocabulary 10 · pronunciation 2 · listening 2 · skills 4 · review 1 | 860 | 195 | 173 | 12 | 430 | 1670 |
| C1 | 25 | grammar 9 · vocabulary 7 · pronunciation 1 · listening 2 · skills 5 · review 1 | 797 | 156 | 142 | 14 | 374 | 1483 |
| C2 | 22 | grammar 4 · vocabulary 7 · pronunciation 2 · listening 1 · skills 7 · review 1 | 683 | 149 | 133 | 14 | 316 | 1295 |
| **Мовні теми A1–C2** | **166** | | **4530** | **1109** | **1010** | **152** | **2430** | **9231** |
| Deutschland (A2 · B1 · B2) | 33 | skills (landeskunde) | 710 | 155 | 99 | 0 | 372 | 1336 |
| Іспити (B1–C2) | 12 | skills (exam) | 240 | 200 | 64 | 0 | 312 | 816 |
| **Усього курс** | **211** | | **5480** | **1464** | **1173** | **152** | **3114** | **11383** |

Паритет з англійським курсом (166 тем, 9375 вправ, 4287 карток): мовні теми самі по собі дають ≥ 9000 вправ і ≥ 4000 карток; Deutschland та іспити — понад це.

### 8.4 Покриття граматики — контрольний список

| Явище | Теми |
|---|---|
| Aussprache: Umlaute, ch, r, Vokallänge, Auslautverhärtung, Wortakzent, Satzmelodie | A1-01, 05, 10, 17, 23 · A2-03, 13, 18, 26 · B1-05, 13 |
| Artikel, Genus (правила роду), Plural | A1-06, A1-15, B1-23 (рід Komposita), B2-11 (рід англіцизмів) |
| 4 Kasus — усі таблиці | A1-06, A1-11 (Akk) · A2-05 (Dat) · B1-03 (Gen) · A2-15, A2-17 (прикметник) |
| Personalpronomen в усіх відмінках; Possessivartikel | A1-03, A1-21, A2-19 |
| Präsens, Vokalwechsel, trennbare / untrennbare Verben | A1-07, A1-14, A1-16, B2-21 |
| Modalverben (обʼєктивні й субʼєктивні) | A1-19, A2-02, B2-07 |
| Imperativ | A1-24 |
| Perfekt (haben / sein, Partizip II), Präteritum, Plusquamperfekt | A1-26, A2-01, A2-02, B1-01, B1-02 |
| Futur I / II | A2-22, B2-01 |
| Reflexive Verben; Verben mit Präpositionen; da- / wo-Wörter | A2-14, B1-06 |
| Präpositionen: Dat, Akk, Wechsel, Gen; Zeit | A1-25, A2-06, A2-08, B1-03, C1-09 |
| Adjektivdeklination (слабка, мішана, сильна); Komparation; Adjektiv als Nomen | A2-15, A2-17, A2-10, B1-22 |
| Wortstellung: V2, Satzklammer, Inversion, TeKaMoLo, nicht | A1-09, A1-16, A2-23, B1-19, C1-07, C2-01 |
| Nebensätze: weil, dass, wenn, als, ob, obwohl, nachdem…; indirekte Fragen | A2-11, A2-25, B1-02, B2-05, B2-08 |
| Relativsätze (Genitiv, Präposition, wo, was) | B1-08 |
| Infinitiv mit zu; um … zu / damit; ohne … zu / statt … zu | B1-10, B1-11 |
| Passiv (Vorgang / Zustand, mit Modalverb, Ersatzformen) | B1-17, B2-02, B2-03 |
| Konjunktiv II (Gegenwart, Vergangenheit, Höflichkeit, irreale Wünsche / Vergleiche) | B1-14, B1-15, B2-04, B2-05 |
| Konjunktiv I, indirekte Rede | B2-06, C1-05, C2-04 |
| Partizipialattribute, Nominalstil, Funktionsverbgefüge | B2-09, B2-10, B2-23, C1-01, C1-02, C1-03 |
| Modalpartikeln | B1-25, C1-04 (+ інтонація C1-10) |
| Konnektoren, Textkohärenz | A2-23, B1-20, B2-08, C1-08 |
| Register: du / Sie, Amtsdeutsch, Umgangssprache | A1-02, C1-18, C2-05, C2-07 |
| Wortbildung: Komposita, Präfixe, Suffixe | B1-23, B2-21, B2-24, C1-24 |
| C2: стилістичні варіанти, Redewendungen, Sprichwörter | B2-22, C1-13, C2-01…04, C2-06, C2-09 |

---

## 9. Посібник «Deutschland: історія й культура»

Окремий посібник `content/Guides/Deutschland/` — **33 розділи**, написані **українською** з німецькими
ключовими термінами, `[!word]` (терміни, дати, назви — з артиклем), цитатами німецькою з перекладом і короткими
`[!listen]` (дата, назва, цитата, вимова імен — Goethe [ˈɡøːtə], Nietzsche, Köln). У кожному розділі: 10–12 `[!quiz]`
(факти, хронологія `type: order`, терміни `type: fill`), 4–6 `[!reel]` — цікаві факти, ≥ 1 `[!diagram]`
(хронологія — `timeline`, карта / порівняння — `compare`), «Landeskunde-Text» німецькою рівня розділу, «Джерела».

### 9.1 Як посібник стоїть у курсі (рішення й обґрунтування)

- **Три розділи курсу**, кожен відкривається після мовного рівня, який дає потрібну німецьку:
  `land` (A2) — після A2, `geschichte` (B1) — після B1, `kultur` (B2) — після B2. Номер розділу Deutschland теж
  рівень × 100 + NN (`Deutschland - B1 - 13.` → 313), тож парсер і `chapters:` працюють без змін.
- **Чому за рівнями, а не все одразу:** українську оповідь зрозуміє будь-хто, але цінність розділу — німецький шар
  (терміни, цитати, Landeskunde-текст, `[!listen]`). Учень A1 не впорається з «Paulskirche, Reichsgründung,
  Gleichschaltung» як зі словами для SRS; після B1 — так. Слова Deutschland йдуть у ту саму SRS «Слова» й у тест
  розділу.
- **Не блокують мовний шлях.** Розділ Deutschland має екзамен з `testOut`, тож його можна пройти або пропустити;
  мовні рівні не залежать від нього (`prerequisites` мовних тем ніколи не посилаються на Deutschland). Якщо
  платформа підтримає бічні / необовʼязкові розділи — перевести їх туди (питання до власника, §15).
- **Голокост і нацистська диктатура (B1-10, B1-11)** — серйозно й точно: без `[!reel]` «фішок» і без емодзі, замість
  них — `[!important]` «Важливо знати»; тести — лише на факти, терміни й хронологію (ніколи «вгадай кількість
  жертв»); український вимір (окупація, Бабин Яр, остарбайтери) — за джерелами bpb.de, Yad Vashem, USHMM, Stiftung
  Denkmal. Обидва розділи — обовʼязковий окремий рецензент-історик (`opus`, §14).
- Факти «перевірити» в таблицях (кількості, рекорди) рецензент підтверджує джерелом або прибирає.

### 9.2 Deutschland — країна, свята й побут (розділ `land`, A2)

| № | ch | Назва | id | Зміст | W | L | S | Q | reels |
|---|---|---|---|---|---|---|---|---|---|
| 01 | 201 | Німецькомовний світ — DACH і сусіди | `dl-a2-01` | Deutschland, Österreich, die Schweiz, Liechtenstein, Luxemburg, Südtirol, Ostbelgien; ≈ 130 млн носіїв; плюрицентрична мова | 20 | 5 | 3 | 10 | 4 |
| 02 | 202 | 16 федеральних земель | `dl-a2-02` | Bundesländer і столиці, Stadtstaaten, карта (`[!diagram]`), Föderalismus простими словами | 25 | 5 | 3 | 12 | 5 |
| 03 | 203 | Міста й регіони — Berlin, Hamburg, München, Köln, Ruhrgebiet | `dl-a2-03` | характер міст, Kiez, Hafen, Dom, Zeche; Ruhrpott — від шахт до культури | 20 | 5 | 3 | 10 | 5 |
| 04 | 204 | Діалекти — Bairisch, Schwäbisch, Plattdeutsch, Sächsisch, Kölsch | `dl-a2-04` | Hochdeutsch vs Dialekt, Moin, Grüß Gott, Servus, Ade, Tschö; аудіоприклади стандартом з поясненням | 20 | 6 | 3 | 10 | 5 |
| 05 | 205 | Свята I — Advent, Weihnachtsmarkt, Nikolaus, Silvester | `dl-a2-05` | Adventskalender, Glühwein, Stollen, Bleigießen → Wachsgießen, Feuerwerk | 20 | 5 | 3 | 10 | 5 |
| 06 | 206 | Свята II — Karneval, Ostern, Oktoberfest, Sankt Martin, Maibaum | `dl-a2-06` | Fasching / Fastnacht / Karneval, Rosenmontag, Osterhase, Laternenumzug, Wiesn, Tag der Deutschen Einheit | 25 | 5 | 3 | 12 | 5 |
| 07 | 207 | Їжа й напої — регіональна кухня | `dl-a2-07` | Brot (≈ 3000 сортів — перевірити), Wurst, Kaffee und Kuchen, Spätzle, Labskaus, Bier (Reinheitsgebot 1516), Wein; Abendbrot | 25 | 5 | 3 | 10 | 5 |
| 08 | 208 | Побут і культурні коди — пунктуальність, сміття, тиша, неділя | `dl-a2-08` | Pünktlichkeit, Mülltrennung, Pfand, Ruhezeiten, Sonntagsruhe, Bargeld, Lüften, Hausschuhe; чому сусід стукає о 22:05 | 25 | 5 | 3 | 12 | 5 |
| 09 | 209 | Австрія — Відень, Габсбурги, австрійська німецька | `dl-a2-09` | Habsburger, Wien, Kaffeehaus, Mozart, Jänner, Paradeiser, Matura; Österreich ≠ Australien | 20 | 5 | 3 | 10 | 5 |
| 10 | 210 | Швейцарія — чотири мови й пряма демократія | `dl-a2-10` | Deutsch / Französisch / Italienisch / Rätoromanisch, Schweizerdeutsch vs Hochdeutsch, Volksabstimmung, Röstigraben, Grüezi, без ß | 20 | 5 | 3 | 10 | 5 |

**Разом:** 10 розділів · 220 `[!word]` · 51 `[!listen]` · 30 `[!speak]` · 106 `[!quiz]` · 49 `[!reel]` · **407 вправ**.

### 9.3 Deutschland — історія (розділ `geschichte`, B1)

| № | ch | Назва | id | Зміст | W | L | S | Q | reels |
|---|---|---|---|---|---|---|---|---|---|
| 01 | 301 | Германці й Рим — від Арміна до Карла Великого | `dl-b1-01` | Germanen, Varusschlacht 9 р., Limes, Völkerwanderung, Franken, Karl der Große 800 | 20 | 4 | 3 | 12 | 5 |
| 02 | 302 | Священна Римська імперія — імператори, курфюрсти, Ганза | `dl-b1-02` | Heiliges Römisches Reich, Kaiser і Kurfürsten, Goldene Bulle, freie Reichsstädte, die Hanse | 20 | 4 | 3 | 12 | 5 |
| 03 | 303 | Гутенберг, Лютер і Реформація | `dl-b1-03` | Buchdruck, 95 Thesen 1517, переклад Біблії й спільна письмова мова, Bauernkrieg | 20 | 5 | 3 | 12 | 5 |
| 04 | 304 | Тридцятилітня війна й Вестфальський мир | `dl-b1-04` | 1618–1648, наслідки для населення, Westfälischer Friede, роздробленість | 15 | 4 | 3 | 12 | 4 |
| 05 | 305 | Пруссія й Просвітництво — Фрідріх II, Кант | `dl-b1-05` | Preußen, Friedrich der Große, Aufklärung, Kant (Sapere aude), Mendelssohn | 20 | 4 | 3 | 12 | 5 |
| 06 | 306 | Наполеон, романтизм і революція 1848 року | `dl-b1-06` | Ende des HRR 1806, Befreiungskriege, Romantik, Paulskirche, Schwarz-Rot-Gold | 20 | 4 | 3 | 12 | 5 |
| 07 | 307 | Бісмарк, 1871 і Німецька імперія | `dl-b1-07` | Reichsgründung, Kaiserreich, Industrialisierung, Sozialversicherung, Kolonialismus (і геноцид гереро й нама) | 20 | 4 | 3 | 12 | 5 |
| 08 | 308 | Перша світова війна | `dl-b1-08` | 1914–1918, Westfront, Brest-Litowsk і Україна 1918, Versailler Vertrag | 20 | 4 | 3 | 12 | 4 |
| 09 | 309 | Веймарська республіка — свобода, криза, падіння | `dl-b1-09` | Verfassung 1919, Frauenwahlrecht, Inflation 1923, Goldene Zwanziger, Bauhaus, Weltwirtschaftskrise | 20 | 4 | 3 | 12 | 5 |
| 10 | 310 | Нацистська диктатура й Друга світова війна | `dl-b1-10` | 1933–1945, Machtübernahme, Gleichschaltung, Krieg і окупація України, Zwangsarbeit (Ostarbeiter), Widerstand (Weiße Rose, 20. Juli) | 25 | 4 | 3 | 12 | 0 |
| 11 | 311 | Голокост і культура памʼяті | `dl-b1-11` | Shoah, Nürnberger Gesetze, Pogromnacht 1938, Babyn Jar, Auschwitz, Erinnerungskultur, Stolpersteine, Denkmal für die ermordeten Juden Europas | 20 | 4 | 3 | 10 | 0 |
| 12 | 312 | Поділ — ФРН і НДР, Стіна | `dl-b1-12` | Besatzungszonen, BRD / DDR 1949, Wirtschaftswunder, Stasi, 17. Juni 1953, Mauerbau 1961 | 25 | 5 | 3 | 12 | 5 |
| 13 | 313 | 1989–1990 — мирна революція й обʼєднання | `dl-b1-13` | Montagsdemonstrationen, 9. November 1989, Mauerfall, 3. Oktober 1990, Ossi / Wessi | 20 | 5 | 3 | 12 | 5 |
| 14 | 314 | Німеччина в ЄС і сьогодні | `dl-b1-14` | Euro, Schengen, Migration 2015, Energiewende, Zeitenwende 2022, допомога Україні й українці в Німеччині | 20 | 5 | 3 | 12 | 4 |

**Разом:** 14 розділів · 285 `[!word]` · 60 `[!listen]` · 42 `[!speak]` · 166 `[!quiz]` · 57 `[!reel]` · **553 вправи**.

### 9.4 Deutschland — культура, думка й наука (розділ `kultur`, B2)

| № | ch | Назва | id | Зміст | W | L | S | Q | reels |
|---|---|---|---|---|---|---|---|---|---|
| 01 | 401 | Музика I — Бах, Гендель, Бетховен, Брамс, Вагнер | `dl-b2-01` | Barock bis Romantik, Ode an die Freude як гімн ЄС; Mozart і Haydn — австрійці | 20 | 5 | 3 | 10 | 5 |
| 02 | 402 | Музика II — від шлягера й Kraftwerk до техно й дойчрепу | `dl-b2-02` | Schlager, Kraftwerk, Neue Deutsche Welle, Rammstein, Berliner Techno, Deutschrap | 20 | 5 | 3 | 10 | 5 |
| 03 | 403 | Література I — Гете, Шиллер, брати Грімм, Гайне | `dl-b2-03` | Sturm und Drang, Weimarer Klassik, Faust, Grimms Märchen, Loreley | 25 | 5 | 3 | 12 | 5 |
| 04 | 404 | Література II — Кафка, Манн, Брехт, Ремарк, Бель, Грасс | `dl-b2-04` | Prager Deutsch, Der Zauberberg, Episches Theater, Im Westen nichts Neues, Nobelpreise (Mann, Böll, Grass, Müller) | 25 | 5 | 3 | 12 | 5 |
| 05 | 405 | Філософія — Кант, Гегель, Маркс, Ніцше, Арендт, Габермас | `dl-b2-05` | ключові ідеї простими словами, Begriffe (Aufklärung, Dialektik, Übermensch, Banalität des Bösen) | 25 | 4 | 3 | 12 | 5 |
| 06 | 406 | Наука й винаходи | `dl-b2-06` | Gutenberg, Kepler, Röntgen, Einstein, Benz, Diesel, Zuse Z3, Aspirin, MP3; Nobelpreisträger | 25 | 5 | 3 | 12 | 6 |
| 07 | 407 | Кіно — від Metropolis до Good Bye, Lenin! | `dl-b2-07` | Expressionismus, UFA, Neuer Deutscher Film, Das Leben der Anderen, Lola rennt, Berlinale | 20 | 5 | 3 | 10 | 5 |
| 08 | 408 | Спорт — футбол, Бундесліга й не тільки | `dl-b2-08` | Bundesliga, Wunder von Bern 1954, 2014, Vereinswesen, Formel 1, Wintersport | 20 | 5 | 3 | 10 | 5 |
| 09 | 409 | Політика й Основний закон | `dl-b2-09` | Grundgesetz 1949, Art. 1 (Würde des Menschen), Bundestag, Bundesrat, Bundeskanzler, Bundespräsident, Verfassungsgericht | 25 | 5 | 3 | 12 | 4 |

**Разом:** 9 розділів · 205 `[!word]` · 44 `[!listen]` · 27 `[!speak]` · 100 `[!quiz]` · 45 `[!reel]` · **376 вправ**.

Разом «Deutschland»: **33 розділи**, **151 `[!reel]`**.

---

## 10. Іспити: Goethe, telc, ÖSD, TestDaF, DSH

Курс веде не лише до рівня CEFR, а й до **сертифіката** — як англійський до IELTS. Різниця: у німецькій немає
однієї шкали балів, тож замість «Band» показуємо **назву іспиту рівня**.

### 10.1 Відповідність CEFR ↔ іспити (орієнтовно)

| CEFR | Goethe-Institut | telc | ÖSD | TestDaF | DSH | Для чого найчастіше |
|---|---|---|---|---|---|---|
| A1 | Goethe-Zertifikat A1: Start Deutsch 1 | telc Deutsch A1, telc A1 für Zuwanderer | ÖSD Zertifikat A1 | — | — | віза для возз'єднання сім'ї |
| A2 | Goethe-Zertifikat A2 | telc Deutsch A2; DTZ (A2-результат) | ÖSD Zertifikat A2 | — | — | інтеграційний курс (проміжно) |
| B1 | Goethe-Zertifikat B1 | telc Deutsch B1 (Zertifikat Deutsch); DTZ (B1-результат) | ÖSD Zertifikat B1 | — | — | інтеграційний курс, натуралізація, робота |
| B2 | Goethe-Zertifikat B2 | telc Deutsch B2 | ÖSD Zertifikat B2 | TDN 3 | DSH-1 | робота, Ausbildung, частина програм вишів |
| C1 | Goethe-Zertifikat C1 | telc Deutsch C1, telc Deutsch C1 Hochschule | ÖSD Zertifikat C1 | TDN 4–5 | DSH-2 | вступ до університету (TDN 4 × 4 або DSH-2 — типова вимога) |
| C2 | Goethe-Zertifikat C2: Großes Deutsches Sprachdiplom | telc Deutsch C2 | ÖSD Zertifikat C2 | (TDN 5 — верхня межа) | DSH-3 | викладання, перекладацька й академічна кар'єра |

TestDaF і DSH — іспити для вступу до вишу, вони не «по рівню», а дають результат у діапазоні: TestDaF — TDN 3 / 4 / 5
окремо для кожної з 4 частин; DSH — DSH-1 (≥ 57 %), DSH-2 (≥ 67 %), DSH-3 (≥ 82 %) і в письмовій, і в усній частині
(рівень визначає слабша з двох). Відповідність TDN і DSH рівням CEFR — орієнтовна; у застосунку підписуємо «орієнтовно».

### 10.2 Поточні формати (перевірено 2026-10-31 на сайтах установ)

| Іспит | Частини й час | Джерело |
|---|---|---|
| Goethe A1: Start Deutsch 1 | Hören ≈ 20 хв (3 частини, 15 завдань) · Lesen 25 хв (3) · Schreiben 20 хв (2: формуляр + текст ≈ 30 слів) · Sprechen ≈ 15 хв у групі (3 частини, без підготовки); письмова частина 65 хв без пауз; 100 балів (по 25) | [Durchführungsbestimmungen A1](https://www.goethe.de/pro/relaunch/prf/en/Durchfuehrungsbestimmungen_A1_Start_Deutsch_1.pdf), [Prüfungsziele A1](https://www.goethe.de/pro/relaunch/prf/en/Pruefungsziele_Testbeschreibung_A1_SD1.pdf) |
| Goethe A2 | Lesen 30 хв · Hören ≈ 30 хв · Schreiben 30 хв (разом 90 хв без пауз) · Sprechen 15 хв у парі (3 частини, без підготовки); прохід 60 / 100 | [Durchführungsbestimmungen A2](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_A2.pdf) |
| Goethe B1 | 4 модулі (можна складати окремо): Lesen 65 хв (5 частин, 30 завдань) · Hören ≈ 40 хв (4 частини, 30) · Schreiben 60 хв (3: особистий лист, допис на форумі, офіційний лист) · Sprechen ≈ 15 хв у парі + 15 хв підготовки (3 частини: спланувати разом, презентація, питання) | [Durchführungsbestimmungen B1](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_B1.pdf), [Modellsatz B1 online](https://bfu.goethe.de/b1_mod/lesen.php) |
| Goethe B2 | Lesen 65 хв · Hören ≈ 40 хв · Schreiben 75 хв · Sprechen ≈ 15 хв у парі + 15 хв підготовки | [Durchführungsbestimmungen B2](https://www.goethe.de/pro/relaunch/prf/en/Durchfuehrungsbestimmungen_B2.pdf) |
| Goethe C1 | Lesen 65 хв · Hören ≈ 40 хв · Schreiben 75 хв · Sprechen ≈ 20 хв у парі + 20 хв підготовки (доповідь ≈ 5 хв + дискусія) | [Durchführungsbestimmungen C1](https://www.goethe.de/pro/relaunch/prf/it/Durchfuehrungsbestimmungen_C1.pdf), [Modellsatz C1](https://www.goethe.de/pro/relaunch/prf/materialien/C1_modular/c1-modular_modellsatz.pdf) |
| Goethe C2: GDS | Lesen 80 хв (4 частини) · Hören ≈ 35 хв (3) · Schreiben 80 хв (2: переформулювати доповідь 20 хв; Leserbrief / рецензія 60 хв) · Sprechen ≈ 15 хв індивідуально + 15 хв підготовки (доповідь + Pro / Kontra) | [Durchführungsbestimmungen C2](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_C2_neu.pdf), [Modellsatz C2](https://www.goethe.de/pro/relaunch/prf/materialien/C2/c2_modellsatz.pdf) |
| telc Deutsch B1 (Zertifikat Deutsch) | письмово 150 хв: Leseverstehen 3 частини + Sprachbausteine 2 частини — 90 хв разом · Hörverstehen 3 частини ≈ 30 хв · Schreiben 1 (email з 4 пунктами) 30 хв · усно ≈ 15 хв у парі + 20 хв підготовки (знайомство, тема, спланувати разом) | [telc.net — Zertifikat Deutsch / telc Deutsch B1](https://www.telc.net/en/language-examinations/certificate-exams/german/certificate-german-telc-german-b1/), [Übungstest 1](https://shop.telc.net/media/catalog/product/file/telc_deutsch_b1_zd_uebungstest_1.pdf) |
| telc Deutsch B2 | Lesen 3 частини + Sprachbausteine 2 — 90 хв · Hören 3 ≈ 20 хв · Schreiben 30 хв (напівофіційний лист) · Sprechen ≈ 15 хв у парі + 20 хв підготовки | [telc.net — telc Deutsch B2](https://www.telc.net/en/language-examinations/certificate-exams/german/telc-german-b2/), [Handbuch B2](https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_B2_Handbuch.pdf) |
| telc Deutsch C1 Hochschule | Lesen 3 частини + Sprachbausteine — 90 хв · пауза 20 хв · Hören 3 ≈ 40 хв · Schreiben 70 хв · Sprechen ≈ 16 хв у парі + 20 хв підготовки | [telc.net — C1 Hochschule](https://www.telc.net/en/language-examinations/certificate-exams/german/telc-german-c1-university/), [Handbuch C1 Hochschule](https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_c1_hochschule_Handbuch.pdf) |
| DTZ (Deutsch-Test für Zuwanderer, A2·B1) | Hören ≈ 25 хв (4 частини) · Lesen 45 хв (5) · Schreiben 30 хв (лист) · Sprechen ≈ 16 хв (про себе, досвід за картинкою, спланувати разом); результат — A2 або B1 | [telc Übungstest DTZ](https://shop.telc.net/media/catalog/product/file/5010B00030101bib.pdf) (формат DTZ — перевірити ще на bamf.de перед написанням dp-b1-02) |
| ÖSD Zertifikat B1 | 4 модулі: Lesen 65 хв · Hören ≈ 40 хв · Schreiben 60 хв · Sprechen ≈ 15 хв у парі + 15 хв підготовки; паперово й цифрово з 2024 | [osd.at — ÖSD Zertifikat B1](https://www.osd.at/en/exams/oesd-exams/oesd-zertifikat-b1-zb1/), [Durchführungsbestimmungen ZB1](https://osd.at/wp-content/uploads/2023/09/ZB1-Durchfuhrungsbestimmungen_10_2023.pdf) |
| ÖSD Zertifikat C1 | письмово: Lesen 90 хв (4 завдання, тексти з DACH) · Hören ≈ 40 хв (2) · Schreiben 90 хв (офіційний лист + звіт / коментар) · Sprechen 15–20 хв (телефонна розмова, дискусія, коротка доповідь) | [osd.at — ÖSD Zertifikat C1](https://www.osd.at/die-pruefungen/osd-prufungen/oesd-zertifikat-c1-zc1/) |
| TestDaF (цифровий) | Lesen 7 завдань ≈ 55 хв · Hören 7 ≈ 40 хв (аудіо й відео) · Schreiben 2 ≈ 60 хв (аргументативний текст ≥ 200 слів + резюме тексту й графіка) · Sprechen 7 ≈ 35 хв (запис у навушниках); фіксований порядок, назад повернутися не можна; кожна частина — TDN 3 / 4 / 5 | [testdaf.de — Aufbau des digitalen TestDaF](https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/aufbau-des-digitalen-testdaf/), [Auswertung](https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/auswertung-des-digitalen-testdaf/) |
| DSH | письмово: Hörverstehen · Leseverstehen + wissenschaftssprachliche Strukturen (90 хв, текст 4500–6000 знаків) · Textproduktion; усний іспит обовʼязковий; DSH-1 ≥ 57 %, DSH-2 ≥ 67 %, DSH-3 ≥ 82 % в обох частинах; кожен виш складає свою DSH за рамковими правилами | [HRK — Rahmenordnung RO-DT 2020](https://www.hrk.de/fileadmin/redaktion/hrk/02-Dokumente/02-07-Internationales/Rahmenordnung_ueber_Deutsche_Sprachpruefungen_fuer_das_Studium_an_deutschen_Hochschulen__RO-DT__2020.pdf), [HRK — DSH-Musterprüfungsordnung 2025](https://www.hrk.de/fileadmin/redaktion/hrk/02-Dokumente/02-07-Internationales/02-07-22_DSH/DSH_Musterpruefungsordnung_2025.pdf) |

Примітки до перевірки: загальна сторінка goethe.de (огляд іспитів) повернула 403, тож формати взято з офіційних
Durchführungsbestimmungen / Modellsätze на goethe.de (редакція 01.09.2025). Формат ÖSD B2 на osd.at не знайдено —
автор `dp-b2-02` перевіряє його сам. Перед написанням кожної теми іспиту автор ще раз відкриває джерело з таблиці:
формати змінюються.

### 10.3 Формат іспиту в рівнях (з B1)

- **B1:** Lesen 5 частин (`[!quiz]` richtig / falsch, matching), Hören (`[!listen]` choice / answer; `type: fill` для
  нотаток), Schreiben 3 завдання (поки — аналіз зразків і Redemittel, §1 п. 10), Sprechen — `[!speak]` репліки для
  «gemeinsam planen» і презентації. telc: Sprachbausteine (`type: fill` з банком — граматика й лексика в листі).
- **B2:** Goethe B2 Lesen / Hören, telc B2 Sprachbausteine; Erörterung / Forumsbeitrag — структура (`type: order`).
- **C1:** TestDaF Lesen (gap-fill, впорядкування, matching), Hören з конспектом (`[!listen] type: fill`), DSH
  wissenschaftssprachliche Strukturen (Nominalisierung, Passiversatz, Partizipialattribute — `type: fill`), опис графіка.
- **C2:** GDS — переформулювання (Schreiben Teil 1), Leserbrief / рецензія, Lesen 4 частини.
- Чесність: офіційні матеріали — власність Goethe-Institut, telc gGmbH, ÖSD, g.a.s.t. / TestDaF-Institut, вишів; ми
  пишемо власні завдання в тому самому форматі й не копіюємо тести й Modellsätze.

### 10.4 Розділ «Іспити: Goethe, telc, TestDaF» (`content/Guides/Deutsch Prüfungen/`)

Окремий розділ після C2 зі `status: planned`, поки контенту немає (як IELTS в англійському курсі): по темі на
іспит і рівень — модулі, час, типи завдань, стратегії, типові пастки, лексика інструкцій, пробні тести Lesen /
Hören з орієнтовним результатом. Id тем — `dp-<рівень>-NN`, вид `skills`, теги `[deutsch, exam, …]`.

| № | ch | Назва | Автор | W | L | S | Q |
|---|---|---|---|---|---|---|---|
| B1-01 | 301 | Goethe-Zertifikat B1 — модулі, час і стратегії | sonnet | 25 | 15 | 8 | 24 |
| B1-02 | 302 | telc Deutsch B1, DTZ і ÖSD B1 — чим відрізняються | sonnet | 20 | 15 | 8 | 24 |
| B1-03 | 303 | Пробний тест B1 — читання й аудіювання | sonnet | 10 | 20 | 0 | 30 |
| B2-01 | 401 | Goethe-Zertifikat B2 — модулі, час і стратегії | sonnet | 25 | 15 | 8 | 24 |
| B2-02 | 402 | telc Deutsch B2 і ÖSD B2 | sonnet | 20 | 15 | 8 | 24 |
| B2-03 | 403 | Пробний тест B2 — читання й аудіювання | sonnet | 10 | 20 | 0 | 30 |
| C1-01 | 501 | TestDaF — чотири частини й TDN 3–5 | opus | 30 | 15 | 10 | 24 |
| C1-02 | 502 | DSH — Hörverstehen, Leseverstehen, наукові структури | opus | 30 | 15 | 6 | 24 |
| C1-03 | 503 | Goethe C1, telc C1 Hochschule і ÖSD C1 | opus | 25 | 15 | 8 | 24 |
| C1-04 | 504 | Пробний тест TestDaF — читання й аудіювання | opus | 10 | 20 | 0 | 30 |
| C2-01 | 601 | Goethe-Zertifikat C2 — Großes Deutsches Sprachdiplom | opus | 25 | 15 | 8 | 24 |
| C2-02 | 602 | Пробний тест C2 — читання й аудіювання | opus | 10 | 20 | 0 | 30 |

**Разом:** 12 тем · 240 `[!word]` · 200 `[!listen]` · 64 `[!speak]` · 312 `[!quiz]` · **816 вправ**.

---

## 11. Маніфест (ескіз `content/courses/deutsch-a1-c2/course.yaml`)

```yaml
id: deutsch-a1-c2
version: 0.1.0
title: Deutsch A1 → C2
subtitle: Уся німецька — від умлаутів до вільного C2, плюс історія й культура Німеччини
subject: language
kind: language
practice: [path, words, listening, pronunciation, grammar, mistakes]
theory: [Deutsch, Deutschland, Deutsch Prüfungen]
language: uk
target: de            # голос de-DE і розпізнавання — у браузері, безкоштовно
icon: px:flagDe       # якщо іконки немає — запит до дизайну (без Apple-емодзі)
levels: [A1, A2, B1, B2, C1, C2]
tags: [deutsch, german, cefr, grammar, vocabulary, pronunciation, listening, landeskunde, goethe, telc, testdaf]
sections:
  - { id: a1,         title: A1 — Початковий,           from: Deutsch,     chapters: 101-130, level: A1 }
  - { id: a2,         title: A2 — Елементарний,         from: Deutsch,     chapters: 201-230, level: A2, status: planned }
  - { id: land,       title: Deutschland — країна й побут, from: Deutschland, chapters: 201-210, level: A2, status: planned }
  - { id: b1,         title: B1 — Середній,             from: Deutsch,     chapters: 301-330, level: B1, status: planned }
  - { id: geschichte, title: Deutschland — історія,      from: Deutschland, chapters: 301-314, level: B1, status: planned }
  - { id: b2,         title: B2 — Вище середнього,       from: Deutsch,     chapters: 401-429, level: B2, status: planned }
  - { id: kultur,     title: Deutschland — культура,     from: Deutschland, chapters: 401-409, level: B2, status: planned }
  - { id: c1,         title: C1 — Просунутий,            from: Deutsch,     chapters: 501-525, level: C1, status: planned }
  - { id: c2,         title: C2 — Вільне володіння,      from: Deutsch,     chapters: 601-622, level: C2, status: planned }
  - { id: pruefungen, title: Іспити — Goethe, telc, TestDaF, from: Deutsch Prüfungen, chapters: 301-602, status: planned }
exams:
  topic: { questions: 10, pass: 0.8 }
  section: { questions: 25, pass: 0.8, testOut: true }
placement: { enabled: true, maxQuestions: 30, perLevel: 5, pass: 0.75, followUp: 6 }
# exam-шкала курсу замість IELTS — див. §12 (поле задає платформа; назва поля — за її рішенням)
```

`status: planned` знімається, щойно хвиля рівня пройшла перевірку (§14). Як в англійському маніфесті, список тем
кожного розділу записується YAML-коментарями (`#   101  Deutsch - A1 - 01. …  [pronunciation]`) — це робить
власник маніфесту після кожної хвилі.

## 12. Що потрібно від платформи

Лише потреби; реалізує інженер платформи паралельно, контент від цього не чекає.

1. **Екзаменаційна шкала на курс замість захардкодженого IELTS.** Зараз `ieltsBand(level)`
   (`src/course/select/ielts.ts`) і підписи IELTS у результаті вступного тесту та оцінці навичок — для всіх мовних
   курсів. Німецькому курсу потрібна відповідність із §10.1 (A1 → «Goethe A1 · Start Deutsch 1», B2 → «Goethe B2 ·
   TestDaF TDN 3 · DSH-1» …), задана в `course.yaml`, з підписом «орієнтовно»; курс без шкали — без рядка іспиту.
2. **Диктант: мова за замовчуванням `lang="en"`.** Поле диктанту (`DictationInput`) і розпізнавання мусять брати
   `target` курсу (`de` → `de-DE`), інакше мікрофон розпізнає німецьку як англійську, а перевірка орфографії й
   нормалізація (UK / US) — англійські.
3. **Перемикач акценту — лише для англійської.** Налаштування UK / US і `ipa-us` не мають сенсу для `de`; для
   німецького курсу перемикач ховаємо (голос — `de-DE`).
4. **Одна IPA для німецької.** `IpaChip` / `WordCard` показують лише `ipa:`; `ipa-us:` у німецьких картках — помилка
   формату в `course:check` (або ігнор), без другого варіанта вимови.

Бажано (не блокує): у диктанті німецької — еквівалентність `ß` ↔ `ss` (швейцарська норма) і `ä/ö/ü` ↔ `ae/oe/ue`
як «майже правильно»; підказки `[!speak]` про типові звуки українців — і для німецьких звуків (h, ü, ö, ch).

## 13. Банк вступного тесту (`content/Guides/Deutsch/_placement/`)

Шість файлів `A1.md` … `C2.md`, frontmatter `placement: true`, `level: <L>`; **42 питання на рівень** — граматика 14 ·
лексика 12 · читання 7 · аудіювання 7; id `de-pl-<рівень>-<g|v|r|l>NN`; `diff` 1 / 2 / 3 (на рівень ≈ 10 / 22 / 10);
4 варіанти; кожен хибний варіант — типова помилка рівня (для українців — і кальки з §1.1); `**Пояснення:**`
українською. Аудіювання — `[!listen]` `choice` / `answer` (без диктанту). Читання — короткий текст німецькою в тілі
питання (A1 30–50 слів … C2 150–200).

| Рівень | Граматика (14) | Лексика (12) | Читання (7) | Аудіювання (7) |
|---|---|---|---|---|
| A1 | sein / haben, Präsens і Vokalwechsel, артикль і рід, Akk / kein, V2 і питання, модальні, Possessiv, Plural | знайомство, числа й вік, час, їжа, сімʼя, місто; «Ich bin 20» | вивіска, оголошення, SMS, меню | ціни, час, номер, короткі діалоги, `speed: slow` |
| A2 | Perfekt (haben / sein), Dativ, прийменники й Wechselpräpositionen, weil / dass, прикметник, Komparation, reflexiv | подорожі, Bahn, лікар, робота, гроші, свята; хибні друзі A2 | email, оголошення, розклад, правила будинку | Durchsagen, Mailbox, діалог у лікаря |
| B1 | Präteritum, als / wenn, Genitiv, Relativsätze, zu-Infinitiv, um … zu / damit, Konjunktiv II, Passiv, TeKaMoLo | Wohnungssuche, Bewerbung, Behörde, медіа, довкілля, Redemittel, словотвір I | статті, листи установ, форум | новини повільно, інтерв'ю, richtig / falsch |
| B2 | Passiv усіх часів і Ersatzformen, Konjunktiv II минулого, Konjunktiv I, субʼєктивні модальні, конектори, Partizipialattribut | Funktionsverbgefüge, префіксальні дієслова, Redewendungen, суспільство, економіка | коментар, позиція автора | лекція, ток-шоу, кілька мовців |
| C1 | розширені Partizipialattribute, Nominalstil, умова без wenn, Vorfeld, Genitiv-прийменники, частки | мова науки, колокації, конотації, регістр | науково-популярний текст, імпліцитне | лекція TestDaF / DSH, дебати |
| C2 | стилістичний порядок слів, Konjunktiv у стилі, Schachtelsatz | Sprichwörter, Amtsdeutsch, сленг, точність, хибні друзі C2 | есеїстика, правовий текст, іронія | радіо, кабаре, перекриття мовлення, DACH-варіанти |

Банк пише `sonnet` (§14), рецензує `opus`; `course:check` показує рядок «Вступний тест (банк _placement …):
A1 42 · …» і попередження `thin-placement`.

## 14. План агентів для хвиль контенту

Мета власника — кожній моделі лише та робота, яку вона тягне, щоб економити токени.

### 14.1 Ролі

| Роль | Модель | Що робить | Що читає (і нічого більше) |
|---|---|---|---|
| Автор тем A1–B2, розділів Deutschland, тем іспитів B1–B2, банку вступного тесту | `sonnet` | пише свої файли повністю (усі блоки, кількості з таблиць ±20 %) | цей файл (§1–2 + рядки своїх тем), LANGUAGE_COURSE «Нові блоки», модельний урок хвилі 0 свого типу |
| Автор тем C1–C2, тем іспитів C1–C2 і модельних уроків | `opus` | те саме для складних рівнів; модельні уроки — еталон формату для всіх | те саме + англійська тема того самого виду як зразок формату |
| Рецензент (свіжий агент) | `opus` | перевіряє: німецьку (граматика, природність, рід / відмінки / порядок слів, DACH-позначки), українську (природність, терміни), факти (історія — дати, імена, цифри, з джерелом), формат (анатомія, `[!pitfall]` українців, Landeskunde); повертає список правок з рядками — **сам не редагує** | лише файли на рецензію + §1–2 цього документа; без нотаток автора (незалежне прочитання) |
| Механічна перевірка | `haiku` | `VAULT_PATH=content pnpm course:check deutsch-a1-c2`; кількості W / L / S / P / Q проти таблиць; id (префікс, суфікс, послідовність, унікальність); заголовки `[!word]` іменників з артиклем; дублікати слів між файлами; заборонені символи в назвах; `ipa-us` відсутня; ≥ 10 quiz. **Не пише й не править навчальний текст** — лише звіт власнику файлу | файли хвилі й вивід скриптів |
| Власник маніфесту й цього документа | головний агент | `course.yaml` (коментарі тем, зняття `status: planned`), статус у цьому файлі | звіти хвилі |

Правила: **один власник на файл** (правки за рецензією й звітом haiku вносить лише автор файлу); хвиля — **4–6
паралельних авторів**, **один рівень (або один розділ Deutschland) на хвилю**; `review`-тему рівня пише один автор
хвилі **після** решти (крок 1b), бо вона повторює всі теми рівня; дубль `[!word]` між файлами прибирає автор
пізнішої теми. Скрипти — з `VAULT_PATH=content`, `content:sync` не запускати, нічого не комітити без власника.

### 14.2 Кроки хвилі

1. Автори паралельно пишуть свої файли (1b — тема `review`).
2. `haiku` — механічний звіт на кожен файл → автори виправляють.
3. `opus`-рецензенти (один на 2 авторів, ≈ 10–12 файлів; для B1-10, B1-11 Deutschland — окремий рецензент-історик) →
   автори вносять правки.
4. `haiku` — повторний прогін `course:check`; головний агент знімає `status: planned`, оновлює коментарі маніфесту.

### 14.3 Хвилі й файли

Файл теми = `content/Guides/<посібник>/<посібник> - <рівень> - NN. <Назва з таблиці>.md`; нижче — номери тем.

| Хвиля | Що | Автори (модель → теми) | Рецензенти |
|---|---|---|---|
| 0 | Модельні уроки | `opus` M1 → Deutsch A1-03 (sein) · `opus` M2 → Deutsch A1-06 (Artikel, Genus) · `opus` M3 → Deutschland B1-13 (1989–1990) | 1 `opus` |
| 1 | A1 | `sonnet` а → 01, 05, 10, 13, 17, 23 · б → 02, 04, 07, 09, 11 · в → 08, 12, 14, 15, 16 · г → 18, 19, 20, 21, 22 · д → 24, 25, 26, 27, 28 · 1b: б → 29, 30 | 3 `opus` |
| 2 | A2 | `sonnet` а → 03, 09, 13, 18, 21, 26 · б → 01, 02, 04, 05, 06, 07 · в → 08, 10, 11, 12, 14, 15 · г → 16, 17, 19, 20, 22, 23 · д → 24, 25, 27, 28, 29 · 1b: д → 30 | 3 `opus` |
| 3 | Deutschland A2 (`land`) | `sonnet` а → A2-01, 02, 03 · б → 04, 05, 06 · в → 07, 08 · г → 09, 10 | 2 `opus` |
| 4 | Банк вступного тесту | `sonnet` P1 → `_placement/A1.md`, `A2.md`, `B1.md` · P2 → `B2.md`, `C1.md`, `C2.md` | 1 `opus` |
| 5 | B1 | `sonnet` а → 05, 09, 13, 21, 28, 29 · б → 01, 02, 03, 04, 06 · в → 07, 08, 10, 11, 12, 14 · г → 15, 16, 17, 18, 19, 20 · д → 22, 23, 24, 25, 26, 27 · 1b: б → 30 | 3 `opus` |
| 6 | Deutschland B1 (`geschichte`) | `sonnet` а → B1-01, 02, 03, 04 · б → 05, 06, 07 · в → 08, 09, 12 · г → 10, 11, 14 (13 — з хвилі 0) | 2 `opus` + 1 `opus`-історик на 10, 11 |
| 7 | B2 | `sonnet` а → 11, 12, 13, 14, 26, 27 · б → 01, 02, 03, 04, 05 · в → 06, 07, 08, 09, 10 · г → 15, 16, 17, 18, 19, 20 · д → 21, 22, 23, 24, 25, 28 · 1b: б → 29 | 3 `opus` |
| 8 | Deutschland B2 (`kultur`) | `sonnet` а → B2-01, 02, 07 · б → 03, 04, 05 · в → 06, 08, 09 | 2 `opus` |
| 9 | C1 | `opus` а → 01, 02, 03, 09 · б → 04, 05, 06, 07, 08 · в → 10, 11, 12, 22 · г → 13, 14, 15, 16, 17 · д → 18, 19, 20, 21, 23, 24 · 1b: а → 25 | 3 `opus` |
| 10 | C2 | `opus` а → 01, 02, 03, 04, 05 · б → 06, 07, 08, 09, 18 · в → 10, 11, 12, 13, 17, 19 · г → 14, 15, 16, 20, 21 · 1b: а → 22 | 2 `opus` |
| 11 | Іспити (`Deutsch Prüfungen`) | `sonnet` E1 → B1-01, 02, 03 · `sonnet` E2 → B2-01, 02, 03 · `opus` E3 → C1-01, 02, 03, 04 · `opus` E4 → C2-01, 02 | 2 `opus` |
| пізніше | `[!write]` / `[!talk]` | коли блоки зʼявляться на цій гілці — по 1–2 завдання в skills B1–C2 і іспити | — |

`haiku` — один прогін на хвилю (крок 2) і повторний (крок 4). Хвилі 3 і 4 можна запускати паралельно з хвилею 2,
якщо власник дозволить (різні файли, різні посібники) — питання §15.

## 15. Відкриті питання до власника

1. **Deutschland — обовʼязкові чи бічні розділи?** Зараз вони стоять між рівнями з `testOut` (можна пропустити
   екзаменом). Якщо мають бути необовʼязковою гілкою, яка не блокує B1 → B2, — потрібна підтримка платформи.
2. **B1-10 і B1-11 (нацистська диктатура, Голокост)** — правило «Deutschland пише `sonnet`» лишаємо, чи ці два
   розділи пише `opus` (рецензент-історик `opus` є в будь-якому разі)?
3. **Паралельність:** дозволити хвилі 3 (Deutschland A2) і 4 (банк вступного тесту) одночасно з хвилею 2 (A2)?
   Це скорочує календар, але порушує «один рівень на хвилю».
4. **Інтеграційний трек:** чи потрібна окрема ціль «DTZ / Leben in Deutschland / Einbürgerungstest» (тест на
   громадянство — питання про державу й історію) — як підрозділ іспитів або як частина Deutschland?
5. **Назва й місце розділу іспитів:** окремий посібник `Deutsch Prüfungen` (як зараз) чи теми всередині `Deutsch`
   з окремим діапазоном номерів; і чи потрібні telc / ÖSD так само детально, як Goethe і TestDaF.

## 16. Джерела для авторів

- Council of Europe — CEFR Companion Volume (2020); Goethe-Institut / telc / ÖSD — **Profile Deutsch** (що до якого
  рівня належить: Kannbeschreibungen, граматика, лексика); Rahmencurriculum für Integrationskurse (BAMF).
- Goethe-Institut: Wortlisten A1, A2, B1 (Prüfungswortschatz); Modellsätze A1–C2 (формат, не копіювати).
- Duden — Die Grammatik; Duden — Das Aussprachewörterbuch; Duden online (рід, множина, IPA); DWDS (dwds.de —
  частотність, корпус, етимологія); Variantenwörterbuch des Deutschen (AT / CH).
- Helbig / Buscha — Deutsche Grammatik; Hering / Matussek / Perlmann-Balme — Übungsgrammatik für Fortgeschrittene;
  Dreyer / Schmitt — Lehr- und Übungsbuch der deutschen Grammatik.
- Deutsche Welle — Deutsch lernen (Nicos Weg, Langsam gesprochene Nachrichten, Top-Thema); dw.com/uk.
- Історія й Landeskunde: Bundeszentrale für politische Bildung (bpb.de), Deutsches Historisches Museum (LeMO,
  dhm.de), Haus der Geschichte, Stiftung Denkmal für die ermordeten Juden Europas, Yad Vashem, USHMM,
  Bundesregierung / Bundestag (Grundgesetz), Statistisches Bundesamt (Destatis) — для цифр.
- Іспити: goethe.de, telc.net, osd.at, testdaf.de, hrk.de (DSH), bamf.de (DTZ, Integrationskurs) — посилання в §10.2.

### 15.1 Рішення лідера на час нічної роботи (2026-10-31; власник може змінити)

1. Розділи Deutschland — **обовʼязкові між рівнями з test-out** (без нової платформи); бічна гілка — пізніше.
2. B1-10 і B1-11 (нацизм, Голокост) пише **`opus`**, рецензує окремий `opus`-історик.
3. Хвилі 3 і 4 запускаються паралельно з хвилею 2 (різні файли й посібники), якщо дозволяють ліміти.
4. Інтеграційний трек (DTZ, Leben in Deutschland, тест на громадянство) — **окремим питанням до власника**, не зараз.
5. Іспити — окремий посібник `Deutsch Prüfungen`; telc і ÖSD — коротше за Goethe й TestDaF.
