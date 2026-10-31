---
title: Модальні дієслова — können, müssen, wollen, dürfen, möchten
id: de-a1-modalverben
level: A1
icon: px:key
tags: [deutsch, a1, grammar, modalverben]
prerequisites: ["[[Deutsch - A1 - 09. Питання й місце дієслова — V2 і W-Fragen]]", "[[Deutsch - A1 - 14. Дієслова з чергуванням — fahren, essen, lesen, nehmen]]"]
estimatedMinutes: 40
---

# Модальні дієслова — können, müssen, wollen, dürfen, möchten

> [!success] Після цієї теми ти зможеш
> - відмінювати **können, müssen, wollen, dürfen, möchten** (і *sollen*) у Präsens;
> - будувати речення з інфінітивом **у кінці**: *Ich muss heute arbeiten.*;
> - розрізняти **nicht müssen** («не треба») і **nicht dürfen** («не можна»);
> - ввічливо просити й хотіти: **Ich möchte …**, **Kann ich …?**, **Darf ich …?**;
> - не плутати німецьке *will* («хочу») з англійським *will*.

## Передбач

> [!quiz] Як сказати «Я добре вмію плавати»?
> level: A1 · type: single · id: de-a1-modalverben-q01
> - [ ] Ich kann schwimmen gut.
> - [x] Ich kann gut schwimmen.
> - [ ] Ich kann gut zu schwimmen.
> - [ ] Ich schwimmen kann gut.
>
> **Пояснення:** модальне дієслово (*kann*) стоїть на **другому** місці, а смислове дієслово в інфінітиві (*schwimmen*) іде **в кінець** речення. Інфінітив ніколи не стоїть одразу після модального, якщо між ними є інші слова, і ніколи не отримує *zu*.

## Пояснення

### Що таке модальні дієслова

Модальні дієслова не називають дію, а показують **ставлення** до неї: чи можу, чи мушу, чи хочу, чи можна. Саму дію називає друге дієслово в **інфінітиві**.

| Дієслово | Значення | Приклад |
|---|---|---|
| **können** | могти, вміти | Ich kann gut kochen. — Я добре вмію готувати. |
| **müssen** | мусити, бути змушеним | Ich muss heute arbeiten. — Мені треба сьогодні працювати. |
| **wollen** | хотіти (твердо) | Er will nach Hause. — Він хоче додому. |
| **dürfen** | мати дозвіл, можна | Hier darf man nicht parken. — Тут не можна паркуватися. |
| **möchten** | хотіти (ввічливо) | Ich möchte einen Tee. — Я б хотів чаю. |
| **sollen** | мати зробити (за наказом / порадою) | Du sollst mehr schlafen. — Тобі слід більше спати. |

### Відмінювання в Präsens

| | können | müssen | wollen | dürfen | möchten | sollen |
|---|---|---|---|---|---|---|
| ich | **kann** | **muss** | **will** | **darf** | **möchte** | **soll** |
| du | **kannst** | **musst** | **willst** | **darfst** | **möchtest** | **sollst** |
| er / sie / es | **kann** | **muss** | **will** | **darf** | **möchte** | **soll** |
| wir | können | müssen | wollen | dürfen | möchten | sollen |
| ihr | könnt | müsst | wollt | dürft | möchtet | sollt |
| sie / Sie | können | müssen | wollen | dürfen | möchten | sollen |

Дві особливості, які варто запамʼятати:

1. **У однині голосний змінюється** (können → *kann*, müssen → *muss*, dürfen → *darf*, wollen → *will*, sollen → *soll*), а в множині лишається як в інфінітиві. Виняток — *möchten*: *ich möchte, du möchtest*, голосний той самий.
2. **ich і er / sie / es мають однакову форму без закінчення:** *ich kann, er kann*, ~~ich kanne~~, ~~er kannt~~. Закінчення -st є лише в *du*. Виняток — *möchten*: воно має -e (*ich möchte, er möchte*).

> [!warning] Не плутай will і werden
> Німецьке ***ich will*** означає «я **хочу**», а не англійське *I will* («я буду»). Майбутнє в німецькій — окреме дієслово *werden*, його ми вчимо пізніше.

### Інфінітив у кінці: Satzklammer

Модальне дієслово займає друге місце, як будь-яке відмінюване дієслово (V2), а інфінітив іде **останнім**. Між ними стоять усі інші слова речення — вийшла «дужка» (Satzklammer).

> [!diagram] Дужка: модальне на 2-му місці, інфінітив у кінці
> ```yaml
> layout: flow
> nodes:
>   - { id: s, label: "підмет", text: "Ich", note: "я", tone: mint }
>   - { id: m, label: "модальне · 2-ге місце", text: "muss", note: "відмінюємо", tone: orange }
>   - { id: r, label: "решта", text: "heute", note: "час, місце, додатки", tone: gray }
>   - { id: i, label: "інфінітив · у кінці", text: "arbeiten", note: "незмінна форма", tone: orange }
> edges:
>   - { from: s, to: m, label: "+" }
>   - { from: m, to: r, label: "+" }
>   - { from: r, to: i, label: "+" }
> steps:
>   - { focus: s, note: "Підмет відкриває речення: Ich. Але перше місце може зайняти і інше слово, наприклад Heute muss ich arbeiten." }
>   - { focus: m, note: "Модальне дієслово — на другому місці й відмінюється: ich muss, du musst, wir müssen." }
>   - { focus: r, note: "Усе інше (heute, nach Hause, einen Tee) іде між дієсловами." }
>   - { focus: i, note: "Смислове дієслово в інфінітиві — завжди останнє: arbeiten. Без zu, без закінчень." }
> ```
> Мʼятний блок — підмет, помаранчеві — дієслова, сірий — решта; мітка є в кожному блоці.

У питанні «так / ні» модальне стоїть **першим**: *Kannst du morgen kommen?*. З питальним словом — після нього: *Wann kannst du kommen?*

Заперечення *nicht* зазвичай стоїть перед інфінітивом: *Ich kann heute nicht kommen.*

### Модальне дієслово без інфінітива

Коли дія зрозуміла з контексту, інфінітив можна пропустити: *Ich kann Deutsch.* — Я знаю німецьку. *Ich muss nach Hause.* — Мені треба додому (gehen пропущено). *Kannst du das?* — Ти це вмієш?

### nicht müssen ≠ nicht dürfen

Українське «не мусиш» і «не можна» легко сплутати, а в німецькій вони дуже різні.

> [!diagram] nicht müssen · nicht dürfen · nicht können
> ```yaml
> layout: compare
> columns: { a: "nicht müssen", b: "nicht dürfen", c: "nicht können" }
> nodes:
>   - { id: a1, col: a, label: "значення", text: "не треба", note: "можна, але не обовʼязково", tone: yellow }
>   - { id: a2, col: a, label: "приклад", text: "Du musst nicht kommen.", note: "Ти не мусиш приходити.", tone: yellow }
>   - { id: b1, col: b, label: "значення", text: "не можна", note: "заборонено", tone: pink }
>   - { id: b2, col: b, label: "приклад", text: "Du darfst nicht kommen.", note: "Тобі не можна приходити.", tone: pink }
>   - { id: c1, col: c, label: "значення", text: "не вмію / не можу", note: "немає змоги", tone: gray }
>   - { id: c2, col: c, label: "приклад", text: "Ich kann nicht kommen.", note: "Я не можу прийти.", tone: gray }
> steps:
>   - { focus: [a1, a2], note: "nicht müssen: ти вільний вибирати. Немає обовʼязку. Українською «не треба, не мусиш»." }
>   - { focus: [b1, b2], note: "nicht dürfen: прямо заборонено, є правило. Українською «не можна»." }
>   - { focus: [c1, c2], note: "nicht können: немає змоги або вміння — не встигаю, не вмію." }
> ```
> Жовтий блок — «не треба», рожевий — «не можна», сірий — «не можу»; мітка значення є в кожному блоці.

### können чи dürfen? möchte чи will?

- **Kann ich …?** — «чи можу я» (за можливістю): *Kann ich bezahlen?* **Darf ich …?** — «чи можна мені» (за дозволом, ввічливіше): *Darf ich hier sitzen?* У розмові їх часто міняють місцями, але в оголошеннях правило завжди з *dürfen*: *Hier darf man nicht rauchen.*
- **Ich will** — рішуче «я хочу, і край». У магазині чи кафе краще **Ich möchte …** або **Ich hätte gern …**. *Möchte* насправді форма від *mögen*, але вчимо її як окреме дієслово.
- **Du sollst** — це не «ти повинен» за власним бажанням, а «тобі сказали / радять»: *Ich soll Milch kaufen.* — Мені треба купити молоко (хтось попросив).

## Приклади

- *Ich kann Auto fahren.* — Я вмію водити машину.
- *Kannst du morgen kommen?* — Ти можеш прийти завтра?
- *Wir müssen jetzt gehen.* — Нам треба зараз іти.
- *Er muss nicht arbeiten, er hat frei.* — Йому не треба працювати, у нього вихідний.
- *Ich will nicht warten.* — Я не хочу чекати.
- *Darf ich hier rauchen? — Nein, leider nicht.* — Можна тут курити? — Ні, на жаль, не можна.
- *Hier darf man nicht parken.* — Тут не можна паркуватися.
- *Ich möchte einen Tee trinken.* — Я б хотів випити чаю.
- *Möchtest du einen Kaffee?* — Хочеш кави?
- *Heute kann ich nicht kochen.* — Сьогодні я не можу готувати.
- *Vielleicht kann ich morgen kommen.* — Можливо, я зможу прийти завтра.
- *Kann ich bitte ein Glas Wasser haben?* — Можна, будь ласка, склянку води?

## Слова

### Модальні дієслова

> [!word] können
> ipa: /ˈkœnən/ · pos: verb · level: A1 · id: de-a1-modalverben-w01
> uk: могти; вміти
> forms: ich kann · du kannst · er kann · konnte · hat gekonnt
> example: Ich **kann** gut Deutsch sprechen. — Я добре вмію говорити німецькою.
> note: ö — [œ] (короткий), губи як для «о», язик як для «е». Ich kann Deutsch = «я знаю німецьку».

> [!word] müssen
> ipa: /ˈmʏsn̩/ · pos: verb · level: A1 · id: de-a1-modalverben-w02
> uk: мусити; бути змушеним
> forms: ich muss · du musst · er muss · musste · hat gemusst
> example: Ich **muss** heute früh aufstehen. — Мені треба сьогодні рано вставати.
> note: ü — [ʏ] (короткий). nicht müssen = «не треба», а не «не можна».

> [!word] wollen
> ipa: /ˈvɔlən/ · pos: verb · level: A1 · id: de-a1-modalverben-w03
> uk: хотіти (твердо)
> forms: ich will · du willst · er will · wollte · hat gewollt
> example: Wir **wollen** nach Berlin fahren. — Ми хочемо поїхати до Берліна.
> note: w = [v]. Ich will ≠ англ. I will: це «хочу», а не майбутнє. Грубувато для замовлення: краще möchte.

> [!word] dürfen
> ipa: /ˈdʏʁfn̩/ · pos: verb · level: A1 · id: de-a1-modalverben-w04
> uk: мати дозвіл; можна
> forms: ich darf · du darfst · er darf · durfte · hat gedurft
> example: Hier **darf** man nicht rauchen. — Тут не можна курити.
> note: nicht dürfen = «заборонено». Ввічливе питання: Darf ich …? — «Можна мені …?»

> [!word] möchten
> ipa: /ˈmœçtn̩/ · pos: verb · level: A1 · id: de-a1-modalverben-w05
> uk: хотіти б; бажати
> forms: ich möchte · du möchtest · er möchte
> example: Ich **möchte** einen Kaffee. — Я б хотів кави.
> note: ввічлива форма «хочу». ch після ö — мʼяке [ç]. Форми ich möchte і er möchte однакові. Історично це Konjunktiv II від mögen, але вчимо як окреме дієслово.

> [!word] sollen
> ipa: /ˈzɔlən/ · pos: verb · level: A2 · id: de-a1-modalverben-w06
> uk: мати (зробити); слід
> forms: ich soll · du sollst · er soll · sollte · hat gesollt
> example: Ich **soll** Brot kaufen. — Мені треба купити хліб (мене попросили).
> note: s перед голосним — дзвінке [z]. Du sollst = «тобі сказали / слід», а не «ти мусиш самостійно».

### Дієслова та слова для прикладів

> [!word] rauchen
> ipa: /ˈʁaʊ̯xn̩/ · pos: verb · level: A1 · id: de-a1-modalverben-w07
> uk: курити
> forms: rauchen → rauchte → hat geraucht
> example: Darf ich hier **rauchen**? — Можна тут курити?
> note: au = [aʊ̯], ch після au — глибоке [x]. Ця ж коренева основа: der Rauch («дим»), das Rauchen («куріння»).

> [!word] parken
> ipa: /ˈpaʁkn̩/ · pos: verb · level: A1 · id: de-a1-modalverben-w08
> uk: паркуватися; ставити машину
> forms: parken → parkte → hat geparkt
> example: Hier darf man nicht **parken**. — Тут не можна паркуватися.
> note: на знаках: Parken verboten. Місце — der Parkplatz.

> [!word] kochen
> ipa: /ˈkɔxn̩/ · pos: verb · level: A1 · id: de-a1-modalverben-w09
> uk: готувати (їжу); варити
> forms: kochen → kochte → hat gekocht
> example: Ich **kann** gut **kochen**. — Я добре вмію готувати.
> note: ch після o — глибоке [x]. Kochen — і «готувати», і «кипіти»: Das Wasser kocht.

> [!word] leider
> ipa: /ˈlaɪ̯dɐ/ · pos: adv · level: A1 · id: de-a1-modalverben-w10
> uk: на жаль
> example: Ich kann **leider** nicht kommen. — На жаль, я не можу прийти.
> note: ввічлива відмова: Leider nicht. Слово стоїть перед nicht: leider nicht.

> [!word] natürlich
> ipa: /naˈtyːɐ̯lɪç/ · pos: adv · level: A1 · id: de-a1-modalverben-w11
> uk: звичайно; природно
> example: Kann ich bezahlen? — **Natürlich!** — Можна заплатити? — Звісно!
> note: від die Natur («природа»). Наголос на другому складі: naTÜRlich. -lich — [lɪç].

> [!word] die Regel
> ipa: /ˈʁeːɡl̩/ · pos: noun · level: A1 · id: de-a1-modalverben-w12
> uk: правило
> forms: die Regeln
> example: Hier gibt es eine **Regel**: Man darf nicht rauchen. — Тут є правило: курити не можна.
> note: -el у кінці — [l̩]. Із модальними: Man darf / muss … in der Regel = «як правило».

> [!word] verboten
> ipa: /fɛɐ̯ˈboːtn̩/ · pos: adj · level: A2 · id: de-a1-modalverben-w13
> uk: заборонений
> example: Rauchen ist hier **verboten**. — Курити тут заборонено.
> note: від verbieten («забороняти»). Знаки: Rauchen verboten, Parken verboten. Синонім у розмові: nicht erlaubt.

> [!word] der Führerschein
> ipa: /ˈfyːʁɐˌʃaɪ̯n/ · pos: noun · level: A2 · id: de-a1-modalverben-w14
> uk: водійське посвідчення
> forms: die Führerscheine
> example: Ich habe einen **Führerschein**. — У мене є водійське посвідчення.
> note: ü — [yː]. Складене: der Führer + der Schein. CH: der Führerausweis. З ним Ich darf Auto fahren.

> [!word] die Prüfung
> ipa: /ˈpʁyːfʊŋ/ · pos: noun · level: A2 · id: de-a1-modalverben-w15
> uk: іспит; перевірка
> forms: die Prüfungen
> example: Morgen habe ich eine **Prüfung**. — Завтра в мене іспит.
> note: -ung → die. Дієслово: prüfen («перевіряти»). ü — [yː].

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-modalverben-l01
> audio: Ich kann gut kochen.
> - [x] Ich kann gut kochen.
> - [ ] Ich muss gut kochen.
> - [ ] Ich will gut kochen.
>
> **Пояснення:** *kann* — «вмію», *muss* — «мушу», *will* — «хочу». Різні дієслова — різний зміст: слухай першу частину речення.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-modalverben-l02
> audio: Hier darf man nicht rauchen.
> - [ ] Hier muss man nicht rauchen.
> - [ ] Hier kann man nicht rauchen.
> - [x] Hier darf man nicht rauchen.
>
> **Пояснення:** *darf … nicht* — «не можна, заборонено». *Muss … nicht* означало б «не обовʼязково».

> [!listen] Що буде завтра?
> level: A1 · type: answer · speed: slow · id: de-a1-modalverben-l03
> audio: Morgen muss ich nicht arbeiten. Ich kann lange schlafen.
> - [x] Завтра мені не треба працювати, я можу довго спати.
> - [ ] Завтра мені не можна працювати, я не хочу спати.
> - [ ] Завтра я мушу працювати і не можу спати.
> - [ ] Завтра я хочу працювати і довго спати.
>
> **Пояснення:** *muss nicht arbeiten* — «не треба працювати», *kann lange schlafen* — «може довго спати».

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-modalverben-l04
> audio: Ich möchte einen Tee trinken.
> explain: möchte — одна з форм, у ній ch читається [ç]; trinken стоїть у кінці речення.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-modalverben-l05
> audio: Hier darf man nicht parken.

> [!listen] Послухай. Коли гість має прийти і що не можна?
> level: A1 · type: answer · speed: slow · id: de-a1-modalverben-l06
> audio: A: Guten Tag! Was möchten Sie?
> audio: B: Ich möchte einen Deutschkurs machen. Kann ich heute den Test machen?
> audio: A: Nein, leider nicht. Sie müssen morgen um neun Uhr kommen.
> audio: B: Gut. Muss ich etwas mitbringen?
> audio: A: Nein. Aber im Test dürfen Sie kein Handy haben.
> audio: B: Kein Problem. Danke!
> - [x] Завтра о девʼятій; у тесті не можна мати телефон.
> - [ ] Сьогодні о девʼятій; у тесті не можна мати телефон.
> - [ ] Завтра о девʼятій; телефон треба принести.
> - [ ] Завтра о десятій; у тесті не можна мати телефон.
>
> **Пояснення:** *Sie müssen morgen um neun Uhr kommen* — завтра о 9, *im Test dürfen Sie kein Handy haben* — у тесті телефон не дозволений (*dürfen*). Переклад: — Добрий день! Що бажаєте? — Я б хотів записатися на курс німецької. Чи можна пройти тест сьогодні? — Ні, на жаль. Вам треба прийти завтра о девʼятій. — Добре. Чи треба щось принести? — Ні. Але в тесті вам не можна мати телефон. — Без проблем. Дякую!

## Вимова

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-modalverben-s01
> text: Ich kann, du kannst, er kann.
> ipa: /ɪç kan duː kanst eːɐ̯ kan/
> tip: ich — [ç], мʼяке «хь»; kann — короткий [a], подвоєне nn; kannst — [kanst], без «ей».
> uk: Я можу, ти можеш, він може.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-modalverben-s02
> text: Ich muss heute arbeiten.
> ipa: /ɪç mʊs ˈhɔʏ̯tə ˈaʁbaɪ̯tn̩/
> tip: muss — короткий [ʊ], ss = [s]; eu у heute — [ɔʏ̯], «ой»; arbeiten — наголос на першому складі, -en майже не вимовляється.
> uk: Мені треба сьогодні працювати.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-modalverben-s03
> text: Darf ich hier rauchen?
> ipa: /daʁf ɪç hiːɐ̯ ˈʁaʊ̯xn̩/
> tip: darf — f на кінці чутно; hier — довге [iː]; rauchen — au = «ау», ch = глибоке [x].
> uk: Можна мені тут курити?

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-modalverben-s04
> text: Ich möchte einen Tee trinken.
> ipa: /ɪç ˈmœçtə ˈaɪ̯nən teː ˈtʁɪŋkn̩/
> tip: ö — [œ]: губи як для «о», язик як для «е»; ch після ö — [ç]; trinken — -ng- носове [ŋk].
> uk: Я б хотів випити чаю.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-modalverben-s05
> text: Wir können leider nicht kommen.
> ipa: /viːɐ̯ ˈkœnən ˈlaɪ̯dɐ nɪçt ˈkɔmən/
> tip: w = [v]; können — [œ]; leider — ei = [aɪ̯], -er = [ɐ]; nicht — [ç].
> uk: На жаль, ми не можемо прийти.

> [!speak] Ситуація: спитай про тест
> level: A1 · speed: slow · id: de-a1-modalverben-s06
> text: Kann ich heute den Test machen?
> ipa: /kan ɪç ˈhɔʏ̯tə deːn tɛst ˈmaxn̩/
> tip: Test — t і st на кінці чутно [tɛst]; machen — a коротке, ch = [x].
> uk: Чи можу я сьогодні скласти тест?

## Типові помилки українців

> [!pitfall] Інфінітив не в кінці
> ~~Ich kann schwimmen gut.~~ → Ich kann gut **schwimmen**. ~~Ich muss arbeiten heute.~~ → Ich muss heute **arbeiten**. ~~Ich will gehen nach Hause.~~ → Ich will nach Hause **gehen**. В українській порядок вільніший, а в німецькій з модальним дієсловом інфінітив стоїть **останнім**, а все інше — між двома дієсловами.

> [!pitfall] Закінчення -t і -st там, де їх немає
> ~~Ich kannst~~ → ich **kann**. ~~Er kannt~~ → er **kann**. ~~Er musst~~ → er **muss**. У модальних дієслів **ich** і **er / sie / es** мають однакову форму без закінчення. Закінчення -st — лише в *du* (*du kannst, du musst*), а множина збігається з інфінітивом (*wir können*).

> [!pitfall] «Не треба» і «не можна» — різні речі
> ~~Du musst nicht rauchen.~~ — це «тобі не обовʼязково курити». Заборона — **Du darfst nicht rauchen.** Українське «не мусиш» і «не можна» легко сплутати, а в німецькій це різні дієслова: *nicht müssen* — «не треба», *nicht dürfen* — «не можна».

> [!pitfall] Ich will замість Ich möchte
> ~~Ich will einen Kaffee.~~ → Ich **möchte** einen Kaffee. *Ich will* звучить як вимога й може здатися грубим у магазині, кафе або в установі. Для ввічливого побажання вживай *möchte*, а також *Ich hätte gern …*. І не думай, що *will* — це майбутній час, як в англійській: *ich will* = «я хочу».

## Ситуація: у центрі мовних курсів

> [!listen] Гостя приходить до центру мовних курсів. Що вона питає і що можна?
> level: A1 · type: answer · speed: slow · id: de-a1-modalverben-l07
> audio: A: Guten Tag! Kann ich Ihnen helfen?
> audio: B: Ja. Darf ich hier einen Kaffee trinken?
> audio: A: Nein, leider nicht. Aber Sie dürfen im Café nebenan einen Kaffee trinken.
> audio: B: Natürlich. Kann ich auch eine Prüfung machen?
> audio: A: Ja, aber Sie müssen einen Termin haben.
> - [x] Кави тут не можна, але можна в кафе поруч; для іспиту потрібен запис.
> - [ ] Каву тут можна; для іспиту запис не потрібен.
> - [ ] Каву можна в кафе поруч; іспит скласти не можна.
> - [ ] Кави тут не можна, а іспит можна складати без запису.
>
> **Пояснення:** *Darf ich hier einen Kaffee trinken?* — «Можна мені тут випити кави?» — відповідь *Nein*. *Sie dürfen im Café nebenan* — «у кафе поруч можна». *Sie müssen einen Termin haben* — «вам потрібен запис». Переклад: — Добрий день! Чим можу допомогти? — Так. Чи можна тут випити кави? — Ні, на жаль. Але у кафе поруч — можна. — Звісно. А чи можна скласти іспит? — Так, але вам потрібно записатися.

> [!speak] Ситуація: попроси дозволу
> level: A1 · speed: slow · id: de-a1-modalverben-s07
> text: Darf ich hier einen Kaffee trinken?
> ipa: /daʁf ɪç hiːɐ̯ ˈaɪ̯nən ˈkafe ˈtʁɪŋkn̩/
> tip: Darf — перше слово в питанні, голос іде вгору на кінці; Kaffee — наголос на першому складі.
> uk: Можна мені тут випити кави?

## Практика

> [!quiz] Er ___ gut kochen.
> level: A1 · type: single · id: de-a1-modalverben-q02
> - [x] kann
> - [ ] kannt
> - [ ] kannst
> - [ ] können
>
> **Пояснення:** для *er / sie / es* модальне дієслово не має закінчення: *er kann*. *Kannst* — лише для *du*, *können* — для *wir* і *sie*.

> [!quiz] Wir ___ jetzt gehen.
> level: A1 · type: single · id: de-a1-modalverben-q03
> - [ ] muss
> - [ ] musst
> - [x] müssen
> - [ ] müsst
>
> **Пояснення:** з *wir* форма збігається з інфінітивом: *wir müssen*. *Muss* — для *ich, er*, *musst* — для *du*, *müsst* — для *ihr*.

> [!quiz] «Morgen ist Sonntag. Ich muss nicht arbeiten.» Що це означає?
> level: A1 · type: single · id: de-a1-modalverben-q04
> - [ ] Мені не можна працювати.
> - [x] Мені не треба працювати.
> - [ ] Я не вмію працювати.
> - [ ] Я не хочу працювати.
>
> **Пояснення:** *nicht müssen* = «не треба, немає обовʼязку». Заборона була б *nicht dürfen*, відсутність вміння або змоги — *nicht können*, небажання — *nicht wollen*.

> [!quiz] «Hier darf man nicht rauchen.» Це означає:
> level: A1 · type: single · id: de-a1-modalverben-q05
> - [x] Тут не можна курити (заборонено).
> - [ ] Тут не треба курити (необовʼязково).
> - [ ] Тут ніхто не вміє курити.
> - [ ] Тут ніхто не хоче курити.
>
> **Пояснення:** *dürfen* показує дозвіл. *Nicht dürfen* — заборона, її ви бачите на знаках: *Rauchen verboten*.

> [!quiz] Як ввічливіше замовити чай у кафе?
> level: A1 · type: single · id: de-a1-modalverben-q06
> - [ ] Ich will einen Tee.
> - [x] Ich möchte einen Tee.
> - [ ] Ich muss einen Tee.
> - [ ] Ich soll einen Tee.
>
> **Пояснення:** *möchte* — ввічливе побажання. *Will* звучить як вимога, *muss* означає «мушу», а *soll* — «мені сказали».

> [!quiz] Який порядок слів правильний?
> level: A1 · type: single · id: de-a1-modalverben-q07
> - [ ] Ich muss arbeiten heute.
> - [ ] Ich arbeiten muss heute.
> - [x] Ich muss heute arbeiten.
> - [ ] Ich muss heute zu arbeiten.
>
> **Пояснення:** модальне — друге, інфінітив — останній, решта — між ними. Частки *zu* перед інфінітивом після модального немає.

> [!quiz] Які речення правильні? Обери всі.
> level: A1 · type: multi · id: de-a1-modalverben-q08
> - [x] Ich kann Deutsch.
> - [x] Er kann gut kochen.
> - [ ] Ich kannst Deutsch sprechen.
> - [ ] Ich muss gehen zu Hause.
>
> **Пояснення:** *Ich kann Deutsch* — інфінітив можна пропустити. *Er kann gut kochen* — коректна форма й порядок. *Ich kannst* — закінчення -st лише в *du*. *Ich muss gehen zu Hause* — треба *Ich muss nach Hause gehen* (інфінітив у кінці).

> [!quiz] У яких реченнях ідеться про дозвіл або заборону? Обери всі.
> level: A1 · type: multi · id: de-a1-modalverben-q09
> - [x] Hier darf man parken.
> - [ ] Ich kann Auto fahren.
> - [x] Du darfst nicht rauchen.
> - [ ] Wir müssen gehen.
>
> **Пояснення:** про дозвіл і заборону говорить *dürfen*. *Kann … fahren* — вміння, *müssen* — обовʼязок.

> [!quiz] «Чи можна тут паркуватися?» Як спитати?
> level: A1 · type: single · id: de-a1-modalverben-q10
> - [ ] Muss man hier parken?
> - [x] Darf man hier parken?
> - [ ] Will man hier parken?
> - [ ] Möchte man hier parken?
>
> **Пояснення:** про дозвіл питаємо з *dürfen*. *Muss man hier parken?* — «чи обовʼязково тут паркуватися?». *Will / möchte man hier parken?* — «чи хоче хтось».

> [!quiz] Відмінюй модальні дієслова
> level: A1 · type: fill · bank: kannst, dürft · id: de-a1-modalverben-q11
>
> ```text fill
> Ich [[kann]] gut kochen. (können)
> Du [[musst]] heute arbeiten. (müssen)
> Er [[will]] nach Hause. (wollen)
> Wir [[dürfen]] hier nicht parken. (dürfen)
> ```
>
> **Пояснення:** *ich kann* (без закінчення), *du musst* (-st), *er will* (без закінчення), *wir dürfen* (як інфінітив). Дистрактори: *kannst* — для *du*, *dürft* — для *ihr*.

> [!quiz] Додай інфінітив у кінці
> level: A1 · type: fill · bank: kommt, geraucht · id: de-a1-modalverben-q12
>
> ```text fill
> Ich muss heute [[arbeiten]].
> Kannst du morgen [[kommen]]?
> Hier darf man nicht [[rauchen]].
> Wir möchten Tee [[trinken]].
> ```
>
> **Пояснення:** після модального дієслова смислове дієслово стоїть у інфінітиві. *Kommt* (форма для *ihr / er*) і *geraucht* (Partizip II) тут не підходять.

> [!quiz] möchten: впиши форму
> level: A1 · type: fill · bank: möchtet, mag · id: de-a1-modalverben-q13
>
> ```text fill
> Ich [[möchte]] einen Tee.
> Du [[möchtest]] Kaffee?
> Er [[möchte]] ein Brötchen.
> Wir [[möchten]] bezahlen.
> ```
>
> **Пояснення:** *ich möchte, du möchtest, er möchte, wir möchten*. *Möchtet* — для *ihr*. *Mag* — форма від *mögen* (подобається), а не «хотів би».

> [!quiz] Склади речення: «Я сьогодні не можу прийти.»
> level: A1 · type: order · id: de-a1-modalverben-q14
>
> ```text order
> Ich kann
> heute
> nicht
> kommen.
> kann ich ✗
> ```
>
> **Пояснення:** *Ich kann* на початку (V2), *nicht* перед інфінітивом, *kommen* — в кінці. *Kann ich heute nicht kommen* було б питанням.

> [!quiz] Склади питання: «Ти можеш завтра готувати?»
> level: A1 · type: order · id: de-a1-modalverben-q15
>
> ```text order
> Kannst du
> morgen
> kochen?
> du kannst ✗
> ```
>
> **Пояснення:** у питанні «так / ні» модальне дієслово стоїть першим: *Kannst du …?* Інфінітив лишається в кінці.

> [!quiz] Склади речення: «Сьогодні мені треба працювати.»
> level: A1 · type: order · id: de-a1-modalverben-q16
>
> ```text order
> Heute
> muss
> ich
> arbeiten.
> Heute ich muss ✗
> ```
>
> **Пояснення:** коли речення починається з *heute*, дієслово все одно друге, а підмет за ним: *Heute muss ich arbeiten*. Інфінітив — в кінці.

## Фішки

> [!reel] 🇬🇧 will — хибний друг
> Англійське *I will go* означає майбутнє, а німецьке *ich will gehen* — «я хочу піти». Хоча слова споріднені: давнє значення «бажати» в англійській стало допоміжним дієсловом майбутнього, а в німецькій лишилося як «хотіти». Майбутнє в німецькій будує *werden*.

> [!reel] 🧬 Чому ich kann = er kann
> Більшість модальних дієслів (können, müssen, dürfen, sollen, mögen) — колишні форми минулого часу, які з часом стали теперішніми: «я знав» перетворилося на «я вмію». Тому в однині в них немає закінчення -t в 3-й особі, а голосний інший, ніж в інфінітиві. Такі дієслова називають претерито-презентними. *Wollen* трохи інше, а *möchte* взагалі форма від *mögen*.

> [!reel] 🚭 Verboten!
> Німеччина славиться знаками й правилами: *Rauchen verboten*, *Parken verboten*, *Betreten verboten*. Слово *verboten* — «заборонено», і воно настільки німецьке, що його зрозуміють у багатьох країнах. Але в розмові правило частіше звучить як *Das darf man nicht*.

## Джерела та що почитати

- [DWDS — können](https://www.dwds.de/wb/k%C3%B6nnen): значення, форми, приклади, походження.
- [DWDS — dürfen](https://www.dwds.de/wb/d%C3%BCrfen): форми та значення.
- [DWDS — möchten](https://www.dwds.de/wb/m%C3%B6chten): як слово виникло з *mögen* і що означає сьогодні.
- [Duden — Modalverben](https://www.duden.de/sprachwissen/sprachratgeber/modalverben): огляд модальних дієслів і їхніх значень.
- [DW — Nicos Weg (українською)](https://learngerman.dw.com/uk/nicos-weg/c-36519789): безкоштовний відеокурс A1–B1, модальні дієслова — у тематичних уроках.
- [Goethe-Institut — Wortliste Start Deutsch 1 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf): офіційний словник рівня A1.

> [!important] Підсумок
> - Модальні: **können** (вміти, могти), **müssen** (мусити), **wollen** (хотіти), **dürfen** (можна), **möchten** (хотів би), **sollen** (мати).
> - Модальне — друге місце, інфінітив — **у кінці**, без *zu*: *Ich muss heute arbeiten.*; питання — модальне перше: *Kannst du …?*
> - *ich* і *er / sie / es* — без закінчення (*ich kann, er kann*), *du* — *-st*. У множині форма як в інфінітиві.
> - **nicht müssen** = не треба, **nicht dürfen** = не можна, **nicht können** = не можу.
> - Для ввічливості — **Ich möchte …**; *Ich will* — рішуче «хочу», не майбутній час.
