---
title: Система часів і Futur II
id: de-b2-zeiten
level: B2
icon: px:hourglass
tags: [deutsch, b2, grammar, zeiten, futur2, perfekt, praeteritum]
prerequisites: ["[[Deutsch - B1 - 30. Підсумок B1 — тест рівня]]"]
estimatedMinutes: 40
---

# Система часів і Futur II

> [!success] Після цієї теми ти зможеш
> - назвати всі шість часів індикатива й утворити їх від будь-якого дієслова: *kommt an, ist angekommen, kam an, war angekommen, wird ankommen, wird angekommen sein*;
> - вибрати між Perfekt і Präteritum за жанром і регіоном, а Plusquamperfekt — для події, що була раніше за іншу в минулому;
> - висловити припущення: Futur I — про теперішнє (*Er wird wohl schlafen*), Futur II — про минуле (*Er wird den Zug verpasst haben*);
> - сказати, що дія завершиться до певного моменту: *Bis Freitag habe ich den Bericht geschrieben* / *…werde ich den Bericht geschrieben haben*.

## Передбач

> [!quiz] Що означає речення «Sie wird den Zug verpasst haben»?
> level: B2 · type: single · id: de-b2-zeiten-q01
> - [ ] Вона пропустить потяг.
> - [x] Вона, мабуть, пропустила потяг.
> - [ ] Потяг пропускають.
> - [ ] Вона точно пропустила потяг, це відомо.
>
> **Пояснення:** *wird* + Partizip II + *haben* — це **Futur II**. Тут він не про майбутнє, а про **припущення щодо минулого**: «мабуть, пропустила». Майбутнє пропускання було б Futur I: *Sie wird den Zug verpassen*. Пасив будується інакше: *werden* + Partizip II **без** *haben*. А впевненість «точно» дало б просте *Sie hat den Zug verpasst*.

## Шість часів на одній карті

Ти вже знаєш усі часи індикатива поокремо: Perfekt (A2-01), Präteritum (B1-01), Plusquamperfekt (B1-02), Futur I (A2-22). Тепер зберемо їх разом і додамо шостий — **Futur II**. Приклад на всю тему — дієслово *ankommen* (приїжджати), яке в Perfekt бере *sein*.

| Час | Утворення | Приклад | Для чого |
|---|---|---|---|
| Präsens | основа + закінчення | Er **kommt** an. | зараз; звичка; близьке майбутнє з маркером часу |
| Perfekt | *haben / sein* + Partizip II | Er **ist angekommen**. | минуле в розмові; результат, важливий зараз |
| Präteritum | форма минулого | Er **kam** an. | письмова оповідь; *war, hatte, konnte* скрізь |
| Plusquamperfekt | *hatte / war* + Partizip II | Er **war** schon **angekommen**. | подія раніше за іншу подію в минулому |
| Futur I | *werden* + інфінітив | Er **wird** morgen **ankommen**. | прогноз, намір, обіцянка; припущення про теперішнє |
| Futur II | *werden* + Partizip II + *haben / sein* | Er **wird angekommen sein**. | припущення про минуле; дія, завершена до моменту в майбутньому |

> [!diagram] Карта часів: де стоїть кожна форма
> ```yaml
> layout: timeline
> nodes:
>   - { id: pqp, at: "раніше за минуле", text: "Er war schon angekommen, als ich kam.", note: "Plusquamperfekt: перша з двох подій у минулому", tone: gray }
>   - { id: past, at: "минуле", text: "Er kam um acht an. / Er ist um acht angekommen.", note: "Präteritum або Perfekt: те саме, різні жанри", tone: yellow }
>   - { id: now, at: "зараз", text: "Er kommt gleich an.", note: "Präsens: теперішнє й близьке майбутнє", tone: pink }
>   - { id: fut1, at: "майбутнє", text: "Er wird morgen ankommen.", note: "Futur I: прогноз, намір; з wohl — припущення про теперішнє", tone: yellow }
>   - { id: fut2, at: "до моменту в майбутньому", text: "Bis Freitag wird er angekommen sein.", note: "Futur II: завершиться до пʼятниці; або «мабуть, уже приїхав»", tone: gray }
> steps:
>   - { show: pqp, note: "Найдавніша точка: подія, що сталася ще до іншої події в минулому. Дієслово hatte / war + Partizip II." }
>   - { show: past, note: "Сама розповідь про минуле: Präteritum у тексті, Perfekt у розмові." }
>   - { show: now, note: "Präsens охоплює момент розмови. З маркером часу (gleich, morgen) він же передає й майбутнє." }
>   - { show: fut1, note: "Futur I: werden + інфінітив. Для звичайних планів достатньо Präsens із маркером часу." }
>   - { show: fut2, note: "Futur II: подивись з майбутнього назад — до пʼятниці дія вже буде завершена. Інше значення — припущення про минуле." }
> ```

## Perfekt чи Präteritum: жанр і регіон

Українська має один минулий час. Німецька має два способи сказати про минуле, і **смислової різниці між ними майже немає**: вибір залежить від жанру, регіону й дієслова.

| Ситуація | Що чути й писати | Приклад |
|---|---|---|
| Розмова, чат, голосове | **Perfekt** | Gestern bin ich ins Kino gegangen. |
| *sein, haben*, модальні, *es gibt* | **Präteritum** скрізь, і в розмові | Ich war müde. Ich konnte nicht kommen. Es gab keinen Platz. |
| Роман, казка, біографія, хроніка | **Präteritum** | Sie öffnete die Tür und trat ein. |
| Новина | початок — Perfekt, далі — Präteritum | Der Bundestag **hat** das Gesetz **beschlossen**. Die Abstimmung **dauerte** drei Stunden. |
| Подія раніше за основну лінію оповіді | **Plusquamperfekt** | Er erzählte, was **passiert war**. |

**Регіональна різниця.** На півдні Німеччини, в Австрії та Швейцарії у вільній розмові Präteritum майже зникло: про минуле там кажуть Perfekt, а Präteritum лишаються *war, hatte*, модальні дієслова (*konnte, musste, wollte, sollte*) і письмо; у швейцарських діалектах Präteritum немає зовсім. На півночі Німеччини *ging, kam, sah* у розмові трапляються частіше. Це пояснює, чому в підручниках Perfekt «розмовний», а Präteritum «письмовий»: так лише зазвичай, а не за законом. Мовознавці називають це явище *Präteritumschwund* (вимирання Präteritum) у верхньонімецьких говірках.

**Perfekt з акцентом на результат.** Perfekt зручний, коли важливий наслідок зараз: *Ich habe meinen Schlüssel verloren* («ключа в мене тепер немає»). Präteritum просто розповідає: *Ich verlor meinen Schlüssel auf dem Weg.*

> [!tip] Один текст — одна основна лінія
> У розповіді тримайся одного часу для основної лінії (Präteritum **або** Perfekt) і додавай Plusquamperfekt лише для того, що було раніше. Змішувати *war / hatte / konnte* з Perfekt нормально: *Gestern war ich zu Hause, dann bin ich einkaufen gegangen.*

## Plusquamperfekt і узгодження часів

Для двох подій у минулому давніша отримує Plusquamperfekt, а пізніша — Präteritum (письмо) чи Perfekt (розмова):

- *Als ich ankam, **hatte** der Film schon **begonnen**.* — Коли я прийшов, фільм уже почався.
- *Nachdem sie gegessen **hatten**, **gingen** sie spazieren.* — Коли вони поїли, вони пішли гуляти.

Для теперішнього й майбутнього діє парна схема: у підрядному реченні з *nachdem* **давніша** подія стоїть у Perfekt, а головна — у Präsens або Futur I:

- *Nachdem ich gegessen **habe**, **gehe** ich spazieren.* — Коли я поїм, піду гуляти.
- *Nachdem ich gegessen **habe**, **werde** ich spazieren **gehen**.*

Тут Perfekt у підрядному виконує роль Futur II: дія вже завершена перед головною.

## Futur I: що він передає

Для звичайного плану на майбутнє німці беруть **Präsens із маркером часу**: *Morgen fahre ich nach Berlin.* Futur I (*werden* + інфінітив) потрібен для чотирьох значень:

| Значення | Приклад | Переклад |
|---|---|---|
| прогноз | Es **wird** morgen **regnen**. | Завтра буде дощ. |
| намір, обіцянка | Ich **werde** dich nie **vergessen**. | Я тебе ніколи не забуду. |
| припущення про **теперішнє** | Er **wird** wohl noch **schlafen**. | Він, мабуть, ще спить. |
| сувора вимога | Du **wirst** jetzt sofort **aufräumen**! | Ти зараз же все прибереш! |

Речення *Ich werde morgen kommen* **правильне**: просто *Ich komme morgen* природніше й ужитий частіше.

Припущення про теперішнє майже завжди має слово-маркер: *wohl, wahrscheinlich, bestimmt, sicherlich, schon*. Те саме зазвичай можна сказати й простим Präsens: *Er schläft wohl noch.* Обидва варіанти звичні в розмові.

## Futur II: дві роботи

Утворення: *werden* (Präsens) + **Partizip II** + **haben** або **sein** (інфінітив). Допоміжне вибираємо так само, як у Perfekt.

| Особа | Приклад із *haben* | Приклад із *sein* |
|---|---|---|
| ich | werde gelesen haben | werde angekommen sein |
| du | wirst gelesen haben | wirst angekommen sein |
| er / sie / es | wird gelesen haben | wird angekommen sein |
| wir | werden gelesen haben | werden angekommen sein |
| ihr | werdet gelesen haben | werdet angekommen sein |
| sie / Sie | werden gelesen haben | werden angekommen sein |

Змінюється лише *werden*; два інфінітиви (*gelesen haben*, *angekommen sein*) стоять **в кінці** речення разом. У підрядному реченні *werden* іде останнім: *Ich glaube, dass er schon angekommen sein **wird**.*

> [!diagram] Futur I і Futur II: припущення
> ```yaml
> layout: compare
> columns: { a: "Futur I · про зараз", b: "Futur II · про минуле" }
> nodes:
>   - { id: a1, col: a, label: "утворення", text: "wird + Infinitiv", tone: yellow }
>   - { id: a2, col: a, label: "приклад", text: "Er wird wohl zu Hause sein.", note: "Він, мабуть, удома (зараз)", tone: yellow }
>   - { id: a3, col: a, label: "те саме простіше", text: "Er ist wohl zu Hause.", note: "Präsens + wohl", tone: gray }
>   - { id: b1, col: b, label: "утворення", text: "wird + Partizip II + haben / sein", tone: pink }
>   - { id: b2, col: b, label: "приклад", text: "Er wird den Zug verpasst haben.", note: "Він, мабуть, пропустив потяг", tone: pink }
>   - { id: b3, col: b, label: "те саме простіше", text: "Er hat den Zug wohl verpasst.", note: "Perfekt + wohl", tone: gray }
> steps:
>   - { focus: [a1, a2], note: "Futur I з wohl дивиться на теперішній момент: «мабуть, зараз так». Стан (sein, schlafen, arbeiten) — його типовий матеріал." }
>   - { focus: a3, note: "У розмові це майже завжди кажуть простіше: Präsens і wohl." }
>   - { focus: [b1, b2], note: "Futur II дивиться назад: «мабуть, це вже сталося». Partizip II і haben / sein стоять у кінці." }
>   - { focus: b3, note: "У розмові — Perfekt із wohl. Futur II зустрінеш переважно в письмових текстах і в іспитових завданнях." }
> ```

**Робота 1: припущення про минуле.** *Sie wird den Bus verpasst haben.* — Вона, мабуть, пропустила автобус. *Er wird es vergessen haben.* — Він, мабуть, забув. Маркери ті самі: *wohl, wahrscheinlich, bestimmt, sicher, schon*.

**Робота 2: дія, завершена до моменту в майбутньому.** *Bis Freitag werde ich den Bericht geschrieben haben.* — До пʼятниці я напишу звіт (до того моменту він уже буде написаний). Такий Futur II звучить книжно й офіційно. У розмові майже завжди беруть Perfekt із маркером: *Bis Freitag habe ich den Bericht geschrieben.*

## Приклади

- Es wird heute Abend regnen, nehmt einen Schirm mit. — Сьогодні ввечері буде дощ, візьміть парасольку.
- Sie wird noch im Büro sein, ihr Licht brennt. — Вона, мабуть, ще в офісі: у неї світиться світло.
- Er wird die Nachricht schon gelesen haben. — Він, мабуть, уже прочитав повідомлення.
- Die Kinder werden längst eingeschlafen sein. — Діти, мабуть, давно заснули.
- Bis zum Herbst werden wir das Haus verkauft haben. — До осені ми продамо будинок (він уже буде проданий).
- Ich werde dich immer unterstützen. — Я завжди тебе підтримуватиму.
- Als wir ankamen, war das Konzert schon vorbei. — Коли ми приїхали, концерт уже закінчився.
- Nachdem er den Vertrag unterschrieben hatte, bereute er es. — Підписавши договір, він пошкодував.
- Ich habe gestern den ganzen Tag gearbeitet. — Учора я працював цілий день.
- Das Projekt wurde 2019 abgeschlossen. — Проєкт було завершено 2019 року.

## Слова

> [!word] das Tempus
> ipa: /ˈtɛmpʊs/ · pos: noun · level: B2 · id: de-b2-zeiten-w01
> uk: граматичний час
> forms: die Tempora
> example: Welches **Tempus** passt hier: Perfekt oder Präteritum? — Який час тут підходить: Perfekt чи Präteritum?
> note: синонім у школі — die Zeitform. Мн. від латинського слова: Tempora, не ~~Tempuse~~.

> [!word] die Vermutung
> ipa: /fɛɐ̯ˈmuːtʊŋ/ · pos: noun · level: B1 · id: de-b2-zeiten-w02
> uk: припущення; здогад
> forms: die Vermutungen
> example: Das ist nur eine **Vermutung**, ich weiß es nicht sicher. — Це лише припущення, я точно не знаю.
> note: vermuten — припускати (картка вже в курсі); Futur II і Futur I з wohl — мовні форми Vermutung.

> [!word] bereits
> ipa: /bəˈʁaɪ̯ts/ · pos: adv · level: B1 · id: de-b2-zeiten-w03
> uk: уже; вже
> example: Der Zug ist **bereits** abgefahren. — Потяг уже відійшов.
> note: книжковіше й офіційніше за schon: в газеті, листі, оголошенні.

> [!word] die Gegenwart
> ipa: /ˈɡeːɡn̩vaʁt/ · pos: noun · level: B1 · id: de-b2-zeiten-w04
> uk: теперішнє; сучасність
> forms: — (без множини)
> example: In der **Gegenwart** gibt es kaum noch Telefonzellen. — У наш час майже не лишилося телефонних будок.
> note: ще й «присутність»: in Gegenwart von … (за присутності …). Протилежності: die Vergangenheit, die Zukunft.

> [!word] die Gewohnheit
> ipa: /ɡəˈvoːnhaɪ̯t/ · pos: noun · level: B1 · id: de-b2-zeiten-w05
> uk: звичка
> forms: die Gewohnheiten
> example: Nach dem Essen einen Spaziergang zu machen, ist bei uns eine alte **Gewohnheit**. — Прогулянка після їжі в нас давня звичка.
> note: -heit: іменники на -heit жіночого роду без винятків. gewohnt sein — бути звичним: Ich bin das gewohnt.

> [!word] annehmen
> ipa: /ˈanneːmən/ · pos: verb · level: B1 · id: de-b2-zeiten-w06
> uk: припускати; приймати
> forms: er nimmt an · nahm an · hat angenommen
> example: Ich **nehme an**, dass er schon zu Hause ist. — Я припускаю, що він уже вдома.
> note: відокремлюване. Значення: 1) припускати, 2) приймати (пропозицію, подарунок). Ich nehme an, … — часта вставна фраза.

> [!word] sicherlich
> ipa: /ˈzɪçɐlɪç/ · pos: adv · level: B2 · id: de-b2-zeiten-w07
> uk: напевно; безсумнівно
> example: Sie hat das **sicherlich** schon gehört. — Вона напевно вже про це чула.
> note: слабша впевненість, ніж у sicher: sicherlich часто означає «найімовірніше».

> [!word] wohl
> ipa: /voːl/ · pos: adv · level: B1 · id: de-b2-zeiten-w08
> uk: мабуть; імовірно (також: добре — книжково)
> example: Er ist **wohl** schon unterwegs. — Він, мабуть, уже в дорозі.
> note: головний маркер припущення з Futur. *wohl* як прислівник «добре» трапляється лише у сталих виразах: *Wohl bekomm's!* — на здоровʼя!, *Leb wohl!*

> [!word] der Zeitpunkt
> ipa: /ˈtsaɪ̯tpʊŋkt/ · pos: noun · level: B1 · id: de-b2-zeiten-w09
> uk: момент; час (певний)
> forms: die Zeitpunkte
> example: Zu diesem **Zeitpunkt** war er schon abgereist. — На той момент він уже поїхав.
> note: der Zeitpunkt — конкретна мить; die Zeit — час загалом. Звідси «момент у минулому» для Plusquamperfekt.

> [!word] längst
> ipa: /lɛŋst/ · pos: adv · level: B2 · id: de-b2-zeiten-w10
> uk: давно (вже); вже давно
> example: Das habe ich **längst** erledigt. — Це я давно вже зробив.
> note: підкреслює, що дія завершена вже раніше, ніж можна було очікувати. Часто з Perfekt, Plusquamperfekt і Futur II.

## Слухаємо

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-zeiten-l01
> audio: Er wird schon angekommen sein.
> - [ ] Er ist schon angekommen.
> - [x] Er wird schon angekommen sein.
> - [ ] Er wird schon ankommen.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-zeiten-l02
> audio: Bis Freitag habe ich den Bericht geschrieben.

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-zeiten-l03
> audio: Nachdem sie gegessen hatten, gingen sie spazieren.
> - [ ] Nachdem sie gegessen haben, gehen sie spazieren.
> - [x] Nachdem sie gegessen hatten, gingen sie spazieren.
> - [ ] Nachdem sie gegessen hatten, sind sie spazieren gegangen.

> [!listen] Послухай діалог. Чому, на думку співрозмовниці, Йонаса ще немає?
> level: B2 · type: answer · id: de-b2-zeiten-l04
> audio: A: Wo bleibt denn Jonas? Er ist noch nicht da.
> audio: B: Er wird im Stau stehen. Oder er hat den Zug verpasst.
> audio: A: Ruf ihn doch an.
> audio: B: Habe ich schon versucht. Er geht nicht ran.
> - [x] Вона припускає: затор або запізнення на потяг.
> - [ ] Вона точно знає, що він захворів.
> - [ ] Вона думає, що він уже вдома.
>
> **Пояснення:** *wird … stehen* і *hat … verpasst* вводяться як здогадки: це видно з *oder* («або»), а не з упевненої інтонації. Телефон мовчить, тому точної причини немає.

> [!listen] Послухай новину. Що очікують до пʼятниці?
> level: B2 · type: answer · id: de-b2-zeiten-l05
> audio: Die Verhandlungen begannen am Montag. Bis Freitag werden die Delegierten das Abkommen vermutlich unterzeichnet haben.
> - [ ] Початок переговорів
> - [x] Підписання угоди
> - [ ] Скасування переговорів
>
> **Пояснення:** *werden … unterzeichnet haben* — Futur II, а *vermutlich* («імовірно») підтверджує, що це прогноз. Переговори *begannen* уже в понеділок, це минуле.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-zeiten-l06
> audio: Ich werde dich nie vergessen.

## Вимова

У Futur II змістовий наголос падає на Partizip II; *haben* і *sein* стоять в кінці й майже не акцентуються. Інтонація припущення: легке падіння голосу на *wohl* або *schon*, без драматичного наголосу.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-zeiten-s01
> text: Er wird schon angekommen sein.
> ipa: /eːɐ̯ vɪʁt ʃoːn ˈanɡəkɔmən zaɪ̯n/
> tip: наголос на an- в «angekommen». sein — [zaɪ̯n]: s перед голосним дзвінке. Не наголошуй на sein в кінці.
> uk: Він, мабуть, уже приїхав.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-zeiten-s02
> text: Sie wird den Zug verpasst haben.
> ipa: /ziː vɪʁt deːn tsuːk fɛɐ̯ˈpast ˈhaːbn̩/
> tip: Zug закінчується на глухий «к»: «цук». verpasst — наголос на другому складі, «ферпа́ст».
> uk: Вона, мабуть, пропустила потяг.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-zeiten-s03
> text: Bis Freitag werde ich es erledigt haben.
> ipa: /bɪs ˈfʁaɪ̯taːk ˈveːɐ̯də ɪç ɛs ɛɐ̯ˈleːdɪçt ˈhaːbn̩/
> tip: Freitag — наголос на першому складі, кінцеве g = «к». erledigt: -igt — [ɪçt], «ерле́діхьт».
> uk: До пʼятниці я це зроблю.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-zeiten-s04
> text: Es wird morgen regnen.
> ipa: /ɛs vɪʁt ˈmɔʁɡn̩ ˈʁeːɡnən/
> tip: morgen — [ˈmɔʁɡn̩] майже без «е» в кінці; regnen — довге «е» у першому складі.
> uk: Завтра буде дощ.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-zeiten-s05
> text: Nachdem er gegangen war, wurde es still.
> ipa: /naːxˈdeːm eːɐ̯ ɡəˈɡaŋən vaːɐ̯ ˈvʊʁdə ɛs ʃtɪl/
> tip: nachdem — [x] після «а»: наголос на другому складі. still — st на початку слова: «шт».
> uk: Коли він пішов, стало тихо.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-zeiten-s06
> text: Ich habe es gestern gesehen.
> ipa: /ɪç ˈhaːbə ɛs ˈɡɛstɐn ɡəˈzeːən/
> tip: gestern — наголос на першому складі, «ґе́стерн». gesehen — наголос на -seh-: «ґезе́ен», довге напружене «е».
> uk: Я бачив це вчора.

## Типові помилки українців

> [!pitfall] «Буду робити» = werden скрізь
> В українській майбутнє — «буду + інфінітив», тож напрошується перекладати кожне майбутнє через *werden*. Німці здебільшого беруть Präsens із маркером часу: *Morgen **fahre** ich nach Berlin.* Futur I — для прогнозу, наміру й припущення (*Er **wird** wohl krank sein*). *Ich werde morgen kommen* — не помилка, але звучить урочистіше, ніж треба.

> [!pitfall] Futur II з неправильним допоміжним або порядком слів
> Допоміжне береш так само, як у Perfekt: *ankommen → **sein***, *verpassen → **haben***. Тож не ~~Er wird angekommen haben~~, а *Er wird angekommen **sein***. Обидва інфінітиви стоять разом у кінці: не ~~Er wird haben den Zug verpasst~~, а *Er wird den Zug verpasst **haben***. У підрядному реченні *werden* іде останнім: *…, dass er angekommen sein **wird**.*

> [!pitfall] Однаковий час для обох подій у минулому
> В українській «Коли я прийшов, фільм уже почався» має один минулий час. Німецька для давнішої події вимагає Plusquamperfekt: *Als ich ankam, **hatte** der Film schon **begonnen**.* Після *nachdem* у стандартній нормі теж Plusquamperfekt: *Nachdem er gegessen **hatte**, ging er.* Форми на кшталт *Nachdem er aß, ging er* або з Perfekt у підрядному для минулого зустрічаються в розмові, але в письмових завданнях вважаються слабким місцем.

> [!pitfall] Futur II там, де треба просте Perfekt
> *Bis Freitag **werde** ich den Bericht **geschrieben haben*** — правильно, але звучить як зі звіту. У розмові й листі колеги скажуть *Bis Freitag **habe** ich den Bericht **geschrieben***. Futur II для припущення — те саме: *Er hat es wohl vergessen* природніше, ніж *Er wird es vergessen haben*.

## Практика

> [!quiz] Він, мабуть, зараз уже вдома. Як сказати з Futur I?
> level: B2 · type: single · id: de-b2-zeiten-q02
> - [x] Er wird wohl schon zu Hause sein.
> - [ ] Er wird wohl schon zu Hause gewesen sein.
> - [ ] Er wird wohl schon zu Hause ist.
> - [ ] Er wird wohl schon zu Hause werden.
>
> **Пояснення:** про теперішнє — *wird* + інфінітив *sein*. *…gewesen sein* — Futur II, припущення про **минуле** («мабуть, був удома»). *ist* не може стояти поруч із *wird*: змінюється лише одне дієслово. *werden* у кінці означало б «ставати» (*zu Hause werden* не існує).

> [!quiz] Вона, мабуть, пропустила потяг. Яке речення правильне?
> level: B2 · type: single · id: de-b2-zeiten-q03
> - [x] Sie wird den Zug verpasst haben.
> - [ ] Sie wird den Zug verpasst sein.
> - [ ] Sie wird den Zug haben verpasst.
> - [ ] Sie hat den Zug verpasst werden.
>
> **Пояснення:** *verpassen* бере *haben* (як у Perfekt: *Sie hat den Zug verpasst*), тож Futur II — *wird … verpasst **haben***. Обидва інфінітиви стоять у кінці, у порядку «Partizip II + haben».

> [!quiz] Він, мабуть, уже приїхав. Яке допоміжне потрібне?
> level: B2 · type: single · id: de-b2-zeiten-q04
> - [x] Er wird schon angekommen sein.
> - [ ] Er wird schon angekommen haben.
> - [ ] Er wird schon ankommen sein.
> - [ ] Er wird schon angekommen.
>
> **Пояснення:** *ankommen* — дієслово руху, у Perfekt бере *sein* (*ist angekommen*), отже і у Futur II — *angekommen **sein***. Без Partizip II (*ankommen sein*) чи без допоміжного (*angekommen*) форма не завершена.

> [!quiz] У яких реченнях werden виражає припущення, а не майбутнє?
> level: B2 · type: multi · id: de-b2-zeiten-q05
> - [x] Er wird wohl krank sein.
> - [x] Sie wird den Bus verpasst haben.
> - [ ] Es wird morgen regnen.
> - [ ] Ich werde dich später anrufen.
>
> **Пояснення:** *wohl* + стан (*krank sein*) — припущення про теперішнє; *Partizip II + haben* без часового маркера — припущення про минуле. *Es wird morgen regnen* — прогноз, *Ich werde dich anrufen* — намір.

> [!quiz] Яка форма підходить: «Nachdem sie gegessen ___, gingen sie spazieren.»
> level: B2 · type: single · id: de-b2-zeiten-q06
> - [x] hatten
> - [ ] haben
> - [ ] waren
> - [ ] hätten
>
> **Пояснення:** головне речення в Präteritum (*gingen*), отже давніша дія — у Plusquamperfekt: *hatten gegessen*. *haben* — Perfekt, час не збігається. *waren* — допоміжне *sein*, а *essen* бере *haben*. *hätten* — Konjunktiv II, а це реальна подія.

> [!quiz] У розмові на півдні Німеччини, де решту минулого кажуть Perfekt, які речення звучать цілком природно?
> level: B2 · type: multi · id: de-b2-zeiten-q07
> - [x] Ich war gestern müde.
> - [x] Ich hatte keine Zeit.
> - [x] Ich konnte nicht kommen.
> - [ ] Ich ging gestern ins Kino.
>
> **Пояснення:** *war, hatte, konnte, musste* уживають у Präteritum скрізь, навіть у розмові. Звичайні дієслова (*gehen, kommen, sehen*) там кажуть у Perfekt: *Ich bin gestern ins Kino gegangen*; *ging* — форма письмової оповіді й півночі. Це не помилка, а жанрова ознака.

> [!quiz] Заповни пропуски: припущення й завершена дія
> level: B2 · type: fill · id: de-b2-zeiten-q08
>
> ```text fill
> Er [[wird]] wohl den Termin vergessen [[haben]].
> Sie [[wird]] schon nach Hause gegangen [[sein]].
> Bis Montag [[werde]] ich den Bericht geschrieben [[haben]].
> ```
>
> **Пояснення:** змінюється лише *werden* (*er wird, ich werde*). Допоміжне береться як у Perfekt: *vergessen* — *haben*, *gehen* — *sein*, *schreiben* — *haben*.

> [!quiz] Заповни пропуски: Plusquamperfekt
> level: B2 · type: fill · id: de-b2-zeiten-q09
>
> ```text fill
> Als ich ankam, [[hatte]] der Film schon begonnen.
> Ich war müde, weil ich schlecht geschlafen [[hatte]].
> Nachdem wir angekommen [[waren]], riefen wir an.
> ```
>
> **Пояснення:** Plusquamperfekt — *hatte / war* + Partizip II. *beginnen* і *schlafen* беруть *haben*, а *ankommen* — *sein*.

> [!quiz] Склади речення: «Він, мабуть, уже приїхав»
> level: B2 · type: order · id: de-b2-zeiten-q10
>
> ```text order
> Er
> wird
> wohl
> schon
> angekommen
> sein.
> haben ✗
> ```
>
> **Пояснення:** *wird* на другому місці, а Partizip II і *sein* — разом у кінці. *haben* не підходить: *ankommen* має *sein*.

> [!quiz] Склади речення: «Я думаю, що він, мабуть, уже приїхав»
> level: B2 · type: order · id: de-b2-zeiten-q11
>
> ```text order
> Ich
> glaube,
> dass
> er
> schon
> angekommen
> sein
> wird.
> ist ✗
> ```
>
> **Пояснення:** у підрядному реченні *werden* стоїть після двох інфінітивів: *…angekommen sein wird*. Тут Futur II передає припущення про минуле: «мабуть, він уже приїхав».

> [!quiz] Склади речення: «До пʼятниці я напишу звіт»
> level: B2 · type: order · id: de-b2-zeiten-q12
>
> ```text order
> Bis
> Freitag
> werde
> ich
> den
> Bericht
> geschrieben
> haben.
> sein ✗
> ```
>
> **Пояснення:** після обставини *Bis Freitag* дієслово *werde* на другому місці, потім підмет. *schreiben* бере *haben*, тому *sein* зайве.

> [!quiz] Яке речення за змістом найближче до «Er wird schon angekommen sein» у розмові?
> level: B2 · type: single · id: de-b2-zeiten-q13
> - [x] Er ist wohl schon angekommen.
> - [ ] Er wird wohl schon ankommen.
> - [ ] Er wäre wohl schon angekommen.
> - [ ] Er hat wohl schon angekommen.
>
> **Пояснення:** у розмові Futur II замінюють Perfekt із *wohl*. *Er wird wohl ankommen* — Futur I («мабуть, скоро приїде»). *wäre angekommen* — Konjunktiv II, гіпотеза. *hat angekommen* — хибне допоміжне: потрібне *ist*.

> [!quiz] Що виражає речення «Bis Freitag werde ich das geschafft haben»?
> level: B2 · type: single · id: de-b2-zeiten-q14
> - [x] Дія завершиться до пʼятниці.
> - [ ] Я почну це робити в пʼятницю.
> - [ ] Мабуть, я це вже зробив у минулому.
> - [ ] Я працював над цим до пʼятниці, а далі зупинився.
>
> **Пояснення:** *bis Freitag* — майбутній термін, а Futur II дивиться з нього назад: до цього моменту дія буде завершена. Припущення про минуле зазвичай не має майбутнього терміна.

> [!quiz] Як природно сказати в розмові: «Завтра ми їдемо до Берліна»?
> level: B2 · type: single · id: de-b2-zeiten-q15
> - [x] Morgen fahren wir nach Berlin.
> - [ ] Wir werden fahren morgen nach Berlin.
> - [ ] Morgen werden wir fahren nach Berlin.
> - [ ] Morgen wir fahren nach Berlin.
>
> **Пояснення:** Präsens + маркер часу — нейтральний спосіб говорити про план. Після *morgen* дієслово на другому місці. Якщо брати Futur, інфінітив іде в кінець: *Morgen werden wir nach Berlin fahren.*

> [!quiz] Які пари часів правильні?
> level: B2 · type: multi · id: de-b2-zeiten-q16
> - [x] Nachdem ich gegessen hatte, ging ich weg.
> - [x] Nachdem ich gegessen habe, gehe ich spazieren.
> - [x] Nachdem ich gegessen habe, werde ich spazieren gehen.
> - [ ] Nachdem ich gegessen hatte, gehe ich spazieren.
>
> **Пояснення:** узгодження часів: Präteritum головного — Plusquamperfekt у *nachdem*; Präsens чи Futur I головного — Perfekt у *nachdem*. Поєднання *hatte … gehe* змішує минуле з теперішнім.

> [!quiz] У якому реченні є Plusquamperfekt?
> level: B2 · type: single · id: de-b2-zeiten-q17
> - [x] Ich hatte das nicht gewusst.
> - [ ] Ich habe das nicht gewusst.
> - [ ] Ich wusste das nicht.
> - [ ] Ich werde das nicht gewusst haben.
>
> **Пояснення:** *hatte* + Partizip II — Plusquamperfekt. *habe gewusst* — Perfekt, *wusste* — Präteritum, *werde gewusst haben* — Futur II.

> [!quiz] Що правильно про «Ich werde morgen kommen»?
> level: B2 · type: single · id: de-b2-zeiten-q18
> - [x] Речення правильне, але Ich komme morgen — природніше.
> - [ ] Помилка: після morgen Futur неможливий.
> - [ ] Помилка: werden вживається лише з wohl.
> - [ ] Помилка: для майбутнього потрібен Futur II.
>
> **Пояснення:** Futur I можливий і з маркером часу, він лише підкреслює намір чи обіцянку. Ніяких заборон на *morgen + werden* немає.

## Фішки

> [!reel] 🗺️ Чому на півдні «не кажуть» ging
> У верхньонімецьких говірках Präteritum як розмовна форма зникло давно; мовознавці називають це *Präteritumschwund*. Тому в Мюнхені, Відні чи Цюриху *ich ging* звучить як з книжки, а *ich bin gegangen* — як «просто мова». Здебільшого лишилися *war, hatte, konnte, musste*; у швейцарських діалектах Präteritum немає зовсім.

> [!reel] 🌬️ «Wer wird denn gleich in die Luft gehen?»
> Це риторичне Futur I: «Та навіщо ж одразу спалахувати?» Дослівно: «хто ж це одразу злетить у повітря?». Фразу знають як слоган старої реклами HB-Männchen, і досі кажуть людині, що лютує через дрібницю. Futur I тут виражає не майбутнє, а докір-питання.

> [!reel] ⏳ Futur exactum
> У латинській граматиці Futur II називали *futurum exactum*: «завершене майбутнє». Звідси й ідея: дивимося з майбутнього назад і бачимо, що дія вже виконана. Німці ж на практиці воліють сказати те саме простіше: *Bis dahin habe ich es geschafft.*

## Джерела та що почитати

- [DWDS — Futur](https://www.dwds.de/wb/Futur) — термін, значення, приклади.
- [DWDS — Tempus](https://www.dwds.de/wb/Tempus) — граматичний час, множина *Tempora*.
- [DWDS — annehmen](https://www.dwds.de/wb/annehmen) — значення «припускати» та «приймати», приклади.
- [DWDS — wohl](https://www.dwds.de/wb/wohl) — частка припущення, значення й вживання.
- [Duden — Tempus](https://www.duden.de/rechtschreibung/Tempus) — визначення терміна й форми.
- [Wikipedia — Futur II](https://de.wikipedia.org/wiki/Futur_II) — огляд значень Futur II: припущення і завершена дія.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділи про часи й Futur.

> [!important] Підсумок
> - Шість часів: Präsens, Perfekt, Präteritum, Plusquamperfekt, Futur I, Futur II.
> - Perfekt — розмова, Präteritum — письмова оповідь; *war, hatte, konnte* — скрізь. На півдні Präteritum у розмові майже відсутнє.
> - Давніша подія в минулому — Plusquamperfekt; після *nachdem* — Plusquamperfekt (минуле) або Perfekt (теперішнє й майбутнє).
> - Futur I: прогноз, намір; з *wohl* — припущення про теперішнє. Звичайний план — Präsens із маркером часу.
> - Futur II = *werden* + Partizip II + *haben / sein*: припущення про минуле (*Er wird den Zug verpasst haben*) або дія, завершена до моменту в майбутньому. У розмові — Perfekt із *wohl* чи маркером часу.
