---
title: Одяг, кольори й у магазині
id: de-a1-kleidung
level: A1
icon: px:gem
tags: [deutsch, a1, vocabulary, kleidung, einkaufen]
prerequisites: ["[[Deutsch - A1 - 19. Модальні дієслова — können, müssen, wollen, dürfen, möchten]]"]
estimatedMinutes: 40
---

# Одяг, кольори й у магазині

> [!success] Після цієї теми ти зможеш
> - назвати основний одяг **з артиклем і множиною** (*die Hose, das Hemd, der Mantel*) і сказати, якого він кольору;
> - спитати ціну: **Was kostet das?** / **Was kosten die Schuhe?**;
> - попросити приміряти: **Kann ich das anprobieren?**;
> - сказати, що річ завелика чи замала: **Die Hose ist zu groß.**;
> - розуміти **Größe 38**, **Kasse**, **Umtausch**, **Kassenbon** і знати, чого очікувати від обміну в німецькому магазині.

## Передбач

> [!quiz] Ти в магазині й хочеш приміряти куртку. Як спитати?
> level: A1 · type: single · id: de-a1-kleidung-q01
> - [ ] Kann ich anprobieren die Jacke?
> - [x] Kann ich die Jacke anprobieren?
> - [ ] Kann ich die Jacke probieren an?
> - [ ] Ich kann anprobieren die Jacke?
>
> **Пояснення:** *anprobieren* — відокремлюване дієслово. З модальним *kann* воно залишається **цілим** в інфінітиві й стоїть **в кінці**: *Kann ich die Jacke anprobieren?* Тут працює той самий принцип «дужки», що й у темі про модальні дієслова.

## Пояснення

### Одяг: рід вчимо разом зі словом

| der · ч. | die · ж. | das · с. | die · мн. |
|---|---|---|---|
| der Rock (спідниця) | die Hose (штани) | das Kleid (сукня) | die Jeans (джинси) |
| der Pullover (светр) | die Jacke (куртка) | das Hemd (сорочка) | die Schuhe (взуття) |
| der Mantel (пальто) | die Bluse (блузка) | das T-Shirt (футболка) | die Socken (шкарпетки) |
| der Gürtel (ремінь) | die Socke (шкарпетка) | | |
| der Schal (шарф) | | | |

**Увага до однини й множини.** В українській «штани» — лише множина. У німецькій **die Hose** — звичайна **однина**: *eine Hose, die Hose ist neu*. Так само *das Kleid* (одна сукня). *Die Jeans* — слово однієї форми: *die Jeans ist neu* і *die Jeans sind neu* (однина й множина мають однакову форму). Для пари кажуть *ein Paar Schuhe*, *ein Paar Socken*.

### Кольори

| Колір | Німецькою | Колір | Німецькою |
|---|---|---|---|
| червоний | **rot** | чорний | **schwarz** |
| синій, блакитний | **blau** | білий | **weiß** |
| зелений | **grün** | сірий | **grau** |
| жовтий | **gelb** | коричневий | **braun** |
| різнокольоровий | **bunt** | | |

Після *sein* колір не змінюється: *Die Hose ist blau. Das Hemd ist weiß.* Перед іменником додається закінчення (*eine blaue Hose, ein weißes Hemd*) — це тема A2, а поки що користуйся реченням із *sein*. Слово **die Farbe** — «колір, фарба»: *Welche Farbe hat die Jacke?* — Якого кольору куртка?

### У магазині: основні фрази

| Ситуація | Фраза |
|---|---|
| Привітання | Guten Tag! Kann ich Ihnen helfen? |
| Шукаєш | Ich suche einen Pullover. |
| Колір, розмір | Haben Sie das in Blau? In Größe 38? |
| Ціна | Was kostet die Jacke? / Was kosten die Schuhe? |
| Приміряти | Kann ich das anprobieren? |
| Розмір не підходить | Die Hose ist zu klein. / Das ist zu groß. |
| Рішення | Ich nehme das. / Das ist mir zu teuer. |
| Каса | Wo ist die Kasse? |
| Оплата | Bar oder mit Karte? |

> [!diagram] Покупка в пʼять кроків
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "1. Шукаю", text: "Ich suche …", note: "що саме, який колір, розмір", tone: yellow }
>   - { id: b, label: "2. Питаю", text: "Was kostet das?", note: "ціна й розмір", tone: pink }
>   - { id: c, label: "3. Міряю", text: "Kann ich das anprobieren?", note: "кабіна: die Umkleidekabine", tone: yellow }
>   - { id: d, label: "4. Рішення", text: "Ich nehme es. / Zu klein.", note: "підходить чи ні", tone: gray }
>   - { id: e, label: "5. Каса", text: "An der Kasse bezahlen", note: "bar або Karte; Kassenbon", tone: pink }
> edges:
>   - { from: a, to: b, label: "потім" }
>   - { from: b, to: c, label: "потім" }
>   - { from: c, to: d, label: "потім" }
>   - { from: d, to: e, label: "потім" }
> steps:
>   - { focus: a, note: "Назви, що шукаєш: Ich suche eine Jacke. Додай колір або розмір: in Blau, in Größe 38." }
>   - { focus: b, note: "Спитай ціну. Одна річ — Was kostet …?, кілька — Was kosten …? (дієслово узгоджується з іменником)." }
>   - { focus: c, note: "Попроси приміряти: Kann ich das anprobieren? Відповідь зазвичай: Natürlich! Die Umkleidekabine ist dort." }
>   - { focus: d, note: "Підходить — Es passt gut. Завелике чи замале — Das ist zu groß / zu klein; можна спитати іншу Größe." }
>   - { focus: e, note: "Платиш на касі: bar (готівкою) або mit Karte. Збережи Kassenbon — він знадобиться для обміну." }
> ```

### zu — «надто»

**zu** перед прикметником означає «надто, занадто» — це завжди надмірність, а не «дуже».

> [!diagram] zu klein · passt · zu groß
> ```yaml
> layout: compare
> columns: { a: "zu klein", b: "passt", c: "zu groß" }
> nodes:
>   - { id: a1, col: a, label: "розмір", text: "Die Hose ist zu klein.", note: "тісна, замала", tone: pink }
>   - { id: b1, col: b, label: "розмір", text: "Die Hose passt.", note: "якраз, у самий раз", tone: yellow }
>   - { id: c1, col: c, label: "розмір", text: "Die Hose ist zu groß.", note: "завелика", tone: gray }
> steps:
>   - { focus: a1, note: "zu klein: розмір замалий. Продавець запропонує більший: Haben Sie das in Größe 40?" }
>   - { focus: b1, note: "passen — підходити за розміром: Das passt gut. Ich nehme es." }
>   - { focus: c1, note: "zu groß: розмір завеликий. Запитай менший." }
> ```

Слова *eng* («вузький, тісний») і *zu* корисні разом: *Die Jeans ist zu eng.* — Джинси затісні.

### Розміри: Größe

Розмір — **die Größe**: *Welche Größe haben Sie? — Größe 38.* Для суконь, штанів і блузок розміри — числа (36, 38, 40…), для футболок і светрів часто літери S, M, L.

### Обмін і чек: Umtausch, Kassenbon

**Der Umtausch** — обмін купленої речі. **Der Kassenbon** — чек з каси; для обміну він, зазвичай, потрібен. Якщо річ бракована, це вже не обмін, а рекламація (див. текст нижче).

## Приклади

- *Ich suche einen Pullover. Haben Sie das in Größe M?* — Я шукаю светр. У вас є це в розмірі M?
- *Was kostet die Jacke? — Sie kostet neunzig Euro.* — Скільки коштує куртка? — Девʼяносто євро.
- *Was kosten die Schuhe? — Siebzig Euro.* — Скільки коштує взуття? — Сімдесят євро.
- *Kann ich die Hose anprobieren?* — Можна приміряти штани?
- *Die Hose ist leider zu klein.* — Штани, на жаль, замалі.
- *Die Jacke passt gut. Ich nehme sie.* — Куртка добре сидить. Беру її.
- *Ist das Kleid in Rot oder in Schwarz?* — Сукня червона чи чорна?
- *Der Mantel ist grau und der Schal ist bunt.* — Пальто сіре, а шарф різнокольоровий.
- *Wo ist die Kasse?* — Де каса?
- *Ich bezahle bar.* — Я плачу готівкою.
- *Das T-Shirt ist im Sonderangebot.* — Футболка зі знижкою.
- *Die Umkleidekabine ist dort.* — Примірочна там.

## Слова

### Одяг

> [!word] die Hose
> ipa: /ˈhoːzə/ · pos: noun · level: A1 · id: de-a1-kleidung-w01
> uk: штани
> forms: die Hosen
> example: Die **Hose** ist neu. — Штани нові.
> note: укр. «штани» — лише множина, нім. die Hose — однина: eine Hose, die Hose ist. Множина die Hosen — кілька пар. o довге — [oː].

> [!word] die Jeans
> ipa: /dʒiːns/ · pos: noun · level: A1 · id: de-a1-kleidung-w02
> uk: джинси
> forms: die Jeans
> example: Die **Jeans** ist blau. — Джинси сині.
> note: форма однини й множини однакова; в мові часто die Jeans sind. Звук j тут [dʒ], як в англійській.

> [!word] der Rock
> ipa: /ʁɔk/ · pos: noun · level: A1 · id: de-a1-kleidung-w03
> uk: спідниця
> forms: die Röcke
> example: Der **Rock** ist kurz. — Спідниця коротка.
> note: CH: der Jupe [ʒyːp]. Множина з умлаутом: die Röcke. Не плутай з музичним der Rock [ʁɔk] (рок).

> [!word] das Kleid
> ipa: /klaɪ̯t/ · pos: noun · level: A1 · id: de-a1-kleidung-w04
> uk: сукня
> forms: die Kleider
> example: Das **Kleid** ist rot. — Сукня червона.
> note: укр. «сукня» — жіночого роду, нім. das Kleid — середнього. d на кінці — [t]. Множина die Kleider також означає «одяг».

> [!word] das Hemd
> ipa: /hɛmt/ · pos: noun · level: A1 · id: de-a1-kleidung-w05
> uk: сорочка
> forms: die Hemden
> example: Das **Hemd** ist weiß. — Сорочка біла.
> note: d на кінці — [t]. Найчастіше про чоловічу сорочку; жіноча — die Bluse.

> [!word] die Bluse
> ipa: /ˈbluːzə/ · pos: noun · level: A1 · id: de-a1-kleidung-w06
> uk: блузка
> forms: die Blusen
> example: Die **Bluse** ist grün. — Блузка зелена.
> note: s перед голосним — дзвінке [z]. Множина die Blusen.

> [!word] das T-Shirt
> ipa: /ˈtiːʃœːɐ̯t/ · pos: noun · level: A1 · id: de-a1-kleidung-w07
> uk: футболка
> forms: die T-Shirts
> example: Das **T-Shirt** ist gelb. — Футболка жовта.
> note: AT розм. також das Leiberl. Англійське слово, але рід середній: das T-Shirt. Пишемо з дефісом і великою T.

> [!word] der Pullover
> ipa: /pʊˈloːvɐ/ · pos: noun · level: A1 · id: de-a1-kleidung-w08
> uk: светр; пуловер
> forms: die Pullover
> example: Der **Pullover** ist warm. — Светр теплий.
> note: коротко der Pulli. Наголос на другому складі. Множина без закінчення: die Pullover.

> [!word] die Jacke
> ipa: /ˈjakə/ · pos: noun · level: A1 · id: de-a1-kleidung-w09
> uk: куртка; піджак
> forms: die Jacken
> example: Die **Jacke** ist teuer. — Куртка дорога.
> note: j — [j], як українське «й». AT також der Anorak (куртка від дощу).

> [!word] der Mantel
> ipa: /ˈmantl̩/ · pos: noun · level: A1 · id: de-a1-kleidung-w10
> uk: пальто
> forms: die Mäntel
> example: Im Winter trage ich einen **Mantel**. — Взимку я ношу пальто.
> note: множина з умлаутом: die Mäntel. -el на кінці — склад без голосного [l̩].

> [!word] der Schuh
> ipa: /ʃuː/ · pos: noun · level: A1 · id: de-a1-kleidung-w11
> uk: черевик; взуття (один)
> forms: die Schuhe
> example: Die **Schuhe** sind braun. — Взуття коричневе.
> note: за парою: ein Paar Schuhe. Один черевик — der Schuh. sch на початку — [ʃ], u довге.

> [!word] die Socke
> ipa: /ˈzɔkə/ · pos: noun · level: A1 · id: de-a1-kleidung-w12
> uk: шкарпетка
> forms: die Socken
> example: Die **Socken** sind grau. — Шкарпетки сірі.
> note: пара — ein Paar Socken. s перед голосним — дзвінке [z].

> [!word] der Gürtel
> ipa: /ˈɡʏʁtl̩/ · pos: noun · level: A1 · id: de-a1-kleidung-w13
> uk: ремінь
> forms: die Gürtel
> example: Der **Gürtel** ist schwarz. — Ремінь чорний.
> note: ü короткий [ʏ]; -el — без голосного [l̩]. Множина без закінчення: die Gürtel.

> [!word] der Schal
> ipa: /ʃaːl/ · pos: noun · level: A1 · id: de-a1-kleidung-w14
> uk: шарф
> forms: die Schals
> example: Der **Schal** ist bunt. — Шарф різнокольоровий.
> note: Duden також дозволяє множину die Schale; у розмові — die Schals. Не плутай з die Schale (миска, шкірка).

> [!word] die Kleidung
> ipa: /ˈklaɪ̯dʊŋ/ · pos: noun · level: A1 · id: de-a1-kleidung-w15
> uk: одяг (збірно)
> forms: — (без множини)
> example: Die **Kleidung** ist hier günstig. — Одяг тут недорогий.
> note: збірне слово без множини; одна річ — das Kleidungsstück. -ung → die без винятків.

### Кольори

> [!word] rot
> ipa: /ʁoːt/ · pos: adj · level: A1 · id: de-a1-kleidung-w16
> uk: червоний
> example: Das Kleid ist **rot**. — Сукня червона.
> note: перед іменником із закінченням: ein rotes Kleid, eine rote Jacke. t на кінці чутно.

> [!word] blau
> ipa: /blaʊ̯/ · pos: adj · level: A1 · id: de-a1-kleidung-w17
> uk: синій; блакитний
> example: Die Jeans ist **blau**. — Джинси сині.
> note: охоплює і синій, і блакитний; світло-блакитний — hellblau. au — [aʊ̯], «ау».

> [!word] grün
> ipa: /ɡʁyːn/ · pos: adj · level: A1 · id: de-a1-kleidung-w18
> uk: зелений
> example: Die Bluse ist **grün**. — Блузка зелена.
> note: ü довге [yː]: губи округлені, язик як для «і». Не «грюн» з «ю».

> [!word] gelb
> ipa: /ɡɛlp/ · pos: adj · level: A1 · id: de-a1-kleidung-w19
> uk: жовтий
> example: Das T-Shirt ist **gelb**. — Футболка жовта.
> note: b на кінці — глухе [p]: «ґельп».

> [!word] schwarz
> ipa: /ʃvaʁts/ · pos: adj · level: A1 · id: de-a1-kleidung-w20
> uk: чорний
> example: Der Gürtel ist **schwarz**. — Ремінь чорний.
> note: schw — [ʃv], z — [ts]. Пишемо schwarz, читаємо «шварц».

> [!word] weiß
> ipa: /vaɪ̯s/ · pos: adj · level: A1 · id: de-a1-kleidung-w21
> uk: білий
> example: Das Hemd ist **weiß**. — Сорочка біла.
> note: ß = [s]. CH пишуть weiss. Не плутай з weiß від wissen («знаю»): ich weiß, er weiß.

> [!word] grau
> ipa: /ɡʁaʊ̯/ · pos: adj · level: A1 · id: de-a1-kleidung-w22
> uk: сірий
> example: Der Mantel ist **grau**. — Пальто сіре.
> note: au — [aʊ̯], «ау». Пара за звучанням: grau — braun — blau.

> [!word] braun
> ipa: /bʁaʊ̯n/ · pos: adj · level: A1 · id: de-a1-kleidung-w23
> uk: коричневий
> example: Die Schuhe sind **braun**. — Взуття коричневе.
> note: au — [aʊ̯], «ау»: «бравн».

> [!word] bunt
> ipa: /bʊnt/ · pos: adj · level: A1 · id: de-a1-kleidung-w24
> uk: різнокольоровий; строкатий
> example: Der Schal ist **bunt**. — Шарф різнокольоровий.
> note: це не колір, а «багато кольорів»: eine bunte Jacke.

> [!word] die Farbe
> ipa: /ˈfaʁbə/ · pos: noun · level: A1 · id: de-a1-kleidung-w25
> uk: колір; фарба
> forms: die Farben
> example: Welche **Farbe** hat die Jacke? — Якого кольору куртка?
> note: питання про колір: Welche Farbe …? Відповідь: Sie ist blau.

### У магазині

> [!word] die Größe
> ipa: /ˈɡʁøːsə/ · pos: noun · level: A1 · id: de-a1-kleidung-w26
> uk: розмір; величина
> forms: die Größen
> example: Haben Sie das in **Größe** 38? — У вас є це в розмірі 38?
> note: ö довге [øː]: губи як для «о», язик як для «е». ß = [s]. CH: Grösse.

> [!word] die Kasse
> ipa: /ˈkasə/ · pos: noun · level: A1 · id: de-a1-kleidung-w27
> uk: каса
> forms: die Kassen
> example: Wo ist die **Kasse**? — Де каса?
> note: AT: die Kassa. Платимо на касі: Ich zahle an der Kasse. Подвоєне ss — голосний короткий.

> [!word] der Umtausch
> ipa: /ˈʊmtaʊ̯ʃ/ · pos: noun · level: A2 · id: de-a1-kleidung-w28
> uk: обмін (купленого товару)
> forms: — (зазвичай без множини)
> example: Der **Umtausch** ist nur mit Kassenbon möglich. — Обмін можливий лише з чеком.
> note: дієслово umtauschen. У магазині немає автоматичного права на Umtausch, див. розділ Landeskunde.

> [!word] anprobieren
> ipa: /ˈanpʁoˌbiːʁən/ · pos: verb · level: A1 · id: de-a1-kleidung-w29
> uk: приміряти
> forms: anprobieren → probierte an → hat anprobiert
> example: Ich **probiere** die Jacke **an**. — Я міряю куртку.
> note: відокремлюване: ich probiere an. З модальним — ціле: Kann ich das anprobieren? Partizip без ge-: anprobiert.

> [!word] passen
> ipa: /ˈpasn̩/ · pos: verb · level: A1 · id: de-a1-kleidung-w30
> uk: підходити; бути в самий раз
> forms: passen → passte → hat gepasst
> example: Die Hose **passt** gut. — Штани добре сидять.
> note: про розмір і узгодженість: Das passt. ss — короткий [a]. Про вигляд, «личить», кажуть steht dir gut.

> [!word] kosten
> ipa: /ˈkɔstn̩/ · pos: verb · level: A1 · id: de-a1-kleidung-w31
> uk: коштувати
> forms: kosten → kostete → hat gekostet
> example: Was **kostet** die Jacke? — Скільки коштує куртка?
> note: не змінюється за відмінками; змінюється за числом: Was kostet das? / Was kosten die Schuhe? Є також іменник die Kosten.

> [!word] das Geschäft
> ipa: /ɡəˈʃɛft/ · pos: noun · level: A1 · id: de-a1-kleidung-w32
> uk: магазин; бізнес
> forms: die Geschäfte
> example: Das **Geschäft** ist bis 18 Uhr offen. — Магазин відкритий до 18:00.
> note: das Geschäft = магазин, а не das Magazin (журнал). sch — [ʃ], наголос на останньому складі.

> [!word] der Verkäufer
> ipa: /fɛɐ̯ˈkɔɪ̯fɐ/ · pos: noun · level: A1 · id: de-a1-kleidung-w33
> uk: продавець
> forms: die Verkäufer
> example: Der **Verkäufer** hilft mir. — Продавець допомагає мені.
> note: жінка — die Verkäuferin. Покупець — der Kunde. ä тут [ɔɪ̯]: äu = «ой».

> [!word] der Kassenbon
> ipa: /ˈkasn̩ˌbɔŋ/ · pos: noun · level: A2 · id: de-a1-kleidung-w34
> uk: касовий чек
> forms: die Kassenbons
> example: Haben Sie den **Kassenbon** noch? — Чек у вас ще є?
> note: коротко der Bon. Для обміну в магазині чек зазвичай потрібен.

> [!word] das Sonderangebot
> ipa: /ˈzɔndɐˌanɡəboːt/ · pos: noun · level: A2 · id: de-a1-kleidung-w35
> uk: акція; спеціальна пропозиція
> forms: die Sonderangebote
> example: Die Jacke ist im **Sonderangebot**. — Куртка за акційною ціною.
> note: складне слово: sonder + das Angebot. Рід — від останньої частини: das.

> [!word] bar
> ipa: /baːɐ̯/ · pos: adv · level: A1 · id: de-a1-kleidung-w36
> uk: готівкою
> example: Ich zahle **bar**. — Я плачу готівкою.
> note: bar zahlen — готівкою; mit Karte zahlen — карткою. Питання: Bar oder mit Karte?

> [!word] eng
> ipa: /ɛŋ/ · pos: adj · level: A1 · id: de-a1-kleidung-w37
> uk: вузький; тісний
> forms: eng → enger → am engsten
> example: Die Jeans ist zu **eng**. — Джинси затісні.
> note: ng = [ŋ], «нг» без «ґ» окремо. Про одяг і про простір.

> [!word] zu
> ipa: /tsuː/ · pos: adv · level: A1 · id: de-a1-kleidung-w38
> uk: надто; занадто
> example: Die Hose ist **zu** klein. — Штани замалі.
> note: zu перед прикметником = надмірність, не «дуже»: zu groß, zu teuer. «Дуже» — sehr. z на початку — [ts].

> [!word] die Umkleidekabine
> ipa: /ˈʊmklaɪ̯dəkaˌbiːnə/ · pos: noun · level: A2 · id: de-a1-kleidung-w39
> uk: примірочна
> forms: die Umkleidekabinen
> example: Die **Umkleidekabine** ist dort. — Примірочна там.
> note: коротко die Kabine. Складне слово: um + kleiden + die Kabine, рід — від die Kabine.

> [!word] Was kostet das?
> ipa: /vas ˈkɔstət das/ · pos: phrase · level: A1 · id: de-a1-kleidung-w40
> uk: скільки це коштує?
> example: **Was kostet das?** — Fünf Euro. — Скільки це коштує? — Пʼять євро.
> note: множина: Was kosten die Schuhe? Також Wie viel kostet das? — теж правильно.

> [!word] Kann ich das anprobieren?
> ipa: /kan ɪç das ˈanpʁoˌbiːʁən/ · pos: phrase · level: A1 · id: de-a1-kleidung-w41
> uk: можна це приміряти?
> example: **Kann ich das anprobieren?** — Natürlich! — Можна це приміряти? — Звісно!
> note: інфінітив у кінці: anprobieren. Ввічливо додай: Kann ich die Jacke bitte anprobieren?

## Слухаємо

> [!listen] Що не так із розміром?
> level: A1 · type: choice · speed: slow · id: de-a1-kleidung-l01
> audio: Die Hose ist zu klein.
> - [ ] Die Hose ist zu groß.
> - [x] Die Hose ist zu klein.
> - [ ] Die Hose ist nicht klein.
>
> **Пояснення:** *zu klein* — надто мала, *zu groß* — надто велика. Слухай останнє слово: *klein* — «клайн», *groß* — довге [oː].

> [!listen] Яке питання ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-kleidung-l02
> audio: Was kosten die Schuhe?
> - [ ] Was kostet die Hose?
> - [x] Was kosten die Schuhe?
> - [ ] Was kostet das Hemd?
>
> **Пояснення:** *die Schuhe* — множина, тому *kosten*. *Die Hose*, *das Hemd* — однина, тому *kostet*.

> [!listen] Що шукає покупець?
> level: A1 · type: answer · speed: slow · id: de-a1-kleidung-l03
> audio: Ich suche einen Pullover. Rot, Größe M. Er kostet neunundvierzig Euro.
> - [x] Червоний светр, розмір M, 49 євро.
> - [ ] Червоний светр, розмір M, 94 євро.
> - [ ] Чорний светр, розмір M, 49 євро.
> - [ ] Червоний светр, розмір L, 49 євро.
>
> **Пояснення:** *einen Pullover* — светр (*der Pullover* у знахідному), *rot* — червоний, *neunundvierzig* — 49 (одиниці перед десятками!), *Größe M* — розмір M.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-kleidung-l04
> audio: Kann ich das anprobieren?
> explain: anprobieren стоїть у кінці речення, бо kann — модальне дієслово.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-kleidung-l05
> audio: Die Kasse ist dort.

> [!listen] У магазині одягу. Що купила покупниця?
> level: A1 · type: answer · speed: slow · id: de-a1-kleidung-l06
> audio: A: Guten Tag! Kann ich Ihnen helfen?
> audio: B: Ja, ich suche eine Jacke. Größe 38.
> audio: A: Hier, die blaue. Sie kostet neunzig Euro.
> audio: B: Kann ich sie anprobieren?
> audio: A: Natürlich. Die Kabine ist dort.
> audio: B: Sie passt gut. Ich nehme sie.
> - [x] Синю куртку, розмір 38, за 90 євро.
> - [ ] Синю куртку, розмір 38, за 19 євро.
> - [ ] Чорну куртку, розмір 38, за 90 євро.
> - [ ] Синю куртку, розмір 36, але вона завелика.
>
> **Пояснення:** *die blaue* — синя куртка, *Größe 38*, *neunzig Euro* — 90 євро. Покупниця приміряла й сказала *Sie passt gut. Ich nehme sie* — беру. Переклад: — Добрий день! Чим допомогти? — Я шукаю куртку. Розмір 38. — Ось, синя. Вона коштує 90 євро. — Можна її приміряти? — Звісно. Кабіна там. — Вона добре сидить. Беру.

## Вимова

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-kleidung-s01
> text: Die Hose ist zu klein.
> ipa: /diː ˈhoːzə ɪst tsuː klaɪ̯n/
> tip: Hose — h видихом, o довге, s дзвінке [z]; zu — z = «ц»; klein — ei = «ай».
> uk: Штани замалі.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-kleidung-s02
> text: Was kostet das?
> ipa: /vas ˈkɔstət das/
> tip: w = [v]; was — a короткий; kostet — o короткий, st = [st] в середині слова.
> uk: Скільки це коштує?

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-kleidung-s03
> text: Ich suche einen Pullover.
> ipa: /ɪç ˈzuːxə ˈaɪ̯nən pʊˈloːvɐ/
> tip: ich — [ç]; suche — ch після u — [x]; Pullover — наголос на -lo-, v тут [v].
> uk: Я шукаю светр.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-kleidung-s04
> text: Haben Sie das in Größe achtunddreißig?
> ipa: /ˈhaːbn̩ ziː das ɪn ˈɡʁøːsə ˈaxtʊntˌdʁaɪ̯sɪç/
> tip: Größe — ö довге [øː], ß = [s]; acht — ch після a — [x]; dreißig — ei = «ай», -ig = [ɪç].
> uk: У вас є це в розмірі 38?

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-kleidung-s05
> text: Schwarz, weiß, grau, braun.
> ipa: /ʃvaʁts vaɪ̯s ɡʁaʊ̯ bʁaʊ̯n/
> tip: schw — [ʃv]; weiß — w = [v], ß = [s]; grau і braun — au = «ау».
> uk: Чорний, білий, сірий, коричневий.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-kleidung-s06
> text: Rot, blau, grün, gelb.
> ipa: /ʁoːt blaʊ̯ ɡʁyːn ɡɛlp/
> tip: rot — горловий [ʁ], t чутно; grün — ü довге [yː]; gelb — b на кінці [p].
> uk: Червоний, синій, зелений, жовтий.

> [!speak] Ситуація: попроси приміряти
> level: A1 · speed: slow · id: de-a1-kleidung-s07
> text: Kann ich das anprobieren?
> ipa: /kan ɪç das ˈanpʁoˌbiːʁən/
> tip: наголос на an-: ˈanprobieren; ie — довге [iː]; голос іде вгору в кінці питання.
> uk: Можна це приміряти?

> [!speak] Ситуація: вирішуєш купити
> level: A1 · speed: slow · id: de-a1-kleidung-s08
> text: Ich nehme sie. Wo ist die Kasse?
> ipa: /ɪç ˈneːmə ziː voː ɪst diː ˈkasə/
> tip: nehmen — e довге [eː]; sie — [ziː], довге; Kasse — a короткий, подвоєне ss.
> uk: Беру її. Де каса?

## Типові помилки українців

> [!pitfall] Штани — це множина? Ні, die Hose
> ~~Die Hosen ist neu.~~ ~~Meine Hose sind alt.~~ → Die **Hose** ist neu. Meine **Hose** ist alt. В українській «штани» — лише множина, а німецьке *die Hose* — звичайне слово в однині: *eine Hose*, *die Hose ist*. Множина (*die Hosen*) — коли штанів кілька. Так само *das Kleid* (одна сукня), *der Schuh* (один черевик), *ein Paar Schuhe* (пара).

> [!pitfall] zu ≠ «дуже»
> ~~Das Kleid ist zu schön.~~ — це «сукня надто гарна (і тому не підходить)». «Дуже гарна» — **Das Kleid ist sehr schön.** *Zu* завжди показує надмірність: *zu groß, zu teuer, zu klein*. Українське «занадто» — найближчий переклад.

> [!pitfall] Відокремлюване дієслово: anprobieren
> ~~Kann ich probieren an die Jacke?~~ ~~Kann ich anprobieren die Jacke?~~ → Kann ich die Jacke **anprobieren**? В Präsens частка відокремлюється: *Ich probiere die Jacke **an***. З модальним (*kann, möchte*) дієслово лишається цілим і стоїть **в кінці** — те саме правило, що й з іншими інфінітивами.

> [!pitfall] Обмін «як вдома»
> Не розраховуй, що куртку завжди можна просто повернути, якщо вона не сподобається. Закон не дає автоматичного права на обмін або повернення звичайного товару; магазин може погодитися з власної ласки (*Kulanz*). Питай про умови **до** покупки: *Kann ich das umtauschen?* і збережи **Kassenbon**.

## Ситуація: обмін

> [!listen] Ольга хоче обміняти светр. Що каже продавець?
> level: A1 · type: answer · speed: slow · id: de-a1-kleidung-l07
> audio: A: Guten Tag. Ich möchte den Pullover umtauschen. Er ist zu klein.
> audio: B: Haben Sie den Kassenbon?
> audio: A: Ja, hier.
> audio: B: Gut. Sie können einen anderen Pullover nehmen.
> - [x] Потрібен Kassenbon; можна взяти інший светр.
> - [ ] Обмін неможливий, бо светр новий.
> - [ ] Можна повернути гроші без чека.
> - [ ] Светр завеликий, тому обмін неможливий.
>
> **Пояснення:** продавець просить *Kassenbon*, бо для обміну чек зазвичай потрібен. *Sie können einen anderen Pullover nehmen* — «можете взяти інший светр». Переклад: — Добрий день. Я хочу обміняти светр. Він замалий. — У вас є чек? — Так, ось. — Добре. Можете взяти інший светр.

> [!speak] Ситуація: запитай про обмін
> level: A1 · speed: slow · id: de-a1-kleidung-s09
> text: Ich möchte den Pullover umtauschen.
> ipa: /ɪç ˈmœçtə deːn pʊˈloːvɐ ˈʊmtaʊ̯ʃn̩/
> tip: möchte — ö короткий, ch = [ç]; umtauschen — наголос на um-, au = «ау», sch = [ʃ].
> uk: Я хочу обміняти светр.

## Landeskunde: Einkaufen und Umtausch

> [!example] Einkaufen in Deutschland
> Bei Kleidern, Hosen und Blusen sind die Größen Zahlen, zum Beispiel 36, 38 oder 40. Bei T-Shirts und Pullovern gibt es oft Buchstaben: S, M oder L. Im Geschäft hat man kein automatisches Recht auf Umtausch. Viele Geschäfte tauschen aber freiwillig um, oft nur mit Kassenbon. Fragen Sie vor dem Kauf: „Kann ich das umtauschen?“ Wenn die Ware kaputt ist, ist das etwas anderes: Dann gilt die gesetzliche Gewährleistung.
>
> **Переклад:** Розміри суконь, штанів і блузок — це числа, наприклад 36, 38 або 40. Для футболок і светрів часто літери: S, M або L. У магазині немає автоматичного права на обмін. Але багато магазинів міняють добровільно, часто лише з чеком. Спитай перед покупкою: «Чи можна це обміняти?». Якщо товар зіпсований, це інша справа: тоді діє законна гарантія (Gewährleistung).

> [!quiz] Яке право на обмін має покупець у звичайному магазині одягу?
> level: A1 · type: single · id: de-a1-kleidung-q02
> - [ ] Завжди 14 днів на обмін.
> - [x] Закон не гарантує обмін, магазин вирішує сам.
> - [ ] Завжди 30 днів на обмін.
> - [ ] Обмін у магазині заборонений.
>
> **Пояснення:** обмін у магазині — добра воля продавця (*Kulanz*). 14 днів — це право відмови для покупок через інтернет, а не для магазину. Магазини самі встановлюють терміни й умови.

> [!quiz] Що зазвичай потрібно для обміну?
> level: A1 · type: single · id: de-a1-kleidung-q03
> - [ ] паспорт
> - [x] Kassenbon (чек)
> - [ ] письмовий дозвіл від продавця
> - [ ] нічого, достатньо прийти
>
> **Пояснення:** *der Kassenbon* — доказ, що ти купив цю річ саме тут. Бракований товар — окремий випадок, там діє *Gewährleistung*.

## Практика

> [!quiz] ___ Hose ist neu.
> level: A1 · type: single · id: de-a1-kleidung-q04
> - [ ] Der
> - [x] Die
> - [ ] Das
>
> **Пояснення:** *die Hose* — жіночого роду й однина. Дієслово — *ist*, а не *sind*.

> [!quiz] Які слова мають артикль die? Обери всі.
> level: A1 · type: multi · id: de-a1-kleidung-q05
> - [x] Hose
> - [x] Jacke
> - [ ] Mantel
> - [x] Bluse
> - [ ] Kleid
>
> **Пояснення:** *die Hose, die Jacke, die Bluse* — жіночий рід. *Der Mantel* — чоловічий, *das Kleid* — середній. Рід «за українським» тут не допоможе: укр. «сукня» — жіночого роду, а *das Kleid* — середнього.

> [!quiz] «Штани завеликі.» Як сказати?
> level: A1 · type: single · id: de-a1-kleidung-q06
> - [ ] Die Hose sind zu groß.
> - [ ] Die Hose ist sehr groß.
> - [x] Die Hose ist zu groß.
> - [ ] Die Hosen ist zu groß.
>
> **Пояснення:** *die Hose* — однина (*ist*), *zu groß* — «надто велика». *Sehr groß* означає просто «дуже велика», без поганої оцінки.

> [!quiz] «Скільки коштують черевики?»
> level: A1 · type: single · id: de-a1-kleidung-q07
> - [ ] Was kostet die Schuhe?
> - [x] Was kosten die Schuhe?
> - [ ] Wie kostet die Schuhe?
> - [ ] Was kosten der Schuh?
>
> **Пояснення:** *die Schuhe* — множина, тому *kosten*. *Wie kostet* — калька з українського, питальне слово тут *was* (або *wie viel*).

> [!quiz] Які слова — кольори? Обери всі.
> level: A1 · type: multi · id: de-a1-kleidung-q08
> - [x] rot
> - [x] braun
> - [ ] Hemd
> - [x] grau
> - [ ] Größe
>
> **Пояснення:** *rot, braun, grau* — кольори. *Das Hemd* — сорочка, *die Größe* — розмір.

> [!quiz] У Відні касирка каже: «Bitte zur Kassa!» Куди тобі йти?
> level: A1 · type: single · id: de-a1-kleidung-q09
> - [ ] до примірочної
> - [x] до каси
> - [ ] до виходу
> - [ ] до відділу знижок
>
> **Пояснення:** в Австрії кажуть *die Kassa*, у Німеччині — *die Kasse*. Примірочна — *die Umkleidekabine*.

> [!quiz] Кольори
> level: A1 · type: fill · bank: rot, schwarz · id: de-a1-kleidung-q10
>
> ```text fill
> Das Gras ist [[grün]].
> Der Schnee ist [[weiß]].
> Die Sonne ist [[gelb]].
> Der Himmel ist [[blau]].
> ```
>
> **Пояснення:** трава зелена (*grün*), сніг білий (*weiß*), сонце жовте (*gelb*), небо синє (*blau*). *Rot* і *schwarz* тут не підходять.

> [!quiz] У магазині
> level: A1 · type: fill · bank: passt, kauft · id: de-a1-kleidung-q11
>
> ```text fill
> [[Was]] kostet die Jacke?
> Kann ich das [[anprobieren]]?
> Die Hose ist [[zu]] klein.
> Ich [[nehme]] das Hemd.
> ```
>
> **Пояснення:** ціна — *Was kostet …?*, приміряти — *anprobieren* (інфінітив у кінці), надмірність — *zu*, рішення — *Ich nehme*. Дистрактори: *passt* — «підходить», *kauft* — форма для *er*, не для *ich*.

> [!quiz] Склади питання: «Можна приміряти штани?»
> level: A1 · type: order · id: de-a1-kleidung-q12
>
> ```text order
> Kann ich
> die Hose
> anprobieren?
> anprobiere ✗
> ```
>
> **Пояснення:** з модальним *kann* інфінітив *anprobieren* іде в кінець. Форма *anprobiere* була б для *ich* у присудку без модального.

> [!quiz] Склади речення: «Куртка мені завелика.»
> level: A1 · type: order · id: de-a1-kleidung-q13
>
> ```text order
> Die Jacke
> ist
> mir
> zu groß.
> sind ✗
> ```
>
> **Пояснення:** *die Jacke* — однина, тому *ist*. *Mir zu groß* — «мені надто велика»: фіксований зворот, *mir* дає давальний (його вчимо на A2).

## Фішки

> [!reel] 👖 Чому Jeans і Hose
> *Jeans* — від французького *Gênes* («Генуя»): з міста родом груба тканина для робочих штанів. Німецькою *die Jeans* має однакову форму в однині й множині. Звук j тут — англійський [dʒ], а не німецький [j].

> [!reel] 🎨 Weiß і weiß
> *Weiß* («білий») і *weiß* («знаю», від *wissen*) пишуться однаково: *Ich weiß, die Wand ist weiß.* Різниця лише в контексті. Швейцарці пишуть *weiss*, бо не вживають ß.

> [!reel] 🧾 Kassenbon — маленький папірець
> Чек зберігають не лише для обміну: він доводить, що ти купив річ саме в цьому магазині, а це потрібно й для гарантії (*Gewährleistung*). Слово *Bon* прийшло з французької *bon* («добрий, чинний на...»).

## Джерела та що почитати

- [Verbraucherzentrale — Von Widerruf bis Umtausch: Wenn Sie mit der Ware nicht zufrieden sind](https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/kundenrechte/von-widerruf-bis-umtausch-wenn-sie-mit-der-ware-nicht-zufrieden-sind-5117): коли є право на обмін, а коли це Kulanz.
- [DWDS — Hose](https://www.dwds.de/wb/Hose): рід, множина, походження й вимова.
- [DWDS — Kassenbon](https://www.dwds.de/wb/Kassenbon): значення й вживання слова.
- [DWDS — Größe](https://www.dwds.de/wb/Gr%C3%B6%C3%9Fe): значення, рід, множина й вимова.
- [Goethe-Institut — Wortliste Start Deutsch 1 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf): офіційний словник рівня A1.
- [DW — Nicos Weg (українською)](https://learngerman.dw.com/uk/nicos-weg/c-36519789): безкоштовний відеокурс A1–B1; розділ про покупки.

> [!important] Підсумок
> - Одяг вчимо з артиклем: **die** Hose, **das** Kleid, **der** Mantel. *Die Hose* — однина!
> - Кольори: **rot, blau, grün, gelb, schwarz, weiß, grau, braun, bunt**. Після *sein* вони не змінюються.
> - **Was kostet das?** / **Was kosten die Schuhe?**; **Kann ich das anprobieren?** — інфінітив у кінці.
> - **zu** = «надто» (*zu groß, zu klein*), **sehr** = «дуже»; **passen** — підходити за розміром.
> - Обмін у магазині — добра воля продавця (*Kulanz*); для нього зазвичай потрібен **Kassenbon**. Бракований товар — окремий випадок (*Gewährleistung*).
