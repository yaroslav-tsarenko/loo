---
title: Аудіювання — телефонні розмови й повідомлення
id: de-a2-hoeren-telefon
level: A2
icon: px:phone
tags: [deutsch, a2, listening, telefon, termin, nachricht]
prerequisites: ["[[Deutsch - A2 - 09. Аудіювання — оголошення й інструкції]]", "[[Deutsch - A1 - 28. Аудіювання — щоденні діалоги]]"]
estimatedMinutes: 45
---

# Аудіювання — телефонні розмови й повідомлення

> [!success] Після цієї теми ти зможеш
> - зрозуміти телефонну розмову про запис до лікаря, бронювання й зміну домовленості;
> - записати імʼя, номер телефону, дату й час зі слуху;
> - розпочати й закінчити розмову: *Hier spricht … · Kann ich bitte … sprechen? · Auf Wiederhören!*;
> - залишити й зрозуміти повідомлення на автовідповідачі: *Bitte rufen Sie mich zurück.*

## Передбач

> [!quiz] Що означає «Die Leitung ist besetzt»?
> level: A2 · type: single · id: de-a2-hoeren-telefon-q01
> - [ ] зв'язок поганий, нічого не чути
> - [x] лінія зайнята
> - [ ] цієї особи немає на місці
> - [ ] ви набрали неправильний номер
>
> **Пояснення:** *die Leitung* — «лінія», *besetzt* — «зайнята». Якщо людини немає, кажуть *Sie ist nicht da*. Поганий зв'язок — *die Verbindung ist schlecht*.

## Як побудована телефонна розмова

Телефонна розмова німецькою має передбачуваний порядок. Знаючи його, ти розумієш, що буде далі, навіть коли не вловив усіх слів.

> [!diagram] П'ять кроків розмови
> ```yaml
> layout: flow
> nodes:
>   - { id: g, label: "1 · привітання", text: "Praxis Dr. Weber, guten Tag.", tone: yellow }
>   - { id: n, label: "2 · хто дзвонить", text: "Hier spricht Anna Schulz.", tone: pink }
>   - { id: a, label: "3 · мета", text: "Ich möchte einen Termin.", tone: yellow }
>   - { id: d, label: "4 · домовленість", text: "Dienstag um 10 Uhr 30?", tone: pink }
>   - { id: e, label: "5 · прощання", text: "Auf Wiederhören!", tone: gray }
> steps:
>   - { focus: g, note: "Той, хто відповідає, називає організацію або прізвище: Firma Schneider, guten Tag. / Schulz. Вдома теж часто відповідають прізвищем." }
>   - { focus: n, note: "Дзвінок: Hier spricht … (формально) або Hier ist … (між знайомими). Не «Ich bin Anna». Далі — прохання з'єднати: Kann ich bitte Frau Keller sprechen?" }
>   - { focus: a, note: "Назви мету одним реченням: Ich möchte einen Termin vereinbaren. Ich rufe wegen der Wohnung an." }
>   - { focus: d, note: "Почуєш пропозицію дня й часу: Passt Ihnen Dienstag? Записуй число й годину. Якщо не підходить: Kann ich den Termin verschieben?" }
>   - { focus: e, note: "По телефону прощаються словами Auf Wiederhören! — буквально «до почуття». У приватній розмові також Tschüs!" }
> ```
> Привітання → хто → мета → домовленість → прощання.

### Корисні формули

| Ситуація | Німецька | Українська |
|---|---|---|
| Назвати себе | *Hier spricht Anna Schulz.* · *Schulz am Apparat.* | Говорить Анна Шульц. |
| Попросити особу | *Kann ich bitte Frau Keller sprechen?* | Чи можна поговорити з пані Келлер? |
| З'єднати | *Einen Moment, ich verbinde Sie.* | Хвилинку, я Вас з'єдную. |
| Лінія зайнята | *Die Leitung ist besetzt.* | Лінія зайнята. |
| Немає на місці | *Frau Keller ist heute nicht da.* | Пані Келлер сьогодні немає. |
| Просити передзвонити | *Bitte rufen Sie mich zurück.* | Будь ласка, передзвоніть мені. |
| Передзвонити самому | *Ich rufe später zurück.* | Я передзвоню пізніше. |
| Змінити | *Kann ich den Termin verschieben?* | Чи можна перенести запис? |
| Скасувати | *Ich muss den Termin absagen.* | Мушу скасувати запис. |
| Не розчув | *Wie bitte? Noch einmal, bitte.* | Перепрошую? Ще раз, будь ласка. |
| Неправильний номер | *Sie haben sich wohl verwählt.* | Ви, певно, не туди потрапили. |

### Імена й номери

Імʼя й прізвище по телефону диктують літерами, а номер за одною цифрою. Для літер німці використовують слова-опори: *A wie Anton*, *B wie Berta*, *C wie Cäsar*. Із 2022 року стандарт DIN 5009 пропонує назви міст (*A wie Aachen, B wie Berlin, C wie Chemnitz*), але старі слова теж широко вживані.

Номер телефону читають цифрами, часто групами: *null eins fünf eins, zwei drei vier, sechs sieben acht* = 0151 234 678. Цифру 2 по телефону часто вимовляють *zwo*, щоб не сплутати з *drei*.

> [!diagram] Номер, ім'я, час: що записувати
> ```yaml
> layout: compare
> columns: { a: "почуєш", b: "запишеш" }
> nodes:
>   - { id: a1, col: a, label: "прізвище", text: "Zielinski, Z-I-E-L-I-N-S-K-I", tone: yellow }
>   - { id: a2, col: a, label: "номер", text: "null dreißig, eins zwei drei, vier fünf sechs", tone: yellow }
>   - { id: a3, col: a, label: "час", text: "Dienstag um zehn Uhr dreißig", tone: yellow }
>   - { id: b1, col: b, label: "прізвище", text: "Zielinski", tone: pink }
>   - { id: b2, col: b, label: "номер", text: "030 123 456", tone: pink }
>   - { id: b3, col: b, label: "час", text: "Di 10:30", tone: pink }
> steps:
>   - { focus: [a1, b1], note: "Літери по одній, великі літери Z-I-E-L… Слухай W [veː] і V [faʊ̯]: різні." }
>   - { focus: [a2, b2], note: "null dreißig = 030, бо dreißig — це 30. Не плутай -zig і -zehn: dreizehn = 13." }
>   - { focus: [a3, b3], note: "zehn Uhr dreißig = 10:30. Дні тижня записуй скорочено: Mo, Di, Mi, Do, Fr." }
> ```
> Три речі, які записуємо завжди: імʼя, номер, дату й час.

## Приклади

- Praxis Doktor Weber, guten Tag. — Практика доктора Вебера, добрий день.
- Hier spricht Anna Schulz. Ich möchte einen Termin vereinbaren. — Говорить Анна Шульц. Я хочу домовитися про запис.
- Passt Ihnen Dienstag um zehn Uhr dreißig? — Вам підходить вівторок о 10:30?
- Kann ich bitte Frau Keller sprechen? — Чи можна поговорити з пані Келлер?
- Einen Moment, ich verbinde Sie. — Хвилинку, я Вас з'єдную.
- Leider ist die Leitung besetzt. — На жаль, лінія зайнята.
- Bitte rufen Sie mich zurück. Meine Nummer ist null eins sieben sechs … — Будь ласка, передзвоніть мені. Мій номер 0176 …
- Ich muss den Termin leider absagen. — На жаль, я мушу скасувати запис.
- Kann ich den Termin auf Donnerstag verschieben? — Чи можна перенести запис на четвер?
- Die Verbindung ist schlecht. Können Sie noch einmal anrufen? — Зв'язок поганий. Чи можете Ви зателефонувати ще раз?

## Слова

> [!word] das Telefon
> ipa: /ˈteːləfoːn/ · pos: noun · level: A1 · id: de-a2-hoeren-telefon-w01
> uk: телефон
> forms: die Telefone
> example: Das **Telefon** klingelt. — Телефон дзвонить.
> note: наголос на Te-: [ˈteːləfoːn]. Мобільний — das Handy (AT, DE) або das Mobiltelefon; у Швейцарії також das Natel. Дієслово: telefonieren.

> [!word] verbinden
> ipa: /fɛɐ̯ˈbɪndn̩/ · pos: verb · level: A2 · id: de-a2-hoeren-telefon-w02
> uk: з'єднувати
> forms: verbinden → verband → hat verbunden
> example: Einen Moment, ich **verbinde** Sie. — Хвилинку, я Вас з'єдную.
> note: невідокремлюване, наголос на -bin-. Також «поєднувати»: Das Kabel verbindet die Geräte.

> [!word] die Leitung
> ipa: /ˈlaɪ̯tʊŋ/ · pos: noun · level: A2 · id: de-a2-hoeren-telefon-w03
> uk: лінія (зв'язку); керівництво
> forms: die Leitungen
> example: Bleiben Sie bitte in der **Leitung**. — Залишайтеся, будь ласка, на лінії.
> note: -ung — завжди жіночий рід.

> [!word] zurückrufen
> ipa: /tsuˈʁʏkʁuːfn̩/ · pos: verb · level: A2 · id: de-a2-hoeren-telefon-w04
> uk: передзвонити
> forms: zurückrufen → rief zurück → hat zurückgerufen
> example: Ich **rufe** Sie später **zurück**. — Я передзвоню Вам пізніше.
> note: відокремлюване, наголос на zu-. Керування Akk: jemanden zurückrufen. Не «dir zurückrufen».

> [!word] der Rückruf
> ipa: /ˈʁʏkʁuːf/ · pos: noun · level: B1 · id: de-a2-hoeren-telefon-w05
> uk: зворотний дзвінок
> forms: die Rückrufe
> example: Ich bitte um einen **Rückruf**. — Прошу передзвонити.
> note: ü коротке [ʏ]. Зворот у повідомленнях: Bitte um Rückruf.

> [!word] der Anrufbeantworter
> ipa: /ˈanʁuːfbəʔantvɔʁtɐ/ · pos: noun · level: B1 · id: de-a2-hoeren-telefon-w06
> uk: автовідповідач
> forms: die Anrufbeantworter
> example: Auf dem **Anrufbeantworter** ist eine Nachricht. — На автовідповідачі є повідомлення.
> note: скорочено: der AB. Складне слово, наголос на An-. Також голосова пошта смартфона: die Mailbox.

> [!word] hinterlassen
> ipa: /hɪntɐˈlasn̩/ · pos: verb · level: A2 · id: de-a2-hoeren-telefon-w07
> uk: залишати (повідомлення, слід)
> forms: hinterlassen → hinterließ → hat hinterlassen
> example: Möchten Sie eine Nachricht **hinterlassen**? — Хочете залишити повідомлення?
> note: невідокремлюване, наголос на -lass-; ss після короткого голосного. Perfekt без ge-.

> [!word] erreichen
> ipa: /ɛɐ̯ˈʁaɪ̯çn̩/ · pos: verb · level: A2 · id: de-a2-hoeren-telefon-w08
> uk: досягти; додзвонитися, знайти (людину)
> forms: erreichen → erreichte → hat erreicht
> example: Ich habe ihn nicht **erreicht**. — Я не додзвонився до нього.
> note: Sie haben die Firma Schneider erreicht — «Ви додзвонилися до фірми Шнайдер». ch після ei = [ç].

> [!word] vereinbaren
> ipa: /fɛɐ̯ˈaɪ̯nbaːʁən/ · pos: verb · level: A2 · id: de-a2-hoeren-telefon-w09
> uk: домовлятися, узгоджувати
> forms: vereinbaren → vereinbarte → hat vereinbart
> example: Ich möchte einen Termin **vereinbaren**. — Я хотів би домовитися про запис.
> note: невідокремлюване, наголос на -ein-; ver- слабке. Іменник: die Vereinbarung.

> [!word] absagen
> ipa: /ˈapzaːɡn̩/ · pos: verb · level: A2 · id: de-a2-hoeren-telefon-w10
> uk: скасувати (домовленість, участь)
> forms: absagen → sagte ab → hat abgesagt
> example: Ich muss den Termin leider **absagen**. — Мушу, на жаль, скасувати запис.
> note: відокремлюване, наголос на ab-. Протилежність: zusagen (підтвердити). Також: eine Einladung absagen.

> [!word] verschieben
> ipa: /fɛɐ̯ˈʃiːbn̩/ · pos: verb · level: A2 · id: de-a2-hoeren-telefon-w11
> uk: переносити (на інший час)
> forms: verschieben → verschob → hat verschoben
> example: Kann ich den Termin auf Donnerstag **verschieben**? — Чи можна перенести запис на четвер?
> note: невідокремлюване, наголос на -schie-; sch = «ш». Auf + Akk: auf Donnerstag.

> [!word] Hier spricht …
> ipa: /hiːɐ̯ ˈʃpʁɪçt/ · pos: phrase · level: A2 · id: de-a2-hoeren-telefon-w12
> uk: Говорить … (так представляються по телефону)
> example: **Hier spricht** Anna Schulz. — Говорить Анна Шульц.
> note: у приватній розмові частіше Hier ist Anna. Не «Ich bin Anna». sp на початку кореня = [ʃp].

> [!word] Am Apparat
> ipa: /am apaˈʁaːt/ · pos: phrase · level: A2 · id: de-a2-hoeren-telefon-w13
> uk: біля апарата, слухає (про того, хто на лінії)
> example: Schulz **am Apparat**. — Шульц на зв'язку.
> note: кажуть про себе: Müller am Apparat або відповідь: Ja, am Apparat. Дещо офіційніше, ніж Hier ist …

> [!word] der Empfang
> ipa: /ɛmˈpfaŋ/ · pos: noun · level: B1 · id: de-a2-hoeren-telefon-w14
> uk: прийом (сигналу); рецепція; отримання
> forms: die Empfänge
> example: Hier habe ich keinen **Empfang**. — Тут у мене немає зв'язку.
> note: емп-пф: [mpf]. В готелі та в офісі: am Empfang — на рецепції. Дієслово: empfangen.

## Слухаємо

> [!listen] Послухай розмову. Коли запис до лікаря?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-telefon-l01
> audio: A: Praxis Doktor Weber, guten Tag.
> audio: B: Guten Tag, hier spricht Olena Bondar. Ich möchte einen Termin vereinbaren.
> audio: A: Passt Ihnen Dienstag um zehn Uhr dreißig?
> audio: B: Ja, gern. Vielen Dank!
> - [ ] у понеділок о 10:30
> - [x] у вівторок о 10:30
> - [ ] у вівторок о 13:00
>
> **Пояснення:** *Dienstag* — вівторок, *zehn Uhr dreißig* — 10:30. *Passt Ihnen …?* — «Чи Вам підходить?»

> [!listen] Заповни форму запису
> level: A2 · type: fill · speed: slow · id: de-a2-hoeren-telefon-l02
> audio: A: Wie ist Ihr Name, bitte?
> audio: B: Bondar. B, O, N, D, A, R.
> audio: A: Und Ihre Telefonnummer?
> audio: B: Null eins fünf eins, zwei drei vier, sechs sieben acht.
>
> ```fill
> Name: [[Bondar]]
> Telefon: [[0151 234 678|0151234678|0151 234678]]
> ```
>
> **Пояснення:** *null eins fünf eins* = 0151, далі групи по три цифри: 234, 678.

> [!listen] Послухай. Що вирішує клієнтка?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-telefon-l03
> audio: A: Kann ich bitte Frau Keller sprechen?
> audio: B: Einen Moment, ich verbinde Sie. … Leider ist die Leitung besetzt. Möchten Sie warten?
> audio: A: Nein, danke. Ich rufe später noch einmal an.
> - [ ] чекати на лінії
> - [x] зателефонувати пізніше
> - [ ] залишити повідомлення
>
> **Пояснення:** *Nein, danke* — відмова чекати. *Ich rufe später noch einmal an* — «зателефоную пізніше ще раз».

> [!listen] Послухай. Коли повернеться пані Келлер?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-telefon-l04
> audio: A: Kann ich Frau Keller sprechen?
> audio: B: Frau Keller ist heute leider nicht im Büro. Sie ist ab morgen wieder da.
> - [ ] сьогодні пізніше
> - [x] завтра
> - [ ] у п'ятницю
>
> **Пояснення:** *ab morgen* — «від завтра». *Heute nicht im Büro* — сьогодні її немає.

> [!listen] Заповни нотатку з автовідповідача
> level: A2 · type: fill · speed: slow · id: de-a2-hoeren-telefon-l05
> audio: Guten Tag, hier ist Lukas Meier. Ich möchte Frau Keller sprechen, wegen der Wohnung. Bitte rufen Sie mich zurück unter null eins sieben sechs, acht eins zwei, drei vier. Danke.
>
> ```fill
> Name: [[Meier]]
> Thema: [[Wohnung]]
> Rückruf unter: [[0176 812 34|017681234|0176 81234]]
> ```
>
> **Пояснення:** *wegen der Wohnung* — «з приводу квартири». Номер: 0176, потім 812 і 34.

> [!listen] Послухай. На скільки ночей бронюють номер?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-telefon-l06
> audio: A: Hotel Sonne, guten Tag.
> audio: B: Guten Tag. Ich möchte ein Doppelzimmer reservieren, vom zwölften bis zum vierzehnten Mai.
> audio: A: Das sind zwei Nächte. Auf welchen Namen?
> - [ ] на одну ніч
> - [x] на дві ночі
> - [ ] на чотирнадцять ночей
>
> **Пояснення:** з 12 до 14 травня — це *zwei Nächte*. Число *vierzehn* — дата виїзду, а не кількість ночей.

> [!listen] Заповни бронювання
> level: A2 · type: fill · speed: slow · id: de-a2-hoeren-telefon-l07
> audio: A: Auf welchen Namen darf ich reservieren?
> audio: B: Petrenko. P, E, T, R, E, N, K, O.
> audio: A: Danke. Ein Doppelzimmer für zwei Nächte, Ankunft am zwölften Mai. Stimmt das?
> audio: B: Ja, das stimmt.
>
> ```fill
> Name: [[Petrenko]]
> Zimmer: [[Doppelzimmer]]
> Nächte: [[2|zwei]]
> Ankunft: [[12. Mai|12.5.|zwölften Mai|12 Mai]]
> ```
>
> **Пояснення:** *zwölften* — порядковий числівник від 12; дата записується 12. Mai або 12.5.

> [!listen] Послухай. Чому клієнт скасовує запис?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-telefon-l08
> audio: A: Praxis Doktor Weber, guten Tag.
> audio: B: Hier spricht Schulz. Ich muss meinen Termin leider absagen. Ich bin krank.
> - [ ] у нього немає часу
> - [x] він захворів
> - [ ] він змінив лікаря
>
> **Пояснення:** *absagen* — скасувати. *Ich bin krank* — причина: захворів.

> [!listen] Послухай. На який день переносять запис?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-telefon-l09
> audio: A: Kann ich den Termin auf Donnerstag verschieben?
> audio: B: Ja, am Donnerstag habe ich um neun Uhr einen Termin frei.
> audio: A: Das passt gut. Danke!
> - [ ] на середу о 9:00
> - [x] на четвер о 9:00
> - [ ] на четвер о 19:00
>
> **Пояснення:** *Donnerstag* — четвер, *um neun Uhr* — о дев'ятій. *Das passt gut* — «це добре підходить».

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-hoeren-telefon-l10
> audio: Hier spricht Anna Schulz. Kann ich bitte Herrn Weber sprechen?
> explain: *Hier spricht …* — формула представлення по телефону. *Herrn* — Akkusativ від *Herr*: *Herrn Weber*.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-hoeren-telefon-l11
> audio: Einen Moment, bitte. Ich verbinde Sie.
> explain: *verbinden* — з'єднати. Наголос у *verˈbinde*: на -bin-.

> [!listen] Послухай. Що сталося?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-telefon-l12
> audio: A: Hallo, ist da Familie Schulz?
> audio: B: Nein, hier ist Müller. Sie haben sich wohl verwählt.
> - [ ] Шульц не вдома
> - [x] абонент набрав неправильний номер
> - [ ] лінія зайнята
>
> **Пояснення:** *sich verwählen* — набрати не той номер. Відповідь *Nein, hier ist Müller* показує, що це інша родина.

> [!listen] Послухай. Про що просить співрозмовник?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-telefon-l13
> audio: A: Hallo? Ich verstehe Sie nicht, die Verbindung ist schlecht. Können Sie bitte noch einmal anrufen?
> - [ ] говорити голосніше
> - [x] зателефонувати ще раз
> - [ ] залишити повідомлення
>
> **Пояснення:** *noch einmal anrufen* — «зателефонувати ще раз». Причина — *schlechte Verbindung*, поганий зв'язок.

> [!listen] Заповни прізвище
> level: A2 · type: fill · speed: slow · id: de-a2-hoeren-telefon-l14
> audio: A: Wie schreibt man Ihren Namen?
> audio: B: Zielinski. Z, I, E, L, I, N, S, K, I.
>
> ```fill
> Nachname: [[Zielinski]]
> ```
>
> **Пояснення:** літери диктують по одній: Z-I-E-L-I-N-S-K-I. Літера *Z* називається «цет» [tsɛt], *I* — [iː], *E* — [eː].

> [!listen] Послухай. О котрій годині столик?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-telefon-l15
> audio: A: Restaurant Adler, guten Abend.
> audio: B: Guten Abend. Ich möchte einen Tisch für vier Personen reservieren, heute um neunzehn Uhr dreißig.
> - [ ] о 17:30
> - [x] о 19:30
> - [ ] о 19:13
>
> **Пояснення:** *neunzehn Uhr dreißig* = 19:30. *Neunzehn* — 19 (довге [eː] у кінці), *dreißig* — 30.

> [!listen] Послухай запис. Який номер набрати в екстреному випадку?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-telefon-l16
> audio: Die Praxis ist heute geschlossen. In dringenden Fällen rufen Sie bitte den Notruf an: eins eins zwei.
> - [ ] 110
> - [x] 112
> - [ ] 211
>
> **Пояснення:** *eins eins zwei* = 112. Це європейський номер екстреної допомоги; у Німеччині 112 — швидка допомога й пожежна, 110 — поліція.

> [!listen] Послухай повідомлення. Коли прийде Анна?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-telefon-l17
> audio: Hallo Tom, hier ist Anna. Ich komme heute etwas später, so gegen acht. Ruf mich bitte zurück!
> - [ ] близько 6
> - [x] близько 8
> - [ ] близько 9
>
> **Пояснення:** *gegen acht* — «близько восьмої». *Ruf mich zurück* — «передзвони мені» (до *du* наказова форма).

> [!listen] Заповни записку про дзвінок
> level: A2 · type: fill · speed: slow · id: de-a2-hoeren-telefon-l18
> audio: Frau Berger hat angerufen. Sie bittet um Rückruf bis Freitag. Die Nummer ist null dreißig, eins zwei drei, vier fünf sechs.
>
> ```fill
> Name: [[Berger]]
> Rückruf bis: [[Freitag]]
> Nummer: [[030 123 456|030123456]]
> ```
>
> **Пояснення:** *null dreißig* — код Берліна 030. *Bitte um Rückruf* — прохання передзвонити.

## Вимова

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-hoeren-telefon-s01
> text: Hier spricht Anna Schulz.
> ipa: /hiːɐ̯ ˈʃpʁɪçt ˈana ʃʊlts/
> tip: hier — довге [iː] + слабке [ɐ]. spricht — sp = «шп», ch після i = [ç]. Schulz закінчується на [ts].
> uk: Говорить Анна Шульц.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-hoeren-telefon-s02
> text: Kann ich bitte Frau Keller sprechen?
> ipa: /kan ɪç ˈbɪtə fʁaʊ̯ ˈkɛlɐ ˈʃpʁɛçn̩/
> tip: питання «так / ні»: голос угору ↗. ich — [ç]; Keller — [ɐ]; sprechen — складове [n̩].
> uk: Чи можна поговорити з пані Келлер?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-hoeren-telefon-s03
> text: Ich möchte einen Termin vereinbaren.
> ipa: /ɪç ˈmœçtə ˈaɪ̯nən tɛɐ̯ˈmiːn fɛɐ̯ˈaɪ̯nbaːʁən/
> tip: möchte — ö коротке [œ], ch = [ç]. Termin — наголос на -min; vereinbaren — наголос на -ein-, ver- слабке.
> uk: Я хотів би домовитися про запис.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-hoeren-telefon-s04
> text: Ich rufe später noch einmal an.
> ipa: /ɪç ˈʁuːfə ˈʃpɛːtɐ nɔx ˈaɪ̯nmaːl an/
> tip: an наприкінці наголошене: відокремлюваний префікс. später — sp = «шп», ä довге [ɛː].
> uk: Я зателефоную пізніше ще раз.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-hoeren-telefon-s05
> text: Können Sie mich bitte zurückrufen?
> ipa: /ˈkœnən ziː mɪç ˈbɪtə tsuˈʁʏkʁuːfn̩/
> tip: zurückrufen — наголос на zu-. ü коротке [ʏ] (губи «у», язик «і»). Підйом ↗ наприкінці.
> uk: Чи не могли б Ви мені передзвонити?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-hoeren-telefon-s06
> text: Auf Wiederhören!
> ipa: /aʊ̯f ˈviːdɐhøːʁən/
> tip: Wieder — w = [v], ie довге [iː], -er = [ɐ]. hören — ö довге [øː], h на початку складу *-hö-* вимовляється легким видихом.
> uk: До побачення! (по телефону)

## Типові помилки українців

> [!pitfall] «Ich bin Anna» замість «Hier spricht / Hier ist Anna»
> Українець по телефону каже «Це Анна» і перекладає *Ich bin Anna*. Зрозуміють, але природні формули інші: *Hier spricht Anna Schulz* або між знайомими *Hier ist Anna*. Для офіційного дзвінка: *Hier spricht + повне імʼя*.

> [!pitfall] «Ich rufe dir zurück»: Dativ замість Akkusativ
> Українське «передзвоню тобі» штовхає до Dativ. Але *anrufen* і *zurückrufen* вимагають Akkusativ: *Ich rufe dich an*, *Ich rufe Sie zurück*. Форми *mir, dir, ihm* тут неправильні.

> [!pitfall] Різке «Wer ist da?»
> Українське «Хто це?» перекладають буквально: *Wer ist da?* По телефону це звучить різко. Ввічливі варіанти: *Mit wem spreche ich?* або *Wer spricht dort, bitte?* Спершу назви себе, потім спитай, з ким говориш.

> [!pitfall] Цифри телефону й часу
> Номер телефону диктують цифрами: *null dreißig* = 030 (де dreißig — 30). Помилка — чути *dreizehn* (13). Також по телефону *zwo* = 2. Слухай закінчення: -zehn [tseːn] проти -zig [tsɪç], як на A1.

## Практика

> [!quiz] Що кажуть по телефону, коли хочуть з'єднати з іншою особою?
> level: A2 · type: single · id: de-a2-hoeren-telefon-q02
> - [ ] Ich rufe Sie zurück.
> - [x] Einen Moment, ich verbinde Sie.
> - [ ] Sie haben sich verwählt.
> - [ ] Die Verbindung ist schlecht.
>
> **Пояснення:** *verbinden* — з'єднати. Решта фраз мають інше значення: «передзвоню», «не туди потрапили», «поганий зв'язок».

> [!quiz] Що означає «Schulz am Apparat»?
> level: A2 · type: single · id: de-a2-hoeren-telefon-q03
> - [ ] Шульц чекає на лінії
> - [x] говорить Шульц
> - [ ] Шульц зайнятий
> - [ ] Шульц залишив повідомлення
>
> **Пояснення:** *am Apparat* — буквально «біля апарата». Так називають себе або підтверджують, що слухають.

> [!quiz] Яка форма Perfekt від zurückrufen?
> level: A2 · type: single · id: de-a2-hoeren-telefon-q04
> - [ ] hat gezurückruft
> - [x] hat zurückgerufen
> - [ ] ist zurückgerufen
> - [ ] hat zurückrufen
>
> **Пояснення:** *zurückrufen* відокремлюване: *ge-* стоїть між префіксом і коренем (*zurück-ge-rufen*). Допоміжне дієслово — haben.

> [!quiz] Що ти скажеш, коли залишаєш повідомлення на автовідповідачі?
> level: A2 · type: multi · id: de-a2-hoeren-telefon-q05
> - [x] Hier spricht Anna Schulz.
> - [x] Bitte rufen Sie mich zurück.
> - [ ] Die Leitung ist besetzt.
> - [ ] Einen Moment, ich verbinde Sie.
>
> **Пояснення:** *Hier spricht …* і *Bitte rufen Sie mich zurück* — те, що говорить абонент. Дві інші фрази говорить працівник чи автовідповідач.

> [!quiz] Що означає «Kann ich den Termin verschieben?»
> level: A2 · type: single · id: de-a2-hoeren-telefon-q06
> - [ ] Чи можна скасувати запис?
> - [x] Чи можна перенести запис?
> - [ ] Чи можна підтвердити запис?
> - [ ] Чи можна забрати запис?
>
> **Пояснення:** *verschieben* — перенести, *absagen* — скасувати. Ці слова не плутай.

> [!quiz] Як читається номер «030 123 456»?
> level: A2 · type: single · id: de-a2-hoeren-telefon-q07
> - [ ] null dreizehn, eins zwei drei, vier fünf sechs
> - [x] null dreißig, eins zwei drei, vier fünf sechs
> - [ ] null drei, null eins, zwei, drei, vier
> - [ ] dreißig, eins zwei drei, vier fünf sechs
>
> **Пояснення:** 030 — *null dreißig* (нуль і тридцять). *Dreizehn* — 13. Нуль на початку читається окремо.

> [!quiz] Заповни пропуск
> level: A2 · type: fill · bank: verbindest, verbindet · id: de-a2-hoeren-telefon-q08
>
> ```text fill
> Einen Moment, bitte. Ich [[verbinde]] Sie.
> ```
>
> **Пояснення:** після *ich* дієслово має закінчення *-e*: *ich verbinde*. Форми *verbindest* (du) і *verbindet* (er, sie, es) не підходять.

> [!quiz] Заповни пропуск
> level: A2 · type: fill · bank: hinterlässt, hinterlassend · id: de-a2-hoeren-telefon-q09
>
> ```text fill
> Frau Keller ist nicht da. Möchten Sie eine Nachricht [[hinterlassen]]?
> ```
>
> **Пояснення:** після *möchten* дієслово стоїть в інфінітиві наприкінці: *hinterlassen*. *Hinterlässt* — форма 3-ї особи, *hinterlassend* — дієприкметник.

> [!quiz] Склади речення: «Я хотів би домовитися про запис.»
> level: A2 · type: order · id: de-a2-hoeren-telefon-q10
>
> ```text order
> Ich
> möchte
> einen
> Termin
> vereinbaren.
> vereinbart ✗
> ```
>
> **Пояснення:** після модального *möchte* дієслово стоїть наприкінці в інфінітиві: *vereinbaren*. *Termin* — Akkusativ: *einen Termin*.

> [!quiz] Склади прохання: «Чи не могли б Ви мені передзвонити?»
> level: A2 · type: order · id: de-a2-hoeren-telefon-q11
>
> ```text order
> Können
> Sie
> mich
> bitte
> zurückrufen?
> kannst ✗
> ```
>
> **Пояснення:** до *Sie* — *können*. *Zurückrufen* вимагає Akkusativ: *mich*, а не *mir*.

> [!quiz] Що робити, якщо ти не розчув по телефону?
> level: A2 · type: single · id: de-a2-hoeren-telefon-q12
> - [ ] сказати «ja» і далі вдавати, що зрозумів
> - [x] ввічливо перепитати: «Wie bitte? Noch einmal, bitte.»
> - [ ] мовчати, поки співрозмовник повторить сам
> - [ ] одразу покласти слухавку
>
> **Пояснення:** перепитування — звичайна й ввічлива практика: *Wie bitte? Können Sie das wiederholen? Langsamer, bitte.* Відповісти навмання небезпечно, коли йдеться про дату чи номер.

## Фішки

> [!reel] 🔤 A wie Anton, B wie Berta
> Для диктування літер німці користуються таблицею (die Buchstabiertafel). Стандарт DIN 5009 у редакції 2022 року пропонує назви міст (*A wie Aachen, B wie Berlin*) замість імен (*A wie Anton, B wie Berta*). Старі слова поширені й досі, тому на слух доводиться розуміти обидва набори.

> [!reel] 👂 «Auf Wiederhören»
> *Auf Wiedersehen* буквально «до нового побачення». По телефону співрозмовника не видно, тому кажуть *Auf Wiederhören* — «до нового почуття». Обидві форми зрозумілі, але саме в телефонній розмові природніше звучить *Wiederhören*.

> [!reel] 📱 Handy — німецьке слово
> Слово *Handy* звучить як англійське, але мобільний телефон англійською називають *mobile phone* або *cell phone*, а *handy* там означає «зручний». Це німецьке слово, що виглядає англійським. У Швейцарії мобільний телефон також називають *Natel*.

## Джерела та що почитати

- [Wikipedia — Buchstabiertafel](https://de.wikipedia.org/wiki/Buchstabiertafel) — німецька таблиця літер і зміни в DIN 5009.
- [DWDS — Handy](https://www.dwds.de/wb/Handy) — походження й значення слова.
- [DWDS — Anrufbeantworter](https://www.dwds.de/wb/Anrufbeantworter) — значення й вживання слова.
- [DWDS — verschieben](https://www.dwds.de/wb/verschieben) — значення дієслова.
- [Goethe-Institut — Durchführungsbestimmungen A2](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_A2.pdf) — формат модуля Hören на A2.

> [!important] Підсумок
> - Порядок розмови: привітання → *Hier spricht …* → мета → домовленість → *Auf Wiederhören!*.
> - Імʼя диктують літерами, номер — цифрами; *null dreißig* = 030.
> - *Anrufen* і *zurückrufen* вимагають Akkusativ: *Ich rufe Sie zurück*.
> - *Verschieben* — перенести, *absagen* — скасувати, *vereinbaren* — домовитися.
> - Не розчув: *Wie bitte? Noch einmal, bitte.*
