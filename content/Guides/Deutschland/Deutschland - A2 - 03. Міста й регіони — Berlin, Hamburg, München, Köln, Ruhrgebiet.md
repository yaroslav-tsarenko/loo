---
title: Міста й регіони — Berlin, Hamburg, München, Köln, Ruhrgebiet
id: dl-a2-03
level: A2
icon: px:map
tags: [deutsch, landeskunde, skills, a2, land, staedte, ruhrgebiet]
prerequisites: ["[[Deutschland - A2 - 02. 16 федеральних земель]]"]
estimatedMinutes: 40
---

# Міста й регіони — Berlin, Hamburg, München, Köln, Ruhrgebiet

> [!success] Після цього розділу ти зможеш
> - розповісти про чотири німецькі міста-мільйонники — Berlin, Hamburg, München, Köln — і назвати по одній «візитівці» кожного;
> - пояснити, що таке **Kiez** у Берліні й чому в Гамбурзі це слово означає інше;
> - розповісти, що таке Ruhrgebiet, чому його називають *Ruhrpott* і як він змінився від шахт до культури;
> - розрізняти *Dom* («собор»), *Zeche* («шахта») і *Hafen* («порт») і правильно вживати артикль: *in Köln*, але *im Ruhrgebiet*;
> - прочитати й зрозуміти короткий текст німецькою про німецькі міста.

## Передбач

> [!quiz] Що таке «Kiez» у Берліні?
> level: A2 · type: single · id: dl-a2-03-q01
> - [ ] Район, де працюють лише офіси.
> - [x] Невеликий район або «квартал» зі своїм життям: крамницями, кнайпами, сусідами.
> - [ ] Назва берлінського метро.
> - [ ] Вокзал на сході Берліна.
>
> **Пояснення:** за словником DWDS, *Kiez* — особливо в Берліні — невеликий, «оглядний» район, з якого мешканці себе ідентифікують; це не адміністративна одиниця. У Гамбурзі *der Kiez* означає район St. Pauli навколо Reeperbahn.

## Оповідь

### Берлін: столиця, що складається з «кіців»

Berlin — найбільше місто Німеччини: близько 3,7 мільйона жителів (Destatis, на основі Zensus 2022) на 891 км². Це одночасно столиця держави й місто-земля (*Stadtstaat*, див. попередній розділ). Берлінці люблять ділити своє місто на *Kieze*: кожен має власну вулицю з кафе й булочною, власну дитячу площадку й власних сусідів. Слово *Kiez* уперше засвідчене як назва поселення ще 1249 року; словʼянське походження вважають спірним (DWDS). Тож «Мій Kiez» — це не адреса, а відчуття дому.

### Гамбург: порт і купці

Hamburg — друге за величиною місто (близько 1,87 мільйона жителів, Destatis) і теж місто-земля. Місто побудоване навколо річки Elbe і її **Hafen** — найбільшого морського порту Німеччини (hamburg-tourism.de). Гамбурзька **Speicherstadt** (досл. «місто складів») — комплекс червоноцегляних складів, який будували з 1883 року; у липні 2015-го разом із кварталом Kontorhausviertel і будинком Chilehaus його внесли до Списку світової спадщини ЮНЕСКО (hamburg.de). Слово *Kiez* у Гамбурзі має зовсім інше значення, ніж у Берліні: це район St. Pauli з Reeperbahn (DWDS).

### Мюнхен: баварська столиця

München — столиця землі Bayern (див. розділ про землі) і одна з чотирьох німецьких *Millionenstädte* — міст із понад мільйоном жителів: Berlin, Hamburg, München і Köln (Destatis). Одна з головних площ міста — **Marienplatz** з ратушею (*das Rathaus*). Про Oktoberfest, найвідоміше свято Мюнхена, — у розділі про свята.

### Кельн: собор над Рейном

Köln лежить на Рейні й теж має понад мільйон жителів. Його візитівка — **der Kölner Dom**. Закладання першого каменя відбулося 15 серпня 1248 року, а урочисте завершення будівництва — 15 жовтня 1880 року, тобто через 632 роки. Будівництво зупинилося близько 1560 року й було відновлено лише в XIX столітті. Висота веж — близько 157 метрів (koeln.de, koelner-dom.de). Від 1996 року Dom — обʼєкт світової спадщини ЮНЕСКО. Ще одна візитівка міста — пиво **Kölsch**: так називається і пиво, і місцевий діалект, про який — у наступному розділі.

> [!diagram] Чотири міста — чотири «візитівки»
> ```yaml
> layout: compare
> columns: { b: "Berlin", h: "Hamburg", m: "München", k: "Köln" }
> nodes:
>   - { id: b1, col: b, label: "жителі", text: "≈ 3,7 млн", note: "найбільше місто; Stadtstaat", tone: yellow }
>   - { id: b2, col: b, label: "слово", text: "der Kiez", note: "район зі своїм життям", tone: pink }
>   - { id: h1, col: h, label: "жителі", text: "≈ 1,87 млн", note: "місто на річці Elbe; Stadtstaat", tone: yellow }
>   - { id: h2, col: h, label: "візитівка", text: "der Hafen, die Speicherstadt", note: "найбільший порт; ЮНЕСКО 2015", tone: pink }
>   - { id: m1, col: m, label: "жителі", text: "понад 1 млн", note: "столиця землі Bayern", tone: yellow }
>   - { id: m2, col: m, label: "візитівка", text: "der Marienplatz", note: "площа з ратушею", tone: pink }
>   - { id: k1, col: k, label: "жителі", text: "понад 1 млн", note: "місто на Рейні", tone: yellow }
>   - { id: k2, col: k, label: "візитівка", text: "der Dom", note: "157 м; 1248–1880; ЮНЕСКО 1996", tone: pink }
> steps:
>   - { show: [b1, b2], note: "Berlin: найбільше місто, а ще — місто «кіців»." }
>   - { show: [h1, h2], note: "Hamburg: порт, річка й Speicherstadt." }
>   - { show: [m1, m2], note: "München: столиця Баварії; серце міста — Marienplatz." }
>   - { show: [k1, k2], note: "Köln: Dom, що будували 632 роки." }
> ```
> Жовтий — розмір і статус, рожевий — «візитівка» міста.

### Ruhrgebiet: від шахт до культури

**Ruhrgebiet** — не місто й не земля, а найбільша в Німеччині міська агломерація в землі Nordrhein-Westfalen: 53 міста, понад 5,1 мільйона жителів на 4 439 км² (Regionalverband Ruhr, ruhrgebiet.de). Тут сусідять Dortmund, Essen, Duisburg, Bochum, Gelsenkirchen та інші міста, які за межами не відокремлюють поля — одне місто переходить в інше. Розмовна назва — **Ruhrpott** («Pott» тут — просто діалектне «горщик»).

Століттями регіон був центром вугілля й сталі. 1960 року в Ruhrgebiet під землею працювали близько 500 000 людей (ruhrgebiet.de). Шахту (*die Zeche*) бачили на кожному кроці. Потім видобуток вугілля поступово скорочувався, і 21 грудня 2018 року в місті Bottrop зачинилася шахта Prosper-Haniel — остання діюча камʼяновугільна шахта регіону (RVR).

Але шахти не зникли безслідно. **Zeche Zollverein** в Essen, комплекс шахти й коксохімічного заводу, 14 грудня 2001 року внесли до Списку світової спадщини ЮНЕСКО; шахта Schacht XII працювала з 1932 року й ще за життя мала славу «найкрасивішої шахти світу» (zollverein.de). Відвали породи (*Halden*) перетворилися на парки й ліси. А 2010 року Essen від імені 53 міст Ruhrgebiet став **Європейською столицею культури** (*Kulturhauptstadt Europas*) під гаслом «Wandel durch Kultur – Kultur durch Wandel» («Зміна через культуру — культура через зміну»; kulturland.rlp.de). Це приклад **Strukturwandel** — структурної перебудови регіону.

> [!diagram] Ruhrgebiet: від шахт до культури
> ```yaml
> layout: timeline
> nodes:
>   - { id: z1932, at: "1932", text: "Schacht XII — Zollverein", note: "Essen; пізніше «найкрасивіша шахта світу»", tone: yellow }
>   - { id: z1960, at: "1960", text: "≈ 500 000 людей під землею", note: "пік вугільної епохи", tone: gray }
>   - { id: z2001, at: "14.12.2001", text: "Zollverein — Welterbe", note: "ЮНЕСКО", tone: pink }
>   - { id: z2010, at: "2010", text: "Kulturhauptstadt Europas", note: "Essen для 53 міст Ruhr", tone: pink }
>   - { id: z2018, at: "21.12.2018", text: "Prosper-Haniel зачиняється", note: "остання діюча шахта; Bottrop", tone: yellow }
> steps:
>   - { show: [z1932, z1960], note: "Спочатку вугілля: у 1960 році близько 500 000 людей працювали під землею." }
>   - { show: [z2001, z2010], note: "Колишні промислові обʼєкти стають культурою: Welterbe (2001) і Kulturhauptstadt (2010)." }
>   - { show: z2018, note: "21 грудня 2018 року регіон закрив останню діючу шахту." }
> ```

## Приклади

- *Berlin hat etwa 3,7 Millionen Einwohner.* — У Берліні близько 3,7 мільйона жителів.
- *Mein Kiez ist ruhig, aber nicht langweilig.* — Мій Kiez тихий, але не нудний.
- *Der Hamburger Hafen ist sehr groß.* — Гамбурзький порт дуже великий.
- *Die Speicherstadt ist seit 2015 UNESCO-Welterbe.* — Speicherstadt з 2015 року належить до світової спадщини ЮНЕСКО.
- *Das Rathaus steht am Marienplatz.* — Ратуша стоїть на Marienplatz.
- *Der Kölner Dom ist ein Wahrzeichen der Stadt.* — Кельнський собор — символ міста.
- *Im Ruhrgebiet gibt es keine aktive Zeche mehr.* — У Рурі більше немає діючих шахт.
- *Wir fahren am Wochenende ins Ruhrgebiet.* — На вихідних ми їдемо до Рура.
- *Der Strukturwandel hat die Region verändert.* — Структурна перебудова змінила регіон.
- *Das Kölsch ist ein Bier aus Köln.* — Kölsch — це пиво з Кельна.

## Слова

Слова *die Stadt*, *der Hafen*, *das Rathaus*, *der Fluss*, *das Land* уже є в інших темах — тут їх лише вживаємо. Слово *die Hauptstadt* — у розділі «Німецькомовний світ».

> [!word] der Kiez
> ipa: /kiːts/ · pos: noun · level: A2 · id: dl-a2-03-w01
> uk: Kiez — невеликий район міста зі своїм життям (Берлін); у Гамбурзі — район St. Pauli
> forms: die Kieze
> example: In meinem **Kiez** kennt jeder jeden. — У моєму Kiez усі всіх знають.
> note: слово — розмовне, тепле: ich bin im Kiez zu Hause. z = [ts], ie = довге [iː]. Історична форма — der Kietz (словʼянське службове поселення біля замка); у Гамбурзі der Kiez = St. Pauli.

> [!word] der Stadtteil
> ipa: /ˈʃtatˌtaɪ̯l/ · pos: noun · level: A2 · id: dl-a2-03-w02
> uk: район міста
> forms: die Stadtteile
> example: Kreuzberg ist ein **Stadtteil** von Berlin. — Кройцберг — район Берліна.
> note: Stadt + Teil. Іноді Stadtbezirk (адміністративний округ) і Viertel («квартал») теж означають район.

> [!word] die Großstadt
> ipa: /ˈɡʁoːsˌʃtat/ · pos: noun · level: A2 · id: dl-a2-03-w03
> uk: велике місто
> forms: die Großstädte
> example: Köln ist eine **Großstadt** am Rhein. — Кельн — велике місто на Рейні.
> note: у статистиці Großstadt — місто з понад 100 000 жителів (Destatis). Множина з умлаутом: Großstädte. CH: Grossstadt (без ß).

> [!word] die Millionenstadt
> ipa: /mɪˈli̯oːnənˌʃtat/ · pos: noun · level: B1 · id: dl-a2-03-w04
> uk: місто-мільйонник
> forms: die Millionenstädte
> example: Hamburg ist eine **Millionenstadt**. — Гамбург — місто-мільйонник.
> note: Million + en + Stadt. У Німеччині чотири Millionenstädte: Berlin, Hamburg, München, Köln (Destatis).

> [!word] das Wahrzeichen
> ipa: /ˈvaːɐ̯ˌtsaɪ̯çn̩/ · pos: noun · level: B1 · id: dl-a2-03-w05
> uk: символ міста, візитівка
> forms: die Wahrzeichen
> example: Der Dom ist das **Wahrzeichen** von Köln. — Собор — символ Кельна.
> note: складне слово Wahr- + Zeichen («знак»). Множина збігається з однині: die Wahrzeichen.

> [!word] die Sehenswürdigkeit
> ipa: /ˈzeːənsˌvʏʁdɪçkaɪ̯t/ · pos: noun · level: A2 · id: dl-a2-03-w06
> uk: визначна памʼятка
> forms: die Sehenswürdigkeiten
> example: Der Kölner Dom ist eine **Sehenswürdigkeit**. — Кельнський собор — визначна памʼятка.
> note: sehen + würdig + -keit: «те, що варто побачити». Суфікс -keit → die (без винятків).

> [!word] das Welterbe
> ipa: /ˈvɛltˌʔɛʁbə/ · pos: noun · level: B1 · id: dl-a2-03-w07
> uk: світова спадщина (ЮНЕСКО)
> forms: — (без множини)
> example: Der Dom ist seit 1996 **Welterbe**. — Собор з 1996 року входить до світової спадщини.
> note: Welt + Erbe; повністю: das UNESCO-Welterbe. Також: das Weltkulturerbe (культурна спадщина). Без артикля, коли йдеться про статус: seit 1996 Welterbe.

> [!word] der Dom
> ipa: /doːm/ · pos: noun · level: A2 · id: dl-a2-03-w08
> uk: собор (велика церква)
> forms: die Dome
> example: Der **Dom** steht mitten in Köln. — Собор стоїть просто посеред Кельна.
> note: «Dom» ≠ український «дім»: «дім» німецькою — das Haus, das Zuhause. Der Dom — це лише велика (катедральна) церква: der Kölner Dom, der Dom in Speyer.

> [!word] der Fernsehturm
> ipa: /ˈfɛʁnzeːˌtʊʁm/ · pos: noun · level: A2 · id: dl-a2-03-w09
> uk: телевежа
> forms: die Fernsehtürme
> example: Vom **Fernsehturm** sieht man ganz Berlin. — З телевежі видно весь Берлін.
> note: fernsehen — «дивитися телевізор». Множина з умлаутом: Fernsehtürme. Берлінська телевежа — на Alexanderplatz.

> [!word] die Speicherstadt
> ipa: /ˈʃpaɪ̯çɐˌʃtat/ · pos: noun · level: A2 · id: dl-a2-03-w10
> uk: Шпайхерштадт (комплекс складів у Гамбурзі)
> forms: — (без множини)
> example: Die **Speicherstadt** liegt im Hamburger Hafen. — Speicherstadt лежить у гамбурзькому порту.
> note: der Speicher — склад, комора; die Stadt — місто. Імʼя власне, тому без множини; sp- = [ʃp].

> [!word] die Kneipe
> ipa: /ˈknaɪ̯pə/ · pos: noun · level: A2 · id: dl-a2-03-w11
> uk: кнайпа, невеликий паб
> forms: die Kneipen
> example: In unserem Kiez gibt es viele **Kneipen**. — У нашому Kiez багато кнайп.
> note: розмовне; kn- вимовляється з обома звуками: [kn].

> [!word] die Zeche
> ipa: /ˈtsɛçə/ · pos: noun · level: A2 · id: dl-a2-03-w12
> uk: шахта (камʼяновугільна)
> forms: die Zechen
> example: Mein Opa hat früher in einer **Zeche** gearbeitet. — Мій дід раніше працював на шахті.
> note: DWDS: ще й «рахунок у закладі»: die Zeche zahlen — оплатити рахунок. e = [ɛ], ch після e = [ç].

> [!word] der Bergbau
> ipa: /ˈbɛʁkˌbaʊ̯/ · pos: noun · level: B1 · id: dl-a2-03-w13
> uk: гірнича справа, видобуток корисних копалин
> forms: — (без множини)
> example: Der **Bergbau** hat das Ruhrgebiet geprägt. — Гірнича справа сформувала Рур.
> note: Berg + Bau: der Bergmann (шахтар, мн. Bergleute), im Bergbau arbeiten. g наприкінці складу = [k].

> [!word] die Steinkohle
> ipa: /ˈʃtaɪ̯nˌkoːlə/ · pos: noun · level: B1 · id: dl-a2-03-w14
> uk: камʼяне вугілля
> forms: — (без множини)
> example: Im Ruhrgebiet fördert man keine **Steinkohle** mehr. — У Рурі більше не видобувають камʼяне вугілля.
> note: Stein + Kohle. Інше вугілля — die Braunkohle (буре); для всіх вугілля — die Kohle.

> [!word] das Ruhrgebiet
> ipa: /ˈʁuːɐ̯ɡəˌbiːt/ · pos: noun · level: A2 · id: dl-a2-03-w15
> uk: Рур, Рурська область
> forms: — (без множини)
> example: Im **Ruhrgebiet** wohnen mehr als fünf Millionen Menschen. — У Рурі живе понад пʼять мільйонів людей.
> note: на відміну від міст — з артиклем: im Ruhrgebiet, ins Ruhrgebiet, aus dem Ruhrgebiet. Назва від річки Ruhr; das Gebiet — «область, район».

> [!word] der Ruhrpott
> ipa: /ˈʁuːɐ̯pɔt/ · pos: noun · level: B1 · id: dl-a2-03-w16
> uk: Рур (розмовна назва)
> forms: — (без множини)
> example: Sie kommt aus dem **Ruhrpott**. — Вона родом із Рура.
> note: розмовне: «der Pott» = горщик. Офіційно кажуть das Ruhrgebiet або die Metropole Ruhr. Часто про людей: die Pottler/Ruhrpottler.

> [!word] der Strukturwandel
> ipa: /ˈʃtʁʊktuːɐ̯ˌvandl̩/ · pos: noun · level: B2 · id: dl-a2-03-w17
> uk: структурна перебудова (економіки)
> forms: — (без множини)
> example: Der **Strukturwandel** im Ruhrgebiet dauert lange. — Структурна перебудова в Рурі триває довго.
> note: die Struktur + der Wandel («зміна»).

> [!word] die Industrie
> ipa: /ɪndʊsˈtʁiː/ · pos: noun · level: B1 · id: dl-a2-03-w18
> uk: промисловість
> forms: die Industrien
> example: Früher gab es hier viel **Industrie**. — Раніше тут було багато промисловості.
> note: наголос на останньому складі: Industríe. Складене: die Schwerindustrie (важка промисловість).

> [!word] die Halde
> ipa: /ˈhaldə/ · pos: noun · level: B2 · id: dl-a2-03-w19
> uk: відвал (породи)
> forms: die Halden
> example: Auf der **Halde** gibt es heute einen Park. — На відвалі сьогодні парк.
> note: у Рурі: die Bergehalde. h на початку — видих.

> [!word] das Kölsch
> ipa: /kœlʃ/ · pos: noun · level: A2 · id: dl-a2-03-w20
> uk: Kölsch — пиво з Кельна; також кельнський діалект
> forms: — (без множини)
> example: In Köln trinkt man **Kölsch**. — У Кельні пʼють Kölsch.
> note: ö = [œ] (коротке). Прикметник: kölsch — «кельнський» (kölsche Sprache). Про пиво — окремо в розділі про їжу й напої.

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: dl-a2-03-l01
> audio: Der Kölner Dom ist sehr hoch.
> - [ ] Der Kölner Dom ist sehr alt.
> - [x] Der Kölner Dom ist sehr hoch.
> - [ ] Der Kölner Dom ist sehr groß.
>
> **Пояснення:** *hoch* — «високий» (ch після o = [x]); *alt* — «старий»; *groß* — «великий». Вежі собору — близько 157 м.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: dl-a2-03-l02
> audio: Die Speicherstadt liegt in Hamburg.
> explain: *Speicher-* — sp- на початку складу вимовляється як [ʃp]; *-stadt* — [ʃtat]. *Hamburg* — g у кінці звучить як [k].

> [!listen] Де живе Тім?
> level: A2 · type: answer · speed: slow · id: dl-a2-03-l03
> audio: A: Wo wohnst du, Tim?
> audio: B: In Berlin, in Kreuzberg. Mein Kiez ist klein, aber sehr schön.
> - [ ] в Гамбурзі
> - [x] у Берліні, в районі Кройцберг
> - [ ] у Кельні
> - [ ] у Рурі
>
> **Пояснення:** *Kreuzberg* — один із берлінських районів (*Stadtteile*); *Kiez* тут — «мій квартал». У Гамбурзі *Kiez* означало б St. Pauli.

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: dl-a2-03-l04
> audio: Die letzte Zeche hat 2018 geschlossen.
> - [ ] Die erste Zeche hat 2018 geöffnet.
> - [x] Die letzte Zeche hat 2018 geschlossen.
> - [ ] Die letzte Zeche hat 2008 geschlossen.
>
> **Пояснення:** *letzte* — «остання», *geschlossen* — Partizip II від *schließen* (закривати; Perfekt: *hat geschlossen*). 2018 — [ˈtsvaɪ̯taʊ̯zn̩t ˈaxtseːn]. Prosper-Haniel зачинилася 21.12.2018.

> [!listen] Радіонотатки про Рур. Заповни пропуски.
> level: A2 · type: fill · speed: slow · id: dl-a2-03-l05
> audio: Das Ruhrgebiet hat mehr als fünf Millionen Einwohner. Es liegt in Nordrhein-Westfalen.
>
> ```fill
> Einwohner im Ruhrgebiet: mehr als [[5|fünf]] Millionen
> Bundesland: [[Nordrhein-Westfalen|NRW]]
> ```
>
> **Пояснення:** *fünf* — [fʏnf], ü = [ʏ] коротке. Ruhrgebiet не є окремою землею: воно лежить у землі Nordrhein-Westfalen.

## Вимова

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: dl-a2-03-s01
> text: Der Kölner Dom ist ein Wahrzeichen.
> ipa: /deːɐ̯ ˈkœlnɐ doːm ɪst aɪ̯n ˈvaːɐ̯ˌtsaɪ̯çn̩/
> tip: Köln: ö — короткий [œ], «кьольн». Dom — довге [oː] і закінчення [m]. Wahrzeichen: w = [v], -ah- довге [aː], -ch- після ei = [ç].
> uk: Кельнський собор — символ міста.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: dl-a2-03-s02
> text: Das Ruhrgebiet war früher voller Zechen.
> ipa: /das ˈʁuːɐ̯ɡəˌbiːt vaːɐ̯ ˈfʁyːɐ ˈfɔlɐ ˈtsɛçn̩/
> tip: Ruhr — довге [uː], h не звучить; ʁ — горловий. früher: ü довге [yː]. Zechen: z = [ts], ch після e = [ç].
> uk: Рур раніше був повен шахт.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: dl-a2-03-s03
> text: Hamburg hat einen großen Hafen.
> ipa: /ˈhambʊʁk hat ˈaɪ̯nən ˈɡʁoːsn̩ ˈhaːfn̩/
> tip: Hamburg: g на кінці = [k]. großen: ß = [s] після довгого [oː]. Hafen: h — видих, довге [aː], f = [f].
> uk: У Гамбурзі великий порт.

## Типові помилки й пастки

> [!pitfall] Kiez у Берліні й у Гамбурзі — не те саме
> У Берліні *Kiez* — теплий, «домашній» район (*mein Kiez*). У Гамбурзі *der Kiez* — район St. Pauli з вулицею Reeperbahn, відомий нічним життям (DWDS). Якщо берлінець каже «Ich wohne im Kiez», це звучить мило; гамбуржець зрозуміє зовсім інше. Тому в Берліні краще уточнювати назву: *im Wrangelkiez*, *im Kiez in Kreuzberg*.

> [!pitfall] Dom ≠ «дім»
> Український «дім» — це німецьке *das Haus* або *das Zuhause*. *Der Dom* — велика собор­на церква: *der Kölner Dom*, *der Dom zu Speyer*. Тому «я йду додому» — *Ich gehe nach Hause*, а не «Ich gehe in den Dom». Слово *Zeche* теж пастка: це не «цех» (завод), а «шахта» (і «рахунок у закладі»).

> [!pitfall] Ruhrgebiet — не окрема земля
> Ruhrgebiet — регіон, а не *Bundesland*. Він лежить у землі *Nordrhein-Westfalen*, столиця якої — Düsseldorf, а не Essen чи Dortmund. Питання «Hauptstadt des Ruhrgebiets?» не має відповіді: це 53 міста без спільної столиці.

> [!pitfall] «nach Berlin», але «ins Ruhrgebiet»
> Назви міст — без артикля: *in Köln, nach Hamburg, aus München*. А *das Ruhrgebiet* має артикль: *im Ruhrgebiet* (in dem), *ins Ruhrgebiet* (in das), *aus dem Ruhrgebiet*. Помилки «Ich fahre nach Ruhrgebiet» або «Ich wohne im Köln» — типові. Правило: місто — без артикля, регіон із *Gebiet* — з артиклем.

## Landeskunde-Text

> [!example] Städte und Regionen in Deutschland
> Berlin ist die Hauptstadt und hat etwa 3,7 Millionen Einwohner. Viele Berliner sagen: „Mein Kiez ist mein Zuhause.“ Ein Kiez ist ein kleines Viertel mit Läden und Kneipen.
>
> Hamburg hat einen großen Hafen. Die Speicherstadt ist seit 2015 UNESCO-Welterbe. In Köln steht der Dom. Man hat 1248 mit dem Bau begonnen, und 1880 war er fertig. Seine Türme sind etwa 157 Meter hoch.
>
> Im Ruhrgebiet wohnen mehr als fünf Millionen Menschen in 53 Städten. Früher haben viele Menschen in einer Zeche gearbeitet. Im Dezember 2018 hat die letzte Zeche geschlossen. Heute ist die Zeche Zollverein in Essen ein Ort für Kultur.
>
> *Слова:* *der Laden* — крамниця; *begonnen* — Partizip II від *beginnen* (починати); *fertig* — готовий; *früher* — раніше.

> [!quiz] Lies den Text. Wie viele Städte gehören zum Ruhrgebiet?
> level: A2 · type: single · id: dl-a2-03-q02
> - [ ] 5
> - [ ] 16
> - [x] 53
> - [ ] 157
>
> **Пояснення:** *Im Ruhrgebiet wohnen mehr als fünf Millionen Menschen in 53 Städten.* «5» — це мільйони жителів, «157» — висота веж собору в метрах, «16» — число земель.

> [!quiz] Lies den Text. Wann war der Kölner Dom fertig?
> level: A2 · type: single · id: dl-a2-03-q03
> - [ ] 1248
> - [x] 1880
> - [ ] 1996
> - [ ] 2018
>
> **Пояснення:** *Man hat 1248 mit dem Bau begonnen, und 1880 war er fertig.* 1248 — початок, 1996 — рік внесення до світової спадщини (не з тексту), 2018 — закриття останньої шахти.

> [!quiz] Lies den Text. Was ist in Hamburg seit 2015 UNESCO-Welterbe?
> level: A2 · type: single · id: dl-a2-03-q04
> - [ ] der Dom
> - [ ] die Zeche Zollverein
> - [x] die Speicherstadt
> - [ ] der Kiez
>
> **Пояснення:** *Die Speicherstadt ist seit 2015 UNESCO-Welterbe.* Dom — це Кельн, Zollverein — Essen (Рур); Kiez — не памʼятка.

## Практика

> [!quiz] Склади речення: «З 2018 року в Рурі більше немає шахт».
> level: A2 · type: order · id: dl-a2-03-q05
>
> ```text order
> Seit 2018
> gibt es
> keine Zeche mehr
> im Ruhrgebiet.
> es gibt ✗
> ```
>
> **Пояснення:** речення починається з обставини часу (*Seit 2018*), тому дієслово стоїть на другому місці, а підмет *es* — після нього: *gibt es*. Помилка «Seit 2018 es gibt …» порушує правило V2. *keine … mehr* — «вже немає».

> [!quiz] Які з цих місць — UNESCO-Welterbe? Обери всі правильні відповіді.
> level: A2 · type: multi · id: dl-a2-03-q06
> - [x] der Kölner Dom
> - [x] die Zeche Zollverein in Essen
> - [x] die Speicherstadt in Hamburg
> - [ ] der Marienplatz in München
> - [ ] der Kiez in Berlin
>
> **Пояснення:** Dom (1996), Zollverein (14.12.2001) і Speicherstadt з Kontorhausviertel (2015) — обʼєкти світової спадщини. Marienplatz — площа в центрі Мюнхена, Kiez — район, не памʼятка.

> [!quiz] Заповни пропуски
> level: A2 · type: fill · bank: Rathaus, Bahnhof · id: dl-a2-03-q07
>
> ```text fill
> Der [[Hafen]] ist in Hamburg.
> Der [[Dom]] steht in Köln.
> Die letzte [[Zeche]] hat 2018 geschlossen.
> ```
>
> **Пояснення:** *Hafen* — порт, *Dom* — собор, *Zeche* — шахта. *Rathaus* і *Bahnhof* — інші будівлі (ратуша й вокзал), у цих реченнях вони не пасують.

> [!quiz] Яке місто в Німеччині найбільше?
> level: A2 · type: single · id: dl-a2-03-q08
> - [ ] Hamburg
> - [ ] München
> - [x] Berlin
> - [ ] Köln
>
> **Пояснення:** Berlin — близько 3,7 млн жителів, Hamburg — близько 1,87 млн (Destatis); München і Köln — понад мільйон. Усі чотири — *Millionenstädte*.

> [!quiz] Що означає «Kiez» у Гамбурзі?
> level: A2 · type: single · id: dl-a2-03-q09
> - [ ] будь-який район міста
> - [ ] порт
> - [x] район St. Pauli навколо Reeperbahn
> - [ ] залізничний вокзал
>
> **Пояснення:** DWDS: у Гамбурзі *Kiez* позначає район St. Pauli. У Берліні це «домашній» район (не обовʼязково нічного життя).

> [!quiz] Чим тривалий час відомий Рур?
> level: A2 · type: single · id: dl-a2-03-q10
> - [ ] виноробством
> - [ ] прибережним туризмом
> - [x] вугіллям, сталлю й важкою промисловістю
> - [ ] альпійськими схилами
>
> **Пояснення:** Ruhrgebiet — регіон вугілля й сталі: 1960 року близько 500 000 людей працювали там під землею (ruhrgebiet.de). Нині — Strukturwandel: парки на відвалах, культура, нові галузі.

> [!quiz] Заповни пропуски числами
> level: A2 · type: fill · bank: 2010, 135 · id: dl-a2-03-q11
>
> ```text fill
> Die Türme vom Kölner Dom sind etwa [[157]] Meter hoch.
> Die letzte Zeche im Ruhrgebiet hat im Jahr [[2018]] geschlossen.
> Zum Ruhrgebiet gehören [[53]] Städte.
> ```
>
> **Пояснення:** вежі Dom — близько 157 м, Prosper-Haniel зачинилася у 2018 році, у Ruhrgebiet — 53 міста. *2010* (Kulturhauptstadt) і *135* — зайві.

## Фішки

> [!reel] 🍺 «Die Zeche zahlen» — шахта чи рахунок?
> Німецьке *die Zeche* означає і шахту, і рахунок у закладі: *die Zeche prellen* — піти, не заплативши. DWDS: давньоверхньонімецьке *zehha* означало «спільний внесок»; у Середньовіччі слово позначало цех, гірничу спільноту й її шахту, а також рахунок за спільне застілля. Обидва значення живуть у сучасній мові.

> [!reel] ⛪ Dom, який будували 632 роки
> Закладання першого каменя Кельнського собору — 15 серпня 1248 року, урочисте завершення — 15 жовтня 1880 року: 632 роки. Будівництво стояло понад два з половиною століття — від близько 1560 року до XIX століття (koeln.de).

> [!reel] ⛏ 500 000 шахтарів — і жодного
> 1960 року в Ruhrgebiet під землею працювало близько 500 000 людей. 21 грудня 2018 року в Bottrop закрили Prosper-Haniel — останню діючу камʼяновугільну шахту регіону (ruhrgebiet.de, RVR). На відвалах (*Halden*) сьогодні ростуть ліси й парки.

> [!reel] 🏘 Звідки слово Kiez
> Слово засвідчене як назва поселення вже 1249 року (DWDS). У Середньовіччі *Kietz* — словʼянське службове поселення біля замка, часто рибальське, на переправі; походження слова DWDS називає спірним. Згодом «Kietz» стало зневажливим для віддалених поселень, а в Берліні «Kiez» набув теплого значення — «мій район».

> [!reel] 🏭 Склади на дубових палях
> Hamburger Speicherstadt будували з 1883 року на тисячах дубових паль у прибережній воді. 2015 року її разом із кварталом Kontorhausviertel і будинком Chilehaus (1922–1924) внесли до світової спадщини — як свідчення бурхливого зростання міжнародної торгівлі наприкінці XIX — на початку XX століття (hamburg.de).

## Джерела та що почитати

- Населення й міста-мільйонники: [Destatis — Zensus 2022, перші результати](https://www.destatis.de/DE/Presse/Pressemitteilungen/Zensus2022-Pressemitteilungen/PM_zensus2022_44.html); [Destatis — Bundesländer mit Hauptstädten nach Fläche, Bevölkerung und Dichte](https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Tabellen/_tabellen-innen-bevoelkerung-flaeche-wahlen.html).
- Kiez: [DWDS — Kiez](https://www.dwds.de/wb/Kiez); [berlin.de — Kiez: Small Island in the Big City](https://www.berlin.de/en/districts/4971205-6180114-kiez-small-islands-big-city.en.html).
- Hamburg: [hamburg.de — Speicherstadt](https://www.hamburg.de/tourismus/sehenswuerdigkeiten/speicherstadt-301600); [Hamburg Tourismus — UNESCO Welterbe](https://www.hamburg-tourism.de/sehen-erleben/historisches-hamburg/unesco-weltkulturerbe/).
- Köln: [Kölner Dom — Geschichte](https://www.koelner-dom.de/erleben/geschichte); [koeln.de — Kölner Dom](https://www.koeln.de/tourismus/sehenswertes/koelner-dom/).
- Ruhrgebiet: [ruhrgebiet.de — Wandel im Ruhrgebiet](https://ruhrgebiet.de/leben/wandel); [ruhrgebiet.de — Leben im Ruhrgebiet](https://ruhrgebiet.de/leben); [RVR — Metropole Ruhr in Zahlen (PDF)](https://www.rvr.ruhr/fileadmin/user_upload/01_RVR_Home/03_Daten_Digitales/Regionalstatistik/03_Publikationen/2021-08_Metropole_Ruhr_Die_Region_in_Zahlen.pdf); [RVR — Das Ruhrgebiet verabschiedet sich vom Bergbau](https://www.rvr.ruhr/news/startseite-news/news/blick-zurueck-nach-vorn-das-ruhrgebiet-verabschiedet-sich-vom-bergbau-zahlreiche-ausstellungen-und-aktionen/); [Zollverein — UNESCO-Welterbe](https://www.zollverein.de/ueber-zollverein/welterbe/); [Kulturland RLP — Essen wird Kulturhauptstadt 2010](https://kulturland.rlp.de/aktuelles/detail/essen-wird-europaeische-kulturhauptstadt-2010); [bpb — Strukturwandel durch Kulturwirtschaft](https://www.bpb.de/shop/zeitschriften/apuz/29590/strukturwandel-durch-kulturwirtschaft/).
- Слова: [DWDS — Zeche](https://www.dwds.de/wb/Zeche); [DWDS — Pott](https://www.dwds.de/wb/Pott).

> [!important] Підсумок
> - Чотири *Millionenstädte*: Berlin (≈ 3,7 млн), Hamburg (≈ 1,87 млн), München, Köln. Візитівки: *Kiez*, *Hafen* і *Speicherstadt*, *Marienplatz*, *Dom*.
> - *Kiez*: у Берліні — «свій» район, у Гамбурзі — St. Pauli.
> - Kölner Dom: 1248–1880, ≈ 157 м, ЮНЕСКО 1996. Speicherstadt: ЮНЕСКО 2015. Zollverein: ЮНЕСКО 14.12.2001.
> - Ruhrgebiet: 53 міста, понад 5,1 млн жителів, у землі Nordrhein-Westfalen; остання шахта (Prosper-Haniel) закрилася 21.12.2018; *Strukturwandel* — від шахт до культури (Kulturhauptstadt 2010).
> - Артикль: *in Köln*, але *im Ruhrgebiet*; *Dom* ≠ «дім».
