---
title: Установи й страхування — Ausländerbehörde, Jobcenter, Krankenkasse
id: de-b1-behoerden
level: B1
icon: px:building
tags: [deutsch, b1, skills, behoerden, versicherung, ausländerbehörde, jobcenter]
prerequisites: ["[[Deutsch - A2 - 29. Ситуації — Bürgeramt, Anmeldung, огляд квартири, аптека]]", "[[Deutsch - A2 - 24. Гроші, банк, пошта й послуги]]"]
estimatedMinutes: 45
---

# Установи й страхування — Ausländerbehörde, Jobcenter, Krankenkasse

> [!success] Після цієї теми ти зможеш
> - зрозуміти, до якої установи йти з якою справою: *Bürgeramt, Ausländerbehörde, Jobcenter, Agentur für Arbeit, Familienkasse, Krankenkasse*;
> - домовитись про запис і розпитати, які документи взяти: *Ich möchte einen Termin vereinbaren. Welche Unterlagen brauche ich?*;
> - прочитати лист від установи: знайти *Betreff, Aktenzeichen, Frist* і зрозуміти, що саме від тебе вимагають;
> - сказати, що ти подаєш заяву, оскаржуєш рішення або досилаєш документи: *Antrag stellen, Widerspruch einlegen, Unterlagen nachreichen*.

## Передбач

> [!quiz] У листі написано: «Bitte reichen Sie die Unterlagen bis zum 15. April nach.» Що це означає?
> level: B1 · type: single · id: de-b1-behoerden-q01
> - [x] Додатково подайте документи до 15 квітня.
> - [ ] Прочитайте документи ще раз до 15 квітня.
> - [ ] Заберіть свої документи 15 квітня.
> - [ ] Документи вже подано, більше нічого не потрібно.
>
> **Пояснення:** *nachreichen* — «подати додатково, пізніше». *bis zum 15. April* — крайній термін (*die Frist*). Документ потрібно **принести або надіслати** до цієї дати.

## Пояснення

### Хто за що відповідає

Німецькі установи мають чітко розподілені завдання. Назви довгі, але складаються зі знайомих частин (тема B1-23).

| Установа | Що робить | Для чого йдеш |
|---|---|---|
| **das Bürgeramt** (в місті; ще *Einwohnermeldeamt*) | реєстрація місця проживання | *Anmeldung*, *Meldebescheinigung* |
| **die Ausländerbehörde** | право на перебування | *Aufenthaltserlaubnis* |
| **das Jobcenter** | допомога на життя та пошук роботи | *Leistungen*, *Arbeitsvermittlung* |
| **die Agentur für Arbeit** | посередництво в роботі, Arbeitslosengeld | реєстрація безробітним |
| **die Familienkasse** | виплата *Kindergeld* | заява на допомогу на дитину |
| **die Krankenkasse** | медичне страхування | вибір каси, *Gesundheitskarte* |

Назва залежить від міста або землі (*Ausländerbehörde* може називатися *Amt für Migration*), тому справжню адресу шукай на сайті міста.

> [!diagram] Шлях заяви: від запису до рішення
> ```yaml
> layout: flow
> nodes:
>   - { id: t, label: "1. Запис", text: "Termin vereinbaren", tone: yellow }
>   - { id: u, label: "2. Документи", text: "Unterlagen mitbringen", tone: pink }
>   - { id: a, label: "3. Заява", text: "Antrag stellen", tone: yellow }
>   - { id: b, label: "4. Рішення", text: "Bescheid", tone: pink }
>   - { id: w, label: "5. Якщо не згоден", text: "Widerspruch einlegen", tone: gray }
> edges:
>   - { from: t, to: u }
>   - { from: u, to: a }
>   - { from: a, to: b }
>   - { from: b, to: w, label: "у межах строку" }
> steps:
>   - { focus: t, note: "Багато установ працюють за записом, часто онлайн. Спробуй домовитись заздалегідь: Ich möchte einen Termin vereinbaren." }
>   - { focus: u, note: "Дізнайся, які документи потрібні: Welche Unterlagen muss ich mitbringen? Паспорт (Reisepass), біометричне фото, Mietvertrag тощо — залежить від справи." }
>   - { focus: a, note: "Заяву подаєш (stellst) на формулярі (Formular): Ich möchte einen Antrag auf ... stellen." }
>   - { focus: b, note: "Рішення приходить письмово — це Bescheid: Antrag bewilligt або abgelehnt." }
>   - { focus: w, note: "Якщо не згоден — Widerspruch. Строк зазвичай один місяць після того, як ти отримав Bescheid (§ 70 VwGO). Строк — у кінці листа, у Rechtsbehelfsbelehrung." }
> ```
> Кольори тут чергують етапи; значення — у підписах.

### Як прочитати лист від установи

У листі шукай чотири речі:

1. **Betreff** — про що лист (*Ihr Antrag vom 12. März*).
2. **Aktenzeichen** — номер твоєї справи; завжди вказуй його, коли пишеш чи телефонуєш.
3. **Що потрібно зробити** — зазвичай одне зі слів: *bitte reichen Sie … nach / füllen Sie … aus / melden Sie sich*.
4. **Frist** — крайній термін (*bis zum …*). Якщо його пропустити, заяву можуть відхилити.

Якщо в листі написано *Bescheid*, шукай внизу **Rechtsbehelfsbelehrung** — це пояснення, як і до якої дати оскаржити рішення (*Widerspruch einlegen*).

### Слова-колокації: що з чим

| Дія | Німецькою (колокація) |
|---|---|
| подати заяву | einen **Antrag stellen** |
| заповнити формуляр | ein Formular **ausfüllen** |
| подати документи | Unterlagen **einreichen** |
| подати документи пізніше | Unterlagen **nachreichen** |
| схвалити / відхилити | einen Antrag **bewilligen / ablehnen** |
| оскаржити | **Widerspruch einlegen** |
| дотриматися строку | die **Frist einhalten** |
| домовитися про запис | einen **Termin vereinbaren** |

### Дозвіл на проживання й страхування

**Aufenthaltstitel** — загальна назва документів про право перебувати: за законом це *Visum*, *Aufenthaltserlaubnis*, *Blaue Karte EU*, *Niederlassungserlaubnis* та *Erlaubnis zum Daueraufenthalt-EU* (§ 4 AufenthG). *Aufenthaltserlaubnis* — тимчасовий дозвіл; *Niederlassungserlaubnis* — безстроковий. Для людей, які отримали тимчасовий захист у звʼязку з війною в Україні, діє *Aufenthaltserlaubnis nach § 24 AufenthG*. Правила й строки змінюються, тому перевіряй актуальну інформацію на сайті BMAS або BAMF і в Ausländerbehörde.

**Страхування:**

- **Krankenversicherung** — обовʼязкова: кожна особа з місцем проживання в Німеччині має бути застрахована (§ 193 VVG). Більшість людей — у *gesetzliche Krankenversicherung* через *Krankenkasse* (AOK, Techniker Krankenkasse, Barmer тощо).
- **Haftpflichtversicherung** (приватна цивільна відповідальність) — **не обовʼязкова** за законом, але Verbraucherzentrale називає її однією з найважливіших добровільних страховок: вона покриває шкоду, яку ти завдаєш іншим.
- *Kfz-Haftpflicht* для автомобіля — обовʼязкова.

> [!note] Du чи Sie?
> В установах і з Sachbearbeiter(in) завжди **Sie** й ввічливі форми: *Könnten Sie mir bitte helfen?* Дотримуйся порядку й тону: дякуй (*Vielen Dank*) і прощайся (*Auf Wiedersehen*).

## Приклади

- Ich möchte einen Termin bei der Ausländerbehörde vereinbaren. — Я хочу домовитись про запис в Ausländerbehörde.
- Welche Unterlagen muss ich mitbringen? — Які документи мені взяти?
- Ich habe heute einen Brief vom Jobcenter bekommen. — Сьогодні я отримав лист від Jobcenter.
- Der Antrag wurde bewilligt. — Заяву схвалено.
- Der Antrag wurde leider abgelehnt. Ich lege Widerspruch ein. — Заяву, на жаль, відхилено. Я подаю заперечення.
- Bis wann muss ich die Unterlagen nachreichen? — До якого числа потрібно додати документи?
- Die Frist endet am Freitag. — Строк закінчується в пʼятницю.
- Meine Krankenkasse schickt mir die neue Gesundheitskarte. — Моя каса надсилає мені нову картку здоровʼя.
- Haben Sie schon eine Haftpflichtversicherung? — У Вас уже є страховка цивільної відповідальності?
- Ich brauche eine Bescheinigung für das Jobcenter. — Мені потрібна довідка для Jobcenter.
- Wer ist für meinen Fall zuständig? — Хто відповідає за мою справу?
- Bitte schicken Sie den Brief als Einschreiben. — Будь ласка, надішліть лист рекомендованим.

## Слова

> [!word] der Bescheid
> ipa: /bəˈʃaɪ̯t/ · pos: noun · level: B1 · id: de-b1-behoerden-w01
> uk: офіційне рішення (письмове); повідомлення
> forms: die Bescheide
> example: Ich habe den **Bescheid** vom Amt bekommen. — Я отримав від установи письмове рішення.
> note: не плутай із die Bescheinigung (довідка). Bescheid geben / sagen = повідомити.

> [!word] die Frist
> ipa: /fʁɪst/ · pos: noun · level: B1 · id: de-b1-behoerden-w02
> uk: строк, крайній термін
> forms: die Fristen
> example: Die **Frist** endet am 30. Juni. — Строк закінчується 30 червня.
> note: НЕ der Termin (запис, зустріч). Eine Frist einhalten / verpassen.

> [!word] der Nachweis
> ipa: /ˈnaːxvaɪ̯s/ · pos: noun · level: B1 · id: de-b1-behoerden-w03
> uk: підтвердження, доказ
> forms: die Nachweise
> example: Bitte bringen Sie einen **Nachweis** über Ihr Einkommen mit. — Будь ласка, принесіть підтвердження доходу.
> note: nachweisen — довести, підтвердити.

> [!word] die Aufenthaltserlaubnis
> ipa: /ˈaʊ̯fɛnthaltsʔɛɐ̯ˌlaʊ̯pnɪs/ · pos: noun · level: B2 · id: de-b1-behoerden-w04
> uk: дозвіл на проживання
> forms: die Aufenthaltserlaubnisse
> example: Meine **Aufenthaltserlaubnis** gilt noch ein Jahr. — Мій дозвіл на проживання діє ще рік.
> note: тимчасовий; безстроковий — die Niederlassungserlaubnis. Складне слово: Aufenthalt + s + Erlaubnis.

> [!word] der Aufenthaltstitel
> ipa: /ˈaʊ̯fɛnthaltsˌtiːtl̩/ · pos: noun · level: B2 · id: de-b1-behoerden-w05
> uk: документ про право перебування
> forms: die Aufenthaltstitel
> example: Ohne **Aufenthaltstitel** darf man nicht lange bleiben. — Без документа про право перебування довго залишатися не можна.
> note: збірна назва: Aufenthaltserlaubnis, Niederlassungserlaubnis, Blaue Karte EU тощо.

> [!word] die Ausländerbehörde
> ipa: /ˈaʊ̯slɛndɐbəˌhøːɐ̯də/ · pos: noun · level: B1 · id: de-b1-behoerden-w06
> uk: відомство у справах іноземців
> forms: die Ausländerbehörden
> example: Die **Ausländerbehörde** ist im dritten Stock. — Відомство у справах іноземців на третьому поверсі.
> note: у деяких містах має іншу назву (Amt für Migration, Ausländeramt). Не плутай із Bürgeramt.

> [!word] das Jobcenter
> ipa: /ˈdʒɔptsɛntɐ/ · pos: noun · level: B1 · id: de-b1-behoerden-w07
> uk: центр зайнятості (допомога на життя та пошук роботи)
> forms: die Jobcenter
> example: Das **Jobcenter** hilft bei der Arbeitssuche. — Jobcenter допомагає шукати роботу.
> note: відрізняється від Agentur für Arbeit, але працює разом із нею.

> [!word] die Gesundheitskarte
> ipa: /ɡəˈzʊnthaɪ̯tsˌkaʁtə/ · pos: noun · level: B1 · id: de-b1-behoerden-w08
> uk: електронна картка медичного страхування
> forms: die Gesundheitskarten
> example: Bitte zeigen Sie Ihre **Gesundheitskarte**. — Будь ласка, покажіть свою картку страхування.
> note: офіційно elektronische Gesundheitskarte (eGK). Видає Krankenkasse.

> [!word] die Haftpflichtversicherung
> ipa: /ˈhaftpflɪçtfɛɐ̯ˌzɪçəʁʊŋ/ · pos: noun · level: B1 · id: de-b1-behoerden-w09
> uk: страхування цивільної відповідальності
> forms: die Haftpflichtversicherungen
> example: Eine private **Haftpflichtversicherung** ist freiwillig, aber sinnvoll. — Приватна страховка відповідальності добровільна, але корисна.
> note: покриває шкоду, яку ти завдав іншим. Kfz-Haftpflicht для авто — обовʼязкова.

> [!word] die Versicherung
> ipa: /fɛɐ̯ˈzɪçəʁʊŋ/ · pos: noun · level: B1 · id: de-b1-behoerden-w10
> uk: страхування; страхова компанія
> forms: die Versicherungen
> example: Welche **Versicherung** brauche ich unbedingt? — Яка страховка мені конче потрібна?
> note: versichern — застрахувати; sich versichern — застрахуватися.

> [!word] die Leistung
> ipa: /ˈlaɪ̯stʊŋ/ · pos: noun · level: B1 · id: de-b1-behoerden-w11
> uk: виплата; послуга; досягнення
> forms: die Leistungen
> example: Die Krankenkasse zahlt diese **Leistung**. — Каса оплачує цю послугу.
> note: у соціальній сфері — допомога, виплата: Sozialleistungen.

> [!word] der Widerspruch
> ipa: /ˈviːdɐʃpʁʊx/ · pos: noun · level: B1 · id: de-b1-behoerden-w12
> uk: заперечення; оскарження
> forms: die Widersprüche
> example: Gegen den Bescheid lege ich **Widerspruch** ein. — Проти рішення я подаю заперечення.
> note: строк зазвичай один місяць після оголошення рішення (§ 70 VwGO); точну дату дивись у Rechtsbehelfsbelehrung.

> [!word] die Zuständigkeit
> ipa: /ˈtsuːʃtɛndɪçkaɪ̯t/ · pos: noun · level: B2 · id: de-b1-behoerden-w13
> uk: компетенція
> forms: die Zuständigkeiten
> example: Die **Zuständigkeit** liegt beim Jobcenter. — Це в компетенції Jobcenter.
> note: від zuständig (відповідальний, компетентний).

> [!word] der Sachbearbeiter
> ipa: /ˈzaxbəˌʔaʁbaɪ̯tɐ/ · pos: noun · level: B2 · id: de-b1-behoerden-w14
> uk: референт, спеціаліст, що веде справу
> forms: die Sachbearbeiter
> example: Mein **Sachbearbeiter** heißt Herr Weber. — Мого референта звати пан Вебер.
> note: жінка — die Sachbearbeiterin. Це конкретна людина, що веде твою справу.

> [!word] das Aktenzeichen
> ipa: /ˈaktn̩ˌtsaɪ̯çn̩/ · pos: noun · level: B2 · id: de-b1-behoerden-w15
> uk: номер справи
> forms: die Aktenzeichen
> example: Bitte geben Sie das **Aktenzeichen** an. — Будь ласка, вкажіть номер справи.
> note: Akte — справа, Zeichen — знак. Завжди зберігай його.

> [!word] die Rechtsbehelfsbelehrung
> ipa: /ˈʁɛçtsbəhɛlfsbəˌleːʁʊŋ/ · pos: noun · level: C1 · id: de-b1-behoerden-w16
> uk: розʼяснення про способи оскарження
> forms: die Rechtsbehelfsbelehrungen
> example: Die **Rechtsbehelfsbelehrung** steht am Ende des Bescheids. — Розʼяснення про оскарження стоїть наприкінці рішення.
> note: довге слово, але шукай його в кінці Bescheid: там зазначено, як і до якої дати оскаржити.

> [!word] die Bearbeitung
> ipa: /bəˈʔaʁbaɪ̯tʊŋ/ · pos: noun · level: B2 · id: de-b1-behoerden-w17
> uk: розгляд, обробка
> forms: — (без множини)
> example: Die **Bearbeitung** dauert vier Wochen. — Розгляд триває чотири тижні.
> note: bearbeiten + ung. Bearbeitungszeit — час розгляду.

> [!word] die Wartezeit
> ipa: /ˈvaʁtəˌtsaɪ̯t/ · pos: noun · level: B1 · id: de-b1-behoerden-w18
> uk: час очікування
> forms: die Wartezeiten
> example: Die **Wartezeit** beträgt etwa drei Wochen. — Очікування триває близько трьох тижнів.
> note: warten + Zeit.

> [!word] die Terminvereinbarung
> ipa: /tɛʁˈmiːnfɛɐ̯ˌʔaɪ̯nbaːʁʊŋ/ · pos: noun · level: B2 · id: de-b1-behoerden-w19
> uk: домовленість про запис
> forms: die Terminvereinbarungen
> example: Die **Terminvereinbarung** läuft online. — Запис проводиться онлайн.
> note: ein Termin vereinbaren → die Vereinbarung.

> [!word] die Bescheinigung
> ipa: /bəˈʃaɪ̯nɪɡʊŋ/ · pos: noun · level: B1 · id: de-b1-behoerden-w20
> uk: довідка, посвідчення
> forms: die Bescheinigungen
> example: Ich brauche eine **Bescheinigung** vom Arbeitgeber. — Мені потрібна довідка від роботодавця.
> note: інша, ніж der Bescheid (рішення). Meldebescheinigung — довідка про реєстрацію.

> [!word] der Schaden
> ipa: /ˈʃaːdn̩/ · pos: noun · level: B1 · id: de-b1-behoerden-w21
> uk: шкода, збиток
> forms: die Schäden
> example: Die Versicherung zahlt den **Schaden**. — Страхова виплачує збиток.
> note: Schaden melden — повідомити про страховий випадок.

> [!word] der Versicherungsschutz
> ipa: /fɛɐ̯ˈzɪçəʁʊŋsˌʃʊts/ · pos: noun · level: B2 · id: de-b1-behoerden-w22
> uk: страховий захист
> forms: — (без множини)
> example: Ohne Beitrag endet der **Versicherungsschutz**. — Без внеску страховий захист закінчується.
> note: Versicherung + s + Schutz.

> [!word] das Kindergeld
> ipa: /ˈkɪndɐˌɡɛlt/ · pos: noun · level: B1 · id: de-b1-behoerden-w23
> uk: допомога на дитину
> forms: — (без множини)
> example: Wir haben **Kindergeld** beantragt. — Ми подали заяву на допомогу на дитину.
> note: виплачує Familienkasse (при Agentur für Arbeit). Умови перевіряй у Familienkasse.

> [!word] die Familienkasse
> ipa: /faˈmiːli̯ənˌkasə/ · pos: noun · level: B1 · id: de-b1-behoerden-w24
> uk: каса у справах сімей (виплачує Kindergeld)
> forms: die Familienkassen
> example: Das Formular geht an die **Familienkasse**. — Формуляр надсилається в Familienkasse.
> note: Kasse тут — установа, не «каса».

> [!word] der Wohnsitz
> ipa: /ˈvoːnzɪts/ · pos: noun · level: B1 · id: de-b1-behoerden-w25
> uk: місце проживання
> forms: die Wohnsitze
> example: Mein **Wohnsitz** ist in Köln. — Моє місце проживання — Кельн.
> note: ersten Wohnsitz anmelden — зареєструвати основне місце проживання.

> [!word] die Genehmigung
> ipa: /ɡəˈneːmɪɡʊŋ/ · pos: noun · level: B2 · id: de-b1-behoerden-w26
> uk: дозвіл, затвердження
> forms: die Genehmigungen
> example: Für das Fest brauchen wir eine **Genehmigung**. — Для свята нам потрібен дозвіл.
> note: genehmigen — дозволити, затвердити.

> [!word] das Merkblatt
> ipa: /ˈmɛʁkblat/ · pos: noun · level: B2 · id: de-b1-behoerden-w27
> uk: памʼятка, інформаційний листок
> forms: die Merkblätter
> example: Im **Merkblatt** steht, welche Unterlagen man braucht. — У памʼятці написано, які документи потрібні.
> note: часто додається до формуляра.

> [!word] das Arbeitslosengeld
> ipa: /ˈaʁbaɪ̯tsloːzn̩ˌɡɛlt/ · pos: noun · level: B2 · id: de-b1-behoerden-w28
> uk: допомога по безробіттю (Arbeitslosengeld I)
> forms: — (без множини)
> example: Er bekommt **Arbeitslosengeld** von der Agentur für Arbeit. — Він отримує допомогу по безробіттю від Agentur für Arbeit.
> note: тривалість і умови залежать від стажу й віку. Деталі — в Agentur für Arbeit.

> [!word] die Vollmacht
> ipa: /ˈfɔlmaxt/ · pos: noun · level: B2 · id: de-b1-behoerden-w29
> uk: довіреність
> forms: die Vollmachten
> example: Mit einer **Vollmacht** darf er für mich unterschreiben. — З довіреністю він може підписати замість мене.
> note: ch після a — [x].

> [!word] das Einschreiben
> ipa: /ˈaɪ̯nʃʁaɪ̯bn̩/ · pos: noun · level: B2 · id: de-b1-behoerden-w30
> uk: рекомендований лист
> forms: die Einschreiben
> example: Der Brief kam als **Einschreiben**. — Лист прийшов як рекомендований.
> note: пошта: Einwurf-Einschreiben та Übergabe-Einschreiben; вручення підтверджується.

> [!word] bewilligen
> ipa: /bəˈvɪlɪɡn̩/ · pos: verb · level: B2 · id: de-b1-behoerden-w31
> uk: схвалити, затвердити (заяву, кошти)
> forms: bewilligen → bewilligte → hat bewilligt
> example: Das Amt hat meinen Antrag **bewilligt**. — Установа схвалила мою заяву.
> note: протилежне — ablehnen. g у -igen — [ɡ].

> [!word] einreichen
> ipa: /ˈaɪ̯nʁaɪ̯çn̩/ · pos: verb · level: B2 · id: de-b1-behoerden-w32
> uk: подати (документи)
> forms: einreichen → reichte ein → hat eingereicht
> example: Bitte **reichen** Sie den Antrag bis Montag **ein**. — Будь ласка, подайте заяву до понеділка.
> note: відокремлюване. Синонім: abgeben (розм.).

> [!word] nachreichen
> ipa: /ˈnaːxʁaɪ̯çn̩/ · pos: verb · level: B2 · id: de-b1-behoerden-w33
> uk: подати додатково, пізніше
> forms: nachreichen → reichte nach → hat nachgereicht
> example: Das Zeugnis kann ich später **nachreichen**. — Свідоцтво я можу подати пізніше.
> note: відокремлюване: Ich reiche das Zeugnis nach.

> [!word] bearbeiten
> ipa: /bəˈʔaʁbaɪ̯tn̩/ · pos: verb · level: B1 · id: de-b1-behoerden-w34
> uk: опрацьовувати, розглядати
> forms: bearbeiten → bearbeitete → hat bearbeitet
> example: Wir **bearbeiten** Ihren Antrag. — Ми розглядаємо Вашу заяву.
> note: Beamter bearbeitet Anträge. Не відокремлюване.

> [!word] beglaubigen
> ipa: /bəˈɡlaʊ̯bɪɡn̩/ · pos: verb · level: B2 · id: de-b1-behoerden-w35
> uk: засвідчити
> forms: beglaubigen → beglaubigte → hat beglaubigt
> example: Das Bürgeramt kann Kopien **beglaubigen**. — Bürgeramt може засвідчити копії.
> note: не відокремлюване.

> [!word] gesetzlich
> ipa: /ɡəˈzɛtslɪç/ · pos: adj · level: B1 · id: de-b1-behoerden-w36
> uk: законний; державний (про страхування)
> example: Ich bin **gesetzlich** krankenversichert. — Я застрахований у державній системі.
> note: gesetzliche Krankenversicherung (GKV) vs private Krankenversicherung (PKV).

> [!word] versichert
> ipa: /fɛɐ̯ˈzɪçɐt/ · pos: adj · level: B1 · id: de-b1-behoerden-w37
> uk: застрахований
> example: Alle Kinder sind bei der Mutter **versichert**. — Усі діти застраховані через маму.
> note: bei der AOK versichert sein.

> [!word] erforderlich
> ipa: /ɛɐ̯ˈfɔʁdɐlɪç/ · pos: adj · level: B2 · id: de-b1-behoerden-w38
> uk: необхідний
> example: Ein Nachweis ist **erforderlich**. — Потрібне підтвердження.
> note: книжніше за nötig. Часто в бланках: Erforderliche Unterlagen.

> [!word] einen Antrag stellen
> ipa: /ˈaɪ̯nən anˈtʁaːk ˈʃtɛlən/ · pos: phrase · level: B1 · id: de-b1-behoerden-w39
> uk: подати заяву
> example: Ich möchte einen **Antrag stellen**. — Я хочу подати заяву.
> note: колокація: stellen, не ~~machen~~ чи ~~geben~~. Antrag auf + Akk: Antrag auf Kindergeld.

> [!word] Widerspruch einlegen
> ipa: /ˈviːdɐʃpʁʊx ˈaɪ̯nleːɡn̩/ · pos: phrase · level: B2 · id: de-b1-behoerden-w40
> uk: подати заперечення (оскаржити)
> example: Ich will **Widerspruch einlegen**. — Я хочу оскаржити рішення.
> note: einlegen — відокремлюване: Ich lege Widerspruch ein. Строк — у Rechtsbehelfsbelehrung.

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-behoerden-l01
> audio: Ich möchte einen Termin vereinbaren.
> - [x] Ich möchte einen Termin vereinbaren.
> - [ ] Ich möchte einen Termin absagen.
> - [ ] Ich möchte einen Antrag stellen.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-behoerden-l02
> audio: Bitte reichen Sie die Unterlagen nach.
> explain: nachreichen — відокремлюване дієслово: у наказі Sie nach — префікс стоїть наприкінці.

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-behoerden-l03
> audio: Die Frist endet am Freitag.
> - [ ] Der Termin ist am Freitag.
> - [x] Die Frist endet am Freitag.
> - [ ] Die Frist beginnt am Freitag.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-behoerden-l04
> audio: Wo kann ich einen Antrag stellen?

## Вимова

Звук **sch** — завжди «ш» (*Bescheid, Beschreibung*), **ch** після a, o, u — [x] (*Nachweis, Frist* без ch, *Vollmacht*), після ei, i, e — [ç]. Префікси *be-, ver-, ge-* не наголошені: наголос падає на корінь (*beˈscheid, verˈsichern*).

> [!speak] Скажи вголос
> level: B1 · id: de-b1-behoerden-s01
> text: Ich habe einen Bescheid bekommen.
> ipa: /ɪç ˈhaːbə ˈaɪ̯nən bəˈʃaɪ̯t bəˈkɔmən/
> tip: Bescheid — наголос на -scheid, sch = «ш», кінцеве d — глухе [t]. be- коротке, ненаголошене.
> uk: Я отримав письмове рішення.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-behoerden-s02
> text: Die Frist endet am Freitag.
> ipa: /diː fʁɪst ˈɛndət am ˈfʁaɪ̯taːk/
> tip: fr- — горлове [ʁ] без вібрації язика. Freitag: ei = «ай», кінцеве g = «к».
> uk: Строк закінчується в пʼятницю.

## Ситуація 1: запис до Ausländerbehörde

> [!listen] Послухай телефонну розмову. Що треба взяти на запис?
> level: B1 · type: answer · id: de-b1-behoerden-l05
> audio: A: Ausländerbehörde, guten Tag.
> audio: B: Guten Tag, ich möchte meine Aufenthaltserlaubnis verlängern. Kann ich einen Termin bekommen?
> audio: A: Ja. Bringen Sie bitte Ihren Pass, ein biometrisches Foto und den Mietvertrag mit. Dienstag um neun Uhr?
> audio: B: Ja, das passt. Vielen Dank.
> - [x] паспорт, біометричне фото, договір оренди
> - [ ] лише паспорт
> - [ ] довідку з роботи й гроші

> [!speak] «Я хочу домовитись про запис.»
> level: B1 · id: de-b1-behoerden-s03
> text: Ich möchte einen Termin vereinbaren.
> ipa: /ɪç ˈmœçtə ˈaɪ̯nən tɛʁˈmiːn fɛɐ̯ˈʔaɪ̯nbaːʁən/
> tip: Termin — наголос на -min: «термін», довге [iː]. vereinbaren: ʔ перед ei — легка пауза між ver- і ein. Не плутай із «термін» (Frist).
> uk: Я хочу домовитись про запис.

> [!speak] «Які документи мені взяти?»
> level: B1 · id: de-b1-behoerden-s04
> text: Welche Unterlagen muss ich mitbringen?
> ipa: /ˈvɛlçə ˈʊntɐˌlaːɡn̩ mʊs ɪç ˈmɪtbʁɪŋən/
> tip: welche — [lç]: л + мʼяке «хь». Unterlagen: наголос на Un-. ng у mitbringen — один звук [ŋ] без «г».
> uk: Які документи мені взяти з собою?

## Ситуація 2: лист від Krankenkasse

> [!listen] Послухай розмову на стійці. Що має зробити клієнтка?
> level: B1 · type: answer · id: de-b1-behoerden-l06
> audio: A: Guten Tag, ich habe Post von der Krankenkasse. Ich verstehe den Brief nicht ganz.
> audio: B: Hier steht: Sie müssen bis zum fünfzehnten Mai eine Bescheinigung nachreichen. Das ist die Frist.
> audio: A: Und wenn ich sie später schicke?
> audio: B: Dann kann der Antrag abgelehnt werden.
> - [x] до 15 травня подати довідку
> - [ ] прийти особисто 15 травня
> - [ ] нічого, лист для інформації

> [!speak] «Я не зовсім розумію лист.»
> level: B1 · id: de-b1-behoerden-s05
> text: Ich verstehe den Brief nicht ganz.
> ipa: /ɪç fɛɐ̯ˈʃteːə deːn bʁiːf nɪçt ɡants/
> tip: verstehe: ver- ненаголошене, st = «шт». Brief — довге [iː], f у кінці. nicht ganz — [ç] і [ɡ].
> uk: Я не зовсім розумію лист.

> [!speak] «До якого числа потрібно подати документи?»
> level: B1 · id: de-b1-behoerden-s06
> text: Bis wann muss ich die Unterlagen abgeben?
> ipa: /bɪs van mʊs ɪç diː ˈʊntɐˌlaːɡn̩ ˈapɡeːbn̩/
> tip: Bis wann — W-питання, голос ↘. abgeben: наголос на ab-; b у кінці складу — [p].
> uk: До якого числа потрібно здати документи?

## Landeskunde: Behördendeutsch

> [!example] Briefe von Ämtern verstehen
> Wer in Deutschland einen Antrag stellt, bekommt oft einen Brief mit schwierigen Wörtern. Typisch sind der Bescheid, die Frist und die Rechtsbehelfsbelehrung. Ein Bescheid ist die offizielle Entscheidung der Behörde: Der Antrag wird bewilligt oder abgelehnt. Am Ende steht, wie man dagegen Widerspruch einlegen kann. Die Frist dafür beträgt meistens einen Monat nach der Bekanntgabe. Deshalb sollte man Post von Ämtern immer sofort öffnen und das Datum notieren. Wer etwas nicht versteht, kann bei der Behörde nachfragen oder eine Beratungsstelle besuchen. Wichtig ist auch: Jede Person mit Wohnsitz in Deutschland muss krankenversichert sein. Viele sind in der gesetzlichen Krankenversicherung, zum Beispiel bei der AOK oder der Techniker Krankenkasse. Eine private Haftpflichtversicherung ist dagegen freiwillig, wird aber von Verbraucherschützern empfohlen. Viele Ämter vergeben Termine online. Man sollte pünktlich kommen und alle Unterlagen mitbringen. Regeln für Aufenthalt und Leistungen können sich ändern. Aktuelle Informationen findet man auf den Seiten der Behörden.

> [!quiz] Nach dem Text: Was ist ein Bescheid?
> level: B1 · type: single · id: de-b1-behoerden-q02
> - [ ] ein Termin beim Amt
> - [x] die offizielle Entscheidung der Behörde
> - [ ] ein leeres Formular
> - [ ] eine Versicherung
>
> **Пояснення:** у тексті: *Ein Bescheid ist die offizielle Entscheidung der Behörde: Der Antrag wird bewilligt oder abgelehnt.* Termin — це запис; Formular — бланк.

> [!quiz] Nach dem Text: Wie lange hat man meistens Zeit für den Widerspruch?
> level: B1 · type: single · id: de-b1-behoerden-q03
> - [ ] zwei Tage
> - [x] einen Monat
> - [ ] ein Jahr
> - [ ] gar keine Zeit
>
> **Пояснення:** *Die Frist dafür beträgt meistens einen Monat nach der Bekanntgabe.* Конкретний строк завжди дивись у Rechtsbehelfsbelehrung свого листа.

> [!quiz] Was stimmt laut Text?
> level: B1 · type: multi · id: de-b1-behoerden-q04
> - [x] Jede Person mit Wohnsitz in Deutschland muss krankenversichert sein.
> - [x] Eine private Haftpflichtversicherung ist freiwillig.
> - [ ] Eine private Haftpflichtversicherung ist gesetzlich Pflicht.
> - [ ] Briefe vom Amt kann man ruhig später öffnen.
>
> **Пояснення:** текст радить *Post von Ämtern immer sofort öffnen*. Haftpflicht — freiwillig (*dagegen freiwillig*), Krankenversicherung — обовʼязкова.

## Практика

> [!example] Beispielbrief (Ausländerbehörde)
> Aktenzeichen: AB-4711
> Betreff: Ihr Antrag auf Verlängerung der Aufenthaltserlaubnis
> Sehr geehrte Frau Kovalenko,
> wir haben Ihren Antrag vom 12. März erhalten. Für die Bearbeitung fehlen noch Unterlagen. Bitte reichen Sie bis zum 15. April eine aktuelle Meldebescheinigung und einen Nachweis über Ihre Krankenversicherung nach. Wenn die Unterlagen nicht rechtzeitig bei uns sind, können wir den Antrag nicht bearbeiten und müssen ihn gegebenenfalls ablehnen. Bei Fragen erreichen Sie Ihre Sachbearbeiterin, Frau Weber, telefonisch unter der Nummer auf diesem Schreiben.
> Mit freundlichen Grüßen
> Im Auftrag S. Weber

> [!quiz] Was soll Frau Kovalenko tun?
> level: B1 · type: single · id: de-b1-behoerden-q05
> - [x] eine Meldebescheinigung und einen Krankenversicherungsnachweis nachreichen
> - [ ] einen neuen Antrag stellen
> - [ ] Widerspruch einlegen
> - [ ] einen Termin absagen
>
> **Пояснення:** у листі: *Bitte reichen Sie … eine aktuelle Meldebescheinigung und einen Nachweis über Ihre Krankenversicherung nach.* Це не Bescheid, тож Widerspruch ще недоречний.

> [!quiz] Bis wann muss Frau Kovalenko die Unterlagen nachreichen?
> level: B1 · type: single · id: de-b1-behoerden-q06
> - [ ] bis zum 12. März
> - [x] bis zum 15. April
> - [ ] bis Dienstag
> - [ ] es gibt keine Frist
>
> **Пояснення:** *bis zum 15. April* — це Frist. 12. März — дата, коли подано Antrag.

> [!quiz] Ти хочеш спитати про **крайню дату** подання документів. Яке слово вжити?
> level: B1 · type: single · id: de-b1-behoerden-q07
> - [x] die Frist
> - [ ] der Termin
> - [ ] die Zeit
> - [ ] der Schluss
>
> **Пояснення:** *Frist* — строк, до якого щось треба зробити. *Termin* — запис, зустріч у конкретний час; українське «термін» перекладають як *Frist*, а не *Termin*.

> [!quiz] Яке слово означає «рішення установи» (про задоволення чи відхилення заяви)?
> level: B1 · type: single · id: de-b1-behoerden-q08
> - [x] der Bescheid
> - [ ] die Bescheinigung
> - [ ] die Bescheidenheit
> - [ ] die Beschreibung
>
> **Пояснення:** *Bescheid* — офіційне рішення. *Bescheinigung* — довідка, *Bescheidenheit* — скромність, *Beschreibung* — опис.

> [!quiz] Куди звертатися за *Aufenthaltserlaubnis*?
> level: B1 · type: single · id: de-b1-behoerden-q09
> - [x] до Ausländerbehörde
> - [ ] до Krankenkasse
> - [ ] до Familienkasse
> - [ ] до Agentur für Arbeit
>
> **Пояснення:** право на перебування — компетенція *Ausländerbehörde*. Familienkasse виплачує Kindergeld, Krankenkasse відповідає за страхування, Agentur für Arbeit — за роботу.

> [!quiz] Які з цих документів належать до Aufenthaltstitel за § 4 AufenthG?
> level: B1 · type: multi · id: de-b1-behoerden-q10
> - [x] Aufenthaltserlaubnis
> - [x] Niederlassungserlaubnis
> - [x] Blaue Karte EU
> - [ ] Gesundheitskarte
> - [ ] Kindergeld
>
> **Пояснення:** закон називає *Visum, Aufenthaltserlaubnis, Blaue Karte EU, ICT-Karte, Niederlassungserlaubnis* та *Erlaubnis zum Daueraufenthalt-EU*. Gesundheitskarte — страхова картка, Kindergeld — виплата.

> [!quiz] Заповни пропуски
> level: B1 · type: fill · id: de-b1-behoerden-q11
>
> ```text fill
> Der Antrag wurde [[bewilligt]]: Ich bekomme das Geld.
> Gegen den Bescheid kann man [[Widerspruch]] einlegen.
> Bitte reichen Sie die Unterlagen bis Freitag [[nach]].
> Bitte halten Sie die [[Frist]] ein.
> ```
>
> **Пояснення:** *bewilligt* — заяву схвалено (бо гроші будуть); *Widerspruch einlegen*; *nachreichen* — відокремлюване (*reichen … nach*); *eine Frist einhalten*.

> [!quiz] Зʼєднай слово з дією
> level: B1 · type: fill · bank: macht, gibt, nimmt · id: de-b1-behoerden-q12
>
> ```text fill
> Man [[stellt]] einen Antrag.
> Man [[legt]] Widerspruch ein.
> Man [[hält]] die Frist ein.
> ```
>
> **Пояснення:** колокації: *einen Antrag **stellen***, *Widerspruch **einlegen*** (ich lege … ein), *die Frist **einhalten*** (ich halte … ein). Дієслова *machen, geben, nehmen* з цими іменниками не вживаються.

> [!quiz] Склади питання: «Які документи я маю принести?»
> level: B1 · type: order · id: de-b1-behoerden-q13
>
> ```text order
> Welche
> Unterlagen
> muss
> ich
> mitbringen?
> bringen ✗
> ```
>
> **Пояснення:** після питального слова — дієслово *muss* на 2-му місці, підмет *ich*, а *mitbringen* — в кінці (інфінітив з модальним). Форма *bringen* без префікса змінює значення.

> [!quiz] Склади питання: «До якого числа я маю здати заяву?»
> level: B1 · type: order · id: de-b1-behoerden-q14
>
> ```text order
> Bis
> wann
> muss
> ich
> den
> Antrag
> abgeben?
> zu ✗
> ```
>
> **Пояснення:** *Bis wann* — питання про строк. Модальне *muss* на 2-му місці, інфінітив *abgeben* — наприкінці; *zu* перед інфінітивом тут не ставимо.

## Типові помилки українців

> [!pitfall] Termin ≠ термін, Bescheid ≠ довідка
> *der Termin* — це запис або зустріч у конкретний час (*Termin beim Arzt*). Строк, до якого щось треба зробити, — *die Frist*. Рішення установи — *der Bescheid*, а довідка — *die Bescheinigung*. Плутанина тут може коштувати пропущеного строку.

> [!pitfall] Колокації: ~~Antrag machen~~, ~~Widerspruch machen~~
> Німці **стелять** заяву й **кладуть** заперечення: *einen Antrag **stellen***, *Widerspruch **einlegen***, *die Frist **einhalten***, *Unterlagen **einreichen***. Українські «зробити заяву» дослівно не працює.

> [!pitfall] Krankenkasse — не «каса» і не лікарня
> *Kasse* тут — організація, що збирає внески й оплачує лікування (страхова). Лікарня — *das Krankenhaus*, лікар — *der Arzt*, а «каса» в магазині — *die Kasse*. Правильно: *Ich bin bei der AOK versichert*, а не ~~Ich bin in der Krankenkasse~~.

> [!pitfall] Du замість Sie в установі й телефон без привітання
> З Sachbearbeiter(in) — завжди *Sie*. Почни з привітання (*Guten Tag*), назви імʼя й суть справи (*Ich rufe wegen meines Antrags an*), назви Aktenzeichen. Закінчуй *Vielen Dank, auf Wiederhören* (по телефону) або *Auf Wiedersehen*.

## Фішки

> [!reel] 🏦 Kasse — з Італії
> *die Kasse*, за DWDS, прийшла з італійської банківської справи (it. *cassa*) через мову купців. Звідси й *Krankenkasse* — установа, куди сплачують внески на випадок хвороби.

> [!reel] 📬 Leichte Sprache
> Закон про рівні права людей з інвалідністю (BGG, § 11) каже, що органи влади мають частіше давати інформацію в **Leichter Sprache** («легкій мові»). Для тебе це корисно: офіційні сайти (наприклад, федерального уряду) мають сторінки простою німецькою, і вчитися за ними легше.

> [!reel] ✉ Einschreiben
> Рекомендований лист (*Einschreiben*) пошта вручає під підпис, тож відправник має підтвердження. Якщо тебе не було вдома, у скриньку кладуть повідомлення, а лист чекає у відділенні. Тому пошту від установ завжди бери всерйоз і відкривай одразу.

## Джерела та що почитати

- [AufenthG § 4 — Erfordernis eines Aufenthaltstitels](https://www.gesetze-im-internet.de/aufenthg_2004/__4.html) — перелік видів Aufenthaltstitel.
- [AufenthG § 24 — Aufenthaltsgewährung zum vorübergehenden Schutz](https://www.gesetze-im-internet.de/aufenthg_2004/__24.html) — основа тимчасового захисту (Директива 2001/55/EG).
- [VwGO § 70 — Frist des Widerspruchs](https://www.gesetze-im-internet.de/vwgo/__70.html) — один місяць після оголошення рішення.
- [VVG § 193 — Versicherungspflicht](https://www.gesetze-im-internet.de/vvg_2008/__193.html) — обовʼязкове медичне страхування.
- [Verbraucherzentrale — Private Haftpflichtversicherung](https://www.verbraucherzentrale.de/wissen/geld-versicherungen/weitere-versicherungen/private-haftpflichtversicherung-ein-absolutes-muss-fuer-alle-13891) — чому вона добровільна, але важлива.
- [BMAS — Fragen und Antworten für Geflüchtete aus der Ukraine](https://www.bmas.de/DE/Europa-und-die-Welt/Europa/Ukraine/FAQ-DE/faq-art-de.html) — актуальні правила щодо Jobcenter, страхування, роботи.
- [BGG § 11 — Verständlichkeit und Leichte Sprache](https://www.gesetze-im-internet.de/bgg/__11.html) — юридична основа Leichter Sprache.
- [Deutsche Post — Einschreiben](https://www.deutschepost.de/de/e/einschreiben.html) — види рекомендованих листів.
- [DWDS — Kasse](https://www.dwds.de/wb/Kasse) — походження слова.
- [DWDS — Bescheid](https://www.dwds.de/wb/Bescheid) — значення, приклади.
- [Duden — Frist](https://www.duden.de/rechtschreibung/Frist) — значення, вживання.

> [!important] Підсумок
> - Bürgeramt — реєстрація; Ausländerbehörde — право на перебування; Jobcenter й Agentur für Arbeit — робота й виплати; Familienkasse — Kindergeld; Krankenkasse — страхування.
> - Шлях заяви: *Termin vereinbaren → Unterlagen mitbringen → Antrag stellen → Bescheid → Widerspruch einlegen*.
> - У листі шукай **Betreff, Aktenzeichen, Frist**; в кінці Bescheid — **Rechtsbehelfsbelehrung**.
> - *Termin* (запис) ≠ *Frist* (строк); *Bescheid* (рішення) ≠ *Bescheinigung* (довідка).
> - Медичне страхування — обовʼязкове; приватна Haftpflicht — добровільна; з установою завжди **Sie**.
