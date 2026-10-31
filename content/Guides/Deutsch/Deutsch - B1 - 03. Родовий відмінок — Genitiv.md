---
title: Родовий відмінок — Genitiv
id: de-b1-genitiv
level: B1
icon: px:key
tags: [deutsch, b1, grammar, genitiv, kasus, praeposition]
prerequisites: ["[[Deutsch - A2 - 05. Давальний відмінок — Dativ]]", "[[Deutsch - A2 - 17. Відмінювання прикметників II — після ein і без артикля]]"]
estimatedMinutes: 45
---

# Родовий відмінок — Genitiv

> [!success] Після цієї теми ти зможеш
> - утворити Genitiv з артиклем і іменником: *des Mannes, der Frau, des Kindes, der Eltern*;
> - сказати «чий?» (*wessen?*) і назвати власника: *das Auto meines Vaters, Annas Buch*;
> - вживати прийменники з Genitiv: *wegen, trotz, während, statt, innerhalb, außerhalb, aufgrund*;
> - знати, коли в розмові замість Genitiv кажуть *von* + Dativ, і не вживати Genitiv там, де українська його вживає, а німецька — ні (*eine Tasse Kaffee*).

## Передбач

> [!quiz] Як сказати «книга вчителя» (один вчитель)?
> level: B1 · type: single · id: de-b1-genitiv-q01
> - [ ] das Buch der Lehrer
> - [x] das Buch des Lehrers
> - [ ] das Buch dem Lehrer
> - [ ] das Buch den Lehrer
>
> **Пояснення:** «Чия книга?» — **Genitiv**. Чоловічий рід: *der Lehrer → des Lehrers* (артикль *des* + закінчення **-s** на іменнику). *Der Lehrer* без закінчення — це Genitiv жіночого роду чи множини. *Dem* — Dativ, *den* — Akkusativ, обидва тут не підходять.

## Чий? Український і німецький Genitiv

В українській є родовий відмінок: «книга вчителя», «машина мого батька», «через дощ», «без сумніву». У німецькій теж є **Genitiv**, і ти вже вмієш ставити питання до нього: **wessen?** — «чий?, кого?». Але вживання різниться: у німецькій Genitiv лише у кількох ситуаціях, а в усній мові його часто замінюють на *von* + Dativ.

Genitiv потрібен у трьох місцях:

1. після іменника, щоб показати **власника, частину, автора**: *das Auto **meines Vaters***, *die Hauptstadt **des Landes***;
2. після **прийменників** *wegen, trotz, während, statt, innerhalb, außerhalb, aufgrund*;
3. у кількох застиглих виразах: *eines Tages* («одного дня»), *meines Erachtens* («на мою думку»).

### Артиклі в Genitiv

Genitiv — четвертий і останній відмінок. Подивись на всю таблицю, а колір рядка Genitiv підкаже, що змінилося.

> [!diagram] Усі чотири відмінки: означений артикль
> ```yaml
> layout: compare
> columns: { m: "der · чоловічий", f: "die · жіночий", n: "das · середній", pl: "die · множина" }
> nodes:
>   - { id: mn, col: m, label: "Nominativ", text: "der Mann", tone: blue }
>   - { id: ma, col: m, label: "Akkusativ", text: "den Mann", tone: blue }
>   - { id: md, col: m, label: "Dativ", text: "dem Mann", tone: blue }
>   - { id: mg, col: m, label: "Genitiv", text: "des Mannes", note: "des + -(e)s", tone: blue }
>   - { id: fn, col: f, label: "Nominativ", text: "die Frau", tone: red }
>   - { id: fa, col: f, label: "Akkusativ", text: "die Frau", tone: red }
>   - { id: fd, col: f, label: "Dativ", text: "der Frau", tone: red }
>   - { id: fg, col: f, label: "Genitiv", text: "der Frau", note: "der, без закінчення", tone: red }
>   - { id: nn, col: n, label: "Nominativ", text: "das Kind", tone: green }
>   - { id: na, col: n, label: "Akkusativ", text: "das Kind", tone: green }
>   - { id: nd, col: n, label: "Dativ", text: "dem Kind", tone: green }
>   - { id: ng, col: n, label: "Genitiv", text: "des Kindes", note: "des + -(e)s", tone: green }
>   - { id: pn, col: pl, label: "Nominativ", text: "die Eltern", tone: violet }
>   - { id: pa, col: pl, label: "Akkusativ", text: "die Eltern", tone: violet }
>   - { id: pd, col: pl, label: "Dativ", text: "den Eltern", tone: violet }
>   - { id: pg, col: pl, label: "Genitiv", text: "der Eltern", note: "der, без закінчення", tone: violet }
> steps:
>   - { focus: [mg, ng], note: "Чоловічий і середній рід: артикль des + закінчення -s / -es на іменнику (des Mannes, des Kindes). Це єдиний відмінок, де іменник має власне закінчення -s." }
>   - { focus: [fg, pg], note: "Жіночий рід і множина: артикль der, іменник не змінюється (der Frau, der Eltern). Не плутай із Dativ жіночого роду — вони виглядають однаково." }
>   - { focus: [fd, fg], note: "der Frau — це і Dativ, і Genitiv жіночого роду. Відрізняє їх лише контекст: прийменник або питання wem? / wessen?." }
> ```
> Сині блоки — чоловічий рід, червоні — жіночий, зелені — середній, фіолетові — множина; кожен блок має ще й текстову мітку.

З неозначеним артиклем і присвійним займенником форми такі самі за логікою: **eines Mannes, einer Frau, eines Kindes** і **meines Vaters, meiner Mutter, meines Kindes, meiner Eltern**. Множина без артикля (*Kinder*) Genitiv не показує, тому тут вживають *von* + Dativ: *die Spiele von Kindern*.

Прикметник у Genitiv: **-en** після означеного артикля, *eines, meines, keines* та інших слів на *-es / -er*: *der Name des **neuen** Lehrers; die Hilfe einer **guten** Freundin; wegen des **schlechten** Wetters*. Так само, як у A2-15 і A2-17.

### Закінчення іменника: -s чи -es

Іменники чоловічого і середнього роду отримують у Genitiv **-s** або **-es**. Жіночий рід і множина закінчення не мають.

| Тип | Закінчення | Приклад |
|---|---|---|
| один склад; закінчення на -s, -ß, -x, -z, -tz, -sch | зазвичай **-es** | des Haus**es**, des Mann**es**, des Platz**es**, des Tisch**es** |
| багатоскладові слова | **-s** | des Lehrer**s**, des Computer**s**, des Fahrrad**s**, des Handy**s** |
| слабкі іменники (n-Deklination) | **-(e)n** | des Student**en**, des Mensch**en**, des Herr**n**, des Kollege**n** |
| слово *Name*, *Herz* | **-ns, -ens** | des Name**ns**, des Herz**ens** |

Це тенденція, а не закон: *des Kind(e)s, des Tag(e)s* можуть бути з -es і без. У тексті на іспит безпечніше -es для односкладових.

> [!tip] Змінюються обидва слова
> В українській «вчителя» — одне слово із закінченням. У німецькій у чоловічому й середньому роді змінюються **і артикль, і сам іменник**: **des Lehrers**, а не *~~des Lehrer~~*.

### Імена і власники: Annas Buch

Імена власні ставлять Genitiv **перед** іменником, без артикля, із закінченням **-s** (без апострофа!): *Annas Buch, Peters Auto, Berlins Straßen*. Якщо ім’я закінчується на -s, -ß, -x, -z, ставимо апостроф: *Max' Auto, Klaus' Idee*. У розмові частіше: *das Auto von Max*.

Для звичайних іменників Genitiv стоїть **після** слова, до якого належить: *das Auto **meines Vaters***, а не *~~meines Vaters das Auto~~*.

### von + Dativ замість Genitiv

У розмові (і в письмовій мові також) Genitiv часто замінюють на *von* + Dativ: *das Auto **von meinem Vater**, die Hauptstadt **von Deutschland**, ein Freund **von mir***. Це не помилка, а природна форма. Є випадки, коли *von* майже обов’язкове:

- коли нема артикля, що показав би Genitiv: *die Preise **von Gemüse**, ein Teil **von uns***;
- з особовими займенниками Genitiv не вживають: *ein Freund **von mir**, ein Teil **von uns***.

## Прийменники з Genitiv

Ці прийменники вимагають Genitiv; більшість з них пишемо з іменником після артикля.

| Прийменник | Значення | Приклад |
|---|---|---|
| **wegen** | через, внаслідок | Wegen des Regens blieben wir zu Hause. |
| **trotz** | попри | Trotz der Krankheit ging er zur Arbeit. |
| **während** | під час | Während des Urlaubs las sie viel. |
| **statt / anstatt** | замість | Statt des Kaffees trinke ich Tee. |
| **innerhalb** | протягом; у межах | Innerhalb einer Woche bekommst du Antwort. |
| **außerhalb** | поза; за межами | Außerhalb der Stadt ist es ruhiger. |
| **aufgrund** | на підставі, через | Aufgrund des Wetters fällt das Fest aus. |

> [!diagram] Як утворити Genitiv за чотири кроки
> ```yaml
> layout: flow
> nodes:
>   - { id: gender, label: "1. Рід іменника", text: "der Lehrer · die Frau · das Kind", tone: yellow }
>   - { id: article, label: "2. Артикль", text: "des · der · des · der", tone: pink }
>   - { id: noun, label: "3. Закінчення", text: "-(e)s лише m і n", note: "Lehrers · Kindes", tone: pink }
>   - { id: adj, label: "4. Прикметник", text: "-en", note: "des alten Mannes", tone: gray }
> edges:
>   - { from: gender, to: article, label: "обираємо" }
>   - { from: article, to: noun, label: "дописуємо" }
>   - { from: noun, to: adj, label: "якщо є" }
> steps:
>   - { focus: gender, note: "Genitiv залежить від роду: чоловічий (m), жіночий (f), середній (n) чи множина." }
>   - { focus: article, note: "m і n: des. f і множина: der. Це легко запам’ятати: der стоїть лише у жіночому та множині." }
>   - { focus: noun, note: "Закінчення -s або -es отримують іменники m і n: des Lehrers, des Kindes, des Hauses. У f і множини закінчення не додаємо." }
>   - { focus: adj, note: "Прикметник після des / der / eines / einer має закінчення -en: des neuen Lehrers, der guten Freundin." }
> ```

### А як у розмові?

У розмові після *wegen, trotz* часто чути Dativ: *wegen dem Regen, trotz dem Wetter*. Це розмовний варіант. У стандартній письмовій мові, на іспиті та в листах до установ вживай Genitiv: *wegen des Regens, trotz des Wetters*. Із *innerhalb* і *außerhalb* без артикля часто стоїть *von*: *innerhalb von drei Tagen*.

## Genitiv у застиглих виразах

Кілька виразів зберегли Genitiv: *eines Tages* («одного дня»), *meines Wissens* («наскільки мені відомо»), *meines Erachtens* («на мою думку»), *des Weiteren* («крім того»). Їх варто знати як цілі фрази, а не розбирати.

## Приклади

- Das ist das Auto meines Vaters. — Це машина мого батька.
- Wessen Handy liegt hier? — Das ist das Handy meiner Schwester. — Чий телефон тут лежить? — Це телефон моєї сестри.
- Annas Buch liegt auf dem Tisch. — Книга Анни лежить на столі.
- Die Hauptstadt Deutschlands ist Berlin. — Столиця Німеччини — Берлін.
- Wegen des schlechten Wetters blieben wir zu Hause. — Через погану погоду ми залишилися вдома.
- Trotz der großen Kälte ging sie spazieren. — Попри сильний холод вона пішла гуляти.
- Während des Urlaubs habe ich viel gelesen. — Під час відпустки я багато читав.
- Statt eines Autos kaufte er ein Fahrrad. — Замість машини він купив велосипед.
- Außerhalb der Stadt gibt es viele Felder. — За містом багато полів.
- Das Zimmer des Kindes ist hell und groß. — Кімната дитини світла й велика.

## Слова

> [!word] der Genitiv
> ipa: /ˈɡeːnitiːf/ · pos: noun · level: B1 · id: de-b1-genitiv-w01
> uk: родовий відмінок
> forms: die Genitive
> example: Nach **wegen** steht der **Genitiv**. — Після wegen стоїть родовий відмінок.
> note: також Wes-Fall, 2. Fall. Лат. casus genitivus — «відмінок, що вказує походження». Допускається [ˈɡɛnitiːf].

> [!word] wessen
> ipa: /ˈvɛsn̩/ · pos: pron · level: B1 · id: de-b1-genitiv-w02
> uk: чий; чия; чиє
> example: **Wessen** Jacke ist das? — Чия це куртка?
> note: питальне слово до Genitiv; не змінюється за родом. Відповідь: Das ist die Jacke meines Bruders.

> [!word] wegen (+ Gen)
> ipa: /ˈveːɡn̩/ · pos: prep · level: B1 · id: de-b1-genitiv-w03
> uk: через; з-за
> example: **Wegen** einer Erkältung blieb sie im Bett. — Через застуду вона лежала в ліжку.
> note: у розмові часто + Dativ (wegen dem Regen). Із займенниками є злиті форми: meinetwegen, deinetwegen. g у середині = [ɡ].

> [!word] trotz (+ Gen)
> ipa: /tʁɔts/ · pos: prep · level: B1 · id: de-b1-genitiv-w04
> uk: попри; незважаючи на
> example: **Trotz** des Regens gingen wir spazieren. — Попри дощ ми пішли гуляти.
> note: у розмові теж + Dativ (trotz dem Regen). tz = [ts]. Протилежність: wegen.

> [!word] statt (+ Gen)
> ipa: /ʃtat/ · pos: prep · level: B1 · id: de-b1-genitiv-w05
> uk: замість
> example: **Statt** eines Kuchens brachte sie Blumen mit. — Замість торта вона принесла квіти.
> note: також anstatt /anˈʃtat/ — те саме. St- на початку = «шт». З інфінітивом: statt … zu (B1-11).

> [!word] innerhalb (+ Gen)
> ipa: /ˈɪnɐhalp/ · pos: prep · level: B1 · id: de-b1-genitiv-w06
> uk: протягом; у межах
> example: **Innerhalb** einer Woche brauche ich die Antwort. — Протягом тижня мені потрібна відповідь.
> note: часові межі й місце. Без артикля: innerhalb von drei Tagen. -b в кінці = [p].

> [!word] außerhalb (+ Gen)
> ipa: /ˈaʊ̯sɐhalp/ · pos: prep · level: B1 · id: de-b1-genitiv-w07
> uk: поза; за межами
> example: Sie wohnt **außerhalb** der Stadt. — Вона живе за містом.
> note: часові межі й місце. Також: außerhalb der Öffnungszeiten — поза годинами роботи.

> [!word] aufgrund (+ Gen)
> ipa: /ˈaʊ̯fɡʁʊnt/ · pos: prep · level: B2 · id: de-b1-genitiv-w08
> uk: на підставі; унаслідок
> example: **Aufgrund** der Verspätung verpasste ich den Zug. — Через запізнення я пропустив потяг.
> note: офіційніше за wegen. Допускається й окремо: auf Grund. Часто в листах та оголошеннях.

> [!word] der Besitzer
> ipa: /bəˈzɪtsɐ/ · pos: noun · level: B1 · id: de-b1-genitiv-w09
> uk: власник
> forms: die Besitzer
> example: Wer ist der **Besitzer** dieses Hauses? — Хто власник цього будинку?
> note: жінка — die Besitzerin, die Besitzerinnen. Genitiv: des Besitzers.

> [!word] die Ursache
> ipa: /ˈuːɐ̯zaxə/ · pos: noun · level: B1 · id: de-b1-genitiv-w10
> uk: причина
> forms: die Ursachen
> example: Die **Ursache** des Problems ist unklar. — Причина проблеми невідома.
> note: Ursache — те, що викликало подію; Grund ширше: ще й «підстава, мотив». Часто з Genitiv: die Ursache des Unfalls.

> [!word] die Folge
> ipa: /ˈfɔlɡə/ · pos: noun · level: B1 · id: de-b1-genitiv-w11
> uk: наслідок
> forms: die Folgen
> example: Das ist eine **Folge** des Klimawandels. — Це наслідок зміни клімату.
> note: у серіалі — Folge «серія». Folge leisten (+ Dat) — виконувати.

> [!word] der Anfang
> ipa: /ˈanfaŋ/ · pos: noun · level: A2 · id: de-b1-genitiv-w12
> uk: початок
> forms: die Anfänge
> example: Am **Anfang** des Films war es still. — На початку фільму було тихо.
> note: am Anfang — на початку; von Anfang an — від самого початку. Родич дієслова anfangen. ng = [ŋ].

> [!word] das Ende
> ipa: /ˈɛndə/ · pos: noun · level: A2 · id: de-b1-genitiv-w13
> uk: кінець
> forms: die Enden
> example: Am **Ende** des Jahres fahren wir weg. — Наприкінці року ми їдемо.
> note: Ende Mai — «наприкінці травня»; zu Ende — «закінчений»: Der Film ist zu Ende.

> [!word] die Hälfte
> ipa: /ˈhɛlftə/ · pos: noun · level: B1 · id: de-b1-genitiv-w14
> uk: половина
> forms: die Hälften
> example: Die **Hälfte** der Studenten kam zu spät. — Половина студентів спізнилася.
> note: die Hälfte der Studenten (Genitiv). ä тут коротке [ɛ], далі lf-t.

> [!word] der Rand
> ipa: /ʁant/ · pos: noun · level: B1 · id: de-b1-genitiv-w15
> uk: край; околиця; поле (сторінки)
> forms: die Ränder
> example: Das Dorf liegt am **Rand** der Stadt. — Село лежить на околиці міста.
> note: am Stadtrand — на околиці міста. d у кінці = [t].

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-genitiv-l01
> audio: Das ist das Auto meines Vaters.
> - [ ] Das ist das Auto meiner Vater.
> - [x] Das ist das Auto meines Vaters.
> - [ ] Das ist das Auto meinem Vater.

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-genitiv-l02
> audio: Wegen des Regens bleiben wir zu Hause.
> - [x] Wegen des Regens bleiben wir zu Hause.
> - [ ] Wegen dem Regen bleiben wir zu Hause.
> - [ ] Trotz des Regens bleiben wir zu Hause.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-genitiv-l03
> audio: Trotz der Kälte gingen sie spazieren.
> explain: trotz + Genitiv: der Kälte (жіночий рід). gingen — Präteritum від gehen.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-genitiv-l04
> audio: Während des Urlaubs habe ich viel gelesen.
> explain: während + Genitiv: des Urlaubs. Іменник чоловічого роду отримує -s.

> [!listen] Послухай розмову. Чия це куртка?
> level: B1 · type: answer · id: de-b1-genitiv-l05
> audio: A: Entschuldigung, wessen Jacke ist das?
> audio: B: Das ist die Jacke meiner Schwester. Sie ist außerhalb der Stadt und kommt erst später.
> audio: A: Gut, dann gebe ich sie ihr morgen.
> - [ ] Куртка Анниного брата.
> - [x] Куртка сестри співрозмовника B.
> - [ ] Куртка незнайомого відвідувача.
>
> **Пояснення:** *die Jacke meiner Schwester* — Genitiv жіночого роду: *meiner Schwester*. Сестра зараз *außerhalb der Stadt*, тобто за містом.

## Вимова

Закінчення -s і -es у Genitiv вимовляємо коротко: *des Mannes* [dɛs ˈmanəs], *des Kindes* [dɛs ˈkɪndəs]. Артикль *des* — ненаголошений, з коротким [ɛ]: [dɛs]. А прийменники *wegen, trotz, statt* самі коротко наголошені.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-genitiv-s01
> text: Das ist das Auto meines Vaters.
> ipa: /das ɪst das ˈaʊ̯to ˈmaɪ̯nəs ˈfaːtɐs/
> tip: meines — ei = [aɪ̯], закінчення -es коротке [əs]. Vaters — V = [f], довге [aː].
> uk: Це машина мого батька.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-genitiv-s02
> text: Wegen des Regens blieben wir zu Hause.
> ipa: /ˈveːɡn̩ dɛs ˈʁeːɡn̩s ˈbliːbn̩ viːɐ̯ tsuː ˈhaʊ̯zə/
> tip: wegen — е довге, [ɡn̩] майже без голосного. Regens — [ˈʁeːɡn̩s]. blieben — ie = довге [iː].
> uk: Через дощ ми залишилися вдома.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-genitiv-s03
> text: Trotz der Kälte ging sie spazieren.
> ipa: /tʁɔts deːɐ̯ ˈkɛltə ɡɪŋ ziː ʃpaˈtsiːʁən/
> tip: trotz — tz = [ts], коротке [ɔ]. Kälte — ä = відкрите [ɛ], потім lt. spazieren — наголос на -ie-.
> uk: Попри холод вона пішла гуляти.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-genitiv-s04
> text: Statt eines Kuchens brachte sie Blumen mit.
> ipa: /ʃtat ˈaɪ̯nəs ˈkuːxn̩s ˈbʁaxtə ziː ˈbluːmən mɪt/
> tip: statt — st- = «шт». Kuchens — ch після u = [x]. brachte — вставного немає, ch = [x].
> uk: Замість торта вона принесла квіти.

> [!speak] «Столиця Німеччини — Берлін.»
> level: B1 · id: de-b1-genitiv-s05
> text: Die Hauptstadt Deutschlands ist Berlin.
> ipa: /diː ˈhaʊ̯ptʃtat ˈdɔʏ̯tʃlants ɪst bɛʁˈliːn/
> tip: Hauptstadt — pt і st чуємо разом, [ʃt]. Deutschlands — eu = [ɔʏ̯]. Berlin — наголос на -lin.
> uk: Столиця Німеччини — Берлін.

## Типові помилки українців

> [!pitfall] Забуте -s на іменнику: «das Buch des Lehrer», «die Wohnung des Bruder»
> Українське «вчителя» змінює закінчення слова, а німецьке *des* — лише артикль, а закінчення -s / -es додаємо **ще й** до іменника чоловічого й середнього роду: *das Buch des Lehrer**s***, *die Wohnung des Bruder**s***, *das Zimmer des Kind**es***. У жіночому роду і множині закінчення немає: *die Tasche der Frau*.

> [!pitfall] Апостроф за англійським зразком: «Anna's Buch»
> Німецький Genitiv імен — без апострофа: *Annas Buch, Peters Auto*. Апостроф ставимо лише після -s, -ß, -x, -z: *Max' Auto*. Форма *Anna's* — калька з англійської.

> [!pitfall] «Eine Tasse des Kaffees», «eine Flasche des Wassers»: родовий відмінок після міри, як в українській
> Українська ставить Genitiv після кількості та міри: «чашка кави», «пляшка води», «багато людей», «немає часу». У німецькій — без відмінка: ***eine Tasse Kaffee***, ***eine Flasche Wasser***, ***viele Leute***, *Ich habe **keine Zeit***. Якщо ж говориш про конкретну частину від відомого цілого, Genitiv можливий: *viele der Leute* («багато з цих людей»), *eine Tasse des Kaffees, den du gekocht hast*.

> [!pitfall] Dativ після wegen і trotz у листах і на іспиті
> *Wegen dem Regen* часто чути в розмові, але в листі до установи, в есе й на іспиті Goethe очікують **Genitiv**: *wegen des Regens*, *trotz der Krankheit*, *aufgrund des Wetters*.

## Ситуація: чия це річ?

> [!listen] Послухай розмову в офісі. Де лежить папка?
> level: B1 · type: answer · id: de-b1-genitiv-l06
> audio: A: Tut mir leid, wessen Mappe liegt hier auf dem Tisch?
> audio: B: Das ist die Mappe unseres Chefs. Er ist innerhalb der nächsten Stunde wieder da.
> audio: A: Danke. Ich lege sie in das Büro des Chefs.
> - [ ] у шафі
> - [x] на столі, а потім в офісі начальника
> - [ ] на підлозі
>
> **Пояснення:** *die Mappe unseres Chefs* — Genitiv: «папка нашого шефа». *Innerhalb der nächsten Stunde* — протягом наступної години; *das Büro des Chefs* — офіс шефа.

> [!speak] «Чия це папка? Це папка нашого шефа.»
> level: B1 · id: de-b1-genitiv-s06
> text: Wessen Mappe ist das? Das ist die Mappe unseres Chefs.
> ipa: /ˈvɛsn̩ ˈmapə ɪst das das ɪst diː ˈmapə ˈʊnzəʁəs ʃɛfs/
> tip: wessen — ss = [s], коротке [ɛ]. Chefs — ch тут [ʃ] (французьке слово), закінчення -s.
> uk: Чия це папка? Це папка нашого шефа.

## Практика

> [!quiz] Das ist die Tasche ___ Frau.
> level: B1 · type: single · id: de-b1-genitiv-q02
> - [ ] die
> - [x] der
> - [ ] des
> - [ ] dem
>
> **Пояснення:** *die Frau* — жіночий рід, у Genitiv: **der Frau**. *Des* — для чоловічого й середнього роду, *dem* — Dativ чоловічого й середнього, *die* — Nominativ / Akkusativ.

> [!quiz] Das ist das Handy des ___.
> level: B1 · type: single · id: de-b1-genitiv-q03
> - [ ] Student
> - [x] Studenten
> - [ ] Studentes
> - [ ] Studentens
>
> **Пояснення:** *der Student* — слабкий іменник (n-Deklination), у всіх відмінках, крім Nominativ, закінчення **-en**: *des Studenten*. *Student* без закінчення — Nominativ, *Studentes* і *Studentens* таких форм немає.

> [!quiz] ___ Auto steht vor dem Haus? («Чия машина стоїть перед будинком?»)
> level: B1 · type: single · id: de-b1-genitiv-q04
> - [ ] Wem
> - [ ] Wer
> - [x] Wessen
> - [ ] Wen
>
> **Пояснення:** «чий?» — **wessen** (питальне слово до Genitiv). *Wer* — «хто?» (Nominativ), *wen* — «кого?» (Akkusativ), *wem* — «кому?» (Dativ).

> [!quiz] Яка форма правильна: «Це книга Анни»?
> level: B1 · type: single · id: de-b1-genitiv-q05
> - [ ] Das ist Anna's Buch.
> - [x] Das ist Annas Buch.
> - [ ] Das ist Annas's Buch.
> - [ ] Das ist Anna Buch.
>
> **Пояснення:** Genitiv імені — закінчення **-s** без апострофа, ім’я перед іменником: *Annas Buch*. Форма *Anna's* — з англійської, а *Anna Buch* — це Nominativ без закінчення, як в українській «Анна книга».

> [!quiz] «Через дощ ми залишилися вдома.» Яке слово пропущено? «___ des Regens blieben wir zu Hause.»
> level: B1 · type: single · id: de-b1-genitiv-q06
> - [ ] Trotz
> - [x] Wegen
> - [ ] Statt
> - [ ] Innerhalb
>
> **Пояснення:** «через» у значенні причини — **wegen**. *Trotz* — «попри», *statt* — «замість», *innerhalb* — «протягом, у межах». З кожним зі слів змінюється зміст.

> [!quiz] «Попри хворобу він пішов на роботу.» Trotz ___ Krankheit ging er zur Arbeit.
> level: B1 · type: single · id: de-b1-genitiv-q07
> - [ ] die
> - [x] der
> - [ ] dem
> - [ ] den
>
> **Пояснення:** *die Krankheit* — жіночий рід, Genitiv: **der Krankheit**. Форми *dem / den* — Dativ або Akkusativ.

> [!quiz] «Під час відпустки я багато читав.» Während ___ Urlaubs habe ich viel gelesen.
> level: B1 · type: single · id: de-b1-genitiv-q08
> - [ ] dem
> - [ ] den
> - [x] des
> - [ ] der
>
> **Пояснення:** *der Urlaub* — чоловічий рід; Genitiv — **des Urlaubs**, іменник отримує **-s**. Форми *dem / den* — не для *während* в цьому значенні.

> [!quiz] «Замість кави я п’ю чай.» Statt ___ Kaffees trinke ich Tee.
> level: B1 · type: single · id: de-b1-genitiv-q09
> - [ ] dem
> - [ ] den
> - [x] des
> - [ ] der
>
> **Пояснення:** *der Kaffee* — чоловічий рід, Genitiv: **des Kaffees** (іменник на -ee отримує -s). *Statt* вимагає Genitiv.

> [!quiz] Які прийменники вимагають Genitiv? Обери всі.
> level: B1 · type: multi · id: de-b1-genitiv-q10
> - [x] wegen
> - [x] trotz
> - [x] statt
> - [ ] mit
> - [ ] für
>
> **Пояснення:** *wegen, trotz, statt* (і *während, innerhalb, außerhalb, aufgrund*) — Genitiv. *Mit* — завжди Dativ, *für* — завжди Akkusativ.

> [!quiz] Які речення правильні? Обери всі.
> level: B1 · type: multi · id: de-b1-genitiv-q11
> - [x] Das ist das Auto meines Vaters.
> - [x] Das ist das Auto von meinem Vater.
> - [ ] Das ist das Auto meiner Vater.
> - [x] Wegen des schlechten Wetters bleiben wir hier.
> - [ ] Ich möchte eine Tasse von Kaffee.
>
> **Пояснення:** обидві форми — з Genitiv (*meines Vaters*) і з *von* + Dativ (*von meinem Vater*) — правильні. У третьому реченні *meiner* стоїть не в тій формі (чоловічому роду потрібне *meines*), а в п’ятому «чашка кави» німецькою — без відмінка: *eine Tasse Kaffee*, а не *von Kaffee*.

> [!quiz] Заповни пропуски: присвійні займенники в Genitiv
> level: B1 · type: fill · id: de-b1-genitiv-q12
>
> ```text fill
> Das ist das Fahrrad [[meines]] Bruders. (мій брат)
> Die Wohnung [[meiner]] Eltern ist groß. (мої батьки)
> Das Zimmer [[des]] Kindes ist klein. (означений артикль; дитина)
> ```
>
> **Пояснення:** *der Bruder* (m) → *meines Bruders*; *die Eltern* (множина) → *meiner Eltern*; *das Kind* (n) → *des Kindes*.

> [!quiz] Заповни пропуски: прийменники й прикметники
> level: B1 · type: fill · id: de-b1-genitiv-q13
>
> ```text fill
> [[Wegen]] des [[schlechten]] Wetters bleiben wir hier. (через; schlecht)
> [[Trotz]] der [[großen]] Hitze gingen sie wandern. (попри; groß)
> ```
>
> **Пояснення:** після *des / der* прикметник у Genitiv має закінчення **-en**: *des schlechten Wetters, der großen Hitze*.

> [!quiz] Заповни пропуски: імена
> level: B1 · type: fill · id: de-b1-genitiv-q14
>
> ```text fill
> Das ist [[Annas]] Buch. (Anna)
> Das ist [[Max']] Auto. (Max)
> Das ist die Tasche [[meiner]] Mutter. (моя мама)
> ```
>
> **Пояснення:** *Anna → Annas*; ім’я на -x → апостроф: *Max'*. Для звичайних слів Genitiv іде після іменника: *die Tasche meiner Mutter*.

> [!quiz] Склади речення: «Це машина мого батька»
> level: B1 · type: order · id: de-b1-genitiv-q15
>
> ```text order
> Das
> ist
> das
> Auto
> meines
> Vaters.
> von ✗
> ```
>
> **Пояснення:** Genitiv стоїть **після** іменника, до якого належить: *das Auto meines Vaters*. Із *von* потрібен був би Dativ (*von meinem Vater*), тому *von meines* — помилка.

> [!quiz] Склади речення: «Через дощ ми залишилися вдома»
> level: B1 · type: order · id: de-b1-genitiv-q16
>
> ```text order
> Wegen
> des
> Regens
> blieben
> wir
> zu
> Hause.
> dem ✗
> ```
>
> **Пояснення:** *wegen* + Genitiv: *des Regens*. Підрядне речення тут немає, тому дієслово *blieben* — на другому місці, після підрядної обставини.

> [!quiz] Склади речення: «Протягом тижня ти отримаєш відповідь»
> level: B1 · type: order · id: de-b1-genitiv-q17
>
> ```text order
> Innerhalb
> einer
> Woche
> bekommst
> du
> eine
> Antwort.
> eines ✗
> ```
>
> **Пояснення:** *die Woche* — жіночий рід, Genitiv: **einer Woche**. *Eines* — Genitiv чоловічого й середнього роду.

## Фішки

> [!reel] 📕 «Dativ — dem Genitiv sein Tod»
> 2004 року журналіст Бастіан Зік видав книжку «Der Dativ ist dem Genitiv sein Tod» — збірку його колонок про «підступи» німецької мови. Назва — жарт: така конструкція (*dem Genitiv sein Tod*) розмовна й неправильна, а правильно було б *der Tod des Genitivs*. Це перша з серії книжок, що вийшли після 2004 року; а Genitiv, як бачиш, живий.

> [!reel] 🧬 Wes-Fall: «відмінок питання wessen?»
> Німецькі граматики давно придумали власні назви відмінків: Nominativ — *Wer-Fall*, Genitiv — *Wes-Fall* (від *wessen?*), Dativ — *Wem-Fall*, Akkusativ — *Wen-Fall*. А саме слово *Genitiv* — від латинського *casus genitivus*, «відмінок, що вказує на походження».

> [!reel] 🇺🇦 Чашка кави — родовий, а Tasse Kaffee — ні
> В українській після слів на кшталт «чашка», «пляшка», «багато» стоїть родовий відмінок: чашка кави, багато людей. У німецькій Genitiv у цих випадках немає: *eine Tasse Kaffee, viele Leute*. Натомість там, де українська скаже «через дощ», німецька відповість Genitiv: *wegen des Regens*. Тож родовий відмінок є в обох мовах, але вживають його в різних місцях.

## Джерела та що почитати

- [DWDS — Genitiv](https://www.dwds.de/wb/Genitiv) — словникова стаття про відмінок.
- [DWDS — wegen](https://www.dwds.de/wb/wegen) — значення й керування.
- [Duden — wegen](https://www.duden.de/rechtschreibung/wegen) — прийменник і розмовний Dativ.
- [Wikipedia — Genitiv](https://de.wikipedia.org/wiki/Genitiv) — вживання, назви Wes-Fall, genetivus.
- [Wikipedia — Der Dativ ist dem Genitiv sein Tod](https://de.wikipedia.org/wiki/Der_Dativ_ist_dem_Genitiv_sein_Tod) — книжка Бастіана Зіка.
- [DW Learn German — Nicos Weg (B1)](https://learngerman.dw.com/de/niveau-b1/s-12304) — безкоштовний відеокурс Deutsche Welle.
- Goethe-Institut — сторінка іспиту *Goethe-Zertifikat B1* на goethe.de.

> [!important] Підсумок
> - Genitiv відповідає на питання **wessen?**: *das Auto meines Vaters*.
> - m / n: **des** + іменник із **-(e)s** (*des Mannes, des Kindes*); f і множина: **der**, без закінчення (*der Frau, der Eltern*); прикметник — **-en**.
> - Імена: *Annas Buch*, без апострофа; після -s, -ß, -x, -z — *Max'*.
> - Прийменники: **wegen, trotz, während, statt, innerhalb, außerhalb, aufgrund** + Genitiv. У розмові часто *wegen dem*, *von* + Dativ; у листі — Genitiv.
> - «Чашка кави», «багато людей» — без Genitiv: *eine Tasse Kaffee, viele Leute*.
