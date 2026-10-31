---
title: Письмо — есе-аргумент, допис, офіційна скарга
id: de-b2-schreiben
level: B2
icon: px:mail
tags: [deutsch, b2, skills, schreiben, eroerterung, forum, beschwerde, goethe, telc, testdaf]
prerequisites: ["[[Deutsch - B1 - 27. Письмо — особистий і офіційний лист, допис на форумі]]", "[[Deutsch - B2 - 08. Конектори й підрядні — obwohl, indem, sodass, falls]]"]
estimatedMinutes: 50
---

# Письмо — есе-аргумент, допис, офіційна скарга

> [!success] Після цієї теми ти зможеш
> - назвати формат письмової частини **Goethe B2** (допис на форумі ≈ 150 слів і повідомлення ≈ 100 слів, 75 хв), **telc B2** (напівформальний email ≈ 150+ слів, 30 хв) і **TestDaF** (аргументативний текст ≥ 200 слів);
> - побудувати аргументативний текст: *Einleitung → Argumente (Pro / Kontra) → eigene Meinung → Fazit*;
> - написати напівформальну чи офіційну пошту (скаргу, прохання) у правильному регістрі й закрити змістові пункти завдання (Goethe — усі 4; telc — див. нижче);
> - використовувати звʼязки й готові звороти, щоб текст був *kohärent*, а не набором речень.

## Передбач

> [!quiz] Ти пишеш допис на форумі за темою «Автомобілі в центрі міста». Що найкраще почати?
> level: B2 · type: single · id: de-b2-schreiben-q01
> - [ ] Mit freundlichen Grüßen,
> - [ ] Sehr geehrte Damen und Herren,
> - [x] Immer mehr Städte diskutieren darüber, ob Autos im Zentrum verboten werden sollen.
> - [ ] Ich schreibe Ihnen, weil ich eine Beschwerde habe.
>
> **Пояснення:** допис на форумі — не лист: *Anrede* і *Grußformel* не потрібні. Починай із **вступу до теми** (*Einleitung*): відсилання до обговорення. *Sehr geehrte Damen und Herren* і *Ich schreibe Ihnen* належать до листа в установу, а *Mit freundlichen Grüßen* стоїть у кінці листа.

## Пояснення

### Що перевіряють на іспитах

На рівні B2 письмова частина — це **аргументація і ділова кореспонденція**. Формати різні, але вміння однакові: чітка структура, всі змістові пункти, правильний регістр, звʼязність.

| Іспит | Що пишеш | Обсяг | Час |
|---|---|---|---|
| **Goethe-Zertifikat B2** (Schreiben) | Teil 1: допис на форумі (*Forumsbeitrag*), 4 змістові пункти; Teil 2: повідомлення особі (напр. керівнику), 4 пункти | Teil 1 ≈ 150 слів, Teil 2 ≈ 100 слів | 75 хв разом (орієнтовний поділ часу 50 + 25 — наша порада, не офіційна вимога) |
| **telc Deutsch B2** (Schriftlicher Ausdruck) | напівформальний email у відповідь на оголошення (одне із двох завдань), 4 *Leitpunkte* (для оцінки достатньо 3 з 4 або 2 + власний аспект) | щонайменше ≈ 150 слів (за брошурою *Tipps*; на telc.net не вказано) | 30 хв |
| **TestDaF** (цифровий, Schreiben) | Aufgabe 1: аргументативний текст; Aufgabe 2: підсумок тексту й графіка | ≥ 200 слів; 100–150 слів | ≈ 60 хв разом, без повернення |

Goethe оцінює за чотирма критеріями: **Erfüllung** (виконано завдання), **Kohärenz** (звʼязність), **Wortschatz** (лексика), **Strukturen** (граматика). telc дивиться на *Berücksichtigung der Leitpunkte*, *kommunikative Gestaltung* і *formale Richtigkeit*. У Goethe пропущений пункт або навіть пів-пункту знижує оцінку за *Erfüllung*. У telc норма мʼякша: щонайменше **3 з 4** *Leitpunkte* або **2 + власний аспект** (за брошурою telc «Tipps für Teilnehmer»; точні формулювання перевір у *Handbuch*), але пропускати пункти без потреби не варто.

> [!note] Чесно про формат
> Формати оновлюються. Перед іспитом перевір актуальний *Modellsatz* на сайті Goethe-Institut або *Handbuch* telc (див. джерела). Ми пишемо власні завдання за тим самим принципом, а не копіюємо офіційні.

### Скелет аргументативного тексту

> [!diagram] Допис / есе: пʼять частин
> ```yaml
> layout: flow
> nodes:
>   - { id: e, label: "1. Einleitung", text: "тема + привід + твоя позиція", note: "1–2 речення", tone: yellow }
>   - { id: a, label: "2. Argumente", text: "теза → пояснення → приклад", note: "2–3 аргументи", tone: pink }
>   - { id: g, label: "3. Gegenposition", text: "allerdings … / man könnte einwenden …", note: "і твоя відповідь", tone: yellow }
>   - { id: m, label: "4. Eigene Meinung", text: "рішення або пропозиція", note: "Ich schlage vor …", tone: pink }
>   - { id: f, label: "5. Fazit", text: "підсумок одним реченням", note: "Zusammenfassend …", tone: gray }
> edges:
>   - { from: e, to: a }
>   - { from: a, to: g }
>   - { from: g, to: m }
>   - { from: m, to: f }
> steps:
>   - { focus: e, note: "Вступ: тема + чому це зараз обговорюють + коротко твоя позиція. Приклад: Immer mehr Städte diskutieren darüber, Autos aus dem Zentrum zu verbannen. Meiner Meinung nach ist das eine gute Idee." }
>   - { focus: a, note: "Аргумент = теза + пояснення + приклад: Zunächst wird die Luft sauberer. Das liegt daran, dass weniger Abgase entstehen. Zum Beispiel messen Städte nach Sperrungen oft bessere Werte." }
>   - { focus: g, note: "Покажи, що розумієш іншу сторону: Allerdings sind Handwerker auf Autos angewiesen. Потім відповідь: Hier wären Ausnahmen sinnvoll." }
>   - { focus: m, note: "Твоя пропозиція: Ich schlage vor, zuerst einzelne Straßen zu sperren. Це робить текст конструктивним." }
>   - { focus: f, note: "Одне речення підсумку: Zusammenfassend halte ich autofreie Zentren für sinnvoll, wenn es gute Alternativen gibt." }
> ```
> Жовті й рожеві блоки чергуються, сірий — підсумок; кожен блок має номер.

Кожен абзац-аргумент будуй за моделлю **теза — пояснення — приклад**:

| Крок | Приклад | Що дає |
|---|---|---|
| Теза | *Zunächst würde die Luft sauberer.* | головна думка |
| Пояснення | *Das liegt daran, dass weniger Abgase entstehen.* | чому |
| Приклад | *Zum Beispiel messen viele Städte nach Sperrungen bessere Luftwerte.* | доказ |

### Звʼязки й готові звороти

| Функція | Звороти |
|---|---|
| вступ | *Das Thema … wird kontrovers diskutiert. · Immer mehr Menschen … · Heutzutage …* |
| перелік | *Erstens … zweitens … · Zunächst … außerdem … · Ein weiterer Punkt ist …* |
| додаток | *außerdem · zudem · darüber hinaus* |
| контраст | *allerdings · jedoch · hingegen · demgegenüber · auf der einen Seite … auf der anderen Seite* |
| причина | *denn · weil · da · nämlich · Das liegt daran, dass …* |
| наслідок | *deshalb · daher · folglich · somit* |
| приклад | *zum Beispiel · beispielsweise · etwa* |
| підсумок | *Zusammenfassend lässt sich sagen … · Abschließend … · Insgesamt …* |

> [!tip] Інверсія після звʼязки
> Після *deshalb, daher, außerdem, zudem, folglich, somit, allerdings* дієслово стоїть **на другому місці**: *Deshalb **kann** ich nicht kommen.* Сполучники *denn, und, aber, oder, sondern* в позиції 0: *Ich bin müde, denn ich **habe** schlecht geschlafen.*

### Напівформальна й офіційна пошта

Повідомлення в Goethe Teil 2 і email в telc — **напівформальні**: ти пишеш керівникові, колезі, фірмі, службі. Регістр *Sie*, ввічливий тон, але без канцелярських зворотів. Структура:

1. **Betreff** (тема листа) і *Anrede*: *Sehr geehrte Frau Berger,* / *Sehr geehrte Damen und Herren,*;
2. **Anlass**: чому пишеш (одне речення);
3. **Hauptteil**: усі *Leitpunkte* по порядку, один абзац — один пункт;
4. **Bitte / Schluss**: чого очікуєш, до якого строку;
5. **Grußformel**: *Mit freundlichen Grüßen* (формально), *Viele Grüße* (напівформально, колеги) + імʼя.

Для скарги (*Beschwerde*) додай **чотири кроки**: що сталося (*Sachverhalt*) → чому це проблема → чого хочеш (*Forderung*) → до якого строку (*Frist*):

| Крок | Звороти |
|---|---|
| привід | *Ich schreibe Ihnen wegen … · Leider muss ich mich über … beschweren.* |
| факти | *Am 3. Mai habe ich … bestellt. · Das Gerät funktioniert seit dem ersten Tag nicht.* |
| ставлення | *Ich bin enttäuscht, dass … · Das ist für mich nicht akzeptabel.* |
| вимога | *Ich bitte Sie, mir den Betrag zu erstatten. · Ich erwarte eine Nachbesserung.* |
| строк | *Bitte antworten Sie mir bis zum 15. Mai. · Andernfalls … (Konsequenz)* |
| ввічливість | *Ich wäre Ihnen dankbar, wenn Sie … könnten. · Ich bedanke mich im Voraus.* |

### Зразок 1: допис на форумі (≈ 150 слів)

> [!example] Forumsbeitrag: Autofreie Innenstädte
> **Autofreie Innenstädte: eine gute Idee?**
>
> Immer mehr Städte diskutieren darüber, Autos aus dem Zentrum zu verbannen. Meiner Meinung nach ist das grundsätzlich eine gute Idee, wenn man sie mit Augenmaß umsetzt.
>
> Zunächst würden die Luft sauberer und der Lärm geringer. Zudem hätten Fußgänger und Radfahrer mehr Platz, sodass sich Kinder und ältere Menschen sicherer fühlen könnten. Außerdem deuten Erfahrungen aus anderen Städten darauf hin, dass Geschäfte in autofreien Zonen nicht automatisch weniger Kunden haben. Dazu kommt, dass der freie Straßenraum für Bäume, Bänke und Cafés genutzt werden könnte.
>
> Allerdings muss man auch die Gegenseite verstehen: Menschen mit Behinderung, Handwerker und Lieferdienste sind auf das Auto angewiesen. Hier wären Ausnahmen nötig.
>
> Als Lösung schlage ich vor, zuerst einzelne Straßen zu sperren und gleichzeitig Bus und Bahn zu verbessern. So können die Bürger die Veränderung ausprobieren.
>
> Zusammenfassend halte ich autofreie Zentren für sinnvoll, vorausgesetzt, es gibt gute Alternativen.

Завдання (приклад): напиши допис на форумі про автофрі зони в центрі міста: власна позиція, аргументи, контраргумент, пропозиція.

Розбір: вступ із позицією, чотири аргументи за (*zunächst, zudem, außerdem, dazu kommt*), контрпозиція (*allerdings*), пропозиція (*Ich schlage vor*), підсумок (*Zusammenfassend*). Усі пункти завдання закрито, текст розбито на абзаци.

### Зразок 2: повідомлення керівникові (≈ 100 слів)

> [!example] Nachricht an die Vorgesetzte
> **Betreff: Urlaubstag am 14. Mai**
>
> Sehr geehrte Frau Berger,
>
> ich möchte Sie bitten, mir am Freitag, dem 14. Mai, einen Urlaubstag zu genehmigen. An diesem Tag ziehe ich in eine neue Wohnung um und muss den Mietwagen schon am Vormittag abholen.
>
> Meine Aufgaben für diese Woche habe ich bereits geplant: Den Bericht für das Projekt Nord gebe ich bis Donnerstagabend ab, und Herr Kaya hat sich bereit erklärt, meine Anrufe zu übernehmen. Falls Sie vorab Fragen haben, bin ich bis Donnerstag jederzeit erreichbar.
>
> Ich wäre Ihnen dankbar, wenn Sie mir bis Mittwoch Bescheid geben könnten.
>
> Mit freundlichen Grüßen
> Oksana Kovalenko

Розбір: *Betreff*, *Anrede*, прохання в першому реченні (*Ich möchte Sie bitten*), Konjunktiv II (*Ich wäre Ihnen dankbar, wenn …*), строк (*bis Mittwoch*), *Grußformel* і імʼя.

### Перевірка перед здачею

1. **Leitpunkte**: кожен пункт має хоча б одне речення (Goethe — усі 4; telc — щонайменше 3 з 4 або 2 + власний аспект).
2. **Структура**: абзаци, початок і кінець.
3. **Регістр**: *Sie* / *du* не змішано; *Anrede* і *Gruß* відповідають адресату.
4. **Звʼязність**: хоча б 4–5 звʼязок із різними функціями.
5. **Граматика**: дієслово на другому місці після *deshalb*, в кінці після *weil, dass*; іменники з великої; коми перед *dass, weil, obwohl*.
6. **Обсяг**: близько заданого; суттєво менше — ризик для *Erfüllung*.

## Приклади

- *Immer mehr Menschen arbeiten von zu Hause aus.* — Дедалі більше людей працює вдома.
- ***Meiner Meinung nach** hat das Homeoffice mehr Vorteile als Nachteile.* — На мою думку, у віддаленої роботи більше переваг, ніж недоліків.
- ***Zunächst** spart man Zeit, **außerdem** sinken die Kosten.* — По-перше, заощаджується час, крім того, знижуються витрати.
- ***Allerdings** fehlt der persönliche Kontakt.* — Однак бракує особистого контакту.
- ***Zusammenfassend lässt sich sagen**, dass beides sinnvoll sein kann.* — Підсумовуючи, можна сказати, що обидва варіанти можуть бути доцільними.
- *Ich schreibe Ihnen **wegen** der falschen Rechnung.* — Пишу вам щодо помилкового рахунку.
- *Ich **bitte Sie**, mir den Betrag bis zum 15. Mai zu **erstatten**.* — Прошу повернути мені суму до 15 травня.
- *Ich **wäre Ihnen dankbar**, wenn Sie mir kurz antworten könnten.* — Я був би вдячний, якби ви коротко відповіли.
- *Falls Sie Fragen haben, **stehe ich** Ihnen gern **zur Verfügung**.* — Якщо у вас є питання, я до ваших послуг.
- ***Mit freundlichen Grüßen*** (без коми) + імʼя з нового рядка: *Oksana Kovalenko* — З повагою, Оксана Коваленко.

## Слова

### Аргументація

> [!word] die Erörterung
> ipa: /ɛɐ̯ˈʔœʁtəʁʊŋ/ · pos: noun · level: B2 · id: de-b2-schreiben-w01
> uk: розгляд; аргументативний текст
> forms: die Erörterungen
> example: In der **Erörterung** stellt man Pro und Kontra dar. — В аргументативному тексті викладають «за» і «проти».
> note: від erörtern (обговорювати). Тип тексту: Erörterung; на Goethe B2 — Forumsbeitrag, на TestDaF — argumentativer Text.

> [!word] der Einwand
> ipa: /ˈaɪ̯nvant/ · pos: noun · level: B2 · id: de-b2-schreiben-w02
> uk: заперечення; контраргумент
> forms: die Einwände
> example: Dagegen gibt es einen wichtigen **Einwand**. — Проти цього є важливе заперечення.
> note: einen Einwand erheben / haben. Дієслово einwenden вже має картку в курсі.

> [!word] entkräften
> ipa: /ɛntˈkʁɛftn̩/ · pos: verb · level: C1 · id: de-b2-schreiben-w03
> uk: спростувати (аргумент); послабити
> forms: entkräften → entkräftete → hat entkräftet
> example: Diese Zahlen **entkräften** das Argument. — Ці цифри послаблюють аргумент.
> note: ein Argument / einen Verdacht entkräften. Не про фізичну слабкість (entkräftet = знесилений).

> [!word] vertreten
> ipa: /fɛɐ̯ˈtʁeːtn̩/ · pos: verb · level: B2 · id: de-b2-schreiben-w04
> uk: відстоювати (думку); представляти; заміняти
> forms: vertreten → vertritt → vertrat → hat vertreten
> example: Ich **vertrete** die Meinung, dass Bildung kostenlos sein sollte. — Я вважаю, що освіта має бути безкоштовною.
> note: eine Meinung / einen Standpunkt vertreten. Інші значення: den Kollegen vertreten (заміняти), eine Firma vertreten.

> [!word] abwägen
> ipa: /ˈapvɛːɡn̩/ · pos: verb · level: B2 · id: de-b2-schreiben-w05
> uk: зважувати (за і проти)
> forms: abwägen → wog ab → hat abgewogen
> example: Man muss Vor- und Nachteile sorgfältig **abwägen**. — Треба ретельно зважити переваги й недоліки.
> note: er wägt ab. Нерегулярне: wog ab, abgewogen. Іменник die Abwägung.

> [!word] die Argumentation
> ipa: /aʁɡumɛntaˈtsi̯oːn/ · pos: noun · level: B2 · id: de-b2-schreiben-w06
> uk: аргументація
> forms: die Argumentationen
> example: Seine **Argumentation** war klar und logisch. — Його аргументація була чіткою і логічною.
> note: -tion = [tsi̯oːn], наголос на останньому складі. Дієслово argumentieren.

> [!word] argumentieren
> ipa: /aʁɡumɛnˈtiːʁən/ · pos: verb · level: B2 · id: de-b2-schreiben-w07
> uk: аргументувати
> forms: argumentieren → argumentierte → hat argumentiert
> example: Sie **argumentiert** sachlich und ruhig. — Вона аргументує по суті й спокійно.
> note: -ieren без ge- у Partizip II. mit etwas argumentieren — наводити як аргумент.

> [!word] plädieren
> ipa: /plɛˈdiːʁən/ · pos: verb · level: C1 · id: de-b2-schreiben-w08
> uk: виступати (за що-небудь)
> forms: plädieren → plädierte → hat plädiert
> example: Viele **plädieren** für kürzere Arbeitszeiten. — Багато хто виступає за коротший робочий день.
> note: plädieren für + Akk. Юридичне походження: від франц. *plaider* «виступати в суді»; пор. *das Plädoyer*. Синонім: sich einsetzen für.

> [!word] befürworten
> ipa: /bəˈfyːɐ̯vɔʁtn̩/ · pos: verb · level: B2 · id: de-b2-schreiben-w09
> uk: підтримувати; висловлюватися за
> forms: befürworten → befürwortete → hat befürwortet
> example: Die meisten Eltern **befürworten** längere Schultage. — Більшість батьків підтримують довші шкільні дні.
> note: + Akk. Протилежне: ablehnen. Іменник der Befürworter.

> [!word] der Befürworter
> ipa: /bəˈfyːɐ̯vɔʁtɐ/ · pos: noun · level: B2 · id: de-b2-schreiben-w10
> uk: прихильник; той, хто підтримує
> forms: die Befürworter
> example: Die **Befürworter** nennen mehrere Vorteile. — Прихильники називають кілька переваг.
> note: жінка: die Befürworterin, мн. die Befürworterinnen. Пара: der Gegner.

> [!word] der Gegner
> ipa: /ˈɡeːɡnɐ/ · pos: noun · level: B2 · id: de-b2-schreiben-w11
> uk: противник
> forms: die Gegner
> example: Die **Gegner** des Plans sehen Risiken für die Umwelt. — Противники плану бачать ризики для довкілля.
> note: жінка: die Gegnerin, мн. die Gegnerinnen. Пара: der Befürworter.

> [!word] das Gegenargument
> ipa: /ˈɡeːɡn̩ʔaʁɡumɛnt/ · pos: noun · level: B2 · id: de-b2-schreiben-w12
> uk: контраргумент
> forms: die Gegenargumente
> example: Ein wichtiges **Gegenargument** sind die hohen Kosten. — Важливий контраргумент — високі витрати.
> note: складене слово: gegen + das Argument; рід за останньою частиною (das).

> [!word] verdeutlichen
> ipa: /fɛɐ̯ˈdɔʏ̯tlɪçn̩/ · pos: verb · level: B2 · id: de-b2-schreiben-w13
> uk: пояснити наочно; підкреслити
> forms: verdeutlichen → verdeutlichte → hat verdeutlicht
> example: Ein Beispiel soll das **verdeutlichen**. — Приклад має це пояснити.
> note: ver- + deutlich. Синонім: veranschaulichen.

> [!word] der Beleg
> ipa: /bəˈleːk/ · pos: noun · level: B2 · id: de-b2-schreiben-w14
> uk: доказ; підтвердження; квитанція
> forms: die Belege
> example: Für diese Aussage gibt es keinen **Beleg**. — Для цього твердження немає доказів.
> note: g у кінці — [k]. Також чек у бухгалтерії. Дієслово belegen (картка в іншій темі).

> [!word] anführen
> ipa: /ˈanfyːʁən/ · pos: verb · level: B2 · id: de-b2-schreiben-w15
> uk: навести (аргумент, приклад)
> forms: anführen → führte an → hat angeführt
> example: Er **führt** mehrere Gründe **an**. — Він наводить кілька причин.
> note: відокремлюване. Argumente / Beispiele / Gründe anführen. Також: anführen = очолювати.

> [!word] differenziert
> ipa: /dɪfəʁɛnˈtsiːɐ̯t/ · pos: adj · level: C1 · id: de-b2-schreiben-w16
> uk: диференційований; з урахуванням нюансів
> forms: differenzierter · am differenziertesten
> example: Sie hat eine **differenzierte** Meinung zu dem Thema. — Вона має виважену думку з цього питання.
> note: eine differenzierte Betrachtung / Sichtweise. Протилежне: pauschal, einseitig.

> [!word] einseitig
> ipa: /ˈaɪ̯nzaɪ̯tɪç/ · pos: adj · level: B2 · id: de-b2-schreiben-w17
> uk: однобічний; упереджений
> forms: einseitiger · am einseitigsten
> example: Der Bericht ist sehr **einseitig**. — Звіт дуже однобічний.
> note: ein + Seite. Також: einseitig bedrucktes Papier (папір, надрукований з одного боку).

### Скарга, прохання, зворотний звʼязок

> [!word] der Leitpunkt
> ipa: /ˈlaɪ̯tpʊŋkt/ · pos: noun · level: B2 · id: de-b2-schreiben-w18
> uk: змістовий пункт (завдання)
> forms: die Leitpunkte
> example: Du musst alle vier **Leitpunkte** im Text berücksichtigen. — Ти маєш врахувати в тексті всі чотири змістові пункти.
> note: термін telc. У Goethe — Inhaltspunkt. Leit- + der Punkt.

> [!word] bemängeln
> ipa: /bəˈmɛŋl̩n/ · pos: verb · level: C1 · id: de-b2-schreiben-w19
> uk: критикувати (недолік); скаржитися (на)
> forms: bemängeln → bemängelte → hat bemängelt
> example: Die Kunden **bemängeln** die lange Lieferzeit. — Клієнти скаржаться на довгий строк доставки.
> note: + Akk. Формальне. Der Mangel → bemängeln. Синонім: beanstanden.

> [!word] beanstanden
> ipa: /bəˈʔanʃtandn̩/ · pos: verb · level: C1 · id: de-b2-schreiben-w20
> uk: заявити претензію; зробити зауваження
> forms: beanstanden → beanstandete → hat beanstandet
> example: Sie hat die Rechnung **beanstandet**. — Вона оскаржила рахунок.
> note: твердий приступ [ʔ] після префікса be- перед a-. Іменник die Beanstandung.

> [!word] erstatten
> ipa: /ɛɐ̯ˈʃtatn̩/ · pos: verb · level: C1 · id: de-b2-schreiben-w21
> uk: відшкодувати; повернути (кошти)
> forms: erstatten → erstattete → hat erstattet
> example: Die Firma **erstattet** die Kosten. — Фірма відшкодовує витрати.
> note: Kosten erstatten; Anzeige erstatten (подати заяву до поліції). Іменник die Erstattung.

> [!word] die Erstattung
> ipa: /ɛɐ̯ˈʃtatʊŋ/ · pos: noun · level: C1 · id: de-b2-schreiben-w22
> uk: відшкодування; повернення коштів
> forms: die Erstattungen
> example: Ich beantrage die **Erstattung** der Fahrtkosten. — Я прошу відшкодувати витрати на проїзд.
> note: -ung → die. Типово для Behörde та листів-скарг.

> [!word] die Entschädigung
> ipa: /ɛntˈʃɛːdɪɡʊŋ/ · pos: noun · level: C1 · id: de-b2-schreiben-w23
> uk: компенсація; відшкодування збитку
> forms: die Entschädigungen
> example: Bei Verspätung kann man eine **Entschädigung** verlangen. — При затримці можна вимагати компенсацію.
> note: від schaden / der Schaden. ä довге [ɛː]; -ig = [ɪç], але в -igung [ɪɡ]: Entschädigung.

> [!word] die Abhilfe
> ipa: /ˈaphɪlfə/ · pos: noun · level: C1 · id: de-b2-schreiben-w24
> uk: усунення проблеми; вихід
> forms: — (без множини)
> example: Wir bitten um sofortige **Abhilfe**. — Просимо негайно усунути проблему.
> note: Abhilfe schaffen / verlangen / fordern. Стійкі сполуки в листах-скаргах.

> [!word] das Entgegenkommen
> ipa: /ɛntˈɡeːɡn̩kɔmən/ · pos: noun · level: C1 · id: de-b2-schreiben-w25
> uk: готовність піти назустріч
> forms: — (без множини)
> example: Wir danken Ihnen für Ihr **Entgegenkommen**. — Дякуємо вам за вашу поступливість.
> note: від entgegenkommen. Формула ввічливості в листі.

> [!word] der Missstand
> ipa: /ˈmɪsʃtant/ · pos: noun · level: C1 · id: de-b2-schreiben-w26
> uk: недолік; безлад
> forms: die Missstände
> example: Der Mieter beschreibt mehrere **Missstände** im Haus. — Орендар описує кілька недоліків у будинку.
> note: miss + der Stand; пишеться з ss. Missstände beseitigen — усувати недоліки.

> [!word] nachbessern
> ipa: /ˈnaːxbɛsɐn/ · pos: verb · level: C1 · id: de-b2-schreiben-w27
> uk: доопрацювати; виправити недолік
> forms: nachbessern → besserte nach → hat nachgebessert
> example: Der Hersteller muss das Produkt **nachbessern**. — Виробник має доопрацювати продукт.
> note: відокремлюване. Іменник die Nachbesserung (у гарантійних справах: виправлення продавцем).

### Слова-звʼязки і формули

> [!word] demgegenüber
> ipa: /deːmɡeːɡn̩ˈʔyːbɐ/ · pos: adv · level: C1 · id: de-b2-schreiben-w28
> uk: натомість; на противагу цьому
> example: Viele sparen. **Demgegenüber** geben andere viel Geld aus. — Багато хто заощаджує. Натомість інші багато витрачають.
> note: інверсія після нього: Demgegenüber geben andere … Формальніше за dagegen.

> [!word] bedauerlicherweise
> ipa: /bəˈdaʊ̯ɐlɪçɐvaɪ̯zə/ · pos: adv · level: C1 · id: de-b2-schreiben-w29
> uk: на жаль
> example: **Bedauerlicherweise** kam das Paket beschädigt an. — На жаль, пакунок прийшов пошкодженим.
> note: формальніше, ніж leider. Інверсія: Bedauerlicherweise kam … Дієслово bedauern.

> [!word] gegebenenfalls
> ipa: /ɡəˈɡeːbənənfals/ · pos: adv · level: C1 · id: de-b2-schreiben-w30
> uk: у разі потреби; за необхідності
> example: Bitte bringen Sie **gegebenenfalls** weitere Unterlagen mit. — За потреби візьміть додаткові документи.
> note: скорочення ggf. Не плутай з eventuell («можливо»).

> [!word] diesbezüglich
> ipa: /ˈdiːsbətsyːklɪç/ · pos: adj · level: C1 · id: de-b2-schreiben-w31
> uk: стосовно цього
> example: Haben Sie **diesbezüglich** noch Fragen? — Чи є у вас ще питання з цього приводу?
> note: офіційний стиль. Розмовно: dazu. Прийменник in Bezug auf — «щодо».

## Слухаємо

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-schreiben-l01
> audio: Ich bitte Sie, mir den Betrag bis zum fünfzehnten Mai zu erstatten.

> [!listen] Оксана консультується з вчителькою щодо тексту. Що радить вчителька?
> level: B2 · type: answer · id: de-b2-schreiben-l02
> audio: A: Frau Lehmann, ich habe meinen Forumsbeitrag geschrieben. Ist er gut?
> audio: B: Die Argumente sind gut. Aber Sie haben keine Gegenposition. Fügen Sie ein „allerdings“ ein.
> audio: A: Und der Schluss?
> audio: B: Ein Satz reicht, zum Beispiel „Zusammenfassend halte ich das für sinnvoll“. Und zählen Sie die Wörter.
> - [x] Додати контрпозицію (allerdings) і короткий підсумок, порахувати слова.
> - [ ] Прибрати всі аргументи й залишити лише висновок.
> - [ ] Написати текст у формі листа з Anrede.
> - [ ] Додати ще одну сторінку.
>
> **Пояснення:** не вистачає *Gegenposition*, потрібен короткий підсумок (*Zusammenfassend*), а ще — порахувати слова. Переклад: — Пані Леман, я написала допис на форум. Він добрий? — Аргументи добрі. Але немає контрпозиції. Додайте «allerdings». — А кінцівка? — Одного речення досить, наприклад «Підсумовуючи, я вважаю це доцільним». І порахуйте слова.

## Вимова

> [!speak] Скажи вголос
> level: B2 · id: de-b2-schreiben-s01
> text: Zusammenfassend lässt sich sagen, dass beides sinnvoll sein kann.
> ipa: /tsuˈzamənˌfasn̩t lɛst zɪç ˈzaːɡn̩ das ˈbaɪ̯dəs ˈzɪnfɔl zaɪ̯n kan/
> tip: Zusammenfassend — наголос на -sam- (довгі слова вчи по частинах); lässt — ä коротке [ɛ]; sinnvoll — v тут [f].
> uk: Підсумовуючи, можна сказати, що обидва варіанти можуть бути доцільними.

> [!speak] Ситуація: попросити про строк
> level: B2 · id: de-b2-schreiben-s02
> text: Ich wäre Ihnen dankbar, wenn Sie mir bis Mittwoch Bescheid geben könnten.
> ipa: /ɪç ˈvɛːʁə ˈiːnən ˈdaŋkbaːɐ̯ vɛn ziː miːɐ̯ bɪs ˈmɪtvɔx bəˈʃaɪ̯t ˈɡeːbn̩ ˈkœntn̩/
> tip: wäre — ä довге [ɛː]; könnten — ö [œ] коротке, -ten [tn̩]. Mittwoch: i коротке [ɪ] перед tt, -woch [vɔx].
> uk: Я був би вам вдячний, якби ви дали мені знати до середи.

## Типові помилки українців

> [!pitfall] Дієслово не на другому місці після звʼязки
> ~~Deshalb ich kann nicht kommen~~ → Deshalb **kann ich** nicht kommen; ~~Allerdings man muss das verstehen~~ → Allerdings **muss man** das verstehen; ~~Außerdem ich möchte ergänzen~~ → Außerdem **möchte ich** ergänzen. *Deshalb, daher, außerdem, zudem, folglich, allerdings* займають першу позицію, тож дієслово — друге. Лише *und, aber, denn, oder, sondern* не рахуються.

> [!pitfall] Не закриті всі змістові пункти
> Типова втрата балів: пропущено одну з чотирьох вимог (*Leitpunkte*) або їх лише згадано одним словом. Підкресли в завданні кожен пункт і напиши щонайменше одне повне речення про кожен. У Goethe B2 пропущений пункт знижує оцінку за *Erfüllung*. У telc B2 потрібно щонайменше 3 з 4 *Leitpunkte* або 2 + власний аспект (за брошурою telc «Tipps für Teilnehmer»; точніше — в офіційному *Handbuch*), але надійніше закрити всі чотири.

> [!pitfall] Змішаний регістр
> *Hallo Frau Berger, ich möchte Sie bitten, … Tschüss!* звучить неприродно в листі керівникові: привітання й прощання неформальні, а решта тексту — *Sie*. Краще: **Sehr geehrte Frau Berger, ich möchte Sie bitten, … Mit freundlichen Grüßen**. Обирай один регістр на весь текст. До керівника й фірми — *Sie* і *Mit freundlichen Grüßen* (або *Viele Grüße* у напівформальному листі).

> [!pitfall] Кальки з української у зворотах
> ~~Auf meine Meinung~~ → **Meiner Meinung nach** / **Ich bin der Meinung, dass …**; ~~Mit respekt~~ → **Mit freundlichen Grüßen**; ~~Auf einer Seite … auf anderer Seite~~ → **Einerseits … andererseits** / **Auf der einen Seite … auf der anderen Seite**. Перед *dass* завжди кома.

## Ситуація: консультація щодо скарги

> [!listen] Оксана розповідає колезі про скаргу на інтернет-магазин. Що вона збирається зробити?
> level: B2 · type: answer · id: de-b2-schreiben-l03
> audio: A: Mein Paket ist beschädigt angekommen. Ich schreibe eine Beschwerde.
> audio: B: Gute Idee. Beschreibe, was passiert ist, und nenne eine Frist.
> audio: A: Ich verlange eine Erstattung und bitte um Antwort bis zum zwanzigsten Mai.
> audio: B: Und sei sachlich. So hast du bessere Chancen.
> - [x] Описати проблему, вимагати відшкодування й назвати строк до 20 травня.
> - [ ] Лише висловити невдоволення.
> - [ ] Подзвонити замість писати.
> - [ ] Повернути товар без пояснень.
>
> **Пояснення:** порада: описати проблему (*beschreibe, was passiert ist*), назвати строк (*Frist*) і писати спокійно (*sachlich*). Оксана вимагає *Erstattung* до 20 травня. Переклад: — Мій пакунок прийшов пошкодженим. Я пишу скаргу. — Гарна ідея. Опиши, що сталося, і назви строк. — Я вимагаю відшкодування й прошу відповісти до двадцятого травня. — І будь по суті. Так у тебе більше шансів.

> [!speak] Ситуація: вимагати відшкодування
> level: B2 · id: de-b2-schreiben-s03
> text: Ich bitte Sie, mir den Betrag zu erstatten.
> ipa: /ɪç ˈbɪtə ziː miːɐ̯ deːn bəˈtʁaːk tsuː ɛɐ̯ˈʃtatn̩/
> tip: Betrag — g у кінці [k]; erstatten — наголос на -stat-, st = [ʃt]. bitte — коротке [ɪ].
> uk: Прошу відшкодувати мені суму.

## Landeskunde: Beschwerden schreiben, aber richtig

> [!example] Verbraucherzentrale und Musterbriefe
> In Deutschland ist es üblich, sich bei Problemen schriftlich zu beschweren. Wer ein defektes Produkt gekauft hat oder mit einer Rechnung nicht einverstanden ist, schreibt dem Unternehmen eine Beschwerde. Wichtig ist, dass der Brief sachlich und genau ist: Man nennt das Datum des Kaufs, beschreibt das Problem, sagt, was man erwartet, und setzt eine Frist. Eine Kopie des Briefes und alle Belege sollte man aufbewahren, denn sie können später als Beweis dienen. Wer unsicher ist, kann sich an die Verbraucherzentrale wenden. In jedem der sechzehn Bundesländer gibt es solche Beratungsstellen, und man kann sich online, telefonisch oder persönlich vor Ort beraten lassen. Auf der Webseite finden Verbraucher auch Musterbriefe für typische Fälle, zum Beispiel für Reklamationen, Widerrufe oder Kündigungen. Diese Briefe sind ein guter Ausgangspunkt, aber man muss sie an die eigene Situation anpassen. Für das Deutschlernen sind solche Musterbriefe ebenfalls nützlich: Sie zeigen den typischen Ton, die Formeln und die Struktur. Auch am Arbeitsplatz gelten diese Regeln: Eine E-Mail an die Vorgesetzte beginnt meist mit „Sehr geehrte Frau …“ oder, wenn man sich besser kennt, mit „Guten Tag, Frau …“. Wichtig ist immer ein klarer Betreff. Wer die Musterbriefe liest, versteht schneller, warum ein Brief mit „Sehr geehrte Damen und Herren“ beginnt, mit „Mit freundlichen Grüßen“ endet und eine klare Forderung enthält.

> [!quiz] Nach dem Text: Was sollte in einer Beschwerde stehen?
> level: B2 · type: single · id: de-b2-schreiben-q02
> - [ ] nur eine Drohung mit dem Anwalt
> - [x] Datum, Problem, Erwartung und eine Frist
> - [ ] ein Foto der Familie
> - [ ] möglichst viele emotionale Sätze
>
> **Пояснення:** у тексті: *Man nennt das Datum des Kaufs, beschreibt das Problem, sagt, was man erwartet, und setzt eine Frist.*

> [!quiz] Nach dem Text: Was bieten die Verbraucherzentralen an?
> level: B2 · type: multi · id: de-b2-schreiben-q03
> - [x] Beratung online, telefonisch oder vor Ort
> - [x] Musterbriefe für typische Fälle
> - [ ] kostenlose Waren für Kunden
> - [ ] eine einzige Beratungsstelle für ganz Deutschland
>
> **Пояснення:** *online, telefonisch oder persönlich vor Ort*; *Musterbriefe*. Вони є в усіх шістнадцяти землях, а не в одному місті; товарів не роздають.

> [!quiz] Nach dem Text: Wozu sind Musterbriefe auch nützlich?
> level: B2 · type: single · id: de-b2-schreiben-q04
> - [ ] als Ersatz für jede Beschwerde
> - [x] als Beispiel für Ton, Formeln und Struktur
> - [ ] als Werbung
> - [ ] als Rechnung
>
> **Пояснення:** *Sie zeigen den typischen Ton, die Formeln und die Struktur.* Їх треба адаптувати до своєї ситуації, а не копіювати без змін.

## Практика

> [!quiz] Що правда про письмову частину Goethe-Zertifikat B2? Обери всі.
> level: B2 · type: multi · id: de-b2-schreiben-q05
> - [x] Усе Schreiben триває 75 хвилин.
> - [x] У Teil 1 треба написати допис на форумі приблизно на 150 слів.
> - [x] У Teil 2 пишуть повідомлення приблизно на 100 слів.
> - [ ] Teil 2 — формальний лист на 200 слів.
> - [ ] Письмо триває 30 хвилин.
>
> **Пояснення:** за офіційним *Modellsatz*: Schreiben 75 хв, Teil 1 *Forumsbeitrag* ≈ 150 слів (поради: 50 хв), Teil 2 *Nachricht* ≈ 100 слів (25 хв). 30 хвилин — це час письма в *telc* B2.

> [!quiz] Що правда про telc Deutsch B2 Schriftlicher Ausdruck?
> level: B2 · type: single · id: de-b2-schreiben-q06
> - [ ] Два тексти по 100 слів за 75 хвилин.
> - [x] Один напівформальний email, приблизно 150 слів або більше, 30 хвилин.
> - [ ] Есе на 200 слів без *Leitpunkte*.
> - [ ] Лише заповнення бланка.
>
> **Пояснення:** telc B2: одне завдання (з двох на вибір), *halbformelle E-Mail* на оголошення, 4 *Leitpunkte* (достатньо 3 з 4 або 2 + власний аспект), щонайменше ≈ 150 слів, 30 хв (за брошурою *Tipps* і *Handbuch*; обсяг на telc.net не вказано).

> [!quiz] Яка послідовність частин правильна для допису на форумі?
> level: B2 · type: order · id: de-b2-schreiben-q07
>
> ```text order
> Einleitung mit eigener Position
> Argument mit Beispiel
> Gegenposition (Allerdings …)
> Eigener Vorschlag
> Fazit (Zusammenfassend …)
> Anrede ✗
> ```
>
> **Пояснення:** вступ → аргумент → контрпозиція → пропозиція → підсумок. *Anrede* (звертання) у допис на форумі не потрібне.

> [!quiz] Яке речення правильне?
> level: B2 · type: single · id: de-b2-schreiben-q08
> - [ ] Deshalb ich möchte Ihnen schreiben.
> - [x] Deshalb möchte ich Ihnen schreiben.
> - [ ] Deshalb möchte Ihnen ich schreiben.
> - [ ] Deshalb, ich möchte schreiben Ihnen.
>
> **Пояснення:** *Deshalb* займає першу позицію, тому дієслово *möchte* — друге, підмет *ich* — після нього. Додаток *Ihnen* ставимо після підмета.

> [!quiz] Заповни пропуски: звʼязки
> level: B2 · type: fill · id: de-b2-schreiben-q09
>
> ```text fill
> Die Stadt wird sauberer. [[Außerdem|Zudem|Zusätzlich|Ferner]] sinkt der Lärm.
> Autos sind praktisch. [[Allerdings|Jedoch|Trotzdem]] verursachen sie viel Verkehr.
> Das Wetter war schlecht. [[Deshalb|Daher|Darum|Deswegen]] sind wir zu Hause geblieben.
> [[Zusammenfassend]] lässt sich sagen, dass die Idee sinnvoll ist.
> ```
>
> **Пояснення:** *außerdem / zudem* додають, *allerdings / jedoch* протиставляють, *deshalb / daher* показують наслідок, *zusammenfassend* підсумовує. Усі потребують дієслова на другому місці.

> [!quiz] Заповни пропуски: скарга
> level: B2 · type: fill · id: de-b2-schreiben-q10
>
> ```text fill
> Sehr [[geehrte]] Damen und Herren,
> ich [[schreibe]] Ihnen wegen eines defekten Geräts.
> Ich bitte Sie, mir den Betrag bis zum 15. Mai zu [[erstatten|überweisen|zurückzahlen]].
> Ich wäre Ihnen [[dankbar]], wenn Sie mir bald antworten könnten.
> Mit freundlichen [[Grüßen]]
> ```
>
> **Пояснення:** *Sehr geehrte Damen und Herren*; *Ich schreibe Ihnen wegen …*; *erstatten / überweisen / zurückzahlen* (повернути суму); *Ich wäre Ihnen dankbar, wenn …*; *Mit freundlichen Grüßen*.

> [!quiz] Склади речення: «Я був би вам вдячний, якби ви відповіли до середи.»
> level: B2 · type: order · id: de-b2-schreiben-q11
>
> ```text order
> Ich wäre Ihnen dankbar,
> wenn Sie mir
> bis Mittwoch
> antworten könnten.
> würde ✗
> ```
>
> **Пояснення:** *Ich wäre Ihnen dankbar, wenn …* — стандартна ввічлива формула з Konjunktiv II. У підрядному реченні *könnten* стоїть в кінці; *würde* тут зайве (*wenn Sie würden antworten* — неправильний порядок).

> [!quiz] Яка Anrede правильна для листа до пані Weber, якої ти не знаєш особисто?
> level: B2 · type: single · id: de-b2-schreiben-q12
> - [ ] Hallo Frau Weber,
> - [x] Sehr geehrte Frau Weber,
> - [ ] Lieber Frau Weber,
> - [ ] Sehr geehrter Frau Weber,
>
> **Пояснення:** *Frau* — жіночий рід, тому *Sehr geehrte*. *Hallo* занадто неформальне, *Lieber* — чоловічий рід, *Sehr geehrter* — для *Herr*.

> [!quiz] Який аргумент сильніший?
> level: B2 · type: single · id: de-b2-schreiben-q13
> - [ ] Autos sind schlecht.
> - [x] Zunächst belasten Autos die Luft, denn Abgase schaden der Gesundheit; zum Beispiel leiden Kinder in Städten oft unter Atemproblemen.
> - [ ] Alle wissen, dass Autos schlecht sind.
> - [ ] Ich mag keine Autos.
>
> **Пояснення:** сильний аргумент має **тезу** (*Autos belasten die Luft*), **пояснення** (*denn Abgase schaden …*) і **приклад** (*zum Beispiel …*). Інші варіанти — лише твердження без обґрунтування.

> [!quiz] Що правда про TestDaF (цифровий) Schreiben? Обери всі.
> level: B2 · type: multi · id: de-b2-schreiben-q14
> - [x] Aufgabe 1 — аргументативний текст, мінімум 200 слів.
> - [x] Aufgabe 2 — підсумок тексту й графіка, ≈ 100–150 слів.
> - [x] До попередньої задачі повернутися не можна.
> - [ ] Обидві задачі — листи до установи.
>
> **Пояснення:** за *testdaf.de*: Schreiben ≈ 60 хв, 2 типи задач у фіксованому порядку, повернення назад немає. Листів до установи там немає.

## Фішки

> [!reel] ⏱ Скільки слів у 75 хвилин
> У Goethe B2 на Teil 1 радять ≈ 50 хвилин (≈ 150 слів), на Teil 2 ≈ 25 хвилин (≈ 100 слів). Це лише близько трьох слів на хвилину, тож час лишається на план і перевірку. Пиши коротко, але повно: краще закрити всі пункти й перечитати текст, ніж писати довго без плану.

> [!reel] 📮 «Sehr geehrte Damen und Herren»
> Це «шановні пані та панове». Німці пишуть так, коли не знають адресата. Якщо ж імʼя відоме, пиши *Sehr geehrte Frau …* / *Sehr geehrter Herr …*.

> [!reel] 🧱 Теза — Пояснення — Приклад
> Типова схема в навчанні письма: кожен абзац-аргумент має три кроки — теза, пояснення, приклад. Якщо в абзаці лише теза, він «висить у повітрі».

## Джерела та що почитати

- [Goethe-Zertifikat B2 — Modellsatz: Schreiben](https://bfu.goethe.de/b2_mod_2MX6/schreiben.php): офіційний зразок двох завдань.
- [Goethe-Zertifikat B2 — Modellsatz, Erwachsene (PDF)](https://www.goethe.de/pro/relaunch/prf/materialien/B2/b2_modellsatz_erwachsene.pdf): повний тренувальний комплект.
- [Goethe-Zertifikat B2 — Durchführungsbestimmungen (PDF)](https://www.goethe.de/pro/relaunch/prf/en/Durchfuehrungsbestimmungen_B2.pdf): час модулів (Lesen 65, Hören ≈ 40, Schreiben 75 хв).
- [telc Deutsch B2 — Handbuch (PDF)](https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_B2_Handbuch.pdf): Schriftlicher Ausdruck, критерії.
- [telc Deutsch B2 — огляд іспиту](https://www.telc.net/en/language-examinations/certificate-exams/german/telc-german-b2/): час частин.
- [TestDaF — Aufbau des digitalen TestDaF](https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/aufbau-des-digitalen-testdaf/): Schreiben, обсяг і час.
- [Verbraucherzentrale — Musterbriefe та Beratung](https://www.verbraucherzentrale.de/musterbriefe): шаблони скарг і поради.
- [DWDS — Erörterung](https://www.dwds.de/wb/Er%C3%B6rterung): значення, колокації.

> [!important] Підсумок
> - **Формат:** Goethe B2 Schreiben — 75 хв: допис на форумі ≈ 150 слів і повідомлення ≈ 100 слів; telc B2 — один напівформальний email ≈ 150+ слів за 30 хв (3 з 4 *Leitpunkte* або 2 + власний аспект); TestDaF — аргументативний текст ≥ 200 слів і підсумок графіка.
> - **Скелет:** Einleitung → аргументи (теза — пояснення — приклад) → Gegenposition → власна пропозиція → Fazit.
> - **Звʼязки:** *zunächst, außerdem, zudem, allerdings, deshalb, zusammenfassend*; після них дієслово на другому місці.
> - **Пошта:** *Betreff, Anrede, Anlass, Leitpunkte, Bitte + Frist, Grußformel*; ввічливо: *Ich wäre Ihnen dankbar, wenn …*.
> - **Перевір:** усі *Leitpunkte*, один регістр, звʼязність, обсяг.
