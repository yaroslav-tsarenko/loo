# ENGLISH_SYLLABUS — програма курсу «English A1 → C2»

Повна карта курсу `english-a1-c2`: шість рівнів CEFR, для кожного — обсяг граматики, теми лексики, фокус вимови,
цілі «я вмію» для аудіювання / читання / письма / говоріння і впорядкований список тем (статей).

- Формат статей і нові мовні блоки `[!word]` `[!listen]` `[!speak]` `[!pair]` — [LANGUAGE_COURSE.md](./LANGUAGE_COURSE.md).
- Базові блоки `[!quiz]` (single / multi / `type: fill` / `type: order`), `[!reel]`, `[!diagram]` (§14) — [CONTENT_SPEC.md](../CONTENT_SPEC.md).
- Пакет курсу, розділи, тести тем, екзамени, вступний тест — [COURSE_FORMAT.md](./COURSE_FORMAT.md).
- Маніфест: `<vault>/Courses/english-a1-c2/course.yaml` (копія — `content/Courses/english-a1-c2/course.yaml`).

**Статус (2026-10-16):** A1 і A2 — пишуться зараз (у маніфесті). B1–C2 — затверджений план; у маніфесті лише як
закоментовані розділи, бо компілятор курсу вважає відсутні посібники/теми помилкою (див. §9).

---

## 1. Принципи

1. **Учень — україномовний.** Пояснення українською, приклади англійською з перекладом. Кожна стаття має блок
   «Типові помилки українців» (`[!pitfall]`): відсутність артиклів і дієслова-звʼязки в українській, вид дієслова
   замість часу, «I have 20 years», «Where you live?», подвійне заперечення, хибні друзі (magazine, accurate, artist,
   sympathy), «г» замість /h/, «в» замість /w/, «с/з/ф» замість /θ ð/, відсутність довготи голосних і /æ/.
2. **Одна стаття = одна тема рівня**, 25–45 хв. Короткі пояснення, таблиці, `[!diagram]` для часів і структур
   (`layout: timeline` — часова шкала, `compare` — «A vs B», `flow` — побудова речення).
3. **Чотири навички в кожній темі.** Навіть граматична тема має слова (`[!word]`), аудіювання (`[!listen]`),
   вимову (`[!speak]`) і тести; тематична — граматику в контексті. Окремі теми `listening` і `skills` тренують
   стратегії (слухати ключові слова, skimming / scanning, структура листа).
4. **Вимова — окрема наскрізна доріжка** (§3), вплетена в A1–A2 і продовжена на B1+ (звʼязне мовлення).
5. **Реальні ситуації** — у кожній тематичній статті розділ «Ситуація» (діалог `audio: A: … / B: …` + `[!speak]`
   репліки учня); на A2, B2 — окремі теми-ситуації.
6. **Британська норма за замовчуванням** (`ipa:` — RP / SSBE), американська — `ipa-us:`, коли відрізняється;
   лексичні пари UK/US позначаються в `note:`.
7. **Кожен рівень закривається темою `review`**: змішаний тест рівня, диктант, мінімальні пари, чекліст «я вмію».
   Екзамен розділу (25 питань, test-out) збирається платформою автоматично з усіх тем рівня.

## 2. Конвенції для авторів статей

### 2.1 Файл і frontmatter

```
<vault>/Guides/English/English - A1 - 01. Алфавіт, звуки й IPA.md
```

- Ім'я: `English - <LEVEL> - NN. <Назва>.md`; назва — українською (англ. терміни дозволені), **без** `: / \ ? * " < > | # ^ [ ]`
  (Obsidian не дозволяє їх у назвах файлів; тому «to be — am, is, are», а не «Be: am, is, are»).
- *(Оновлення, фаза 2: парсер тепер сам читає `English - A1 - 01.` як 101, тож `order` необовʼязковий — але
  якщо вказаний, він перемагає. Нижче — історичне правило.)*
- **`order` у frontmatter обовʼязковий:** `order = <рівень> × 100 + NN` — A1 → 101–130, A2 → 201–230,
  B1 → 301…, B2 → 401…, C1 → 501…, C2 → 601…. Парсер назв знімає префікс посібника `English - ` і шукає число на
  початку, а там `A1 - 01.` — номер не розпізнається. Маніфест вибирає теми рівня діапазоном `chapters: 101-130`
  саме за `order`. Без `order` тема не потрапить у розділ (помилка `missing-chapter`).
- `id` теми: `en-<рівень>-<slug>` (slug — колонка «id» у таблицях нижче): `id: en-a1-be`.
- `level:` — CEFR (`A1`). Платформа поки не знає CEFR (див. §9), тому рівень вправ примусово задає розділ маніфесту;
  у meta-рядках блоків усе одно пишемо `level: A1` — це підхопиться, коли зʼявиться шкала CEFR.

```yaml
---
title: Дієслово to be — am, is, are
order: 103
id: en-a1-be
level: A1
icon: px:letterTile
tags: [english, a1, grammar, to-be]
prerequisites: ["[[English - A1 - 01. Алфавіт, звуки й IPA]]"]
estimatedMinutes: 35
---
```

### 2.2 Id блоків

`en-<рівень>-<slug>-<тип><NN>`, стабільні (на них тримаються прогрес і SRS):

| Блок | Суфікс | Приклад |
|---|---|---|
| `[!word]` | `w` | `en-a1-food-w07` |
| `[!listen]` | `l` | `en-a1-food-l03` |
| `[!speak]` | `s` | `en-a1-food-s02` |
| `[!pair]` | `p` | `en-a1-vowels-p11` |
| `[!quiz]` (будь-який `type`) | `q` | `en-a1-be-q05` |
| `[!question]-` (картка правила, необовʼязково) | `c` | `en-a1-be-c01` |

Одне слово — одна картка на весь курс: якщо слово вже було в попередній темі, не дублюй `[!word]` (лише вживай у прикладах).

### 2.3 Анатомія статті

Заголовки секцій з емодзі-префіксами — як у [LEARNING_PLAYBOOK §2](./LEARNING_PLAYBOOK.md):

1. **Результати** — `[!success]` «Після цієї теми ти зможеш…» (2–5 пунктів «я вмію» з CEFR).
2. **Передбач** — 1 `[!quiz]` або `[!listen]` до теорії (pretesting).
3. **Пояснення** — українською; таблиця форм; `[!diagram]` (часи — `timeline`, контрасти — `compare`).
4. **Приклади** — 6–12 речень `англ. — укр.`
5. **Слова** — блок `[!word]` (кількість — колонка W).
6. **Слухаємо** — `[!listen]` (колонка L): `choice` → `dictation` → `answer`; A1 — `speed: slow`.
7. **Вимова** — `[!pair]` (P) і `[!speak]` (S).
8. **Типові помилки українців** — 1–3 `[!pitfall]`.
9. **Ситуація** — короткий діалог (тематичні теми).
10. **Практика** — `[!quiz]` (Q): ≈ 50 % single / multi (вони ж ідуть у вступний тест), решта `type: fill`
    (` ```text fill ` з `[[…]]`, для A1–A2 часто `· bank`) і `type: order` (речення зі слів: шматок = рядок).
11. **Фішки** — 3 `[!reel]` (етимологія, культура, «чому так»).
12. **Джерела** — «Джерела та що почитати» (див. §10).

Мінімуми `course:check` (попередження, не помилки): ≥ 6 тестів, ≥ 6 карток, ≥ 3 фішки, ≥ 1 `[!viz]`/`[!figure]` на тему.
Тест теми — 10 питань з `[!quiz]` теми, тож у кожній темі **≥ 10 `[!quiz]`** (у таблицях Q = 10–16).

### 2.4 Легенда колонок

**Вид:** `grammar` · `vocabulary` · `pronunciation` · `listening` · `skills` (читання / письмо / говоріння / ситуації) · `review`.
**W** — картки `[!word]` · **L** — `[!listen]` · **S** — `[!speak]` · **P** — `[!pair]` · **Q** — `[!quiz]` (усі типи).
Кількості орієнтовні (±20 %).

---

## 3. Доріжка «Вимова» (наскрізна)

| Рівень | № | Тема | Що відпрацьовуємо |
|---|---|---|---|
| A1 | 01 | Алфавіт, звуки й IPA | назви літер, спелінг, літера ≠ звук, як читати транскрипцію |
| A1 | 05 | Короткі й довгі голосні | /ɪ–iː/ /e–æ/ /ʌ–ɑː/ /ɒ–ɔː/ /ʊ–uː/ /ɜː/ /ə/ |
| A1 | 10 | Дифтонги | /eɪ aɪ ɔɪ aʊ əʊ ɪə eə ʊə/ |
| A1 | 17 | Приголосні th, w, v, r, h | /θ ð/, /w–v/, /r/, /h/ ≠ «г», /ŋ/, придих p t k |
| A1 | 23 | Кінцеві приголосні й закінчення -s | дзвінкі в кінці, /s z ɪz/ |
| A2 | 03 | Вимова закінчення -ed | /t d ɪd/ |
| A2 | 06 | Наголос у слові | моделі наголосу, schwa, REcord / reCORD |
| A2 | 13 | Наголос у реченні й слабкі форми | змістові vs службові слова, ритм |
| A2 | 18 | Інтонація | ↘ wh-питання, ↗ yes/no, переліки, емоції |
| A2 | 26 | Правила читання й німі літери | magic e, буквосполучення, knife / hour |
| B1 | 05 | Звʼязне мовлення — linking | приголосний + голосний, /j/ і /w/ між голосними |
| B1 | 13 | Слабкі форми й ритм мовлення | /ə/ у службових словах, stress-timing |
| B2 | 11 | Звʼязне мовлення — випадіння, злиття, intrusive r | elision, assimilation, catenation |
| B2 | 12 | Розмовні скорочення | gonna, wanna, gotta, dunno, lemme |
| C1 | 10 | Інтонація ставлення й контрастивний наголос | ввічливість, сарказм, «I didn't say HE stole it» |
| C2 | 11 | Акценти світу | RP, General American, Australian, Scottish, Irish, Indian |
| C2 | 13 | Просодія на рівні носія | паузи, темп, публічний виступ |

Плюс у кожній граматичній / тематичній статті — 4–8 `[!speak]` і, де доречно, `[!pair]` (thirteen / thirty, can / can't).

---

## 4. A1 — Початковий (Breakthrough)

**Ціль рівня:** розуміти й уживати знайомі щоденні вирази й найпростіші фрази; представитися, ставити й відповідати
на прості питання про себе, людей, речі; спілкуватися, якщо співрозмовник говорить повільно й чітко.
**Лексика:** ≈ 550–650 слів (активно ≈ 450).

- **Граматика:** to be; особові, обʼєктні й присвійні займенники, `'s`; a/an, множина; this / that / these / those;
  have got; Present Simple (+ / − / ?), прислівники частоти; питальні слова; some / any, much / many, лічильні й
  нелічильні; there is / are; can / can't; прийменники часу й місця in / on / at, прийменники місця; Present
  Continuous (базово); наказовий спосіб; like / love + -ing; сполучники and / but / because.
- **Лексика за темами:** знайомство, країни й національності; числа, вік, телефон; предмети навколо; сімʼя і
  зовнішність; час, дні, місяці, дати; розпорядок дня; їжа й напої, кафе; дім і меблі; одяг, кольори, магазин;
  місто й транспорт, дорога; хобі, спорт, погода.
- **Вимова:** алфавіт і IPA; короткі / довгі голосні; дифтонги; th, w, v, r, h; кінцеві приголосні й -s.
- **Аудіювання:** розуміє імена, числа, ціни, час, якщо говорять повільно; основний зміст коротких діалогів.
- **Читання:** вивіски, оголошення, меню, анкети, короткі повідомлення.
- **Письмо:** анкета (імʼя, дата народження, адреса), листівка, коротке повідомлення про себе.
- **Говоріння:** представитися, спитати / розповісти про себе, родину, день; замовити в кафе, купити, спитати дорогу.

| № | order | Назва | Файл | Вид | id | Зміст | W | L | S | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 101 | Алфавіт, звуки й IPA | `English - A1 - 01. Алфавіт, звуки й IPA.md` | pronunciation | `en-a1-alphabet` | 26 літер і їх назви (A /eɪ/, E /iː/, I /aɪ/), спелінг імені й email (Can you spell that?), літера ≠ звук, як читати транскрипцію в картках, звуки, яких немає в українській | 12 | 8 | 6 | 4 | 10 |
| 02 | 102 | Знайомство — привітання, країни й національності | `English - A1 - 02. Знайомство — привітання, країни й національності.md` | vocabulary | `en-a1-hello` | hello / hi / good morning, How are you?, Nice to meet you, My name is…, Where are you from?, 25 країн + національності й мови (Ukraine — Ukrainian), формально vs неформально, фрази уроку (Sorry? Can you repeat that?) | 40 | 6 | 8 | 0 | 10 |
| 03 | 103 | Дієслово to be — am, is, are | `English - A1 - 03. Дієслово to be — am, is, are.md` | grammar | `en-a1-be` | особові займенники; am / is / are у + / − / ?; скорочення I'm, isn't; короткі відповіді; чому «я студент» → I am a student | 12 | 6 | 6 | 0 | 12 |
| 04 | 104 | Числа, вік і номер телефону | `English - A1 - 04. Числа, вік і номер телефону.md` | vocabulary | `en-a1-numbers` | 0–100, сотні й тисячі, thirteen vs thirty (наголос), вік (I'm 25, не «I have 25»), номери телефону (oh, double), How old…? | 35 | 10 | 6 | 4 | 10 |
| 05 | 105 | Короткі й довгі голосні | `English - A1 - 05. Короткі й довгі голосні.md` | pronunciation | `en-a1-vowels` | 12 монофтонгів: /ɪ–iː/, /e–æ/, /ʌ–ɑː/, /ɒ–ɔː/, /ʊ–uː/, /ɜː/, /ə/; довгота розрізняє слова (ship / sheep, full / fool); /æ/ — bad vs bed | 24 | 6 | 10 | 14 | 10 |
| 06 | 106 | Артиклі a, an і множина іменників | `English - A1 - 06. Артиклі a, an і множина іменників.md` | grammar | `en-a1-articles` | a / an за звуком (an hour, a university), перше знайомство з the, множина -s / -es / -ies, неправильна (men, children, feet, mice), чому в українській артиклів немає | 20 | 4 | 4 | 0 | 12 |
| 07 | 107 | This, that, these, those — речі навколо | `English - A1 - 07. This, that, these, those — речі навколо.md` | grammar | `en-a1-this-that` | вказівні займенники (близько / далеко, однина / множина), What's this? It's a…, It's vs They're, предмети в кімнаті, сумці, класі | 25 | 5 | 5 | 2 | 10 |
| 08 | 108 | Сімʼя, люди й зовнішність | `English - A1 - 08. Сімʼя, люди й зовнішність.md` | vocabulary | `en-a1-family` | члени родини, опис зовнішності (tall, short hair, blue eyes) і характеру (kind, funny), базові частини тіла | 40 | 6 | 6 | 0 | 10 |
| 09 | 109 | Займенники і присвійність — me, my, mine, 's | `English - A1 - 09. Займенники і присвійність — me, my, mine, 's.md` | grammar | `en-a1-pronouns` | обʼєктні me / him / us / them, присвійні my / your / its / their, mine / yours, присвійний 's і s', Whose…?, it's vs its | 10 | 5 | 5 | 0 | 12 |
| 10 | 110 | Дифтонги | `English - A1 - 10. Дифтонги.md` | pronunciation | `en-a1-diphthongs` | 8 дифтонгів /eɪ aɪ ɔɪ aʊ əʊ ɪə eə ʊə/, ковзання між звуками, UK /əʊ/ vs US /oʊ/, звʼязок із назвами літер | 24 | 6 | 10 | 10 | 10 |
| 11 | 111 | Have got — що в мене є | `English - A1 - 11. Have got — що в мене є.md` | grammar | `en-a1-have-got` | have got / has got (UK) і have з do / does (US), + / − / ?, володіння, родина, I've got a cold; пастка «I have 20 years» | 12 | 5 | 6 | 0 | 12 |
| 12 | 112 | Час, дні, місяці й дати | `English - A1 - 12. Час, дні, місяці й дати.md` | vocabulary | `en-a1-time` | What time is it? (half past, quarter to, am / pm), дні тижня, місяці, порядкові числівники, дати (the 5th of May / May 5th), роки (twenty twenty-six) | 40 | 8 | 6 | 2 | 10 |
| 13 | 113 | Аудіювання — імена, числа, ціни й час | `English - A1 - 13. Аудіювання — імена, числа, ціни й час.md` | listening | `en-a1-listen-numbers` | диктанти: імена по літерах, телефони, ціни (£3.50, $12.99), час і дати, email (at, dot); стратегія «слухай ключове слово» | 8 | 18 | 3 | 2 | 10 |
| 14 | 114 | Present Simple — стверджувальні речення | `English - A1 - 14. Present Simple — стверджувальні речення.md` | grammar | `en-a1-present-simple` | звички й факти, he / she / it + -s / -es / -ies, has / does / goes, маркери every day, usually; `[!diagram]` шкала часу | 20 | 5 | 6 | 0 | 12 |
| 15 | 115 | Present Simple — питання й заперечення | `English - A1 - 15. Present Simple — питання й заперечення.md` | grammar | `en-a1-present-questions` | do / does / don't / doesn't, порядок слів у питанні, what / where / when / who / why / how, короткі відповіді; пастка «Where you live?» | 12 | 6 | 6 | 0 | 14 |
| 16 | 116 | Розпорядок дня і прислівники частоти | `English - A1 - 16. Розпорядок дня і прислівники частоти.md` | vocabulary | `en-a1-routine` | get up, have breakfast, go to work…; always / usually / often / sometimes / never — місце в реченні; How often…? once a week | 35 | 6 | 6 | 0 | 10 |
| 17 | 117 | Приголосні th, w, v, r, h | `English - A1 - 17. Приголосні th, w, v, r, h.md` | pronunciation | `en-a1-consonants` | /θ ð/ (think, this — не «с / з / ф»), /w/ vs /v/ (wine / vine), /r/ без дрижання, /h/ — видих, не «г», /ŋ/ без [g] (sing), придих p t k | 24 | 6 | 12 | 14 | 10 |
| 18 | 118 | Їжа, напої й у кафе | `English - A1 - 18. Їжа, напої й у кафе.md` | vocabulary | `en-a1-food` | продукти, страви, напої, прийоми їжі; I'd like… / Can I have…? / The bill, please; меню й ціни | 45 | 6 | 8 | 0 | 10 |
| 19 | 119 | Some, any, much, many — лічильні й нелічильні | `English - A1 - 19. Some, any, much, many — лічильні й нелічильні.md` | grammar | `en-a1-countable` | countable vs uncountable (bread, water, money, advice), some / any, much / many / a lot of, How much / How many, a piece of / a bottle of | 20 | 5 | 5 | 0 | 12 |
| 20 | 120 | There is, there are — дім і кімнати | `English - A1 - 20. There is, there are — дім і кімнати.md` | grammar | `en-a1-there-is` | there is / are у + / − / ?, кімнати й меблі, прийменники місця (in, on, under, next to, between, opposite, behind), опис квартири | 35 | 6 | 6 | 0 | 12 |
| 21 | 121 | Can і can't — уміння й прохання | `English - A1 - 21. Can і can't — уміння й прохання.md` | grammar | `en-a1-can` | can для вміння, можливості, дозволу, прохання; Could you…? ввічливо; can /kən/ vs can't /kɑːnt/; дієслова дій (swim, drive, cook) | 20 | 6 | 6 | 4 | 12 |
| 22 | 122 | Одяг, кольори й у магазині | `English - A1 - 22. Одяг, кольори й у магазині.md` | vocabulary | `en-a1-clothes` | одяг, кольори, розміри; How much is it / are they?, Can I try it on?, It's too big | 40 | 6 | 8 | 0 | 10 |
| 23 | 123 | Кінцеві приголосні й закінчення -s | `English - A1 - 23. Кінцеві приголосні й закінчення -s.md` | pronunciation | `en-a1-final-consonants` | не оглушувати дзвінкі (bag / back, bed / bet, eyes / ice), довший голосний перед дзвінким, -s: /s/ /z/ /ɪz/ (cats, dogs, buses), без зайвого голосного в кінці | 20 | 6 | 10 | 12 | 10 |
| 24 | 124 | Місто, транспорт і як пройти | `English - A1 - 24. Місто, транспорт і як пройти.md` | vocabulary | `en-a1-city` | місця в місті, транспорт (by bus, on foot), наказовий спосіб для маршруту (turn left, go straight on), Excuse me, where is…?, Is there a… near here? | 40 | 8 | 6 | 0 | 10 |
| 25 | 125 | Прийменники in, on, at — час і місце | `English - A1 - 25. Прийменники in, on, at — час і місце.md` | grammar | `en-a1-prepositions` | at 5 o'clock / on Monday / in May / in 2026 / at the weekend; at home / in the room / on the table / at the bus stop; `[!diagram]` «від точки до простору» | 12 | 4 | 4 | 0 | 14 |
| 26 | 126 | Present Continuous — що відбувається зараз | `English - A1 - 26. Present Continuous — що відбувається зараз.md` | grammar | `en-a1-present-continuous` | am / is / are + -ing, правопис -ing (making, running), now / at the moment / Look!, контраст із Present Simple, like / know / want без -ing | 15 | 6 | 6 | 0 | 14 |
| 27 | 127 | Вільний час, хобі й погода | `English - A1 - 27. Вільний час, хобі й погода.md` | vocabulary | `en-a1-free-time` | хобі й спорт (play / go / do), like / love / hate / enjoy + -ing, погода (It's sunny / It's raining), пори року, What's the weather like? | 40 | 6 | 6 | 0 | 10 |
| 28 | 128 | Аудіювання — діалоги на щодень | `English - A1 - 28. Аудіювання — діалоги на щодень.md` | listening | `en-a1-listen-dialogues` | короткі діалоги: кафе, магазин, вулиця, знайомство, телефон; choice / answer / dictation, slow → normal; відповіді учня через `[!speak]` | 10 | 18 | 6 | 0 | 10 |
| 29 | 129 | Читання й письмо — анкета, оголошення, листівка | `English - A1 - 29. Читання й письмо — анкета, оголошення, листівка.md` | skills | `en-a1-read-write` | вивіски, оголошення, меню, короткі повідомлення; анкета (first name, surname, date of birth), повідомлення про себе, листівка; великі літери (I, дні, мови), and / but / because, пунктуація | 20 | 4 | 3 | 0 | 12 |
| 30 | 130 | Підсумок A1 — тест рівня | `English - A1 - 30. Підсумок A1 — тест рівня.md` | review | `en-a1-review` | змішані тести з усіх тем (choice / fill / order), диктант, мінімальні пари, чекліст «я вмію» A1; без нового матеріалу | 0 | 10 | 6 | 6 | 30 |

**Підсумок A1:** 30 тем · grammar 12 · vocabulary 9 · pronunciation 5 · listening 2 · skills 1 · review 1 ·
≈ 710 `[!word]` · ≈ 207 `[!listen]` · ≈ 191 `[!speak]` · ≈ 74 `[!pair]` · ≈ 350 `[!quiz]`.

---

## 5. A2 — Елементарний (Waystage)

**Ціль рівня:** розуміти речення й часті вирази з найближчих сфер (сімʼя, покупки, робота, місцевість);
спілкуватися в простих рутинних ситуаціях; описувати своє минуле, оточення, плани.
**Лексика:** + ≈ 700 слів (разом ≈ 1300; активно ≈ 1000).

- **Граматика:** was / were; Past Simple (правильні й 60 неправильних, + / − / ?, subject / object questions);
  Past Continuous; ступені порівняння, as…as; be going to, Present Continuous для домовленостей, will / shall;
  Present Perfect (досвід; just / already / yet; vs Past Simple; for / since базово); must / have to / should,
  mustn't vs don't have to; a few / a little / too / enough; something / anyone / nobody; прислівники способу дії,
  порядок слів; дієслово + to / -ing, інфінітив мети; linkers first / then / after that / so / when.
- **Лексика за темами:** біографія й життєві події; подорожі, транспорт, готель; робота, професії, навчання;
  здоровʼя й лікар; почуття й характер (-ed / -ing); гроші, покупки, послуги; перші фразові дієслова.
- **Вимова:** -ed; наголос у слові; наголос у реченні й слабкі форми; інтонація; правила читання й німі літери.
- **Аудіювання:** розуміє оголошення, інструкції, прості телефонні розмови; витягує конкретні дані (час, номер, ціна).
- **Читання:** короткі статті, листи, оголошення, розклади, меню — знаходить потрібну інформацію.
- **Письмо:** неформальний email, коротка історія в минулому, відгук, записка.
- **Говоріння:** розповісти про минуле, плани, досвід; домовитися, забронювати, поскаржитися в простих ситуаціях.

| № | order | Назва | Файл | Вид | id | Зміст | W | L | S | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 201 | Was і were — минуле дієслова to be | `English - A2 - 01. Was і were — минуле дієслова to be.md` | grammar | `en-a2-was-were` | was / were, wasn't / weren't, Were you…?, there was / were, I was born in…, Where were you yesterday? | 12 | 6 | 6 | 0 | 12 |
| 02 | 202 | Past Simple — правильні й неправильні дієслова | `English - A2 - 02. Past Simple — правильні й неправильні дієслова.md` | grammar | `en-a2-past-simple` | правопис -ed (stopped, studied), 60 найчастіших неправильних (`forms:` go → went → gone), yesterday / ago / last…; `[!diagram]` шкала | 60 | 6 | 6 | 0 | 14 |
| 03 | 203 | Вимова закінчення -ed | `English - A2 - 03. Вимова закінчення -ed.md` | pronunciation | `en-a2-ed-endings` | /t/ (worked), /d/ (played), /ɪd/ (wanted) — правило за останнім звуком; не читати «-ед» усюди | 18 | 6 | 10 | 8 | 10 |
| 04 | 204 | Past Simple — питання й заперечення | `English - A2 - 04. Past Simple — питання й заперечення.md` | grammar | `en-a2-past-questions` | did / didn't + base form (не «did went»), питальні слова, Who called you? vs Who did you call?, короткі відповіді | 10 | 6 | 6 | 0 | 14 |
| 05 | 205 | Біографія й життєві події | `English - A2 - 05. Біографія й життєві події.md` | vocabulary | `en-a2-life-events` | be born, grow up, graduate, get a job, get married, move; дати й роки; first / then / later; розповідь про себе | 40 | 6 | 6 | 0 | 10 |
| 06 | 206 | Наголос у слові | `English - A2 - 06. Наголос у слові.md` | pronunciation | `en-a2-word-stress` | наголошений склад і schwa в ненаголошених, моделі Oo / oO / Ooo / oOo, суфікси -tion / -ic / -ity, REcord / reCORD, позначки ˈ ˌ в IPA | 24 | 6 | 10 | 6 | 10 |
| 07 | 207 | Подорожі, відпустка й транспорт | `English - A2 - 07. Подорожі, відпустка й транспорт.md` | vocabulary | `en-a2-travel` | travel / trip / journey, airport, check in, boarding pass, luggage, booking; прийменники руху (into, out of, across, through), by car / on the train | 45 | 6 | 6 | 0 | 10 |
| 08 | 208 | Ступені порівняння прикметників | `English - A2 - 08. Ступені порівняння прикметників.md` | grammar | `en-a2-comparison` | -er / -est, more / most, good → better → best, bad, far; as…as, not as…as, than; much / a bit bigger; the biggest in / of | 25 | 5 | 6 | 0 | 14 |
| 09 | 209 | Аудіювання — оголошення й інструкції | `English - A2 - 09. Аудіювання — оголошення й інструкції.md` | listening | `en-a2-listen-announcements` | вокзал, аеропорт, магазин, прогноз погоди, автовідповідач; номер платформи / рейсу / час; інструкції (рецепт, маршрут) | 12 | 18 | 3 | 0 | 10 |
| 10 | 210 | Be going to — плани й наміри | `English - A2 - 10. Be going to — плани й наміри.md` | grammar | `en-a2-going-to` | be going to для планів і очевидних прогнозів (Look at those clouds!), Present Continuous для домовленостей, маркери майбутнього; gonna у розмові | 15 | 6 | 6 | 0 | 12 |
| 11 | 211 | Will — прогнози, обіцянки, рішення | `English - A2 - 11. Will — прогнози, обіцянки, рішення.md` | grammar | `en-a2-will` | will / won't, I think / probably, спонтанні рішення (I'll have the soup), пропозиції й обіцянки, Shall I…?; `[!diagram]` compare will vs going to | 12 | 6 | 6 | 0 | 14 |
| 12 | 212 | Робота, професії й навчання | `English - A2 - 12. Робота, професії й навчання.md` | vocabulary | `en-a2-work` | професії, робочі місця, обовʼязки, шкільні предмети, університет, іспити; What do you do? / I work as… / I'm in IT; work vs job | 45 | 6 | 6 | 0 | 10 |
| 13 | 213 | Наголос у реченні й слабкі форми | `English - A2 - 13. Наголос у реченні й слабкі форми.md` | pronunciation | `en-a2-sentence-stress` | змістові слова наголошені, службові — слабкі /ə/ (to, for, and, of, can, was, a, the); ритм англійської vs української | 16 | 8 | 10 | 4 | 10 |
| 14 | 214 | Present Perfect — досвід, ever, never | `English - A2 - 14. Present Perfect — досвід, ever, never.md` | grammar | `en-a2-present-perfect` | have / has + V3, been vs gone, Have you ever…?, never, третя форма неправильних; `[!diagram]` «минуле, повʼязане з тепер» | 30 | 6 | 6 | 0 | 14 |
| 15 | 215 | Present Perfect чи Past Simple — just, already, yet | `English - A2 - 15. Present Perfect чи Past Simple — just, already, yet.md` | grammar | `en-a2-perfect-vs-past` | just / already / yet / still, for / since базово, коли лише Past Simple (yesterday, in 2010, When…?); пастка «I have seen him yesterday» | 10 | 6 | 6 | 0 | 16 |
| 16 | 216 | Здоровʼя, тіло й у лікаря | `English - A2 - 16. Здоровʼя, тіло й у лікаря.md` | vocabulary | `en-a2-health` | частини тіла, симптоми (I've got a headache, My … hurts), у лікаря й аптеці, should / shouldn't для порад | 40 | 6 | 6 | 0 | 10 |
| 17 | 217 | Must, have to, should — обовʼязок і порада | `English - A2 - 17. Must, have to, should — обовʼязок і порада.md` | grammar | `en-a2-modals` | must vs have to, mustn't (заборона) vs don't have to (нема потреби), should / shouldn't, минуле had to; правила школи й роботи | 12 | 5 | 6 | 0 | 14 |
| 18 | 218 | Інтонація — питання, переліки, емоції | `English - A2 - 18. Інтонація — питання, переліки, емоції.md` | pronunciation | `en-a2-intonation` | ↘ у wh-питаннях і твердженнях, ↗ у yes/no, переліки (apples ↗, bananas ↗ and pears ↘), зацікавленість і ввічливість (Really?), впізнавання question tags | 10 | 8 | 12 | 4 | 10 |
| 19 | 219 | Past Continuous — дія в процесі в минулому | `English - A2 - 19. Past Continuous — дія в процесі в минулому.md` | grammar | `en-a2-past-continuous` | was / were + -ing, while / when, перервана дія (I was cooking when the phone rang), фон історії; `[!diagram]` timeline | 12 | 6 | 6 | 0 | 14 |
| 20 | 220 | Почуття й характер — прикметники на -ed та -ing | `English - A2 - 20. Почуття й характер — прикметники на -ed та -ing.md` | vocabulary | `en-a2-feelings` | емоції (happy, worried, angry), bored vs boring, interested vs interesting, характер (shy, generous), How do you feel? | 40 | 6 | 6 | 0 | 10 |
| 21 | 221 | Аудіювання — телефонні розмови й повідомлення | `English - A2 - 21. Аудіювання — телефонні розмови й повідомлення.md` | listening | `en-a2-listen-phone` | бронювання, запис до лікаря, голосові повідомлення; Can I speak to…, I'll call back, leave a message; записати імʼя / номер / час | 15 | 18 | 6 | 0 | 10 |
| 22 | 222 | Кількість — a few, a little, too, enough і something, anyone | `English - A2 - 22. Кількість — a few, a little, too, enough і something, anyone.md` | grammar | `en-a2-quantifiers` | a few / a little / few / little, a lot of, too much / many, (not) enough, too + adj; some- / any- / no- / every- + thing / body / where | 20 | 5 | 5 | 0 | 14 |
| 23 | 223 | Прислівники й порядок слів | `English - A2 - 23. Прислівники й порядок слів.md` | grammar | `en-a2-adverbs` | -ly (quickly, carefully), well / hard / fast / late, a good driver vs drives well, SVO + місце + час, позиція прислівників | 20 | 4 | 5 | 0 | 12 |
| 24 | 224 | Гроші, покупки й послуги | `English - A2 - 24. Гроші, покупки й послуги.md` | vocabulary | `en-a2-money` | pay by card / in cash, change, receipt, refund, cost / spend / save / borrow / lend, банк, банкомат, пошта, оренда; проста скарга | 40 | 6 | 6 | 0 | 10 |
| 25 | 225 | Дієслово + to чи -ing | `English - A2 - 25. Дієслово + to чи -ing.md` | grammar | `en-a2-verb-patterns` | want / need / decide / hope + to; enjoy / finish / mind / stop + -ing; like / love + обидва; would like to; інфінітив мети (to buy milk) | 25 | 5 | 5 | 0 | 14 |
| 26 | 226 | Правила читання й німі літери | `English - A2 - 26. Правила читання й німі літери.md` | pronunciation | `en-a2-spelling` | відкритий / закритий склад (hat / hate), magic e, ee / ea / oo / ai / ou / ow / igh, sh / ch / ph / wh / ck / ng, німі літери (knife, write, hour, listen, doubt) | 30 | 6 | 8 | 8 | 10 |
| 27 | 227 | Перші фразові дієслова | `English - A2 - 27. Перші фразові дієслова.md` | vocabulary | `en-a2-phrasal-verbs` | що таке phrasal verb; 30 базових (get up, put on, take off, turn on / off, look for, look after, find out, give up, pick up…); розділювані (turn it on) | 30 | 6 | 6 | 0 | 12 |
| 28 | 228 | Читання й письмо — email, історія, відгук | `English - A2 - 28. Читання й письмо — email, історія, відгук.md` | skills | `en-a2-read-write` | короткі статті й листи (gist / detail), неформальний email (Hi…, Thanks for…, See you), історія в минулому з linkers (first, then, after that, finally; so, when), короткий відгук | 20 | 4 | 3 | 0 | 12 |
| 29 | 229 | Ситуації — готель, ресторан, вокзал, аптека | `English - A2 - 29. Ситуації — готель, ресторан, вокзал, аптека.md` | skills | `en-a2-situations` | рольові діалоги: check-in і проблема з номером, замовлення й скарга в ресторані, квитки (single / return), аптека; Could I…?, Would you mind…? | 30 | 10 | 12 | 0 | 10 |
| 30 | 230 | Підсумок A2 — тест рівня | `English - A2 - 30. Підсумок A2 — тест рівня.md` | review | `en-a2-review` | змішані тести, неправильні дієслова, Past / Perfect / Future, диктант, вимова, чекліст «я вмію» A2 | 0 | 10 | 6 | 6 | 30 |

**Підсумок A2:** 30 тем · grammar 13 · vocabulary 7 · pronunciation 5 · listening 2 · skills 2 · review 1 ·
≈ 720 `[!word]` · ≈ 208 `[!listen]` · ≈ 197 `[!speak]` · ≈ 36 `[!pair]` · ≈ 372 `[!quiz]`.

### 5.1 Розподіл роботи над A1–A2

| Пакет | Теми | К-сть |
|---|---|---|
| A1 граматика + лексика | A1 02–04, 06–09, 11–12, 14–16, 18–22, 24–27 | 21 |
| A2 граматика + лексика | A2 01–02, 04–05, 07–08, 10–12, 14–17, 19–20, 22–25, 27 | 20 |
| Вимова + аудіювання A1–A2 | A1 01, 05, 10, 13, 17, 23, 28 · A2 03, 06, 09, 13, 18, 21, 26 | 14 |
| Навички й підсумки (після решти) | A1 29, 30 · A2 28, 29, 30 | 5 |

Підсумки (`review`) пишуться останніми — вони повторюють лексику й граматику всіх тем рівня. Навички (`skills`)
логічно додати до пакета граматики + лексики свого рівня.

---

## 6. B1 — Середній (Threshold) · план

**Ціль:** розуміти головне в чіткому мовленні на знайомі теми; впоратися з більшістю ситуацій у подорожі; зв'язно
описувати досвід, події, мрії, коротко обґрунтовувати думку. **Лексика:** + ≈ 1000 (разом ≈ 2300).

- **Граматика:** Present Simple vs Continuous, дієслова стану; наративні часи (Past Perfect); used to / would /
  be used to; Present Perfect Continuous; усі форми майбутнього; умовні 0 / 1 / 2, unless, as soon as; модальні
  ймовірності; can / could / be able to; пасив (Present, Past); непряма мова; означальні підрядні; артиклі глибше;
  question tags і непрямі питання.
- **Лексика:** стосунки; технології й соцмережі; довкілля; кар'єра й співбесіда; медіа; колокації make / do / have /
  take / get; словотвір; фразові дієслова й ідіоми B1.
- **Вимова:** linking; слабкі форми й ритм.
- **Аудіювання:** новини й подкасти повільного темпу, інтерв'ю — головна думка і ключові деталі.
- **Читання:** статті на знайомі теми, skimming / scanning, листи з емоціями й побажаннями.
- **Письмо:** особистий і простий офіційний лист, есе-думка (150–180 слів), історія.
- **Говоріння:** розповідь, аргументована думка, згода / незгода, проблеми в подорожі.

| № | order | Назва | Файл | Вид | id | Зміст | W | L | S | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 301 | Теперішні часи — Simple чи Continuous, дієслова стану | `English - B1 - 01. Теперішні часи — Simple чи Continuous, дієслова стану.md` | grammar | `en-b1-present-tenses` | постійне vs тимчасове, stative verbs (know, belong, seem), think / have / see у двох значеннях | 12 | 6 | 6 | 0 | 14 |
| 02 | 302 | Стосунки й особистість | `English - B1 - 02. Стосунки й особистість.md` | vocabulary | `en-b1-relationships` | друзі, партнери, конфлікти, риси характеру, get on with, fall out | 45 | 6 | 6 | 0 | 10 |
| 03 | 303 | Наративні часи — Past Simple, Continuous і Perfect | `English - B1 - 03. Наративні часи — Past Simple, Continuous і Perfect.md` | grammar | `en-b1-narrative-tenses` | Past Perfect, послідовність подій, by the time, `[!diagram]` timeline трьох часів | 12 | 6 | 6 | 0 | 14 |
| 04 | 304 | Used to, would і be used to | `English - B1 - 04. Used to, would і be used to.md` | grammar | `en-b1-used-to` | минулі звички й стани, would для повторюваних дій, be / get used to + -ing | 10 | 5 | 5 | 0 | 14 |
| 05 | 305 | Звʼязне мовлення — linking | `English - B1 - 05. Звʼязне мовлення — linking.md` | pronunciation | `en-b1-linking` | приголосний + голосний (turn_it_off), /j/ і /w/ між голосними (go_w_on), однакові приголосні | 10 | 10 | 12 | 6 | 10 |
| 06 | 306 | Present Perfect Continuous — for, since, how long | `English - B1 - 06. Present Perfect Continuous — for, since, how long.md` | grammar | `en-b1-perfect-continuous` | тривалість до тепер, результат vs процес, How long have you been…? | 12 | 6 | 6 | 0 | 14 |
| 07 | 307 | Технології, інтернет і соцмережі | `English - B1 - 07. Технології, інтернет і соцмережі.md` | vocabulary | `en-b1-tech` | гаджети, застосунки, онлайн-безпека, post / share / scroll, фразові з tech | 45 | 6 | 6 | 0 | 10 |
| 08 | 308 | Майбутнє — will, going to, Present Continuous, розклад | `English - B1 - 08. Майбутнє — will, going to, Present Continuous, розклад.md` | grammar | `en-b1-future-forms` | усі форми майбутнього, Present Simple для розкладу, вибір форми за наміром | 10 | 6 | 6 | 0 | 14 |
| 09 | 309 | Аудіювання — новини, подкасти, оголошення | `English - B1 - 09. Аудіювання — новини, подкасти, оголошення.md` | listening | `en-b1-listen-news` | новини повільного темпу, подкасти; gist → detail, передбачення змісту | 15 | 18 | 3 | 0 | 10 |
| 10 | 310 | Умовні речення — нульовий і перший | `English - B1 - 10. Умовні речення — нульовий і перший.md` | grammar | `en-b1-conditionals-1` | if + Present, unless, as soon as, when; часові підрядні без will | 10 | 6 | 6 | 0 | 14 |
| 11 | 311 | Другий умовний — уявні ситуації | `English - B1 - 11. Другий умовний — уявні ситуації.md` | grammar | `en-b1-conditionals-2` | if + Past, would, If I were you, 1st vs 2nd conditional | 10 | 6 | 6 | 0 | 14 |
| 12 | 312 | Довкілля, природа й клімат | `English - B1 - 12. Довкілля, природа й клімат.md` | vocabulary | `en-b1-environment` | клімат, забруднення, переробка, тварини й ландшафт | 45 | 6 | 6 | 0 | 10 |
| 13 | 313 | Слабкі форми й ритм мовлення | `English - B1 - 13. Слабкі форми й ритм мовлення.md` | pronunciation | `en-b1-weak-forms` | сильні vs слабкі форми (from /frəm/, at /ət/, have /əv/), stress-timing, наголос у фразових дієсловах | 15 | 10 | 12 | 6 | 10 |
| 14 | 314 | Ймовірність — may, might, could, must, can't | `English - B1 - 14. Ймовірність — may, might, could, must, can't.md` | grammar | `en-b1-modals-possibility` | шкала впевненості, дедукція про тепер, `[!diagram]` шкала | 10 | 6 | 6 | 0 | 14 |
| 15 | 315 | Can, could, be able to, manage to | `English - B1 - 15. Can, could, be able to, manage to.md` | grammar | `en-b1-ability` | вміння в різних часах, could vs was able to, manage to | 10 | 5 | 5 | 0 | 12 |
| 16 | 316 | Робота, карʼєра й співбесіда | `English - B1 - 16. Робота, карʼєра й співбесіда.md` | vocabulary | `en-b1-career` | apply, CV, salary, promotion, сильні сторони, типові питання співбесіди | 45 | 6 | 8 | 0 | 10 |
| 17 | 317 | Пасивний стан — Present і Past | `English - B1 - 17. Пасивний стан — Present і Past.md` | grammar | `en-b1-passive` | be + V3, by + агент, коли пасив природніший, процеси й новини | 15 | 5 | 5 | 0 | 14 |
| 18 | 318 | Медіа, новини й реклама | `English - B1 - 18. Медіа, новини й реклама.md` | vocabulary | `en-b1-media` | заголовки, види медіа, реклама, fake news, лексика заголовків | 40 | 6 | 6 | 0 | 10 |
| 19 | 319 | Непряма мова — твердження, питання, прохання | `English - B1 - 19. Непряма мова — твердження, питання, прохання.md` | grammar | `en-b1-reported-speech` | backshift, say vs tell, reported questions, tell / ask + to | 10 | 6 | 6 | 0 | 14 |
| 20 | 320 | Означальні речення — who, which, that, where, whose | `English - B1 - 20. Означальні речення — who, which, that, where, whose.md` | grammar | `en-b1-relative-clauses` | defining relative clauses, пропуск займенника, прийменник у кінці | 10 | 5 | 5 | 0 | 14 |
| 21 | 321 | Аудіювання — інтервʼю й розмови носіїв | `English - B1 - 21. Аудіювання — інтервʼю й розмови носіїв.md` | listening | `en-b1-listen-interviews` | інтервʼю, розмови 2–3 мовців, думки й ставлення, нотатки | 15 | 18 | 4 | 0 | 10 |
| 22 | 322 | Колокації — make, do, have, take, get | `English - B1 - 22. Колокації — make, do, have, take, get.md` | vocabulary | `en-b1-collocations` | make a decision / do homework, have a go, take a break, значення get | 50 | 5 | 6 | 0 | 12 |
| 23 | 323 | Словотвір — префікси й суфікси | `English - B1 - 23. Словотвір — префікси й суфікси.md` | vocabulary | `en-b1-word-formation` | un- / dis- / re- / over-, -ness / -ment / -able / -ful / -less, частини мови з одного кореня | 50 | 4 | 4 | 0 | 12 |
| 24 | 324 | Фразові дієслова й ідіоми B1 | `English - B1 - 24. Фразові дієслова й ідіоми B1.md` | vocabulary | `en-b1-phrasal-idioms` | 30 фразових (run out of, put off, come across), 15 частих ідіом (piece of cake) | 45 | 6 | 6 | 0 | 12 |
| 25 | 325 | Артиклі глибше — the, a і нульовий артикль | `English - B1 - 25. Артиклі глибше — the, a і нульовий артикль.md` | grammar | `en-b1-articles` | генералізація, унікальні обʼєкти, географічні назви, установи (go to school / the school) | 15 | 4 | 4 | 0 | 16 |
| 26 | 326 | Question tags і непрямі питання | `English - B1 - 26. Question tags і непрямі питання.md` | grammar | `en-b1-questions` | isn't it? / don't you?, інтонація tags, Could you tell me where…? | 8 | 8 | 8 | 0 | 14 |
| 27 | 327 | Письмо — лист, email, есе-думка | `English - B1 - 27. Письмо — лист, email, есе-думка.md` | skills | `en-b1-writing` | структура листа, formal vs informal, абзаци, linkers (however, in addition), есе 150–180 слів | 25 | 3 | 3 | 0 | 12 |
| 28 | 328 | Читання — статті й стратегії skimming, scanning | `English - B1 - 28. Читання — статті й стратегії skimming, scanning.md` | skills | `en-b1-reading` | gist / detail, здогадка зі контексту, true / false / not given | 25 | 3 | 3 | 0 | 12 |
| 29 | 329 | Говоріння — розповідь, думка, згода й незгода | `English - B1 - 29. Говоріння — розповідь, думка, згода й незгода.md` | skills | `en-b1-speaking` | In my opinion, I see your point but…, filler phrases, проблеми в подорожі | 25 | 8 | 14 | 0 | 10 |
| 30 | 330 | Підсумок B1 — тест рівня | `English - B1 - 30. Підсумок B1 — тест рівня.md` | review | `en-b1-review` | змішаний тест, аудіювання, вимова, чекліст «я вмію» B1 | 0 | 10 | 6 | 4 | 30 |

---

## 7. B2 — Вище середнього (Vantage) · план

**Ціль:** розуміти основний зміст складних текстів, зокрема фахових дискусій; спілкуватися спонтанно й вільно з
носіями; чітко й детально писати на широке коло тем, пояснювати позицію з плюсами й мінусами.
**Лексика:** + ≈ 1700 (разом ≈ 4000).

- **Граматика:** система часів як аспекти; Future Continuous / Perfect; 3-й і змішані умовні; wish / if only /
  I'd rather / it's time; пасив усіх часів, have something done, it is said that; дієслова непрямої мови; модальні в
  минулому; герундій vs інфінітив зі зміною значення; non-defining і скорочені підрядні; дискурсивні звʼязки.
- **Лексика:** бізнес; наука й технології; суспільство й закон; здоровʼя й психологія; економіка; мистецтво й
  культура; фразові за частками; ідіоми; колокації; словотвір.
- **Вимова:** elision, assimilation, intrusive r; розмовні скорочення.
- **Аудіювання:** лекції, фільми й серіали в природному темпі, різні мовці.
- **Читання:** довгі статті, висновки, тон і позиція автора.
- **Письмо:** есе for and against, звіт, відгук, офіційний лист / скарга (220–260 слів).
- **Говоріння:** аргументація, дискусія, переконання, складні побутові ситуації.

| № | order | Назва | Файл | Вид | id | Зміст | W | L | S | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 401 | Система часів — simple, continuous, perfect | `English - B2 - 01. Система часів — simple, continuous, perfect.md` | grammar | `en-b2-tense-system` | 12 часів як 3 аспекти × часи, `[!diagram]` карта часів, вибір часу | 10 | 6 | 6 | 0 | 16 |
| 02 | 402 | Future Continuous і Future Perfect | `English - B2 - 02. Future Continuous і Future Perfect.md` | grammar | `en-b2-future-perfect` | this time tomorrow, by 2030 I will have…, Future Perfect Continuous | 10 | 6 | 6 | 0 | 14 |
| 03 | 403 | Третій і змішані умовні | `English - B2 - 03. Третій і змішані умовні.md` | grammar | `en-b2-conditionals-3` | if + Past Perfect, would have, змішані 2 + 3 | 10 | 6 | 6 | 0 | 14 |
| 04 | 404 | Wish, if only, I'd rather, it's time | `English - B2 - 04. Wish, if only, I'd rather, it's time.md` | grammar | `en-b2-wish` | жаль про тепер / минуле, wish + would, нереальне минуле | 10 | 6 | 6 | 0 | 14 |
| 05 | 405 | Пасив глибше — have something done, it is said that | `English - B2 - 05. Пасив глибше — have something done, it is said that.md` | grammar | `en-b2-passive` | пасив усіх часів, каузатив, безособовий пасив | 15 | 5 | 5 | 0 | 14 |
| 06 | 406 | Непряма мова — suggest, admit, deny, warn | `English - B2 - 06. Непряма мова — suggest, admit, deny, warn.md` | grammar | `en-b2-reporting-verbs` | дієслова-репортери і їхні моделі (+ -ing, + to, + that) | 25 | 6 | 6 | 0 | 14 |
| 07 | 407 | Модальні в минулому — must have, should have, could have | `English - B2 - 07. Модальні в минулому — must have, should have, could have.md` | grammar | `en-b2-past-modals` | дедукція і критика минулого, needn't have vs didn't need to | 10 | 6 | 6 | 0 | 14 |
| 08 | 408 | Герундій та інфінітив — remember, stop, try | `English - B2 - 08. Герундій та інфінітив — remember, stop, try.md` | grammar | `en-b2-gerund-infinitive` | зміна значення, after prepositions, it's no use + -ing | 20 | 5 | 5 | 0 | 14 |
| 09 | 409 | Підрядні речення — non-defining і скорочені | `English - B2 - 09. Підрядні речення — non-defining і скорочені.md` | grammar | `en-b2-relative-advanced` | коми, which про все речення, participle clauses, with whom | 10 | 4 | 4 | 0 | 14 |
| 10 | 410 | Звʼязки — although, despite, whereas, however | `English - B2 - 10. Звʼязки — although, despite, whereas, however.md` | grammar | `en-b2-linkers` | контраст, причина, мета, результат; пунктуація звʼязок | 30 | 4 | 4 | 0 | 14 |
| 11 | 411 | Звʼязне мовлення — випадіння, злиття, intrusive r | `English - B2 - 11. Звʼязне мовлення — випадіння, злиття, intrusive r.md` | pronunciation | `en-b2-connected-speech` | elision (nex(t) day), assimilation (ten boys → tem boys), catenation, intrusive / linking r | 12 | 12 | 12 | 6 | 10 |
| 12 | 412 | Розмовні скорочення — gonna, wanna, gotta, dunno | `English - B2 - 12. Розмовні скорочення — gonna, wanna, gotta, dunno.md` | pronunciation | `en-b2-reductions` | редукції швидкого мовлення, коли їх писати не можна, впізнавання на слух | 15 | 14 | 8 | 4 | 10 |
| 13 | 413 | Аудіювання — лекції й нотатки | `English - B2 - 13. Аудіювання — лекції й нотатки.md` | listening | `en-b2-listen-lectures` | signposting (firstly, on the other hand), нотатки, структура доповіді | 20 | 16 | 3 | 0 | 10 |
| 14 | 414 | Аудіювання — фільми й серіали | `English - B2 - 14. Аудіювання — фільми й серіали.md` | listening | `en-b2-listen-films` | природний темп, перебивання, гумор, розмовна лексика | 20 | 18 | 6 | 0 | 10 |
| 15 | 415 | Бізнес — зустрічі, переговори, листування | `English - B2 - 15. Бізнес — зустрічі, переговори, листування.md` | vocabulary | `en-b2-business` | agenda, deadline, stakeholder, negotiate, follow up | 50 | 6 | 8 | 0 | 10 |
| 16 | 416 | Наука, технології й майбутнє | `English - B2 - 16. Наука, технології й майбутнє.md` | vocabulary | `en-b2-science` | дослідження, AI, космос, медицина майбутнього | 45 | 6 | 6 | 0 | 10 |
| 17 | 417 | Суспільство, закон і злочинність | `English - B2 - 17. Суспільство, закон і злочинність.md` | vocabulary | `en-b2-society` | злочини й покарання, суд, права, політика | 50 | 6 | 6 | 0 | 10 |
| 18 | 418 | Здоровʼя, психологія й спосіб життя | `English - B2 - 18. Здоровʼя, психологія й спосіб життя.md` | vocabulary | `en-b2-wellbeing` | стрес, звички, ментальне здоровʼя, спорт | 45 | 6 | 6 | 0 | 10 |
| 19 | 419 | Гроші, економіка й споживання | `English - B2 - 19. Гроші, економіка й споживання.md` | vocabulary | `en-b2-economy` | інфляція, інвестиції, борг, споживацтво | 45 | 6 | 6 | 0 | 10 |
| 20 | 420 | Мистецтво, культура й рецензії | `English - B2 - 20. Мистецтво, культура й рецензії.md` | vocabulary | `en-b2-culture` | кіно, література, музика, лексика оцінки | 45 | 6 | 6 | 0 | 10 |
| 21 | 421 | Фразові дієслова — частки up, out, off, down, over | `English - B2 - 21. Фразові дієслова — частки up, out, off, down, over.md` | vocabulary | `en-b2-particles` | значення часток як система, 50 фразових | 50 | 6 | 6 | 0 | 14 |
| 22 | 422 | Ідіоми й сталі вирази B2 | `English - B2 - 22. Ідіоми й сталі вирази B2.md` | vocabulary | `en-b2-idioms` | 40 ідіом за темами, біноміали (pros and cons, sooner or later) | 45 | 6 | 8 | 0 | 12 |
| 23 | 423 | Колокації — прикметник, іменник, прислівник | `English - B2 - 23. Колокації — прикметник, іменник, прислівник.md` | vocabulary | `en-b2-collocations` | heavy rain, strong coffee, highly unlikely, deeply concerned | 50 | 4 | 4 | 0 | 12 |
| 24 | 424 | Словотвір — складні слова й заперечні префікси | `English - B2 - 24. Словотвір — складні слова й заперечні префікси.md` | vocabulary | `en-b2-word-formation` | in- / im- / il- / ir-, mis-, compounds, конверсія | 50 | 4 | 4 | 0 | 12 |
| 25 | 425 | Письмо — есе for and against, звіт, відгук | `English - B2 - 25. Письмо — есе for and against, звіт, відгук.md` | skills | `en-b2-writing` | структура, тези, звʼязність, регістр, 220–260 слів | 30 | 3 | 3 | 0 | 12 |
| 26 | 426 | Говоріння — аргументація, дискусія, переконання | `English - B2 - 26. Говоріння — аргументація, дискусія, переконання.md` | skills | `en-b2-speaking` | розвиток аргументу, контраргументи, ввічлива незгода, перебивання | 30 | 8 | 14 | 0 | 10 |
| 27 | 427 | Читання — довгі тексти, висновки й тон автора | `English - B2 - 27. Читання — довгі тексти, висновки й тон автора.md` | skills | `en-b2-reading` | inference, позиція автора, gapped text, multiple matching | 30 | 3 | 3 | 0 | 12 |
| 28 | 428 | Ситуації — оренда, скарги, банк, співбесіда | `English - B2 - 28. Ситуації — оренда, скарги, банк, співбесіда.md` | skills | `en-b2-situations` | складні побутові й робочі діалоги, ескалація скарги | 35 | 10 | 12 | 0 | 10 |
| 29 | 429 | Підсумок B2 — тест рівня | `English - B2 - 29. Підсумок B2 — тест рівня.md` | review | `en-b2-review` | змішаний тест, аудіювання, вимова, чекліст «я вмію» B2 | 0 | 10 | 6 | 4 | 30 |

---

## 8. C1 і C2 · план

### 8.1 C1 — Просунутий (Effective Operational Proficiency)

**Ціль:** розуміти довгі складні тексти й імпліцитні значення; висловлюватися вільно без помітного пошуку слів;
гнучко вживати мову в соціальних, академічних і професійних цілях; писати чіткі структуровані тексти.
**Лексика:** + ≈ 2000 (разом ≈ 6000+).

- **Граматика:** інверсія; cleft-речення; еліпсис і заміна; умовні без if; нюанси модальних; партиципні звороти;
  номіналізація; дистанціювання (I was wondering…).
- **Лексика:** ідіоми; абстрактні фразові; академічна лексика (AWL); професійна комунікація; синоніми й
  конотації; колокації високого рівня; регістр; дискусійні теми.
- **Вимова:** інтонація ставлення, контрастивний наголос. **Аудіювання:** швидка розмова, акценти UK / US, лекції, TED.
- **Читання:** складні тексти з підтекстом. **Письмо:** есе, пропозиція, звіт, ділове листування, CV.
- **Говоріння:** презентації, дебати, small talk, медіація.

| № | order | Назва | Файл | Вид | id | Зміст | W | L | S | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 501 | Інверсія — Never have I, Not only, Hardly | `English - C1 - 01. Інверсія — Never have I, Not only, Hardly.md` | grammar | `en-c1-inversion` | заперечні прислівники, so / neither, only after / when | 10 | 5 | 6 | 0 | 14 |
| 02 | 502 | Розщеплені речення — What I need is, It was … that | `English - C1 - 02. Розщеплені речення — What I need is, It was … that.md` | grammar | `en-c1-cleft` | it-cleft, wh-cleft, емфаза в мовленні | 8 | 5 | 6 | 0 | 14 |
| 03 | 503 | Еліпсис і заміна — so, not, do so, one | `English - C1 - 03. Еліпсис і заміна — so, not, do so, one.md` | grammar | `en-c1-ellipsis` | I hope so / I'm afraid not, пропуск у відповідях і після to | 8 | 5 | 5 | 0 | 14 |
| 04 | 504 | Умовні без if — Should you, Were I, Had I known | `English - C1 - 04. Умовні без if — Should you, Were I, Had I known.md` | grammar | `en-c1-conditionals` | інверсія в умовних, provided / as long as / otherwise / but for | 15 | 5 | 5 | 0 | 14 |
| 05 | 505 | Модальні — нюанси значень | `English - C1 - 05. Модальні — нюанси значень.md` | grammar | `en-c1-modals` | needn't have, might well, be bound to, be to, will для припущень | 15 | 5 | 5 | 0 | 14 |
| 06 | 506 | Дієприкметникові звороти — Having finished, Given that | `English - C1 - 06. Дієприкметникові звороти — Having finished, Given that.md` | grammar | `en-c1-participles` | participle clauses, dangling participles як помилка | 12 | 4 | 4 | 0 | 14 |
| 07 | 507 | Номіналізація й академічний стиль | `English - C1 - 07. Номіналізація й академічний стиль.md` | grammar | `en-c1-nominalisation` | дієслово → іменник, щільність тексту, безособовість | 30 | 3 | 3 | 0 | 12 |
| 08 | 508 | Дистанціювання й ввічливість — I was wondering | `English - C1 - 08. Дистанціювання й ввічливість — I was wondering.md` | grammar | `en-c1-distancing` | минулі й тривалі форми для ввічливості, it seems / would appear | 20 | 6 | 8 | 0 | 12 |
| 09 | 509 | Hedging — обережні формулювання | `English - C1 - 09. Hedging — обережні формулювання.md` | vocabulary | `en-c1-hedging` | tends to, arguably, to some extent, it could be argued | 30 | 4 | 4 | 0 | 12 |
| 10 | 510 | Інтонація ставлення й контрастивний наголос | `English - C1 - 10. Інтонація ставлення й контрастивний наголос.md` | pronunciation | `en-c1-intonation` | fall-rise, сарказм, ввічливість, «I didn't say HE stole it» | 8 | 12 | 14 | 6 | 10 |
| 11 | 511 | Аудіювання — швидка розмова й акценти UK, US | `English - C1 - 11. Аудіювання — швидка розмова й акценти UK, US.md` | listening | `en-c1-listen-fast` | перекриття реплік, сленг, різні регіони | 20 | 18 | 4 | 4 | 10 |
| 12 | 512 | Аудіювання — лекції, TED, аргументація | `English - C1 - 12. Аудіювання — лекції, TED, аргументація.md` | listening | `en-c1-listen-talks` | структура аргументу, позиція мовця, нотатки | 25 | 16 | 3 | 0 | 10 |
| 13 | 513 | Ідіоми — тіло, кольори, тварини, гроші | `English - C1 - 13. Ідіоми — тіло, кольори, тварини, гроші.md` | vocabulary | `en-c1-idioms` | 50 ідіом з контекстом і регістром | 50 | 6 | 8 | 0 | 12 |
| 14 | 514 | Фразові дієслова — абстрактні значення | `English - C1 - 14. Фразові дієслова — абстрактні значення.md` | vocabulary | `en-c1-phrasal-abstract` | bring about, come up against, play down, phrasal nouns (outcome, setback) | 50 | 6 | 6 | 0 | 12 |
| 15 | 515 | Академічна лексика — Academic Word List | `English - C1 - 15. Академічна лексика — Academic Word List.md` | vocabulary | `en-c1-academic` | AWL sublists 1–3, родини слів | 60 | 4 | 4 | 0 | 12 |
| 16 | 516 | Професійна комунікація — переговори, фідбек | `English - C1 - 16. Професійна комунікація — переговори, фідбек.md` | vocabulary | `en-c1-professional` | фасилітація, фідбек, дипломатична мова, email-тон | 45 | 6 | 10 | 0 | 10 |
| 17 | 517 | Синоніми, конотації й нюанси значень | `English - C1 - 17. Синоніми, конотації й нюанси значень.md` | vocabulary | `en-c1-nuance` | slim / skinny / thin, stubborn / determined, позитив / негатив | 50 | 4 | 4 | 0 | 14 |
| 18 | 518 | Колокації високого рівня | `English - C1 - 18. Колокації високого рівня.md` | vocabulary | `en-c1-collocations` | pose a threat, bitterly disappointed, a sweeping generalisation | 60 | 4 | 4 | 0 | 12 |
| 19 | 519 | Регістр — formal vs informal, фразові vs латинізми | `English - C1 - 19. Регістр — formal vs informal, фразові vs латинізми.md` | skills | `en-c1-register` | find out ↔ ascertain, перемикання стилю, тон листа | 40 | 6 | 6 | 0 | 12 |
| 20 | 520 | Письмо — аргументаційне есе, пропозиція, звіт | `English - C1 - 20. Письмо — аргументаційне есе, пропозиція, звіт.md` | skills | `en-c1-writing` | структура C1, когезія, 220–260 слів | 30 | 3 | 3 | 0 | 12 |
| 21 | 521 | Письмо — ділове листування, CV і cover letter | `English - C1 - 21. Письмо — ділове листування, CV і cover letter.md` | skills | `en-c1-correspondence` | супровідний лист, CV, відмова, нагадування, скарга | 35 | 3 | 3 | 0 | 12 |
| 22 | 522 | Читання — складні тексти, підтекст і аргументація | `English - C1 - 22. Читання — складні тексти, підтекст і аргументація.md` | skills | `en-c1-reading` | імпліцитне значення, іронія, cross-text multiple matching | 35 | 3 | 3 | 0 | 12 |
| 23 | 523 | Говоріння — презентації, дебати, small talk | `English - C1 - 23. Говоріння — презентації, дебати, small talk.md` | skills | `en-c1-speaking` | signposting, Q&A, підтримка розмови, медіація | 30 | 8 | 16 | 0 | 10 |
| 24 | 524 | Дискусійні теми — медіа, етика, глобалізація | `English - C1 - 24. Дискусійні теми — медіа, етика, глобалізація.md` | vocabulary | `en-c1-issues` | лексика суспільних дебатів, баланс думок | 50 | 6 | 8 | 0 | 10 |
| 25 | 525 | Підсумок C1 — тест рівня | `English - C1 - 25. Підсумок C1 — тест рівня.md` | review | `en-c1-review` | змішаний тест, аудіювання, вимова, чекліст «я вмію» C1 | 0 | 10 | 6 | 4 | 30 |

### 8.2 C2 — Вільне володіння (Mastery)

**Ціль:** легко розуміти практично все почуте й прочитане; резюмувати з різних джерел, відтворюючи аргументи;
висловлюватися спонтанно, дуже вільно й точно, розрізняючи тонкі відтінки значень навіть у складних ситуаціях.
**Лексика:** + ≈ 2000–4000 (разом ≈ 8000–10000+, рецептивно більше).

- **Граматика:** маркований порядок слів і фронтування; тонкощі часів; детермінанти; субʼюнктив і формальні
  конструкції; складні речення й паралелізм.
- **Лексика:** ідіоматика й алюзії; розмовна мова й сленг UK / US; етимологія й корені; точність і understatement;
  кальки й хибні друзі; фахова англійська (огляд).
- **Вимова:** акценти світу; просодія публічного мовлення. **Аудіювання:** радіо, ток-шоу, перекриття мовлення.
- **Читання:** художня література, есеїстика, юридичні тексти. **Письмо:** стилістика й редагування, рецензія, стаття.
- **Говоріння:** переговори, дипломатія, імпровізація, гумор, медіація між мовами й аудиторіями.

| № | order | Назва | Файл | Вид | id | Зміст | W | L | S | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 601 | Маркований порядок слів — фронтування й емфаза | `English - C2 - 01. Маркований порядок слів — фронтування й емфаза.md` | grammar | `en-c2-word-order` | Strange as it may seem, Little did they know, фронтування обставин | 8 | 5 | 6 | 0 | 14 |
| 02 | 602 | Тонкощі часів — історичний теперішній, tentative past | `English - C2 - 02. Тонкощі часів — історичний теперішній, tentative past.md` | grammar | `en-c2-tense-nuance` | present for past narrative, will для звичок, I was hoping… | 8 | 6 | 6 | 0 | 14 |
| 03 | 603 | Тонкощі артиклів і детермінантів | `English - C2 - 03. Тонкощі артиклів і детермінантів.md` | grammar | `en-c2-determiners` | a Mr Smith, the + прикметник, абстрактні іменники, either / neither / each | 15 | 4 | 4 | 0 | 14 |
| 04 | 604 | Субʼюнктив і формальні конструкції | `English - C2 - 04. Субʼюнктив і формальні конструкції.md` | grammar | `en-c2-subjunctive` | I insist that he be, Be that as it may, were-subjunctive | 12 | 4 | 4 | 0 | 14 |
| 05 | 605 | Складні речення — вкладення, абсолютні звороти, паралелізм | `English - C2 - 05. Складні речення — вкладення, абсолютні звороти, паралелізм.md` | grammar | `en-c2-complex-sentences` | absolute clauses, паралелізм, ритм речення | 10 | 4 | 4 | 0 | 12 |
| 06 | 606 | Ідіоматика — прислівʼя, алюзії, крилаті вислови | `English - C2 - 06. Ідіоматика — прислівʼя, алюзії, крилаті вислови.md` | vocabulary | `en-c2-idiomatic` | Шекспір, Біблія, поп-культура, обрізані прислівʼя (when in Rome…) | 50 | 6 | 8 | 0 | 12 |
| 07 | 607 | Розмовна мова й сленг UK, US | `English - C2 - 07. Розмовна мова й сленг UK, US.md` | vocabulary | `en-c2-colloquial` | сленг, інтернет-мова, регіоналізми, коли доречно | 50 | 8 | 6 | 0 | 12 |
| 08 | 608 | Етимологія — латинські й грецькі корені | `English - C2 - 08. Етимологія — латинські й грецькі корені.md` | vocabulary | `en-c2-roots` | корені й афікси для розшифровки незнайомих слів | 60 | 3 | 3 | 0 | 12 |
| 09 | 609 | Точність — understatement, евфемізми, ввічливе заперечення | `English - C2 - 09. Точність — understatement, евфемізми, ввічливе заперечення.md` | vocabulary | `en-c2-precision` | not bad at all, a bit of a…, британська недомовленість | 40 | 6 | 6 | 0 | 12 |
| 10 | 610 | Гумор, іронія й гра слів | `English - C2 - 10. Гумор, іронія й гра слів.md` | skills | `en-c2-humour` | каламбури, сарказм, deadpan, культурні жарти | 30 | 8 | 6 | 0 | 10 |
| 11 | 611 | Акценти світу — RP, General American, Australian, Scottish, Irish, Indian | `English - C2 - 11. Акценти світу — RP, General American, Australian, Scottish, Irish, Indian.md` | pronunciation | `en-c2-accents` | ротичність, голосні, мелодика; впізнавання на слух | 15 | 18 | 6 | 6 | 10 |
| 12 | 612 | Аудіювання — радіо, ток-шоу, перекриття мовлення | `English - C2 - 12. Аудіювання — радіо, ток-шоу, перекриття мовлення.md` | listening | `en-c2-listen-radio` | кілька мовців, шум, натяки, швидкий темп | 25 | 18 | 3 | 0 | 10 |
| 13 | 613 | Просодія на рівні носія — ритм, паузи, публічний виступ | `English - C2 - 13. Просодія на рівні носія — ритм, паузи, публічний виступ.md` | pronunciation | `en-c2-prosody` | chunking, паузи, темп, емфаза у виступі | 10 | 10 | 16 | 4 | 10 |
| 14 | 614 | Читання — художня література, есеїстика, юридичні тексти | `English - C2 - 14. Читання — художня література, есеїстика, юридичні тексти.md` | skills | `en-c2-reading` | стиль автора, архаїзми, юридичні конструкції | 40 | 3 | 3 | 0 | 12 |
| 15 | 615 | Письмо — стилістика, редагування, есе C2 | `English - C2 - 15. Письмо — стилістика, редагування, есе C2.md` | skills | `en-c2-style` | ясність, ритм, скорочення, редагування власного тексту | 30 | 2 | 2 | 0 | 12 |
| 16 | 616 | Письмо — рецензія, стаття, доповідь | `English - C2 - 16. Письмо — рецензія, стаття, доповідь.md` | skills | `en-c2-genres` | жанрові конвенції, заголовки, лід | 30 | 2 | 2 | 0 | 12 |
| 17 | 617 | Говоріння — переговори, дипломатія, імпровізація | `English - C2 - 17. Говоріння — переговори, дипломатія, імпровізація.md` | skills | `en-c2-negotiation` | тактики переговорів, буферні фрази, імпровізація | 30 | 8 | 16 | 0 | 10 |
| 18 | 618 | Кальки й хибні друзі — пастки для українців | `English - C2 - 18. Кальки й хибні друзі — пастки для українців.md` | vocabulary | `en-c2-false-friends` | magazine, accurate, sympathy, actual, кальки на кшталт «make a photo» — систематизація з усіх рівнів | 50 | 4 | 4 | 0 | 14 |
| 19 | 619 | Культурний контекст — реалії, ввічливість, табу | `English - C2 - 19. Культурний контекст — реалії, ввічливість, табу.md` | skills | `en-c2-culture` | реалії UK / US, ввічливість, табу-теми, small talk | 35 | 6 | 6 | 0 | 10 |
| 20 | 620 | Фахова англійська — IT, право, медицина, фінанси | `English - C2 - 20. Фахова англійська — IT, право, медицина, фінанси.md` | vocabulary | `en-c2-esp` | ключова лексика галузей, як вчити фахову лексику далі | 60 | 6 | 6 | 0 | 10 |
| 21 | 621 | Медіація — переказ, резюме, пояснення іншій аудиторії | `English - C2 - 21. Медіація — переказ, резюме, пояснення іншій аудиторії.md` | skills | `en-c2-mediation` | CEFR Companion Volume: резюмування з укр. на англ., спрощення для аудиторії | 25 | 6 | 8 | 0 | 10 |
| 22 | 622 | Підсумок C2 — екзамен рівня | `English - C2 - 22. Підсумок C2 — екзамен рівня.md` | review | `en-c2-review` | змішаний тест, аудіювання, вимова, чекліст «я вмію» C2 | 0 | 12 | 8 | 4 | 30 |

**Разом:** A1 30 · A2 30 · B1 30 · B2 29 · C1 25 · C2 22 = **166 тем**.

---

## 8.3 IELTS — ціль курсу (вимога власника, 2026-10-16)

Курс веде не лише до рівня CEFR, а й до **складання IELTS** (Academic і General Training). Принципи:

- **Шкала.** Рівень учня завжди показуємо і в CEFR, і як орієнтовний бал IELTS (офіційне узгодження
  Cambridge / British Council): нижче B1 → нижче 4.0 · B1 ≈ 4.0–5.0 · B2 ≈ 5.5–6.5 · C1 ≈ 7.0–8.0 ·
  C2 ≈ 8.5–9.0. Бал — діапазон і «орієнтовно»: письмо й говоріння вимірюються окремо.
- **Формат іспиту наскрізно з B1.** У кожному рівні B1–C2 частина практики — у форматі IELTS, щоб учень звикав
  до завдань ще до окремої підготовки:
  - **Listening** (4 частини: побутовий діалог, монолог, навчальна дискусія, лекція): form / note / table
    completion (`type: fill`), multiple choice (`[!listen]`), matching, plan/map labelling (`[!quiz]` з варіантами),
    spelling імен і чисел (диктант).
  - **Reading** (Academic: 3 тексти з журналів/книжок; General: оголошення, робочі документи, довгий текст):
    True / False / Not Given і Yes / No / Not Given (`[!quiz]` з трьома варіантами), matching headings,
    matching information / features, sentence / summary completion (`type: fill` з банком слів),
    short answers.
  - **Writing**: Task 1 Academic (графік / таблиця / процес / мапа, 150+ слів) або General (лист: формальний,
    напівформальний, неформальний); Task 2 — есе 250+ слів (opinion, discussion, problem–solution,
    advantages–disadvantages, two-part). Критерії банда: Task Achievement / Response, Coherence & Cohesion,
    Lexical Resource, Grammatical Range & Accuracy. Шаблони структур, мовні засоби, розбір зразків Band 6 / 7 / 8.
  - **Speaking**: Part 1 (інтерв'ю), Part 2 (cue card, 1 хв підготовки + 2 хв монолог), Part 3 (дискусія);
    критерії Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation (`[!speak]`).
- **Окремий розділ «IELTS: стратегії й пробні тести»** після B2 (`status: planned`, поки контент не готовий):
  по темі на кожен модуль і тип завдання, стратегії часу, типові пастки (paraphrase у Listening/Reading,
  Not Given ≠ False, перевищення ліміту слів), академічна лексика (Academic Word List), повні пробні тести
  Listening / Reading з оцінкою балу за офіційними таблицями відповідності (raw score → band).
- **Фінальний етап (AI, після підтвердження вартості):** перевірка Writing Task 1/2 і Speaking Part 1–3 за
  публічними band descriptors IELTS з поясненням українською, що підняти до наступного балу.
- Чесність: офіційні матеріали IELTS — власність British Council / IDP / Cambridge; ми пишемо власні завдання в
  тому самому форматі й не копіюємо тести.

## 9. Маніфест і що має розширити команда застосунку

> **Статус (фаза 2, 2026-10-16): усі пункти нижче реалізовано** — CEFR-шкала курсу (`levels: [A1…C2]`, розділи
> `level: A1`), нумерація `English - A1 - NN.` без `order`, `language: uk` + `target: en`, `status: planned` для B1–C2,
> блоки `[!word]` `[!listen]` `[!speak]` `[!pair]` як вправи (`word` / `listen` / `speak` / `pair`), `[!diagram]` у
> мінімумі ілюстрацій, `[!listen]` і `[!pair]` у вступному тесті. Деталі — [LANGUAGE_COURSE.md](./LANGUAGE_COURSE.md)
> «Як це працює в застосунку». Нижче — початковий опис прогалин (для історії).

Маніфест `english-a1-c2/course.yaml` повторює форму JS-курсу (`sections` → `from` + `chapters`); тем у маніфесті
не перелічено (схема не має поля `topics` — теми беруться з посібника), тому список статей кожного розділу записано
YAML-коментарями. Обмеження поточної платформи:

1. **Шкала рівнів — лише `noob … god`** (`src/course/schema/level.ts`), а в контенті — `junior … techlead`
   (`src/content/model.ts`). `level: A1` у frontmatter і meta-рядках зараз ігнорується (стає `null`), а `levels: [A1]`
   чи `sections[].level: A1` — помилка схеми. **Тимчасово** розділи примусово задають рівень: A1 → `noob`,
   A2 → `junior` (далі B1 → `middle`, B2 → `senior`, C1 і C2 → обидва `god` — колізія, тому потрібна CEFR-шкала).
   Треба: шкала рівнів на курс (`levels: [A1, A2, B1, B2, C1, C2]`) з підписами, `toCourseLevel` / `toLevel` для CEFR,
   вступний тест по 6 рівнях, вибір рівня вручну («з нуля» → A1, «трохи знаю» → A2…).
2. **Нумерація з назви файлу** `English - A1 - 01.` не розпізнається (`src/content/discover/names.ts`: після
   зняття префікса `English - ` рядок починається з `A1`). Тимчасове рішення — frontmatter `order: 101` (§2.1). Можна
   навчити парсер шаблону `<LEVEL> - NN.` і/або дозволити `chapters` за рівнем (`level: A1` у розділі вибирає теми).
3. **`language`** у маніфесті за COURSE_FORMAT — мова викладання (BCP 47), а LANGUAGE_COURSE просить `language: en`
   (мова, яку вивчають). Поставлено `language: en` за рішенням власника; потрібне розведення полів
   (`language` — мова інтерфейсу / пояснень `uk`, `target: en` — мова курсу; TTS / ASR беруть `target`).
4. **Відсутні джерела — помилка**: `missing-guide` (немає `Guides/English/`), `missing-chapter`, `empty-range`.
   Тому B1–C2 у маніфесті закоментовані. Варто додати `status: planned` (або `draft: true`) для розділу —
   показувати «скоро» на шляху без помилки валідації.
5. **Мовні блоки ще не зареєстровані** (`src/content/blocks/` — немає `word`, `listen`, `speak`, `pair`): зараз вони
   рендеряться як нейтральні примітки, не є вправами, не дають XP / SRS і не йдуть у тести тем. Потрібні:
   `extract` для чотирьох блоків, нові `ExerciseKind` (`word`, `listen`, `speak`, `pair`), `PRACTICE_NEEDS` для
   `words` / `listening` / `pronunciation`, `[!word]` як флешкартка (інакше `course:check` попереджає «картки 0/6»).
6. **Мінімум ілюстрацій** рахує лише `[!viz]` / `[!figure]` (`scripts/lib/course-source.ts → countFigures`);
   мовні статті ілюструються `[!diagram]` — варто зараховувати і його.
7. **Вступний тест** бере лише `single` / `multi` / `output`; для мовного курсу корисно додати `listen` (choice).

## 10. Джерела для авторів

- Council of Europe — CEFR Companion Volume (2020): дескриптори «я вмію», медіація.
- English Profile (Cambridge): English Vocabulary Profile і English Grammar Profile — що до якого рівня належить.
- Oxford 3000 / 5000 і Oxford Learner's Dictionaries; Cambridge Dictionary (IPA UK / US, рівні слів).
- British Council LearnEnglish; BBC Learning English (вимова, «6 Minute English»).
- R. Murphy — English Grammar in Use / Essential Grammar in Use; M. Swan — Practical English Usage.
- P. Roach — English Phonetics and Phonology; A. Underhill — Sound Foundations; J. C. Wells — Longman Pronunciation Dictionary.
- A. Coxhead — Academic Word List; M. McCarthy, F. O'Dell — English Idioms / Phrasal Verbs / Collocations in Use.
