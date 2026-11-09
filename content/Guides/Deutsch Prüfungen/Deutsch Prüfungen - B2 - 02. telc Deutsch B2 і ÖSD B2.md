---
title: telc Deutsch B2 і ÖSD B2
id: dp-b2-02
level: B2
icon: px:check
tags: [deutsch, exam, skills, b2, telc-b2, oesd-b2, sprachbausteine]
prerequisites: ["[[Deutsch Prüfungen - B2 - 01. Goethe-Zertifikat B2 — модулі, час і стратегії]]", "[[Deutsch - B2 - 27. Читання — довгі тексти, позиції й висновки]]", "[[Deutsch - B2 - 26. Говоріння — доповідь, дискусія, аргументація]]"]
estimatedMinutes: 55
---

# telc Deutsch B2 і ÖSD B2

> [!success] Після цієї теми ти зможеш
> - розповісти, з яких частин складається *telc Deutsch B2* і *ÖSD Zertifikat B2*, скільки вони тривають і як нараховують бали;
> - пояснити, чим ці іспити відрізняються від *Goethe-Zertifikat B2* (набір частин, формат аудіювання, словники, усна частина);
> - застосувати стратегії для *Sprachbausteine*, *Hörverstehen* з форматом richtig / falsch і для *Schriftlicher Ausdruck* у telc;
> - знати, що ÖSD дозволяє словники, а telc і Goethe — ні, і як пройти усну частину ÖSD з картинками;
> - обрати іспит, виходячи з вимог установи, яка прийматиме сертифікат.

> [!note] Станом на листопад 2026
> Дані взято з офіційних документів: *telc Deutsch B2* — сторінка іспиту на telc.net, *Handbuch* (8-ме видання, 2019) і *Tipps zur Prüfungsvorbereitung* (6-те видання, 2020); *ÖSD Zertifikat B2* — сторінка ZB2 на osd.at і *Durchführungsbestimmungen* (редакція жовтня 2023). Також враховано *Gesamtbogen* ZB2 (версія 5.0, 06/2026) з мінімальними балами, *Modellsatz* ZB2, *Prüfungsordnung* ÖSD, чинну з 1 серпня 2026, і *Übungstest 1* telc Deutsch B2 з правилом складання. Формат Goethe B2 — у темі [[Deutsch Prüfungen - B2 - 01. Goethe-Zertifikat B2 — модулі, час і стратегії]].

## Передбач

> [!quiz] На якому з цих іспитів B2 можна користуватися словником?
> level: B2 · type: single · id: dp-b2-02-q01
> - [ ] Goethe-Zertifikat B2 — одно- і двомовним словником.
> - [ ] telc Deutsch B2 — лише двомовним словником.
> - [x] ÖSD Zertifikat B2 — одно- і двомовним, але не спеціальним.
> - [ ] Жоден з них: словники заборонені скрізь.
>
> **Пояснення:** Goethe забороняє *Hilfsmittel* (словники, телефони), telc — словник «протягом усього іспиту, зокрема й під час підготовки до усної частини». У *Durchführungsbestimmungen* ÖSD B2 сказано, що можна користуватися одно- й двомовними словниками, а спеціальні (*Spezialwörterbücher*) — ні.

## Три іспити поруч

Рівень один — B2, але конструкція різна. Спершу короткий огляд, далі кожен іспит докладно.

| | Goethe-Zertifikat B2 | telc Deutsch B2 | ÖSD Zertifikat B2 |
|---|---|---|---|
| **Модулі** | чотири, можна складати окремо | письмова й усна частини; можна здавати окремі частини | два модулі: письмовий і усний |
| **Lesen** | 65 хв, 30 завдань | разом із Sprachbausteine 90 хв | 90 хв, 40 завдань |
| **Hören** | ≈ 40 хв, 30 завдань | ≈ 20 хв, 20 завдань (richtig / falsch) | ≈ 30 хв, 2 завдання |
| **Schreiben** | 75 хв, 2 тексти | 30 хв, 1 email (150+ слів) | 90 хв, 2 тексти |
| **Sprechen** | ≈ 15 хв удвох + 15 хв підготовки | ≈ 15 хв удвох + 20 хв підготовки | 20–25 хв удвох (15–20 хв наодинці) + 15 хв підготовки |
| **Бали** | 100 на модуль, поріг 60 | 300 загалом | 100: 70 письмових + 30 усних |
| **Словник** | заборонено | заборонено | дозволено одно- й двомовний |

> [!diagram] Скільки бланків і скільки модулів
> ```yaml
> layout: compare
> columns: { a: "Goethe", b: "telc", c: "ÖSD" }
> nodes:
>   - { id: a1, col: a, label: "письмово", text: "3 модулі", tone: yellow }
>   - { id: a2, col: a, label: "усно", text: "Sprechen окремо", tone: gray }
>   - { id: b1, col: b, label: "письмово", text: "Lesen + Sprachbausteine · Hören · Schreiben", tone: pink }
>   - { id: b2, col: b, label: "усно", text: "3 частини", tone: gray }
>   - { id: c1, col: c, label: "письмово", text: "Lesen · Hören · Schreiben", tone: yellow }
>   - { id: c2, col: c, label: "усно", text: "3 завдання", tone: gray }
> steps:
>   - { focus: [a1, a2], note: "Goethe: три письмових модулі (Lesen, Hören, Schreiben) + усний Sprechen з двох частин. Кожен модуль має власний підсумок і складається та перескладається окремо." }
>   - { focus: [b1, b2], note: "telc: письмова частина містить ще Sprachbausteine (граматика й лексика в пропусках). Усна — три частини: досвід, дискусія за текстом, спільне планування." }
>   - { focus: [c1, c2], note: "ÖSD: два модулі — письмовий і усний. Усна частина має три завдання: знайомство й порада, опис картинки, аргументація ролі." }
> ```
> Спільне — рівень B2; різне — склад частин, формат завдань і правила (словник, бали).

## telc Deutsch B2

### Склад і час

*telc Deutsch B2* складається з письмової й усної частин. Іспит буває цифровим, гібридним і паперовим; можна здавати окремі частини.

| Частина | Що | Час |
|---|---|---|
| Leseverstehen | 3 частини: 5 + 5 + 10 завдань | разом із Sprachbausteine — 90 хв без перерви |
| Sprachbausteine | 2 частини: 10 + 10 завдань | |
| Hörverstehen | 3 частини: 5 + 10 + 5 завдань | ≈ 20 хв |
| Schriftlicher Ausdruck | 1 напівформальний лист (email) | 30 хв |
| Mündlicher Ausdruck | 3 частини | ≈ 15 хв (у трійці — довше) + 20 хв підготовки |

Письмова частина telc B2 триває разом **140 хвилин** (90 + ≈ 20 + 30). Усі тексти блоку Leseverstehen і Sprachbausteine разом мають приблизно 3000 слів, а на перенесення відповідей на бланк у ньому варто лишити близько 10 хвилин. Бланк заповнюють олівцем: його зчитує сканер; у зошиті завдань відповіді не рахуються.

### Бали: 300, а не 100

У telc кожна частина має свою вагу, і всі вони сходяться до 300 балів:

| Частина | Бали | Частка |
|---|---|---|
| Leseverstehen | 25 + 25 + 25 = 75 | 25 % |
| Sprachbausteine | 15 + 15 = 30 | 10 % |
| Hörverstehen | 25 + 25 + 25 = 75 | 25 % |
| Schriftlicher Ausdruck | 45 | 15 % |
| Mündlicher Ausdruck | 25 + 25 + 25 = 75 | 25 % |
| **Разом** | **300** | 100 % |

Ціна відповіді залежить від частини: у Leseverstehen 1 і 2 — 5 балів за завдання, у Leseverstehen 3 — 2,5, у Sprachbausteine — 1,5; у Hörverstehen 1 і 3 — 5, у Hörverstehen 2 — 2,5. Тому кожне завдання в перших двох частинах читання «коштує» вдвічі дорожче, ніж у третій, хоча третя найбільша за кількістю завдань.

> [!note] Поріг складання
> За Übungstest 1 telc Deutsch B2 (розділ «Wer erhält ein Zertifikat?») іспит складено, якщо в **кожній** частині набрано щонайменше 60 %: **135 із 225 письмово і 45 із 75 усно**. Загальна оцінка: 270–300 — *sehr gut*, 240–269,5 — *gut*, 210–239,5 — *befriedigend*, 180–209,5 — *ausreichend*. Невдалу частину можна повторити в тому самому або наступному календарному році; зараховують лише результат повторної спроби.

### Leseverstehen і Sprachbausteine

| Частина | Завдання | Стиль читання | Ціна |
|---|---|---|---|
| Leseverstehen 1 | 5 текстів, 10 заголовків: до кожного тексту — свій | глобальне (суть) | 5 × 5 |
| Leseverstehen 2 | один текст, 5 завдань з трьома варіантами | детальне | 5 × 5 |
| Leseverstehen 3 | 10 ситуацій і 12 текстів (оголошення, програми); для деяких ситуацій тексту немає | вибіркове | 10 × 2,5 |
| Sprachbausteine 1 | email із 10 пропусками, 3 варіанти до кожного (граматика) | — | 10 × 1,5 |
| Sprachbausteine 2 | журнальний текст із 10 пропусками, 15 слів, **5 зайвих** (лексика) | — | 10 × 1,5 |

Стратегії:
- **Leseverstehen 1:** спершу прочитай усі заголовки, а тоді тексти. Заголовки схожі між собою — наприкінці ще раз перевір, чи справді можеш відкинути невикористані.
- **Leseverstehen 2:** варіанти йдуть **у порядку тексту**, тож читай паралельно: завдання — абзац — завдання. Одне хибне слово в реченні робить усе твердження хибним; стеж за прихованими запереченнями. Відповідай за текстом, а не за власними знаннями.
- **Leseverstehen 3:** кожен текст можна використати лише раз; спершу короткі ситуації, потім тексти. Читай тексти до кінця, навіть швидко: початок може підходити, а кінець — ні.
- **Sprachbausteine 1:** спробуй сам заповнити пропуск, не дивлячись на варіанти, але лише якщо відповідь ти знаєш одразу. Далі перевір рід, число, відмінок.
- **Sprachbausteine 2:** бланк не має порожніх клітинок; **кожен пропуск заповни**, навіть навмання. Пʼять слів зайві.

### Hörverstehen: усе — richtig / falsch, один раз

На відміну від Goethe, у telc **усі три частини** — завдання «richtig / falsch», а кожен текст звучить **лише один раз**. Запис не можна зупиняти; паузи на читання й позначення відповідей уже є на записі. На бланку «richtig» — знак плюс (+), «falsch» — мінус (–).

| Teil | Що | Завдань | Читання завдань | Час |
|---|---|---|---|---|
| 1 | шість радіоповідомлень, пʼять тверджень; до одного повідомлення твердження немає | 5 | 30 с | ≈ 5 хв |
| 2 | радіоінтервʼю, два мовці | 10 | 1 хв | ≈ 7 хв |
| 3 | пʼять оголошень (вокзал, аеропорт, автовідповідач) | 5 | — | ≈ 6 хв |

- Лови **основну думку**: у Teil 1 слів із твердження може не бути, його подано інакше або розподілено на кілька речень.
- Teil 2: ключові слова в завданнях познач заздалегідь; порядок тверджень збігається з порядком інтервʼю.
- Teil 3: у твердженнях зазвичай по два імені чи числа — стеж за ними.
- Іноді звучить регіональний акцент; слухай і австрійське, швейцарське радіо.

### Schriftlicher Ausdruck: напівформальний email

Ти обираєш **одне із двох завдань** (A — прохання про інформацію, B — скарга) і пишеш *halbformelle E-Mail* мінімум із **150 слів** за **30 хвилин**. Реагуєш на оголошення чи лист, є чотири *Leitpunkte*.

Правила, які треба знати:
- Закрити треба **три з чотирьох** *Leitpunkte* або **два плюс власний аспект**. Кожен розкривай докладніше, ніж одним реченням.
- Окрім пунктів, потрібні *Betreff*, *Anrede*, вступ і завершення.
- Номер завдання з аркуша переносять на **Antwortbogen** (S. 5): без цього номера письмову роботу не оцінюють, і за неї виходить **0 балів**.
- Чернетку писати не радять; нотатки — ключовими словами, текст — одразу начисто. Перекреслювати можна, якщо виправлення зрозумілі й розбірливі.

Критерії: *Berücksichtigung der Leitpunkte*, *kommunikative Gestaltung* і *formale Richtigkeit*. Докладніше про стиль — [[Deutsch - B2 - 25. Письмо — есе-аргумент, допис, офіційна скарга]].

### Mündlicher Ausdruck: три частини

Усну частину складають удвох (за непарної кількості — втрьох). Підготовка — **20 хвилин** на аркуші завдань; словником не можна користуватися навіть тоді. Нотатками під час іспиту користуватися можна.

| Teil | Що | Час |
|---|---|---|
| Знайомство | розмова з партнером; не оцінюється | ≈ 1 хв |
| 1 · Über Erfahrungen sprechen | ти обираєш одну з **семи тем** (книжка, фільм, подорож тощо), яку можна підготувати вдома: ≈ 1,5 хв говориш, відповідаєш на 1–2 запитання партнера; потім слухаєш і питаєш сам | ≈ 5 хв |
| 2 · Diskussion | під час підготовки обоє читаєте один газетний текст на спірну тему; переказуєте тези й обговорюєте | ≈ 5 хв |
| 3 · Gemeinsam etwas planen | разом готуєте захід (поїздка, вечірка, програма), кожен пропонує, реагує, ви домовляєтеся | ≈ 5 хв |

Кожна частина дає **25 балів** (разом 75). Оцінюють за чотирма критеріями: *Ausdrucksfähigkeit, Aufgabenbewältigung, formale Richtigkeit, Aussprache und Intonation*.

Головне: говориш **з партнером**, а не з екзаменатором. Запитуй, реагуй, не монополізуй час і не перебивай без потреби. Для Teil 2 вивчи кілька зворотів, крім «Meiner Meinung nach»: *In dem Text geht es um …*, *Ich sehe das ein bisschen anders*, *Das kommt darauf an …*. Для Teil 3 тримай у голові питання: *Was? Wer? Wann? Wo? Essen und Trinken? Kosten?*

## ÖSD Zertifikat B2

### Склад і час

*ÖSD Zertifikat B2* має два модулі, які можна складати разом або окремо: **письмовий** (*Lesen, Hören, Schreiben*) і **усний** (*Sprechen*). Якщо склав обидва протягом року в одному центрі, отримаєш повний сертифікат. За регламентом ÖSD з 1.08.2026 паперові й цифрові модулі можна поєднувати; перескладати можна без обмежень, але ÖSD радить зачекати щонайменше 4 тижні. Іспит паперовий або (з 1 січня 2024) цифровий; формат однаковий. Окремий варіант *ÖSD Zertifikat B2 / Österreich* проводять в австрійських центрах.

| Частина | Час | Завдання | Бали |
|---|---|---|---|
| Lesen | 90 хв | 4 завдання, 40 пунктів | 20 |
| Hören | ≈ 30 хв | 2 завдання | 20 |
| Schreiben | 90 хв | 2 завдання (у Aufgabe 2 — вибір із двох тем) | 30 (по 15) |
| Sprechen | 15–20 хв наодинці / 20–25 хв удвох + 15 хв підготовки | 3 завдання | 30 |

Письмова частина разом триває близько **210 хвилин** без перерви; після Hören планують паузу не менше 15 хвилин. Рекомендований порядок: *Lesen — Hören — Schreiben*.

### Бали, оцінки, поріг

- Письмова частина — **70 балів**, усна — **30**, разом **100**.
- Письмова частина зарахована, якщо набрано **не менше 42 з 70 (60 %)** і досягнуто мінімуму в кожному субтесті: **Lesen ≥ 10 з 20, Hören ≥ 10 з 20, Schreiben ≥ 15 з 30**. Менше 10 у Lesen означає, що весь письмовий модуль не складено. Усна — **не менше 18 з 30 (60 %)**. У Schreiben нуль за критерієм *Aufgabe* означає 0 балів за все завдання.
- Оцінки за письмову: 70–62 *sehr gut*, 61–53 *gut*, 52–42 *bestanden*; за усну: 30–27 *sehr gut*, 26–23 *gut*, 22–18 *bestanden*; загальні: 100–88 *sehr gut*, 87–75 *gut*, 74–60 *bestanden*.
- Schreiben і Sprechen оцінюють двоє екзаменаторів: спершу кожен окремо, потім вони домовляються про спільну оцінку.

### Словники й організація

На ÖSD B2 дозволені **одно- й двомовні словники**; спеціальних словників не можна. Перед початком наглядачі перевіряють, що в словнику немає вкладок і нотаток. Телефони, смарт-годинники й навушники здають перед іспитом.

### Sprechen: три завдання

| Aufgabe | Що | Час |
|---|---|---|
| 1 | *Jemanden kennenlernen und beraten*: знайомство з партнером, розмова на задану тему, обмін досвідом і порадами | ≈ 5 хв |
| 2 | з трьох картинок обираєш одну, **обґрунтовуєш вибір**, описуєш і тлумачиш її; екзаменатор ставить запитання | ≈ 5 хв на кандидата |
| 3 | кожен отримує **роль**, захищає позицію й відповідає на аргументи протилежної сторони | ≈ 5 хв |

Розмову записують для документації. На відміну від Goethe, де вся розмова складається з доповіді й дискусії, в ÖSD є **картинка** й **рольова аргументація**.

## Який іспит обрати

Однієї відповіді немає, але є запитання, які варто поставити:

1. **Що вимагає установа?** Виш, роботодавець, посольство, відомство самі вирішують, які сертифікати вони приймають. Перевір письмово (сайт, лист). Центр, у якому ти складаєш, цього не вирішує.
2. **Скільки часу й сил на письмову частину?** Goethe — три окремі модулі з паузами; telc — коротше, Hören на 20 хвилин, але письмо лише 30; ÖSD — найдовша письмова частина (≈ 210 хв).
3. **Який формат тобі легший?** Goethe Hören має a / b / c і два прослуховування в частинах 2 і 4, telc — лише richtig / falsch один раз, ÖSD — два завдання. Усна частина: Goethe — доповідь і дебат, telc — досвід, текст і планування, ÖSD — знайомство й порада, картинка й роль.
4. **Словник.** Лише ÖSD дозволяє його під час письмової частини; не покладайся на це, якщо складаєш інший іспит.
5. **Чи можна перескладати частину?** Goethe: модулі окремо; telc: окремі частини (у тому самому або наступному календарному році); ÖSD: модулі окремо, повний сертифікат — якщо обидва складено протягом року в одному центрі; без обмеження кількості спроб (радять ≥ 4 тижні).

## Лексика інструкцій і коротких формул

| Німецькою | Що це означає |
|---|---|
| Markieren Sie Ihre Lösung auf dem Antwortbogen. | Познач відповідь на бланку. |
| Sie können sich eine der beiden Aufgaben aussuchen. | Можеш обрати одне із двох завдань. |
| Behandeln Sie drei der vier Punkte. | Розкрий три із чотирьох пунктів. |
| Schreiben Sie mindestens 150 Wörter. | Напиши щонайменше 150 слів. |
| Sie haben dazu ca. 1½ Minuten Zeit. | На це в тебе близько півтори хвилини. |
| Folgen Sie aufmerksam dem Redebeitrag. | Уважно слухай виступ. |
| Stellen Sie einige Fragen zum Thema. | Постав кілька запитань за темою. |
| Wählen Sie ein Bild aus und begründen Sie Ihre Wahl. | Обери картинку й поясни вибір. |

## Приклади

- In der telc-Prüfung höre ich jeden Text nur einmal. — На іспиті telc я чую кожен текст лише раз.
- Die E-Mail muss mindestens 150 Wörter haben. — Лист має містити щонайменше 150 слів.
- Ich muss die Nummer meiner Schreibaufgabe auf den Antwortbogen übertragen. — Мені треба перенести номер письмового завдання на бланк.
- Bei den Sprachbausteinen lasse ich keine Lücke leer. — У Sprachbausteine я не залишаю порожніх пропусків.
- Im mündlichen Teil sprechen wir miteinander, nicht mit der Prüferin. — В усній частині ми розмовляємо між собою, а не з екзаменаторкою.
- Beim ÖSD darf ich ein Wörterbuch benutzen, beim telc nicht. — На ÖSD я можу користуватися словником, на telc — ні.
- Die Gesamtpunktzahl beträgt bei telc 300 Punkte. — Загальна сума в telc — 300 балів.
- Welches Zertifikat meine Hochschule akzeptiert, muss ich dort erfragen. — Який сертифікат приймає мій виш, я маю запитати там.

## Слова

> [!word] der Sprachbaustein
> ipa: /ˈʃpʁaːxˌbaʊ̯ʃtaɪ̯n/ · pos: noun · level: B2 · id: dp-b2-02-w01
> uk: мовний блок (завдання на граматику й лексику в пропусках)
> forms: die Sprachbausteine
> example: Bei den **Sprachbausteinen** darf keine Lücke leer bleiben. — У Sprachbausteine жоден пропуск не лишають порожнім.
> note: термін telc; у Goethe такого модуля немає. sp- на початку = «шп».

> [!word] die Schreibleistung
> ipa: /ˈʃʁaɪ̯pˌlaɪ̯stʊŋ/ · pos: noun · level: C1 · id: dp-b2-02-w02
> uk: письмова робота; результат у письмі
> forms: die Schreibleistungen
> example: Die **Schreibleistung** wird nach festen Kriterien bewertet. — Письмову роботу оцінюють за чіткими критеріями.
> note: b у Schreib- перед l глушиться: [p].

> [!word] der Bewerter
> ipa: /bəˈveːɐ̯tɐ/ · pos: noun · level: C1 · id: dp-b2-02-w03
> uk: оцінювач; екзаменатор-перевіряючий
> forms: die Bewerter
> example: Lizenzierte **Bewerter** beurteilen den Text. — Ліцензовані оцінювачі оцінюють текст.
> note: жінка — die Bewerterin; w = «в».

> [!word] die Mindestanforderung
> ipa: /ˈmɪndəstˌʔanfɔʁdəʁʊŋ/ · pos: noun · level: C1 · id: dp-b2-02-w04
> uk: мінімальна вимога
> forms: die Mindestanforderungen
> example: Wer die **Mindestanforderungen** nicht erfüllt, besteht nicht. — Хто не виконує мінімальних вимог, не складає.
> note: Mindest- вимовляється [ˈmɪndəst]; ʔ у складному слові перед An-.

> [!word] halbformell
> ipa: /ˈhalpfɔʁˌmɛl/ · pos: adj · level: C1 · id: dp-b2-02-w05
> uk: напівофіційний
> example: Die E-Mail an die Kollegin ist **halbformell**. — Лист до колеги напівофіційний.
> note: b у Halb- перед f глушиться: [p]. Протилежне — informell, formell.

> [!word] die Wortanzahl
> ipa: /ˈvɔʁtʔantsaːl/ · pos: noun · level: B2 · id: dp-b2-02-w06
> uk: кількість слів
> forms: — (без множини)
> example: Die geforderte **Wortanzahl** steht in der Aufgabe. — Потрібна кількість слів указана в завданні.
> note: ʔ — легка зупинка перед An-; w = «в».

> [!word] die Reaktionsfähigkeit
> ipa: /ʁeakˈtsi̯oːnsˌfɛːɪçkaɪ̯t/ · pos: noun · level: C1 · id: dp-b2-02-w07
> uk: здатність реагувати
> forms: — (без множини)
> example: Im Gespräch zählt auch die **Reaktionsfähigkeit**. — У розмові враховують і вміння реагувати.
> note: -tion — [tsi̯oːn], наголос на -tion-; ä тут довге [ɛː].

> [!word] die Aufgabenbewältigung
> ipa: /ˈaʊ̯fɡaːbn̩bəˌvɛltɪɡʊŋ/ · pos: noun · level: C1 · id: dp-b2-02-w08
> uk: виконання завдання; вміння впоратися із завданням
> forms: — (без множини)
> example: Bei der **Aufgabenbewältigung** schaut man auf den Inhalt. — У виконанні завдання дивляться на зміст.
> note: один із критеріїв telc Sprechen. -igung = [ɪɡʊŋ].

> [!word] die Ausdrucksfähigkeit
> ipa: /ˈaʊ̯sdʁʊksˌfɛːɪçkaɪ̯t/ · pos: noun · level: C1 · id: dp-b2-02-w09
> uk: здатність висловлюватися; багатство мовлення
> forms: — (без множини)
> example: Die **Ausdrucksfähigkeit** zeigt sich im Wortschatz. — Здатність висловлюватися проявляється в лексиці.
> note: критерій telc Sprechen; -ks- — [ks].

> [!word] die Wiederholungsprüfung
> ipa: /viːdɐˈhoːlʊŋsˌpʁyːfʊŋ/ · pos: noun · level: C1 · id: dp-b2-02-w10
> uk: повторний іспит; перескладання
> forms: die Wiederholungsprüfungen
> example: Für die **Wiederholungsprüfung** melde ich mich im Zentrum an. — На перескладання я записуюся в центрі.
> note: wieder- з довгим [iː] у першому складі: [viːdɐ]; наголос на -ho-.

> [!word] der Referenzrahmen
> ipa: /ʁefeˈʁɛntsˌʁaːmən/ · pos: noun · level: C1 · id: dp-b2-02-w11
> uk: еталонна шкала; рамка (GER)
> forms: die Referenzrahmen
> example: Die Niveaus A1 bis C2 stehen im europäischen **Referenzrahmen**. — Рівні A1–C2 описано в європейській шкалі.
> note: скорочено GER (Gemeinsamer europäischer Referenzrahmen für Sprachen). Наголос на -renz-.

> [!word] die Beurteilung
> ipa: /bəˈʔʊʁtaɪ̯lʊŋ/ · pos: noun · level: B2 · id: dp-b2-02-w12
> uk: оцінювання; оцінка
> forms: die Beurteilungen
> example: Die **Beurteilung** erfolgt nach festen Kriterien. — Оцінювання проходить за чіткими критеріями.
> note: be-ur-teilung: e й u належать різним складам, це не дифтонг eu; між ними легка зупинка ʔ.

> [!word] einschätzen
> ipa: /ˈaɪ̯nʃɛtsn̩/ · pos: verb · level: B2 · id: dp-b2-02-w13
> uk: оцінювати; прикидати
> forms: einschätzen → schätzte ein → hat eingeschätzt
> example: Ich kann mein Niveau gut **einschätzen**. — Я можу добре оцінити свій рівень.
> note: відокремлюваний префікс ein-; sch = «ш», tz = [ts].

> [!word] der Kopfhörer
> ipa: /ˈkɔpfˌhøːʁɐ/ · pos: noun · level: B1 · id: dp-b2-02-w14
> uk: навушники
> forms: die Kopfhörer
> example: Beim digitalen Hören trage ich **Kopfhörer**. — Під час цифрового аудіювання я ношу навушники.
> note: частіше вживають у множині: Kopfhörer aufsetzen (одягти навушники). Однина der Kopfhörer — це і пара навушників, і один навушник.

> [!word] die Fehleranalyse
> ipa: /ˈfeːlɐʔanaˌlyːzə/ · pos: noun · level: C1 · id: dp-b2-02-w15
> uk: аналіз помилок
> forms: die Fehleranalysen
> example: Nach dem Probetest mache ich eine **Fehleranalyse**. — Після пробного тесту я аналізую помилки.
> note: наголос на -ly-; y = ü: губи «у», язик «і».

> [!word] die Gruppenprüfung
> ipa: /ˈɡʁʊpn̩ˌpʁyːfʊŋ/ · pos: noun · level: C1 · id: dp-b2-02-w16
> uk: груповий іспит
> forms: die Gruppenprüfungen
> example: Die schriftlichen Module sind eine **Gruppenprüfung**. — Письмові модулі складають групою.
> note: Gruppe — наголос на першому складі; pp без подвоєння звуку.

> [!word] der Lösungsschlüssel
> ipa: /ˈløːzʊŋsˌʃlʏsl̩/ · pos: noun · level: C1 · id: dp-b2-02-w17
> uk: ключ до відповідей
> forms: die Lösungsschlüssel
> example: Ich kontrolliere meine Antworten mit dem **Lösungsschlüssel**. — Я перевіряю свої відповіді за ключем.
> note: ö довге; sch = «ш». Зустрічається в підручниках до Übungstest.

> [!word] die Schwachstelle
> ipa: /ˈʃvaxˌʃtɛlə/ · pos: noun · level: B2 · id: dp-b2-02-w18
> uk: слабке місце
> forms: die Schwachstellen
> example: Meine **Schwachstelle** ist das Hören mit regionalem Akzent. — Моє слабке місце — аудіювання з регіональним акцентом.
> note: ch після a — глибоке [x]; st- на початку = «шт».

> [!word] das Zeitgefühl
> ipa: /ˈtsaɪ̯tɡəˌfyːl/ · pos: noun · level: B2 · id: dp-b2-02-w19
> uk: відчуття часу
> forms: die Zeitgefühle (рідко)
> example: Mit etwas Übung bekommt man ein **Zeitgefühl** für 90 Minuten. — З практикою зʼявляється відчуття 90 хвилин.
> note: ü довге; Gefühl — наголос на -fühl.

> [!word] die Selbstkontrolle
> ipa: /ˈzɛlpstkɔnˌtʁɔlə/ · pos: noun · level: B2 · id: dp-b2-02-w20
> uk: самоперевірка; самоконтроль
> forms: — (без множини)
> example: Zur **Selbstkontrolle** nutze ich den Lösungsschlüssel. — Для самоперевірки я використовую ключ відповідей.
> note: bst у Selbst- — [pst]; наголос на Kontrolle — на -troll-.

## Слухаємо

> [!listen] Запиши фразу з інструкції
> level: B2 · type: dictation · id: dp-b2-02-l01
> audio: Sie hören jeden Text nur einmal.
> explain: nur einmal — «лише раз». У telc B2 Hörverstehen усі три частини звучать один раз.

> [!listen] Запиши фразу з інструкції
> level: B2 · type: dictation · id: dp-b2-02-l02
> audio: Markieren Sie Ihre Lösungen auf dem Antwortbogen mit Bleistift.
> explain: mit Bleistift — «олівцем» (скануючий пристрій читає олівець). Lösungen — множина від die Lösung.

> [!listen] Запиши фразу з інструкції
> level: B2 · type: dictation · id: dp-b2-02-l03
> audio: Wählen Sie eine der beiden Aufgaben aus und schreiben Sie mindestens hundertfünfzig Wörter.
> explain: auswählen — відокремлюваний префікс (aus … wählen); mindestens — «щонайменше».

> [!listen] Запиши фразу з інструкції
> level: B2 · type: dictation · id: dp-b2-02-l04
> audio: Behandeln Sie drei der vier Punkte oder zwei Punkte und einen weiteren Aspekt.
> explain: telc: три з чотирьох Leitpunkte або два плюс власний аспект. einen weiteren Aspekt — знахідний відмінок.

> [!listen] Запиши фразу з інструкції
> level: B2 · type: dictation · id: dp-b2-02-l05
> audio: Bei der ÖSD-Prüfung sind einsprachige und zweisprachige Wörterbücher erlaubt.
> explain: ÖSD B2 дозволяє одно- й двомовні словники, не спеціальні. Wörterbücher — множина від das Wörterbuch.

> [!listen] Запиши фразу з інструкції
> level: B2 · type: dictation · id: dp-b2-02-l06
> audio: Vor dem mündlichen Teil haben Sie zwanzig Minuten Vorbereitungszeit.
> explain: в telc B2 підготовка до усної частини — 20 хвилин (у Goethe та ÖSD — 15).

> [!listen] telc Hörverstehen 1 (звучить один раз): радіоповідомлення. Яке твердження відповідає повідомленню?
> level: B2 · type: answer · id: dp-b2-02-l07
> audio: In der Stadt Lindau wird die Eisbahn am Markt in diesem Winter länger geöffnet sein als sonst. Wie die Stadtverwaltung mitteilte, bleibt sie bis Ende Februar offen. Der Eintritt für Kinder bleibt am Wochenende frei.
> - [ ] Die Eisbahn schließt früher als im Vorjahr.
> - [x] Die Eisbahn hat in diesem Winter längere Öffnungszeiten.
> - [ ] Kinder zahlen am Wochenende den vollen Preis.
>
> **Пояснення:** *länger geöffnet … bis Ende Februar* — каток працює довше. Діти ходять безкоштовно (*Eintritt … frei*). У справжньому Teil 1 ти не обираєш із трьох, а вирішуєш, чи є повідомлення, яке підходить до твердження, і чи воно richtig чи falsch.

> [!listen] telc Hörverstehen 1 (звучить один раз): радіоповідомлення. Richtig чи falsch? «Der Strom war am Morgen für mehrere Stunden weg.»
> level: B2 · type: answer · id: dp-b2-02-l08
> audio: Im Stadtteil Nordhafen ist heute früh für etwa zwanzig Minuten der Strom ausgefallen. Nach Angaben des Energieversorgers war ein Kabel beschädigt. Inzwischen funktioniert wieder alles.
> - [ ] Richtig
> - [x] Falsch
>
> **Пояснення:** світло зникло лише *für etwa zwanzig Minuten*, а не на кілька годин. Типова пастка telc: твердження звучить як новина, а число інше.

> [!listen] telc Hörverstehen 2 (звучить один раз), 1/2: інтервʼю. Richtig чи falsch? «Die Bäckerin beginnt ihre Arbeit nach Mitternacht.»
> level: B2 · type: answer · id: dp-b2-02-l09
> audio: A: Frau Sommer, Sie sind Bäckerin. Wann beginnt Ihr Arbeitstag?
> audio: B: Sehr früh. Um zwei Uhr nachts stehe ich in der Backstube. Dann ist es noch dunkel und ruhig.
> - [x] Richtig
> - [ ] Falsch
>
> **Пояснення:** *um zwei Uhr nachts* — це після півночі, тобто твердження правильне. Зверни увагу на слово *nachts*: відповідь визначає не час, а контекст.

> [!listen] telc Hörverstehen 2 (звучить один раз), 2/2: інтервʼю. Richtig чи falsch? «Der Beruf ist für die Bäckerin einfach.»
> level: B2 · type: answer · id: dp-b2-02-l10
> audio: A: Ist der Beruf nicht sehr anstrengend?
> audio: B: Doch, das ist er. Man steht lange, und im Sommer wird es in der Backstube sehr heiß. Aber ich liebe es, wenn der erste Teig fertig ist.
> - [ ] Richtig
> - [x] Falsch
>
> **Пояснення:** вона каже *Doch, das ist er* — так, робота важка (*anstrengend*). Любов до роботи не означає, що вона легка. Зверни увагу на *Doch*: відповідь на заперечне питання.

> [!listen] telc Hörverstehen 3 (звучить один раз): оголошення на вокзалі. Richtig чи falsch? «Der Zug fährt von Gleis sieben ab.»
> level: B2 · type: answer · id: dp-b2-02-l11
> audio: Achtung auf Gleis sieben: Der Regionalexpress nach Ulm hat zwanzig Minuten Verspätung. Er fährt heute nicht von Gleis sieben, sondern von Gleis neun ab. Wir bitten um Entschuldigung.
> - [ ] Richtig
> - [x] Falsch
>
> **Пояснення:** *nicht von Gleis sieben, sondern von Gleis neun* — потяг відправляється з колії девʼять. Назва «Gleis sieben» звучить на початку, але це пастка: відповідь визначає друга частина.

> [!listen] telc Hörverstehen 3 (звучить один раз): оголошення в аеропорту. Richtig чи falsch? «Fluggäste sollen zum Schalter C gehen.»
> level: B2 · type: answer · id: dp-b2-02-l12
> audio: Liebe Fluggäste des Flugs nach Wien, wegen eines technischen Problems verspätet sich der Abflug. Bitte holen Sie sich am Schalter C einen Gutschein für ein Getränk und beachten Sie die Anzeigetafel.
> - [x] Richtig
> - [ ] Falsch
>
> **Пояснення:** *Bitte holen Sie sich am Schalter C einen Gutschein* — просять зайти до стійки C по ваучер. Затримка вильоту є причиною, але твердження стосується стійки.

> [!listen] ÖSD Sprechen, Aufgabe 1 (1/2): знайомство на мовних курсах. Що шукає Марек?
> level: B2 · type: answer · id: dp-b2-02-l13
> audio: A: Hallo, ich bin Nadia. Ich mache hier schon seit einem Monat den Sprachkurs. Und Sie?
> audio: B: Ich heiße Marek und bin erst seit zwei Wochen in der Stadt. Im Moment suche ich noch eine Wohnung.
> audio: A: Das ist nicht leicht, das kenne ich.
> - [x] eine Wohnung in der Stadt
> - [ ] einen Sprachkurs für Anfänger
> - [ ] einen Mitbewohner für Nadia
>
> **Пояснення:** Марек (мовець B) каже *suche ich noch eine Wohnung*. Надя вже місяць ходить на курси. У ÖSD Aufgabe 1 важливо розпитувати партнера й підтримувати розмову.

> [!listen] ÖSD Sprechen, Aufgabe 1 (2/2): продовження. Яку пораду дає Надя?
> level: B2 · type: answer · id: dp-b2-02-l14
> audio: A: Wenn Sie eine Wohnung suchen, sollten Sie die Aushänge an der Universität lesen. Viele Studierende suchen dort Mitbewohner.
> audio: B: Danke für den Tipp! Ich möchte allerdings lieber allein wohnen.
> - [x] прочитати оголошення в університеті
> - [ ] піти до агентства нерухомості
> - [ ] поселитися разом із Надею
>
> **Пояснення:** порада — *die Aushänge an der Universität lesen*. Перша репліка містить умову (*wenn Sie eine Wohnung suchen*). Марек відповідає, що хоче жити сам, тож третій варіант не підходить. Обмін порадами — частина цього завдання.

> [!listen] telc Mündlicher Ausdruck, Teil 3 (діалог): планування. Яку пропозицію відхиляє Ян?
> level: B2 · type: answer · id: dp-b2-02-l15
> audio: A: Jan, wir könnten die Gruppe am Samstag in die Altstadt führen und dann im Park picknicken.
> audio: B: Anna, die Altstadt ist gut, aber ein Picknick im Park ist mir zu unsicher, falls es regnet. Wie wäre es mit einem Café?
> audio: A: Gute Idee, ein Café ist besser.
> - [ ] den Spaziergang durch die Altstadt
> - [x] das Picknick im Park
> - [ ] den Termin am Samstag
>
> **Пояснення:** Ян (мовець B, до якого звертається Анна) хвалить Altstadt, але *ein Picknick im Park ist mir zu unsicher*, пропонує кафе, і партнер погоджується. У Teil 3 важливо реагувати на пропозиції партнера й домовлятися.

## Вимова

Три іспити по-різному вимагають мовлення. У Sprechen оцінюють вимову й інтонацію, тож повтори добірку вголос.

> [!speak] Скажи вголос
> level: B2 · id: dp-b2-02-s01
> text: In dem Text geht es um die Zukunft der Arbeit.
> ipa: /ɪn deːm tɛkst ɡeːt ɛs ʊm diː ˈtsuːkʊnft deːɐ̯ ˈaʁbaɪ̯t/
> tip: Zukunft — z = [ts], наголос на першому складі: «цукунфт». Arbeit — r горлове, ei = [aɪ̯].
> uk: У тексті йдеться про майбутнє праці.

> [!speak] Скажи вголос
> level: B2 · id: dp-b2-02-s02
> text: Ich möchte über ein Buch berichten, das ich kürzlich gelesen habe.
> ipa: /ɪç ˈmœçtə ˈyːbɐ aɪ̯n buːx bəˈʁɪçtn̩ das ɪç ˈkʏʁtslɪç ɡəˈleːzn̩ ˈhaːbə/
> tip: Buch — ch після u глибоке [x]. kürzlich — ü і -lich = [lɪç]. gelesen — s між голосними [z].
> uk: Я хочу розповісти про книжку, яку нещодавно прочитав.

> [!speak] Скажи вголос
> level: B2 · id: dp-b2-02-s03
> text: Was hältst du davon, wenn wir einen Ausflug machen?
> ipa: /vas hɛltst duː daˈfɔn vɛn viːɐ̯ ˈaɪ̯nən ˈaʊ̯sfluːk ˈmaxn̩/
> tip: davon — наголос на -von; Ausflug — g у кінці як «к». Це питання з питальним словом (*Was hältst du…*): інтонація зазвичай спадна ↘; підйом на кінці можливий як ввічливий.
> uk: Що ти думаєш про те, щоб ми кудись поїхали на прогулянку?

> [!speak] Скажи вголос
> level: B2 · id: dp-b2-02-s04
> text: Das ist ein guter Vorschlag, aber er kostet viel.
> ipa: /das ɪst aɪ̯n ˈɡuːtɐ ˈfoːɐ̯ʃlaːk ˈaːbɐ eːɐ̯ ˈkɔstət fiːl/
> tip: Vorschlag — «v» = [f], g у кінці — «к»: «форшлак». viel — v = [f], довге [iː].
> uk: Це добра пропозиція, але вона коштує багато.

> [!speak] Скажи вголос
> level: B2 · id: dp-b2-02-s05
> text: Das sehe ich ein bisschen anders.
> ipa: /das ˈzeːə ɪç aɪ̯n ˈbɪsçən ˈandɐs/
> tip: sehe — s = [z]; bisschen — ss коротке, sch + chen = [sçən], не «ш». anders — наголос на першому складі.
> uk: Я бачу це трохи інакше.

> [!speak] Скажи вголос
> level: B2 · id: dp-b2-02-s06
> text: Wie ist das bei dir?
> ipa: /viː ɪst das baɪ̯ diːɐ̯/
> tip: питання з питальним словом — голос униз ↘ у кінці. dir — довге [iː] і ɐ̯: «діер».
> uk: А як це в тебе?

> [!speak] Скажи вголос
> level: B2 · id: dp-b2-02-s07
> text: Auf dem Bild sieht man eine Gruppe von Menschen.
> ipa: /aʊ̯f deːm bɪlt ziːt man ˈaɪ̯nə ˈɡʁʊpə fɔn ˈmɛnʃn̩/
> tip: Bild — d у кінці глушиться: «білт». sieht — ie = довге [iː], h не читається. Menschen — sch = «ш».
> uk: На картинці видно групу людей.

> [!speak] Скажи вголос
> level: B2 · id: dp-b2-02-s08
> text: Ich habe dieses Bild gewählt, weil es mich anspricht.
> ipa: /ɪç ˈhaːbə ˈdiːzəs bɪlt ɡəˈvɛːlt vaɪ̯l ɛs mɪç ˈanʃpʁɪçt/
> tip: gewählt — ä довге [ɛː]. anspricht — sp- = «шп». ich — [ç], мʼякий звук.
> uk: Я обрав цю картинку, бо вона мене приваблює.

## Типові помилки українців

> [!pitfall] Залишати пропуски в Sprachbausteine
> Сканер не знімає бали за хибну відповідь, але порожня клітинка точно дає нуль. У Sprachbausteine 2 пʼять слів зайві, тож вибір не зводиться до простого викреслення. Якщо не знаєш — вибери найімовірніше, а не лишай порожнім.

> [!pitfall] Забути перенести номер завдання на бланк (telc Schreiben)
> У telc B2 ти обираєш одне з двох писемних завдань, а його номер із аркуша треба вписати на бланк. Без номера роботу не оцінюють і за письмо виходить 0. Перше, що робиш після Hörverstehen, — сам номер.

> [!pitfall] Вважати, що правила скрізь однакові
> Goethe і telc забороняють словник, ÖSD — дозволяє. Goethe має a / b / c і два прослуховування, telc — лише richtig / falsch і один раз. Підготовку зроби під той іспит, який складаєш: не змінюй один формат на інший.

> [!pitfall] Говорити лише з екзаменатором у telc Sprechen
> В усній частині telc розмова відбувається між двома кандидатами. Якщо ти звертаєшся до екзаменатора або говориш лише сам, втрачаєш бали за взаємодію. Став запитання партнеру, реагуй на його репліки, не перебивай без потреби, але й не дай себе заглушити.

## Практика

> [!quiz] Скільки триває письмовий блок Leseverstehen + Sprachbausteine у telc Deutsch B2?
> level: B2 · type: single · id: dp-b2-02-q02
> - [ ] 65 хвилин
> - [ ] 75 хвилин
> - [x] 90 хвилин
> - [ ] 120 хвилин
>
> **Пояснення:** обидва субтести складають разом за 90 хвилин без перерви, а Hörverstehen окремо (≈ 20 хв). 65 хвилин — Lesen у Goethe B2, а 75 — його ж Schreiben.

> [!quiz] Що правда про telc Hörverstehen? Обери всі.
> level: B2 · type: multi · id: dp-b2-02-q03
> - [x] Кожен текст звучить лише один раз.
> - [x] У всіх трьох частинах треба вирішити, richtig чи falsch.
> - [ ] У Teil 2 лекція звучить двічі.
> - [ ] У Teil 1 треба обирати з варіантів a / b / c.
>
> **Пояснення:** telc Hörverstehen — три частини з твердженнями richtig / falsch, і все чути лише один раз. a / b / c і повторне прослуховування — це Goethe (Teil 2 і Teil 4).

> [!quiz] Скільки балів з 300 у telc B2 дають усі Sprachbausteine разом?
> level: B2 · type: single · id: dp-b2-02-q04
> - [ ] 15
> - [x] 30
> - [ ] 45
> - [ ] 75
>
> **Пояснення:** Sprachbausteine 1 і 2 дають по 15 балів (10 завдань × 1,5) = 30, тобто 10 % загальної суми. 45 — Schriftlicher Ausdruck, 75 — Leseverstehen, Hörverstehen і Mündlicher Ausdruck.

> [!quiz] Скільки заголовків (Überschriften) у telc Leseverstehen, Teil 1?
> level: B2 · type: single · id: dp-b2-02-q05
> - [ ] 5
> - [ ] 8
> - [x] 10
> - [ ] 12
>
> **Пояснення:** пʼять текстів і десять заголовків — пʼять заголовків зайві. Дванадцять — це тексти в Leseverstehen 3 (до десяти ситуацій).

> [!quiz] Що правда про telc Leseverstehen, Teil 3?
> level: B2 · type: single · id: dp-b2-02-q06
> - [ ] Для кожної ситуації обовʼязково є текст.
> - [ ] Кожен текст можна використати кілька разів.
> - [x] Для деяких ситуацій відповідного тексту немає.
> - [ ] Завдання перевіряє граматику.
>
> **Пояснення:** деякі тексти зайві, а для деяких ситуацій тексту немає (відповідь *x*). Кожен текст використовують не більше одного разу. Це вибіркове (селективне) читання.

> [!quiz] Заповни пропуски: Sprachbausteine у telc
> level: B2 · type: fill · bank: 5, 20 · id: dp-b2-02-q07
>
> ```text fill
> Teil 1: [[10]] пропусків, до кожного три варіанти.
> Teil 2: [[10]] пропусків і [[15]] слів на вибір.
> ```
>
> **Пояснення:** граматика — 10 пропусків із трьома варіантами; лексика — 10 пропусків і 15 слів, пʼять з них зайві. Інші числа не збігаються з форматом.

> [!quiz] Скільки слів мінімум має бути в листі у telc Schriftlicher Ausdruck?
> level: B2 · type: single · id: dp-b2-02-q08
> - [ ] 100
> - [x] 150
> - [ ] 200
> - [ ] 250
>
> **Пояснення:** мінімум — 150 слів за 30 хвилин. 100 слів — це розмір повідомлення в Goethe Teil 2, а 200 — аргументативний текст у TestDaF.

> [!quiz] Скільки Leitpunkte достатньо розкрити у telc Schriftlicher Ausdruck?
> level: B2 · type: single · id: dp-b2-02-q09
> - [ ] усі чотири, інакше 0 балів
> - [ ] лише один
> - [x] три з чотирьох або два плюс власний аспект
> - [ ] будь-які два
>
> **Пояснення:** оцінювачі дивляться, щоб було розкрито не менше трьох пунктів або двох плюс один власний. У Goethe, навпаки, пропуск навіть одного пункту знижує оцінку. Корисно розкрити всі чотири, якщо вистачає часу.

> [!quiz] Що станеться, якщо в telc Schriftlicher Ausdruck не перенести номер завдання на бланк?
> level: B2 · type: single · id: dp-b2-02-q10
> - [ ] знімуть кілька балів за форму
> - [ ] роботу оцінять як завдання A
> - [x] письмову частину не оцінюють, виходить 0 балів
> - [ ] додатково призначать усну розмову
>
> **Пояснення:** за правилами telc, без правильного номера роботу не оцінюють. Тому номер вписують відразу після Hörverstehen, перш ніж починати писати.

> [!quiz] Скільки триває підготовка до усної частини в telc Deutsch B2 і чи можна тоді користуватися словником?
> level: B2 · type: single · id: dp-b2-02-q11
> - [ ] 15 хвилин; словник дозволено
> - [ ] 20 хвилин; словник дозволено
> - [x] 20 хвилин; словник не дозволено
> - [ ] 10 хвилин; словник не дозволено
>
> **Пояснення:** підготовка — 20 хвилин; словник не можна використовувати протягом усього іспиту, зокрема й тоді. 15 хвилин — підготовка в Goethe та ÖSD.

> [!quiz] Що ти можеш підготувати вдома до telc Mündlicher Ausdruck?
> level: B2 · type: single · id: dp-b2-02-q12
> - [ ] Teil 2, тобто дискусію за текстом
> - [ ] Teil 3, тобто плани на вечірку
> - [x] Teil 1: розповідь про власний досвід за однією з семи тем
> - [ ] нічого, усі теми зʼясовуються на місці
>
> **Пояснення:** тему для Teil 1 (книжка, фільм, подорож тощо) знають заздалегідь і можуть підготувати. Текст для Teil 2 читають у підготовчий час, а Teil 3 — спонтанна розмова за ситуацією.

> [!quiz] Які критерії використовують у telc Mündlicher Ausdruck? Обери всі.
> level: B2 · type: multi · id: dp-b2-02-q13
> - [x] Ausdrucksfähigkeit
> - [x] Aufgabenbewältigung
> - [x] formale Richtigkeit
> - [x] Aussprache und Intonation
> - [ ] Handschrift
> - [ ] Pünktlichkeit
>
> **Пояснення:** чотири критерії: здатність висловлюватися, виконання завдання, формальна правильність, вимова й інтонація. Почерк у письмі лише має бути розбірливим, а пунктуальність не оцінюють.

> [!quiz] Скільки триває письмова частина ÖSD Zertifikat B2 разом, приблизно?
> level: B2 · type: single · id: dp-b2-02-q14
> - [ ] 90 хвилин
> - [ ] 150 хвилин
> - [ ] 180 хвилин
> - [x] 210 хвилин
>
> **Пояснення:** Lesen 90 + Hören ≈ 30 + Schreiben 90 ≈ 210 хвилин без перерви. 180 хвилин — письмова частина Goethe B2.

> [!quiz] Скільки балів дає Lesen в ÖSD B2 і скільки в ньому пунктів (Items)?
> level: B2 · type: single · id: dp-b2-02-q15
> - [ ] 30 балів, 30 пунктів
> - [x] 20 балів, 40 пунктів
> - [ ] 25 балів, 25 пунктів
> - [ ] 100 балів, 30 пунктів
>
> **Пояснення:** у Lesen 4 завдання, разом 40 пунктів, які перераховують у 20 балів. 30 пунктів із 100 балів — це Goethe.

> [!quiz] Заповни пропуски: розподіл балів в ÖSD B2
> level: B2 · type: fill · bank: 25, 40 · id: dp-b2-02-q16
>
> ```text fill
> Lesen: [[20]] балів, Hören: [[20]] балів, Schreiben: [[30]] балів.
> Усна частина: [[30]] балів.
> ```
>
> **Пояснення:** 20 + 20 + 30 = 70 балів письмової частини, плюс 30 балів усної — разом 100. Значення 25 і 40 не належать жодній із частин.

> [!quiz] Скільки балів потрібно набрати в письмовій і усній частинах ÖSD B2?
> level: B2 · type: single · id: dp-b2-02-q17
> - [ ] 35 із 70 і 15 із 30
> - [x] 42 із 70 і 18 із 30
> - [ ] 60 із 100 і 60 із 100
> - [ ] 50 із 70 і 20 із 30
>
> **Пояснення:** письмова частина зарахована від 42 з 70 (60 %) за умови, що в кожному субтесті досягнуто мінімуму (Lesen і Hören ≥ 10 з 20, Schreiben ≥ 15 з 30), усна — від 18 з 30 (60 %).

> [!quiz] Що відбувається в ÖSD Sprechen, Aufgabe 2?
> level: B2 · type: single · id: dp-b2-02-q18
> - [ ] ти захищаєш роль, яку тобі виділили
> - [ ] ви вдвох плануєте поїздку
> - [x] ти обираєш одну з трьох картинок, обґрунтовуєш вибір, описуєш і тлумачиш її
> - [ ] ти розповідаєш про книжку, підготовлену вдома
>
> **Пояснення:** Aufgabe 1 — знайомство й порада, Aufgabe 2 — картинка (екзаменатор потім ставить запитання), Aufgabe 3 — рольова аргументація. Розповідь про книжку — telc Teil 1.

> [!quiz] Які словники дозволені на ÖSD Zertifikat B2?
> level: B2 · type: single · id: dp-b2-02-q19
> - [ ] жодні
> - [ ] лише двомовні
> - [ ] будь-які, зокрема професійні
> - [x] одно- й двомовні, але не спеціальні
>
> **Пояснення:** за *Durchführungsbestimmungen*: *einsprachige und zweisprachige Wörterbücher* дозволені, *Spezialwörterbücher* — ні. Перед іспитом наглядач перевіряє, що в словнику немає вкладених аркушів і нотаток.

> [!quiz] Скільки балів дає кожне з двох завдань у ÖSD B2 Schreiben?
> level: B2 · type: single · id: dp-b2-02-q20
> - [ ] 10
> - [x] 15
> - [ ] 20
> - [ ] 30
>
> **Пояснення:** максимум за Schreiben — 30 балів, по 15 за кожне завдання. Лише 30 балів — сума обох. У Aufgabe 2 можна вибрати одну з двох тем.

> [!quiz] Склади речення: «Я переношу номер завдання на бланк відповідей.»
> level: B2 · type: order · id: dp-b2-02-q21
>
> ```text order
> Ich übertrage
> die Aufgabennummer
> auf
> den Antwortbogen.
> dem Antwortbogen. ✗
> ```
>
> **Пояснення:** *übertragen auf + Akkusativ* (рух, перенесення): *auf den Antwortbogen*. Давальний *dem* означав би місце, де вже лежить номер.

> [!quiz] Що перевіряють Sprachbausteine у telc?
> level: B2 · type: single · id: dp-b2-02-q22
> - [ ] розуміння тексту на слух
> - [x] граматику й лексику в пропусках тексту
> - [ ] уміння писати лист
> - [ ] швидкість читання
>
> **Пояснення:** Sprachbausteine 1 перевіряє граматику (відмінки, прийменники, сполучники), Sprachbausteine 2 — лексику (слово зі списку в пропуск). У Goethe B2 такого модуля немає.

> [!quiz] Заповни пропуск: «In dem Text ___ es um die Frage, ob wir mehr Zeit brauchen.»
> level: B2 · type: fill · bank: steht, handelt · id: dp-b2-02-q23
>
> ```text fill
> In dem Text [[geht]] es um die Frage, ob wir mehr Zeit brauchen.
> ```
>
> **Пояснення:** сталий зворот: *es geht um + Akkusativ*. *handelt* вимагає *sich*: *es handelt sich um …*; *steht* вимагає іншої конструкції (*Im Text steht, dass …*).

> [!quiz] Хто вирішує, чи прийме установа сертифікат Goethe, telc або ÖSD?
> level: B2 · type: single · id: dp-b2-02-q24
> - [ ] екзаменаційний центр, у якому ти складав іспит
> - [ ] усі установи приймають усі три сертифікати однаково
> - [x] сама установа, яка вимагає сертифікат (виш, роботодавець, відомство)
> - [ ] це залежить лише від рівня: B2 завжди достатньо
>
> **Пояснення:** вимоги визначає установа-отримувач. Перевір на її сайті або письмово, який саме сертифікат, рівень і термін давності вона приймає.

> [!quiz] Яка найменша кількість балів у Lesen ÖSD B2, за якої письмовий модуль ще може бути зарахований?
> level: B2 · type: single · id: dp-b2-02-q25
> - [ ] 6 із 20
> - [ ] 8 із 20
> - [x] 10 із 20
> - [ ] 14 із 20
>
> **Пояснення:** мінімум у Lesen і Hören — 10 з 20, у Schreiben — 15 з 30. Менше 10 у Lesen означає, що весь письмовий модуль не складено, навіть якщо загальна сума письмових балів висока (потрібно ще й ≥ 42 з 70).

> [!quiz] Скільки балів потрібно в письмовій і в усній частинах telc Deutsch B2?
> level: B2 · type: single · id: dp-b2-02-q26
> - [ ] 150 із 225 і 50 із 75
> - [x] 135 із 225 і 45 із 75
> - [ ] 180 із 300 загалом
> - [ ] 42 із 70 і 18 із 30
>
> **Пояснення:** telc вимагає 60 % окремо в письмовій (135 із 225) та усній (45 із 75) частинах. 42/70 і 18/30 — це ÖSD, а загальної суми, що замінює одну з частин, немає.

## Фішки

> [!reel] 🧮 300 балів, а не 100
> У telc B2 сума — 300 балів: Leseverstehen 75, Hörverstehen 75, Mündlicher Ausdruck 75, Schriftlicher Ausdruck 45 і Sprachbausteine 30. Усна частина «важить» 25 %, як і читання з аудіюванням.

> [!reel] 🔢 Номер завдання — і 0, і повна оцінка
> У telc Schriftlicher Ausdruck ти обираєш A або B. Номер обраного завдання треба вписати в бланк; без нього робота не оцінюється. Стільки зусиль — і один рядок на бланку вирішує, чи їх побачать.

> [!reel] 📖 Словник — залежить від іспиту
> На ÖSD B2 дозволено одно- й двомовні словники, але вкладати нотатки не можна. Goethe і telc забороняють словник. На telc телефон треба вимкнути й здати, а користування ним вважають спробою обману (Prüfungsordnung telc). Правило треба знати до іспиту, а не під час.

## Джерела та що почитати

- [telc Deutsch B2 — огляд іспиту](https://www.telc.net/en/language-examinations/certificate-exams/german/telc-german-b2/) — структура, час, форми проведення (цифровий, гібридний, паперовий).
- [telc Deutsch B2 — Handbuch (PDF, 8-ме видання, 2019)](https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_B2_Handbuch.pdf) — тестовий формат, вага частин, критерії оцінювання, теми.
- [telc Deutsch B2 — Tipps zur Prüfungsvorbereitung (PDF, 6-те видання, 2020)](https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_B2_tipps_zur_Pruefungsvorbereitung.pdf) — поради до кожної частини, правила на іспиті, приклади робіт.
- [ÖSD Zertifikat B2 — сторінка іспиту](https://osd.at/en/portfolio-item/osd-zertifikat-b2-zb2/) — модулі, цифрова форма з 2024 року, посилання на Modellsatz і бланк оцінювання.
- [ÖSD — Prüfungsordnung (PDF, чинна з 1.08.2026)](https://osd.at/wp-content/uploads/2026/08/OSD-Prufungsordnung_gueltig-ab-01.08.2026.pdf) — модулі, перескладання, поєднання паперових і цифрових модулів.
- [ÖSD Zertifikat B2 — Gesamtbogen ZB2 (PDF, версія 5.0)](https://osd.at/wp-content/uploads/2026/08/ZB2-GB_Ver.5.0_05_06_26.pdf) — розподіл балів, мінімуми, оцінки.
- [telc Deutsch B2 — Übungstest 1 (ZIP з пробними тестами)](https://www.telc.net/fileadmin/user_upload/mock_exams/Deutsch/telc_deutsch_b2.zip) — розділ «Wer erhält ein Zertifikat?»: поріг 60 %, оцінки, перескладання.
- [ÖSD Zertifikat B2 — Durchführungsbestimmungen (PDF, жовтень 2023)](https://osd.at/wp-content/uploads/2023/09/ZB2-Durchfuhrungsbestimmungen_10_2023.pdf) — час, бали, словники, усна частина, правила складання.
- [DWDS — Sprachbaustein](https://www.dwds.de/wb/Sprachbaustein) — граматичні дані слова.

> [!important] Підсумок
> - telc B2: поріг 60 % окремо (135/225 і 45/75), письмова частина 140 хв; Leseverstehen + Sprachbausteine 90 хв, Hörverstehen ≈ 20 хв (усе richtig / falsch, один раз), Schriftlicher Ausdruck 30 хв (email ≥ 150 слів), усна ≈ 15 хв з підготовкою 20 хв. Загалом 300 балів.
> - telc Schreiben: один із двох листів; номер завдання вписати на бланк; три Leitpunkte або два плюс власний аспект.
> - telc Sprechen: розповідь про досвід, дискусія за текстом, спільне планування; розмова з партнером.
> - ÖSD B2: письмова частина ≈ 210 хв (Lesen 90, Hören ≈ 30, Schreiben 90), 70 балів; усна 30 балів; поріг 42/70 і 18/30 (Lesen і Hören ≥ 10/20, Schreiben ≥ 15/30). Словники дозволені (одно- й двомовні).
> - ÖSD Sprechen: знайомство й порада, картинка, роль.
> - Який сертифікат приймають, вирішує установа, а не центр.
