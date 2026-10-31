---
title: Читання й письмо — формуляр, оголошення, коротке повідомлення
id: de-a1-lesen-schreiben
level: A1
icon: px:scroll
tags: [deutsch, a1, skills, lesen, schreiben, formular]
prerequisites: ["[[Deutsch - A1 - 12. Час, дні, місяці й дата]]", "[[Deutsch - A1 - 24. Місто, транспорт і дорога — Imperativ]]"]
estimatedMinutes: 40
---

# Читання й письмо — формуляр, оголошення, коротке повідомлення

> [!success] Після цієї теми ти зможеш
> - прочитати вивіски й оголошення: *Eingang, Ausgang, Rauchen verboten, Eintritt frei, montags geschlossen*;
> - заповнити простий формуляр: *Vorname, Nachname, Geburtsdatum, Wohnort, Unterschrift*;
> - написати коротку записку чи SMS на ≈ 30 слів із привітанням і прощанням;
> - правильно писати великі літери: усі іменники, ввічливе *Sie / Ihnen*, дати й адреси.

## Передбач

> [!quiz] Ти пишеш листа пані Вебер. Як правильно спитати «Як Ви?»
> level: A1 · type: single · id: de-a1-lesen-schreiben-q01
> - [ ] Wie geht es ihnen?
> - [x] Wie geht es Ihnen?
> - [ ] wie geht es Ihnen?
> - [ ] Wie geht es ihnen, Frau Weber
>
> **Пояснення:** ввічливе *Sie / Ihnen / Ihr* пишемо з великої літери, а речення починаємо з великої: *Wie geht es **Ihnen**?* З малої *ihnen* означало б «їм».

## Вивіски й оголошення

Вивіски короткі, часто без дієслова. Їх можна навчитися впізнавати за ключовими словами.

| Вивіска | Значення |
|---|---|
| **Eingang** · **Ausgang** | вхід · вихід |
| **Notausgang** | аварійний вихід |
| **Geöffnet** · **Geschlossen** | відчинено · зачинено |
| **Montag bis Freitag 9–18 Uhr** | пн–пт з 9 до 18 |
| **montags geschlossen** | по понеділках зачинено |
| **Eintritt frei** | вхід вільний |
| **Rauchen verboten** | палити заборонено |
| **Achtung! · Vorsicht!** | увага! · обережно! |
| **Drücken · Ziehen** | від себе · на себе (на дверях) |
| **Damen · Herren** | жіночий · чоловічий (туалет) |
| **Aufzug** | ліфт |

Добре знати закінчення **-s** у днях: *montags* = «щопонеділка», *samstags* = «щосуботи». А в переліках годин *von … bis* (від … до), як у темі [[Deutsch - A1 - 25. Прийменники часу — am, um, im, von … bis, vor, nach]].

## Формуляр

У формулярі (*das Formular*) поля йдуть у стандартному порядку. Приклад заповненої анкети:

```text
Vorname:            Olena
Nachname:           Bondar
Geburtsdatum:       15.03.1995
Staatsangehörigkeit: ukrainisch
Familienstand:      ledig
Straße, Hausnummer: Lindenstraße 14
PLZ, Wohnort:       50667 Köln
Telefon:            0176 123 45 67
E-Mail:             olena.bondar@example.de
Datum, Unterschrift: 03.11.2026, O. Bondar
```

- **Дата** — спершу **день**, потім місяць, потім рік: *15.03.1995* = *der fünfzehnte März neunzehnhundertfünfundneunzig*.
- **PLZ** (*Postleitzahl*) пишемо **перед** містом: *50667 Köln*. У Німеччині індекс має 5 цифр (в Австрії й Швейцарії — 4).
- **Адреса**: назва вулиці, потім номер будинку: *Lindenstraße 14* (не ~~14 Lindenstraße~~).
- **Familienstand**: *ledig* (неодружений), *verheiratet* (одружений), *geschieden* (розлучений).
- Підпис (*Unterschrift*) — власноруч, імʼя друкованими літерами — *Name in Druckbuchstaben*.

> [!diagram] Короткий лист: чотири частини
> ```yaml
> layout: flow
> nodes:
>   - { id: anrede, label: "1 · Anrede", text: "Liebe Anna,", tone: yellow }
>   - { id: grund, label: "2 · Що сталося", text: "ich komme heute später.", tone: gray }
>   - { id: bitte, label: "3 · Прохання", text: "Kannst du bitte warten?", tone: pink }
>   - { id: gruss, label: "4 · Gruß", text: "Viele Grüße, Olena", tone: yellow }
> steps:
>   - { focus: anrede, note: "Звертання: Liebe + імʼя жінки, Lieber + імʼя чоловіка, Hallo — для друзів. Після нього — кома." }
>   - { focus: grund, note: "Після коми речення продовжується з малої літери: Liebe Anna, ich komme heute später." }
>   - { focus: bitte, note: "Одне прохання або питання: bitte, danke." }
>   - { focus: gruss, note: "Прощання: Viele Grüße / Liebe Grüße (друзям). Офіційно: Mit freundlichen Grüßen." }
> ```

### Коротка записка (≈ 30 слів)

Як у Start Deutsch 1, треба написати 2–3 речення: привітання, причина/пропозиція, прощання.

> [!example] Приклад SMS другові
> Hallo Max, ich bin heute nicht zu Hause. Ich habe um 18 Uhr einen Termin beim Arzt. Kommst du morgen um 10 Uhr? Danke und viele Grüße, Olena

Це 28 слів: привітання, причина, питання, прощання. Для офіційного адресата (*Frau Weber*) змінюємо формулу: *Sehr geehrte Frau Weber, … Mit freundlichen Grüßen, Olena Bondar* і *Sie* з великої.

## Великі літери

| Правило | Приклад |
|---|---|
| **Усі іменники** — з великої | *Ich habe einen Bruder und eine Schwester.* |
| Ввічливе **Sie, Ihnen, Ihr** — з великої | *Wie geht es **Ihnen**?* |
| **Дні й місяці** — з великої | *am Montag, im Mai* (але прислівник *montags* — з малої) |
| Прикметники національності — з малої | *ein ukrainisches Buch*, але *Ich lerne Deutsch* (мова = іменник) |
| Початок речення — з великої, після коми в листі — з малої | *Liebe Anna, ich komme …* |

## Приклади

- Eingang Hof, Ausgang Straße. — Вхід з двору, вихід на вулицю.
- Bitte Tür schließen! — Будь ласка, зачиняйте двері!
- Ich wohne in der Lindenstraße 14, 50667 Köln. — Я живу на Лінденштрасе, 14, 50667 Кельн.
- Mein Geburtsdatum ist der 15. März 1995. — Моя дата народження — 15 березня 1995.
- Liebe Anna, ich komme heute später. Viele Grüße, Olena — Люба Анно, я сьогодні прийду пізніше. З привітом, Олена.
- Sehr geehrte Frau Weber, ich möchte einen Termin. Mit freundlichen Grüßen — Шановна пані Вебер, я хотів би записатися. З повагою.
- Samstags sind wir von 9 bis 13 Uhr geöffnet. — По суботах ми працюємо з 9 до 13.

## Слова

> [!word] das Formular
> ipa: /fɔʁmuˈlaːɐ̯/ · pos: noun · level: A1 · id: de-a1-lesen-schreiben-w01
> uk: формуляр; анкета; бланк
> forms: die Formulare
> example: Bitte füllen Sie das **Formular** aus. — Будь ласка, заповніть формуляр.
> note: наголос на останньому складі. Синонім: das Formblatt. AT: також das Formblatt, das Antragsformular.

> [!word] ausfüllen
> ipa: /ˈaʊ̯sˌfʏlən/ · pos: verb · level: A1 · id: de-a1-lesen-schreiben-w02
> uk: заповнювати (анкету)
> forms: ausfüllen → füllte aus → hat ausgefüllt
> example: Ich **fülle** das Formular **aus**. — Я заповнюю формуляр.
> note: відокремлюване дієслово: Ich fülle das Formular aus (як aufstehen, тема A1-16). ü — губи «у», язик «і».

> [!word] das Geburtsdatum
> ipa: /ɡəˈbʊʁtsˌdaːtʊm/ · pos: noun · level: A1 · id: de-a1-lesen-schreiben-w03
> uk: дата народження
> forms: die Geburtsdaten
> example: Mein **Geburtsdatum** ist der 15. März 1995. — Моя дата народження — 15 березня 1995.
> note: у формулярі часто скорочено: geb. am; поруч — der Geburtsort (місце народження). Рід середній, бо das Datum.

> [!word] der Wohnort
> ipa: /ˈvoːnɔʁt/ · pos: noun · level: A1 · id: de-a1-lesen-schreiben-w04
> uk: місце проживання
> forms: die Wohnorte
> example: **Wohnort**: Köln. — Місце проживання: Кельн.
> note: wohnen + der Ort. CH: також der Wohnort / die Wohngemeinde.

> [!word] die Adresse
> ipa: /aˈdʁɛsə/ · pos: noun · level: A1 · id: de-a1-lesen-schreiben-w05
> uk: адреса
> forms: die Adressen
> example: Wie ist Ihre **Adresse**? — Яка Ваша адреса?
> note: подвійне s, не ~~Adrese~~. Наголос на другому складі. Порядок: вулиця, номер, потім PLZ та місто.

> [!word] die Postleitzahl
> ipa: /ˈpɔstlaɪ̯tsaːl/ · pos: noun · level: A1 · id: de-a1-lesen-schreiben-w06
> uk: поштовий індекс
> forms: die Postleitzahlen
> example: Meine **Postleitzahl** ist 50667. — Мій поштовий індекс — 50667.
> note: скорочено PLZ. DE — 5 цифр; AT і CH — 4 цифри. Пишеться перед містом: 50667 Köln.

> [!word] die Unterschrift
> ipa: /ˈʊntɐˌʃʁɪft/ · pos: noun · level: A1 · id: de-a1-lesen-schreiben-w07
> uk: підпис
> forms: die Unterschriften
> example: Bitte setzen Sie hier Ihre **Unterschrift**. — Будь ласка, поставте тут підпис.
> note: unterschreiben — підписувати. Unter + Schrift. Не плутати з die Überschrift («заголовок»).

> [!word] die Staatsangehörigkeit
> ipa: /ˈʃtaːtsʔanɡəˌhøːʁɪçkaɪ̯t/ · pos: noun · level: A2 · id: de-a1-lesen-schreiben-w08
> uk: громадянство
> forms: die Staatsangehörigkeiten
> example: **Staatsangehörigkeit**: ukrainisch. — Громадянство: українське.
> note: у формулярах пишуть прикметником з малої: ukrainisch, deutsch. Довге слово: розбий на der Staat + angehören («належати»). CH: die Nationalität / das Bürgerrecht.

> [!word] ledig
> ipa: /ˈleːdɪç/ · pos: adj · level: A1 · id: de-a1-lesen-schreiben-w09
> uk: неодружений; незаміжня
> example: Familienstand: **ledig**. — Сімейний стан: неодружений.
> note: -ig = [ɪç]. Одне слово для чоловіка й жінки; verheiratet — одружений, geschieden — розлучений.

> [!word] der Eingang
> ipa: /ˈaɪ̯nɡaŋ/ · pos: noun · level: A1 · id: de-a1-lesen-schreiben-w10
> uk: вхід
> forms: die Eingänge
> example: Der **Eingang** ist auf der linken Seite. — Вхід з лівого боку.
> note: ein + Gang: «захід». Протилежне — der Ausgang. ng = [ŋ].

> [!word] der Ausgang
> ipa: /ˈaʊ̯sɡaŋ/ · pos: noun · level: A1 · id: de-a1-lesen-schreiben-w11
> uk: вихід
> forms: die Ausgänge
> example: Der **Ausgang** ist hinten. — Вихід ззаду.
> note: der Notausgang — аварійний вихід (зелена вивіска). au = «ау»; Gang = [ɡaŋ].

> [!word] geöffnet
> ipa: /ɡəˈœfnət/ · pos: adj · level: A1 · id: de-a1-lesen-schreiben-w12
> uk: відчинений; відкритий
> example: Das Geschäft ist montags bis freitags **geöffnet**. — Магазин працює з понеділка по пʼятницю.
> note: Partizip II від öffnen (див. A1-07), тут у ролі прикметника. Протилежне — geschlossen. На дверях також Offen / Auf.

> [!word] geschlossen
> ipa: /ɡəˈʃlɔsn̩/ · pos: adj · level: A1 · id: de-a1-lesen-schreiben-w13
> uk: зачинений; закритий
> example: Am Sonntag ist die Post **geschlossen**. — У неділю пошта зачинена.
> note: Partizip II від schließen. Sch- = «ш», подвійне s після короткого o. Також на вивісках: Zu, Pause.

> [!word] die Öffnungszeiten
> ipa: /ˈœfnʊŋsˌtsaɪ̯tn̩/ · pos: noun · level: A1 · id: de-a1-lesen-schreiben-w14
> uk: години роботи
> forms: — (лише множина)
> example: Wie sind die **Öffnungszeiten**? — Які години роботи?
> note: майже завжди множина: die Öffnungszeiten. Єдине число рідко: die Öffnungszeit. Відповідь: Montag bis Freitag von 9 bis 18 Uhr.

> [!word] der Eintritt
> ipa: /ˈaɪ̯ntʁɪt/ · pos: noun · level: A1 · id: de-a1-lesen-schreiben-w15
> uk: вхід (плата); вхідний квиток
> forms: die Eintritte
> example: **Eintritt** frei! — Вхід вільний!
> note: der Eintritt = вхід як подія і плата за нього; der Eingang — місце входу. Eintritt kostet 5 Euro. Вхідний квиток — die Eintrittskarte.

> [!word] die Nachricht
> ipa: /ˈnaːxʁɪçt/ · pos: noun · level: A1 · id: de-a1-lesen-schreiben-w16
> uk: повідомлення; новина
> forms: die Nachrichten
> example: Ich schicke dir eine **Nachricht**. — Я пошлю тобі повідомлення.
> note: die Nachrichten (мн.) — новини на ТБ. ach = [x], -icht = [ɪçt]: два різні ch в одному слові.

> [!word] schreiben
> ipa: /ˈʃʁaɪ̯bn̩/ · pos: verb · level: A1 · id: de-a1-lesen-schreiben-w17
> uk: писати
> forms: schreiben → schrieb → hat geschrieben
> example: Ich **schreibe** dir eine SMS. — Я пишу тобі есемес.
> note: Sch = «ш», ei = «ай», у schrieb ie = довге [iː]. Wie schreibt man das? — як це пишеться?

> [!word] Viele Grüße
> ipa: /ˈfiːlə ˈɡʁyːsə/ · pos: phrase · level: A1 · id: de-a1-lesen-schreiben-w18
> uk: з привітом; щиро (в кінці листа)
> example: Bis morgen! **Viele Grüße**, Olena — До завтра! З привітом, Олена.
> note: нейтральне закінчення. Друзям — Liebe Grüße, офіційно — Mit freundlichen Grüßen. CH: Freundliche Grüsse (без ß).

> [!word] die Hausordnung
> ipa: /ˈhaʊ̯sʔɔʁdnʊŋ/ · pos: noun · level: B1 · id: de-a1-lesen-schreiben-w19
> uk: правила проживання в будинку
> forms: die Hausordnungen
> example: Die **Hausordnung** hängt im Treppenhaus. — Правила будинку висять на сходах.
> note: -ung → die (тема A1-06). Типово містить Ruhezeiten, правила прибирання та сміття.

> [!word] die Ruhezeit
> ipa: /ˈʁuːətsaɪ̯t/ · pos: noun · level: B1 · id: de-a1-lesen-schreiben-w20
> uk: час тиші
> forms: die Ruhezeiten
> example: In der **Ruhezeit** ist Lärm verboten. — У час тиші шуміти заборонено.
> note: у багатьох будинках — Nachtruhe з ≈ 22 до 6 годин та вихідні. Точні години різняться за будинком і громадою — їх вказано в Hausordnung; 22–6 годин — поширений, але не єдиний варіант. Ruhe [ˈʁuːə] — довге u.

## Слухаємо

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-lesen-schreiben-l01
> audio: Meine Adresse ist Lindenstraße vierzehn in Köln.
> explain: адреса — вулиця, номер будинку, місто; ß у Lindenstraße.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-lesen-schreiben-l02
> audio: Montags bis freitags sind wir von neun bis achtzehn Uhr geöffnet.
> explain: montags — «щопонеділка», а не Montag: закінчення -s.

> [!listen] Послухай діалог. Яка дата народження?
> level: A1 · type: answer · speed: slow · id: de-a1-lesen-schreiben-l03
> audio: A: Wie ist Ihr Geburtsdatum, bitte?
> audio: B: Der fünfzehnte März neunzehnhundertneunundneunzig.
> - [x] 15.03.1999
> - [ ] 03.15.1999
> - [ ] 15.03.1995
>
> **Пояснення:** день · місяць · рік: *der fünfzehnte März* = 15.03; *neunzehnhundertneunundneunzig* = 1999.

> [!listen] Послухай оголошення. Коли зачинено?
> level: A1 · type: answer · speed: slow · id: de-a1-lesen-schreiben-l04
> audio: Wir haben montags bis freitags von neun bis achtzehn Uhr geöffnet. Samstags von neun bis dreizehn Uhr. Sonntags geschlossen.
> - [ ] у суботу
> - [x] у неділю
> - [ ] у понеділок
>
> **Пояснення:** *Sonntags geschlossen* — по неділях зачинено; субота працює скорочено (9–13).

## Вимова

Тут тренуємо вимову елементів формуляра, які ти будеш називати вголос: дату, адресу, прощання.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-lesen-schreiben-s01
> text: Mein Geburtsdatum ist der fünfzehnte März.
> ipa: /maɪ̯n ɡəˈbʊʁtsdaːtʊm ɪst deːɐ̯ ˈfʏnftseːntə mɛʁts/
> tip: Geburtsdatum — g = «ґ», наголос на -burts-, ts = «ц». fünfzehnte: ü — губи «у», язик «і».
> uk: Моя дата народження — пʼятнадцяте березня.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-lesen-schreiben-s02
> text: Ich wohne in der Lindenstraße vierzehn.
> ipa: /ɪç ˈvoːnə ɪn deːɐ̯ ˈlɪndn̩ʃtʁaːsə ˈfɪʁtseːn/
> tip: Straße: str- = «штр» (st- на початку = «шт»), довге [aː], ß = [s]. vierzehn: коротке [ɪ].
> uk: Я живу на Лінденштрасе, чотирнадцять.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-lesen-schreiben-s03
> text: Viele Grüße, Olena.
> ipa: /ˈfiːlə ˈɡʁyːsə oˈleːna/
> tip: v на початку = [f]: «філе». Grüße: ü довге, ß = [s]. Голос падає ↘.
> uk: З привітом, Олена.

## Типові помилки українців

> [!pitfall] Іменники з малої: ~~ich habe einen bruder~~
> В українській і англійській іменники пишуться з малої (англійською — лише власні). У німецькій **усі іменники** — з великої: *der Bruder, die Schwester, das Essen, am Montag, im Mai*. Звідси й *Ich lerne **Deutsch***, але *ein deutsches Buch*: назва мови — іменник, прикметник — з малої.

> [!pitfall] ~~Wie geht es ihnen?~~ і ~~sehr geehrte Frau~~
> Ввічливе *Sie, Ihnen, Ihr* — з великої літери завжди: *Wie geht es **Ihnen**?* У листі *Sehr geehrte Frau Weber* — теж з великої, бо це початок речення. Після коми в листі речення йде з малої: *Liebe Anna, **i**ch komme heute.*

> [!pitfall] Адреса й індекс: порядок інший
> В Україні дату пишуть день.місяць.рік, і в Німеччині так само: *05.11.2026* = **5 листопада**, не 11 травня. А ось адреса відрізняється: ~~14 Lindenstraße~~ → *Lindenstraße 14*, а індекс — **перед** містом: *50667 Köln*.

> [!pitfall] Лист без звертання й прощання
> Українське коротке повідомлення можна почати прямо з фрази. У німецькій записці навіть для друга: *Hallo Max,* … і закінчення *Viele Grüße* (або *Danke*). Для офіційних листів — *Sehr geehrte Frau … / Sehr geehrter Herr …* і *Mit freundlichen Grüßen*. Не плутай: *Lieber* — до чоловіка, *Liebe* — до жінки.

## Landeskunde: оголошення на дверях будинку

> [!example] Hausordnung (приклад: у кожному будинку правила свої)
> **Hausordnung · Lindenstraße 14**
> 1. Ruhezeiten: täglich von 13 bis 15 Uhr und von 22 bis 6 Uhr. Bitte leise sein!
> 2. Die Haustür muss immer geschlossen sein. Bitte die Tür nicht offen lassen.
> 3. Im Treppenhaus dürfen keine Fahrräder stehen.
> 4. Rauchen ist im Haus verboten.
> 5. Bei Fragen: Hausverwaltung, Montag bis Freitag, 9 bis 12 Uhr, Telefon 0221 123 45.

> [!quiz] Wann gelten die Ruhezeiten in dieser Hausordnung?
> level: A1 · type: single · id: de-a1-lesen-schreiben-q02
> - [ ] nur nachts
> - [x] von 13 bis 15 Uhr und von 22 bis 6 Uhr
> - [ ] nur am Wochenende
> - [ ] von 9 bis 12 Uhr
>
> **Пояснення:** у тексті: «täglich von 13 bis 15 Uhr und von 22 bis 6 Uhr» — щодня вдень і вночі. 9–12 — години Hausverwaltung.

> [!quiz] Was darf nicht im Treppenhaus stehen?
> level: A1 · type: single · id: de-a1-lesen-schreiben-q03
> - [ ] Besuch bekommen
> - [x] Fahrräder
> - [ ] Telefonieren
> - [ ] Schuhe
>
> **Пояснення:** «Im Treppenhaus dürfen keine Fahrräder stehen» — на сходах не можна залишати велосипеди. Про гостей, розмови чи взуття в тексті нічого немає.

## Практика

> [!quiz] Як прочитати дату 05.11.2026?
> level: A1 · type: single · id: de-a1-lesen-schreiben-q04
> - [ ] der elfte Mai
> - [x] der fünfte November
> - [ ] der fünfte Mai
> - [ ] der elfte November
>
> **Пояснення:** у німецькій спершу день, потім місяць: 05.11 = 5 листопада.

> [!quiz] Що означає «Eintritt frei»?
> level: A1 · type: single · id: de-a1-lesen-schreiben-q05
> - [ ] Вхід заборонений
> - [x] Вхід безкоштовний
> - [ ] Вільні місця
> - [ ] Вхід тільки для своїх
>
> **Пояснення:** *Eintritt* — вхід (і плата за нього), *frei* тут «вільний, безкоштовний». Не плутати з *Eingang* («вхід» як місце).

> [!quiz] Офіційний лист до пані Вебер у Behörde. Яке звертання підходить?
> level: A1 · type: single · id: de-a1-lesen-schreiben-q06
> - [ ] Hallo Weber,
> - [ ] Liebe Frau Weber,
> - [x] Sehr geehrte Frau Weber,
> - [ ] Tschüs Frau Weber,
>
> **Пояснення:** офіційно — *Sehr geehrte Frau …*. *Liebe …* — для друзів і близьких, *Hallo* — неформально.

> [!quiz] Які речення написано правильно?
> level: A1 · type: multi · id: de-a1-lesen-schreiben-q07
> - [x] Ich lerne Deutsch.
> - [ ] ich lerne deutsch.
> - [x] Am Montag habe ich Zeit.
> - [ ] Das ist ein Ukrainisches Buch.
> - [x] Das ist ein ukrainisches Buch.
>
> **Пояснення:** *Deutsch* — мова (іменник) з великої; *ukrainisches* — прикметник з малої; *Montag* — з великої.

> [!quiz] Що зазвичай є у формулярі?
> level: A1 · type: multi · id: de-a1-lesen-schreiben-q08
> - [x] Vorname
> - [x] Geburtsdatum
> - [ ] Lieblingsfarbe
> - [x] Unterschrift
> - [ ] Schuhgröße
>
> **Пояснення:** стандартні поля: Vorname, Nachname, Geburtsdatum, Wohnort, Unterschrift. Колір чи розмір взуття формуляр не питає.

> [!quiz] Заповни поля формуляра
> level: A1 · type: fill · bank: Wohnort, Adresse · id: de-a1-lesen-schreiben-q09
>
> ```text fill
> [[Vorname]]: Olena
> [[Nachname]]: Bondar
> [[Geburtsdatum]]: 15.03.1995
> ```
>
> **Пояснення:** імʼя — *Vorname*, прізвище — *Nachname*, дата народження — *Geburtsdatum*. *Wohnort* і *Adresse* — інші поля.

> [!quiz] Заповни пропуски в записці
> level: A1 · type: fill · bank: Lieber, Grüßen · id: de-a1-lesen-schreiben-q10
>
> ```text fill
> [[Liebe]] Anna, ich komme heute später.
> Viele [[Grüße]], Olena
> ```
>
> **Пояснення:** до жінки — *Liebe Anna* (*Lieber* — до чоловіка); прощання — *Viele Grüße*. *Grüßen* було б у формулі *Mit freundlichen Grüßen*.

> [!quiz] Заповни пропуски в оголошенні
> level: A1 · type: fill · bank: von, auf · id: de-a1-lesen-schreiben-q11
>
> ```text fill
> Montag [[bis]] Freitag [[geöffnet]].
> Sonntag [[geschlossen]].
> ```
>
> **Пояснення:** *Montag bis Freitag* — з понеділка до пʼятниці; *geöffnet / geschlossen* — відчинено / зачинено. *von* і *auf* тут не підходять.

> [!quiz] Склади речення: «Я сьогодні прийду пізніше»
> level: A1 · type: order · id: de-a1-lesen-schreiben-q12
>
> ```text order
> Ich
> komme
> heute
> später.
> spät ✗
> ```
>
> **Пояснення:** *später* — «пізніше», *spät* — «пізно».

> [!quiz] Склади прощання в офіційному листі
> level: A1 · type: order · id: de-a1-lesen-schreiben-q13
>
> ```text order
> Mit
> freundlichen
> Grüßen
> freundliche ✗
> ```
>
> **Пояснення:** після *mit* — форма *freundlichen Grüßen* (Dativ множини, детально — у A2). *freundliche* — це швейцарське *Freundliche Grüsse* без *mit*, а не частина цієї формули.

> [!quiz] Склади речення: «У неділю ми зачинені»
> level: A1 · type: order · id: de-a1-lesen-schreiben-q14
>
> ```text order
> Am
> Sonntag
> haben
> wir
> geschlossen.
> geöffnet ✗
> ```
>
> **Пояснення:** *Am Sonntag* стоїть першим, дієслово *haben* — друге (V2), підмет *wir* — після нього. *geöffnet* — «відчинено».

## Фішки

> [!reel] 📮 Індекс із 5 цифр
> Німецькі поштові індекси мають пʼять цифр, і пишуть їх **перед** містом: *50667 Köln*. Така система діє з 1993 року — після обʼєднання країни стару, чотирицифрову, замінили пʼятицифровою. В Австрії та Швейцарії індекс має чотири цифри, тому *PLZ* там коротша.

> [!reel] ✉ «Mit freundlichen Grüßen»
> Німецька офіційна формула прощання буквально означає «з дружніми вітаннями» — вона нейтральна, а не «дружня». Її пишуть у листах до банку, Behörde, роботодавця. Друзям пишуть *Viele Grüße* або *Liebe Grüße*, а швейцарці — *Freundliche Grüsse* (без *mit*, через ss).

> [!reel] 🔠 Чому іменники з великої
> Великі літери в іменниках німецька має з XVI–XVII століть, коли друкарі так виділяли важливі слова. Данська мова теж так робила, але в 1948 році відмовилася. Німецька лишила правило, тому в тексті одразу видно, де іменники: *der Hund, die Tür, das Essen*.

## Джерела та що почитати

- [DWDS — Formular](https://www.dwds.de/wb/Formular) — значення слова, приклади, синоніми.
- [DWDS — Postleitzahl](https://www.dwds.de/wb/Postleitzahl) — словникова стаття про індекс.
- [DWDS — Hausordnung](https://www.dwds.de/wb/Hausordnung) — слово та приклади вживання.
- [DWDS — Öffnungszeit](https://www.dwds.de/wb/%C3%96ffnungszeit) — слово, приклади, форми.
- [DWDS — Unterschrift](https://www.dwds.de/wb/Unterschrift) — значення й вживання.
- [Duden — Groß- und Kleinschreibung](https://www.duden.de/sprachwissen/rechtschreibregeln/gross-und-kleinschreibung) — правила великих і малих літер.
- [DW Learn German — Nicos Weg (A1)](https://learngerman.dw.com/en/beginners/c-36519789) — безкоштовний відеокурс Deutsche Welle: читання й письмо.
- Goethe-Institut — сторінка іспиту *Goethe-Zertifikat A1: Start Deutsch 1* на goethe.de: зразки формуляра й записки.

> [!important] Підсумок
> - Вивіски короткі: *Eingang, Ausgang, Eintritt frei, geöffnet, geschlossen, Rauchen verboten*.
> - Формуляр: *Vorname, Nachname, Geburtsdatum (день.місяць.рік), Wohnort, PLZ перед містом, Unterschrift*.
> - Записка: звертання, причина, прохання, прощання; друзям — *Hallo / Liebe, Viele Grüße*, офіційно — *Sehr geehrte …, Mit freundlichen Grüßen*.
> - Усі іменники й ввічливе *Sie / Ihnen* — з великої літери; прикметники національності — з малої.
