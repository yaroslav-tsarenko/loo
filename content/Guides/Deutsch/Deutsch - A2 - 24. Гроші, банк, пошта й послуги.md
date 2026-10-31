---
title: Гроші, банк, пошта й послуги
id: de-a2-geld
level: A2
icon: px:coins
tags: [deutsch, a2, vocabulary, geld, bank, post]
prerequisites: ["[[Deutsch - A1 - 22. Одяг, кольори й у магазині]]", "[[Deutsch - A2 - 05. Давальний відмінок — Dativ]]"]
estimatedMinutes: 40
---

# Гроші, банк, пошта й послуги

> [!success] Після цієї теми ти зможеш
> - спитати й відповісти, як платити: *Zahlen Sie bar oder mit Karte?*, *Kann ich kontaktlos zahlen?*;
> - зняти гроші, зробити *Überweisung*, назвати *IBAN* і *Betrag*, прочитати *Kontoauszug*;
> - забрати *Paket* на пошті, купити *Briefmarke*, розібратися з *Benachrichtigung* від курʼєра;
> - повернути чи обміняти товар і сказати, що саме зламано: *Ich möchte das reklamieren*;
> - зрозуміти, чому в Німеччині ще часто потрібні готівка й *Pfand*.

## Передбач

> [!quiz] Касирка питає: «Zahlen Sie bar oder mit Karte?» Що вона питає?
> level: A2 · type: single · id: de-a2-geld-q01
> - [ ] Чи маєте Ви решту.
> - [x] Чи платите Ви готівкою, чи карткою.
> - [ ] Чи потрібен Вам чек.
>
> **Пояснення:** ***bar*** — «готівкою» (*bar zahlen*), ***mit Karte*** — «карткою». Слово *bar* не змінюється й не має артикля: *Ich zahle bar.*

## Пояснення

### Як платити: bar, mit Karte, kontaktlos

На касі найчастіше чуєш три слова. ***Bar*** — готівка (*Bargeld* — готівкові гроші). ***Mit Karte*** — карткою, зазвичай банківською карткою *Girocard* (розмовно *EC-Karte*) або *Kreditkarte*. ***Kontaktlos*** — прикласти картку чи телефон до терміналу без вводу *PIN*.

| Фраза | Значення |
|---|---|
| Zahlen Sie **bar** oder **mit Karte**? | Платите готівкою чи карткою? |
| Ich zahle **bar**. | Я плачу готівкою. |
| Kann ich **mit Karte** zahlen? | Можна заплатити карткою? |
| Nur **Barzahlung**, bitte. | Лише готівка (оголошення в кафе). |
| Bitte **kontaktlos** oder mit **PIN**. | Прикладіть картку або введіть PIN. |
| Stimmt so! | Решти не треба (*Trinkgeld* вже враховано). |

Дієслово ***zahlen*** можна вживати без обʼєкта (*Ich zahle bar*), а ***bezahlen*** найчастіше має обʼєкт (*Ich bezahle die Rechnung*), але в кафе чи ресторані кажуть і без нього: *Ich möchte bezahlen*. Грошові одиниці після числа стоять **без закінчення**: *zehn Euro, fünf Cent*. Вживання *Euros* і *Cents* чути в живій мові, але в тексті й на ціннику пишуть *Euro* і *Cent*.

### Банк: Konto, Überweisung, IBAN

У Німеччині майже кожен має ***Girokonto*** — поточний рахунок, на який приходить зарплата і з якого платять за житло. Найважливіший номер — ***IBAN***. Німецька IBAN складається з 22 знаків: *DE*, дві контрольні цифри, 8 цифр коду банку (*Bankleitzahl*) і 10 цифр номера рахунку. В Австрії IBAN має 20 знаків (*AT…*), у Швейцарії — 21 (*CH…*).

| Операція | Німецькою | Приклад |
|---|---|---|
| Зняти готівку | **abheben** | Ich möchte 100 Euro **abheben**. |
| Покласти готівку | **einzahlen** | Ich möchte Geld **einzahlen**. |
| Переказати | **überweisen** | Ich **überweise** die Miete. |
| Список операцій | der **Kontoauszug** | Den **Kontoauszug** drucke ich am Automaten. |
| Скільки на рахунку | das **Guthaben** | Mein **Guthaben** ist niedrig. |

> [!diagram] Три способи платити з рахунку
> ```yaml
> layout: compare
> columns: { a: "Überweisung", b: "Dauerauftrag", c: "Lastschrift" }
> nodes:
>   - { id: a1, col: a, label: "Хто починає", text: "ти сам: вводиш IBAN і Betrag", note: "один раз, коли треба", tone: yellow }
>   - { id: a2, col: a, label: "Коли", text: "одноразово", note: "Ich überweise Ihnen das Geld.", tone: yellow }
>   - { id: b1, col: b, label: "Хто починає", text: "ти один раз налаштовуєш", note: "банк надсилає сам", tone: pink }
>   - { id: b2, col: b, label: "Коли", text: "щомісяця, та сама сума", note: "наприклад, Miete", tone: pink }
>   - { id: c1, col: c, label: "Хто починає", text: "отримувач списує гроші сам (abbuchen)", note: "ти даєш дозвіл", tone: gray }
>   - { id: c2, col: c, label: "Коли", text: "щоразу, сума може бути різна", note: "наприклад, телефон, електрика", tone: gray }
> steps:
>   - { focus: [a1, a2], note: "Überweisung: ти вказуєш отримувача, IBAN і суму, і банк переказує гроші. Звичайно це разова оплата." }
>   - { focus: [b1, b2], note: "Dauerauftrag: ти даєш банку постійне доручення. Сума й дата однакові, наприклад, оренда щомісяця." }
>   - { focus: [c1, c2], note: "Lastschrift: ти дозволяєш фірмі саме списувати гроші. Сума буває різна, тому дивись Kontoauszug." }
> ```
> Кольори тут нічого не означають, це лише розрізнення стовпців; назву способу завжди видно в заголовку.

### Чек, квитанція, рахунок

Три слова легко сплутати. ***Der Kassenbon*** — чек з каси. ***Die Quittung*** — підтвердження, що ти заплатив (її просять, наприклад, для податків або орендодавця). ***Die Rechnung*** — рахунок, який ще треба оплатити (у кафе *Die Rechnung, bitte!*). Рахунок у банку — це *das Konto*, а не *die Rechnung*.

### Пошта: Paket, Päckchen, Briefmarke

На пошті (*die Post*, відділення — *die Filiale*) ти підходиш до віконця (***der Schalter***). На лист (*der Brief*) клеїш марку (***die Briefmarke***) і кидаєш його в поштову скриньку (***der Briefkasten***). Посилку відправляють як ***Päckchen*** (менше й легше) або ***Paket***. Кожна ***Sendung*** має номер для відстеження. Якщо курʼєр тебе не застав, у поштовій скриньці залишається картка-повідомлення, і посилку треба ***abholen***: у відділенні чи пункті видачі, зазвичай з документом, що посвідчує особу.

> [!diagram] Посилку не вручили. Що робити?
> ```yaml
> layout: flow
> nodes:
>   - { id: card, label: "1. Картка в скриньці", text: "Benachrichtigung", note: "там написано, де лежить посилка", tone: yellow }
>   - { id: place, label: "2. Місце", text: "Filiale або пункт видачі", note: "години роботи на картці", tone: pink }
>   - { id: doc, label: "3. Що взяти", text: "картку + документ з фото", note: "інколи — довіреність для іншого", tone: yellow }
>   - { id: sign, label: "4. Підпис", text: "unterschreiben на Schalter", note: "і перевір, чи ціла коробка", tone: gray }
> edges:
>   - { from: card, to: place, label: "йду" }
>   - { from: place, to: doc, label: "на Schalter" }
>   - { from: doc, to: sign, label: "отримую" }
> steps:
>   - { focus: card, note: "Якщо тебе не було вдома, курʼєр залишає повідомлення: на ньому видно відділення чи пункт видачі, де лежить посилка." }
>   - { focus: place, note: "Йдемо у вказане місце. Перевір години роботи, особливо в суботу." }
>   - { focus: doc, note: "Покажи картку (або номер Sendung) і документ з фото. Для чужої посилки потрібна довіреність." }
>   - { focus: sign, note: "Підписуєш отримання. Якщо коробка пошкоджена, скажи про це одразу при видачі." }
> ```

### Reklamation: коли щось не так

***Reklamieren*** — заявити претензію, що товар чи послуга несправні. ***Die Reklamation*** — сама претензія. Це не «реклама»: рекламу німецькою називають ***die Werbung***. Якщо товар зламаний, його можна ***zurückgeben*** або ***umtauschen*** (слово *Umtausch* ти вже знаєш з теми про одяг). Закон дає на несправний новий товар **два роки** гарантійних прав (*Gewährleistung*, §438 BGB). Чи візьме магазин назад справний (бездефектний) товар, який просто не сподобався, залежить від самого магазину. Тому чек (*Kassenbon*) варто зберігати.

### Pfand: застава за пляшку

На більшості одноразових пластикових пляшок і банок з напоями, які купують у Німеччині, є ***Pfand***: 25 Cent за одиницю, і ця застава входить до ціни. Порожню пляшку ти здаєш в апарат у супермаркеті, а на касі отримуєш *Pfandbon*. Його віднімають від суми чека. Окремо є **Mehrweg**-пляшки, які використовують повторно; для них застава інша. Для багатьох речей є й *Pfand* на ключі чи візки.

## Приклади

- *Ich möchte hundert Euro **abheben**.* — Я хочу зняти сто євро.
- *Wie lautet Ihre **IBAN**?* — Який Ваш номер IBAN?
- *Bitte **überweisen** Sie den **Betrag** bis Freitag.* — Будь ласка, перекажіть суму до пʼятниці.
- *Die **Gebühr** beträgt fünf Euro.* — Комісія становить пʼять євро.
- *Haben Sie **Wechselgeld**?* — У Вас є решта?
- *Ich zahle immer **kontaktlos**.* — Я завжди плачу безконтактно.
- *Ich habe einen **Dauerauftrag** für die Miete.* — У мене постійне доручення на оренду.
- *Ich möchte dieses **Paket** **abholen**.* — Я хочу забрати цю посилку.
- *Eine **Briefmarke** für einen Brief nach Kyjiw, bitte.* — Одну марку для листа до Києва, будь ласка.
- *Ich möchte die Jacke **zurückgeben**.* — Я хочу повернути куртку.
- *Hier ist die **Quittung**.* — Ось квитанція.
- *Das Pfand für die Flasche ist im Preis drin.* — Застава за пляшку вже в ціні.

## Слова

### Гроші й оплата

> [!word] die Zahlung
> ipa: /ˈtsaːlʊŋ/ · pos: noun · level: A2 · id: de-a2-geld-w01
> uk: оплата; платіж
> forms: die Zahlungen
> example: Die **Zahlung** ist per Karte möglich. — Оплата можлива карткою.
> note: від zahlen. z = [ts]. Barzahlung = оплата готівкою, Kartenzahlung = оплата карткою.

> [!word] kontaktlos
> ipa: /kɔnˈtaktloːs/ · pos: adj · level: A2 · id: de-a2-geld-w02
> uk: безконтактний; безконтактно
> example: Hier kann man **kontaktlos** zahlen. — Тут можна платити безконтактно.
> note: -los = «без» (kontaktlos, kostenlos). Наголос на другому складі: kon-TAKT-los.

> [!word] der Cent
> ipa: /sɛnt/ · pos: noun · level: A2 · id: de-a2-geld-w03
> uk: цент (сота частка євро)
> forms: die Cents (після числа: fünf Cent)
> example: Das kostet neunundneunzig **Cent**. — Це коштує девʼяносто девʼять центів.
> note: після числа без закінчення: fünf Cent. Множина Cents вживається, коли йдеться про самі монети. c на початку — [s].

> [!word] die Münze
> ipa: /ˈmʏntsə/ · pos: noun · level: A2 · id: de-a2-geld-w04
> uk: монета
> forms: die Münzen
> example: Der Automat nimmt nur **Münzen**. — Автомат приймає лише монети.
> note: ü = [ʏ], коротке й округлене, не «ю»; nz + e = «нце».

> [!word] der Schein
> ipa: /ʃaɪ̯n/ · pos: noun · level: A2 · id: de-a2-geld-w05
> uk: банкнота; (також) довідка, посвідчення
> forms: die Scheine
> example: Haben Sie einen kleinen **Schein**? — У Вас є дрібна банкнота?
> note: der Geldschein = банкнота. Не плутай із scheinen («світити; здаватися»).

> [!word] die Geldbörse
> ipa: /ˈɡɛltˌbøːɐ̯zə/ · pos: noun · level: A2 · id: de-a2-geld-w06
> uk: гаманець
> forms: die Geldbörsen
> note: AT і CH також Geldbörse / Portemonnaie; розмовно DE: das Portemonnaie, на півдні й заході — der Geldbeutel.
> example: Meine **Geldbörse** liegt zu Hause. — Мій гаманець лежить удома.

> [!word] das Wechselgeld
> ipa: /ˈvɛksl̩ɡɛlt/ · pos: noun · level: A2 · id: de-a2-geld-w07
> uk: решта (гроші)
> forms: — (без множини)
> example: Ich habe leider kein **Wechselgeld**. — На жаль, у мене немає решти.
> note: від wechseln. AT, CH: часто Retourgeld / Rückgeld. w у Wechsel- читаємо як [v].

> [!word] wechseln
> ipa: /ˈvɛksl̩n/ · pos: verb · level: A2 · id: de-a2-geld-w08
> uk: розміняти; обміняти (валюту); змінити
> forms: wechseln → wechselte → hat gewechselt
> example: Können Sie bitte zehn Euro **wechseln**? — Чи можете Ви розміняти десять євро?
> note: Geld wechseln — і розміняти, і обміняти валюту. ch тут [ks]: «векселн».

> [!word] sparen
> ipa: /ˈʃpaːʁən/ · pos: verb · level: A2 · id: de-a2-geld-w09
> uk: заощаджувати; збирати гроші
> forms: sparen → sparte → hat gespart
> example: Ich **spare** für ein Auto. — Я збираю гроші на авто.
> note: sp на початку слова = [ʃp], «шп»: sparen — «шпарен». Sparkasse — банк.

> [!word] die Schulden
> ipa: /ˈʃʊldn̩/ · pos: noun · level: B1 · id: de-a2-geld-w10
> uk: борги
> forms: — (лише множина: die Schulden)
> example: Er hat keine **Schulden**. — У нього немає боргів.
> note: слово вживається майже завжди у множині. Однина die Schuld = вина; Schuld haben — бути винним.

### У банку

> [!word] das Konto
> ipa: /ˈkɔnto/ · pos: noun · level: A2 · id: de-a2-geld-w11
> uk: рахунок (у банку)
> forms: die Konten
> example: Ich habe ein **Konto** bei der Sparkasse. — У мене є рахунок у Sparkasse.
> note: AT: die Konten або Kontos. Рахунок на оплату — die Rechnung, а не das Konto.

> [!word] das Girokonto
> ipa: /ˈʒiːʁoˌkɔnto/ · pos: noun · level: A2 · id: de-a2-geld-w12
> uk: поточний рахунок
> forms: die Girokonten
> example: Mein Gehalt kommt auf das **Girokonto**. — Моя зарплата надходить на поточний рахунок.
> note: Giro — [ʒ], як французьке j. Скорочено: das Konto. Girocard — банківська картка до цього рахунку.

> [!word] überweisen
> ipa: /yːbɐˈvaɪ̯zn̩/ · pos: verb · level: A2 · id: de-a2-geld-w13
> uk: переказувати (гроші)
> forms: überweisen → überwies → hat überwiesen
> example: Ich **überweise** das Geld morgen. — Я переказую гроші завтра.
> note: невідокремлюване (über- не наголошене): ich überweise, а не ~~ich weise über~~. Перфект без ge-.

> [!word] die IBAN
> ipa: /ˈiːban/ · pos: noun · level: A2 · id: de-a2-geld-w14
> uk: IBAN, міжнародний номер рахунку
> forms: die IBANs
> example: Bitte geben Sie hier Ihre **IBAN** ein. — Будь ласка, введіть тут свій IBAN.
> note: множина вживається рідко. Вимовляють як слово [ˈiːban] або по літерах. DE-IBAN має 22 знаки, AT — 20, CH — 21.

> [!word] der Kontoauszug
> ipa: /ˈkɔntoˌʔaʊ̯stsuːk/ · pos: noun · level: A2 · id: de-a2-geld-w15
> uk: виписка з рахунку
> forms: die Kontoauszüge
> example: Ich brauche einen aktuellen **Kontoauszug**. — Мені потрібна свіжа виписка з рахунку.
> note: Konto + der Auszug, тому der. Множина з умлаутом: Kontoauszüge. g на кінці = [k].

> [!word] abheben
> ipa: /ˈapheːbn̩/ · pos: verb · level: A2 · id: de-a2-geld-w16
> uk: знімати (гроші)
> forms: abheben → hob ab → hat abgehoben
> example: Ich möchte Geld **abheben**. — Я хочу зняти гроші.
> note: відокремлюване: Ich hebe Geld ab. Наголос на ab-. Сильне дієслово.

> [!word] einzahlen
> ipa: /ˈaɪ̯ntsaːlən/ · pos: verb · level: A2 · id: de-a2-geld-w17
> uk: вносити, класти (гроші на рахунок)
> forms: einzahlen → zahlte ein → hat eingezahlt
> example: Wo kann ich Bargeld **einzahlen**? — Де я можу покласти готівку на рахунок?
> note: відокремлюване: Ich zahle Geld ein. Протилежне до abheben.

> [!word] der Geldautomat
> ipa: /ˈɡɛltʔaʊ̯toˌmaːt/ · pos: noun · level: A2 · id: de-a2-geld-w18
> uk: банкомат
> forms: die Geldautomaten
> example: Wo ist der nächste **Geldautomat**? — Де найближчий банкомат?
> note: AT: der Bankomat; CH: der Bancomat. Розмовно скорочують: der Automat.

> [!word] die Sparkasse
> ipa: /ˈʃpaːɐ̯ˌkasə/ · pos: noun · level: A2 · id: de-a2-geld-w19
> uk: ощадна каса (тип банку в Німеччині)
> forms: die Sparkassen
> example: Meine **Sparkasse** hat eine Filiale im Zentrum. — У моєї Sparkasse є відділення в центрі.
> note: Sparkassen — публічно-правові банки з відділеннями майже в кожному місті; їхній знак — червоне S. Інший поширений тип — Volksbank.

> [!word] die PIN
> ipa: /pɪn/ · pos: noun · level: A2 · id: de-a2-geld-w20
> uk: PIN-код
> forms: die PINs
> example: Bitte geben Sie Ihre **PIN** ein. — Будь ласка, введіть свій PIN.
> note: рід — die (від die Nummer): die PIN, die Geheimnummer. Вимова як англійське pin.

> [!word] die Gebühr
> ipa: /ɡəˈbyːɐ̯/ · pos: noun · level: A2 · id: de-a2-geld-w21
> uk: комісія; збір; плата
> forms: die Gebühren
> example: Diese Überweisung kostet keine **Gebühr**. — Цей переказ без комісії.
> note: ü тут довге [yː]. Наголос на другому складі. Kontoführungsgebühr — плата за ведення рахунку.

> [!word] der Betrag
> ipa: /bəˈtʁaːk/ · pos: noun · level: A2 · id: de-a2-geld-w22
> uk: сума
> forms: die Beträge
> example: Der **Betrag** ist fällig am Ersten. — Сума підлягає сплаті першого числа.
> note: g у кінці = [k] («бетрак»), у множині Beträge — [ɡ]. Не «бюджет», а конкретна сума.

> [!word] der Dauerauftrag
> ipa: /ˈdaʊ̯ɐˌʔaʊ̯ftʁaːk/ · pos: noun · level: A2 · id: de-a2-geld-w23
> uk: постійне платіжне доручення
> forms: die Daueraufträge
> example: Die Miete zahle ich per **Dauerauftrag**. — Оренду я плачу за постійним дорученням.
> note: Dauer + Auftrag. Множина з умлаутом: Daueraufträge.

> [!word] die Lastschrift
> ipa: /ˈlastʃʁɪft/ · pos: noun · level: A2 · id: de-a2-geld-w24
> uk: прямий дебет (списування з рахунку отримувачем)
> forms: die Lastschriften
> example: Die Stromrechnung wird per **Lastschrift** bezahlt. — Рахунок за світло сплачується прямим дебетом.
> note: Last-schrift: st не на початку слова, тому читається [st]; sch = [ʃ]. Частіше чуєш SEPA-Lastschrift.

> [!word] abbuchen
> ipa: /ˈapbuːxn̩/ · pos: verb · level: A2 · id: de-a2-geld-w25
> uk: списувати (з рахунку)
> forms: abbuchen → buchte ab → hat abgebucht
> example: Die Gebühr wird jeden Monat **abgebucht**. — Комісію щомісяця списують.
> note: відокремлюване. Часто у пасиві: wird abgebucht. ch після u = [x].

> [!word] das Guthaben
> ipa: /ˈɡuːtˌhaːbn̩/ · pos: noun · level: B1 · id: de-a2-geld-w26
> uk: залишок на рахунку; кошти на рахунку
> forms: die Guthaben
> example: Mein **Guthaben** reicht für die Miete. — Мого залишку вистачає на оренду.
> note: gut + haben. Протилежне — Schulden. Також залишок на телефоні чи в картці.

### Пошта й посилки

> [!word] die Briefmarke
> ipa: /ˈbʁiːfˌmaʁkə/ · pos: noun · level: A2 · id: de-a2-geld-w27
> uk: поштова марка
> forms: die Briefmarken
> example: Ich brauche zwei **Briefmarken**. — Мені потрібні дві марки.
> note: Brief + Marke. Не плутай із die Marke («бренд»). f тут — [f].

> [!word] das Paket
> ipa: /paˈkeːt/ · pos: noun · level: A2 · id: de-a2-geld-w28
> uk: посилка
> forms: die Pakete
> example: Mein **Paket** ist noch nicht da. — Моєї посилки ще немає.
> note: AT, CH: das Paket. Наголос на другому складі: pa-KET. Не плутай: die Packung (упаковка).

> [!word] das Päckchen
> ipa: /ˈpɛkçən/ · pos: noun · level: A2 · id: de-a2-geld-w29
> uk: маленька посилка
> forms: die Päckchen
> example: Ich schicke ein **Päckchen** nach Polen. — Я надсилаю маленьку посилку до Польщі.
> note: -chen → das. Менше й легше за Paket. ä = [ɛ]; ch після ck = [ç].

> [!word] die Sendung
> ipa: /ˈzɛndʊŋ/ · pos: noun · level: A2 · id: de-a2-geld-w30
> uk: відправлення; передача (ТВ)
> forms: die Sendungen
> example: Mit der **Sendungsnummer** können Sie das Paket verfolgen. — За номером відправлення Ви можете відстежити посилку.
> note: -ung → die. Sendungsnummer — трекінг-номер. s перед e = [z].

> [!word] die Filiale
> ipa: /fiˈli̯aːlə/ · pos: noun · level: A2 · id: de-a2-geld-w31
> uk: відділення (банку, пошти, магазину)
> forms: die Filialen
> example: Die **Filiale** schließt um 18 Uhr. — Відділення зачиняється о 18:00.
> note: Postfiliale, Bankfiliale. Наголос на другому складі.

### Претензії й повернення

> [!word] die Reklamation
> ipa: /ʁeklamaˈtsi̯oːn/ · pos: noun · level: B1 · id: de-a2-geld-w32
> uk: претензія, рекламація
> forms: die Reklamationen
> example: Meine **Reklamation** wurde angenommen. — Мою претензію прийняли.
> note: хибний друг: це не реклама (die Werbung). Наголос на -on. -ion → die.

> [!word] reklamieren
> ipa: /ʁeklaˈmiːʁən/ · pos: verb · level: B1 · id: de-a2-geld-w33
> uk: заявляти претензію (щодо дефекту)
> forms: reklamieren → reklamierte → hat reklamiert
> example: Ich möchte den Fehler **reklamieren**. — Я хочу заявити претензію щодо дефекту.
> note: хибний друг: не «рекламувати» (werben für). -ieren без ge- у Partizip II.

> [!word] zurückgeben
> ipa: /tsuˈʁʏkɡeːbn̩/ · pos: verb · level: A2 · id: de-a2-geld-w34
> uk: повертати (річ)
> forms: zurückgeben → gab zurück → hat zurückgegeben (er gibt zurück)
> example: Kann ich die Hose **zurückgeben**? — Чи можу я повернути штани?
> note: відокремлюване, наголос на -rück-. gibt: i, а не «gebt».

## Слухаємо

> [!listen] Що хоче зробити клієнт?
> level: A2 · type: choice · speed: slow · id: de-a2-geld-l01
> audio: Ich möchte hundert Euro abheben.
> - [ ] Ich möchte hundert Euro einzahlen.
> - [ ] Ich möchte hundert Euro überweisen.
> - [x] Ich möchte hundert Euro abheben.
>
> **Пояснення:** *abheben* — зняти гроші, *einzahlen* — покласти, *überweisen* — переказати. Відокремлюване *ab* наголошене й стоїть у кінці в реченні з *möchte*.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-geld-l02
> audio: Ich bezahle die Rechnung mit Karte.
> explain: bezahlen + Akkusativ (die Rechnung); mit Karte — без артикля.

> [!listen] Заповни дані постійного доручення
> level: A2 · type: fill · speed: slow · id: de-a2-geld-l03
> audio: A: Guten Tag, ich möchte einen Dauerauftrag einrichten.
> audio: B: Gern. Für wen?
> audio: A: Für meine Vermieterin, Frau Weber.
> audio: B: Und wie viel pro Monat?
> audio: A: Sechshundertfünfzig Euro.
> audio: B: Ab wann soll es gelten?
> audio: A: Ab Dezember.
>
> ```fill
> Empfängerin: Frau [[Weber]]
> Betrag pro Monat: [[650|sechshundertfünfzig]] Euro
> Ab: [[Dezember]]
> ```

> [!listen] Де Ви отримаєте посилку?
> level: A2 · type: answer · speed: slow · id: de-a2-geld-l04
> audio: Pakete holen Sie bitte am Schalter drei ab. Der Schalter ist von neun bis siebzehn Uhr geöffnet.
> - [ ] на вході
> - [x] біля віконця три
> - [ ] у поштовій скриньці
> - [ ] у віконці девʼять
>
> **Пояснення:** *am Schalter drei* — біля віконця три. *Neun bis siebzehn Uhr* — це час роботи (9:00–17:00), а не номер віконця.

## Вимова

Ти вже знаєш, що **z = [ts]** (*zahlen* — «цален») і що **ü** — не «ю» (*Münze, Gebühr*). Тут корисно потренувати також **sp-** на початку слова: *sparen, Sparkasse* звучить «шп-».

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-geld-s01
> text: Zahlen Sie bar oder mit Karte?
> ipa: /ˈtsaːlən ziː baːɐ̯ ˈoːdɐ mɪt ˈkaʁtə/
> tip: z — [ts], «ц»; bar — довге [aː], r майже не чути; oder — наголос на першому складі.
> uk: Платите готівкою чи карткою?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-geld-s02
> text: Ich möchte hundert Euro abheben.
> ipa: /ɪç ˈmœçtə ˈhʊndɐt ˈɔʏ̯ʁo ˈapheːbn̩/
> tip: ich — [ç], як тихе «хь»; möchte — ö коротке й округлене, не «йо»; Euro — [ɔʏ̯], «ойро».
> uk: Я хочу зняти сто євро.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-geld-s03
> text: Wie lautet Ihre IBAN?
> ipa: /viː ˈlaʊ̯tət ˈiːʁə ˈiːban/
> tip: w — [v]; lautet — наголос на першому складі, au = [aʊ̯]; IBAN — «і-бан», довге перше [iː].
> uk: Який Ваш номер IBAN?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-geld-s04
> text: Ich möchte dieses Paket abholen.
> ipa: /ɪç ˈmœçtə ˈdiːzəs paˈkeːt ˈaphoːlən/
> tip: Paket — наголос на другому складі, довге напружене [eː]; h у holen — легкий видих [h], не «г».
> uk: Я хочу забрати цю посилку.

## Типові помилки українців

> [!pitfall] Reklamation — не реклама
> ~~Wir reklamieren unser Café auf Instagram~~ (хотіли сказати «рекламуємо») → рекламувати німецькою **werben für** (*Wir werben für unser Café*), а реклама — **die Werbung**; ***reklamieren*** означає «заявити претензію про дефект». Хибний друг: *die Reklamation* — це скарга на несправність, а не оголошення. Реклама в телевізорі — *die Werbung*, а рекламний ролик — *der Werbespot*.

> [!pitfall] bar — це не іменник
> ~~Ich zahle mit Bar~~, ~~Ich zahle auf Bargeld~~ → Ich zahle **bar** / **in bar** / **mit Bargeld**. Слово *bar* — прикметник-прислівник «готівкою», воно не змінюється. Картка — *mit Karte* (без артикля), а готівка — *bar* або *mit Bargeld*.

> [!pitfall] Konto ≠ Rechnung
> ~~Ich habe eine Rechnung bei der Sparkasse~~ (хотіли сказати «рахунок у банку») → Ich habe ein **Konto** bei der Sparkasse. Українське «рахунок» має два значення. Німецькою **das Konto** — рахунок у банку, **die Rechnung** — рахунок на оплату (у ресторані, від лікаря, за послугу). Потрібен документ про вже зроблену оплату? Це *die Quittung* або *der Kassenbon*.

> [!pitfall] Euros і Cents
> ~~zwei Euros~~, ~~fünf Cents~~ → **zwei Euro**, **fünf Cent**. Після числа назви грошей стоять без закінчення: *drei Euro fünfzig*, *zehn Cent*. Форму *Cents* чути в розмові, але в тексті, на ціннику й у формулярі пишуть *Cent*. Слово *Euros* вживають, коли говорять про самі монети чи купюри.

## Ситуація: на пошті й у магазині

> [!listen] Оксана на пошті. Що їй потрібно показати?
> level: A2 · type: answer · speed: slow · id: de-a2-geld-l05
> audio: A: Guten Tag. Ich möchte ein Paket abholen.
> audio: B: Haben Sie die Benachrichtigung dabei?
> audio: A: Ja, hier. Und mein Ausweis.
> audio: B: Danke. Einen Moment, bitte. Hier ist Ihr Paket. Bitte unterschreiben Sie hier.
> audio: A: Gern. Danke schön!
> - [x] картку-повідомлення й документ з фото
> - [ ] лише чек
> - [ ] лише IBAN
> - [ ] поштову марку
>
> **Пояснення:** працівниця питає про ***Benachrichtigung*** (картка від курʼєра), а Оксана додає *Ausweis*. Підпис (*unterschreiben*) потрібен під час видачі. Переклад: — Добрий день. Я хочу забрати посилку. — У Вас є повідомлення? — Так, ось. І мій документ. — Дякую. Хвилинку. Ось Ваша посилка. Підпишіть, будь ласка, тут.

> [!speak] Ситуація: скажи на пошті
> level: A2 · speed: slow · id: de-a2-geld-s05
> text: Kann ich bitte mit Karte zahlen?
> ipa: /kan ɪç ˈbɪtə mɪt ˈkaʁtə ˈtsaːlən/
> tip: kann — коротке [a], без подовження; bitte — [ɪ] коротке; zahlen — [ts] і довге [aː].
> uk: Чи можу я, будь ласка, заплатити карткою?

> [!listen] Реклама чи претензія? Чого хоче покупець?
> level: A2 · type: answer · speed: slow · id: de-a2-geld-l06
> audio: A: Guten Tag. Ich habe diese Jacke gestern gekauft, aber der Reißverschluss ist kaputt.
> audio: B: Haben Sie den Kassenbon dabei?
> audio: A: Ja, hier. Kann ich die Jacke umtauschen?
> audio: B: Ja, gern. Möchten Sie eine andere Jacke oder das Geld zurück?
> audio: A: Ich möchte das Geld zurück, bitte.
> - [ ] Він хоче іншу куртку.
> - [x] Він хоче повернути куртку й отримати гроші.
> - [ ] Він хоче додатково купити куртку.
> - [ ] Він хоче змінити розмір.
>
> **Пояснення:** *Das Geld zurück* — гроші назад. Покупець спершу питає про *umtauschen*, але в кінці каже, що хоче повернення коштів. Переклад: — Я купив цю куртку вчора, але блискавка зламана. — У Вас є чек? — Так, ось. Чи можу я обміняти куртку? — Так, звичайно. Бажаєте іншу куртку чи гроші назад? — Гроші назад, будь ласка.

> [!speak] Ситуація: поверни товар
> level: A2 · speed: slow · id: de-a2-geld-s06
> text: Ich möchte die Jacke zurückgeben.
> ipa: /ɪç ˈmœçtə diː ˈjakə tsuˈʁʏkɡeːbn̩/
> tip: Jacke — j = «й», кінцеве -e слабке [ə]; zurück — наголос на -rück-, ü = [ʏ]; -geben — b відкриває склад [b], -en слабке.
> uk: Я хочу повернути куртку.

## Landeskunde: «Nur Bares ist Wahres»

> [!example] Bargeld in Deutschland
> In Deutschland sagt man: „Nur Bares ist Wahres.“ Das heißt: Bargeld ist sicher. Viele Deutsche zahlen im Laden gern mit Münzen und Scheinen. Nach einer Studie der Bundesbank wurde 2025 bei 45 Prozent der Zahlungen bar bezahlt. 2023 waren es noch 51 Prozent. Karten und Handys werden aber immer wichtiger. Trotzdem ist es klug, etwas Bargeld dabeizuhaben. Beim Bäcker, auf dem Markt oder im kleinen Restaurant kann man nicht immer mit Karte zahlen, und manchmal gilt ein Mindestbetrag. Mit der Girocard kann man fast überall zahlen. Eine Kreditkarte nehmen nicht alle Geschäfte.

> [!quiz] Nach dem Text: Wie viel Prozent der Zahlungen waren 2025 bar?
> level: A2 · type: single · id: de-a2-geld-q02
> - [ ] 58 Prozent
> - [ ] 51 Prozent
> - [x] 45 Prozent
> - [ ] 23 Prozent
>
> **Пояснення:** у тексті: *2025 … 45 Prozent*; 51 Prozent — це дані за 2023 рік (а 58 Prozent — за 2021), тобто частка падає. 23 Prozent у дослідженні 2025 року — частка готівки в сумі витрат (за обсягом), а не за кількістю платежів.

> [!quiz] Що радить текст?
> level: A2 · type: single · id: de-a2-geld-q03
> - [ ] Ніколи не платити карткою.
> - [x] Мати при собі трохи готівки.
> - [ ] Брати лише Kreditkarte.
> - [ ] Не платити на ринку.
>
> **Пояснення:** *Es ist klug, etwas Bargeld dabeizuhaben* — розумно мати при собі готівку. Картки в тексті не заборонено: «Karten und Handys werden immer wichtiger». Kreditkarte приймають не всі.

## Практика

> [!quiz] Допоможи: «Я хочу покласти гроші на рахунок.» Яке дієслово?
> level: A2 · type: single · id: de-a2-geld-q04
> - [ ] abheben
> - [x] einzahlen
> - [ ] wechseln
> - [ ] zurückgeben
>
> **Пояснення:** *einzahlen* — внести гроші на рахунок. *Abheben* — зняти, *wechseln* — розміняти, *zurückgeben* — повернути товар.

> [!quiz] Що можна зробити з карткою й рахунком у банку? Обери всі правильні варіанти.
> level: A2 · type: multi · id: de-a2-geld-q05
> - [x] Geld abheben
> - [x] Geld einzahlen
> - [x] Geld überweisen
> - [ ] Geld reklamieren
> - [ ] Briefmarken einzahlen
>
> **Пояснення:** з грошима в банку: *abheben* (зняти), *einzahlen* (покласти), *überweisen* (переказати). *Reklamieren* — заявити претензію щодо дефекту, а марки в банку не вносять (*einzahlen* стосується грошей на рахунок).

> [!quiz] Яке слово означає «рахунок на оплату»?
> level: A2 · type: single · id: de-a2-geld-q06
> - [ ] das Konto
> - [x] die Rechnung
> - [ ] die Sparkasse
> - [ ] der Betrag
>
> **Пояснення:** ***die Rechnung*** — рахунок до сплати (*Die Rechnung, bitte!*). ***Das Konto*** — рахунок у банку, ***der Betrag*** — сума, ***die Sparkasse*** — тип банку.

> [!quiz] Вибери слово: Ich möchte 100 Euro vom Konto ___ (зняти).
> level: A2 · type: fill · id: de-a2-geld-q07 · bank: einzahlen, überweisen
>
> ```text fill
> Ich möchte 100 Euro vom Konto [[abheben]]. (зняти)
> ```
>
> **Пояснення:** *abheben* — зняти. *Einzahlen* — покласти, *überweisen* — переказати; обидва не підходять за значенням.

> [!quiz] Заповни пропуски
> level: A2 · type: fill · id: de-a2-geld-q08 · bank: Cents, Quittung
>
> ```text fill
> Ich zahle immer mit [[Karte]].
> Das kostet drei [[Euro]] fünfzig.
> Ich klebe eine [[Briefmarke]] auf den Brief.
> ```
>
> **Пояснення:** *mit Karte* — без артикля. *Drei Euro fünfzig* — без -s. *Eine Briefmarke* — жіночий рід, тому *eine*. *Cents* (з -s) і *Quittung* тут не підходять.

> [!quiz] Склади речення: «Я переказую оренду на рахунок.»
> level: A2 · type: order · id: de-a2-geld-q09
>
> ```text order
> Ich
> überweise
> die Miete
> auf das Konto.
> weise ✗
> ```
>
> **Пояснення:** *überweisen* невідокремлюване: *ich überweise*. Форма ~~ich weise … über~~ — помилка.

> [!quiz] Склади речення: «Я хочу забрати посилку.»
> level: A2 · type: order · id: de-a2-geld-q10
>
> ```text order
> Ich
> möchte
> das Paket
> abholen.
> abgeholt ✗
> ```
>
> **Пояснення:** з модальним *möchte* смисловий інфінітив *abholen* стоїть в кінці речення, не розривається.

> [!quiz] Як правильно: «Пʼять центів»?
> level: A2 · type: single · id: de-a2-geld-q11
> - [ ] fünf Cents
> - [x] fünf Cent
> - [ ] fünf Cente
> - [ ] fünf Centen
>
> **Пояснення:** після числа назви грошей без закінчення: *fünf Cent, zwei Euro*. Форма *Cents* трапляється в розмові, але стандарт — *Cent*.

> [!quiz] Доповни: «Ich habe ein ___ bei der Sparkasse.»
> level: A2 · type: fill · id: de-a2-geld-q12 · bank: Rechnung, Quittung
>
> ```text fill
> Ich habe ein [[Konto]] bei der Sparkasse.
> ```
>
> **Пояснення:** рахунок у банку — *das Konto* (ein Konto). *Die Rechnung* і *die Quittung* — жіночого роду й означають інші документи.

## Фішки

> [!reel] 💶 «Nur Bares ist Wahres»
> Німецьке прислівʼя «Лише готівка справжня». За дослідженням Bundesbank «Zahlungsverhalten in Deutschland 2025» готівкою сплачено 45 % платежів, тобто вперше менше половини (у 2023 році було 51 %), але частка падає. Тож картку тримай при собі, а монети теж не викидай.

> [!reel] 🍾 Пляшка за 25 центів
> Застава на одноразові пляшки й банки — 25 Cent. Здай порожню пляшку в Pfandautomat у супермаркеті, і чек зменшиться на цю суму. Одноразові пляшки й банки з заставою виглядають як звичайні, тож дивись на значок Pfand на етикетці.

> [!reel] 🔢 Що ховає німецька IBAN
> DE-IBAN має 22 знаки: DE, 2 контрольні цифри, 8 цифр банківського коду й 10 цифр номера рахунку. Це не випадковий набір: контрольні цифри допомагають банкам вловити помилку в номері ще до переказу.

## Джерела та що почитати

- [Wikipedia (DE) — Einwegpfand in Deutschland](https://de.wikipedia.org/wiki/Einwegpfand_in_Deutschland): розмір застави 0,25 євро для одноразових пляшок і банок.
- [Bundesbank — Zahlungsverhalten in Deutschland 2025 (пресреліз)](https://www.bundesbank.de/de/presse/pressemitteilungen/zahlungsverhalten-in-deutschland-2025-964736): 45 % платежів і 23 % обороту готівкою; для порівняння — 51 % у 2023 році.
- [Gesetze im Internet — BGB § 438](https://www.gesetze-im-internet.de/bgb/__438.html): строк давності прав покупця при дефекті товару (два роки для нових речей).
- [DWDS — Girokonto](https://www.dwds.de/wb/Girokonto): рід, множина, вимова.
- [DWDS — Reklamation](https://www.dwds.de/wb/Reklamation): значення слова.

> [!important] Підсумок
> - Платимо: **bar**, **mit Karte**, **kontaktlos**; грошові одиниці після числа без закінчення (*zwei Euro, fünf Cent*).
> - Банк: **abheben** (зняти), **einzahlen** (покласти), **überweisen** (переказати); *Dauerauftrag* для регулярних платежів, *Lastschrift* для списання отримувачем.
> - Посилка: **abholen** + документ; *Päckchen* менше за *Paket*.
> - **Reklamation** — претензія про дефект, а не реклама (*die Werbung*). Рахунок у банку — *das Konto*, а до сплати — *die Rechnung*.
> - Пляшка з **Pfand** (25 Cent) повертається в апарат; готівка в Німеччині досі важлива.
