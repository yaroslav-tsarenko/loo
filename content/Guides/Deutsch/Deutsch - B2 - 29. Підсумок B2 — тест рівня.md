---
title: Підсумок B2 — тест рівня
id: de-b2-review
level: B2
icon: px:crown
tags: [deutsch, b2, review, test]
prerequisites: ["[[Deutsch - B2 - 28. Ситуації — суперечка з орендодавцем, скарга, банк, батьківські збори]]"]
estimatedMinutes: 90
---

# Підсумок B2 — тест рівня

> [!success] Після цієї теми ти зможеш
> - перевірити себе з усього рівня B2: *систему часів і Futur II, пасив у всіх часах і його замінники, Konjunktiv II минулого, Konjunktiv I, субʼєктивні модальні, конектори, дієприкметникові означення, номіналізацію, префіксальні дієслова, Funktionsverbgefüge, словотвір* і лексику тем «робота, наука, суспільство, здоровʼя, гроші, культура»;
> - розрізняти на слух нереальне минуле, чужі слова (Konjunktiv I), субʼєктивні модальні й офіційний стиль та записати речення під диктовку;
> - попрацювати в форматі Goethe-Zertifikat B2: текст для читання (вибір a / b / c) і завдання на аудіювання з усіх чотирьох частин;
> - почути й вимовити мінімальні пари рівня B2 (*Technik / Technologie, Kritik / Kritiker*) і типові фрази для листа, дискусії та новин;
> - позначити в чеклісті «я вмію», що вже працює, а що ще варто повторити.

Це тема без нового матеріалу. Нових правил тут немає, а кілька слів ти можеш вгадати з контексту; усе інше ти вже вивчив(ла) у темах B2-01…28 і на попередніх рівнях. Якщо щось не виходить, повернися до теми, на яку вказує підказка в поясненні. Після кожного блоку зроби паузу й подивись, у якому розділі найбільше помилок.

> [!diagram] Факт чи ні: які форми B2 ми вибираємо
> ```yaml
> layout: compare
> columns: { a: "Факт або процес", b: "Нереально, чуже, припущення" }
> nodes:
>   - { id: a1, col: a, label: "Звичайний факт", text: "Er ist krank.", note: "Indikativ", tone: yellow }
>   - { id: a2, col: a, label: "Дію названо без виконавця", text: "Das Haus ist 1990 gebaut worden.", note: "Passiv, B2-02", tone: yellow }
>   - { id: b1, col: b, label: "Нереальне минуле", text: "Hätte ich das gewusst, wäre ich nicht gekommen.", note: "Konjunktiv II, B2-04", tone: pink }
>   - { id: b2, col: b, label: "Чужі слова в новинах", text: "Er sagte, er sei krank.", note: "Konjunktiv I, B2-06", tone: pink }
>   - { id: b3, col: b, label: "«Кажуть» або «стверджує»", text: "Er soll reich sein. Sie will ihn gesehen haben.", note: "субʼєктивні модальні, B2-07", tone: pink }
>   - { id: b4, col: b, label: "Припущення про минуле", text: "Er wird den Zug verpasst haben.", note: "Futur II, B2-01", tone: pink }
> steps:
>   - { focus: [a1, a2], note: "Ліва колонка — те, що ми подаємо як факт або як процес: Indikativ і пасив." }
>   - { focus: [b1, b2, b3, b4], note: "Права колонка — те, чого не було, що сказав хтось інший або що ми лише припускаємо. Кожне значення має свою форму." }
> ```
> Кольори розрізняють лише колонки; назву теми видно з підпису в кожному блоці.

> [!diagram] Пасив у всіх часах: що змінюється в дієслові
> ```yaml
> layout: flow
> nodes:
>   - { id: s, label: "підмет", text: "Das Haus", tone: mint }
>   - { id: v, label: "2-ге місце · змінюване дієслово", text: "wird", tone: orange }
>   - { id: r, label: "решта", text: "jetzt", tone: gray }
>   - { id: e, label: "кінець речення", text: "gebaut.", tone: gray }
> steps:
>   - { focus: [s, v, e], note: "Präsens: werden + Partizip II. Das Haus wird gebaut." }
>   - { set: { v: "wurde", r: "1990" }, focus: [v], note: "Präteritum: wurde. Das Haus wurde 1990 gebaut." }
>   - { set: { v: "ist", r: "1990", e: "gebaut worden." }, focus: [v, e], note: "Perfekt: sein + Partizip II + worden. Не «geworden»: у пасиві Partizip II від werden — worden (B2-02)." }
>   - { set: { v: "war", r: "vor 1990", e: "gebaut worden." }, focus: [v, e], note: "Plusquamperfekt: war … gebaut worden." }
>   - { set: { v: "wird", r: "bald", e: "gebaut werden." }, focus: [v, e], note: "Futur I: wird … gebaut werden — у кінці два інфінітивні елементи." }
>   - { set: { v: "muss", r: "bald", e: "gebaut werden." }, focus: [v, e], note: "З модальним: muss … gebaut werden. У підрядному реченні модальне стоїть останнім: …, weil das Haus gebaut werden muss." }
> ```
> Змінюване дієслово завжди на 2-му місці в головному реченні, а все «довге» (Partizip II, *worden*, *werden*) стоїть наприкінці.

## Блок 1. Часи, пасив, замінники пасиву і слово з рецензії

> [!quiz] Яке речення — припущення про минуле («мабуть, він запізнився на потяг»)?
> level: B2 · type: single · id: de-b2-review-q01
> - [ ] Er wird den Zug verpassen.
> - [x] Er wird den Zug verpasst haben.
> - [ ] Er wird den Zug verpasst.
> - [ ] Er hat den Zug verpasst haben.
>
> **Пояснення:** припущення про минуле — Futur II: *werden* + Partizip II + *haben / sein*. *Er wird den Zug verpassen* — Futur I, про майбутнє (або про теперішнє з *wohl*). *Er wird den Zug verpasst* — неможлива форма: пасив був би *Der Zug wird verpasst* (без додатка в Akkusativ), а в останньому реченні форма *haben* після *hat* не має сенсу. Тема B2-01.

> [!quiz] Заповни пропуски: пасив
> level: B2 · type: fill · id: de-b2-review-q02
>
> ```text fill
> Das Haus ist 1990 gebaut [[worden]]. (Perfekt Passiv)
> Das Dach muss bald repariert [[werden]]. (пасив із модальним)
> Die Tür [[ist]] geöffnet, du kannst hineingehen. (стан, не процес)
> ```
>
> **Пояснення:** у Perfekt Passiv замість *geworden* стоїть **worden**; з модальним — *werden* в кінці інфінітивної групи; стан («відчинено») — *sein* + Partizip II (Zustandspassiv), а *wird geöffnet* означало б, що двері відчиняють саме зараз. Тема B2-02.

> [!quiz] Рецензія на фільм: «Фільм, на жаль, надто затягнутий». «Der Film war leider ziemlich ___.»
> level: B2 · type: single · id: de-b2-review-q03
> - [x] langatmig
> - [ ] kurzweilig
> - [ ] überzeugend
> - [ ] spannend
>
> **Пояснення:** *langatmig* — «затягнутий, багатослівний» (про фільм, книжку, доповідь). *Kurzweilig* — навпаки, «цікавий, такий, що час летить»; *überzeugend* («переконливий») і *spannend* («захопливий») із «на жаль» не поєднуються. Тема B2-20.

> [!quiz] Які речення означають «Це можна легко перевірити»? Обери всі.
> level: B2 · type: multi · id: de-b2-review-q04
> - [x] Das lässt sich leicht überprüfen.
> - [x] Das ist leicht zu überprüfen.
> - [x] Das ist leicht überprüfbar.
> - [ ] Das lässt leicht überprüfen sich.
> - [ ] Das ist leicht zu überprüfen worden.
>
> **Пояснення:** три замінники пасиву зі значенням «можливо»: *sich lassen* + інфінітив, *sein + zu* + інфінітив і прикметник на *-bar*. У четвертому реченні *sich* стоїть не там (зворотний займенник іде одразу після дієслова), а *zu … worden* не вживається: *worden* належить лише до складених форм пасиву. Тема B2-03.

> [!quiz] Склади речення: «Збір потрібно сплатити наперед»
> level: B2 · type: order · id: de-b2-review-q05
>
> ```text order
> Die
> Gebühr
> ist
> im
> Voraus
> zu
> entrichten.
> werden ✗
> ```
>
> **Пояснення:** *sein + zu* + інфінітив у значенні «слід»: *zu* стоїть перед інфінітивом, інфінітив — наприкінці. *Werden* не потрібне: *ist … zu entrichten* уже замінює пасив. Це типовий *Amtsdeutsch*. Тема B2-03.

## Блок 2. Konjunktiv II, Konjunktiv I, субʼєктивні модальні й словотвір

> [!quiz] Заповни пропуски: Konjunktiv II минулого
> level: B2 · type: fill · id: de-b2-review-q06
>
> ```text fill
> Wenn ich das gewusst [[hätte]], [[wäre]] ich nicht gekommen. (wissen; kommen)
> Beinahe [[wäre]] ich eingeschlafen. (ледь не заснув)
> ```
>
> **Пояснення:** нереальне минуле — **hätte / wäre + Partizip II**; допоміжне те саме, що в Perfekt: *wissen* — *haben*, *kommen* і *einschlafen* — *sein*. *Hatte* — це Präteritum, тобто факт, а не нереальна умова. Тема B2-04.

> [!quiz] «Нам слід було піти раніше.» Яка форма правильна?
> level: B2 · type: single · id: de-b2-review-q07
> - [ ] Wir hätten früher gegangen sollen.
> - [x] Wir hätten früher gehen sollen.
> - [ ] Wir hatten früher gehen sollen.
> - [ ] Wir wären früher gehen sollen.
>
> **Пояснення:** з модальним дієсловом у Konjunktiv II минулого стоїть **подвійний інфінітив**: *hätten … gehen sollen*, а не Partizip II *gesollt*. Допоміжне — *hätten* (модальне дієслово завжди з *haben*), тому *wären* не підходить, а *hatten* — звичайний Plusquamperfekt. Тема B2-04.

> [!quiz] «Він поводиться так, ніби все знає.» Яка форма пропущена? «Er tut so, als ob er alles ___.»
> level: B2 · type: single · id: de-b2-review-q08
> - [x] wüsste
> - [ ] wusste
> - [ ] gewusst
> - [ ] wissen
>
> **Пояснення:** після *als ob* ставимо Konjunktiv II: *wüsste* (від *wissen*, з умлаутом). *Wusste* — Präteritum Indikativ, його у нормативному тексті тут не вживають; *gewusst* і *wissen* — форми без особи. Тема B2-05.

> [!quiz] «Це надто дорого, щоб ми могли собі це дозволити.» «Das ist zu teuer, ___ wir es uns leisten könnten.»
> level: B2 · type: single · id: de-b2-review-q09
> - [x] als dass
> - [ ] sodass
> - [ ] damit
> - [ ] um
>
> **Пояснення:** конструкція **zu … als dass** + Konjunktiv II = «надто …, щоб». *Sodass* виражає реальний наслідок, *damit* — мету, а *um* вимагає *zu* + інфінітив при тому самому підметі (тут підмети різні). Тема B2-05.

> [!quiz] Новини, письмовий стиль. «Die Politiker sagten, sie ___ keine Zeit.» (Konjunktiv)
> level: B2 · type: single · id: de-b2-review-q10
> - [ ] haben
> - [ ] habe
> - [x] hätten
> - [ ] hatten
>
> **Пояснення:** Konjunktiv I від *haben* для 3-ї особи множини (*sie haben*) збігається з Indikativ, тому беремо **Konjunktiv II: hätten**. *Habe* — форма однини (*er habe*), *hatten* — Präteritum. Тема B2-06.

> [!quiz] Заповни пропуски: Konjunktiv I
> level: B2 · type: fill · id: de-b2-review-q11
>
> ```text fill
> Sie behauptete, er [[sei]] gestern in Berlin gewesen. (sein)
> Der Sprecher erklärte, man [[werde]] die Preise erhöhen. (Futur)
> Der Zeuge sagte, er [[habe]] den Täter nicht gesehen. (haben)
> ```
>
> **Пояснення:** минуле в непрямій мові — *sei / habe + Partizip II* (*er sei gewesen, er habe gesehen*), майбутнє — *werde* + інфінітив. Форми однини Konjunktiv I відрізняються від Indikativ (*er ist* → *er sei*, *er hat* → *er habe*). Тема B2-06.

> [!quiz] «Кажуть (чутки), що він дуже багатий.» «Er ___ sehr reich sein.»
> level: B2 · type: single · id: de-b2-review-q12
> - [ ] will
> - [x] soll
> - [ ] muss
> - [ ] kann
>
> **Пояснення:** **sollen** — «кажуть, що», слова інших. *Er will reich sein* — він сам це стверджує; *er muss reich sein* — я роблю висновок із фактів; *er kann reich sein* — «можливо». Тема B2-07.

> [!quiz] «Вона стверджує, що бачила його.» «Sie ___ ihn gesehen haben.»
> level: B2 · type: single · id: de-b2-review-q13
> - [ ] soll
> - [x] will
> - [ ] muss
> - [ ] dürfte
>
> **Пояснення:** **wollen** + Infinitiv Perfekt — «стверджує про себе, що …». *Soll … gesehen haben* означало б, що так кажуть інші; *muss … gesehen haben* — «мабуть, бачила»; *dürfte … gesehen haben* — «імовірно, бачила». Тема B2-07.

> [!quiz] «Дискусія була цілком безглуздою (не мала сенсу).» «Die Diskussion war völlig ___.»
> level: B2 · type: single · id: de-b2-review-q14
> - [x] sinnlos
> - [ ] sinnhaft
> - [ ] sinnmäßig
> - [ ] unsinnlos
>
> **Пояснення:** суфікс **-los** = «без»: *sinnlos* — «без сенсу». *-haft* дає схожість або властивість (*sinnhaft* — «сповнений сенсу», протилежне значення), *sinnmäßig* не існує, а *unsinnlos* — подвійне заперечення, якого німецька не знає. Тема B2-24.

## Блок 3. Конектори, дієприкметники, номіналізація, англіцизми

> [!quiz] Склади речення: «Хоча йде дощ, ми йдемо гуляти»
> level: B2 · type: order · id: de-b2-review-q15
>
> ```text order
> Obwohl
> es
> regnet,
> gehen
> wir
> spazieren.
> trotz ✗
> ```
>
> **Пояснення:** *obwohl* — підрядний сполучник: дієслово в кінці (*regnet*), а головне речення після коми починається з дієслова. *Trotz* — прийменник із Genitiv, перед повним реченням він не стоїть. Тема B2-08.

> [!quiz] «Якщо раптом підеш у магазин, купи хліб.» «___ du einkaufen gehst, kauf Brot.»
> level: B2 · type: single · id: de-b2-review-q16
> - [ ] Obwohl
> - [ ] Indem
> - [x] Falls
> - [ ] Sodass
>
> **Пояснення:** *falls* («якщо раптом») виражає умову. *Obwohl* — поступка («хоча»), *indem* — спосіб («тим, що»), *sodass* — наслідок. Тема B2-08.

> [!quiz] Лист в установу. Перепиши «Weil die Preise steigen, …» у Nominalstil.
> level: B2 · type: single · id: de-b2-review-q17
> - [x] Wegen des Anstiegs der Preise …
> - [ ] Wegen des Anstieg der Preise …
> - [ ] Wegen steigen der Preise …
> - [ ] Wegen die Preise zu steigen …
>
> **Пояснення:** *weil* → *wegen* + Genitiv; дієслово *steigen* → іменник *der Anstieg*, у Genitiv чоловічого роду — **des Anstiegs**, а підмет стає Genitiv-додатком: *der Preise*. Після Nominalstil кома зникає, бо підрядного речення вже немає. У розмові після *wegen* часто чути Dativ, але в офіційному листі нормою є Genitiv. Тема B2-10.

> [!quiz] «Дитина, що сміється» — яка форма? «Das ___ Kind ist glücklich.»
> level: B2 · type: single · id: de-b2-review-q18
> - [ ] gelachte
> - [x] lachende
> - [ ] lachte
> - [ ] lachendes
>
> **Пояснення:** дія триває — **Partizip I** (*lachen* + *-d*), і перед іменником він відмінюється як прикметник: *das lachende Kind*. *Gelachte* — Partizip II від неперехідного *lachen* не вживається як означення. *Lachendes* мало б закінчення -es, але після *das* закінчення слабке: **-e**. Тема B2-09.

> [!quiz] Склади розгорнуте означення: «дитина, що голосно сміється з жарту»
> level: B2 · type: order · id: de-b2-review-q19
>
> ```text order
> das
> über
> den
> Witz
> laut lachende
> Kind
> gelachte ✗
> ```
>
> **Пояснення:** усі залежні слова (*über den Witz*, *laut*) стоять між артиклем і дієприкметником; *lachende* — безпосередньо перед іменником, а *laut lachende* складай як один шматок. Тема B2-09.

> [!quiz] «Завдання, яке слід розвʼязати» — яка форма?
> level: B2 · type: single · id: de-b2-review-q20
> - [ ] die gelöste Aufgabe
> - [x] die zu lösende Aufgabe
> - [ ] die lösende Aufgabe
> - [ ] die zu gelöste Aufgabe
>
> **Пояснення:** **zu + Partizip I** + закінчення прикметника дає значення «яке слід / можна …»: *die zu lösende Aufgabe*. *Gelöste* означає «вже розвʼязане», *lösende* — «те, що розвʼязує», а *zu* з Partizip II не поєднується. Тема B2-09.

> [!quiz] Англійське дієслово в німецькій. «Wir haben gestern stundenlang ___.»
> level: B2 · type: single · id: de-b2-review-q21
> - [x] gechattet
> - [ ] gechatten
> - [ ] gechatted
> - [ ] chattete
>
> **Пояснення:** запозичені англійські дієслова стають слабкими: *chatten – chattete – hat gechattet*. *Gechatten* копіює сильну модель, *gechatted* зберігає англійське закінчення, а *chattete* — Präteritum, яке не поєднується з *haben* у цьому реченні. Тема B2-11.

> [!quiz] Які слова німці створили на основі англійських, але англомовні в цьому значенні їх не вживають? Обери всі.
> level: B2 · type: multi · id: de-b2-review-q22
> - [x] das Handy
> - [x] der Beamer
> - [x] der Oldtimer
> - [x] der Smoking
> - [ ] der Computer
> - [ ] das Internet
>
> **Пояснення:** *Handy* (мобільний телефон), *Beamer* (проєктор), *Oldtimer* (старий автомобіль-ретро) і *Smoking* (вечірній костюм) — це «німецькі англіцизми». *Computer* і *Internet* — звичайні запозичення, які англомовні розуміють. Тема B2-11.

## Блок 4. Лексика тем, префікси, сталі вирази

> [!quiz] «У нас є два тижні на подачу.» «Wir haben eine ___ von zwei Wochen für die Abgabe.»
> level: B2 · type: single · id: de-b2-review-q23
> - [x] Frist
> - [ ] Termin
> - [ ] Zeitpunkt
> - [ ] Stunde
>
> **Пояснення:** **Frist** — проміжок часу, який закінчується в певний день (кінцевий строк). *Termin* — дата (і час) зустрічі чи прийому (*Arzttermin*; *Abgabetermin* — дата здачі), а не проміжок. Українське «термін» збиває: воно покриває обидва слова. Тема B2-15.

> [!quiz] Роботодавець письмово вказав працівникові на порушення обовʼязків і попередив про наслідки. Як називається цей документ?
> level: B2 · type: single · id: de-b2-review-q24
> - [ ] die Mahnung
> - [x] die Abmahnung
> - [ ] die Kündigung
> - [ ] der Vertrag
>
> **Пояснення:** **Abmahnung** — офіційне попередження, зазвичай перед звільненням. *Mahnung* — нагадування про несплату (рахунок, борг), *Kündigung* — саме звільнення. Тема B2-15.

> [!quiz] Хто у кримінальній справі від імені держави підтримує обвинувачення?
> level: B2 · type: single · id: de-b2-review-q25
> - [x] der Staatsanwalt
> - [ ] der Rechtsanwalt
> - [ ] der Richter
> - [ ] der Betriebsrat
>
> **Пояснення:** *Staatsanwalt* — прокурор, представник держави. *Rechtsanwalt* — адвокат, який представляє клієнта; *Richter* — суддя, який виносить вирок. Через слово *Anwalt* прокурора часто плутають з адвокатом. Тема B2-17.

> [!quiz] Кого обирає виборець своїм першим голосом (*Erststimme*) на виборах до Бундестагу?
> level: B2 · type: single · id: de-b2-review-q26
> - [x] кандидата у своєму виборчому окрузі
> - [ ] партію
> - [ ] федерального канцлера
> - [ ] федерального президента
>
> **Пояснення:** першим голосом обирають кандидата в *Wahlkreis*, другим (*Zweitstimme*) — партійний список. Канцлера обирає Бундестаг, а не виборці безпосередньо; президента обирає Федеральні збори. Тема B2-17.

> [!quiz] «Прийняти рішення» — яка сполука правильна?
> level: B2 · type: single · id: de-b2-review-q27
> - [ ] eine Entscheidung machen
> - [ ] eine Entscheidung nehmen
> - [x] eine Entscheidung treffen
> - [ ] eine Entscheidung geben
>
> **Пояснення:** Funktionsverbgefüge вчимо цілком: **eine Entscheidung treffen**. Українське «прийняти» підказує *nehmen*, «зробити вибір» — *machen*, але правильна сполука — *treffen*; це головна калька в такого типу сполук. Тема B2-23.

> [!quiz] Він обʼїхав будівельний майданчик. «Er hat die Baustelle ___.»
> level: B2 · type: single · id: de-b2-review-q28
> - [x] umfahren
> - [ ] umgefahren
> - [ ] geumfahren
> - [ ] umfahrt
>
> **Пояснення:** значення «обʼїхати» — **невідокремлюване** *umfahren* (наголос на корені: *umˈfahren*), Partizip II без *ge-*. *Umgefahren* — від відокремлюваного *ˈumfahren* («збити»), тобто інше значення. *Geumfahren* додає зайве *ge-*; *umfahrt* — Präsens для *ihr*, а після *hat* потрібен Partizip II. Тема B2-21.

> [!quiz] «Тримаю за тебе кулаки» — яка німецька фраза?
> level: B2 · type: single · id: de-b2-review-q29
> - [ ] Ich drücke dir die Fäuste.
> - [x] Ich drücke dir die Daumen.
> - [ ] Ich balle für dich die Fäuste.
> - [ ] Ich drücke dir die Finger.
>
> **Пояснення:** у німецькій притискають **великий палець** (*die Daumen drücken*), а не кулаки. Образ відрізняється від українського, а сам вислів вчимо цілком, без заміни слів. Тема B2-22.

> [!quiz] Склади ввічливе прохання: «Я був би Вам вдячний, якби Ви відповіли мені до пʼятниці»
> level: B2 · type: order · id: de-b2-review-q30
>
> ```text order
> Ich
> wäre
> Ihnen
> dankbar,
> wenn
> Sie
> mir
> bis
> Freitag
> antworten
> könnten.
> hätte ✗
> ```
>
> **Пояснення:** формула *Ich wäre Ihnen dankbar, wenn …* + Konjunktiv II (*könnten*) у кінці підрядного речення. *Hätte* тут не підходить: після *dankbar* ми беремо *sein*. Прохання з терміном (*bis Freitag*) — ознака офіційного листа. Тема B2-25.

> [!quiz] Орендар хоче односторонньо розірвати договір оренди житла. Що за загальним правилом достатньо?
> level: B2 · type: single · id: de-b2-review-q31
> - [x] письмове повідомлення (лист) з підписом
> - [ ] усна розмова із завгоспом / двірником (*Hausmeister*)
> - [ ] SMS орендодавцю
> - [ ] телефонний дзвінок у *Hausverwaltung*
>
> **Пояснення:** розірвання договору оренди житла (*Kündigung*) має бути **письмовим** (§ 568 BGB), тому усна розмова, дзвінок чи SMS не мають юридичної сили. Строки залежать від обставин (див. B2-28), а консультацію можна отримати в *Mieterverein*. Тема B2-28.

## Формат Goethe-Zertifikat B2: Lesen і Hören

Модуль *Lesen* на Goethe B2 має пʼять частин, 30 завдань і триває 65 хвилин. Модуль *Hören* триває ≈ 40 хвилин, має чотири частини й 30 завдань; тексти в Teil 1 і Teil 3 звучать один раз, у Teil 2 і Teil 4 — двічі. Нижче — по одному спрощеному зразку: спершу текст для читання у стилі Teil 3 (справжній текст удвічі–втричі довший і має 6 завдань), далі завдання на аудіювання в тому самому порядку.

> [!example] Homeoffice: zurück ins Büro? (навчальний текст)
> Seit der Pandemie arbeiten viele Beschäftigte zumindest einen Teil der Woche zu Hause. Manche Unternehmen holen ihre Mitarbeiter inzwischen jedoch wieder ins Büro zurück. Ihr Argument: Spontane Gespräche auf dem Flur brächten oft bessere Ideen als jede Videokonferenz, und gerade neue Kollegen lernten die Firma nur vor Ort richtig kennen.
>
> Die Beschäftigten sehen das häufig anders. In einer Umfrage gaben die meisten an, dass sie sich zu Hause besser konzentrieren können, weil niemand sie unterbricht. Außerdem sparen sie jeden Tag über eine Stunde Fahrzeit, was viele als Gewinn an Lebensqualität empfinden. Allerdings räumen auch die Befürworter des Homeoffice ein, dass Arbeit und Freizeit zu Hause nicht klar getrennt sind: Wer abends noch schnell eine E-Mail beantwortet, hört selten rechtzeitig auf.
>
> Ein Kompromiss könnte darin bestehen, Bürotage für Teamtreffen festzulegen und die übrigen Tage frei einzuteilen. Ob sich dieses Modell durchsetzt, hängt letztlich weniger von der Technik als vom Vertrauen zwischen Führungskräften und Mitarbeitern ab.

> [!quiz] Warum wollen manche Firmen ihre Mitarbeiter wieder im Büro sehen? (Teil 3 · a, b, c)
> level: B2 · type: single · id: de-b2-review-q32
> - [ ] a) Die Büros stehen leer und kosten trotzdem Geld.
> - [x] b) Persönliche Gespräche bringen ihrer Meinung nach bessere Ideen.
> - [ ] c) Videokonferenzen sind technisch nicht sicher genug.
>
> **Пояснення:** у тексті: *Spontane Gespräche auf dem Flur brächten oft bessere Ideen als jede Videokonferenz.* Про вартість порожніх офісів і про безпеку відеозвʼязку нічого не сказано. Зверни увагу на Konjunktiv (*brächten*): це аргумент фірм, а не факт від автора.

> [!quiz] Was sagen die meisten Befragten in der Umfrage? (Teil 3 · a, b, c)
> level: B2 · type: single · id: de-b2-review-q33
> - [x] a) Zu Hause können sie sich besser konzentrieren.
> - [ ] b) Sie arbeiten lieber im Büro, weil sie dort Kollegen treffen.
> - [ ] c) Die Fahrzeit zur Arbeit ist ihnen nicht wichtig.
>
> **Пояснення:** *… dass sie sich zu Hause besser konzentrieren können, weil niemand sie unterbricht.* Варіант b — позиція фірм, не опитаних, а варіант c суперечить тексту: економію понад годину вони цінують.

> [!quiz] Was räumen auch die Befürworter des Homeoffice ein? (Teil 3 · a, b, c)
> level: B2 · type: single · id: de-b2-review-q34
> - [ ] a) Zu Hause arbeitet man weniger als im Büro.
> - [x] b) Arbeit und Freizeit lassen sich schwerer trennen.
> - [ ] c) Neue Kollegen lernen die Firma gar nicht kennen.
>
> **Пояснення:** *Allerdings räumen auch die Befürworter des Homeoffice ein, dass Arbeit und Freizeit zu Hause nicht klar getrennt sind.* Слово *allerdings* вводить поступку. Твердження a в тексті немає, а c — перебільшення позиції фірм.

> [!quiz] Wovon hängt der Erfolg des Kompromisses laut Autor vor allem ab? (Teil 3 · a, b, c)
> level: B2 · type: single · id: de-b2-review-q35
> - [ ] a) von der Technik
> - [ ] b) von der Zahl der Bürotage
> - [x] c) vom Vertrauen zwischen Führungskräften und Mitarbeitern
>
> **Пояснення:** *… hängt letztlich weniger von der Technik als vom Vertrauen … ab.* Конструкція *weniger … als …* ставить на перше місце друге: вирішує довіра. Відповідь a (*Technik*) — типова пастка: слово є в тексті, але з *weniger*.

## Диктант і аудіювання

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-review-l01
> audio: Hätte ich das gewusst, wäre ich nicht gekommen.
> - [ ] Wenn ich das gewusst habe, bin ich nicht gekommen.
> - [x] Hätte ich das gewusst, wäre ich nicht gekommen.
> - [ ] Hatte ich das gewusst, war ich nicht gekommen.
>
> **Пояснення:** речення без *wenn* починається з *hätte*, а головна частина має *wäre … gekommen*: Konjunktiv II минулого. Слухай [ɛ] у *hätte* — *hatte* має коротке [a]. Тема B2-04.

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-review-l02
> audio: Sie will ihn gesehen haben.
> - [ ] Sie soll ihn gesehen haben.
> - [x] Sie will ihn gesehen haben.
> - [ ] Sie muss ihn gesehen haben.
>
> **Пояснення:** *will* — вона сама стверджує; *soll* — так кажуть інші; *muss* — висновок мовця. Різниця лише в модальному дієслові, а значення змінюється повністю. Тема B2-07.

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-review-l03
> audio: Das Dach muss repariert werden.
> - [ ] Das Dach ist repariert worden.
> - [x] Das Dach muss repariert werden.
> - [ ] Das Dach muss repariert worden sein.
>
> **Пояснення:** пасив із модальним: *muss … repariert werden* («треба відремонтувати»). *Ist repariert worden* — Perfekt Passiv («вже відремонтували»), а *muss … worden sein* — припущення про минуле. Тема B2-02.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-review-l04
> audio: Der Minister sagte, er habe keine Zeit.
> explain: Konjunktiv I у непрямій мові: er habe (не hat). Після коми порядок слів як у головному реченні. Тема B2-06.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-review-l05
> audio: Der Lkw hat das Schild umgefahren, und der Bus hat die Baustelle umfahren.
> explain: umgefahren — відокремлюване (наголос на um-, «збити»), umfahren — невідокремлюване (наголос на -fahren, «обʼїхати», без ge-). Тема B2-21.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-review-l06
> audio: Angesichts des Anstiegs der Preise sinkt die Nachfrage.
> explain: Nominalstil: angesichts + Genitiv, Anstiegs із -s; після початкової групи дієслово sinkt стоїть на 2-му місці. Тема B2-10.

> [!listen] Goethe B2, Hören Teil 1 (звучить один раз): повідомлення від управителя будинку. Що мають зробити мешканці?
> level: B2 · type: answer · id: de-b2-review-l07
> audio: Guten Tag, hier spricht die Hausverwaltung Keller. Wegen eines kaputten Rohrs wird morgen von acht bis zwölf Uhr das Wasser abgestellt. Bitte stellen Sie sich rechtzeitig einen Wasservorrat bereit. Die Reparatur sollte bis Mittag abgeschlossen sein. Vielen Dank für Ihr Verständnis.
> - [ ] a) die Hausverwaltung anrufen
> - [x] b) sich vorher Wasser bereitstellen
> - [ ] c) die Miete mindern
>
> **Пояснення:** *Bitte stellen Sie sich rechtzeitig einen Wasservorrat bereit* — треба заздалегідь набрати води. У справжньому Teil 1 до кожного тексту два завдання (richtig / falsch і a / b / c). Текст звучить лише один раз, тому читай варіанти до прослуховування. Тема B2-02 (*wird abgestellt* — Passiv).

> [!listen] Goethe B2, Hören Teil 2 (звучить двічі): інтервʼю. Що радить експертка?
> level: B2 · type: answer · id: de-b2-review-l08
> audio: A: Frau Köhler, warum schlafen so viele Menschen schlecht?
> audio: B: Ein Hauptgrund ist Dauerstress, aber auch das Handy im Bett. Wer abends Nachrichten liest, kommt schwer zur Ruhe.
> audio: A: Was raten Sie?
> audio: B: Legen Sie das Handy eine Stunde vor dem Schlafengehen weg und halten Sie feste Zeiten ein.
> - [ ] a) mehr Sport am Abend
> - [x] b) das Handy früh weglegen
> - [ ] c) Medikamente nehmen
>
> **Пояснення:** *Legen Sie das Handy eine Stunde vor dem Schlafengehen weg.* Про спорт і ліки в розмові немає. Тема B2-18.

> [!listen] Goethe B2, Hören Teil 3 (звучить один раз): радіодискусія. Хто за збереження парковок у центрі?
> level: B2 · type: answer · id: de-b2-review-l09
> audio: A: Heute geht es um Radwege in der Innenstadt. Zu Gast sind Herr Brandt und Frau Sommer. Herr Brandt?
> audio: B: Mehr Radwege sind längst überfällig. Die Autos blockieren die Stadt.
> audio: A: Frau Sommer?
> audio: C: Das sehe ich anders. Viele Geschäfte brauchen Parkplätze für ihre Kunden, sonst bleiben die Leute weg.
> - [ ] a) der Moderator
> - [ ] b) Herr Brandt
> - [x] c) Frau Sommer
>
> **Пояснення:** ведучий на початку називає обох гостей: перший відповідає Herr Brandt (за велодоріжки), другою — Frau Sommer. Парковки захищає той, хто каже *Das sehe ich anders. Viele Geschäfte brauchen Parkplätze*, тобто Frau Sommer. У Teil 3 стеж за кожним голосом окремо. Тема B2-14.

> [!listen] Goethe B2, Hören Teil 3 (звучить один раз): продовження дискусії. Хто вважає, що велодоріжки допомагають і магазинам?
> level: B2 · type: answer · id: de-b2-review-l10
> audio: A: Herr Brandt, was sagen Sie dazu?
> audio: B: Dank der Radwege kommen auch mehr Kunden zu Fuß oder mit dem Rad.
> audio: C: Zugegeben, Herr Brandt, aber das gilt nicht für alle Geschäfte.
> - [ ] a) der Moderator
> - [x] b) Herr Brandt
> - [ ] c) Frau Sommer
>
> **Пояснення:** аргумент «*dank der Radwege kommen auch mehr Kunden*» наводить Herr Brandt. Frau Sommer відповідає *Zugegeben, … aber*: «визнаю, що так, але» — це поступка, а не згода, і вона не каже, що велодоріжки допомагають магазинам. Тема B2-14.

> [!listen] Goethe B2, Hören Teil 4 (1/2, звучить двічі): короткий виступ. Що означає Mehrweg, за словами доповідача?
> level: B2 · type: answer · id: de-b2-review-l11
> audio: Meine Damen und Herren, ich spreche heute über Mehrwegverpackungen. Zunächst erkläre ich, was Mehrweg bedeutet: Flaschen und Becher werden nicht weggeworfen, sondern gespült und wieder befüllt. Im Folgenden zeige ich, warum das die Umwelt schont.
> - [ ] a) Verpackungen werden recycelt.
> - [x] b) Flaschen und Becher werden gespült und wieder befüllt.
> - [ ] c) Verpackungen werden kompostiert.
>
> **Пояснення:** після *Zunächst erkläre ich, was Mehrweg bedeutet* іде визначення: *gespült und wieder befüllt*. Про переробку й компост доповідач не говорить. Тема B2-13.

> [!listen] Goethe B2, Hören Teil 4 (2/2, звучить двічі): короткий виступ. Яка головна думка?
> level: B2 · type: answer · id: de-b2-review-l12
> audio: Dem stehen allerdings Kosten gegenüber, denn das Spülen und der Transport brauchen Wasser und Energie. Abschließend lässt sich sagen: Mehrweg lohnt sich vor allem dann, wenn die Verpackung möglichst oft wiederverwendet wird.
> - [ ] a) Mehrweg ist in jedem Fall besser als Einweg.
> - [x] b) Mehrweg lohnt sich vor allem bei häufiger Wiederverwendung.
> - [ ] c) Einweg ist billiger und deshalb besser.
>
> **Пояснення:** висновок після *abschließend*: *lohnt sich vor allem dann, wenn … oft wiederverwendet wird*. Слова *dem stehen … gegenüber* показують контраргумент (витрати), тому вислів «в кожному разі» (a) не підходить. Тема B2-13.

## Мінімальні пари

Слова B2 часто відрізняються наголосом або суфіксом, а не окремим звуком, тож тренуй це на слух.

> [!pair] Technik /ˈtɛçnɪk/ — Technologie /tɛçnoloˈɡiː/
> level: B2 · id: de-b2-review-p01
> say: Technologie
> tip: Technik — наголос на першому складі, ch = [ç] (мʼякий звук, як «хь» з усмішкою, після [ɛ]). Technologie — наголос на останньому складі -gie [ɡiː]. Значення теж різні: «спосіб виконання, прилад» і «система методів».

> [!pair] Kritik /kʁiˈtiːk/ — Kritiker /ˈkʁiːtikɐ/
> level: B2 · id: de-b2-review-p02
> say: Kritiker
> tip: у Kritik наголос на -tik, у Kritiker наголос зсувається на перший склад Kri-. Кінцеве -er читаємо як короткий нейтральний [ɐ].

> [!pair] Studie /ˈʃtuːdi̯ə/ — Studium /ˈʃtuːdi̯ʊm/
> level: B2 · id: de-b2-review-p03
> say: Studium
> tip: початкове st- — це [ʃt], не [st]. Studie закінчується на [ə] («дослідження»), Studium — на [ʊm] («навчання у виші»); в обох довге [uː].

> [!pair] Beamer /ˈbiːmɐ/ — Beamter /bəˈʔamtɐ/
> level: B2 · id: de-b2-review-p04
> say: Beamter
> tip: Beamer («проєктор») має довге [iː] у першому складі. Beamter («держслужбовець») — наголос на другому складі з легким твердим приступом перед a: be-|amter. Не плутай ці два слова.

## Говоріння

> [!speak] Скажи вголос
> level: B2 · id: de-b2-review-s01
> text: Hätte ich das gewusst, wäre ich nicht gekommen.
> ipa: /ˈhɛtə ɪç das ɡəˈvʊst ˈvɛːʁə ɪç nɪçt ɡəˈkɔmən/
> tip: hätte — відкрите [ɛ]; wäre — довге [ɛː]; gewusst — наголос на -wusst, без придиху в ge-. Між двома частинами зроби коротку паузу.
> uk: Якби я це знав, я б не прийшов.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-review-s02
> text: Der Minister sagte, er habe keine Zeit für ein Interview.
> ipa: /deːɐ̯ miˈnɪstɐ ˈzaːktə eːɐ̯ ˈhaːbə ˈkaɪ̯nə tsaɪ̯t fyːɐ̯ aɪ̯n ˈɪntɐvjuː/
> tip: Minister — наголос на -nis-; habe — довге [aː]; Interview — наголос на першому складі (можливий і на -view), v = [v] («в»), як у «вів».
> uk: Міністр сказав, що в нього немає часу на інтервʼю.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-review-s03
> text: Er soll sehr reich sein, aber sie will ihn nie gesehen haben.
> ipa: /eːɐ̯ zɔl zeːɐ̯ ʁaɪ̯ç zaɪ̯n ˈaːbɐ ziː vɪl iːn niː ɡəˈzeːən ˈhaːbn̩/
> tip: soll — коротке [ɔ], s на початку слова дзвінке [z]; reich — ei = [aɪ̯], ch = [ç]; gesehen — наголос на -seh-, довге [eː].
> uk: Кажуть, він дуже багатий, але вона стверджує, що ніколи його не бачила.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-review-s04
> text: Wegen des starken Anstiegs der Preise sinkt die Nachfrage.
> ipa: /ˈveːɡn̩ dɛs ˈʃtaʁkn̩ ˈanʃtiːks deːɐ̯ ˈpʁaɪ̯zə ˈzɪŋkt diː ˈnaːxfʁaːɡə/
> tip: Anstiegs — наголос на An-, st = [ʃt], а кінцеве -gs звучить як [ks]. Nachfrage — ch після [aː] читаємо як [x]. Після sinkt голос падає.
> uk: Через сильне зростання цін попит падає.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-review-s05
> text: Ich wäre Ihnen dankbar, wenn Sie mir bis Freitag antworten könnten.
> ipa: /ɪç ˈvɛːʁə ˈiːnən ˈdaŋkbaːɐ̯ vɛn ziː miːɐ̯ bɪs ˈfʁaɪ̯taːk ˈantvɔʁtn̩ ˈkœntn̩/
> tip: Ihnen — довге [iː]; dankbar — nk = [ŋk]; Freitag — кінцеве g = [k], наголос на Frei-; könnten — [œ]. Інтонація мʼяка, ввічлива.
> uk: Я був би Вам вдячний, якби Ви відповіли мені до пʼятниці.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-review-s06
> text: Einerseits ist die Miete hoch, andererseits liegt die Wohnung zentral.
> ipa: /ˈaɪ̯nɐzaɪ̯ts ɪst diː ˈmiːtə hoːx ˈandəʁɐzaɪ̯ts liːkt diː ˈvoːnʊŋ tsɛnˈtʁaːl/
> tip: einerseits і andererseits мають наголос на першому складі; hoch — ch після [oː] читаємо як [x]; liegt — g = [k]; zentral — z = [ts], наголос на -tral.
> uk: З одного боку, оренда висока, з іншого — квартира в центрі.

## Типові помилки, які ще трапляються

> [!pitfall] Пасив і нереальне минуле: *geworden*, *hatte* замість *hätte*
> ~~Das Haus ist 1990 gebaut geworden~~, ~~Wenn ich das gewusst hatte, wäre ich nicht gekommen~~ → *ist gebaut **worden***; *Wenn ich das gewusst **hätte**, wäre ich nicht gekommen*. У складених формах пасиву стоїть особлива форма *worden*, а *hatte* (Präteritum, факт) і *hätte* (нереальне) відрізняються лише одним звуком. Теми B2-02 і B2-04.

> [!pitfall] Калька з української у сталих сполуках
> ~~eine Entscheidung machen~~, ~~Kritik machen~~, ~~eine Frage geben~~ → *eine Entscheidung **treffen***, *Kritik **üben***, *eine Frage **stellen***. У Funktionsverbgefüge дієслово «слабке», але не замінне: вчи сполуку цілком, з прийменником і відмінком. Теми B2-22 і B2-23.

> [!pitfall] Зайве *ge-* в невідокремлюваних дієсловах
> ~~Er hat die Baustelle geumfahren~~, ~~Sie hat ihm gemisstraut~~, ~~Wir haben viel geverbraucht~~ → *umfahren*, *misstraut*, *verbraucht*. Дієслова з невідокремлюваними префіксами (*um-* у значенні «обʼїхати», *miss-*, *ver-*, *zer-*, *be-*) утворюють Partizip II без *ge-*; наголос зазвичай на корені (у *miss-* буває й на префіксі: *ˈmissverstehen*). Теми B2-21 і B2-24.

> [!pitfall] «Схожі» слова з різним значенням
> ~~Mein Studie in Berlin dauert vier Jahre~~, ~~Eine Billion Euro Gewinn~~ (коли йдеться про мільярд) → *Mein **Studium** in Berlin dauert vier Jahre*; *eine **Milliarde***. *Studie* — це дослідження, *Studium* — навчання у виші; німецька *Billion* — це 10¹² (трильйон). Так само *Frist* ≠ *Termin*, *Abmahnung* ≠ *Mahnung*, *Technik* ≠ *Technologie*. Теми B2-15, B2-16, B2-19.

## Чекліст «я вмію»

Познач, що вже виходить. Незнайомі пункти повтори у відповідних темах.

**Часи й пасив (B2-01, 02, 03)**
- [ ] Я називаю шість часів і вибираю між Perfekt і Präteritum за жанром; висловлюю припущення за допомогою Futur I (про теперішнє) і Futur II (про минуле).
- [ ] Я утворюю пасив у всіх часах (*ist gebaut worden*), з модальним (*muss repariert werden*), безособовий пасив (*Es wird getanzt*) і відрізняю процес від стану (*wird geöffnet* / *ist geöffnet*).
- [ ] Я знаю замінники пасиву: *man*, *sich lassen*, *sein + zu*, прикметники на *-bar*.

**Konjunktiv і модальні (B2-04, 05, 06, 07)**
- [ ] Я кажу про нереальне минуле (*hätte / wäre + Partizip II*) і висловлюю жаль та докір: *Du hättest anrufen sollen. Beinahe wäre ich …*
- [ ] Я вживаю *als ob*, *zu … als dass*, *ohne dass*, *sodass* і розрізняю наслідок та мету.
- [ ] Я передаю чужі слова в Konjunktiv I (*er sei, sie habe, man werde*) і знаю, коли замінити його на Konjunktiv II.
- [ ] Я розрізняю *soll* («кажуть»), *will* («стверджує»), *muss* / *dürfte* / *kann* («мабуть / імовірно / можливо») і будую минулий час (*muss krank gewesen sein*).

**Речення й стиль (B2-08, 09, 10, 11, 12)**
- [ ] Я зʼєдную думки сполучниками, прислівниками та прийменниками (*obwohl / trotzdem / trotz*, *indem*, *falls*, *wohingegen*, *angesichts*).
- [ ] Я розумію й утворюю дієприкметникові означення (*das lachende Kind, die zu lösende Aufgabe*).
- [ ] Я переходжу від Verbalstil до Nominalstil (*weil … steigen → wegen des Anstiegs*).
- [ ] Я вимовляю й вживаю англіцизми та іншомовні слова з правильним родом і розумію регіональну вимову (*-ig* як [ɪk] на півдні, *nich / ne* на півночі) та регіональні привітання (*Moin, Servus, Grüezi*).

**Слухання, читання, письмо, мовлення (B2-13, 14, 25, 26, 27)**
- [ ] Я розумію лекції та ток-шоу на слух, слідкую за сигнальними словами й веду конспект.
- [ ] Я читаю довгі тексти й знаходжу позицію автора, поступку (*zwar … aber*) і висновок.
- [ ] Я пишу допис / есе-аргумент (≈ 150 слів) і офіційний лист з усіма *Leitpunkte*.
- [ ] Я роблю доповідь, веду дискусію, реагую на чужий аргумент і прошу уточнення (*Wie meinen Sie das genau?*).

**Теми й лексика (B2-15–20)**
- [ ] Я веду розмову про роботу, нараду та листування: *Tagesordnung, Protokoll, Frist, Angebot*.
- [ ] Я розповідаю про науку, суспільство, здоровʼя, гроші та мистецтво: *Hypothese, Wahlkreis, Erholung, Bonität, Rezension*.
- [ ] Я розумію основи виборів у Німеччині (*Erststimme, Zweitstimme*) та різницю між *Staatsanwalt* і *Rechtsanwalt*.

**Слово й вираз (B2-21, 22, 23, 24)**
- [ ] Я розрізняю відокремлювані й невідокремлювані префікси за наголосом (*ˈumfahren* / *umˈfahren*).
- [ ] Я вживаю фразеологізми цілком (*die Daumen drücken, auf dem Laufenden halten*) і Funktionsverbgefüge (*eine Entscheidung treffen, Kritik üben*).
- [ ] Я розумію значення *un-, miss-, ver-, zer-* і *-los, -haft, -mäßig* і перевіряю нові слова в словнику.

**Ситуації (B2-28)**
- [ ] Я пишу й кажу скаргу орендодавцеві, в банк чи в школу, тримаюсь тону *Sie* + Konjunktiv II і знаю наступні кроки (*Frist*, *Mieterverein*, *Verbraucherzentrale*).

Якщо ти позначив(ла) більшість пунктів і набрав(ла) ≈ 75–80 % у тесті вище, ти готовий(а) до наступного кроку: рівня C1.

## Фішки

> [!reel] 🎓 Goethe-Zertifikat B2: чотири модулі
> Іспит складається з модулів *Lesen* (65 хв, 5 частин, 30 завдань), *Hören* (≈ 40 хв, 4 частини, 30 завдань), *Schreiben* (75 хв, 2 завдання) і *Sprechen* (близько 15 хв, перед цим 15 хв підготовки). У *Hören* Teil 1 і Teil 3 текст звучить один раз, у Teil 2 і Teil 4 — двічі. Тому прочитай завдання, поки триває пауза перед записом.

> [!reel] 🧭 Три питання перед складним реченням
> Перш ніж писати чи говорити, спитай: *Чий це голос?* (мій факт, чужі слова, припущення), *Яка форма?* (Indikativ, Konjunktiv I або II, модальне з *haben / sein*) і *Де змінюване дієслово?* (2-ге місце або кінець). Ці питання знімають більшість помилок рівня B2.

> [!reel] ✍️ «Der Dativ ist dem Genitiv sein Tod»
> Так називається збірка колонок журналіста Бастіана Сіка, яка вийшла 2004 року. Назва жартує про розмовне *dem Genitiv sein Tod* замість нормативного *der Tod des Genitivs*. Для тебе висновок практичний: у розмові після *wegen* чи *trotz* часто чути Dativ, але в листі та на іспиті B2 пиши Genitiv.

## Джерела та що почитати

- [Goethe-Institut — Durchführungsbestimmungen B2 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_B2.pdf) — тривалість, склад і правила іспиту.
- [Goethe-Institut — Modellsatz B2 (PDF)](https://www.goethe.de/pro/relaunch/prf/materialien/B2/b2_modellsatz_erwachsene.pdf) — офіційний зразок усіх чотирьох модулів.
- [DWDS — Futur](https://www.dwds.de/wb/Futur) — довідка про Futur I і Futur II.
- [DWDS — Funktionsverbgefüge](https://www.dwds.de/wb/Funktionsverbgef%C3%BCge) — термін і приклади.
- [Wikipedia — Der Dativ ist dem Genitiv sein Tod](https://de.wikipedia.org/wiki/Der_Dativ_ist_dem_Genitiv_sein_Tod) — збірка колонок Бастіана Сіка (2004).
- [DW Learn German — матеріали рівня B2](https://learngerman.dw.com/de/niveau-b2/s-12306) — безкоштовний відеокурс Deutsche Welle.

> [!important] Підсумок
> - Шість часів, Futur II для припущення про минуле; пасив у всіх часах (*worden*), з модальним (*werden* в кінці), стан — *sein* + Partizip II; замінники — *man, sich lassen, sein + zu, -bar*.
> - Нереальне минуле: *hätte / wäre + Partizip II* (з модальним — подвійний інфінітив); *als ob* і *zu … als dass* + Konjunktiv II; чужі слова в новинах — Konjunktiv I (*sei, habe, werde*; якщо збігається з Indikativ — Konjunktiv II).
> - *Soll* — «кажуть», *will* — «стверджує», *muss / dürfte / kann* — шкала впевненості; минуле — модальне + Infinitiv Perfekt.
> - Конектори: сполучник (кінець), прислівник (V2), прийменник (Genitiv); Nominalstil — *wegen des Anstiegs der Preise*; дієприкметникові означення — Partizip I (триває), Partizip II (завершено), *zu + Partizip I* («слід»).
> - Лексика й вирази: *Frist ≠ Termin*, *Abmahnung ≠ Mahnung*, *Staatsanwalt ≠ Rechtsanwalt*, *eine Entscheidung treffen*, відокремлювані / невідокремлювані префікси за наголосом; Goethe B2 — Lesen 65 хв, Hören ≈ 40 хв із чотирьох частин (1 і 3 — один раз, 2 і 4 — двічі).
