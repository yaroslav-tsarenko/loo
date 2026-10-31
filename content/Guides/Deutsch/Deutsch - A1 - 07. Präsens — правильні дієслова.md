---
title: Präsens — правильні дієслова
id: de-a1-praesens
level: A1
icon: px:gear
tags: [deutsch, a1, grammar, praesens, verben]
prerequisites: ["[[Deutsch - A1 - 03. Особові займенники й дієслово sein]]"]
estimatedMinutes: 35
---

# Präsens — правильні дієслова

> [!success] Після цієї теми ти зможеш
> - від інфінітива утворити форму для кожної особи: *wohnen → ich wohne, du wohnst, er wohnt*;
> - правильно змінити дієслова з основою на *-t, -d* (*arbeiten → du arbeitest*) і на *-s, -ß, -z* (*heißen → du heißt*);
> - відрізнити *sie wohnt* (вона), *sie wohnen* (вони) і *Sie wohnen* (Ви);
> - говорити про теперішнє й найближче майбутнє одним часом: *Ich lerne gerade. Morgen lerne ich weiter.*

## Передбач

> [!quiz] Яка форма правильна: «Du ___ viel» (arbeiten)?
> level: A1 · type: single · id: de-a1-praesens-q01
> - [ ] arbeitst
> - [x] arbeitest
> - [ ] arbeiten
> - [ ] arbeitet
>
> **Пояснення:** після основи на **-t** (*arbeit-*) перед закінченням *-st* додаємо **-e-**, щоб слово можна було вимовити: *du arbeitest*. *arbeitst* вимовити майже неможливо.

## Інфінітив, основа, закінчення

Словникова форма німецького дієслова — **інфінітив** на *-en*: *wohnen, lernen, machen*. Якщо відкинути *-en*, отримаємо **основу**: *wohn-, lern-, mach-*. До основи додаємо закінчення залежно від особи — і все.

| Особа | Закінчення | wohnen | lernen | machen |
|---|---|---|---|---|
| ich | **-e** | wohne | lerne | mache |
| du | **-st** | wohnst | lernst | machst |
| er / sie / es | **-t** | wohnt | lernt | macht |
| wir | **-en** | wohnen | lernen | machen |
| ihr | **-t** | wohnt | lernt | macht |
| sie / Sie | **-en** | wohnen | lernen | machen |

> [!diagram] Основа + закінчення: підмет вирішує, яким буде дієслово
> ```yaml
> layout: flow
> nodes:
>   - { id: subj, label: "хто?", text: "Ich", tone: mint }
>   - { id: stem, label: "основа", text: "wohn", tone: gray }
>   - { id: end, label: "закінчення", text: "-e", tone: orange }
>   - { id: rest, label: "де?", text: "in Berlin", tone: gray }
> steps:
>   - { focus: subj, note: "Спершу підмет: Ich → закінчення -e." }
>   - { focus: [stem], note: "Основа з інфінітива wohnen: відкидаємо -en → wohn-." }
>   - { focus: [stem, end], note: "Основа + закінчення: wohn + e = wohne." }
>   - { set: { subj: "Du", end: "-st" }, focus: [subj, end], note: "Du → -st: Du wohnst in Berlin." }
>   - { set: { subj: "Er", end: "-t" }, focus: [subj, end], note: "Er / sie / es → -t: Er wohnt in Berlin." }
>   - { set: { subj: "Wir", end: "-en" }, focus: [subj, end], note: "Wir, sie, Sie → -en (як в інфінітиві): Wir wohnen in Berlin." }
> ```
> Три речі треба тримати в голові: **-e** (ich), **-st** (du), **-t** (er / sie / es і ihr). Решта — інфінітив.

Зверни увагу: **ihr** і **er / sie / es** мають однакову форму на *-t*, а **wir, sie і Sie** — на *-en*, як інфінітив. Як і з *sein*, три *sie* розрізняємо за дієсловом і великою літерою:

| | Форма | Переклад |
|---|---|---|
| *Sie* **wohnt** in Wien. | -t | вона живе у Відні |
| *Sie* **wohnen** in Wien. | -en | вони живуть у Відні |
| *Sie* **wohnen** in Wien. (з великої) | -en | Ви живете у Відні |

## Дієслова, які змінюють закінчення

### Основа на -t, -d, -chn, -ffn, -gn

Якщо основа закінчується на **-t** або **-d** (*arbeit-, wart-, antwort-, bad-*), а також на *-n* після приголосного (*öffn-, rechn-*), перед **-st** і **-t** додаємо **-e-**:

| | arbeiten | warten | antworten | öffnen |
|---|---|---|---|---|
| ich | arbeite | warte | antworte | öffne |
| du | arbeit**e**st | wart**e**st | antwort**e**st | öffn**e**st |
| er / sie / es | arbeit**e**t | wart**e**t | antwort**e**t | öffn**e**t |
| wir | arbeiten | warten | antworten | öffnen |
| ihr | arbeit**e**t | wart**e**t | antwort**e**t | öffn**e**t |
| sie / Sie | arbeiten | warten | antworten | öffnen |

### Основа на -s, -ß, -z, -x

Якщо основа закінчується на шиплячий/свистячий звук (**-s, -ß, -z, -x**), у формі **du** закінчення — лише **-t** (не *-st*): воно зливається з основою.

| | heißen | tanzen | reisen |
|---|---|---|---|
| ich | heiße | tanze | reise |
| du | heiß**t** | tanz**t** | reis**t** |
| er / sie / es | heißt | tanzt | reist |
| wir | heißen | tanzen | reisen |
| ihr | heißt | tanzt | reist |
| sie / Sie | heißen | tanzen | reisen |

Тут *du* і *er / sie / es* мають однакову форму: *du heißt, er heißt*.

> [!diagram] Три групи дієслів, одна схема
> ```yaml
> layout: compare
> columns: { a: "wohnen", b: "arbeiten (-t / -d)", c: "tanzen (-s / -ß / -z)" }
> nodes:
>   - { id: a1, col: a, label: "du", text: "wohnst", tone: orange }
>   - { id: a2, col: a, label: "er", text: "wohnt", tone: orange }
>   - { id: b1, col: b, label: "du", text: "arbeitest", tone: orange }
>   - { id: b2, col: b, label: "er", text: "arbeitet", tone: orange }
>   - { id: c1, col: c, label: "du", text: "tanzt", tone: orange }
>   - { id: c2, col: c, label: "er", text: "tanzt", tone: orange }
> steps:
>   - { focus: [a1, a2], note: "Звичайна група: du → -st, er → -t." }
>   - { focus: [b1, b2], note: "Основа на -t / -d: додаємо -e- перед -st і -t, щоб було що вимовити." }
>   - { focus: [c1, c2], note: "Основа на -s / -ß / -z: у du лише -t, тож du tanzt = er tanzt." }
> ```

## Що означає німецький Präsens

Німецький Präsens охоплює і те, що в українській передає теперішній час «зараз» і «взагалі», і найближче майбутнє. Окремої форми «я зараз роблю» немає.

- **зараз:** *Ich lerne gerade Deutsch.* — Я зараз вчу німецьку.
- **взагалі, звичка:** *Er arbeitet in Köln.* — Він працює в Кельні.
- **найближче майбутнє** (разом зі словом часу): *Morgen komme ich um acht.* — Завтра я прийду о восьмій.

Ніяких допоміжних слів: ~~Ich bin lernen~~ чи ~~Ich werde morgen kommen~~ для звичайної розмови не потрібні. Для майбутнього *Futur* (*werden* + інфінітив) існує, але на A1 достатньо Präsens.

> [!note] Заперечення
> Дієслово заперечуємо через *nicht*, яке стоїть після дієслова: *Ich arbeite **nicht**. Er wohnt **nicht** in Berlin.* З іменником без артикля — *kein* (тема [[Deutsch - A1 - 11. haben, знахідний відмінок і kein]]).

## Приклади

- Ich wohne in Berlin, aber ich arbeite in Potsdam. — Я живу в Берліні, але працюю в Потсдамі.
- Du lernst schnell. — Ти швидко вчишся.
- Er arbeitet heute nicht. — Він сьогодні не працює.
- Sie spielt Klavier. — Вона грає на піаніно.
- Wir kaufen Brot und Milch. — Ми купуємо хліб і молоко.
- Ihr tanzt sehr gut! — Ви чудово танцюєте!
- Meine Eltern leben in Lwiw. — Мої батьки живуть у Львові.
- Wo wohnen Sie? — Ich wohne in Wien. — Де Ви живете? — Я живу у Відні.
- Wartest du auf den Bus? — Ти чекаєш на автобус?
- Er sagt nichts. Er hört nur zu. — Він нічого не каже. Він лише слухає.

## Слова

> [!word] wohnen
> ipa: /ˈvoːnən/ · pos: verb · level: A1 · id: de-a1-praesens-w01
> uk: жити; мешкати
> forms: wohnen → wohnte → hat gewohnt
> example: Wir **wohnen** in Köln. — Ми живемо в Кельні.
> note: wohnen = мешкати (адреса), leben = жити взагалі: Ich wohne in Berlin, ich lebe gern in Deutschland. AT, CH: wohnen те саме.

> [!word] arbeiten
> ipa: /ˈaʁbaɪ̯tn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w02
> uk: працювати
> forms: arbeiten → arbeitete → hat gearbeitet
> example: Mein Vater **arbeitet** bei einer Bank. — Мій тато працює в банку.
> note: du arbeitest, er arbeitet. die Arbeit = робота; arbeiten = працювати, не «роботати».

> [!word] lernen
> ipa: /ˈlɛʁnən/ · pos: verb · level: A1 · id: de-a1-praesens-w03
> uk: вчити; вивчати; вчитися
> forms: lernen → lernte → hat gelernt
> example: Ich **lerne** jeden Tag Deutsch. — Я вчу німецьку щодня.
> note: lernen = опановувати (мову, слова); studieren = навчатися в університеті. Не плутати з lehren (викладати).

> [!word] machen
> ipa: /ˈmaxn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w04
> uk: робити
> forms: machen → machte → hat gemacht
> example: Was **machst** du heute? — Що ти робиш сьогодні?
> note: ch після a = [x], як українське «х»: «махен». Універсальне дієслово: Hausaufgaben machen, Urlaub machen.

> [!word] spielen
> ipa: /ˈʃpiːlən/ · pos: verb · level: A1 · id: de-a1-praesens-w05
> uk: грати
> forms: spielen → spielte → hat gespielt
> example: Die Kinder **spielen** im Garten. — Діти граються в саду.
> note: sp- на початку = «шп»; ie = довге [iː]. Ein Instrument spielen, Fußball spielen.

> [!word] kaufen
> ipa: /ˈkaʊ̯fn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w06
> uk: купувати
> forms: kaufen → kaufte → hat gekauft
> example: Ich **kaufe** Brot und Käse. — Я купую хліб і сир.
> note: au = «ау». Відокремлюване einkaufen («робити покупки») — тема A1-16.

> [!word] suchen
> ipa: /ˈzuːxn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w07
> uk: шукати
> forms: suchen → suchte → hat gesucht
> example: Wir **suchen** eine Wohnung. — Ми шукаємо квартиру.
> note: s перед голосним = дзвінке [z]; ch після u = [x]. Після suchen — Akkusativ без прийменника (не ~~suchen für~~).

> [!word] hören
> ipa: /ˈhøːʁən/ · pos: verb · level: A1 · id: de-a1-praesens-w08
> uk: чути; слухати
> forms: hören → hörte → hat gehört
> example: Ich **höre** gern Musik. — Я люблю слухати музику.
> note: ö — губи «о», язик «е»: «хьорен». zuhören — слухати уважно (відокремлюване).

> [!word] fragen
> ipa: /ˈfʁaːɡn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w09
> uk: питати; запитувати
> forms: fragen → fragte → hat gefragt
> example: Darf ich Sie etwas **fragen**? — Чи можна Вас дещо запитати?
> note: jemanden fragen — питати когось (Akk, не ~~bei jemandem~~): Ich frage den Lehrer.

> [!word] antworten
> ipa: /ˈantvɔʁtn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w10
> uk: відповідати
> forms: antworten → antwortete → hat geantwortet
> example: Er **antwortet** sofort. — Він відповідає одразу.
> note: du antwortest, er antwortet (з -e-). die Antwort = відповідь; antworten + Dativ (jemandem antworten).

> [!word] leben
> ipa: /ˈleːbn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w11
> uk: жити; існувати
> forms: leben → lebte → hat gelebt
> example: Meine Großeltern **leben** in Odesa. — Мої бабуся і дідусь живуть в Одесі.
> note: das Leben = життя. Leben взагалі, wohnen — конкретна адреса.

> [!word] sagen
> ipa: /ˈzaːɡn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w12
> uk: казати; говорити
> forms: sagen → sagte → hat gesagt
> example: Was **sagst** du? — Що ти кажеш?
> note: sagen — що саме; sprechen — говорити мовою/з кимось: Ich spreche Deutsch, ich sage „Hallo".

> [!word] tanzen
> ipa: /ˈtantsn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w13
> uk: танцювати
> forms: tanzen → tanzte → hat getanzt
> example: Ihr **tanzt** sehr gut! — Ви чудово танцюєте!
> note: du tanzt = er tanzt (основа на -z). der Tanz = танець.

> [!word] reisen
> ipa: /ˈʁaɪ̯zn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w14
> uk: подорожувати
> forms: reisen → reiste → ist gereist
> example: Im Sommer **reisen** wir nach Italien. — Влітку ми подорожуємо Італією.
> note: du reist = er reist. Perfekt з sein: ist gereist (рух). die Reise = подорож.

> [!word] brauchen
> ipa: /ˈbʁaʊ̯xn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w15
> uk: потребувати; бути потрібним
> forms: brauchen → brauchte → hat gebraucht
> example: Ich **brauche** einen Stift. — Мені потрібна ручка.
> note: Ich brauche + Akk — «мені потрібно (що)». au = «ау», ch після au = [x].

> [!word] studieren
> ipa: /ʃtuˈdiːʁən/ · pos: verb · level: A1 · id: de-a1-praesens-w16
> uk: навчатися в університеті; вивчати (фах)
> forms: studieren → studierte → hat studiert
> example: Meine Schwester **studiert** Medizin in Wien. — Моя сестра вивчає медицину у Відні.
> note: studieren = лише університет: Ich studiere Informatik. Школяр — lernen. st- на початку = «шт». Невідокремлюване -ieren: Partizip без ge-.

> [!word] warten
> ipa: /ˈvaʁtn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w17
> uk: чекати
> forms: warten → wartete → hat gewartet
> example: Ich **warte** hier. — Я чекаю тут.
> note: du wartest, er wartet. «Чекати на когось» — warten auf + Akk: Ich warte auf dich (не ~~Ich warte dich~~).

> [!word] öffnen
> ipa: /ˈœfnən/ · pos: verb · level: A1 · id: de-a1-praesens-w18
> uk: відчиняти; відкривати
> forms: öffnen → öffnete → hat geöffnet
> example: Bitte **öffnen** Sie die Tür! — Будь ласка, відчиніть двері!
> note: du öffnest, er öffnet. ö — губи «о», язик «е»; öffnen/schließen. Магазин «відчинено» — geöffnet (Mo–Fr geöffnet).

> [!word] duzen
> ipa: /ˈduːtsn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w19
> uk: говорити на «ти»
> forms: duzen → duzte → hat geduzt
> example: In der Firma **duzen** wir uns alle. — У фірмі ми всі на «ти».
> note: du duzt = er duzt. Протилежне — siezen (говорити на «Ви»). sich duzen — на «ти» між собою.

> [!word] lachen
> ipa: /ˈlaxn̩/ · pos: verb · level: A1 · id: de-a1-praesens-w20
> uk: сміятися
> forms: lachen → lachte → hat gelacht
> example: Wir **lachen** viel zusammen. — Ми багато сміємося разом.
> note: ch після a = [x]. Німці: Das ist nicht zum Lachen! — Це не смішно!

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-praesens-l01
> audio: Du wohnst in Berlin.
> - [ ] Ihr wohnt in Berlin.
> - [x] Du wohnst in Berlin.
> - [ ] Wir wohnen in Berlin.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-praesens-l02
> audio: Er arbeitet heute nicht.
> - [ ] Du arbeitest heute nicht.
> - [x] Er arbeitet heute nicht.
> - [ ] Wir arbeiten heute nicht.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-praesens-l03
> audio: Wir lernen Deutsch.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-praesens-l04
> audio: Du antwortest sehr schnell.
> explain: antworten: після основи на -t перед -st додаємо -e-: du antwortest.

> [!listen] Послухай діалог. Що робить Ольга?
> level: A1 · type: answer · speed: slow · id: de-a1-praesens-l05
> audio: A: Hallo Olga! Wo wohnst du jetzt?
> audio: B: Ich wohne in Berlin. Ich arbeite dort und ich lerne Deutsch.
> audio: A: Super! Wir sehen uns bald.
> - [ ] Вона живе і вчиться у Відні.
> - [x] Вона живе й працює в Берліні та вчить німецьку.
> - [ ] Вона працює в Берліні, а живе в іншому місті.
>
> **Пояснення:** *wohne … in Berlin* — живе в Берліні; *arbeite dort* — там працює (*dort* = там); *lerne Deutsch* — вчить німецьку.

## Вимова

Закінчення — слабкі склади: **-e** (*wohne*) читається як нечіткий [ə], а **-en** (*wohnen, lernen*) — майже як складове [n̩]: «воонен», «лернен» без виразного «е». Наголос завжди на основі: **WOH**nen, **ARB**eiten, **LER**nen.

- **-st** у формі *du*: *wohnst* [voːnst], *lernst* [lɛʁnst] — чотири приголосні поспіль, не вставляй голосний між ними.
- **-t** у кінці: *wohnt* [voːnt] — чітке, без «ть».
- **-e-** перед -st: *arbeitest* [ˈaʁbaɪ̯təst], *antwortest* [ˈantvɔʁtəst].
- **ei** = «ай» (*arbeiten*), **ö** — губи «о» + язик «е» (*hören*), **ie** = довге «і» (*spielen*).

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-praesens-s01
> text: Ich wohne in Berlin.
> ipa: /ɪç ˈvoːnə ɪn bɛʁˈliːn/
> tip: wohne: o довге, h не вимовляється — воно лише показує довготу. Berlin — наголос на -lin. w = «в».
> uk: Я живу в Берліні.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-praesens-s02
> text: Du arbeitest viel.
> ipa: /duː ˈaʁbaɪ̯təst fiːl/
> tip: arbeitest — ei = «ай», перед -st вставлено -e-. v на початку = [f]: «філ».
> uk: Ти багато працюєш.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-praesens-s03
> text: Wir lernen Deutsch.
> ipa: /viːɐ̯ ˈlɛʁnən dɔʏ̯tʃ/
> tip: lernen — горлове [ʁ] і нечітке -en. Deutsch: eu = «ой», tsch = «ч».
> uk: Ми вчимо німецьку.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-praesens-s04
> text: Er antwortet nicht.
> ipa: /eːɐ̯ ˈantvɔʁtət nɪçt/
> tip: наголос на ANT-. -tet у кінці: «-тет». nicht — ch = [ç], як «хь».
> uk: Він не відповідає.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-praesens-s05
> text: Was machst du heute?
> ipa: /vas maxst duː ˈhɔʏ̯tə/
> tip: machst — ch = [x] («махст»). heute: eu = «ой», h — легкий видих. W-питання — голос униз ↘.
> uk: Що ти робиш сьогодні?

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-praesens-s06
> text: Wo wohnen Sie?
> ipa: /voː ˈvoːnən ziː/
> tip: wo — довге [oː]. wohnen — перший склад наголошений. Sie — дзвінке «зі».
> uk: Де Ви живете?

## Типові помилки українців

> [!pitfall] Інфінітив замість форми: ~~Ich wohnen~~, ~~Er lernen~~
> Коли не впевнений у закінченні, легко лишити словникову форму. У німецькій **інфінітив стоїть лише з wir, sie (вони) і Sie**: *wir wohnen, sie wohnen*. Із *ich* — *wohne*, з *du* — *wohnst*, з *er / sie / es* — *wohnt*. Перевір кожне речення: підмет → закінчення.

> [!pitfall] ~~du arbeitst~~, ~~er antwortt~~ — пропущене -e-
> Основа на **-t / -d** потребує **-e-**: *du arbeit**e**st, er arbeit**e**t, ihr antwort**e**t*. Інакше слово неможливо вимовити. Те саме з *-gn, -chn, -ffn*: *du öffnest*. А ось у *heißen, tanzen, reisen* -e- немає, навпаки, випадає s: *du heißt* (не ~~du heißst~~).

> [!pitfall] ~~Ich bin wohnen~~ і ~~Ich werde morgen kommen~~
> Німецька не має окремого «тривалого» часу: *Ich lerne* означає і «вчу», і «зараз вчу». Тому ~~Ich bin lernen~~ — помилка. Для близького майбутнього теж не потрібен *werden*: *Morgen komme ich* (Futur I існує, але в розмові частіше Präsens зі словом часу).

> [!pitfall] Жінка / вони / Ви: *sie wohnt* ≠ *sie wohnen*
> *Sie* можна прочитати трьома способами. Орієнтир — **дієслово**: *wohnt* → «вона»; *wohnen* → «вони» (з малої) або «Ви» (з великої, навіть про одну людину). ~~Sie wohnt in Wien, Herr Weber?~~ → **Wohnen Sie** in Wien, Herr Weber?

## Ситуація: нові сусіди

> [!listen] Послухай діалог. Де працює Марко і де живе?
> level: A1 · type: answer · speed: slow · id: de-a1-praesens-l06
> audio: A: Guten Tag! Ich bin neu hier. Ich heiße Marko.
> audio: B: Freut mich! Ich bin Frau Becker. Wo arbeiten Sie?
> audio: A: Ich arbeite in Leipzig, aber ich wohne hier.
> - [x] працює в Лейпцигу, живе тут
> - [ ] живе в Лейпцигу, працює тут
> - [ ] працює й живе в Лейпцигу
>
> **Пояснення:** *Ich arbeite in Leipzig, aber ich wohne hier* — працює в Лейпцигу, живе тут. *Ich bin neu hier* — я тут новенький.

## Практика

> [!quiz] Яка форма правильна: «Er ___ in Hamburg.» (wohnen)
> level: A1 · type: single · id: de-a1-praesens-q02
> - [ ] wohne
> - [ ] wohnst
> - [x] wohnt
> - [ ] wohnen
>
> **Пояснення:** er / sie / es → **-t**. *wohne* — ich, *wohnst* — du, *wohnen* — wir / sie / Sie.

> [!quiz] Як правильно: «Ти танцюєш чудово»?
> level: A1 · type: single · id: de-a1-praesens-q03
> - [ ] Du tanzst sehr gut.
> - [x] Du tanzt sehr gut.
> - [ ] Du tanzest sehr gut.
> - [ ] Du tanzen sehr gut.
>
> **Пояснення:** основа на **-z**: у формі du закінчення лише **-t**, тож *du tanzt*. *tanzst* і *tanzest* — помилки.

> [!quiz] Яка форма відповідає «ihr»: «Ihr ___ viel» (arbeiten)?
> level: A1 · type: single · id: de-a1-praesens-q04
> - [ ] arbeiten
> - [ ] arbeitst
> - [x] arbeitet
> - [ ] arbeitest
>
> **Пояснення:** ihr → **-t**, а після основи на -t додаємо ще -e-: *ihr arbeitet*. *arbeitest* — форма для *du*.

> [!quiz] Що означає «Sie wohnen in Wien»?
> level: A1 · type: single · id: de-a1-praesens-q05
> - [ ] Вона живе у Відні.
> - [x] Вони живуть у Відні (або: Ви живете у Відні).
> - [ ] Ми живемо у Відні.
> - [ ] Ти живеш у Відні.
>
> **Пояснення:** *wohnen* + *sie / Sie* → «вони» або ввічливе «Ви». «Вона» була б *Sie wohnt*.

> [!quiz] Які речення правильні?
> level: A1 · type: multi · id: de-a1-praesens-q06
> - [x] Ich arbeite in München.
> - [ ] Du arbeitst in München.
> - [x] Er arbeitet in München.
> - [ ] Wir arbeitet in München.
> - [x] Ihr arbeitet in München.
>
> **Пояснення:** *du arbeitest* (з -e-), *wir arbeiten* (інфінітив). Три правильні: *ich arbeite, er arbeitet, ihr arbeitet*.

> [!quiz] Які речення описують «зараз» або «найближче майбутнє» в Präsens?
> level: A1 · type: multi · id: de-a1-praesens-q07
> - [x] Ich lerne gerade Deutsch.
> - [ ] Ich bin lernen.
> - [x] Morgen komme ich um acht.
> - [ ] Ich bin morgen kommen.
> - [x] Nächste Woche reisen wir nach Wien.
>
> **Пояснення:** Präsens передає і «зараз», і плани: *Morgen komme ich*. Конструкції ~~Ich bin lernen~~ і ~~Ich bin morgen kommen~~ — кальки, німецька їх не має.

> [!quiz] Заповни пропуски формами дієслова
> level: A1 · type: fill · bank: wohnst, wohne, spielt · id: de-a1-praesens-q08
>
> ```text fill
> Ich [[lerne]] Deutsch.
> Du [[arbeitest]] in Berlin.
> Er [[kauft]] Brot.
> Wir [[wohnen]] in Wien.
> ```
>
> **Пояснення:** ich → *lerne*; du + основа на -t → *arbeitest*; er → *kauft*; wir → *wohnen* (інфінітив). *wohnst, wohne, spielt* тут зайві.

> [!quiz] Заповни пропуски: діалог
> level: A1 · type: fill · bank: wohnt, arbeitet, arbeitst · id: de-a1-praesens-q09
>
> ```text fill
> A: Wie [[heißt]] du?
> B: Ich [[heiße]] Anna. Ich [[wohne]] in Graz.
> A: Und [[arbeitest]] du auch dort?
> B: Ja, ich [[arbeite]] bei einer Bank.
> ```
>
> **Пояснення:** du heißt (без другого s); ich heiße / wohne / arbeite (-e); du arbeitest (-e-). *wohnt, arbeitet* — форми для *er / sie / ihr*, а *arbeitst* — помилкова форма без -e-.

> [!quiz] Заповни пропуски: sie / Sie
> level: A1 · type: fill · bank: wohne, wohnst · id: de-a1-praesens-q10
>
> ```text fill
> Frau Weber? [[Wohnen]] Sie in Berlin?
> Nein, sie [[wohnen]] in Hamburg. (вони)
> Nein, sie [[wohnt]] in Bonn. (вона)
> ```
>
> **Пояснення:** *Sie* (Ви) і *sie* (вони) → *wohnen*; *sie* (вона) → *wohnt*.

> [!quiz] Склади речення: «Ми вчимо німецьку»
> level: A1 · type: order · id: de-a1-praesens-q11
>
> ```text order
> Wir
> lernen
> Deutsch.
> lernt ✗
> ```
>
> **Пояснення:** *wir* → *lernen*. *lernt* — для *er / ihr*.

> [!quiz] Склади питання: «Де ти живеш?»
> level: A1 · type: order · id: de-a1-praesens-q12
>
> ```text order
> Wo
> wohnst
> du?
> wohnt ✗
> ```
>
> **Пояснення:** питальне слово → дієслово → підмет. Для *du* — *wohnst*.

> [!quiz] Склади речення: «Він сьогодні не працює»
> level: A1 · type: order · id: de-a1-praesens-q13
>
> ```text order
> Er
> arbeitet
> heute
> nicht.
> arbeitest ✗
> ```
>
> **Пояснення:** *nicht* — після дієслова й слова часу. *arbeitest* — форма для *du*.

> [!quiz] Склади питання: «Ви живете у Відні?»
> level: A1 · type: order · id: de-a1-praesens-q14
>
> ```text order
> Wohnen
> Sie
> in
> Wien?
> Wohnt ✗
> ```
>
> **Пояснення:** питання «так / ні» починається з дієслова; до *Sie* (Ви) — *wohnen*. *Wohnt* — для *er / sie / ihr*.

## Фішки

> [!reel] ⚒ Arbeit — спільний корінь зі словʼянським «раб»
> Німецьке *Arbeit* спочатку означало «тягар, мука, злидні» (VIII ст.). За етимологічним словником воно сягає того самого кореня, що й давньословʼянське *rabъ* («раб, слуга») і *rabota* («підневільна праця»). Звідси й українські «робота» та «раб» — однокореневі слова. Тож *arbeiten* спочатку означало «трудитися через силу».

> [!reel] 🎓 Studieren ≠ lernen
> Якщо німець чує *Ich studiere Deutsch*, він розуміє: ти навчаєшся на філології в університеті. А хто просто вчить мову на курсах, каже ***Ich lerne** Deutsch*. *Studieren* — лише для вишу, а *lernen* — для школи, курсів, уроку. Так само школяр *geht zur Schule*, а студент *geht zur Uni*.

> [!reel] 🕐 Німці майже не користуються Futur
> Хоч у граматиці є майбутній час (*werden* + інфінітив), у розмові німці про плани кажуть у Präsens: *Morgen fahre ich nach Berlin. Nächste Woche beginnt der Kurs.* Футурум зʼявляється, коли треба підкреслити припущення або обіцянку (*Das wird schon gut gehen* — «усе буде добре»).

## Джерела та що почитати

- [DWDS — Arbeit](https://www.dwds.de/wb/Arbeit) — значення й етимологія слова (спорідненість із давньословʼянським *rabъ*).
- [DWDS — wohnen](https://www.dwds.de/wb/wohnen) — словникова стаття: відмінювання, значення.
- [DWDS — studieren](https://www.dwds.de/wb/studieren) — відмінювання й відмінність від *lernen*.
- [Duden — studieren](https://www.duden.de/rechtschreibung/studieren) — значення й вживання.
- [DW Learn German — Nicos Weg (A1)](https://learngerman.dw.com/en/beginners/c-36519789) — безкоштовний відеокурс Deutsche Welle: дієслова в Präsens.
- Goethe-Institut — сторінка іспиту *Goethe-Zertifikat A1: Start Deutsch 1* на goethe.de: граматичний мінімум і зразки завдань.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділ про Präsens.

> [!important] Підсумок
> - Основа = інфінітив без *-en*; закінчення: *-e, -st, -t, -en, -t, -en*.
> - Основа на *-t / -d / -ffn / -chn*: перед *-st* і *-t* вставляємо *-e-* (*du arbeitest, er arbeitet*).
> - Основа на *-s / -ß / -z / -x*: у *du* лише *-t* (*du heißt, du tanzt*).
> - *Sie wohnt* — вона; *sie wohnen* — вони; *Sie wohnen* — Ви.
> - Präsens = «зараз» + «взагалі» + найближче майбутнє; окремої форми «я роблю зараз» немає.
