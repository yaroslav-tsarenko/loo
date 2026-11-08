---
title: Професійна комунікація — переговори, фідбек
id: de-c1-beruf
level: C1
icon: px:hardHat
tags: [deutsch, c1, vocabulary, beruf, moderation, feedback, verhandlung]
prerequisites: ["[[Deutsch - B2 - 15. Робота — наради, переговори, ділове листування]]", "[[Deutsch - B2 - 26. Говоріння — доповідь, дискусія, аргументація]]"]
estimatedMinutes: 55
---

# Професійна комунікація — переговори, фідбек

> [!success] Після цієї теми ти зможеш
> - модерувати нараду німецькою: відкрити, дати слово, повернути до *Tagesordnungspunkt*, підсумувати (*Lassen Sie uns festhalten …*);
> - давати й приймати фідбек без образ: *Ich-Botschaft*, конкретний приклад, пропозиція (*Mir ist aufgefallen, dass …*);
> - формулювати незгоду дипломатично: *Ich gebe zu bedenken, dass …*, *Wäre es denkbar, dass …?*;
> - вести переговори: *Gegenvorschlag, Gegenleistung, Schmerzgrenze, Spielräume ausloten*;
> - вибрати тон e-mail і вирішити, коли переходити на *du* в офісі.

## Передбач

> [!quiz] Колега на нараді пропонує ідею, з якою ти не згоден. Що звучить найдипломатичніше німецькою?
> level: C1 · type: single · id: de-c1-beruf-q01
> - [ ] Das ist falsch.
> - [ ] Das geht nicht, das haben wir schon probiert.
> - [x] Ich gebe zu bedenken, dass wir das schon einmal getestet haben.
> - [ ] Sie haben das nicht verstanden.
>
> **Пояснення:** *Ich gebe zu bedenken, dass …* — «хочу звернути увагу на те, що …». Незгода подана як додатковий аргумент, а не як вирок. *Das ist falsch* і *Sie haben das nicht verstanden* звучать різко й особисто. Друге речення не грубе, але закриває дискусію. Пряма незгода в Німеччині цілком нормальна, проте на C1 очікують, що ти вмієш її помʼякшити, коли розмова напружена або співрозмовник вище за посадою.

## Пояснення

### Що вже є з B2

У темі [[Deutsch - B2 - 15. Робота — наради, переговори, ділове листування]] ти вивчив *die Tagesordnung, das Protokoll, die Rücksprache, der Spielraum, einberufen, vertagen*, а в [[Deutsch - B2 - 26. Говоріння — доповідь, дискусія, аргументація]] — *einhaken, relativieren, die Gegenposition*. Тут — наступний крок: **як** говорити, щоб тебе почули й не образилися.

### Модерація наради

> [!diagram] Модерація: пʼять кроків
> ```yaml
> layout: flow
> nodes:
>   - { id: m1, label: "1 · відкрити", text: "Ziel + Zeit", note: "Wir haben 30 Minuten für drei Punkte.", tone: yellow }
>   - { id: m2, label: "2 · дати слово", text: "Wortmeldungen", note: "Frau Kraus, bitte.", tone: pink }
>   - { id: m3, label: "3 · повернути", text: "zum Tagesordnungspunkt", note: "Das nehmen wir unter Sonstiges auf.", tone: yellow }
>   - { id: m4, label: "4 · підсумувати", text: "festhalten", note: "Lassen Sie uns festhalten: …", tone: pink }
>   - { id: m5, label: "5 · домовитися", text: "Wer macht was bis wann?", note: "Absprachen + Protokoll", tone: gray }
> edges:
>   - { from: m1, to: m2 }
>   - { from: m2, to: m3 }
>   - { from: m3, to: m4 }
>   - { from: m4, to: m5 }
> steps:
>   - { focus: m1, note: "Модератор називає мету й час: Ziel der Besprechung ist … Wir haben dafür 30 Minuten. Так усі знають рамку." }
>   - { focus: m2, note: "Слово дають за чергою Wortmeldungen: Herr Lenz hatte sich zuerst gemeldet, dann Frau Kraus." }
>   - { focus: m3, note: "Якщо хтось відхиляється, ввічливо повертай: Das ist ein wichtiger Punkt, aber gehört nicht zu TOP 2. Wir nehmen ihn unter Sonstiges auf." }
>   - { focus: m4, note: "Перед наступним пунктом — проміжний підсумок: Lassen Sie uns festhalten, dass wir das Budget nicht erhöhen." }
>   - { focus: m5, note: "Наприкінці — конкретні Absprachen: хто, що, до коли. Вони потрапляють у протокол." }
> ```
> Жовті й рожеві блоки — кроки модерації, сірий — підсумок. Кожен блок має мітку.

| Мета | Фраза модератора |
|---|---|
| відкрити | *Ich begrüße Sie und schlage vor, dass wir mit TOP 1 beginnen.* |
| дати слово | *Frau Kraus, Sie hatten sich gemeldet.* · *Gibt es weitere Wortmeldungen?* |
| обмежити час | *Ich muss Sie leider bitten, zum Schluss zu kommen.* |
| повернути до теми | *Das gehört eher zu TOP 4 — lassen Sie uns das dort besprechen.* |
| уточнити | *Wenn ich kurz nachhaken darf: Meinen Sie …?* |
| підсумувати | *Lassen Sie uns festhalten: …* · *Ich fasse zusammen: …* |
| закрити | *Vielen Dank für die konstruktive Diskussion. Das Protokoll kommt bis Freitag.* |

### Фідбек: Ich-Botschaft замість Du-Botschaft

**Du-Botschaft** (ти-повідомлення) звучить як обвинувачення: *Du bist immer unpünktlich.* **Ich-Botschaft** описує спостереження й наслідок для тебе: *Mir ist aufgefallen, dass du in den letzten Wochen oft später kamst. Dadurch konnten wir nicht pünktlich anfangen. Können wir das ändern?*

| Крок | Що кажемо | Приклад |
|---|---|---|
| 1. спостереження | факт, без оцінки | *Mir ist aufgefallen, dass der Bericht zwei Tage später kam.* |
| 2. наслідок | як це вплинуло | *Dadurch musste das Team am Wochenende arbeiten.* |
| 3. побажання | що змінити | *Ich würde mir wünschen, dass du früher Bescheid gibst.* |
| 4. позитив | що добре | *Inhaltlich war der Bericht sehr gut.* |

Хто фідбек **отримує**, теж має формули: *Danke für das offene Feedback. — Das kann ich nachvollziehen. — Das nehme ich mit.* (сучасний офісний вираз: «візьму до уваги»).

### Дипломатично: помʼякшувачі

Німецьку ділову мову часто називають прямою, і це правда: *Das funktioniert so nicht* у німецькому офісі — нормальна фраза. Але в переговорах, з клієнтом чи з керівництвом на C1 потрібні помʼякшувачі:

> [!diagram] Пряма й дипломатична незгода
> ```yaml
> layout: compare
> columns: { d: "прямо", p: "дипломатично" }
> nodes:
>   - { id: d1, col: d, label: "незгода", text: "Das ist keine gute Idee.", note: "чесно, але жорстко", tone: gray }
>   - { id: p1, col: p, label: "незгода", text: "Ich gebe zu bedenken, dass …", note: "незгода як аргумент", tone: yellow }
>   - { id: d2, col: d, label: "вимога", text: "Sie müssen bis Freitag liefern.", note: "наказ", tone: gray }
>   - { id: p2, col: p, label: "вимога", text: "Wäre es denkbar, bis Freitag zu liefern?", note: "Konjunktiv II + питання", tone: yellow }
>   - { id: d3, col: d, label: "критика", text: "Der Text ist unklar.", note: "оцінка особи / результату", tone: gray }
>   - { id: p3, col: p, label: "критика", text: "Die Formulierung ist etwas missverständlich.", note: "etwas + конкретна деталь", tone: pink }
> steps:
>   - { focus: [d1, p1], note: "Замість оцінки — аргумент: Ich gebe zu bedenken, dass das Budget knapp ist. Співрозмовник може погодитися, не втрачаючи обличчя." }
>   - { focus: [d2, p2], note: "Вимогу легко перетворити на питання з Konjunktiv II: Wäre es denkbar … ? Könnten Sie … ? Значення те саме, тон мʼякший." }
>   - { focus: [d3, p3], note: "Критику звужуй до конкретного й помʼякшуй словами etwas, eventuell, noch nicht ganz: Die Formulierung ist etwas missverständlich." }
> ```

Головні засоби: **Konjunktiv II** (*Ich würde vorschlagen …, Könnten wir …?*), **питання замість твердження** (*Wäre es nicht sinnvoll, …?*), **помʼякшувальні слова** (*etwas, eventuell, vielleicht, noch nicht ganz*), **згода перед незгодою** (*Da bin ich ganz bei Ihnen, aber …*).

### Переговори

| Етап | Лексика | Фраза |
|---|---|---|
| позиції | *die Verhandlung, die Position* | *Unsere Position ist folgende: …* |
| пошук рамок | *Spielräume ausloten* | *Lassen Sie uns ausloten, wo es Spielraum gibt.* |
| пропозиція | *der Gegenvorschlag* | *Darf ich einen Gegenvorschlag machen?* |
| обмін | *die Gegenleistung* | *Wenn Sie den Preis senken, wäre eine längere Laufzeit als Gegenleistung denkbar.* |
| межа | *die Schmerzgrenze* | *Bei 5 % ist unsere Schmerzgrenze erreicht.* |
| результат | *die Einigung, der Konsens, der Kompromiss* | *Wir haben eine Einigung erzielt.* |

### E-Mail-тон і du / Sie

- **Sehr geehrte Frau Kraus,** — офіційно, перший контакт, Behörde, клієнт.
- **Liebe Frau Kraus,** / **Hallo Frau Kraus,** — після кількох листів, у багатьох компаніях стандарт; *Hallo* без прізвища — лише з тими, з ким на *du*.
- Завершення: *Mit freundlichen Grüßen* (офіційно) → *Viele Grüße / Beste Grüße* (нейтрально-дружньо).
- **Перехід на du**: традиційно *das Du anbieten* має старший за віком або посадою. У стартапах і IT часто всі на *du* з першого дня; у банках і державних установах переважає *Sie*.

## Приклади

- *Gibt es zu diesem Punkt noch **Wortmeldungen**?* — Чи є ще охочі висловитися щодо цього пункту?
- *Wenn ich kurz **nachhaken** darf: Bis wann brauchen Sie die Zahlen?* — Якщо дозволите уточнити: до коли вам потрібні цифри?
- *Lassen Sie uns **festhalten**, dass wir das Budget nicht erhöhen.* — Зафіксуймо, що ми не збільшуємо бюджет.
- *Ich kann Ihre Bedenken gut **nachvollziehen**.* — Я добре розумію ваші застереження.
- *Mir ist aufgefallen, dass die Zahlen im Bericht nicht stimmen.* — Я помітив, що цифри у звіті не сходяться.
- *Als **Gegenleistung** bieten wir eine längere Vertragslaufzeit an.* — Натомість ми пропонуємо довший термін дії договору.
- *Bei diesem Preis ist unsere **Schmerzgrenze** erreicht.* — За цієї ціни ми дійшли до межі.
- *Wir sollten zuerst die **Prioritäten** klären.* — Спершу варто визначити пріоритети.
- *Für ein weiteres Projekt fehlen uns die **Kapazitäten**.* — На ще один проєкт у нас бракує ресурсів.
- *Der **Umgangston** im Team ist sehr **wertschätzend**.* — Тон спілкування в команді дуже доброзичливий і шанобливий.
- *Nach dem Projekt hat mir die Chefin **das Du angeboten**.* — Після проєкту шефиня запропонувала перейти на «ти».
- *Ich muss Sie leider auf nächste Woche **vertrösten**.* — На жаль, мушу попросити вас зачекати до наступного тижня.

## Слова

### Модерація й нарада

> [!word] die Moderation
> ipa: /modeʁaˈtsi̯oːn/ · pos: noun · level: C1 · id: de-c1-beruf-w01
> uk: модерація; ведення (наради, дискусії, передачі)
> forms: die Moderationen
> example: Wer übernimmt heute die **Moderation**? — Хто сьогодні веде нараду?
> note: також ведення телепередачі. Ведучий — der Moderator / die Moderatorin. -tion — наголос на останньому складі.

> [!word] moderieren
> ipa: /modeˈʁiːʁən/ · pos: verb · level: C1 · id: de-c1-beruf-w02
> uk: модерувати; вести (нараду, дискусію)
> forms: moderieren → moderierte → hat moderiert
> example: Sie **moderiert** den Workshop souverän. — Вона впевнено веде воркшоп.
> note: -ieren: наголос на -rie-, Perfekt без ge-.

> [!word] die Wortmeldung
> ipa: /ˈvɔʁtˌmɛldʊŋ/ · pos: noun · level: C1 · id: de-c1-beruf-w03
> uk: прохання слова; виступ (на нараді)
> forms: die Wortmeldungen
> example: Gibt es weitere **Wortmeldungen**? — Хто ще хоче висловитися?
> note: sich zu Wort melden — попросити слова. Модератор: Ich sehe zwei Wortmeldungen.

> [!word] der Tagesordnungspunkt
> ipa: /ˈtaːɡəsʔɔʁdnʊŋsˌpʊŋkt/ · pos: noun · level: C1 · id: de-c1-beruf-w04
> uk: пункт порядку денного
> forms: die Tagesordnungspunkte
> example: Kommen wir zum nächsten **Tagesordnungspunkt**. — Перейдімо до наступного пункту порядку денного.
> note: скорочено TOP: TOP 3. Рід від der Punkt. die Tagesordnung — B2.

> [!word] sich einbringen
> ipa: /zɪç ˈaɪ̯nbʁɪŋən/ · pos: verb · level: C1 · id: de-c1-beruf-w05
> uk: долучатися; робити свій внесок
> forms: sich einbringen → brachte sich ein → hat sich eingebracht
> example: Alle sollen sich in die Diskussion **einbringen**. — Усі мають долучитися до обговорення.
> note: sich in + Akk einbringen. Без sich: einen Vorschlag einbringen — внести пропозицію.

> [!word] festhalten
> ipa: /ˈfɛsthaltn̩/ · pos: verb · level: B2 · id: de-c1-beruf-w06
> uk: зафіксувати (результат); записати; триматися
> forms: festhalten → hielt fest → hat festgehalten
> example: Lassen Sie uns **festhalten**, was wir vereinbart haben. — Зафіксуймо, про що ми домовилися.
> note: у нарадах — підсумувати й записати. Буквально: sich festhalten an + Dat — триматися за щось.

> [!word] nachvollziehen
> ipa: /ˈnaːxfɔltsiːən/ · pos: verb · level: C1 · id: de-c1-beruf-w07
> uk: розуміти (чиюсь логіку); простежити хід думок
> forms: nachvollziehen → vollzog nach → hat nachvollzogen
> example: Ich kann Ihre Bedenken gut **nachvollziehen**. — Я добре розумію ваші застереження.
> note: прикметник nachvollziehbar (B2). Сигнал емпатії перед незгодою: Das kann ich nachvollziehen, aber …

> [!word] anknüpfen an (+ Akk)
> ipa: /ˈanknʏpfn̩ an/ · pos: verb · level: C1 · id: de-c1-beruf-w08
> uk: продовжити (чиюсь думку); підхопити
> forms: anknüpfen → knüpfte an → hat angeknüpft
> example: Ich möchte gern an das **anknüpfen**, was Frau Kraus gesagt hat. — Я хотів би продовжити думку пані Краус.
> note: an + Akk. Також: Kontakte knüpfen — налагоджувати контакти.

> [!word] die Absprache
> ipa: /ˈapʃpʁaːxə/ · pos: noun · level: B2 · id: de-c1-beruf-w09
> uk: домовленість; узгодження
> forms: die Absprachen
> example: Nach **Absprache** mit der Chefin verschieben wir den Termin. — За домовленістю з шефинею ми переносимо зустріч.
> note: nach Absprache, eine Absprache treffen. Дієслово absprechen. b перед sp — [p].

### Переговори

> [!word] die Verhandlung
> ipa: /fɛɐ̯ˈhandlʊŋ/ · pos: noun · level: B2 · id: de-c1-beruf-w10
> uk: переговори; судове засідання
> forms: die Verhandlungen
> example: Die **Verhandlungen** mit dem Lieferanten dauern noch an. — Переговори з постачальником ще тривають.
> note: у значенні «переговори» — частіше множина. У суді: die Gerichtsverhandlung. Дієслово verhandeln (B2).

> [!word] der Gegenvorschlag
> ipa: /ˈɡeːɡn̩ˌfoːɐ̯ʃlaːk/ · pos: noun · level: C1 · id: de-c1-beruf-w11
> uk: зустрічна пропозиція
> forms: die Gegenvorschläge
> example: Darf ich einen **Gegenvorschlag** machen? — Можна зустрічну пропозицію?
> note: рід від der Vorschlag. einen Gegenvorschlag machen / unterbreiten. Кінцеве g — [k].

> [!word] die Gegenleistung
> ipa: /ˈɡeːɡn̩ˌlaɪ̯stʊŋ/ · pos: noun · level: C1 · id: de-c1-beruf-w12
> uk: зустрічна послуга; те, що дають натомість
> forms: die Gegenleistungen
> example: Als **Gegenleistung** bieten wir eine längere Laufzeit an. — Натомість ми пропонуємо довший термін дії.
> note: als Gegenleistung für + Akk. Ohne Gegenleistung — безкоштовно, нічого не вимагаючи.

> [!word] die Schmerzgrenze
> ipa: /ˈʃmɛʁtsˌɡʁɛntsə/ · pos: noun · level: C1 · id: de-c1-beruf-w13
> uk: межа (допустимого); больовий поріг
> forms: die Schmerzgrenzen
> example: Bei diesem Preis ist unsere **Schmerzgrenze** erreicht. — За цієї ціни ми дійшли до межі.
> note: у переговорах — образне, але вживане слово. Буквально — больовий поріг (медицина).

> [!word] ausloten
> ipa: /ˈaʊ̯sloːtn̩/ · pos: verb · level: C1 · id: de-c1-beruf-w14
> uk: зондувати; зʼясовувати (можливості, межі)
> forms: ausloten → lotete aus → hat ausgelotet
> example: Lassen Sie uns **ausloten**, wo es Spielraum gibt. — Давайте зʼясуємо, де є простір для маневру.
> note: від das Lot (лот, глибиномір). Типово: Möglichkeiten, Grenzen, Spielräume ausloten.

> [!word] die Einigung
> ipa: /ˈaɪ̯nɪɡʊŋ/ · pos: noun · level: B2 · id: de-c1-beruf-w15
> uk: згода; домовленість (після суперечки)
> forms: die Einigungen
> example: Nach langen Gesprächen gab es eine **Einigung**. — Після довгих розмов досягли згоди.
> note: eine Einigung erzielen. Дієслово sich einigen auf (B2). Не плутай із die Vereinigung (обʼєднання).

> [!word] der Konsens
> ipa: /kɔnˈzɛns/ · pos: noun · level: C1 · id: de-c1-beruf-w16
> uk: консенсус; загальна згода
> forms: die Konsense
> example: Im Team herrscht **Konsens** darüber, dass wir mehr Zeit brauchen. — Команда одностайна в тому, що нам потрібно більше часу.
> note: Konsens herrscht / besteht über + Akk. Наголос на -sens. Різниця: der Kompromiss (B2) — кожен поступається; Konsens — усі згодні.

### Пріоритети й ресурси

> [!word] die Priorität
> ipa: /pʁi̯oʁiˈtɛːt/ · pos: noun · level: B2 · id: de-c1-beruf-w17
> uk: пріоритет
> forms: die Prioritäten
> example: Wir müssen **Prioritäten** setzen. — Нам треба розставити пріоритети.
> note: Prioritäten setzen, oberste Priorität haben. Дієслово priorisieren. -tät → die.

> [!word] die Kapazität
> ipa: /kapatsiˈtɛːt/ · pos: noun · level: C1 · id: de-c1-beruf-w18
> uk: потужність; спроможність (люди, час)
> forms: die Kapazitäten
> example: Im Moment haben wir keine **Kapazitäten** für ein neues Projekt. — Зараз у нас немає ресурсу на новий проєкт.
> note: в офісі — ввічлива відмова: Dafür fehlen mir gerade die Kapazitäten. z = [ts].

> [!word] die Ressource
> ipa: /ʁɛˈsʊʁsə/ · pos: noun · level: C1 · id: de-c1-beruf-w19
> uk: ресурс
> forms: die Ressourcen
> example: Mit den vorhandenen **Ressourcen** schaffen wir das nicht. — З наявними ресурсами ми це не встигнемо.
> note: з французької: подвоєне ss, ou = [ʊ]. Укр. «ресурс» — ч. р., нім. — die.

> [!word] der Meilenstein
> ipa: /ˈmaɪ̯lənˌʃtaɪ̯n/ · pos: noun · level: C1 · id: de-c1-beruf-w20
> uk: віха; ключовий етап (проєкту)
> forms: die Meilensteine
> example: Den ersten **Meilenstein** haben wir im März erreicht. — Першої віхи ми досягли в березні.
> note: проєктний менеджмент: Meilensteine planen, definieren. Буквально — дорожній камінь з милями.

### Тон і стосунки в офісі

> [!word] die Wertschätzung
> ipa: /ˈveːɐ̯tʃɛtsʊŋ/ · pos: noun · level: C1 · id: de-c1-beruf-w21
> uk: повага; визнання (цінності людини)
> forms: — (без множини)
> example: Gutes Feedback ist ein Zeichen der **Wertschätzung**. — Добрий фідбек — знак поваги.
> note: модне слово корпоративної мови. Дієслово wertschätzen. Близько: die Anerkennung.

> [!word] wertschätzend
> ipa: /ˈveːɐ̯tʃɛtsn̩t/ · pos: adj · level: C1 · id: de-c1-beruf-w22
> uk: шанобливий; доброзичливий (тон)
> example: Sie gibt Kritik immer **wertschätzend**. — Вона завжди критикує шанобливо.
> note: ein wertschätzender Umgang, eine wertschätzende Kommunikation. Партицип від wertschätzen.

> [!word] auf Augenhöhe
> ipa: /aʊ̯f ˈaʊ̯ɡn̩ˌhøːə/ · pos: phrase · level: C1 · id: de-c1-beruf-w23
> uk: на рівних
> example: Wir möchten mit unseren Partnern **auf Augenhöhe** verhandeln. — Ми хочемо вести переговори з партнерами на рівних.
> note: часте в політиці й бізнесі: Gespräche auf Augenhöhe. h у Höhe між голосними не вимовляється.

> [!word] der Umgangston
> ipa: /ˈʊmɡaŋsˌtoːn/ · pos: noun · level: C1 · id: de-c1-beruf-w24
> uk: тон спілкування; манера звертатися
> forms: die Umgangstöne
> example: Der **Umgangston** in der Abteilung ist rau. — Тон спілкування у відділі грубуватий.
> note: der Umgang mit + Dat — поводження з кимось. Рід від der Ton.

> [!word] die Hierarchie
> ipa: /hiʁaʁˈçiː/ · pos: noun · level: B2 · id: de-c1-beruf-w25
> uk: ієрархія
> forms: die Hierarchien
> example: In Start-ups sind die **Hierarchien** oft flach. — У стартапах ієрархії часто пласкі.
> note: flache / steile Hierarchien. Вимова: h видихом, ch після r — [ç], наголос на останньому -chie.

> [!word] der Flurfunk
> ipa: /ˈfluːɐ̯fʊŋk/ · pos: noun · level: C1 · id: de-c1-beruf-w26
> uk: чутки в офісі; «сарафанне радіо»
> forms: — (без множини)
> example: Laut **Flurfunk** wird die Abteilung umstrukturiert. — За чутками, відділ реорганізують.
> note: ugs., жартівливе: der Flur (коридор) + der Funk (радіо). Не джерело для офіційного листа.

> [!word] siezen
> ipa: /ˈziːtsn̩/ · pos: verb · level: B1 · id: de-c1-beruf-w27
> uk: звертатися на «ви» (Sie)
> forms: siezen → siezte → hat gesiezt
> example: Mit der Geschäftsführerin **siezen** wir uns. — З генеральною директоркою ми на «ви».
> note: пара до duzen (A1). sich siezen — взаємно. s на початку — дзвінке [z], z — [ts].

> [!word] jemandem das Du anbieten
> ipa: /ˈjeːmandəm das duː ˈanbiːtn̩/ · pos: phrase · level: C1 · id: de-c1-beruf-w28
> uk: запропонувати перейти на «ти»
> example: Nach einem Jahr hat mir mein Chef **das Du angeboten**. — Через рік шеф запропонував мені перейти на «ти».
> note: das Du — з великої як іменник. Традиційно пропонує старший за віком або посадою. Відмовитися можна, але це рідкість. bieten → bot → hat geboten.

### Фідбек

> [!word] die Ich-Botschaft
> ipa: /ˈɪçboːtʃaft/ · pos: noun · level: C1 · id: de-c1-beruf-w29
> uk: «я-повідомлення» (фраза від першої особи про свої враження)
> forms: die Ich-Botschaften
> example: Formulieren Sie Kritik als **Ich-Botschaft**. — Формулюйте критику як «я-повідомлення».
> note: протилежне: die Du-Botschaft (Du bist immer …). -schaft — завжди die.

> [!word] das Lob
> ipa: /loːp/ · pos: noun · level: B1 · id: de-c1-beruf-w30
> uk: похвала
> forms: — (без множини)
> example: Ein ehrliches **Lob** motiviert mehr als jeder Bonus. — Щира похвала мотивує більше за будь-яку премію.
> note: дієслово loben. Кінцеве b — [p]: «лоп». Lob aussprechen, ein großes Lob an + Akk.

> [!word] lösungsorientiert
> ipa: /ˈløːzʊŋsʔoʁi̯ɛntiːɐ̯t/ · pos: adj · level: C1 · id: de-c1-beruf-w31
> uk: орієнтований на рішення; конструктивний
> example: Lassen Sie uns **lösungsorientiert** bleiben. — Зосередьмося на рішеннях.
> note: часте у вакансіях і в модерації: lösungsorientiert denken, arbeiten. Пор. konstruktiv (B2).

> [!word] zielführend
> ipa: /ˈtsiːlfyːʁənt/ · pos: adj · level: C1 · id: de-c1-beruf-w32
> uk: доцільний; що веде до мети
> example: Die Diskussion ist im Moment nicht **zielführend**. — Зараз дискусія ні до чого не веде.
> note: дипломатичний спосіб сказати «це марно». Офісна мова, у побуті звучить канцелярськи.

> [!word] ergebnisoffen
> ipa: /ɛɐ̯ˈɡeːpnɪsʔɔfn̩/ · pos: adj · level: C1 · id: de-c1-beruf-w33
> uk: з відкритим результатом; без наперед визначеного рішення
> example: Wir führen das Gespräch **ergebnisoffen**. — Ми ведемо розмову без наперед визначеного результату.
> note: ergebnisoffen diskutieren, prüfen. Друга частина з голосного: [-ʔɔfn̩].

> [!word] missverständlich
> ipa: /ˈmɪsfɛɐ̯ʃtɛntlɪç/ · pos: adj · level: B2 · id: de-c1-beruf-w34
> uk: двозначний; такий, що може бути зрозумілий неправильно
> example: Die Formulierung in der E-Mail ist etwas **missverständlich**. — Формулювання в листі трохи двозначне.
> note: das Missverständnis — B2. Помʼякшена критика: etwas missverständlich, nicht ganz eindeutig.

> [!word] vertrösten
> ipa: /fɛɐ̯ˈtʁøːstn̩/ · pos: verb · level: C1 · id: de-c1-beruf-w35
> uk: просити зачекати (обіцяючи потім); заспокоювати обіцянками
> forms: vertrösten → vertröstete → hat vertröstet
> example: Ich muss Sie leider auf nächste Woche **vertrösten**. — На жаль, мушу попросити вас зачекати до наступного тижня.
> note: jemanden auf + Akk vertrösten. Часто з відтінком «знову відкладають»: Wir werden immer nur vertröstet.

> [!word] die Zusammenarbeit
> ipa: /tsuˈzamənʔaʁbaɪ̯t/ · pos: noun · level: B1 · id: de-c1-beruf-w36
> uk: співпраця
> forms: — (без множини)
> example: Vielen Dank für die gute **Zusammenarbeit**! — Дякуємо за добру співпрацю!
> note: стандартне завершення листа: Ich freue mich auf die weitere Zusammenarbeit. Рід від die Arbeit.

### Готові фрази

> [!word] Wäre es denkbar, dass …?
> ipa: /ˈvɛːʁə ɛs ˈdɛŋkbaːɐ̯ das/ · pos: phrase · level: C1 · id: de-c1-beruf-w37
> uk: Чи можна було б …?; Чи не варто …?
> example: **Wäre es denkbar, dass** wir die Lieferung um eine Woche verschieben? — Чи можна було б перенести поставку на тиждень?
> note: Konjunktiv II + питання = мʼяка пропозиція. Варіант з інфінітивом: Wäre es denkbar, die Lieferung zu verschieben?

> [!word] Da bin ich ganz bei Ihnen.
> ipa: /daː bɪn ɪç ɡants baɪ̯ ˈiːnən/ · pos: phrase · level: C1 · id: de-c1-beruf-w38
> uk: Тут я з вами цілком згоден.
> example: **Da bin ich ganz bei Ihnen**, aber wir müssen auch an die Kosten denken. — Тут я з вами цілком згоден, але треба думати й про витрати.
> note: сучасний офісний вираз; часто перед aber. Деяким здається заїждженим. Із колегою на du: Da bin ich ganz bei dir.

> [!word] Das nehme ich mit.
> ipa: /das ˈneːmə ɪç mɪt/ · pos: phrase · level: C1 · id: de-c1-beruf-w39
> uk: Візьму до уваги.
> example: Danke für den Hinweis, **das nehme ich mit**. — Дякую за підказку, візьму до уваги.
> note: офісний жаргон: відповідь на фідбек чи ідею. Звучить ввічливо, але не обіцяє, що щось зміниться.

## Слухаємо

> [!listen] Що ти почув?
> level: C1 · type: choice · id: de-c1-beruf-l01
> audio: Wenn ich kurz nachhaken darf: Bis wann brauchen Sie die Zahlen?
> - [x] Wenn ich kurz nachhaken darf: Bis wann brauchen Sie die Zahlen?
> - [ ] Wenn ich kurz nachfragen darf: Wann brauchen Sie die Zahlen?
> - [ ] Wenn ich kurz einhaken darf: Bis wann brauchen Sie die Zahlen?
>
> **Пояснення:** *nachhaken* — уточнити, перепитати; *bis wann* — до якого часу. *Einhaken* (втрутитися) і *nachfragen* близькі за змістом, але прозвучало саме *nachhaken*.

> [!listen] Як колега реагує на фідбек?
> level: C1 · type: answer · id: de-c1-beruf-l02
> audio: Danke für das offene Feedback. Den Punkt mit den Fristen kann ich nachvollziehen, das nehme ich mit.
> - [x] Дякує, погоджується з зауваженням про терміни й обіцяє врахувати.
> - [ ] Ображається й відкидає критику.
> - [ ] Просить перенести терміни.
> - [ ] Каже, що не зрозумів зауваження.
>
> **Пояснення:** *kann ich nachvollziehen* — «розумію, приймаю»; *das nehme ich mit* — «візьму до уваги». Це конструктивна реакція на фідбек.

> [!listen] Напиши, що почув
> level: C1 · type: dictation · id: de-c1-beruf-l03
> audio: Bei diesem Preis ist unsere Schmerzgrenze erreicht.

> [!listen] Що пропонує мовниця?
> level: C1 · type: answer · id: de-c1-beruf-l04
> audio: Wäre es denkbar, dass Sie uns beim Preis entgegenkommen? Als Gegenleistung könnten wir den Vertrag auf drei Jahre verlängern.
> - [x] Знизити ціну в обмін на довший договір.
> - [ ] Розірвати договір через ціну.
> - [ ] Підвищити ціну на три роки.
> - [ ] Відкласти переговори на три роки.
>
> **Пояснення:** *beim Preis entgegenkommen* — поступитися в ціні; *als Gegenleistung* — натомість вони продовжать договір на три роки. Класичний обмін поступками.

> [!listen] Заповни протокол
> level: C1 · type: fill · id: de-c1-beruf-l05
> audio: A: Lassen Sie uns festhalten: Frau Kraus schickt die Zahlen bis Donnerstag.
> audio: B: Und das Budget besprechen wir unter Tagesordnungspunkt vier.
>
> ```fill
> Zahlen: Frau [[Kraus]]
> Frist: bis [[Donnerstag]]
> Budget: TOP [[4|vier]]
> ```
>
> **Пояснення:** модератор фіксує (*festhalten*): пані Краус надсилає цифри до четверга, бюджет — під пунктом 4 (*Tagesordnungspunkt vier*). Переклад: — Зафіксуймо: пані Краус надсилає цифри до четверга. — А бюджет обговорюємо під четвертим пунктом.

## Вимова

> [!speak] Скажи вголос
> level: C1 · id: de-c1-beruf-s01
> text: Ich gebe zu bedenken, dass der Termin sehr knapp ist.
> ipa: /ɪç ˈɡeːbə tsuː bəˈdɛŋkn̩ das deːɐ̯ tɛʁˈmiːn zeːɐ̯ knap ɪst/
> tip: bedenken — наголос на -den-; Termin — наголос на -min; knapp — k і n обидва звучать: [knap].
> uk: Хочу звернути увагу, що термін дуже стислий.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-beruf-s02
> text: Wäre es denkbar, die Lieferung zu verschieben?
> ipa: /ˈvɛːʁə ɛs ˈdɛŋkbaːɐ̯ diː ˈliːfəʁʊŋ tsuː fɛɐ̯ˈʃiːbn̩/
> tip: wäre — довге [ɛː]; denkbar — nk = [ŋk]; інтонація питання — підйом наприкінці.
> uk: Чи можна було б перенести поставку?

> [!speak] Скажи вголос
> level: C1 · id: de-c1-beruf-s03
> text: Das kann ich gut nachvollziehen.
> ipa: /das kan ɪç ɡuːt ˈnaːxfɔltsiːən/
> tip: nachvollziehen — наголос на nach-; v = [f]; ie — довге [iː].
> uk: Я добре це розумію.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-beruf-s04
> text: Lassen Sie uns festhalten, was wir vereinbart haben.
> ipa: /ˈlasn̩ ziː ʊns ˈfɛsthaltn̩ vas viːɐ̯ fɛɐ̯ˈʔaɪ̯nbaːɐ̯t ˈhaːbn̩/
> tip: festhalten — наголос на fest-, h видихом; vereinbart — наголос на -ein-, перед ним легкий розрив.
> uk: Зафіксуймо, про що ми домовилися.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-beruf-s05
> text: Darf ich einen Gegenvorschlag machen?
> ipa: /daʁf ɪç ˈaɪ̯nən ˈɡeːɡn̩foːɐ̯ʃlaːk ˈmaxn̩/
> tip: Gegenvorschlag — обидва g на початку складу — [ɡ], кінцеве g — [k]; v = [f].
> uk: Можна зустрічну пропозицію?

> [!speak] Скажи вголос
> level: C1 · id: de-c1-beruf-s06
> text: Mir ist aufgefallen, dass der Bericht zu spät kam.
> ipa: /miːɐ̯ ɪst ˈaʊ̯fɡəfalən das deːɐ̯ bəˈʁɪçt tsuː ʃpɛːt kaːm/
> tip: aufgefallen — наголос на auf-; spät — sp на початку [ʃp], довге [ɛː].
> uk: Я помітив, що звіт надійшов запізно.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-beruf-s07
> text: Da bin ich ganz bei Ihnen, aber die Kosten steigen.
> ipa: /daː bɪn ɪç ɡants baɪ̯ ˈiːnən ˈaːbɐ diː ˈkɔstn̩ ˈʃtaɪ̯ɡn̩/
> tip: ganz — z = [ts]; Ihnen — довге [iː], h не вимовляється; steigen — ei [aɪ̯], st — [ʃt].
> uk: Тут я з вами згоден, але витрати зростають.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-beruf-s08
> text: Für ein weiteres Projekt fehlen uns die Kapazitäten.
> ipa: /fyːɐ̯ aɪ̯n ˈvaɪ̯təʁəs pʁoˈjɛkt ˈfeːlən ʊns diː kapatsiˈtɛːtn̩/
> tip: Projekt — j = [j], наголос на -jekt; Kapazitäten — z = [ts], наголос на -tä-.
> uk: На ще один проєкт у нас бракує ресурсу.

## Типові помилки українців

> [!pitfall] Різкість через переклад «в лоб»
> Українське «Ви неправі» → ~~Sie sind nicht recht~~ (помилка) і навіть правильне *Sie haben nicht recht* звучить на нараді різко. Краще: *Da sehe ich das etwas anders*, *Ich gebe zu bedenken, dass …* Так само «Зробіть до пʼятниці» → не ~~Machen Sie bis Freitag~~, а *Könnten Sie das bis Freitag erledigen?*

> [!pitfall] Du з першого дня — або Sie назавжди
> Сам не пропонуй *du* шефові чи старшому колезі: традиційно *das Du anbieten* старший за віком або посадою. Але й не тримайся за *Sie*, якщо вся команда на *du* — це звучить відсторонено. Слухай, як звертаються інші, і прямо спитай: *Duzt man sich hier?* Перейшовши на *du*, назад на *Sie* не повертаються.

> [!pitfall] Hallo без прізвища в першому листі
> *Hallo, ich brauche die Rechnung.* граматично правильно, але звучить різко → *Sehr geehrte Frau Kraus, könnten Sie mir bitte die Rechnung schicken?* У першому листі — *Sehr geehrte/r*, далі — *Liebe/r* або *Hallo Frau Kraus*. *Hallo* без імені — лише в листах колегам, з якими ти на *du*. Скорочення *MfG* у кінці листа багато хто вважає неввічливим.

> [!pitfall] Фідбек про людину, а не про дію
> ~~Du bist chaotisch.~~ → *Mir ist aufgefallen, dass in deinem Bericht zwei Tabellen fehlen.* Німецька культура фідбеку цінує **конкретику**: факт, наслідок, пропозиція. Загальні оцінки особи (*faul, chaotisch, unzuverlässig*) сприймають як образу навіть у прямій культурі спілкування.

## Ситуація: переговори з постачальником

> [!listen] Оксана веде переговори про ціну. Чим закінчилася розмова?
> level: C1 · type: answer · id: de-c1-beruf-l06
> audio: A: Fünf Prozent Rabatt — das ist unsere Schmerzgrenze.
> audio: B: Das kann ich nachvollziehen. Wäre es denkbar, die Lieferzeit als Gegenleistung zu verkürzen?
> audio: A: Das prüfen wir. Ich melde mich bis Freitag.
> - [x] Постачальник дає 5 % знижки й обіцяє до пʼятниці відповісти щодо коротшого терміну.
> - [ ] Постачальник відмовляється від будь-якої знижки.
> - [ ] Оксана погоджується на вищу ціну.
> - [ ] Сторони одразу підписали договір.
>
> **Пояснення:** *fünf Prozent Rabatt — das ist unsere Schmerzgrenze* — більше не дадуть. Оксана просить *als Gegenleistung* скоротити термін поставки; відповідь — *Das prüfen wir. Ich melde mich bis Freitag.* Переклад: — Пʼять відсотків знижки — це наша межа. — Розумію. А чи можна натомість скоротити термін поставки? — Перевіримо. Я напишу до пʼятниці.

> [!speak] Ситуація: запропонуй обмін
> level: C1 · id: de-c1-beruf-s09
> text: Wäre es denkbar, die Lieferzeit als Gegenleistung zu verkürzen?
> ipa: /ˈvɛːʁə ɛs ˈdɛŋkbaːɐ̯ diː ˈliːfɐtsaɪ̯t als ˈɡeːɡn̩laɪ̯stʊŋ tsuː fɛɐ̯ˈkʏʁtsn̩/
> tip: Lieferzeit — z = [ts], ei [aɪ̯]; verkürzen — ü коротке [ʏ], rz — [ʁts].
> uk: Чи можна було б натомість скоротити термін поставки?

> [!speak] Ситуація: підсумуй нараду
> level: C1 · id: de-c1-beruf-s10
> text: Vielen Dank für die konstruktive Diskussion. Das Protokoll kommt bis Freitag.
> ipa: /ˈfiːlən daŋk fyːɐ̯ diː kɔnstʁʊkˈtiːvə dɪskʊˈsi̯oːn das pʁotoˈkɔl kɔmt bɪs ˈfʁaɪ̯taːk/
> tip: konstruktive — наголос на -ti-; Diskussion — ss = [s], наголос на -sion; Freitag — кінцеве g — [k].
> uk: Дякую за конструктивну дискусію. Протокол буде до пʼятниці.

## Landeskunde: Du oder Sie im Büro?

> [!example] Die Anrede am Arbeitsplatz — ein Land im Wandel
> Wer in Deutschland eine neue Stelle antritt, stellt sich oft eine Frage, die man in vielen anderen Ländern kaum kennt: Duzt oder siezt man die Kolleginnen und Kollegen? Lange war die Antwort klar. Im Büro sagte man „Sie“, das „Du“ war Freunden und der Familie vorbehalten. Bot der Chef nach Jahren das Du an, galt das als Zeichen der Wertschätzung.
>
> Heute ist das Bild bunter. Eine Studie der Jobbörse StepStone und der Beratung Kienbaum, mit rund 17 000 befragten Fachkräften (erste Ergebnisse Ende 2016) zeigt große Unterschiede. Nur etwa drei Prozent der Befragten siezten alle Kolleginnen und Kollegen. Rund ein Drittel duzte dagegen alle, auch die Vorgesetzten. Die meisten, nämlich 63 Prozent, lebten in einer Mischform: Mit den Kollegen ist man per Du, mit der Führungsetage per Sie.
>
> Besonders deutlich ist der Unterschied zwischen den Branchen. In der IT und in der PR duzten sich laut der Studie rund 70 Prozent aller Beschäftigten untereinander, im Bankwesen nur 20 Prozent und im öffentlichen Dienst sogar nur 15 Prozent. Auch die Größe spielt eine Rolle: In kleinen Firmen mit weniger als 50 Mitarbeitenden war jeder zweite mit allen per Du.
>
> Für Neue gibt es einige ungeschriebene Regeln. Traditionell bietet die ältere oder ranghöhere Person das Du an, nicht umgekehrt. Hat man sich einmal geduzt, kehrt man normalerweise nicht zum Sie zurück. Wer unsicher ist, beobachtet zunächst, wie die anderen miteinander sprechen, oder fragt offen nach. Das gilt nicht als unhöflich, sondern als aufmerksam. Wer das Du anbieten möchte, formuliert es am besten als Frage: „Wollen wir uns duzen?“ oder „Wir können gern beim Du bleiben.“ So bekommt das Gegenüber die Möglichkeit, freundlich abzulehnen, ohne dass jemand das Gesicht verliert. Bei Kunden, Bewerbern und in der ersten Mail an eine unbekannte Person bleibt man dagegen fast immer beim Sie, auch in Firmen, in denen sich intern alle duzen.
>
> Das Du bedeutet allerdings nicht, dass die Hierarchie verschwindet. Auch wer seine Chefin duzt, formuliert Kritik sachlich und wertschätzend. Umgekehrt kann man auch per Sie herzlich sein. In Österreich spielen akademische Titel in der Anrede traditionell eine größere Rolle als in Deutschland. Wer mehrere Jahre in derselben Abteilung arbeitet, erlebt den Wechsel vom Sie zum Du oft als Schwelle, die man gemeinsam überschreitet, und nicht als bloße Formsache. Mehr zu Anrede und Register findest du in [[Deutsch - C1 - 18. Регістр — du і Sie, Amtsdeutsch, розмовна й молодіжна мова]].

> [!quiz] Nach dem Text: Wie viele Befragte siezten alle Kolleginnen und Kollegen?
> level: C1 · type: single · id: de-c1-beruf-q02
> - [x] etwa drei Prozent
> - [ ] etwa ein Drittel
> - [ ] 63 Prozent
> - [ ] rund 70 Prozent
>
> **Пояснення:** *Nur etwa drei Prozent der Befragten siezten alle.* Третина — ті, хто на *du* з усіма; 63 % — змішана форма; 70 % — частка «ти» в IT і PR.

> [!quiz] Nach dem Text: Wer bietet traditionell das Du an?
> level: C1 · type: single · id: de-c1-beruf-q03
> - [ ] die jüngere Person
> - [x] die ältere oder ranghöhere Person
> - [ ] immer die Frau
> - [ ] die Person, die neu in der Firma ist
>
> **Пояснення:** *Traditionell bietet die ältere oder ranghöhere Person das Du an, nicht umgekehrt.* Новачок чекає пропозиції або обережно питає.

> [!quiz] Was stimmt laut Text? Wähle alle richtigen Aussagen.
> level: C1 · type: multi · id: de-c1-beruf-q04
> - [x] Im öffentlichen Dienst duzt man sich deutlich seltener als in der IT.
> - [x] Wer unsicher ist, darf offen nachfragen.
> - [ ] Mit dem Du verschwindet die Hierarchie.
> - [ ] Nach dem Du kehrt man oft zum Sie zurück.
>
> **Пояснення:** 15 % у державній службі проти 70 % в IT; питати *gilt nicht als unhöflich*. Текст прямо каже, що *du* не скасовує ієрархії і що до *Sie* зазвичай не повертаються.

## Практика

> [!quiz] Колега на нараді відхилився від теми. Що скаже модератор?
> level: C1 · type: single · id: de-c1-beruf-q05
> - [x] Das ist ein wichtiger Punkt, aber er gehört zu TOP 4. Lassen Sie uns das dort besprechen.
> - [ ] Das interessiert jetzt niemanden.
> - [ ] Sie reden schon wieder über etwas anderes.
> - [ ] Bitte schweigen Sie.
>
> **Пояснення:** модератор визнає цінність думки (*ein wichtiger Punkt*) і переносить її до іншого пункту. Інші варіанти зупиняють колегу, але ображають його.

> [!quiz] Яка реакція на критику найпрофесійніша?
> level: C1 · type: single · id: de-c1-beruf-q06
> - [ ] Das stimmt nicht, ich war nie zu spät.
> - [x] Danke für das Feedback. Den Punkt kann ich nachvollziehen, das nehme ich mit.
> - [ ] Andere sind auch oft zu spät.
> - [ ] Darüber möchte ich nicht sprechen.
>
> **Пояснення:** подяка, визнання (*nachvollziehen*) і обіцянка врахувати (*das nehme ich mit*) — стандарт конструктивної реакції. Заперечення, порівняння з іншими й відмова говорити загострюють конфлікт.

> [!quiz] Які фрази допомагають висловити незгоду дипломатично? Обери всі.
> level: C1 · type: multi · id: de-c1-beruf-q07
> - [x] Ich gebe zu bedenken, dass …
> - [x] Da bin ich ganz bei Ihnen, aber …
> - [ ] Das ist doch Unsinn.
> - [x] Wäre es nicht sinnvoll, …?
> - [ ] Sie haben keine Ahnung.
>
> **Пояснення:** аргумент замість вироку (*Ich gebe zu bedenken*), згода перед незгодою (*Da bin ich ganz bei Ihnen, aber*) і питання з Konjunktiv II (*Wäre es nicht sinnvoll*). *Das ist doch Unsinn* і *Sie haben keine Ahnung* — грубо.

> [!quiz] Заповни фрази переговорів
> level: C1 · type: fill · id: de-c1-beruf-q08 · bank: Gegenteil, Schmerzpunkt, Gegenstück
>
> ```text fill
> Darf ich einen [[Gegenvorschlag]] machen?
> Als [[Gegenleistung]] verlängern wir den Vertrag.
> Bei diesem Preis ist unsere [[Schmerzgrenze]] erreicht.
> Nach langen Gesprächen gab es eine [[Einigung]].
> ```
>
> **Пояснення:** *einen Gegenvorschlag machen, als Gegenleistung, die Schmerzgrenze ist erreicht, eine Einigung*. Дистрактори — справжні помилки: *Gegenteil* (протилежність, не обмін), *Schmerzpunkt* (калька з англ. pain point, але тут не те), *Gegenstück* (парний предмет, аналог — не відповідна пропозиція).

> [!quiz] Склади речення: «Шефиня запропонувала мені перейти на "ти".»
> level: C1 · type: order · id: de-c1-beruf-q09
>
> ```text order
> Die Chefin
> hat
> mir
> das Du
> angeboten.
> mich ✗
> ```
>
> **Пояснення:** *jemandem das Du anbieten* — Dativ (*mir*), *das Du* — іменник з великої літери; Perfekt *hat … angeboten*.

> [!quiz] Ти пишеш першого листа незнайомій клієнтці. Як почати?
> level: C1 · type: single · id: de-c1-beruf-q10
> - [x] Sehr geehrte Frau Kraus,
> - [ ] Hallo,
> - [ ] Hi Anna,
> - [ ] Liebe Anna,
>
> **Пояснення:** у першому діловому листі — *Sehr geehrte Frau Kraus,*. *Hallo* без імені й звертання на імʼя (*Hi Anna, Liebe Anna*) доречні лише тоді, коли ви вже знайомі або на *du*.

> [!quiz] Заповни фрази модерації
> level: C1 · type: fill · id: de-c1-beruf-q11 · bank: anhalten, zusammensetzen, nachgeben
>
> ```text fill
> Gibt es weitere [[Wortmeldungen]]?
> Wenn ich kurz [[nachhaken]] darf: Wer ist zuständig?
> Lassen Sie uns [[festhalten]], was wir vereinbart haben.
> Ich möchte an das [[anknüpfen]], was Frau Kraus gesagt hat.
> ```
>
> **Пояснення:** *Wortmeldungen* — охочі висловитися; *nachhaken* — уточнити; *festhalten* — зафіксувати; *an etwas anknüpfen* — продовжити думку. *Anhalten* (зупинити), *zusammensetzen* (скласти) і *nachgeben* (поступитися) у цих сталих формулах не вживають.

> [!quiz] Склади ввічливе прохання: «Чи можна було б перенести поставку?»
> level: C1 · type: order · id: de-c1-beruf-q12
>
> ```text order
> Wäre es denkbar,
> die Lieferung
> zu verschieben?
> Ist es denkbar ✗
> ```
>
> **Пояснення:** *Wäre* (Konjunktiv II) робить прохання мʼякшим за *Ist es …*. Після *denkbar* — інфінітив із *zu* в кінці.

## Фішки

> [!reel] 📻 Flurfunk — радіо в коридорі
> *Der Flurfunk* — це офісні чутки: *der Flur* (коридор) + *der Funk* (радіо). Новини про звільнення чи підвищення часто приходять саме «по коридорному радіо» раніше за офіційний лист. Слово жартівливе, в офіційному листі не годиться.

> [!reel] 🤝 Du — і назад дороги немає
> У Німеччині перейти з *Sie* на *du* — маленька подія: колись її навіть відзначали келихом (*Brüderschaft trinken*). Повернутися з *du* до *Sie* — майже неможливо: це сприймуть як сварку. Тому старші й керівники пропонують *du* обережно.

> [!reel] 🎒 Das nehme ich mit
> Буквально «я це візьму з собою». В офісі так відповідають на фідбек чи ідею: «візьму до уваги». Ввічливо, але без обіцянок. Почуєш *Das nehme ich mit* — значить, тебе почули, але рішення ще немає.

## Джерела та що почитати

- [Personalwirtschaft — Das Du verdrängt das Sie](https://www.personalwirtschaft.de/news/hr-organisation/das-du-verdraengt-das-sie-104896/): попередні результати дослідження StepStone і Kienbaum про звертання в офісі.
- [DWDS — nachhaken](https://www.dwds.de/wb/nachhaken): значення й приклади.
- [DWDS — Schmerzgrenze](https://www.dwds.de/wb/Schmerzgrenze): буквальне й переносне значення.
- [DWDS — Flurfunk](https://www.dwds.de/wb/Flurfunk): значення й стиль.
- [DWDS — ausloten](https://www.dwds.de/wb/ausloten): Möglichkeiten, Grenzen ausloten.

> [!important] Підсумок
> - **Модерація**: мета й час → *Wortmeldungen* → повернути до *Tagesordnungspunkt* → *festhalten* → *Absprachen* (хто, що, до коли).
> - **Фідбек**: *Ich-Botschaft* — спостереження, наслідок, побажання; реакція — *Danke, das kann ich nachvollziehen, das nehme ich mit*.
> - **Дипломатія**: Konjunktiv II (*Wäre es denkbar …?*), аргумент замість вироку (*Ich gebe zu bedenken …*), згода перед незгодою (*Da bin ich ganz bei Ihnen, aber …*), *etwas missverständlich*.
> - **Переговори**: *Gegenvorschlag, Gegenleistung, Schmerzgrenze, Spielräume ausloten, eine Einigung erzielen, Konsens*.
> - **du / Sie**: *das Du anbieten* — старший за віком або посадою; назад до *Sie* не повертаються; у першому листі — *Sehr geehrte/r*.
