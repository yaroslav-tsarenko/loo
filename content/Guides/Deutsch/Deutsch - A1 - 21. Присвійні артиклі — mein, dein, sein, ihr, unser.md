---
title: Присвійні артиклі — mein, dein, sein, ihr, unser
id: de-a1-possessiv
level: A1
icon: px:link
tags: [deutsch, a1, grammar, possessivartikel, pronomen]
prerequisites: ["[[Deutsch - A1 - 11. haben, знахідний відмінок і kein]]"]
estimatedMinutes: 35
---

# Присвійні артиклі — mein, dein, sein, ihr, unser

> [!success] Після цієї теми ти зможеш
> - сказати «мій, твій, його, її, наш, ваш, їхній, Ваш»: **mein, dein, sein, ihr, unser, euer, Ihr**;
> - додавати правильне закінчення (**mein Bruder, meine Schwester, meinen Bruder**) — так само, як у *ein / kein*;
> - обирати **sein чи ihr** за власником, а не за предметом;
> - не казати ~~Sie liebt sein Mann~~, а казати **Sie liebt ihren Mann**.

## Передбач

> [!quiz] «Вона любить свого чоловіка.» Як сказати?
> level: A1 · type: single · id: de-a1-possessiv-q01
> - [ ] Sie liebt sein Mann.
> - [x] Sie liebt ihren Mann.
> - [ ] Sie liebt ihr Mann.
> - [ ] Sie liebt ihre Mann.
>
> **Пояснення:** українське «свій» тут не допоможе. Німецька обирає присвійне слово за **власником**: власник — *sie* («вона»), отже *ihr-*. А закінчення залежить від **предмета**: *der Mann* у знахідному → *-en*, тож *ihren Mann*.

## Пояснення

### Що це таке

**Присвійний артикль** (Possessivartikel) стоїть перед іменником і показує, кому він належить: *mein Bruder* — мій брат, *deine Tasche* — твоя сумка. Українською це займенники «мій, твій, наш…». Відмінюється так само, як **ein / kein**: самі закінчення ті самі.

### Слова за власником

В українській є «свій» (*Вона любить свого чоловіка*). У німецькій «свого» немає, і замість нього завжди стоїть присвійне слово, яке відповідає **особі власника**:

| Власник | Присвійне слово | Приклад |
|---|---|---|
| ich | **mein** | mein Bruder — мій брат |
| du | **dein** | dein Bruder — твій брат |
| er | **sein** | sein Bruder — його брат |
| sie (вона) | **ihr** | ihr Bruder — її брат |
| es | **sein** | sein Bruder — його (нейтр.) |
| wir | **unser** | unser Bruder — наш брат |
| ihr (ви, друзі) | **euer** | euer Bruder — ваш брат |
| sie (вони) | **ihr** | ihr Bruder — їхній брат |
| Sie (Ви) | **Ihr** | Ihr Bruder — Ваш брат |

> [!diagram] Власник обирає слово: sein · ihr · Ihr
> ```yaml
> layout: compare
> columns: { a: "Max (він)", b: "Anna (вона)", c: "Herr Weber (до нього на Sie)" }
> nodes:
>   - { id: a1, col: a, label: "власник", text: "Max", note: "чоловік → er", tone: yellow }
>   - { id: a2, col: a, label: "слово", text: "sein Bruder", note: "його брат", tone: yellow }
>   - { id: b1, col: b, label: "власник", text: "Anna", note: "жінка → sie", tone: pink }
>   - { id: b2, col: b, label: "слово", text: "ihr Bruder", note: "її брат", tone: pink }
>   - { id: c1, col: c, label: "власник", text: "Herr Weber", note: "ввічливо → Sie", tone: gray }
>   - { id: c2, col: c, label: "слово", text: "Ihr Bruder", note: "Ваш брат, Ihr з великої", tone: gray }
> steps:
>   - { focus: [a1, a2], note: "Власник — Max (чоловік): sein. Слово sein-, хоч брат (der Bruder) теж чоловічого роду — це випадково." }
>   - { focus: [b1, b2], note: "Власник — Anna (жінка): ihr. Не sein: рід власника, а не предмета визначає основу слова." }
>   - { focus: [c1, c2], note: "До Herr Weber звертаємося на «Ви»: Ihr — з великої літери, закінчення таке ж, як у mein." }
> ```
> Жовтий блок — «його», рожевий — «її», сірий — «Ваш»; мітка власника є в кожному блоці.

**Запамʼятай:** основа слова залежить від власника (mein / dein / sein / ihr / unser / euer / Ihr), а закінчення — від **предмета**, яким володіємо.

### Закінчення: як у ein / kein

| Рід предмета | Називний (Nom) | Знахідний (Akk) | Приклад |
|---|---|---|---|
| der · ч. | mein | mein**en** | mein Bruder → Ich sehe mein**en** Bruder. |
| die · ж. | mein**e** | mein**e** | meine Schwester → Ich sehe meine Schwester. |
| das · с. | mein | mein | mein Kind → Ich sehe mein Kind. |
| die · мн. | mein**e** | mein**e** | meine Eltern → Ich sehe meine Eltern. |

Змінюється знахідний лише в чоловічого роду: *mein → meinen*, *dein → deinen*, *sein → seinen* ([[Deutsch - A1 - 11. haben, знахідний відмінок і kein]]).

> [!diagram] mein · meine · meinen: закінчення за предметом
> ```yaml
> layout: compare
> columns: { m: "der · ч.", f: "die · ж.", n: "das · с.", pl: "die · мн." }
> nodes:
>   - { id: m1, col: m, label: "der · Nom", text: "mein Bruder", note: "без закінчення", tone: blue }
>   - { id: m2, col: m, label: "der · Akk", text: "meinen Bruder", note: "закінчення -en", tone: blue }
>   - { id: f1, col: f, label: "die · Nom і Akk", text: "meine Schwester", note: "закінчення -e", tone: red }
>   - { id: n1, col: n, label: "das · Nom і Akk", text: "mein Kind", note: "без закінчення", tone: green }
>   - { id: p1, col: pl, label: "die · мн.", text: "meine Eltern", note: "закінчення -e", tone: violet }
> steps:
>   - { focus: [m1, n1], note: "Чоловічий і середній рід у називному: без закінчення — mein Bruder, mein Kind." }
>   - { focus: [m2], note: "Знахідний чоловічого роду: -en — meinen Bruder. Це єдина зміна у знахідному." }
>   - { focus: [f1, p1], note: "Жіночий рід і множина мають -e в обох відмінках: meine Schwester, meine Eltern." }
> ```
> Сині блоки — чоловічий рід, червоні — жіночий, зелені — середній, фіолетові — множина; мітка роду є в кожному блоці.

### unser і euer: невелика особливість

У словах **unser** і **euer** при додаванні закінчення слово **euer** завжди втрачає -e-, а в **unser** воно зазвичай лишається (*unsere*, розм. також *unsre*): *euer + e = **eure***, *euer + en = **euren***. Правильно: *Das ist eure Tasche*, а не ~~euere Tasche~~. Слово *unser* із закінченням *-en*: *unseren Hund*.

### ihr — «її», «їхній», а також «ви»

Слово **ihr** має три значення: займенник «ви» (*Seid ihr hier?*), присвійне «її» (*ihr Bruder*) й «їхній» (*ihr Haus*). Розрізняємо за контекстом. Присвійне *Ihr* — «Ваш» — завжди з великої літери, бо належить до ввічливого *Sie*.

## Приклади

- *Das ist mein Bruder. Er heißt Tim.* — Це мій брат. Його звати Тім.
- *Wo ist deine Tasche?* — Де твоя сумка?
- *Max liebt seine Frau.* — Макс любить свою дружину.
- *Anna liebt ihren Mann.* — Анна любить свого чоловіка.
- *Unser Haus ist klein, aber hell.* — Наш будинок маленький, але світлий.
- *Kinder, wo ist euer Lehrer?* — Діти, де ваш учитель?
- *Die Kinder und ihre Eltern sind hier.* — Діти і їхні батьки тут.
- *Herr Weber, ist das Ihre Tasche?* — Пане Вебер, це Ваша сумка?
- *Ich suche meinen Schlüssel.* — Я шукаю свій ключ.
- *Hast du dein Handy dabei?* — Ти маєш при собі мобільний?
- *Wie ist Ihr Name, bitte?* — Як Вас звати, будь ласка?
- *Das ist mein Geld und das ist dein Geld.* — Це мої гроші, а це твої.

## Слова

### Присвійні артиклі

> [!word] mein
> ipa: /maɪ̯n/ · pos: det · level: A1 · id: de-a1-possessiv-w01
> uk: мій; моя; моє; мої
> forms: mein · meine · meinen
> example: **Mein** Bruder wohnt in Berlin. — Мій брат живе в Берліні.
> note: закінчення як у ein: mein Bruder, meine Schwester, mein Kind, meine Eltern; Akk der: meinen. ei = [aɪ̯], «ай».

> [!word] dein
> ipa: /daɪ̯n/ · pos: det · level: A1 · id: de-a1-possessiv-w02
> uk: твій; твоя; твоє; твої
> forms: dein · deine · deinen
> example: Wo ist **deine** Tasche? — Де твоя сумка?
> note: тільки до друга, родича, дитини (du). До незнайомої людини — Ihr.

> [!word] sein (його)
> ipa: /zaɪ̯n/ · pos: det · level: A1 · id: de-a1-possessiv-w03
> uk: його (присвійне); також для es
> forms: sein · seine · seinen
> example: Max liebt **seine** Frau. — Макс любить свою дружину.
> note: це не дієслово sein («бути»), хоч пишеться так само. Присвійне слово завжди стоїть перед іменником: sein Auto, seine Tasche.

> [!word] ihr (її, їхній)
> ipa: /iːɐ̯/ · pos: det · level: A1 · id: de-a1-possessiv-w04
> uk: її; їхній
> forms: ihr · ihre · ihren
> example: Anna liebt **ihren** Mann. — Анна любить свого чоловіка.
> note: ihr = «її» (одна жінка) і «їхній» (кілька осіб). Закінчення — за предметом. Не плутай з ihr = «ви» (друзі).

> [!word] unser
> ipa: /ˈʊnzɐ/ · pos: det · level: A1 · id: de-a1-possessiv-w05
> uk: наш; наша; наше; наші
> forms: unser · unsere · unseren
> example: **Unser** Haus ist klein. — Наш будинок маленький.
> note: з закінченням розм. часто unsre, unsren.

> [!word] euer
> ipa: /ˈɔʏ̯ɐ/ · pos: det · level: A1 · id: de-a1-possessiv-w06
> uk: ваш; ваша; ваше; ваші (до друзів, ihr)
> forms: euer · eure · euren
> example: Kinder, wo ist **euer** Lehrer? — Діти, де ваш учитель?
> note: з закінченням випадає e: euer + e = eure (не euere). eu = [ɔʏ̯]. До кількох друзів, дітей; ввічливо — Ihr.

> [!word] Ihr (Ваш)
> ipa: /iːɐ̯/ · pos: det · level: A1 · id: de-a1-possessiv-w07
> uk: Ваш; Ваша; Ваше; Ваші (ввічливо)
> forms: Ihr · Ihre · Ihren
> example: Wie ist **Ihr** Name, bitte? — Як Вас звати, будь ласка?
> note: завжди з великої літери: Ihr, Ihre, Ihren. Закінчення — за предметом: Ihr Name, Ihre Tasche, Ihren Namen.

### Слова для прикладів

> [!word] der Kuli
> ipa: /ˈkuːli/ · pos: noun · level: A1 · id: de-a1-possessiv-w08
> uk: ручка (кулькова)
> forms: die Kulis
> example: Wo ist mein **Kuli**? — Де моя ручка?
> note: розмовне скорочення від Kugelschreiber; офіційно: der Stift, der Kugelschreiber. u довге — [uː].

> [!word] der Ausweis
> ipa: /ˈaʊ̯svaɪ̯s/ · pos: noun · level: A1 · id: de-a1-possessiv-w09
> uk: посвідчення особи; паспорт
> forms: die Ausweise
> example: Ihr **Ausweis**, bitte! — Ваш документ, будь ласка!
> note: повна назва der Personalausweis (ID-картка); der Reisepass — паспорт для виїзду за кордон. w = [v].

> [!word] der Rucksack
> ipa: /ˈʁʊkzak/ · pos: noun · level: A1 · id: de-a1-possessiv-w10
> uk: рюкзак
> forms: die Rucksäcke
> example: Mein **Rucksack** ist schwarz. — Мій рюкзак чорний.
> note: множина з умлаутом: die Rucksäcke. ck — короткий голосний перед ним, u = [ʊ].

## Слухаємо

> [!listen] Чия це сумка?
> level: A1 · type: choice · speed: slow · id: de-a1-possessiv-l01
> audio: Das ist meine Tasche.
> - [ ] Das ist deine Tasche.
> - [x] Das ist meine Tasche.
> - [ ] Das ist seine Tasche.
>
> **Пояснення:** *meine* — «моя», *deine* — «твоя», *seine* — «його». Слухай початок слова: m-, d-, s-.

> [!listen] Чий це автомобіль?
> level: A1 · type: choice · speed: slow · id: de-a1-possessiv-l02
> audio: Das ist ihr Auto.
> - [ ] Das ist sein Auto.
> - [x] Das ist ihr Auto.
> - [ ] Das ist mein Auto.
>
> **Пояснення:** *ihr* починається з довгого [iː] — «її / їхній». *Sein* починається з [z].

> [!listen] Хто чий?
> level: A1 · type: answer · speed: slow · id: de-a1-possessiv-l03
> audio: Das ist Tim. Seine Schwester heißt Lena. Ihr Mann heißt Paul.
> - [x] Пауль — чоловік Лени.
> - [ ] Пауль — чоловік Тіма.
> - [ ] Пауль — брат Тіма.
> - [ ] Пауль — брат Лени.
>
> **Пояснення:** *seine Schwester* — сестра Тіма. *Ihr Mann* — «її чоловік», тобто чоловік тієї жінки, про яку щойно говорили — Лени.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-possessiv-l04
> audio: Wo ist mein Schlüssel?
> explain: mein — основа без закінчення, бо der Schlüssel у називному (питання «Wo ist …?»).

> [!listen] У бюро знахідок. Що шукає гість і що знайшов?
> level: A1 · type: answer · speed: slow · id: de-a1-possessiv-l05
> audio: A: Guten Tag. Was suchen Sie?
> audio: B: Ich suche meine Tasche. Sie ist schwarz.
> audio: A: Ist das Ihre Tasche?
> audio: B: Ja! Und mein Schlüssel ist auch da. Danke!
> - [x] Сумку й ключ; обидва знайшов.
> - [ ] Лише сумку; ключа немає.
> - [ ] Лише ключ; сумки немає.
> - [ ] Мобільний і гроші.
>
> **Пояснення:** *meine Tasche* — моя сумка, *mein Schlüssel* — мій ключ; обидві речі знайшлися. Переклад: — Добрий день. Що Ви шукаєте? — Я шукаю свою сумку. Вона чорна. — Це Ваша сумка? — Так! І мій ключ теж тут. Дякую!

## Вимова

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-possessiv-s01
> text: Das ist mein Bruder und das ist meine Schwester.
> ipa: /das ɪst maɪ̯n ˈbʁuːdɐ ʊnt das ɪst ˈmaɪ̯nə ˈʃvɛstɐ/
> tip: mein — ei = «ай»; Bruder — r горловий, u довге; Schwester — schw = [ʃv], «шв».
> uk: Це мій брат, а це моя сестра.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-possessiv-s02
> text: Ich suche meinen Schlüssel.
> ipa: /ɪç ˈzuːxə ˈmaɪ̯nən ˈʃlʏsl̩/
> tip: suche — s перед голосним [z], ch після u — глибоке [x]; Schlüssel — ü короткий [ʏ], sch = [ʃ].
> uk: Я шукаю свій ключ.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-possessiv-s03
> text: Wie ist Ihr Name?
> ipa: /viː ɪst iːɐ̯ ˈnaːmə/
> tip: w = [v]; Ihr — довге [iː] і ледь чутне r на кінці; Name — a довге.
> uk: Як Вас звати?

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-possessiv-s04
> text: Unser Haus ist klein.
> ipa: /ˈʊnzɐ haʊ̯s ɪst klaɪ̯n/
> tip: unser — u короткий, s дзвінке [z]; Haus — au = «ау», h видихом; klein — ei = «ай».
> uk: Наш будинок маленький.

> [!speak] Ситуація: спитай, чия сумка
> level: A1 · speed: slow · id: de-a1-possessiv-s05
> text: Ist das Ihre Tasche?
> ipa: /ɪst das ˈiːʁə ˈtaʃə/
> tip: Ihre — довге [iː] і r перед голосним [ʁ]; Tasche — a короткий, sch = [ʃ].
> uk: Це Ваша сумка?

## Типові помилки українців

> [!pitfall] «Свій» → sein / ihr / mein
> ~~Sie liebt sein Mann.~~ → Sie liebt **ihren** Mann. ~~Er liebt ihr Frau.~~ → Er liebt **seine** Frau. В українській «свій» підходить до всіх осіб, а в німецькій потрібне слово залежить від власника: *ich → mein, du → dein, er → sein, sie → ihr, wir → unser*. Питання «чий?» дивись на того, хто володіє, а не на предмет.

> [!pitfall] Закінчення за предметом, а не за власником
> ~~mein Schwester~~ → **meine** Schwester; ~~meine Bruder~~ → **mein** Bruder; ~~Ich sehe mein Bruder~~ → Ich sehe **meinen** Bruder. Основа (*mein / dein / sein …*) — від власника, а закінчення — від роду предмета: *die Schwester* → *-e*, *der Bruder* у знахідному → *-en*. Схема така сама, як у *ein / kein*.

> [!pitfall] ihr і Ihr, euer і ihr
> ~~Frau Weber, ist das deine Tasche?~~ → **Ihre** Tasche (на «Ви»). ~~Kinder, wo ist ihr Hund?~~ → wo ist **euer** Hund? Ввічливе «Ваш» — **Ihr** з великої літери. «Ваш» до кількох друзів — **euer**, а не *ihr*, бо *ihr* у присвійному значенні — це «її» або «їхній».

> [!pitfall] Зайве e в euer і unser
> ~~euere Tasche~~ → **eure** Tasche; ~~eueren Hund~~ → **euren** Hund. У *euer* перед закінченням випадає *e*. У *unser* теж часто: *unsere* або розм. *unsre*.

## Ситуація: у бюро знахідок

> [!listen] Надія загубила ключ. Що вона описує?
> level: A1 · type: answer · speed: slow · id: de-a1-possessiv-l06
> audio: A: Guten Tag! Kann ich Ihnen helfen?
> audio: B: Ja. Ich habe meinen Schlüssel verloren.
> audio: A: Wie sieht Ihr Schlüssel aus?
> audio: B: Er ist klein, und mein Name steht dran.
> - [x] Маленький ключ, на ньому написано її імʼя.
> - [ ] Великий ключ без імені.
> - [ ] Сумку з іменем власника.
> - [ ] Маленький ключ, імені немає.
>
> **Пояснення:** *meinen Schlüssel* (знахідний, der → -en), *klein* — маленький, *mein Name steht dran* — на ньому написано моє імʼя. Переклад: — Добрий день! Чим можу допомогти? — Так. Я загубила свій ключ. — Як виглядає Ваш ключ? — Він маленький, і на ньому написано моє імʼя.

> [!speak] Ситуація: опиши свій ключ
> level: A1 · speed: slow · id: de-a1-possessiv-s06
> text: Mein Schlüssel ist klein.
> ipa: /maɪ̯n ˈʃlʏsl̩ ɪst klaɪ̯n/
> tip: mein — «майн»; klein — «клайн»; обидва з [aɪ̯].
> uk: Мій ключ маленький.

## Практика

> [!quiz] Das ist Max. ___ Schwester heißt Lena.
> level: A1 · type: single · id: de-a1-possessiv-q02
> - [ ] Sein
> - [x] Seine
> - [ ] Ihre
> - [ ] Seiner
>
> **Пояснення:** власник — Макс (*er*), тому основа *sein-*. *Die Schwester* — жіночий рід, закінчення -e: *seine Schwester*.

> [!quiz] Das ist Anna. ___ Bruder ist Arzt.
> level: A1 · type: single · id: de-a1-possessiv-q03
> - [x] Ihr
> - [ ] Ihre
> - [ ] Sein
> - [ ] Ihren
>
> **Пояснення:** власник — Анна (*sie*), основа *ihr-*. *Der Bruder* у називному — без закінчення, тож *ihr Bruder*.

> [!quiz] Frau Weber, wo ist ___ Tasche?
> level: A1 · type: single · id: de-a1-possessiv-q04
> - [ ] deine
> - [x] Ihre
> - [ ] Ihr
> - [ ] ihre
>
> **Пояснення:** до Frau Weber звертаємось на «Ви», тому *Ihr-* з великої літери. *Die Tasche* — жіночий рід, закінчення -e. *Deine* — для друзів, *ihre* з малої — «її».

> [!quiz] Які речення правильні? Обери всі.
> level: A1 · type: multi · id: de-a1-possessiv-q05
> - [x] Ich suche meinen Schlüssel.
> - [ ] Ich suche mein Schlüssel.
> - [x] Wir lieben unseren Lehrer.
> - [x] Er liebt seine Frau.
> - [ ] Er liebt ihre Frau (про свою дружину).
>
> **Пояснення:** *der Schlüssel* і *der Lehrer* у знахідному потребують -en: *meinen Schlüssel*, *unseren Lehrer*. *Seine Frau* — «його дружина»; *ihre Frau* означало б дружину іншої жінки.

> [!quiz] Hast du ___ Handy dabei?
> level: A1 · type: single · id: de-a1-possessiv-q06
> - [x] dein
> - [ ] deine
> - [ ] deinen
> - [ ] deins
>
> **Пояснення:** *das Handy* — середній рід, у знахідному без закінчення: *dein Handy*. *Deine* — для жіночого роду й множини, *deinen* — для чоловічого роду.

> [!quiz] Kinder, ist das ___ Hund?
> level: A1 · type: single · id: de-a1-possessiv-q07
> - [ ] ihr
> - [x] euer
> - [ ] unser
> - [ ] eure
>
> **Пояснення:** звертаємося до кількох дітей (*ihr*), тому присвійне слово — *euer*. *Der Hund* у називному — без закінчення. *Eure* було б для жіночого роду чи множини.

> [!quiz] Die Kinder und ___ Eltern sind hier.
> level: A1 · type: single · id: de-a1-possessiv-q08
> - [x] ihre
> - [ ] seine
> - [ ] Ihre
> - [ ] ihren
>
> **Пояснення:** власники — *die Kinder* (вони, *sie*), основа *ihr-*. *Die Eltern* — множина, закінчення -e: *ihre Eltern*. *Ihre* з великої — «Ваші».

> [!quiz] Wie ist ___ Name, bitte?
> level: A1 · type: single · id: de-a1-possessiv-q09
> - [ ] dein
> - [x] Ihr
> - [ ] ihr
> - [ ] mein
>
> **Пояснення:** у ввічливому запитанні до незнайомої людини — *Ihr* з великої. *Dein Name* — на «ти», *ihr Name* — «її / їхнє імʼя».

> [!quiz] Заповни пропуски присвійними словами
> level: A1 · type: fill · bank: ihren, mein · id: de-a1-possessiv-q10
>
> ```text fill
> Ich liebe [[meine]] Familie. (Я люблю свою сімʼю.)
> Du hast [[deinen]] Schlüssel. (У тебе твій ключ.)
> Wir suchen [[unser]] Haus. (Ми шукаємо наш будинок.)
> Er sucht [[seine]] Tasche. (Він шукає свою сумку.)
> ```
>
> **Пояснення:** *die Familie* → *meine*, *der Schlüssel* (Akk) → *deinen*, *das Haus* → *unser* (без закінчення), *die Tasche* → *seine*. Дистрактори: *ihren* — для чоловічого роду у знахідному, *mein* — без закінчення, а Familie жіночого роду.

> [!quiz] sein чи ihr? Власник визначає основу
> level: A1 · type: fill · bank: Seine, Mein · id: de-a1-possessiv-q11
>
> ```text fill
> Das ist Lena. [[Ihr]] Mann heißt Tim.
> Das ist Tim. [[Sein]] Auto ist neu.
> Max und Eva sind hier. [[Ihre]] Kinder sind klein.
> Kinder, wo ist [[euer]] Lehrer?
> ```
>
> **Пояснення:** Лена → *ihr*, Тім → *sein*, Макс і Єва (вони) → *ihre* (*die Kinder* — множина), діти (*ihr*) → *euer*. Дистрактори *Seine* і *Mein* не підходять за власником.

> [!quiz] Знахідний: впиши форму
> level: A1 · type: fill · bank: meiner, meinem · id: de-a1-possessiv-q12
>
> ```text fill
> Ich besuche [[meinen]] Bruder.
> Ich besuche [[meine]] Schwester.
> Ich besuche [[mein]] Kind.
> Ich besuche [[meine]] Eltern.
> ```
>
> **Пояснення:** у знахідному змінюється лише чоловічий рід (*meinen Bruder*). Жіночий і множина — *meine*, середній — *mein*. *Meiner* і *meinem* — інші відмінки.

> [!quiz] Склади речення: «Моя сестра живе в Берліні.»
> level: A1 · type: order · id: de-a1-possessiv-q13
>
> ```text order
> Meine Schwester
> wohnt
> in Berlin.
> Mein Schwester ✗
> ```
>
> **Пояснення:** *die Schwester* — жіночий рід, тож *meine Schwester*. Дієслово — на другому місці.

> [!quiz] Склади речення: «Ми шукаємо наш ключ.»
> level: A1 · type: order · id: de-a1-possessiv-q14
>
> ```text order
> Wir
> suchen
> unseren Schlüssel.
> unser Schlüssel ✗
> ```
>
> **Пояснення:** *der Schlüssel* — чоловічий рід, у знахідному *unseren Schlüssel*. Форма *unser Schlüssel* була б називним.

## Фішки

> [!reel] 💬 mein Schatz, mein Hase
> Німці вживають *mein* у пестливих словах: *mein Schatz* (мій скарб), *mein Hase* (мій зайчик), *meine Maus* (моя мишка), *mein Liebling*. Іноді це звучить дивно для українського вуха: «моя мишка» — це комплімент. Присвійне слово тут слугує не стільки власністю, скільки ніжністю.

> [!reel] 🧬 Звідки mein, dein, sein
> *Mein, dein, sein* походять від родового відмінка займенників *ich, du, er* («того, що належить мені, тобі, йому»). Згодом вони стали окремими присвійними словами і отримали закінчення, як *ein*. Тому сьогодні вони відмінюються так само: *mein, meine, meinen*.

> [!reel] 🔠 Чому Ihr з великої літери
> Ввічливе *Sie* й *Ihr* пишуть з великої літери, щоб відрізнити їх від *sie* («вона, вони») та *ihr* («її, їхній»). У листах і електронній пошті ця різниця дуже помітна: *Ihr Brief* — «Ваш лист», *ihr Brief* — «її лист». Саме велика літера показує повагу.

## Джерела та що почитати

- [DWDS — mein](https://www.dwds.de/wb/mein): значення, форми, походження присвійного слова.
- [DWDS — euer](https://www.dwds.de/wb/euer): форми з випаданням e (eure, euren).
- [DWDS — unser](https://www.dwds.de/wb/unser): форми та вживання.
- [DWDS — Possessivpronomen](https://www.dwds.de/wb/Possessivpronomen): термін і приклади присвійних слів.
- [DW — Nicos Weg (українською)](https://learngerman.dw.com/uk/nicos-weg/c-36519789): безкоштовний відеокурс A1–B1; у темі про родину — mein, dein, sein, ihr.
- [Goethe-Institut — Wortliste Start Deutsch 1 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf): офіційний словник рівня A1.

> [!important] Підсумок
> - **Власник** дає основу: ich → **mein**, du → **dein**, er / es → **sein**, sie → **ihr**, wir → **unser**, ihr → **euer**, sie (вони) → **ihr**, Sie → **Ihr**.
> - **Предмет** дає закінчення, як у *ein / kein*: *mein Bruder, meine Schwester, mein Kind, meine Eltern*; у знахідному ч. р. — **-en** (*meinen Bruder*).
> - «Свій» не перекладається одним словом: ~~Sie liebt sein Mann~~ → *Sie liebt **ihren** Mann*.
> - *euer / unser* з закінченням: *eure, euren, unsere, unseren* (e випадає в *euer*).
> - Ввічливе «Ваш» — **Ihr** з великої літери.
