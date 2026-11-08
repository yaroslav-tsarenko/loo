---
title: Словотвір III — фахові складні слова, be-, ent-, er-, -ismus
id: de-c1-wortbildung
level: C1
icon: px:blocks
tags: [deutsch, c1, vocabulary, wortbildung, praefixe, komposita, fachsprache, ismus]
prerequisites: ["[[Deutsch - B2 - 24. Словотвір II — un-, miss-, ver-, zer- і -los, -haft, -mäßig]]", "[[Deutsch - C1 - 14. Мова науки — лексика для університету]]"]
estimatedMinutes: 50
---

# Словотвір III — фахові складні слова, be-, ent-, er-, -ismus

> [!success] Після цієї теми ти зможеш
> - розбирати довгі фахові **Komposita** справа наліво: *Kraftfahrzeughaftpflichtversicherung → Versicherung (gegen) Haftpflicht (für) Kraftfahrzeuge*;
> - розуміти три головні значення префіксів **be-** (зробити перехідним; «забезпечити чимось»), **ent-** (прибрати, скасувати) і **er-** (стати яким; досягти результату);
> - утворювати й розпізнавати слова на **-ismus**, **-ität**, **-abel / -ibel**, **-ieren** і знати їхній рід;
> - здогадуватися про значення незнайомого слова з його частин — головна навичка для TestDaF, DSH і фахових текстів.

## Передбач

> [!quiz] Ти бачиш у листі незнайоме слово *entkalken*. Що воно, найімовірніше, означає?
> level: C1 · type: single · id: de-c1-wortbildung-q01
> - [ ] додати вапно
> - [x] видалити накип / вапно
> - [ ] нагріти до високої температури
> - [ ] перевірити на вапно
>
> **Пояснення:** *der Kalk* — вапно, накип; префікс **ent-** часто означає «прибрати те, що назване коренем»: *entkalken* — видаляти накип (*die Kaffeemaschine entkalken*). Так само *entgiften* — виводити отруту, *entwaffnen* — роззброювати.

## Пояснення

### Складні слова: читай справа наліво

Німецьке складне слово (*Kompositum*) має **Grundwort** — останню частину, яка дає рід, множину й основне значення, — і одне чи кілька **Bestimmungswörter** ліворуч, що уточнюють. Між частинами часто стоїть **Fugenelement** (*-s-, -es-, -n-, -en-, -er-*): *Arbeit**s**markt, Sonne**n**schein, Kind**er**garten*. Про основи — у [[Deutsch - B1 - 23. Словотвір I — складні слова й суфікси]].

> [!diagram] Як розібрати Kraftfahrzeughaftpflichtversicherung
> ```yaml
> layout: flow
> nodes:
>   - { id: v, label: "1 · Grundwort", text: "die Versicherung", note: "що це? → страхування; рід die", tone: yellow }
>   - { id: h, label: "2 · Bestimmungswort", text: "die Haftpflicht", note: "яке? → від відповідальності перед іншими", tone: pink }
>   - { id: k, label: "3 · Bestimmungswort", text: "das Kraftfahrzeug", note: "для чого? → для автомобіля", tone: gray }
>   - { id: r, label: "4 · разом", text: "die Kraftfahrzeughaftpflichtversicherung", note: "автоцивілка; скорочено Kfz-Haftpflicht", tone: yellow }
> edges:
>   - { from: v, to: h, label: "←" }
>   - { from: h, to: k, label: "←" }
>   - { from: k, to: r, label: "=" }
> steps:
>   - { focus: v, note: "Почни з кінця: останнє слово — Versicherung. Отже, це страхування, рід die, множина die …versicherungen." }
>   - { focus: h, note: "Ліворуч — Haftpflicht: обовʼязок відшкодувати шкоду, заподіяну іншим. Haftpflichtversicherung — страхування цивільної відповідальності." }
>   - { focus: k, note: "Ще лівіше — Kraftfahrzeug (Kfz): транспортний засіб з двигуном. Це уточнює, ЧИЮ відповідальність страхують." }
>   - { focus: r, note: "Разом: обовʼязкове страхування цивільної відповідальності власника авто — українська «автоцивілка». У житті: die Kfz-Haftpflicht." }
> ```
> Блоки пронумеровано в порядку розбору; кольори лише розділяють кроки.

| Складне слово | Розбір справа наліво | Значення |
|---|---|---|
| *die Datenverarbeitung* | Verarbeitung von Daten | обробка даних |
| *die Betriebskostenabrechnung* | Abrechnung der Betriebskosten | розрахунок комунальних витрат |
| *der Wirkungsgrad* | Grad der Wirkung | ККД, коефіцієнт корисної дії |
| *die Lebensmittelüberwachung* | Überwachung von Lebensmitteln | контроль харчових продуктів |
| *der Datenschutzbeauftragte* | Beauftragter für Datenschutz | уповноважений із захисту даних |

> [!tip] Бінарний розбір і дефіс
> Довге слово ділять **на дві частини** (головний шов), а потім кожну — далі: *Lebensmittel | überwachung*, а не *Lebens | mittelüberwachung*. Щоб полегшити читання, правопис дозволяє **дефіс** у довгих і неочевидних словах (*Kfz-Haftpflicht, Mehrzweck-Halle*), а при збігу трьох однакових літер дає вибір: *Schifffahrt* або *Schiff-Fahrt*.

### Префікс be-

| Значення | Як утворюється | Приклади |
|---|---|---|
| **робить дієслово перехідним** (обʼєкт — в Akkusativ) | *auf etwas bauen → etwas bebauen*; *an jemanden liefern → jemanden beliefern* | *ein Grundstück bebauen*, *Kunden beliefern*, *Fragen beantworten* |
| **«забезпечити чимось»** (від іменника) | *das Grün → begrünen*; *die Schrift → beschriften*; *das Wasser → bewässern*; *der Zuschuss → bezuschussen*; *der Urlaub → beurlauben* | *Dächer begrünen*, *Kisten beschriften*, *Felder bewässern*, *einen Beamten beurlauben* |
| **поводитися як / ставитися як** | *der Vormund → bevormunden*; *die Mutter → bemuttern* | *Bürger bevormunden*, *die Kinder bemuttern* |

*be-* — **невідокремлюваний**, без наголосу, без *ge-* у Partizip II: *begrünt, beschriftet*.

### Префікс ent-

| Значення | Приклади |
|---|---|
| **прибрати / позбавити** того, що в корені | *entkalken* (Kalk), *entwässern* (Wasser), *entgiften* (Gift), *entwaffnen* (Waffe), *entmachten* (Macht), *entwerten* (Wert), *entschärfen* (scharf) |
| **протилежна дія, «роз-»** | *entschlüsseln* (≠ verschlüsseln), *entlasten* (≠ belasten), *entfremden* (від fremd) |
| **початок, віддалення** (старі слова) | *entstehen, entfliehen, entbrennen* |

Пара **be- / ent-** дуже продуктивна: *belasten ↔ entlasten*, *bewaffnen ↔ entwaffnen*, *bewässern ↔ entwässern*. *ent-* теж невідокремлюваний: *entkalkt, entlastet*. Перед *f* часто стає **emp-**: *empfehlen, empfangen, empfinden*.

### Префікс er-

| Значення | Від чого | Приклади |
|---|---|---|
| **стати яким** (поступова зміна, часто з *sein* у Perfekt) | прикметник | *blind → erblinden*, *müde → ermüden*, *rot → erröten*, *grau → ergrauen*, *kalt → erkalten*, *stark → erstarken* |
| **зробити яким** (каузатив) | прикметник у вищому ступені / прикметник | *schwer → erschweren*, *leicht → erleichtern*, *möglich → ermöglichen* |
| **досягти результату дією** | дієслово | *arbeiten → erarbeiten*, *steigern → ersteigern*, *kämpfen → erkämpfen*, *fragen → erfragen* |

> [!important] Що запамʼятати про be-, ent-, er-
> Усі три префікси **невідокремлювані й ненаголошені**, Partizip II — без *ge-* (*begrünt, entkalkt, erleichtert*). Значення — **тенденції**, не закони: *bekommen* — не «зробити перехідним» і не «отримати чимось», а просто «отримати»; *erzählen* не «стати яким». Тож правило допомагає здогадатися, але перевіряй у словнику.

### Суфікси іншомовних слів

| Суфікс | Рід / частина мови | Приклади | Пастка |
|---|---|---|---|
| **-ismus** | *der*, мн. *-ismen* | *der Pluralismus, der Pragmatismus, der Journalismus, der Egoismus, der Extremismus* | наголос на -is-; особа — *-ist* (*der Journalist*) |
| **-ität** | *die*, мн. *-täten* | *die Mobilität, die Komplexität, die Qualität* | укр. «-ість»: мобільність, складність |
| **-ation / -ion** | *die*, мн. *-en* | *die Kommunikation, die Information* | дієслова на *-ieren* дають і *-ation*, і *-ierung* (*die Digitalisierung*) |
| **-abel / -ibel** | прикметник | *praktikabel, kompatibel, flexibel* | перед закінченням *-e-* випадає: *ein praktikabler Plan* |
| **-ieren** | дієслово | *optimieren, digitalisieren* | без *ge-*: *optimiert* |

## Приклади

- *Viele Städte wollen Dächer begrünen, um die Hitze zu verringern.* — Багато міст хочуть озеленити дахи, щоб зменшити спеку.
- *Das Grundstück darf nur zur Hälfte bebaut werden.* — Ділянку можна забудувати лише наполовину.
- *Die Kommune bezuschusst den Kauf von Lastenrädern.* — Громада доплачує за купівлю вантажних велосипедів.
- *Die neue Regelung soll die Pflegekräfte entlasten.* — Нове правило має розвантажити працівників догляду.
- *Experten haben den Code innerhalb weniger Tage entschlüsselt.* — Експерти розшифрували код за кілька днів.
- *Der Konflikt wurde durch Gespräche entschärft.* — Конфлікт помʼякшили завдяки переговорам.
- *Die Bürokratie erschwert vielen Gründern den Start.* — Бюрократія ускладнює старт багатьом засновникам.
- *Das Stipendium ermöglicht ihr ein Studium in Leipzig.* — Стипендія дає їй змогу вчитися в Лейпцигу.
- *Nach dem Unfall erblindete er auf einem Auge.* — Після аварії він осліп на одне око.
- *Pluralismus bedeutet, dass verschiedene Meinungen nebeneinander bestehen.* — Плюралізм означає, що різні думки існують поруч.
- *Der Wirkungsgrad moderner Wärmepumpen ist hoch.* — Коефіцієнт корисної дії сучасних теплових насосів високий.

## Слова

### Терміни словотвору

> [!word] das Grundwort
> ipa: /ˈɡʁʊntvɔʁt/ · pos: noun · level: C1 · id: de-c1-wortbildung-w01
> uk: основне (опорне) слово складного слова
> forms: die Grundwörter
> example: Das **Grundwort** bestimmt das Genus des Kompositums. — Опорне слово визначає рід складного слова.
> note: остання частина: bei «Haustür» ist «Tür» das Grundwort. Пара: das Bestimmungswort.

> [!word] das Bestimmungswort
> ipa: /bəˈʃtɪmʊŋsˌvɔʁt/ · pos: noun · level: C1 · id: de-c1-wortbildung-w02
> uk: означальне слово (ліва частина складного слова)
> forms: die Bestimmungswörter
> example: «Haus» ist das **Bestimmungswort** in «Haustür». — «Haus» — означальне слово в «Haustür».
> note: уточнює Grundwort: Welche Tür? — die Haustür. Може саме бути складним: Lebensmittel|überwachung.

> [!word] das Fugenelement
> ipa: /ˈfuːɡn̩ʔeleˌmɛnt/ · pos: noun · level: C1 · id: de-c1-wortbildung-w03
> uk: сполучний елемент (між частинами складного слова)
> forms: die Fugenelemente
> example: In «Arbeitsmarkt» ist das «s» ein **Fugenelement**. — В «Arbeitsmarkt» «s» — сполучний елемент.
> note: -s-, -es-, -n-, -en-, -er-, -e-. Часто «Fugen-s». Правила лише тенденції: після -ung, -heit, -keit, -ion майже завжди -s-.

> [!word] das Kurzwort
> ipa: /ˈkʊʁtsvɔʁt/ · pos: noun · level: C1 · id: de-c1-wortbildung-w04
> uk: скорочене слово (абревіатура, усічення)
> forms: die Kurzwörter
> example: «Kfz» und «Uni» sind **Kurzwörter**. — «Kfz» і «Uni» — скорочені слова.
> note: рід — від повного слова: das Kfz (das Kraftfahrzeug), die Uni (die Universität). Пор. die Abkürzung (скорочення на письмі, z. B.).

### be-

> [!word] begrünen
> ipa: /bəˈɡʁyːnən/ · pos: verb · level: C1 · id: de-c1-wortbildung-w05
> uk: озеленювати
> forms: begrünen → begrünte → hat begrünt
> example: Die Stadt will mehr Fassaden **begrünen**. — Місто хоче озеленити більше фасадів.
> note: das Grün → begrünen («забезпечити зеленню»). Іменник die Begrünung: Dachbegrünung.

> [!word] bebauen
> ipa: /bəˈbaʊ̯ən/ · pos: verb · level: C1 · id: de-c1-wortbildung-w06
> uk: забудовувати; обробляти (поле)
> forms: bebauen → bebaute → hat bebaut
> example: Das Gelände soll mit Wohnungen **bebaut** werden. — Територію мають забудувати житлом.
> note: auf einem Grundstück bauen → ein Grundstück bebauen (обʼєкт в Akk). Іменник der Bebauungsplan.

> [!word] beleuchten
> ipa: /bəˈlɔʏ̯çtn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w07
> uk: освітлювати; розглядати (питання)
> forms: beleuchten → beleuchtete → hat beleuchtet
> example: Der Artikel **beleuchtet** die Folgen für Familien. — Стаття розглядає наслідки для сімей.
> note: пряме: eine Straße beleuchten. Переносне в наукових текстах: ein Thema von allen Seiten beleuchten.

> [!word] beschriften
> ipa: /bəˈʃʁɪftn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w08
> uk: підписувати, наносити надпис
> forms: beschriften → beschriftete → hat beschriftet
> example: Bitte **beschriften** Sie alle Kartons. — Будь ласка, підпишіть усі коробки.
> note: die Schrift → beschriften. Іменник die Beschriftung (напис, підпис до схеми).

> [!word] bewässern
> ipa: /bəˈvɛsɐn/ · pos: verb · level: C1 · id: de-c1-wortbildung-w09
> uk: зрошувати, поливати
> forms: bewässern → bewässerte → hat bewässert
> example: Wegen der Dürre müssen die Felder **bewässert** werden. — Через посуху поля треба зрошувати.
> note: das Wasser → bewässern. Протилежне: entwässern. Іменник die Bewässerung.

> [!word] beliefern
> ipa: /bəˈliːfɐn/ · pos: verb · level: C1 · id: de-c1-wortbildung-w10
> uk: постачати (комусь)
> forms: beliefern → belieferte → hat beliefert
> example: Die Firma **beliefert** Supermärkte in ganz Bayern. — Фірма постачає товари в супермаркети по всій Баварії.
> note: an jemanden liefern → jemanden beliefern (обʼєкт — отримувач у Akk). Пор. liefern + Akk (що) + an (кому).

> [!word] bezuschussen
> ipa: /bəˈtsuːʃʊsn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w11
> uk: надавати субсидію, доплачувати
> forms: bezuschussen → bezuschusste → hat bezuschusst
> example: Das Land **bezuschusst** den Einbau von Solaranlagen. — Земля доплачує за встановлення сонячних панелей.
> note: der Zuschuss → bezuschussen. Типово для мови адміністрації. Простіше: fördern, unterstützen.

> [!word] beziffern
> ipa: /bəˈtsɪfɐn/ · pos: verb · level: C1 · id: de-c1-wortbildung-w12
> uk: оцінювати в цифрах, обчислювати
> forms: beziffern → bezifferte → hat beziffert
> example: Der Schaden wird auf drei Millionen Euro **beziffert**. — Збитки оцінюють у три мільйони євро.
> note: die Ziffer → beziffern. Часто пасив: wird auf … beziffert. sich beziffern auf + Akk — становити.

> [!word] bevormunden
> ipa: /bəˈfoːɐ̯mʊndn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w13
> uk: опікати (надмірно), ставитися як до недієздатного
> forms: bevormunden → bevormundete → hat bevormundet
> example: Viele Bürger fühlen sich vom Staat **bevormundet**. — Багато громадян відчувають надмірну опіку держави.
> note: der Vormund (опікун) → bevormunden. Завжди з критикою. Іменник die Bevormundung.

> [!word] beurlauben
> ipa: /bəˈʔuːɐ̯laʊ̯bn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w14
> uk: надати відпустку; тимчасово відсторонити (від посади)
> forms: beurlauben → beurlaubte → hat beurlaubt
> example: Der Trainer wurde bis zur Klärung **beurlaubt**. — Тренера відсторонили до зʼясування обставин.
> note: der Urlaub → beurlauben. В офіційних новинах часто означає «відсторонити». Твердий приступ після be-.

### ent-

> [!word] entkalken
> ipa: /ɛntˈkalkn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w15
> uk: видаляти накип
> forms: entkalken → entkalkte → hat entkalkt
> example: Die Kaffeemaschine muss regelmäßig **entkalkt** werden. — Кавоварку треба регулярно чистити від накипу.
> note: der Kalk → entkalken. Засіб: der Entkalker. Типова побутова інструкція.

> [!word] entschlüsseln
> ipa: /ɛntˈʃlʏsl̩n/ · pos: verb · level: C1 · id: de-c1-wortbildung-w16
> uk: розшифровувати
> forms: entschlüsseln → entschlüsselte → hat entschlüsselt
> example: Forscher haben das Genom **entschlüsselt**. — Дослідники розшифрували геном.
> note: der Schlüssel → verschlüsseln (шифрувати) ↔ entschlüsseln. Іменник die Entschlüsselung.

> [!word] entlasten
> ipa: /ɛntˈlastn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w17
> uk: розвантажувати, полегшувати (тягар); виправдовувати
> forms: entlasten → entlastete → hat entlastet
> example: Die Reform soll Familien finanziell **entlasten**. — Реформа має фінансово розвантажити сімʼї.
> note: протилежне: belasten. У суді: Der Zeuge entlastet den Angeklagten — свідок свідчить на користь обвинуваченого.

> [!word] entwässern
> ipa: /ɛntˈvɛsɐn/ · pos: verb · level: C1 · id: de-c1-wortbildung-w18
> uk: осушувати, відводити воду
> forms: entwässern → entwässerte → hat entwässert
> example: Früher wurden viele Moore **entwässert**. — Раніше багато боліт осушили.
> note: протилежне: bewässern. Іменник die Entwässerung (каналізація, дренаж).

> [!word] entgiften
> ipa: /ɛntˈɡɪftn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w19
> uk: знешкоджувати, виводити отруту; детоксикувати
> forms: entgiften → entgiftete → hat entgiftet
> example: Die Leber **entgiftet** den Körper. — Печінка виводить токсини з організму.
> note: das Gift → entgiften. Медичне: die Entgiftung (також лікування залежності).

> [!word] entmachten
> ipa: /ɛntˈmaxtn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w20
> uk: позбавляти влади
> forms: entmachten → entmachtete → hat entmachtet
> example: Der Präsident wurde durch das Militär **entmachtet**. — Президента позбавила влади армія.
> note: die Macht → entmachten. Часте в історичних текстах. Іменник die Entmachtung.

> [!word] entwerten
> ipa: /ɛntˈveːɐ̯tn̩/ · pos: verb · level: B2 · id: de-c1-wortbildung-w21
> uk: знецінювати; компостувати (квиток)
> forms: entwerten → entwertete → hat entwertet
> example: Bitte **entwerten** Sie Ihre Fahrkarte vor der Fahrt. — Будь ласка, закомпостуйте квиток перед поїздкою.
> note: der Wert → entwerten. Побут: der Entwerter (компостер). Економіка: Die Inflation entwertet das Geld.

> [!word] entschärfen
> ipa: /ɛntˈʃɛʁfn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w22
> uk: знешкоджувати (бомбу); помʼякшувати (конфлікт)
> forms: entschärfen → entschärfte → hat entschärft
> example: In Köln wurde eine Fliegerbombe **entschärft**. — У Кельні знешкодили авіабомбу.
> note: scharf → entschärfen. Переносно: einen Streit / eine Formulierung entschärfen. Знешкодження бомб з часів Другої світової — регулярна новина в Німеччині.

> [!word] entwaffnen
> ipa: /ɛntˈvafnən/ · pos: verb · level: C1 · id: de-c1-wortbildung-w23
> uk: роззброювати; обеззброювати (переносно)
> forms: entwaffnen → entwaffnete → hat entwaffnet
> example: Ihr Lächeln war **entwaffnend**. — Її усмішка обеззброювала.
> note: die Waffe → entwaffnen ↔ bewaffnen. Часто Partizip I як прикметник: entwaffnend ehrlich.

> [!word] entfremden
> ipa: /ɛntˈfʁɛmdn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w24
> uk: віддаляти, відчужувати
> forms: entfremden → entfremdete → hat entfremdet
> example: Die beiden Brüder haben sich über die Jahre **entfremdet**. — З роками брати віддалилися одне від одного.
> note: fremd → entfremden; зазвичай sich entfremden (von + Dat). Філософський термін: die Entfremdung (Marx).

### er-

> [!word] erblinden
> ipa: /ɛɐ̯ˈblɪndn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w25
> uk: осліпнути
> forms: erblinden → erblindete → ist erblindet
> example: Unbehandelt kann die Krankheit zum **Erblinden** führen. — Без лікування хвороба може призвести до сліпоти.
> note: blind → erblinden («стати сліпим»). Perfekt із sein, бо це зміна стану.

> [!word] ermüden
> ipa: /ɛɐ̯ˈmyːdn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w26
> uk: втомлюватися; втомлювати
> forms: ermüden → ermüdete → ist / hat ermüdet
> example: Lange Sitzungen **ermüden** alle Beteiligten. — Довгі засідання втомлюють усіх учасників.
> note: неперехідне (стати втомленим) — із sein; перехідне (втомлювати когось) — із haben. Прикметник ermüdend.

> [!word] erröten
> ipa: /ɛɐ̯ˈʁøːtn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w27
> uk: почервоніти (від сорому)
> forms: erröten → errötete → ist errötet
> example: Bei dem Kompliment **errötete** sie. — Від компліменту вона почервоніла.
> note: rot → erröten, з умлаутом. Книжне; розмовно: rot werden.

> [!word] ergrauen
> ipa: /ɛɐ̯ˈɡʁaʊ̯ən/ · pos: verb · level: C1 · id: de-c1-wortbildung-w28
> uk: сивіти
> forms: ergrauen → ergraute → ist ergraut
> example: Mit vierzig war er schon völlig **ergraut**. — У сорок він був уже зовсім сивий.
> note: grau → ergrauen. Розмовно: graue Haare bekommen. Perfekt із sein.

> [!word] erkalten
> ipa: /ɛɐ̯ˈkaltn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w29
> uk: охолонути, вистигнути (і переносно)
> forms: erkalten → erkaltete → ist erkaltet
> example: Die Lava ist längst **erkaltet**. — Лава давно вистигла.
> note: kalt → erkalten. Переносно: Ihre Freundschaft erkaltete. Не плутай з sich erkälten (застудитися).

> [!word] erstarken
> ipa: /ɛɐ̯ˈʃtaʁkn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w30
> uk: зміцніти, посилитися
> forms: erstarken → erstarkte → ist erstarkt
> example: Die Bewegung ist in den letzten Jahren **erstarkt**. — Рух за останні роки посилився.
> note: stark → erstarken. Книжне й публіцистичне; частіше про політичні сили. Нейтрально: stärker werden.

> [!word] erschweren
> ipa: /ɛɐ̯ˈʃveːʁən/ · pos: verb · level: C1 · id: de-c1-wortbildung-w31
> uk: ускладнювати
> forms: erschweren → erschwerte → hat erschwert
> example: Der Nebel **erschwert** die Suche. — Туман ускладнює пошуки.
> note: schwer → erschweren («робити важчим»). Іменник die Erschwernis. Протилежне: erleichtern.

> [!word] erleichtern
> ipa: /ɛɐ̯ˈlaɪ̯çtɐn/ · pos: verb · level: B2 · id: de-c1-wortbildung-w32
> uk: полегшувати
> forms: erleichtern → erleichterte → hat erleichtert
> example: Die App **erleichtert** die Anmeldung. — Застосунок полегшує реєстрацію.
> note: від leichter (вищий ступінь): er- + leichter + -n. Erleichtert sein — відчувати полегшення.

> [!word] ermöglichen
> ipa: /ɛɐ̯ˈmøːklɪçn̩/ · pos: verb · level: B2 · id: de-c1-wortbildung-w33
> uk: уможливлювати, давати змогу
> forms: ermöglichen → ermöglichte → hat ermöglicht
> example: Das Stipendium **ermöglicht** ihr ein Auslandssemester. — Стипендія дає їй змогу провести семестр за кордоном.
> note: jemandem etwas ermöglichen (кому — Dat, що — Akk). g перед l — [k].

> [!word] erarbeiten
> ipa: /ɛɐ̯ˈʔaʁbaɪ̯tn̩/ · pos: verb · level: C1 · id: de-c1-wortbildung-w34
> uk: опрацювати, виробити (працею); заробити
> forms: erarbeiten → erarbeitete → hat erarbeitet
> example: Die Gruppe hat ein Konzept **erarbeitet**. — Група розробила концепцію.
> note: arbeiten → erarbeiten («досягти працею»). sich etwas erarbeiten — здобути працею (Wohlstand, Respekt). ʔ після er-.

### -ismus

> [!word] der Pluralismus
> ipa: /pluʁaˈlɪsmʊs/ · pos: noun · level: C1 · id: de-c1-wortbildung-w35
> uk: плюралізм
> forms: — (без множини)
> example: Eine Demokratie lebt vom **Pluralismus**. — Демократія тримається на плюралізмі.
> note: прикметник pluralistisch. -ismus → der, наголос на -lis-.

> [!word] der Pragmatismus
> ipa: /pʁaɡmaˈtɪsmʊs/ · pos: noun · level: C1 · id: de-c1-wortbildung-w36
> uk: прагматизм
> forms: — (без множини)
> example: Mit viel **Pragmatismus** fand das Team eine Lösung. — Завдяки прагматизму команда знайшла рішення.
> note: прикметник pragmatisch; особа der Pragmatiker. У німецькій часто похвала.

> [!word] der Journalismus
> ipa: /ʒʊʁnaˈlɪsmʊs/ · pos: noun · level: C1 · id: de-c1-wortbildung-w37
> uk: журналістика
> forms: — (без множини)
> example: Unabhängiger **Journalismus** braucht eine stabile Finanzierung. — Незалежна журналістика потребує стабільного фінансування.
> note: J — [ʒ], як «ж». Особа: der Journalist (-ist). Пор. укр. «журналістика» — інший суфікс.

> [!word] der Egoismus
> ipa: /eɡoˈɪsmʊs/ · pos: noun · level: C1 · id: de-c1-wortbildung-w38
> uk: егоїзм
> forms: die Egoismen
> example: Hinter der Entscheidung steckt reiner **Egoismus**. — За рішенням стоїть чистий егоїзм.
> note: особа: der Egoist; прикметник egoistisch. Множина можлива: nationale Egoismen.

> [!word] der Extremismus
> ipa: /ɛkstʁeˈmɪsmʊs/ · pos: noun · level: C1 · id: de-c1-wortbildung-w39
> uk: екстремізм
> forms: die Extremismen
> example: Der Bericht untersucht verschiedene Formen von **Extremismus**. — Звіт досліджує різні форми екстремізму.
> note: особа: der Extremist; прикметник extremistisch. Термін Verfassungsschutz: Rechts-, Links-, islamistischer Extremismus.

### Латинські суфікси

> [!word] die Mobilität
> ipa: /mobiliˈtɛːt/ · pos: noun · level: C1 · id: de-c1-wortbildung-w40
> uk: мобільність; пересування (транспорт)
> forms: — (без множини)
> example: Die **Mobilität** der Zukunft ist elektrisch und vernetzt. — Мобільність майбутнього — електрична й мережева.
> note: -ität → die (тенденція). У політиці часто = транспорт: die Mobilitätswende.

> [!word] die Komplexität
> ipa: /kɔmplɛksiˈtɛːt/ · pos: noun · level: C1 · id: de-c1-wortbildung-w41
> uk: складність, комплексність
> forms: die Komplexitäten (рідко)
> example: Die **Komplexität** des Problems wird oft unterschätzt. — Складність проблеми часто недооцінюють.
> note: від komplex. x = [ks]. Наголос на -tät.

> [!word] kompatibel
> ipa: /kɔmpaˈtiːbl̩/ · pos: adj · level: C1 · id: de-c1-wortbildung-w42
> uk: сумісний
> example: Das Ladegerät ist mit allen Modellen **kompatibel**. — Зарядний пристрій сумісний з усіма моделями.
> note: kompatibel mit + Dat. При відмінюванні e випадає: ein kompatibles Gerät. Іменник die Kompatibilität.

> [!word] praktikabel
> ipa: /pʁaktiˈkaːbl̩/ · pos: adj · level: C1 · id: de-c1-wortbildung-w43
> uk: здійсненний, придатний на практиці
> example: Der Vorschlag ist gut, aber kaum **praktikabel**. — Пропозиція добра, але навряд чи здійсненна.
> note: e випадає: eine praktikable Lösung. Не плутай з praktisch (зручний) і das Praktikum (практика).

> [!word] optimieren
> ipa: /ɔptiˈmiːʁən/ · pos: verb · level: C1 · id: de-c1-wortbildung-w44
> uk: оптимізувати
> forms: optimieren → optimierte → hat optimiert
> example: Wir müssen die Abläufe **optimieren**. — Нам треба оптимізувати процеси.
> note: -ieren: без ge-. Іменник die Optimierung (не «Optimation»). Розмовно-іронічно: die Selbstoptimierung.

### Фахові складні слова

> [!word] das Kraftfahrzeug
> ipa: /ˈkʁaftfaːɐ̯ˌtsɔʏ̯k/ · pos: noun · level: C1 · id: de-c1-wortbildung-w45
> uk: автотранспортний засіб (офіц.)
> forms: die Kraftfahrzeuge
> example: Für jedes **Kraftfahrzeug** ist eine Haftpflichtversicherung Pflicht. — Для кожного автотранспортного засобу обовʼязкове страхування відповідальності.
> note: скорочення das Kfz [kaː ʔɛf ˈtsɛt]. die Kraft + fahren + das Zeug. У побуті: das Auto.

> [!word] die Datenverarbeitung
> ipa: /ˈdaːtn̩fɛɐ̯ˌʔaʁbaɪ̯tʊŋ/ · pos: noun · level: C1 · id: de-c1-wortbildung-w46
> uk: обробка даних
> forms: — (без множини)
> example: Für die **Datenverarbeitung** ist Ihre Einwilligung nötig. — Для обробки даних потрібна ваша згода.
> note: die Daten + die Verarbeitung. Типове слово в формулярах (DSGVO). Скорочення EDV — elektronische Datenverarbeitung.

> [!word] der Wirkungsgrad
> ipa: /ˈvɪʁkʊŋsˌɡʁaːt/ · pos: noun · level: C1 · id: de-c1-wortbildung-w47
> uk: коефіцієнт корисної дії (ККД)
> forms: die Wirkungsgrade
> example: Der **Wirkungsgrad** des Motors liegt bei 40 Prozent. — ККД двигуна становить 40 відсотків.
> note: die Wirkung + -s- + der Grad. Fugen-s після -ung. Кінцеве d — [t].

## Слухаємо

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-wortbildung-l01
> audio: Die Reform soll Familien finanziell entlasten.
> explain: *entlasten* — протилежне до *belasten*; префікс *ent-* невідокремлюваний, наголос на *-las-*.

> [!listen] Яке слово прозвучало?
> level: C1 · type: choice · id: de-c1-wortbildung-l02
> audio: Die Felder müssen dringend bewässert werden.
> - [x] Die Felder müssen dringend bewässert werden.
> - [ ] Die Felder müssen dringend entwässert werden.
> - [ ] Die Felder müssen dringend verwässert werden.
>
> **Пояснення:** *bewässern* — зрошувати (додати воду); *entwässern* — осушити (прибрати воду); *verwässern* — розбавити (і переносно — послабити, напр. закон). Один префікс — протилежне значення.

> [!listen] Колега пояснює слово з листа страхової. Що воно означає?
> level: C1 · type: answer · id: de-c1-wortbildung-l03
> audio: A: Was ist denn eine Betriebskostenabrechnung?
> audio: B: Lies es von hinten: eine Abrechnung über die Betriebskosten. Also über Heizung, Wasser, Müll und so weiter im Mietshaus.
> - [x] Розрахунок комунальних та експлуатаційних витрат у багатоквартирному будинку.
> - [ ] Рахунок за ремонт автомобіля.
> - [ ] Податкова декларація фірми.
> - [ ] Договір оренди квартири.
>
> **Пояснення:** порада *Lies es von hinten* — читай справа наліво: *Abrechnung* (розрахунок) ← *Betriebskosten* (експлуатаційні витрати). Переклад: — Що таке «Betriebskostenabrechnung»? — Читай з кінця: розрахунок експлуатаційних витрат. Тобто за опалення, воду, сміття тощо в багатоквартирному будинку.

## Вимова

> [!speak] Скажи вголос: префікси без наголосу
> level: C1 · id: de-c1-wortbildung-s01
> text: Die Bürokratie erschwert vielen Gründern den Start.
> ipa: /diː byʁokʁaˈtiː ɛɐ̯ˈʃveːɐ̯t ˈfiːlən ˈɡʁʏndɐn deːn ʃtaʁt/
> tip: *erschwert* — наголос на -schwert, *er-* ледь чути; *Bürokratie* — наголос на останньому складі.
> uk: Бюрократія ускладнює старт багатьом засновникам.

> [!speak] Скажи вголос: довге слово частинами
> level: C1 · id: de-c1-wortbildung-s02
> text: Die Kraftfahrzeughaftpflichtversicherung ist in Deutschland Pflicht.
> ipa: /diː ˈkʁaftfaːɐ̯tsɔʏ̯kˌhaftpflɪçtfɛɐ̯ˌzɪçəʁʊŋ ɪst ɪn ˈdɔʏ̯tʃlant pflɪçt/
> tip: спершу повільно частинами: *Kraft-fahr-zeug — Haft-pflicht — ver-si-che-rung*; головний наголос на *Kraft-*, *pf* — обидва звуки.
> uk: Страхування цивільної відповідальності власників авто в Німеччині обовʼязкове.

> [!speak] Скажи вголос: -ismus
> level: C1 · id: de-c1-wortbildung-s03
> text: Pluralismus und Pragmatismus gehören zur Demokratie.
> ipa: /pluʁaˈlɪsmʊs ʊnt pʁaɡmaˈtɪsmʊs ɡəˈhøːʁən tsuːɐ̯ demokʁaˈtiː/
> tip: у словах на *-ismus* наголос завжди на *-is-*; s перед m — глухе [s].
> uk: Плюралізм і прагматизм належать до демократії.

## Типові помилки українців

> [!pitfall] Рід складного слова за першою частиною
> ~~das Kraftfahrzeughaftpflichtversicherung~~ (бо *das Kraftfahrzeug*) → **die** …versicherung. Рід і множину дає **остання** частина. Так само *die Betriebskostenabrechnung*, **der** *Wirkungsgrad* (від *der Grad*, хоч *die Wirkung*).

> [!pitfall] ge- у Partizip II невідокремлюваних префіксів
> ~~gebegrünt~~, ~~geentkalkt~~, ~~geerleichtert~~ → **begrünt, entkalkt, erleichtert**. Префікси *be-, ent-, er-* (а також *ver-, zer-, ge-, miss-*) не відокремлюються й не беруть *ge-*. Так само дієслова на *-ieren*: ~~geoptimiert~~ → **optimiert**.

> [!pitfall] be- і ent- переплутані
> ~~Die Reform soll Familien belasten~~ (мається на увазі «полегшити») → **entlasten**. ~~Die Felder entwässern~~ (у посуху) → **bewässern**. Пари *be- / ent-* протилежні: *belasten ↔ entlasten, bewaffnen ↔ entwaffnen, bewässern ↔ entwässern*. Перед тим як вжити, перевір, чи додаєш ти щось, чи прибираєш.

> [!pitfall] Калька суфіксів з української
> ~~der Journalistik~~ (журналістика) → **der Journalismus** (*die Journalistik* — це університетська дисципліна); ~~die Optimation~~ → **die Optimierung**; ~~die Komplexheit~~ → **die Komplexität**. Українські «-ість» і «-ика» не завжди дають *-ität* і *-ik*: *складність* — *die Komplexität*, але *точність* — *die Genauigkeit* (від прикметника на *-ig* — *-keit*).

## Ситуація: інструкція до кавоварки

> [!listen] Марко читає інструкцію разом із сусідкою. Що треба зробити?
> level: C1 · type: answer · id: de-c1-wortbildung-l04
> audio: A: Hier steht: «Das Gerät alle vier Wochen entkalken.» Was heißt das?
> audio: B: Den Kalk entfernen. Ent- heißt hier: weg damit. Du brauchst nur einen Entkalker aus der Drogerie.
> audio: A: Und «entkalkt» ohne ge-?
> audio: B: Genau, wie bei «erleichtert» oder «besucht».
> - [x] Раз на чотири тижні видаляти накип засобом із Drogerie (магазину побутової хімії й косметики).
> - [ ] Раз на чотири тижні додавати вапно у воду.
> - [ ] Віднести кавоварку на ремонт.
> - [ ] Купити нову кавоварку.
>
> **Пояснення:** *entkalken* = *den Kalk entfernen*; *ent-* тут означає «прибрати» (*weg damit*). Засіб — *der Entkalker*. Partizip II без *ge-*: *entkalkt*, як *erleichtert, besucht*. Переклад: — Тут написано: «Прилад раз на чотири тижні чистити від накипу». Що це означає? — Прибрати вапно. Ent- тут означає «геть». Тобі потрібен лише засіб від накипу з Drogerie. — А «entkalkt» без ge-? — Саме так, як «erleichtert» чи «besucht».

> [!speak] Ситуація: спитай про значення слова
> level: C1 · id: de-c1-wortbildung-s04
> text: Wie heißt das Grundwort in diesem Kompositum?
> ipa: /viː haɪ̯st das ˈɡʁʊntvɔʁt ɪn ˈdiːzəm kɔmˈpoːzitʊm/
> tip: *Grundwort* — d у кінці *Grund-* = [t]; *Kompositum* — наголос на -po-.
> uk: Яке опорне слово в цьому складному слові?

## Landeskunde: Die langen Wörter des Deutschen

> [!example] Die langen Wörter des Deutschen
> Kaum eine Eigenschaft wird dem Deutschen so oft nachgesagt wie seine langen Wörter. Tatsächlich erlaubt die Sprache, fast beliebig viele Substantive zu einem neuen Wort zusammenzusetzen. Das ist kein Zeichen von Umständlichkeit, sondern sehr praktisch: Statt „eine Versicherung gegen die Haftpflicht für Kraftfahrzeuge“ sagt man einfach „Kraftfahrzeughaftpflichtversicherung“.
>
> Berühmt wurde ein Wort aus Mecklenburg-Vorpommern. Das Land beschloss 1999 im Zusammenhang mit der Rinderkrankheit BSE ein Gesetz, dessen Kurzbezeichnung lautete: Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz. Mit 63 Buchstaben galt es lange als längstes deutsches Wort. Im Mai 2013 hob der Landtag in Schwerin das Gesetz auf, weil sich die europäischen Vorschriften geändert hatten. Viele Medien meldeten damals augenzwinkernd, das längste Wort Deutschlands habe „ausgedient“. In den Duden hatte es das Wort nie geschafft, denn dort steht nur, was häufig genug in Texten vorkommt.
>
> Wie lang deutsche Wörter in der Praxis werden, zeigt das Dudenkorpus, eine riesige Sammlung von Texten. Das längste Wort, das dort mehrfach belegt ist, heißt nach Angaben der Duden-Redaktion „Grundstücksverkehrsgenehmigungszuständigkeitsübertragungsverordnung“ und hat 67 Buchstaben. Gemeint ist eine Verordnung, die regelt, welche Behörde für die Genehmigung von Grundstücksgeschäften zuständig ist. Solche Ungetüme entstehen vor allem in der Verwaltung und im Recht, wo jede Einzelheit genau benannt werden muss.
>
> Zwischen den Gliedern steht oft ein Fugenelement, am häufigsten ein „s“: Arbeitsmarkt, Liebesbrief, Wohnungsmiete. Feste Regeln dafür gibt es kaum, nur Tendenzen. Nach Wörtern auf -ung, -heit, -keit oder -ion folgt fast immer ein s, etwa in „Zeitungsartikel“ oder „Informationsquelle“. Interessant ist der Vergleich mit Österreich: Dort sagt man „Schweinsbraten“ statt „Schweinebraten“ und „Rindsgulasch“ statt „Rindergulasch“, und auch beim „Zugsverkehr“ setzen viele Österreicher ein Fugen-s, das in Deutschland fehlt.
>
> Für Lernende ist die gute Nachricht: Man muss diese Wörter nicht auswendig lernen, sondern nur zerlegen können. Das letzte Glied verrät, worum es geht, die anderen Glieder sagen, welche Art von Sache gemeint ist. Außerdem hilft die Rechtschreibung. Nach dem amtlichen Regelwerk darf man unübersichtliche Zusammensetzungen mit einem Bindestrich gliedern, etwa „Kfz-Haftpflichtversicherung“. Seit der Rechtschreibreform von 1996 bleiben außerdem drei gleiche Buchstaben erhalten, wenn zwei Wörter zusammentreffen: Aus „Schiff“ und „Fahrt“ wird „Schifffahrt“. Wer möchte, kann auch hier einen Bindestrich setzen und „Schiff-Fahrt“ schreiben. So bleiben selbst lange Fachwörter lesbar.

> [!quiz] Nach dem Text: Warum hat das 63-Buchstaben-Wort „ausgedient“?
> level: C1 · type: single · id: de-c1-wortbildung-q02
> - [ ] Der Duden hat es gestrichen.
> - [x] Der Landtag in Schwerin hob das Gesetz 2013 auf, weil sich die europäischen Vorschriften geändert hatten.
> - [ ] Die Rechtschreibreform 1996 hat es verboten.
> - [ ] Niemand konnte es aussprechen.
>
> **Пояснення:** *Im Mai 2013 hob der Landtag in Schwerin das Gesetz auf, weil sich die europäischen Vorschriften geändert hatten.* У Duden слово, навпаки, ніколи не потрапляло.

> [!quiz] Nach dem Text: Was stimmt? Wähle alle richtigen Aussagen.
> level: C1 · type: multi · id: de-c1-wortbildung-q03
> - [x] Lange Komposita entstehen vor allem in Verwaltung und Recht.
> - [x] Man darf unübersichtliche Zusammensetzungen mit einem Bindestrich gliedern.
> - [x] Seit 1996 schreibt man „Schifffahrt“ mit drei f.
> - [ ] Im Duden stehen alle Wörter, die einmal in einem Gesetz vorkamen.
>
> **Пояснення:** перші три твердження — з тексту. Duden фіксує лише те, *was häufig genug in Texten vorkommt*, тож закон із довгою назвою туди не потрапив.

> [!quiz] Nach dem Text: Was ist die „gute Nachricht“ für Lernende?
> level: C1 · type: single · id: de-c1-wortbildung-q04
> - [ ] Lange Wörter werden bald abgeschafft.
> - [x] Man muss lange Wörter nicht auswendig lernen, sondern zerlegen können.
> - [ ] Lange Wörter kommen nur in Gesetzen vor.
> - [ ] Bindestriche sind immer Pflicht.
>
> **Пояснення:** *Man muss diese Wörter nicht auswendig lernen, sondern nur zerlegen können.* Дефіс — дозволений, а не обовʼязковий.

## Практика

> [!quiz] Який рід у слова «Lebensmittelüberwachung»?
> level: C1 · type: single · id: de-c1-wortbildung-q05
> - [ ] der, бо der Lebensmittel…
> - [ ] das, бо das Lebensmittel
> - [x] die, бо die Überwachung
> - [ ] die, бо всі довгі слова жіночого роду
>
> **Пояснення:** рід дає **остання** частина: *die Überwachung* → *die Lebensmittelüberwachung*. *Das Lebensmittel* — лише означальне слово. Довгі слова бувають будь-якого роду (*der Wirkungsgrad, das Kraftfahrzeug*).

> [!quiz] Яке значення має ent- у слові «entwaffnen»?
> level: C1 · type: single · id: de-c1-wortbildung-q06
> - [ ] почати дію
> - [x] прибрати те, що назване коренем (зброю)
> - [ ] зробити щось сильнішим
> - [ ] повторити дію
>
> **Пояснення:** *die Waffe → entwaffnen* — позбавити зброї. Так само *entkalken, entgiften, entmachten*. Значення «почати» є лише в кількох старих словах (*entbrennen*).

> [!quiz] Обери всі дієслова, де er- означає «стати яким» (з прикметника).
> level: C1 · type: multi · id: de-c1-wortbildung-q07
> - [x] erblinden
> - [x] ergrauen
> - [x] erröten
> - [ ] erarbeiten
> - [ ] ersteigern
>
> **Пояснення:** *blind, grau, rot* → *erblinden, ergrauen, erröten* — поступова зміна стану, Perfekt із *sein*. *erarbeiten, ersteigern* — від дієслів: «досягти результату» (працею, на аукціоні).

> [!quiz] Заповни пропуски: be- чи ent-?
> level: C1 · type: fill · bank: verwässert, überlastet · id: de-c1-wortbildung-q08
>
> ```text fill
> Die Reform soll Familien finanziell [[entlasten]] (полегшити).
> Im Sommer müssen die Felder [[bewässert]] (зрошувати) werden.
> Moore wurden früher [[entwässert]] (осушувати), heute renaturiert man sie.
> Die Steuer [[belastet]] (обтяжує податком) vor allem kleine Betriebe.
> ```
>
> **Пояснення:** полегшити — *entlasten*, обтяжити — *belasten*; додати воду — *bewässern*, прибрати — *entwässern*. *verwässert* існує, але означає «розбавлений», а *überlastet* — «перевантажений»: обидва не підходять за змістом.

> [!quiz] Заповни пропуски: Partizip II без ge-
> level: C1 · type: fill · bank: gebegrünt, geoptimiert · id: de-c1-wortbildung-q09
>
> ```text fill
> Das Dach wurde letztes Jahr [[begrünt]] (озеленити).
> Die Kaffeemaschine habe ich gestern [[entkalkt]] (почистити від накипу).
> Das neue Portal hat die Anmeldung [[erleichtert]] (полегшити).
> Wir haben den Ablauf [[optimiert]] (оптимізувати).
> ```
>
> **Пояснення:** *be-, ent-, er-* і *-ieren* не беруть *ge-*: *begrünt, entkalkt, erleichtert, optimiert*. Форми з банку — типова помилка за зразком *gemacht*.

> [!quiz] Упорядкуй частини слова «Kraftfahrzeughaftpflichtversicherung» від загального до конкретного (як розбирати).
> level: C1 · type: order · id: de-c1-wortbildung-q10
>
> ```text order
> Versicherung — що це?
> Haftpflicht — яке страхування?
> Kraftfahrzeug — для чого?
> Kfz-Haftpflicht — як кажуть у житті
> Fahrzeugkraft ✗
> ```
>
> **Пояснення:** розбираємо справа наліво: спершу опорне слово *Versicherung*, потім означення *Haftpflicht*, потім *Kraftfahrzeug*. *Fahrzeugkraft* — переставлені частини, це інше (і неіснуюче) слово.

> [!quiz] Яке слово правильне для «журналістика» (професія, діяльність)?
> level: C1 · type: single · id: de-c1-wortbildung-q11
> - [x] der Journalismus
> - [ ] die Journalismus
> - [ ] das Journalistentum
> - [ ] die Journalität
>
> **Пояснення:** *-ismus* → **der**: *der Journalismus*. *Die Journalistik* теж існує, але це назва навчальної дисципліни. *Journalität* — не існує, *Journalistentum* — рідкісне й інше за значенням (журналістська спільнота).

> [!quiz] Обери всі прикметники, у яких при відмінюванні випадає -e-.
> level: C1 · type: multi · id: de-c1-wortbildung-q12
> - [x] praktikabel → eine praktikable Lösung
> - [x] kompatibel → ein kompatibles Gerät
> - [x] flexibel → flexible Arbeitszeiten
> - [ ] effektiv → eine effektive Methode
>
> **Пояснення:** у прикметниках на *-abel / -ibel* ненаголошене *e* перед *l* випадає: *praktikable, kompatibles, flexible*. В *effektiv* такого *e* немає — закінчення просто додається.

> [!quiz] «Der Schaden wird auf zwei Millionen Euro beziffert.» Що означає речення?
> level: C1 · type: single · id: de-c1-wortbildung-q13
> - [ ] Збитки сплатять двома мільйонами євро.
> - [x] Збитки оцінюють у два мільйони євро.
> - [ ] Збитки зросли на два мільйони євро.
> - [ ] Збитки записали цифрами.
>
> **Пояснення:** *beziffern* — «виразити в цифрах», тобто оцінити: *wird auf … beziffert*. Сплату (*bezahlen*) і зростання (*steigen um*) речення не описує.

> [!quiz] Склади речення: «Багато громадян відчувають надмірну опіку з боку держави.»
> level: C1 · type: order · id: de-c1-wortbildung-q14
>
> ```text order
> Viele Bürger
> fühlen sich
> vom Staat
> bevormundet.
> gebevormundet ✗
> ```
>
> **Пояснення:** *sich bevormundet fühlen* — Partizip II без *ge-*, бо *be-* невідокремлюваний. *vom Staat* — від кого (*von + Dat*).

## Фішки

> [!reel] 🐄 63 літери — і закон скасували
> *Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz* — закон Мекленбургу-Передньої Померанії 1999 року про контроль маркування яловичини. У 2013 році його скасували, і преса жартувала, що Німеччина втратила своє найдовше слово. У Duden воно так і не потрапило: його майже ніхто не вживав.

> [!reel] 🚢 Schifffahrt з трьома f
> До реформи правопису 1996 року третю приголосну перед голосною «зʼїдали»: *Schiffahrt*. Тепер лишаються всі три літери: *Schifffahrt*. З голосними (*Teeei, Kaffeeernte*) так було й раніше. Хто вважає це незручним, може поставити дефіс: *Schiff-Fahrt, Tee-Ei*.

> [!reel] 🔑 be- і ent- — як плюс і мінус
> *Bewaffnen — entwaffnen, belasten — entlasten, bewässern — entwässern*: *be-* часто «додає», *ent-* «забирає». Запамʼятай кілька пар — і нові слова на *ent-* (*entstauben, entsalzen, entschuppen*) розумітимеш без словника.

## Джерела та що почитати

- [Duden — Die längsten Wörter im Dudenkorpus](https://www.duden.de/sprachwissen/sprachratgeber/Die-langsten-Worter-im-Dudenkorpus): найдовші слова корпусу (67 літер).
- [Spiegel — Längstes Wort der deutschen Sprache verschwindet (2013)](https://www.spiegel.de/panorama/gesellschaft/laengstes-wort-der-deutschen-sprache-verschwindet-a-903370.html): скасування закону в Мекленбурзі-Передній Померанії.
- [Rat für deutsche Rechtschreibung — Regeln und Wörterverzeichnis](https://www.rechtschreibrat.com/regeln-und-woerterverzeichnis/): офіційний amtliches Regelwerk (дефіс у складних словах, три однакові літери).
- [DWDS — «Pluralismus»](https://www.dwds.de/wb/Pluralismus): значення, вимова й частотність; та сама структура статей для *entlasten, erschweren* тощо.
- [Duden — Lichtzeichenanlage](https://www.duden.de/rechtschreibung/Lichtzeichenanlage): приклад канцелярського складного слова з розбором.

> [!important] Підсумок
> - **Kompositum:** Grundwort (остання частина) дає рід, множину й значення; читай справа наліво, ділі на дві частини; дефіс дозволений у неочевидних словах (*Kfz-Haftpflicht*).
> - **be-:** робить дієслово перехідним (*bebauen, beliefern*) або «забезпечує чимось» (*begrünen, beschriften, bezuschussen*).
> - **ent-:** прибирає те, що в корені (*entkalken, entwaffnen, entmachten*) або скасовує дію (*entschlüsseln, entlasten*); пари *be- ↔ ent-*.
> - **er-:** «стати яким» (*erblinden, ergrauen* — Perfekt із *sein*), «зробити яким» (*erschweren, ermöglichen*), «досягти дією» (*erarbeiten*).
> - **Суфікси:** *-ismus* → der, *-ität* → die, *-abel / -ibel* (e випадає), *-ieren* без *ge-*. Усі правила — тенденції: перевіряй у словнику.
