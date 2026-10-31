---
title: Відмінювання прикметників II — після ein і без артикля
id: de-a2-adj-unbestimmt
level: A2
icon: px:letterTile
tags: [deutsch, a2, grammar, adjektiv, deklination]
prerequisites: ["[[Deutsch - A2 - 15. Відмінювання прикметників I — після der, die, das]]"]
estimatedMinutes: 40
---

# Відмінювання прикметників II — після ein і без артикля

> [!success] Після цієї теми ти зможеш
> - правильно закінчити прикметник після *ein, kein, mein*…: *ein neuer Tisch, ein neues Auto, eine neue Tasche*;
> - вживати прикметник без артикля: *frisches Brot, kalter Kaffee, mit kaltem Wasser*;
> - пояснити, чому закінчення то *-er / -es / -e*, то *-en*: прикметник «підхоплює» сигнал, якого бракує артиклю;
> - не плутати прикметник перед іменником (з закінченням) і після *sein* (без закінчення).

## Передбач

> [!quiz] Обери правильне закінчення: «Ich habe ein ___ Handy.»
> level: A2 · type: single · id: de-a2-adj-unbestimmt-q01
> - [ ] neue
> - [x] neues
> - [ ] neuer
> - [ ] neuen
>
> **Пояснення:** *das Handy* — середній рід, після *ein* у називному й знахідному потрібне закінчення **-es**: *ein neues Handy*. Саме *ein* тут нічого не показує — тому закінчення бере на себе прикметник.

## Пояснення

### Головна ідея: прикметник підхоплює сигнал

У темі [[Deutsch - A2 - 15. Відмінювання прикметників I — після der, die, das]] артикль сам показував рід і відмінок (*der, die, das, den, dem*), а прикметник отримував нейтральне **-e / -en**. Тепер артикля або немає, або він «німий»:

| Форма | Показує рід? |
|---|---|
| der Tisch | так: **der** |
| ein Tisch | ні: *ein* без закінчення |
| ein Auto | ні: *ein* без закінчення |
| einen Tisch | так: **einen** |

Коли артикль нічого не показує, цю роботу виконує прикметник: *ein **neuer** Tisch* (ч.), *ein **neues** Auto* (с.). Закінчення прикметника в такому разі майже збігаються із закінченнями *der / die / das*: **-er, -e, -es, -en, -em**.

### Мішана відміна: після ein, kein, mein, dein, sein, ihr, unser, euer

Правило прикметника «з ein» таке: де в *ein* немає закінчення (називний ч., називний і знахідний с.), там прикметник бере **-er** і **-es**. Усюди інде — **-e** (жіночий) або **-en**.

| | чоловічий | жіночий | середній | множина (kein-) |
|---|---|---|---|---|
| **Nom.** | ein neu**er** Tisch | eine neu**e** Tasche | ein neu**es** Auto | keine neu**en** Tische |
| **Akk.** | einen neu**en** Tisch | eine neu**e** Tasche | ein neu**es** Auto | keine neu**en** Tische |
| **Dat.** | einem neu**en** Tisch | einer neu**en** Tasche | einem neu**en** Auto | keinen neu**en** Tischen |

> [!diagram] Мішана відміна: ein + прикметник
> ```yaml
> layout: compare
> columns: { m: "ч. · der", f: "ж. · die", n: "с. · das", pl: "множина · die" }
> nodes:
>   - { id: m1, col: m, label: "Nom · ч.", text: "ein neuer Tisch", note: "ein без закінчення → -er", tone: blue }
>   - { id: m2, col: m, label: "Akk · ч.", text: "einen neuen Tisch", note: "einen уже показує рід → -en", tone: blue }
>   - { id: m3, col: m, label: "Dat · ч.", text: "einem neuen Tisch", note: "-en", tone: blue }
>   - { id: f1, col: f, label: "Nom/Akk · ж.", text: "eine neue Tasche", note: "-e", tone: red }
>   - { id: f3, col: f, label: "Dat · ж.", text: "einer neuen Tasche", note: "-en", tone: red }
>   - { id: n1, col: n, label: "Nom/Akk · с.", text: "ein neues Auto", note: "ein без закінчення → -es", tone: green }
>   - { id: n3, col: n, label: "Dat · с.", text: "einem neuen Auto", note: "-en", tone: green }
>   - { id: p1, col: pl, label: "Nom/Akk · мн.", text: "keine neuen Tische", note: "-en", tone: violet }
>   - { id: p3, col: pl, label: "Dat · мн.", text: "keinen neuen Tischen", note: "-en", tone: violet }
> steps:
>   - { focus: [m1, n1], note: "Лише тут закінчення ein «німе»: називний ч. і називний / знахідний с. Тому прикметник бере -er і -es." }
>   - { focus: [m2, f1], note: "einen і eine вже показують рід і відмінок — прикметник спокійно -en або -e." }
>   - { focus: [m3, f3, n3, p3], note: "Давальний: скрізь -en." }
>   - { focus: [p1], note: "Множина після kein-, mein-: -en." }
> ```
> Сині блоки — чоловічий рід, червоні — жіночий, зелені — середній, фіолетові — множина; мітка роду є в кожному блоці.

Це працює і з *mein, dein, sein, ihr, unser, euer, kein*: *mein alter Computer*, *unser neues Haus*, *keine gute Idee*.

### Сильна відміна: без артикля

Коли артикля немає взагалі, прикметник мусить показати і рід, і відмінок сам. Його закінчення майже повторюють артикль:

| | чоловічий | жіночий | середній | множина |
|---|---|---|---|---|
| **Nom.** | frisch**er** Kaffee | frisch**e** Milch | frisch**es** Brot | frisch**e** Brötchen |
| **Akk.** | frisch**en** Kaffee | frisch**e** Milch | frisch**es** Brot | frisch**e** Brötchen |
| **Dat.** | frisch**em** Kaffee | frisch**er** Milch | frisch**em** Brot | frisch**en** Brötchen |

Порівняй із *der / die / das*: **-er** (der), **-e** (die), **-es** (das), **-en** (den), **-em** (dem). Єдина відмінність — давальний множини (*-en*) і Genitiv (він у темі B1-03).

> [!diagram] Сильна відміна: без артикля
> ```yaml
> layout: compare
> columns: { m: "ч. · der", f: "ж. · die", n: "с. · das", pl: "множина · die" }
> nodes:
>   - { id: m1, col: m, label: "Nom · ч.", text: "frischer Kaffee", note: "-er (як der)", tone: blue }
>   - { id: m2, col: m, label: "Akk · ч.", text: "frischen Kaffee", note: "-en (як den)", tone: blue }
>   - { id: m3, col: m, label: "Dat · ч.", text: "mit frischem Kaffee", note: "-em (як dem)", tone: blue }
>   - { id: f1, col: f, label: "Nom/Akk · ж.", text: "frische Milch", note: "-e (як die)", tone: red }
>   - { id: f3, col: f, label: "Dat · ж.", text: "mit frischer Milch", note: "-er (як der)", tone: red }
>   - { id: n1, col: n, label: "Nom/Akk · с.", text: "frisches Brot", note: "-es (як das)", tone: green }
>   - { id: n3, col: n, label: "Dat · с.", text: "mit frischem Brot", note: "-em (як dem)", tone: green }
>   - { id: p1, col: pl, label: "Nom/Akk · мн.", text: "frische Brötchen", note: "-e (як die)", tone: violet }
>   - { id: p3, col: pl, label: "Dat · мн.", text: "mit frischen Brötchen", note: "-en", tone: violet }
> steps:
>   - { focus: [m1, m2, m3], note: "Чоловічий рід: -er, -en, -em — як der, den, dem." }
>   - { focus: [f1, f3], note: "Жіночий: -e, а в давальному -er — як у der Frau." }
>   - { focus: [n1, n3], note: "Середній: -es, -em." }
>   - { focus: [p1, p3], note: "Множина: -e у називному / знахідному, -en у давальному." }
> ```
> Сині блоки — чоловічий рід, червоні — жіночий, зелені — середній, фіолетові — множина.

Сильну відміну вживаємо для речовин і неозначених кількостей (*Kaffee, Milch, Brot, Wasser, Geld*), у множині без артикля (*frische Brötchen*), і після числівників та *viele, wenige, einige*: *zwei große Hunde*.

### Прикметник після sein — без закінчення

Закінчення потрібне лише перед іменником. Після *sein, werden* прикметник не змінюється: *Das Brot ist frisch.* — *frisches Brot*. *Die Wohnung ist teuer.* — *eine teure Wohnung*.

### Прикметники на -el, -er, -e-

У *dunkel, teuer, hoch* перед закінченням випадає (або змінюється) літера: *ein dunkles Zimmer*, *ein teures Auto*, *ein hohes Haus* (*hoch* → *hoh-*). Закінчення все одно вибираємо за таблицею.

## Приклади

- Das ist ein neuer Computer. — Це новий компʼютер.
- Ich suche einen bequemen Stuhl. — Я шукаю зручний стілець.
- Sie hat eine kleine Wohnung in Köln. — У неї маленька квартира в Кельні.
- Wir kaufen frisches Brot und kalte Milch. — Ми купуємо свіжий хліб і холодне молоко.
- Er trinkt gern heißen Tee. — Він любить гарячий чай.
- Ich bezahle mit kleinem Geld. — Я плачу дрібними грошима.
- Mit kaltem Wasser wasche ich mich nicht gern. — Холодною водою я мию(ся) неохоче.
- Das ist ein dunkles Zimmer, aber es ist ruhig. — Це темна кімната, але в ній тихо.
- Wir haben zwei große Hunde. — У нас два великі собаки.
- Es ist keine gute Idee. — Це не гарна ідея.

## Слова

> [!word] schmutzig
> ipa: /ˈʃmʊtsɪç/ · pos: adj · level: A2 · id: de-a2-adj-unbestimmt-w01
> uk: брудний
> example: Meine Schuhe sind **schmutzig**. — Мої черевики брудні.
> note: sch + m = «шм»; tz = [ts].

> [!word] hässlich
> ipa: /ˈhɛslɪç/ · pos: adj · level: A2 · id: de-a2-adj-unbestimmt-w02
> uk: негарний; бридкий
> example: Das ist ein **hässliches** Bild. — Це негарна картина.
> note: h — легкий видих; ss між голосними — глухе [s].

> [!word] spannend
> ipa: /ˈʃpanənt/ · pos: adj · level: A2 · id: de-a2-adj-unbestimmt-w03
> uk: захопливий; напружений
> example: Der Film war **spannend**. — Фільм був захопливий.
> note: sp на початку = «шп»; кінцеве -d глушиться: [t].

> [!word] sauer
> ipa: /ˈzaʊ̯ɐ/ · pos: adj · level: A2 · id: de-a2-adj-unbestimmt-w04
> uk: кислий; (розм.) розсерджений
> example: Die Milch ist **sauer**. — Молоко кисле.
> note: у формі з закінченням випадає е: saure Gurken, saures Brot. Розм. Ich bin sauer — я розсерджений.

> [!word] scharf
> ipa: /ʃaʁf/ · pos: adj · level: A2 · id: de-a2-adj-unbestimmt-w05
> uk: гострий (на смак); гострий (про ніж)
> example: Das Essen ist zu **scharf**. — Їжа занадто гостра.
> note: sch = «ш»; кінцеве f дзвінко не звучить. Також: ein scharfes Messer.

> [!word] salzig
> ipa: /ˈzaltsɪç/ · pos: adj · level: A2 · id: de-a2-adj-unbestimmt-w06
> uk: солоний
> example: Die Suppe ist zu **salzig**. — Суп занадто солоний.
> note: das Salz — сіль. -ig у кінці = [ɪç].

> [!word] voll
> ipa: /fɔl/ · pos: adj · level: A2 · id: de-a2-adj-unbestimmt-w07
> uk: повний; переповнений
> example: Der Bus ist heute sehr **voll**. — Автобус сьогодні дуже переповнений.
> note: v = [f], як у слові «вол»: «фол».

> [!word] wunderbar
> ipa: /ˈvʊndɐbaːɐ̯/ · pos: adj · level: A2 · id: de-a2-adj-unbestimmt-w08
> uk: чудовий
> example: Das ist ein **wunderbarer** Tag! — Це чудовий день!
> note: w = «в»; наголос на першому складі.

> [!word] furchtbar
> ipa: /ˈfʊʁçtbaːɐ̯/ · pos: adj · level: A2 · id: de-a2-adj-unbestimmt-w09
> uk: жахливий
> example: Das war ein **furchtbarer** Film. — Це був жахливий фільм.
> note: ch після r = [ç]; сильніше за schlecht.

> [!word] preiswert
> ipa: /ˈpʁaɪ̯sveːɐ̯t/ · pos: adj · level: A2 · id: de-a2-adj-unbestimmt-w10
> uk: вигідний за ціною; недорогий
> example: Das Hotel ist **preiswert**. — Готель недорогий.
> note: preiswert — позитивно «вартий своїх грошей», на відміну від billig.

> [!word] kostenlos
> ipa: /ˈkɔstn̩loːs/ · pos: adj · level: A2 · id: de-a2-adj-unbestimmt-w11
> uk: безкоштовний
> example: Der Eintritt ist **kostenlos**. — Вхід безкоштовний.
> note: синонім — gratis. -los = «без»: kostenlos = «без витрат».

> [!word] gefährlich
> ipa: /ɡəˈfɛːɐ̯lɪç/ · pos: adj · level: A2 · id: de-a2-adj-unbestimmt-w12
> uk: небезпечний
> example: Das ist ein **gefährlicher** Weg. — Це небезпечна дорога.
> note: die Gefahr — небезпека. ä довге [ɛː].

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-adj-unbestimmt-l01
> audio: Das ist ein neues Auto.
> - [ ] Das ist ein neuer Auto.
> - [x] Das ist ein neues Auto.
> - [ ] Das ist eine neue Auto.
>
> **Пояснення:** *das Auto* — середній рід, тож *ein neues Auto*. Закінчення **-es** добре чути: [ˈnɔʏ̯əs].

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-adj-unbestimmt-l02
> audio: Ich trinke gern kalten Tee.
> - [ ] Ich trinke gern kalter Tee.
> - [x] Ich trinke gern kalten Tee.
> - [ ] Ich trinke gern kaltes Tee.
>
> **Пояснення:** *der Tee* — чоловічий рід, у знахідному без артикля — **-en**: *kalten Tee*.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-adj-unbestimmt-l03
> audio: Sie hat eine neue Wohnung.
> explain: *die Wohnung* — жіночий рід, знахідний = називний, після *eine* — **-e**.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-adj-unbestimmt-l04
> audio: Wir essen frisches Brot mit kalter Butter.
> explain: *frisches Brot* — середній, без артикля, **-es**. *mit kalter Butter* — давальний жіночого роду без артикля, **-er**.

> [!listen] Послухай діалог у магазині. Чому покупець не бере стілець?
> level: A2 · type: answer · speed: slow · id: de-a2-adj-unbestimmt-l05
> audio: A: Ich suche einen bequemen Stuhl für das Büro.
> audio: B: Hier haben wir einen schwarzen Stuhl. Er ist sehr bequem, aber er ist nicht billig.
> audio: A: Wie teuer ist er?
> audio: B: Hundertachtzig Euro.
> audio: A: Das ist mir zu teuer. Danke, ich überlege noch.
> - [ ] Він незручний.
> - [x] Він занадто дорогий.
> - [ ] Він не чорний.
>
> **Пояснення:** *zu teuer* — «занадто дорогий». *einen bequemen Stuhl* — знахідний чоловічого роду, **-en**.

## Вимова

Закінчення -er, -es, -em, -en в потоці мови вимовляємо мʼяко. **-er** — вокалізоване [ɐ], **-en** — слабке [n̩] або [ən], **-es** — [əs]; а **-em** — [əm]. Тому на слух важливо ловити останню приголосну: *neuer* — [ˈnɔʏ̯ɐ], *neues* — [ˈnɔʏ̯əs], *neuen* — [ˈnɔʏ̯ən].

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-adj-unbestimmt-s01
> text: Ich habe einen neuen Job.
> ipa: /ɪç ˈhaːbə ˈaɪ̯nən ˈnɔʏ̯ən dʒɔp/
> tip: neu — дифтонг [ɔʏ̯]; -en закінчення слабке. Job — слово запозичене, звучить [dʒɔp].
> uk: У мене нова робота.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-adj-unbestimmt-s02
> text: Das ist ein bequemer Stuhl.
> ipa: /das ɪst aɪ̯n bəˈkveːmɐ ʃtuːl/
> tip: bequem — наголос на -quem. -er на кінці — вокалізоване [ɐ]. St- = «шт».
> uk: Це зручний стілець.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-adj-unbestimmt-s03
> text: Wir kaufen frisches Brot.
> ipa: /viːɐ̯ ˈkaʊ̯fn̩ ˈfʁɪʃəs bʁoːt/
> tip: fr- — горлове [ʁ] після [f]; -es у кінці — коротке [əs].
> uk: Ми купуємо свіжий хліб.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-adj-unbestimmt-s04
> text: Mit kaltem Wasser, bitte.
> ipa: /mɪt ˈkaltəm ˈvasɐ ˈbɪtə/
> tip: -em в kaltem — [əm]; w = «в»; ss у Wasser — глухе [s].
> uk: З холодною водою, будь ласка.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-adj-unbestimmt-s05
> text: Das Zimmer ist dunkel, aber gemütlich.
> ipa: /das ˈtsɪmɐ ɪst ˈdʊŋkl̩ ˈaːbɐ ɡəˈmyːtlɪç/
> tip: dunkel — два склади, друге зредуковане. gemütlich: довге ü і [ç] у кінці.
> uk: Кімната темна, але затишна.

## Типові помилки українців

> [!pitfall] «Ein neue Tisch» — закінчення, як після der
> Після *der* прикметник «спокійний» (**-e / -en**), а після *ein* у чоловічому й середньому роді він мусить бути «гучним»: ~~ein neue Tisch~~ → *ein neuer Tisch*; ~~ein neue Auto~~ → *ein neues Auto*. Це найчастіша помилка після теми A2-15: перевір, чи в *ein* є закінчення. Немає — додай його до прикметника.

> [!pitfall] Прикметник без закінчення перед іменником
> Після *sein* прикметник нерухомий (*Das Brot ist frisch*), але перед іменником йому потрібне закінчення: ~~frisch Brot~~ → *frisches Brot*, ~~ein neu Auto~~ → *ein neues Auto*. Українською ми теж змінюємо прикметник («свіжий хліб»), тож варто керуватися цією ж логікою.

> [!pitfall] «Mit kalten Wasser» — давальний без артикля
> Без артикля в давальному прикметник бере сильне закінчення: ч. і с. — **-em**, ж. — **-er**: ~~mit kalten Wasser~~ → *mit kaltem Wasser*; ~~mit frische Milch~~ → *mit frischer Milch*. Лише в множині — **-en**: *mit frischen Brötchen*.

> [!pitfall] «Ein teueres Auto» і «ein dunkeles Zimmer»
> У *teuer, dunkel* перед закінченням випадає е: *ein **teures** Auto*, *ein **dunkles** Zimmer*, а не ~~teueres~~, ~~dunkeles~~. *hoch* перед закінченням стає *hoh-*: *ein hohes Haus*.

## Практика

> [!quiz] Заповни прикметник у потрібній формі
> level: A2 · type: fill · id: de-a2-adj-unbestimmt-q02
>
> ```text fill
> Das ist ein (neu) [[neuer]] Computer.
> Sie kauft ein (groß) [[großes]] Fahrrad.
> Er hat eine (klein) [[kleine]] Wohnung.
> Wir haben keine (gut) [[guten]] Nachrichten.
> ```
>
> **Пояснення:** *der Computer* → *ein neuer*; *das Fahrrad* → *ein großes*; *die Wohnung* → *eine kleine*; після *keine* у множині — *-en*.

> [!quiz] Заповни прикметник у потрібній формі: знахідний і давальний
> level: A2 · type: fill · id: de-a2-adj-unbestimmt-q03
>
> ```text fill
> Ich suche einen (bequem) [[bequemen]] Stuhl.
> Wir wohnen in einem (ruhig) [[ruhigen]] Dorf.
> Sie fährt mit einer (alt) [[alten]] Straßenbahn.
> Er hat keinen (neu) [[neuen]] Mantel.
> ```
>
> **Пояснення:** *einen Stuhl* (Akk ч.) → *-en*; *einem Dorf* (Dat с.) → *-en*; *einer Straßenbahn* (Dat ж.) → *-en*; *keinen Mantel* (Akk ч.) → *-en*.

> [!quiz] Заповни прикметник без артикля
> level: A2 · type: fill · id: de-a2-adj-unbestimmt-q04
>
> ```text fill
> Wir kaufen (frisch) [[frisches]] Brot.
> Ich trinke gern (kalt) [[kalten]] Tee.
> Gibst du mir (heiß) [[heißen]] Kaffee?
> Die Kinder essen (frisch) [[frische]] Brötchen.
> ```
>
> **Пояснення:** *das Brot* → *-es*; *der Tee* (Akk) → *-en*; *der Kaffee* (Akk) → *-en*; множина *Brötchen* → *-e*.

> [!quiz] Заповни прикметник у давальному без артикля
> level: A2 · type: fill · id: de-a2-adj-unbestimmt-q05
>
> ```text fill
> Ich wasche mich mit (kalt) [[kaltem]] Wasser.
> Der Kuchen schmeckt mit (frisch) [[frischer]] Milch.
> Er wohnt mit (nett) [[netten]] Kollegen zusammen.
> Wir bezahlen mit (klein) [[kleinem]] Geld.
> ```
>
> **Пояснення:** *das Wasser* і *das Geld* (Dat с.) → *-em*; *die Milch* (Dat ж.) → *-er*; *Kollegen* (Dat мн.) → *-en*.

> [!quiz] Обери правильне закінчення: «Das ist ein ___ Hund.» (groß)
> level: A2 · type: single · id: de-a2-adj-unbestimmt-q06
> - [ ] große
> - [ ] großes
> - [x] großer
> - [ ] großen
>
> **Пояснення:** *der Hund* — чоловічий рід у називному; *ein* без закінчення, тож прикметник бере **-er**: *ein großer Hund*.

> [!quiz] Обери правильне закінчення: «Ich habe eine ___ Idee.» (gut)
> level: A2 · type: single · id: de-a2-adj-unbestimmt-q07
> - [x] gute
> - [ ] guter
> - [ ] gutes
> - [ ] guten
>
> **Пояснення:** *die Idee* — жіночий рід, після *eine* — **-e**: *eine gute Idee*.

> [!quiz] Обери правильне закінчення: «Ich möchte ___ Kaffee.» (heiß)
> level: A2 · type: single · id: de-a2-adj-unbestimmt-q08
> - [ ] heißer
> - [x] heißen
> - [ ] heißes
> - [ ] heiße
>
> **Пояснення:** *der Kaffee* у знахідному без артикля — **-en**: *heißen Kaffee*. Форма *heißer* — називний; тут її помилково вживають за аналогією з *ein heißer Kaffee*.

> [!quiz] Обери правильне закінчення: «Sie trinkt Tee mit ___ Milch.» (kalt)
> level: A2 · type: single · id: de-a2-adj-unbestimmt-q09
> - [ ] kalte
> - [x] kalter
> - [ ] kaltem
> - [ ] kalten
>
> **Пояснення:** *die Milch* — жіночий рід, давальний без артикля — **-er**: *mit kalter Milch*. *kaltem* — для ч. і с.

> [!quiz] Обери правильне закінчення: «Wir haben zwei ___ Hunde.» (groß)
> level: A2 · type: single · id: de-a2-adj-unbestimmt-q10
> - [ ] großen
> - [x] große
> - [ ] großer
> - [ ] großes
>
> **Пояснення:** після числівника — сильна відміна, у множині Nom/Akk — **-e**: *zwei große Hunde*.

> [!quiz] Обери правильну форму: «Das ist ein ___ Zimmer.» (dunkel)
> level: A2 · type: single · id: de-a2-adj-unbestimmt-q11
> - [ ] dunkeles
> - [x] dunkles
> - [ ] dunkelnes
> - [ ] dunkelles
>
> **Пояснення:** у *dunkel* перед закінченням випадає **-e-**: *dunkles Zimmer*. Це середній рід, **-es**.

> [!quiz] Чому кажемо «ein neuer Tisch», а не «ein neue Tisch»?
> level: A2 · type: single · id: de-a2-adj-unbestimmt-q12
> - [ ] Тому що Tisch закінчується на -sch.
> - [x] Тому що в ein немає закінчення, і рід показує прикметник.
> - [ ] Тому що називний відмінок завжди -er.
> - [ ] Тому що Tisch — у множині.
>
> **Пояснення:** *ein* без закінчення перед чоловічим і середнім родом у називному не показує рід, тому прикметник бере **-er** (ч.) або **-es** (с.). Для жіночого *eine neue Tasche* — закінчення в *eine* вже є.

> [!quiz] У яких реченнях прикметник має закінчення -es? Обери всі правильні відповіді
> level: A2 · type: multi · id: de-a2-adj-unbestimmt-q13
> - [x] Das ist ein schönes Haus.
> - [x] Ich kaufe frisches Brot.
> - [ ] Sie hat eine schöne Jacke.
> - [ ] Wir kaufen frische Brötchen.
> - [x] Wir haben kein großes Wohnzimmer.
>
> **Пояснення:** *-es* — для середнього роду в називному й знахідному: *Haus, Brot, Wohnzimmer*. *die Jacke* — жіночий (**-e**), *Brötchen* — множина (**-e**).

> [!quiz] Обери всі правильні речення
> level: A2 · type: multi · id: de-a2-adj-unbestimmt-q14
> - [x] Ich trinke gern frischen Orangensaft.
> - [x] Er wohnt in einer kleinen Wohnung.
> - [ ] Wir fahren mit ein neuen Auto.
> - [ ] Sie hat ein neue Handy.
> - [x] Das Brot ist frisch.
>
> **Пояснення:** *mit einem neuen Auto* — давальний, потрібне *einem*. *ein neues Handy* — середній рід, не *neue*. Після *sein* прикметник без закінчення: *Das Brot ist frisch*.

> [!quiz] Склади речення, почни зі слова Ich: «У мене нова робота»
> level: A2 · type: order · id: de-a2-adj-unbestimmt-q15
>
> ```text order
> Ich
> habe
> einen
> neuen
> Job.
> neuer ✗
> ```
>
> **Пояснення:** *der Job* — чоловічий рід, після *haben* знахідний: *einen neuen Job*. Форма *neuer* — називний, помилка тут типова.

> [!quiz] Склади речення, почни зі слова Wir: «Ми купуємо свіжий хліб»
> level: A2 · type: order · id: de-a2-adj-unbestimmt-q16
>
> ```text order
> Wir
> kaufen
> frisches
> Brot.
> frische ✗
> ```
>
> **Пояснення:** *das Brot* без артикля — **-es**. Форма *frische* належить жіночому роду й множині.

> [!quiz] Склади речення, почни зі слова Das: «Це зручне крісло»
> level: A2 · type: order · id: de-a2-adj-unbestimmt-q17
>
> ```text order
> Das
> ist
> ein
> bequemer
> Sessel.
> bequem ✗
> ```
>
> **Пояснення:** *der Sessel* — чоловічий рід; після *ein* — **-er**. Без закінчення (*bequem*) прикметник стоїть лише після *sein*.

> [!quiz] Склади речення, почни зі слова Sie: «Вона живе в сучасній квартирі»
> level: A2 · type: order · id: de-a2-adj-unbestimmt-q18
>
> ```text order
> Sie
> wohnt
> in
> einer
> modernen
> Wohnung.
> moderne ✗
> ```
>
> **Пояснення:** *in* + *wo?* → давальний: *in einer modernen Wohnung*. Жіночий рід у давальному — **-en**.

## Фішки

> [!reel] 🔁 Закінчення прикметника — це клонований артикль
> Сильні закінчення прикметника майже збігаються з артиклем *der / die / das*: *-er, -e, -es, -en, -em*. Ці закінчення мають спільне походження з займенниковими формами. Тому «без артикля» прикметник бере на себе роль артикля.

> [!reel] 🇺🇦 Ти вже це вмієш
> В українській «новий стіл, нова сумка, нове авто» змінюється за родом і відмінком — так само, як німецький прикметник. Німецька лише додає одну деталь: закінчення залежить і від артикля перед ним. Якщо в ein «німе» закінчення, прикметник перебирає його сигнал.

> [!reel] 👋 «Guten Tag!» — це скорочення
> *Guten Tag, Gute Nacht, Guten Appetit* — це скорочені побажання: «[Ich wünsche dir einen] guten Tag». Тому *Tag* у знахідному, і прикметник має **-en**; а *die Nacht* — жіночий, тож *Gute Nacht*. А новорічне *Ein gutes neues Jahr!* — середній рід: два прикметники, обидва з -es.

## Джерела та що почитати

- [DWDS — frisch](https://www.dwds.de/wb/frisch): значення, вимова, приклади.
- [DWDS — dunkel](https://www.dwds.de/wb/dunkel): значення й форми з випаданням е.
- [Duden — teuer](https://www.duden.de/rechtschreibung/teuer): правопис і відмінкові форми (teure, teures).
- [DWDS — gemütlich](https://www.dwds.de/wb/gem%C3%BCtlich): значення слова, яке не має точного відповідника в багатьох мовах.
- [DW — Nicos Weg (A2)](https://learngerman.dw.com/uk/nicos-weg/c-36519789): безкоштовний відеокурс Deutsche Welle, граматика прикметників у діалогах.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділ про відмінювання прикметників.

> [!important] Підсумок
> - Прикметник перед іменником має закінчення; після *sein* — без закінчення.
> - Після *ein / kein / mein…*: **-er** (Nom ч.), **-es** (Nom / Akk с.), **-e** (ж. Nom / Akk), скрізь інде **-en**.
> - Без артикля: **-er, -e, -es, -en, -em** — майже як *der, die, das, den, dem*; жіночий давальний — **-er**; давальний множини — **-en**.
> - *teuer → teures*, *dunkel → dunkles*, *hoch → hohes*.
> - Мішана відміна: ein neu**er** Tisch, ein neu**es** Auto, eine neu**e** Tasche.
