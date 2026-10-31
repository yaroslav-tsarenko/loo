---
title: Perfekt — перші кроки
id: de-a1-perfekt
level: A1
icon: px:history
tags: [deutsch, a1, grammar, perfekt, partizip]
prerequisites: ["[[Deutsch - A1 - 11. haben, знахідний відмінок і kein]]", "[[Deutsch - A1 - 16. Розпорядок дня й відокремлювані дієслова]]", "[[Deutsch - A1 - 14. Дієслова з чергуванням — fahren, essen, lesen, nehmen]]"]
estimatedMinutes: 40
---

# Perfekt — перші кроки

> [!success] Після цієї теми ти зможеш
> - розповісти, що ти зробив учора або на вихідних: *Ich habe Pizza gegessen. Wir sind nach Köln gefahren.*;
> - вибрати допоміжне дієслово *haben* чи *sein*;
> - утворити Partizip II правильних і найчастіших сильних дієслів: *gemacht, gearbeitet, gegessen, gefahren*;
> - поставити Partizip у кінець речення і спитати: *Was hast du gestern gemacht?*

## Передбач

> [!quiz] Як сказати: «Вчора я грав у футбол»?
> level: A1 · type: single · id: de-a1-perfekt-q01
> - [ ] Gestern ich spiele Fußball.
> - [ ] Gestern habe ich gespielt Fußball.
> - [x] Gestern habe ich Fußball gespielt.
> - [ ] Gestern ich habe Fußball gespielt.
>
> **Пояснення:** Perfekt складається з двох частин: **haben** на другому місці (V2) і **Partizip II** (*gespielt*) **у кінці** речення. Підмет після обставини *gestern* іде за дієсловом: *habe ich*.

## Навіщо Perfekt

В українській минулий час один: *я зробив, ми поїхали*. У німецькій минулого часів кілька, але в **розмові** — на роботі, з друзями, в магазині, у повідомленнях — майже завжди вживають **Perfekt**. Іншу форму, Präteritum (*ich machte*), чуєш переважно у книжках і новинах; з неї в мові лишаються найчастіше *war* і *hatte* (про них — нижче).

Perfekt — «складний» час: **допоміжне дієслово** (*haben* або *sein*) у теперішньому часі + **Partizip II** змістового дієслова.

| Підмет | haben / sein (на 2-му місці) | Partizip II (у кінці) |
|---|---|---|
| ich | habe | gemacht |
| du | hast | gemacht |
| er / sie / es | hat | gemacht |
| wir | haben | gemacht |
| ihr | habt | gemacht |
| sie / Sie | haben | gemacht |

> [!diagram] Дужка Perfekt: haben на другому місці, Partizip у кінці
> ```yaml
> layout: flow
> nodes:
>   - { id: s, label: "підмет", text: "Ich", tone: mint }
>   - { id: aux, label: "haben · 2-ге місце", text: "habe", tone: orange }
>   - { id: mid, label: "решта", text: "gestern Fußball", tone: gray }
>   - { id: pp, label: "Partizip II · кінець", text: "gespielt.", tone: orange }
> steps:
>   - { focus: [s, aux], note: "Допоміжне дієслово стоїть на другому місці, як і будь-яке дієслово в розповідному реченні (V2)." }
>   - { focus: mid, note: "Усе інше — час, місце, додатки — стоїть між двома частинами «дужки»." }
>   - { focus: pp, note: "Partizip II — завжди в кінці. Дієслово «розривається»: habe … gespielt, так само як в anrufen: rufe … an." }
>   - { set: { s: "Wir", aux: "haben", mid: "am Wochenende", pp: "gearbeitet." }, focus: [s, aux, mid, pp], note: "Ця схема працює для всіх дієслів: Wir haben am Wochenende gearbeitet." }
> ```
> *haben* → друге місце, *Partizip* → кінець.

## Partizip II: як утворюється

| Тип | Інфінітив | Partizip II | Правило |
|---|---|---|---|
| слабкі (правильні) | machen | **ge**mach**t** | ge- + корінь + **-t** |
| слабкі, корінь на -t, -d | arbeiten | **ge**arbeit**et** | між коренем і -t ще -e- |
| сильні | essen | **ge**gess**en** | ge- + корінь + **-en**, часто з іншою голосною |
| сильні | trinken | **ge**trunk**en** | → треба вчити |
| сильні | sehen | **ge**seh**en** | |
| сильні | schreiben | **ge**schrieb**en** | |
| -ieren | telefonieren | telefonier**t** | **без** ge- |
| префікси be-, ver-, er-, ent-, ge- | besuchen | besuch**t** | **без** ge- |
| ті самі префікси, сильні | verstehen | verstand**en** | **без** ge- |
| відокремлювані | aufstehen | auf**ge**stand**en** | ge- між префіксом і коренем |
| відокремлювані, слабкі | einkaufen | ein**ge**kauf**t** | |

> [!tip] Сильні дієслова — з трьох форм
> Partizip сильних дієслів не вгадаєш, тому в картках слів ми завжди даємо три форми: *essen → aß → hat gegessen*. Вчи їх разом із допоміжним дієсловом: *ist gefahren*, *hat gegessen*.

## haben чи sein?

Більшість дієслів у Perfekt з **haben**. З **sein** — дієслова двох груп:

1. **Переміщення з точки А в точку Б:** *fahren, gehen, kommen, fliegen, laufen, reisen*.
2. **Зміна стану:** *aufstehen, einschlafen, werden*.

Крім того, з **sein** — самі *sein, bleiben, passieren*: *Ich bin zu Hause geblieben. Was ist passiert?*

> [!diagram] Яке допоміжне дієслово обрати
> ```yaml
> layout: compare
> columns: { a: "haben", b: "sein" }
> nodes:
>   - { id: a1, col: a, label: "більшість", text: "machen, essen, kaufen, lernen", tone: gray }
>   - { id: a2, col: a, label: "приклад", text: "Ich habe Pizza gegessen.", tone: mint }
>   - { id: b1, col: b, label: "рух і зміна стану", text: "fahren, gehen, kommen, aufstehen", tone: gray }
>   - { id: b2, col: b, label: "приклад", text: "Ich bin nach Berlin gefahren.", tone: mint }
>   - { id: b3, col: b, label: "ще", text: "sein, bleiben, passieren", tone: gray }
> steps:
>   - { focus: [a1, a2], note: "За замовчуванням — haben: це дія з предметом (їсти піцу, купити хліб)." }
>   - { focus: [b1, b2], note: "Рух з одного місця в інше або зміна стану — sein. Підказка: «Куди?» або «Яким став?»." }
>   - { focus: b3, note: "Дієслова sein, bleiben, passieren вчимо як виняток: ist gewesen, ist geblieben, ist passiert." }
> ```

> [!note] Для сумнівних випадків
> Якщо не впевнений — скажи *haben*, дієслова руху й зміни стану вчи з карток разом із *ist*. Такі дієслова, як *schlafen* («спати») і *stehen* («стояти»), не мають напрямку: це *haben* (*Ich habe gut geschlafen*).

## Місце Partizip і заперечення

Поряд зі словами про час, місце й додатками Partizip стоїть **наприкінці речення**:

- *Ich habe gestern im Café Kuchen **gegessen**.*
- *Wir sind am Samstag nach Köln **gefahren**.*

Питання «так / ні» починається з допоміжного дієслова, питання з W-словом — W-слово → допоміжне → підмет → … → Partizip:

- *Hast du gestern Fußball **gespielt**?*
- *Was hast du am Wochenende **gemacht**?*

**nicht** ставимо перед Partizip: *Ich habe nicht **gearbeitet**.* З іменником — **kein**: *Ich habe kein Brot **gekauft**.*

## war і hatte: два винятки

Для *sein* і *haben* німці в розмові залишають Präteritum — *war* і *hatte*, бо вони коротші й зручніші, ніж *ist gewesen* і *hat gehabt*:

| Особа | sein | haben |
|---|---|---|
| ich | war | hatte |
| du | warst | hattest |
| er / sie / es | war | hatte |
| wir | waren | hatten |
| ihr | wart | hattet |
| sie / Sie | waren | hatten |

- *Gestern war ich krank.* — Вчора я хворів.
- *Wir hatten keine Zeit.* — У нас не було часу.

## Приклади

- Gestern habe ich lange geschlafen. — Вчора я довго спав.
- Was hast du am Wochenende gemacht? — Що ти робив на вихідних?
- Wir haben im Restaurant Pizza gegessen. — Ми їли піцу в ресторані.
- Sie ist um 7 Uhr aufgestanden. — Вона встала о сьомій.
- Ich bin mit dem Zug nach Hamburg gefahren. — Я поїхав до Гамбурга потягом.
- Er hat seine Mutter angerufen. — Він зателефонував мамі.
- Wir haben das Museum besucht. — Ми відвідали музей.
- Hast du Hausaufgaben gemacht? — Nein, ich hatte keine Zeit. — Ти зробив домашку? — Ні, у мене не було часу.
- Der Film hat schon angefangen. — Фільм уже почався.
- Ich habe das Buch noch nicht gelesen. — Я ще не прочитав цю книжку.

## Слова

> [!word] vorgestern
> ipa: /ˈfoːɐ̯ɡɛstɐn/ · pos: adv · level: A1 · id: de-a1-perfekt-w01
> uk: позавчора
> example: **Vorgestern** war ich im Kino. — Позавчора я був у кіно.
> note: vor- + gestern; v = [f].

> [!word] schon
> ipa: /ʃoːn/ · pos: adv · level: A1 · id: de-a1-perfekt-w02
> uk: вже
> example: Hast du **schon** gegessen? — Ти вже їв?
> note: schon ≠ schön [ʃøːn] («гарний»). Заперечення: noch nicht (ще ні).

> [!word] noch nicht
> ipa: /nɔx nɪçt/ · pos: phrase · level: A1 · id: de-a1-perfekt-w03
> uk: ще не
> example: Ich habe das Buch **noch nicht** gelesen. — Я ще не прочитав цю книжку.
> note: noch — ach-Laut [ɔx] (як «нох»), nicht — ich-Laut [ɪçt]. Відповідь «Ще ні»: Noch nicht.

> [!word] der Urlaub
> ipa: /ˈuːɐ̯laʊ̯p/ · pos: noun · level: A1 · id: de-a1-perfekt-w04
> uk: відпустка
> forms: die Urlaube
> example: Im **Urlaub** sind wir nach Italien gereist. — У відпустці ми їздили до Італії.
> note: Urlaub = відпустка працівника; Ferien (лише множина) — шкільні й університетські канікули. Auf Urlaub = у відпустці.

> [!word] besuchen
> ipa: /bəˈzuːxn̩/ · pos: verb · level: A1 · id: de-a1-perfekt-w05
> uk: відвідувати
> forms: besuchen → besuchte → hat besucht
> example: Wir haben meine Oma **besucht**. — Ми відвідали мою бабусю.
> note: префікс be- не наголошений, тому Partizip без ge-: besucht. s перед голосним — дзвінке [z].

> [!word] bleiben
> ipa: /ˈblaɪ̯bn̩/ · pos: verb · level: A1 · id: de-a1-perfekt-w06
> uk: залишатися
> forms: bleiben → blieb → ist geblieben
> example: Am Sonntag sind wir zu Hause **geblieben**. — У неділю ми залишилися вдома.
> note: з sein, хоча руху немає: bleiben, sein, werden — особливі. ei = [aɪ̯], ie у blieb = [iː].

> [!word] bekommen
> ipa: /bəˈkɔmən/ · pos: verb · level: A1 · id: de-a1-perfekt-w07
> uk: отримувати
> forms: bekommen → bekam → hat bekommen
> example: Ich habe einen Brief **bekommen**. — Я отримав листа.
> note: bekommen ≠ «become» (стати). «Стати» — werden. Partizip без ge-.

> [!word] telefonieren
> ipa: /telefoˈniːʁən/ · pos: verb · level: A1 · id: de-a1-perfekt-w08
> uk: розмовляти по телефону
> forms: telefonieren → telefonierte → hat telefoniert
> example: Ich habe lange mit meiner Mutter **telefoniert**. — Я довго розмовляв з мамою по телефону.
> note: -ieren → Partizip без ge-: telefoniert. Наголос на -nie-.

> [!word] passieren
> ipa: /paˈsiːʁən/ · pos: verb · level: A1 · id: de-a1-perfekt-w09
> uk: траплятися
> forms: passieren → passierte → ist passiert
> example: Was ist **passiert**? — Що сталося?
> note: тільки 3-тя особа: es passiert. Perfekt з sein. -ieren → Partizip без ge-.

> [!word] finden
> ipa: /ˈfɪndn̩/ · pos: verb · level: A1 · id: de-a1-perfekt-w10
> uk: знаходити; вважати
> forms: finden → fand → hat gefunden
> example: Ich habe meinen Schlüssel **gefunden**. — Я знайшов свій ключ.
> note: Wie findest du das? = Що ти про це думаєш? Du findest (-est, бо корінь на -d).

> [!word] verstehen
> ipa: /fɛɐ̯ˈʃteːən/ · pos: verb · level: A1 · id: de-a1-perfekt-w11
> uk: розуміти
> forms: verstehen → verstand → hat verstanden
> example: Ich habe dich nicht **verstanden**. — Я тебе не зрозумів.
> note: Partizip без ge-: verstanden. Корисне: Ich verstehe nicht. / Wie bitte?

> [!word] bringen
> ipa: /ˈbʁɪŋən/ · pos: verb · level: A1 · id: de-a1-perfekt-w12
> uk: приносити; відвозити
> forms: bringen → brachte → hat gebracht
> example: Ich habe dir Blumen **gebracht**. — Я приніс тобі квіти.
> note: Partizip gebracht (змішане: корінь змінюється, закінчення -t). ng = [ŋ].

> [!word] putzen
> ipa: /ˈpʊtsn̩/ · pos: verb · level: A1 · id: de-a1-perfekt-w13
> uk: прибирати; чистити
> forms: putzen → putzte → hat geputzt
> example: Am Samstag haben wir die Wohnung **geputzt**. — У суботу ми прибрали квартиру.
> note: Zähne putzen = чистити зуби. tz = [ts].

> [!word] fliegen
> ipa: /ˈfliːɡn̩/ · pos: verb · level: A1 · id: de-a1-perfekt-w14
> uk: літати; летіти
> forms: fliegen → flog → ist geflogen
> example: Wir sind nach Wien **geflogen**. — Ми полетіли до Відня.
> note: Perfekt з sein (рух). der Flug = політ, der Flughafen = аеропорт.

> [!word] holen
> ipa: /ˈhoːlən/ · pos: verb · level: A1 · id: de-a1-perfekt-w15
> uk: приносити; йти по щось
> forms: holen → holte → hat geholt
> example: Ich habe Brot **geholt**. — Я сходив по хліб.
> note: h — легкий видих; o довге.

> [!word] schicken
> ipa: /ˈʃɪkn̩/ · pos: verb · level: A1 · id: de-a1-perfekt-w16
> uk: надсилати
> forms: schicken → schickte → hat geschickt
> example: Er hat mir eine SMS **geschickt**. — Він надіслав мені SMS.
> note: ck = короткий приголосний [k]. sch- = «ш».

> [!word] erklären
> ipa: /ɛɐ̯ˈklɛːʁən/ · pos: verb · level: A1 · id: de-a1-perfekt-w17
> uk: пояснювати
> forms: erklären → erklärte → hat erklärt
> example: Der Lehrer hat die Regel **erklärt**. — Учитель пояснив правило.
> note: префікс er- ненаголошений, тому Partizip без ge-: erklärt.

> [!word] gewinnen
> ipa: /ɡəˈvɪnən/ · pos: verb · level: A1 · id: de-a1-perfekt-w18
> uk: вигравати; перемагати
> forms: gewinnen → gewann → hat gewonnen
> example: Unser Team hat **gewonnen**. — Наша команда перемогла.
> note: ge- уже в інфінітиві, нове ge- не додається: gewonnen.

> [!word] kennenlernen
> ipa: /ˈkɛnənˌlɛʁnən/ · pos: verb · level: A1 · id: de-a1-perfekt-w19
> uk: знайомитися
> forms: kennenlernen → lernte kennen → hat kennengelernt
> example: Ich habe sie im Deutschkurs **kennengelernt**. — Я познайомився з нею на курсі німецької.
> note: відокремлюване: Ich lerne dich kennen. Partizip пишемо разом: kennengelernt.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-perfekt-l01
> audio: Ich habe gestern Fußball gespielt.
> - [ ] Ich bin gestern Fußball gespielt.
> - [x] Ich habe gestern Fußball gespielt.
> - [ ] Ich spiele gestern Fußball.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-perfekt-l02
> audio: Er ist nach Berlin gefahren.
> - [x] Er ist nach Berlin gefahren.
> - [ ] Er hat nach Berlin gefahren.
> - [ ] Er fährt nach Berlin.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-perfekt-l03
> audio: Was hast du gestern gemacht?

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-perfekt-l04
> audio: Wir sind am Wochenende nach Köln gefahren.

> [!listen] Послухай діалог. Що Лена робила на вихідних?
> level: A1 · type: answer · speed: slow · id: de-a1-perfekt-l05
> audio: A: Hallo, Lena! Was hast du am Wochenende gemacht?
> audio: B: Am Samstag habe ich Freunde getroffen, und wir haben zusammen gekocht. Am Sonntag bin ich zu Hause geblieben.
> - [ ] Вона поїхала до Берліна.
> - [x] У суботу готувала з друзями, у неділю залишилася вдома.
> - [ ] Весь час працювала.

> [!listen] Послухай діалог. Чому Макс не прийшов?
> level: A1 · type: answer · speed: slow · id: de-a1-perfekt-l06
> audio: A: Max, warum bist du gestern nicht gekommen?
> audio: B: Entschuldigung, ich habe es vergessen! Ich habe den ganzen Tag gearbeitet.
> - [ ] Він захворів.
> - [x] Він забув і цілий день працював.
> - [ ] Він загубив ключі.

## Вимова

У формах Perfekt більшість наголошених складів — на **Partizip**-корені: *gemácht, gegéssen, gefáhren* (префікс *ge-* ненаголошений: [ɡə]). Префікси *be-, ver-* теж без наголосу: *besúcht, vergéssen*. Звук **ch** в *gemacht, gekocht* — ach-Laut [x]; **st-** у *gestanden, aufgestanden* — «шт».

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-perfekt-s01
> text: Was hast du gestern gemacht?
> ipa: /vas hast duː ˈɡɛstɐn ɡəˈmaxt/
> tip: gestern — «ґестерн», наголос на першому складі. gemacht — ge-MACHT, ch після a = [x].
> uk: Що ти робив учора?

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-perfekt-s02
> text: Ich habe Pizza gegessen.
> ipa: /ɪç ˈhaːbə ˈpɪtsa ɡəˈɡɛsn̩/
> tip: Pizza — z = [ts]: «піца». gegessen — ґе-ҐЕсн: два «ґ» поспіль.
> uk: Я їв піцу.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-perfekt-s03
> text: Wir sind nach Köln gefahren.
> ipa: /viːɐ̯ zɪnt naːx kœln ɡəˈfaːʁən/
> tip: nach — [x]. Köln — ö як губи «о», язик «е»; ln без «е» між ними. gefahren — довге a.
> uk: Ми поїхали до Кельна.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-perfekt-s04
> text: Sie ist um sieben Uhr aufgestanden.
> ipa: /ziː ɪst ʊm ˈziːbn̩ uːɐ̯ ˈaʊ̯fɡəˌʃtandn̩/
> tip: aufgestanden — наголос на auf-, st- = «шт»: «ауф-ге-штанден».
> uk: Вона встала о сьомій.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-perfekt-s05
> text: Ich habe den Film noch nicht gesehen.
> ipa: /ɪç ˈhaːbə deːn fɪlm nɔx nɪçt ɡəˈzeːən/
> tip: noch nicht — спочатку [x], потім [ç]. gesehen — довге e, h не звучить.
> uk: Я ще не бачив цей фільм.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-perfekt-s06
> text: Hast du schon gegessen?
> ipa: /hast duː ʃoːn ɡəˈɡɛsn̩/
> tip: питання «так / ні» — голос угору ↗. schon — sch = «ш», довге o.
> uk: Ти вже їв?

## Типові помилки українців

> [!pitfall] Допоміжного дієслова немає: «Gestern ich gemacht»
> Українське «я зробив» не потребує допоміжного дієслова, а німецьке Perfekt — потребує: *Ich **habe** gemacht*. Ніколи не залишай Partizip сам: *Gestern **habe** ich Hausaufgaben **gemacht**.* Перевір: чи є *haben* або *sein* на другому місці?

> [!pitfall] Partizip не в кінці: «Ich habe gemacht meine Hausaufgaben»
> Українською ми кажемо «я зробив домашку», і порядок вільний. У німецькій Partizip **завжди в кінці**: *Ich habe meine Hausaufgaben **gemacht**.* Те саме з рухом: *Ich bin gestern ins Kino **gegangen**.*

> [!pitfall] «Ich habe gefahren» і «Ich habe gegangen»
> Дієслова руху й зміни стану беруть **sein**: *Ich **bin** nach Berlin **gefahren**, wir **sind** nach Hause **gegangen**, er **ist** aufgestanden.* Українське «я поїхав» не підказує, яке допоміжне дієслово, тому вчи: *fahren — ist gefahren*, *gehen — ist gegangen*.

> [!pitfall] ge- там, де його немає: «gebesucht», «getelefoniert», «gevergessen»
> Дієслова з префіксами **be-, ver-, er-, ent-** і дієслова на **-ieren** мають Partizip **без ge-**: *besucht, bekommen, verstanden, telefoniert, passiert.* Поставити зайве *ge-* — типова помилка. Відокремлювані дієслова ставлять *ge-* усередину: *aufgestanden, eingekauft, angerufen.*

## Ситуація: що було на вихідних

> [!listen] Послухай розмову колег у понеділок. Що правда?
> level: A1 · type: answer · speed: slow · id: de-a1-perfekt-l07
> audio: A: Guten Morgen, Tom! Was hast du am Wochenende gemacht?
> audio: B: Am Samstag bin ich nach Hamburg gefahren. Ich habe meine Schwester besucht. Wir haben zusammen Pizza gegessen.
> audio: A: Und am Sonntag?
> audio: B: Am Sonntag habe ich lange geschlafen und Filme gesehen.
> - [x] У суботу Том їздив до сестри в Гамбург, у неділю відпочивав.
> - [ ] У суботу Том працював, у неділю поїхав до Гамбурга.
> - [ ] Том усі вихідні був у Гамбурзі.

> [!speak] «Я поїхав до Гамбурга і відвідав сестру.»
> level: A1 · speed: slow · id: de-a1-perfekt-s07
> text: Ich bin nach Hamburg gefahren und habe meine Schwester besucht.
> ipa: /ɪç bɪn naːx ˈhambʊʁk ɡəˈfaːʁən ʊnt ˈhaːbə ˈmaɪ̯nə ˈʃvɛstɐ bəˈzuːxt/
> tip: два дієслова — два Partizip: gefahren і besucht (без ge-). Hamburg — g у кінці стає [k].
> uk: Я поїхав до Гамбурга і відвідав сестру.

## Практика

> [!quiz] Обери допоміжне дієслово: «Wir ___ gestern Pizza gegessen.»
> level: A1 · type: single · id: de-a1-perfekt-q02
> - [ ] sind
> - [x] haben
> - [ ] bin
> - [ ] hat
>
> **Пояснення:** *essen* — дія з предметом, без руху: **haben**. Для *wir* — *haben*, не *hat* (це для *er / sie / es*).

> [!quiz] Обери допоміжне дієслово: «Ich ___ nach Wien gefahren.»
> level: A1 · type: single · id: de-a1-perfekt-q03
> - [ ] habe
> - [x] bin
> - [ ] ist
> - [ ] hat
>
> **Пояснення:** *fahren* — рух з місця на місце, тому **sein**. Для *ich* — *bin*, не *ist*.

> [!quiz] Яке з речень правильне?
> level: A1 · type: single · id: de-a1-perfekt-q04
> - [ ] Ich habe gestern gemacht meine Hausaufgaben.
> - [ ] Ich meine Hausaufgaben gemacht habe gestern.
> - [x] Ich habe gestern meine Hausaufgaben gemacht.
> - [ ] Ich gemacht habe gestern meine Hausaufgaben.
>
> **Пояснення:** *habe* — на другому місці, *gemacht* — у кінці речення. Усе інше (*gestern, meine Hausaufgaben*) — між ними.

> [!quiz] Яке Partizip II від telefonieren правильне?
> level: A1 · type: single · id: de-a1-perfekt-q05
> - [ ] getelefoniert
> - [x] telefoniert
> - [ ] telefonieret
> - [ ] getelefont
>
> **Пояснення:** дієслова на **-ieren** не беруть *ge-*: *telefoniert, passiert, studiert*.

> [!quiz] Яка форма Partizip II від besuchen?
> level: A1 · type: single · id: de-a1-perfekt-q06
> - [ ] gebesucht
> - [x] besucht
> - [ ] gebesuchen
> - [ ] besuchen
>
> **Пояснення:** префікс *be-* не наголошений, тому *ge-* не додається: *besucht*. Форма *gebesucht* — типова помилка українців.

> [!quiz] Які речення правильні? Обери всі.
> level: A1 · type: multi · id: de-a1-perfekt-q07
> - [x] Wir sind nach Köln gefahren.
> - [ ] Wir haben nach Köln gefahren.
> - [x] Sie hat den Film gesehen.
> - [ ] Sie ist den Film gesehen.
>
> **Пояснення:** *fahren* (рух) → *sein*; *sehen* (дія з обʼєктом) → *haben*.

> [!quiz] У яких реченнях потрібно sein? Обери всі.
> level: A1 · type: multi · id: de-a1-perfekt-q08
> - [x] Er ___ um 6 Uhr aufgestanden.
> - [ ] Ich ___ Brot gekauft.
> - [x] Wir ___ zu Hause geblieben.
> - [ ] Sie ___ lange telefoniert.
>
> **Пояснення:** *aufstehen* — зміна стану, *bleiben* — виняток: обидва з **sein**. *kaufen* і *telefonieren* — *haben*.

> [!quiz] Заповни пропуски допоміжними дієсловами
> level: A1 · type: fill · bank: hat, bin · id: de-a1-perfekt-q09
>
> ```text fill
> Gestern [[habe]] ich Fußball gespielt.
> Am Sonntag [[sind]] wir nach Berlin gefahren.
> Anna [[ist]] früh aufgestanden.
> Tim und Lena [[haben]] eingekauft.
> ```
>
> **Пояснення:** *spielen* і *einkaufen* — *haben*, *fahren* і *aufstehen* — *sein*. *Anna* = *sie* → *ist*; *wir* → *sind*; *Tim und Lena* → *haben*.

> [!quiz] Заповни пропуски формами Partizip II
> level: A1 · type: fill · bank: gemachen, getelefoniert, gebesucht · id: de-a1-perfekt-q10
>
> ```text fill
> Ich habe Hausaufgaben [[gemacht]].
> Sie hat lange mit ihrer Oma [[telefoniert]].
> Wir haben das Museum [[besucht]].
> Er hat Kaffee [[getrunken]].
> ```
>
> **Пояснення:** слабке дієслово — *gemacht*; *telefonieren* і *besuchen* — без *ge-*; *trinken* — сильне: *getrunken*.

> [!quiz] Заповни пропуски: розмова про вихідні
> level: A1 · type: fill · bank: gegeht, gesehet · id: de-a1-perfekt-q11
>
> ```text fill
> A: Was [[hast]] du am Samstag gemacht?
> B: Ich bin ins Kino [[gegangen]]. Ich habe einen neuen Film [[gesehen]].
> A: Hast du auch Popcorn [[gegessen]]?
> B: Nein, ich habe [[kein]] Popcorn gegessen.
> ```
>
> **Пояснення:** питання з *du* — *hast*; *gehen* → *gegangen* (з *bin*); *sehen* → *gesehen*; *essen* → *gegessen*; з іменником без артикля — *kein*. Форми *gegeht* і *gesehet* — типові помилки: сильні дієслова мають свої Partizip.

> [!quiz] Заповни пропуски: Partizip відокремлюваних дієслів
> level: A1 · type: fill · bank: aufgestehen, geeinkauft · id: de-a1-perfekt-q12
>
> ```text fill
> Ich bin um 7 Uhr [[aufgestanden]].
> Wir haben im Supermarkt [[eingekauft]].
> Er hat seine Mutter [[angerufen]].
> ```
>
> **Пояснення:** у відокремлюваних дієсловах *ge-* стоїть між префіксом і коренем: *aufgestanden, eingekauft, angerufen*. Форми *aufgestehen* і *geeinkauft* — типові помилки: *ge-* стоїть між префіксом і коренем, а корінь змінюється за сильним чи слабким типом.

> [!quiz] Склади речення: «Вчора я купив хліб»
> level: A1 · type: order · id: de-a1-perfekt-q13
>
> ```text order
> Gestern
> habe
> ich
> Brot
> gekauft.
> bin ✗
> ```
>
> **Пояснення:** обставина на першому місці → *habe* → *ich* → … → Partizip у кінці. *kaufen* з **haben**, тому *bin* зайве.

> [!quiz] Склади речення: «Ми поїхали до Кельна»
> level: A1 · type: order · id: de-a1-perfekt-q14
>
> ```text order
> Wir
> sind
> nach
> Köln
> gefahren.
> haben ✗
> ```
>
> **Пояснення:** *fahren* — рух, тому **sind**. Partizip *gefahren* — у кінці.

> [!quiz] Склади питання: «Що ти робив учора?»
> level: A1 · type: order · id: de-a1-perfekt-q15
>
> ```text order
> Was
> hast
> du
> gestern
> gemacht?
> machst ✗
> ```
>
> **Пояснення:** W-слово → *hast* → *du* → … → Partizip *gemacht* у кінці. *machst* — Präsens, він не підходить до Perfekt.

> [!quiz] Склади речення: «Я ще не бачив цей фільм»
> level: A1 · type: order · id: de-a1-perfekt-q16
>
> ```text order
> Ich
> habe
> den
> Film
> noch
> nicht
> gesehen.
> kein ✗
> ```
>
> **Пояснення:** *noch nicht* стоїть перед Partizip. *kein* — лише з іменником без артикля, а тут є *den Film*.

## Фішки

> [!reel] 🚆 haben чи sein — так і в французькій
> Те, що рух вимагає окремого допоміжного дієслова, — не вигадка німців. У французькій *aller* («йти») теж у складному минулому з *être* («бути»): *il est allé*. Німецьке *Ich bin gefahren* і французьке *je suis allé* мають однакову логіку: рух — це про «бути» десь інде, а не про «мати».

> [!reel] 🗣️ «Ich habe fertig!»
> 10 березня 1998 року тренер «Баварії» Джованні Трапаттоні на прес-конференції емоційно закінчив промову словами «Ich habe fertig!». Німці почули в цьому помилку: правильно *Ich bin fertig* («я закінчив»), а розмовне *etwas fertig haben* стосується справи: *Ich habe die Arbeit fertig*. Фраза стала крилатою.

> [!reel] 🏔️ Південь: «Ich bin gestanden»
> У Баварії, Австрії та Швейцарії кажуть *Ich bin gestanden* і *Ich bin gesessen* — із *sein* для «стояти» й «сидіти». У стандартній німецькій і в підручниках — *Ich habe gestanden, ich habe gesessen*. Обидві форми розуміють усі.

## Джерела та що почитати

- [DWDS — Perfekt](https://www.dwds.de/wb/Perfekt) — термін, значення, приклади.
- [Duden — Perfekt](https://www.duden.de/rechtschreibung/Perfekt) — граматичний термін і вживання.
- [FC Bayern — «Ich habe fertig!»: річниця легендарної прес-конференції Трапаттоні](https://fcbayern.com/de/news/2023/03/ich-habe-fertig-jahrestag-von-trapattonis-legendaerer-pressekonferenz) — дата (10.03.1998) і контекст.
- [DWDS — fertig](https://www.dwds.de/wb/fertig) — значення слова *fertig*.
- [DW Learn German — Nicos Weg (A1)](https://learngerman.dw.com/en/beginners/c-36519789) — безкоштовний відеокурс; Perfekt у розмовних ситуаціях.
- Goethe-Institut — сторінка іспиту *Goethe-Zertifikat A1: Start Deutsch 1* на goethe.de: Perfekt лишається на рівні A1 у вигляді шматків.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділ «Perfekt».

> [!important] Підсумок
> - У розмові минуле — **Perfekt**: *haben / sein* (2-ге місце) + **Partizip II** (в кінці).
> - Слабкі: *ge-…-t* (*gemacht*); сильні — *ge-…-en* (*gegessen*, зміна голосної); без *ge-* — *-ieren, be-, ver-, er-, ent-*; відокремлювані — *ge-* усередині.
> - **sein** — лише для руху, зміни стану й винятків *sein, bleiben, passieren*; решта — **haben**.
> - Заперечення: *Ich habe nicht gearbeitet / kein Brot gekauft / noch nicht gesehen*.
> - Не пропускай допоміжне дієслово й не залишай Partizip посеред речення.
