---
title: Питання й місце дієслова — V2 і W-Fragen
id: de-a1-fragen
level: A1
icon: px:question
tags: [deutsch, a1, grammar, satzbau, fragen, v2]
prerequisites: ["[[Deutsch - A1 - 07. Präsens — правильні дієслова]]"]
estimatedMinutes: 35
---

# Питання й місце дієслова — V2 і W-Fragen

> [!success] Після цієї теми ти зможеш
> - поставити дієслово в розповідному реченні на **друге місце**, що б не стояло першим: *Heute lerne ich Deutsch.*;
> - поставити питання з *wer, was, wo, woher, wohin, wann, wie, warum*;
> - поставити питання «так / ні», починаючи з дієслова: *Sprichst du Deutsch?*;
> - відповісти на заперечне питання словом **doch**: *Kommst du nicht? — Doch!*

## Передбач

> [!quiz] Яке речення правильне?
> level: A1 · type: single · id: de-a1-fragen-q01
> - [ ] Heute ich lerne Deutsch.
> - [x] Heute lerne ich Deutsch.
> - [ ] Heute Deutsch lerne ich.
> - [ ] Heute ich Deutsch lerne.
>
> **Пояснення:** у німецькому розповідному реченні дієслово стоїть на **другому місці**. Якщо першим стоїть *heute*, то підмет *ich* зсувається за дієслово: *Heute **lerne** ich.* Це правило V2.

## Правило V2: дієслово на другому місці

В українській порядок слів вільний: «Я сьогодні вчу», «Сьогодні я вчу», «Вчу я сьогодні». У німецькій **вільне перше місце, а друге зайняте дієсловом**. Що поставиш першим — підмет, час, місце, обʼєкт, — дієслово від цього не зсунеться.

> [!diagram] V2: на першому місці будь-що, на другому — дієслово
> ```yaml
> layout: flow
> nodes:
>   - { id: p1, label: "1-ше місце · хто?", text: "Ich", tone: mint }
>   - { id: p2, label: "2-ге місце · дієслово", text: "lerne", tone: orange }
>   - { id: p3, label: "решта · коли?", text: "heute", tone: gray }
>   - { id: p4, label: "решта · що?", text: "Deutsch", tone: gray }
> steps:
>   - { focus: [p1, p2, p3, p4], note: "Нейтральне речення: Ich lerne heute Deutsch. Підмет, дієслово, решта." }
>   - { set: { p1: "Heute", p3: "ich" }, focus: [p1, p2], note: "Починаємо зі слова часу: Heute lerne ich Deutsch. Дієслово лишається другим, підмет тепер стоїть ПІСЛЯ нього." }
>   - { set: { p1: "Deutsch", p3: "ich", p4: "heute" }, focus: [p1, p2], note: "Можна почати і з обʼєкта: Deutsch lerne ich heute. Дієслово знову на 2-му місці." }
> ```
> Якщо першим став не підмет, підмет іде **після** дієслова. Це називають **інверсією**: *Heute **lerne ich***, а не ~~Heute ich lerne~~.

Дієслово на 2-му місці — це не «друге слово», а друга **змістова одиниця**: перше місце може бути з кількох слів (*Am Montag, Nach der Arbeit*). *Am Montag **lerne** ich.* Усе, що стоїть перед дієсловом, — це «одне» перше місце.

| 1-ше місце | 2-ге: дієслово | Решта |
|---|---|---|
| Ich | lerne | heute Deutsch. |
| Heute | lerne | ich Deutsch. |
| Am Montag | arbeite | ich in Berlin. |
| Deutsch | lerne | ich jeden Tag. |

> [!note] Сполучники und, aber, oder не рахуються
> *Und, aber, oder* стоять «на нульовому місці» і порядок слів не змінюють: *Ich lerne Deutsch, **und** er lernt Englisch.* *Ich bin müde, **aber** ich arbeite.* Підмет і дієслово йдуть далі як звичайно.

## W-Fragen

Питання з питальним словом (*W-Fragen*, бо більшість слів починається з **w**) мають порядок: **питальне слово → дієслово → підмет → решта**. Дієслово знову на 2-му місці.

| Питальне слово | Українською | Приклад |
|---|---|---|
| **wer** | хто | Wer ist das? |
| **was** | що | Was machst du? |
| **wo** | де | Wo wohnst du? |
| **woher** | звідки | Woher kommst du? |
| **wohin** | куди | Wohin gehst du? |
| **wann** | коли | Wann kommst du? |
| **wie** | як | Wie heißen Sie? |
| **warum** | чому | Warum lernst du Deutsch? |

> [!diagram] Розповідь, W-питання, питання «так / ні»
> ```yaml
> layout: compare
> columns: { a: "Розповідь", b: "W-питання", c: "Питання так / ні" }
> nodes:
>   - { id: a1, col: a, label: "1", text: "Du", tone: mint }
>   - { id: a2, col: a, label: "2", text: "wohnst", tone: orange }
>   - { id: a3, col: a, label: "решта", text: "in Berlin.", tone: gray }
>   - { id: b1, col: b, label: "1", text: "Wo", tone: gray }
>   - { id: b2, col: b, label: "2", text: "wohnst", tone: orange }
>   - { id: b3, col: b, label: "3", text: "du?", tone: mint }
>   - { id: c1, col: c, label: "1", text: "Wohnst", tone: orange }
>   - { id: c2, col: c, label: "2", text: "du", tone: mint }
>   - { id: c3, col: c, label: "решта", text: "in Berlin?", tone: gray }
> steps:
>   - { focus: [a1, a2, a3], note: "Розповідь: підмет → дієслово → решта." }
>   - { focus: [b1, b2, b3], note: "W-питання: питальне слово займає 1-ше місце, дієслово лишається 2-м, підмет іде за ним." }
>   - { focus: [c1, c2, c3], note: "Питання «так / ні»: дієслово перескакує на 1-ше місце, а питального слова немає." }
> ```

Приклади з різними W-словами:

- **Wer** ist das? — Das ist Max. — Хто це? — Це Макс.
- **Was** studierst du? — Medizin. — Що ти вивчаєш? — Медицину.
- **Wo** arbeitet sie? — In Köln. — Де вона працює? — У Кельні.
- **Wohin** fährt er? — Nach Wien. — Куди він їде? — До Відня.
- **Wann** beginnt der Kurs? — Um neun. — Коли починається курс? — О девʼятій.

**wo / woher / wohin** — три питання про місце. **Wo** — де хтось знаходиться; **woher** — звідки; **wohin** — куди. Українське «де ти йдеш?» німецькою — *Wohin gehst du?*, а не ~~Wo gehst du?~~.

## Питання «так / ні»

Якщо відповідь «так» або «ні», питання починається з **дієслова**. Підмет — другий.

| Розповідь | Питання | Переклад |
|---|---|---|
| Du sprichst Deutsch. | **Sprichst** du Deutsch? | Ти говориш німецькою? |
| Sie arbeitet heute. | **Arbeitet** sie heute? | Вона сьогодні працює? |
| Ihr kommt morgen. | **Kommt** ihr morgen? | Ви приходите завтра? |
| Sie wohnen in Wien. | **Wohnen** Sie in Wien? | Ви живете у Відні? |

Інтонація допомагає: в питанні «так / ні» голос іде **вгору** ↗ на кінці, у W-питанні — **вниз** ↘. У розмові можна також спитати інтонацією, лишивши порядок розповіді: *Du kommst morgen?* — «Ти завтра прийдеш?», але на письмі й в офіційній мові ставимо дієслово першим.

### Відповіді: ja, nein, doch

На просте питання відповідаємо **ja** (так) або **nein** (ні). Але коли питання **заперечне** (з *nicht* або *kein*), «так» — це **doch**:

| Питання | Так | Ні |
|---|---|---|
| Kommst du? | **Ja**, ich komme. | **Nein**, ich komme nicht. |
| Kommst du **nicht**? | **Doch**, ich komme! | **Nein**, ich komme nicht. |
| Hast du **keine** Zeit? | **Doch**, ich habe Zeit. | **Nein**, ich habe keine Zeit. |

*Doch* означає «ні, навпаки — так»: воно **спростовує заперечення** в питанні. Українською ми кажемо «Ти не прийдеш? — Прийду», а німецька відповідає чітким *Doch!*, інакше співрозмовник не зрозуміє, «так» це чи «ні».

## Приклади

- Wie heißt du? — Ich heiße Olena. — Як тебе звати? — Мене звати Олена.
- Woher kommt ihr? — Wir kommen aus Polen. — Звідки ви? — Ми з Польщі.
- Heute arbeite ich nicht, aber morgen arbeite ich. — Сьогодні я не працюю, але завтра працюю.
- Am Wochenende fahren wir nach Hamburg. — На вихідних ми їдемо до Гамбурга.
- Warum lernst du Deutsch? — Weil ich in Deutschland wohne. — Чому ти вчиш німецьку? — Бо я живу в Німеччині.
- Wohnen Sie in Berlin? — Nein, in Potsdam. — Ви живете в Берліні? — Ні, в Потсдамі.
- Hast du kein Handy? — Doch, hier ist es! — У тебе нема телефону? — Є, ось він!
- Wann kommt der Bus? — In fünf Minuten. — Коли приїде автобус? — Через пʼять хвилин.
- Wer spricht hier Ukrainisch? — Ich! — Хто тут говорить українською? — Я!
- Kaffee oder Tee? — Kaffee, bitte. — Кава чи чай? — Каву, будь ласка.

## Слова

> [!word] wer
> ipa: /veːɐ̯/ · pos: pron · level: A1 · id: de-a1-fragen-w01
> uk: хто
> example: **Wer** ist das? — Das ist mein Bruder. — Хто це? — Це мій брат.
> note: Nominativ; Akkusativ — wen (Wen siehst du?), Dativ — wem. З wer дієслово в однині: Wer kommt?

> [!word] was
> ipa: /vas/ · pos: pron · level: A1 · id: de-a1-fragen-w02
> uk: що
> example: **Was** machst du am Wochenende? — Що ти робиш на вихідних?
> note: коротке a, w = «в». Не плутай з war («був») — [vaːɐ̯].

> [!word] wo
> ipa: /voː/ · pos: adv · level: A1 · id: de-a1-fragen-w03
> uk: де
> example: **Wo** wohnst du? — Де ти живеш?
> note: wo — місце без руху. Для руху: wohin (куди), woher (звідки).

> [!word] wohin
> ipa: /voˈhɪn/ · pos: adv · level: A1 · id: de-a1-fragen-w04
> uk: куди
> example: **Wohin** fährst du im Urlaub? — Куди ти їдеш у відпустку?
> note: wo + hin. Наголос на hin. Розмовно часто Wo gehst du hin?; стандарт — Wohin gehst du? Не ~~Wo gehst du?~~.

> [!word] wann
> ipa: /van/ · pos: adv · level: A1 · id: de-a1-fragen-w05
> uk: коли
> example: **Wann** beginnt der Kurs? — Коли починається курс?
> note: wann = питання про час; wenn = «якщо / коли (щоразу)». Wann kommst du? — Wenn ich Zeit habe.

> [!word] wie
> ipa: /viː/ · pos: adv · level: A1 · id: de-a1-fragen-w06
> uk: як
> example: **Wie** geht es dir? — Як у тебе справи?
> note: довге [iː]. Wie alt, wie viel, wie lange — «скільки років, скільки, як довго».

> [!word] warum
> ipa: /vaˈʁʊm/ · pos: adv · level: A1 · id: de-a1-fragen-w07
> uk: чому; чого заради
> example: **Warum** lernst du Deutsch? — Чому ти вчиш німецьку?
> note: наголос на другому складі. Синоніми: wieso, weshalb (AT, CH частіше weshalb). Відповідь — часто з weil (тема A2-11).

> [!word] ja
> ipa: /jaː/ · pos: adv · level: A1 · id: de-a1-fragen-w08
> uk: так
> example: **Ja**, ich komme gern. — Так, я охоче прийду.
> note: j = [j], як українське «й». Усередині речення ja — модальна частка («адже»): Das ist ja toll! — Це ж чудово!

> [!word] nein
> ipa: /naɪ̯n/ · pos: adv · level: A1 · id: de-a1-fragen-w09
> uk: ні
> example: **Nein**, danke. Ich möchte keinen Kaffee. — Ні, дякую. Я не хочу кави.
> note: ei = «ай»: «найн». Не плутай з neun («девʼять») — [nɔʏ̯n].

> [!word] doch
> ipa: /dɔx/ · pos: adv · level: A1 · id: de-a1-fragen-w10
> uk: «ні, навпаки — так» (відповідь на заперечення); все ж таки
> example: Hast du keine Zeit? — **Doch**, ich habe Zeit. — У тебе нема часу? — Є, є.
> note: ch після o = [x]: «дох». Також у наказі підсилює: Komm doch mit! — Ходімо з нами!

> [!word] oder
> ipa: /ˈoːdɐ/ · pos: conj · level: A1 · id: de-a1-fragen-w11
> uk: або; чи
> example: Kaffee **oder** Tee? — Кава чи чай?
> note: порядок слів не змінює. Ставиться й наприкінці питання: Du kommst morgen, oder? — «Ти ж завтра прийдеш?»

> [!word] aber
> ipa: /ˈaːbɐ/ · pos: conj · level: A1 · id: de-a1-fragen-w12
> uk: але; а
> example: Ich bin müde, **aber** ich arbeite noch. — Я втомлений, але ще працюю.
> note: aber не змінює порядок слів. aber ≠ oder: «але» та «чи». Закінчення -er = короткий [ɐ].

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-fragen-l01
> audio: Wohin gehst du?
> - [ ] Wo wohnst du?
> - [x] Wohin gehst du?
> - [ ] Woher kommst du?

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-fragen-l02
> audio: Kommst du heute?
> - [ ] Du kommst heute.
> - [x] Kommst du heute?
> - [ ] Heute kommst du.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-fragen-l03
> audio: Warum lernst du Deutsch?

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-fragen-l04
> audio: Heute arbeite ich nicht.
> explain: першим стоїть heute, тому дієслово arbeite на 2-му місці, а підмет ich — після нього.

> [!listen] Послухай діалог. Що відповідає Лена?
> level: A1 · type: answer · speed: slow · id: de-a1-fragen-l05
> audio: A: Kommst du heute nicht?
> audio: B: Doch, ich komme. Aber ich komme später.
> - [x] Вона прийде, але пізніше.
> - [ ] Вона не прийде.
> - [ ] Вона прийде раніше.
>
> **Пояснення:** *Doch* відповідає на заперечне питання «Ти не прийдеш?» — «Прийду, навпаки». *Später* — пізніше.

> [!listen] Послухай діалог. Куди їде Макс і коли?
> level: A1 · type: answer · speed: slow · id: de-a1-fragen-l06
> audio: A: Wohin fährst du im Sommer, Max?
> audio: B: Ich fahre nach Wien. Im Juli.
> audio: A: Wann genau?
> audio: B: Am fünften Juli.
> - [ ] Він їде до Берліна в липні.
> - [x] Він їде до Відня на початку липня.
> - [ ] Він їде до Відня у серпні.
>
> **Пояснення:** *nach Wien* — до Відня, *im Juli* — у липні, *am fünften Juli* — пʼятого липня.

## Вимова

Інтонація в питаннях — частина змісту:

- **W-питання** (*Wo wohnst du?*) — голос найвищий на питальному слові, до кінця **падає** ↘.
- **Питання «так / ні»** (*Kommst du heute?*) — голос **піднімається** ↗ до кінця.
- Розповідь — голос падає ↘.

Звуки: **w** = «в» (*wer, wo, warum*), **v** у *vier* — [f], **ei** = «ай» (*nein*), **ch** після *o* = [x] (*doch*), **h** в *wohin* — легкий видих.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-fragen-s01
> text: Wo wohnst du?
> ipa: /voː voːnst duː/
> tip: W-питання — голос падає ↘. Обидва wo/woh — довге [oː]. h після o не вимовляється.
> uk: Де ти живеш?

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-fragen-s02
> text: Wohin gehst du?
> ipa: /voˈhɪn ɡeːst duː/
> tip: наголос на -hin: wo-HIN. h — легкий видих, [ɪ] коротке. gehst: g = «ґ», довге [eː].
> uk: Куди ти йдеш?

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-fragen-s03
> text: Wann kommst du?
> ipa: /van kɔmst duː/
> tip: wann — коротке a, подвійне nn не подовжується. kommst — коротке [ɔ].
> uk: Коли ти прийдеш?

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-fragen-s04
> text: Heute lerne ich Deutsch.
> ipa: /ˈhɔʏ̯tə ˈlɛʁnə ɪç dɔʏ̯tʃ/
> tip: heute — eu = «ой», h — легкий видих. ich — [ç]. Наголос на першому складі кожного слова.
> uk: Сьогодні я вчу німецьку.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-fragen-s05
> text: Doch, ich komme!
> ipa: /dɔx ɪç ˈkɔmə/
> tip: doch — [x] як «х», голос падає. Окликова інтонація: впевнено, не питально.
> uk: Так (навпаки), я прийду!

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-fragen-s06
> text: Was ist das?
> ipa: /vas ɪst das/
> tip: was — коротке [a], кінцеве s — глухе [s]. ist — [ɪst], das — [das].
> uk: Що це?

## Типові помилки українців

> [!pitfall] Дієслово не на другому місці: ~~Heute ich lerne~~
> Українською «Сьогодні я вчу» — нормально, німецькою — ні. Що б не стояло першим (час, місце, обʼєкт), **дієслово — друге**: *Heute **lerne** ich.*, *In Berlin **wohne** ich.*, *Deutsch **lerne** ich.* Підмет після дієслова — це норма, а не помилка.

> [!pitfall] W-питання без інверсії: ~~Warum du lernst Deutsch?~~
> Українське «Чому ти вчиш німецьку?» легко скопіювати слово в слово. У німецькій: **питальне слово → дієслово → підмет**: ***Warum lernst du Deutsch?*** Дієслово стоїть одразу після питального слова, а не в кінці. Так само ~~Wo du wohnst?~~ → *Wo wohnst du?*

> [!pitfall] «Так» на заперечне питання: ~~Ja, ich komme~~
> *Kommst du nicht?* — «Ти не прийдеш?». Українською «Прийду» — це «так», але *Ja, ich komme nicht* спантеличить співрозмовника. Німецька використовує **doch**: *Doch, ich komme!* Якщо не прийдеш — *Nein, ich komme nicht.*

> [!pitfall] wo ≠ wohin ≠ woher
> Українське «де ти йдеш?» — це про напрям: ~~Wo gehst du?~~ → **Wohin gehst du?** *Wo* — місце без руху (*Wo bist du?*), *wohin* — рух туди (*Wohin gehst du?*), *woher* — звідки (*Woher kommst du?*). У розмові чути й *Wo gehst du hin?*, але стандарт — *wohin*.

## Ситуація: на курсі німецької

> [!listen] Послухай діалог. Чому Ольга вчить німецьку?
> level: A1 · type: answer · speed: slow · id: de-a1-fragen-l07
> audio: A: Hallo, ich bin Tim. Wie heißt du?
> audio: B: Ich heiße Olga. Ich komme aus der Ukraine.
> audio: A: Wohnst du in Köln?
> audio: B: Ja, ich wohne in Köln. Ich arbeite hier und lerne Deutsch.
> audio: A: Super! Wann hast du Unterricht?
> audio: B: Am Montag und am Mittwoch.
> - [ ] Вона живе в Німеччині й вчить німецьку для мандрівок.
> - [x] Вона живе й працює в Кельні, а курс — у понеділок і середу.
> - [ ] Вона живе в Україні й навчається онлайн.
>
> **Пояснення:** *Ich wohne in Köln, ich arbeite hier und lerne Deutsch* — живе й працює в Кельні. *Am Montag und am Mittwoch* — понеділок і середа.

Постав ці питання вголос до себе: *Wo wohnst du? Woher kommst du? Wann hast du Unterricht?*

## Практика

> [!quiz] Яке речення правильне?
> level: A1 · type: single · id: de-a1-fragen-q02
> - [ ] Morgen ich arbeite nicht.
> - [x] Morgen arbeite ich nicht.
> - [ ] Ich morgen arbeite nicht.
> - [ ] Morgen nicht arbeite ich.
>
> **Пояснення:** першим стоїть *morgen*, дієслово — друге, підмет — третій: *Morgen arbeite ich nicht.*

> [!quiz] Яке питання правильне?
> level: A1 · type: single · id: de-a1-fragen-q03
> - [ ] Warum du lernst Deutsch?
> - [x] Warum lernst du Deutsch?
> - [ ] Warum lernst Deutsch du?
> - [ ] Du warum lernst Deutsch?
>
> **Пояснення:** питальне слово → дієслово → підмет → решта.

> [!quiz] Обери питальне слово: «___ fährst du? — Nach Wien.»
> level: A1 · type: single · id: de-a1-fragen-q04
> - [ ] Wo
> - [ ] Woher
> - [x] Wohin
> - [ ] Wann
>
> **Пояснення:** *nach Wien* — відповідь про напрям руху → **wohin**. *Wo* — місце без руху, *woher* — звідки.

> [!quiz] Відповідь на питання «Kommst du nicht?», якщо ти таки прийдеш
> level: A1 · type: single · id: de-a1-fragen-q05
> - [ ] Ja, ich komme nicht.
> - [ ] Nein, ich komme.
> - [x] Doch, ich komme.
> - [ ] Nein, ich komme nicht.
>
> **Пояснення:** на заперечне питання «Ти не прийдеш?» відповідь «прийду» — *Doch*. *Nein, ich komme nicht* означало б «не прийду».

> [!quiz] Як спитати німецькою «Ви живете у Відні?»
> level: A1 · type: single · id: de-a1-fragen-q06
> - [ ] Sie wohnen in Wien?
> - [ ] Wo Sie wohnen in Wien?
> - [x] Wohnen Sie in Wien?
> - [ ] Wohnt ihr Wien?
>
> **Пояснення:** питання «так / ні» — дієслово на першому місці. *Sie wohnen in Wien?* можливо лише з питальною інтонацією у розмові.

> [!quiz] Які речення побудовано правильно?
> level: A1 · type: multi · id: de-a1-fragen-q07
> - [x] Heute lerne ich Deutsch.
> - [ ] In Berlin ich wohne.
> - [x] Am Montag arbeite ich nicht.
> - [ ] Deutsch ich lerne.
> - [x] Wann kommst du?
>
> **Пояснення:** у розповідному реченні дієслово — на 2-му місці, у W-питанні — теж. ~~In Berlin ich wohne~~ і ~~Deutsch ich lerne~~ порушують V2.

> [!quiz] У яких відповідях потрібне doch?
> level: A1 · type: multi · id: de-a1-fragen-q08
> - [x] Hast du kein Handy? — ___, ich habe ein Handy.
> - [ ] Hast du ein Handy? — ___, ich habe eins.
> - [x] Kommst du nicht? — ___, ich komme.
> - [ ] Wohnst du in Berlin? — ___, ich wohne in Berlin.
>
> **Пояснення:** *doch* потрібне лише для заперечних питань («не», «немає»). На звичайне питання відповідаємо *ja*.

> [!quiz] Заповни пропуски питальними словами
> level: A1 · type: fill · bank: was, wie · id: de-a1-fragen-q09
>
> ```text fill
> [[Wer]] ist das? — Das ist Lena.
> [[Wo]] wohnt sie? — In Wien.
> [[Wohin]] fährt sie? — Nach Berlin.
> [[Wann]] fährt sie? — Morgen.
> ```
>
> **Пояснення:** хто → *wer*, де → *wo*, куди → *wohin*, коли → *wann*. *was* («що») і *wie* («як») тут не підходять.

> [!quiz] Заповни пропуски: порядок слів
> level: A1 · type: fill · bank: lernt, arbeitest · id: de-a1-fragen-q10
>
> ```text fill
> Heute [[lerne]] ich Deutsch.
> Morgen [[arbeite]] ich in Berlin.
> In Wien [[wohne]] ich.
> ```
>
> **Пояснення:** дієслово завжди на другому місці, форма — за підметом *ich*: *lerne, arbeite, wohne*. *lernt* і *arbeitest* — форми для *er* і *du*.

> [!quiz] Заповни пропуски: ja, nein чи doch
> level: A1 · type: fill · bank: Aber, Oder · id: de-a1-fragen-q11
>
> ```text fill
> A: Sprichst du Deutsch?
> B: [[Ja]], ich spreche ein bisschen Deutsch.
> A: Sprichst du nicht Englisch?
> B: [[Doch]], ich spreche auch Englisch.
> A: Und Französisch?
> B: [[Nein]], Französisch spreche ich nicht.
> ```
>
> **Пояснення:** звичайне питання — *ja / nein*; заперечне «не говориш англійською?» — *doch* (навпаки: говорю). *aber* і *oder* тут не відповіді.

> [!quiz] Склади речення: «Сьогодні я вчу німецьку»
> level: A1 · type: order · id: de-a1-fragen-q12
>
> ```text order
> Heute
> lerne
> ich
> Deutsch.
> lernen ✗
> ```
>
> **Пояснення:** першим — *heute*, друге місце — дієслово *lerne*, потім підмет. *lernen* — форма для *wir / sie / Sie*.

> [!quiz] Склади питання: «Де ти живеш?»
> level: A1 · type: order · id: de-a1-fragen-q13
>
> ```text order
> Wo
> wohnst
> du?
> wohin ✗
> ```
>
> **Пояснення:** питальне слово → дієслово → підмет. *wohin* — «куди», про рух.

> [!quiz] Склади питання: «Чому ти вчиш німецьку?»
> level: A1 · type: order · id: de-a1-fragen-q14
>
> ```text order
> Warum
> lernst
> du
> Deutsch?
> wann ✗
> ```
>
> **Пояснення:** *Warum* → дієслово *lernst* → *du* → решта. *wann* означало б «коли».

> [!quiz] Склади питання: «Ти завтра приходиш?»
> level: A1 · type: order · id: de-a1-fragen-q15
>
> ```text order
> Kommst
> du
> morgen?
> wann ✗
> ```
>
> **Пояснення:** питання «так / ні» — дієслово першим, потім підмет. З *wann* було б «Коли ти прийдеш?».

> [!quiz] Склади речення: «Завтра я не працюю»
> level: A1 · type: order · id: de-a1-fragen-q16
>
> ```text order
> Morgen
> arbeite
> ich
> nicht.
> arbeiten ✗
> ```
>
> **Пояснення:** *Morgen* → дієслово → підмет → *nicht*. *arbeiten* — не для *ich*.

## Фішки

> [!reel] 🧩 V2 — спадщина германських мов
> Дієслово на 2-му місці — не вигадка німецької граматики. Подібне правило мають і нідерландська, шведська, данська й норвезька. Англійська здебільшого втратила це правило й має лише окремі сліди (*Never have I seen it*). Тому німецькою природно *Heute lerne ich*, а англійською «Today learn I» вже не скажеш.

> [!reel] 🎯 Doch — слово без англійського аналога
> В англійській на заперечне питання «Aren't you coming?» відповіддю «Yes» легко заплутати співрозмовника. Німецька вирішує це одним словом **doch** — «навпаки, так». Схожий інструмент є у французькій (*si*). В українській такого слова немає: ми кажемо «Прийду».

> [!reel] 💬 Мале слово ja, яке змінює тон
> Усередині речення *ja* означає не «так», а «адже, ж»: *Das ist **ja** toll!* — «Це ж чудово!», *Du weißt **ja**, wie es ist.* — «Ти ж знаєш, як це». Такі слівця (*ja, doch, mal, eben*) називають **Modalpartikeln**: їх неможливо дослівно перекласти, але вони роблять мову живою.

## Джерела та що почитати

- [DWDS — doch](https://www.dwds.de/wb/doch) — значення *doch*, відповідь на заперечення, частка в наказі.
- [DWDS — ja](https://www.dwds.de/wb/ja) — *ja* як відповідь і як модальна частка.
- [DWDS — wohin](https://www.dwds.de/wb/wohin) — відмінність *wo / woher / wohin*.
- [DWDS — warum](https://www.dwds.de/wb/warum) — значення й синоніми (*wieso, weshalb*).
- [DWDS — wann](https://www.dwds.de/wb/wann) — *wann* і *wenn*.
- [DW Learn German — Nicos Weg (A1)](https://learngerman.dw.com/en/beginners/c-36519789) — безкоштовний відеокурс Deutsche Welle про питання й порядок слів.
- Goethe-Institut — сторінка іспиту *Goethe-Zertifikat A1: Start Deutsch 1* на goethe.de: зразки питань для говоріння.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділ про порядок слів.

> [!important] Підсумок
> - Дієслово в розповідному реченні — **завжди на 2-му місці** (V2); якщо першим не підмет, підмет іде після дієслова: *Heute lerne ich.*
> - W-питання: **питальне слово → дієслово → підмет**: *Wo wohnst du? Warum lernst du Deutsch?*
> - Питання «так / ні»: дієслово на 1-му місці: *Sprichst du Deutsch?* Інтонація: W-питання ↘, «так / ні» ↗.
> - *Wo* — де, *wohin* — куди, *woher* — звідки.
> - На заперечне питання «так» = **doch**: *Kommst du nicht? — Doch!*
> - *Und, aber, oder* порядок слів не змінюють.
