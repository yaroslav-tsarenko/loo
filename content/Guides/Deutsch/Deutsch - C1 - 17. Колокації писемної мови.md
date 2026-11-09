---
title: Колокації писемної мови
id: de-c1-kollokationen
level: C1
icon: px:link
tags: [deutsch, c1, vocabulary, kollokationen, schriftsprache, stil]
prerequisites: ["[[Deutsch - B2 - 23. Сполуки іменника з дієсловом I — Funktionsverbgefüge]]", "[[Deutsch - C1 - 03. Сполуки іменника з дієсловом II]]"]
estimatedMinutes: 55
---

# Колокації писемної мови

> [!success] Після цієї теми ти зможеш
> - уживати близько 50 типових сполук писемної мови: *Bedenken äußern, eine Frage aufwerfen, Schlüsse ziehen, Aufsehen erregen, Klarheit schaffen*;
> - обирати правильне дієслово до іменника: *einen Gewinn **erzielen***, а не розмовне *machen*; *ein Risiko **eingehen***, а не ~~nehmen~~;
> - поєднувати прикметник з іменником і прислівник з дієсловом так, як пишуть у пресі: *ein triftiger Grund, weitreichende Folgen, drastisch senken, eng zusammenarbeiten*;
> - знаходити колокації самостійно у словнику й корпусі (DWDS-Wortprofil).

## Передбач

> [!quiz] Як німецькою сказати «фірма отримала великий прибуток» у звіті?
> level: C1 · type: single · id: de-c1-kollokationen-q01
> - [ ] Die Firma hat einen hohen Gewinn gemacht.
> - [x] Die Firma hat einen hohen Gewinn erzielt.
> - [ ] Die Firma hat einen hohen Gewinn bekommen.
> - [ ] Die Firma hat einen hohen Gewinn genommen.
>
> **Пояснення:** типова писемна колокація — ***einen Gewinn erzielen***. *Gewinn machen* у розмові трапляється й зрозуміле, але у звіті чи статті звучить буденно. *Bekommen* і *nehmen* у значенні «прибуток» не поєднуються (*einen Gewinn bekommen* можливе лише про виграш чи премію). Колокації не виводяться логічно з українського «отримати» — їх треба вивчити як пари.

## Пояснення

### Що таке колокація

*Die Kollokation* — звична, стала сполука слів, у якій одне слово «вибирає» інше. Значення сполуки зрозуміле з частин (на відміну від ідіоми з [[Deutsch - C1 - 13. Фразеологізми — тіло, тварини, кольори, їжа]]), але вибір слова **не вільний**: німці кажуть *Schlüsse ziehen*, а не ~~Schlüsse machen~~, хоч граматично помилки немає.

Колокація відрізняється й від *Funktionsverbgefüge* ([[Deutsch - B2 - 23. Сполуки іменника з дієсловом I — Funktionsverbgefüge]], [[Deutsch - C1 - 03. Сполуки іменника з дієсловом II]]): там дієслово майже втрачає значення (*zur Verfügung stellen* = *bereitstellen*), а в колокації дієслово зберігає своє значення, просто воно — *саме те*, якого очікує носій мови (*ein Risiko eingehen* — «піти на ризик»).

| Тип | Як побудована | Приклади |
|---|---|---|
| дієслово + іменник | іменник «вибирає» дієслово | *Bedenken äußern, Aufsehen erregen, Schlüsse ziehen* |
| прикметник + іменник | іменник «вибирає» означення | *ein triftiger Grund, weitreichende Folgen, rege Beteiligung* |
| прислівник + дієслово | дієслово «вибирає» підсилення | *drastisch senken, eng zusammenarbeiten, zutiefst bedauern* |

> [!diagram] Як шукати колокацію
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "1. Ядро", text: "іменник", note: "Gewinn, Risiko, Kritik", tone: yellow }
>   - { id: b, label: "2. Партнер", text: "дієслово або прикметник", note: "erzielen? machen? eingehen?", tone: pink }
>   - { id: c, label: "3. Перевірка", text: "DWDS-Wortprofil", note: "найчастіші сполуки в корпусі", tone: gray }
>   - { id: d, label: "4. Вивчити парою", text: "einen Gewinn erzielen", note: "як одне слово", tone: yellow }
> edges:
>   - { from: a, to: b }
>   - { from: b, to: c }
>   - { from: c, to: d }
> steps:
>   - { focus: a, note: "Колокацію шукають від іменника: саме він визначає, яке дієслово чи прикметник можливі." }
>   - { focus: b, note: "Українське «отримати прибуток» підказує bekommen, але німецький іменник Gewinn «хоче» erzielen. Не перекладай дієслово окремо." }
>   - { focus: c, note: "DWDS-Wortprofil показує найчастіші партнери слова в корпусі: для Gewinn — erzielen, machen, steigern, ausweisen." }
>   - { focus: d, note: "Записуй і вчи всю пару з відмінком: einen Gewinn erzielen, Vorwürfe erheben gegen + Akk, Schlüsse ziehen aus + Dat." }
> ```

### Головні дієслова колокацій

Кілька дієслів утворюють десятки колокацій. Якщо знаєш «характер» дієслова, вгадати пару легше.

> [!diagram] Дієслова з «характером»
> ```yaml
> layout: compare
> columns: { v: "дієслово", s: "сенс", e: "приклади" }
> nodes:
>   - { id: v1, col: v, label: "ziehen", text: "вивести, отримати з чогось", tone: yellow }
>   - { id: s1, col: s, label: "ziehen", text: "результат міркування", tone: gray }
>   - { id: e1, col: e, label: "ziehen", text: "Schlüsse, Konsequenzen, einen Vergleich", tone: pink }
>   - { id: v2, col: v, label: "erzielen", text: "досягти результату", tone: yellow }
>   - { id: s2, col: s, label: "erzielen", text: "вимірний успіх", tone: gray }
>   - { id: e2, col: e, label: "erzielen", text: "einen Gewinn, eine Einigung, Erfolge", tone: pink }
>   - { id: v3, col: v, label: "schaffen", text: "створити (стан)", tone: yellow }
>   - { id: s3, col: s, label: "schaffen", text: "нові умови", tone: gray }
>   - { id: e3, col: e, label: "schaffen", text: "Klarheit, Voraussetzungen, Abhilfe", tone: pink }
>   - { id: v4, col: v, label: "erregen / wecken", text: "викликати (реакцію)", tone: yellow }
>   - { id: s4, col: s, label: "erregen / wecken", text: "емоція, увага", tone: gray }
>   - { id: e4, col: e, label: "erregen / wecken", text: "Aufsehen erregen, Interesse wecken", tone: pink }
> steps:
>   - { focus: [v1, s1, e1], note: "ziehen — коли з чогось виводять висновок: Schlüsse ziehen aus + Dat, Konsequenzen ziehen, einen Vergleich ziehen. Памʼятай і Bilanz ziehen (B2)." }
>   - { focus: [v2, s2, e2], note: "erzielen — досягти вимірного результату: einen Gewinn, eine Einigung, gute Ergebnisse erzielen." }
>   - { focus: [v3, s3, e3], note: "schaffen (schuf, geschaffen) — створити новий стан: Klarheit, Voraussetzungen, Abhilfe schaffen (Abhilfe — B2)." }
>   - { focus: [v4, s4, e4], note: "erregen і wecken — викликати реакцію: Aufsehen, Aufmerksamkeit erregen; Interesse, Erwartungen wecken." }
> ```
> Жовтий — дієслово, сірий — його сенс, рожевий — типові іменники. Кожен блок має мітку.

Памʼятай уже вивчені з B2: *Kritik üben, Bilanz ziehen, Maßnahmen ergreifen, eine Entscheidung treffen, Wert legen auf*. Тут їх лише вживаємо в прикладах; нові колокації — нижче.

## Приклади

- *Mehrere Experten **äußerten Bedenken** gegen den Plan.* — Кілька експертів висловили застереження щодо плану.
- *Die Studie **wirft** neue **Fragen auf**.* — Дослідження порушує нові питання.
- *Aus den Zahlen lassen sich zwei **Schlüsse ziehen**.* — З цих цифр можна зробити два висновки.
- *Die Ministerin **zog** die **Konsequenzen** und trat zurück.* — Міністерка зробила висновки й пішла у відставку.
- *Die Opposition **erhebt** schwere **Vorwürfe gegen** die Regierung.* — Опозиція висуває серйозні звинувачення проти уряду.
- *Wer gründet, muss ein **Risiko eingehen**.* — Хто засновує фірму, мусить піти на ризик.
- *Der Konzern **erzielte** einen **Gewinn** von zwei Milliarden Euro.* — Концерн отримав прибуток у два мільярди євро.
- *Der Fall **erregte** großes **Aufsehen**.* — Справа викликала великий резонанс.
- *Das Gericht soll endlich **Klarheit schaffen**.* — Суд має нарешті внести ясність.
- *Für die Absage gibt es einen **triftigen Grund**.* — Для відмови є вагома причина.
- *Die Entscheidung hat **weitreichende Folgen**.* — Рішення має далекосяжні наслідки.
- *Die Stadt will den Energieverbrauch **drastisch senken**.* — Місто хоче різко скоротити споживання енергії.
- *Die beiden Institute **arbeiten eng zusammen**.* — Обидва інститути тісно співпрацюють.
- *Wir **bedauern zutiefst**, was geschehen ist.* — Ми глибоко шкодуємо про те, що сталося.

## Слова

### Думка, сумнів, питання

> [!word] Bedenken äußern
> ipa: /bəˈdɛŋkn̩ ˈɔʏ̯sɐn/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w01
> uk: висловлювати застереження, сумніви
> example: Der Datenschutzbeauftragte **äußerte Bedenken** gegen die App. — Уповноважений із захисту даних висловив застереження щодо застосунку.
> note: gegen + Akk / zu + Dat. Die Bedenken — зазвичай множина (die Bedenken, das Bedenken). Синонім: Bedenken anmelden, Bedenken haben.

> [!word] Zweifel hegen
> ipa: /ˈtsvaɪ̯fl̩ ˈheːɡn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w02
> uk: мати (плекати) сумніви
> example: An seiner Ehrlichkeit **hege** ich keine **Zweifel**. — У його чесності я не маю сумнівів.
> note: книжне; an + Dat. hegen → hegte → hat gehegt. Також: Hoffnungen, einen Verdacht, Groll hegen. Пор. in Zweifel ziehen (C1-03).

> [!word] einen Vorschlag unterbreiten
> ipa: /ˈaɪ̯nən ˈfoːɐ̯ʃlaːk ʊntɐˈbʁaɪ̯tn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w03
> uk: внести, подати пропозицію
> example: Die Kommission hat einen neuen **Vorschlag unterbreitet**. — Комісія внесла нову пропозицію.
> note: офіційне; unterbreiten — невідокремлюване, наголос на -brei-: Wir unterbreiten Ihnen ein Angebot. Нейтрально: einen Vorschlag machen.

> [!word] eine Frage aufwerfen
> ipa: /ˈaɪ̯nə ˈfʁaːɡə ˈaʊ̯fvɛʁfn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w04
> uk: порушувати питання
> example: Der Fall **wirft** grundsätzliche **Fragen auf**. — Справа порушує принципові питання.
> note: підмет часто — подія чи текст. werfen → warf → hat geworfen; відокремлюване. Пор. eine Frage stellen (B2) — поставити питання комусь.

> [!word] einen Vergleich ziehen
> ipa: /ˈaɪ̯nən fɛɐ̯ˈɡlaɪ̯ç ˈtsiːən/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w05
> uk: провести порівняння
> example: Der Autor **zieht** einen **Vergleich** zwischen beiden Epochen. — Автор проводить порівняння двох епох.
> note: zwischen + Dat. Ще: einen Vergleich anstellen. ziehen → zog → hat gezogen.

> [!word] Schlüsse ziehen aus (+ Dat)
> ipa: /ˈʃlʏsə ˈtsiːən aʊ̯s/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w06
> uk: робити висновки з
> example: Welche **Schlüsse ziehen** Sie **aus** der Studie? — Які висновки ви робите з дослідження?
> note: der Schluss, die Schlüsse. Не ~~Schlüsse machen~~. Пор. Schluss machen (B2) — покінчити, розійтися.

> [!word] Konsequenzen ziehen
> ipa: /kɔnzeˈkvɛntsn̩ ˈtsiːən/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w07
> uk: зробити висновки (і діяти); понести відповідальність
> example: Nach dem Skandal **zog** der Vorstand die **Konsequenzen**. — Після скандалу правління зробило висновки.
> note: часто про відставку: die Konsequenzen ziehen und zurücktreten. Також: Konsequenzen haben — мати наслідки.

> [!word] eine Debatte auslösen
> ipa: /ˈaɪ̯nə deˈbatə ˈaʊ̯sløːzn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w08
> uk: спричинити дискусію
> example: Das Interview **löste** eine heftige **Debatte aus**. — Інтервʼю спричинило бурхливу дискусію.
> note: auslösen — запустити, спричинити: eine Krise, einen Alarm auslösen. Відокремлюване.

> [!word] Vorwürfe erheben gegen (+ Akk)
> ipa: /ˈfoːɐ̯vʏʁfə ɛɐ̯ˈheːbn̩ ˈɡeːɡn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w09
> uk: висувати звинувачення проти
> example: Die Gewerkschaft **erhebt** schwere **Vorwürfe gegen** die Firma. — Профспілка висуває серйозні звинувачення проти фірми.
> note: der Vorwurf (B2). Нейтрально: jemandem etwas vorwerfen. Пор. Anspruch erheben (B2) — той самий дієслівний партнер.

### Рішення й дії

> [!word] ein Risiko eingehen
> ipa: /aɪ̯n ˈʁiːziko ˈaɪ̯nɡeːən/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w10
> uk: іти на ризик
> example: Wir wollen kein unnötiges **Risiko eingehen**. — Ми не хочемо йти на зайвий ризик.
> note: eingehen → ging ein → ist eingegangen (sein!). Не ~~ein Risiko nehmen~~ (калька з англ.). Так само: einen Kompromiss, eine Verpflichtung eingehen.

> [!word] einen Kompromiss schließen
> ipa: /ˈaɪ̯nən kɔmpʁoˈmɪs ˈʃliːsn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w11
> uk: укласти компроміс
> example: Nach langen Verhandlungen **schlossen** beide Seiten einen **Kompromiss**. — Після довгих переговорів обидві сторони уклали компроміс.
> note: також einen Kompromiss eingehen / finden. Не ~~einen Kompromiss machen~~ у писемному тексті. schließen → schloss → hat geschlossen.

> [!word] die Initiative ergreifen
> ipa: /diː initsi̯aˈtiːvə ɛɐ̯ˈɡʁaɪ̯fn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w12
> uk: виявити ініціативу; взяти ініціативу у свої руки
> example: Die Schülerinnen **ergriffen** die **Initiative** und gründeten einen Verein. — Учениці виявили ініціативу й заснували товариство.
> note: ergreifen → ergriff → hat ergriffen. Пор. Maßnahmen ergreifen (B2).

> [!word] das Wort ergreifen
> ipa: /das vɔʁt ɛɐ̯ˈɡʁaɪ̯fn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w13
> uk: узяти слово; виступити
> example: Am Ende der Sitzung **ergriff** die Bürgermeisterin **das Wort**. — Наприкінці засідання слово взяла мерка.
> note: книжне, у звітах про засідання. Модератор: jemandem das Wort erteilen — надати слово.

> [!word] Anstrengungen unternehmen
> ipa: /ˈanʃtʁɛŋʊŋən ʊntɐˈneːmən/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w14
> uk: докладати зусиль
> example: Die Regierung **unternimmt** große **Anstrengungen**, um Fachkräfte zu gewinnen. — Уряд докладає великих зусиль, щоб залучити фахівців.
> note: невідокремлюване, наголос на -neh-. Також: einen Versuch unternehmen. Нейтрально: sich anstrengen.

> [!word] Schritte einleiten
> ipa: /ˈʃʁɪtə ˈaɪ̯nlaɪ̯tn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w15
> uk: ужити заходів; розпочати кроки
> example: Die Firma hat rechtliche **Schritte eingeleitet**. — Фірма звернулася до суду (розпочала юридичні кроки).
> note: rechtliche Schritte einleiten — сталий юридичний вираз. Також: ein Verfahren einleiten. Дієслово einleiten — B2.

> [!word] eine Frist einhalten
> ipa: /ˈaɪ̯nə fʁɪst ˈaɪ̯nhaltn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w16
> uk: дотримуватися терміну
> example: Bitte **halten** Sie die **Frist** unbedingt **ein**. — Будь ласка, неодмінно дотримайтеся терміну.
> note: протилежне: eine Frist versäumen / verstreichen lassen. Іменник die Einhaltung (C1-02).

> [!word] ein Versprechen brechen
> ipa: /aɪ̯n fɛɐ̯ˈʃpʁɛçn̩ ˈbʁɛçn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w17
> uk: порушити обіцянку
> example: Die Partei hat ihr **Versprechen gebrochen**. — Партія порушила свою обіцянку.
> note: протилежне: ein Versprechen halten / einlösen. brechen → brach → hat gebrochen; er bricht.

> [!word] Bedingungen stellen
> ipa: /bəˈdɪŋʊŋən ˈʃtɛlən/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w18
> uk: висувати умови
> example: Der Investor **stellt** klare **Bedingungen**. — Інвестор висуває чіткі умови.
> note: так само: Forderungen, Ansprüche stellen. Bedingungen erfüllen — виконати умови.

> [!word] Aufgaben wahrnehmen
> ipa: /ˈaʊ̯fɡaːbn̩ ˈvaːɐ̯neːmən/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w19
> uk: виконувати обовʼязки, завдання (офіційно)
> example: Während ihres Urlaubs **nimmt** Herr Lenz ihre **Aufgaben wahr**. — Під час її відпустки її обовʼязки виконує пан Ленц.
> note: Amtsdeutsch. wahrnehmen також «сприймати» і «скористатися» (einen Termin wahrnehmen, B1). Відокремлюване.

### Результат і наслідки

> [!word] einen Gewinn erzielen
> ipa: /ˈaɪ̯nən ɡəˈvɪn ɛɐ̯ˈtsiːlən/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w20
> uk: отримати прибуток
> example: Das Unternehmen **erzielte** einen **Gewinn** von zwei Milliarden Euro. — Підприємство отримало прибуток у два мільярди євро.
> note: erzielen — досягти результату. Також: Erfolge, Ergebnisse, Fortschritte erzielen. Розмовно: Gewinn machen.

> [!word] eine Einigung erzielen
> ipa: /ˈaɪ̯nə ˈaɪ̯nɪɡʊŋ ɛɐ̯ˈtsiːlən/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w21
> uk: досягти згоди
> example: Bund und Länder haben eine **Einigung erzielt**. — Федерація й землі дійшли згоди.
> note: часта формула новин. Ще: einen Konsens erzielen. die Einigung — C1-15.

> [!word] Kosten verursachen
> ipa: /ˈkɔstn̩ fɛɐ̯ˈʔuːɐ̯zaxn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w22
> uk: спричиняти витрати
> example: Die Verzögerung **verursacht** zusätzliche **Kosten**. — Затримка спричиняє додаткові витрати.
> note: verursachen — бути причиною (die Ursache, B1): Probleme, einen Unfall verursachen. Kosten — лише множина.

> [!word] Schaden anrichten
> ipa: /ˈʃaːdn̩ ˈanʁɪçtn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w23
> uk: завдати шкоди
> example: Der Sturm hat großen **Schaden angerichtet**. — Буря завдала великої шкоди.
> note: anrichten — переважно про шкоду й безлад: Chaos, Unheil anrichten. У кухні: Salat anrichten — подавати страву.

> [!word] Aufsehen erregen
> ipa: /ˈaʊ̯fzeːən ɛɐ̯ˈʁeːɡn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w24
> uk: викликати резонанс, сенсацію
> example: Der Prozess **erregte** bundesweit **Aufsehen**. — Процес викликав резонанс по всій країні.
> note: das Aufsehen — без множини. Прикметник: aufsehenerregend. Також: Aufmerksamkeit, Anstoß, Verdacht erregen.

> [!word] Interesse wecken
> ipa: /ɪntəˈʁɛsə ˈvɛkn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w25
> uk: викликати (пробуджувати) інтерес
> example: Der Vortrag hat mein **Interesse** an Geschichte **geweckt**. — Доповідь пробудила мій інтерес до історії.
> note: an + Dat. wecken — будити. Також: Erwartungen, Hoffnungen, Erinnerungen wecken.

> [!word] Erwartungen erfüllen
> ipa: /ɛɐ̯ˈvaʁtʊŋən ɛɐ̯ˈfʏlən/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w26
> uk: виправдати сподівання
> example: Das neue Modell hat die **Erwartungen** nicht **erfüllt**. — Нова модель не виправдала сподівань.
> note: протилежне: Erwartungen enttäuschen. Ще: die Erwartungen übertreffen — перевершити. Пор. in Erfüllung gehen (B2).

> [!word] Voraussetzungen schaffen
> ipa: /foˈʁaʊ̯szɛtsʊŋən ˈʃafn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w27
> uk: створити передумови
> example: Das Gesetz **schafft** die **Voraussetzungen** für mehr Windkraft. — Закон створює передумови для розвитку вітроенергетики.
> note: schaffen → schuf → hat geschaffen (створити). У значенні «встигнути, впоратися» — правильне: schaffte, hat geschafft.

> [!word] Klarheit schaffen
> ipa: /ˈklaːɐ̯haɪ̯t ˈʃafn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w28
> uk: внести ясність
> example: Ein Gutachten soll **Klarheit schaffen**. — Експертиза має внести ясність.
> note: також: Ordnung, Platz, Abhilfe (B2) schaffen. über + Akk: Klarheit über die Kosten.

> [!word] den Eindruck erwecken
> ipa: /deːn ˈaɪ̯ndʁʊk ɛɐ̯ˈvɛkn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w29
> uk: створювати враження
> example: Die Werbung **erweckt den Eindruck**, das Produkt sei gesund. — Реклама створює враження, ніби продукт корисний.
> note: часто з Konjunktiv I або dass: den Eindruck erwecken, als ob … Не ~~den Eindruck machen~~ у цьому значенні (einen guten Eindruck machen — справити добре враження).

> [!word] eine Lücke schließen
> ipa: /ˈaɪ̯nə ˈlʏkə ˈʃliːsn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w30
> uk: заповнити прогалину
> example: Das neue Programm soll eine **Lücke** im Angebot **schließen**. — Нова програма має заповнити прогалину в пропозиції.
> note: die Lücke — B1. Пор. eine Forschungslücke schließen (C1-14).

### Значення й статус

> [!word] eine Rolle spielen
> ipa: /ˈaɪ̯nə ˈʁɔlə ˈʃpiːlən/ · pos: phrase · level: B2 · id: de-c1-kollokationen-w31
> uk: відігравати роль; мати значення
> example: Der Preis **spielt** für viele Kunden **eine** große **Rolle**. — Ціна для багатьох клієнтів має велике значення.
> note: часто із запереченням: Das spielt keine Rolle — це не має значення. Не ~~eine Rolle haben~~.

> [!word] einen hohen Stellenwert haben
> ipa: /ˈaɪ̯nən ˈhoːən ˈʃtɛlənveːɐ̯t ˈhaːbn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w32
> uk: мати велике значення; посідати важливе місце
> example: Bildung **hat** in unserer Familie **einen hohen Stellenwert**. — Освіта в нашій родині посідає важливе місце.
> note: der Stellenwert — книжне. Також: an Stellenwert gewinnen / verlieren.

> [!word] Maßstäbe setzen
> ipa: /ˈmaːsʃtɛːbə ˈzɛtsn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w33
> uk: задавати стандарти; бути взірцем
> example: Mit diesem Gebäude **setzt** die Stadt neue **Maßstäbe**. — Цією будівлею місто задає нові стандарти.
> note: der Maßstab — масштаб, мірило. CH: Massstäbe. Також: einen strengen Maßstab anlegen — суворо оцінювати.

> [!word] Gefahr laufen (+ zu)
> ipa: /ɡəˈfaːɐ̯ ˈlaʊ̯fn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w34
> uk: ризикувати (чимось поганим)
> example: Wer zu spät reagiert, **läuft Gefahr**, Kunden zu verlieren. — Хто запізно реагує, ризикує втратити клієнтів.
> note: книжне; лише з інфінітивом із zu. laufen → lief → ist gelaufen. Пор. in Gefahr geraten (B2).

> [!word] Erfahrungen sammeln
> ipa: /ɛɐ̯ˈfaːʁʊŋən ˈzaml̩n/ · pos: phrase · level: B2 · id: de-c1-kollokationen-w35
> uk: набиратися досвіду
> example: Im Praktikum hat sie wertvolle **Erfahrungen gesammelt**. — На практиці вона набула цінного досвіду.
> note: стандарт у резюме й мотиваційному листі. Також: Erfahrungen machen (mit + Dat). Не ~~Erfahrungen bekommen~~.

### Прикметник + іменник

> [!word] ein triftiger Grund
> ipa: /aɪ̯n ˈtʁɪftɪɡɐ ɡʁʊnt/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w36
> uk: вагома (поважна) причина
> example: Ohne **triftigen Grund** darf der Vermieter nicht kündigen. — Без поважної причини орендодавець не може розірвати договір.
> note: triftig вживається майже лише з Grund, Argument. ig між голосними: [-ɪɡɐ].

> [!word] eine eingehende Prüfung
> ipa: /ˈaɪ̯nə ˈaɪ̯nɡeːəndə ˈpʁyːfʊŋ/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w37
> uk: ретельна перевірка
> example: Nach **eingehender Prüfung** müssen wir Ihren Antrag leider ablehnen. — Після ретельної перевірки, на жаль, мусимо відхилити вашу заяву.
> note: eingehend — детальний, ретельний: etwas eingehend prüfen, besprechen. Типово для офіційних відмов.

> [!word] eine rege Beteiligung
> ipa: /ˈaɪ̯nə ˈʁeːɡə bəˈtaɪ̯lɪɡʊŋ/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w38
> uk: жвава, активна участь
> example: Wir danken für die **rege Beteiligung** an der Umfrage. — Дякуємо за активну участь в опитуванні.
> note: rege — жвавий: reges Interesse, ein reger Austausch. Протилежне: eine geringe Beteiligung.

> [!word] weitreichende Folgen
> ipa: /ˈvaɪ̯tʁaɪ̯çəndə ˈfɔlɡn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w39
> uk: далекосяжні наслідки
> example: Das Urteil hat **weitreichende Folgen** für Mieter. — Вирок має далекосяжні наслідки для орендарів.
> note: також weit reichend. Пара: weitreichende Entscheidungen, Befugnisse. Пор. zur Folge haben (C1-03).

> [!word] ein schwerwiegender Fehler
> ipa: /aɪ̯n ˈʃveːɐ̯viːɡəndɐ ˈfeːlɐ/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w40
> uk: серйозна (тяжка) помилка
> example: Die Klinik hat einen **schwerwiegenden Fehler** eingeräumt. — Клініка визнала серйозну помилку.
> note: schwerwiegend — також schwerwiegende Gründe, Bedenken. Розмовно: ein großer Fehler.

> [!word] ein erheblicher Unterschied
> ipa: /aɪ̯n ɛɐ̯ˈheːplɪçɐ ˈʊntɐʃiːt/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w41
> uk: суттєва різниця
> example: Zwischen Stadt und Land gibt es **erhebliche Unterschiede**. — Між містом і селом є суттєві відмінності.
> note: erheblich — книжне «значний»: erhebliche Kosten, Schäden. Як прислівник: erheblich teurer.

> [!word] eine offene Frage
> ipa: /ˈaɪ̯nə ˈoːfənə ˈfʁaːɡə/ · pos: phrase · level: B2 · id: de-c1-kollokationen-w42
> uk: відкрите (нерозвʼязане) питання
> example: Wie das Projekt finanziert wird, ist noch eine **offene Frage**. — Як фінансуватимуть проєкт, — питання ще відкрите.
> note: у нарадах: offene Fragen klären. Протилежне: eine geklärte Frage.

> [!word] ein heikles Thema
> ipa: /aɪ̯n ˈhaɪ̯kləs ˈteːma/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w43
> uk: делікатна (дражлива) тема
> example: Geld ist in vielen Familien ein **heikles Thema**. — Гроші в багатьох родинах — делікатна тема.
> note: heikel втрачає e у формах: heikle Fragen, ein heikles Thema. Також: eine heikle Situation.

> [!word] eine hohe Nachfrage
> ipa: /ˈaɪ̯nə ˈhoːə ˈnaːxfʁaːɡə/ · pos: phrase · level: B2 · id: de-c1-kollokationen-w44
> uk: великий попит
> example: Wegen der **hohen Nachfrage** sind die Tickets ausverkauft. — Через великий попит квитки розпродано.
> note: Nachfrage — у фаховій мові часто hoch / gering (große Nachfrage теж цілком звичне). die Nachfrage nach + Dat. Пара: Angebot und Nachfrage.

### Прислівник + дієслово

> [!word] scharf kritisieren
> ipa: /ʃaʁf kʁitiˈziːʁən/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w45
> uk: гостро критикувати
> example: Umweltverbände **kritisieren** den Plan **scharf**. — Екологічні організації гостро критикують план.
> note: також heftig kritisieren. Номінально: scharfe Kritik üben an + Dat (Kritik üben — B2).

> [!word] drastisch senken
> ipa: /ˈdʁastɪʃ ˈzɛŋkn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w46
> uk: різко скоротити, знизити
> example: Die Firma will die Kosten **drastisch senken**. — Фірма хоче різко скоротити витрати.
> note: drastisch — також drastisch steigen, drastische Maßnahmen. Не плутай senken (знижувати щось) і sinken (знижуватися).

> [!word] grundlegend ändern
> ipa: /ˈɡʁʊntleːɡn̩t ˈɛndɐn/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w47
> uk: докорінно змінити
> example: Die Digitalisierung hat unsere Arbeit **grundlegend geändert**. — Цифровізація докорінно змінила нашу роботу.
> note: grundlegend — фундаментальний: grundlegende Reformen. Синоніми: grundsätzlich, von Grund auf.

> [!word] eng zusammenarbeiten
> ipa: /ɛŋ tsuˈzamənʔaʁbaɪ̯tn̩/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w48
> uk: тісно співпрацювати
> example: Die Polizei **arbeitet eng** mit den Behörden **zusammen**. — Поліція тісно співпрацює з органами влади.
> note: mit + Dat. Відокремлюване: arbeitet … zusammen. Не ~~nah zusammenarbeiten~~ (калька з англ. closely).

> [!word] zutiefst bedauern
> ipa: /tsuˈtiːfst bəˈdaʊ̯ɐn/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w49
> uk: глибоко шкодувати
> example: Wir **bedauern zutiefst**, dass es zu dem Fehler gekommen ist. — Ми глибоко шкодуємо, що сталася ця помилка.
> note: офіційне вибачення. zutiefst — також zutiefst erschüttert, enttäuscht.

> [!word] strikt ablehnen
> ipa: /ʃtʁɪkt ˈapleːnən/ · pos: phrase · level: C1 · id: de-c1-kollokationen-w50
> uk: категорично відкидати
> example: Der Minister **lehnt** den Vorschlag **strikt ab**. — Міністр категорично відкидає пропозицію.
> note: також entschieden / kategorisch ablehnen. strikt — суворий: strikte Regeln.

## Слухаємо

> [!listen] Що ти почув?
> level: C1 · type: choice · id: de-c1-kollokationen-l01
> audio: Der Fall hat großes Aufsehen erregt.
> - [x] Der Fall hat großes Aufsehen erregt.
> - [ ] Der Fall hat großes Aufsehen erweckt.
> - [ ] Der Fall hat großes Ansehen erregt.
>
> **Пояснення:** *Aufsehen erregen* — викликати резонанс. *Erwecken* поєднується з *Eindruck*, а *das Ansehen* — «авторитет, репутація», інше слово.

> [!listen] Що сталося в переговорах?
> level: C1 · type: answer · id: de-c1-kollokationen-l02
> audio: Nach zwölf Stunden haben die Tarifparteien eine Einigung erzielt. Beide Seiten mussten einen Kompromiss eingehen.
> - [x] Сторони дійшли згоди, і обом довелося поступитися.
> - [ ] Переговори зірвалися після дванадцяти годин.
> - [ ] Одна сторона повністю виграла.
> - [ ] Переговори перенесли на дванадцяту годину.
>
> **Пояснення:** *eine Einigung erzielen* — досягти згоди; *einen Kompromiss eingehen* — піти на компроміс, тобто кожен поступився.

> [!listen] Напиши, що почув
> level: C1 · type: dictation · id: de-c1-kollokationen-l03
> audio: Die Studie wirft neue Fragen auf.

## Вимова

> [!speak] Скажи вголос
> level: C1 · id: de-c1-kollokationen-s01
> text: Mehrere Experten äußerten Bedenken.
> ipa: /ˈmeːʁəʁə ɛksˈpɛʁtn̩ ˈɔʏ̯sɐtn̩ bəˈdɛŋkn̩/
> tip: äußerten — äu = [ɔʏ̯], ß = [s]; Experten — наголос на -per-; Bedenken — nk [ŋk].
> uk: Кілька експертів висловили застереження.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-kollokationen-s02
> text: Daraus lassen sich zwei Schlüsse ziehen.
> ipa: /daˈʁaʊ̯s ˈlasn̩ zɪç tsvaɪ̯ ˈʃlʏsə ˈtsiːən/
> tip: Schlüsse — коротке [ʏ]; zwei і ziehen — z = [ts]; ziehen — h не вимовляється, довге [iː].
> uk: З цього можна зробити два висновки.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-kollokationen-s03
> text: Wir bedauern zutiefst, was geschehen ist.
> ipa: /viːɐ̯ bəˈdaʊ̯ɐn tsuˈtiːfst vas ɡəˈʃeːən ɪst/
> tip: bedauern — au [aʊ̯], наголос на -dau-; zutiefst — наголос на -tief-, кінець [-fst].
> uk: Ми глибоко шкодуємо про те, що сталося.

## Типові помилки українців

> [!pitfall] «Робити» й «отримувати» замість точного дієслова
> ~~Schlüsse machen~~ → **Schlüsse ziehen**; ~~einen Gewinn bekommen~~ → einen Gewinn **erzielen**; ~~Erfahrungen bekommen~~ → Erfahrungen **sammeln**; ~~eine Rolle haben~~ → eine Rolle **spielen**. Українські «робити, мати, отримувати» поєднуються майже з усім, а німецький іменник вимагає свого дієслова.

> [!pitfall] Кальки з англійської
> ~~ein Risiko nehmen~~ (take a risk) → ein Risiko **eingehen**; ~~nah zusammenarbeiten~~ (work closely) → **eng** zusammenarbeiten; ~~eine Entscheidung machen~~ (make a decision) → eine Entscheidung **treffen** (B2). Якщо ти добре знаєш англійську, ці кальки підстерігають особливо часто.

> [!pitfall] Схожі дієслова: erregen, erwecken, wecken
> *Aufsehen, Aufmerksamkeit **erregen*** — викликати резонанс, увагу; *den Eindruck **erwecken*** — створювати враження; *Interesse, Erwartungen **wecken*** — пробуджувати. ~~den Eindruck erregen~~, ~~Aufsehen wecken~~ звучать неприродно. Учи дієслово разом з іменником.

> [!pitfall] Сильне дієслово й допоміжне
> *Voraussetzungen schaffen*: ***schuf → geschaffen*** (створити), а не ~~schaffte → geschafft~~ (встигнути). *Ein Risiko eingehen*: Perfekt із ***sein*** — *Wir **sind** ein Risiko eingegangen.* *Gefahr laufen*: *Er **ist** Gefahr gelaufen …* Колокація фіксує не лише слово, а й його граматику.

## Ситуація: редагування прес-релізу

> [!listen] Редакторка правит текст стажиста. Що вона змінює?
> level: C1 · type: answer · id: de-c1-kollokationen-l04
> audio: A: Hier steht: Die Firma hat einen großen Gewinn bekommen.
> audio: B: Besser: Die Firma hat einen Gewinn erzielt. Und statt „Schlüsse machen“ schreiben wir „Schlüsse ziehen“.
> - [x] Замінює дієслова на точні колокації: erzielen і ziehen.
> - [ ] Видаляє речення про прибуток.
> - [ ] Перекладає текст англійською.
> - [ ] Додає нові цифри до тексту.
>
> **Пояснення:** редакторка виправляє дієслова: *einen Gewinn erzielen* замість *bekommen*, *Schlüsse ziehen* замість *machen*. Переклад: — Тут написано: фірма отримала великий прибуток. — Краще: фірма отримала прибуток (*erzielt*). А замість «Schlüsse machen» пишемо «Schlüsse ziehen».

> [!speak] Ситуація: запропонуй правку
> level: C1 · id: de-c1-kollokationen-s04
> text: Statt „bekommen“ schreiben wir besser „erzielen“.
> ipa: /ʃtat bəˈkɔmən ˈʃʁaɪ̯bn̩ viːɐ̯ ˈbɛsɐ ɛɐ̯ˈtsiːlən/
> tip: statt — st на початку [ʃt]; schreiben — schr [ʃʁ], ei [aɪ̯]; erzielen — z [ts], наголос на -zie-.
> uk: Замість «bekommen» краще напишемо «erzielen».

## Landeskunde: Wie man Kollokationen findet

> [!example] Wörter und ihre typischen Partner
> Woher weiß man, dass man im Deutschen einen Gewinn „erzielt“ und nicht „bekommt“? Muttersprachler spüren das, ohne darüber nachzudenken. Der britische Sprachwissenschaftler John Rupert Firth formulierte 1957 den berühmten Satz, man erkenne ein Wort an der Gesellschaft, in der es auftritt. Wer Deutsch lernt, braucht dafür Hilfsmittel. Die wichtigsten stammen aus der Korpuslinguistik, also aus der Forschung mit sehr großen Textsammlungen.
>
> Ein Korpus ist eine elektronische Sammlung echter Texte: Zeitungsartikel, Bücher, Gesetzestexte, Internetseiten. Das größte Korpus der geschriebenen deutschen Gegenwartssprache ist das Deutsche Referenzkorpus, kurz DeReKo, des Leibniz-Instituts für Deutsche Sprache in Mannheim. Nach Angaben des Instituts umfasst es mehr als 55 Milliarden Wörter (Stand 2023). Niemand könnte so viel Text lesen, aber ein Computer kann darin in Sekunden zählen, welche Wörter besonders oft zusammen vorkommen.
>
> Für Lernende besonders praktisch ist das DWDS, das Digitale Wörterbuch der deutschen Sprache. Es ist ein Projekt der Berlin-Brandenburgischen Akademie der Wissenschaften und kostenlos im Internet zugänglich. Neben Bedeutung, Aussprache und Herkunft eines Wortes bietet es das sogenannte DWDS-Wortprofil. Es ist das Ergebnis einer statistischen Analyse sehr großer Korpora, vor allem von Zeitungstexten, etwa aus der Süddeutschen Zeitung, der FAZ, der Zeit und der Welt, und zeigt typische Wortverbindungen, getrennt nach grammatischen Beziehungen: Welche Verben stehen mit einem Substantiv als Objekt, welche Adjektive als Attribut? Als Maß dafür, wie eng zwei Wörter zusammengehören, verwendet das Wortprofil den Wert logDice: Je größer er ist, desto weiter oben oder desto größer erscheint der Partner. Angezeigt werden nur Verbindungen, die statistisch signifikant sind und mindestens fünfmal vorkommen. Wer zum Beispiel „Kritik“ eingibt, findet etwa Partner wie „üben“, „äußern“ und „scharf“.
>
> Wichtig ist dabei ein Grundgedanke der Korpuslinguistik: Häufigkeit ist nicht dasselbe wie Richtigkeit. Ein Wortprofil zeigt, was typisch ist, aber nicht, was verboten ist. „Gewinn machen“ ist kein Fehler, es ist nur in der Alltagssprache häufiger, während in Geschäftsberichten „einen Gewinn erzielen“ überwiegt. Deshalb lohnt es sich, auch die Beispielsätze anzusehen, denn sie zeigen, in welcher Textsorte eine Verbindung vorkommt.
>
> Auch Redaktionen, Übersetzungsbüros und Prüfungsinstitute arbeiten mit solchen Werkzeugen. Wer für TestDaF oder Goethe C1 trainiert, sollte sich daher angewöhnen, neue Substantive nie allein, sondern mit ihren typischen Partnern zu notieren: nicht nur „die Frage“, sondern „eine Frage aufwerfen“, „eine Frage klären“, „eine offene Frage“.

> [!quiz] Nach dem Text: Was ist das DeReKo?
> level: C1 · type: single · id: de-c1-kollokationen-q02
> - [ ] ein gedrucktes Wörterbuch des Duden-Verlags
> - [x] das größte Korpus der geschriebenen deutschen Gegenwartssprache
> - [ ] eine Prüfung für Deutschlernende
> - [ ] ein Projekt der Berlin-Brandenburgischen Akademie
>
> **Пояснення:** *das größte Korpus der geschriebenen deutschen Gegenwartssprache* — корпус Інституту німецької мови в Мангеймі. Проєкт Берлінсько-Бранденбурзької академії — це DWDS.

> [!quiz] Nach dem Text: Was zeigt das DWDS-Wortprofil?
> level: C1 · type: single · id: de-c1-kollokationen-q03
> - [ ] welche Wortverbindungen verboten sind
> - [x] typische Wortverbindungen, getrennt nach grammatischen Beziehungen
> - [ ] nur die Aussprache eines Wortes
> - [ ] die Übersetzung in andere Sprachen
>
> **Пояснення:** *zeigt typische Wortverbindungen, getrennt nach grammatischen Beziehungen*. Текст наголошує: профіль показує типове, *aber nicht, was verboten ist*.

> [!quiz] Was stimmt laut Text? Wähle alle richtigen Aussagen.
> level: C1 · type: multi · id: de-c1-kollokationen-q04
> - [x] „Gewinn machen“ ist kein Fehler, aber eher alltagssprachlich.
> - [x] Beispielsätze zeigen, in welcher Textsorte eine Verbindung vorkommt.
> - [ ] Häufigkeit und Richtigkeit sind dasselbe.
> - [ ] Das DWDS ist kostenpflichtig.
>
> **Пояснення:** про *Gewinn machen* і приклади речень сказано прямо. Текст навпаки підкреслює *Häufigkeit ist nicht dasselbe wie Richtigkeit*, а DWDS *kostenlos im Internet zugänglich*.

## Практика

> [!quiz] Яке дієслово пасує? «Die Opposition ___ schwere Vorwürfe gegen den Minister.»
> level: C1 · type: single · id: de-c1-kollokationen-q05
> - [x] erhebt
> - [ ] macht
> - [ ] gibt
> - [ ] stellt
>
> **Пояснення:** *Vorwürfe erheben gegen + Akk*. *Vorwürfe machen* можливе лише з Dativ особи (*jemandem Vorwürfe machen*), і воно розмовніше; *geben* і *stellen* з *Vorwürfe* не поєднуються.

> [!quiz] Як точно сказати «піти на ризик»?
> level: C1 · type: single · id: de-c1-kollokationen-q06
> - [ ] ein Risiko nehmen
> - [x] ein Risiko eingehen
> - [ ] ein Risiko machen
> - [ ] ein Risiko treffen
>
> **Пояснення:** *ein Risiko eingehen*. *Ein Risiko nehmen* — калька з англійської *take a risk*; *machen* і *treffen* з *Risiko* не поєднуються.

> [!quiz] Які сполуки правильні? Обери всі.
> level: C1 · type: multi · id: de-c1-kollokationen-q07
> - [x] Aufsehen erregen
> - [x] Klarheit schaffen
> - [ ] Erfahrungen bekommen
> - [x] Interesse wecken
> - [ ] Schlüsse machen
>
> **Пояснення:** правильні: *Aufsehen erregen, Klarheit schaffen, Interesse wecken*. Треба *Erfahrungen sammeln* і *Schlüsse ziehen*.

> [!quiz] Який прикметник типовий для слова Grund? «Ohne ___ Grund darf der Vermieter nicht kündigen.»
> level: C1 · type: single · id: de-c1-kollokationen-q08
> - [x] triftigen
> - [ ] schweren
> - [ ] starken
> - [ ] hohen
>
> **Пояснення:** *ein triftiger Grund* — сталий вираз (вагома причина). *Schwer* поєднується з *Fehler, Vorwürfe*, *hoch* — з *Nachfrage, Stellenwert*; *stark* до *Grund* не пасує (калька з англ. *strong reason*).

> [!quiz] Заповни дієслова колокацій
> level: C1 · type: fill · id: de-c1-kollokationen-q09 · bank: gegeben, bekommen, genommen
>
> ```text fill
> Der Konzern hat einen Gewinn von zwei Milliarden [[erzielt]].
> Aus den Daten haben wir zwei Schlüsse [[gezogen]].
> Im Praktikum hat sie viele Erfahrungen [[gesammelt]].
> Die Studie hat neue Fragen [[aufgeworfen]].
> ```
>
> **Пояснення:** *einen Gewinn erzielen, Schlüsse ziehen, Erfahrungen sammeln, Fragen aufwerfen*. *Gegeben, bekommen, genommen* — типові кальки з «давати, отримувати, брати».

> [!quiz] Заповни прикметники й прислівники
> level: C1 · type: fill · id: de-c1-kollokationen-q10 · bank: nah, hohe, dichtes
>
> ```text fill
> Die beiden Institute arbeiten [[eng]] zusammen.
> Die Stadt will die Kosten [[drastisch]] senken.
> Das Urteil hat [[weitreichende]] Folgen.
> Geld ist ein [[heikles]] Thema.
> ```
>
> **Пояснення:** *eng zusammenarbeiten, drastisch senken, weitreichende Folgen, ein heikles Thema*. *Nah zusammenarbeiten* — калька з англ. *closely*. *Hohe* і *dichtes* з цими словами не утворюють колокацій (*hohe Folgen*, *dichtes Thema* — не за нормою).

> [!quiz] Склади речення: «Ми пішли на ризик.»
> level: C1 · type: order · id: de-c1-kollokationen-q11
>
> ```text order
> Wir
> sind
> ein Risiko
> eingegangen.
> haben ✗
> ```
>
> **Пояснення:** *eingehen* у значенні «піти на щось» утворює Perfekt із *sein*: *Wir sind ein Risiko eingegangen.*

> [!quiz] Склади речення: «Закон створює передумови для вітроенергетики.»
> level: C1 · type: order · id: de-c1-kollokationen-q12
>
> ```text order
> Das Gesetz
> schafft
> die Voraussetzungen
> für mehr Windkraft.
> macht ✗
> ```
>
> **Пояснення:** *Voraussetzungen schaffen* — створити передумови. *Macht* — дослівний переклад «робить».

> [!quiz] «Die Werbung ___ den Eindruck, das Produkt sei gesund.»
> level: C1 · type: single · id: de-c1-kollokationen-q13
> - [x] erweckt
> - [ ] erregt
> - [ ] weckt
> - [ ] schafft
>
> **Пояснення:** *den Eindruck erwecken* — створювати враження. *Erregen* — з *Aufsehen, Aufmerksamkeit*, *wecken* — з *Interesse, Erwartungen*, *schaffen* — з *Klarheit, Voraussetzungen*.

> [!quiz] Яка сполука типова для офіційної відмови?
> level: C1 · type: single · id: de-c1-kollokationen-q14
> - [x] Nach eingehender Prüfung müssen wir Ihren Antrag ablehnen.
> - [ ] Nach großer Prüfung müssen wir Ihren Antrag ablehnen.
> - [ ] Nach schwerer Prüfung müssen wir Ihren Antrag ablehnen.
> - [ ] Nach genauer Prüfung müssen wir Ihren Antrag ablehnen.
>
> **Пояснення:** *nach eingehender Prüfung* — «після ретельної перевірки», стандартна формула офіційних листів. Інші прикметники з *Prüfung* у цьому значенні не поєднуються.

## Фішки

> [!reel] 🔗 Слова, що ходять парами
> Лінгвіст Джон Ферт 1957 року сформулював думку, що слово пізнають за його оточенням. Саме на ній ґрунтується корпусна лінгвістика: компʼютер рахує, які слова часто стоять поруч. Так знаходять пари на кшталт *Aufsehen erregen* чи *triftiger Grund*.

> [!reel] 🎯 triftig — слово одного партнера
> Прикметник *triftig* майже ніколи не трапляється без *Grund* або *Argument*. Такі «вірні» слова легко вчити: запамʼятай одну пару — і знаєш усе вживання. Схоже поводиться *rege*: *rege Beteiligung, reges Interesse*.

> [!reel] 🏗️ schaffen і schaffen
> *Voraussetzungen schaffen* — *schuf, geschaffen* (створити). *Die Prüfung schaffen* — *schaffte, geschafft* (впоратися). Одне дієслово, дві парадигми. Колокація підказує, яку форму брати.

## Джерела та що почитати

- [DWDS — Über uns](https://www.dwds.de/d/ueber-uns): про проєкт Берлінсько-Бранденбурзької академії наук.
- [DWDS — Wortprofil](https://www.dwds.de/d/wortprofil): як працює статистичний профіль сполучуваності.
- [IDS Mannheim — Korpora geschriebener Gegenwartssprache (DeReKo)](https://www.ids-mannheim.de/digspra/kl/projekte/korpora/): обсяг і склад корпусу.
- [DWDS — Kollokation](https://www.dwds.de/wb/Kollokation): значення терміна.
- [DWDS — triftig](https://www.dwds.de/wb/triftig): значення й типові сполуки.

> [!important] Підсумок
> - **Колокація** — звична сполука, де одне слово «вибирає» інше: значення прозоре, але вибір не вільний (*Schlüsse ziehen*, не ~~machen~~).
> - Дієслова з «характером»: **ziehen** (*Schlüsse, Konsequenzen, einen Vergleich*), **erzielen** (*einen Gewinn, eine Einigung*), **schaffen** (*Klarheit, Voraussetzungen*), **erregen / wecken / erwecken** (*Aufsehen / Interesse / den Eindruck*).
> - Прикметник + іменник: *ein triftiger Grund, eine eingehende Prüfung, weitreichende Folgen, eine hohe Nachfrage, ein heikles Thema*.
> - Прислівник + дієслово: *scharf kritisieren, drastisch senken, eng zusammenarbeiten, zutiefst bedauern, strikt ablehnen*.
> - Пастки: «робити / отримувати» замість точного дієслова, англійські кальки (*~~ein Risiko nehmen~~*), граматика колокації (*ist eingegangen, schuf*).
> - Перевіряй колокації у **DWDS-Wortprofil** і вчи нові іменники разом із партнерами.
