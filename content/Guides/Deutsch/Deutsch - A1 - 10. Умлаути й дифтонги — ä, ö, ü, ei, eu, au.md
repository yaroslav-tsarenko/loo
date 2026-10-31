---
title: Умлаути й дифтонги — ä, ö, ü, ei, eu, au
id: de-a1-umlaute
level: A1
icon: px:mic
tags: [deutsch, a1, pronunciation, umlaute, diphthonge]
prerequisites: ["[[Deutsch - A1 - 05. Довгі й короткі голосні]]"]
estimatedMinutes: 35
---

# Умлаути й дифтонги — ä, ö, ü, ei, eu, au

> [!success] Після цієї теми ти зможеш
> - правильно вимовити **ü** (губи «у», язик «і») і **ö** (губи «о», язик «е»), а не «ю» й «йо»;
> - прочитати **ä** як [ɛː] або [ɛ] і не підміняти його на «я»;
> - розрізняти **ei** [aɪ̯] і **ie** [iː] (*Wein / Wien*, *Bein / Bier*) та вимовляти **eu / äu** [ɔʏ̯] і **au** [aʊ̯];
> - чути різницю в парах *schon / schön*, *Mutter / Mütter*, *Tür / Tier*, *Haus / Häuser*.

## Передбач

> [!quiz] Яке слово ти почуєш, якщо німець скаже [viːn]?
> level: A1 · type: single · id: de-a1-umlaute-q01
> - [ ] Wein
> - [x] Wien
> - [ ] Wind
> - [ ] Wand
>
> **Пояснення:** *Wien* /viːn/ — столиця Австрії, *ie* читаємо як довге [iː]. *Wein* /vaɪ̯n/ — «вино», *ei* читаємо як дифтонг [aɪ̯], тобто «вайн». Правило: перша літера дифтонга **e** + **i** = «ай»; у **ie** читаємо лише довге «і».

## Три умлаути: ä, ö, ü

Літери **ä, ö, ü** — це окремі голосні, а не «a, o, u з крапками». Вони потрібні, щоб розрізняти слова й форми: *Mutter / Mütter*, *schon / schön*, *Bruder / Brüder*. Кожна має довгий і короткий варіант, як ми бачили в темі [[Deutsch - A1 - 05. Довгі й короткі голосні]].

| Літера | Довгий | Короткий | Як утворити | Приклад |
|---|---|---|---|---|
| **ü** | [yː] | [ʏ] | губи як для «у», язик як для «і» | *Tür* /tyːɐ̯/, *Hütte* /ˈhʏtə/ |
| **ö** | [øː] | [œ] | губи як для «о», язик як для «е» | *schön* /ʃøːn/, *können* /ˈkœnən/ |
| **ä** | [ɛː] | [ɛ] | відкрите «е», як у «день» | *Bär* /bɛːɐ̯/, *Männer* /ˈmɛnɐ/ |

> [!tip] ü і ö — це «і» й «е» з округленими губами
> **ü**: скажи довге «і» й, не змінюючи положення язика, витягни губи вперед трубочкою, як для «у». **ö**: скажи «е» й округли губи, як для «о». Саме тому *ü ≠ «ю»* і *ö ≠ «йо»*: в «ю» та «йо» є додатковий звук «й» і язик рухається, а в німецьких голосних язик нерухомий.

**ä** — найлегший: у стандартній мові довге [ɛː] (*Bär, spät, fährt*) і коротке [ɛ] (*Männer, hängen*) — це відкрите «е». На практиці коротке **ä** майже не відрізняється від короткого **e**: *Männer* і *kennen* мають однаковий голосний. Багато німців вимовляють і довге **ä** як закрите [eː]. Тож головна помилка — не «неточне ä», а вимова **ä** як українське «я».

> [!diagram] Як утворити ü, ö і ä
> ```yaml
> layout: compare
> columns: { a: "ü", b: "ö", c: "ä" }
> nodes:
>   - { id: a1, col: a, label: "язик як для", text: "«і»", tone: yellow }
>   - { id: a2, col: a, label: "губи як для", text: "«у»", tone: pink }
>   - { id: a3, col: a, label: "приклад", text: "Tür · müde", tone: gray }
>   - { id: b1, col: b, label: "язик як для", text: "«е»", tone: yellow }
>   - { id: b2, col: b, label: "губи як для", text: "«о»", tone: pink }
>   - { id: b3, col: b, label: "приклад", text: "schön · hören", tone: gray }
>   - { id: c1, col: c, label: "язик і губи", text: "відкрите «е»", tone: yellow }
>   - { id: c2, col: c, label: "губи", text: "розслаблені", tone: pink }
>   - { id: c3, col: c, label: "приклад", text: "Bär · spät", tone: gray }
> steps:
>   - { focus: [a1, a2, a3], note: "ü: скажи «і» й, не рухаючи язиком, витягни губи трубочкою. Звук один, без «й»: Tür, не «тюр»." }
>   - { focus: [b1, b2, b3], note: "ö: скажи «е» й округли губи, як для «о». Звук один: schön, не «шойн»." }
>   - { focus: [c1, c2, c3], note: "ä: відкрите «е», губи не округлюємо. Не «я»: Bär — «бер», а не «бяр»." }
>   - { set: { a3: "Mutter → Mütter", b3: "schon → schön" }, focus: [a3, b3], note: "Умлаут змінює слово: Mutter → Mütter (множина), schon → schön. Тому слухай і голосний, і літеру." }
> ```
> Не «ю», не «йо», не «я»: у ü, ö, ä немає звука «й», а язик не рухається.

### Умлаут у граматиці

У німецькій умлаут часто зʼявляється в **множині** (*der Bruder → die Brüder*, *der Baum → die Bäume*, *das Haus → die Häuser*) і в формах дієслів (*ich fahre → er fährt*). Про це детальніше — в темах про множину й дієслова з чергуванням. Тут важливо чути: **літера змінилась — звук змінився**.

### Без клавіатури: ae, oe, ue

Якщо на клавіатурі немає умлаутів, їх пишуть як **ae, oe, ue**: *Müller → Mueller*, *schön → schoen*, *Bär → Baer*. Так пишуть email-адреси й імена в системах без діакритики. Не читай це як «м-у-е-л-л-е-р»: це лише заміна літери.

## Дифтонги: ei, eu / äu, au

Дифтонг — це **один склад**, у якому звук плавно змінюється від початку до кінця. У німецькій їх три:

| Написання | Звук | Читається приблизно як | Приклад |
|---|---|---|---|
| **ei** (також **ai**, рідко **ey**) | [aɪ̯] | «ай» | *Wein* /vaɪ̯n/, *Eis* /aɪ̯s/, *Mai* |
| **eu**, **äu** | [ɔʏ̯] | «ой» з округленими губами | *neu* /nɔʏ̯/, *Häuser* /ˈhɔʏ̯zɐ/ |
| **au** | [aʊ̯] | «ау» | *Haus* /haʊ̯s/, *Baum* /baʊ̯m/ |

Другий елемент дифтонга ([ɪ̯], [ʏ̯], [ʊ̯]) дуже короткий, нескладовий: це «відсвіт» у кінці голосного, а не окремий склад.

### ei ≠ ie

Це найпопулярніша пастка на A1. Два сполучення виглядають як дзеркальні, але читаються по-різному:

| | Звук | Як читати | Приклад |
|---|---|---|---|
| **ei** | [aɪ̯] — дифтонг | «ай» | *Wein, Bein, Stein, klein* |
| **ie** | [iː] — довге «і» | «і-і» | *Wien, Bier, Tier, Lied* |

> [!tip] Читай другу літеру
> У **ie** другу літеру *e* не читаємо — вона лише показує, що **i** довге. У **ei** обидві літери «працюють»: звук починається з *e* (близько до «а») і закінчується на *i*. Запамʼятай: *ei = ай* (як в англійському *eye*), *ie = і-і* (як в українському «мі-і-ір»).

> [!diagram] Одне слово — два сполучення літер
> ```yaml
> layout: compare
> columns: { a: "ei", b: "ie" }
> nodes:
>   - { id: a1, col: a, label: "звук", text: "[aɪ̯] «ай»", tone: yellow }
>   - { id: a2, col: a, label: "приклад", text: "Wein · Bein", tone: gray }
>   - { id: a3, col: a, label: "переклад", text: "вино · нога", tone: gray }
>   - { id: b1, col: b, label: "звук", text: "[iː] довге «і»", tone: pink }
>   - { id: b2, col: b, label: "приклад", text: "Wien · Bier", tone: gray }
>   - { id: b3, col: b, label: "переклад", text: "Відень · пиво", tone: gray }
> steps:
>   - { focus: [a1, a2, a3], note: "ei — дифтонг [aɪ̯]: Wein — «вайн», Bein — «байн». Голосний змінюється від «а» до «и» у межах одного складу." }
>   - { focus: [b1, b2, b3], note: "ie — довге [iː]: Wien — «віін», Bier — «біір». Нічого не змінюється, звук рівний і довгий." }
>   - { set: { a2: "Stein · Mai", b2: "Lied · Tier" }, focus: [a2, b2], note: "Майже завжди: ei → «ай», ie → довге «і». Вчи слова разом з написанням." }
> ```
> Подумай про два слова — *Wein* і *Wien*, і про різницю, яка коштує слів «вино» і «Відень».

> [!note] eu і äu — те саме
> **eu** і **äu** звучать однаково: [ɔʏ̯]. Якщо в слові з **au** зʼявляється умлаут (у множині), воно пишеться **äu**: *Haus → Häuser*, *Baum → Bäume*, *Traum → Träume*. Такі слова легко вгадати, якщо знаєш, що в однині.

## Приклади

- Das Mädchen ist schön. — Дівчинка красива.
- Ich bin müde, die Tür ist offen. — Я втомлений, двері відчинені.
- Mein Vater und meine Brüder wohnen in Köln. — Мій тато й мої брати живуть у Кельні.
- Wir trinken Wein in Wien. — Ми пʼємо вино у Відні.
- Das Haus ist neu, die Häuser sind alt. — Будинок новий, будинки старі.
- Die Leute sind heute freundlich. — Люди сьогодні привітні.
- Ich möchte ein Eis. — Я хотів би морозиво.
- Wir hören Lieder und lernen Deutsch. — Ми слухаємо пісні й вчимо німецьку.
- Die Maus läuft über die Wiese. — Миша біжить луговиною.
- Der Bär ist ähnlich groß wie ein Pferd. — Ведмідь величиною приблизно як кінь.

## Слова

> [!word] fühlen
> ipa: /ˈfyːlən/ · pos: verb · level: A1 · id: de-a1-umlaute-w01
> uk: відчувати; почуватися
> forms: er fühlt · fühlte · hat gefühlt
> example: Ich **fühle** mich heute gut. — Я сьогодні добре себе почуваю.
> note: fühlen + sich: Wie fühlst du dich? ü — довге [yː], губи трубочкою.

> [!word] die Tüte
> ipa: /ˈtyːtə/ · pos: noun · level: B1 · id: de-a1-umlaute-w02
> uk: пакет; торба (паперовий або пластиковий)
> forms: die Tüten
> example: Brauchen Sie eine **Tüte**? — Вам потрібен пакет?
> note: у супермаркеті часто запитують саме так. AT, CH: часто das Sackerl (AT), das Säckli (CH).

> [!word] die Mütze
> ipa: /ˈmʏtsə/ · pos: noun · level: A2 · id: de-a1-umlaute-w03
> uk: шапка; кашкет
> forms: die Mützen
> example: Im Winter trage ich eine **Mütze**. — Узимку я ношу шапку.
> note: короткий [ʏ]: tz дає короткий голосний + [ts]. AT: часто die Haube/Kappe.

> [!word] kühl
> ipa: /kyːl/ · pos: adj · level: A2 · id: de-a1-umlaute-w04
> uk: прохолодний
> example: Heute ist es ein bisschen **kühl**. — Сьогодні трохи прохолодно.
> note: ü — довге [yː]. Kuh /kuː/ — корова: u і ü обидва з округленими губами, різниця лише в положенні язика.

> [!word] schön
> ipa: /ʃøːn/ · pos: adj · level: A1 · id: de-a1-umlaute-w05
> uk: гарний; красивий; приємний
> example: Das Wetter ist heute **schön**. — Сьогодні гарна погода.
> note: schön ≠ schon (вже). ö — довге [øː]: губи «о», язик «е».

> [!word] böse
> ipa: /ˈbøːzə/ · pos: adj · level: A1 · id: de-a1-umlaute-w06
> uk: злий; сердитий
> example: Keine Angst, der Hund ist nicht **böse**. — Не бійся, пес не злий.
> note: ö довге [øː]; s між голосними — дзвінке [z]. Böse sein auf + Akk — сердитися на когось.

> [!word] der Löffel
> ipa: /ˈlœfl̩/ · pos: noun · level: A2 · id: de-a1-umlaute-w07
> uk: ложка
> forms: die Löffel
> example: Die Suppe isst man mit dem **Löffel**. — Суп їдять ложкою.
> note: короткий [œ] (ff). Множина без закінчення: die Löffel. Комплект: Messer, Gabel, Löffel.

> [!word] der Löwe
> ipa: /ˈløːvə/ · pos: noun · level: A2 · id: de-a1-umlaute-w08
> uk: лев
> forms: die Löwen
> example: Der **Löwe** schläft in der Sonne. — Лев спить на сонці.
> note: слабка відміна: den Löwen. w = [v]. Перша частина — довге [øː]: губи «о», язик «е».

> [!word] der Bär
> ipa: /bɛːɐ̯/ · pos: noun · level: A2 · id: de-a1-umlaute-w09
> uk: ведмідь
> forms: die Bären
> example: Der **Bär** schläft im Winter in der Höhle. — Ведмідь взимку спить у барлозі.
> note: слабка відміна: den Bären. ä — довге [ɛː] (у багатьох — [eː]). Berlin — на гербі ведмідь.

> [!word] der Zahn
> ipa: /tsaːn/ · pos: noun · level: A1 · id: de-a1-umlaute-w10
> uk: зуб
> forms: die Zähne
> example: Ich putze mir zweimal am Tag die **Zähne**. — Я чищу зуби двічі на день.
> note: h німе (Dehnungs-h). z = «ц». Множина — з умлаутом: Zähne /ˈtsɛːnə/. Лікар — der Zahnarzt.

> [!word] ähnlich
> ipa: /ˈɛːnlɪç/ · pos: adj · level: A1 · id: de-a1-umlaute-w11
> uk: схожий; подібний
> example: Die Schwestern sehen sich **ähnlich**. — Сестри схожі одна на одну.
> note: ä — довге [ɛː]; -lich = [lɪç]. «Схожий на» — ähnlich + Dat: Er ist seinem Vater ähnlich.

> [!word] der Käfer
> ipa: /ˈkɛːfɐ/ · pos: noun · level: B1 · id: de-a1-umlaute-w12
> uk: жук
> forms: die Käfer
> example: Auf dem Blatt sitzt ein **Käfer**. — На листку сидить жук.
> note: ä довге [ɛː], -er = [ɐ]. VW Käfer — знаменитий «жук». Множина без закінчення.

> [!word] das Eis
> ipa: /aɪ̯s/ · pos: noun · level: A1 · id: de-a1-umlaute-w13
> uk: морозиво; лід
> forms: — (зазвичай без множини)
> example: Ein **Eis**, bitte! Schokolade und Vanille. — Одне морозиво, будь ласка! Шоколадне й ванільне.
> note: ei = «ай»: «айс». У кафе: eine Kugel Eis — одна кулька морозива. Eisdiele — кафе-морозиво.

> [!word] die Reise
> ipa: /ˈʁaɪ̯zə/ · pos: noun · level: A1 · id: de-a1-umlaute-w14
> uk: подорож
> forms: die Reisen
> example: Gute **Reise**! — Щасливої дороги!
> note: s між голосними — дзвінке [z]; ei = [aɪ̯]. Дієслово: reisen — Wir reisen nach Wien.

> [!word] heiß
> ipa: /haɪ̯s/ · pos: adj · level: A1 · id: de-a1-umlaute-w15
> uk: гарячий; спекотний
> forms: heiß · heißer · am heißesten
> example: Der Tee ist noch **heiß**. — Чай ще гарячий.
> note: ei = [aɪ̯]; ß = глухе [s]. CH: heiss. Не плутай з heißen (називатися).

> [!word] das Tier
> ipa: /tiːɐ̯/ · pos: noun · level: A1 · id: de-a1-umlaute-w16
> uk: тварина
> forms: die Tiere
> example: Welches **Tier** magst du am liebsten? — Яку тварину ти любиш найбільше?
> note: ie = довге [iː]. Die Tür — двері: Tür /tyːɐ̯/ ≠ Tier /tiːɐ̯/. Домашня тварина — das Haustier.

> [!word] das Lied
> ipa: /liːt/ · pos: noun · level: A1 · id: de-a1-umlaute-w17
> uk: пісня
> forms: die Lieder
> example: Dieses **Lied** gefällt mir sehr. — Ця пісня мені дуже подобається.
> note: ie = [iː]; d наприкінці слова = [t]: «літ». Множина: die Lieder /ˈliːdɐ/ — d знову дзвінке.

> [!word] die Wiese
> ipa: /ˈviːzə/ · pos: noun · level: A2 · id: de-a1-umlaute-w18
> uk: луг; галявина
> forms: die Wiesen
> example: Die Kinder spielen auf der **Wiese**. — Діти граються на галявині.
> note: w = «в»; ie = [iː]; s між голосними — [z]. Баварське die Wiesn — розмовна назва Oktoberfest (Theresienwiese у Мюнхені).

> [!word] neu
> ipa: /nɔʏ̯/ · pos: adj · level: A1 · id: de-a1-umlaute-w19
> uk: новий
> forms: neu · neuer · am neuesten
> example: Ist das Handy **neu**? — Цей телефон новий?
> note: eu = [ɔʏ̯]: «ной», а не «неу». Протилежність — alt.

> [!word] die Leute
> ipa: /ˈlɔʏ̯tə/ · pos: noun · level: A1 · id: de-a1-umlaute-w20
> uk: люди (група людей)
> forms: — (лише множина)
> example: Viele **Leute** warten an der Haltestelle. — Багато людей чекає на зупинці.
> note: лише множина: die Leute sind… ; одна людина — der Mensch, die Person. eu = [ɔʏ̯].

> [!word] der Traum
> ipa: /tʁaʊ̯m/ · pos: noun · level: A2 · id: de-a1-umlaute-w21
> uk: сон; мрія
> forms: die Träume
> example: Das war ein schöner **Traum**! — Це був гарний сон!
> note: au → äu у множині: Träume /ˈtʁɔʏ̯mə/. Traumhaft schön — казково гарно.

> [!word] der Baum
> ipa: /baʊ̯m/ · pos: noun · level: A1 · id: de-a1-umlaute-w22
> uk: дерево
> forms: die Bäume
> example: Im Park stehen alte **Bäume**. — У парку стоять старі дерева.
> note: au = [aʊ̯]; у множині äu = [ɔʏ̯]: Bäume /ˈbɔʏ̯mə/. Різдвяна ялинка — der Weihnachtsbaum.

> [!word] die Maus
> ipa: /maʊ̯s/ · pos: noun · level: A1 · id: de-a1-umlaute-w23
> uk: миша
> forms: die Mäuse
> example: Die **Maus** sitzt neben dem Computer. — Миша сидить біля компʼютера.
> note: також «компʼютерна миша». Множина — з äu: Mäuse /ˈmɔʏ̯zə/.

> [!word] laufen
> ipa: /ˈlaʊ̯fn̩/ · pos: verb · level: A1 · id: de-a1-umlaute-w24
> uk: бігти; бігати; йти (про годину, фільм)
> forms: er läuft · lief · ist gelaufen
> example: Ich **laufe** jeden Morgen im Park. — Я щоранку бігаю в парку.
> note: a → ä у du läufst, er läuft. Розмовно також «йти пішки»: Wir sind zu Fuß gelaufen. Транспорт — fahren, не laufen.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-umlaute-l01
> audio: Das Mädchen ist schön.
> - [ ] Das Mädchen ist schon da.
> - [x] Das Mädchen ist schön.
> - [ ] Das Mädchen ist schon.
>
> **Пояснення:** *schön* /ʃøːn/ має округлені губи й [øː], а *schon* /ʃoːn/ — звичайне [oː] («вже»). Друге речення було б *Das Mädchen ist schon da* — «Дівчинка вже тут».

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-umlaute-l02
> audio: Das Tier ist im Haus.
> - [ ] Die Tür ist im Haus.
> - [x] Das Tier ist im Haus.
> - [ ] Das Tier ist im Heu.
>
> **Пояснення:** *Tier* /tiːɐ̯/ — довге «і»; *Tür* /tyːɐ̯/ — губи трубочкою. *Heu* /hɔʏ̯/ означає «сіно», а в аудіо було *Haus* /haʊ̯s/ («будинок»).

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-umlaute-l03
> audio: Heute ist das Wetter schön.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-umlaute-l04
> audio: Ich höre gern Lieder.
> explain: höre — ö довге [øː], Lieder — ie довге [iː]. Не пиши hore чи Leder: це інші слова.

> [!listen] Послухай діалог. Які тварини вдома?
> level: A1 · type: answer · speed: slow · id: de-a1-umlaute-l05
> audio: A: Habt ihr Tiere?
> audio: B: Ja, wir haben eine Katze und zwei Mäuse.
> - [ ] кішка й два жуки
> - [x] кішка й дві миші
> - [ ] кішка й два ведмеді
>
> **Пояснення:** *Mäuse* /ˈmɔʏ̯zə/ — множина від *die Maus*; äu = [ɔʏ̯]. *Käfer* (жуки) і *Bären* (ведмеді) — це інші слова.

> [!listen] Заповни пропуски за діалогом
> level: A1 · type: fill · speed: slow · id: de-a1-umlaute-l06
> audio: A: Ist das Haus neu?
> audio: B: Nein, das Haus ist alt, aber die Türen sind neu.
>
> ```fill
> Das Haus ist [[alt]], aber die [[Türen]] sind [[neu]].
> ```

## Вимова

> [!pair] schon /ʃoːn/ — schön /ʃøːn/
> level: A1 · id: de-a1-umlaute-p01
> say: schön
> tip: ö = губи «о», язик «е». Не «шойн».

> [!pair] Mutter /ˈmʊtɐ/ — Mütter /ˈmʏtɐ/
> level: A1 · id: de-a1-umlaute-p02
> say: Mütter
> tip: короткий [ʊ] проти короткого [ʏ]: губи в обох випадках округлені, але у [ʏ] язик висунутий вперед, як для «і».

> [!pair] Tür /tyːɐ̯/ — Tier /tiːɐ̯/
> level: A1 · id: de-a1-umlaute-p03
> say: Tür
> tip: [yː] — губи трубочкою, [iː] — розтягнуті. Язик в обох випадках у положенні «і».

> [!pair] Bruder /ˈbʁuːdɐ/ — Brüder /ˈbʁyːdɐ/
> level: A1 · id: de-a1-umlaute-p04
> say: Brüder
> tip: множина з умлаутом. [uː] → [yː]: язик посувається вперед, губи не змінюються.

> [!pair] Wein /vaɪ̯n/ — Wien /viːn/
> level: A1 · id: de-a1-umlaute-p05
> say: Wien
> tip: ei — дифтонг, звук змінюється; ie — рівне довге «і».

> [!pair] Bein /baɪ̯n/ — Bier /biːɐ̯/
> level: A1 · id: de-a1-umlaute-p06
> say: Bier
> tip: ei → «байн», ie → «біір». Перевір дві різні дії язика.

> [!pair] Haus /haʊ̯s/ — Häuser /ˈhɔʏ̯zɐ/
> level: A1 · id: de-a1-umlaute-p07
> say: Häuser
> tip: au = «ау», äu = [ɔʏ̯]. Додатково: s у *Haus* глухе, у *Häuser* дзвінке між голосними.

> [!pair] Eile /ˈaɪ̯lə/ — Eule /ˈɔʏ̯lə/
> level: A1 · id: de-a1-umlaute-p08
> say: Eule
> tip: ei = «ай», eu = «ой» з округленими губами.

> [!pair] Laute /ˈlaʊ̯tə/ — Leute /ˈlɔʏ̯tə/
> level: A1 · id: de-a1-umlaute-p09
> say: Leute
> tip: au проти eu. Другий елемент дифтонга дуже короткий.

> [!pair] können /ˈkœnən/ — kennen /ˈkɛnən/
> level: A1 · id: de-a1-umlaute-p10
> say: können
> tip: [œ] — губи «о», [ɛ] — губи розслаблені. Обидва голосні короткі.

> [!pair] Ähre /ˈɛːʁə/ — Ehre /ˈeːʁə/
> level: A1 · id: de-a1-umlaute-p11
> say: Ähre
> tip: ä — довге відкрите [ɛː], e — закрите [eː]. У розмові ці звуки нерідко збігаються, але в нормі вони різні.

> [!pair] Kuchen /ˈkuːxn̩/ — Küchen /ˈkʏçn̩/
> level: A1 · id: de-a1-umlaute-p12
> say: Küchen
> tip: тут змінюється не лише голосний, а й приголосний: після u — [x], після ü — [ç]. Голосні різняться і довготою: [uː] проти короткого [ʏ]. Закінчення -en майже без голосного.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-umlaute-s01
> text: Das Mädchen ist schön.
> ipa: /das ˈmɛːtçən ɪst ʃøːn/
> tip: ä в *Mädchen* — відкрите довге [ɛː], *-chen* — [çən]. schön: губи округли, язик не рухай.
> uk: Дівчинка красива.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-umlaute-s02
> text: Ich bin müde.
> ipa: /ɪç bɪn ˈmyːdə/
> tip: müde — ü довге [yː]: губи трубочкою, язик як для «і». Наголос на першому складі.
> uk: Я втомлений.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-umlaute-s03
> text: Die Tür ist grün.
> ipa: /diː tyːɐ̯ ɪst ɡʁyːn/
> tip: Tür і grün мають однакове довге [yː]. g = «ґ», r — горлове.
> uk: Двері зелені.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-umlaute-s04
> text: Wir trinken Wein in Wien.
> ipa: /viːɐ̯ ˈtʁɪŋkn̩ vaɪ̯n ɪn viːn/
> tip: Wein — «вайн», Wien — «віін». Різниця — у дифтонзі ei та довгому ie.
> uk: Ми пʼємо вино у Відні.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-umlaute-s05
> text: Das Haus ist neu, die Häuser sind alt.
> ipa: /das haʊ̯s ɪst nɔʏ̯ diː ˈhɔʏ̯zɐ zɪnt alt/
> tip: au → «ау», eu і äu → «ой». sind — d глушиться: «зінт».
> uk: Будинок новий, будинки старі.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-umlaute-s06
> text: Heute höre ich Lieder.
> ipa: /ˈhɔʏ̯tə ˈhøːʁə ɪç ˈliːdɐ/
> tip: heute — [ɔʏ̯]; höre — [øː]; Lieder — [iː]. h на початку — легкий видих.
> uk: Сьогодні я слухаю пісні.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-umlaute-s07
> text: Die Leute sind freundlich.
> ipa: /diː ˈlɔʏ̯tə zɪnt ˈfʁɔʏ̯ntlɪç/
> tip: Leute і freundlich — обидва з [ɔʏ̯]. -lich в кінці = [lɪç].
> uk: Люди привітні.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-umlaute-s08
> text: Meine Mutter und meine Brüder wohnen in Köln.
> ipa: /ˈmaɪ̯nə ˈmʊtɐ ʊnt ˈmaɪ̯nə ˈbʁyːdɐ ˈvoːnən ɪn kœln/
> tip: Mutter — короткий [ʊ], Brüder — довге [yː], Köln — короткий [œ]. meine — [aɪ̯]. wohnen: h німе.
> uk: Моя мама й мої брати живуть у Кельні.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-umlaute-s09
> text: Die Maus läuft durch die Küche.
> ipa: /diː maʊ̯s lɔʏ̯ft dʊʁç diː ˈkʏçə/
> tip: läuft — äu = [ɔʏ̯]; Küche — короткий [ʏ] і [ç]. Maus — «ау».
> uk: Миша біжить через кухню.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-umlaute-s10
> text: Ich möchte ein Eis.
> ipa: /ɪç ˈmœçtə aɪ̯n aɪ̯s/
> tip: möchte — короткий [œ], потім [ç]. ein і Eis — обидва [aɪ̯].
> uk: Я хотів би морозиво.

## Типові помилки українців

> [!pitfall] ü = «ю», ö = «йо»
> Українці чують у німецькому **ü** звук «ю», а в **ö** — «йо»: *Tür* → «тюр», *schön* → «шойн». Але в німецьких ü й ö немає звука «й», і язик під час звуку не рухається. Тримай ü: «і» з губами «у»; ö: «е» з губами «о». Перевіряй парами: *Tür / Tier*, *schon / schön*.

> [!pitfall] ä = «я»
> Літера ä не читається як «я»: *Bär* — «бер» (довге відкрите «е»), *Männer* — «менер», а не «мянер». Губи розслаблені, звука «й» немає. Коротке **ä** звучить як коротке **e**, довге — як відкрите довге «е».

> [!pitfall] ei та ie: «вайн» і «віін»
> **ei** читається «ай» ([aɪ̯]), **ie** — довге «і» ([iː]). Українці часто читають *ie* як «іе» (*Bier* — «бієр», *Wien* — «віен») або *ei* як «еі». Правильно: *Wein* /vaɪ̯n/ — «вино», *Wien* /viːn/ — «Відень».

> [!pitfall] eu / äu — не «еу», а «ой»
> *neu* — «ной», а не «неу»; *Leute* — «лойте», а не «леуте»; *Häuser* — «хойзер». Літери *eu* й *äu* дають один звук [ɔʏ̯], як «ой» з трохи округленими губами. А **au** читається «ау»: *Haus*, *Baum*.

## Практика

> [!quiz] Як вимовляється ü в слові Tür?
> level: A1 · type: single · id: de-a1-umlaute-q02
> - [ ] як «ю»: «тюр»
> - [x] язик як для «і», губи як для «у»
> - [ ] як звичайне «у»
> - [ ] як «и»
>
> **Пояснення:** [yː] — це «і» з округленими губами. «Ю» містить зайвий звук «й», а «у» — це зовсім інший звук [uː].

> [!quiz] Як вимовляється ö в слові schön?
> level: A1 · type: single · id: de-a1-umlaute-q03
> - [ ] як «йо»: «шойн»
> - [x] язик як для «е», губи як для «о»
> - [ ] як звичайне «о»
> - [ ] як «е»
>
> **Пояснення:** [øː] — «е» з округленими губами. Звичайне «о» — [oː]: *schon* /ʃoːn/ — «вже».

> [!quiz] У яких словах є дифтонг [aɪ̯] («ай»)?
> level: A1 · type: multi · id: de-a1-umlaute-q04
> - [x] Wein
> - [ ] Wien
> - [x] Eis
> - [ ] Bier
> - [x] Reise
>
> **Пояснення:** [aɪ̯] пишеться **ei**: *Wein, Eis, Reise*. У *Wien* і *Bier* — **ie**, тобто довге [iː].

> [!quiz] У яких словах чути [ɔʏ̯] («ой»)?
> level: A1 · type: multi · id: de-a1-umlaute-q05
> - [x] neu
> - [ ] Haus
> - [x] Häuser
> - [x] Leute
> - [ ] Baum
>
> **Пояснення:** [ɔʏ̯] пишеться **eu** і **äu**. У *Haus* і *Baum* — **au**, тобто [aʊ̯] («ау»).

> [!quiz] Що відбувається зі словом Mutter у множині?
> level: A1 · type: single · id: de-a1-umlaute-q06
> - [ ] додається -s: Mutters
> - [x] u стає ü: die Mütter
> - [ ] u стає au: die Motter
> - [ ] нічого: die Mutter
>
> **Пояснення:** множина від *die Mutter* — *die Mütter*, з умлаутом. У вимові короткий [ʊ] змінюється на короткий [ʏ].

> [!quiz] Заповни пропуски
> level: A1 · type: fill · bank: Bein, Nein · id: de-a1-umlaute-q07
>
> ```text fill
> Wir trinken [[Wein]] in [[Wien]].
> Das Haus ist [[neu]].
> ```
>
> **Пояснення:** *Wein* — напій, *Wien* — місто. *Bein* («нога») і *Nein* («ні») звучать подібно, але в цьому реченні змісту не мають.

> [!quiz] Заповни множину
> level: A1 · type: fill · bank: Hauser, Brudere · id: de-a1-umlaute-q08
>
> ```text fill
> Das Haus — die [[Häuser]].
> Der Bruder — die [[Brüder]].
> Der Baum — die [[Bäume]].
> ```
>
> **Пояснення:** в усіх трьох словах у множині зʼявляється умлаут: **au → äu**, **u → ü**. *Hauser* і *Brudere* — типові помилки: без умлаута й з неправильним закінченням.

> [!quiz] Склади речення: «Дівчинка красива»
> level: A1 · type: order · id: de-a1-umlaute-q09
>
> ```text order
> Das
> Mädchen
> ist
> schön.
> schon ✗
> ```
>
> **Пояснення:** *schön* — «красивий», *schon* — «вже». Для sein після підмета — *ist*.

> [!quiz] Склади речення: «Ми пʼємо вино у Відні»
> level: A1 · type: order · id: de-a1-umlaute-q10
>
> ```text order
> Wir
> trinken
> Wein
> in
> Wien.
> trinkt ✗
> ```
>
> **Пояснення:** до *wir* — форма **trinken**. *Wein* — вино, *Wien* — місто, і слова не міняємо місцями.

> [!quiz] Як написати Müller, якщо на клавіатурі немає ü?
> level: A1 · type: single · id: de-a1-umlaute-q11
> - [ ] Muller
> - [x] Mueller
> - [ ] Moeller
> - [ ] Moller
>
> **Пояснення:** ü замінюють на **ue**, ö — на **oe**, ä — на **ae**: *Müller → Mueller*, *schön → schoen*, *Bär → Baer*. *Muller* — це вже інше прізвище; *Moeller* — з ö.

> [!quiz] Як вимовляється слово Eis?
> level: A1 · type: single · id: de-a1-umlaute-q12
> - [ ] «ейс»
> - [ ] «іс»
> - [x] «айс»
> - [ ] «ейз»
>
> **Пояснення:** **ei** = [aɪ̯], *Eis* /aɪ̯s/ — «айс». Довге «і» було б у **ie**: *Lied*. «Ейс» — англійський дифтонг; у німецькій такого звука немає.

## Фішки

> [!reel] ✍️ Крапки — це маленьке e
> Умлаути зʼявилися в середньовічному письмі. Щоб показати, що після *a, o, u* стоїть звук *e* (наприклад, *Maus → Mäuse*), над літерою писали маленьке **e**. З часом воно спростилося до двох рисок, а потім крапок. Тому *ä, ö, ü* походять від *ae, oe, ue*, і ця заміна лишилася на клавіатурах та в email.

> [!reel] 🛂 Müller у паспорті — MUELLER
> У машиночитній зоні німецького паспорта (два рядки внизу) немає умлаутів: *Müller* записують як **MUELLER**, а *Groß* — як **GROSS**. Якщо в іншій країні бронюєш квиток, імʼя краще писати так, як у цьому рядку.

> [!reel] 🍷 Wein in Wien
> У Відні, на відміну від багатьох столиць, є власні виноградники в межах міста, а традиційні винні таверни називають *Heuriger*. Добра фраза, щоб відпрацювати пару з теми: *Wir trinken Wein in Wien* — «вайн» у «віін».

## Джерела та що почитати

- [DWDS — schön](https://www.dwds.de/wb/sch%C3%B6n) — значення й приклади слова.
- [DWDS — Tier](https://www.dwds.de/wb/Tier) — вимова, рід і множина слова *Tier*.
- [DWDS — Mütze](https://www.dwds.de/wb/M%C3%BCtze) — рід, множина й вимова слова.
- [Wikipedia — Umlaut](https://de.wikipedia.org/wiki/Umlaut) — походження умлаутів і правила заміни на ae, oe, ue.
- [Wikipedia — Maschinenlesbare Zone](https://de.wikipedia.org/wiki/Maschinenlesbare_Zone) — як у документах передають умлаути (*Müller → MUELLER*).
- [Wikipedia — Weinbau in Wien](https://de.wikipedia.org/wiki/Weinbau_in_Wien) — виноградники у Відні та *Heuriger*.
- [DW Learn German — Nicos Weg (A1)](https://learngerman.dw.com/en/beginners/c-36519789) — вимова й слухання в безкоштовному відеокурсі DW.

> [!important] Підсумок
> - **ü** = «і» з губами «у», **ö** = «е» з губами «о», **ä** = відкрите «е». Не «ю», не «йо», не «я».
> - **ei** = [aɪ̯] «ай» (*Wein*), **ie** = довге [iː] (*Wien*); **eu / äu** = [ɔʏ̯] «ой», **au** = [aʊ̯] «ау».
> - Умлаут змінює слово: *Mutter / Mütter*, *schon / schön*, *Haus / Häuser*.
> - Без клавіатури: ä → ae, ö → oe, ü → ue (*Mueller*).
