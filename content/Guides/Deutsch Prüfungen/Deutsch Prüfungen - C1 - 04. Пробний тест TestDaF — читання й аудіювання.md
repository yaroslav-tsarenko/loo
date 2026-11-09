---
title: Пробний тест TestDaF — читання й аудіювання
id: dp-c1-04
level: C1
icon: px:hourglass
tags: [deutsch, exam, skills, c1, testdaf, mock]
prerequisites: ["[[Deutsch Prüfungen - C1 - 01. TestDaF — чотири частини й TDN 3–5]]"]
estimatedMinutes: 75
---

# Пробний тест TestDaF — читання й аудіювання

> [!success] Після цієї теми ти зможеш
> - пройти скорочений пробний тест у форматі цифрового TestDaF: усі **7 типів завдань Lesen** і всі **7 типів Hören**;
> - порахувати свої бали й **орієнтовно** перевести їх у TDN 3 / 4 / 5 за шкалою 0–20;
> - побачити, на якому типі завдань ти втрачаєш найбільше, і знати, що з цим робити;
> - розпізнавати дистрактори: «відлуння» слів тексту, перебільшення, «логічний» домисел.

## Передбач

> [!quiz] У справжньому цифровому TestDaF Lesen — 34 items приблизно за 55 хвилин. Скільки часу в середньому припадає на один item?
> level: C1 · type: single · id: dp-c1-04-q01
> - [ ] близько 30 секунд
> - [x] трохи більше ніж півтори хвилини
> - [ ] близько 3 хвилин
> - [ ] 5 хвилин
>
> **Пояснення:** 55 : 34 ≈ 1,6 хвилини, разом із читанням текстів. Тому довгий текст читаєш **під питання**, а не «спершу весь уважно». У цьому пробному тесті темп той самий: орієнтовно 30 хвилин на 18 завдань Lesen.

## Як проходити цей тест

Тест **скорочений і власний**: тексти й завдання написано для цього курсу на теми, яких більше ніде в курсі немає. Формат завдань — як у цифровому TestDaF (testdaf.de, станом на листопад 2026). Що й навіщо в кожному типі завдань, розібрано в [[Deutsch Prüfungen - C1 - 01. TestDaF — чотири частини й TDN 3–5]].

**Правила, як на іспиті:**

1. **Lesen** — 18 завдань, **≈ 30 хвилин**. Засічи час.
2. **Hören** — 20 блоків, **≈ 25 хвилин**. Кожен запис слухай **один раз**. Нотуй на папері.
3. **Не повертайся назад.** У справжньому тесті до попереднього завдання не повернешся, тож і тут не повертайся.
4. **Без словника й перекладача**: у TestDaF допоміжних засобів немає.
5. **Рахуй бали:** кожне завдання Lesen і кожен блок Hören — **1 бал**. Блок із пропусками зараховуй, якщо **всі** пропуски правильні: так ти тренуєш точність коротких відповідей.

> [!diagram] Пробний тест: від старту до орієнтовного TDN
> ```yaml
> layout: flow
> nodes:
>   - { id: lesen, label: "Lesen", text: "18 завдань · ≈ 30 хв", note: "7 типів, без повернення назад", tone: yellow }
>   - { id: hoeren, label: "Hören", text: "20 блоків · ≈ 25 хв", note: "кожен запис один раз", tone: yellow }
>   - { id: score, label: "бали", text: "L з 18 · H з 20", note: "1 бал за завдання / блок", tone: gray }
>   - { id: scale, label: "шкала", text: "≈ 0–20", note: "Lesen × 20 : 18; Hören = як є", tone: pink }
>   - { id: tdn, label: "орієнтовно", text: "TDN 3 · 4 · 5", note: "± один рівень", tone: gray }
> edges:
>   - { from: lesen, to: hoeren }
>   - { from: hoeren, to: score }
>   - { from: score, to: scale }
>   - { from: scale, to: tdn }
> steps:
>   - { focus: lesen, note: "Lesen: 18 завдань усіх семи типів. Темп — близько 1,6 хвилини на завдання, як у справжньому тесті." }
>   - { focus: hoeren, note: "Hören: 20 коротких блоків. Слухай один раз і одразу відповідай. Відео тут замінює аудіо з названими мовцями." }
>   - { move: { from: hoeren, to: score, value: "L = 13, H = 15" }, note: "Порахуй правильні відповіді окремо для Lesen і Hören." }
>   - { move: { from: score, to: scale, value: "13 × 20 : 18 ≈ 14" }, note: "Переведи на шкалу 0–20. У Hören 20 блоків, тож бал уже на шкалі." }
>   - { move: { from: scale, to: tdn, value: "14 → TDN 4" }, note: "Межі як на testdaf.de: 5–9 — TDN 3, 10–15 — TDN 4, 16–20 — TDN 5. Це орієнтир, а не прогноз: справжня шкала статистична." }
> ```
> Жовтий — частини тесту, сірий — твої результати, рожевий — перерахунок. Таблиця переведення — після Hören.

## Слова

> [!word] zutreffen
> ipa: /ˈtsuːtʁɛfn̩/ · pos: verb · level: B2 · id: dp-c1-04-w01
> uk: відповідати дійсності; стосуватися (когось / чогось)
> forms: zutreffen → traf zu → hat zugetroffen
> example: Auf welchen Dämmstoff **trifft** die Aussage **zu**? — Якого утеплювача стосується це твердження?
> note: Präsens: es trifft zu. zutreffen auf + Akk. Прикметник: zutreffend — «правильний» (Zutreffendes bitte ankreuzen).

> [!word] die Bearbeitungszeit
> ipa: /bəˈʔaʁbaɪ̯tʊŋsˌtsaɪ̯t/ · pos: noun · level: C1 · id: dp-c1-04-w02
> uk: час на виконання (завдання)
> forms: die Bearbeitungszeiten
> example: Die **Bearbeitungszeit** für den Teil Lesen beträgt etwa 55 Minuten. — Час на виконання Lesen — близько 55 хвилин.
> note: bearbeiten — «опрацьовувати, виконувати»; ʔ після префікса be- перед голосним.

> [!word] der Distraktor
> ipa: /dɪsˈtʁaktoːɐ̯/ · pos: noun · level: C1 · id: dp-c1-04-w03
> uk: дистрактор (неправильний варіант, що відволікає)
> forms: die Distraktoren
> example: Der **Distraktor** wiederholt oft Wörter aus dem Text. — Дистрактор часто повторює слова з тексту.
> note: множина з перенесенням наголосу: Distrakˈtoren. Від лат. distrahere — «розтягувати, відволікати».

> [!word] das Signalwort
> ipa: /zɪˈɡnaːlˌvɔʁt/ · pos: noun · level: C1 · id: dp-c1-04-w04
> uk: сигнальне слово (що підказує логіку тексту)
> forms: die Signalwörter
> example: «Allerdings» ist ein **Signalwort** für eine Einschränkung. — «Allerdings» — сигнальне слово обмеження.
> note: das Signal — наголос на -gnal, g і n вимовляються окремо: [zɪˈɡnaːl].

> [!word] der Testsatz
> ipa: /ˈtɛstzats/ · pos: noun · level: C1 · id: dp-c1-04-w05
> uk: варіант тесту (комплект завдань)
> forms: die Testsätze
> example: Alle **Testsätze** werden in ihrer Schwierigkeit angeglichen. — Складність усіх варіантів тесту вирівнюють.
> note: der Satz тут не «речення», а «комплект»; пор. der Modellsatz.

> [!word] der Lesetext
> ipa: /ˈleːzəˌtɛkst/ · pos: noun · level: B2 · id: dp-c1-04-w06
> uk: текст для читання
> forms: die Lesetexte
> example: Lesen Sie zuerst die Aufgabe und dann den **Lesetext**. — Спершу прочитайте завдання, потім текст.
> note: пара: der Hörtext. s між голосними дзвінке [z].

> [!word] hochrechnen
> ipa: /ˈhoːxʁɛçnən/ · pos: verb · level: C1 · id: dp-c1-04-w07
> uk: екстраполювати; приблизно перераховувати на ціле
> forms: hochrechnen → rechnete hoch → hat hochgerechnet
> example: Wir **rechnen** Ihr Ergebnis auf die Skala von 0 bis 20 **hoch**. — Ми приблизно перераховуємо ваш результат на шкалу від 0 до 20.
> note: іменник: die Hochrechnung — так у Німеччині називають і прогноз результатів у вечір виборів.

> [!word] der Richtwert
> ipa: /ˈʁɪçtveːɐ̯t/ · pos: noun · level: C1 · id: dp-c1-04-w08
> uk: орієнтовне значення; орієнтир
> forms: die Richtwerte
> example: Die Tabelle liefert nur einen **Richtwert**. — Таблиця дає лише орієнтир.
> note: richten — «спрямовувати»; ch після i — мʼяке [ç].

> [!word] die Selbsteinschätzung
> ipa: /ˈzɛlpstʔaɪ̯nˌʃɛtsʊŋ/ · pos: noun · level: C1 · id: dp-c1-04-w09
> uk: самооцінка (власна оцінка свого рівня)
> forms: die Selbsteinschätzungen
> example: Ein Probetest ist ein gutes Mittel zur **Selbsteinschätzung**. — Пробний тест — гарний засіб самооцінки.
> note: selbst — кінцеве b у selb- = [p]; einschätzen — «оцінювати».

> [!word] der Dämmstoff
> ipa: /ˈdɛmʃtɔf/ · pos: noun · level: C1 · id: dp-c1-04-w10
> uk: утеплювач; теплоізоляційний матеріал
> forms: die Dämmstoffe
> example: Mineralwolle ist ein verbreiteter **Dämmstoff**. — Мінеральна вата — поширений утеплювач.
> note: dämmen — «утеплювати, ізолювати»; не плутай з der Damm (гребля, дамба).

## Teil A: Lesen (≈ 30 Minuten)

### Lesetext 1

> [!example] Rohstoffe aus der Tiefe
> In mehreren tausend Metern Tiefe liegen auf dem Meeresboden kartoffelgroße Klumpen, sogenannte Manganknollen. Sie enthalten neben Mangan auch Nickel, Kobalt und Kupfer – Metalle, die etwa für Batterien gebraucht werden. Seit Jahren wird deshalb diskutiert, ob man sie in großem Stil abbauen soll.
>
> Befürworter verweisen auf den wachsenden Bedarf. Wer Elektroautos und Speicher für Wind- und Solarstrom wolle, so ihr Argument, brauche mehr Metalle, als an Land umweltverträglich gefördert werden könnten. Zwar räumen auch sie ein, dass der Abbau Spuren hinterlässt. Diese seien aber, verglichen mit Tagebauen an Land, räumlich begrenzt.
>
> Meeresbiologinnen und -biologen halten dagegen, dass die Tiefsee zu den am wenigsten erforschten Lebensräumen der Erde gehört. Viele der dort lebenden Arten sind noch gar nicht beschrieben. Hinzu kommt, dass die Knollen selbst Lebensraum sind: Manche Tiere heften sich an sie. Werden sie entfernt, verschwindet dieser Lebensraum für sehr lange Zeit, denn die Knollen wachsen äußerst langsam – Schätzungen sprechen von wenigen Millimetern in einer Million Jahren.
>
> Ein weiteres Problem sind die Sedimentwolken, die beim Abbau aufgewirbelt werden. Sie können sich über große Flächen verteilen und Organismen weit außerhalb des eigentlichen Abbaugebiets beeinträchtigen. Wie weit genau, lässt sich bislang nur abschätzen.
>
> Über den Abbau in internationalen Gewässern entscheidet die Internationale Meeresbodenbehörde. Ihre Mitgliedstaaten ringen seit Langem um ein verbindliches Regelwerk. Einige Staaten fordern eine vorsorgliche Pause, bis die Folgen besser verstanden sind; andere drängen auf einen baldigen Start.
>
> Bemerkenswert ist, dass auch Teile der Industrie zögern. Mehrere Unternehmen haben erklärt, vorerst keine Metalle aus der Tiefsee verwenden zu wollen. Ob das aus Überzeugung geschieht oder aus Sorge um das eigene Image, ist umstritten. Fest steht nur: Die Entscheidung wird Folgen haben, die weit über die Lebenszeit derer hinausreichen, die sie treffen.

### Aufgabe 1: Lückentext ergänzen

> [!example] Ergänzen Sie die Lücken (1)–(3).
> Die Knollen **(1)** sich über Millionen Jahre aus im Wasser gelösten Metallen. Ihr Abbau **(2)** daher einen Eingriff dar, der kaum rückgängig zu machen ist. Kritikerinnen und Kritiker **(3)** vor allem die mangelnde Datengrundlage.

> [!quiz] Aufgabe 1, Lücke (1)
> level: C1 · type: fill · id: dp-c1-04-q02 · bank: entstehen, wachsen, bestehen
>
> ```text fill
> Die Knollen [[bilden]] sich über Millionen Jahre aus im Wasser gelösten Metallen.
> ```
>
> **Пояснення:** потрібне **зворотне** дієслово: *sich bilden* — «утворюватися». *entstehen* і *wachsen* за змістом підходять, але без *sich* (~~entstehen sich~~). *bestehen aus* — «складатися з», і теж без *sich*. Перевіряй не лише зміст, а й граматичну рамку пропуску.

> [!quiz] Aufgabe 1, Lücke (2)
> level: C1 · type: fill · id: dp-c1-04-q03 · bank: legt, setzt, macht
>
> ```text fill
> Ihr Abbau [[stellt]] daher einen Eingriff dar, der kaum rückgängig zu machen ist.
> ```
>
> **Пояснення:** *etwas darstellen* — «бути, становити»; підказку дає відокремлена частина ***dar*** у кінці. *darlegen* означає «викладати (аргументи)», і з *einen Eingriff* воно не поєднується.

> [!quiz] Aufgabe 1, Lücke (3)
> level: C1 · type: fill · id: dp-c1-04-q04 · bank: beschweren, klagen, verweisen
>
> ```text fill
> Kritikerinnen und Kritiker [[bemängeln|kritisieren]] vor allem die mangelnde Datengrundlage.
> ```
>
> **Пояснення:** *etwas bemängeln* + Akk — «критикувати, вказувати на недолік». *sich beschweren über*, *klagen über*, *verweisen auf* вимагають прийменника, а тут прямий додаток (*die … Datengrundlage*).

### Aufgabe 2: Textabschnitte ordnen

> [!quiz] Aufgabe 2. Bringen Sie die Sätze in die richtige Reihenfolge. Ein Satz passt nicht.
> level: C1 · type: order · id: dp-c1-04-q05
>
> ```text order
> Lastenräder galten lange als Spezialfahrzeuge für Handwerker und Paketdienste.
> Inzwischen nutzen aber auch viele Familien solche Räder, um Kinder und Einkäufe zu transportieren.
> Diese Entwicklung wird vielerorts durch Kaufprämien gefördert.
> Noch fehlen allerdings sichere Abstellplätze, denn die Räder sind lang und schwer.
> Deshalb sind sie heute in allen Städten das häufigste Verkehrsmittel. ✗
> ```
>
> **Пояснення:** «гачки»: *Lastenräder* (нова тема) → ***Inzwischen** … aber auch* (зміна в часі) → ***Diese** Entwicklung* → ***Noch** … **allerdings*** (обмеження наприкінці). Зайве речення суперечить *Noch fehlen … Abstellplätze* і *Spezialfahrzeuge*: за таких умов Lastenräder не можуть бути «найпоширенішим транспортом у всіх містах».

### Aufgabe 3: Multiple-Choice (Lesetext 1)

> [!quiz] Aufgabe 3.1. Womit begründen die Befürworter den Abbau?
> level: C1 · type: single · id: dp-c1-04-q06
> - [ ] Die Tiefsee sei bereits gut erforscht.
> - [x] Der Bedarf an Metallen sei größer, als an Land umweltverträglich gedeckt werden könne.
> - [ ] Der Abbau hinterlasse keinerlei Spuren.
>
> **Пояснення:** абзац 2: *brauche mehr Metalle, als an Land umweltverträglich gefördert werden könnten.* «Не залишає слідів» — перебільшення: прибічники якраз визнають сліди (*Zwar räumen auch sie ein…*). Про добру вивченість глибин говорять навпаки біологи.

> [!quiz] Aufgabe 3.2. Warum verschwindet der Lebensraum an den Knollen für sehr lange Zeit?
> level: C1 · type: single · id: dp-c1-04-q07
> - [ ] Weil Tiere sich nicht mehr an sie heften können.
> - [ ] Weil die Sedimentwolken ihn zerstören.
> - [x] Weil neue Knollen äußerst langsam nachwachsen.
>
> **Пояснення:** *denn die Knollen wachsen äußerst langsam.* Варіант a повторює слова тексту (*heften sich an sie*), але причиною не є. Хмари осаду — окрема проблема з наступного абзацу.

> [!quiz] Aufgabe 3.3. Was sagt der Text über die Sedimentwolken?
> level: C1 · type: single · id: dp-c1-04-q08
> - [x] Ihre Reichweite lässt sich bisher nur schätzen.
> - [ ] Sie bleiben auf das Abbaugebiet beschränkt.
> - [ ] Sie sind ungefährlich für Organismen.
>
> **Пояснення:** *Wie weit genau, lässt sich bislang nur abschätzen.* Варіант b суперечить тексту (*weit außerhalb des … Abbaugebiets*), варіант c — слову *beeinträchtigen*.

> [!quiz] Aufgabe 3.4. Wie beurteilt der Text die Zurückhaltung mancher Unternehmen?
> level: C1 · type: single · id: dp-c1-04-q09
> - [ ] als reine Werbemaßnahme
> - [ ] als Beweis echter Überzeugung
> - [x] als Verhalten mit umstrittenen Motiven
>
> **Пояснення:** *Ob das aus Überzeugung geschieht oder aus Sorge um das eigene Image, ist umstritten.* Текст навмисно не обирає між двома мотивами. Варіанти a і b — однобічні інтерпретації.

### Aufgabe 4: Sprachhandlungen zuordnen (Lesetext 1)

> [!quiz] Aufgabe 4.1. Was tut der Autor / die Autorin im dritten Absatz („Meeresbiologinnen und -biologen halten dagegen …“)?
> level: C1 · type: single · id: dp-c1-04-q10
> - [x] Gegenargumente anführen
> - [ ] einen Kompromiss vorschlagen
> - [ ] ein Fazit ziehen
> - [ ] eine Definition geben
>
> **Пояснення:** *halten dagegen* і *Hinzu kommt* — аргументи проти позиції з абзацу 2. Компромісу чи висновку в абзаці немає.

> [!quiz] Aufgabe 4.2. Was geschieht im fünften Absatz („Über den Abbau … entscheidet …“)?
> level: C1 · type: single · id: dp-c1-04-q11
> - [ ] Der Autor bewertet die Haltung der Staaten.
> - [x] Ein Sachverhalt wird dargestellt.
> - [ ] Ein Beispiel wird widerlegt.
> - [ ] Eine eigene Forderung wird erhoben.
>
> **Пояснення:** абзац лише інформує: хто вирішує й які позиції в держав. Оцінок (*leider, zu Recht*) і власних вимог автора немає. Вимогу паузи висувають *einige Staaten*, а не автор.

> [!quiz] Aufgabe 4.3. Welche Funktion hat der letzte Satz („Fest steht nur: …“)?
> level: C1 · type: single · id: dp-c1-04-q12
> - [ ] eine Gegenposition einräumen
> - [ ] eine Statistik erläutern
> - [x] ein Fazit ziehen
> - [ ] eine Frage aufwerfen
>
> **Пояснення:** *Fest steht nur:* — класичний вступ до висновку. Речення підсумовує, чому рішення таке важливе: його наслідки переживуть тих, хто його ухвалює.

### Lesetext 2

> [!example] Bauen mit Pilzen
> Wenn von Pilzen die Rede ist, denken die meisten an Steinpilze oder Champignons. Für die Baubranche interessant ist jedoch etwas anderes: das Myzel, ein feines Geflecht aus Pilzfäden, das im Boden oder in Holz wächst. Lässt man es auf landwirtschaftlichen Resten wie Stroh wachsen, verbindet es diese zu einem festen Block. Wird der Block anschließend erhitzt, stirbt der Pilz ab, und zurück bleibt ein leichter Werkstoff.
>
> Mehrere Forschungsgruppen und junge Firmen testen solche Materialien als Dämmstoff oder Verpackung. Ihr Hauptargument: Der Werkstoff entsteht aus Abfällen, braucht wenig Energie und lässt sich am Ende kompostieren. Myzelplatten dämmen nach ersten Tests ähnlich gut wie herkömmliche Materialien. Herkömmliche Dämmstoffe wie Mineralwolle dämmen zwar ebenfalls gut, ihre Herstellung ist jedoch deutlich energieaufwendiger.
>
> Ganz so einfach ist es allerdings nicht. Myzelplatten reagieren empfindlich auf Feuchtigkeit und müssen daher gut geschützt verbaut werden. Außerdem fehlen für viele Anwendungen noch Zulassungen, ohne die ein Material in Gebäuden nicht eingesetzt werden darf. Hinzu kommt der Preis: Solange nur kleine Mengen hergestellt werden, ist der Pilzwerkstoff teurer als die etablierte Konkurrenz.
>
> Ob aus dem Nischenprodukt ein Massenbaustoff wird, hängt deshalb weniger von der Biologie ab als von Fragen der Normung und der Produktion im großen Maßstab.

### Aufgabe 5: Aussagen Kategorien zuordnen (Lesetext 2)

> [!quiz] Aufgabe 5.1. Auf welchen Dämmstoff trifft die Aussage zu? «dämmt gut»
> level: C1 · type: single · id: dp-c1-04-q13
> - [ ] A: Myzel
> - [ ] B: Mineralwolle
> - [x] C: beide
>
> **Пояснення:** *Herkömmliche Dämmstoffe wie Mineralwolle dämmen zwar **ebenfalls** gut* — слово *ebenfalls* («так само») означає, що добре утеплюють обидва матеріали. Одне маленьке слово змінює категорію.

> [!quiz] Aufgabe 5.2. «Die Herstellung braucht viel Energie.»
> level: C1 · type: single · id: dp-c1-04-q14
> - [ ] A: Myzel
> - [x] B: Mineralwolle
> - [ ] C: beide
>
> **Пояснення:** про Mineralwolle: *ihre Herstellung ist jedoch deutlich energieaufwendiger*. Про міцелій сказано протилежне: *braucht wenig Energie*.

> [!quiz] Aufgabe 5.3. «Ist empfindlich gegenüber Feuchtigkeit.»
> level: C1 · type: single · id: dp-c1-04-q15
> - [x] A: Myzel
> - [ ] B: Mineralwolle
> - [ ] C: beide
>
> **Пояснення:** *Myzelplatten reagieren empfindlich auf Feuchtigkeit.* Про вологу й мінеральну вату текст нічого не каже, тож «обидва» — домисел.

### Aufgabe 6: Aussagen einem Begriffspaar zuordnen (Lesetext 2)

> [!quiz] Aufgabe 6.1. Begriffspaar «Vorteil – Nachteil» des Pilzwerkstoffs: «lässt sich am Ende kompostieren»
> level: C1 · type: single · id: dp-c1-04-q16
> - [x] Vorteil
> - [ ] Nachteil
>
> **Пояснення:** це частина *Hauptargument* прихильників разом із «з відходів» і «мало енергії».

> [!quiz] Aufgabe 6.2. «Für viele Anwendungen fehlen noch Zulassungen.»
> level: C1 · type: single · id: dp-c1-04-q17
> - [ ] Vorteil
> - [x] Nachteil
>
> **Пояснення:** абзац 3 відкривається сигналом *Ganz so einfach ist es allerdings nicht* — далі йдуть недоліки: волога, дозволи, ціна.

### Aufgabe 7: Fehler in Zusammenfassung erkennen (Lesetext 2)

> [!quiz] Aufgabe 7.1. Welcher Satz der Zusammenfassung ist FALSCH?
> level: C1 · type: single · id: dp-c1-04-q18
> - [ ] Myzel kann auf Resten wie Stroh gezüchtet werden.
> - [ ] Beim Erhitzen stirbt der Pilz ab.
> - [x] Myzelplatten sind schon heute günstiger als Mineralwolle.
>
> **Пояснення:** текст: *ist der Pilzwerkstoff teurer als die etablierte Konkurrenz*. Помилка резюме — заміна «дорожчий» на «дешевший». Такі заміни на протилежне — найчастіший тип помилок у цьому завданні.

> [!quiz] Aufgabe 7.2. Welcher Satz der Zusammenfassung ist FALSCH?
> level: C1 · type: single · id: dp-c1-04-q19
> - [x] Die Zukunft des Materials hängt vor allem von biologischen Fragen ab.
> - [ ] Normen spielen für die Zukunft des Materials eine große Rolle.
> - [ ] Offen ist, ob es sich in großen Mengen produzieren lässt.
>
> **Пояснення:** останнє речення тексту: *hängt … **weniger** von der Biologie ab als von Fragen der Normung und der Produktion*. Резюме перевертає пропорцію *weniger … als*.

## Teil B: Hören (≈ 25 Minuten, jeder Text nur einmal)

### Aufgabe 1: Kurzantwort — Übersicht ergänzen

> [!listen] Hören 1.1. Доповідь доктора Тобіаса Рау про бобрів. Ergänzen Sie die Übersicht.
> level: C1 · type: fill · id: dp-c1-04-l01
> audio: Der Biber war in weiten Teilen Mitteleuropas fast ausgerottet, vor allem durch die Jagd auf sein Fell. Inzwischen ist er in viele Regionen zurückgekehrt, auch dank strenger Schutzgesetze.
>
> ```fill
> früher: fast [[ausgerottet]]
> Hauptgrund: Jagd auf das [[Fell]]
> Rückkehr auch dank strenger [[Schutzgesetze|Schutzgesetzen|Gesetze]]
> ```
>
> **Пояснення:** *vor allem wegen* вводить головну причину; *auch dank* — одну з причин повернення. Ключові слова переносимо в огляд дослівно.

> [!listen] Hören 1.2. Доктор Рау продовжує. Ergänzen Sie die Übersicht.
> level: C1 · type: fill · id: dp-c1-04-l02
> audio: Biber sind Landschaftsgestalter. Mit ihren Dämmen stauen sie Bäche auf. So entstehen Teiche und Feuchtgebiete, in denen Amphibien und Libellen neue Lebensräume finden.
>
> ```fill
> Biber bauen [[Dämme|Damm]] und stauen Bäche auf
> es entstehen Teiche und [[Feuchtgebiete|Feuchtgebiet]]
> profitieren: Amphibien und [[Libellen]]
> ```
>
> **Пояснення:** *der Damm* (гребля) — множина *Dämme*. Не плутай з *dämmen* / *der Dämmstoff* з Lesetext 2. *Libellen* — бабки.

> [!listen] Hören 1.3. Доктор Рау: роль водно-болотних угідь. Ergänzen Sie die Übersicht.
> level: C1 · type: fill · id: dp-c1-04-l03
> audio: Gleichzeitig speichern diese Feuchtgebiete Wasser. In trockenen Sommern geben sie es langsam wieder ab, und bei Starkregen können sie Hochwasser abmildern.
>
> ```fill
> Feuchtgebiete [[speichern]] Wasser
> trockene Sommer: geben es langsam wieder [[ab]]
> Starkregen: können [[Hochwasser]] abmildern
> ```
>
> **Пояснення:** три функції за трьома ситуаціями: загалом — *speichern*, посуха — *abgeben*, злива — *abmildern*. Відокремлюване *ab* легко пропустити на слух — слухай кінець речення.

### Aufgabe 2: Kurzantwort — Textstellen zu Begriffspaar notieren

> [!listen] Hören 2.1. Модераторка Клара (A) і фермер Бернд Зауер (B). Notieren Sie: Konflikt — Nutzen.
> level: C1 · type: fill · id: dp-c1-04-l04
> audio: A: Herr Sauer, Sie haben Biber an Ihren Feldern. Wie ist das?
> audio: B: Ehrlich gesagt gemischt. Wenn der Damm einen Graben aufstaut, steht mein Acker unter Wasser. Andererseits habe ich seit den Bibern deutlich mehr Störche.
>
> ```fill
> Konflikt: [[Acker|Feld]] steht unter Wasser
> Nutzen: deutlich mehr [[Störche]]
> ```
>
> **Пояснення:** *Ehrlich gesagt gemischt* — анонс обох колонок; межа — *Andererseits*. *der Storch → die Störche* (лелеки).

> [!listen] Hören 2.2. Бернд Зауер (B) продовжує. Notieren Sie: Nutzen — Konflikt.
> level: C1 · type: fill · id: dp-c1-04-l05
> audio: B: Was mir hilft, ist das Bibermanagement des Landkreises. Die beraten uns und zahlen in manchen Fällen eine Entschädigung. Schwierig bleibt, dass das Verfahren oft Monate dauert.
>
> ```fill
> Nutzen: [[Beratung]] und in manchen Fällen [[Entschädigung]]
> Konflikt: Verfahren dauert oft [[Monate]]
> ```
>
> **Пояснення:** дієслова з аудіо (*beraten, zahlen … eine Entschädigung*) у таблиці перетворюємо на іменники (*Beratung*). Це номінальний стиль коротких відповідей. Межа колонок — *Schwierig bleibt*.

### Aufgabe 3: Fehler in Zusammenfassung erkennen

> [!listen] Hören 3.1. Докторка Інза Петерсен про солончакові луки. Welcher Satz der Zusammenfassung ist FALSCH?
> level: C1 · type: answer · id: dp-c1-04-l06
> audio: Salzwiesen sind Grünland an der Küste, das regelmäßig vom Meer überflutet wird. Nur wenige Pflanzen vertragen das Salz, etwa der Queller. Für Zugvögel sind die Wiesen ein wichtiger Rastplatz.
> - [ ] a: Salzwiesen werden regelmäßig überflutet.
> - [x] b: Dort wachsen problemlos viele verschiedene Pflanzenarten.
> - [ ] c: Zugvögel nutzen die Wiesen als Rastplatz.
>
> **Пояснення:** *Nur wenige Pflanzen vertragen das Salz* — резюме перетворює «небагато» на «багато». *der Queller* — солонець, рослина солончаків.

> [!listen] Hören 3.2. Докторка Петерсен продовжує. Welcher Satz ist FALSCH?
> level: C1 · type: answer · id: dp-c1-04-l07
> audio: Lange wurden Salzwiesen eingedeicht und zu Weideland gemacht. Heute lässt man an manchen Stellen das Meer wieder herein, weil die Wiesen Kohlenstoff speichern und Wellen bremsen.
> - [ ] a: Früher machte man aus Salzwiesen oft Weideland.
> - [x] b: Heute werden mehr Salzwiesen eingedeicht als früher.
> - [ ] c: Salzwiesen bremsen Wellen.
>
> **Пояснення:** напрям змінився: *Heute lässt man … das Meer wieder herein.* Резюме b описує минуле як теперішнє і ще й посилює його.

### Aufgabe 4: Aussagen Personen zuordnen (statt Video: zwei Stimmen)

> [!listen] Hören 4.1. Природоохоронниця Неле (A) і менеджер з туризму Ян (B). Wer meint, Besucher müssten die Wiesen erleben, um ihren Wert zu verstehen?
> level: C1 · type: answer · id: dp-c1-04-l08
> audio: A: Ich bin Nele. Ich finde, Teile der Salzwiesen sollten für Besucher ganz gesperrt bleiben.
> audio: B: Jan hier. Ganz sperren? Dann verstehen die Leute nie, warum die Wiesen so wertvoll sind.
> - [ ] a: Nele
> - [x] b: Jan
> - [ ] c: beide
> - [ ] d: keiner
>
> **Пояснення:** аргумент Яна: без доступу люди *nie verstehen, warum die Wiesen … wertvoll sind*. Неле хоче частину лук закрити.

> [!listen] Hören 4.2. Неле (A) і Ян (B). Wer befürwortet geführte Touren?
> level: C1 · type: answer · id: dp-c1-04-l09
> audio: A: Erleben ja, aber auf Stegen und mit Führung.
> audio: B: Mit Führungen bin ich einverstanden, nur nicht in jeder Ecke.
> - [ ] a: Nele
> - [ ] b: Jan
> - [x] c: beide
> - [ ] d: keiner
>
> **Пояснення:** Неле: *mit Führung*; Ян: *Mit Führungen bin ich einverstanden*. Обмеження Яна (*nicht in jeder Ecke*) не скасовує згоди.

> [!listen] Hören 4.3. Ян (B) і Неле (A). Wer lehnt den Parkplatz ab?
> level: C1 · type: answer · id: dp-c1-04-l10
> audio: B: Wir überlegen übrigens, einen Parkplatz direkt am Deich zu bauen.
> audio: A: Davon halte ich gar nichts.
> - [x] a: Nele
> - [ ] b: Jan
> - [ ] c: beide
> - [ ] d: keiner
>
> **Пояснення:** *Davon halte ich gar nichts* — різка відмова. Ян лише повідомляє про план, без оцінки.

> [!listen] Hören 4.4. Неле (A) і Ян (B). Wer schlägt vor, Eintritt zu verlangen?
> level: C1 · type: answer · id: dp-c1-04-l11
> audio: A: Und woher soll das Geld für die Stege kommen?
> audio: B: Aus Fördermitteln, denke ich. Das wäre jedenfalls mein Vorschlag.
> - [ ] a: Nele
> - [ ] b: Jan
> - [ ] c: beide
> - [x] d: keiner
>
> **Пояснення:** Ян пропонує *Fördermittel* (гранти, державні кошти), а не вхідну плату. Слово *Vorschlag* є, але пропонують інше. Це пастка для того, хто ловить лише ключові слова.

### Aufgabe 5: Kurzantwort — Gliederungspunkte zu Vortrag ergänzen

> [!listen] Hören 5.1. Докторка Петерсен називає план доповіді. Ergänzen Sie die Gliederung.
> level: C1 · type: fill · id: dp-c1-04-l12
> audio: Ich gliedere meinen Vortrag in vier Abschnitte. Zuerst erkläre ich, wie Salzwiesen entstehen. Danach geht es um ihre Pflanzen und Tiere.
>
> ```fill
> 1. wie Salzwiesen [[entstehen]]
> 2. ihre Pflanzen und [[Tiere]]
> ```
>
> **Пояснення:** *vier Abschnitte* — отже, чекай ще двох пунктів у наступному фрагменті. *Zuerst — Danach* — перші два.

> [!listen] Hören 5.2. Докторка Петерсен продовжує план.
> level: C1 · type: fill · id: dp-c1-04-l13
> audio: Im dritten Teil spreche ich über den Küstenschutz, und zum Schluss stelle ich ein Renaturierungsprojekt an der Nordsee vor.
>
> ```fill
> 3. [[Küstenschutz]]
> 4. ein [[Renaturierungsprojekt|Projekt]] an der [[Nordsee]]
> ```
>
> **Пояснення:** *Renaturierung* — повернення території в природний стан. Довгі складні слова записуй повністю, якщо встигаєш, або хоча б головну частину (*Projekt*).

### Aufgabe 6: Multiple-Choice

> [!listen] Hören 6.1. Модератор (A) і доктор Рау (B). Warum wachsen Biberbestände nicht unbegrenzt?
> level: C1 · type: answer · id: dp-c1-04-l14
> audio: A: Werden Biber nicht irgendwann zu viele?
> audio: B: Biberfamilien verteidigen ihre Reviere. Ist ein Gebiet besetzt, müssen junge Tiere weiterziehen. Die Zahl reguliert sich also zu einem guten Teil selbst.
> - [ ] a: Weil sie stark bejagt werden.
> - [x] b: Weil besetzte Reviere junge Tiere zum Weiterziehen zwingen.
> - [ ] c: Weil sie kaum Nachwuchs haben.
>
> **Пояснення:** *verteidigen ihre Reviere … junge Tiere müssen weiterziehen … reguliert sich … selbst*. Полювання згадувалося в 1.1, але як історична причина — дистрактор із попереднього фрагмента.

> [!listen] Hören 6.2. Доктор Рау (B). Was schlägt er vor?
> level: C1 · type: answer · id: dp-c1-04-l15
> audio: B: Probleme gibt es vor allem dort, wo Flüsse eng begradigt sind und Felder direkt am Ufer liegen. Mit Uferstreifen von einigen Metern ließe sich vieles entschärfen.
> - [ ] a: Flüsse noch stärker zu begradigen
> - [x] b: einige Meter breite Streifen am Ufer frei zu lassen
> - [ ] c: Biber an solchen Flüssen umzusiedeln
>
> **Пояснення:** *Mit Uferstreifen … ließe sich vieles entschärfen* — пропозиція в Konjunktiv II (*ließe sich*): обережно, але чітко. Про переселення не сказано нічого.

> [!listen] Hören 6.3. Докторка Петерсен. Was ist laut ihr noch unklar?
> level: C1 · type: answer · id: dp-c1-04-l16
> audio: Salzwiesen können mitwachsen, wenn der Meeresspiegel steigt, allerdings nur, wenn genug Sediment angespült wird. Ob das überall reicht, wissen wir noch nicht.
> - [ ] a: ob der Meeresspiegel überhaupt steigt
> - [x] b: ob überall genug Sediment angespült wird
> - [ ] c: ob Salzwiesen Sediment brauchen
>
> **Пояснення:** невідоме — лише *Ob das überall reicht*, тобто чи вистачить осаду скрізь. Що лукам потрібен осад, сказано як умову (*nur, wenn*), тож варіант c — не відкрите питання.

> [!listen] Hören 6.4. Модератор (A) і засновниця стартапу Ліза Керн (B). Warum verkauft ihre Firma die Pilzplatten zuerst als Verpackung?
> level: C1 · type: answer · id: dp-c1-04-l17
> audio: A: Frau Kern, warum verkaufen Sie Ihre Pilzplatten zuerst als Verpackung?
> audio: B: Für Verpackungen brauchen wir keine Bauzulassung. So können wir schon jetzt Erfahrung sammeln und die Produktion vergrößern.
> - [x] a: Weil dafür keine Bauzulassung nötig ist und die Firma so Erfahrung sammelt.
> - [ ] b: Weil Verpackungen teurer verkauft werden können.
> - [ ] c: Weil die Platten für Gebäude zu schwer sind.
>
> **Пояснення:** дві причини: *keine Bauzulassung* і *Erfahrung sammeln … Produktion vergrößern*. Це перегукується з Lesetext 2: там теж ішлося про брак *Zulassungen* і дорогу дрібносерійну продукцію.

### Aufgabe 7: Laut- und Schriftbild abgleichen

> [!listen] Hören 7.1. Am Bildschirm: «Der Biber ist mit Abstand das größte Nagetier Europas.» Welche Wörter fehlen im Hörtext?
> level: C1 · type: answer · id: dp-c1-04-l18
> audio: Der Biber ist das größte Nagetier Europas.
> - [x] a: mit Abstand
> - [ ] b: größte
> - [ ] c: Europas
>
> **Пояснення:** у записі немає *mit Abstand* («з великим відривом»). Підсилювальні групи — улюблені «вставки» в цьому завданні.

> [!listen] Hören 7.2. Am Bildschirm: «Dichte Salzwiesen bremsen die Wellen deutlich und schützen so den Deich.» Welche Wörter fehlen im Hörtext?
> level: C1 · type: answer · id: dp-c1-04-l19
> audio: Salzwiesen bremsen die Wellen und schützen so den Deich.
> - [ ] a: bremsen, schützen
> - [x] b: Dichte, deutlich
> - [ ] c: so, den
>
> **Пояснення:** зайві *Dichte* (на початку) і *deutlich* (у середині). Обидва слова звучать «природно», тож слух їх добудовує. Іди пальцем по тексту.

> [!listen] Hören 7.3. Am Bildschirm: «Myzel wächst am besten in einer dunklen, warmen und feuchten Umgebung.» Welches Wort fehlt im Hörtext?
> level: C1 · type: answer · id: dp-c1-04-l20
> audio: Myzel wächst am besten in einer warmen und feuchten Umgebung.
> - [ ] a: warmen
> - [x] b: dunklen
> - [ ] c: feuchten
>
> **Пояснення:** у записі два прикметники, у тексті — три. Коли бачиш перелік, рахуй його члени.

## Auswertung: dein orientierendes TDN

Порахуй бали: **L** — правильні з 18 у Lesen, **H** — правильні блоки з 20 у Hören. Переведи їх за таблицею, складеною на основі меж шкали testdaf.de (0–4 · 5–9 · 10–15 · 16–20). Lesen пропорційно перераховано з 18 на 20; результат округлюй униз.

| Орієнтовно | Lesen (L з 18) | Hören (H з 20) |
|---|---|---|
| unter TDN 3 | 0–4 | 0–4 |
| TDN 3 | 5–8 | 5–9 |
| TDN 4 | 9–14 | 10–15 |
| TDN 5 | 15–18 | 16–20 |

> [!warning] Це орієнтир, а не прогноз
> Справжній TestDaF переводить відповіді на шкалу статистично, і складність усіх варіантів вирівнюють. Цей тест коротший, власний і не калібрований на справжніх учасниках. Читай результат як **± один рівень**. Якщо ти на межі (L = 8–9, 14–15, H = 9–10 або 15–16), вважай себе на нижчому рівні й тренуйся далі. Офіційні модельні тести — на testdaf.de.

**Де шукати свою слабку ланку:**

| Помилки в… | Що це означає | Що тренувати |
|---|---|---|
| Lesen 1 (q02–q04) | граматична рамка слова | керування дієслів, зворотні дієслова: [[Deutsch - C1 - 17. Колокації писемної мови]] |
| Lesen 2, 4 (q05, q10–q12) | структура й функції тексту | конектори й відсилання: [[Deutsch - C1 - 08. Звʼязність тексту — конектори, відсилання, wobei]] |
| Lesen 3, 7 (q06–q09, q18–q19) | точність: «усі ↔ деякі», «більше ↔ менше» | читай повільніше варіанти, ніж текст |
| Hören 1, 2, 5 | короткі відповіді | диктанти й нотатки: [[Deutsch - C1 - 12. Аудіювання — лекції, дебати, подкасти]] |
| Hören 4, 6 | позиції мовців | *zwar … aber*, *andererseits*, Konjunktiv II у пропозиціях |
| Hören 7 | слух «добудовує» слова | диктанти з порівнянням слово за словом |

> [!quiz] Ти набрав у Lesen 13 з 18. Який орієнтовний результат?
> level: C1 · type: single · id: dp-c1-04-q20
> - [ ] TDN 3
> - [x] TDN 4
> - [ ] TDN 5
> - [ ] unter TDN 3
>
> **Пояснення:** 13 × 20 : 18 ≈ 14,4 → TDN 4 (10–15). До TDN 5 бракує двох правильних відповідей (15 з 18 ≈ 16,7).

> [!quiz] У Hören 15 правильних блоків із 20. Орієнтовно?
> level: C1 · type: single · id: dp-c1-04-q21
> - [ ] TDN 3
> - [x] TDN 4, але на самій межі з TDN 5
> - [ ] TDN 5
> - [ ] неможливо оцінити
>
> **Пояснення:** 15 — верхня межа TDN 4 (10–15). На межі чесніше вважати себе на нижчому рівні: похибка пробного тесту — приблизно один рівень.

> [!quiz] Чому результат цього тесту лише орієнтовний? Обери всі причини.
> level: C1 · type: multi · id: dp-c1-04-q22
> - [x] Тест коротший за справжній: 18 і 20 завдань замість 34 і 30.
> - [x] Справжня шкала TestDaF статистична, а варіанти вирівнюють за складністю.
> - [x] Завдання не випробувано на справжніх кандидатах.
> - [ ] Пробний тест складніший за справжній.
> - [ ] У справжньому TestDaF кожен текст Hören звучить двічі.
>
> **Пояснення:** перші три причини описано вище. Останні два твердження неправдиві: тест не складніший, а лише коротший і не калібрований, а в справжньому TestDaF кожен текст Hören звучить один раз, а не двічі.

> [!quiz] Lesen, 3.2: дистрактор «Weil Tiere sich nicht mehr an sie heften können» здавався правильним. Чому?
> level: C1 · type: single · id: dp-c1-04-q23
> - [ ] бо він дослівно правильний за текстом
> - [x] бо повторює слова тексту (*heften sich an sie*), але не відповідає на питання «чому»
> - [ ] бо в тексті немає відповіді на це питання
> - [ ] бо питання некоректне
>
> **Пояснення:** класичний «дистрактор-відлуння»: знайомі слова створюють ілюзію правильності. Перевіряй, чи варіант відповідає саме на **поставлене питання** (тут — причина: *denn … wachsen äußerst langsam*).

> [!quiz] Які з цих сигнальних слів у пробному тесті вводили обмеження чи протиставлення? Обери всі.
> level: C1 · type: multi · id: dp-c1-04-q24
> - [x] *allerdings*
> - [x] *andererseits*
> - [x] *zwar … jedoch*
> - [ ] *zuerst*
> - [ ] *Hinzu kommt*
>
> **Пояснення:** *allerdings*, *andererseits*, *zwar … jedoch* — межі «так / але». *zuerst* — порядок, *Hinzu kommt* — додавання ще одного аргументу **в той самий бік**.

> [!quiz] До кінця Lesen лишилося 2 хвилини, а без відповіді ще три завдання. Що робити?
> level: C1 · type: single · id: dp-c1-04-q25
> - [ ] залишити їх порожніми, щоб не помилитися
> - [x] швидко відповісти на всі три, навіть навмання
> - [ ] повернутися й перевірити попередні завдання
> - [ ] попросити додатковий час
>
> **Пояснення:** бали рахують за правильні відповіді, порожня відповідь гарантовано дає 0. Повернутися назад у цифровому TestDaF не можна, а додаткового часу не дають (окрім заздалегідь погодженого *Nachteilsausgleich*).

> [!quiz] Hören 4.4: багато хто обирає «Jan», бо чує слово *Vorschlag*. Яка це пастка?
> level: C1 · type: single · id: dp-c1-04-q26
> - [x] реакція на ключове слово без перевірки змісту пропозиції
> - [ ] помилка в записі
> - [ ] Ян справді пропонує вхідну плату
> - [ ] у відео завданнях не буває варіанта «keiner»
>
> **Пояснення:** *Vorschlag* звучить, але пропонує Ян *Fördermittel*, а не вхідну плату. Слухай, **що саме** пропонують, а не лише чи прозвучало слово «пропозиція».

> [!quiz] Lesen 5.1: чому «dämmt gut» — це «beide», а не лише «Mineralwolle»?
> level: C1 · type: single · id: dp-c1-04-q27
> - [ ] бо Mineralwolle — головний утеплювач
> - [x] бо слово *ebenfalls* показує, що й міцелій утеплює добре
> - [ ] бо в тексті про це нічого не сказано
> - [ ] бо всі утеплювачі утеплюють однаково
>
> **Пояснення:** *Herkömmliche Dämmstoffe wie Mineralwolle dämmen zwar ebenfalls gut* — «так само добре», тобто як і міцелій (про нього перед цим сказано: *ähnlich gut*). У завданнях на категорії маленькі слова (*ebenfalls, nur, auch, kaum*) вирішують усе.

> [!quiz] Твій результат: Lesen TDN 4, Hören TDN 3. Що розумно зробити перш за все?
> level: C1 · type: single · id: dp-c1-04-q28
> - [ ] записатися на TestDaF якнайшвидше: Lesen уже готовий
> - [x] тренувати Hören — диктанти, короткі відповіді, позиції мовців — і повторити пробний тест
> - [ ] більше читати, щоб підняти Lesen до TDN 5
> - [ ] нічого: TDN 3 у Hören вистачає для будь-якої програми
>
> **Пояснення:** для «TDN 4 × 4» вирішує найслабша частина, тож підтягувати треба Hören. Lesen на TDN 5 не компенсує TDN 3 в іншій частині.

> [!quiz] Hören 7: як найкраще тренувати «Laut- und Schriftbild abgleichen»?
> level: C1 · type: single · id: dp-c1-04-q29
> - [ ] вчити напамʼять довгі списки слів
> - [x] слухати короткі записи з транскриптом і позначати кожне слово тексту, що прозвучало
> - [ ] читати тексти вголос без аудіо
> - [ ] дивитися фільми без субтитрів
>
> **Пояснення:** завдання перевіряє точне зіставлення почутого й написаного. Найкраще тренування — диктанти й «слухання з пальцем по тексту». Фільми корисні загалом, але цього вміння не тренують.

> [!quiz] Lesen 1, Lücke (3): Kritikerinnen und Kritiker ___ die mangelnde Datengrundlage. Яке з цих дієслів ТЕЖ підійшло б граматично й за змістом?
> level: C1 · type: single · id: dp-c1-04-q30
> - [ ] klagen
> - [x] kritisieren
> - [ ] beschweren
> - [ ] verweisen
>
> **Пояснення:** *etwas kritisieren* + Akk — прямий додаток, як у *bemängeln*. Інші три потребують прийменника: *klagen über*, *sich beschweren über*, *verweisen auf*. Шукай синонім **з тією самою граматикою**.

## Типові помилки українців

> [!pitfall] Спершу «уважно все прочитати»
> У школі нас учили спочатку прочитати текст, потім питання. У TestDaF на це немає часу: ≈ 1,6 хвилини на завдання **разом** із читанням. Спершу прочитай завдання, потім шукай у тексті потрібне місце, і так для кожного блоку.

> [!pitfall] «Знайомі слова = правильна відповідь»
> Дистрактор-«відлуння» повторює слова тексту (*heften sich an sie*, *Vorschlag*), але не відповідає на питання. Правильний варіант зазвичай **перефразує**: *wachsen äußerst langsam* → *wachsen sehr langsam nach*.

> [!pitfall] Повернутися й перевірити
> На тренуваннях хочеться відкрити попереднє завдання ще раз. У цифровому TestDaF повернутися неможливо, тож тренуйся без цього: відповідай, вирішуй і йди далі.

> [!pitfall] Сприймати пробний бал як вирок
> 15 з 20 у Hören — це не «вже TDN 4», а «орієнтовно TDN 4, на межі». Пробний тест показує, **що** тренувати. Точний результат дасть лише справжній іспит або офіційний модельний тест.

## Фішки

> [!reel] 🎯 Звідки слово «дистрактор»
> *Distraktor* — від латинського *distrahere*, «розтягувати, відволікати». Добрий дистрактор не безглуздий: він правдоподібний і повторює реальну помилку учасника. Тому він і відволікає.

> [!reel] ⚖️ Однаково важкі варіанти
> TestDaF-Institut вирівнює складність усіх варіантів тесту (*Testsätze*), щоб TDN 4 в одному варіанті означав те саме, що й в іншому. Саме тому бали переводять на шкалу 0–20, а не рахують «скільки правильних».

> [!reel] 📺 Hochrechnung
> Те, що ми щойно зробили з балами, німецькою — *hochrechnen*. Тим самим словом називають прогноз результатів виборів, який ARD і ZDF показують у виборчий вечір, коли пораховано лише частину бюлетенів. І там, і тут результат орієнтовний, поки не все пораховано.

## Джерела та що почитати

- [testdaf.de — Testaufbau digitaler TestDaF](https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/aufbau-des-digitalen-testdaf/): 7 типів завдань Lesen і Hören, кількість items, час, без повернення назад.
- [testdaf.de — Testauswertung digitaler TestDaF](https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/auswertung-des-digitalen-testdaf/): шкала 0–20 і межі TDN, на яких побудовано таблицю переведення.
- [testdaf.de — Vorbereitung auf den digitalen TestDaF](https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/vorbereitung-auf-den-digitalen-testdaf/): офіційні приклади завдань з аудіо, транскриптами й відповідями, туторіали.
- [testdaf.de — Nachweis der Deutschkenntnisse für das Studium](https://www.testdaf.de/de/hochschulen/der-testdaf-und-hochschulen/nachweis-der-deutschkenntnisse-fuer-das-studium/): вирівнювання складності варіантів тесту.
- [DWDS — «Distraktor»](https://www.dwds.de/wb/Distraktor): рід, множина *Distraktoren*.

> [!important] Підсумок
> - Пробний тест: Lesen — 18 завдань ≈ 30 хв, Hören — 20 блоків ≈ 25 хв; один раз слухаєш, назад не повертаєшся, без словника.
> - Переведення: Lesen × 20 : 18, Hören як є; межі 5 / 10 / 16 — TDN 3 / 4 / 5. Результат **орієнтовний, ± один рівень**.
> - Типові дистрактори: «відлуння» слів тексту, перебільшення (*keinerlei, problemlos*), перевернуті пропорції (*weniger … als*), «логічний» домисел.
> - Маленькі слова вирішують: *ebenfalls, nur, allerdings, andererseits, nicht … sondern*.
> - Тренуй найслабшу частину: для «TDN 4 × 4» сильний Lesen не врятує слабкий Hören.
