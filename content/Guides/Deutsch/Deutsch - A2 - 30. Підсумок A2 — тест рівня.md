---
title: Підсумок A2 — тест рівня
id: de-a2-review
level: A2
icon: px:crown
tags: [deutsch, a2, review, test]
prerequisites: ["[[Deutsch - A2 - 29. Ситуації — Bürgeramt, Anmeldung, огляд квартири, аптека]]"]
estimatedMinutes: 70
---

# Підсумок A2 — тест рівня

> [!success] Після цієї теми ти зможеш
> - перевірити себе з усієї граматики A2: *Perfekt і Präteritum, Dativ, прийменники з Dativ / Akkusativ і Wechselpräpositionen, ступені порівняння, відмінювання прикметників, weil / dass / wenn, зворотні дієслова, займенники й порядок обʼєктів, Futur I, сполучники, непрямі питання*;
> - розрізняти на слух минуле, давальний відмінок, місце й напрям, записати речення під диктовку;
> - почути мінімальні пари (*kam / Kamm*, *Beet / Bett*) і вимовити типові фрази рівня A2 вголос;
> - позначити в чеклісті «я вмію», що вже працює, а що ще варто повторити.

Це тема без нового матеріалу. Нових слів тут немає: усе, що трапляється, ти вже вивчив(ла) у темах A2-01…29 і A1. Якщо щось не виходить, поруч підказка, у якій темі це розібрано.

> [!diagram] Карта речення A2: де стоїть дієслово
> ```yaml
> layout: flow
> nodes:
>   - { id: s, label: "1-ше місце", text: "Ich", tone: mint }
>   - { id: v, label: "2-ге місце · дієслово", text: "bleibe", tone: orange }
>   - { id: r, label: "решта", text: "heute zu Hause.", tone: gray }
>   - { id: e, label: "кінець речення", text: "—", tone: gray }
> steps:
>   - { focus: [s, v, r], note: "Головне речення (A1-09): змінюване дієслово — на 2-му місці. Ich bleibe heute zu Hause." }
>   - { set: { v: "bin", r: "heute zu Hause", e: "geblieben" }, focus: [v, e], note: "Perfekt (A2-01): допоміжне дієслово друге, Partizip II — у кінці. Ich bin heute zu Hause geblieben (bleiben → sein)." }
>   - { set: { v: "werde", r: "morgen zu Hause", e: "bleiben" }, focus: [v, e], note: "Futur I (A2-22): werden друге, інфінітив — у кінці. Ich werde morgen zu Hause bleiben." }
>   - { set: { s: "…, weil ich", v: "—", r: "krank", e: "bin" }, focus: [e], note: "Підрядне речення з weil, dass, wenn (A2-11): змінюване дієслово йде в самий кінець. …, weil ich krank bin." }
>   - { set: { s: "Wissen Sie, ob der Zug", v: "—", r: "pünktlich", e: "ist" }, focus: [e], note: "Непряме питання (A2-25): після ob або питального слова дієслово теж у кінці. Wissen Sie, ob der Zug pünktlich ist?" }
> ```
> Правило таке: **змінюване дієслово — на 2-му місці в головному реченні й у кінці в підрядному**. Все «друге» (Partizip, інфінітив, префікс) стоїть наприкінці головного речення.

> [!diagram] wo? чи wohin? Який відмінок після in, an, auf …
> ```yaml
> layout: compare
> columns: { wo: "wo? — де (стан) → Dativ", wohin: "wohin? — куди (рух) → Akkusativ" }
> nodes:
>   - { id: wo1, col: wo, label: "Стан", text: "Ich bin im Büro.", note: "in dem = im", tone: yellow }
>   - { id: wo2, col: wo, label: "Стан", text: "Das Buch liegt auf dem Tisch.", note: "liegen, stehen, sitzen, hängen", tone: yellow }
>   - { id: wh1, col: wohin, label: "Рух", text: "Ich gehe ins Büro.", note: "in das = ins", tone: pink }
>   - { id: wh2, col: wohin, label: "Рух", text: "Ich lege das Buch auf den Tisch.", note: "legen, stellen, setzen, hängen", tone: pink }
> steps:
>   - { focus: [wo1, wo2], note: "Питання wo? — Dativ (A2-08): im Büro, auf dem Tisch. Дієслова: liegen, stehen, sitzen, hängen." }
>   - { focus: [wh1, wh2], note: "Питання wohin? — Akkusativ: ins Büro, auf den Tisch. Дієслова: legen, stellen, setzen, hängen." }
> ```
> Кольори тільки розрізняють стовпці; відмінок видно з підпису.

## Блок 1. Минуле: Perfekt і Präteritum

> [!quiz] Заповни пропуски: сильні дієслова
> level: A2 · type: fill · id: de-a2-review-q01 · bank: getrinkt, gekommt
>
> ```text fill
> Er hat einen Brief [[geschrieben]].
> Wir haben Wasser [[getrunken]].
> Sie ist zu Hause [[geblieben]].
> Ich bin spät [[gekommen]].
> ```
>
> **Пояснення:** сильні дієслова мають Partizip II на *-en* (часто зі зміною кореня): *schreiben → geschrieben, trinken → getrunken, bleiben → geblieben, kommen → gekommen*. Рух і зміна стану (*bleiben, kommen*) — із *sein*. *Getrinkt* і *gekommt* — типові помилки за зразком правильних дієслів. Тема A2-01.

> [!quiz] Обери допоміжне дієслово: «Gestern ___ wir nach Köln gefahren.»
> level: A2 · type: single · id: de-a2-review-q02
> - [ ] haben
> - [x] sind
> - [ ] seid
> - [ ] werden
>
> **Пояснення:** *fahren* як рух з одного місця в інше (*nach Köln*) утворює Perfekt із ***sein***: *wir sind gefahren*. *Seid* — форма для *ihr*. Тема A2-01.

> [!quiz] Які форми Partizip II правильні? Обери всі.
> level: A2 · type: multi · id: de-a2-review-q03
> - [x] besucht
> - [x] studiert
> - [x] gegangen
> - [ ] gebesucht
> - [ ] gestudiert
>
> **Пояснення:** дієслова з невідокремлюваним префіксом *be-* і дієслова на *-ieren* не мають *ge-*: *besucht, studiert*. *Gehen* — сильне дієслово: *gegangen*. Тема A2-01.

> [!quiz] «Вчора я не міг прийти.» Яка форма правильна?
> level: A2 · type: single · id: de-a2-review-q04
> - [ ] Gestern kannte ich nicht kommen.
> - [x] Gestern konnte ich nicht kommen.
> - [ ] Gestern kann ich nicht kommen.
> - [ ] Gestern habe ich nicht kommen gekonnt.
>
> **Пояснення:** Präteritum модальних дієслів без умлаута: *ich konnte*. *Kannte* — від *kennen* («знав»). У розмові про минуле *konnte* природніше за Perfekt модального. Тема A2-02.

> [!quiz] Обери форму: «Gestern ___ ich krank.»
> level: A2 · type: single · id: de-a2-review-q05
> - [x] war
> - [ ] hatte
> - [ ] bin
> - [ ] habe
>
> **Пояснення:** *krank sein* → *ich war krank*. *Hatte* — від *haben* (*ich hatte Fieber*), *bin* і *habe* — теперішній час. Тема A2-02.

> [!quiz] Склади речення: «Торік ми переїхали до Гамбурга.»
> level: A2 · type: order · id: de-a2-review-q06
>
> ```text order
> Letztes Jahr
> sind
> wir
> nach Hamburg
> umgezogen.
> haben ✗
> ```
>
> **Пояснення:** *umziehen* (переїхати) утворює Perfekt із *sein*; допоміжне дієслово друге, Partizip II — у кінці. Тема A2-01.

## Блок 2. Dativ, прийменники й займенники

> [!quiz] Обери артикль: «Ich helfe ___ Mann.»
> level: A2 · type: single · id: de-a2-review-q07
> - [ ] den
> - [x] dem
> - [ ] der
> - [ ] einen
>
> **Пояснення:** *helfen* вимагає Dativ. Чоловічий рід у Dativ — *dem* (*dem Mann*). *Den* і *einen* — Akkusativ. Тема A2-05.

> [!quiz] Обери займенник: «Das Buch gehört ___.» (мені)
> level: A2 · type: single · id: de-a2-review-q08
> - [ ] mich
> - [x] mir
> - [ ] ich
> - [ ] mein
>
> **Пояснення:** *gehören* — Dativ: *gehört mir*. *Mich* — знахідний, *ich* — називний. Теми A2-05 і A2-19.

> [!quiz] Які дієслова вимагають Dativ? Обери всі.
> level: A2 · type: multi · id: de-a2-review-q09
> - [x] helfen
> - [x] danken
> - [x] gefallen
> - [ ] besuchen
> - [ ] fragen
>
> **Пояснення:** *helfen, danken, gefallen* — Dativ (*ich helfe dir, ich danke Ihnen, es gefällt mir*). *Besuchen* і *fragen* — Akkusativ (*ich besuche dich, ich frage ihn*). Тема A2-05.

> [!quiz] «Я їду на роботу автобусом.» Яка форма правильна?
> level: A2 · type: single · id: de-a2-review-q10
> - [ ] Ich fahre mit Bus zur Arbeit.
> - [ ] Ich fahre mit den Bus zur Arbeit.
> - [x] Ich fahre mit dem Bus zur Arbeit.
> - [ ] Ich fahre mit der Bus zur Arbeit.
>
> **Пояснення:** *mit* завжди з Dativ; *der Bus* → *dem Bus*. Артикль обовʼязковий. Тема A2-06.

> [!quiz] «Книга лежить на столі.» Яка форма правильна?
> level: A2 · type: single · id: de-a2-review-q11
> - [ ] Das Buch liegt auf den Tisch.
> - [x] Das Buch liegt auf dem Tisch.
> - [ ] Das Buch liegt auf das Tisch.
> - [ ] Das Buch liegt auf der Tisch.
>
> **Пояснення:** *liegen* відповідає на питання *wo?* (де лежить?) → Dativ: *auf dem Tisch*. Тема A2-08.

> [!quiz] Обери займенник: «Das Geschenk ist für ___.» (тобі)
> level: A2 · type: single · id: de-a2-review-q12
> - [x] dich
> - [ ] dir
> - [ ] du
> - [ ] dein
>
> **Пояснення:** *für* завжди вимагає Akkusativ: *für dich*. Те саме *durch, gegen, ohne, um*: *ohne mich, gegen ihn*. Тема A2-06.

> [!quiz] Заповни пропуски: де і куди
> level: A2 · type: fill · id: de-a2-review-q13 · bank: vom, durchs
>
> ```text fill
> Ich bin [[im]] Büro. (в офісі)
> Ich gehe [[ins]] Büro. (в офіс)
> Wir fahren [[zum]] Arzt. (до лікаря)
> Ich bin [[beim]] Arzt. (у лікаря)
> ```
>
> **Пояснення:** *in dem = im* (де?), *in das = ins* (куди?). Для людей: *zu dem = zum* (до кого?), *bei dem = beim* (у кого?). Теми A2-06 і A2-08. *Vom* і *durchs* не підходять за значенням.

> [!quiz] Склади речення: «Я даю його йому.» (книжку, Buch)
> level: A2 · type: order · id: de-a2-review-q14
>
> ```text order
> Ich gebe
> es
> ihm.
> ihm es ✗
> ```
>
> **Пояснення:** займенник у Akkusativ (*es*) стоїть перед займенником у Dativ (*ihm*). Тема A2-19.

## Блок 3. Прикметники й порівняння

> [!quiz] «Я купую новий стіл.» Обери закінчення: «Ich kaufe den ___ Tisch.»
> level: A2 · type: single · id: de-a2-review-q15
> - [x] neuen
> - [ ] neue
> - [ ] neuer
> - [ ] neues
>
> **Пояснення:** після *den* (Akkusativ чоловічого роду) — слабка відміна, закінчення ***-en***. «Пʼять разів -e, решта -en»: *-e* лише в Nominativ (ч., ж., с.) і Akkusativ (ж., с.). Тема A2-15.

> [!quiz] «Це новий автомобіль.» Обери закінчення: «Das ist ein ___ Auto.»
> level: A2 · type: single · id: de-a2-review-q16
> - [ ] neue
> - [ ] neuer
> - [x] neues
> - [ ] neuen
>
> **Пояснення:** після *ein* у середньому роді артикль не показує рід, тому прикметник бере сигнал на себе: ***ein neues Auto***. Тема A2-17.

> [!quiz] Заповни закінчення прикметників
> level: A2 · type: fill · id: de-a2-review-q17 · bank: kalter, kaltes
>
> ```text fill
> Das ist eine [[neue]] Lampe.
> Ich trinke [[kalten]] Kaffee.
> Wir fahren mit dem [[alten]] Auto.
> ```
>
> **Пояснення:** після *eine* (жіночий Nominativ) — *-e*; без артикля в Akkusativ чоловічого роду — сильне закінчення *-en* (*kalten Kaffee*); після *dem* (Dativ) — *-en*. Теми A2-15 і A2-17.

> [!quiz] «Мій брат старший за мене.»
> level: A2 · type: single · id: de-a2-review-q18
> - [ ] Mein Bruder ist alter als ich.
> - [x] Mein Bruder ist älter als ich.
> - [ ] Mein Bruder ist mehr alt als ich.
> - [ ] Mein Bruder ist älter wie ich.
>
> **Пояснення:** вищий ступінь утворюється із суфіксом *-er* і умлаутом (*alt → älter*); порівняння — з ***als***, а не *wie*. Тема A2-10.

> [!quiz] «Я пʼю чай радше, ніж каву.» (gern)
> level: A2 · type: single · id: de-a2-review-q19
> - [ ] Ich trinke besser Tee als Kaffee.
> - [x] Ich trinke lieber Tee als Kaffee.
> - [ ] Ich trinke gerner Tee als Kaffee.
> - [ ] Ich trinke am liebsten Tee als Kaffee.
>
> **Пояснення:** *gern → lieber → am liebsten*. Для порівняння двох предметів — *lieber … als*; *am liebsten* — найвищий ступінь, з *als* не вживається. Тема A2-10.

## Блок 4. Підрядні речення, сполучники, майбутнє, зворотні дієслова

> [!quiz] «Я лишаюся вдома, бо хворію.» Яке речення правильне?
> level: A2 · type: single · id: de-a2-review-q20
> - [ ] Ich bleibe zu Hause, weil ich bin krank.
> - [x] Ich bleibe zu Hause, weil ich krank bin.
> - [ ] Ich bleibe zu Hause, weil bin ich krank.
> - [ ] Ich bleibe zu Hause, weil ich krank sind.
>
> **Пояснення:** після *weil* змінюване дієслово йде в кінець: *weil ich krank **bin***. Тема A2-11.

> [!quiz] «Якщо в мене буде час, я прийду.» Яке речення правильне?
> level: A2 · type: single · id: de-a2-review-q21
> - [ ] Wenn ich Zeit habe, ich komme.
> - [ ] Wenn ich habe Zeit, komme ich.
> - [x] Wenn ich Zeit habe, komme ich.
> - [ ] Wenn ich Zeit habe komme ich.
>
> **Пояснення:** підрядне речення на першому місці займає позицію 1, тому в головному дієслово йде одразу після коми: *…, komme ich*. Кома між частинами обовʼязкова. Тема A2-11.

> [!quiz] «Чи можете Ви сказати мені, де вокзал?»
> level: A2 · type: single · id: de-a2-review-q22
> - [ ] Können Sie mir sagen, wo ist der Bahnhof?
> - [x] Können Sie mir sagen, wo der Bahnhof ist?
> - [ ] Können Sie mir sagen, ob wo der Bahnhof ist?
> - [ ] Können Sie mir sagen, wo der Bahnhof?
>
> **Пояснення:** непряме питання — підрядне речення: питальне слово + підмет + дієслово в кінці. Тема A2-25.

> [!quiz] «Я не знаю, чи він прийде.» Яке слово пропущено: «Ich weiß nicht, ___ er kommt.»
> level: A2 · type: single · id: de-a2-review-q23
> - [ ] wenn
> - [x] ob
> - [ ] dass
> - [ ] weil
>
> **Пояснення:** питання «так / ні» у непрямій формі вводиться ***ob*** («чи»). *Wenn* — «якщо», *dass* — «що», *weil* — «тому що». Тема A2-25.

> [!quiz] «Іде дощ, тому я лишаюся вдома.» Яке слово пропущено: «Es regnet, ___ bleibe ich zu Hause.»
> level: A2 · type: single · id: de-a2-review-q24
> - [x] deshalb
> - [ ] denn
> - [ ] weil
> - [ ] dass
>
> **Пояснення:** *deshalb* відкриває речення з інверсією: *deshalb bleibe ich*. Після *denn* і *weil* порядок інший (*denn ich bleibe*, *weil ich bleibe*). Теми A2-23 і A2-11.

> [!quiz] Склади речення: «Іде дощ, тому я лишаюся вдома.»
> level: A2 · type: order · id: de-a2-review-q25
>
> ```text order
> Es regnet,
> deshalb
> bleibe
> ich
> zu Hause.
> ich bleibe ✗
> ```
>
> **Пояснення:** *deshalb* займає перше місце в другій частині, тож дієслово стоїть одразу за ним, а підмет після дієслова. Тема A2-23.

> [!quiz] «Завтра буде дощ.» Яка форма правильна?
> level: A2 · type: single · id: de-a2-review-q26
> - [ ] Morgen werde es regnen.
> - [x] Morgen wird es regnen.
> - [ ] Morgen wirst es regnen.
> - [ ] Morgen wurde es regnen.
>
> **Пояснення:** Futur I: *werden* у потрібній особі (*es wird*) + інфінітив у кінці. *Wurde* — минуле. Тема A2-22.

> [!quiz] «Я радію вихідним.» Яка форма правильна: «Ich freue ___ auf das Wochenende.»
> level: A2 · type: single · id: de-a2-review-q27
> - [ ] mir
> - [x] mich
> - [ ] dich
> - [ ] sich
>
> **Пояснення:** зворотний займенник відповідає підмету: *ich → mich*. Тема A2-14.

> [!quiz] Заповни зворотні займенники
> level: A2 · type: fill · id: de-a2-review-q28 · bank: mich, dir
>
> ```text fill
> Ich wasche [[mir]] die Hände. (собі)
> Er wäscht [[sich]]. (сам себе)
> Wir treffen [[uns]] um acht. (одне з одним)
> ```
>
> **Пояснення:** коли в реченні є другий обʼєкт (*die Hände*), зворотний займенник стоїть у Dativ: *ich wasche **mir** die Hände*. Інакше — Akkusativ: *er wäscht **sich***. Для *wir* — *uns*. Тема A2-14.

## Блок 5. Вимова й правопис

> [!quiz] Які дієслова мають наголос на першому складі? Обери всі.
> level: A2 · type: multi · id: de-a2-review-q29
> - [x] anrufen
> - [x] einkaufen
> - [x] aufstehen
> - [ ] verstehen
> - [ ] besuchen
>
> **Пояснення:** відокремлювані префікси наголошені: *ˈanrufen, ˈeinkaufen, ˈaufstehen*. Невідокремлювані *ver-, be-, er-* не наголошені: *verˈstehen, beˈsuchen*. Тема A2-03.

> [!quiz] Як правильно писати «річка» після реформи правопису?
> level: A2 · type: single · id: de-a2-review-q30
> - [ ] Fluß
> - [x] Fluss
> - [ ] Flus
> - [ ] Flüss
>
> **Пояснення:** зазвичай після короткого голосного пишемо ***ss***: *Fluss, muss*. ***ß*** — після довгого голосного чи дифтонга (*Straße, heiß*). *Fluß* — написання до реформи 1996 року. Тема A2-26.

> [!quiz] Яка мелодія в питанні «Kommst du morgen?»
> level: A2 · type: single · id: de-a2-review-q31
> - [x] голос іде вгору ↗
> - [ ] голос іде вниз ↘
> - [ ] голос лишається рівним
> - [ ] голос іде вгору, а потім різко вниз
>
> **Пояснення:** у питанні «так / ні» голос піднімається наприкінці (↗). У W-питанні (*Wann kommst du?*) і твердженні — вниз (↘). Тема A2-18.

> [!quiz] «Я думаю, що він завтра прийде.» Яке слово пропущено: «Ich glaube, ___ er morgen kommt.»
> level: A2 · type: single · id: de-a2-review-q32
> - [x] dass
> - [ ] das
> - [ ] ob
> - [ ] wenn
>
> **Пояснення:** ***dass*** («що») вводить підрядне речення з фактом чи думкою; дієслово — у кінці. *Das* — артикль чи вказівний займенник (друга літера *s* подвоєна лише в сполучнику). *Ob* — «чи», *wenn* — «якщо». Тема A2-11.

## Диктант і аудіювання

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-review-l01
> audio: Wir sind gestern nach Köln gefahren.
> - [ ] Wir fahren morgen nach Köln.
> - [x] Wir sind gestern nach Köln gefahren.
> - [ ] Wir waren gestern in Köln.
>
> **Пояснення:** *sind … gefahren* — Perfekt, *gestern* — вчора. *Fahren* — рух, тож *nach Köln*; *in Köln* стоїть із *sein* (*wir waren in Köln*) і означає стан, а не рух. Тема A2-01.

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-review-l02
> audio: Ich helfe dir gern.
> - [x] Ich helfe dir gern.
> - [ ] Ich helfe ihr gern.
> - [ ] Ich helfe Ihnen gern.
>
> **Пояснення:** *dir* починається з [d], *ihr* — без приголосного на початку, *Ihnen* — три склади. Тема A2-05.

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-review-l03
> audio: Das Buch liegt auf dem Tisch.
> - [ ] Er legt das Buch auf den Tisch.
> - [x] Das Buch liegt auf dem Tisch.
> - [ ] Er stellt das Buch auf den Tisch.
>
> **Пояснення:** *liegt … auf dem Tisch* — стан, Dativ. *Legt … auf den Tisch* — рух, Akkusativ. Тема A2-08.

> [!listen] Диктант. Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-review-l04
> audio: Gestern konnte ich leider nicht kommen.

> [!listen] Диктант. Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-review-l05
> audio: Ich freue mich auf das Wochenende, weil ich frei habe.

> [!listen] Диктант. Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-review-l06
> audio: Können Sie mir sagen, wo der Bahnhof ist?

> [!listen] Телефонна розмова. Коли в пацієнта запис до лікаря?
> level: A2 · type: answer · speed: slow · id: de-a2-review-l07
> audio: A: Praxis Dr. Schneider, guten Tag.
> audio: B: Guten Tag, ich möchte einen Termin vereinbaren. Ich habe seit gestern Fieber.
> audio: A: Können Sie morgen um zehn Uhr kommen?
> audio: B: Ja, das passt. Vielen Dank.
> - [ ] сьогодні о десятій
> - [x] завтра о десятій
> - [ ] завтра о девʼятій
> - [ ] післязавтра о десятій
>
> **Пояснення:** *morgen um zehn Uhr* — завтра о десятій. Тема A2-21.

> [!listen] Оголошення на вокзалі. З якої колії відправляється поїзд?
> level: A2 · type: answer · speed: slow · id: de-a2-review-l08
> audio: Achtung am Gleis fünf: Der ICE nach München hat zwanzig Minuten Verspätung. Er fährt nicht von Gleis fünf ab, sondern von Gleis acht.
> - [ ] з колії пʼять
> - [x] з колії вісім
> - [ ] з колії двадцять
> - [ ] поїзд скасовано
>
> **Пояснення:** *nicht von Gleis fünf, sondern von Gleis acht* — не з пʼятої, а з восьмої. Число *zwanzig* — це хвилини затримки. Тема A2-09.

> [!listen] Заповни запрошення за голосовим повідомленням
> level: A2 · type: fill · speed: slow · id: de-a2-review-l09
> audio: Hallo Mia, hier ist Jonas. Ich habe am Samstag Geburtstag. Die Party beginnt um neunzehn Uhr. Sie ist bei mir in der Bahnhofstraße zwölf. Kommst du?
>
> ```fill
> Tag: [[Samstag]]
> Uhrzeit: [[19|neunzehn]] Uhr
> Adresse: Bahnhofstraße [[12|zwölf]]
> ```

> [!listen] У Bürgeramt. Що треба принести?
> level: A2 · type: answer · speed: slow · id: de-a2-review-l10
> audio: A: Guten Tag. Ich möchte meine Wohnung anmelden. Brauche ich einen Termin?
> audio: B: Ja, bitte buchen Sie einen Termin im Internet.
> audio: A: Was muss ich mitbringen?
> audio: B: Ihren Ausweis und die Wohnungsgeberbestätigung.
> - [x] документ з фото й підтвердження від орендодавця
> - [ ] лише рецепт
> - [ ] лише гроші
> - [ ] нічого, достатньо прийти без запису
>
> **Пояснення:** потрібні *Ausweis* і *Wohnungsgeberbestätigung*, а також запис (*Termin*) в інтернеті. Тема A2-29.

## Мінімальні пари

> [!pair] Ofen /ˈoːfn̩/ — offen /ˈɔfn̩/
> level: A2 · id: de-a2-review-p01
> say: offen
> tip: [oː] — закрите довге, [ɔ] — коротке й відкритіше. Подвоєне ff позначає короткий голосний.

> [!pair] Beet /beːt/ — Bett /bɛt/
> level: A2 · id: de-a2-review-p02
> say: Beet
> tip: [eː] — довге напружене, [ɛ] — коротке й відкрите. Подвоєне tt — ознака короткості.

> [!pair] Höhle /ˈhøːlə/ — Hölle /ˈhœlə/
> level: A2 · id: de-a2-review-p03
> say: Höhle
> tip: ö довге [øː] (німе h лише тягне звук) проти короткого [œ].

> [!pair] kam /kaːm/ — Kamm /kam/
> level: A2 · id: de-a2-review-p04
> say: Kamm
> tip: довге [aː] проти короткого [a]; мм після голосного — коротко.

> [!pair] Stiel /ʃtiːl/ — still /ʃtɪl/
> level: A2 · id: de-a2-review-p05
> say: still
> tip: ie — довге [iː], подвоєне ll — короткий [ɪ].

> [!pair] Staat /ʃtaːt/ — Stadt /ʃtat/
> level: A2 · id: de-a2-review-p06
> say: Stadt
> tip: довге [aː] проти короткого [a]; приголосні однакові, різниця лише в довготі голосного.

## Говоріння

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-review-s01
> text: Gestern bin ich nach Hause gefahren und habe lange geschlafen.
> ipa: /ˈɡɛstɐn bɪn ɪç naːx ˈhaʊ̯zə ɡəˈfaːʁən ʊnt ˈhaːbə ˈlaŋə ɡəˈʃlaːfn̩/
> tip: ge-fah-ren: наголос на -fah-, ge- слабке; ch у ich — [ç], в nach — [x]; в geschlafen — sch = [ʃ].
> uk: Вчора я поїхала додому і довго спала.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-review-s02
> text: Ich helfe dem Mann mit dem neuen Auto.
> ipa: /ɪç ˈhɛlfə deːm man mɪt deːm ˈnɔʏ̯ən ˈaʊ̯to/
> tip: neuen — eu = [ɔʏ̯], «ной»; dem — довге [eː]; Auto — au = [aʊ̯], наголос на першому складі.
> uk: Я допомагаю чоловікові з новою машиною.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-review-s03
> text: Ich freue mich auf das Wochenende.
> ipa: /ɪç ˈfʁɔʏ̯ə mɪç aʊ̯f das ˈvɔxn̩ˌʔɛndə/
> tip: freue — eu = [ɔʏ̯]; mich — [ç]; Wochenende — наголос на Wo-, ch після o = [x], -en слабке.
> uk: Я радію вихідним.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-review-s04
> text: Ich bleibe zu Hause, weil ich krank bin.
> ipa: /ɪç ˈblaɪ̯bə tsuː ˈhaʊ̯zə vaɪ̯l ɪç kʁaŋk bɪn/
> tip: bleibe — ei = «ай»; Hause — h видихом, s дзвінке [z]; weil — w = [v]; після коми зроби коротку паузу.
> uk: Я лишаюся вдома, бо хворію.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-review-s05
> text: Können Sie mir sagen, ob der Zug pünktlich ist?
> ipa: /ˈkœnən ziː miːɐ̯ ˈzaːɡn̩ ɔp deːɐ̯ tsuːk ˈpʏŋktlɪç ɪst/
> tip: ö коротке й округлене; ob — b у кінці = [p]; Zug — z = [ts], g у кінці = [k]; голос наприкінці іде вгору ↗.
> uk: Чи можете Ви сказати, чи поїзд пунктуальний?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-review-s06
> text: Es regnet, deshalb bleibe ich zu Hause.
> ipa: /ɛs ˈʁeːɡnət ˈdɛshalp ˈblaɪ̯bə ɪç tsuː ˈhaʊ̯zə/
> tip: regnet — довге [eː], g перед n як [ɡ]; deshalb — b у кінці складу = [p]; після коми невелика пауза, голос ↘ наприкінці.
> uk: Іде дощ, тому я лишаюся вдома.

## Типові помилки, які ще трапляються

> [!pitfall] Perfekt: допоміжне дієслово й Partizip II
> ~~Ich habe nach Hause gegangen~~, ~~Ich bin das Auto gefahren~~ (коли ти керував авто), ~~Ich habe geeinkauft~~ → *Ich **bin** nach Hause gegangen. Ich **habe** das Auto gefahren. Ich habe **ein**gekauft.* Рух і зміна стану — зазвичай *sein*, але *fahren* з прямим додатком — *haben*. Відокремлюване дієслово: *ge-* всередині.

> [!pitfall] Відмінок «за українським»
> ~~Ich helfe dich~~, ~~mit den Bus~~, ~~Ich gehe in Büro~~, ~~Ich bin ins Büro~~ → *Ich helfe **dir**. mit **dem** Bus. Ich gehe **ins** Büro. Ich bin **im** Büro.* Запитай *кому?* (Dativ), *де?* (Dativ) чи *куди?* (Akkusativ) і не покладайся на український відмінок.

> [!pitfall] Дієслово не в кінці підрядного
> ~~weil ich bin krank~~, ~~Ich weiß nicht, wo ist der Bahnhof~~, ~~deshalb ich bleibe~~ → *weil ich krank **bin***; *wo der Bahnhof **ist***; *deshalb **bleibe** ich*. Після *weil, dass, wenn, ob* і питального слова дієслово в кінці, після *deshalb* — друге.

> [!pitfall] Закінчення прикметника, «wie» і «mir / mich»
> ~~ein neue Auto~~ → *ein neu**es** Auto*; ~~größer wie~~ → *größer **als***; ~~Ich freue mir~~ → *Ich freue **mich***. Закінчення прикметника залежить від артикля, роду й відмінка; порівняння — *als*; зворотний займенник — той, що відповідає підмету.

## Чекліст «я вмію»

Познач, що вже виходить. Незнайомі пункти повтори у відповідних темах.

**Минуле й майбутнє (A2-01, 02, 04, 22)**
- [ ] Я утворюю Partizip II правильних і найчастіших неправильних дієслів і обираю *haben* чи *sein*.
- [ ] Я кажу про минуле з *war, hatte, konnte, musste, wollte*.
- [ ] Я розповідаю про своє життя в послідовності (*zuerst, dann, danach*) і називаю роки.
- [ ] Я говорю про майбутнє Präsens із маркером часу або Futur I.

**Відмінки й прийменники (A2-05, 06, 08, 19)**
- [ ] Я вживаю Dativ з артиклями, займенниками (*mir, dir, ihm…*) і дієсловами *helfen, danken, gefallen, gehören*.
- [ ] Я знаю прийменники з Dativ (*aus, bei, mit, nach, seit, von, zu*) та з Akkusativ (*durch, für, gegen, ohne, um*).
- [ ] Я розрізняю *wo?* + Dativ і *wohin?* + Akkusativ та пари *liegen / legen, stehen / stellen*.
- [ ] Я ставлю два займенники в правильному порядку: *Ich gebe es ihm.*

**Прикметники, порівняння, зворотні дієслова (A2-10, 14, 15, 17)**
- [ ] Я додаю закінчення прикметнику після *der / die / das*, після *ein* і без артикля.
- [ ] Я утворюю *groß — größer — am größten*, знаю *gut — besser — am besten* і *gern — lieber — am liebsten*.
- [ ] Я вживаю зворотні дієслова, зокрема з Dativ (*Ich wasche mir die Hände*).

**Складні речення (A2-11, 23, 25)**
- [ ] Я будую підрядні речення з *weil, dass, wenn* і ставлю дієслово в кінець.
- [ ] Я зʼєдную речення через *und, aber, denn, sondern* і *deshalb, trotzdem*.
- [ ] Я ставлю ввічливі непрямі питання (*Wissen Sie, ob … / wo …*).

**Слова й ситуації (A2-04, 07, 12, 16, 20, 24, 27, 29)**
- [ ] Я купую квиток, орієнтуюся на вокзалі й бронюю житло.
- [ ] Я розповідаю про роботу, здоровʼя, почуття й свята.
- [ ] Я ходжу з документами в Bürgeramt, в аптеку, банк і на огляд квартири.

**Вимова та правопис (A2-03, 13, 18, 26)**
- [ ] Я ставлю наголос у слові (*ˈanrufen — verˈstehen*) й у реченні.
- [ ] Я використовую ↗ у питанні «так / ні» та ↘ у твердженні.
- [ ] Я розрізняю *ß* і *ss*, пишу *ä* за спорідненим словом (*Hand → Hände*).

**Аудіювання, читання, письмо (A2-09, 21, 28)**
- [ ] Я розумію оголошення на вокзалі, прогноз погоди й телефонні повідомлення.
- [ ] Я записую імʼя, число й час зі слуху.
- [ ] Я пишу SMS на ≈ 20–30 слів і email на ≈ 30–40 слів за трьома пунктами.

Якщо ти позначив(ла) більшість пунктів і набрав(ла) ≈ 80 % у тесті вище, ти готовий(а) до рівня B1.

## Фішки

> [!reel] 🧭 Девʼять прийменників
> Усі Wechselpräpositionen можна пройти як вірш: *in, an, auf, über, unter, vor, hinter, neben, zwischen*. Девʼять слів — і одне питання: *wo?* чи *wohin?* Якщо ти вмієш відповісти на нього, відмінок ти вже знаєш.

> [!reel] 🎓 Goethe-Zertifikat A2
> Письмова частина іспиту Goethe A2 триває 90 хвилин: читання 30 хв, аудіювання ≈ 30 хв, письмо 30 хв. Усна частина — ≈ 15 хв у парі. Щоб скласти, потрібно набрати щонайменше 60 зі 100 балів. Граматика цієї теми потрібна на кожній частині іспиту.

> [!reel] ⏭️ Німці рідко кажуть Futur I
> Хоча Futur I існує, про найближче майбутнє німці здебільшого просто кажуть Präsens із часом: *Morgen fahre ich nach Berlin.* Futur I зʼявляється, коли треба підкреслити обіцянку, план чи прогноз, або коли маркера часу немає.

## Джерела та що почитати

- [Goethe-Institut — Durchführungsbestimmungen Goethe-Zertifikat A2 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_A2.pdf): офіційний опис формату іспиту: частини, тривалість, прохідний бал.
- [Goethe-Institut — Modellsatz Goethe-Zertifikat A2 (PDF)](https://www.goethe.de/pro/relaunch/prf/materialien/A2/A2_Modellsatz_Erwachsene.pdf): зразок завдань.
- [DW Learn German — Nicos Weg (українською)](https://learngerman.dw.com/uk/nicos-weg/c-36519789): безкоштовний відеокурс A1–B1.
- [DWDS — Hand](https://www.dwds.de/wb/Hand): множина Hände та споріднені слова.
- [DWDS — Fluss](https://www.dwds.de/wb/Fluss): рід, множина, правопис.

> [!important] Підсумок
> - Змінюване дієслово — **на 2-му місці** в головному реченні, **в кінці** підрядного; *deshalb* відкриває речення, і дієслово йде одразу за ним.
> - Perfekt: **haben / sein + Partizip II**; **war, hatte, konnte** — для розмовного минулого.
> - **wo?** → Dativ, **wohin?** → Akkusativ; після *mit, bei, zu, aus, nach, seit, von* — Dativ, після *für, durch, gegen, ohne, um* — Akkusativ.
> - Прикметник: після der / die / das — «пʼять разів -e, решта -en»; після *ein* і без артикля прикметник бере сигнал роду.
> - Порівняння — з **als**; *gern — lieber — am liebsten*. Непряме питання: **ob** або питальне слово, дієслово в кінці.
> - Якщо тест виконано на ≈ 80 % — переходь до B1; решту повтори за номерами тем.
