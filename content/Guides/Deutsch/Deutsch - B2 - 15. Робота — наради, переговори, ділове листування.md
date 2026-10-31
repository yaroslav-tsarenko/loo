---
title: Робота — наради, переговори, ділове листування
id: de-b2-arbeitswelt
level: B2
icon: px:hardHat
tags: [deutsch, b2, vocabulary, arbeit, besprechung, verhandlung, geschaeftsbrief]
prerequisites: ["[[Deutsch - B1 - 16. Робота, резюме й співбесіда]]", "[[Deutsch - B1 - 27. Письмо — особистий і офіційний лист, допис на форумі]]"]
estimatedMinutes: 60
---

# Робота — наради, переговори, ділове листування

> [!success] Після цієї теми ти зможеш
> - прочитати запрошення на нараду й *Tagesordnung* та зрозуміти, що від тебе очікують;
> - взяти участь у нараді: внести пропозицію, висловити заперечення, попросити *Rückfrage*, домовитися про наступні кроки;
> - вести переговори стримано й коректно: просити про поступки, відмовляти без грубості, фіксувати домовленість;
> - написати ділового листа: *Betreff*, звертання, прохання з дедлайном, подяка й закінчення;
> - розібратися в основних термінах трудових відносин: *Abmahnung*, *Aufhebungsvertrag*, *Krankmeldung*, *Betriebsrat*.

## Передбач

> [!quiz] У запрошенні на нараду написано: «TOP 3: Budget 2027». Що означає «TOP»?
> level: B2 · type: single · id: de-b2-arbeitswelt-q01
> - [ ] найважливіше питання наради, яке обговорюють першим
> - [x] пункт порядку денного (*Tagesordnungspunkt*)
> - [ ] топ-менеджери, які мають бути присутні
> - [ ] тема для необовʼязкового обговорення
>
> **Пояснення:** *TOP* — скорочення від ***T**ages**o**rdnungs**p**unkt*: пункт порядку денного. Англійське *top* тут ні до чого, тому «TOP 3» — це просто третій пункт у списку, а не третє за важливістю питання. Нумерація лише задає порядок розгляду.

## Нарада: Besprechung, Sitzung, Meeting

У німецькому офісі кілька слів для «наради», і вони не зовсім однакові.

| Слово | Що це | Коли вживають |
|---|---|---|
| **die Besprechung** | робоча нарада, зазвичай невелика | у команді, з керівником, з клієнтом |
| **die Sitzung** | засідання з усталеною процедурою | правління, рада працівників, збори |
| **das Meeting** | англіцизм, майже синонім *Besprechung* | в ІТ та міжнародних фірмах, онлайн |
| **die Videokonferenz** | нарада по відео | коли учасники в різних місцях |

Перед будь-якою серйозною нарадою учасники отримують **Einladung** і **Tagesordnung**: у ній перелічено пункти (*TOP 1, TOP 2 …*), інколи й час на кожен. Хтось веде нараду (*die Leitung*), хтось пише **Protokoll**. Є два типи протоколу: *Verlaufsprotokoll* — детально, хто що сказав, і *Ergebnisprotokoll* — лише рішення й завдання («хто, що, до коли»). У фірмах зазвичай пишуть другий.

> [!diagram] Життя наради: від запрошення до виконання
> ```yaml
> layout: flow
> nodes:
>   - { id: s1, label: "1 · до наради", text: "Einladung + Tagesordnung", tone: yellow }
>   - { id: s2, label: "2 · нарада", text: "Besprechung", tone: pink }
>   - { id: s3, label: "3 · запис", text: "Protokoll", tone: yellow }
>   - { id: s4, label: "4 · розсилка", text: "Verteiler", tone: pink }
>   - { id: s5, label: "5 · виконання", text: "Aufgaben bis zur Frist", tone: gray }
> edges:
>   - { from: s1, to: s2 }
>   - { from: s2, to: s3 }
>   - { from: s3, to: s4 }
>   - { from: s4, to: s5 }
> steps:
>   - { focus: s1, note: "Запрошення й порядок денний надсилають заздалегідь, щоб кожен міг підготуватися." }
>   - { focus: s2, note: "Нарада йде за пунктами. Ведучий стежить за часом, хтось інший веде записи." }
>   - { focus: s3, note: "Protokoll фіксує рішення й завдання: хто, що і до якої Frist." }
>   - { focus: s4, note: "Протокол розсилають усім, хто був присутній, і тим, кого це стосується (Verteiler)." }
>   - { focus: s5, note: "Завдання виконують до зазначеного терміну; на наступній нараді їх перевіряють." }
> ```

### Що казати на нараді

Деякі фрази, які допоможуть бути активним учасником, а не мовчазним слухачем:

| Мета | Фраза |
|---|---|
| попросити слова | Darf ich dazu kurz etwas sagen? |
| додати | Ich möchte noch ergänzen, dass … |
| ввічливо заперечити | Dem kann ich so nicht ganz zustimmen. / Dazu hätte ich einen Einwand. |
| уточнити | Dazu habe ich eine Rückfrage: … |
| запропонувати | Ich schlage vor, dass wir … |
| відкласти питання | Können wir den Punkt auf nächste Woche vertagen? |
| підсумувати | Fassen wir kurz zusammen: … |

Німці на нараді цінують **сухість і конкретику**: *sachlich* («по суті»), *konstruktiv* («з пропозицією»), без емоційного тиску. Заперечення зазвичай формулюють ввічливо, але чітко: *Das sehe ich anders* — «Я бачу це інакше» — цілком нормальна фраза, не конфлікт.

## Переговори: Verhandlung

У переговорах — про ціну, строки, умови договору, зарплату — є кілька постійних ходів:

- **Anfrage → Angebot → Auftrag.** Клієнт робить *Anfrage* (запит), постачальник відповідає *Angebot* (пропозицією), клієнт дає *Auftrag* (замовлення), а постачальник підтверджує його листом — *Auftragsbestätigung*.
- **Zugeständnis** — поступка: *Wir kommen Ihnen beim Preis entgegen, wenn Sie früher zahlen.* Поступку зазвичай «обмінюють» на щось: *Wenn …, dann …*.
- **Spielraum** — простір для маневру: *Beim Preis haben wir leider wenig Spielraum.*
- **Kulanz** — добра воля поза зобовʼязанням: *Das machen wir aus Kulanz.* Це не право, а ласка.
- **Einigung** — угода: *Wir haben uns auf einen Termin geeinigt.* Результат варто зафіксувати письмово — *Vereinbarung* або лист-підтвердження.

> [!tip] Як відмовити, не зіпсувавши стосунків
> Німецькою пряме «ні» у діловому спілкуванні звучить різко. Замість *Das geht nicht* вживай: *Das ist leider nicht möglich.* / *Dazu sind wir im Moment nicht in der Lage.* / *Da müssten wir noch einmal intern Rücksprache halten.* Останнє — спосіб виграти час (*Rücksprache* — узгодження з керівництвом).

## Ділове листування

Ділова електронна пошта в Німеччині формальна, але не архаїчна. Структура майже завжди така.

1. **Betreff** — один короткий рядок з суттю: *Rückfrage zu Angebot Nr. 4711*, а не «Питання» і не «Привіт».
2. **Anrede:**
   - *Sehr geehrte Damen und Herren,* — коли адресат невідомий;
   - *Sehr geehrte Frau Hartmann,* / *Sehr geehrter Herr Dr. Weber,* — коли відомий (титул *Dr.* називають);
   - *Guten Tag, Frau Hartmann,* — нейтральна, дедалі частіша форма між колегами з різних фірм;
   - *Liebe Frau Hartmann,* — коли вже знайомі й листуєтеся давно.
3. **Вступ:** *vielen Dank für Ihre Nachricht vom 12. Mai.* / *Bezug nehmend auf unser Telefonat …*
4. **Основна частина:** одна думка — один абзац; прохання формулюй конкретно й з терміном.
5. **Завершення:** *Für Rückfragen stehe ich Ihnen gern zur Verfügung.* / *Ich würde mich über eine Rückmeldung bis zum 15. Mai freuen.*
6. **Привітання:** *Mit freundlichen Grüßen* (стандарт), *Freundliche Grüße* (трохи коротше), *Viele Grüße* (менш офіційно). У Швейцарії пишуть *Freundliche Grüsse* без ß: у швейцарському правописі ß немає.

Після звертання з комою речення починається з малої літери: *Sehr geehrte Frau Hartmann, vielen Dank …* — окремий рядок не змінює правила.

> [!note] Підписи: i. A., i. V., ppa.
> Під листом від фірми часто стоїть скорочення перед підписом. **ppa.** (*per procura*) — підписує працівник з *Prokura*, тобто з широкими повноваженнями від імені фірми. **i. V.** (*in Vertretung*) — підписує заступник, **i. A.** (*im Auftrag*) — підписує працівник за дорученням. Це не обовʼязково знати, але корисно розуміти, чий підпис стоїть під листом.

## Права й обовʼязки на роботі: словник

- **Abmahnung** — письмове попередження від роботодавця про порушення (запізнення, невиконання обовʼязків). Зазвичай передує звільненню за поведінку: спершу *Abmahnung*, потім за повторення — *Kündigung*. Не плутай з *Mahnung* («нагадування про несплачений рахунок»).
- **Aufhebungsvertrag** — угода про припинення трудових відносин за згодою сторін. Її не слід підписувати поспіхом: вона може позначитися на допомозі по безробіттю, бо агентство може призначити *Sperrzeit* — паузу у виплатах (§ 159 SGB III).
- **Krankmeldung / Arbeitsunfähigkeitsbescheinigung (AU)** — повідомлення про хворобу та довідка від лікаря. Роботодавця треба повідомити про хворобу *unverzüglich* («без зволікань»), а довідка потрібна, коли хвороба триває довше трьох календарних днів — не пізніше наступного робочого дня; роботодавець може вимагати її й раніше (§ 5 EntgFG). Від 2023 р. для застрахованих у державній касі (GKV) діє електронна eAU: лікар передає її роботодавцю сам, а працівник має лише вчасно звернутися до лікаря й не носити паперовий аркуш.
- **Kündigungsschutz** — захист від звільнення. Закон про захист від звільнення діє після шести місяців стажу в одній фірмі й не для найменших фірм (§ 1, § 23 KSchG).
- **Betriebsrat** — рада працівників; докладніше в розділі «Landeskunde» нижче.

## Приклади

- Die Geschäftsführerin hat für Dienstag eine Besprechung einberufen. — Директорка скликала нараду на вівторок.
- Auf der Tagesordnung stehen drei Punkte, das Protokoll führt Herr Klein. — У порядку денному три пункти, протокол веде пан Кляйн.
- Dazu hätte ich noch eine Rückfrage. — У мене до цього ще є уточнювальне запитання.
- Beim Preis haben wir leider wenig Spielraum. — Щодо ціни в нас, на жаль, мало простору для маневру.
- Wir haben uns auf eine Lieferfrist von vier Wochen geeinigt. — Ми домовилися про термін поставки чотири тижні.
- Bitte bestätigen Sie den Auftrag umgehend. — Будь ласка, підтвердьте замовлення негайно.
- Die Lieferung ist fristgerecht eingetroffen. — Поставка надійшла вчасно, у встановлений термін.
- Aus Kulanz übernehmen wir die Kosten für die Reparatur. — З доброї волі ми беремо на себе вартість ремонту.
- Ich melde mich nach Rücksprache mit der Geschäftsleitung zeitnah bei Ihnen. — Я звʼяжуся з Вами найближчим часом після узгодження з керівництвом.
- Im Anhang finden Sie die Auftragsbestätigung. — У вкладенні Ви знайдете підтвердження замовлення.
- Meine Chefin hat mir eine Gehaltserhöhung zugesichert. — Моя керівниця пообіцяла мені підвищення зарплати.
- Der Aufhebungsvertrag sollte vor der Unterschrift geprüft werden. — Угоду про припинення трудових відносин слід перевірити перед підписанням.

## Слова

> [!word] die Tagesordnung
> ipa: /ˈtaːɡəsˌʔɔʁdnʊŋ/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w01
> uk: порядок денний
> forms: die Tagesordnungen
> example: Auf der **Tagesordnung** stehen drei Punkte. — У порядку денному три пункти.
> note: скорочено TOP (Tagesordnungspunkt); «auf der Tagesordnung stehen» — бути на порядку денному; «zur Tagesordnung übergehen» — повернутися до справ.

> [!word] das Protokoll
> ipa: /pʁotoˈkɔl/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w02
> uk: протокол; письмовий запис наради
> forms: die Protokolle
> example: Das **Protokoll** geht heute noch an alle Teilnehmer. — Протокол ще сьогодні піде всім учасникам.
> note: Ergebnisprotokoll — лише рішення, Verlaufsprotokoll — хід розмови. «Etwas zu Protokoll geben» — заявити, щоб це записали.

> [!word] die Sitzung
> ipa: /ˈzɪtsʊŋ/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w03
> uk: засідання
> forms: die Sitzungen
> example: Die **Sitzung** beginnt um zehn Uhr im großen Saal. — Засідання починається о десятій у великій залі.
> note: сидіти — sitzen; Sitzung звучить офіційніше за Besprechung (правління, рада, комісія).

> [!word] die Geschäftsleitung
> ipa: /ɡəˈʃɛftsˌlaɪ̯tʊŋ/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w04
> uk: керівництво фірми; дирекція
> forms: die Geschäftsleitungen
> example: Die **Geschäftsleitung** hat die neue Regelung beschlossen. — Керівництво фірми ухвалило нове правило.
> note: група людей (однина, але зазвичай означає всіх керівників разом); синоніми — die Unternehmensleitung, die Direktion.

> [!word] der Geschäftsführer
> ipa: /ɡəˈʃɛftsˌfyːʁɐ/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w05
> uk: директор; керуючий (фірми)
> forms: die Geschäftsführer
> example: Der **Geschäftsführer** unterschreibt den Vertrag. — Директор підписує договір.
> note: жінка — die Geschäftsführerin; у GmbH так називають особу, що веде справи й представляє фірму.

> [!word] das Zugeständnis
> ipa: /ˈtsuːɡəʃtɛntnɪs/ · pos: noun · level: C1 · id: de-b2-arbeitswelt-w06
> uk: поступка; поступлення
> forms: die Zugeständnisse
> example: Beide Seiten mussten **Zugeständnisse** machen. — Обидві сторони мусили піти на поступки.
> note: Zugeständnisse machen — робити поступки. Не плутай із Geständnis (зізнання).

> [!word] der Auftrag
> ipa: /ˈaʊ̯ftʁaːk/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w07
> uk: замовлення; доручення
> forms: die Aufträge
> example: Wir haben den **Auftrag** gestern erhalten. — Ми отримали замовлення вчора.
> note: einen Auftrag erteilen — дати замовлення; im Auftrag (i. A.) — за дорученням, у підписі листа; кінцеве g = [k].

> [!word] die Lieferfrist
> ipa: /ˈliːfɐˌfʁɪst/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w08
> uk: термін поставки
> forms: die Lieferfristen
> example: Die **Lieferfrist** beträgt zwei Wochen ab Bestellung. — Термін поставки — два тижні від замовлення.
> note: liefern — доставляти; Frist — «термін до певної дати» (не зустріч).

> [!word] die Mahnung
> ipa: /ˈmaːnʊŋ/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w09
> uk: нагадування про несплату; попередження
> forms: die Mahnungen
> example: Nach der zweiten **Mahnung** zahlte er die Rechnung. — Після другого нагадування він сплатив рахунок.
> note: від mahnen — «нагадувати, закликати». Mahnung стосується боргу, Abmahnung — порушень на роботі чи в договорі.

> [!word] die Rücksprache
> ipa: /ˈʁʏkˌʃpʁaːxə/ · pos: noun · level: C1 · id: de-b2-arbeitswelt-w10
> uk: узгодження; перемовини з кимось (перед рішенням)
> forms: die Rücksprachen
> example: Nach **Rücksprache** mit meinem Chef sage ich Ihnen zu. — Після узгодження з керівником я підтверджу.
> note: Rücksprache halten (mit) — порадитися; sp усередині слова на початку другої частини — [ʃp]: Rück|sprache.

> [!word] der Verteiler
> ipa: /fɛɐ̯ˈtaɪ̯lɐ/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w11
> uk: список розсилки; адресати копії
> forms: die Verteiler
> example: Bitte setzen Sie mich auf den **Verteiler**. — Будь ласка, додайте мене до списку розсилки.
> note: також «розподільний пристрій»; E-Mail-Verteiler — група адресатів.

> [!word] die Anfrage
> ipa: /ˈanfʁaːɡə/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w12
> uk: запит
> forms: die Anfragen
> example: Wir haben Ihre **Anfrage** erhalten und melden uns morgen. — Ми отримали Ваш запит і зателефонуємо завтра.
> note: anfragen — подати запит (bei + Dat); Anfrage — ще не замовлення, а запит про умови.

> [!word] die Auftragsbestätigung
> ipa: /ˈaʊ̯ftʁaːksbəˌʃtɛːtɪɡʊŋ/ · pos: noun · level: C1 · id: de-b2-arbeitswelt-w13
> uk: підтвердження замовлення
> forms: die Auftragsbestätigungen
> example: Die **Auftragsbestätigung** kommt per E-Mail. — Підтвердження замовлення надходить електронною поштою.
> note: Auftrag + s + Bestätigung; -ung — завжди die; g у -tigung — [ɡ], бо далі голосний.

> [!word] die Führungskraft
> ipa: /ˈfyːʁʊŋsˌkʁaft/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w14
> uk: керівник; працівник на керівній посаді
> forms: die Führungskräfte
> example: Als **Führungskraft** trägt sie viel Verantwortung. — Як керівниця вона несе велику відповідальність.
> note: стать не вказує; нейтральніше за der Chef / die Chefin (розм.).

> [!word] die Personalabteilung
> ipa: /pɛʁzoˈnaːlʔapˌtaɪ̯lʊŋ/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w15
> uk: відділ кадрів
> forms: die Personalabteilungen
> example: Wenden Sie sich bitte an die **Personalabteilung**. — Зверніться, будь ласка, до відділу кадрів.
> note: також HR або Human Resources; Personal — «працівники фірми» (не «особисте»).

> [!word] die Gehaltserhöhung
> ipa: /ɡəˈhaltsʔɛɐ̯ˌhøːʊŋ/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w16
> uk: підвищення зарплати
> forms: die Gehaltserhöhungen
> example: Er hat um eine **Gehaltserhöhung** gebeten. — Він попросив про підвищення зарплати.
> note: у Швейцарії зазвичай Lohn: die Lohnerhöhung; Gehalt — оклад службовця, Lohn — оплата за годину (різниця стирається).

> [!word] die Mitbestimmung
> ipa: /ˈmɪtbəˌʃtɪmʊŋ/ · pos: noun · level: C1 · id: de-b2-arbeitswelt-w17
> uk: співучасть у прийнятті рішень (працівників)
> forms: — (без множини)
> example: Die **Mitbestimmung** der Beschäftigten ist gesetzlich geregelt. — Участь працівників у рішеннях врегульована законом.
> note: mit + bestimmen; характерна риса німецької системи праці (Betriebsrat, Aufsichtsrat).

> [!word] die Gewerkschaft
> ipa: /ɡəˈvɛʁkʃaft/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w18
> uk: профспілка
> forms: die Gewerkschaften
> example: Die **Gewerkschaft** verhandelt mit den Arbeitgebern über den Tarifvertrag. — Профспілка веде переговори з роботодавцями про тарифну угоду.
> note: Werk + schaft; приклади — ver.di, IG Metall. -schaft — завжди die.

> [!word] die Zielvereinbarung
> ipa: /ˈtsiːlfɛɐ̯ˌʔaɪ̯nbaːʁʊŋ/ · pos: noun · level: C1 · id: de-b2-arbeitswelt-w19
> uk: угода про цілі (на період)
> forms: die Zielvereinbarungen
> example: In der **Zielvereinbarung** steht, was ich im nächsten Jahr erreichen soll. — У домовленості про цілі записано, чого я маю досягти наступного року.
> note: часто разом із бонусом (Bonus, Prämie); на розмові — Jahresgespräch.

> [!word] das Mitarbeitergespräch
> ipa: /ˈmɪtʔaʁbaɪ̯tɐɡəˌʃpʁɛːç/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w20
> uk: щорічна/регулярна розмова керівника з працівником
> forms: die Mitarbeitergespräche
> example: Im **Mitarbeitergespräch** sprechen wir über meine Ziele. — На розмові з керівником ми говоримо про мої цілі.
> note: ch у -spräch — [ç] (мʼякий, як після і); Gespräch — das.

> [!word] die Abmahnung
> ipa: /ˈapmaːnʊŋ/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w21
> uk: письмове попередження (про порушення)
> forms: die Abmahnungen
> example: Nach der dritten **Abmahnung** wurde ihm gekündigt. — Після третього попередження його звільнили.
> note: на роботі — перший крок перед звільненням за поведінку; поза роботою — ще й вимога припинити порушення (напр. прав на авторство).

> [!word] der Aufhebungsvertrag
> ipa: /ˈaʊ̯fheːbʊŋsfɛɐ̯ˌtʁaːk/ · pos: noun · level: C1 · id: de-b2-arbeitswelt-w22
> uk: угода про розірвання трудового договору за згодою сторін
> forms: die Aufhebungsverträge
> example: Vor dem **Aufhebungsvertrag** solltest du dich beraten lassen. — Перед угодою про розірвання радь отримати консультацію.
> note: aufheben — «скасувати»; відрізняй від Kündigung (одностороннє рішення).

> [!word] die Arbeitsunfähigkeitsbescheinigung
> ipa: /ˈaʁbaɪ̯tsʔʊnˌfɛːɪçkaɪ̯tsbəˌʃaɪ̯nɪɡʊŋ/ · pos: noun · level: C1 · id: de-b2-arbeitswelt-w23
> uk: довідка про непрацездатність (лікарняний)
> forms: die Arbeitsunfähigkeitsbescheinigungen
> example: Die **Arbeitsunfähigkeitsbescheinigung** liegt beim Arbeitgeber. — Довідка про непрацездатність у роботодавця.
> note: скорочено AU; розмовно «gelber Schein» (жовтий папірець); від 2023 р. для застрахованих у GKV діє електронна eAU: лікар передає її сам.

> [!word] die Dienstreise
> ipa: /ˈdiːnstˌʁaɪ̯zə/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w24
> uk: службове відрядження
> forms: die Dienstreisen
> example: Nächste Woche bin ich auf **Dienstreise** in München. — Наступного тижня я у відрядженні в Мюнхені.
> note: синонім — die Geschäftsreise (поїздка у справах фірми); Reisekosten — витрати на відрядження.

> [!word] die Rückfrage
> ipa: /ˈʁʏkˌfʁaːɡə/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w25
> uk: уточнювальне запитання
> forms: die Rückfragen
> example: Bei **Rückfragen** rufen Sie mich einfach an. — Якщо виникнуть запитання, просто зателефонуйте.
> note: «Bei Rückfragen» — формула в кінці листа; rückfragen / nachfragen — перепитати.

> [!word] der Spielraum
> ipa: /ˈʃpiːlʁaʊ̯m/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w26
> uk: простір для маневру; свобода дій
> forms: die Spielräume
> example: Beim Budget haben wir wenig **Spielraum**. — У бюджеті в нас мало свободи.
> note: Spiel + Raum; множина з умлаутом: die Spielräume.

> [!word] die Kulanz
> ipa: /kuˈlants/ · pos: noun · level: C1 · id: de-b2-arbeitswelt-w27
> uk: поблажливість; добра воля
> forms: — (без множини)
> example: Wir ersetzen das Gerät aus **Kulanz**. — Ми замінимо пристрій з доброї волі.
> note: aus Kulanz — без юридичного обовʼязку; прикметник kulant — «поступливий». Від франц. coulant.

> [!word] die Mehrarbeit
> ipa: /ˈmeːɐ̯ˌʔaʁbaɪ̯t/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w28
> uk: додаткова робота понад норму
> forms: — (без множини)
> example: Für die **Mehrarbeit** bekommt er freie Tage. — За додаткову роботу він отримує вихідні.
> note: у розмові часто як Überstunden; у вузькому значенні Mehrarbeit — понад норму закону (зазвичай 8 годин на день, § 3 ArbZG), Überstunden — понад договірні години.

> [!word] die Einarbeitung
> ipa: /ˈaɪ̯nˌʔaʁbaɪ̯tʊŋ/ · pos: noun · level: B2 · id: de-b2-arbeitswelt-w29
> uk: введення в посаду; період адаптації
> forms: — (без множини)
> example: Die **Einarbeitung** dauert etwa drei Monate. — Введення в посаду триває близько трьох місяців.
> note: sich einarbeiten — освоїтися на новій роботі; ʔ між ein- і arbeit-.

> [!word] der Kündigungsschutz
> ipa: /ˈkʏndɪɡʊŋsˌʃʊts/ · pos: noun · level: C1 · id: de-b2-arbeitswelt-w30
> uk: захист від звільнення
> forms: — (без множини)
> example: Nach sechs Monaten gilt in der Regel der allgemeine **Kündigungsschutz**. — Після шести місяців зазвичай діє загальний захист від звільнення.
> note: Kündigungsschutzgesetz (KSchG) діє не для всіх фірм і працівників; особливий захист мають, зокрема, вагітні жінки (§ 17 MuSchG) і члени Betriebsrat (§ 15 KSchG).

> [!word] die Betriebsvereinbarung
> ipa: /bəˈtʁiːpsfɛɐ̯ˌʔaɪ̯nbaːʁʊŋ/ · pos: noun · level: C1 · id: de-b2-arbeitswelt-w31
> uk: угода між роботодавцем і Betriebsrat (на підприємстві)
> forms: die Betriebsvereinbarungen
> example: Die Arbeitszeit ist in einer **Betriebsvereinbarung** geregelt. — Робочий час врегульовано в угоді з радою працівників.
> note: Betrieb + s + Vereinbarung; ps у Betriebs- — [ps].

> [!word] einberufen
> ipa: /ˈaɪ̯nbəʁuːfn̩/ · pos: verb · level: C1 · id: de-b2-arbeitswelt-w32
> uk: скликати (збори, нараду)
> forms: einberufen → berief ein → hat einberufen
> example: Die Chefin **beruft** eine Besprechung **ein**. — Керівниця скликає нараду.
> note: відокремлюване: einberufen → beruft ein; також «призвати до війська».

> [!word] protokollieren
> ipa: /pʁotokɔˈliːʁən/ · pos: verb · level: B2 · id: de-b2-arbeitswelt-w33
> uk: вести протокол; записувати
> forms: protokollieren → protokollierte → hat protokolliert
> example: Wer **protokolliert** heute die Besprechung? — Хто сьогодні веде протокол наради?
> note: ie довге [iː], наголос на -ie-; hat protokolliert без ge-.

> [!word] beauftragen mit (+ Dat)
> ipa: /bəˈʔaʊ̯ftʁaːɡn̩/ · pos: verb · level: B2 · id: de-b2-arbeitswelt-w34
> uk: доручати
> forms: beauftragen → beauftragte → hat beauftragt
> example: Ich **beauftrage** dich **mit** der Terminplanung. — Я доручаю тобі планування термінів.
> note: Akk + mit + Dat: jemanden mit etwas beauftragen; beauftragen = Auftrag erteilen.

> [!word] einwenden
> ipa: /ˈaɪ̯nvɛndn̩/ · pos: verb · level: C1 · id: de-b2-arbeitswelt-w35
> uk: заперечувати; висувати заперечення
> forms: einwenden → wandte ein → hat eingewandt
> example: Er **wandte ein**, dass das Budget nicht reiche. — Він заперечив, що бюджету не вистачить.
> note: також wendete ein / eingewendet; іменник der Einwand — заперечення.

> [!word] vertagen
> ipa: /fɛɐ̯ˈtaːɡn̩/ · pos: verb · level: C1 · id: de-b2-arbeitswelt-w36
> uk: відкласти (засідання, питання) на інший день
> forms: vertagen → vertagte → hat vertagt
> example: Wir **vertagen** die Entscheidung auf nächste Woche. — Ми відкладаємо рішення на наступний тиждень.
> note: vertagen auf (+ Akk); для поточних планів частіше verschieben, vertagen — для засідань і рішень.

> [!word] delegieren
> ipa: /deleˈɡiːʁən/ · pos: verb · level: B2 · id: de-b2-arbeitswelt-w37
> uk: делегувати; передавати завдання
> forms: delegieren → delegierte → hat delegiert
> example: Gute Chefs **delegieren** Aufgaben. — Хороші керівники делегують завдання.
> note: delegieren an (+ Akk); іменник die Delegation = також «делегація».

> [!word] koordinieren
> ipa: /koʔɔʁdiˈniːʁən/ · pos: verb · level: B2 · id: de-b2-arbeitswelt-w38
> uk: координувати
> forms: koordinieren → koordinierte → hat koordiniert
> example: Sie **koordiniert** die Termine aller Abteilungen. — Вона координує терміни всіх відділів.
> note: наголос на -ie-; іменник die Koordination / die Koordinierung.

> [!word] zusichern
> ipa: /ˈtsuːzɪçɐn/ · pos: verb · level: C1 · id: de-b2-arbeitswelt-w39
> uk: гарантувати; пообіцяти
> forms: zusichern → sicherte zu → hat zugesichert
> example: Der Chef **sicherte** mir eine Gehaltserhöhung **zu**. — Шеф пообіцяв мені підвищення зарплати.
> note: відокремлюване; die Zusicherung — гарантія, обіцянка.

> [!word] vorantreiben
> ipa: /foˈʁaʊ̯ntʁaɪ̯bn̩/ · pos: verb · level: C1 · id: de-b2-arbeitswelt-w40
> uk: просувати; прискорювати
> forms: vorantreiben → trieb voran → hat vorangetrieben
> example: Wir wollen das Projekt **vorantreiben**. — Ми хочемо просувати проєкт уперед.
> note: відокремлюване: treibt das Projekt voran.

> [!word] sich einigen auf (+ Akk)
> ipa: /zɪç ˈaɪ̯nɪɡn̩/ · pos: verb · level: B2 · id: de-b2-arbeitswelt-w41
> uk: домовитися, дійти згоди
> forms: sich einigen → einigte sich → hat sich geeinigt
> example: Die Partner **einigten sich auf** einen Preis. — Партнери домовилися про ціну.
> note: sich einigen auf (+ Akk) — про предмет угоди; mit + Dat — з ким.

> [!word] termingerecht
> ipa: /tɛʁˈmiːnɡəʁɛçt/ · pos: adj · level: C1 · id: de-b2-arbeitswelt-w42
> uk: у встановлений термін; вчасно
> example: Die Ware wurde **termingerecht** geliefert. — Товар доставили вчасно.
> note: Termin + gerecht; синонім fristgerecht, pünktlich.

> [!word] fristgerecht
> ipa: /ˈfʁɪstɡəʁɛçt/ · pos: adj · level: C1 · id: de-b2-arbeitswelt-w43
> uk: у межах строку
> example: Der Einspruch muss **fristgerecht** eingehen. — Заперечення має надійти у встановлений строк.
> note: Frist + gerecht; використовують у документах, зазвичай про дії, обмежені терміном (скарга, оплата).

> [!word] zeitnah
> ipa: /ˈtsaɪ̯tnaː/ · pos: adj · level: C1 · id: de-b2-arbeitswelt-w44
> uk: невдовзі, найближчим часом
> example: Wir melden uns **zeitnah** bei Ihnen. — Ми звʼяжемося з Вами найближчим часом.
> note: у листах без чіткої дати; не точніше, ніж bald.

> [!word] vertraulich
> ipa: /fɛɐ̯ˈtʁaʊ̯lɪç/ · pos: adj · level: B2 · id: de-b2-arbeitswelt-w45
> uk: конфіденційний; довірчий
> example: Bitte behandeln Sie die Unterlagen **vertraulich**. — Будь ласка, поводьтеся з документами як із конфіденційними.
> note: das Vertrauen — довіра; «streng vertraulich» — суворо конфіденційно.

> [!word] umgehend
> ipa: /ˈʊmɡeːənt/ · pos: adj · level: B2 · id: de-b2-arbeitswelt-w46
> uk: негайний; невідкладно
> example: Bitte melden Sie sich **umgehend**. — Будь ласка, відгукніться негайно.
> note: у листах — дуже терміново; сильніше за zeitnah, схоже на unverzüglich.

> [!word] sachlich
> ipa: /ˈzaxlɪç/ · pos: adj · level: B2 · id: de-b2-arbeitswelt-w47
> uk: по суті; обʼєктивний, стриманий
> example: Bleiben wir bitte **sachlich**. — Залишімося, будь ласка, по суті.
> note: Sache — «справа, предмет»; ch після a — [x], sachlich [ˈzaxlɪç]; не «сухий» у негативному сенсі, а «без особистих випадів».

> [!word] konstruktiv
> ipa: /kɔnstʁʊkˈtiːf/ · pos: adj · level: B2 · id: de-b2-arbeitswelt-w48
> uk: конструктивний
> example: Er macht immer **konstruktive** Vorschläge. — Він завжди робить конструктивні пропозиції.
> note: наголос на останньому складі; v наприкінці = [f].

> [!word] belastbar
> ipa: /bəˈlastbaːɐ̯/ · pos: adj · level: C1 · id: de-b2-arbeitswelt-w49
> uk: витривалий, здатний працювати під навантаженням
> example: Wir suchen eine **belastbare** Mitarbeiterin. — Ми шукаємо працівницю, здатну витримувати навантаження.
> note: Belastbarkeit — стресостійкість; у вакансіях типове слово.

> [!word] kollegial
> ipa: /kɔleˈɡi̯aːl/ · pos: adj · level: B2 · id: de-b2-arbeitswelt-w50
> uk: колегіальний; дружній, по-товариськи
> example: Das Team arbeitet sehr **kollegial** zusammen. — Команда працює дуже по-дружньому.
> note: наголос на останньому складі: [kɔleˈɡi̯aːl]; Kollege — der.

## Слухаємо

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-arbeitswelt-l01
> audio: Bitte schicken Sie mir das Protokoll bis spätestens Freitag.
> - [ ] Bitte schicken Sie mir das Angebot bis spätestens Freitag.
> - [x] Bitte schicken Sie mir das Protokoll bis spätestens Freitag.
> - [ ] Bitte schicken Sie mir das Protokoll bis spätestens Montag.
>
> **Пояснення:** *bis spätestens Freitag* — «не пізніше пʼятниці». Слухай два слова-ключі: що відправити (*Protokoll*) і до коли (*Freitag*).

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-arbeitswelt-l02
> audio: Wir müssen den Punkt leider vertagen.
> - [ ] Wir müssen den Punkt leider verhandeln.
> - [ ] Wir müssen den Punkt leider vereinbaren.
> - [x] Wir müssen den Punkt leider vertagen.
>
> **Пояснення:** *vertagen* — відкласти на інший день; *verhandeln* — вести переговори, *vereinbaren* — домовитися. Слова звучать схоже, але значення різні.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-arbeitswelt-l03
> audio: Die Geschäftsführerin hat die Besprechung für Dienstag einberufen.
> explain: Einberufen — відокремлюване дієслово, але в Perfekt воно разом: *hat einberufen*. Geschäftsführerin — одне слово; на кінці -in.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-arbeitswelt-l04
> audio: Bitte bestätigen Sie den Auftrag zeitnah.
> explain: *bestätigen* — ä у -stä- довге [ɛː] (за Duden); *zeitnah* — одне слово. *Auftrag* — g наприкінці [k].

> [!listen] Послухай телефонну розмову. Про що просить клієнтка?
> level: B2 · type: answer · id: de-b2-arbeitswelt-l05
> audio: A: Guten Tag, Frau Hartmann, hier Marchenko von der Firma Nordlicht. Ich rufe wegen des Angebots an.
> audio: B: Guten Tag. Gibt es noch Rückfragen?
> audio: A: Ja. Wir bräuchten die Lieferung spätestens in drei Wochen. Haben Sie Spielraum?
> audio: B: Das muss ich intern klären. Ich melde mich morgen Vormittag.
> - [ ] Вона хоче скасувати замовлення.
> - [x] Вона просить швидшу поставку, і пані Гартманн має звʼязатися завтра.
> - [ ] Вона просить знижку й відразу її отримує.
>
> **Пояснення:** клієнтка просить поставку «spätestens in drei Wochen» і питає про *Spielraum*. Пані Гартманн не відповідає одразу, а обіцяє уточнити *intern* та відповісти завтра вранці (*Vormittag*).

## Вимова

У складних іменниках головний наголос падає на **перший** корінь: **Ta**gesordnung, **Ziel**vereinbarung, **Auf**hebungsvertrag. Закінчення **-ung** читається [ʊŋ] без наголосу, без «нґ». На стику частин складного слова перед голосним ставиться короткий «поштовх» [ʔ] (*Zielvereinbarung*, *Gehaltserhöhung*), а ***sp*** і ***st*** на початку другої частини — це [ʃp] і [ʃt]: *Rück|sprache* [ˈʁʏkʃpʁaːxə].

> [!speak] Скажи вголос
> level: B2 · id: de-b2-arbeitswelt-s01
> text: Wir beginnen die Besprechung mit der Tagesordnung.
> ipa: /viːɐ̯ bəˈɡɪnən diː bəˈʃpʁɛçʊŋ mɪt deːɐ̯ ˈtaːɡəsˌʔɔʁdnʊŋ/
> tip: Besprechung — sp після be- на початку кореня дає [ʃp]: «бешпрехунг». Tagesordnung — наголос на Ta-.
> uk: Ми починаємо нараду з порядку денного.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-arbeitswelt-s02
> text: Das Protokoll schicke ich Ihnen bis Freitag.
> ipa: /das protoˈkɔl ˈʃɪkə ɪç ˈiːnən bɪs ˈfʁaɪ̯taːk/
> tip: Protokoll — наголос на останньому складі: «протокол». Freitag — кінцеве g = [k].
> uk: Протокол я надішлю Вам до пʼятниці.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-arbeitswelt-s03
> text: Dazu habe ich noch eine Rückfrage.
> ipa: /daˈtsuː ˈhaːbə ɪç nɔx ˈaɪ̯nə ˈʁʏkfʁaːɡə/
> tip: Rückfrage — ü коротке, ck = [k]. noch — ch після o дає [x].
> uk: У мене до цього ще є уточнювальне запитання.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-arbeitswelt-s04
> text: Wir einigen uns auf einen Kompromiss.
> ipa: /viːɐ̯ ˈaɪ̯nɪɡn̩ ʊns aʊ̯f ˈaɪ̯nən kɔmpʁoˈmɪs/
> tip: einigen — ig перед n̩ читається [ɪɡ], не [ɪç]: «айнігн». Kompromiss — наголос на -miss.
> uk: Ми домовляємося про компроміс.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-arbeitswelt-s05
> text: Die Lieferung kommt termingerecht an.
> ipa: /diː ˈliːfəʁʊŋ kɔmt tɛʁˈmiːnɡəʁɛçt an/
> tip: termingerecht — наголос на -min-; -gerecht закінчується на [çt]: звук як у «ich» плюс [t].
> uk: Поставка надходить вчасно.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-arbeitswelt-s06
> text: Mit freundlichen Grüßen
> ipa: /mɪt ˈfʁɔʏ̯ntlɪçn̩ ˈɡʁyːsn̩/
> tip: freundlichen — -dl- зливається в одне [ntl], закінчення -en читається як склад [n̩]. Grüßen — ü довге, ß = [s].
> uk: З повагою (буквально: з дружніми вітаннями).

## Типові помилки українців

> [!pitfall] Termin ≠ термін, Frist ≠ зустріч
> Українське «термін» — це німецьке **Frist** («до якої дати треба зробити»). **Termin** — це **домовлена дата й час** зустрічі, візиту, наради. *Die Frist ist der 15. Mai* — крайній термін подання; *Ich habe einen Termin um 10 Uhr* — в мене зустріч о десятій. У діловому листуванні завжди перевіряй, чи йдеться про дедлайн (*Frist*), чи про зустріч (*Termin*).

> [!pitfall] Ich will — занадто різко
> Українське «Я хочу, щоб ви…» з *Ich will, dass Sie …* звучить як наказ. У діловому спілкуванні — *Ich möchte …*, *Ich würde gern …*, *Ich bitte Sie, …*. *Ich will* лишай для розмови зі своїми. Замість «Ви мусите» — *Könnten Sie bitte …* або *Ich wäre Ihnen dankbar, wenn …*.

> [!pitfall] Aufhebungsvertrag не підписують «на місці»
> Якщо фірма пропонує *Aufhebungsvertrag*, часто це виглядає як «зручний вихід», але підписання за згодою може завадити отримати *Arbeitslosengeld* без паузи: агентство може призначити *Sperrzeit*. Попроси час подумати, порадься з *Betriebsrat*, профспілкою чи юристом. Фрази-відповіді: *Ich möchte den Vertrag in Ruhe prüfen* — «Хочу уважно прочитати».

> [!pitfall] Звертання «Шановний пане Вебер!» — без знака оклику
> Українське «Шановна пані Гартманн!» зазвичай із знаком оклику. Німецьке *Sehr geehrte Frau Hartmann,* — **з комою**, а перше слово наступного рядка пишуть з малої літери, якщо це не іменник і не *Sie*: *vielen Dank für Ihre Nachricht.* Займенники ввічливої форми *Sie / Ihnen / Ihr* завжди з великої; *du / dir / dein* у листах можна писати і з малої, і з великої.

## Ситуація: нарада в офісі

> [!listen] Послухай початок наради. Що вирішують щодо презентації?
> level: B2 · type: answer · id: de-b2-arbeitswelt-l06
> audio: A: Punkt drei: die Präsentation für den Kunden. Frau Weber, wie ist der Stand?
> audio: B: Die Folien sind fast fertig. Ich habe nur eine Rückfrage zum Budget.
> audio: A: Dazu haben wir heute keine Zahlen. Ich schlage vor, den Punkt auf Donnerstag zu vertagen.
> audio: B: Einverstanden. Bis Mittwoch schicke ich allen eine Rückmeldung.
> - [ ] Презентацію скасовують.
> - [x] Питання про бюджет переносять на четвер, а пані Вебер до середи надсилає відповідь усім.
> - [ ] Презентацію передають іншому відділу.
>
> **Пояснення:** *vertagen auf Donnerstag* — відкласти на четвер; *bis Mittwoch eine Rückmeldung* — до середи надіслати відповідь. Щодо Budget немає цифр, тому рішення переносять.

Тепер ти на нараді. Відповідай коротко й ввічливо.

> [!speak] Скажи вголос: «Можу я додати?»
> level: B2 · id: de-b2-arbeitswelt-s07
> text: Darf ich dazu kurz etwas ergänzen?
> ipa: /daʁf ɪç daˈtsuː kʊʁts ˈɛtvas ɛɐ̯ˈɡɛntsn̩/
> tip: ergänzen — ä = [ɛ], наголос на -gän-; z = [ts]. etwas — наголос на et-.
> uk: Чи можу я коротко додати?

> [!speak] Скажи вголос: «Я пропоную відкласти»
> level: B2 · id: de-b2-arbeitswelt-s08
> text: Ich schlage vor, dass wir den Punkt vertagen.
> ipa: /ɪç ˈʃlaːɡə foːɐ̯ das viːɐ̯ deːn pʊŋkt fɛɐ̯ˈtaːɡn̩/
> tip: у schlage g перед ə — [ɡ]. vor — [foːɐ̯], «фоа»; у відокремлюваних дієсловах наголос на префіксі.
> uk: Я пропоную відкласти цей пункт.

## Landeskunde: Betriebsrat und Mitbestimmung

> [!example] Betriebsrat und Mitbestimmung
> In vielen deutschen Betrieben gibt es einen Betriebsrat. Das ist die gewählte Vertretung der Beschäftigten. Nach dem Betriebsverfassungsgesetz können Beschäftigte einen Betriebsrat wählen, wenn in einem Betrieb in der Regel mindestens fünf Arbeitnehmer dauerhaft wahlberechtigt sind, von denen drei wählbar sind. Gewählt wird alle vier Jahre, und zwar im Frühjahr, zwischen dem 1. März und dem 31. Mai. Ein Betriebsrat ist aber keine Pflicht: Es gibt ihn nur, wenn die Beschäftigten ihn wollen. Der Betriebsrat darf bei bestimmten Themen mitbestimmen, zum Beispiel bei Beginn und Ende der täglichen Arbeitszeit, bei den Pausen oder beim Urlaubsplan. Der Arbeitgeber kann dann nicht allein entscheiden. Wichtig für jeden Beschäftigten: Vor jeder Kündigung muss der Arbeitgeber den Betriebsrat anhören. Tut er das nicht, ist die Kündigung unwirksam. Vom Betriebsrat unterscheidet man die Gewerkschaft. Eine Gewerkschaft wie ver.di oder die IG Metall vertritt Arbeitnehmer vieler Betriebe und verhandelt mit den Arbeitgebern den Tarifvertrag, der für eine ganze Branche gelten kann. Der Betriebsrat arbeitet dagegen in einem einzelnen Betrieb. Wer zum ersten Mal in Deutschland arbeitet, sollte deshalb beim Start fragen: Gibt es hier einen Betriebsrat? Und gilt für unsere Branche ein Tarifvertrag? Der Betriebsrat ist auch ein erster Ansprechpartner, wenn es Probleme mit Überstunden oder mit dem Urlaub gibt.

> [!quiz] Wann können Beschäftigte laut Text einen Betriebsrat wählen?
> level: B2 · type: single · id: de-b2-arbeitswelt-q02
> - [ ] In jedem Betrieb, auch wenn nur ein Mitarbeiter arbeitet.
> - [x] Wenn in der Regel mindestens fünf Arbeitnehmer dauerhaft wahlberechtigt sind, von denen drei wählbar sind.
> - [ ] Nur in Betrieben mit mehr als tausend Beschäftigten.
> - [ ] Nur, wenn die Gewerkschaft es verlangt.
>
> **Пояснення:** у тексті названо мінімум: *mindestens fünf … wahlberechtigt, von denen drei wählbar sind*. Профспілка не є умовою, а кількість у тисячу не потрібна.

> [!quiz] Bei welchen Themen darf der Betriebsrat laut Text mitbestimmen?
> level: B2 · type: multi · id: de-b2-arbeitswelt-q03
> - [x] bei Beginn und Ende der täglichen Arbeitszeit
> - [x] bei den Pausen
> - [x] beim Urlaubsplan
> - [ ] bei der Auswahl des Geschäftsführers
>
> **Пояснення:** текст називає робочий час, перерви й графік відпусток. Вибір директора в тексті не згадується.

> [!quiz] Was passiert, wenn der Arbeitgeber vor einer Kündigung den Betriebsrat nicht anhört?
> level: B2 · type: single · id: de-b2-arbeitswelt-q04
> - [ ] Die Kündigung gilt trotzdem, aber der Betriebsrat bekommt eine Entschädigung.
> - [x] Die Kündigung ist unwirksam.
> - [ ] Die Kündigung wird nur um einen Monat verschoben.
> - [ ] Dann muss die Gewerkschaft die Kündigung bestätigen.
>
> **Пояснення:** «Tut er das nicht, ist die Kündigung unwirksam» — без розмови з Betriebsrat звільнення недійсне.

## Практика

> [!quiz] Яке слово означає крайній термін, а не домовлену зустріч?
> level: B2 · type: single · id: de-b2-arbeitswelt-q05
> - [ ] der Termin
> - [x] die Frist
> - [ ] die Sitzung
> - [ ] das Meeting
>
> **Пояснення:** *die Frist* — відрізок часу або крайня дата («до 15 травня»). *Termin*, *Sitzung* і *Meeting* — це зустрічі в певний час.

> [!quiz] Які фрази можуть бути в кінці ділового листа?
> level: B2 · type: multi · id: de-b2-arbeitswelt-q06
> - [x] Mit freundlichen Grüßen
> - [x] Für Rückfragen stehe ich Ihnen gern zur Verfügung.
> - [x] Ich würde mich über eine Rückmeldung bis zum 15. Mai freuen.
> - [ ] Tschüss und bis bald!
>
> **Пояснення:** перші три — стандартні формули. *Tschüss und bis bald* — розмовна фраза для друзів і близьких колег, у формальному листі не підходить.

> [!quiz] Заповни пропуски в ділового листі
> level: B2 · type: fill · bank: Verteiler, Mahnung · id: de-b2-arbeitswelt-q07
>
> ```text fill
> [[Betreff]]: Rückfrage zum Angebot Nr. 4711
> Sehr geehrte Frau Hartmann,
> vielen Dank für Ihr Angebot. Im [[Anhang]] finden Sie unsere Fragen zu den Konditionen.
> Für Rückfragen stehe ich Ihnen gern zur [[Verfügung]].
> Mit freundlichen [[Grüßen]]
> Olena Marchenko
> ```
>
> **Пояснення:** *Betreff* — тема листа, *Anhang* — вкладення, *zur Verfügung stehen* — бути в розпорядженні, *Mit freundlichen Grüßen* — Dativ Plural. *Verteiler* (список розсилки) і *Mahnung* (нагадування про рахунок) за змістом не пасують.

> [!quiz] Заповни пропуски: хід наради
> level: B2 · type: fill · bank: Mahnung, Rücksprache, einbestellt · id: de-b2-arbeitswelt-q08
>
> ```text fill
> Die Geschäftsführerin hat eine Sitzung [[einberufen]].
> Auf der [[Tagesordnung]] stehen drei Punkte.
> Das [[Protokoll]] schreibt Herr Klein.
> ```
>
> **Пояснення:** *eine Sitzung einberufen* — скликати засідання; *Tagesordnung* — перелік пунктів; *Protokoll* — запис результатів. *Mahnung* і *Rücksprache* мають інші значення, а *einbestellt* не пасує: людей «einbestellt» (викликають), а засідання скликають.

> [!quiz] Склади речення: «Ми домовилися про компроміс.»
> level: B2 · type: order · id: de-b2-arbeitswelt-q09
>
> ```text order
> Wir
> haben
> uns
> auf
> einen
> Kompromiss
> geeinigt.
> für ✗
> ```
>
> **Пояснення:** *sich einigen auf (+ Akk)* — домовитися про щось: *auf einen Kompromiss*. *Für* тут помилкове. Перфект: *haben … geeinigt* з дієслівною рамкою.

> [!quiz] Склади речення: «Я хотів би поставити уточнювальне запитання.»
> level: B2 · type: order · id: de-b2-arbeitswelt-q10
>
> ```text order
> Ich
> möchte
> eine
> Rückfrage
> stellen.
> will ✗
> ```
>
> **Пояснення:** *eine Rückfrage stellen* — поставити запитання. *Ich möchte* — ввічливо; *Ich will* на роботі звучить занадто прямо.

> [!quiz] Тобі пропонують підписати Aufhebungsvertrag. Що розумно?
> level: B2 · type: single · id: de-b2-arbeitswelt-q11
> - [ ] Підписати одразу, адже це ввічливіший спосіб піти з фірми.
> - [x] Попросити час, уважно прочитати й порадитися, бо угода може вплинути на допомогу по безробіттю.
> - [ ] Відмовитися, бо Aufhebungsvertrag — це те саме, що Abmahnung.
> - [ ] Нічого не робити, бо без підпису угода однаково діє.
>
> **Пояснення:** *Aufhebungsvertrag* укладається лише за згодою обох сторін і може спричинити *Sperrzeit*. *Abmahnung* — попередження, це інша річ.

> [!quiz] Ти захворів у понеділок. Що вимагає закон від працівника?
> level: B2 · type: single · id: de-b2-arbeitswelt-q12
> - [ ] Повідомити роботодавця лише після одужання разом із довідкою.
> - [x] Одразу повідомити про хворобу та орієнтовний строк; якщо хвороба триває довше трьох календарних днів, вчасно піти до лікаря (застрахованим у GKV лікар передає eAU сам; роботодавець може вимагати підтвердження й раніше).
> - [ ] Нічого, якщо хвороба триває менше тижня.
> - [ ] Повідомити письмово протягом місяця.
>
> **Пояснення:** § 5 EntgFG: *unverzüglich* повідомити, а підтвердження непрацездатності забезпечити не пізніше наступного робочого дня після третього дня хвороби; від 2023 р. для застрахованих у GKV лікар передає eAU електронно сам. Роботодавець має право вимагати її раніше.

## Фішки

> [!reel] 🧷 Protokoll — «приклеєний аркуш»
> Слово прийшло через середньовічну латину з грецької *prōtókollon*: так називали «перший приклеєний аркуш» на сувої, куди вписували основні дані документа. Спершу це було юридичне слово, і лише потім воно стало «записом наради». Тому *zu Protokoll geben* досі означає «заявити, щоб це занесли до офіційного запису».

> [!reel] 💧 Kulanz — слово, що «тече»
> *Kulanz* і *kulant* прийшли в німецьку торгову мову в XIX столітті з французького *coulant*, буквально «той, що тече». Із часом «плавний, зговірливий» перетворилося на «великодушний у діловому питанні». Тому *aus Kulanz* значить «не за обовʼязком, а через добру волю фірми».

> [!reel] ✍️ ppa., i. V., i. A. — не просто літери
> Під листом від фірми перед підписом стоять скорочення. *ppa.* — від латинського *per procura*: підписує особа з *Prokura*, широкими повноваженнями, внесеними в торговий реєстр. *i. V.* — *in Vertretung* (замість когось), *i. A.* — *im Auftrag* (за дорученням). Тобто за скороченням можна «прочитати» рівень повноважень автора.

## Джерела та що почитати

- [DWDS — Protokoll](https://www.dwds.de/wb/Protokoll): значення й етимологія слова.
- [DWDS — Kulanz](https://www.dwds.de/wb/Kulanz): значення й походження від французького *coulant*.
- [DWDS — Prokura](https://www.dwds.de/wb/Prokura): значення слова й походження.
- [§ 1 BetrVG — Errichtung von Betriebsräten](https://www.gesetze-im-internet.de/betrvg/__1.html): умови для обрання ради працівників.
- [§ 13 BetrVG — Zeitpunkt der Betriebsratswahlen](https://www.gesetze-im-internet.de/betrvg/__13.html): вибори раз на чотири роки, 1 березня – 31 травня.
- [§ 87 BetrVG — Mitbestimmungsrechte](https://www.gesetze-im-internet.de/betrvg/__87.html): теми, у яких Betriebsrat співвирішує.
- [§ 102 BetrVG — Mitbestimmung bei Kündigungen](https://www.gesetze-im-internet.de/betrvg/__102.html): консультація перед звільненням.
- [§ 5 EntgFG — Anzeige- und Nachweispflichten](https://www.gesetze-im-internet.de/entgfg/__5.html): повідомлення про хворобу й довідка.
- [§ 159 SGB III — Ruhen bei Sperrzeit](https://www.gesetze-im-internet.de/sgb_3/__159.html): пауза у виплаті допомоги по безробіттю.
- [§ 3 ArbZG — Arbeitszeit der Arbeitnehmer](https://www.gesetze-im-internet.de/arbzg/__3.html): норма 8 годин на день.
- [§ 17 MuSchG](https://www.gesetze-im-internet.de/muschg_2018/__17.html) і [§ 15 KSchG](https://www.gesetze-im-internet.de/kschg/__15.html): особливий захист від звільнення.
- [§ 1 KSchG](https://www.gesetze-im-internet.de/kschg/__1.html) та [§ 23 KSchG](https://www.gesetze-im-internet.de/kschg/__23.html): сфера дії захисту від звільнення.

> [!important] Підсумок
> - Нарада: *Einladung → Tagesordnung → Besprechung → Protokoll → Aufgaben bis zur Frist*; *Frist* ≠ *Termin*.
> - Переговори: *Anfrage → Angebot → Auftrag → Auftragsbestätigung*; поступки й *Spielraum*, відмову формулюй стримано.
> - Лист: конкретний *Betreff*, *Sehr geehrte …,* з комою, прохання з терміном, *Mit freundlichen Grüßen*.
> - *Abmahnung* ≠ *Mahnung*; *Aufhebungsvertrag* не підписують поспіхом; про хворобу повідомляють одразу.
> - *Betriebsrat* працює в одній фірмі, *Gewerkschaft* — на рівні галузі й тарифу.
