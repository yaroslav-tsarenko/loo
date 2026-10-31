---
title: Пошук житла — оренда, Kaution, WG
id: de-b1-wohnungssuche
level: B1
icon: px:house
tags: [deutsch, b1, vocabulary, wohnung, miete, kaution, wg]
prerequisites: ["[[Deutsch - A1 - 20. Квартира, кімнати й меблі — es gibt]]", "[[Deutsch - A2 - 29. Ситуації — Bürgeramt, Anmeldung, огляд квартири, аптека]]"]
estimatedMinutes: 60
---

# Пошук житла — оренда, Kaution, WG

> [!success] Після цієї теми ти зможеш
> - прочитати оголошення про оренду й розрізнити *Kaltmiete, Warmmiete, Nebenkosten, Kaution*;
> - пояснити, які документи просять на *Besichtigung* (*Selbstauskunft, Schufa, Einkommensnachweis*);
> - зрозуміти ключові пункти *Mietvertrag* і *Hausordnung*;
> - домовитися про огляд, питати про *Nachmieter, Übergabe, Mängel*;
> - відрізнити *mieten* від *vermieten* і *einziehen* від *ausziehen*.

## Передбач

> [!quiz] Kaltmiete — 800 €, Nebenkosten (з опаленням) — 150 €. Чому дорівнює Warmmiete?
> level: B1 · type: single · id: de-b1-wohnungssuche-q01
> - [ ] 800 €
> - [x] 950 €
> - [ ] 650 €
> - [ ] 1.600 €
>
> **Пояснення:** *Warmmiete = Kaltmiete + Nebenkosten*, тобто 800 + 150 = 950 €. *Kaltmiete* — «холодна» оренда лише за приміщення, без комунальних витрат. Це різниця, яка одразу видна в оголошеннях.

## Де шукати і що написано в оголошенні

Житло шукають на великих порталах з оголошеннями, у групах міста, на дошках оголошень (*Aushang*) і через знайомих. Для кімнат у спільних квартирах існують окремі портали. Оголошення стиснуті, тому треба знати скорочення:

| Скорочення | Повністю | Значення |
|---|---|---|
| Zi. | Zimmer | кімната (2-Zi.-Whg. = двокімнатна квартира) |
| Whg. | Wohnung | квартира |
| KM | Kaltmiete | оренда без комунальних |
| NK | Nebenkosten | комунальні витрати |
| WM | Warmmiete | KM + NK |
| EBK | Einbauküche | вбудована кухня |
| ab sofort | | можна вʼїхати негайно |
| VB | Verhandlungsbasis | ціна договірна |
| m² | Quadratmeter | квадратний метр площі |
| Erstbezug | | першим мешканцем у новому або відремонтованому житлі |

Окремо вказують *Lage* (розташування), *Verkehrsanbindung* (транспорт поруч), *Altbau* чи *Neubau*, *Balkon / Terrasse*, чи є *Stellplatz* (місце для авто) і *Abstellraum*.

## Скільки це коштує

- **Kaltmiete** — плата лише за квартиру.
- **Nebenkosten** — комунальні витрати: вода, вивіз сміття, прибирання сходів, ліфт, домоправитель, часто опалення (*Heizung*). Їх щороку розраховують у *Nebenkostenabrechnung*: якщо сплатив замало — доплачуєш, якщо забагато — отримуєш повернення.
- **Warmmiete** — підсумок: *Kaltmiete + Nebenkosten*. Електрика для квартири зазвичай окремо: свій договір із постачальником.
- **Kaution** — застава. Закон (*§ 551 BGB*) обмежує її **трьома місячними Kaltmieten** (без передоплати комунальних). Її можна сплатити **трьома однаковими частинами**. Після виїзду (якщо немає боргів і пошкоджень) заставу повертають.

> [!tip] Warmmiete — не завжди «все включено»
> У *Nebenkosten* опалення бувають, а бувають не включені. Тому питай: *Sind die Heizkosten in den Nebenkosten enthalten?* Електрика, інтернет і *Rundfunkbeitrag* найчастіше платиш окремо.

## Шлях до квартири

> [!diagram] Від оголошення до ключів
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "1", text: "Anzeige", tone: yellow }
>   - { id: b, label: "2", text: "Besichtigung", tone: pink }
>   - { id: c, label: "3", text: "Unterlagen", tone: yellow }
>   - { id: d, label: "4", text: "Mietvertrag", tone: pink }
>   - { id: e, label: "5", text: "Übergabe", tone: gray }
> edges:
>   - { from: a, to: b }
>   - { from: b, to: c }
>   - { from: c, to: d }
>   - { from: d, to: e }
> steps:
>   - { focus: a, note: "Знаходиш оголошення й пишеш або телефонуєш: Ist die Wohnung noch frei?" }
>   - { focus: b, note: "Besichtigung — огляд. На популярні квартири приходить багато охочих одночасно." }
>   - { focus: c, note: "Після огляду подаєш Selbstauskunft, Einkommensnachweis, часто Schufa-Auskunft." }
>   - { focus: d, note: "Якщо обрали тебе — підписуєш Mietvertrag. Читай Kaution, Kündigungsfrist, Schönheitsreparaturen." }
>   - { focus: e, note: "Wohnungsübergabe: разом з Vermieter заповнюєте Übergabeprotokoll, записуєте Mängel й показники лічильників." }
> ```

Що просить орендодавець на огляді (часто разом у «папці охочого»):

1. **Selbstauskunft** — анкета про тебе: імʼя, робота, кількість мешканців, чи є борги.
2. **Einkommensnachweis** — підтвердження доходу: останні *Gehaltsabrechnungen* (3 шт.), у студентів — підтвердження стипендії чи гарантія батьків (*Bürgschaft*).
3. **Schufa-Auskunft** — довідка про кредитну історію (*Bonität*). Є й **Mietschuldenfreiheitsbescheinigung** від попереднього орендодавця: «боргів по оренді немає».

## Договір і життя в будинку

- **Kündigungsfrist** орендаря зазвичай **три місяці** (*§ 573c BGB*). Якщо шукаєш виїхати раніше, пропонуєш *Nachmieter* — людину, яка заселиться замість тебе.
- **Untermiete / Zwischenmiete** — здавати частину чи все житло на час іншому, лише **за згодою** орендодавця.
- **Mieterhöhung** — підвищення оренди. Воно має бути обґрунтоване, зазвичай з орієнтиром на *Mietspiegel* міста.
- **Schönheitsreparaturen** — косметичний ремонт (фарбування стін). Що саме має робити орендар — прописано в договорі, і суди нерідко визнають такі пункти недійсними; перед підписом краще уточнити.
- **Hausordnung** — правила будинку: прибирання сходів, сортування сміття, *Mittagsruhe* та *Nachtruhe*. Години тиші різні, зазвичай вночі та частково в обід і в неділю; конкретика — у *Hausordnung* та місцевих правилах.
- **Eigenbedarf** — підстава для розірвання договору орендодавцем, коли власник сам чи його родичі хочуть жити у квартирі.

Про сортування сміття — окрема тема [[Deutsch - B1 - 12. Довкілля, природа й сортування сміття]].

## WG і особливості

*WG* (*Wohngemeinschaft*) — квартира, де кілька людей мають окремі кімнати й спільні кухню та ванну. Вибір нового співмешканця — *WG-Casting*: знайомство з усіма мешканцями. Типові теми: прибирання, спільні витрати, гості. У *WG* платять один раз *Warmmiete* за кімнату, часто разом з інтернетом.

> [!note] Makler і Provision
> Агент з нерухомості — *Makler*, його послуга — *Provision*. Діє принцип *Bestellerprinzip*: комісію платить той, хто **замовив** послугу. Тобто якщо орендодавець наймає Makler, орендар Provision не сплачує.

## Приклади

- Die Kaltmiete beträgt 900 Euro, dazu kommen 200 Euro Nebenkosten. — Холодна оренда становить 900 євро, плюс 200 євро комунальних.
- Wann kann ich die Wohnung besichtigen? — Коли можна оглянути квартиру?
- Ich brauche eine Schufa-Auskunft und einen Einkommensnachweis. — Мені потрібні довідка зі Schufa та підтвердження доходу.
- Die Kaution beträgt drei Monatsmieten. — Застава становить три місячні оплати.
- Wir suchen einen Nachmieter für die Wohnung. — Ми шукаємо наступного орендаря для квартири.
- Im Bad ist Schimmel. Das steht im Übergabeprotokoll. — У ванній пліснява. Це записано в акті прийому-передачі.
- Wann ziehen Sie aus? — Ende des Monats. — Коли Ви виїжджаєте? — Наприкінці місяця.
- In der Hausordnung steht, wann Mittagsruhe ist. — У правилах будинку написано, коли обідня тиша.
- Ich wohne in einer WG mit zwei Studenten. — Я живу в WG з двома студентами.
- Die Wohnung liegt zentral und hat eine gute Verkehrsanbindung. — Квартира розташована в центрі й має добре транспортне сполучення.

## Слова

> [!word] die Mietwohnung
> ipa: /ˈmiːtˌvoːnʊŋ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w01
> uk: орендована квартира
> forms: die Mietwohnungen
> example: Wir suchen eine **Mietwohnung** in der Nähe der Uni. — Ми шукаємо орендовану квартиру біля університету.
> note: протилежне — die Eigentumswohnung (власна).

> [!word] die Wohnungssuche
> ipa: /ˈvoːnʊŋsˌzuːxə/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w02
> uk: пошук житла
> forms: — (без множини)
> example: Die **Wohnungssuche** in Großstädten ist schwierig. — Пошук житла у великих містах складний.
> note: ch після u — [x], «х».

> [!word] die Schufa
> ipa: /ˈʃuːfa/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w03
> uk: Schufa (бюро кредитних історій)
> forms: — (без множини)
> example: Der Vermieter möchte eine **Schufa**-Auskunft sehen. — Орендодавець хоче побачити довідку зі Schufa.
> note: скорочення від «Schutzgemeinschaft für allgemeine Kreditsicherung»; читається як слово: «шуфа». Стосується лише Німеччини.

> [!word] die Besichtigung
> ipa: /bəˈzɪçtɪɡʊŋ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w04
> uk: огляд (квартири, обʼєкта)
> forms: die Besichtigungen
> example: Die **Besichtigung** ist am Samstag um elf Uhr. — Огляд призначено на суботу об 11:00.
> note: дієслово — besichtigen. Також «екскурсія» (Stadtbesichtigung).

> [!word] die Selbstauskunft
> ipa: /ˈzɛlpstʔaʊ̯sˌkʊnft/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w05
> uk: анкета про себе (для орендодавця)
> forms: die Selbstauskünfte
> example: Bitte füllen Sie die **Selbstauskunft** aus. — Будь ласка, заповніть анкету про себе.
> note: ü у множині: Selbstauskünfte.

> [!word] der Einkommensnachweis
> ipa: /ˈaɪ̯nkɔmənsˌnaːxvaɪ̯s/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w06
> uk: підтвердження доходу
> forms: die Einkommensnachweise
> example: Als **Einkommensnachweis** reichen drei Gehaltsabrechnungen. — Як підтвердження доходу вистачить трьох розрахункових листків.
> note: das Einkommen — дохід; der Nachweis — доказ.

> [!word] die Bürgschaft
> ipa: /ˈbʏʁkʃaft/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w07
> uk: порука; гарантія
> forms: die Bürgschaften
> example: Meine Eltern geben eine **Bürgschaft** für die Miete. — Мої батьки дають поруку за оплату оренди.
> note: der Bürge — поручитель; ü — як у Küche.

> [!word] der Nachmieter
> ipa: /ˈnaːxˌmiːtɐ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w08
> uk: наступний орендар
> forms: die Nachmieter
> example: Wir suchen einen **Nachmieter** für unsere Wohnung. — Ми шукаємо наступного орендаря для нашої квартири.
> note: жінка — die Nachmieterin. Протилежне — der Vormieter.

> [!word] der Vormieter
> ipa: /ˈfoːɐ̯ˌmiːtɐ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w09
> uk: попередній орендар
> forms: die Vormieter
> example: Der **Vormieter** hat die Küche zurückgelassen. — Попередній орендар залишив кухню.
> note: жінка — die Vormieterin.

> [!word] der Untermieter
> ipa: /ˈʊntɐˌmiːtɐ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w10
> uk: піднаймач; той, хто винаймає частину житла в орендаря
> forms: die Untermieter
> example: Ein **Untermieter** braucht die Erlaubnis des Vermieters. — Піднаймачу потрібен дозвіл орендодавця.
> note: жінка — die Untermieterin; die Untermiete — піднайм.

> [!word] der Altbau
> ipa: /ˈaltbaʊ̯/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w11
> uk: старий будинок (зазвичай довоєнний)
> forms: die Altbauten
> example: Ich mag **Altbau**-Wohnungen mit hohen Decken. — Мені подобаються квартири в старих будинках з високою стелею.
> note: Altbauwohnung: стеля 3 м і більше, але часто холодніше взимку.

> [!word] der Neubau
> ipa: /ˈnɔʏ̯baʊ̯/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w12
> uk: новобудова
> forms: die Neubauten
> example: Im **Neubau** gibt es einen Aufzug und eine Tiefgarage. — У новобудові є ліфт і підземний паркінг.
> note: eu = [ɔʏ̯]: «ной-бау».

> [!word] der Erstbezug
> ipa: /ˈeːɐ̯stbəˌtsuːk/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w13
> uk: перше заселення
> forms: — (без множини)
> example: Die Wohnung ist **Erstbezug** nach der Sanierung. — Квартира — перше заселення після ремонту.
> note: кінцеве g у Bezug = [k].

> [!word] unmöbliert
> ipa: /ˈʊnmøbliːɐ̯t/ · pos: adj · level: B1 · id: de-b1-wohnungssuche-w14
> uk: без меблів
> example: Die Wohnung wird **unmöbliert** vermietet. — Квартиру здають без меблів.
> note: протилежне — möbliert (з меблями); teilmöbliert — частково.

> [!word] der Stellplatz
> ipa: /ˈʃtɛlplats/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w15
> uk: місце для паркування
> forms: die Stellplätze
> example: Zur Wohnung gehört ein **Stellplatz** im Hof. — До квартири входить місце для паркування у дворі.
> note: «Stellplatz» часто платний окремо: Stellplatzmiete.

> [!word] die Terrasse
> ipa: /tɛˈʁasə/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w16
> uk: тераса
> forms: die Terrassen
> example: Die Wohnung hat eine kleine **Terrasse**. — У квартири невелика тераса.
> note: наголос на -ra-; ss = [s].

> [!word] der Abstellraum
> ipa: /ˈapʃtɛlʁaʊ̯m/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w17
> uk: комора; кладова
> forms: die Abstellräume
> example: Im **Abstellraum** steht die Waschmaschine. — У коморі стоїть пральна машина.
> note: також die Abstellkammer.

> [!word] barrierefrei
> ipa: /baˈri̯eːɐ̯ˌfʁaɪ̯/ · pos: adj · level: B1 · id: de-b1-wohnungssuche-w18
> uk: безбарʼєрний; доступний для людей з обмеженою мобільністю
> example: Die Wohnung ist **barrierefrei**, ohne Stufen. — Квартира безбарʼєрна, без сходинок.
> note: die Barriere — [baˈri̯eːʁə].

> [!word] die Heizung
> ipa: /ˈhaɪ̯tsʊŋ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w19
> uk: опалення
> forms: die Heizungen
> example: Die **Heizung** ist in den Nebenkosten enthalten. — Опалення входить у комунальні витрати.
> note: heizen — опалювати; die Zentralheizung — центральне опалення.

> [!word] die Betriebskosten
> ipa: /bəˈtʁiːpsˌkɔstn̩/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w20
> uk: експлуатаційні (комунальні) витрати
> forms: — (лише множина)
> example: Die **Betriebskosten** werden einmal im Jahr abgerechnet. — Експлуатаційні витрати розраховують раз на рік.
> note: юридичний термін для Nebenkosten (у BetrKV). Нерідко вживають як синонім.

> [!word] die Nebenkostenabrechnung
> ipa: /ˈneːbn̩kɔstn̩ʔapˌʁɛçnʊŋ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w21
> uk: щорічний розрахунок комунальних витрат
> forms: die Nebenkostenabrechnungen
> example: In der **Nebenkostenabrechnung** gibt es eine Nachzahlung. — У розрахунку комунальних є доплата.
> note: die Nachzahlung — доплата, die Rückzahlung — повернення.

> [!word] die Mieterhöhung
> ipa: /ˈmiːtɐʔɛɐ̯ˌhøːʊŋ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w22
> uk: підвищення оренди
> forms: die Mieterhöhungen
> example: Der Vermieter hat eine **Mieterhöhung** angekündigt. — Орендодавець оголосив про підвищення оренди.
> note: erhöhen — підвищувати; hoch → höher («вищий»).

> [!word] der Mietspiegel
> ipa: /ˈmiːtˌʃpiːɡl̩/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w23
> uk: огляд місцевих цін на оренду
> forms: die Mietspiegel
> example: Der **Mietspiegel** zeigt die übliche Miete in der Stadt. — Mietspiegel показує звичайні ціни на оренду в місті.
> note: sp на початку кореня Spiegel — [ʃp]: «шпігл».

> [!word] der Makler
> ipa: /ˈmaːklɐ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w24
> uk: агент з нерухомості; посередник
> forms: die Makler
> example: Wir haben die Wohnung ohne **Makler** gefunden. — Ми знайшли квартиру без агента.
> note: жінка — die Maklerin.

> [!word] die Provision
> ipa: /pʁoviˈzi̯oːn/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w25
> uk: комісія; винагорода посередника
> forms: die Provisionen
> example: Wer zahlt die **Provision** für den Makler? — Хто платить комісію агентові?
> note: наголос на -on; v = [v].

> [!word] der Wohnberechtigungsschein
> ipa: /ˈvoːnbəˌʁɛçtɪɡʊŋsˌʃaɪ̯n/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w26
> uk: довідка на право отримати соціальне житло
> forms: die Wohnberechtigungsscheine
> example: Für die Sozialwohnung brauche ich einen **Wohnberechtigungsschein**. — Для соціального житла мені потрібна довідка WBS.
> note: скорочено — WBS. Видає муніципальна служба житла.

> [!word] das Wohngeld
> ipa: /ˈvoːnˌɡɛlt/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w27
> uk: житлова допомога (субсидія на оренду)
> forms: — (без множини)
> example: Mit geringem Einkommen kann man **Wohngeld** beantragen. — За невеликого доходу можна подати заяву на житлову допомогу.
> note: Wohngeld ≠ Bürgergeld: Wohngeld — це допомога саме на житло; умови змінюються, перевіряй на офіційному сайті.

> [!word] ausziehen
> ipa: /ˈaʊ̯stsiːən/ · pos: verb · level: B1 · id: de-b1-wohnungssuche-w28
> uk: виїжджати (з житла); знімати (одяг)
> forms: zieht aus → zog aus → ist ausgezogen
> example: Wir **ziehen** Ende des Monats **aus**. — Наприкінці місяця ми виїжджаємо.
> note: відокремлюване; протилежне — einziehen. Одяг: sich ausziehen — роздягатися.

> [!word] die Schönheitsreparatur
> ipa: /ˈʃøːnhaɪ̯tsʁepaʁaˌtuːɐ̯/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w29
> uk: косметичний ремонт
> forms: die Schönheitsreparaturen
> example: Der Mieter macht die **Schönheitsreparaturen**, steht im Vertrag. — Орендар робить косметичний ремонт, так написано в договорі.
> note: ö довге; Schönheit — краса, -heit завжди жіночого роду.

> [!word] der Mangel
> ipa: /ˈmaŋl̩/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w30
> uk: недолік; дефект
> forms: die Mängel
> example: Bitte schreiben Sie alle **Mängel** ins Protokoll. — Будь ласка, запишіть усі дефекти до протоколу.
> note: також «нестача»: ein Mangel an Zeit. Множина з умлаутом.

> [!word] der Schimmel
> ipa: /ˈʃɪml̩/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w31
> uk: пліснява
> forms: — (без множини)
> example: In der Ecke ist **Schimmel**. — У кутку пліснява.
> note: der Schimmel — ще й «білий кінь» (омонім).

> [!word] die Wohnfläche
> ipa: /ˈvoːnˌflɛçə/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w32
> uk: житлова площа
> forms: die Wohnflächen
> example: Die **Wohnfläche** beträgt 52 Quadratmeter. — Житлова площа становить 52 квадратні метри.
> note: ä = [ɛ], ch після ä — [ç], «хь».

> [!word] das Übergabeprotokoll
> ipa: /ˈyːbɐɡaːbəpʁotoˌkɔl/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w33
> uk: акт прийому-передачі квартири
> forms: die Übergabeprotokolle
> example: Im **Übergabeprotokoll** stehen die Zählerstände. — В акті прийому-передачі записано покази лічильників.
> note: der Zählerstand — показ лічильника; фотографуй стан квартири.

> [!word] die Hausratversicherung
> ipa: /ˈhaʊ̯sʁaːtfɛɐ̯ˌzɪçəʁʊŋ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w34
> uk: страхування майна в квартирі
> forms: die Hausratversicherungen
> example: Die **Hausratversicherung** zahlt bei Einbruch oder Brand. — Страхування майна виплачує у випадку крадіжки чи пожежі.
> note: der Hausrat — домашнє майно. Haftpflichtversicherung — інше страхування: тема 26.

> [!word] die Mittagsruhe
> ipa: /ˈmɪtaːksˌʁuːə/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w35
> uk: обідня тиша
> forms: — (без множини)
> example: Während der **Mittagsruhe** bohrt man nicht. — Під час обідньої тиші не свердлять.
> note: час залежить від Hausordnung та місця; перевіряй свій будинок.

> [!word] die Eigentumswohnung
> ipa: /ˈaɪ̯ɡn̩tuːmsˌvoːnʊŋ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w36
> uk: власна квартира (у власності)
> forms: die Eigentumswohnungen
> example: Sie haben eine **Eigentumswohnung** gekauft. — Вони купили квартиру у власність.
> note: також скорочено — ETW у оголошеннях.

> [!word] der Eigentümer
> ipa: /ˈaɪ̯ɡn̩tyːmɐ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w37
> uk: власник
> forms: die Eigentümer
> example: Der **Eigentümer** wohnt im Erdgeschoss. — Власник живе на першому поверсі.
> note: жінка — die Eigentümerin; Vermieter не завжди власник.

> [!word] der Eigenbedarf
> ipa: /ˈaɪ̯ɡn̩bəˌdaʁf/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w38
> uk: власна потреба (власник сам хоче жити)
> forms: — (без множини)
> example: Wegen **Eigenbedarf** hat man ihnen gekündigt. — Через власну потребу власника їм розірвали договір.
> note: Kündigung wegen Eigenbedarf — типова підстава.

> [!word] die Zwischenmiete
> ipa: /ˈtsvɪʃn̩ˌmiːtə/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w39
> uk: тимчасовий піднайм
> forms: die Zwischenmieten
> example: Ich suche eine **Zwischenmiete** für drei Monate. — Я шукаю тимчасовий піднайм на три місяці.
> note: дається під час відсутності основного орендаря.

> [!word] die Lage
> ipa: /ˈlaːɡə/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w40
> uk: розташування; ситуація
> forms: die Lagen
> example: Die Wohnung hat eine ruhige und zentrale **Lage**. — Квартира має тихе й центральне розташування.
> note: також «становище»: in einer schwierigen Lage sein.

> [!word] die Verkehrsanbindung
> ipa: /fɛɐ̯ˈkeːɐ̯sʔanˌbɪndʊŋ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w41
> uk: транспортне сполучення
> forms: die Verkehrsanbindungen
> example: Die **Verkehrsanbindung** ist sehr gut: U-Bahn und Bus. — Транспортне сполучення дуже добре: метро й автобус.
> note: anbinden — привʼязувати, зʼєднувати.

> [!word] der Rauchmelder
> ipa: /ˈʁaʊ̯xˌmɛldɐ/ · pos: noun · level: B1 · id: de-b1-wohnungssuche-w42
> uk: датчик диму
> forms: die Rauchmelder
> example: In jeder Wohnung muss ein **Rauchmelder** hängen. — У кожній квартирі має бути датчик диму.
> note: вимоги щодо датчиків диму встановлюють правила землі (Land); деталі різняться.

> [!word] vermieten
> ipa: /fɛɐ̯ˈmiːtn̩/ · pos: verb · level: B1 · id: de-b1-wohnungssuche-w43
> uk: здавати в оренду
> forms: vermietet → vermietete → hat vermietet
> example: Sie **vermietet** das Zimmer an eine Studentin. — Вона здає кімнату студентці.
> note: mieten — знімати; vermieten — здавати. Ver- змінює напрям.

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-wohnungssuche-l01
> audio: Die Warmmiete beträgt neunhundertfünfzig Euro.
> - [ ] Die Kaltmiete beträgt neunhundertfünfzig Euro.
> - [x] Die Warmmiete beträgt neunhundertfünfzig Euro.
> - [ ] Die Warmmiete beträgt neunhundertfünfundfünfzig Euro.

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-wohnungssuche-l02
> audio: Wann kann ich die Wohnung besichtigen?
> - [ ] Wann kann ich die Wohnung mieten?
> - [x] Wann kann ich die Wohnung besichtigen?
> - [ ] Wann kann ich die Wohnung kündigen?

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-wohnungssuche-l03
> audio: Die Kaution beträgt drei Kaltmieten.
> explain: Kaltmieten — множина від die Kaltmiete. Обмеження застави — три місячні Kaltmieten.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-wohnungssuche-l04
> audio: Ich suche einen Nachmieter für meine Wohnung.
> explain: einen Nachmieter — Akkusativ чоловічого роду після suchen; жінка — Nachmieterin.

> [!listen] Послухай телефонну розмову. Що питає чоловік про оголошення?
> level: B1 · type: answer · id: de-b1-wohnungssuche-l05
> audio: A: Guten Tag, ich rufe wegen der Zwei-Zimmer-Wohnung an. Ist sie noch frei?
> audio: B: Ja, ab dem ersten Dezember. Die Kaltmiete ist neunhundert Euro, dazu kommen zweihundert Euro Nebenkosten.
> audio: A: Sind die Heizkosten in den Nebenkosten enthalten?
> audio: B: Ja. Strom müssen Sie selbst zahlen.
> - [ ] Чи можна тримати тварин.
> - [x] Чи опалення входить у комунальні витрати.
> - [ ] Чи є в квартирі меблі.
>
> **Пояснення:** чоловік питає *Sind die Heizkosten in den Nebenkosten enthalten?* Відповідь: так, опалення входить; електрику платять окремо.

> [!listen] Послухай огляд квартири. Що правда?
> level: B1 · type: answer · id: de-b1-wohnungssuche-l06
> audio: A: Das ist das Wohnzimmer. Der Balkon geht nach Süden.
> audio: B: Schön! Aber im Bad ist Schimmel.
> audio: A: Das steht im Übergabeprotokoll. Der Vermieter repariert es vor dem Einzug.
> audio: B: Gut. Wie hoch ist die Kaution?
> audio: A: Drei Kaltmieten, also zweitausendsiebenhundert Euro. Sie dürfen sie in drei Raten zahlen.
> - [ ] Плісняви немає, а застава становить 900 євро.
> - [x] У ванній пліснява, її мають усунути до вʼїзду, заставу можна платити частинами.
> - [ ] Балкон виходить на північ, застава — одна оренда.
>
> **Пояснення:** *Schimmel … vor dem Einzug reparieren* — пліснява буде усунена до вʼїзду; *drei Kaltmieten* (3 × 900 = 2.700 €) у *drei Raten*.

## Вимова

У складних словах про житло важливий наголос на першому корені: **Kalt**miete, **Warm**miete, **Neben**kosten, **Haus**ordnung. Звернути увагу: *Wohnung* — довге [oː], без «в»: [ˈvoːnʊŋ]; *Miete* — довге [iː]: [ˈmiːtə]. А *Mängel* — ä = [ɛ]: [ˈmɛŋl̩].

> [!speak] Скажи вголос
> level: B1 · id: de-b1-wohnungssuche-s01
> text: Die Kaltmiete beträgt neunhundert Euro.
> ipa: /diː ˈkaltˌmiːtə bəˈtʁɛːkt ˈnɔʏ̯nhʊndɐt ˈɔʏ̯ʁo/
> tip: Kaltmiete — наголос на Kalt-. beträgt — довге [ɛː], кінець [kt]. neun — [ɔʏ̯].
> uk: Холодна оренда становить девʼятсот євро.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-wohnungssuche-s02
> text: Wie hoch sind die Nebenkosten?
> ipa: /viː hoːx zɪnt diː ˈneːbn̩ˌkɔstn̩/
> tip: hoch — довге [oː] і [x] в кінці, «хох». Nebenkosten — наголос на Ne-.
> uk: Скільки становлять комунальні?

> [!speak] Скажи вголос
> level: B1 · id: de-b1-wohnungssuche-s03
> text: Kann ich die Kaution in Raten zahlen?
> ipa: /kan ɪç diː kaʊ̯ˈtsi̯oːn ɪn ˈʁaːtn̩ ˈtsaːlən/
> tip: Kaution — au = [aʊ̯], наголос на -on, ti = [tsi̯]. Raten — довге [aː].
> uk: Чи можна сплатити заставу частинами?

> [!speak] Скажи вголос
> level: B1 · id: de-b1-wohnungssuche-s04
> text: Wir suchen einen Nachmieter.
> ipa: /viːɐ̯ ˈzuːxn̩ ˈaɪ̯nən ˈnaːxˌmiːtɐ/
> tip: suchen — ch після u = [x]; Nachmieter — довге [aː] і [x].
> uk: Ми шукаємо наступного орендаря.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-wohnungssuche-s05
> text: Im Bad ist Schimmel.
> ipa: /ɪm baːt ɪst ˈʃɪml̩/
> tip: Bad — кінцеве d = [t]: «бат». Schimmel — sch = «ш», короткий [ɪ].
> uk: У ванній пліснява.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-wohnungssuche-s06
> text: Ich ziehe Ende des Monats aus.
> ipa: /ɪç ˈtsiːə ˈɛndə dɛs ˈmoːnats ˈaʊ̯s/
> tip: ziehe — ie = довге [iː], h у середині німе. aus стоїть наприкінці: відокремлюваний префікс.
> uk: Наприкінці місяця я виїжджаю.

## Типові помилки українців

> [!pitfall] mieten ≠ vermieten
> *mieten* — **знімати** житло, *vermieten* — **здавати**. Українське «я здаю квартиру» — *Ich vermiete eine Wohnung*; «я знімаю» — *Ich miete eine Wohnung*. Орендар — *der Mieter*, орендодавець — *der Vermieter*. Різниця в приставці *ver-*, яку легко пропустити.

> [!pitfall] Kaltmiete ≠ скільки платити щомісяця
> У оголошенні «900 € KM» ще не весь платіж. До цього додаються *Nebenkosten*, інколи — окремо електрика, інтернет та *Rundfunkbeitrag*. Реальний місячний бюджет — *Warmmiete* плюс решта. Не порівнюй квартири лише за *Kaltmiete*: у одній опалення в *Nebenkosten*, в іншій — ні.

> [!pitfall] einziehen, ausziehen, umziehen: куди переїздимо
> *einziehen* — вʼїхати (в квартиру), *ausziehen* — виїхати, *umziehen* — переїхати з одного місця в інше: *Wir sind nach Leipzig umgezogen.* Для міста з напрямком (*nach Leipzig*) потрібен саме *umziehen*, а не *einziehen*. Українське «переїхати» — часто *umziehen*, а «заселитися» — *einziehen*.

> [!pitfall] Kaution — це не «передоплата», і її повертають
> *Kaution* — застава: після виїзду, якщо немає боргів і пошкоджень, її повертають. Вона не замінює першої оплати оренди. Закон обмежує її трьома Kaltmieten (§ 551 BGB) і дозволяє платити трьома частинами. Не погоджуйся на «Kaution готівкою» без квитанції й памʼятай, що **Makler-Provision** — це зовсім інший платіж.

## Ситуація: огляд квартири

> [!listen] Послухай діалог. Що Лена питає в орендодавця?
> level: B1 · type: answer · id: de-b1-wohnungssuche-l07
> audio: A: Guten Tag, Frau Kovalenko. Hier ist die Einbauküche.
> audio: B: Danke. Ist die Küche im Preis enthalten?
> audio: A: Ja. Der Vormieter lässt sie hier.
> audio: B: Und wann könnte ich einziehen? Was brauchen Sie von mir?
> audio: A: Ab dem ersten Dezember. Bitte schicken Sie mir eine Selbstauskunft und eine Schufa-Auskunft.
> - [ ] Вона питає, коли виїжджає вона сама.
> - [x] Вона питає, чи кухня входить у ціну, коли можна вʼїхати та які документи потрібні.
> - [ ] Вона питає, чи можна завести тварину.
>
> **Пояснення:** Лена питає про кухню (*im Preis enthalten*), дату вʼїзду (*einziehen*) і документи (*Selbstauskunft, Schufa-Auskunft*).

Тепер скажи вголос, що б ти спитав(ла) на огляді.

> [!speak] Скажи вголос: «Чи входить кухня в ціну?»
> level: B1 · id: de-b1-wohnungssuche-s07
> text: Ist die Küche im Preis enthalten?
> ipa: /ɪst diː ˈkʏçə ɪm pʁaɪ̯s ɛntˈhaltn̩/
> tip: Küche — ü з округленими губами і [ç]. enthalten — наголос на -hal-.
> uk: Чи входить кухня в ціну?

> [!speak] Скажи вголос: «Які документи Вам потрібні?»
> level: B1 · id: de-b1-wohnungssuche-s08
> text: Welche Unterlagen brauchen Sie von mir?
> ipa: /ˈvɛlçə ˈʊntɐˌlaːɡn̩ ˈbʁaʊ̯xn̩ ziː fɔn miːɐ̯/
> tip: Unterlagen — наголос на Un-, g = [ɡ]. brauchen — ch = [x].
> uk: Які документи Вам потрібні від мене?

## Landeskunde: Mieten in München

> [!example] Mieten in München
> München gehört zu den teuersten Städten Deutschlands für Mieter. Viele Wohnungen sind sehr begehrt: Zu einer Besichtigung kommen oft mehrere Interessenten gleichzeitig. Deshalb bereitet man seine Unterlagen gut vor. Der Vermieter möchte meistens eine Selbstauskunft, einen Einkommensnachweis und eine Schufa-Auskunft sehen. Wenn man den Mietvertrag unterschreibt, zahlt man eine Kaution. Sie darf höchstens drei Monatsmieten ohne Nebenkosten betragen, und man darf sie in drei Raten zahlen. Einen Makler bezahlt in der Regel der, der ihn beauftragt hat (Bestellerprinzip). Die Miete darf auch nicht beliebig steigen: Eine Orientierung gibt der Mietspiegel der Stadt. Manche suchen deshalb ein Zimmer in einer WG oder eine Zwischenmiete, weil das günstiger ist.

> [!quiz] Wie hoch darf die Kaution höchstens sein?
> level: B1 · type: single · id: de-b1-wohnungssuche-q02
> - [ ] zwei Monatsmieten
> - [x] drei Monatsmieten ohne Nebenkosten
> - [ ] sechs Monatsmieten
> - [ ] eine Warmmiete
>
> **Пояснення:** у тексті: «höchstens drei Monatsmieten ohne Nebenkosten», тобто три Kaltmieten (§ 551 BGB). Warmmiete включає комунальні, тому не підходить.

> [!quiz] Які документи зазвичай хоче побачити орендодавець?
> level: B1 · type: multi · id: de-b1-wohnungssuche-q03
> - [x] Selbstauskunft
> - [x] Einkommensnachweis
> - [x] Schufa-Auskunft
> - [ ] Arbeitszeugnis des letzten Jobs
>
> **Пояснення:** у тексті названі три: *Selbstauskunft, Einkommensnachweis, Schufa-Auskunft*. Arbeitszeugnis потрібне для заявки на роботу (тема 16), а не на оренду.

> [!quiz] Хто зазвичай платить Makler за Bestellerprinzip?
> level: B1 · type: single · id: de-b1-wohnungssuche-q04
> - [ ] завжди орендар
> - [ ] завжди орендодавець
> - [x] той, хто замовив послугу
> - [ ] держава
>
> **Пояснення:** у тексті: «Einen Makler bezahlt in der Regel der, der ihn beauftragt hat». Якщо Makler найняв орендодавець, орендар його не оплачує.

## Практика

> [!quiz] Хто такий Nachmieter?
> level: B1 · type: single · id: de-b1-wohnungssuche-q05
> - [ ] той, хто жив у квартирі раніше
> - [x] той, хто заселяється після тебе
> - [ ] той, хто здає квартиру
> - [ ] сусід по сходовій клітці
>
> **Пояснення:** *der Nachmieter* («наступний орендар») замінює тебе в договорі. *Попередній* — *der Vormieter*, *орендодавець* — *der Vermieter*.

> [!quiz] Що зазвичай входить у Nebenkosten?
> level: B1 · type: multi · id: de-b1-wohnungssuche-q06
> - [x] вивіз сміття
> - [x] прибирання сходів
> - [x] ліфт і опалення будинку
> - [ ] твій окремий рахунок за електрику
>
> **Пояснення:** до Nebenkosten належать спільні витрати будинку (сміття, прибирання, ліфт, часто опалення і вода). Електрику з власним лічильником зазвичай оплачують за окремим договором.

> [!quiz] Заповни пропуски: розмова про оренду
> level: B1 · type: fill · bank: Schimmel, Hausordnung · id: de-b1-wohnungssuche-q07
>
> ```text fill
> Die [[Kaltmiete]] beträgt 900 Euro, dazu kommen 200 Euro [[Nebenkosten]].
> Zusammen ist das die [[Warmmiete]].
> Als [[Kaution]] zahlt man höchstens drei Kaltmieten.
> ```
>
> **Пояснення:** оренда без комунальних — *Kaltmiete*, комунальні — *Nebenkosten*, їх сума — *Warmmiete*, застава — *Kaution*. *Schimmel* («пліснява») і *Hausordnung* («правила будинку») за змістом не підходять.

> [!quiz] Склади питання: «Коли можна оглянути квартиру?»
> level: B1 · type: order · id: de-b1-wohnungssuche-q08
>
> ```text order
> Wann
> kann
> ich
> die
> Wohnung
> besichtigen?
> besichtigt ✗
> ```
>
> **Пояснення:** питальне слово → модальне дієслово *kann* → підмет → решта; інфінітив *besichtigen* — в кінці. *besichtigt* було б Partizip II.

> [!quiz] Склади питання: «Коли Ви виїжджаєте?»
> level: B1 · type: order · id: de-b1-wohnungssuche-q09
>
> ```text order
> Wann
> ziehen
> Sie
> aus?
> ausziehen ✗
> ```
>
> **Пояснення:** відокремлюваний префікс *aus* стоїть у кінці, а *ziehen* — на другому місці. Інфінітив *ausziehen* тут не потрібен.

> [!quiz] Заповни пропуски: хто що робить
> level: B1 · type: fill · bank: Vormieter, Eigentümer · id: de-b1-wohnungssuche-q10
>
> ```text fill
> Der Eigentümer [[vermietet]] die Wohnung an einen Studenten.
> Der Student [[mietet]] sie für 500 Euro im Monat.
> Wenn der Student auszieht, sucht er einen [[Nachmieter]].
> ```
>
> **Пояснення:** власник *здає* (*vermietet*), студент *знімає* (*mietet*). Коли він виїжджає, шукає *Nachmieter* — людину, що заселиться після нього. *Vormieter* — попередній орендар, *Eigentümer* — власник.

> [!quiz] Як сказати: «Я здаю свою квартиру»?
> level: B1 · type: single · id: de-b1-wohnungssuche-q11
> - [x] Ich vermiete meine Wohnung.
> - [ ] Ich miete meine Wohnung.
> - [ ] Ich mietete meine Wohnung aus.
> - [ ] Ich verkaufe meine Wohnung zum Mieten.
>
> **Пояснення:** здавати в оренду — *vermieten*. *mieten* — знімати у когось іншого. Інші варіанти — вигадані конструкції.

> [!quiz] При огляді ти бачиш пліснявину у ванній. Що правильно зробити?
> level: B1 · type: single · id: de-b1-wohnungssuche-q12
> - [ ] нічого не казати й розібратися пізніше
> - [x] записати дефект у Übergabeprotokoll і сфотографувати
> - [ ] одразу виїхати й вимагати заставу
> - [ ] замалювати самому до приходу орендодавця
>
> **Пояснення:** *Mängel* фіксують у *Übergabeprotokoll* разом з орендодавцем. Так пізніше не скажуть, що пошкодження зробив ти.

## Фішки

> [!reel] 🤫 Ruhezeiten: тиша як закон і звичай
> У німецьких будинках важлива *Ruhe*. *Nachtruhe* часто діє приблизно з 22:00 до 6:00, у багатьох будинках є й *Mittagsruhe*, а неділя — загалом день тиші. Точні години беруть із *Hausordnung* та місцевих правил, тому в різних містах і землях вони різні. Прання вночі й свердління в неділю краще не планувати.

> [!reel] 🔑 Wohnung без кухні?
> Приїжджих це здивовує: у Німеччині нерідко здають квартиру **без кухні**: ні шаф, ні плити, подекуди навіть без світильників. Якщо в оголошенні немає *EBK* (*Einbauküche*), то кухню потрібно купувати чи брати в *Vormieter* («Küchenübernahme»). Тому одразу питай: *Ist eine Küche vorhanden?*

> [!reel] 🔢 Скільки це «кімнат»?
> В оголошеннях *3-Zimmer-Wohnung* зазвичай означає три кімнати **без** кухні, ванної та коридору: це *3 Zimmer + Küche + Bad*. Тому за кількістю Zimmer квартири не порівнюють — дивись ще й на *Wohnfläche* в квадратних метрах.

## Джерела та що почитати

- [§ 551 BGB — Begrenzung und Anlage von Mietsicherheiten](https://www.gesetze-im-internet.de/bgb/__551.html): Kaution до трьох місячних оплат, платіж у три частини.
- [§ 573c BGB — Fristen der ordentlichen Kündigung](https://www.gesetze-im-internet.de/bgb/__573c.html): терміни розірвання договору оренди.
- [Wohnungsvermittlungsgesetz](https://www.gesetze-im-internet.de/wovermrg/): правила оплати Makler, Bestellerprinzip.
- [DWDS — Kaution](https://www.dwds.de/wb/Kaution): значення слова й приклади.
- [DWDS — Schufa](https://www.dwds.de/wb/Schufa): значення скорочення.
- [DWDS — Nachmieter](https://www.dwds.de/wb/Nachmieter): слово й приклади.
- [DWDS — Warmmiete](https://www.dwds.de/wb/Warmmiete): значення й складові.

> [!important] Підсумок
> - *Warmmiete = Kaltmiete + Nebenkosten*; електрику, інтернет та *Rundfunkbeitrag* зазвичай платиш окремо.
> - *Kaution* — до трьох Kaltmieten, можна частинами (§ 551 BGB); після виїзду її повертають.
> - На огляді просять *Selbstauskunft, Einkommensnachweis, Schufa-Auskunft*.
> - *mieten* — знімати, *vermieten* — здавати; *einziehen* — вʼїхати, *ausziehen* — виїхати, *umziehen* — переїхати.
> - Дефекти записуй у *Übergabeprotokoll*; про години тиші — в *Hausordnung*.
