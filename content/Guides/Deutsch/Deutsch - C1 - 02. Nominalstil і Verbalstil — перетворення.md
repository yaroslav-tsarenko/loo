---
title: Nominalstil і Verbalstil — перетворення
id: de-c1-nominalstil
level: C1
icon: px:star
tags: [deutsch, c1, grammar, nominalstil, verbalstil, stil]
prerequisites: ["[[Deutsch - C1 - 01. Розширені дієприкметникові означення й звороти]]", "[[Deutsch - B2 - 10. Номіналізація I — Verbalstil і Nominalstil]]"]
estimatedMinutes: 45
---

# Nominalstil і Verbalstil — перетворення

> [!success] Після цієї теми ти зможеш
> - перетворювати речення в обидва боки: *Wenn Sie die Frist nicht einhalten, … ⇄ Bei Nichteinhaltung der Frist …*;
> - правильно передавати підмет, додатки, заперечення й модальні дієслова в Nominalstil: *durch das Amt, die Teilnahme am Kurs, die Pflicht zur Meldung, das Nichterscheinen*;
> - розвантажувати ланцюжки з Genitiv і розшифровувати Amtsdeutsch простою мовою;
> - вирішувати, де номінальний стиль доречний (наука, право, заголовки), а де він шкодить (лист людині, розмова).

## Передбач

> [!quiz] «Bei Nichteinhaltung der Frist wird der Antrag abgelehnt.» Як сказати те саме в Verbalstil?
> level: C1 · type: single · id: de-c1-nominalstil-q01
> - [x] Wenn Sie die Frist nicht einhalten, wird der Antrag abgelehnt.
> - [ ] Obwohl Sie die Frist nicht einhalten, wird der Antrag abgelehnt.
> - [ ] Weil Sie die Frist einhalten, wird der Antrag abgelehnt.
> - [ ] Bei Sie die Frist nicht einhalten, wird der Antrag abgelehnt.
>
> **Пояснення:** *bei* + іменник дії передає умову → **wenn**. Префікс *Nicht-* у *Nichteinhaltung* стає запереченням *nicht*, Genitiv *der Frist* — прямим додатком *die Frist*. *Obwohl* змінює логіку на поступку, а *bei* перед підрядним реченням не вживається.

## Що вже знаєш і що нового

У темі [[Deutsch - B2 - 10. Номіналізація I — Verbalstil і Nominalstil]] ти навчився утворювати іменники від дієслів (*-ung, der Anstieg, die Zunahme*) і міняти сполучник на прийменник (*weil → wegen, obwohl → trotz, wenn → bei*). На C1 завдання складніше:

1. **Обидва напрями.** Не лише «стиснути» речення для звіту, а й «розтиснути» лист з установи, щоб зрозуміти, що від тебе хочуть.
2. **Усі члени речення.** Що стається з підметом, дативним і прийменниковим додатком, прислівником, *nicht* і модальним дієсловом.
3. **Міра.** Коли номінальний стиль робить текст точним, а коли — нечитабельним.

## Як перебудовується речення

> [!diagram] Від Verbalstil до Nominalstil — по кроках
> ```yaml
> layout: flow
> nodes:
>   - { id: conj, label: "сполучник → прийменник", text: "Wenn", tone: yellow }
>   - { id: subj, label: "підмет", text: "Sie", tone: gray }
>   - { id: obj, label: "додаток", text: "die Frist", tone: gray }
>   - { id: verb, label: "дієслово → іменник", text: "nicht einhalten", tone: pink }
>   - { id: main, label: "головне речення", text: "wird der Antrag abgelehnt", tone: gray }
> steps:
>   - { focus: [conj, subj, obj, verb], note: "Вихідне речення: Wenn Sie die Frist nicht einhalten, wird der Antrag abgelehnt." }
>   - { set: { conj: "Bei" }, focus: conj, note: "Умова wenn → прийменник bei (+ Dativ)." }
>   - { set: { verb: "Nichteinhaltung" }, focus: verb, note: "nicht einhalten → die Nichteinhaltung: заперечення стає префіксом Nicht-. Після bei артикль часто випадає." }
>   - { set: { obj: "der Frist" }, hide: subj, focus: [obj, subj], note: "Додаток die Frist → Genitiv der Frist. Підмет Sie зникає: у Nominalstil виконавець часто не названий." }
>   - { set: { main: "erfolgt die Ablehnung des Antrags" }, focus: main, note: "Головне речення теж можна номіналізувати: wird abgelehnt → erfolgt die Ablehnung. Результат: Bei Nichteinhaltung der Frist erfolgt die Ablehnung des Antrags." }
> ```
> Сполучник → прийменник; дієслово → іменник дії; додаток → Genitiv; підмет → зникає або стає *durch* / *seitens*.

### Що стається з кожним членом речення

| У Verbalstil | У Nominalstil | Приклад |
|---|---|---|
| прямий додаток | **Genitiv** | die Anträge prüfen → die Prüfung **der Anträge** |
| підмет (при перехідному дієслові) | **durch** + Akk, офіційно **seitens** + Gen | Das Amt prüft die Anträge. → die Prüfung der Anträge **durch das Amt** |
| підмет (при неперехідному) | Genitiv або присвійний займенник | Der Zug kommt an. → die Ankunft **des Zuges**; er kommt an → **seine** Ankunft |
| прийменниковий додаток | **той самий прийменник** | an etwas teilnehmen → die Teilnahme **an** etwas; auf etwas verzichten → der Verzicht **auf** etwas |
| дативний додаток | прийменник (**für, an, zu**) | jemandem helfen → die Hilfe **für** jemanden; einem Plan zustimmen → die Zustimmung **zum** Plan |
| прислівник | **прикметник** | schnell bearbeiten → die **schnelle** Bearbeitung |
| *nicht* | **Nicht-**, *fehlend*, *mangelnd* | dass er nicht erschien → sein **Nichterscheinen**; weil Personal fehlt → wegen **fehlenden** Personals |
| модальне дієслово | іменник модальності | müssen → die **Pflicht** / **Notwendigkeit**; können → die **Möglichkeit**; wollen → die **Absicht**; dürfen → die **Erlaubnis** |
| час (вже сталося) | *erfolgt-* як означення | nachdem bezahlt wurde → **nach erfolgter** Zahlung |

Іменник без артикля в множині «ховає» Genitiv, тож тоді беремо **von** + Dativ: *die Bereitstellung **von** Laptops*, а не ~~die Bereitstellung Laptops~~. З артиклем або прикметником Genitiv видно: *die Bereitstellung **neuer** Laptops*.

### Порожні дієслова Nominalstil

Коли дія вже «сховалася» в іменник, реченню потрібне дієслово-носій. В офіційних текстах це *erfolgen, stattfinden, vornehmen, durchführen*:

| Nominalstil | Verbalstil |
|---|---|
| Die Auszahlung **erfolgt** am Monatsende. | Das Geld wird am Monatsende ausgezahlt. |
| Die Bank **nimmt** eine Prüfung **vor**. | Die Bank prüft. |
| Die Wahl **findet** im Mai **statt**. | Im Mai wird gewählt. |
| Die Befragung wurde online **durchgeführt**. | Man hat die Leute online befragt. |

## Зворотний шлях: Amtsdeutsch простою мовою

Лист з установи легше зрозуміти, якщо «розморозити» іменники назад у дієслова. Алгоритм:

1. Знайди **іменники дії** (*-ung, -nahme, -gabe*, субстантивований інфінітив).
2. Спитай: **хто** це робить і **що** з чим? Genitiv після іменника зазвичай стає додатком.
3. Заміни прийменник на сполучник: *bei → wenn, nach → nachdem, vor → bevor, trotz → obwohl, zur / zwecks → um … zu / damit, durch → indem*.

| Amtsdeutsch | Простою мовою |
|---|---|
| Die **Inanspruchnahme** der Leistung setzt die vorherige **Beantragung** voraus. | **Wer** die Leistung **nutzen** will, **muss** sie vorher **beantragen**. |
| **Nach Prüfung** Ihrer Unterlagen erhalten Sie einen Bescheid. | **Wenn wir** Ihre Unterlagen **geprüft haben**, bekommen Sie einen Bescheid. |
| **Zur Vermeidung** von Wartezeiten bitten wir um Terminvereinbarung. | **Damit** Sie nicht lange **warten müssen**, vereinbaren Sie bitte einen Termin. |
| **Bei Wegfall** der Voraussetzungen ist die Leistung zurückzuzahlen. | **Wenn** die Voraussetzungen **wegfallen**, müssen Sie das Geld zurückzahlen. |

## Ланцюжки Genitiv і як їх розвантажити

Кожна номіналізація тягне за собою Genitiv, і легко отримати «вагончики»: *die Überprüfung **der Einhaltung der Vorschriften des Datenschutzes***. Граматично це правильно, але вже третій Genitiv читач тримає в голові з зусиллям. Порадники зі стилю радять зазвичай не більше двох Genitiv поспіль.

> [!diagram] Genitivkette і три способи її розвантажити
> ```yaml
> layout: compare
> columns: { a: "ланцюжок", b: "розвантажено" }
> nodes:
>   - { id: a1, col: a, label: "вихідна фраза", text: "die Überprüfung der Einhaltung der Vorschriften des Datenschutzes", tone: gray }
>   - { id: b1, col: b, label: "складне слово", text: "die Überprüfung der Einhaltung der Datenschutzvorschriften", tone: yellow }
>   - { id: b2, col: b, label: "прикметник", text: "die Überprüfung der Einhaltung datenschutzrechtlicher Vorschriften", tone: yellow }
>   - { id: b3, col: b, label: "підрядне речення", text: "die Überprüfung, ob die Datenschutzvorschriften eingehalten werden", tone: pink }
> steps:
>   - { focus: a1, note: "Три Genitiv поспіль: der Einhaltung → der Vorschriften → des Datenschutzes. Читач губить, що від чого залежить." }
>   - { focus: b1, note: "Спосіб 1: зробити з двох іменників складне слово — Datenschutzvorschriften. Мінус один Genitiv." }
>   - { focus: b2, note: "Спосіб 2: перетворити Genitiv на прикметник — datenschutzrechtlich. Теж мінус один ланцюжок." }
>   - { focus: b3, note: "Спосіб 3: повернути одну дію в дієслово — ob … eingehalten werden. Найлегше читається, але довше." }
> ```

## Коли який стиль

| Nominalstil доречний | Verbalstil кращий |
|---|---|
| наукова стаття, реферат, тези | лист чи e-mail конкретній людині |
| закон, договір, інструкція | розмова, доповідь, презентація вголос |
| заголовки, слайди, таблиці, протоколи | пояснення складного для неспеціаліста |
| коли важливий **результат**, а не виконавець | коли важливо, **хто** що робить |

Тест на доречність: прочитай речення вголос. Якщо ти так ніколи б не сказав людині — а текст для людини, — поверни хоча б одне дієслово.

## Приклади

- **Nach erfolgter Prüfung** der Unterlagen erhalten Sie einen Bescheid. — Після перевірки документів ви отримаєте рішення.
- **Die Bereitstellung** zusätzlicher Mittel ist für 2027 vorgesehen. — Виділення додаткових коштів передбачено на 2027 рік.
- **Die Auswertung** der Daten **erfolgt** anonym. — Дані опрацьовують анонімно.
- **Bei Nichteinhaltung** der Frist entfällt der Anspruch. — Якщо не дотриматися строку, право втрачається.
- **Mit dem Inkrafttreten** des Gesetzes **fällt** die alte Regel **weg**. — З набуттям чинності закону старе правило скасовується.
- **Die Abschaffung** der Gebühren wurde vom Stadtrat beschlossen. — Скасування зборів ухвалила міська рада.
- **Die Prüfung** der Anträge **durch das Amt** dauert sechs Wochen. — Установа розглядає заяви шість тижнів.
- **Die Teilnahme am** Kurs ist kostenlos. — Участь у курсі безкоштовна.
- **Zur Vermeidung** von Missverständnissen fasse ich kurz zusammen. — Щоб уникнути непорозумінь, коротко підсумую.
- **Die Wiederaufnahme** der Verhandlungen ist für Montag geplant. — Відновлення переговорів заплановане на понеділок.

## Слова

> [!word] der Nominalstil
> ipa: /nomiˈnaːlʃtiːl/ · pos: noun · level: C1 · id: de-c1-nominalstil-w01
> uk: номінальний стиль (стиль з перевагою іменників)
> forms: — (без множини)
> example: Wissenschaftliche Texte sind oft im **Nominalstil** geschrieben. — Наукові тексти часто написані в номінальному стилі.
> note: антонім — der Verbalstil. Зневажливо про надмір іменників: die Substantivitis.

> [!word] die Inanspruchnahme
> ipa: /ɪnˈʔanʃpʁʊxnaːmə/ · pos: noun · level: C1 · id: de-c1-nominalstil-w02
> uk: користування (послугою); звернення по (допомогу)
> forms: die Inanspruchnahmen
> example: Die **Inanspruchnahme** der Beratung ist kostenlos. — Консультація безкоштовна.
> note: від in Anspruch nehmen; пишеться разом, наголос на -an-. Простіше: die Nutzung.

> [!word] die Bereitstellung
> ipa: /bəˈʁaɪ̯tʃtɛlʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w03
> uk: надання; виділення (коштів, ресурсів)
> forms: die Bereitstellungen (рідко)
> example: Die Stadt plant die **Bereitstellung** neuer Kitaplätze. — Місто планує створити нові місця в дитсадках.
> note: від bereitstellen (надавати, готувати до використання).

> [!word] die Feststellung
> ipa: /ˈfɛstʃtɛlʊŋ/ · pos: noun · level: B2 · id: de-c1-nominalstil-w04
> uk: констатація; висновок; встановлення (факту)
> forms: die Feststellungen
> example: Die **Feststellung** der Identität dauert nur wenige Minuten. — Встановлення особи триває лише кілька хвилин.
> note: від feststellen. Також: Er machte die Feststellung, dass … — він зауважив, що …

> [!word] die Vermeidung
> ipa: /fɛɐ̯ˈmaɪ̯dʊŋ/ · pos: noun · level: B2 · id: de-c1-nominalstil-w05
> uk: уникнення; запобігання
> forms: die Vermeidungen
> example: **Zur Vermeidung** von Fehlern lesen Sie bitte die Hinweise. — Щоб уникнути помилок, прочитайте, будь ласка, вказівки.
> note: від vermeiden → vermied → hat vermieden. Zur Vermeidung von … = um … zu vermeiden.

> [!word] die Beseitigung
> ipa: /bəˈzaɪ̯tɪɡʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w06
> uk: усунення; ліквідація (недоліку, відходів)
> forms: die Beseitigungen (рідко)
> example: Der Vermieter ist für die **Beseitigung** der Mängel zuständig. — Орендодавець відповідає за усунення недоліків.
> note: від beseitigen; типово: die Beseitigung von Mängeln / Schäden / Abfall.

> [!word] die Ermittlung
> ipa: /ɛɐ̯ˈmɪtlʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w07
> uk: встановлення; визначення (даних); у мн. — слідство, розслідування
> forms: die Ermittlungen
> example: Die Polizei hat die **Ermittlungen** aufgenommen. — Поліція розпочала розслідування.
> note: від ermitteln; die Ermittlung der Kosten — визначення (розрахунок) витрат.

> [!word] die Beantragung
> ipa: /bəˈʔantʁaːɡʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w08
> uk: подання заяви (на щось); клопотання
> forms: die Beantragungen
> example: Für die **Beantragung** des Visums brauchen Sie einen Termin. — Щоб подати заяву на візу, потрібен запис.
> note: від beantragen; простіше: einen Antrag stellen.

> [!word] die Vergabe
> ipa: /fɛɐ̯ˈɡaːbə/ · pos: noun · level: C1 · id: de-c1-nominalstil-w09
> uk: надання; розподіл (місць, замовлень, премій)
> forms: die Vergaben
> example: Die **Vergabe** der Studienplätze erfolgt online. — Розподіл місць для навчання відбувається онлайн.
> note: від vergeben; die Auftragsvergabe — розподіл (державних) замовлень.

> [!word] die Erteilung
> ipa: /ɛɐ̯ˈtaɪ̯lʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w10
> uk: видача (дозволу); надання (інформації, права)
> forms: die Erteilungen
> example: Die **Erteilung** der Aufenthaltserlaubnis kann einige Wochen dauern. — Видача дозволу на проживання може тривати кілька тижнів.
> note: від erteilen: eine Genehmigung / Auskunft / Erlaubnis erteilen.

> [!word] die Auswertung
> ipa: /ˈaʊ̯sveːɐ̯tʊŋ/ · pos: noun · level: B2 · id: de-c1-nominalstil-w11
> uk: аналіз; опрацювання (даних)
> forms: die Auswertungen
> example: Die **Auswertung** der Umfrage zeigt klare Trends. — Аналіз опитування показує чіткі тенденції.
> note: від auswerten; ʔ тут немає: aus- + werten, наголос на aus-.

> [!word] die Durchsetzung
> ipa: /ˈdʊʁçzɛtsʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w12
> uk: втілення; забезпечення виконання (закону, вимоги)
> forms: die Durchsetzungen (рідко)
> example: Die **Durchsetzung** des Rauchverbots ist schwierig. — Забезпечити дотримання заборони куріння важко.
> note: від durchsetzen (відокремлюване: Er setzt sich durch — він домагається свого). Наголос на durch-.

> [!word] die Einhaltung
> ipa: /ˈaɪ̯nhaltʊŋ/ · pos: noun · level: B2 · id: de-c1-nominalstil-w13
> uk: дотримання (правил, строків)
> forms: die Einhaltungen
> example: Wir bitten um **Einhaltung** der Frist. — Просимо дотримуватися строку.
> note: від einhalten (einen Termin / eine Regel einhalten). Заперечення — die Nichteinhaltung.

> [!word] die Abschaffung
> ipa: /ˈapʃafʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w14
> uk: скасування; ліквідація
> forms: die Abschaffungen (рідко)
> example: Die Partei fordert die **Abschaffung** der Studiengebühren. — Партія вимагає скасувати плату за навчання.
> note: від abschaffen → schaffte ab → hat abgeschafft.

> [!word] die Verringerung
> ipa: /fɛɐ̯ˈʁɪŋəʁʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w15
> uk: зменшення; скорочення
> forms: die Verringerungen
> example: Ziel ist eine **Verringerung** der Emissionen um 30 Prozent. — Мета — скоротити викиди на 30 відсотків.
> note: від verringern (← gering). Синоніми: die Reduzierung, die Senkung.

> [!word] die Zustimmung
> ipa: /ˈtsuːʃtɪmʊŋ/ · pos: noun · level: B2 · id: de-c1-nominalstil-w16
> uk: згода; схвалення
> forms: die Zustimmungen
> example: Für den Umbau brauchen Sie die **Zustimmung** des Vermieters. — Для перепланування потрібна згода орендодавця.
> note: від zustimmen (+ Dat); у Nominalstil — die Zustimmung **zu** + Dat: die Zustimmung zum Vertrag.

> [!word] die Erläuterung
> ipa: /ɛɐ̯ˈlɔʏ̯təʁʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w17
> uk: пояснення; коментар
> forms: die Erläuterungen
> example: Die **Erläuterungen** zum Formular finden Sie auf Seite 2. — Пояснення до форми — на сторінці 2.
> note: від erläutern (пояснювати докладно). eu = [ɔʏ̯].

> [!word] die Abwägung
> ipa: /ˈapvɛːɡʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w18
> uk: зважування (аргументів); вибір між інтересами
> forms: die Abwägungen
> example: Nach sorgfältiger **Abwägung** haben wir uns dagegen entschieden. — Після ретельного зважування ми вирішили відмовитися.
> note: від abwägen (das Für und Wider abwägen). Типово для права й наукових есе: eine Abwägung der Interessen.

> [!word] das Inkrafttreten
> ipa: /ɪnˈkʁafttʁeːtn̩/ · pos: noun · level: C1 · id: de-c1-nominalstil-w19
> uk: набуття чинності
> forms: — (без множини)
> example: Seit dem **Inkrafttreten** des Gesetzes gelten neue Regeln. — Відколи закон набув чинності, діють нові правила.
> note: субстантивована сполука in Kraft treten — пишеться разом і з великої. Дієслівну сполуку див. у темі B2-23.

> [!word] die Wiederaufnahme
> ipa: /viːdɐˈʔaʊ̯fnaːmə/ · pos: noun · level: C1 · id: de-c1-nominalstil-w20
> uk: відновлення (роботи, переговорів, процесу)
> forms: die Wiederaufnahmen
> example: Die **Wiederaufnahme** des Zugverkehrs ist für Freitag geplant. — Відновлення руху поїздів заплановане на пʼятницю.
> note: від wieder aufnehmen; у праві: die Wiederaufnahme des Verfahrens — перегляд справи.

> [!word] die Bekanntgabe
> ipa: /bəˈkantɡaːbə/ · pos: noun · level: C1 · id: de-c1-nominalstil-w21
> uk: оголошення; оприлюднення
> forms: die Bekanntgaben
> example: Die **Bekanntgabe** der Ergebnisse erfolgt am Montag. — Результати оголосять у понеділок.
> note: від bekannt geben (пишеться окремо або bekanntgeben).

> [!word] die Verabschiedung
> ipa: /fɛɐ̯ˈʔapʃiːdʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w22
> uk: ухвалення (закону, бюджету); прощання, проводи
> forms: die Verabschiedungen
> example: Nach der **Verabschiedung** im Bundestag muss noch der Bundesrat zustimmen. — Після ухвалення в Бундестазі ще має погодитися Бундесрат.
> note: від verabschieden: ein Gesetz verabschieden (ухвалити) і sich verabschieden (попрощатися).

> [!word] die Aufhebung
> ipa: /ˈaʊ̯fheːbʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w23
> uk: скасування (заборони, рішення); зняття
> forms: die Aufhebungen
> example: Die **Aufhebung** der Maskenpflicht wurde im Radio bekannt gegeben. — Про скасування обовʼязку носити маски оголосили по радіо.
> note: від aufheben (скасовувати; також «піднімати», «зберігати»).

> [!word] der Wegfall
> ipa: /ˈvɛkfal/ · pos: noun · level: C1 · id: de-c1-nominalstil-w24
> uk: скасування; зникнення; відпадання (умови)
> forms: — (без множини)
> example: Der **Wegfall** der Gebühren entlastet viele Familien. — Скасування зборів полегшує життя багатьом родинам.
> note: від wegfallen (ist weggefallen). In Wegfall kommen — бюрократично «відпасти».

> [!word] die Nichteinhaltung
> ipa: /ˈnɪçtʔaɪ̯nhaltʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w25
> uk: недотримання; порушення (строку, правил)
> forms: die Nichteinhaltungen
> example: Bei **Nichteinhaltung** der Frist wird ein Bußgeld fällig. — У разі недотримання строку доведеться сплатити штраф.
> note: Nicht- + іменник — типове заперечення в Nominalstil: das Nichterscheinen, die Nichtbeachtung.

> [!word] die Inbetriebnahme
> ipa: /ɪnbəˈtʁiːpnaːmə/ · pos: noun · level: C1 · id: de-c1-nominalstil-w26
> uk: введення в експлуатацію; запуск
> forms: die Inbetriebnahmen
> example: Vor der **Inbetriebnahme** lesen Sie bitte die Anleitung. — Перед першим увімкненням прочитайте, будь ласка, інструкцію.
> note: від in Betrieb nehmen (B2-23). Часто в інструкціях до техніки.

> [!word] die Fertigstellung
> ipa: /ˈfɛʁtɪçʃtɛlʊŋ/ · pos: noun · level: C1 · id: de-c1-nominalstil-w27
> uk: завершення (будівництва, роботи)
> forms: die Fertigstellungen
> example: Die **Fertigstellung** des Bahnhofs verzögert sich um zwei Jahre. — Завершення будівництва вокзалу затримується на два роки.
> note: від fertigstellen (пишеться разом); -ig = [ɪç].

> [!word] die Verständlichkeit
> ipa: /fɛɐ̯ˈʃtɛntlɪçkaɪ̯t/ · pos: noun · level: C1 · id: de-c1-nominalstil-w28
> uk: зрозумілість
> forms: die Verständlichkeiten (рідко)
> example: Die **Verständlichkeit** von Behördenbriefen soll verbessert werden. — Зрозумілість листів з установ мають покращити.
> note: від verständlich (← verstehen). Пара: die Lesbarkeit — легкість читання.

> [!word] erfolgen
> ipa: /ɛɐ̯ˈfɔlɡn̩/ · pos: verb · level: B2 · id: de-c1-nominalstil-w29
> uk: відбуватися; здійснюватися (офіційно)
> forms: erfolgen → erfolgte → ist erfolgt
> example: Die Zahlung **erfolgt** per Überweisung. — Оплата здійснюється банківським переказом.
> note: «порожнє» дієслово Nominalstil: підмет — іменник дії. Як означення: nach erfolgter Zahlung — після здійснення оплати.

> [!word] vornehmen
> ipa: /ˈfoːɐ̯neːmən/ · pos: verb · level: C1 · id: de-c1-nominalstil-w30
> uk: здійснювати; проводити (офіційно); sich etw. vornehmen — поставити собі за мету
> forms: vornehmen → nahm vor → hat vorgenommen (er nimmt vor)
> example: Die Werkstatt **nimmt** die Reparatur bis Freitag **vor**. — Майстерня виконає ремонт до пʼятниці.
> note: Änderungen / eine Prüfung / Korrekturen vornehmen. Розмовно: Ich habe mir vorgenommen, mehr Sport zu machen.

## Слухаємо

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-nominalstil-l01
> audio: Bei Nichteinhaltung der Frist wird der Antrag abgelehnt.
> explain: Nichteinhaltung — одне слово з великої; після bei артикль випадає.

> [!listen] Що ти почув?
> level: C1 · type: choice · id: de-c1-nominalstil-l02
> audio: Nach Fertigstellung des Gebäudes erfolgt die Inbetriebnahme.
> - [ ] Nach Fertigstellung des Gebäudes erfolgte die Inbetriebnahme.
> - [x] Nach Fertigstellung des Gebäudes erfolgt die Inbetriebnahme.
> - [ ] Nach der Fertigstellung der Gebäude erfolgt die Inbetriebnahme.

> [!listen] Послухай автовідповідач Wohngeldstelle. Що треба зробити, щоб отримати гроші швидше?
> level: C1 · type: answer · id: de-c1-nominalstil-l03
> audio: Die Auszahlung des Wohngeldes erfolgt nach Prüfung der eingereichten Unterlagen. Bei fehlenden Nachweisen verzögert sich die Bearbeitung. Zur Vermeidung von Wartezeiten reichen Sie bitte alle Nachweise vollständig ein.
> - [ ] записатися на особисту зустріч
> - [x] подати всі підтверджувальні документи повністю
> - [ ] зателефонувати ще раз через тиждень
> - [ ] подати нову заяву на житлову допомогу
>
> **Пояснення:** простою мовою: гроші виплатять, коли перевірять документи; якщо чогось бракує (*bei fehlenden Nachweisen*), розгляд затягнеться; щоб не чекати (*zur Vermeidung von Wartezeiten*), подайте всі документи повністю (*vollständig einreichen*).

## Вимова

У Nominalstil багато довгих іменників, і наголос у них не завжди на першому складі: *In**an**spruchnahme*, *Inbe**trieb**nahme*, *Wieder**auf**nahme*, *Ver**ab**schiedung*. Префікси *be-, er-, ver-* ненаголошені. Перед голосним кореня після префікса чути легкий поштовх [ʔ]: *Be|antragung* [bəˈʔantʁaːɡʊŋ].

> [!speak] Скажи вголос
> level: C1 · id: de-c1-nominalstil-s01
> text: Die Auszahlung erfolgt am Monatsende.
> ipa: /diː ˈaʊ̯stsaːlʊŋ ɛɐ̯ˈfɔlkt am ˈmoːnatsʔɛndə/
> tip: Auszahlung — z = [ts], довге [aː]; erfolgt — g перед t = [k]. Monatsende — наголос на Mo-, легкий поштовх перед -ende.
> uk: Виплата здійснюється в кінці місяця.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-nominalstil-s02
> text: Bei Nichteinhaltung der Frist entfällt der Anspruch.
> ipa: /baɪ̯ ˈnɪçtʔaɪ̯nhaltʊŋ deːɐ̯ fʁɪst ɛntˈfɛlt deːɐ̯ ˈanʃpʁʊx/
> tip: Nicht|einhaltung — поштовх [ʔ] перед ein-, не зливай «ніхтайн». Anspruch — sp = [ʃp], кінцеве ch = [x].
> uk: У разі недотримання строку право втрачається.

> [!speak] Скажи вголос — те саме, але по-людськи
> level: C1 · id: de-c1-nominalstil-s03
> text: Könnten Sie meinen Antrag bitte schnell bearbeiten?
> ipa: /ˈkœntn̩ ziː ˈmaɪ̯nən ˈantʁaːk ˈbɪtə ʃnɛl bəˈʔaʁbaɪ̯tn̩/
> tip: Verbalstil у проханні звучить ввічливіше й природніше за «um schnelle Bearbeitung meines Antrags». bearbeiten — [ʔ] після be-; Antrag — кінцеве g = [k].
> uk: Чи не могли б ви швидко розглянути мою заяву?

## Типові помилки українців

> [!pitfall] Прийменник зник: ~~die Teilnahme des Kurses~~
> Якщо дієслово має прийменниковий додаток, **прийменник лишається** й в іменнику: *an etwas teilnehmen → die Teilnahme **am** Kurs*, *auf etwas verzichten → der Verzicht **auf** das Auto*, *sich für etwas entscheiden → die Entscheidung **für** …*. Genitiv замість прийменника (~~die Teilnahme des Kurses~~, ~~der Verzicht des Autos~~) змінює або руйнує значення. Те саме з Dativ: *zustimmen + Dat → die Zustimmung **zu***.

> [!pitfall] Два Genitiv на один іменник: ~~die Prüfung des Amtes der Anträge~~
> Виконавця й обʼєкт не можна обидва поставити в Genitiv. Обʼєкт лишається в Genitiv, виконавець отримує **durch** (або офіційне *seitens*): *die Prüfung der Anträge **durch das Amt***. Якщо виконавець — особа, часто зручніше присвійне: *seine Prüfung der Anträge*.

> [!pitfall] Український канцелярит у німецькому листі
> Українські офіційні тексти теж люблять іменники: «здійснення оплати», «проведення перевірки», «надання відповіді». Перенесення цього стилю в e-mail колезі дає ~~Ich bitte um die Vornahme der Überprüfung meiner Unterlagen~~ — граматично можливо, але звучить як постанова. Людині пиши дієсловами: *Könnten Sie bitte meine Unterlagen prüfen?* Nominalstil лиши для звіту й протоколу.

> [!pitfall] Genitiv без артикля в множині: ~~die Bereitstellung Laptops~~
> В українській родовий видно завжди («надання ноутбуків»), а в німецькій у множині без артикля Genitiv **невидимий**, тому потрібне **von**: *die Bereitstellung **von** Laptops*. Якщо є прикметник, Genitiv знову видно: *die Bereitstellung **neuer** Laptops*.

## Практика

> [!quiz] «Die Stadt baut die Radwege aus.» → Nominalstil
> level: C1 · type: single · id: de-c1-nominalstil-q02
> - [x] der Ausbau der Radwege durch die Stadt
> - [ ] der Ausbau der Stadt der Radwege
> - [ ] der Ausbau die Radwege von der Stadt
> - [ ] der Ausbau den Radwegen der Stadt
>
> **Пояснення:** обʼєкт (*die Radwege*) → Genitiv *der Radwege*; виконавець (*die Stadt*) → *durch die Stadt*. Два Genitiv поспіль (*der Stadt der Radwege*) не розрізняють, хто що робить; Nominativ і Dativ після іменника неможливі.

> [!quiz] «Wir verzichten auf das Auto.» → Nominalstil
> level: C1 · type: single · id: de-c1-nominalstil-q03
> - [x] der Verzicht auf das Auto
> - [ ] der Verzicht des Autos
> - [ ] der Verzicht vom Auto
> - [ ] der Verzicht dem Auto
>
> **Пояснення:** *verzichten **auf** + Akk* → *der Verzicht **auf** + Akk*. Прийменник дієслова зберігається; Genitiv тут означав би, що від чогось відмовилася машина.

> [!quiz] Які іменні групи правильні?
> level: C1 · type: multi · id: de-c1-nominalstil-q04
> - [x] die Teilnahme am Kurs
> - [x] die Zustimmung zum Vertrag
> - [ ] die Teilnahme des Kurses
> - [x] die Abhängigkeit vom Öl
> - [ ] die Zustimmung des Vertrags
>
> **Пояснення:** *teilnehmen an → die Teilnahme an*, *zustimmen + Dat → die Zustimmung zu*, *abhängig von → die Abhängigkeit von*. *Die Zustimmung des Vertrags* означало б, що згоду дає сам договір.

> [!quiz] «Man muss die Unterlagen vollständig einreichen.» → Nominalstil
> level: C1 · type: single · id: de-c1-nominalstil-q05
> - [x] Es besteht die Pflicht zur vollständigen Einreichung der Unterlagen.
> - [ ] Es besteht die Möglichkeit zur vollständigen Einreichung der Unterlagen.
> - [ ] Es besteht die Pflicht zur vollständig Einreichung der Unterlagen.
> - [ ] Es besteht die Pflicht zur vollständigen Einreichung den Unterlagen.
>
> **Пояснення:** *müssen* → *die Pflicht* (*Möglichkeit* = *können*); прислівник *vollständig* → прикметник із закінченням (*zur vollständigen*); додаток → Genitiv *der Unterlagen*.

> [!quiz] Що означає «nach erfolgter Zahlung»?
> level: C1 · type: single · id: de-c1-nominalstil-q06
> - [x] після того, як оплату здійснено
> - [ ] якщо оплата буде успішною
> - [ ] до здійснення оплати
> - [ ] замість оплати
>
> **Пояснення:** *erfolgt* — Partizip II від *erfolgen* (відбутися) як означення: «після оплати, що вже відбулася». Не плутай з *erfolgreich* (успішний).

> [!quiz] Ти пишеш колезі, з якою на du. Що звучить природно?
> level: C1 · type: single · id: de-c1-nominalstil-q07
> - [x] Kannst du mir bis Freitag sagen, ob du einverstanden bist?
> - [ ] Ich bitte um Mitteilung deiner Zustimmung bis Freitag.
> - [ ] Um Bekanntgabe deiner Zustimmung wird bis Freitag gebeten.
> - [ ] Die Erteilung deiner Zustimmung hat bis Freitag zu erfolgen.
>
> **Пояснення:** граматично правильні всі чотири, але *du* й Nominalstil не поєднуються: три останні варіанти звучать як лист з установи (а останній — як наказ). Колезі — дієсловами: *sagen, ob du einverstanden bist*.

> [!quiz] Перетвори в Nominalstil (дієслово в дужках)
> level: C1 · type: fill · id: de-c1-nominalstil-q08
>
> ```text fill
> Wenn man die Regeln nicht einhält → Bei [[Nichteinhaltung]] der Regeln (einhalten)
> Nachdem das Gebäude fertiggestellt wurde → Nach [[Fertigstellung]] des Gebäudes (fertigstellen)
> Bevor das Gesetz in Kraft tritt → Vor dem [[Inkrafttreten]] des Gesetzes (in Kraft treten)
> Indem man die Kosten verringert → Durch die [[Verringerung]] der Kosten (verringern)
> ```
>
> **Пояснення:** *nicht* → префікс *Nicht-*; *fertigstellen → die Fertigstellung*; сталу сполуку *in Kraft treten* номіналізуємо як субстантивований інфінітив *das Inkrafttreten* (разом); *verringern → die Verringerung*. Усі іменники — з великої.

> [!quiz] Розшифруй Amtsdeutsch: допиши Verbalstil
> level: C1 · type: fill · bank: Weil, genommen, Damit · id: de-c1-nominalstil-q09
>
> ```text fill
> Bei Inanspruchnahme der Leistung … → Wenn Sie die Leistung in Anspruch [[nehmen]], …
> Nach Prüfung der Unterlagen … → Nachdem wir die Unterlagen [[geprüft]] haben, …
> Trotz Ablehnung des Antrags … → [[Obwohl]] der Antrag abgelehnt wurde, …
> Zur Vermeidung von Fehlern … → [[Um]] Fehler zu vermeiden, …
> ```
>
> **Пояснення:** *bei → wenn* (*in Anspruch nehmen* у теперішньому часі); *nach → nachdem* + Perfekt (*geprüft haben*); *trotz → obwohl*; *zur Vermeidung → um … zu*. *Damit* вимагав би підрядного без *zu* (*damit keine Fehler entstehen*), *Weil* — причини, а *genommen* без *haben* не утворює форми.

> [!quiz] Склади речення в Nominalstil: «Гроші виплачують після перевірки документів»
> level: C1 · type: order · id: de-c1-nominalstil-q10
>
> ```text order
> Die Auszahlung
> erfolgt
> nach Prüfung
> der Unterlagen.
> erfolgen ✗
> ```
>
> **Пояснення:** підмет — іменник дії *die Auszahlung*, дієслово-носій *erfolgt* (3-тя особа однини) на другому місці, далі прийменникова група з Genitiv.

> [!quiz] Склади речення в Verbalstil: «Якщо ви не дотримаєтеся строку, заяву відхилять»
> level: C1 · type: order · id: de-c1-nominalstil-q11
>
> ```text order
> Wenn Sie
> die Frist
> nicht einhalten,
> wird der Antrag
> abgelehnt.
> Bei ✗
> ```
>
> **Пояснення:** підрядне з *wenn* (дієслово в кінці: *nicht einhalten*), потім головне — дієслово *wird* одразу після коми. *Bei* можливий лише з іменником (*Bei Nichteinhaltung …*).

> [!quiz] Які варіанти розвантажують ланцюжок «die Überprüfung der Einhaltung der Vorschriften des Datenschutzes» і граматично правильні?
> level: C1 · type: multi · id: de-c1-nominalstil-q12
> - [x] die Überprüfung der Einhaltung der Datenschutzvorschriften
> - [x] die Überprüfung, ob die Datenschutzvorschriften eingehalten werden
> - [ ] die Überprüfung die Einhaltung der Datenschutzvorschriften
> - [ ] die Überprüfung, ob die Datenschutzvorschriften einhalten werden
>
> **Пояснення:** складне слово *Datenschutzvorschriften* прибирає один Genitiv; підрядне з *ob* повертає дію в дієслово. Після іменника потрібен Genitiv (*der Einhaltung*), а не Nominativ; пасив — *eingehalten werden* з Partizip II.

> [!quiz] «Die Bank nimmt eine Prüfung vor.» — що це означає простою мовою?
> level: C1 · type: single · id: de-c1-nominalstil-q13
> - [x] Die Bank prüft.
> - [ ] Die Bank nimmt die Prüfung an.
> - [ ] Die Bank bereitet eine Prüfung vor.
> - [ ] Die Bank lehnt die Prüfung ab.
>
> **Пояснення:** *vornehmen* — порожнє дієслово Nominalstil: *eine Prüfung vornehmen = prüfen*, *Änderungen vornehmen = ändern*. Його легко сплутати з *vorbereiten* (готувати) через схожий префікс.

> [!quiz] «Die Firma stellt den Mitarbeitern Laptops bereit.» → Nominalstil
> level: C1 · type: single · id: de-c1-nominalstil-q14
> - [x] die Bereitstellung von Laptops für die Mitarbeiter
> - [ ] die Bereitstellung der Mitarbeiter von Laptops
> - [ ] die Bereitstellung den Mitarbeitern der Laptops
> - [ ] die Bereitstellung Laptops den Mitarbeitern
>
> **Пояснення:** дативний додаток (*den Mitarbeitern*) → **für** + Akk; обʼєкт у множині без артикля — Genitiv не видно, тож **von Laptops**. *Die Bereitstellung der Mitarbeiter* означало б, що «надають» самих працівників.

> [!quiz] Заповни: модальність і заперечення в Nominalstil
> level: C1 · type: fill · bank: Erlaubnis, Absicht, Erscheinen · id: de-c1-nominalstil-q15
>
> ```text fill
> Man kann online teilnehmen. → Es besteht die [[Möglichkeit]] zur Online-Teilnahme.
> Man muss sich innerhalb von zwei Wochen melden. → Es besteht die [[Pflicht]] zur Meldung innerhalb von zwei Wochen.
> Dass er nicht erschienen ist, hat alle überrascht. → Sein [[Nichterscheinen]] hat alle überrascht.
> ```
>
> **Пояснення:** *können → die Möglichkeit*, *müssen → die Pflicht*, *nicht erscheinen → das Nichterscheinen*. *Erlaubnis* відповідає *dürfen*, *Absicht* — *wollen*, а *Erscheinen* втратило б заперечення.

> [!quiz] Де Nominalstil доречний?
> level: C1 · type: multi · id: de-c1-nominalstil-q16
> - [x] у науковій статті
> - [x] у тексті закону чи договору
> - [x] у газетному заголовку
> - [ ] у повідомленні другові в месенджері
> - [ ] в усній розповіді колезі про вихідні
>
> **Пояснення:** номінальний стиль стискає інформацію й ставить у центр результат — це потрібно в науці, праві й заголовках. У розмові й особистих повідомленнях він звучить штучно: там важливо, **хто** що робить.

## Фішки

> [!reel] 🦠 Substantivitis — «хвороба іменників»
> У Duden є жартівливо-зневажливе слово *die Substantivitis* — «надмірне вживання іменників». Утворене воно за зразком медичних назв на *-itis* (*Bronchitis*). Редактори газет і порадники зі стилю роками «лікують» її однаково: знайди іменник на *-ung* і спробуй повернути йому дієслово.

> [!reel] ♿ Leichte Sprache за законом
> Німецька постанова про безбарʼєрні сайти (BITV 2.0, § 4) вимагає, щоб на стартовій сторінці сайту публічної установи були пояснення німецькою жестовою мовою і *Leichte Sprache* — «легкою мовою» (особливий регламентований стиль із короткими реченнями; не плутати з *Einfache Sprache*). Іронія: сам параграф написаний класичним Amtsdeutsch — пояснення там «*bereitzustellen*».

> [!reel] 📰 Слово, яке прийшло з дієслівної сполуки
> *Das Inkrafttreten* — це вся сполука *in Kraft treten*, «зварена» в один іменник: три слова стали одним і отримали артикль *das*. Так само *die Inanspruchnahme* (*in Anspruch nehmen*) і *die Inbetriebnahme* (*in Betrieb nehmen*). Побачив такого «велетня» — розклади його назад на сполуку, і значення стане очевидним.

## Джерела та що почитати

- [DWDS — Nominalstil](https://www.dwds.de/wb/Nominalstil) — визначення й приклади вживання.
- [Duden — Nominalstil](https://www.duden.de/rechtschreibung/Nominalstil) — значення й антонім *Verbalstil*.
- [Duden — Substantivitis](https://www.duden.de/rechtschreibung/Substantivitis) — «übermäßiger Gebrauch von Hauptwörtern».
- [Wikipedia — Amtsdeutsch](https://de.wikipedia.org/wiki/Amtsdeutsch) — ознаки канцелярської мови й спроби її спростити.
- [Wikipedia — Leichte Sprache](https://de.wikipedia.org/wiki/Leichte_Sprache) — що таке *Leichte Sprache* («легка мова») і де її вживають.
- [BITV 2.0, § 4 (gesetze-im-internet.de)](https://www.gesetze-im-internet.de/bitv_2_0/__4.html) — вимога пояснень у Leichte Sprache на сайтах установ.
- [DWDS — Inanspruchnahme](https://www.dwds.de/wb/Inanspruchnahme) — значення й типові сполуки.
- [DWDS — erfolgen](https://www.dwds.de/wb/erfolgen) — відмінювання й уживання в офіційних текстах.

> [!important] Підсумок
> - Verbalstil → Nominalstil: сполучник → прийменник, дієслово → іменник дії, додаток → Genitiv, підмет → *durch* / *seitens* або зникає.
> - Прийменниковий додаток зберігає прийменник (*die Teilnahme am Kurs*); дативний отримує *für / zu*; прислівник стає прикметником; *nicht* → *Nicht-*; *müssen / können* → *Pflicht / Möglichkeit*.
> - Множина без артикля ховає Genitiv — бери *von*: *die Bereitstellung von Laptops*.
> - Порожні дієслова Nominalstil — *erfolgen, vornehmen, stattfinden, durchführen*; простою мовою їх замінює одне дієслово.
> - Більше двох Genitiv поспіль — сигнал розвантажити: складне слово, прикметник або підрядне речення.
> - Nominalstil — для науки, права й заголовків; людині пиши дієсловами.
