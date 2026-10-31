---
title: Прийменники часу — am, um, im, von … bis, vor, nach
id: de-a1-zeitpraep
level: A1
icon: px:clock
tags: [deutsch, a1, grammar, praepositionen, zeit]
prerequisites: ["[[Deutsch - A1 - 12. Час, дні, місяці й дата]]", "[[Deutsch - A1 - 16. Розпорядок дня й відокремлювані дієслова]]"]
estimatedMinutes: 35
---

# Прийменники часу — am, um, im, von … bis, vor, nach

> [!success] Після цієї теми ти зможеш
> - вибрати прийменник для години, дня, дати, місяця й пори року: *um 8 Uhr, am Montag, im Mai*;
> - сказати, коли щось починається й закінчується: *von 9 bis 17 Uhr*;
> - розповісти, що було чи буде до і після чогось: *vor dem Essen, nach der Arbeit*;
> - не помилитися з «в» українською: німецькою це *um, am, im* залежно від того, що ти називаєш.

## Передбач

> [!quiz] Як сказати: «Курс починається о восьмій годині»?
> level: A1 · type: single · id: de-a1-zeitpraep-q01
> - [ ] Der Kurs beginnt in acht Uhr.
> - [ ] Der Kurs beginnt am acht Uhr.
> - [x] Der Kurs beginnt um acht Uhr.
> - [ ] Der Kurs beginnt im acht Uhr.
>
> **Пояснення:** точний час на годиннику — прийменник **um**. Український «о / в» не має одного перекладу: німецька вибирає прийменник за тим, що саме ти називаєш (годину, день чи місяць).

## «В» українською — три прийменники німецькою

В українській ми кажемо «о восьмій», «в понеділок», «у травні» — і прийменники там різні, хоча й схожі. Німецька теж розрізняє, і система проста:

| Що називаємо | Прийменник | Приклад |
|---|---|---|
| точна година | **um** | um 8 Uhr, um halb zwei |
| день тижня, пора доби, дата | **am** (= an dem) | am Montag, am Abend, am 3. Mai |
| місяць, пора року | **im** (= in dem) | im Mai, im Sommer |
| рік | — (без прийменника) | 2026; або im Jahr 2026 |

> [!diagram] Від точки до періоду: um → am → im
> ```yaml
> layout: flow
> nodes:
>   - { id: h, label: "година", text: "um 8 Uhr", tone: yellow }
>   - { id: d, label: "день, пора доби", text: "am Montag", tone: pink }
>   - { id: m, label: "місяць, пора року", text: "im Mai", tone: gray }
>   - { id: y, label: "рік", text: "2026", tone: yellow }
> steps:
>   - { focus: h, note: "Найточніше — година на годиннику: um. Це «точка» на осі часу." }
>   - { focus: d, note: "Ширше — день, пора доби, дата: am (= an dem): am Montag, am Morgen, am 3. Mai." }
>   - { focus: m, note: "Ще ширше — місяць, пора року: im (= in dem): im Mai, im Winter." }
>   - { focus: y, note: "Рік — найширший відрізок. Прийменника не потрібно: Ich bin 2026 nach Berlin gezogen." }
> ```
> Чим точніше — тим «коротший» прийменник: *um* (година) → *am* (день) → *im* (місяць). Рік — без прийменника.

> [!tip] Запитання «Wann?» і «Um wie viel Uhr?»
> *Wann* — «коли» взагалі: *Wann hast du Unterricht? — Am Montag.* *Um wie viel Uhr* — «о котрій»: *Um wie viel Uhr beginnt der Kurs? — Um acht.*

## um — година

**Um** + точний час: *um 7 Uhr, um 14.30 Uhr, um halb drei, um Viertel nach acht.* Після *um* артикля немає.

- *Ich stehe um 7 Uhr auf.* — Я встаю о сьомій.
- *Der Film beginnt um 20.15 Uhr.* — Фільм починається о 20.15.

## am — дні, пори доби, дати

**am** = *an* + *dem*. Уживаємо з:
- днями тижня: *am Montag, am Freitag*;
- частинами дня: *am Morgen, am Vormittag, am Nachmittag, am Abend*;
- датою: *am 3. Mai* («третього травня»; порядкові — тема [[Deutsch - A1 - 12. Час, дні, місяці й дата]]);
- вихідними: *am Wochenende*.

Виняток: ніч — **in der Nacht** (не ~~am Nacht~~). Також є короткі форми *morgens, abends, nachts* («щоранку, щовечора, щоночі»): *Ich lerne abends Deutsch.*

## im — місяці й пори року

**im** = *in* + *dem*: *im Januar, im Mai, im Sommer, im Winter*.

## von … bis — від … до

**von … bis** окреслює період: *von 9 bis 17 Uhr, von Montag bis Freitag, von Mai bis September.* Прийменник *von* ставимо на початку періоду, *bis* — в кінці. Не кажи ~~von 9 zu 17~~: після «з» завжди йде *bis*.

> [!diagram] von 9 bis 17 Uhr
> ```yaml
> layout: timeline
> nodes:
>   - { id: a, at: "09:00", label: "von", text: "початок", tone: pink }
>   - { id: b, at: "12:00", label: "в середині", text: "обід", tone: gray }
>   - { id: c, at: "17:00", label: "bis", text: "кінець", tone: yellow }
> steps:
>   - { focus: a, note: "von 9 — початок періоду: тут ми починаємо." }
>   - { focus: c, note: "bis 17 Uhr — кінець періоду: до цього часу." }
>   - { focus: [a, b, c], note: "Весь відрізок — Ich arbeite von 9 bis 17 Uhr. Усередині нього може бути pause (перерва)." }
> ```

## vor і nach — до і після

**vor** — «перед; тому (у минулому)», **nach** — «після». Обидва вимагають давального відмінка (Dativ), тому артикль змінюється: чоловічий і середній рід — **dem**, жіночий — **der**, множина — **den** (+ -n). Поки що вчи ці фрази цілими:

| Шматок | Переклад |
|---|---|
| vor dem Essen | перед їжею |
| nach dem Essen | після їжі |
| vor dem Unterricht | перед уроком |
| nach der Arbeit | після роботи |
| vor der Prüfung | перед іспитом |
| nach dem Frühstück | після сніданку |

Окремо запамʼятай: **vor** + час = «тому»: *vor einer Woche* — «тиждень тому», *vor zwei Tagen* — «два дні тому».

> [!note] Dativ з артиклем — лише перший погляд
> Тут ти бачиш Dativ уперше: *der Unterricht → vor **dem** Unterricht*, *die Arbeit → nach **der** Arbeit*. Повна таблиця відмінків — рівень A2. А ось *am* і *im* — це вже злиті форми *an dem* і *in dem*, вони по суті тієї самої системи.

## seit, ab, bis: невеликий додаток

- **seit** + Dativ: з якого моменту тривала дія, яка триває досі: *Ich wohne seit zwei Jahren in Köln* — «Я живу в Кельні вже два роки» (німецька тут уживає Präsens!). *seit Montag* — «з понеділка».
- **ab** + Dativ: з якого моменту щось починає діяти: *ab Montag, ab 8 Uhr.* — «з понеділка, від восьмої».
- **bis** — «до»: *bis Freitag, bis 18 Uhr.*
- **zwischen … und …** — «між»: *zwischen 8 und 9 Uhr*; **gegen** — «близько»: *gegen 8 Uhr* («десь о восьмій»).
- **dauern** — «тривати»: *Wie lange dauert die Pause? — Eine halbe Stunde.*

## Приклади

- Der Deutschkurs beginnt um 9 Uhr. — Курс німецької починається о 9.
- Am Montag und am Mittwoch habe ich Unterricht. — У понеділок і в середу в мене уроки.
- Am Wochenende schlafe ich lange. — На вихідних я довго сплю.
- Im Sommer fahren wir nach Italien. — Влітку ми їдемо до Італії.
- Im Januar ist es kalt. — У січні холодно.
- Das Café ist von 8 bis 18 Uhr geöffnet. — Кафе відчинене з 8 до 18.
- Vor dem Essen wasche ich die Hände. — Перед їжею я мию руки.
- Nach der Arbeit gehe ich einkaufen. — Після роботи я йду по покупки.
- Ich lerne seit einem Jahr Deutsch. — Я вчу німецьку вже рік.
- Ab Montag habe ich Urlaub. — З понеділка в мене відпустка.
- Die Pause dauert von 12 bis 13 Uhr. — Перерва триває з 12 до 13.
- Wir kommen gegen 8 Uhr, zwischen 7 und 9 sind wir sicher da. — Ми прийдемо десь о 8, між 7 і 9 точно будемо.
- Wir sehen uns am 12. Mai um 15 Uhr. — Побачимось 12 травня о 15 годині.

## Слова

> [!word] um (+ Akk)
> ipa: /ʊm/ · pos: prep · level: A1 · id: de-a1-zeitpraep-w01
> uk: о, близько (про час); навколо
> example: Der Zug fährt **um** 7 Uhr ab. — Потяг відправляється о 7.
> note: з годинами — без артикля. Ще значення: «навколо» (um die Ecke) і «приблизно» (um 8 Uhr herum). u коротке: «ум».

> [!word] an (+ Dat)
> ipa: /an/ · pos: prep · level: A1 · id: de-a1-zeitpraep-w02
> uk: у, на (про дні, пори доби); біля
> example: **An** welchem Tag hast du Unterricht? — Який день у тебе заняття?
> note: у часі найчастіше як am (= an dem): am Montag, am Abend, am 3. Mai. Просторове значення — «біля»: am Fenster.

> [!word] in (+ Dat)
> ipa: /ɪn/ · pos: prep · level: A1 · id: de-a1-zeitpraep-w03
> uk: у, в (про місяці, пори року)
> example: **In** den Ferien reisen wir viel. — Під час канікул ми багато подорожуємо.
> note: у часі найчастіше як im (= in dem): im Mai, im Sommer. In der Nacht — не am Nacht. Ще: in einer Stunde = через годину.

> [!word] vor (+ Dat)
> ipa: /foːɐ̯/ · pos: prep · level: A1 · id: de-a1-zeitpraep-w04
> uk: перед; тому (у минулому)
> example: Ich komme **vor** dem Unterricht. — Я приходжу перед уроком.
> note: v = [f]: «фор». vor einer Woche = тиждень тому. Просторове значення: «перед» (vor dem Haus).

> [!word] nach (+ Dat)
> ipa: /naːx/ · pos: prep · level: A1 · id: de-a1-zeitpraep-w05
> uk: після; до (про міста й країни)
> example: **Nach** der Arbeit gehe ich ins Kino. — Після роботи я йду в кіно.
> note: ach-Laut [x]: «нах» (як у «Бах»). Також «до», «у напрямку» міст: nach Berlin, nach Hause.

> [!word] von … bis
> ipa: /fɔn bɪs/ · pos: phrase · level: A1 · id: de-a1-zeitpraep-w06
> uk: з … до; від … до
> example: Das Büro ist **von** 8 **bis** 16 Uhr geöffnet. — Офіс відчинений з 8 до 16.
> note: von + Dativ, bis без артикля. von Montag bis Freitag. von … bis можна й про відстань: von Kyjiw bis Lwiw.

> [!word] bis
> ipa: /bɪs/ · pos: prep · level: A1 · id: de-a1-zeitpraep-w07
> uk: до (кінцевого моменту)
> example: Ich arbeite heute **bis** 18 Uhr. — Сьогодні я працюю до 18.
> note: без артикля: bis Freitag, bis morgen. Побажання: Bis bald! — До скорого! Bis morgen! — До завтра!

> [!word] seit (+ Dat)
> ipa: /zaɪ̯t/ · pos: prep · level: A1 · id: de-a1-zeitpraep-w08
> uk: з (якогось часу), вже (протягом)
> example: Wir wohnen **seit** drei Jahren in München. — Ми живемо в Мюнхені вже три роки.
> note: seit [zaɪ̯t] звучить як seid — форма дієслова sein (ihr seid). Дія триває досі, тому Präsens, а не минулий час.

> [!word] ab (+ Dat)
> ipa: /ap/ · pos: prep · level: A1 · id: de-a1-zeitpraep-w09
> uk: з (моменту), від
> example: **Ab** nächster Woche habe ich einen neuen Job. — З наступного тижня в мене нова робота.
> note: b у кінці — глухе [p]: «ап» (Auslautverhärtung). Також префікс: ab-fahren.

> [!word] zwischen (+ Dat)
> ipa: /ˈtsvɪʃn̩/ · pos: prep · level: A1 · id: de-a1-zeitpraep-w10
> uk: між; (про час) в проміжку між
> example: Ich bin **zwischen** 8 und 9 Uhr zu Hause. — Я вдома між 8 і 9.
> note: zw = [tsv]: «цвішн». Часто зі словом und: zwischen 8 und 9 Uhr.

> [!word] gegen (+ Akk)
> ipa: /ˈɡeːɡn̩/ · pos: prep · level: A1 · id: de-a1-zeitpraep-w11
> uk: близько, приблизно (про час); проти
> example: Wir kommen **gegen** 8 Uhr. — Ми прийдемо близько 8.
> note: gegen 8 Uhr = приблизно о 8. Інше значення — «проти» (gegen den Wind).

> [!word] dauern
> ipa: /ˈdaʊ̯ɐn/ · pos: verb · level: A1 · id: de-a1-zeitpraep-w12
> uk: тривати
> forms: dauern → dauerte → hat gedauert
> example: Der Kurs **dauert** drei Monate. — Курс триває три місяці.
> note: Wie lange dauert das? — Скільки це триває? Підмет — не людина: es dauert.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-zeitpraep-l01
> audio: Der Kurs beginnt um neun Uhr.
> - [ ] Der Kurs beginnt am Montag.
> - [x] Der Kurs beginnt um neun Uhr.
> - [ ] Der Kurs beginnt im September.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-zeitpraep-l02
> audio: Am Montag habe ich Unterricht.

> [!listen] Послухай оголошення. Коли відчинене кафе?
> level: A1 · type: answer · speed: slow · id: de-a1-zeitpraep-l03
> audio: A: Das Café ist von Montag bis Freitag von acht bis achtzehn Uhr geöffnet. Am Samstag öffnen wir um neun Uhr. Am Sonntag ist geschlossen.
> - [ ] щодня з 8 до 18
> - [x] у будні з 8 до 18, у суботу з 9, у неділю зачинене
> - [ ] у неділю з 9 до 18

> [!listen] Послухай розмову. Коли зустріч?
> level: A1 · type: answer · speed: slow · id: de-a1-zeitpraep-l04
> audio: A: Hast du am Wochenende Zeit?
> audio: B: Am Samstag habe ich Deutschkurs, aber nach dem Kurs habe ich Zeit.
> audio: A: Gut, dann treffen wir uns um drei Uhr.
> - [ ] у неділю о третій
> - [x] у суботу о третій, після курсу
> - [ ] у суботу вранці

## Вимова

Прийменники часу короткі й ненаголошені — вони «злипаються» з наступним словом: *am Montag* — «а-м-Монтаґ», *um acht* — «ум-ахт». Ключові звуки: **ach-Laut [x]** в *nach*, **глухий [p]** в *ab*, **v = [f]** у *vor*.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-zeitpraep-s01
> text: Ich stehe um sieben Uhr auf.
> ipa: /ɪç ˈʃteːə ʊm ˈziːbn̩ uːɐ̯ aʊ̯f/
> tip: st- на початку = «шт» (stehe). sieben — дзвінке [z]. Uhr — довге u, r вокалізоване.
> uk: Я встаю о сьомій.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-zeitpraep-s02
> text: Am Montag habe ich Unterricht.
> ipa: /am ˈmoːntaːk ˈhaːbə ɪç ˈʊntɐʁɪçt/
> tip: Montag — довге o; g у кінці — глухе [k]. Unterricht закінчується на [ʁɪçt].
> uk: У понеділок у мене уроки.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-zeitpraep-s03
> text: Von neun bis siebzehn Uhr.
> ipa: /fɔn nɔɪ̯n bɪs ˈziːptseːn uːɐ̯/
> tip: von — v = [f]. neun — eu = [ɔɪ̯]. siebzehn: b у -zehn глухе [p].
> uk: З дев'ятої до сімнадцятої.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-zeitpraep-s04
> text: Nach der Arbeit gehe ich einkaufen.
> ipa: /naːx deːɐ̯ ˈaʁbaɪ̯t ˈɡeːə ɪç ˈaɪ̯nkaʊ̯fn̩/
> tip: nach — [x], як «х» у «хата», але з видихом із горла. Arbeit — [ʁ] горлове.
> uk: Після роботи я йду по покупки.

## Типові помилки українців

> [!pitfall] «in Montag», «um Montag» — ні, am Montag
> Українське «в понеділок» не перекладається словом *in*. День тижня, частина дня й дата — **am**: *am Montag, am Abend, am 3. Mai.* А «ввечері» можна й одним словом: *abends*.

> [!pitfall] «am 8 Uhr», «in 8 Uhr» — ні, um 8 Uhr
> Точний час — лише **um**: *um 8 Uhr, um halb drei.* Українське «о восьмій» — так само. Прийменник *am* поставиш лише там, де є день: *am Montag um 8 Uhr.*

> [!pitfall] «am Mai», «im 2026» — ні, im Mai, але 2026
> Місяць і пору року — **im**: *im Mai, im Winter*. Рік зазвичай — без прийменника: *2026 bin ich nach Berlin gezogen*. Розгорнутий варіант — *im Jahr 2026* (слово *Jahr* стоїть із *im*).

> [!pitfall] «nach das Essen», «vor Arbeit»
> Після *vor* і *nach* потрібен Dativ: *nach **dem** Essen, vor **der** Arbeit*. Форма ~~nach das Essen~~ — калька: в українській «після» не змінює артикль, якого немає. Запамʼятай готові шматки: *nach dem Essen, nach der Arbeit, vor dem Unterricht*.

## Практика

> [!quiz] Обери правильний прийменник: «Ich lerne ___ Montag Deutsch.»
> level: A1 · type: single · id: de-a1-zeitpraep-q02
> - [ ] um
> - [x] am
> - [ ] im
> - [ ] in
>
> **Пояснення:** день тижня — **am** (an + dem). *Um* — тільки точний час, *im* — місяць чи пора року.

> [!quiz] Обери правильний прийменник: «Wir fahren ___ Sommer nach Italien.»
> level: A1 · type: single · id: de-a1-zeitpraep-q03
> - [ ] am
> - [ ] um
> - [x] im
> - [ ] an
>
> **Пояснення:** пора року — **im** (in + dem): *im Sommer, im Winter*.

> [!quiz] Як сказати «Фільм починається о 20.15»?
> level: A1 · type: single · id: de-a1-zeitpraep-q04
> - [ ] Der Film beginnt am 20.15 Uhr.
> - [ ] Der Film beginnt im 20.15 Uhr.
> - [x] Der Film beginnt um 20.15 Uhr.
> - [ ] Der Film beginnt in 20.15 Uhr.
>
> **Пояснення:** година на годиннику — **um**. Без артикля.

> [!quiz] Яке речення про вихідні правильне?
> level: A1 · type: single · id: de-a1-zeitpraep-q05
> - [ ] Im Wochenende schlafe ich lange.
> - [ ] Um Wochenende schlafe ich lange.
> - [x] Am Wochenende schlafe ich lange.
> - [ ] In Wochenende schlafe ich lange.
>
> **Пояснення:** вихідні — це частина тижня, як день: **am Wochenende**.

> [!quiz] Як сказати «Вночі я сплю»?
> level: A1 · type: single · id: de-a1-zeitpraep-q06
> - [ ] Am Nacht schlafe ich.
> - [ ] Um Nacht schlafe ich.
> - [x] In der Nacht schlafe ich.
> - [ ] Im Nacht schlafe ich.
>
> **Пояснення:** *Nacht* — жіночого роду, виняток із am: **in der Nacht** (або *nachts*).

> [!quiz] Які речення правильні? Обери всі.
> level: A1 · type: multi · id: de-a1-zeitpraep-q07
> - [x] Ich komme am Freitag um 18 Uhr.
> - [ ] Ich komme in Freitag um 18 Uhr.
> - [x] Das Konzert ist im Mai.
> - [ ] Das Konzert ist am Mai.
>
> **Пояснення:** день тижня — *am Freitag*, година — *um 18 Uhr*, місяць — *im Mai*. ~~in Freitag~~ і ~~am Mai~~ — калька з українського «в».

> [!quiz] Які фрази означають період «з 9 до 17»? Обери всі.
> level: A1 · type: multi · id: de-a1-zeitpraep-q08
> - [x] von 9 bis 17 Uhr
> - [ ] von 9 zu 17 Uhr
> - [x] ab 9 Uhr bis 17 Uhr
> - [ ] seit 9 bis 17 Uhr
>
> **Пояснення:** «з … до» — *von … bis* (або *ab … bis*). Вираз ~~von … zu~~ у німецькій не існує, а *seit* не поєднується з *bis*.

> [!quiz] Заповни пропуски прийменниками
> level: A1 · type: fill · bank: in, an, vor · id: de-a1-zeitpraep-q09
>
> ```text fill
> Der Unterricht beginnt [[um]] 9 Uhr.
> [[Am]] Montag habe ich frei.
> [[Im]] Februar ist es kalt.
> Die Bank ist [[von]] 9 [[bis]] 16 Uhr geöffnet.
> ```
>
> **Пояснення:** година — *um*, день — *am*, місяць — *im*, період — *von … bis*. Інші слова з банку не пасують до жодного пропуску.

> [!quiz] Заповни пропуски: перед і після
> level: A1 · type: fill · bank: den, das · id: de-a1-zeitpraep-q10
>
> ```text fill
> Vor [[dem]] Essen wasche ich die Hände.
> Nach [[der]] Arbeit gehe ich nach Hause.
> Vor [[dem]] Unterricht trinke ich Kaffee.
> Nach [[dem]] Frühstück lese ich Zeitung.
> ```
>
> **Пояснення:** *vor* і *nach* + Dativ: чоловічий і середній рід — *dem* (*Essen, Unterricht, Frühstück*), жіночий — *der* (*Arbeit*). Форми *den* і *das* помилкові.

> [!quiz] Заповни пропуски: розмова про розклад
> level: A1 · type: fill · bank: am, nach · id: de-a1-zeitpraep-q11
>
> ```text fill
> A: Wann hast du Deutschkurs?
> B: [[Von]] Montag [[bis]] Mittwoch, [[um]] 18 Uhr.
> A: Und [[im]] August?
> B: Da habe ich Ferien.
> ```
>
> **Пояснення:** період днів — *von … bis*, час — *um 18 Uhr*, місяць — *im August*. Прийменники *am* і *nach* з цими виразами не поєднуються.

> [!quiz] Склади речення: «Після роботи я йду по покупки»
> level: A1 · type: order · id: de-a1-zeitpraep-q12
>
> ```text order
> Nach
> der
> Arbeit
> gehe
> ich
> einkaufen.
> dem ✗
> ```
>
> **Пояснення:** *Arbeit* — жіночого роду, тому *nach **der** Arbeit*. Після обставини на першому місці підмет і дієслово міняються: *gehe ich*.

> [!quiz] Склади речення: «У суботу о десятій я сплю»
> level: A1 · type: order · id: de-a1-zeitpraep-q13
>
> ```text order
> Am
> Samstag
> um
> zehn
> Uhr
> schlafe
> ich.
> im ✗
> ```
>
> **Пояснення:** день — *am Samstag*, година — *um zehn Uhr*; дієслово *schlafe* — на другому місці, підмет *ich* — після нього.

> [!quiz] Склади питання: «Коли в тебе заняття?»
> level: A1 · type: order · id: de-a1-zeitpraep-q14
>
> ```text order
> Wann
> hast
> du
> Unterricht?
> Wo ✗
> ```
>
> **Пояснення:** W-питання: питальне слово → дієслово → підмет. *Wann* — «коли»; *wo* — «де».

> [!quiz] Що означає «Ich wohne seit zwei Jahren in Köln»?
> level: A1 · type: single · id: de-a1-zeitpraep-q15
> - [ ] Я жив у Кельні два роки (давно, але вже не живу).
> - [x] Я живу в Кельні вже два роки.
> - [ ] Я переїду до Кельна через два роки.
> - [ ] Я живу в Кельні до двох років.
>
> **Пояснення:** *seit* + Präsens — дія почалася в минулому й триває зараз: «вже два роки». Для завершеного періоду німці кажуть інакше (Perfekt/Präteritum).

> [!quiz] Що означає «vor einer Woche»?
> level: A1 · type: single · id: de-a1-zeitpraep-q16
> - [ ] через тиждень
> - [ ] перед тижнем
> - [x] тиждень тому
> - [ ] на тижні
>
> **Пояснення:** *vor* + час = «тому»: *vor einer Woche, vor zwei Tagen*. «Через тиждень» — *in einer Woche*.

## Фішки

> [!reel] 🌙 Чому в Montag «місяць»
> *Montag* — це дослівно «день Місяця» (*Mond*). Українське «понеділок» — «після неділі». *Mittwoch* — дослівно «середина тижня» (*Mitte der Woche*): це слово замінило давню назву «день Одіна» (*Wodanstag*).

> [!reel] 🕙 Академічна чверть: 10 c.t.
> В університеті біля розкладу стоїть «10 c.t.» — *cum tempore*, тобто лекція починається о 10:15. Є й «10 s.t.» — *sine tempore*, рівно о 10:00. Це *akademisches Viertel*, і воно існує досі. Але поза університетом *um 10 Uhr* означає саме 10:00.

> [!reel] 🛒 Sonntag: Ruhetag
> У Німеччині в неділю майже всі магазини зачинені — діє закон про години роботи магазинів (*Ladenschluss*), який визначають землі. Тож *am Sonntag* — день тиші, прогулянок і кафе. Зазвичай відчинені лише заправки, крамниці на вокзалах, ресторани й, на кілька годин, пекарні.

## Джерела та що почитати

- [DWDS — um](https://www.dwds.de/wb/um) — значення прийменника, також у часі.
- [DWDS — seit](https://www.dwds.de/wb/seit) — значення й відмінність від *seid*.
- [Duden — Montag](https://www.duden.de/rechtschreibung/Montag) — походження назви дня.
- [Duden — Mittwoch](https://www.duden.de/rechtschreibung/Mittwoch) — слово й етимологія.
- [DW Learn German — Nicos Weg (A1)](https://learngerman.dw.com/en/beginners/c-36519789) — безкоштовний курс із розкладом дня та часом.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділ про темпоральні прийменники.

> [!important] Підсумок
> - Година — **um** (*um 8 Uhr*), день і пора доби — **am** (*am Montag, am Abend*), місяць і пора року — **im** (*im Mai*), рік — без прийменника.
> - Період — **von … bis**: *von 9 bis 17 Uhr*.
> - **vor** і **nach** + Dativ: *vor dem Essen, nach der Arbeit*; *vor einer Woche* — «тиждень тому».
> - Ніч — *in der Nacht*; для давно триваючого — *seit* + Präsens.
> - Не калькуй українське «в»: ~~in Montag~~, ~~am 8 Uhr~~, ~~am Mai~~.
