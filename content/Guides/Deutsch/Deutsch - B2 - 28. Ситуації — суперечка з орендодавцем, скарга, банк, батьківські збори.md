---
title: Ситуації — суперечка з орендодавцем, скарга, банк, батьківські збори
id: de-b2-situationen
level: B2
icon: px:chat
tags: [deutsch, b2, skills, situationen, vermieter, beschwerde, bank, schule, elternabend]
prerequisites: ["[[Deutsch - A2 - 29. Ситуації — Bürgeramt, Anmeldung, огляд квартири, аптека]]", "[[Deutsch - B1 - 18. Пошук житла — оренда, Kaution, WG]]", "[[Deutsch - B2 - 25. Письмо — есе-аргумент, допис, офіційна скарга]]"]
estimatedMinutes: 60
---

# Ситуації — суперечка з орендодавцем, скарга, банк, батьківські збори

> [!success] Після цієї теми ти зможеш
> - повідомити орендодавцю про недолік (*Mängelanzeige*), пояснити, що очікуєш і до якого строку, і назвати наслідок (*Mietminderung*);
> - поскаржитися на послугу, вимагати *Ansprechpartner* і письмове підтвердження, не втративши ввічливого тону;
> - у банку розібратися з незрозумілим списанням (*Lastschrift*), комісією (*Entgelt*) і дізнатися про *Schlichtung*;
> - на *Elternabend* і в *Elterngespräch* поставити питання про оцінки та *Förderung*, не погодитися з рішенням і знати, до кого звертатися далі.

## Передбач

> [!quiz] У ванній зʼявилася цвіль. Що за законом (BGB) має зробити орендар насамперед?
> level: B2 · type: single · id: de-b2-situationen-q01
> - [ ] Одразу перестати платити оренду.
> - [ ] Найняти майстра самому й надіслати рахунок орендодавцю.
> - [x] Негайно повідомити орендодавця про недолік.
> - [ ] Почекати, поки цвіль пошириться.
>
> **Пояснення:** § 536c BGB: коли зʼявляється недолік, орендар **негайно** (*unverzüglich*) повідомляє про нього орендодавця. Якщо не повідомити, можна втратити права (наприклад, на зниження оплати) й відповідати за шкоду. Письмова *Mängelanzeige* з фото — найнадійніший доказ.

## Пояснення

### Одна стратегія для чотирьох ситуацій

У Німеччині конфлікти з орендодавцем, банком, фірмою чи школою вирішують поетапно: **спокійно → письмово → з терміном → з консультацією → формальна процедура**. Тон спокійний, факти конкретні, вимога чітка.

> [!diagram] Драбина ескалації: від розмови до формальної процедури
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "1. Розмова", text: "спокійно повідомити, що не так", note: "Ich möchte Sie auf ein Problem hinweisen.", tone: yellow }
>   - { id: b, label: "2. Письмово", text: "факти + вимога + строк", note: "Mängelanzeige, Beschwerde, E-Mail", tone: pink }
>   - { id: c, label: "3. Frist", text: "конкретна дата й наслідок", note: "bis zum 30. Mai · andernfalls …", tone: yellow }
>   - { id: d, label: "4. Консультація", text: "Mieterverein, Verbraucherzentrale, Beratung", note: "перевірити свої права", tone: pink }
>   - { id: e, label: "5. Формальний шлях", text: "Schlichtung, Rechtsberatung, суд", note: "лише коли решта не допомогла", tone: gray }
> edges:
>   - { from: a, to: b, label: "не допомогло" }
>   - { from: b, to: c }
>   - { from: c, to: d, label: "без реакції" }
>   - { from: d, to: e }
> steps:
>   - { focus: a, note: "Спочатку спокійна розмова чи дзвінок. Скажи, що саме не так, і спитай, що можна зробити. Часто цього досить." }
>   - { focus: b, note: "Якщо усно не допомогло, пиши. Лист чи email фіксує факти: що, коли, чого ти очікуєш. Збережи копію." }
>   - { focus: c, note: "Назви дату: «bis zum 30. Mai». Додай, що буде далі: «andernfalls werde ich die Miete mindern» (або «mich an die Verbraucherzentrale wenden»)." }
>   - { focus: d, note: "Порадься, перш ніж діяти далі: Mieterverein чи Mieterbund, Verbraucherzentrale, Beratung у банку чи школі. Вони підкажуть, чи правильні твої очікування." }
>   - { focus: e, note: "Лише тепер Schlichtung (посередництво), Rechtsberatung або суд. Це дорожче й довше, тож ескалація без потреби не допомагає." }
> ```
> Жовті блоки — розмови й строки, рожеві — письмо й консультація, сірий — формальна процедура.

### Тон: ввічливо, але чітко

Німецька ввічливість у конфлікті тримається на трьох речах: **Sie**, **Konjunktiv II** («Könnten Sie…», «Ich wäre Ihnen dankbar…») і **описі фактів без звинувачень**. Різке «Ich will sofort…» або «Das ist eine Frechheit!» зазвичай погіршує переговори.

> [!diagram] Різко чи ввічливо: як сказати те саме
> ```yaml
> layout: compare
> columns: { h: "різко, закриває розмову", s: "чітко й ввічливо" }
> nodes:
>   - { id: h1, col: h, label: "Ich will mein Geld zurück!", text: "наказ", note: "викликає опір", tone: yellow }
>   - { id: s1, col: s, label: "Ich bitte Sie, mir den Betrag zu erstatten.", text: "прохання з Sie", note: "формально, але чітко", tone: pink }
>   - { id: h2, col: h, label: "Das ist eine Frechheit!", text: "оцінка людини", note: "звинувачення", tone: yellow }
>   - { id: s2, col: s, label: "Ich bin mit der Lösung nicht einverstanden.", text: "опис свого ставлення", note: "про рішення, а не про людину", tone: pink }
>   - { id: h3, col: h, label: "Machen Sie das endlich!", text: "тиск", note: "без строку й причини", tone: yellow }
>   - { id: s3, col: s, label: "Könnten Sie das bis Freitag erledigen?", text: "Konjunktiv II + строк", note: "конкретно й ввічливо", tone: pink }
> steps:
>   - { focus: [h1, s1], note: "Замість наказу — ввічливе прохання: Ich bitte Sie, … / Ich möchte … Це не слабкість, а норма." }
>   - { focus: [h2, s2], note: "Говори про ситуацію й своє ставлення, а не про людину: Ich bin enttäuscht / nicht einverstanden." }
>   - { focus: [h3, s3], note: "Строк — частина ввічливої вимоги: bis Freitag, bis zum 20. Mai. Konjunktiv II помʼякшує тон." }
> ```
> Жовтий — різкий варіант, рожевий — ввічливий; кожен блок має мітку.

> [!note] Це не юридична консультація
> Нижче — орієнтири з офіційних текстів (BGB). Конкретний випадок залежить від договору й обставин: порадься з *Mieterverein*, *Verbraucherzentrale* чи юристом.

### Ситуація 1: орендодавець

- **Недолік** (*der Mangel*, напр. *Schimmel*, *Heizung defekt*): орендар повідомляє про нього орендодавця **негайно** (§ 536c BGB). Орендодавець зобовʼязаний утримувати житло в придатному стані (§ 535 BGB).
- **Mietminderung** (§ 536 BGB): якщо через недолік житло гірше придатне до користування, орендна плата зменшується «відповідно» (*angemessen herabgesetzt*). Розмір залежить від конкретного випадку, а незначне погіршення не враховується.
- **Nebenkostenabrechnung** (§ 556 BGB): орендар має заперечити проти розрахунку не пізніше ніж до кінця дванадцятого місяця після того, як розрахунок надійшов.
- **Kündigung** орендарем (§§ 568, 573c BGB): потрібна **письмова форма** (власноручний підпис, § 126 Abs. 1 BGB): звичайний email чи скан не підходять; електронна форма — лише з кваліфікованим електронним підписом (§ 126 Abs. 3, § 126a). Це орієнтир, не юридична консультація; лист має надійти не пізніше третього робочого дня місяця — тоді договір закінчується наприкінці позанаступного місяця (лист отримано до 3 січня → кінець 31 березня).

### Ситуація 2: скарга на послугу

Формула: **що сталося → чому це проблема → чого хочеш → до якого строку**. Якщо перший співрозмовник не може вирішити, проси **Ansprechpartner** або **Vorgesetzte** та **письмове підтвердження**. Закон розрізняє *Gewährleistung* (відповідальність продавця за недоліки, передбачена законом) і *Garantie* (добровільне зобовʼязання понад закон).

### Ситуація 3: банк

- **Незрозуміле списання** (*Lastschrift*): за SEPA-Basislastschrift можна вимагати повернення **без пояснень** протягом **восьми тижнів** від списання (§ 675x BGB). Якщо мандата взагалі не давали (списання неавторизоване), строк довший — до 13 місяців (§ 676b BGB); уточни в банку.
- **Комісія** (*Entgelt*, *Kontoführungsgebühr*): умови банку є в договорі й змінах до нього; якщо не згоден, звертайся до *Beratung*, а далі до *Schlichtung* (напр. Schlichtungsstelle der Deutschen Bundesbank або Ombudsmann der privaten Banken).
- **Berater** може пояснити послуги, але рішення приймаєш ти. Не підписуй те, чого не розумієш; проси час на роздуми.

### Ситуація 4: школа

*Elternabend* — збори батьків класу: вчителька розповідає про успішність, плани, *Klassenarbeiten*, *Förderunterricht*. Батьки обирають *Elternvertreter*. Назви органів батьківського представництва залежать від землі: у кожної землі «власна концепція», вона закріплена в шкільних законах (*Klassenpflegschaft*, *Schulelternbeirat*, *Elternvertretung*). *Elterngespräch* — індивідуальна розмова про дитину. Якщо не згоден з оцінкою, спершу говори з вчителем, потім з *Schulleitung*.

## Приклади

- *Im Bad ist Schimmel an der Wand. Ich schicke Ihnen heute eine **Mängelanzeige**.* — У ванній цвіль на стіні. Сьогодні надішлю вам повідомлення про недолік.
- *Ich bitte Sie, den Mangel bis zum 30. Mai zu beheben.* — Прошу усунути недолік до 30 травня.
- *Andernfalls werde ich die Miete **mindern**.* — Інакше я зменшу орендну плату.
- *Ich möchte mich über den Service **beschweren**.* — Хочу поскаржитися на сервіс.
- *Können Sie mir einen **Ansprechpartner** nennen?* — Чи можете назвати мені контактну особу?
- *Bitte bestätigen Sie mir das **schriftlich**.* — Будь ласка, підтвердіть мені це письмово.
- *Diese **Lastschrift** habe ich nicht autorisiert.* — Це списання я не авторизував.
- *Ich möchte die Lastschrift **zurückbuchen** lassen.* — Хочу, щоб списання повернули.
- *An wen kann ich mich wenden, wenn wir uns nicht einigen?* — До кого я можу звернутися, якщо ми не домовимося?
- *Ich bin mit der Note nicht einverstanden.* — Я не згодна з оцінкою.
- *Können wir einen Termin für ein **Elterngespräch** vereinbaren?* — Чи можемо домовитися про зустріч для розмови з батьками?
- *Wenn wir uns nicht einigen, möchte ich mit der **Schulleitung** sprechen.* — Якщо ми не домовимося, я хочу поговорити з керівництвом школи.

## Слова

### Орендар і орендодавець

> [!word] die Mängelanzeige
> ipa: /ˈmɛŋl̩ʔanˌtsaɪ̯ɡə/ · pos: noun · level: B2 · id: de-b2-situationen-w01
> uk: повідомлення про недолік
> forms: die Mängelanzeigen
> example: Ich habe dem Vermieter eine **Mängelanzeige** geschickt. — Я надіслала орендодавцю повідомлення про недолік.
> note: § 536c BGB: недолік треба повідомити негайно. Закон не вимагає форми, але письмово (з фото) — доказ.

> [!word] die Mietminderung
> ipa: /ˈmiːtˌmɪndəʁʊŋ/ · pos: noun · level: B2 · id: de-b2-situationen-w02
> uk: зниження орендної плати
> forms: die Mietminderungen
> example: Wegen des Schimmels kündigt sie eine **Mietminderung** an. — Через цвіль вона повідомляє про зниження оренди.
> note: § 536 BGB: оплата зменшується «відповідно», коли придатність житла погіршена. Розмір залежить від випадку. Дієслово: die Miete mindern.

> [!word] die Nachzahlung
> ipa: /ˈnaːxˌtsaːlʊŋ/ · pos: noun · level: B2 · id: de-b2-situationen-w03
> uk: доплата
> forms: die Nachzahlungen
> example: Die Abrechnung zeigt eine **Nachzahlung** von 240 Euro. — Розрахунок показує доплату у 240 євро.
> note: після Nebenkostenabrechnung. Заперечити проти розрахунку можна до кінця 12-го місяця після його отримання (§ 556 BGB). Nach- = «після».

> [!word] die Instandhaltung
> ipa: /ɪnˈʃtanthaltʊŋ/ · pos: noun · level: B2 · id: de-b2-situationen-w04
> uk: утримання в належному стані
> forms: — (без множини)
> example: Die **Instandhaltung** der Wohnung gehört zu den Pflichten des Vermieters. — Утримання квартири в належному стані — обовʼязок орендодавця.
> note: § 535 BGB: орендодавець утримує житло в придатному стані. Не плутай з die Instandsetzung (ремонт).

> [!word] fristlos
> ipa: /ˈfʁɪstloːs/ · pos: adj · level: B2 · id: de-b2-situationen-w05
> uk: без дотримання строку
> forms: — (без ступенів)
> example: Eine **fristlose** Kündigung braucht einen wichtigen Grund. — Для розірвання без строку потрібна поважна причина.
> note: fristlos kündigen. Суфікс -los (B2-24). Протилежне: fristgerecht, ordentlich.

> [!word] die Haftung
> ipa: /ˈhaftʊŋ/ · pos: noun · level: B2 · id: de-b2-situationen-w06
> uk: відповідальність (за шкоду)
> forms: die Haftungen (рідко)
> example: Die **Haftung** für den Schaden liegt beim Verursacher. — Відповідальність за шкоду несе той, хто її заподіяв.
> note: haften für + Akk. Haftpflichtversicherung — страхування цивільної відповідальності.

> [!word] die Eingangsbestätigung
> ipa: /ˈaɪ̯nɡaŋsbəˌʃtɛːtɪɡʊŋ/ · pos: noun · level: B2 · id: de-b2-situationen-w07
> uk: підтвердження отримання
> forms: die Eingangsbestätigungen
> example: Bitte schicken Sie mir eine **Eingangsbestätigung**. — Будь ласка, надішліть мені підтвердження отримання.
> note: Eingang + Bestätigung. Корисно для доказу, що лист доставлено.

> [!word] die Schlichtung
> ipa: /ˈʃlɪçtʊŋ/ · pos: noun · level: B2 · id: de-b2-situationen-w08
> uk: примирення; позасудове посередництво
> forms: die Schlichtungen
> example: Bei der **Schlichtung** sucht ein Dritter eine Lösung. — Під час позасудового посередництва третя сторона шукає рішення.
> note: der Schlichter, die Schlichtungsstelle. Дієслово schlichten.

> [!word] die Rechtsberatung
> ipa: /ˈʁɛçtsbəˌʁaːtʊŋ/ · pos: noun · level: B2 · id: de-b2-situationen-w09
> uk: юридична консультація
> forms: die Rechtsberatungen
> example: Der Mieterverein bietet seinen Mitgliedern **Rechtsberatung** an. — Орендарська спілка пропонує членам юридичну консультацію.
> note: Fugen-s: Recht+s+beratung. Наголос на першому складі.

> [!word] der Mieterverein
> ipa: /ˈmiːtɐfɛɐ̯ˌʔaɪ̯n/ · pos: noun · level: B2 · id: de-b2-situationen-w10
> uk: спілка орендарів
> forms: die Mietervereine
> example: Sie ist Mitglied im **Mieterverein** und lässt sich dort beraten. — Вона є членом спілки орендарів і отримує там поради.
> note: на національному рівні — der Deutsche Mieterbund. Консультують членів.

### Скарга й ескалація

> [!word] die Eskalation
> ipa: /ɛskalaˈtsi̯oːn/ · pos: noun · level: B2 · id: de-b2-situationen-w11
> uk: ескалація; загострення
> forms: die Eskalationen
> example: Ein ruhiger Ton verhindert die **Eskalation**. — Спокійний тон запобігає загостренню.
> note: -tion = [tsi̯oːn], наголос на останньому складі. Також: Eskalationsstufe.

> [!word] eskalieren
> ipa: /ɛskaˈliːʁən/ · pos: verb · level: B2 · id: de-b2-situationen-w12
> uk: загострюватися
> forms: eskalieren → eskalierte → ist eskaliert
> example: Der Streit **eskalierte** schnell. — Суперечка швидко загострилася.
> note: допоміжне sein. Перехідне: einen Konflikt eskalieren lassen.

> [!word] der Ansprechpartner
> ipa: /ˈanʃpʁɛçˌpaʁtnɐ/ · pos: noun · level: B2 · id: de-b2-situationen-w13
> uk: контактна особа
> forms: die Ansprechpartner
> example: Wer ist mein **Ansprechpartner** für Reklamationen? — Хто моя контактна особа для рекламацій?
> note: жінка: die Ansprechpartnerin, мн. die Ansprechpartnerinnen. ansprechen (звертатися) + der Partner.

> [!word] die Vereinbarung
> ipa: /fɛɐ̯ˈʔaɪ̯nbaːʁʊŋ/ · pos: noun · level: B2 · id: de-b2-situationen-w14
> uk: домовленість
> forms: die Vereinbarungen
> example: Wir haben eine schriftliche **Vereinbarung** getroffen. — Ми уклали письмову домовленість.
> note: Vereinbarung treffen. Усна домовленість важко довести: бажано письмово.

> [!word] verweigern
> ipa: /fɛɐ̯ˈvaɪ̯ɡɐn/ · pos: verb · level: B2 · id: de-b2-situationen-w15
> uk: відмовляти; відмовлятися
> forms: verweigern → verweigerte → hat verweigert
> example: Der Verkäufer **verweigert** den Umtausch. — Продавець відмовляється обміняти товар.
> note: + Akk. Іменник die Verweigerung.

### Банк

> [!word] der Berater
> ipa: /bəˈʁaːtɐ/ · pos: noun · level: B2 · id: de-b2-situationen-w16
> uk: консультант
> forms: die Berater
> example: Der **Berater** erklärt mir die Kontoführung. — Консультант пояснює мені ведення рахунку.
> note: жінка: die Beraterin, мн. die Beraterinnen. beraten → er berät. Іменник die Beratung.

> [!word] der Dispo
> ipa: /ˈdɪspo/ · pos: noun · level: B2 · id: de-b2-situationen-w17
> uk: овердрафт; дозволений мінус на рахунку
> forms: die Dispos
> example: Mein **Dispo** ist schon fast ausgeschöpft. — Мій овердрафт майже вичерпаний.
> note: розмовне скорочення від Dispositionskredit. Відсотки за дозволений мінус зазвичай високі: перевір у договорі.

> [!word] das Entgelt
> ipa: /ɛntˈɡɛlt/ · pos: noun · level: B2 · id: de-b2-situationen-w18
> uk: плата; комісія
> forms: die Entgelte
> example: Das **Entgelt** für das Konto steht im Preisverzeichnis. — Плата за рахунок вказана в тарифах.
> note: формальніше за die Gebühr. Kontoführungsentgelt — те саме, що Kontoführungsgebühr.

> [!word] die Kontoführungsgebühr
> ipa: /ˈkɔntofyːʁʊŋsɡəˌbyːɐ̯/ · pos: noun · level: B2 · id: de-b2-situationen-w19
> uk: плата за ведення рахунку
> forms: die Kontoführungsgebühren
> example: Die **Kontoführungsgebühr** steigt zum 1. Juli. — Плата за ведення рахунку зростає з 1 липня.
> note: складне слово: Konto + Führung + Gebühr; рід за останньою частиною. Перевіряй у Preis- und Leistungsverzeichnis.

> [!word] die Rückbuchung
> ipa: /ˈʁʏkˌbuːxʊŋ/ · pos: noun · level: B2 · id: de-b2-situationen-w20
> uk: зворотне проведення; повернення списання
> forms: die Rückbuchungen
> example: Ich beantrage die **Rückbuchung** der Lastschrift. — Я прошу повернути списання.
> note: SEPA-Basislastschrift: повернення без пояснень до 8 тижнів (§ 675x BGB). ü коротке [ʏ].

> [!word] zurückbuchen
> ipa: /tsuˈʁʏkbuːxn̩/ · pos: verb · level: B2 · id: de-b2-situationen-w21
> uk: повернути (списану суму)
> forms: zurückbuchen → buchte zurück → hat zurückgebucht
> example: Die Bank **bucht** den Betrag **zurück**. — Банк повертає суму.
> note: відокремлюване. Lastschrift zurückbuchen lassen. Наголос на -rück-: zuˈrückbuchen.

> [!word] der Kontoinhaber
> ipa: /ˈkɔntoˌʔɪnhaːbɐ/ · pos: noun · level: B2 · id: de-b2-situationen-w22
> uk: власник рахунку
> forms: die Kontoinhaber
> example: Der **Kontoinhaber** kann die Lastschrift zurückbuchen lassen. — Власник рахунку може повернути списання.
> note: жінка: die Kontoinhaberin, мн. die Kontoinhaberinnen. Inhaber — власник; ʔ перед In-.

> [!word] die Gutschrift
> ipa: /ˈɡuːtʃʁɪft/ · pos: noun · level: B2 · id: de-b2-situationen-w23
> uk: зарахування на рахунок
> forms: die Gutschriften
> example: Die **Gutschrift** erscheint in zwei Tagen auf dem Konto. — Зарахування зʼявиться на рахунку за два дні.
> note: протилежне: die Lastschrift (списання). Gut + Schrift.

### Школа

> [!word] der Elternabend
> ipa: /ˈɛltɐnˌʔaːbn̩t/ · pos: noun · level: B2 · id: de-b2-situationen-w24
> uk: збори батьків
> forms: die Elternabende
> example: Der **Elternabend** beginnt um 19 Uhr in der Aula. — Збори батьків починаються о 19:00 в актовій залі.
> note: Eltern-+Abend. Також у садочку (Kita). Інші назви органів — за землею.

> [!word] der Elternvertreter
> ipa: /ˈɛltɐnfɛɐ̯ˌtʁeːtɐ/ · pos: noun · level: B2 · id: de-b2-situationen-w25
> uk: представник батьків
> forms: die Elternvertreter
> example: Der **Elternvertreter** spricht mit der Schulleitung. — Представник батьків говорить з керівництвом школи.
> note: жінка: die Elternvertreterin. Назви й права залежать від землі (Klassenpflegschaft, Elternvertretung).

> [!word] der Klassenlehrer
> ipa: /ˈklasn̩ˌleːʁɐ/ · pos: noun · level: B2 · id: de-b2-situationen-w26
> uk: класний керівник
> forms: die Klassenlehrer
> example: Der **Klassenlehrer** bespricht die Noten mit den Eltern. — Класний керівник обговорює оцінки з батьками.
> note: жінка: die Klassenlehrerin, мн. die Klassenlehrerinnen. Також Klassenleitung.

> [!word] die Klassenarbeit
> ipa: /ˈklasn̩ˌʔaʁbaɪ̯t/ · pos: noun · level: B2 · id: de-b2-situationen-w27
> uk: контрольна робота
> forms: die Klassenarbeiten
> example: Die **Klassenarbeit** in Mathe war schwer. — Контрольна з математики була складною.
> note: у різних землях також: Schulaufgabe (BY), Klausur (старші класи).

> [!word] die Förderung
> ipa: /ˈfœʁdəʁʊŋ/ · pos: noun · level: B2 · id: de-b2-situationen-w28
> uk: підтримка; додаткове навчання
> forms: die Förderungen
> example: Das Kind braucht eine gezielte **Förderung** in Deutsch. — Дитині потрібна цілеспрямована підтримка з німецької.
> note: fördern → die Förderung. Також фінансова підтримка (Förderung für Projekte).

> [!word] der Förderunterricht
> ipa: /ˈfœʁdɐˌʔʊntɐʁɪçt/ · pos: noun · level: B2 · id: de-b2-situationen-w29
> uk: додаткові заняття для учнів, яким потрібна підтримка
> forms: — (без множини)
> example: Der **Förderunterricht** findet mittwochs statt. — Додаткові заняття відбуваються по середах.
> note: Unterricht, без множини. Також Nachhilfe (репетиторство, часто платне).

> [!word] die Schulleitung
> ipa: /ˈʃuːlˌlaɪ̯tʊŋ/ · pos: noun · level: B2 · id: de-b2-situationen-w30
> uk: керівництво школи
> forms: — (без множини)
> example: Bei Problemen wenden sich die Eltern an die **Schulleitung**. — У разі проблем батьки звертаються до керівництва школи.
> note: керівник — der Schulleiter, керівниця — die Schulleiterin. Leitung — «керівництво».

> [!word] das Elterngespräch
> ipa: /ˈɛltɐnɡəˌʃpʁɛːç/ · pos: noun · level: B2 · id: de-b2-situationen-w31
> uk: розмова з батьками
> forms: die Elterngespräche
> example: Die Lehrerin lädt uns zu einem **Elterngespräch** ein. — Вчителька запрошує нас на розмову з батьками.
> note: ch у Gespräch — мʼяке [ç]. Ще один формат — Sprechstunde (години прийому вчителя).

> [!word] die Versetzung
> ipa: /fɛɐ̯ˈzɛtsʊŋ/ · pos: noun · level: B2 · id: de-b2-situationen-w32
> uk: перехід до наступного класу
> forms: die Versetzungen
> example: Die **Versetzung** ist gefährdet, wenn die Noten schlecht bleiben. — Перехід до наступного класу під загрозою, якщо оцінки залишаться поганими.
> note: versetzen → versetzt; sitzen bleiben — залишитися на другий рік. Правила — за землею.

> [!word] das Zeugnis
> ipa: /ˈtsɔʏ̯knɪs/ · pos: noun · level: B2 · id: de-b2-situationen-w33
> uk: табель; свідоцтво; характеристика
> forms: die Zeugnisse
> example: Das **Zeugnis** bekommen die Schüler am Schuljahresende. — Табель учні отримують наприкінці навчального року.
> note: також трудова характеристика (Arbeitszeugnis). eu = [ɔʏ̯]; множина з -se: Zeugnisse.

## Ситуація 1: цвіль у ванній

> [!listen] Оксана телефонує до Hausverwaltung. Що вона повідомляє і що обіцяє зробити?
> level: B2 · type: answer · id: de-b2-situationen-l01
> audio: A: Hausverwaltung Roth, guten Tag.
> audio: B: Guten Tag, hier Kovalenko, Lindenstraße fünf. Im Bad ist Schimmel an der Wand.
> audio: A: Seit wann denn?
> audio: B: Seit drei Wochen. Ich schicke Ihnen heute eine Mängelanzeige mit Fotos.
> audio: A: Gut, ich schicke einen Handwerker.
> - [x] Повідомляє про цвіль і надішле письмову Mängelanzeige з фото.
> - [ ] Повідомляє, що вже платить меншу оренду.
> - [ ] Просить дозвіл розірвати договір.
> - [ ] Просить орендодавця заплатити за її власний ремонт.
>
> **Пояснення:** *Schimmel an der Wand* — цвіль на стіні; вона *schickt eine Mängelanzeige mit Fotos* — надішле повідомлення з фото. Переклад: — Управління будинком Рот, добрий день. — Добрий день, це Коваленко, Лінденштрасе, 5. У ванній цвіль на стіні. — З якого часу? — Три тижні. Сьогодні надішлю вам повідомлення про недолік із фото. — Добре, надішлю майстра.

> [!listen] Запиши голосове повідомлення від Hausverwaltung
> level: B2 · type: fill · id: de-b2-situationen-l02
> audio: A: Hier ist Frau Roth. Der Handwerker kommt am Dienstag zwischen acht und zehn Uhr. Bitte seien Sie zu Hause. Die Reparatur dauert zwei Tage.
>
> ```fill
> Tag: [[Dienstag]]
> Zeit: von [[8|acht]] bis [[10|zehn]] Uhr
> Dauer: [[2|zwei]] Tage
> ```
>
> **Пояснення:** *am Dienstag zwischen acht und zehn Uhr* — у вівторок між 8 і 10; *die Reparatur dauert zwei Tage* — ремонт триває два дні.

> [!speak] Ситуація 1: повідом про недолік
> level: B2 · id: de-b2-situationen-s01
> text: Im Bad ist Schimmel an der Wand.
> ipa: /ɪm baːt ɪst ˈʃɪml̩ an deːɐ̯ vant/
> tip: Bad — довге [aː], d у кінці оглушується до [t]: «баат»; Schimmel — sch [ʃ], i коротке; Wand — d у кінці [t].
> uk: У ванній цвіль на стіні.

> [!listen] Через два тижні: цвіль повернулася. Що робить Оксана?
> level: B2 · type: answer · id: de-b2-situationen-l03
> audio: A: Frau Roth, der Handwerker war da, aber der Schimmel ist wieder da.
> audio: B: Das kann passieren. Lüften Sie mehr.
> audio: A: Das Problem liegt an der Wand. Ich bitte Sie, den Mangel bis zum dreißigsten Mai zu beheben, sonst mindere ich die Miete.
> audio: B: Ich leite das an den Eigentümer weiter.
> - [x] Називає строк до 30 травня й попереджає про зниження оренди.
> - [ ] Погоджується, що вона має більше провітрювати, й закінчує розмову.
> - [ ] Одразу розриває договір.
> - [ ] Просить повернути заставу (Kaution).
>
> **Пояснення:** *Ich bitte Sie, den Mangel bis zum dreißigsten Mai zu beheben, sonst mindere ich die Miete* — прохання зі строком і наслідком. Переклад: — Пані Рот, майстер приходив, але цвіль знову зʼявилася. — Таке буває. Більше провітрюйте. — Проблема в стіні. Прошу усунути недолік до тридцятого травня, інакше я зменшу оренду. — Передам це власнику.

> [!speak] Ситуація 1: назви строк
> level: B2 · id: de-b2-situationen-s02
> text: Ich bitte Sie, den Mangel bis zum dreißigsten Mai zu beheben.
> ipa: /ɪç ˈbɪtə ziː deːn ˈmaŋl̩ bɪs tsʊm ˈdʁaɪ̯sɪçstn̩ maɪ̯ tsuː bəˈheːbn̩/
> tip: dreißigsten — ß = [s], -ig- = [ɪç]; Mangel — [ˈmaŋl̩], ng = [ŋ]; beheben — наголос на -he-.
> uk: Прошу усунути недолік до тридцятого травня.

> [!speak] Ситуація 1: попередь про наслідок
> level: B2 · id: de-b2-situationen-s03
> text: Andernfalls werde ich die Miete mindern.
> ipa: /ˈandɐnfals ˈvɛʁdə ɪç diː ˈmiːtə ˈmɪndɐn/
> tip: Andernfalls — [ˈandɐnfals], наголос на першому складі; mindern — коротке [ɪ], [ˈmɪndɐn]. ie в Miete довге [iː].
> uk: Інакше я зменшу орендну плату.

## Ситуація 2: скарга на сервіс

> [!listen] Клієнтка скаржиться на інтернет-провайдера. Чого вона вимагає?
> level: B2 · type: answer · id: de-b2-situationen-l04
> audio: A: Kundenservice, Hahn, guten Tag.
> audio: B: Guten Tag. Seit zehn Tagen habe ich kein Internet. Ihr Techniker hat dreimal zugesagt und kam nie.
> audio: A: Das tut mir leid. Ich kann nichts versprechen.
> audio: B: Dann möchte ich mit Ihrer Vorgesetzten sprechen. Und bitte bestätigen Sie mir alles schriftlich.
> - [x] Розмову з керівницею й письмове підтвердження.
> - [ ] Повернення грошей негайно.
> - [ ] Нового техніка сьогодні ж.
> - [ ] Розірвання договору.
>
> **Пояснення:** *Ich möchte mit Ihrer Vorgesetzten sprechen* і *bestätigen Sie mir alles schriftlich*. Переклад: — Сервіс клієнтів, Ган, добрий день. — Добрий день. Десять днів в мене немає інтернету. Ваш технік тричі обіцяв прийти й так і не прийшов. — Мені шкода. Нічого обіцяти не можу. — Тоді я хочу поговорити з вашою керівницею. І будь ласка, підтвердьте мені все письмово.

> [!listen] Який вираз ти почув?
> level: B2 · type: choice · id: de-b2-situationen-l05
> audio: Ich möchte mich über den Service beschweren.
> - [ ] Ich möchte mich auf den Service beschweren.
> - [x] Ich möchte mich über den Service beschweren.
> - [ ] Ich möchte mich für den Service beschweren.
>
> **Пояснення:** *sich beschweren **über** + Akk* (на що). *Auf* і *für* до цього дієслова не належать.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-situationen-l06
> audio: Bitte bestätigen Sie mir das schriftlich.

> [!speak] Ситуація 2: скажи, що скаржишся
> level: B2 · id: de-b2-situationen-s04
> text: Ich möchte mich über den Service beschweren.
> ipa: /ɪç ˈmœçtə mɪç ˈyːbɐ deːn ˈzœʁvɪs bəˈʃveːʁən/
> tip: möchte — ö [œ] і мʼяке ch [ç]; Service — на англійський лад [ˈzœʁvɪs]; beschweren — наголос на -schwe-.
> uk: Хочу поскаржитися на сервіс.

> [!speak] Ситуація 2: проси керівника
> level: B2 · id: de-b2-situationen-s05
> text: Könnte ich bitte mit Ihrem Vorgesetzten sprechen?
> ipa: /ˈkœntə ɪç ˈbɪtə mɪt ˈiːʁəm ˈfoːɐ̯ɡəˌzɛtstn̩ ˈʃpʁɛçn̩/
> tip: Konjunktiv II könnte — [ˈkœntə]; Vorgesetzten — v тут [f], -ge- слабке; sprechen — sp на початку = [ʃp].
> uk: Чи можна поговорити з вашим керівником?

> [!speak] Ситуація 2: проси письмово
> level: B2 · id: de-b2-situationen-s06
> text: Bitte bestätigen Sie mir das schriftlich.
> ipa: /ˈbɪtə bəˈʃtɛːtɪɡn̩ ziː miːɐ̯ das ˈʃʁɪftlɪç/
> tip: bestätigen — ä довге [ɛː], st = [ʃt]; schriftlich — sch [ʃ], r [ʁ], f і t разом: [ʃʁɪftlɪç].
> uk: Будь ласка, підтвердіть мені це письмово.

## Ситуація 3: у банку

> [!listen] Клієнт телефонує до банку. Що пропонує консультант?
> level: B2 · type: answer · id: de-b2-situationen-l07
> audio: A: Beratung, guten Tag.
> audio: B: Auf meinem Konto ist eine Lastschrift über neunundachtzig Euro, die ich nicht kenne.
> audio: A: Seit wann?
> audio: B: Seit vorgestern.
> audio: A: Das geht: Bei einer SEPA-Lastschrift können Sie innerhalb von acht Wochen zurückbuchen lassen, ohne Begründung.
> - [x] Протягом восьми тижнів повернути списання без пояснень.
> - [ ] Лише зателефонувати у відповідну фірму.
> - [ ] Чекати шість місяців.
> - [ ] Подати позов.
>
> **Пояснення:** *innerhalb von acht Wochen … ohne Begründung* — за SEPA-Basislastschrift (§ 675x BGB). Переклад: — Консультація, добрий день. — На моєму рахунку списання на 89 євро, яке я не знаю. — З якого часу? — З позавчора. — Можна: за SEPA-списанням ви можете протягом восьми тижнів повернути гроші без пояснень. Якщо мандата не було, строк довший (до 13 місяців, § 676b BGB).

> [!speak] Ситуація 3: поясни проблему
> level: B2 · id: de-b2-situationen-s07
> text: Diese Lastschrift habe ich nicht autorisiert.
> ipa: /ˈdiːzə ˈlastʃʁɪft ˈhaːbə ɪç nɪçt aʊ̯toʁiˈziːɐ̯t/
> tip: Lastschrift — Last + schrift: [last-ʃʁɪft]; autorisiert — au [aʊ̯], наголос на -siert; Partizip II без ge-.
> uk: Цього списання я не авторизував.

> [!speak] Ситуація 3: проси повернення
> level: B2 · id: de-b2-situationen-s08
> text: Ich möchte die Lastschrift zurückbuchen lassen.
> ipa: /ɪç ˈmœçtə diː ˈlastʃʁɪft tsuˈʁʏkbuːxn̩ ˈlasn̩/
> tip: zurückbuchen — наголос на -rück-, ü [ʏ] коротке; lassen — коротке [a], ss = [s].
> uk: Хочу, щоб списання повернули.

> [!listen] Клієнт дізнається про комісію. Що він робить?
> level: B2 · type: answer · id: de-b2-situationen-l08
> audio: A: Ich habe gesehen, dass das Entgelt für mein Konto gestiegen ist. Damit bin ich nicht einverstanden.
> audio: B: Das steht in den neuen Bedingungen.
> audio: A: Dann möchte ich mich offiziell beschweren und frage nach der Schlichtungsstelle.
> audio: B: Ich gebe Ihnen das Formular.
> - [x] Подає офіційну скаргу й питає про посередництво.
> - [ ] Мовчки погоджується з новими умовами.
> - [ ] Закриває рахунок на місці.
> - [ ] Вимагає звільнити консультанта.
>
> **Пояснення:** *beschweren* і *Schlichtungsstelle* — клієнт офіційно скаржиться й питає про позасудове посередництво. Переклад: — Я побачив, що плата за мій рахунок зросла. Я з цим не згоден. — Це написано в нових умовах. — Тоді я хочу офіційно поскаржитися й питаю про посередницький орган. — Дам вам формуляр.

> [!speak] Ситуація 3: запитай про наступний крок
> level: B2 · id: de-b2-situationen-s09
> text: An wen kann ich mich wenden, wenn wir uns nicht einigen?
> ipa: /an veːn kan ɪç mɪç ˈvɛndn̩ vɛn viːɐ̯ ʊns nɪçt ˈaɪ̯nɪɡn̩/
> tip: wen — довге [eː]; wenden — коротке [ɛ]; einigen — ei [aɪ̯], -ig- [ɪɡ] (g звучить, бо далі голосний).
> uk: До кого я можу звернутися, якщо ми не домовимося?

## Ситуація 4: Elternabend

> [!listen] Вчителька розповідає про додаткові заняття. Що мають зробити батьки?
> level: B2 · type: answer · id: de-b2-situationen-l09
> audio: A: Willkommen zum Elternabend. In Mathe sind die Klassenarbeiten schlechter geworden. Wir bieten Förderunterricht am Mittwoch an.
> audio: B: Wie lange dauert er?
> audio: A: Eine Stunde. Bitte melden Sie Ihr Kind bis Freitag an.
> - [x] Записати дитину на Förderunterricht до пʼятниці.
> - [ ] Прийти до школи в середу без дитини.
> - [ ] Заплатити за Förderunterricht одразу.
> - [ ] Поговорити з директором.
>
> **Пояснення:** *Förderunterricht am Mittwoch*, *melden Sie Ihr Kind bis Freitag an* — записати дитину до пʼятниці. Переклад: — Ласкаво просимо на збори. З математики контрольні стали гіршими. Пропонуємо додаткові заняття в середу. — Скільки вони тривають? — Годину. Будь ласка, запишіть дитину до пʼятниці.

> [!speak] Ситуація 4: заперечи проти оцінки
> level: B2 · id: de-b2-situationen-s10
> text: Ich bin mit der Note nicht einverstanden.
> ipa: /ɪç bɪn mɪt deːɐ̯ ˈnoːtə nɪçt ˈaɪ̯nfɛɐ̯ʃtandn̩/
> tip: Note — довге [oː]; einverstanden — наголос на ein-, ei = [aɪ̯], v у ver- = [f].
> uk: Я не згодна з оцінкою.

> [!listen] Мати не згодна з оцінкою. Що вони домовляються?
> level: B2 · type: answer · id: de-b2-situationen-l10
> audio: A: Frau Müller, ich bin mit der Note nicht einverstanden. Meine Tochter hat die Aufgabe richtig gelöst.
> audio: B: Das können wir im Elterngespräch klären. Haben Sie am Donnerstag Zeit?
> audio: A: Ja. Wenn wir uns nicht einigen, möchte ich mit der Schulleitung sprechen.
> audio: B: Das ist Ihr gutes Recht.
> - [x] Зустріч у четвер; якщо не домовляться, вона піде до керівництва школи.
> - [ ] Вчителька одразу змінює оцінку.
> - [ ] Мати забирає дитину зі школи.
> - [ ] Розмова відбудеться через місяць.
>
> **Пояснення:** *im Elterngespräch klären*, *Donnerstag*, *mit der Schulleitung sprechen* — послідовність ескалації. Переклад: — Пані Мюллер, я не згодна з оцінкою. Моя дочка правильно розвʼязала завдання. — Це ми можемо зʼясувати в розмові з батьками. Чи є у вас час у четвер? — Так. Якщо ми не домовимося, я хочу поговорити з керівництвом школи. — Це ваше право.

> [!speak] Ситуація 4: домовся про зустріч
> level: B2 · id: de-b2-situationen-s11
> text: Können wir einen Termin für ein Elterngespräch vereinbaren?
> ipa: /ˈkœnən viːɐ̯ ˈaɪ̯nən tɛʁˈmiːn fyːɐ̯ aɪ̯n ˈɛltɐnɡəˌʃpʁɛːç fɛɐ̯ˈʔaɪ̯nbaːʁən/
> tip: Termin — наголос на -min, довге [iː]; vereinbaren — ʔ-приступ після ver-: [fɛɐ̯ˈʔaɪ̯nbaːʁən]; Gespräch — [ɡəˈʃpʁɛːç].
> uk: Чи можемо домовитися про розмову з батьками?

> [!speak] Ситуація 4: назви наступний крок
> level: B2 · id: de-b2-situationen-s12
> text: Wenn wir uns nicht einigen, möchte ich mit der Schulleitung sprechen.
> ipa: /vɛn viːɐ̯ ʊns nɪçt ˈaɪ̯nɪɡn̩ ˈmœçtə ɪç mɪt deːɐ̯ ˈʃuːlˌlaɪ̯tʊŋ ˈʃpʁɛçn̩/
> tip: Schulleitung — sch [ʃ], u довге [uː], два l разом: [ʃuːl|laɪ̯tʊŋ]; sprechen — sp = [ʃp].
> uk: Якщо ми не домовимося, я хочу поговорити з керівництвом школи.

## Типові помилки українців

> [!pitfall] Різкий тон замість ввічливої вимоги
> *Ich will mein Geld zurück!* або *Das ist eine Frechheit!* звучать різко: як наказ чи образа; розмова після цього зазвичай ускладнюється. Краще: **Ich bitte Sie, mir den Betrag zu erstatten.** / **Ich bin mit der Lösung nicht einverstanden.** / **Könnten Sie das bis Freitag erledigen?** Ввічливість у Німеччині не знижує вимогу, а робить її серйознішою.

> [!pitfall] Усна домовленість без доказу
> *Ich habe es dem Hausmeister gesagt* — це добре, але в суперечці можна виявитися без доказів. Зазвичай варто фіксувати письмово: *Mängelanzeige*, email, при потребі *Einschreiben*; проси *Eingangsbestätigung*. Розірвання договору оренди має бути в письмовій формі (§ 568 BGB), і звичайний email чи скан для цього не підходять (потрібен власноручний підпис, § 126 Abs. 1 BGB).

> [!pitfall] Прийменник і відмінок: sich beschweren
> ~~Ich beschwere mich auf den Lärm~~ → Ich beschwere mich **über** den Lärm; ~~Ich beschwere mich beim Vermieter für den Schimmel~~ → beim Vermieter **über** den Schimmel; ~~Ich bin nicht einverstanden an der Note~~ → mit **der** Note (einverstanden **mit** + Dat).

> [!pitfall] Termin ≠ Frist
> *der Termin* — запис, призначена зустріч (*Elterngespräch am Donnerstag*), *die Frist* — строк, остання дата (*bis zum 30. Mai*). ~~Ich gebe Ihnen einen Termin bis zum 30. Mai~~ → Ich setze Ihnen eine **Frist** bis zum 30. Mai. Після Frist кажуть: *Die Frist läuft ab* / *ist abgelaufen*.

## Landeskunde: Mieter und Vermieter

> [!example] Rechte und Pflichten beim Mieten
> Mieter und Vermieter haben in Deutschland klare Rechte und Pflichten, die vor allem im Bürgerlichen Gesetzbuch stehen. Der Vermieter muss die Wohnung in einem Zustand übergeben und halten, der für das Wohnen geeignet ist. Zeigt sich ein Mangel, zum Beispiel Schimmel oder eine kaputte Heizung, muss der Mieter das dem Vermieter unverzüglich mitteilen. Wer das nicht tut, kann Rechte verlieren. Deshalb macht man die Mängelanzeige am besten schriftlich und hebt eine Kopie auf. Wenn die Wohnung wegen des Mangels deutlich schlechter nutzbar ist, darf die Miete „angemessen herabgesetzt“ werden. Man nennt das Mietminderung. Wie hoch sie ist, hängt vom Einzelfall ab. Auch bei der Nebenkostenabrechnung gibt es Regeln: Der Mieter kann Einwendungen bis zum Ablauf des zwölften Monats nach dem Zugang der Abrechnung erheben. Will ein Mieter kündigen, braucht er die schriftliche Form. Die Kündigung muss spätestens am dritten Werktag eines Monats dem Vermieter zugehen, damit das Mietverhältnis zum Ende des übernächsten Monats endet. Wer unsicher ist, findet Rat bei einem Mieterverein oder bei einer Rechtsberatung. Viele Mieter lassen sich dort beraten, bevor sie schreiben, und bewahren alle Belege und Fotos sorgfältig auf. Gerade bei Streit lohnt sich ein ruhiger, sachlicher Ton. Auch Vermieter schätzen Mieter, die Probleme früh melden und klar formulieren, was sie erwarten.

> [!quiz] Nach dem Text: Was muss der Mieter bei einem Mangel tun?
> level: B2 · type: single · id: de-b2-situationen-q02
> - [ ] Er muss sofort ausziehen.
> - [x] Er muss den Mangel dem Vermieter unverzüglich mitteilen.
> - [ ] Er muss den Mangel selbst reparieren.
> - [ ] Er muss die Miete ein Jahr lang bezahlen.
>
> **Пояснення:** *muss der Mieter das dem Vermieter unverzüglich mitteilen* (§ 536c BGB).

> [!quiz] Nach dem Text: Wann endet das Mietverhältnis, wenn der Mieter am dritten Werktag eines Monats kündigt?
> level: B2 · type: single · id: de-b2-situationen-q03
> - [ ] am Ende desselben Monats
> - [ ] am Ende des nächsten Monats
> - [x] am Ende des übernächsten Monats
> - [ ] nach einem Jahr
>
> **Пояснення:** *spätestens am dritten Werktag eines Monats … zum Ende des übernächsten Monats* (§ 573c BGB). Кінець — наприкінці місяця, що йде за наступним.

> [!quiz] Was stimmt laut Text? Wähle alle richtigen Aussagen.
> level: B2 · type: multi · id: de-b2-situationen-q04
> - [x] Eine Kündigung braucht die schriftliche Form.
> - [x] Bei einem erheblichen Mangel darf die Miete herabgesetzt werden.
> - [ ] Eine Mietminderung ist immer genau zehn Prozent.
> - [ ] Ein Mieterverein ist für die Kündigung nötig.
>
> **Пояснення:** з тексту: *braucht er die schriftliche Form*; *darf die Miete angemessen herabgesetzt werden*. Розмір зниження залежить від випадку (не «завжди 10 %»), а Mieterverein — лише порада.

## Практика

> [!quiz] Яка фраза найкраще формулює вимогу в листі?
> level: B2 · type: single · id: de-b2-situationen-q05
> - [ ] Ich will sofort mein Geld zurück!
> - [x] Ich bitte Sie, mir den Betrag bis zum 20. Mai zu erstatten.
> - [ ] Das ist eine Frechheit, geben Sie mir das Geld.
> - [ ] Machen Sie das endlich!
>
> **Пояснення:** ввічливе прохання (*Ich bitte Sie*) з конкретним строком (*bis zum 20. Mai*) — стандарт. Решта — накази й оцінки, які зазвичай погіршують ситуацію.

> [!quiz] Які твердження про оренду правильні (за BGB)? Обери всі.
> level: B2 · type: multi · id: de-b2-situationen-q06
> - [x] Недолік треба повідомити орендодавцю негайно.
> - [x] Розірвання договору оренди орендарем потребує письмової форми.
> - [ ] Усна заява про розірвання договору достатня.
> - [ ] Через цвіль не треба платити оренду зовсім, автоматично й завжди.
>
> **Пояснення:** § 536c — негайно; § 568 — письмова форма. Зниження оренди (§ 536) залежить від того, наскільки погіршена придатність: «повністю нічого не платити» не є автоматичним правилом.

> [!quiz] У який строк можна вимагати повернення авторизованого SEPA-списання без пояснення причин?
> level: B2 · type: single · id: de-b2-situationen-q07
> - [ ] протягом двох днів
> - [x] протягом восьми тижнів
> - [ ] протягом шести місяців
> - [ ] у будь-який час без обмежень
>
> **Пояснення:** § 675x BGB: SEPA-Basislastschrift — повернення **без пояснення причин** у межах **восьми тижнів** від списання.

> [!quiz] Заповни пропуски: скарга
> level: B2 · type: fill · id: de-b2-situationen-q08
>
> ```text fill
> Ich möchte mich über den Service [[beschweren]].
> Bitte bestätigen Sie mir das [[schriftlich]].
> Können Sie mir einen [[Ansprechpartner|Kontakt]] nennen?
> ```
>
> **Пояснення:** *sich beschweren über*, *schriftlich bestätigen*, *Ansprechpartner nennen* — стійкі звороти скарги.

> [!quiz] Заповни пропуски: ввічливі форми
> level: B2 · type: fill · id: de-b2-situationen-q09
>
> ```text fill
> [[Könnten|Würden]] Sie mir bitte einen Termin geben?
> Ich [[wäre]] Ihnen dankbar, wenn Sie mir bald antworten könnten.
> [[Hätten|Haben]] Sie am Donnerstag Zeit?
> ```
>
> **Пояснення:** Konjunktiv II робить прохання ввічливим: *könnten / würden*, *wäre*, *hätten*. Для різкого тону використовують індикатив: *Geben Sie mir…*.

> [!quiz] Склади речення: «Якщо ми не домовимося, я хочу поговорити з керівництвом школи.»
> level: B2 · type: order · id: de-b2-situationen-q10
>
> ```text order
> Wenn wir uns nicht einigen,
> möchte ich
> mit der Schulleitung
> sprechen.
> ich möchte ✗
> ```
>
> **Пояснення:** після підрядного речення (*Wenn …*) головне починається з дієслова: *möchte ich*. Порядок *ich möchte* був би помилкою: підрядне речення займає перше місце, тому дієслово йде одразу після нього.

> [!quiz] Розстав кроки ескалації у розумному порядку
> level: B2 · type: order · id: de-b2-situationen-q11
>
> ```text order
> Спокійно поговорити з Ansprechpartner
> Повідомити про проблему письмово й назвати Frist
> Порадитися (Mieterverein, Verbraucherzentrale)
> Подумати про Schlichtung або Rechtsberatung
> Одразу погрожувати судом ✗
> ```
>
> **Пояснення:** драбина ескалації: розмова → письмо зі строком → консультація → формальна процедура. Негайні погрози судом лише ускладнюють діалог.

> [!quiz] Що таке *Förderunterricht*?
> level: B2 · type: single · id: de-b2-situationen-q12
> - [x] додаткові заняття в школі для учнів, яким потрібна підтримка
> - [ ] уроки фізкультури
> - [ ] батьківські збори
> - [ ] платні репетитори вдома
>
> **Пояснення:** *Förderunterricht* — шкільні додаткові заняття для підтримки. Репетиторство вдома — *Nachhilfe*; збори батьків — *Elternabend*.

## Фішки

> [!reel] 🗓 Вісім тижнів на повернення
> Якщо гроші списано з рахунку за SEPA-Basislastschrift, ти можеш повернути їх **без пояснення причин** протягом восьми тижнів. Це записано в § 675x BGB. Якщо мандата взагалі не давали, строк довший — до 13 місяців (§ 676b BGB); уточни в банку. Тож незрозуміле списання не лишається «назавжди»: дивись виписки щомісяця.

> [!reel] 🛡 Gewährleistung і Garantie
> Здається, одне й те саме, але це два різні поняття. *Die Gewährleistung* — законна відповідальність продавця за недоліки. *Die Garantie* — добровільне обіцяння продавця чи виробника понад закон. Тож «гарантії немає» не означає, що немає й *Gewährleistung*.

> [!reel] 🏫 Elternabend у різних землях
> Освіта в Німеччині — справа земель, тому батьківське представництво в кожній землі влаштоване по-своєму. Класний рівень: *Klassenelternversammlung* чи *Klassenpflegschaft*; рівень школи: *Schulelternbeirat* чи *Elternvertretung*; земельний рівень: *Landeselternbeirat* чи *Landeselternrat* (залежно від землі); федеральний: *Bundeselternrat*.

## Джерела та що почитати

- [BGB § 535 — Inhalt und Hauptpflichten des Mietvertrags](https://www.gesetze-im-internet.de/bgb/__535.html): що має робити орендодавець.
- [BGB § 536 — Mietminderung](https://www.gesetze-im-internet.de/bgb/__536.html): зниження оплати при недоліку.
- [BGB § 536c — Mängelanzeige durch den Mieter](https://www.gesetze-im-internet.de/bgb/__536c.html): негайне повідомлення про недолік.
- [BGB § 556 — Vereinbarungen über Betriebskosten](https://www.gesetze-im-internet.de/bgb/__556.html): Nebenkostenabrechnung і строки.
- [BGB § 568 — Form und Inhalt der Kündigung](https://www.gesetze-im-internet.de/bgb/__568.html): письмова форма.
- [BGB § 573c — Fristen der ordentlichen Kündigung](https://www.gesetze-im-internet.de/bgb/__573c.html): строки розірвання.
- [BGB § 675x — Erstattungsanspruch bei Lastschrift](https://www.gesetze-im-internet.de/bgb/__675x.html): повернення списання.
- [Deutscher Mieterbund](https://www.mieterbund.de/): спілки орендарів, поради.
- [Verbraucherzentrale](https://www.verbraucherzentrale.de/): поради й Musterbriefe.
- [Deutscher Bildungsserver — Mitwirkung der Eltern](https://www.bildungsserver.de/schule/mitwirkung-der-eltern-561-de.html): органи батьківського представництва в землях.

> [!important] Підсумок
> - **Драбина ескалації:** розмова → письмово → Frist → консультація (Mieterverein, Verbraucherzentrale) → Schlichtung / Rechtsberatung. Тон — *Sie*, Konjunktiv II, факти без звинувачень.
> - **Оренда:** недолік — негайно повідомити (*Mängelanzeige*, § 536c); *Mietminderung* залежить від випадку (§ 536); розірвання — письмово (§ 568); строк — до третього робочого дня, кінець — наприкінці позанаступного місяця (§ 573c).
> - **Банк:** SEPA-списання можна повернути протягом восьми тижнів без пояснень (§ 675x); щодо *Entgelt* — *Beratung*, потім *Schlichtung*.
> - **Школа:** *Elternabend*, *Förderunterricht*, *Elterngespräch*; не згоден — спершу вчитель, потім *Schulleitung*; назви органів батьків залежать від землі.
> - **Мова:** *sich beschweren über*, *einverstanden mit*, *Frist* (не *Termin*) для кінцевого строку.
