---
title: Швейцарія — чотири мови й пряма демократія
id: dl-a2-10
level: A2
icon: px:flag
tags: [deutsch, landeskunde, a2, land, schweiz, schweizerdeutsch, volksabstimmung, kantone]
prerequisites: ["[[Deutschland - A2 - 09. Австрія — Відень, Габсбурги, австрійська німецька]]"]
estimatedMinutes: 40
---

# Швейцарія — чотири мови й пряма демократія

> [!success] Після цього розділу ти зможеш
> - назвати чотири національні мови **die Schweiz** і сказати, скільки людей приблизно говорить кожною;
> - пояснити різницю між **Schweizerdeutsch** (говірка, яку чуєш на вулиці) і **Hochdeutsch** (літературна мова, яку вчиш ти);
> - розповісти простими словами, як працює **Volksabstimmung**: ініціатива, референдум, голосування;
> - розпізнавати швейцарські слова — **Grüezi, Velo, Spital, Trottoir, parkieren, Znüni** — і знати, що в Швейцарії не пишуть **ß**;
> - прочитати короткий текст німецькою про Швейцарію (рівень A2) і відповісти на питання.

## Передбач

> [!quiz] Скільки підписів потрібно, щоб у Швейцарії можна було голосувати за народну ініціативу (*Volksinitiative*)?
> level: A2 · type: single · id: dl-a2-10-q01
> - [ ] 1000 підписів за місяць
> - [ ] 10 000 підписів за рік
> - [x] 100 000 підписів за 18 місяців
> - [ ] мільйон підписів без обмеження в часі
>
> **Пояснення:** згідно з ch.ch, ініціатива «відбувається», якщо 100 000 людей з правом голосу підпишуть її протягом 18 місяців. Для референдуму проти нового закону достатньо 50 000 підписів за 100 днів.

## Оповідь

### Чотири мови в одній країні

Швейцарія (**die Schweiz**) — країна з чотирма національними мовами (**Landessprachen**): **Deutsch, Französisch, Italienisch** і **Rätoromanisch**. За даними Федерального статистичного управління (BFS), у 2024 році як основну мову назвали: німецьку — 61 % мешканців, французьку — 23 %, італійську — 8 %, ретороманську — 0,4 %. Діалекти (швейцарсько-німецький, романські говірки) входять у відповідні мови. Для федерації офіційні мови — німецька, французька й італійська; ретороманська — офіційна лише в спілкуванні з носіями цієї мови.

Тому швейцарці часто бачать написи на двох-трьох мовах. Кордон між німецькомовною й франкомовною частинами жартома називають **Röstigraben** — «рьоштівий рів» (*Rösti* — смажена терта картопля). Duden позначає слово як швейцарське жартівливе.

### Schweizerdeutsch і Hochdeutsch

У німецькомовній Швейцарії (**die Deutschschweiz**) у побуті розмовляють **Schweizerdeutsch** — це група діалектів (*Mundart*), які сильно відрізняються від літературної німецької. За даними BFS 2024 року, вдома швейцарською німецькою говорить 55 % населення, літературною німецькою — 12 %. А писемна мова, у школі й у медіа — **Hochdeutsch**, тобто та сама німецька, яку вчиш ти, лише з швейцарськими особливостями (**Schweizer Hochdeutsch**).

Одна з відмінностей — правопис: у Швейцарії й Ліхтенштейні замість **ß** завжди пишуть **ss**: *Strasse*, *Fussball*, *gross*. Так записано в керівництві Федеральної канцелярії та в Duden (§ 25 E2). У Швейцарії цю літеру не пишуть з 1970-х років.

### Як працює пряма демократія

Швейцарці голосують набагато частіше, ніж в інших країнах: кілька разів на рік — на рівні федерації, кантонів і громад. Є три основні інструменти.

> [!diagram] Народна ініціатива: від ідеї до голосування
> ```yaml
> layout: flow
> nodes:
>   - { id: idee, label: "1", text: "Idee", note: "комітет формулює пропозицію зміни Конституції", tone: yellow }
>   - { id: unter, label: "2", text: "100.000 Unterschriften", note: "за 18 місяців", tone: pink }
>   - { id: abst, label: "3", text: "Volksabstimmung", note: "усі, хто має право голосу", tone: yellow }
>   - { id: ent, label: "4", text: "Volk und Kantone", note: "потрібна більшість народу й кантонів", tone: pink }
> steps:
>   - { focus: idee, note: "Група громадян пропонує зміну Конституції — це Volksinitiative." }
>   - { move: { from: idee, to: unter, value: "18 Monate" }, note: "100 000 підписів потрібно зібрати за 18 місяців." }
>   - { move: { from: unter, to: abst, value: "Abstimmung" }, note: "Якщо підписів достатньо, ініціативу виносять на голосування (комітет може відкликати її до цього)." }
>   - { move: { from: abst, to: ent, value: "Mehrheit" }, note: "Конституцію змінюють, якщо за пропозицію проголосували більшість народу й більшість кантонів." }
> ```

**Volksinitiative** — громадяни пропонують змінити Конституцію. **Referendum** — громадяни можуть зупинити новий закон: якщо за 100 днів після його публікації зібрати 50 000 підписів, закон виносять на голосування й він набуває чинності лише коли більшість проголосує «за». Крім того, деякі зміни Конституції обовʼязково виносять на голосування, і це називають обовʼязковим референдумом. Термін для референдуму 1996 року збільшили з 90 до 100 днів. Усе разом називають **Volksabstimmung**.

### Кантони, Bund, історія

Швейцарія — федерація з 26 кантонів (**Kantone**), які значною мірою самостійні й складаються з громад. Центральна влада — **Bund**; уряд федерації — **Bundesrat**. Федеральну Конституцію прийняли 12 вересня 1848 року — це початок сучасної Швейцарії як федеративної держави (до того було 22 суверенні кантони). Парламент і уряд працюють у Берні.

> [!diagram] Швейцарія: чотири дати
> ```yaml
> layout: timeline
> nodes:
>   - { id: brief, at: "серпень 1291", text: "Bundesbrief", note: "союз Урі, Швіца й Унтервальдена", tone: yellow }
>   - { id: verf, at: "12.09.1848", text: "Bundesverfassung", note: "початок федеративної держави", tone: gray }
>   - { id: feier, at: "1891", text: "erste Bundesfeier", note: "щорічне святкування — з 1899", tone: pink, icon: "px:flag" }
>   - { id: roman, at: "1938", text: "Rätoromanisch", note: "четверта Landessprache за результатами голосування", tone: gray }
> steps:
>   - { show: brief, note: "Грамота початку серпня 1291 року — союз трьох кантонів." }
>   - { show: verf, note: "1848: нова Конституція створює федеративну державу." }
>   - { show: feier, note: "1891: перше святкування Bundesfeier на 600-річчя грамоти." }
>   - { show: roman, note: "1938: ретороманська стає національною мовою." }
> ```

Національне свято — **1. August** (*Bundesfeier*). Воно повʼязане з Bundesbrief 1291 року, але відзначати його почали пізно: перша Bundesfeier відбулася 1891 року, щорічною стала з 1899-го. Історики сьогодні вважають Bundesbrief 1291 року не «актом заснування» Швейцарії, а одним із регіональних союзів, що забезпечував мир.

### Швейцарські слова (CH)

Швейцарська стандартна німецька має власні слова. У Duden їх позначають «schweizerisch».

| Німеччина (DE) | Швейцарія (CH) | Примітка |
|---|---|---|
| das Fahrrad | **das Velo** | CH |
| das Krankenhaus | **das Spital** | CH, також AT |
| der Gehweg | **das Trottoir** | CH, також AT |
| parken | **parkieren** | CH |
| (привітання) Guten Tag | **Grüezi** | CH, формально-ввічливо |
| die zweite Frühstückspause | **das Znüni** | CH, «девʼята година» |
| die Währung | **der Franken** | CHF |

## Приклади

- *In der Schweiz gibt es vier Landessprachen.* — У Швейцарії чотири національні мови.
- *Die meisten Schweizer sprechen zu Hause Schweizerdeutsch.* — Більшість швейцарців удома говорять швейцарською німецькою.
- *Grüezi! Ich suche das Spital.* — Добрий день! Я шукаю лікарню.
- *Ich fahre jeden Tag mit dem Velo zur Arbeit.* — Я щодня їжджу на роботу на велосипеді.
- *Hier darfst du nicht parkieren.* — Тут не можна паркуватися.
- *Das kostet zwanzig Franken.* — Це коштує двадцять франків.
- *Am Sonntag gibt es eine Volksabstimmung.* — У неділю буде голосування.
- *Die Mehrheit hat Nein gesagt.* — Більшість сказала «ні».
- *In der Schweiz schreibt man „Strasse“, nicht „Straße“.* — У Швейцарії пишуть «Strasse», а не «Straße».
- *Der Röstigraben trennt die Deutschschweiz und die Romandie.* — Рьоштіграбен розділяє німецькомовну й франкомовну Швейцарію.

## Слова

### Мови й країна

> [!word] der Kanton
> ipa: /kanˈtoːn/ · pos: noun · level: A2 · id: dl-a2-10-w01
> uk: кантон (одиниця федерації в Швейцарії)
> forms: die Kantone
> example: Die Schweiz hat 26 **Kantone**. — У Швейцарії 26 кантонів.

> [!word] die Landessprache
> ipa: /ˈlandəsˌʃpʁaːxə/ · pos: noun · level: A2 · id: dl-a2-10-w02
> uk: національна мова
> forms: die Landessprachen
> example: Deutsch ist eine **Landessprache** der Schweiz. — Німецька — одна з національних мов Швейцарії.
> note: *Landessprache* ≠ *Amtssprache* (офіційна мова): ретороманська — національна, але на федеральному рівні офіційна лише в спілкуванні з її носіями.

> [!word] das Rätoromanisch
> ipa: /ʁɛtoʁoˈmaːnɪʃ/ · pos: noun · level: A2 · id: dl-a2-10-w03
> uk: ретороманська мова
> forms: — (без множини)
> example: In Graubünden spricht man auch **Rätoromanisch**. — У Граубюндені розмовляють також ретороманською.
> note: назва мови пишеться з великої; прикметник — *rätoromanisch*. Літера ä тут читається як [ɛ].

> [!word] die Deutschschweiz
> ipa: /ˈdɔʏ̯tʃˌʃvaɪ̯ts/ · pos: noun · level: A2 · id: dl-a2-10-w04
> uk: німецькомовна Швейцарія
> forms: — (без множини)
> example: In der **Deutschschweiz** spricht man Schweizerdeutsch. — У німецькомовній Швейцарії говорять швейцарською німецькою.
> note: тут -sch + sch- читається разом: [tʃʃ].

> [!word] das Schweizerdeutsch
> ipa: /ˈʃvaɪ̯tsɐˌdɔʏ̯tʃ/ · pos: noun · level: A2 · id: dl-a2-10-w05
> uk: швейцарська німецька (група діалектів)
> forms: — (без множини)
> example: Im Alltag spricht man **Schweizerdeutsch**. — У побуті розмовляють швейцарською німецькою.
> note: це не «акцент», а система діалектів; прикметник: *schweizerdeutsch*.

> [!word] die Mundart
> ipa: /ˈmʊntʔaːɐ̯t/ · pos: noun · level: A2 · id: dl-a2-10-w06
> uk: говірка, діалект
> forms: die Mundarten
> example: Schweizerdeutsch ist eine **Mundart**. — Швейцарська німецька — це діалект.
> note: у Швейцарії *Mundart* — звичне слово для діалектів.

> [!word] der Röstigraben
> ipa: /ˈʁøːstiˌɡʁaːbn̩/ · pos: noun · level: A2 · id: dl-a2-10-w07
> uk: «рьоштівий рів» — жартівлива назва межі між німецько- й франкомовною Швейцарією
> forms: — (без множини)
> example: Beim **Röstigraben** ändert sich die Sprache. — На «рьоштівому рові» змінюється мова.
> note: CH, жартівливе (Duden: «schweizerisch scherzhaft»). *Rösti* — страва з тертої смаженої картоплі; *Graben* — рів.

### Пряма демократія

> [!word] die Volksabstimmung
> ipa: /ˈfɔlksʔapˌʃtɪmʊŋ/ · pos: noun · level: A2 · id: dl-a2-10-w08
> uk: всенародне голосування
> forms: die Volksabstimmungen
> example: Am Sonntag gibt es eine **Volksabstimmung**. — У неділю буде всенародне голосування.

> [!word] die Volksinitiative
> ipa: /ˈfɔlksʔinitsi̯aˌtiːvə/ · pos: noun · level: A2 · id: dl-a2-10-w09
> uk: народна ініціатива
> forms: die Volksinitiativen
> example: Für eine **Volksinitiative** braucht man 100.000 Unterschriften. — Для народної ініціативи потрібно 100 000 підписів.

> [!word] das Referendum
> ipa: /ʁefeˈʁɛndʊm/ · pos: noun · level: A2 · id: dl-a2-10-w10
> uk: референдум
> forms: die Referenden
> example: Gegen das Gesetz gibt es ein **Referendum**. — Проти цього закону проводять референдум.
> note: у Duden також множина *die Referenda*; частіше — *Referenden*.

> [!word] die Gemeinde
> ipa: /ɡəˈmaɪ̯ndə/ · pos: noun · level: A2 · id: dl-a2-10-w11
> uk: громада, муніципалітет
> forms: die Gemeinden
> example: Jeder Kanton besteht aus vielen **Gemeinden**. — Кожен кантон складається з багатьох громад.
> note: у Швейцарії 26 кантонів поділено на понад 2000 громад (*Gemeinden*); у Німеччині слово теж означає місцеву одиницю. Не плутай з *die Gemeinschaft* («спільнота»).

> [!word] die Mehrheit
> ipa: /ˈmeːɐ̯haɪ̯t/ · pos: noun · level: A2 · id: dl-a2-10-w12
> uk: більшість
> forms: die Mehrheiten
> example: Die **Mehrheit** sagt Ja. — Більшість каже «так».

> [!word] abstimmen
> ipa: /ˈapˌʃtɪmən/ · pos: verb · level: A2 · id: dl-a2-10-w13
> uk: голосувати
> forms: er stimmt ab · stimmte ab · hat abgestimmt
> example: Die Schweizer **stimmen** oft **ab**. — Швейцарці часто голосують.
> note: відокремлюваний префікс: *Wir stimmen heute ab.* Не плутай з *wählen* — «обирати» (людей на виборах).

### Швейцарські слова (CH)

> [!word] Grüezi
> ipa: /ˈɡʁyɐ̯tsi/ · pos: phrase · level: A2 · id: dl-a2-10-w14
> uk: добрий день (CH)
> example: **Grüezi**, Frau Meier! — Добрий день, пані Маєр!
> note: CH; походить від «Gott grüss euch» (DWDS: «(Gott) grüß Euch!»). Вживають у будь-який час дня; ввічливо й нейтрально. Написання *Grüezi* — без -ß.

> [!word] das Velo
> ipa: /ˈveːlo/ · pos: noun · level: A2 · id: dl-a2-10-w15
> uk: велосипед (CH)
> forms: die Velos
> example: Ich fahre mit dem **Velo** zur Arbeit. — Я їжджу на роботу на велосипеді.
> note: CH (Duden: «schweizerisch»); у Німеччині — *das Fahrrad*. Наголос на першому складі: [ˈveːlo].

> [!word] das Spital
> ipa: /ʃpiˈtaːl/ · pos: noun · level: A2 · id: dl-a2-10-w16
> uk: лікарня (CH, AT)
> forms: die Spitäler
> example: Er liegt im **Spital**. — Він лежить у лікарні.
> note: Duden: *der* або *das Spital*; у Швейцарії та Австрії кажуть *das Spital*, у Німеччині — *das Krankenhaus*.

> [!word] das Trottoir
> ipa: /tʁɔˈtoaːɐ̯/ · pos: noun · level: A2 · id: dl-a2-10-w17
> uk: тротуар (CH, AT)
> forms: die Trottoirs
> example: Auf dem **Trottoir** darf man nicht parkieren. — На тротуарі не можна паркуватися.
> note: у Німеччині — *der Gehweg* / *der Bürgersteig*.

> [!word] parkieren
> ipa: /paʁˈkiːʁən/ · pos: verb · level: A2 · id: dl-a2-10-w18
> uk: паркуватися (CH, AT)
> forms: er parkiert · parkierte · hat parkiert
> example: Hier darf man nicht **parkieren**. — Тут не можна паркуватися.
> note: Duden: «schweizerisch, österreichisch»; у Німеччині — *parken*.

> [!word] der Franken
> ipa: /ˈfʁaŋkn̩/ · pos: noun · level: A2 · id: dl-a2-10-w19
> uk: швейцарський франк
> forms: die Franken
> example: Das kostet zwanzig **Franken**. — Це коштує двадцять франків.
> note: у множині не змінюється: *zwanzig Franken*. Скорочення — *CHF*. Не плутай з *Franken* — Франконією, історичною областю в Німеччині.

> [!word] das Znüni
> ipa: /ˈtsnyːni/ · pos: noun · level: A2 · id: dl-a2-10-w20
> uk: другий сніданок (CH, буквально «девʼята година»)
> forms: — (без множини)
> example: Um halb zehn essen die Kinder ihr **Znüni**. — О пів на десяту діти їдять свій другий сніданок.
> note: CH; від *zu neun (Uhr)*. Duden позначає слово як «schweizerisch».

## Слухаємо

> [!listen] Куди йде людина?
> level: A2 · type: answer · speed: slow · id: dl-a2-10-l01
> audio: A: Grüezi! Wie kann ich Ihnen helfen?
> audio: B: Ich suche das Spital. Wo ist es?
> - [ ] на вокзал
> - [x] до лікарні
> - [ ] до магазину велосипедів
> - [ ] до школи
>
> **Пояснення:** *das Spital* — лікарня (CH, AT). *Grüezi* — швейцарське привітання.

> [!listen] Як людина добирається на роботу?
> level: A2 · type: answer · speed: slow · id: dl-a2-10-l02
> audio: A: Wie kommst du zur Arbeit?
> audio: B: Mit dem Velo.
> - [ ] поїздом
> - [x] велосипедом
> - [ ] автобусом
> - [ ] пішки
>
> **Пояснення:** *das Velo* — велосипед (CH). У Німеччині сказали б *mit dem Fahrrad*.

> [!listen] Скільки це коштує?
> level: A2 · type: answer · speed: slow · id: dl-a2-10-l03
> audio: A: Wie viel kostet das?
> audio: B: Zwanzig Franken.
> - [ ] 12 франків
> - [x] 20 франків
> - [ ] 2 франки
> - [ ] 200 франків
>
> **Пояснення:** *zwanzig* — 20 (не *zwölf* — 12 і не *zwei*). *Franken* у множині не змінюється.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: dl-a2-10-l04
> audio: In der Schweiz spricht man vier Sprachen.
>
> **Пояснення:** *vier Sprachen* — чотири мови; *spricht man* — «говорять» (безособове *man*). Дієслово на другому місці: *In der Schweiz **spricht** man …*.

> [!listen] Новина про Швейцарію. Заповни нотатки.
> level: A2 · type: fill · speed: slow · id: dl-a2-10-l05
> audio: In der Schweiz gibt es sechsundzwanzig Kantone und vier Landessprachen: Deutsch, Französisch, Italienisch und Rätoromanisch.
>
> ```fill
> Kantone: [[26|sechsundzwanzig]]
> Landessprachen: [[4|vier]]
> ```
>
> **Пояснення:** *sechsundzwanzig* — 26: спочатку одиниці, потім десятки (*sechs-und-zwanzig*). *Rätoromanisch* — четверта національна мова.

## Вимова

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: dl-a2-10-s01
> text: Grüezi, ich suche das Spital.
> ipa: /ˈɡʁyɐ̯tsi ɪç ˈzuːxə das ʃpiˈtaːl/
> tip: Grüezi — ü [y], потім короткий [ɐ̯]; наголос на першому складі. Spital: sp- на початку слова = «шп»; наголос на другому складі.
> uk: Добрий день, я шукаю лікарню.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: dl-a2-10-s02
> text: Ich fahre mit dem Velo.
> ipa: /ɪç ˈfaːʁə mɪt deːm ˈveːlo/
> tip: Velo — v = [v], як «в»; довге [eː], наголос на першому складі. ich — [ç], як тихе «хь».
> uk: Я їжджу на велосипеді.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: dl-a2-10-s03
> text: Die Schweiz hat vier Landessprachen.
> ipa: /diː ʃvaɪ̯ts hat fiːɐ̯ ˈlandəsˌʃpʁaːxn̩/
> tip: Schweiz — sch [ʃ] + w [v] + ei [aɪ̯] + z [ts]. Landessprachen: sp- після -s = «шп», ch після a — [x].
> uk: У Швейцарії чотири національні мови.

## Типові помилки й пастки

> [!pitfall] Schweizerdeutsch — не те, що ти вчиш
> У німецькомовній Швейцарії в побуті говорять **Schweizerdeutsch** — діалектами, які сильно відрізняються від **Hochdeutsch**. Писемна мова — Hochdeutsch, тож читати й писати ти зможеш так само, як у Німеччині. Вчи Hochdeutsch, а Schweizerdeutsch сприймай як місцеву говірку — на слух вона може бути складною навіть для тих, хто добре знає німецьку.

> [!pitfall] У Швейцарії немає ß
> Швейцарець пише **Strasse**, **Fussball**, **gross**, а в Німеччині — *Straße, Fußball, groß*. Це не помилка, а правило швейцарського правопису (Duden: § 25 E2; Федеральна канцелярія). Через це деякі слова пишуться однаково: *Busse* означає і «штраф» (*Busse*), і «покаяння» (*Buße*) — значення видно з контексту.

> [!pitfall] Landessprache ≠ Amtssprache
> Чотири **Landessprachen** — це національні мови. Але **Amtssprachen** федерації — лише три: німецька, французька, італійська. Ретороманська — офіційна тільки для спілкування з її носіями. Тому не кажи, що «в Швейцарії чотири офіційні мови» без застережень: правильно — «чотири національні мови, з яких три — повністю офіційні».

> [!pitfall] Слова CH ≠ слова DE
> *Velo* — «велосипед», *Spital* — «лікарня», *Trottoir* — «тротуар», *parkieren* — «паркуватися». У Німеччині кажуть *Fahrrad, Krankenhaus, Gehweg, parken*. Це не помилки, а два нормативні варіанти: у Швейцарії вживай швейцарські слова, у Німеччині — німецькі. І *Bundesrat* у Швейцарії — **уряд**, а в Німеччині — орган земель.

## Landeskunde-Text

> [!example] Die Schweiz — vier Sprachen, viele Abstimmungen
> In der Schweiz gibt es vier Landessprachen: Deutsch, Französisch, Italienisch und Rätoromanisch. Die meisten Menschen sprechen Deutsch. Aber im Alltag sprechen sie meistens Schweizerdeutsch, einen Dialekt. Geschrieben wird meist Hochdeutsch. In der Schweiz schreibt man kein „ß“, sondern „ss“: Strasse, nicht Straße.
>
> Das Land hat 26 Kantone. Die Menschen in der Schweiz dürfen oft abstimmen. Wenn 100.000 Personen eine Idee unterschreiben, gibt es eine Volksabstimmung. Gegen ein neues Gesetz können 50.000 Personen ein Referendum verlangen. Der Nationalfeiertag ist am 1. August.
>
> *Слова:* *meistens* — здебільшого; *dürfen* — мати право; *unterschreiben* — підписати (unterschreibt · unterschrieb · hat unterschrieben); *verlangen* — вимагати; *der Alltag* — буденність.

> [!quiz] Lies den Text. Was sprechen die meisten Menschen in der Schweiz im Alltag?
> level: A2 · type: single · id: dl-a2-10-q02
> - [ ] Hochdeutsch wie in Berlin
> - [x] Schweizerdeutsch, einen Dialekt
> - [ ] Rätoromanisch
> - [ ] nur Französisch
>
> **Пояснення:** *Im Alltag sprechen sie meistens Schweizerdeutsch, einen Dialekt.* Hochdeutsch в основному пишуть (*Geschrieben wird meist Hochdeutsch*).

> [!quiz] Lies den Text. Wann gibt es eine Volksabstimmung?
> level: A2 · type: single · id: dl-a2-10-q03
> - [ ] Wenn 50 Personen eine Idee unterschreiben.
> - [x] Wenn 100.000 Personen eine Idee unterschreiben.
> - [ ] Jeden Sonntag.
> - [ ] Nur wenn der Bundesrat es will.
>
> **Пояснення:** *Wenn 100.000 Personen eine Idee unterschreiben, gibt es eine Volksabstimmung.* 50 000 підписів потрібно для референдуму проти закону, а не для ініціативи.

> [!quiz] Lies den Text. Wie schreibt man in der Schweiz „Straße“?
> level: A2 · type: single · id: dl-a2-10-q04
> - [ ] Straße
> - [ ] Strase
> - [x] Strasse
> - [ ] Strasze
>
> **Пояснення:** *In der Schweiz schreibt man kein „ß“, sondern „ss“: Strasse.*

## Практика

> [!quiz] Розстав події в правильному порядку — від найранішої
> level: A2 · type: order · id: dl-a2-10-q05
>
> ```text order
> Der Bundesbrief wird geschrieben (1291).
> Die Bundesverfassung wird angenommen (1848).
> Die erste Bundesfeier findet statt (1891).
> Rätoromanisch wird Landessprache (1938).
> ```
>
> **Пояснення:** 1291 → 1848 → 1891 → 1938. Перша Bundesfeier була на 600-річчя грамоти (1891), щорічною стала з 1899 року.

> [!quiz] Заповни пропуски словами з банку
> level: A2 · type: fill · id: dl-a2-10-q06 · bank: Fahrrad, Krankenhaus, Gehweg
>
> ```text fill
> In der Schweiz fährt man mit dem [[Velo]] zur Arbeit.
> Er liegt im [[Spital]].
> Auf dem [[Trottoir]] darf man nicht parkieren.
> Das kostet zwanzig [[Franken]].
> ```
>
> **Пояснення:** *Velo, Spital, Trottoir* — швейцарські слова. У Німеччині замість них *Fahrrad, Krankenhaus, Gehweg*, тож ці слова тут зайві. *Franken* — валюта; у множині не змінюється.

> [!quiz] Яку частку населення Швейцарії становлять люди, які назвали німецьку основною мовою (2024)?
> level: A2 · type: single · id: dl-a2-10-q07
> - [ ] близько 23 %
> - [ ] близько 8 %
> - [x] близько 61 %
> - [ ] майже 100 %
>
> **Пояснення:** за BFS 2024: німецька — 61 %, французька — 23 %, італійська — 8 %, ретороманська — 0,4 %.

> [!quiz] Які слова — швейцарські (CH)? Обери всі правильні відповіді.
> level: A2 · type: multi · id: dl-a2-10-q08
> - [x] das Velo
> - [x] parkieren
> - [x] das Spital
> - [ ] das Fahrrad
> - [ ] das Krankenhaus
>
> **Пояснення:** *Velo, parkieren, Spital* — швейцарські (Spital також австрійське). *Fahrrad* і *Krankenhaus* — німецькі відповідники.

> [!quiz] Що означає Röstigraben?
> level: A2 · type: single · id: dl-a2-10-q09
> - [ ] справжній рів навколо міста
> - [x] жартівлива назва межі між німецько- й франкомовною Швейцарією
> - [ ] швейцарська страва з сиру
> - [ ] назву кантону
>
> **Пояснення:** *Rösti* — страва з картоплі, *Graben* — рів. Слово жартівливо описує культурну й мовну межу між частинами країни.

> [!quiz] Що відбувається, якщо за 100 днів після публікації нового закону зібрано 50 000 підписів?
> level: A2 · type: single · id: dl-a2-10-q10
> - [ ] Закон одразу скасовують.
> - [x] Проводять референдум, і закон набуває чинності, лише якщо більшість проголосує «за».
> - [ ] Бундесрат автоматично змінює закон.
> - [ ] Нічого, потрібно 100 000 підписів.
>
> **Пояснення:** це факультативний референдум. 100 000 підписів і 18 місяців — для Volksinitiative, а не для референдуму.

## Фішки

> [!reel] 🗣 Четверта мова
> Ретороманська стала національною мовою Швейцарії після голосування 1938 року. Офіційною мовою федерації вона є з 1996 року, але лише для спілкування з її носіями — і це лише близько 0,4 % населення.

> [!reel] 🎆 Свято, якого не було в 1291-му
> Bundesbrief датовано початком серпня 1291 року, але перша Bundesfeier відбулася лише 1891 року — на 600-річчя. Щорічною стала з 1899-го. Історики сьогодні вважають грамоту 1291 року не «актом заснування», а регіональним мирним союзом.

> [!reel] 🥔 Рьоштіграбен
> *Röstigraben* — жартівливе слово для межі між німецько- й франкомовною Швейцарією. Duden позначає його як «schweizerisch scherzhaft». Рьошті — смажена картопля, яку люблять у німецькомовній частині.

> [!reel] ✏ Busse чи Buße?
> Оскільки в Швейцарії не пишуть ß, слова *Busse* («штраф») і *Buße* («покаяння») там пишуться однаково. Цей приклад наводить керівництво Федеральної канцелярії з правопису.

> [!reel] 📅 90 днів стало 100
> Строк, за який можна зібрати підписи для референдуму, 1996 року збільшили з 90 до 100 днів. Відтоді діє правило «50 000 підписів за 100 днів».

## Джерела та що почитати

- ch.ch — [Was ist eine Volksinitiative?](https://www.ch.ch/de/abstimmungen-und-wahlen/initiativen/was-ist-eine-eidgenossische-volksinitiative/) (100 000 підписів за 18 місяців) і [Das Referendum in der Schweiz](https://www.ch.ch/de/abstimmungen-und-wahlen/referendum/) (50 000 підписів за 100 днів); [Wie lanciert man eine Volksinitiative?](https://www.ch.ch/de/demokratie/politische-rechte/volksinitiative/timelinevolksinitiative); [Wie ergreift man das fakultative Referendum?](https://www.ch.ch/de/demokratie/politische-rechte/fakultatives-referendum/wie-ergreift-man-auf-bundesebene-das-fakultative-referendum/).
- Bundesamt für Statistik (BFS) — [Sprachen](https://www.bfs.admin.ch/bfs/de/home/statistiken/bevoelkerung/sprachen-religionen/sprachen.html) (дані за 2024 рік) і [Die 26 Kantone und Hauptorte der Schweiz](https://www.bfs.admin.ch/asset/de/1031487).
- Historisches Lexikon der Schweiz — [Rätoromanisch](https://hls-dhs-dss.ch/de/articles/024594/2012-06-19/) (1938, 1996), [Bundesfeier](https://hls-dhs-dss.ch/articles/017438/2011-03-16/) (1891, 1899), [Befreiungstradition](https://hls-dhs-dss.ch/de/articles/017474/) і [Eidgenossenschaft](https://hls-dhs-dss.ch/de/articles/026413/).
- Schweizerisches Bundesarchiv — [Die Eidgenossenschaft vor 1798](https://www.bar.admin.ch/de/die-eidgenossenschaft-vor-1798); Parlament — [Bundesverfassung 1848 im Bundesblatt 1849](https://www.parlament.ch/centers/documents/de/Bundesverfassung%20im%20ersten%20Bundesblatt%20von%201849_105x180_D_231128.pdf) (PDF).
- Bundeskanzlei — [Rechtschreibleitfaden](https://www.bk.admin.ch/dam/bk/de/dokumente/sprachdienste/sprachdienst_de/rechtschreibleitfaden-2017.pdf.download.pdf/rechtschreibleitfaden-2017.pdf) (PDF) і [Der Bund kurz erklärt 2026](https://www.bk.admin.ch/dam/de/sd-web/B74oYqykWJXb/Der%20Bund%20kurz%20erkl%C3%A4rt%202026.pdf) (PDF).
- Duden — [Röstigraben](https://www.duden.de/rechtschreibung/Roestigraben), [Velo](https://www.duden.de/rechtschreibung/Velo), [Spital](https://www.duden.de/rechtschreibung/Spital), [Trottoir](https://www.duden.de/rechtschreibung/Trottoir), [parkieren](https://www.duden.de/rechtschreibung/parkieren), [Znüni](https://www.duden.de/rechtschreibung/Znueni), [Volksabstimmung](https://www.duden.de/rechtschreibung/Volksabstimmung), [Landessprache](https://www.duden.de/rechtschreibung/Landessprache); DWDS — [Grüezi](https://www.dwds.de/wb/Gr%C3%BCezi), [Kanton](https://www.dwds.de/wb/Kanton).

> [!important] Підсумок
> - **Vier Landessprachen:** Deutsch (61 %), Französisch (23 %), Italienisch (8 %), Rätoromanisch (0,4 %) — BFS 2024; Amtssprachen федерації — три, ретороманська лише з її носіями.
> - **Schweizerdeutsch** — діалекти для розмови (*Mundart*), **Hochdeutsch** — для письма й школи; у Швейцарії **ss** замість **ß**.
> - **Volksinitiative:** 100 000 підписів / 18 місяців; **Referendum** проти закону: 50 000 / 100 днів; **Volksabstimmung** вирішує більшість.
> - 26 **Kantone**, **Bundesrat** — уряд; **Bundesbrief** 1291, **Bundesverfassung** 1848, **1. August** — національне свято.
> - Слова CH: *Grüezi, Velo, Spital, Trottoir, parkieren, Franken, Znüni*.
