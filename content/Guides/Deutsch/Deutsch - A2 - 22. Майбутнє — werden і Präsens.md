---
title: Майбутнє — werden і Präsens
id: de-a2-zukunft
level: A2
icon: px:letterTile
tags: [deutsch, a2, grammar, futur, werden]
prerequisites: ["[[Deutsch - A1 - 07. Präsens — правильні дієслова]]", "[[Deutsch - A2 - 01. Perfekt — haben чи sein і Partizip II]]"]
estimatedMinutes: 35
---

# Майбутнє — werden і Präsens

> [!success] Після цієї теми ти зможеш
> - говорити про майбутнє звичайним Präsens із маркером часу: *Morgen fahre ich nach Berlin.*;
> - утворити Futur I: *Ich werde dir helfen. Es wird morgen regnen.*;
> - розрізнити *werden* як «стати» (*Ich werde Arzt*) і *werden* як допоміжне дієслово майбутнього;
> - правильно поставити інфінітив у кінець речення.

## Передбач

> [!quiz] Як природно сказати «Завтра я їду до Берліна»?
> level: A2 · type: single · id: de-a2-zukunft-q01
> - [x] Morgen fahre ich nach Berlin.
> - [ ] Morgen werde ich fahren nach Berlin.
> - [ ] Morgen ich fahre nach Berlin.
> - [ ] Morgen fahren ich nach Berlin.
>
> **Пояснення:** про найближче майбутнє німці здебільшого вживають звичайний **Präsens** із маркером часу (*morgen, nächste Woche, bald*). Futur теж можливий (*Morgen werde ich nach Berlin fahren*), але інфінітив мусить стояти **в кінці**. Інверсія після *morgen*: дієслово на другому місці, потім підмет.

## Пояснення

### 1. Präsens + маркер часу: норма

Німецька мова не змінює дієслово, коли йдеться про майбутнє: достатньо слова, яке вказує час.

| Німецькою | Українською |
|---|---|
| Morgen **fahre** ich nach Berlin. | Завтра я їду до Берліна. |
| Nächste Woche **habe** ich Urlaub. | Наступного тижня в мене відпустка. |
| Bald **bin** ich fertig. | Скоро я закінчу. |
| Am Samstag **kommen** meine Eltern. | У суботу приїдуть мої батьки. |

Це звичайна, нейтральна форма: у розмові вона зустрічається найчастіше. Без маркера часу такий Präsens розуміють як теперішній: *Ich fahre nach Berlin* — «Я їду (зараз / завжди)».

### 2. Futur I: werden + інфінітив

Коли хочемо підкреслити саме майбутнє — план, обіцянку, прогноз — або коли маркера часу немає, вживаємо Futur I.

| Особа | werden | Приклад |
|---|---|---|
| ich | **werde** | Ich werde dir helfen. |
| du | **wirst** | Du wirst das schaffen. |
| er / sie / es | **wird** | Es wird morgen regnen. |
| wir | **werden** | Wir werden umziehen. |
| ihr | **werdet** | Ihr werdet staunen. |
| sie / Sie | **werden** | Sie werden gewinnen. |

*werden* неправильне: зверни увагу на **du wirst** і **er wird** (не ~~werdest~~, ~~werd~~).

> [!diagram] Futur I: рамка речення
> ```yaml
> layout: flow
> nodes:
>   - { id: subj, label: "1-ше місце", text: "Ich", note: "підмет", tone: mint }
>   - { id: werden, label: "2-ге місце", text: "werde", note: "werden — змінюється за особою", tone: orange }
>   - { id: mid, label: "середина", text: "morgen früh", note: "час, місце, решта", tone: gray }
>   - { id: inf, label: "кінець", text: "aufstehen", note: "інфінітив — незмінний", tone: orange }
> edges:
>   - { from: subj, to: werden, label: "потім" }
>   - { from: werden, to: mid, label: "потім" }
>   - { from: mid, to: inf, label: "в кінці" }
> steps:
>   - { focus: [subj, werden], note: "Підмет і werden: werden стоїть на другому місці, як будь-яке дієслово." }
>   - { focus: mid, note: "Усе, що між ними: час, місце, додатки." }
>   - { focus: inf, note: "Змістове дієслово — інфінітив — іде в самий кінець. Разом werden і інфінітив утворюють рамку речення." }
> ```
> Дієслово *werden* (помаранчеве) і інфінітив (помаранчевий) утворюють «рамку»; підмет (мʼятний) і решта слів (сірі) — між ними або поруч.

### 3. Для чого Futur

| Значення | Приклад |
|---|---|
| план, рішення | Ich werde mehr Sport treiben. — Я більше займатимусь спортом. |
| обіцянка | Ich werde dir immer helfen. — Я завжди тобі допомагатиму. |
| прогноз | Morgen wird es regnen. — Завтра буде холодно. |
| припущення (з *wohl, bestimmt*) | Er wird wohl krank sein. — Він, мабуть, хворий. |

> [!tip] Futur не «неправильний»
> Futur I у розмові чути рідше, ніж Präsens із маркером часу, але *Ich werde morgen kommen* — цілком правильне речення. Обирай Futur, коли хочеш підкреслити намір, обіцянку чи передбачення.

### 4. werden = «ставати»

*werden* має ще одне значення — «ставати, робитися». Тоді після нього йде іменник або прикметник, а не інфінітив.

| Значення | Приклад | Переклад |
|---|---|---|
| ставати | Ich **werde** Arzt. | Я стану лікарем. |
| ставати | Es **wird** kalt. | Холоднішає. |
| ставати | Mir **wird** schlecht. | Мені стає зле. |

> [!diagram] Три значення werden
> ```yaml
> layout: compare
> columns: { a: "ставати", b: "Futur I", c: "Passiv (рівень B1)" }
> nodes:
>   - { id: a1, col: a, label: "werden +", text: "прикметник / іменник", note: "Es wird kalt. Ich werde Lehrerin.", tone: yellow }
>   - { id: b1, col: b, label: "werden +", text: "інфінітив", note: "Ich werde schlafen.", tone: pink }
>   - { id: c1, col: c, label: "werden +", text: "Partizip II", note: "Das Haus wird gebaut. — окрема тема", tone: gray }
> steps:
>   - { focus: a1, note: "Прикметник або іменник: «ставати». Артикля перед професією немає: Ich werde Lehrerin." }
>   - { focus: b1, note: "Інфінітив: Futur I, майбутнє." }
>   - { focus: c1, note: "Partizip II: пасив (дія без вказаного виконавця) — тема рівня B1." }
> ```

## Приклади

- Morgen früh stehe ich um sechs auf. — Завтра зранку я встаю о шостій.
- Wir fliegen nächste Woche nach Wien. — Наступного тижня ми летимо до Відня.
- Ich werde dir morgen helfen. Versprochen! — Я допоможу тобі завтра. Обіцяю!
- Es wird heute Abend regnen. — Сьогодні ввечері буде дощ.
- Du wirst bald Vater! — Ти скоро станеш батьком!
- Nächstes Jahr werde ich Deutsch lernen. — Наступного року я вчитиму німецьку.
- Ich werde Ärztin. — Я стану лікаркою.
- Es wird dunkel. Wir müssen gehen. — Темніє. Нам треба йти.
- Er wird wahrscheinlich zu spät kommen. — Він, імовірно, спізниться.
- Hoffentlich wird das Wetter morgen gut! — Сподіваюся, завтра буде гарна погода!

## Слова

> [!word] die Zukunft
> ipa: /ˈtsuːkʊnft/ · pos: noun · level: A2 · id: de-a2-zukunft-w01
> uk: майбутнє
> forms: — (без множини)
> example: In der **Zukunft** möchte ich in Berlin leben. — У майбутньому я хочу жити в Берліні.
> note: «у майбутньому» — in der Zukunft; «на майбутнє» — für die Zukunft. Слово походить від zuokumft — «прихід, наближення».

> [!word] der Plan
> ipa: /plaːn/ · pos: noun · level: A2 · id: de-a2-zukunft-w02
> uk: план
> forms: die Pläne
> example: Hast du schon einen **Plan** für das Wochenende? — У тебе вже є план на вихідні?
> note: ä у множині: die Pläne [ˈplɛːnə].

> [!word] planen
> ipa: /ˈplaːnən/ · pos: verb · level: A2 · id: de-a2-zukunft-w03
> uk: планувати
> forms: planen → plante → hat geplant
> example: Wir **planen** eine Reise nach Italien. — Ми плануємо поїздку до Італії.
> note: planen + Akk: eine Reise planen; planen + інфінітив з zu: Ich plane, nach Wien zu fahren.

> [!word] vorhaben
> ipa: /ˈfoːɐ̯haːbn̩/ · pos: verb · level: A2 · id: de-a2-zukunft-w04
> uk: мати намір; планувати
> forms: vorhaben · er hat vor · hatte vor · hat vorgehabt
> example: Was **hast** du am Wochenende **vor**? — Що ти плануєш на вихідні?
> note: відокремлюване: ich habe … vor. Типове питання про плани: Was hast du morgen vor?

> [!word] bald
> ipa: /balt/ · pos: adv · level: A2 · id: de-a2-zukunft-w05
> uk: скоро
> example: Wir sehen uns **bald**. — Скоро побачимося.
> note: Bis bald! — До скорого! Кінцеве d звучить як [t].

> [!word] übermorgen
> ipa: /ˈyːbɐmɔʁɡn̩/ · pos: adv · level: A2 · id: de-a2-zukunft-w06
> uk: післязавтра
> example: **Übermorgen** habe ich Geburtstag. — Післязавтра в мене день народження.
> note: протилежне до vorgestern. ü — губи трубочкою, язик як для «і».

> [!word] nächste
> ipa: /ˈnɛːçstə/ · pos: adj · level: A2 · id: de-a2-zukunft-w07
> uk: наступний; найближчий
> example: Ich fahre **nächste** Woche nach Hamburg. — Наступного тижня я їду до Гамбурга.
> note: nächste Woche (знахідний, без прийменника), nächsten Monat, nächstes Jahr: закінчення за родом. ä довге [ɛː]; ch після ä = [ç].

> [!word] versprechen
> ipa: /fɛɐ̯ˈʃpʁɛçn̩/ · pos: verb · level: A2 · id: de-a2-zukunft-w08
> uk: обіцяти
> forms: versprechen · er verspricht · versprach · hat versprochen
> example: Ich **verspreche** dir, dass ich komme. — Обіцяю тобі, що прийду.
> note: sich versprechen — обмовитися. Іменник — das Versprechen (обіцянка).

> [!word] wahrscheinlich
> ipa: /vaːɐ̯ˈʃaɪ̯nlɪç/ · pos: adv · level: A2 · id: de-a2-zukunft-w09
> uk: імовірно; мабуть
> example: Er kommt **wahrscheinlich** später. — Він, імовірно, прийде пізніше.
> note: наголос на -schein-. Корінь — der Schein (вигляд): те, що має вигляд правди.

> [!word] hoffentlich
> ipa: /ˈhɔfn̩tlɪç/ · pos: adv · level: A2 · id: de-a2-zukunft-w10
> uk: сподіваюся; дай Боже
> example: **Hoffentlich** regnet es morgen nicht. — Сподіваюся, завтра не дощитиме.
> note: часто стоїть на початку речення; відповідь «Hoffentlich!» — «Дай Боже!». h — видих.

> [!word] irgendwann
> ipa: /ˈɪʁɡn̩tvan/ · pos: adv · level: A2 · id: de-a2-zukunft-w11
> uk: колись; коли-небудь
> example: **Irgendwann** möchte ich nach Japan reisen. — Колись я хотів би поїхати до Японії.
> note: може стосуватися минулого й майбутнього. Складене з irgend- + wann.

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-zukunft-l01
> audio: Ich werde morgen früh aufstehen.
> - [ ] Ich werde gestern früh aufstehen.
> - [x] Ich werde morgen früh aufstehen.
> - [ ] Ich bin morgen früh aufgestanden.
>
> **Пояснення:** *werde … aufstehen* — Futur: інфінітив у кінці. *morgen* — «завтра», *gestern* — «вчора».

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-zukunft-l02
> audio: Es wird heute Abend regnen.
> - [x] Es wird heute Abend regnen.
> - [ ] Es wurde heute Abend regnen.
> - [ ] Es wird heute Abend geregnet.
>
> **Пояснення:** *wird … regnen* — Futur, прогноз. *wurde* — минулий час; *wurde* + інфінітив не утворює майбутнього.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-zukunft-l03
> audio: Nächste Woche fahre ich nach Wien.
> explain: Präsens + *nächste Woche* = майбутнє; після маркера на початку речення — *fahre ich* (інверсія).

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-zukunft-l04
> audio: Du wirst bald Vater.
> explain: *du wirst* — форма werden для *du*. Тут *Vater* — іменник, тому *werden* означає «стати».

> [!listen] Послухай діалог. Що планує зробити Анна?
> level: A2 · type: answer · speed: slow · id: de-a2-zukunft-l05
> audio: A: Hast du schon einen Plan für das Wochenende, Anna?
> audio: B: Ja. Am Samstag werde ich meine Oma besuchen. Und am Sonntag fahre ich mit Tim zum See.
> audio: A: Das klingt schön. Hoffentlich bleibt das Wetter gut!
> - [ ] У суботу поїде на озеро, у неділю — до бабусі.
> - [x] У суботу відвідає бабусю, у неділю поїде на озеро.
> - [ ] Залишиться вдома на обидва дні.
>
> **Пояснення:** *werde besuchen* — Futur (субота); *fahre … zum See* — Präsens із маркером часу (неділя).

## Вимова

У Futur важливо чітко вимовляти **werde, wirst, wird**: *w* = «в», у *werde* довге [eː], у *wirst, wird* — коротке [ɪ]; кінцеве *-d* глухне: *wird* [vɪʁt].

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-zukunft-s01
> text: Ich werde dir helfen.
> ipa: /ɪç ˈveːɐ̯də diːɐ̯ ˈhɛlfn̩/
> tip: werde — довге [eː] у відкритому складі, слабке [ə] в кінці. helfen — слабке [n̩].
> uk: Я допоможу тобі.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-zukunft-s02
> text: Es wird morgen regnen.
> ipa: /ɛs vɪʁt ˈmɔʁɡn̩ ˈʁeːɡnən/
> tip: wird — кінцеве [t]: «вірт». r у регнен — горлове [ʁ].
> uk: Завтра буде дощ.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-zukunft-s03
> text: Wir werden nächste Woche umziehen.
> ipa: /viːɐ̯ ˈveːɐ̯dn̩ ˈnɛːçstə ˈvɔxə ˈʊmtsiːən/
> tip: nächste — довге [ɛː] і [ç], потім [st]. Woche — [x] «х».
> uk: Наступного тижня ми переїдемо.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-zukunft-s04
> text: Was hast du morgen vor?
> ipa: /vas hast duː ˈmɔʁɡn̩ foːɐ̯/
> tip: наголос на кінцівці vor; w = «в». Голос іде вниз ↘ — це W-питання.
> uk: Що ти плануєш на завтра?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-zukunft-s05
> text: Hoffentlich wird das Wetter gut!
> ipa: /ˈhɔfn̩tlɪç vɪʁt das ˈvɛtɐ ɡuːt/
> tip: hoffentlich — наголос на hof-; [ç] у кінці. Wetter — коротке [ɛ], -er = [ɐ].
> uk: Сподіваюся, погода буде гарна!

## Типові помилки українців

> [!pitfall] «Ich werde fahren morgen» — інфінітив не в кінці
> Українське «я буду їхати завтра» легко перетворити на ~~Ich werde fahren morgen~~. У німецькій інфінітив іде **в кінець**: *Ich werde morgen fahren.* Подвійна рамка: *werde* — 2-ге місце, *fahren* — останнє.

> [!pitfall] Futur скрізь замість Präsens
> Українська вимагає «буду» щоразу: «я буду працювати завтра». Німці кажуть простіше: *Morgen arbeite ich.* Не обовʼязково додавати *werden*, якщо є маркер часу (*morgen, nächste Woche, bald*).

> [!pitfall] «Ich werde Arzt» ≠ «Ich werde Arzt sein»
> *Ich werde Arzt* означає «я стану лікарем» (*werden* + іменник). Якщо потрібно сказати «я буду лікарем (працюватиму)», кажуть *Ich werde Arzt sein* або *Ich bin dann Arzt*. А ще: *werde* не плутай з *wurde* (минулий час): *Ich wurde Arzt* — «я став лікарем (колись)».

> [!pitfall] «du werdest», «er werd» — неправильні форми
> *werden* — неправильне дієслово: **du wirst**, **er / sie / es wird**. Форми ~~du werdest~~, ~~er werd~~, ~~ihr wirdet~~ — помилки; для *ihr* правильно **werdet**.

## Практика

> [!quiz] Допиши форму werden
> level: A2 · type: fill · bank: wurde, werdet · id: de-a2-zukunft-q02
>
> ```text fill
> Ich [[werde]] morgen früh aufstehen.
> Du [[wirst]] bald Vater.
> Sie [[wird]] nächstes Jahr zwanzig.
> Wir [[werden]] umziehen.
> ```
>
> **Пояснення:** *ich werde, du wirst, sie wird, wir werden*. *wurde* — минулий час, *werdet* — для *ihr*.

> [!quiz] Допиши інфінітив
> level: A2 · type: fill · bank: fuhr, hilft · id: de-a2-zukunft-q03
>
> ```text fill
> Ich werde dir morgen [[helfen]].
> Wir werden nächste Woche nach Wien [[fahren]].
> Er wird bestimmt viel [[arbeiten]].
> ```
>
> **Пояснення:** після *werden* — інфінітив у кінці. Форми *fuhr* (Präteritum) і *hilft* (3-тя особа) тут не пасують.

> [!quiz] Постав дієслово в Präsens (з маркером часу)
> level: A2 · type: fill · id: de-a2-zukunft-q04
>
> ```text fill
> Morgen (fahren) [[fahre]] ich nach Berlin.
> Nächste Woche (haben) [[habe]] ich Urlaub.
> Am Samstag (kommen) [[kommen]] meine Eltern.
> Bald (sein) [[bin]] ich fertig.
> ```
>
> **Пояснення:** майбутнє виражаємо Präsens + маркер часу; після маркера на початку речення йде дієслово, потім підмет (інверсія).

> [!quiz] Яка форма werden підходить: «Es ___ morgen regnen»?
> level: A2 · type: single · id: de-a2-zukunft-q05
> - [ ] werde
> - [ ] wirst
> - [x] wird
> - [ ] werden
>
> **Пояснення:** підмет *es* → *wird*. Це Futur I, прогноз погоди.

> [!quiz] Яка форма werden підходить: «Du ___ das schaffen»?
> level: A2 · type: single · id: de-a2-zukunft-q06
> - [x] wirst
> - [ ] wird
> - [ ] werdest
> - [ ] werdet
>
> **Пояснення:** *du wirst*. Форми *werdest* не існує, *werdet* — для *ihr*.

> [!quiz] Що означає «Es wird kalt»?
> level: A2 · type: single · id: de-a2-zukunft-q07
> - [ ] Було холодно.
> - [x] Стає холодно (холоднішає).
> - [ ] Мені холодно.
> - [ ] Холодно не буде.
>
> **Пояснення:** *werden* + прикметник = «ставати». Майбутнє тут не зʼявляється.

> [!quiz] Що означає «Er wird wohl krank sein»?
> level: A2 · type: single · id: de-a2-zukunft-q08
> - [ ] Він захворів учора.
> - [x] Він, мабуть, хворий.
> - [ ] Він хворіє вже тиждень.
> - [ ] Він ніколи не хворіє.
>
> **Пояснення:** *wohl* + Futur = припущення про теперішнє: «мабуть».

> [!quiz] Обери всі правильні речення про майбутнє
> level: A2 · type: multi · id: de-a2-zukunft-q09
> - [x] Ich werde morgen kommen.
> - [ ] Ich werde kommen morgen.
> - [x] Wir werden nächste Woche umziehen.
> - [x] Nächste Woche ziehen wir um.
> - [ ] Wir ziehen werden nächste Woche um.
>
> **Пояснення:** у Futur інфінітив в кінці; у Präsens з маркером часу відокремлюваний префікс (*ziehen … um*) теж в кінці.

> [!quiz] У яких реченнях werden означає «ставати»? Обери всі правильні відповіді
> level: A2 · type: multi · id: de-a2-zukunft-q10
> - [x] Es wird dunkel.
> - [x] Sie wird Lehrerin.
> - [ ] Wir werden morgen kommen.
> - [x] Mir wird kalt.
> - [ ] Ich werde dir helfen.
>
> **Пояснення:** після *werden* — прикметник або іменник (*dunkel, Lehrerin, kalt*) → «ставати». Якщо після нього інфінітив (*kommen, helfen*) — Futur.

> [!quiz] Склади речення (почни зі слова Ich): «Завтра зранку я встану»
> level: A2 · type: order · id: de-a2-zukunft-q11
>
> ```text order
> Ich
> werde
> morgen
> früh
> aufstehen.
> aufgestanden ✗
> ```
>
> **Пояснення:** *werde* — на другому місці, *aufstehen* — інфінітив в кінці. Partizip II (*aufgestanden*) вживають у Perfekt.

> [!quiz] Склади речення (почни зі слова Wir): «Наступного тижня ми переїдемо»
> level: A2 · type: order · id: de-a2-zukunft-q12
>
> ```text order
> Wir
> werden
> nächste
> Woche
> umziehen.
> umgezogen ✗
> ```
>
> **Пояснення:** Futur: *werden* + інфінітив у кінці. *umgezogen* — Partizip II, для Perfekt.

> [!quiz] Склади питання (почни зі слова Wirst): «Ти мені допоможеш?»
> level: A2 · type: order · id: de-a2-zukunft-q13
>
> ```text order
> Wirst
> du
> mir
> helfen?
> hilft ✗
> ```
>
> **Пояснення:** питання «так / ні» — *werden* на першому місці, інфінітив у кінці.

> [!quiz] Що означає «Ich werde Ärztin»?
> level: A2 · type: single · id: de-a2-zukunft-q14
> - [ ] Я була лікаркою.
> - [x] Я стану лікаркою.
> - [ ] Я працюю лікаркою (зараз).
> - [ ] Я не лікарка.
>
> **Пояснення:** *werden* + іменник без артикля = «стати кимось». Для теперішнього — *Ich bin Ärztin*.

## Фішки

> [!reel] ⏳ Zukunft — «те, що приходить»
> Слово *Zukunft* походить зі староверхньонімецького *zuokumft* — «наближення, прихід». У ньому той самий корінь, що й у *kommen*: майбутнє — це те, що до нас *приходить*. Так само *Ankunft* — «прибуття», *Herkunft* — «походження».

> [!reel] 🌦️ Німці говорять про майбутнє в теперішньому
> Для зустрічі в пʼятницю німець скаже: *Wir sehen uns am Freitag* (дослівно «ми бачимось у пʼятницю»), а не «побачимось». Futur I у розмові рідший: його використовують, коли хочуть підкреслити обіцянку, намір чи прогноз. Це одна з причин, чому «буду + інфінітив» з української тут не потрібне щоразу.

> [!reel] 💪 «Das wird schon!»
> Фраза *Das wird schon!* — це німецький варіант «Усе буде добре!». Дослівно «це вже стане». Її кажуть, щоб підтримати того, хто нервує перед іспитом чи співбесідою. Відповідь на неї часто: *Hoffentlich!*

## Джерела та що почитати

- [DWDS — werden](https://www.dwds.de/wb/werden): відмінювання, значення, приклади.
- [DWDS — Zukunft](https://www.dwds.de/wb/Zukunft): значення слова й етимологія.
- [DWDS — versprechen](https://www.dwds.de/wb/versprechen): значення, форми, керування.
- [DWDS — hoffentlich](https://www.dwds.de/wb/hoffentlich): значення й вживання.
- [DWDS — Futur](https://www.dwds.de/wb/Futur): граматичний термін, форми майбутнього.
- [DW — Nicos Weg (A2)](https://learngerman.dw.com/uk/nicos-weg/c-36519789): безкоштовний відеокурс Deutsche Welle, теми про плани й майбутнє.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділ про Futur I.

> [!important] Підсумок
> - Про майбутнє найчастіше: **Präsens + маркер часу** — *Morgen fahre ich nach Berlin.*
> - **Futur I** = *werden* (2-ге місце) + **інфінітив** (в кінці): план, обіцянка, прогноз, припущення (*wohl*).
> - werden: *ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden*.
> - *werden* + прикметник / іменник = «ставати»: *Es wird kalt. Ich werde Ärztin.*
> - Не плутай *werde* (майбутнє / «стаю») з *wurde* (минулий час).
