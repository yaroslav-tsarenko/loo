---
title: Письмо — особистий і офіційний лист, допис на форумі
id: de-b1-schreiben
level: B1
icon: px:mail
tags: [deutsch, b1, skills, schreiben, brief, email, forum, goethe]
prerequisites: ["[[Deutsch - A2 - 28. Читання й письмо — email, запрошення, форум]]", "[[Deutsch - B1 - 24. Мовні звороти B1 — думка, згода, незгода]]"]
estimatedMinutes: 45
---

# Письмо — особистий і офіційний лист, допис на форумі

> [!success] Після цієї теми ти зможеш
> - написати неформальну електронну пошту другові (≈ 80 слів), допис на форумі з власною думкою (≈ 80 слів) і коротку офіційну пошту (≈ 40 слів);
> - вибрати правильну *Anrede* і *Grußformel* для *du* та *Sie*;
> - використати звʼязки й готові звороти: *deshalb, außerdem, leider, Ich bitte um …, Könnten Sie …?*;
> - перевірити текст за критеріями Goethe-Zertifikat B1: Erfüllung, Kohärenz, Wortschatz, Strukturen.

## Передбач

> [!quiz] Ти пишеш у Ausländerbehörde пані Weber. Яка *Anrede* правильна?
> level: B1 · type: single · id: de-b1-schreiben-q01
> - [x] Sehr geehrte Frau Weber,
> - [ ] Sehr geehrter Frau Weber,
> - [ ] Sehr geehrte Weber,
> - [ ] Lieber Frau Weber,
>
> **Пояснення:** *Frau* — жіночий рід, тому *Sehr geehrte*. *Sehr geehrter* — для *Herr*. Імʼя без *Frau / Herr* у звертанні не вживаємо. *Lieber / Liebe* — для знайомих, яким ти кажеш *du*.

## Пояснення

### Три завдання Goethe-Zertifikat B1: Schreiben

Модуль *Schreiben* в іспиті Goethe-Zertifikat B1 триває **60 хвилин** і має три завдання. Тут ми розбираємо їхній формат і навчаємось писати такі тексти.

| Завдання | Тип тексту | Обсяг | Час | Бали |
|---|---|---|---|---|
| **1** | неформальна E-Mail (до друга, *du*) | ≈ 80 слів | 20 хв | 40 |
| **2** | допис із власною думкою (форум, гостьова книга) | ≈ 80 слів | 25 хв | 40 |
| **3** | коротка формальна E-Mail (*Sie*) | ≈ 40 слів | 15 хв | 20 |

Завдання 1 має три *Inhaltspunkte* (змістові пункти); офіційна підказка: пиши **до всіх трьох**. У завданні 3 не забудь *Anrede* і *Gruß* наприкінці. Модуль оцінюють за чотирма критеріями: **Erfüllung** (виконано завдання), **Kohärenz** (звʼязність), **Wortschatz** (лексика), **Strukturen** (граматика).

> [!diagram] Скелет будь-якого листа
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "1. Anrede", text: "Liebe Anna, / Sehr geehrte Frau Weber,", tone: yellow }
>   - { id: e, label: "2. Anlass", text: "Danke für … / Ich schreibe Ihnen, weil …", tone: pink }
>   - { id: h, label: "3. Hauptteil", text: "по одному пункту — один абзац", tone: yellow }
>   - { id: s, label: "4. Schluss", text: "Ich freue mich auf … / Ich bitte um …", tone: pink }
>   - { id: g, label: "5. Gruß + Name", text: "Liebe Grüße / Mit freundlichen Grüßen", tone: yellow }
> edges:
>   - { from: a, to: e }
>   - { from: e, to: h }
>   - { from: h, to: s }
>   - { from: s, to: g }
> steps:
>   - { focus: a, note: "Спочатку звертання. Воно задає регістр: du — Liebe Anna, Sie — Sehr geehrte Frau Weber." }
>   - { focus: e, note: "Одне речення про привід: подяка (Danke für deine Mail) або причина (Ich schreibe Ihnen, weil …)." }
>   - { focus: h, note: "Основна частина: розгляни кожен змістовий пункт. У Goethe B1 Aufgabe 1 — три пункти, тож три короткі блоки." }
>   - { focus: s, note: "Завершення: пропозиція, прохання або очікування відповіді." }
>   - { focus: g, note: "Привітання на кінці й імʼя. У Aufgabe 3 вони обовʼязкові." }
> ```
> Кольори тут чергують етапи; зміст — у підписах.

### formell чи informell

Регістр залежить від того, як ти звертаєшся до людини: *du* чи *Sie*. Усе інше підтягується до цього вибору.

> [!diagram] informell vs formell
> ```yaml
> layout: compare
> columns: { i: "informell (du)", f: "formell (Sie)" }
> nodes:
>   - { id: i1, col: i, label: "Anrede", text: "Liebe Anna, · Hallo Tim,", tone: yellow }
>   - { id: i2, col: i, label: "Anlass", text: "Danke für deine Mail!", tone: yellow }
>   - { id: i3, col: i, label: "Bitte / Vorschlag", text: "Hast du Lust, …? · Kannst du …?", tone: yellow }
>   - { id: i4, col: i, label: "Gruß", text: "Liebe Grüße · Viele Grüße", tone: yellow }
>   - { id: f1, col: f, label: "Anrede", text: "Sehr geehrte Frau Weber, · Sehr geehrte Damen und Herren,", tone: pink }
>   - { id: f2, col: f, label: "Anlass", text: "Ich schreibe Ihnen, weil …", tone: pink }
>   - { id: f3, col: f, label: "Bitte / Vorschlag", text: "Könnten Sie …? · Ich bitte um …", tone: pink }
>   - { id: f4, col: f, label: "Gruß", text: "Mit freundlichen Grüßen", tone: pink }
> steps:
>   - { focus: [i1, f1], note: "Звертання: Liebe Anna / Sehr geehrte Frau Weber. Якщо імʼя невідоме — Sehr geehrte Damen und Herren." }
>   - { focus: [i2, f2], note: "Привід: для друзів — Danke für deine Mail; для установ — Ich schreibe Ihnen, weil …" }
>   - { focus: [i3, f3], note: "Прохання: du — Kannst du …?, Sie — Könnten Sie …? (Konjunktiv II, тема B1-14)." }
>   - { focus: [i4, f4], note: "Привітання на кінці: Liebe Grüße / Mit freundlichen Grüßen." }
> ```
> Жовтий — неформальні, рожевий — формальні; регістр визначають слова, а не колір.

Правопис: у формальних листах *Sie, Ihr, Ihnen* пишемо **з великої**. У листах до друзів *du, dein* можна писати і з малої, і з великої (Duden, правило D 83).

### Неформальна пошта (Aufgabe 1)

Завдання містить три пункти. Зразок завдання (власний, за форматом іспиту):

> [!note] Завдання
> Ваш друг Tim подарував Вам рослину до новосілля, але не зміг прийти на вечірку. Напишіть йому електронного листа (≈ 80 слів): 1) подякуйте за подарунок і поясніть, чому він Вам подобається; 2) опишіть, як минула вечірка; 3) запропонуйте зустрітися.

> [!example] Зразок відповіді
> Hallo Tim,
> vielen Dank für die schöne Pflanze! Sie steht jetzt im Wohnzimmer am Fenster und gefällt mir sehr, weil sie die Wohnung freundlicher macht. Schade, dass du nicht zur Einweihungsparty kommen konntest. Es waren zwanzig Gäste da, wir haben gegessen, Musik gehört und bis Mitternacht getanzt. Alle haben sich wohlgefühlt. Hast du Lust, am Samstag zum Kaffee vorbeizukommen? Dann kannst du die Wohnung in Ruhe ansehen. Ich freue mich auf deine Antwort.
> Liebe Grüße
> Olena

Зверни увагу: кожен пункт має своє речення (*vielen Dank … weil …*, *Es waren … Gäste*, *Hast du Lust …*), є *weil* із дієсловом у кінці; складних конструкцій не потрібно — достатньо простих підрядних речень. Привітання й підпис — обовʼязкові.

### Допис із думкою (Aufgabe 2)

У форумі або гостьовій книзі ти реагуєш на тему. Структура: **позиція → причина → приклад → інший бік → підсумок** (див. тему B1-24).

> [!example] Зразок: «Чи потрібен дитині телефон у початковій школі?»
> Ich finde, dass Kinder in der Grundschule noch kein Handy brauchen. Meiner Meinung nach sollten sie zuerst lernen, miteinander zu spielen und zu sprechen. Ein Vorteil ist natürlich, dass Eltern ihre Kinder jederzeit erreichen können. Andererseits gibt es im Internet viele Dinge, die für Kinder nicht geeignet sind. Zum Beispiel können sie Videos sehen, die ihnen Angst machen. Deshalb bin ich dafür, dass Kinder erst mit zwölf Jahren ein eigenes Handy bekommen. Im Großen und Ganzen sollten die Eltern entscheiden, aber die Kinder brauchen klare Regeln.

У зразку немає *Anrede*: у форумі вона не обовʼязкова, допис починається з думки. Використано *dass* (дієслово в кінці), *Ein Vorteil ist, dass …*, *Andererseits*, *Zum Beispiel*, *Deshalb*, *Im Großen und Ganzen*.

### Коротка формальна пошта (Aufgabe 3)

Мета — чемно й коротко: вибачитися, пояснити, попросити. Зразок завдання: Ви не можете прийти на запис в Ausländerbehörde.

> [!example] Зразок: ≈ 40 слів
> Sehr geehrte Frau Weber,
> leider kann ich den Termin am Dienstag nicht wahrnehmen, weil ich krank bin. Ich bitte um Entschuldigung. Könnten wir einen neuen Termin vereinbaren? Ich bin ab nächster Woche wieder gesund.
> Mit freundlichen Grüßen
> Olena Kovalenko

### Звʼязки й корисні формули

| Функція | Формули |
|---|---|
| вибачитися | Es tut mir leid, dass … · Ich bitte um Entschuldigung. |
| пояснити причину | weil … · denn … · deshalb … |
| попросити | Ich bitte um … · Könnten Sie mir bitte …? |
| запропонувати | Wie wäre es, wenn …? · Hast du Lust, …? · Ich schlage vor, dass … |
| додати | außerdem · auch · dazu kommt, dass … |
| протиставити | aber · andererseits · trotzdem · leider |
| завершити | Ich freue mich auf … · Vielen Dank für Ihre Mühe. |

## Приклади

- Hallo Tim, vielen Dank für deine Mail! — Привіт, Тіме, дякую за твого листа!
- Sehr geehrte Frau Weber, ich schreibe Ihnen, weil ich eine Frage habe. — Шановна пані Вебер, я пишу Вам, бо маю запитання.
- Sehr geehrte Damen und Herren, ich möchte mich für den Kurs anmelden. — Шановні пані та панове, я хочу записатися на курс.
- Leider kann ich am Samstag nicht kommen. — На жаль, у суботу я не зможу прийти.
- Hast du Lust, am Sonntag ins Kino zu gehen? — Маєш охоту піти в неділю в кіно?
- Wie wäre es, wenn wir uns um 18 Uhr treffen? — А що, якби ми зустрілися о 18:00?
- Ich bitte um einen neuen Termin. — Прошу про нову дату.
- Könnten Sie mir bitte die Unterlagen schicken? — Чи могли б Ви надіслати мені документи?
- Außerdem ist es dort sehr günstig. — До того ж там дуже недорого.
- Ich freue mich auf deine Antwort. — Чекаю на твою відповідь.
- Mit freundlichen Grüßen (новий рядок) Olena Kovalenko — З повагою, Олена Коваленко.
- Liebe Grüße (новий рядок) Anna — Сердечні вітання, Анна.

## Слова

> [!word] die Einleitung
> ipa: /ˈaɪ̯nlaɪ̯tʊŋ/ · pos: noun · level: B1 · id: de-b1-schreiben-w01
> uk: вступ
> forms: die Einleitungen
> example: Die **Einleitung** besteht aus einem Satz. — Вступ складається з одного речення.
> note: Einleitung — початок тексту; завершення — der Schluss.

> [!word] der Absatz
> ipa: /ˈapzats/ · pos: noun · level: B1 · id: de-b1-schreiben-w02
> uk: абзац
> forms: die Absätze
> example: Pro Inhaltspunkt schreibe ich einen **Absatz**. — На кожен змістовий пункт я пишу абзац.
> note: також «підбор (взуття)» і «збут»; у тексті — абзац.

> [!word] die Anlage
> ipa: /ˈanlaːɡə/ · pos: noun · level: B1 · id: de-b1-schreiben-w03
> uk: додаток (до листа)
> forms: die Anlagen
> example: In der **Anlage** finden Sie meinen Lebenslauf. — У додатку Ви знайдете моє резюме.
> note: у e-mail частіше der Anhang. Також «споруда, обʼєкт».

> [!word] das Forum
> ipa: /ˈfoːʁʊm/ · pos: noun · level: B1 · id: de-b1-schreiben-w04
> uk: форум
> forms: die Foren
> example: Im **Forum** diskutieren viele Leute über das Thema. — На форумі багато людей обговорюють цю тему.
> note: множина die Foren (також Fora, рідко).

> [!word] die Stellungnahme
> ipa: /ˈʃtɛlʊŋnaːmə/ · pos: noun · level: B2 · id: de-b1-schreiben-w05
> uk: висловлювання, позиція (офіційна)
> forms: die Stellungnahmen
> example: Die Firma gibt eine **Stellungnahme** ab. — Фірма публікує свою позицію.
> note: Stellung nehmen (zu + Dativ) — висловити позицію.

> [!word] begründen
> ipa: /bəˈɡʁʏndn̩/ · pos: verb · level: B1 · id: de-b1-schreiben-w06
> uk: обґрунтувати
> forms: begründen → begründete → hat begründet
> example: Bitte **begründen** Sie Ihre Meinung. — Будь ласка, обґрунтуйте свою думку.
> note: Grund — причина; не відокремлюване.

> [!word] bestätigen
> ipa: /bəˈʃtɛːtɪɡn̩/ · pos: verb · level: B1 · id: de-b1-schreiben-w07
> uk: підтвердити
> forms: bestätigen → bestätigte → hat bestätigt
> example: Bitte **bestätigen** Sie den Termin per E-Mail. — Будь ласка, підтвердіть запис електронною поштою.
> note: ä довге [ɛː].

> [!word] schildern
> ipa: /ˈʃɪldɐn/ · pos: verb · level: B2 · id: de-b1-schreiben-w08
> uk: описати, розповісти докладно
> forms: schildern → schilderte → hat geschildert
> example: **Schildern** Sie bitte kurz die Situation. — Будь ласка, коротко опишіть ситуацію.
> note: sch = «ш»; більше про подію, ніж про предмет (описати предмет — beschreiben).

> [!word] formell
> ipa: /fɔʁˈmɛl/ · pos: adj · level: B1 · id: de-b1-schreiben-w09
> uk: офіційний, формальний
> example: Eine **formelle** E-Mail beginnt mit „Sehr geehrte …“. — Формальний лист починається зі «Sehr geehrte …».
> note: протилежність — informell. Не плутай з förmlich (церемонний).

> [!word] informell
> ipa: /ˈɪnfɔʁmɛl/ · pos: adj · level: B2 · id: de-b1-schreiben-w10
> uk: неформальний
> example: Unter Freunden schreibt man **informell**. — Між друзями пишуть неформально.
> note: наголос на першому складі (DWDS).

> [!word] das Anliegen
> ipa: /ˈanliːɡn̩/ · pos: noun · level: B2 · id: de-b1-schreiben-w11
> uk: справа, прохання
> forms: die Anliegen
> example: Ich habe ein **Anliegen** an Sie. — У мене до Вас справа.
> note: чемніше за Problem; Ihr Anliegen — Ваша справа.

> [!word] die Bitte
> ipa: /ˈbɪtə/ · pos: noun · level: A2 · id: de-b1-schreiben-w12
> uk: прохання
> forms: die Bitten
> example: Ich habe eine **Bitte**: Können Sie mir helfen? — У мене є прохання: чи можете Ви мені допомогти?
> note: Die Bitte um + Akk: eine Bitte um Hilfe.

> [!word] das Verständnis
> ipa: /fɛɐ̯ˈʃtɛntnɪs/ · pos: noun · level: B2 · id: de-b1-schreiben-w13
> uk: розуміння; поблажливість
> forms: — (без множини)
> example: Ich bitte um **Verständnis**. — Прошу про розуміння.
> note: Ich bitte um Verständnis — чемна форма прохання про поблажливість.

> [!word] die Beschwerde
> ipa: /bəˈʃveːɐ̯də/ · pos: noun · level: B1 · id: de-b1-schreiben-w14
> uk: скарга
> forms: die Beschwerden
> example: Ich möchte mich über die Lieferung **beschweren**. Das ist meine **Beschwerde**. — Я хочу поскаржитися на доставку. Це моя скарга.
> note: Beschwerden — ще й «недуги» (медичні скарги). sich beschweren (bei + Dativ).

> [!word] anhängen
> ipa: /ˈanhɛŋən/ · pos: verb · level: B1 · id: de-b1-schreiben-w15
> uk: прикріпити (файл)
> forms: anhängen → hängte an → hat angehängt
> example: Ich **hänge** das Foto an die Mail **an**. — Я прикріплюю фото до листа.
> note: відокремлюване: Ich hänge … an. У mail — der Anhang.

> [!word] weiterleiten
> ipa: /ˈvaɪ̯tɐlaɪ̯tn̩/ · pos: verb · level: B2 · id: de-b1-schreiben-w16
> uk: переслати далі
> forms: weiterleiten → leitete weiter → hat weitergeleitet
> example: Kannst du die Mail an Anna **weiterleiten**? — Можеш переслати лист Анні?
> note: відокремлюване: Ich leite die Mail weiter.

> [!word] ergänzen
> ipa: /ɛɐ̯ˈɡɛntsn̩/ · pos: verb · level: B2 · id: de-b1-schreiben-w17
> uk: доповнити
> forms: ergänzen → ergänzte → hat ergänzt
> example: Ich möchte noch etwas **ergänzen**. — Я хочу ще дещо додати.
> note: z у -zen = [ts].

> [!word] zusammenfassen
> ipa: /tsuˈzamənfasn̩/ · pos: verb · level: B2 · id: de-b1-schreiben-w18
> uk: підсумувати
> forms: zusammenfassen → fasste zusammen → hat zusammengefasst
> example: Zum Schluss **fasse** ich kurz **zusammen**. — Наприкінці я коротко підсумовую.
> note: відокремлюване.

> [!word] die Zusammenfassung
> ipa: /tsuˈzamənfasʊŋ/ · pos: noun · level: B2 · id: de-b1-schreiben-w19
> uk: підсумок, резюме
> forms: die Zusammenfassungen
> example: Am Ende steht eine kurze **Zusammenfassung**. — Наприкінці стоїть короткий підсумок.
> note: від zusammenfassen + ung.

> [!word] ausführlich
> ipa: /ˈaʊ̯sfyːɐ̯lɪç/ · pos: adj · level: B2 · id: de-b1-schreiben-w20
> uk: докладний
> example: Bitte antworten Sie **ausführlich**. — Будь ласка, відповідайте докладно.
> note: протилежність — knapp, kurz.

> [!word] knapp
> ipa: /knap/ · pos: adj · level: B2 · id: de-b1-schreiben-w21
> uk: стислий; ледве
> example: Die Mail war kurz und **knapp**. — Лист був коротким і стислим.
> note: k у knapp вимовляється: [kn]. Також «ледве»: knapp zehn Minuten.

> [!word] das Missverständnis
> ipa: /ˈmɪsfɛɐ̯ʃtɛntnɪs/ · pos: noun · level: B2 · id: de-b1-schreiben-w22
> uk: непорозуміння
> forms: die Missverständnisse
> example: Das war ein **Missverständnis**. — Це було непорозуміння.
> note: ss після короткого голосного.

> [!word] einen Termin wahrnehmen
> ipa: /ˈaɪ̯nən tɛʁˈmiːn ˈvaːɐ̯neːmən/ · pos: phrase · level: B2 · id: de-b1-schreiben-w23
> uk: прийти на запис, скористатися записом
> example: Ich kann den **Termin** leider nicht **wahrnehmen**. — На жаль, я не можу прийти на запис.
> note: формальна колокація; розмовно: Ich kann nicht zum Termin kommen.

## Слухаємо

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-schreiben-l01
> audio: Leider kann ich den Termin am Dienstag nicht wahrnehmen.
> explain: wahrnehmen — слово з префіксом wahr- (наголос на wahr-). Звучить формально.

> [!listen] Послухай діалог. Яку пошту пише Lena?
> level: B1 · type: answer · id: de-b1-schreiben-l02
> audio: A: Was schreibst du da, Lena?
> audio: B: Eine Mail an Frau Weber vom Kundenservice. Ich möchte mich über die Lieferung beschweren.
> audio: A: Dann schreib „Sehr geehrte Frau Weber“ und am Ende „Mit freundlichen Grüßen“.
> audio: B: Genau. Und „Sie“ schreibe ich mit großem S.
> - [x] формальний лист зі скаргою
> - [ ] запрошення другові
> - [ ] допис на форумі

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-schreiben-l03
> audio: Sehr geehrte Damen und Herren, ich schreibe Ihnen wegen meines Antrags.
> - [ ] Hallo zusammen, ich schreibe euch wegen meines Antrags.
> - [x] Sehr geehrte Damen und Herren, ich schreibe Ihnen wegen meines Antrags.
> - [ ] Liebe Frau Weber, ich schreibe Ihnen wegen meines Antrags.

## Вимова

Читаючи вголос власний лист, перевіряєш ритм і помилки. Слова *Anrede, Betreff, Grußformel* — наголос на першому складі. У слові *Grüße* ü — [yː], губи трубочкою, язик як для «і». *ß* — глухий [s].

> [!speak] Скажи вголос
> level: B1 · id: de-b1-schreiben-s01
> text: Sehr geehrte Frau Weber, ich schreibe Ihnen wegen meines Antrags.
> ipa: /zeːɐ̯ ɡəˈʔeːɐ̯tə fʁaʊ̯ ˈveːbɐ ɪç ˈʃʁaɪ̯bə ˈiːnən ˈveːɡn̩ ˈmaɪ̯nəs ˈantʁaːks/
> tip: geehrte: ʔ-пауза між ge- і ehr-. Weber — [v] «в», довге e. Ihnen: h німе й подовжує i: довге «і».
> uk: Шановна пані Вебер, я пишу Вам щодо моєї заяви.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-schreiben-s02
> text: Hast du Lust, am Samstag zum Kaffee vorbeizukommen?
> ipa: /hast duː lʊst am ˈzamstaːk tsʊm ˈkafeː foːɐ̯ˈbaɪ̯tsuːkɔmən/
> tip: Samstag — g у кінці «к». Kaffee — наголос на кінці. Питання «так / ні» — голос угору ↗. vorbeizukommen — одне слово: zu всередині.
> uk: Маєш охоту зазирнути в суботу на каву?

> [!speak] Скажи вголос
> level: B1 · id: de-b1-schreiben-s03
> text: Mit freundlichen Grüßen. Olena Kovalenko.
> ipa: /mɪt ˈfʁɔʏ̯ntlɪçn̩ ˈɡʁyːsn̩ oˈleːna kovaˈlɛŋko/
> tip: freundlichen: eu = «ой», -lich- — [lɪç]. Grüßen: ü — [yː], ß = [s]. Імʼя вимов за звичною вимовою.
> uk: З повагою. Олена Коваленко.

## Типові помилки українців

> [!pitfall] Не те звертання й не той кінець: ~~Sehr geehrte Frau Weber, … Tschüss~~
> *Anrede* і *Gruß* мусять мати один регістр. Офіційно: *Sehr geehrte Frau Weber, … Mit freundlichen Grüßen*. Друзям: *Liebe Anna, … Liebe Grüße*. Змішувати (*Sehr geehrte … Tschüss*, *Liebe Frau Weber … Mit freundlichen Grüßen*) не варто. Також ~~Geehrter Herr Weber~~: потрібно *Sehr geehrter Herr Weber*.

> [!pitfall] Кальки: ~~Mit Respekt~~, ~~Geehrter Herr~~
> «З повагою» німецькою не перекладаємо як ~~Mit Respekt~~: стандартна формула — *Mit freundlichen Grüßen*. «Дякую за Ваше повідомлення» — *Vielen Dank für Ihre Nachricht*. Після *Mit freundlichen Grüßen* і *Liebe Grüße* коми **немає**, а імʼя йде з нового рядка (на відміну від українського «З повагою,»). А «Я пишу Вам» — *Ich schreibe Ihnen* (Dativ!), а не ~~Ich schreibe Sie~~.

> [!pitfall] Не відповісти на всі пункти
> У Goethe B1 Aufgabe 1 є три змістові пункти, і треба написати про **кожен**. Це частина критерію *Erfüllung*. Дуже гарний текст без одного пункту втрачає бали, а гарний текст із усіма пунктами — отримує їх. Перед написанням познач пункти олівцем.

> [!pitfall] du і Sie в одному листі
> Якщо почав з *Sie*, не переходь на *du* на півдорозі: ~~Sehr geehrte Frau Weber, kannst du mir helfen?~~ → *Könnten Sie mir helfen?* У неформальному листі — навпаки: ~~Liebe Anna, ich schreibe Ihnen~~.

## Landeskunde: Briefe und E-Mails in Deutschland

> [!example] Form ist wichtig
> Wer in Deutschland einen Brief oder eine E-Mail schreibt, achtet auf die Form. Bei Behörden, Firmen und Vermietern schreibt man formell. Wenn man den Namen kennt, beginnt man mit „Sehr geehrte Frau Müller“ oder „Sehr geehrter Herr Schmidt“. Kennt man den Namen nicht, schreibt man „Sehr geehrte Damen und Herren“. Am Ende steht „Mit freundlichen Grüßen“ und darunter der vollständige Name. Eine E-Mail an ein Amt hat immer einen Betreff, damit der Empfänger sofort versteht, worum es geht. Bei Freunden und Kollegen, die man duzt, ist ein lockerer Stil normal: „Hallo Tim“, „Liebe Grüße“. In Briefen kann man „du“ und „dein“ klein oder groß schreiben, aber „Sie“ schreibt man immer groß. Kurze Absätze und klare Sätze machen den Text leicht lesbar. Hat die Person einen Doktortitel, schreibt man „Sehr geehrte Frau Dr. Müller“. Viele Prüfungen, zum Beispiel das Goethe-Zertifikat B1, testen genau diese Formen: eine persönliche E-Mail, einen Diskussionsbeitrag und eine formelle Mail.

> [!quiz] Nach dem Text: Wann schreibt man „Sehr geehrte Damen und Herren“?
> level: B1 · type: single · id: de-b1-schreiben-q02
> - [ ] wenn man den Empfänger gut kennt
> - [x] wenn man den Namen nicht kennt
> - [ ] nur bei Freunden
> - [ ] nur am Ende des Briefes
>
> **Пояснення:** у тексті: *Kennt man den Namen nicht, schreibt man „Sehr geehrte Damen und Herren“.* Це звертання вживають на початку, і лише в офіційних листах.

> [!quiz] Nach dem Text: Was steht in einer E-Mail an ein Amt immer?
> level: B1 · type: single · id: de-b1-schreiben-q03
> - [ ] „Hallo“
> - [x] ein Betreff
> - [ ] ein Foto
> - [ ] „Tschüss“
>
> **Пояснення:** *Eine E-Mail an ein Amt hat immer einen Betreff, damit der Empfänger sofort versteht, worum es geht.*

> [!quiz] Was stimmt laut Text?
> level: B1 · type: multi · id: de-b1-schreiben-q04
> - [x] „Sie“ schreibt man immer groß.
> - [x] Bei Freunden ist ein lockerer Stil normal.
> - [ ] „Mit freundlichen Grüßen“ schreibt man an Freunde.
> - [ ] Ein Betreff ist bei Behörden unnötig.
>
> **Пояснення:** *Sie* — завжди з великої; з друзями — вільний стиль (*Hallo Tim, Liebe Grüße*). *Mit freundlichen Grüßen* — формально.

## Практика

> [!quiz] Які елементи належать до формальної пошти?
> level: B1 · type: multi · id: de-b1-schreiben-q05
> - [x] Mit freundlichen Grüßen
> - [x] Könnten Sie mir bitte helfen?
> - [ ] Liebe Grüße
> - [ ] Hast du Lust, am Samstag zu kommen?
> - [x] Sehr geehrte Damen und Herren,
>
> **Пояснення:** *Liebe Grüße* і *Hast du Lust …?* — для знайомих, яких називаєш на *du*.

> [!quiz] Скільки слів (≈) вимагає Aufgabe 3 у Goethe B1 Schreiben?
> level: B1 · type: single · id: de-b1-schreiben-q06
> - [ ] 20
> - [x] 40
> - [ ] 80
> - [ ] 120
>
> **Пояснення:** Aufgabe 3 — коротка формальна пошта (≈ 40 слів). У Aufgabe 1 і 2 — ≈ 80 слів.

> [!quiz] Склади неформальну пошту: порядок частин
> level: B1 · type: order · id: de-b1-schreiben-q07
>
> ```text order
> Hallo Tim,
> vielen Dank für deine Mail.
> Die Party war sehr schön.
> Hast du Lust, am Sonntag vorbeizukommen?
> Liebe Grüße
> Olena
> Mit freundlichen Grüßen ✗
> ```
>
> **Пояснення:** порядок: звертання → подяка → основна частина → пропозиція → привітання → підпис. *Mit freundlichen Grüßen* — не для листа до друга.

> [!quiz] Заповни формальну пошту
> level: B1 · type: fill · bank: geehrter, nehmen, Gruß · id: de-b1-schreiben-q08
>
> ```text fill
> Sehr [[geehrte]] Frau Weber,
> leider kann ich den Termin am Dienstag nicht [[wahrnehmen]].
> Ich [[bitte]] um einen neuen Termin.
> Mit freundlichen [[Grüßen]]
> ```
>
> **Пояснення:** *Sehr geehrte Frau …* — звертання до жінки; *einen Termin wahrnehmen*; *bitten um + Akk*; *Mit freundlichen Grüßen*. *geehrter, nehmen, Gruß* не підходять до жодної з цих позицій.

> [!quiz] Яке речення правильне для формальної пошти?
> level: B1 · type: single · id: de-b1-schreiben-q09
> - [x] Ich schreibe Ihnen, weil ich eine Frage zu meinem Antrag habe.
> - [ ] Ich schreibe Sie, weil ich eine Frage zu meinem Antrag habe.
> - [ ] Ich schreibe Ihnen, weil ich habe eine Frage zu meinem Antrag.
> - [ ] Ich schreibe Ihnen, weil ich eine Frage zu meinem Antrag haben.
>
> **Пояснення:** *schreiben* + Dativ → *Ihnen*. Після *weil* дієслово *habe* — у кінці.

> [!quiz] З чого найкраще почати допис на форумі з власною думкою?
> level: B1 · type: single · id: de-b1-schreiben-q10
> - [x] Ich finde, dass Kinder früh Fremdsprachen lernen sollten.
> - [ ] Sehr geehrte Damen und Herren, ich schreibe Ihnen.
> - [ ] Liebe Grüße, Olena
> - [ ] Anbei sende ich Ihnen meinen Lebenslauf.
>
> **Пояснення:** допис на форумі починається з позиції (*Ich finde, dass …*, *Meiner Meinung nach …*). Решта варіантів — формули листа.

> [!quiz] Склади речення: «З одного боку це практично, з іншого — дорого»
> level: B1 · type: order · id: de-b1-schreiben-q11
>
> ```text order
> Einerseits
> ist
> das
> praktisch,
> andererseits
> ist
> es
> teuer.
> sind ✗
> ```
>
> **Пояснення:** *Einerseits … andererseits* — обидва речення мають дієслово на 2-му місці. Підмети *das* і *es* в однині → *ist*.

> [!quiz] Заповни допис на форумі
> level: B1 · type: fill · bank: weil, aber, obwohl · id: de-b1-schreiben-q12
>
> ```text fill
> Ich finde, [[dass]] Kinder erst mit zwölf Jahren ein Handy brauchen.
> [[Einerseits]] können Eltern ihr Kind erreichen, andererseits gibt es viele Gefahren.
> Zum [[Beispiel]] kann ein Kind Videos sehen, die ihm Angst machen.
> ```
>
> **Пояснення:** *Ich finde, dass …*; *Einerseits … andererseits*; *Zum Beispiel*. *weil, aber, obwohl* не підходять до жодного з цих місць.

> [!quiz] Яке з завдань Goethe B1 Schreiben — допис із власною думкою (форум, гостьова книга)?
> level: B1 · type: single · id: de-b1-schreiben-q13
> - [ ] Aufgabe 1
> - [x] Aufgabe 2
> - [ ] Aufgabe 3
> - [ ] жодне
>
> **Пояснення:** Aufgabe 1 — неформальна пошта, Aufgabe 2 — допис із власною думкою (Diskussionsbeitrag), Aufgabe 3 — коротка формальна пошта.

> [!quiz] За якими критеріями оцінюють Schreiben (обери всі)?
> level: B1 · type: multi · id: de-b1-schreiben-q14
> - [x] Erfüllung
> - [x] Kohärenz
> - [x] Wortschatz
> - [x] Strukturen
> - [ ] Handschrift
> - [ ] Geschwindigkeit
>
> **Пояснення:** критерії: виконання завдання, звʼязність, лексика й граматичні структури. Почерк і швидкість не оцінюють.

## Фішки

> [!reel] 🔠 Sie завжди з великої
> За Duden, *Sie* і *Ihr* пишуть з великої літери завжди, навіть у листах. А от *du* і *dein* — норма з малої, у листах можна й з великої (правило D 83). Тож у листі до друга і *Hallo Tim, wie geht's dir?* , і *wie geht's Dir?* — правильно.

> [!reel] 👥 Подвійне звертання
> Звертаючись до двох людей, не пишемо ~~Sehr geehrte Frau Müller und Herr Müller~~. За Duden, правильно: *Sehr geehrte Frau Müller, sehr geehrter Herr Müller*. Кожне звертання повторює *sehr geehrte/r* і узгоджується з родом.

> [!reel] ⏱ 60 хвилин на три тексти
> У Goethe-Zertifikat B1 модуль Schreiben триває 60 хвилин: близько 20 на неформальну пошту, 25 на допис із думкою і 15 на коротку формальну пошту. Бали: 40 + 40 + 20. Тому одне завдання не варто писати довше, ніж на нього відведено.

## Джерела та що почитати

- [Goethe-Zertifikat B1 — Modellsatz: Schreiben](https://bfu.goethe.de/b1_mod/schreiben.php) — офіційний зразок трьох завдань, час і критерії.
- [Goethe-Zertifikat B1 — Übungssatz Erwachsene (PDF)](https://www.goethe.de/pro/relaunch/prf/materialien/B1/B1_Uebungssatz_Erwachsene.pdf) — повний тренувальний комплект з Schreiben.
- [Duden — Großschreibung (D 83)](https://www.duden.de/sprachwissen/rechtschreibregeln/grossschreibung) — Sie / du в листах.
- [Duden Sprachratgeber — Probleme mit Ellipsen](https://www.duden.de/sprachwissen/sprachratgeber/Probleme-mit-Ellipsen) — подвійне звертання.
- [Duden — E-Mail](https://www.duden.de/rechtschreibung/E_Mail) — рід і множина.
- [DWDS — informell](https://www.dwds.de/wb/informell) — значення й наголос.
- [DWDS — wahrnehmen](https://www.dwds.de/wb/wahrnehmen) — «скористатися записом».

> [!important] Підсумок
> - Goethe B1 Schreiben: 60 хв, три завдання — неформальна пошта (≈ 80 слів), допис із думкою (≈ 80), коротка формальна пошта (≈ 40).
> - Скелет листа: *Anrede → Anlass → Hauptteil → Schluss → Gruß + Name*. Регістр визначає *du* / *Sie*.
> - Формально: *Sehr geehrte Frau …, Ich schreibe Ihnen, Könnten Sie …?, Mit freundlichen Grüßen*; неформально: *Liebe Anna, Hast du Lust …?, Liebe Grüße*.
> - Пиши про **всі** змістові пункти; перевір *Erfüllung, Kohärenz, Wortschatz, Strukturen*.
> - *Sie* — завжди з великої; *du* у листі — за вибором.
