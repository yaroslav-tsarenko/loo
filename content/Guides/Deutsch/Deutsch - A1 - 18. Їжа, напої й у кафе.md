---
title: Їжа, напої й у кафе
id: de-a1-essen
level: A1
icon: px:heart
tags: [deutsch, a1, vocabulary, essen, cafe]
prerequisites: ["[[Deutsch - A1 - 11. haben, знахідний відмінок і kein]]"]
estimatedMinutes: 40
---

# Їжа, напої й у кафе

> [!success] Після цієї теми ти зможеш
> - назвати основні продукти, страви й напої **з артиклем і множиною** (*der Käse, die Suppe, das Brot*);
> - ввічливо замовити в кафе: **Ich hätte gern einen Kaffee** / **Ich nehme die Suppe**;
> - попросити рахунок і відповісти на *Zusammen oder getrennt?*;
> - розуміти, що таке *Trinkgeld* і як його дають;
> - упізнавати австрійські слова (*Paradeiser, Erdäpfel, Semmel*) і не плутати їх з німецькими.

## Передбач

> [!quiz] Ти в кафе й хочеш каву. Як ввічливо сказати офіціантові?
> level: A1 · type: single · id: de-a1-essen-q01
> - [ ] Ich will Kaffee.
> - [x] Ich hätte gern einen Kaffee.
> - [ ] Gib mir Kaffee.
> - [ ] Ich habe einen Kaffee.
>
> **Пояснення:** *Ich hätte gern …* — найпоширеніший ввічливий спосіб замовити («я б хотів(ла) …»). *Ich will* звучить як вимога, *Gib mir* — як наказ, а *Ich habe einen Kaffee* означає «у мене є кава». Після *hätte gern* іменник стоїть у знахідному відмінку: der Kaffee → **einen** Kaffee.

## Пояснення

### Три прийоми їжі

| Німецькою | Українською | Коли | Що їдять |
|---|---|---|---|
| **das Frühstück** | сніданок | вранці | Brötchen, Brot з Butter, Käse, Wurst, Ei, Marmelade, Kaffee або Tee |
| **das Mittagessen** | обід | близько полудня | у Німеччині традиційно гарячий: Fleisch, Fisch, Suppe, Nudeln, Reis, Salat |
| **das Abendessen** | вечеря | ввечері | часто холодне: Brot, Käse, Wurst — на півночі це **Abendbrot** |

Між обідом і вечерею в Німеччині є ще *Kaffee und Kuchen* — кава з пирогом під вечір, особливо в неділю.

### Продукти: усе з артиклем

Рід продукту не вгадаєш за значенням, тож вчимо слово разом з артиклем (див. [[Deutsch - A1 - 06. Артикль і рід — der, die, das, ein, eine]]). Частина слів вживається без множини: *das Obst, das Fleisch, die Milch, der Reis* — так і зазначено в картках нижче.

| der · ч. | die · ж. | das · с. |
|---|---|---|
| der Käse, der Fisch, der Salat, der Apfel, der Reis | die Wurst, die Suppe, die Milch, die Butter, die Tomate, die Kartoffel, die Pizza | das Brot, das Ei, das Fleisch, das Obst, das Gemüse, das Brötchen |

Напої: **der** Kaffee, **der** Tee, **der** Saft, **der** Wein, **das** Bier, **das** Wasser, **die** Cola.

### Як замовити: hätte gern і nehme

Дві формули, яких на A1 цілком досить:

| Формула | Приклад | Значення |
|---|---|---|
| **Ich hätte gern** + знахідний | Ich hätte gern einen Tee. | Я б хотів чаю (ввічливо) |
| **Ich nehme** + знахідний | Ich nehme die Suppe. | Беру суп (коли вже вирішив) |
| **Einen** Kaffee, **bitte**. | Einen Kaffee, bitte. | Каву, будь ласка (швидко й ввічливо) |

Знахідний відмінок змінює лише **чоловічий рід**: *der Kaffee → einen / den Kaffee*. Жіночий і середній лишаються як були: *eine Suppe, ein Wasser, die Suppe, das Wasser* ([[Deutsch - A1 - 11. haben, знахідний відмінок і kein]]).

> [!diagram] Знахідний у замовленні: змінюється лише der
> ```yaml
> layout: compare
> columns: { m: "der · ч.", f: "die · ж.", n: "das · с." }
> nodes:
>   - { id: m1, col: m, label: "der · ч.", text: "der Kaffee", note: "називний: Der Kaffee ist heiß.", tone: blue }
>   - { id: m2, col: m, label: "der · ч. → Akk", text: "einen / den Kaffee", note: "Ich hätte gern einen Kaffee.", tone: blue }
>   - { id: f1, col: f, label: "die · ж.", text: "eine / die Suppe", note: "Ich hätte gern eine Suppe. — без змін", tone: red }
>   - { id: n1, col: n, label: "das · с.", text: "ein / das Wasser", note: "Ich hätte gern ein Wasser. — без змін", tone: green }
> steps:
>   - { focus: [m1], note: "Підмет: der Kaffee. Саме так слово стоїть у словнику." }
>   - { focus: [m2], note: "Після hätte gern і nehme — знахідний. Чоловічий рід змінюється: der → den, ein → einen." }
>   - { focus: [f1, n1], note: "Жіночий і середній рід у знахідному такі самі, як у називному: eine Suppe, ein Wasser." }
> ```
> Сині блоки — чоловічий рід, червоні — жіночий, зелені — середній; мітка роду є в кожному блоці.

### Склянки, чашки, пляшки: без артикля після міри

Кількість називаємо словом-мірою, а наступний іменник стоїть **без артикля**: *ein Glas Wasser, eine Tasse Tee, eine Flasche Bier*. Українське «склянка води» — так само.

### Від столу до рахунку: послідовність у кафе

> [!diagram] Візит у кафе: пʼять кроків
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "1. Місце", text: "Ein Tisch für zwei, bitte.", note: "столик для двох", tone: yellow }
>   - { id: b, label: "2. Меню", text: "die Speisekarte", note: "Entschuldigung, die Speisekarte, bitte!", tone: pink }
>   - { id: c, label: "3. Замовлення", text: "Ich hätte gern … / Ich nehme …", note: "що замовляємо", tone: yellow }
>   - { id: d, label: "4. Їмо", text: "Guten Appetit!", note: "Danke, gleichfalls!", tone: gray }
>   - { id: e, label: "5. Рахунок", text: "Zahlen, bitte!", note: "Zusammen oder getrennt?", tone: pink }
> edges:
>   - { from: a, to: b, label: "потім" }
>   - { from: b, to: c, label: "потім" }
>   - { from: c, to: d, label: "потім" }
>   - { from: d, to: e, label: "потім" }
> steps:
>   - { focus: a, note: "Часто можна самому обрати вільний стіл, а в солідному ресторані на вас чекають біля входу." }
>   - { focus: b, note: "Меню — die Speisekarte. Слово das Menü означає не меню, а комплексний обід за фіксованою ціною." }
>   - { focus: c, note: "Замовляємо: Ich hätte gern … або Ich nehme … Не кричи «Kellner!» — підійди поглядом або скажи Entschuldigung!" }
>   - { focus: d, note: "Guten Appetit! — побажання перед їжею. Відповідь: Danke, gleichfalls! (Дякую, і вам того ж.)" }
>   - { focus: e, note: "Зазвичай гості кажуть Zahlen, bitte! Офіціант питає: Zusammen oder getrennt? — разом чи окремо." }
> ```

### Рахунок і чайові

- **Zahlen, bitte!** (також *Die Rechnung, bitte!*) — просимо рахунок. В Австрії скажуть так само.
- **Zusammen oder getrennt?** — разом чи окремо? Відповідь: *Zusammen, bitte* / *Getrennt, bitte*.
- **Das macht 7,50 Euro** (sieben Euro fünfzig) — «з вас 7,50».
- **Stimmt so.** — «решти не треба» (чайові).

### Німеччина, Австрія, Швейцарія: різні слова для одного

> [!diagram] Одна страва, три назви
> ```yaml
> layout: compare
> columns: { de: "DE · Німеччина", at: "AT · Австрія", ch: "CH · Швейцарія" }
> nodes:
>   - { id: d1, col: de, label: "томат", text: "die Tomate", note: "стандарт", tone: yellow }
>   - { id: d2, col: de, label: "картопля", text: "die Kartoffel", note: "стандарт", tone: yellow }
>   - { id: d3, col: de, label: "булочка", text: "das Brötchen", note: "також Schrippe, Semmel (на півдні)", tone: yellow }
>   - { id: a1, col: at, label: "томат", text: "der Paradeiser", note: "також die Tomate", tone: pink }
>   - { id: a2, col: at, label: "картопля", text: "der Erdapfel", note: "мн. die Erdäpfel", tone: pink }
>   - { id: a3, col: at, label: "булочка", text: "die Semmel", note: "найпоширеніше слово", tone: pink }
>   - { id: c1, col: ch, label: "томат", text: "die Tomate", note: "як у Німеччині", tone: gray }
>   - { id: c2, col: ch, label: "картопля", text: "die Kartoffel", note: "розмовно: Härdöpfel", tone: gray }
>   - { id: c3, col: ch, label: "булочка", text: "das Brötli", note: "також Weggli, Semmeli", tone: gray }
> steps:
>   - { focus: [d1, d2, d3], note: "Німеччина: Tomate, Kartoffel, Brötchen. Це стандарт, його вчимо першим." }
>   - { focus: [a1, a2, a3], note: "Австрія: Paradeiser, Erdäpfel, Semmel. Слова зрозумілі й у Німеччині, але звучать по-австрійськи." }
>   - { focus: [c1, c2, c3], note: "Швейцарія: Tomate і Kartoffel такі самі, а булочка — das Brötli; у розмові діалектні слова." }
> ```
> Жовті блоки — Німеччина (DE), рожеві — Австрія (AT), сірі — Швейцарія (CH); мітка країни є в кожній колонці.

## Приклади

- *Zum Frühstück esse ich ein Brötchen mit Käse.* — На сніданок я їм булочку із сиром.
- *Ich hätte gern einen Kaffee und ein Stück Kuchen.* — Я б хотів кави й шматок пирога.
- *Ich nehme die Suppe und den Salat.* — Беру суп і салат.
- *Ein Glas Wasser, bitte.* — Склянку води, будь ласка.
- *Das Mittagessen ist um zwölf Uhr.* — Обід о дванадцятій.
- *Der Kaffee ist sehr lecker.* — Кава дуже смачна.
- *Ich habe Hunger und Durst.* — Я голодний і хочу пити.
- *Entschuldigung, die Speisekarte, bitte!* — Перепрошую, меню, будь ласка!
- *Zahlen, bitte! — Zusammen oder getrennt?* — Рахунок, будь ласка! — Разом чи окремо?
- *Das macht sieben Euro fünfzig. — Acht Euro, stimmt so.* — З вас сім пʼятдесят. — Вісім євро, решти не треба.
- *Guten Appetit! — Danke, gleichfalls!* — Смачного! — Дякую, і вам також!

## Слова

### Прийоми їжі

> [!word] das Frühstück
> ipa: /ˈfʁyːʃtʏk/ · pos: noun · level: A1 · id: de-a1-essen-w01
> uk: сніданок
> forms: die Frühstücke
> example: Das **Frühstück** ist von sieben bis zehn Uhr. — Сніданок з сьомої до десятої.
> note: CH розм. Zmorge. Дієслово: frühstücken («снідати»). ü — [yː], губи округлені.

> [!word] das Mittagessen
> ipa: /ˈmɪtaːkˌɛsn̩/ · pos: noun · level: A1 · id: de-a1-essen-w02
> uk: обід
> forms: die Mittagessen
> example: Zum **Mittagessen** gibt es Suppe. — На обід є суп.
> note: від der Mittag («полудень») + das Essen.  CH розм. Zmittag.

> [!word] das Abendessen
> ipa: /ˈaːbn̩tˌɛsn̩/ · pos: noun · level: A1 · id: de-a1-essen-w03
> uk: вечеря
> forms: die Abendessen
> example: Das **Abendessen** ist um sechs Uhr. — Вечеря о шостій.
> note: на півночі Німеччини частіше das Abendbrot (холодна вечеря з хлібом). CH розм. Znacht.

### Хліб, молочне, мʼясо, риба

> [!word] das Brot
> ipa: /bʁoːt/ · pos: noun · level: A1 · id: de-a1-essen-w04
> uk: хліб
> forms: die Brote
> example: Ich kaufe ein **Brot** und Butter. — Я купую хліб і масло.
> note: d у кінці — [t]. Das Brot — і буханка, і сорт: Roggenbrot, Vollkornbrot. Зменшувальне das Brötchen — булочка.

> [!word] die Butter
> ipa: /ˈbʊtɐ/ · pos: noun · level: A1 · id: de-a1-essen-w05
> uk: масло (вершкове)
> forms: — (без множини)
> example: Ich esse Brot mit **Butter**. — Я хочу хліб з маслом.
> note: рід укр. «масло» — середній, нім. die Butter — жіночий. Кінцеве -er звучить [ɐ].

> [!word] der Käse
> ipa: /ˈkɛːzə/ · pos: noun · level: A1 · id: de-a1-essen-w06
> uk: сир
> forms: die Käse
> example: Der **Käse** ist sehr lecker. — Сир дуже смачний.
> note: слово на -e, але чоловічого роду (виняток). Кисломолочний сир (творог) — der Quark. Укр. «сир» — це der Käse. ä довге — [ɛː].

> [!word] die Wurst
> ipa: /vʊʁst/ · pos: noun · level: A1 · id: de-a1-essen-w07
> uk: ковбаса
> forms: die Würste
> example: Zum Frühstück esse ich Brot mit **Wurst**. — На сніданок я їм хліб з ковбасою.
> note: w = [v]. Множина з умлаутом: Würste. Типова німецька: Bratwurst, Currywurst.

> [!word] das Ei
> ipa: /aɪ̯/ · pos: noun · level: A1 · id: de-a1-essen-w08
> uk: яйце
> forms: die Eier
> example: Ich esse zum Frühstück ein **Ei**. — На сніданок я їм яйце.
> note: виняток серед слів на -ei: das Ei (с.), тоді як die Bäckerei, die Polizei — ж. Не плутай з ie [iː].

> [!word] das Fleisch
> ipa: /flaɪ̯ʃ/ · pos: noun · level: A1 · id: de-a1-essen-w09
> uk: мʼясо
> forms: — (без множини)
> example: Ich esse kein **Fleisch**. — Я не їм мʼяса.
> note: ei = [aɪ̯], sch = [ʃ]. Вегетаріанець — der Vegetarier, вегетаріанка — die Vegetarierin.

> [!word] der Fisch
> ipa: /fɪʃ/ · pos: noun · level: A1 · id: de-a1-essen-w10
> uk: риба
> forms: die Fische
> example: Zum Mittagessen gibt es **Fisch** mit Reis. — На обід є риба з рисом.
> note: укр. «риба» — жіночого роду, нім. der Fisch — чоловічого. Знахідний: den Fisch.

### Овочі, фрукти, гарнір

> [!word] das Gemüse
> ipa: /ɡəˈmyːzə/ · pos: noun · level: A1 · id: de-a1-essen-w11
> uk: овочі (збірно)
> forms: — (без множини)
> example: Ich esse viel **Gemüse**. — Я їм багато овочів.
> note: збірне слово, в однині: das Gemüse ist frisch («овочі свіжі»). Слово на -e, але середнього роду: префікс Ge- часто дає das (das Gemüse, das Geschirr), хоч не завжди (der Gebrauch).

> [!word] das Obst
> ipa: /oːpst/ · pos: noun · level: A1 · id: de-a1-essen-w12
> uk: фрукти (збірно)
> forms: — (без множини)
> example: **Obst** ist gesund. — Фрукти корисні.
> note: збірне слово, не має множини: ein Stück Obst («один фрукт»). Сполучення bst читається [pst].

> [!word] der Apfel
> ipa: /ˈapfl̩/ · pos: noun · level: A1 · id: de-a1-essen-w13
> uk: яблуко
> forms: die Äpfel
> example: Der **Apfel** ist rot und süß. — Яблуко червоне й солодке.
> note: укр. «яблуко» — середнього роду, нім. der Apfel — чоловічого. pf — одне ціле [pf]; множина з умлаутом.

> [!word] die Tomate
> ipa: /toˈmaːtə/ · pos: noun · level: A1 · id: de-a1-essen-w14
> uk: помідор; томат
> forms: die Tomaten
> example: Der Salat hat Gurke und **Tomate**. — У салаті огірок і помідор.
> note: AT der Paradeiser (мн. die Paradeiser); CH die Tomate. Наголос на -ma-.

> [!word] die Kartoffel
> ipa: /kaʁˈtɔfl̩/ · pos: noun · level: A1 · id: de-a1-essen-w15
> uk: картопля
> forms: die Kartoffeln
> example: Zum Fisch esse ich **Kartoffeln**. — До риби я їм картоплю.
> note: AT der Erdapfel (мн. die Erdäpfel); CH розм. Härdöpfel. Наголос на другому складі.

> [!word] der Reis
> ipa: /ʁaɪ̯s/ · pos: noun · level: A1 · id: de-a1-essen-w16
> uk: рис
> forms: — (без множини)
> example: Ich esse Fleisch mit **Reis**. — Я їм мʼясо з рисом.
> note: ei = [aɪ̯]. Не плутай: der Reis (рис) і die Reise (подорож).

> [!word] die Nudel
> ipa: /ˈnuːdl̩/ · pos: noun · level: A1 · id: de-a1-essen-w17
> uk: макарони; локшина
> forms: die Nudeln
> example: Heute gibt es **Nudeln** mit Tomatensoße. — Сьогодні макарони з томатним соусом.
> note: майже завжди у множині: die Nudeln. u довге — [uː].

### Страви

> [!word] die Suppe
> ipa: /ˈzʊpə/ · pos: noun · level: A1 · id: de-a1-essen-w18
> uk: суп
> forms: die Suppen
> example: Die **Suppe** ist heiß. — Суп гарячий.
> note: укр. «суп» — чоловічого роду, нім. die Suppe — жіночого. s перед голосним — дзвінке [z].

> [!word] der Salat
> ipa: /zaˈlaːt/ · pos: noun · level: A1 · id: de-a1-essen-w19
> uk: салат
> forms: die Salate
> example: Ich nehme den **Salat** mit Tomaten. — Беру салат з помідорами.
> note: і страва, і салат-латук. Наголос на другому складі. Знахідний: den Salat.

> [!word] die Pizza
> ipa: /ˈpɪtsa/ · pos: noun · level: A1 · id: de-a1-essen-w20
> uk: піца
> forms: die Pizzas / Pizzen
> example: Ich hätte gern eine **Pizza** mit Käse. — Я б хотів піцу із сиром.
> note: zz читається як [ts], не [dz]. Множина — Pizzas або Pizzen, обидві форми правильні.

### Напої

> [!word] die Milch
> ipa: /mɪlç/ · pos: noun · level: A1 · id: de-a1-essen-w21
> uk: молоко
> forms: — (без множини)
> example: Ich trinke Kaffee mit **Milch**. — Я пʼю каву з молоком.
> note: укр. «молоко» — середнього роду, нім. die Milch — жіночого. ch після l — мʼяке [ç].

> [!word] das Wasser
> ipa: /ˈvasɐ/ · pos: noun · level: A1 · id: de-a1-essen-w22
> uk: вода
> forms: — (без множини)
> example: Ein **Wasser**, bitte! — Воду, будь ласка!
> note: укр. «вода» — жіночого роду, нім. das Wasser — середнього. Мінеральна — das Mineralwasser. w = [v].

> [!word] der Saft
> ipa: /zaft/ · pos: noun · level: A1 · id: de-a1-essen-w23
> uk: сік
> forms: die Säfte
> example: Ich hätte gern einen **Saft**. — Я б хотів соку.
> note: der Orangensaft — апельсиновий сік. Множина з умлаутом: Säfte. Знахідний: einen Saft.

> [!word] der Tee
> ipa: /teː/ · pos: noun · level: A1 · id: de-a1-essen-w24
> uk: чай
> forms: die Tees
> example: Ich trinke gern **Tee**. — Я люблю пити чай.
> note: ee = довге [eː]. Знахідний: einen Tee. Не плутай з der See (озеро) і die See (море).

> [!word] der Kaffee
> ipa: /ˈkafe/ · pos: noun · level: A1 · id: de-a1-essen-w25
> uk: кава
> forms: die Kaffees
> example: Ich trinke jeden Morgen **Kaffee**. — Щоранку я пʼю каву.
> note: AT, CH наголос на кінці: [kaˈfeː]. Укр. «кава» — жіночого роду, нім. der Kaffee — чоловічого. Знахідний: einen Kaffee.

> [!word] das Bier
> ipa: /biːɐ̯/ · pos: noun · level: A1 · id: de-a1-essen-w26
> uk: пиво
> forms: die Biere
> example: Ein **Bier**, bitte! — Пиво, будь ласка!
> note: ie = довге [iː]. Мінімальна пара: Bier [biːɐ̯] і Bär [bɛːɐ̯] («ведмідь»).

> [!word] der Wein
> ipa: /vaɪ̯n/ · pos: noun · level: A1 · id: de-a1-essen-w27
> uk: вино
> forms: die Weine
> example: Ein Glas **Wein**, bitte. — Келих вина, будь ласка.
> note: Wein [vaɪ̯n] ≠ Wien [viːn] (Відень). Усе, що повʼязане з вином: der Rotwein, der Weißwein.

### У кафе

> [!word] die Speisekarte
> ipa: /ˈʃpaɪ̯zəˌkaʁtə/ · pos: noun · level: A1 · id: de-a1-essen-w28
> uk: меню (перелік страв)
> forms: die Speisekarten
> example: Die **Speisekarte**, bitte! — Меню, будь ласка!
> note: das Menü = комплексний обід за фіксованою ціною, не меню. sp на початку слова — [ʃp]. CH також Menükarte.

> [!word] der Kellner
> ipa: /ˈkɛlnɐ/ · pos: noun · level: A1 · id: de-a1-essen-w29
> uk: офіціант
> forms: die Kellner
> example: Der **Kellner** bringt die Rechnung. — Офіціант приносить рахунок.
> note: жінка — die Kellnerin, множина die Kellnerinnen. Звертатися: Entschuldigung! (не «Herr Ober» — застаріло).

> [!word] die Rechnung
> ipa: /ˈʁɛçnʊŋ/ · pos: noun · level: A1 · id: de-a1-essen-w30
> uk: рахунок
> forms: die Rechnungen
> example: Die **Rechnung**, bitte! — Рахунок, будь ласка!
> note: -ung → die без винятків. Множина: die Rechnungen.

> [!word] das Trinkgeld
> ipa: /ˈtʁɪŋkˌɡɛlt/ · pos: noun · level: A2 · id: de-a1-essen-w31
> uk: чайові
> forms: die Trinkgelder
> example: **Trinkgeld** ist hier üblich. — Чайові тут звичні.
> note: буквально «гроші на випивку». Чайові не обовʼязкові, але звичні. Давати: Stimmt so.

> [!word] das Glas
> ipa: /ɡlaːs/ · pos: noun · level: A1 · id: de-a1-essen-w32
> uk: склянка; келих; скло
> forms: die Gläser
> example: Ein **Glas** Wasser, bitte. — Склянку води, будь ласка.
> note: після міри іменник без артикля: ein Glas Wasser. Множина з умлаутом: Gläser.

> [!word] die Tasse
> ipa: /ˈtasə/ · pos: noun · level: A1 · id: de-a1-essen-w33
> uk: чашка
> forms: die Tassen
> example: Eine **Tasse** Tee, bitte. — Чашку чаю, будь ласка.
> note: після міри іменник без артикля: eine Tasse Kaffee.

> [!word] die Flasche
> ipa: /ˈflaʃə/ · pos: noun · level: A1 · id: de-a1-essen-w34
> uk: пляшка
> forms: die Flaschen
> example: Eine **Flasche** Wasser, bitte. — Пляшку води, будь ласка.
> note: після міри іменник без артикля. Кінцеве -e — [ə].

> [!word] der Hunger
> ipa: /ˈhʊŋɐ/ · pos: noun · level: A1 · id: de-a1-essen-w35
> uk: голод
> forms: — (без множини)
> example: Ich habe **Hunger**. — Я голодний.
> note: «Я голодний» = Ich habe Hunger (не ~~Ich bin Hunger~~). h — видих [h], не українське «г».

> [!word] der Durst
> ipa: /dʊʁst/ · pos: noun · level: A1 · id: de-a1-essen-w36
> uk: спрага
> forms: — (без множини)
> example: Ich habe **Durst**. — Я хочу пити.
> note: «Я хочу пити» = Ich habe Durst. Прикметник durstig майже не вживається.

### Дієслова

> [!word] bestellen
> ipa: /bəˈʃtɛlən/ · pos: verb · level: A1 · id: de-a1-essen-w37
> uk: замовляти
> forms: bestellen → bestellte → hat bestellt
> example: Wir **bestellen** zwei Kaffee. — Ми замовляємо дві кави.
> note: be- не відокремлюється: ich bestelle. Наголос на другому складі (bestéllen). Після нього — знахідний: einen Tee bestellen.

> [!word] bezahlen
> ipa: /bəˈtsaːlən/ · pos: verb · level: A1 · id: de-a1-essen-w38
> uk: платити
> forms: bezahlen → bezahlte → hat bezahlt
> example: Ich **bezahle** mit Karte. — Я плачу карткою.
> note: інше дієслово: zahlen («платити», розм. у кафе). Знахідний: die Rechnung bezahlen.

> [!word] trinken
> ipa: /ˈtʁɪŋkn̩/ · pos: verb · level: A1 · id: de-a1-essen-w39
> uk: пити
> forms: trinken → trank → hat getrunken
> example: Ich **trinke** gern Tee. — Я люблю пити чай.
> note: сильне дієслово: trinken – trank – getrunken. Знахідний: Was trinkst du?

### Оцінка й фрази

> [!word] lecker
> ipa: /ˈlɛkɐ/ · pos: adj · level: A1 · id: de-a1-essen-w40
> uk: смачний
> forms: lecker → leckerer → am leckersten
> example: Die Suppe ist **lecker**. — Суп смачний.
> note: AT частіше gut, fein або schmackhaft. Подвоєне ck — голосний короткий.

> [!word] Ich hätte gern …
> ipa: /ɪç ˈhɛtə ɡɛʁn/ · pos: phrase · level: A1 · id: de-a1-essen-w41
> uk: я б хотів (хотіла) …
> example: **Ich hätte gern** einen Tee. — Я б хотів чаю.
> note: ввічливе замовлення. Після нього — знахідний: einen Tee, eine Suppe, ein Wasser.

> [!word] Zahlen, bitte!
> ipa: /ˈtsaːlən ˈbɪtə/ · pos: phrase · level: A1 · id: de-a1-essen-w42
> uk: рахунок, будь ласка!
> example: **Zahlen, bitte!** — Рахунок, будь ласка!
> note: коротко й ввічливо; те саме: Die Rechnung, bitte! Звертаємося до офіціанта поглядом або словом Entschuldigung.

> [!word] Zusammen oder getrennt?
> ipa: /tsuˈzamən ˈoːdɐ ɡəˈtʁɛnt/ · pos: phrase · level: A1 · id: de-a1-essen-w43
> uk: разом чи окремо?
> example: **Zusammen oder getrennt?** — Zusammen, bitte. — Разом чи окремо? — Разом, будь ласка.
> note: питає офіціант, коли за столом кілька людей. Відповідь: Zusammen. / Getrennt.

> [!word] Guten Appetit!
> ipa: /ˈɡuːtn̩ apeˈtiːt/ · pos: phrase · level: A1 · id: de-a1-essen-w44
> uk: смачного!
> example: **Guten Appetit!** — Danke, gleichfalls! — Смачного! — Дякую, вам також!
> note: AT, CH теж Guten Appetit; на роботі опівдні: Mahlzeit! Наголос на кінці: Appetít.

> [!word] Stimmt so.
> ipa: /ʃtɪmt zoː/ · pos: phrase · level: A1 · id: de-a1-essen-w45
> uk: решти не треба
> example: Acht Euro, **stimmt so**. — Вісім євро, решти не треба.
> note: так дають чайові, коли віддають гроші: Stimmt so! Дослівно «так правильно». CH також Das stimmt so.

## Слухаємо

> [!listen] Що замовили?
> level: A1 · type: choice · speed: slow · id: de-a1-essen-l01
> audio: Ich hätte gern einen Käse.
> - [ ] Ich hätte gern einen Kaffee.
> - [x] Ich hätte gern einen Käse.
> - [ ] Ich hätte gern eine Käse.
>
> **Пояснення:** *Kaffee* і *Käse* звучать схоже, але *Käse* починається з довгого [kɛː], а *Kaffee* — з короткого [ka]. Після *hätte gern* для чоловічого роду — *einen*.

> [!listen] Яке питання ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-essen-l02
> audio: Zusammen oder getrennt?
> - [ ] Zum Mitnehmen oder hier?
> - [x] Zusammen oder getrennt?
> - [ ] Zahlen oder trinken?
>
> **Пояснення:** *zusammen* — разом, *getrennt* — окремо. Це питання офіціанта, коли ви платите.

> [!listen] Коли їдять?
> level: A1 · type: answer · speed: slow · id: de-a1-essen-l03
> audio: Das Frühstück ist um sieben Uhr und das Abendessen um sechs.
> - [x] Сніданок о сьомій, вечеря о шостій.
> - [ ] Обід о сьомій, вечеря о шостій.
> - [ ] Сніданок о шостій, вечеря о сьомій.
> - [ ] Сніданок о сьомій, обід о шостій.
>
> **Пояснення:** *Frühstück* — сніданок, *Abendessen* — вечеря, *um sieben Uhr* — о сьомій. Довге слово *Abendessen* складається з *Abend* + *Essen*.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-essen-l04
> audio: Ich nehme die Suppe und den Salat.
> explain: die Suppe (ж.) не змінюється, der Salat у знахідному — den Salat.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-essen-l05
> audio: Zahlen, bitte!

> [!listen] Послухай. Скільки гості заплатять разом із чайовими?
> level: A1 · type: answer · speed: slow · id: de-a1-essen-l06
> audio: A: Guten Tag! Was darf es sein?
> audio: B: Wir hätten gern zwei Kaffee und einen Kuchen.
> audio: A: Gern. Sonst noch etwas?
> audio: B: Nein, danke. Zahlen, bitte!
> audio: A: Zusammen oder getrennt?
> audio: B: Zusammen.
> audio: A: Das macht sieben Euro fünfzig.
> audio: B: Acht Euro, stimmt so.
> - [ ] 7,50 €
> - [x] 8 €
> - [ ] 8,50 €
> - [ ] 7 €
>
> **Пояснення:** рахунок — *sieben Euro fünfzig* (7,50), гості дають *acht Euro* (8 €) і кажуть *stimmt so* — решти не треба, тож 50 центів — чайові. Переклад: — Добрий день! Що бажаєте? — Нам дві кави й пиріг. — Охоче. Ще щось? — Ні, дякую. Рахунок, будь ласка! — Разом чи окремо? — Разом. — З вас 7,50. — Вісім євро, решти не треба.

## Вимова

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-essen-s01
> text: Ich hätte gern einen Kaffee.
> ipa: /ɪç ˈhɛtə ɡɛʁn ˈaɪ̯nən ˈkafe/
> tip: ich — [ç], мʼяке, як «хь»; hätte — [ɛ], короткий; r у gern — майже не чути, «гейрн» мʼяко.
> uk: Я б хотів кави.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-essen-s02
> text: Das Frühstück, das Mittagessen, das Abendessen.
> ipa: /das ˈfʁyːʃtʏk das ˈmɪtaːkˌɛsn̩ das ˈaːbn̩tˌɛsn̩/
> tip: ü у Frühstück — [yː], губи округлені, як для «у», язик як для «і»; sch — [ʃ]; Abend — d оглушується [t]: «абент».
> uk: Сніданок, обід, вечеря.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-essen-s03
> text: Der Käse, der Tee, das Bier.
> ipa: /deːɐ̯ ˈkɛːzə deːɐ̯ teː das biːɐ̯/
> tip: ä в Käse — довге [ɛː]; Tee — [eː]; Bier — [iː], потім слабке [ɐ̯].
> uk: Сир, чай, пиво.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-essen-s04
> text: Die Suppe und der Salat.
> ipa: /diː ˈzʊpə ʊnt deːɐ̯ zaˈlaːt/
> tip: s перед голосним — дзвінке [z], не «с»; Suppe — коротке [ʊ]; Salat — наголос на другому складі.
> uk: Суп і салат.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-essen-s05
> text: Ich habe Hunger und Durst.
> ipa: /ɪç ˈhaːbə ˈhʊŋɐ ʊnt dʊʁst/
> tip: h у habe й Hunger — легкий видих, не українське «г»; -ng — носове [ŋ], без «г» у кінці.
> uk: Я голодний і хочу пити.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-essen-s06
> text: Ein Glas Wasser und eine Tasse Tee, bitte.
> ipa: /aɪ̯n ɡlaːs ˈvasɐ ʊnt ˈaɪ̯nə ˈtasə teː ˈbɪtə/
> tip: w у Wasser — [v], як українське «в»; ei — [aɪ̯], «ай»; Tasse — коротке [a], подвоєне ss.
> uk: Склянку води й чашку чаю, будь ласка.

## Типові помилки українців

> [!pitfall] Замовлення наказом
> ~~Ich will Kaffee.~~ → Ich **hätte gern** einen Kaffee. ~~Gib mir einen Tee!~~ → **Einen** Tee, **bitte**. Прямі *ich will* і *gib mir* звучать як вимога й грубість.  Ввічливо: *Ich hätte gern …*, *Ich nehme …*, або просто *Einen Tee, bitte*.

> [!pitfall] Неправильний артикль у знахідному
> ~~Ich hätte gern ein Kaffee.~~ → Ich hätte gern **einen** Kaffee. ~~Ich nehme das Salat.~~ → Ich nehme **den** Salat. Після *hätte gern* і *nehme* іменник у знахідному відмінку, а **чоловічий рід** змінюється: der → **den**, ein → **einen**. Слова жіночого й середнього роду лишаються: *eine Suppe, ein Wasser*. Тому вчи рід разом зі словом: *der Kaffee, der Salat*.

> [!pitfall] Das Menü — не меню
> ~~Ich hätte gern das Menü.~~ — вийде, що ви замовляєте комплексний обід за фіксованою ціною. Меню, у якому ви обираєте страви, — **die Speisekarte**. Так само звертайся до офіціанта *Entschuldigung!*, а не *Kellner!* і не застарілим *Herr Ober!*.

> [!pitfall] «Я голодний» через sein
> ~~Ich bin Hunger.~~ → Ich **habe** Hunger. ~~Ich bin Durst.~~ → Ich **habe** Durst. В українській ми кажемо «Я голодний» (прикметник), а в німецькій *Hunger* і *Durst* — іменники, тому з *haben*. Для холоду й тепла конструкція інша: *Mir ist kalt* (див. [[Deutsch - A1 - 11. haben, знахідний відмінок і kein]]).

## Ситуація: у кафе

> [!listen] Двоє друзів у кафе. Що вони замовили і як платять?
> level: A1 · type: answer · speed: slow · id: de-a1-essen-l07
> audio: A: Guten Tag! Was darf es sein?
> audio: B: Wir nehmen die Suppe und den Salat. Und zwei Wasser, bitte.
> audio: A: Gern. Sonst noch etwas?
> audio: B: Nein, danke. Zahlen, bitte!
> audio: A: Zusammen oder getrennt?
> audio: B: Getrennt, bitte.
> - [x] суп, салат і дві води; платять окремо
> - [ ] суп, салат і дві води; платять разом
> - [ ] суп, салат і два чаї; платять окремо
> - [ ] два супи й салат; платять разом
>
> **Пояснення:** *Wir nehmen die Suppe und den Salat* — суп і салат, *zwei Wasser* — дві води, а на питання *Zusammen oder getrennt?* відповідь *Getrennt* — окремо. Переклад: — Добрий день! Що бажаєте? — Беремо суп і салат. І дві води, будь ласка. — Охоче. Ще щось? — Ні, дякую. Рахунок, будь ласка! — Разом чи окремо? — Окремо, будь ласка.

> [!speak] Ситуація: попроси рахунок
> level: A1 · speed: slow · id: de-a1-essen-s07
> text: Zahlen, bitte!
> ipa: /ˈtsaːlən ˈbɪtə/
> tip: z на початку слова — [ts], «ц»; a довге в Zahlen; bitte — коротке [ɪ].
> uk: Рахунок, будь ласка!

> [!speak] Ситуація: відповідай і залиш чайові
> level: A1 · speed: slow · id: de-a1-essen-s08
> text: Zusammen, bitte. Stimmt so!
> ipa: /tsuˈzamən ˈbɪtə ʃtɪmt zoː/
> tip: Zusammen — наголос на другому складі; st на початку слова — [ʃt], «шт»; so — довге [oː].
> uk: Разом, будь ласка. Решти не треба!

## Landeskunde: Restaurant und Trinkgeld

> [!example] Im Restaurant in Deutschland
> Im Restaurant sucht man oft selbst einen Tisch. Man ruft nicht „Kellner!“, sondern sagt „Entschuldigung!“. Am Ende bittet man um die Rechnung: „Zahlen, bitte!“ Der Kellner fragt: „Zusammen oder getrennt?“ Das Trinkgeld gibt man direkt beim Bezahlen. Die Rechnung hat 18,50 Euro. Man gibt 20 Euro und sagt „Stimmt so“. Trinkgeld ist nicht Pflicht, aber üblich.
>
> **Переклад:** У ресторані в Німеччині гість часто сам вибирає стіл. Офіціанта не кличуть «Kellner!», а кажуть «Перепрошую!». Наприкінці просять рахунок. Офіціант питає: разом чи окремо? Чайові дають одразу під час оплати: якщо рахунок 18,50 євро, віддають 20 і кажуть «Stimmt so». Чайові не обовʼязкові, але звичні.

> [!quiz] Рахунок 18,50 €, ти даєш 20 € і не хочеш решти. Що кажеш?
> level: A1 · type: single · id: de-a1-essen-q02
> - [ ] Das Wechselgeld ist für mich.
> - [x] Stimmt so.
> - [ ] Ich zahle zusammen.
> - [ ] Gib mir das Trinkgeld.
>
> **Пояснення:** *Stimmt so* — стандартний спосіб залишити чайові: віддаєш гроші й одразу кажеш цю фразу. Інші варіанти або не мають сенсу, або звучать грубо чи плутають роль (*Trinkgeld* — це те, що даєш ти, а не просиш).

> [!quiz] Коли в Німеччині зазвичай дають чайові?
> level: A1 · type: single · id: de-a1-essen-q03
> - [ ] Залишають монети на столі після виходу з ресторану.
> - [x] Під час оплати, коли віддають гроші офіціантові.
> - [ ] Лише тоді, коли в меню написано Trinkgeld.
> - [ ] Ніколи, чайові в Німеччині не дають.
>
> **Пояснення:** у німецькій практиці суму називають під час розрахунку (*Stimmt so* або *Machen Sie 20 Euro*). Залишати монети на столі, як у деяких країнах, не прийнято. Чайові необовʼязкові, але звичні.

## Практика

> [!quiz] Що питає офіціант: «Zusammen oder getrennt?»
> level: A1 · type: single · id: de-a1-essen-q04
> - [ ] Чи ви хочете кави з собою.
> - [x] Чи ви платите разом, чи кожен окремо.
> - [ ] Чи ви хочете замовити ще щось.
> - [ ] Чи ви платите готівкою чи карткою.
>
> **Пояснення:** *zusammen* — разом, *getrennt* — окремо. Питання лунить, коли за столом кілька людей і ви просите рахунок.

> [!quiz] Ich hätte gern ___ Kaffee.
> level: A1 · type: single · id: de-a1-essen-q05
> - [ ] ein
> - [x] einen
> - [ ] eine
> - [ ] einem
>
> **Пояснення:** *der Kaffee* — чоловічий рід, а після *hätte gern* стоїть знахідний, де *ein* змінюється на **einen**. *Eine* — для жіночого роду (*eine Suppe*).

> [!quiz] Які слова мають артикль die? Обери всі.
> level: A1 · type: multi · id: de-a1-essen-q06
> - [x] Suppe
> - [x] Milch
> - [ ] Käse
> - [x] Wurst
> - [ ] Brot
>
> **Пояснення:** *die Suppe, die Milch, die Wurst* — жіночого роду. ***Der*** *Käse* — чоловічого (виняток серед слів на -e), ***das*** *Brot* — середнього. Рід треба вчити разом зі словом.

> [!quiz] Які слова означають «помідор»? Обери всі.
> level: A1 · type: multi · id: de-a1-essen-q07
> - [x] die Tomate
> - [x] der Paradeiser
> - [ ] der Erdapfel
> - [ ] die Kartoffel
>
> **Пояснення:** *die Tomate* — загальне слово, *der Paradeiser* — австрійське. *Der Erdapfel* (AT) і *die Kartoffel* — це картопля, а не помідор.

> [!quiz] У Відні в кафе тобі пропонують Semmel. Що це?
> level: A1 · type: single · id: de-a1-essen-q08
> - [ ] пиріг
> - [x] булочка
> - [ ] суп
> - [ ] помідор
>
> **Пояснення:** *die Semmel* — австрійське (і баварське) слово для *das Brötchen*. *Der Kuchen* — пиріг.

> [!quiz] «Я хочу пити». Як правильно?
> level: A1 · type: single · id: de-a1-essen-q09
> - [ ] Ich bin Durst.
> - [x] Ich habe Durst.
> - [ ] Ich habe durstig.
> - [ ] Mir ist Durst.
>
> **Пояснення:** *Durst* (спрага) — іменник, а стан «мати спрагу» в німецькій передається через *haben*: *Ich habe Durst / Hunger*. З *sein* вийшло б «я — спрага».

> [!quiz] Заповни пропуски
> level: A1 · type: fill · bank: habe, bezahlen · id: de-a1-essen-q10
>
> ```text fill
> Ich [[hätte]] gern eine Suppe.
> Ich [[nehme]] den Salat.
> Wir [[bestellen]] zwei Kaffee.
> Zusammen oder [[getrennt]]?
> ```
>
> **Пояснення:** *Ich hätte gern …* і *Ich nehme …* — дві формули замовлення. *Bestellen* — «замовляти». *Getrennt* — «окремо». Дистрактор *bezahlen* — «платити» (інша дія), *habe* — «маю», не «хотів би».

> [!quiz] Артикль у знахідному
> level: A1 · type: fill · bank: einem, die · id: de-a1-essen-q11
>
> ```text fill
> Ich hätte gern [[einen]] Tee.
> Ich hätte gern [[eine]] Suppe.
> Ich hätte gern [[ein]] Brötchen.
> Ich nehme [[den]] Fisch.
> ```
>
> **Пояснення:** *der Tee → einen Tee*, *die Suppe → eine Suppe*, *das Brötchen → ein Brötchen*, *der Fisch → den Fisch*. Змінюється лише чоловічий рід.

> [!quiz] Склади речення: «Я б хотів каву, будь ласка.»
> level: A1 · type: order · id: de-a1-essen-q12
>
> ```text order
> Ich hätte gern
> einen Kaffee,
> bitte.
> ein Kaffee ✗
> ```
>
> **Пояснення:** формула *Ich hätte gern* + знахідний. Для *der Kaffee* знахідний — *einen Kaffee*; *ein Kaffee* — помилка.

> [!quiz] Склади речення: «Ми замовляємо дві кави й пиріг.»
> level: A1 · type: order · id: de-a1-essen-q13
>
> ```text order
> Wir bestellen
> zwei Kaffee
> und einen Kuchen.
> bestellt wir ✗
> ```
>
> **Пояснення:** *Wir bestellen* — форма дієслова для *wir* закінчується на *-en*. Пиріг у знахідному — *einen Kuchen* (der Kuchen).

## Фішки

> [!reel] 🥐 Булочка з сотнею імен
> *Brötchen* на півночі й у центрі, *Semmel* у Баварії та Австрії, *Schrippe* в Берліні, *Weck* на південному заході, *Rundstück* у Гамбурзі. Німці з різних регіонів можуть не зрозуміти одне одного в пекарні. У Швейцарії кажуть *Brötli* або *Weggli*.

> [!reel] 🕐 Frühstück — «ранній шматок»
> Слово *Frühstück* складається з *früh* («рано») і *Stück* («шматок»): колись це був шматок хліба, який їли вранці. Тому й донині *Stück* лишається в побуті: *ein Stück Kuchen*, *ein Stück Brot*.

> [!reel] 👋 Mahlzeit!
> Опівдні на німецькому робочому місці колеги вітаються «Mahlzeit!». Ймовірно, це скорочення від *Gesegnete Mahlzeit* («благословенна трапеза»). Відповідають тим самим словом. Це не побажання смачного саме тобі, а звичка привітатися об обідній порі.

## Джерела та що почитати

- [DWDS — Frühstück](https://www.dwds.de/wb/Fr%C3%BChst%C3%BCck): значення, походження слова, вимова.
- [DWDS — Speisekarte](https://www.dwds.de/wb/Speisekarte): рід, множина й значення.
- [Duden — Paradeiser](https://www.duden.de/rechtschreibung/Paradeiser): австрійське слово для помідора.
- [Duden — Trinkgeld](https://www.duden.de/rechtschreibung/Trinkgeld): значення слова й вживання.
- [Goethe-Institut — Wortliste Start Deutsch 1 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf): офіційний словник рівня A1.
- [DW — Nicos Weg (українською)](https://learngerman.dw.com/uk/nicos-weg/c-36519789): безкоштовний відеокурс A1–B1; у темах про їжу та покупки є діалоги в кафе.

> [!important] Підсумок
> - Три прийоми їжі: **das Frühstück, das Mittagessen, das Abendessen**. Вчи продукти з артиклем: **der** Käse, **die** Suppe, **das** Brot.
> - Замовлення: **Ich hätte gern** + знахідний (*einen Kaffee*), **Ich nehme** + знахідний (*den Salat*). Змінюється лише чоловічий рід.
> - Рахунок: **Zahlen, bitte!** — **Zusammen oder getrennt?** — **Stimmt so.** (чайові дають під час оплати).
> - **Ich habe Hunger / Durst** (з haben), **die Speisekarte** (не das Menü).
> - Австрія: *Paradeiser, Erdäpfel, Semmel*; Швейцарія: *Brötli*, у розмові діалекти.
