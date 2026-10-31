---
title: Номіналізація I — Verbalstil і Nominalstil
id: de-b2-nominalisierung
level: B2
icon: px:star
tags: [deutsch, b2, grammar, nominalisierung, nominalstil]
prerequisites: ["[[Deutsch - B2 - 08. Конектори й підрядні — obwohl, indem, sodass, falls]]", "[[Deutsch - B1 - 03. Родовий відмінок — Genitiv]]"]
estimatedMinutes: 45
---

# Номіналізація I — Verbalstil і Nominalstil

> [!success] Після цієї теми ти зможеш
> - розпізнати два стилі: **Verbalstil** (з дієсловами) і **Nominalstil** (з іменниками), типовий для газет і офіційних текстів;
> - утворити іменник від дієслова й вжити його з Genitiv: *der Anstieg der Preise, die Verbesserung der Qualität*;
> - замінити підрядне речення на прийменник з іменником: *weil → wegen, obwohl → trotz, wenn → bei, nachdem → nach*;
> - вжити субстантивований інфінітив: *beim Fahren, nach dem Essen*.

## Передбач

> [!quiz] «Weil er krank war, blieb er zu Hause.» Як сказати те саме в Nominalstil?
> level: B2 · type: single · id: de-b2-nominalisierung-q01
> - [x] Wegen seiner Krankheit blieb er zu Hause.
> - [ ] Trotz seiner Krankheit blieb er zu Hause.
> - [ ] Wegen er krank war, blieb er zu Hause.
> - [ ] Dank seiner Krankheit blieb er zu Hause.
>
> **Пояснення:** підрядне з *weil* замінюємо прийменником **wegen** + іменник у Genitiv (*seiner Krankheit*). *Trotz* змінило б значення на протилежне, а перед реченням (*wegen er krank war*) прийменник не стоїть.

## Два стилі

Одну й ту саму думку можна висловити дієсловами або іменниками.

| Verbalstil | Nominalstil |
|---|---|
| Weil die Preise **gestiegen sind**, kaufen weniger Menschen ein. | **Wegen des Anstiegs** der Preise kaufen weniger Menschen ein. |
| **Wenn** es **regnet**, fällt das Fest aus. | **Bei Regen** fällt das Fest aus. |
| **Nachdem** er **angekommen war**, rief er an. | **Nach seiner Ankunft** rief er an. |
| Obwohl **wir uns verbessern**, … | **Trotz unserer Verbesserung** … |

Verbalstil звучить живіше й простіше, тому він переважає в розмові й листах другові. Nominalstil стискає інформацію й відсуває дію на задній план, тому його люблять газети, наукові тексти, закони й офіційні листи. Це не «краща» й «гірша» мова — це різні регістри. На B2 потрібно **розуміти** обидва й уміти переходити від одного до іншого.

## Як утворити іменник від дієслова

| як | приклади |
|---|---|
| **-ung** (рід **die**) | entscheiden → die Entscheidung · verbessern → die Verbesserung · einführen → die Einführung |
| **корінь без суфікса** | ansteigen → der Anstieg · zurückgehen → der Rückgang · verlaufen → der Verlauf · beschließen → der Beschluss |
| **-e / -t** | zunehmen → die Zunahme · teilnehmen → die Teilnahme · fahren → die Fahrt |
| **-nis, -ion** | ergeben → das Ergebnis · reduzieren → die Reduktion |
| **-heit / -keit** (від прикметника) | schnell → die Schnelligkeit · sicher → die Sicherheit |
| **інфінітив → іменник** (середній рід, **з великої**) | fahren → das Fahren · essen → das Essen |

Усі іменники із суфіксом **-ung** (від дієслів) — жіночого роду (*die Entscheidung*); слова, де *-ung* — частина кореня (*der Sprung, der Schwung*), сюди не належать. Для решти способів рід треба вчити з артиклем: *der Anstieg, die Zunahme, das Ergebnis*.

## Що відбувається з іншими членами речення

Коли дієслово стає іменником, решта речення перебудовується.

> [!diagram] Від речення з weil до Nominalstil
> ```yaml
> layout: flow
> nodes:
>   - { id: conj, label: "сполучник", text: "Weil", tone: gray }
>   - { id: subj, label: "підмет", text: "die Preise", tone: mint }
>   - { id: verb, label: "дієслово", text: "gestiegen sind", tone: orange }
>   - { id: main, label: "решта", text: "kaufen weniger Menschen ein", tone: gray }
> steps:
>   - { focus: [conj, subj, verb], note: "Спочатку підрядне речення: Weil die Preise gestiegen sind, …" }
>   - { set: { conj: "Wegen" }, focus: conj, note: "weil → wegen (+ Genitiv): сполучник стає прийменником." }
>   - { set: { verb: "des Anstiegs" }, focus: verb, note: "Дієслово steigen → іменник der Anstieg, який стоїть у Genitiv: des Anstiegs." }
>   - { set: { subj: "der Preise" }, focus: subj, note: "Підмет die Preise → Genitiv після іменника: des Anstiegs der Preise." }
>   - { focus: [conj, verb, subj, main], note: "Результат: Wegen des Anstiegs der Preise kaufen weniger Menschen ein. Підрядне зникло." }
> ```
> Дієслово → іменник; підмет → Genitiv (або *von* + Dativ); сполучник → прийменник.

Якщо в підрядному було ще й додаткове слово, воно стає прикметником (*schnell steigen → der schnelle Anstieg*). Заперечення *nicht* перетворюється на *kein, ohne* або префікс *Nicht-* (*Dass er nicht kam → sein Nichterscheinen*).

## Сполучник → прийменник

| підрядне | прийменник + іменник | приклад |
|---|---|---|
| **weil / da** | wegen, aufgrund (+ Gen) | Weil es stürmt → **Wegen** des Sturms |
| **obwohl** | trotz (+ Gen) | Obwohl es regnet → **Trotz** des Regens |
| **wenn** (умова) | bei (+ Dat), im Falle (+ Gen) | Wenn es regnet → **Bei** Regen |
| **als, während** (час) | bei, während (+ Gen) | Während er arbeitete → **Während** seiner Arbeit |
| **nachdem** | nach (+ Dat) | Nachdem er angekommen war → **Nach** seiner Ankunft |
| **bevor** | vor (+ Dat) | Bevor er abreist → **Vor** seiner Abreise |
| **seit, bis** | seit, bis zu (+ Dat) | Bis er zurückkommt → **Bis zu** seiner Rückkehr |
| **indem** | durch (+ Akk) | Indem man liest → **Durch** Lesen |
| **um … zu, damit** | zu, zum (+ Dat), zwecks (+ Gen) | Um zu sparen → **Zum** Sparen |
| **dass-Satz** | іменник + Genitiv | Dass die Preise steigen → **Der Anstieg** der Preise |

## Субстантивований інфінітив

Інфінітив можна перетворити на іменник середнього роду з великої літери. Його часто використовують з прийменниками: *beim, zum, im, vom, nach dem*.

| речення | з іменником |
|---|---|
| Wenn man fährt, darf man nicht telefonieren. | **Beim Fahren** darf man nicht telefonieren. |
| Nachdem wir gegessen hatten, gingen wir spazieren. | **Nach dem Essen** gingen wir spazieren. |
| Er lernt, um besser zu verstehen. | Er lernt **zum besseren Verständnis**. |

*beim Fahren* = «під час їзди»; *zum Lernen* = «для навчання».

## Дієслівно-іменні сполуки

У Nominalstil часто зʼявляється іменник разом із «порожнім» дієсловом: *eine Entscheidung treffen* (= *entscheiden*), *in Betracht ziehen* (= *berücksichtigen*), *zur Verfügung stellen*. Вони звучать офіційніше. Докладніше — тема [[Deutsch - B2 - 23. Сполуки іменника з дієсловом I — Funktionsverbgefüge]].

## Приклади

- **Wegen der Verspätung** fiel das Treffen aus. — Через запізнення зустріч скасували.
- **Trotz des Regens** gingen wir spazieren. — Попри дощ ми пішли гуляти.
- **Bei Bedarf** rufen Sie mich an. — У разі потреби телефонуйте мені.
- **Nach seiner Ankunft** rief er sofort an. — Після прибуття він одразу зателефонував.
- **Beim Fahren** darf man nicht telefonieren. — Під час їзди не можна телефонувати.
- **Der Anstieg** der Preise ärgert viele Menschen. — Зростання цін дратує багатьох.
- **Die Zunahme** der Teilnehmer überraschte die Veranstalter. — Збільшення кількості учасників здивувало організаторів.
- **Die Verbesserung** der Qualität dauert lange. — Покращення якості триває довго.
- **Die Entscheidung** des Ministers kam überraschend. — Рішення міністра було несподіваним.
- **Nach der Überprüfung** der Unterlagen erhielt er die Genehmigung. — Після перевірки документів він отримав дозвіл.

## Слова

> [!word] die Berücksichtigung
> ipa: /bəˈʁʏkzɪçtɪɡʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w01
> uk: врахування
> forms: — (зазвичай без множини)
> example: Unter **Berücksichtigung** aller Umstände ist das Urteil milde. — З урахуванням усіх обставин вирок мʼякий.
> note: від berücksichtigen; unter Berücksichtigung (+ Gen) — з урахуванням.

> [!word] die Verbesserung
> ipa: /fɛɐ̯ˈbɛsəʁʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w02
> uk: покращення; поправка
> forms: die Verbesserungen
> example: Die **Verbesserung** der Arbeitsbedingungen ist das Ziel. — Покращення умов праці — мета.
> note: від verbessern; Verbesserungsvorschlag — пропозиція щодо покращення.

> [!word] die Entwicklung
> ipa: /ɛntˈvɪklʊŋ/ · pos: noun · level: B1 · id: de-b2-nominalisierung-w03
> uk: розвиток; розробка
> forms: die Entwicklungen
> example: Die **Entwicklung** neuer Medikamente dauert Jahre. — Розробка нових ліків триває роками.
> note: від entwickeln; Entwicklungsland — країна, що розвивається.

> [!word] die Durchführung
> ipa: /ˈdʊʁçfyːʁʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w04
> uk: проведення; виконання
> forms: — (зазвичай без множини)
> example: Die **Durchführung** der Prüfung dauert drei Stunden. — Проведення іспиту триває три години.
> note: від durchführen; zur Durchführung kommen — бути проведеним.

> [!word] die Anwendung
> ipa: /ˈanvɛndʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w05
> uk: застосування; додаток (програма)
> forms: die Anwendungen
> example: Die **Anwendung** der Regel ist einfach. — Застосування правила просте.
> note: ще й IT: eine App = eine Anwendung.

> [!word] die Zunahme
> ipa: /ˈtsuːnaːmə/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w06
> uk: збільшення; зростання
> forms: — (зазвичай без множини)
> example: Die **Zunahme** der Verkehrsunfälle macht Sorgen. — Збільшення кількості ДТП викликає занепокоєння.
> note: від zunehmen; протилежне — die Abnahme.

> [!word] der Rückgang
> ipa: /ˈʁʏkɡaŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w07
> uk: зниження; спад
> forms: die Rückgänge
> example: Der **Rückgang** der Geburtenzahl ist deutlich. — Зниження народжуваності помітне.
> note: від zurückgehen; ü — губи трубочкою.

> [!word] der Anstieg
> ipa: /ˈanʃtiːk/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w08
> uk: зростання; підйом
> forms: die Anstiege
> example: Der **Anstieg** der Preise ärgert viele. — Зростання цін дратує багатьох.
> note: від ansteigen; кінцеве g = [k]: «аншті-к».

> [!word] die Abnahme
> ipa: /ˈapnaːmə/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w09
> uk: зменшення; спад
> forms: — (зазвичай без множини)
> example: Die **Abnahme** der Kunden ist besorgniserregend. — Зменшення кількості клієнтів викликає занепокоєння.
> note: ще й «прийняття (товару, роботи)»: die Abnahme der Ware.

> [!word] die Teilnahme
> ipa: /ˈtaɪ̯lnaːmə/ · pos: noun · level: B1 · id: de-b2-nominalisierung-w10
> uk: участь
> forms: — (без множини)
> example: Die **Teilnahme** am Kurs ist freiwillig. — Участь у курсі добровільна.
> note: Teilnahme an + Dat; teilnehmen an + Dat.

> [!word] die Einführung
> ipa: /ˈaɪ̯nfyːʁʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w11
> uk: впровадження; вступ
> forms: die Einführungen
> example: Die **Einführung** der Regel stieß auf Kritik. — Впровадження правила зустріло критику.
> note: ще й вступ до теми: eine Einführung in die Linguistik.

> [!word] die Lieferung
> ipa: /ˈliːfəʁʊŋ/ · pos: noun · level: B1 · id: de-b2-nominalisierung-w12
> uk: доставка; поставка
> forms: die Lieferungen
> example: Die **Lieferung** dauert drei Tage. — Доставка триває три дні.
> note: від liefern; Lieferzeit — час доставки.

> [!word] der Verlauf
> ipa: /fɛɐ̯ˈlaʊ̯f/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w13
> uk: перебіг; хід
> forms: die Verläufe
> example: Im **Verlauf** der Sitzung wurde viel diskutiert. — Під час засідання багато дискутували.
> note: im Verlauf (+ Gen) — упродовж; ä в множині: Verläufe.

> [!word] der Bedarf
> ipa: /bəˈdaʁf/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w14
> uk: потреба; попит
> forms: — (зазвичай без множини)
> example: Bei **Bedarf** rufen Sie uns an. — У разі потреби телефонуйте нам.
> note: bei Bedarf — «за потреби»; Bedarf an + Dat — потреба в чомусь.

> [!word] die Erhöhung
> ipa: /ɛɐ̯ˈhøːʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w15
> uk: підвищення
> forms: die Erhöhungen
> example: Die **Erhöhung** der Preise wurde angekündigt. — Підвищення цін оголошено.
> note: від erhöhen; ö — губи округлено.

> [!word] die Senkung
> ipa: /ˈzɛŋkʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w16
> uk: зниження (податків, цін)
> forms: die Senkungen
> example: Die **Senkung** der Steuern ist geplant. — Заплановано зниження податків.
> note: від senken; die Senkung der Kosten — зниження витрат.

> [!word] die Kürzung
> ipa: /ˈkʏʁtsʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w17
> uk: скорочення (бюджету, виплат)
> forms: die Kürzungen
> example: Die **Kürzung** der Mittel traf die Schulen. — Скорочення коштів зачепило школи.
> note: від kürzen; звучить негативніше за Senkung.

> [!word] die Überprüfung
> ipa: /yːbɐˈpʁyːfʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w18
> uk: перевірка
> forms: die Überprüfungen
> example: Nach der **Überprüfung** der Unterlagen kam die Antwort. — Після перевірки документів надійшла відповідь.
> note: від überprüfen; префікс über- тут ненаголошений.

> [!word] die Ablehnung
> ipa: /ˈapleːnʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w19
> uk: відмова; відхилення
> forms: die Ablehnungen
> example: Die **Ablehnung** des Antrags war überraschend. — Відхилення заяви було несподіваним.
> note: від ablehnen; Ablehnungsbescheid — лист із відмовою.

> [!word] die Verzögerung
> ipa: /fɛɐ̯ˈtsøːɡəʁʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w20
> uk: затримка
> forms: die Verzögerungen
> example: Wegen der **Verzögerung** beginnt die Sitzung später. — Через затримку засідання починається пізніше.
> note: від verzögern; ö — округлені губи, g між голосними — [ɡ].

> [!word] die Überlegung
> ipa: /yːbɐˈleːɡʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w21
> uk: роздум; міркування
> forms: die Überlegungen
> example: Nach reiflicher **Überlegung** nahm er das Angebot an. — Після ретельного роздуму він прийняв пропозицію.
> note: від überlegen; Überlegungen anstellen — міркувати.

> [!word] der Beschluss
> ipa: /bəˈʃlʊs/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w22
> uk: рішення (колегіальне); постанова
> forms: die Beschlüsse
> example: Der **Beschluss** wurde einstimmig gefasst. — Рішення ухвалили одностайно.
> note: einen Beschluss fassen — ухвалити рішення (колегіальне); die Entscheidung — загальніше.

> [!word] der Verstoß
> ipa: /fɛɐ̯ˈʃtoːs/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w23
> uk: порушення
> forms: die Verstöße
> example: Ein **Verstoß** gegen die Regeln wird bestraft. — Порушення правил карається.
> note: Verstoß gegen + Akk; від verstoßen gegen.

> [!word] die Nutzung
> ipa: /ˈnʊtsʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w24
> uk: використання
> forms: die Nutzungen
> example: Die **Nutzung** des Parkplatzes ist kostenlos. — Використання парковки безкоштовне.
> note: від nutzen; Nutzungsbedingungen — умови використання.

> [!word] die Veränderung
> ipa: /fɛɐ̯ˈʔɛndəʁʊŋ/ · pos: noun · level: B1 · id: de-b2-nominalisierung-w25
> uk: зміна
> forms: die Veränderungen
> example: Die **Veränderung** der Regeln überraschte alle. — Зміна правил здивувала всіх.
> note: ʔ між префіксом ver- і коренем -ändern.

> [!word] die Anschaffung
> ipa: /ˈanʃafʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w26
> uk: придбання
> forms: die Anschaffungen
> example: Die **Anschaffung** eines neuen Autos kostet viel. — Придбання нового автомобіля коштує дорого.
> note: від anschaffen; Anschaffungskosten — витрати на придбання.

> [!word] die Befürchtung
> ipa: /bəˈfʏʁçtʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w27
> uk: побоювання
> forms: die Befürchtungen
> example: Meine **Befürchtung** war leider richtig. — Моє побоювання, на жаль, справдилося.
> note: від befürchten; ch після r — [ç].

> [!word] der Anspruch
> ipa: /ˈanʃpʁʊx/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w28
> uk: право (вимоги); претензія
> forms: die Ansprüche
> example: Er hat **Anspruch** auf Urlaub. — Він має право на відпустку.
> note: Anspruch auf + Akk; ще: hohe Ansprüche — високі вимоги.

> [!word] das Wachstum
> ipa: /ˈvakstuːm/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w29
> uk: зростання
> forms: — (без множини)
> example: Das **Wachstum** der Wirtschaft verlangsamt sich. — Економічне зростання сповільнюється.
> note: від wachsen; chs = [ks]; без множини.

> [!word] die Entstehung
> ipa: /ɛntˈʃteːʊŋ/ · pos: noun · level: B2 · id: de-b2-nominalisierung-w30
> uk: виникнення; походження
> forms: — (зазвичай без множини)
> example: Die **Entstehung** des Problems ist unklar. — Причини виникнення проблеми неясні.
> note: від entstehen → entstand → ist entstanden.

## Слухаємо

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-nominalisierung-l01
> audio: Wegen der Verspätung fiel das Treffen aus.
> - [x] Wegen der Verspätung fiel das Treffen aus.
> - [ ] Weil der Zug Verspätung hatte, fiel das Treffen aus.
> - [ ] Trotz der Verspätung fiel das Treffen aus.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-nominalisierung-l02
> audio: Der Anstieg der Preise belastet viele Familien.
> explain: Anstieg — der; після нього Genitiv: der Preise.

> [!listen] Послухай діалог. Чому свято скасовано?
> level: B2 · type: answer · id: de-b2-nominalisierung-l03
> audio: A: Warum wurde das Stadtfest abgesagt?
> audio: B: Wegen des starken Regens und wegen der geringen Zahl der Anmeldungen.
> audio: A: Schade! Und wann findet es statt?
> audio: B: Im nächsten Jahr, bei besserem Wetter.
> - [ ] Через страйк та брак грошей.
> - [x] Через сильний дощ і малу кількість заявок.
> - [ ] Через хворобу організатора.
>
> **Пояснення:** *wegen des starken Regens* і *wegen der geringen Zahl der Anmeldungen* — дві причини в Nominalstil. *Bei besserem Wetter* — «за кращої погоди».

## Вимова

В іменниках на -ung наголос падає на корінь (*Entscheidung* — [ɛntˈʃaɪ̯dʊŋ], *Verbesserung*), а суфікс *-ung* — слабкий [ʊŋ]. Префікси *ver-, be-, ent-, er-* не мають наголосу. У невідокремлюваних *über-* (*Überprüfung*) наголос іде на корінь, а не на префікс.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-nominalisierung-s01
> text: Beim Fahren darf man nicht telefonieren.
> ipa: /baɪ̯m ˈfaːʁən daʁf man nɪçt telefoˈniːʁən/
> tip: Fahren — довге [aː]. darf — коротке [a] і кінцеве f. telefonieren — наголос на -nie-.
> uk: Під час їзди не можна телефонувати.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-nominalisierung-s02
> text: Wegen des Anstiegs der Preise kaufen weniger Menschen ein.
> ipa: /ˈveːɡn̩ dɛs ˈanʃtiːks deːɐ̯ ˈpʁaɪ̯zə ˈkaʊ̯fn̩ ˈveːnɪɡɐ ˈmɛnʃn̩ aɪ̯n/
> tip: Anstiegs — st = «шт», кінцеве -gs звучить [ks]. weniger — -ig = [ɪɡ] перед закінченням. Menschen — [ˈmɛnʃn̩].
> uk: Через зростання цін менше людей робить покупки.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-nominalisierung-s03
> text: Nach seiner Ankunft rief er sofort an.
> ipa: /naːx ˈzaɪ̯nɐ ˈankʊnft ʁiːf eːɐ̯ zoˈfɔʁt an/
> tip: nach — ch після a = [x]. Ankunft — наголос на An-. rief — довге [iː].
> uk: Після прибуття він одразу зателефонував.

## Типові помилки українців

> [!pitfall] Без Genitiv: ~~der Anstieg Preise~~
> Українською ми кажемо «зростання цін» — іменник після іменника в родовому. У німецькій Genitiv теж обовʼязковий і має артикль: *der Anstieg der Preise, die Verbesserung der Qualität*. Помилки: ~~der Anstieg Preise~~ (без Genitiv), ~~der Anstieg die Preise~~ (Nominativ замість Genitiv) і ~~der Anstieg von die Preise~~.

> [!pitfall] Прийменник перед реченням: ~~wegen er krank war~~
> *Wegen, trotz, bei, nach* стоять перед **іменником**, а не перед підрядним. Перед реченням потрібен сполучник: *weil er krank war* / *wegen seiner Krankheit*. Українське «через те що» ховає різницю: «через хворобу» — *wegen der Krankheit*, «через те що захворів» — *weil er krank wurde*.

> [!pitfall] Малі літери: ~~beim fahren~~, ~~nach dem essen~~
> Субстантивований інфінітив — це **іменник**, тому пишемо з великої: *beim Fahren, nach dem Essen, zum Lernen*. Українське «під час їзди» не підказує великої літери, тож помилку легко зробити. Перевір: після *beim, zum, im, vom* або артикля стоїть іменник.

> [!pitfall] «Рішення міністра»: хто вирішує?
> Genitiv після дієслівного іменника може означати і виконавця, і обʼєкт: *die Kritik des Ministers* — «критика, яку висловив міністр» або «критика на адресу міністра». Щоб не заплутатися, використовуй прийменники: *die Kritik am Minister* (обʼєкт), *die Kritik von dem Minister* (виконавець). З іменниками-діями на кшталт *Entscheidung* двозначності зазвичай немає: *die Entscheidung des Ministers* — рішення, яке ухвалив він.

## Практика

> [!quiz] «Obwohl es regnet, gehen wir spazieren.» → Nominalstil
> level: B2 · type: single · id: de-b2-nominalisierung-q02
> - [x] Trotz des Regens gehen wir spazieren.
> - [ ] Wegen des Regens gehen wir spazieren.
> - [ ] Bei Regen gehen wir spazieren.
> - [ ] Dank des Regens gehen wir spazieren.
>
> **Пояснення:** *obwohl* → **trotz** + Genitiv. *Wegen* вказує причину, *bei Regen* — умову («коли йде дощ»), *dank* — позитивну причину.

> [!quiz] «Wenn es regnet, fällt das Fest aus.» → Nominalstil
> level: B2 · type: single · id: de-b2-nominalisierung-q03
> - [x] Bei Regen fällt das Fest aus.
> - [ ] Trotz Regen fällt das Fest aus.
> - [ ] Nach Regen fällt das Fest aus.
> - [ ] Mit Regen fällt das Fest aus.
>
> **Пояснення:** умова *wenn* → **bei** + іменник (*bei Regen*, без артикля). *Trotz* означало б «незважаючи на дощ», *nach* — «після».

> [!quiz] «Nachdem er angekommen war, rief er an.» → Nominalstil
> level: B2 · type: single · id: de-b2-nominalisierung-q04
> - [x] Nach seiner Ankunft rief er an.
> - [ ] Vor seiner Ankunft rief er an.
> - [ ] Seit seiner Ankunft rief er an.
> - [ ] Nach seine Ankunft rief er an.
>
> **Пояснення:** *nachdem* → **nach** + Dativ (*seiner Ankunft*). *Vor* означало б «до приїзду», *seit* — «від часу приїзду». *Nach seine* — хибний відмінок.

> [!quiz] «Dass die Preise gestiegen sind, ärgert viele.» → Nominalstil
> level: B2 · type: single · id: de-b2-nominalisierung-q05
> - [x] Der Anstieg der Preise ärgert viele.
> - [ ] Der Anstieg die Preise ärgert viele.
> - [ ] Die Anstieg der Preise ärgert viele.
> - [ ] Der Anstieg den Preisen ärgert viele.
>
> **Пояснення:** *der Anstieg* — чоловічого роду; підмет *die Preise* переходить у Genitiv (*der Preise*) після іменника.

> [!quiz] «Wenn man fährt, soll man nicht telefonieren.» → субстантивований інфінітив
> level: B2 · type: single · id: de-b2-nominalisierung-q06
> - [x] Beim Fahren soll man nicht telefonieren.
> - [ ] Beim fahren soll man nicht telefonieren.
> - [ ] Bei Fahren soll man nicht telefonieren.
> - [ ] Beim Fahrt soll man nicht telefonieren.
>
> **Пояснення:** *bei dem* = *beim* + іменник із великої (*Fahren*). Малою літерою — помилка правопису, *bei Fahren* без артикля — хибне, а *Fahrt* жіночого роду (*bei der Fahrt*).

> [!quiz] Який рід мають усі іменники із суфіксом *-ung* (від дієслів)?
> level: B2 · type: single · id: de-b2-nominalisierung-q07
> - [x] die
> - [ ] der
> - [ ] das
> - [ ] залежить від слова
>
> **Пояснення:** усі іменники із суфіксом **-ung** жіночого роду: *die Entscheidung, die Lieferung, die Verbesserung*. Рід решти способів номіналізації (*der Anstieg*, *das Ergebnis*, *die Zunahme*) треба вчити окремо.

> [!quiz] Які пари «підрядне — прийменник» правильні?
> level: B2 · type: multi · id: de-b2-nominalisierung-q08
> - [x] weil → wegen (+ Gen)
> - [x] obwohl → trotz (+ Gen)
> - [ ] wenn (умова) → trotz
> - [x] indem → durch (+ Akk)
> - [ ] bevor → nach (+ Dat)
>
> **Пояснення:** *wenn* (умова) → *bei*, а не *trotz*; *bevor* → *vor*, а *nach* відповідає *nachdem*.

> [!quiz] Які речення написані в Nominalstil?
> level: B2 · type: multi · id: de-b2-nominalisierung-q09
> - [x] Wegen der Verspätung fiel das Treffen aus.
> - [ ] Weil der Zug Verspätung hatte, fiel das Treffen aus.
> - [x] Nach der Ankunft rief er an.
> - [ ] Nachdem er angekommen war, rief er an.
> - [x] Beim Fahren darf man nicht telefonieren.
>
> **Пояснення:** Nominalstil — іменник замість підрядного: *Verspätung*, *Ankunft*, *Fahren*. Речення з *weil* та *nachdem* — Verbalstil.

> [!quiz] Заміни підрядне на прийменник + іменник
> level: B2 · type: fill · id: de-b2-nominalisierung-q10
>
> ```text fill
> Weil er krank war → [[Wegen|Aufgrund]] seiner Krankheit
> Obwohl es regnet → [[Trotz]] des Regens
> Wenn es regnet → [[Bei]] Regen
> Nachdem er angekommen war → [[Nach]] seiner Ankunft
> ```
>
> **Пояснення:** причина — *wegen / aufgrund* + Genitiv; поступка — *trotz* + Genitiv; умова — *bei*; час «після» — *nach* + Dativ.

> [!quiz] Заповни пропуски: Genitiv і прийменники
> level: B2 · type: fill · id: de-b2-nominalisierung-q11
>
> ```text fill
> Der Anstieg [[der]] Preise ärgert viele.
> Die Erhöhung [[der]] Steuern wurde beschlossen.
> Die Teilnahme [[an]] dem Kurs ist freiwillig.
> Die Entscheidung [[des]] Ministers überraschte alle.
> ```
>
> **Пояснення:** після іменника-дії — Genitiv: *der Preise* (мн.), *der Steuern* (мн.), *des Ministers* (чол. однина). *Teilnahme* керує прийменником **an** + Dativ.

> [!quiz] Утвори іменник від дієслова
> level: B2 · type: fill · id: de-b2-nominalisierung-q12
>
> ```text fill
> entscheiden → die [[Entscheidung]]
> ansteigen → der [[Anstieg]]
> sich verbessern → die [[Verbesserung]]
> zunehmen → die [[Zunahme]]
> ```
>
> **Пояснення:** *-ung*: Entscheidung, Verbesserung; корінь без суфікса: Anstieg; *-e*: Zunahme.

> [!quiz] Склади речення: «Через зростання цін менше людей робить покупки»
> level: B2 · type: order · id: de-b2-nominalisierung-q13
>
> ```text order
> Wegen
> des
> Anstiegs
> der
> Preise
> kaufen
> weniger
> Menschen
> ein.
> Weil ✗
> ```
>
> **Пояснення:** *wegen* + Genitiv (*des Anstiegs der Preise*); далі дієслово *kaufen … ein* (відокремлюване) на 2-му місці групи. *Weil* вимагало б підрядного.

> [!quiz] Склади речення: «Після прибуття він одразу зателефонував»
> level: B2 · type: order · id: de-b2-nominalisierung-q14
>
> ```text order
> Nach
> seiner
> Ankunft
> rief
> er
> sofort
> an.
> Nachdem ✗
> ```
>
> **Пояснення:** *nach* + Dativ (*seiner Ankunft*). *Nachdem* — сполучник, потребує підрядного речення.

> [!quiz] Склади речення: «Під час їзди не слід телефонувати»
> level: B2 · type: order · id: de-b2-nominalisierung-q15
>
> ```text order
> Beim
> Fahren
> soll
> man
> nicht
> telefonieren.
> fahren ✗
> ```
>
> **Пояснення:** *beim* + іменник із великої (*Fahren*). Малою літерою *fahren* — помилка.

> [!quiz] Яке твердження про Nominalstil правильне?
> level: B2 · type: single · id: de-b2-nominalisierung-q16
> - [x] Він типовий для газет, наукових і офіційних текстів і стискає інформацію.
> - [ ] Він обовʼязковий у кожному письмовому тексті.
> - [ ] Його вживають лише в усній мові.
> - [ ] Він завжди простіший за Verbalstil.
>
> **Пояснення:** Nominalstil — це регістр: він ущільнює текст, але ускладнює його, тому в особистих листах і розмові частіше Verbalstil.

## Фішки

> [!reel] 🐮 Слово-закон
> У землі Мекленбург-Передня Померанія був закон із назвою *Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz* — про передачу завдань із нагляду за маркуванням яловичини. Законопроєкт внесли 1999 року, закон ухвалили в січні 2000-го, а 2013 року скасували. Слово — крайній приклад стилю, перевантаженого іменниками, і лишилося радше курйозом.

> [!reel] 🍽️ Nach dem Essen sollst du ruhn
> Німецьке прислівʼя радить: *Nach dem Essen sollst du ruhn oder tausend Schritte tun* — «після їжі відпочивай або пройди тисячу кроків». Тут і субстантивований інфінітив *das Essen*, і Nominalstil: «nach dem Essen» замінює ціле речення *nachdem man gegessen hat*.

> [!reel] 📰 Заголовки — король Nominalstil
> Газетні заголовки зазвичай без дієслів: *Anstieg der Mieten*, *Rückgang der Arbeitslosigkeit*, *Streit um die Rente*. Читач бачить подію, а не процес. Прочитавши за один день десять заголовків, ти повторюєш десять іменників із цієї теми.

## Джерела та що почитати

- [DWDS — Nominalstil](https://www.dwds.de/wb/Nominalstil) — визначення, ознаки й приклади.
- [DWDS — Verbalstil](https://www.dwds.de/wb/Verbalstil) — протилежний тип стилю.
- [Duden — Nominalstil](https://www.duden.de/rechtschreibung/Nominalstil) — коротке визначення.
- [Wikipedia — Nominalstil](https://de.wikipedia.org/wiki/Nominalstil) — огляд: ознаки, перевага й недоліки.
- [Wikipedia — Nominalisierung](https://de.wikipedia.org/wiki/Nominalisierung) — способи утворення іменників з дієслів.
- [Wikipedia — Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz](https://de.wikipedia.org/wiki/Rindfleischetikettierungs%C3%BCberwachungsaufgaben%C3%BCbertragungsgesetz) — закон Мекленбург-Передньої Померанії (1999–2013).
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділ про Nominalisierung.

> [!important] Підсумок
> - Verbalstil — дієслова й підрядні; Nominalstil — іменники й прийменники; обидва потрібні на B2.
> - Дієслово → іменник: *-ung* (*die Entscheidung*), корінь (*der Anstieg*), *-e* (*die Zunahme*); підмет → Genitiv: *der Anstieg der Preise*.
> - Сполучник → прийменник: *weil → wegen (+ Gen), obwohl → trotz (+ Gen), wenn → bei, nachdem → nach, bevor → vor, indem → durch*.
> - Інфінітив → іменник: *beim Fahren, nach dem Essen, zum Lernen* — з великої літери.
> - Усі іменники на *-ung* — *die*.
