---
title: Аудіювання — оголошення й інструкції
id: de-a2-hoeren-durchsagen
level: A2
icon: px:headphones
tags: [deutsch, a2, listening, durchsagen, wetter, bahnhof]
prerequisites: ["[[Deutsch - A1 - 13. Аудіювання — імена, числа, ціни й час]]", "[[Deutsch - A1 - 28. Аудіювання — щоденні діалоги]]"]
estimatedMinutes: 45
---

# Аудіювання — оголошення й інструкції

> [!success] Після цієї теми ти зможеш
> - зрозуміти ключову інформацію в оголошеннях на вокзалі, в аеропорту й у супермаркеті: колія, вихід, час, ціна;
> - зрозуміти прогноз погоди й записане повідомлення на автовідповідачі;
> - помітити виправлення в оголошенні (*nicht … sondern …*, *eine Änderung*) і вибрати нову інформацію;
> - виконати усну інструкцію на слух: *Bitte schalten Sie Ihr Handy aus.*

## Передбач

> [!quiz] Ти чуєш: «Der Zug fährt nicht um neun Uhr, sondern um zehn Uhr.» О котрій відправляється потяг?
> level: A2 · type: single · id: de-a2-hoeren-durchsagen-q01
> - [ ] о девʼятій
> - [x] о десятій
> - [ ] о девʼятій і о десятій
> - [ ] потяг не їде
>
> **Пояснення:** після *sondern* стоїть правильна інформація. Перше число (*nicht um neun*) — те, що було раніше й тепер недійсне. Це улюблений прийом у завданнях: слухай, чи є виправлення.

## Як слухати оголошення

Оголошення (*die Durchsage*, *die Ansage*) — короткий текст, який часто чуєш у шумі й без можливості перепитати. Не зрозуміти всі слова — нормально. Потрібно знати, **що саме шукати**. Модуль Hören в іспиті Goethe-Zertifikat A2 триває 30 хвилин і має чотири частини.

| Частина | Що слухаєш | Скільки разів | Завдання |
|---|---|---|---|
| 1 | п'ять коротких текстів (оголошення, повідомлення на автовідповідачі) | двічі | 1–5: варіанти a, b, c |
| 2 | одна розмова | один раз | 6–10: підібрати картинку з a–i |
| 3 | п'ять коротких розмов | один раз | 11–15: варіанти a, b, c |
| 4 | інтерв'ю | двічі | 16–20: Ja / Nein |

Формат подано за офіційним модельним тестом.

> [!diagram] Стратегія: запитання → ключове слово → виправлення
> ```yaml
> layout: flow
> nodes:
>   - { id: q, label: "1 · до запису", text: "Прочитай запитання й варіанти", tone: yellow }
>   - { id: k, label: "2 · під час", text: "Лови ключове слово: Gleis, Uhr, Euro, Grad", tone: pink }
>   - { id: c, label: "3 · виправлення", text: "nicht … sondern, eine Änderung", tone: gray }
>   - { id: a, label: "4 · відповідь", text: "Обери нову інформацію", tone: yellow }
> steps:
>   - { focus: q, note: "Що питають: колію, час, ціну, місто, температуру? Підкресли це слово у варіантах, і решту можна не розуміти." }
>   - { focus: k, note: "Слухай лише те, що шукаєш. Числа записуй цифрами: Gleis 12, 18:37, 1,99 €." }
>   - { focus: c, note: "Слова-сигнали: nicht … sondern, eine Änderung, leider, jetzt, statt. Після них зазвичай стоїть інформація, яка діє." }
>   - { focus: a, note: "Порівняй із варіантами. Якщо чув два числа, обери те, що після виправлення." }
> ```
> Спочатку запитання, потім аудіо. Це половина успіху.

### Де чути оголошення

| Місце | Що чуєш | На що звертати увагу |
|---|---|---|
| Вокзал | колія, напрямок, час, запізнення, скасування | *Gleis*, *Uhr*, *fällt aus*, *Verspätung* |
| Аеропорт | рейс, вихід (*Ausgang*, *Gate*), посадка | номер рейсу, літера й число виходу |
| Супермаркет | акції, закриття, каса | ціна, *im Angebot*, *schließt in … Minuten* |
| Погода | температура, опади, регіон | *Grad*, *Regen*, *Sonne*, *im Norden / Süden* |
| Автовідповідач | години роботи, прохання залишити повідомлення | дні, години, *nach dem Signalton* |
| Інструкції | прохання, заборони | наказ із *bitte*, *Achtung*, *Vorsicht* |

### Корисні формули

| Німецька | Українська |
|---|---|
| *Achtung, eine Durchsage!* | Увага, оголошення! |
| *Der Zug fährt von Gleis 8 ab.* | Потяг відправляється з колії 8. |
| *Der Zug fällt heute aus.* | Потяг сьогодні скасовано. |
| *Der Zug hat zehn Minuten Verspätung.* | Потяг запізнюється на десять хвилин. |
| *Wir bitten um Ihre Aufmerksamkeit.* | Просимо уваги. |
| *Bitte beachten Sie …* | Зверніть, будь ласка, увагу на … |
| *Die Kasse ist jetzt geöffnet.* | Каса зараз відчинена. |
| *Bitte hinterlassen Sie eine Nachricht.* | Будь ласка, залиште повідомлення. |

> [!diagram] Числа в оголошеннях: що записувати
> ```yaml
> layout: compare
> columns: { a: "офіційно (оголошення)", b: "розмовно" }
> nodes:
>   - { id: a1, col: a, label: "14:30", text: "vierzehn Uhr dreißig", tone: yellow }
>   - { id: a2, col: a, label: "18:37", text: "achtzehn Uhr siebenunddreißig", tone: yellow }
>   - { id: b1, col: b, label: "14:30 / 2:30", text: "halb drei", tone: pink }
>   - { id: b2, col: b, label: "18:45", text: "Viertel vor sieben", tone: pink }
> steps:
>   - { focus: [a1, a2], note: "На вокзалі й в аеропорту час майже завжди 24-годинний: vierzehn Uhr dreißig. Просто запиши цифри." }
>   - { focus: [b1, b2], note: "У розмові: halb drei = 2:30, Viertel vor sieben = 18:45. На слух різниця велика, тож слухай, у якому стилі говорять." }
> ```
> В оголошенні — години й хвилини цифрами; у розмові — «пів на…», «чверть до…».

## Приклади

- Achtung am Gleis 5! Der ICE nach Hamburg hat zehn Minuten Verspätung. — Увага на колії 5! Потяг ICE до Гамбурга запізнюється на десять хвилин.
- Der Regionalexpress nach Köln fällt heute aus. — Регіональний потяг до Кельна сьогодні скасовано.
- Fluggäste nach Wien, bitte kommen Sie zum Ausgang B 12. — Пасажири рейсу до Відня, будь ласка, прийдіть до виходу B 12.
- Heute im Angebot: Äpfel für 1,99 Euro das Kilo. — Сьогодні за акцією: яблука по 1,99 євро за кілограм.
- Im Norden regnet es, im Süden scheint die Sonne. — На півночі йде дощ, на півдні світить сонце.
- Die Temperaturen steigen bis 22 Grad. — Температура підніметься до 22 градусів.
- Sie sind verbunden mit der Praxis Dr. Weber. — Ви додзвонилися до кабінету (Praxis) доктора Вебера.
- Bitte schalten Sie Ihr Handy aus. — Будь ласка, вимкніть мобільний телефон.
- Vorsicht an der Bahnsteigkante! — Обережно, край платформи!
- Unser Geschäft schließt in zehn Minuten. — Наш магазин зачиняється за десять хвилин.

## Слова

> [!word] die Ansage
> ipa: /ˈanzaːɡə/ · pos: noun · level: A2 · id: de-a2-hoeren-durchsagen-w01
> uk: оголошення; запис на автовідповідачі
> forms: die Ansagen
> example: Auf dem Anrufbeantworter läuft eine **Ansage**. — На автовідповідачі грає запис.
> note: від ansagen (відокремлюване: ˈansagen). Die Durchsage — оголошення по гучномовцю, die Ansage — також запис і оголошення в залі.

> [!word] die Wettervorhersage
> ipa: /ˈvɛtɐfoːɐ̯heːɐ̯zaːɡə/ · pos: noun · level: A2 · id: de-a2-hoeren-durchsagen-w02
> uk: прогноз погоди
> forms: die Wettervorhersagen
> example: Laut **Wettervorhersage** regnet es morgen. — Згідно з прогнозом погоди, завтра буде дощ.
> note: також der Wetterbericht. Wetter + Vorhersage. Наголос на Wet-. -er у Wetter — слабке [ɐ].

> [!word] der Lautsprecher
> ipa: /ˈlaʊ̯tʃpʁɛçɐ/ · pos: noun · level: A2 · id: de-a2-hoeren-durchsagen-w03
> uk: гучномовець; динамік
> forms: die Lautsprecher
> example: Die Durchsage kommt aus dem **Lautsprecher**. — Оголошення лунає з гучномовця.
> note: laut + Sprecher. sp на початку другого кореня = [ʃp]: Laut-sprecher.

> [!word] Achtung!
> ipa: /ˈaxtʊŋ/ · pos: phrase · level: A2 · id: de-a2-hoeren-durchsagen-w04
> uk: Увага! Обережно!
> example: **Achtung!** Der Zug fährt ein. — Увага! Прибуває потяг.
> note: ch після a = [x]. Для попередження про небезпеку також Vorsicht!. Для привернення уваги до оголошення: Achtung, eine Durchsage!

> [!word] Vorsicht!
> ipa: /ˈfoːɐ̯zɪçt/ · pos: phrase · level: A2 · id: de-a2-hoeren-durchsagen-w05
> uk: Обережно!
> example: **Vorsicht!** Der Boden ist nass. — Обережно! Підлога мокра.
> note: v у Vor- = [f]. Попередження про небезпеку. Іменник die Vorsicht — обережність.

> [!word] beachten
> ipa: /bəˈʔaxtn̩/ · pos: verb · level: B1 · id: de-a2-hoeren-durchsagen-w06
> uk: зважати; брати до уваги; дотримуватися
> forms: beachten → beachtete → hat beachtet
> example: Bitte **beachten** Sie die Hinweise. — Будь ласка, зверніть увагу на вказівки.
> note: невідокремлюване, тому Perfekt без ge-. Наголос на -ach-: be- слабке [bə].

> [!word] der Hinweis
> ipa: /ˈhɪnvaɪ̯s/ · pos: noun · level: B1 · id: de-a2-hoeren-durchsagen-w07
> uk: вказівка; підказка; застереження
> forms: die Hinweise
> example: Bitte lesen Sie die **Hinweise** am Eingang. — Будь ласка, прочитайте вказівки біля входу.
> note: w = [v], ei = [aɪ̯]. Der Hinweis auf (+ Akk) — вказівка на щось.

> [!word] die Aufmerksamkeit
> ipa: /ˈaʊ̯fmɛʁkzaːmkaɪ̯t/ · pos: noun · level: B1 · id: de-a2-hoeren-durchsagen-w08
> uk: увага
> forms: — (без множини)
> example: Wir bitten um Ihre **Aufmerksamkeit**. — Просимо Вашої уваги.
> note: суфікс -keit без винятків жіночого роду. Фраза з оголошень: Ihre Aufmerksamkeit, bitte!

> [!word] das Angebot
> ipa: /ˈanɡəboːt/ · pos: noun · level: A2 · id: de-a2-hoeren-durchsagen-w09
> uk: пропозиція; акція; пропонований товар
> forms: die Angebote
> example: Heute ist Obst im **Angebot**. — Сьогодні фрукти за акцією.
> note: im Angebot — за акційною ціною. Також «пропозиція» в діловому розумінні: ein Angebot machen.

> [!word] der Kunde
> ipa: /ˈkʊndə/ · pos: noun · level: A2 · id: de-a2-hoeren-durchsagen-w10
> uk: клієнт; покупець
> forms: die Kunden
> example: Liebe **Kunden**, wir schließen in zehn Minuten. — Шановні покупці, ми зачиняємося за десять хвилин.
> note: слабкий іменник: den Kunden, dem Kunden. Жіноча форма: die Kundin.

> [!word] der Schauer
> ipa: /ˈʃaʊ̯ɐ/ · pos: noun · level: B1 · id: de-a2-hoeren-durchsagen-w11
> uk: короткочасний дощ; злива
> forms: die Schauer
> example: Am Nachmittag gibt es einzelne **Schauer**. — Вдень місцями короткочасні дощі.
> note: частіше Regenschauer. sch = «ш», au = [aʊ̯], -er = [ɐ]. Не плутай із Gewitter (гроза).

## Слухаємо

> [!listen] Послухай оголошення на вокзалі. З якої колії відправляється потяг?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l01
> audio: Achtung am Gleis fünf! Der ICE nach Hamburg fährt heute nicht von Gleis fünf, sondern von Gleis acht ab. Er hat zehn Minuten Verspätung.
> - [ ] з колії 5
> - [x] з колії 8
> - [ ] з колії 10
>
> **Пояснення:** *nicht von Gleis fünf, sondern von Gleis acht*: правильна колія 8. Число *zehn* стосується запізнення (10 хвилин), а не колії.

> [!listen] Послухай оголошення. Що сталося з потягом?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l02
> audio: Der Regionalexpress nach Köln fällt heute aus. Bitte benutzen Sie den Zug um vierzehn Uhr zwanzig.
> - [ ] потяг запізнюється
> - [x] потяг скасовано, можна їхати о 14:20
> - [ ] потяг їде з іншої колії
>
> **Пояснення:** *fällt aus* = «скасовано». Наступна можливість: *vierzehn Uhr zwanzig* = 14:20.

> [!listen] Послухай оголошення в аеропорту. До якого виходу йти?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l03
> audio: Fluggäste nach Wien, Flug LH eins-zwei-drei-vier, bitte kommen Sie zum Ausgang B zwölf. Der Flug ist jetzt zum Einsteigen bereit.
> - [ ] B 2
> - [x] B 12
> - [ ] B 20
>
> **Пояснення:** *zwölf* = 12. Номер рейсу *LH 1234* — це не вихід. Літера B і число 12 разом.

> [!listen] Заповни дані про рейс
> level: A2 · type: fill · speed: slow · id: de-a2-hoeren-durchsagen-l04
> audio: Der Flug nach Zürich, Flugnummer LX eins-null-sieben-drei, startet um sechzehn Uhr fünfundvierzig. Bitte gehen Sie zum Gate A sieben.
>
> ```fill
> Ziel: [[Zürich]]
> Flugnummer: [[LX 1073|LX1073]]
> Zeit: [[16:45|16.45|16 Uhr 45]]
> Gate: [[A 7|A7]]
> ```
>
> **Пояснення:** *fünfundvierzig* = 45 (5 і 40). *Sieben* = 7, *siebzehn* було б 17.

> [!listen] Послухай оголошення в супермаркеті. Скільки коштує кілограм яблук?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l05
> audio: Liebe Kunden, heute im Angebot: Äpfel, ein Kilo nur einen Euro neunundneunzig. Und frisches Brot ab siebzehn Uhr zum halben Preis.
> - [ ] 1,09 євро
> - [x] 1,99 євро
> - [ ] 9,99 євро
>
> **Пояснення:** *einen Euro neunundneunzig* = 1,99 €. «Frisches Brot ab 17 Uhr» — інша акція: після 17:00 хліб за півціни.

> [!listen] Послухай. За скільки хвилин зачиняється магазин?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l06
> audio: Achtung, liebe Kunden! Unser Geschäft schließt in zehn Minuten. Bitte gehen Sie jetzt zur Kasse.
> - [ ] за 5 хвилин
> - [x] за 10 хвилин
> - [ ] за 20 хвилин
>
> **Пояснення:** *in zehn Minuten* = «через десять хвилин». Прохання: *Bitte gehen Sie zur Kasse* — підійти до каси.

> [!listen] Послухай прогноз погоди. Яка погода буде на півдні?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l07
> audio: Das Wetter morgen: Im Norden regnet es bei zwölf Grad. Im Süden scheint die Sonne, die Temperatur steigt bis zweiundzwanzig Grad. Am Abend sind Gewitter möglich.
> - [ ] дощ, +12
> - [x] сонце, до +22
> - [ ] гроза, +22
>
> **Пояснення:** *im Süden* — на півдні: *Sonne*, *bis zweiundzwanzig Grad*. Дощ і 12 градусів — на півночі. Гроза можлива лише ввечері.

> [!listen] Послухай прогноз на вихідні. Яка погода в неділю?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l08
> audio: Das Wetter am Wochenende: Am Samstag bleibt es trocken bei achtzehn Grad. Am Sonntag kommt Regen, die Temperaturen sinken auf elf Grad.
> - [ ] сухо, +18
> - [x] дощ, +11
> - [ ] дощ, +18
>
> **Пояснення:** *Samstag* — сухо й 18 градусів, *Sonntag* — дощ і 11. Слово *sinken* означає «знижуватися».

> [!listen] Заповни таблицю прогнозу
> level: A2 · type: fill · speed: slow · id: de-a2-hoeren-durchsagen-l09
> audio: Und nun das Wetter für Mittwoch. Im Westen scheint die Sonne, es wird vierundzwanzig Grad warm. Im Osten gibt es am Nachmittag einzelne Schauer bei neunzehn Grad.
>
> ```fill
> Westen: [[Sonne]], [[24]] Grad
> Osten: [[Schauer|Regen]], [[19]] Grad
> ```
>
> **Пояснення:** *vierundzwanzig* = 24 (4 і 20), *neunzehn* = 19. *Schauer* — короткочасний дощ.

> [!listen] Послухай автовідповідач. Коли приймає лікар?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l10
> audio: Guten Tag, Sie sind verbunden mit der Praxis Doktor Weber. Unsere Sprechstunde ist Montag bis Freitag von acht bis zwölf Uhr. Bitte hinterlassen Sie eine Nachricht nach dem Signalton.
> - [x] з понеділка по пʼятницю з 8 до 12
> - [ ] з понеділка по суботу з 8 до 12
> - [ ] з понеділка по пʼятницю з 12 до 18
>
> **Пояснення:** *Montag bis Freitag* — з понеділка по пʼятницю, *von acht bis zwölf Uhr* — з 8 до 12.

> [!listen] Послухай автовідповідач фірми. Коли треба передзвонити?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l11
> audio: Sie haben die Firma Schneider erreicht. Unser Büro ist heute geschlossen. Rufen Sie bitte morgen ab neun Uhr wieder an.
> - [ ] сьогодні після 9
> - [x] завтра з 9
> - [ ] завтра з 19
>
> **Пояснення:** *heute geschlossen* — сьогодні закрито; *morgen ab neun Uhr* — завтра з девʼятої. *Ab* = «від, з».

> [!listen] Послухай оголошення в автобусі. Де зупиниться автобус?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l12
> audio: Liebe Fahrgäste, wegen einer Baustelle hält der Bus Nummer zwölf heute nicht am Marktplatz, sondern am Rathaus.
> - [ ] на Marktplatz
> - [x] біля Rathaus
> - [ ] біля Bahnhof
>
> **Пояснення:** *nicht am Marktplatz, sondern am Rathaus*: зупинка біля ратуші. *Zwölf* — номер автобуса, а не частина адреси.

> [!listen] Послухай. Що можна безкоштовно?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l13
> audio: Das Museum öffnet um zehn Uhr. Heute ist der Eintritt für Kinder frei. Erwachsene zahlen acht Euro.
> - [ ] вхід безкоштовний для всіх
> - [x] вхід безкоштовний для дітей
> - [ ] дорослим вхід 10 євро
>
> **Пояснення:** *für Kinder frei* — безкоштовно для дітей. Дорослі платять 8 євро, 10 — це година відкриття.

> [!listen] Послухай. Що просять зробити?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l14
> audio: Liebe Gäste, bitte schalten Sie Ihr Handy aus und nehmen Sie Ihre Plätze ein. Der Film beginnt in fünf Minuten.
> - [ ] вимкнути світло
> - [x] вимкнути телефон і сісти на місця
> - [ ] вийти із залу
>
> **Пояснення:** *ausschalten* — вимкнути, *die Plätze einnehmen* — зайняти місця. Фільм починається за пʼять хвилин.

> [!listen] Послухай інструкцію. Чим користуватися при пожежній тривозі?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l15
> audio: Achtung! Bei Feueralarm benutzen Sie bitte nicht den Aufzug, sondern die Treppe.
> - [ ] ліфтом
> - [x] сходами
> - [ ] вийти через вікно
>
> **Пояснення:** *nicht den Aufzug, sondern die Treppe*: ліфт заборонений, сходи дозволені.

> [!listen] Послухай. О котрій тепер відправляється потяг до Берліна?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l16
> audio: Achtung, eine Änderung: Der Zug nach Berlin fährt nicht um neun Uhr fünfzehn, sondern um neun Uhr fünfzig.
> - [ ] о 9:15
> - [x] о 9:50
> - [ ] о 10:50
>
> **Пояснення:** після *Änderung* і *sondern* стоїть нова інформація: *neun Uhr fünfzig* = 9:50. *Fünfzehn* — 15, *fünfzig* — 50: слухай кінець слова.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-hoeren-durchsagen-l17
> audio: Der Zug nach Dresden fährt um achtzehn Uhr siebenunddreißig von Gleis zwölf ab.
> explain: 18:37 (*achtzehn Uhr siebenunddreißig*), колія *zwölf* = 12. Відокремлюване дієслово *abfahren*: *fährt … ab*.

> [!listen] Послухай новини дорожнього руху. Яка довжина затору?
> level: A2 · type: answer · speed: slow · id: de-a2-hoeren-durchsagen-l18
> audio: Auf der A sieben zwischen Hamburg und Hannover gibt es einen Stau, fünf Kilometer lang. Fahren Sie bitte langsam.
> - [ ] 7 км
> - [x] 5 км
> - [ ] 50 км
>
> **Пояснення:** *A sieben* — номер автостради (A7), а не довжина. Довжина затору — *fünf Kilometer*.

## Вимова

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-hoeren-durchsagen-s01
> text: Entschuldigung, von welchem Gleis fährt der Zug nach Berlin?
> ipa: /ɛntˈʃʊldɪɡʊŋ fɔn ˈvɛlçəm ɡlaɪ̯s fɛːɐ̯t deːɐ̯ tsuːk naːx bɛʁˈliːn/
> tip: Entschuldigung — наголос на -schul-, ent- слабке. welchem — ch після l = [ç]. Zug — кінцеве g = «к». Берлін: наголос на -lin.
> uk: Перепрошую, з якої колії відправляється потяг до Берліна?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-hoeren-durchsagen-s02
> text: Können Sie das bitte noch einmal sagen?
> ipa: /ˈkœnən ziː das ˈbɪtə nɔx ˈaɪ̯nmaːl ˈzaːɡn̩/
> tip: Питання «так / ні»: голос іде вгору ↗. noch — ch після o = [x]. sagen — складове [n̩] після g.
> uk: Чи не могли б Ви це повторити ще раз?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-hoeren-durchsagen-s03
> text: Wann öffnet das Museum?
> ipa: /van ˈœfnət das muˈzeːʊm/
> tip: öffnet — ö коротке [œ], ff = один звук [f], -net = [nət]. Museum — наголос на -ze-, довге [eː].
> uk: Коли відчиняється музей?

## Типові помилки українців

> [!pitfall] Береш перше число, а не виправлене
> В оголошенні часто чути два числа: старе й нове (*nicht um neun, sondern um zehn*). Записуєш перше, бо воно прозвучало першим, і відповідаєш неправильно. Слухай слова-сигнали: *nicht … sondern, eine Änderung, jetzt*. Правильна інформація зазвичай після них.

> [!pitfall] fünfzehn або fünfzig, siebzehn або siebzig
> У швидкому оголошенні *Gleis siebzehn* і *Gleis siebzig* відрізняє лише кінець слова. У номері колії, виходу, автобуса така помилка коштує пропущеного потяга. Слухай, чи є довге [eː] (*-zehn*, 13–19) чи короткий [ɪç] (*-zig*, 30–90).

> [!pitfall] Спроба зрозуміти кожне слово
> Оголошення довге, і хочеться розуміти все. Це перевантажує: ти пропускаєш число. Визнач, що питають (колія? час? ціна?), і слухай лише це. Незнайомі слова можна пропустити. Корисно знати лише формули-сигнали: *Achtung, Vorsicht, Bitte beachten Sie*.

> [!pitfall] 24 години й «halb drei»
> На вокзалі чуєш *vierzehn Uhr dreißig*, а не *halb drei*: запиши цифри як є, 14:30. Коли ж у розмові чуєш *halb drei*, це 2:30, а не 3:30: «пів на третю», як в українській, на відміну від англійського *half three*.

## Практика

> [!quiz] Що означає «Der Zug fällt aus»?
> level: A2 · type: single · id: de-a2-hoeren-durchsagen-q02
> - [ ] потяг запізнюється
> - [x] потяг скасовано
> - [ ] потяг відправляється з іншої колії
> - [ ] потяг прибув раніше
>
> **Пояснення:** *ausfallen* — «не відбутися, бути скасованим». Запізнення — *Verspätung*, інша колія — *anderes Gleis*.

> [!quiz] Що означає «Der Zug hat zehn Minuten Verspätung»?
> level: A2 · type: single · id: de-a2-hoeren-durchsagen-q03
> - [ ] потяг прибув на десять хвилин раніше
> - [x] потяг запізнюється на десять хвилин
> - [ ] потяг стоїть десять хвилин
> - [ ] потяг відправляється о 10:00
>
> **Пояснення:** *Verspätung* — запізнення. Коли потяг запізнюється, його час прибуття зсувається на ці хвилини.

> [!quiz] Які фрази в оголошенні сигналізують про виправлення інформації?
> level: A2 · type: multi · id: de-a2-hoeren-durchsagen-q04
> - [x] eine Änderung
> - [x] nicht … sondern …
> - [ ] bitte
> - [ ] vielen Dank
> - [ ] guten Tag
>
> **Пояснення:** *eine Änderung* («зміна») і *nicht … sondern …* означають, що попередня інформація недійсна. *Bitte, vielen Dank, guten Tag* — ввічливі формули без значення зміни.

> [!quiz] Як записати цифрами «vierzehn Uhr fünfzehn»?
> level: A2 · type: single · id: de-a2-hoeren-durchsagen-q05
> - [ ] 4:15
> - [x] 14:15
> - [ ] 15:14
> - [ ] 14:50
>
> **Пояснення:** *vierzehn* = 14, *fünfzehn* = 15. Офіційний час читається цифрами: 14:15. Ще можна сказати *Viertel nach zwei*.

> [!quiz] Що означає в прогнозі «bis zweiundzwanzig Grad»?
> level: A2 · type: single · id: de-a2-hoeren-durchsagen-q06
> - [ ] рівно +22
> - [ ] щонайменше +22
> - [x] температура підніметься до +22 (максимум)
> - [ ] температура впаде до +22
>
> **Пояснення:** *bis* = «до». *Die Temperatur steigt bis 22 Grad* — максимум близько 22. Падіння — *sinken*.

> [!quiz] Що означає «Bitte beachten Sie die Hinweise»?
> level: A2 · type: single · id: de-a2-hoeren-durchsagen-q07
> - [ ] будь ласка, заберіть вказівки
> - [x] будь ласка, зверніть увагу на вказівки
> - [ ] будь ласка, не читайте вказівки
> - [ ] будь ласка, залиште вказівки
>
> **Пояснення:** *beachten* — звертати увагу, дотримуватися. *Hinweise* — вказівки, поради.

> [!quiz] Заповни пропуск
> level: A2 · type: fill · bank: und, denn · id: de-a2-hoeren-durchsagen-q08
>
> ```text fill
> Der Zug fährt nicht um neun Uhr, [[sondern]] um zehn Uhr.
> ```
>
> **Пояснення:** після заперечення *nicht … sondern* вводить правильну інформацію. *Und* і *denn* тут не підходять: *denn* пояснює причину.

> [!quiz] Заповни пропуск
> level: A2 · type: fill · bank: Ankunft, Abfahrt · id: de-a2-hoeren-durchsagen-q09
>
> ```text fill
> Der Zug hat zehn Minuten [[Verspätung]].
> ```
>
> **Пояснення:** запізнення — *die Verspätung*. *Ankunft* (прибуття) і *Abfahrt* (відправлення) — моменти, а не запізнення, тому *hat zehn Minuten Ankunft* неможливе.

> [!quiz] Склади оголошення: «Потяг відправляється з восьмої колії.»
> level: A2 · type: order · id: de-a2-hoeren-durchsagen-q10
>
> ```text order
> Der
> Zug
> fährt
> von
> Gleis
> acht
> ab.
> abfährt ✗
> ```
>
> **Пояснення:** *abfahren* — відокремлюване: *fährt … ab*. Префікс *ab* стоїть наприкінці.

> [!quiz] Склади прохання: «Будь ласка, залиште повідомлення.»
> level: A2 · type: order · id: de-a2-hoeren-durchsagen-q11
>
> ```text order
> Bitte
> hinterlassen
> Sie
> eine
> Nachricht.
> hinterlasst ✗
> ```
>
> **Пояснення:** ввічлива форма з *Sie*: дієслово стоїть перед *Sie*. *Hinterlasst* — форма для *ihr*.

> [!quiz] Що робити, коли в оголошенні багато незнайомих слів?
> level: A2 · type: single · id: de-a2-hoeren-durchsagen-q12
> - [ ] зупинитися й перекласти кожне слово
> - [ ] записувати все підряд
> - [x] слухати лише те, що спитали в завданні: колію, час, ціну
> - [ ] вибрати варіант із найдовшою відповіддю
>
> **Пояснення:** потрібна лише ключова інформація. Незнайомі слова не завжди заважають її знайти.

## Фішки

> [!reel] 🚆 Літера + число
> На вокзалах колії мають номери (*Gleis 8*), а в аеропортах вихід на посадку зазвичай складається з літери й числа (*Gate B 12*, *Ausgang B zwölf*). На слух запамʼятовуй пару разом: *B zwölf*, а не просто *zwölf*.

> [!reel] 📞 «Nach dem Signalton»
> Автовідповідач німецькою закінчується фразою *Bitte hinterlassen Sie eine Nachricht nach dem Signalton* («після звукового сигналу»). Залишаючи повідомлення, називають імʼя, причину дзвінка й номер. Як це зробити, розповідає тема A2-21.

> [!reel] ⚠️ Achtung, Achtung!
> Слово *Achtung* походить від дієслова *achten* («зважати, звертати увагу»). Воно привертає увагу перед важливою інформацією, тож слухай уважно те, що йде після нього: зміну колії, скасування, застереження.

## Джерела та що почитати

- [Goethe-Institut — Durchführungsbestimmungen A2](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_A2.pdf) — офіційні умови проведення Goethe-Zertifikat A2.
- [Goethe-Institut — Modellsatz A2, Hören](https://bfu.goethe.de/a2_mod_2MX5/hoeren.php) — офіційний онлайн-тест: чотири частини, 20 завдань, 30 хвилин.
- [DWDS — Durchsage](https://www.dwds.de/wb/Durchsage) — значення слова.
- [DWDS — Ansage](https://www.dwds.de/wb/Ansage) — значення слова.
- [DWDS — Wettervorhersage](https://www.dwds.de/wb/Wettervorhersage) — значення слова.
- [DW Learn German — Nicos Weg (A2)](https://learngerman.dw.com/en/a2/c-36519740) — безкоштовний відеокурс із діалогами.

> [!important] Підсумок
> - Перед записом читай запитання й варіанти: так ти знаєш, що слухаєш (колія, час, ціна).
> - Виправлення (*nicht … sondern, eine Änderung*) важливіше за перше число.
> - У вокзальних і аеропортових оголошеннях час 24-годинний: *vierzehn Uhr dreißig*; уважно розрізняй *-zehn* і *-zig*.
> - Ключові слова: *Gleis, Ausgang, fällt aus, Verspätung, im Angebot, Grad, Sprechstunde, Signalton*.
> - Не розумієш слово — не зупиняйся: лови число і місце.
