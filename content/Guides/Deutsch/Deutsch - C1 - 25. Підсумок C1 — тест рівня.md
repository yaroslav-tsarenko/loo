---
title: Підсумок C1 — тест рівня
id: de-c1-review
level: C1
icon: px:crown
tags: [deutsch, c1, review, test]
prerequisites: ["[[Deutsch - C1 - 24. Словотвір III — фахові складні слова, be-, ent-, er-, -ismus]]"]
estimatedMinutes: 90
---

# Підсумок C1 — тест рівня

> [!success] Після цієї теми ти зможеш
> - перевірити себе з усього рівня C1: *розширені дієприкметникові означення й Gerundiv, Nominalstil, Funktionsverbgefüge, модальні частки, непряму мову, умову без wenn, Vorfeld і Ausklammerung, звʼязність тексту, прийменники писемної мови, контрастивний наголос* і лексику тем «ідіоми, наука, робота, конотації, колокації, регістр, письмо, суспільні дебати, словотвір»;
> - розрізняти на слух умову без *wenn*, Konjunktiv I і Gerundiv та записати речення писемного стилю під диктовку;
> - попрацювати в форматі Goethe-Zertifikat C1: по одному-два завдання з кожної з чотирьох частин *Lesen* і *Hören*;
> - почути й вимовити пари слів рівня C1 (*Hypothese / Hypothek, kindlich / kindisch*) і типові фрази для листа, наради й дискусії;
> - позначити в чеклісті «я вмію», що вже працює, а що ще варто повторити.

Це тема без нового матеріалу. Нових правил тут немає, правила й лексика — з тем C1-01…24 і попередніх рівнів; кілька нових слів (на кшталт *Neuerscheinungen*, *aufbürden*, *gegensteuern*) зрозумієш із контексту. Якщо щось не виходить, повернися до теми, на яку вказує пояснення. Після кожного блоку зупинись і подивись, у якому розділі найбільше помилок: це твій план повторення.

> [!diagram] Розмова чи писемна мова: та сама думка у двох регістрах
> ```yaml
> layout: compare
> columns: { a: "Розмова", b: "Писемна мова C1" }
> nodes:
>   - { id: a1, col: a, label: "Умова", text: "Wenn Sie Fragen haben, …", note: "сполучник wenn", tone: yellow }
>   - { id: a2, col: a, label: "Причина", text: "wegen dem Regen", note: "Dativ — розмовне", tone: yellow }
>   - { id: a3, col: a, label: "Дія", text: "Wenn Sie die Frist nicht einhalten, …", note: "Verbalstil", tone: yellow }
>   - { id: a4, col: a, label: "Чужі слова", text: "Er hat gesagt, er hat keine Zeit.", note: "Indikativ", tone: yellow }
>   - { id: b1, col: b, label: "Умова", text: "Sollten Sie Fragen haben, …", note: "дієслово на першому місці, C1-06", tone: pink }
>   - { id: b2, col: b, label: "Причина", text: "aufgrund des Regens", note: "Genitiv, C1-09", tone: pink }
>   - { id: b3, col: b, label: "Дія", text: "Bei Nichteinhaltung der Frist …", note: "Nominalstil, C1-02", tone: pink }
>   - { id: b4, col: b, label: "Чужі слова", text: "Er erklärte, er habe keine Zeit.", note: "Konjunktiv I, C1-05", tone: pink }
> steps:
>   - { focus: [a1, a2, a3, a4], note: "Ліва колонка — нормальна жива мова: так говорять із колегами, друзями, у магазині." }
>   - { focus: [b1, b2, b3, b4], note: "Права колонка — те саме в листі, звіті, науковому тексті чи новинах. На C1 ти вибираєш регістр свідомо й не змішуєш колонки в одному тексті." }
> ```
> Обидві колонки — правильна німецька. Колір лише розрізняє регістри; тема, де це пояснено, вказана в підписі.

> [!diagram] Поля речення: що стоїть перед дужкою, у ній і за нею
> ```yaml
> layout: flow
> nodes:
>   - { id: vf, label: "Vorfeld · один член", text: "Gestern", tone: gray }
>   - { id: lk, label: "ліва дужка · змінюване дієслово", text: "hat", tone: orange }
>   - { id: mf, label: "Mittelfeld", text: "der Chef den Vertrag", tone: gray }
>   - { id: rk, label: "права дужка", text: "unterschrieben.", tone: orange }
>   - { id: nf, label: "Nachfeld", text: "—", tone: gray }
> steps:
>   - { focus: [vf, lk, mf, rk], note: "Gestern hat der Chef den Vertrag unterschrieben. У Vorfeld — рамка (час), далі змінюване дієслово, у кінці — Partizip II." }
>   - { set: { vf: "Den Vertrag", mf: "gestern der Chef" }, focus: [vf], note: "Den Vertrag hat gestern der Chef unterschrieben. Додаток у Vorfeld звʼязує речення з попереднім або протиставляє (а не, наприклад, листа). C1-07." }
>   - { set: { vf: "Gestern", mf: "der Chef mehr", rk: "gearbeitet", nf: "als ich." }, focus: [nf], note: "Gestern hat der Chef mehr gearbeitet als ich. За дужку виносимо порівняння з als / wie, підрядні речення, інфінітивні групи — але не додаток в Akkusativ." }
> ```
> Помаранчевий — дві частини дієслова (дужка), сірий — решта членів речення.

## Блок 1. Писемний стиль: означення, Nominalstil, FVG, прийменники, умова

> [!quiz] Як розгорнути означення *die von der Regierung im März beschlossenen Maßnahmen*?
> level: C1 · type: single · id: de-c1-review-q01
> - [x] die Maßnahmen, die die Regierung im März beschlossen hat
> - [ ] die Maßnahmen, die die Regierung im März beschließt
> - [ ] die Regierung, die im März Maßnahmen beschlossen hat
> - [ ] die Maßnahmen, die die Regierung im März beschließen wird
>
> **Пояснення:** рамка *die … Maßnahmen* показує, що головне слово — *Maßnahmen*; читаємо справа наліво: *beschlossenen* (Partizip II — дію завершено) → *im März* (коли) → *von der Regierung* (ким). Третій варіант робить головним словом *Regierung*, бо читає зліва направо; Präsens і Futur не передають завершеної дії Partizip II. Тема C1-01.

> [!quiz] Заповни пропуски: Gerundiv (*zu* + Partizip I)
> level: C1 · type: fill · id: de-c1-review-q02
>
> ```text fill
> Bitte senden Sie uns die [[einzureichenden]] Unterlagen bis Freitag. (einreichen — «які треба подати»)
> Das ist ein nicht zu [[unterschätzendes]] Risiko. (unterschätzen — «яке не можна недооцінювати»)
> ```
>
> **Пояснення:** Gerundiv = *zu* + Partizip I + закінчення прикметника. У відокремлюваних дієсловах *zu* стоїть усередині й пишеться разом: *ein-zu-reichend-en*. У *unterschätzen* префікс невідокремлюваний, тому *zu* стоїть окремо перед словом: *zu unterschätzendes* (середній рід після *ein* — **-es**). Тема C1-01.

> [!quiz] Лист в установу. Перепиши «Wenn Sie die Frist nicht einhalten, …» у Nominalstil.
> level: C1 · type: single · id: de-c1-review-q03
> - [x] Bei Nichteinhaltung der Frist …
> - [ ] Bei nicht Einhaltung der Frist …
> - [ ] Bei Nichteinhaltung die Frist …
> - [ ] Bei der Frist Nichteinhaltung …
>
> **Пояснення:** *wenn* → *bei*; дієслово *einhalten* → іменник *die Einhaltung*; заперечення *nicht* стає частиною слова: **Nichteinhaltung** (разом, з великої); додаток стає Genitiv: **der Frist**. Окреме *nicht Einhaltung* — помилка правопису, *die Frist* — неправильний відмінок, а Genitiv-означення стоїть після іменника, не перед ним. Тема C1-02.

> [!quiz] «Новий закон набуває чинності 1 січня.» «Das neue Gesetz ___ am 1. Januar in Kraft.»
> level: C1 · type: single · id: de-c1-review-q04
> - [x] tritt
> - [ ] kommt
> - [ ] setzt
> - [ ] stellt
>
> **Пояснення:** сполука — **in Kraft treten** (Perfekt із *sein*: *ist in Kraft getreten*). *In Kraft setzen* — каузативна сполука з додатком: *Die Regierung setzt die Verordnung in Kraft*; без додатка вона не працює. *In Kraft kommen* і *in Kraft stellen* не вживаються. Тема C1-03.

> [!quiz] Які речення мають пасивне значення без *werden*? Обери всі.
> level: C1 · type: multi · id: de-c1-review-q05
> - [x] Der Vorschlag fand breite Zustimmung.
> - [x] Das Thema kam in der Sitzung zur Sprache.
> - [x] Das Gesetz erfuhr mehrere Änderungen.
> - [ ] Die Firma stellte uns die Daten zur Verfügung.
> - [ ] Die Leiterin brachte das Projekt in Gang.
>
> **Пояснення:** з *finden, kommen, erfahren* підмет не діє сам, а «зазнає» дії: *Der Vorschlag fand Zustimmung* ≈ *Dem Vorschlag wurde zugestimmt*; *kam zur Sprache* ≈ *wurde besprochen*; *erfuhr Änderungen* ≈ *wurde geändert*. *Zur Verfügung stellen* і *in Gang bringen* — каузативні сполуки: підмет сам робить дію, тобто це актив. Тема C1-03.

> [!quiz] Які сполуки правильні в офіційному листі? Обери всі.
> level: C1 · type: multi · id: de-c1-review-q06
> - [x] gemäß dem Vertrag
> - [x] hinsichtlich des Vertrags
> - [x] der Einfachheit halber
> - [ ] gemäß des Vertrags
> - [ ] halber der Einfachheit
>
> **Пояснення:** більшість прийменників писемної мови керує Genitiv (*hinsichtlich, aufgrund, angesichts*), але **gemäß** — Dativ, тож *gemäß des Vertrags* — гіперкорекція: «офіційне, отже Genitiv». *Halber* — постпозиція: стоїть **після** іменника (*der Einfachheit halber*). Тема C1-09.

> [!quiz] Лист від фірми. «Якщо раптом у Вас виникнуть питання, зателефонуйте нам.» «___ Sie Fragen haben, rufen Sie uns an.»
> level: C1 · type: single · id: de-c1-review-q07
> - [x] Sollten
> - [ ] Hätten
> - [ ] Würden
> - [ ] Sollen
>
> **Пояснення:** **Sollten** + інфінітив на першому місці — реальна, але малоймовірна умова («якщо раптом»), типова для ділових листів; головна частина — Imperativ або Präsens. *Hätten Sie Fragen* — нереальна умова, з наказом *rufen Sie an* вона не поєднується; *Würden Sie Fragen haben* — громіздко й теж нереальна умова; *Sollen Sie* умови не виражає. Тема C1-06.

> [!quiz] Склади речення: «Якщо раптом виникнуть проблеми, звертайтеся до мене»
> level: C1 · type: order · id: de-c1-review-q08
>
> ```text order
> Sollte
> es
> Probleme
> geben,
> wenden Sie sich
> an mich.
> Sollten ✗
> ```
>
> **Пояснення:** умова без *wenn*: змінюване дієслово на першому місці, інфінітив у кінці частини (*geben*), після коми — головне речення теж з дієсловом на початку. У *es gibt* дієслово стоїть в однині незалежно від *Probleme*, тому **Sollte**, а не *Sollten*. Тема C1-06.

## Блок 2. Частки, непряма мова, будова речення, звʼязність, наголос

> [!quiz] «Заходь, не соромся!» «Komm ___ rein!»
> level: C1 · type: single · id: de-c1-review-q09
> - [x] ruhig
> - [ ] etwa
> - [ ] wohl
> - [ ] überhaupt
>
> **Пояснення:** **ruhig** у наказі — дозвіл і заохочення: «сміливо, не бійся». *Etwa* живе в питаннях («невже?»), *wohl* виражає припущення (*Er wird wohl krank sein*), *überhaupt* ставить під сумнів передумову (*Hast du überhaupt Zeit?*). У проханні-запрошенні жодна з них не працює. Тема C1-04.

> [!quiz] Заповни пропуски: непряма мова
> level: C1 · type: fill · id: de-c1-review-q10
>
> ```text fill
> Sie sagte, sie [[habe]] gestern nicht kommen [[können]]. (haben — Konjunktiv I; модальне können)
> Die Firma teilte mit, die Preise [[würden]] im Herbst steigen. (werden; Konjunktiv I тут збігся б з Indikativ)
> ```
>
> **Пояснення:** модальне дієслово в минулому — *habe* + подвійний інфінітив: *habe … kommen können*. Для 3-ї особи множини *sie werden* Konjunktiv I дорівнює Indikativ, тому за правилом заміни беремо Konjunktiv II: **würden**. Тема C1-05.

> [!quiz] «Міністр рішуче відкинув закид.» Яке речення це передає?
> level: C1 · type: single · id: de-c1-review-q11
> - [x] Der Minister wies den Vorwurf entschieden zurück.
> - [ ] Der Minister entgegnete den Vorwurf entschieden.
> - [ ] Der Minister pflichtete dem Vorwurf entschieden bei.
> - [ ] Der Minister räumte den Vorwurf entschieden ein.
>
> **Пояснення:** **zurückweisen** (+ Akk) — «відкинути, відхилити». *Entgegnen* (jemandem etwas) означає «відповісти, заперечити»; в Akkusativ стоїть сама відповідь (*er entgegnete nichts / entgegnete, dass …*), а не закид, на який відповідають; *beipflichten* — «погодитися»; *einräumen* — «визнати». Дієслово-ввід показує позицію мовця, тож помилка тут змінює зміст. Тема C1-05.

> [!quiz] Які речення правильні? Обери всі.
> level: C1 · type: multi · id: de-c1-review-q12
> - [x] Es kamen gestern viele Gäste.
> - [x] Gestern kamen viele Gäste.
> - [ ] Gestern kamen es viele Gäste.
> - [ ] Es kam gestern viele Gäste.
> - [ ] Gestern es kamen viele Gäste.
>
> **Пояснення:** *es* лише заповнює порожній Vorfeld і зникає, коли там стоїть інший член речення (*Gestern kamen …*). Дієслово узгоджується зі справжнім підметом *viele Gäste*, тому **kamen**, а не *kam*. Перед змінюваним дієсловом може стояти тільки один член речення, тож *Gestern es kamen* порушує V2. Тема C1-07.

> [!quiz] «Я часто думаю про бабусю.» «Ich denke oft an meine Oma.» → «Ich denke oft ___.»
> level: C1 · type: single · id: de-c1-review-q13
> - [x] an sie
> - [ ] daran
> - [ ] an ihr
> - [ ] woran
>
> **Пояснення:** займенникові прислівники (*daran, darüber, damit*) відсилають до речей і думок; для людини беремо прийменник + займенник: **an sie** (*denken an* + Akk). *An ihr* — Dativ, *woran* — питальне або відносне слово. Тема C1-08.

> [!quiz] «Ich habe das nicht geSAGT.» Наголос — на *SAGT*. Що мовець має на увазі?
> level: C1 · type: single · id: de-c1-review-q14
> - [x] Він цього не казав, а, наприклад, написав.
> - [ ] Це сказав не він, а хтось інший.
> - [ ] Він сказав щось інше, не це.
> - [ ] Він узагалі не памʼятає цієї розмови.
>
> **Пояснення:** контрастивний наголос стоїть на слові, яке протиставляють: *nicht geSAGT (sondern geschrieben)*. Наголос на *ICH* означав би «не я», на *DAS* — «не це». Четвертий варіант із наголосом не повʼязаний: *geSAGT* протиставляє лише спосіб дії. Тема C1-10.

## Блок 3. Слухання, ідіоми, наука, робота, відтінки значень, колокації

> [!quiz] Австрієць каже: «Heuer fahren wir nach Kärnten.» Коли вони їдуть?
> level: C1 · type: single · id: de-c1-review-q15
> - [x] цього року
> - [ ] минулого року
> - [ ] наступного тижня
> - [ ] сьогодні ввечері
>
> **Пояснення:** *heuer* — «цього року» в австрійському й швейцарському стандарті та на півдні Німеччини; у Німеччині загалом кажуть *dieses Jahr*. Це не діалект, а варіант стандартної мови. Тема C1-11.

> [!quiz] Лектор: «Kritiker behaupten, die Maßnahme sei wirkungslos. Das greift jedoch zu kurz.» Яка позиція лектора?
> level: C1 · type: single · id: de-c1-review-q16
> - [x] Він вважає критику надто спрощеною.
> - [ ] Він погоджується, що захід нічого не дає.
> - [ ] Він лише переказує критиків, своєї думки не має.
> - [ ] Він вважає, що критики мають рацію, але висловилися надто коротко.
>
> **Пояснення:** перше речення — переказ чужої думки (Konjunktiv I *sei*, *Kritiker behaupten*), друге — позиція самого лектора: *das greift zu kurz* = «це надто спрощено, не враховує всього». Буквальне «надто коротко» — пастка. Позиція мовця зʼявляється після *jedoch, aber, doch*. Тема C1-12.

> [!quiz] «Er hat mir einen Bären aufgebunden.» Що сталося?
> level: C1 · type: single · id: de-c1-review-q17
> - [x] Він мене обдурив, наплів мені небилиць.
> - [ ] Він мені дуже допоміг у складній справі.
> - [ ] Він мене налякав.
> - [ ] Він переклав на мене свою роботу.
>
> **Пояснення:** *jemandem einen Bären aufbinden* — «набрехати, переконати в неправді». Українською це «наплести небилиць» або «набрехати з три короби»; дослівно образ не перекладають. Останній варіант — плутанина з *jemandem etwas aufbürden* («перекласти тягар»). Тема C1-13.

> [!quiz] Як називається припущення, яке в дослідженні перевіряють на даних?
> level: C1 · type: single · id: de-c1-review-q18
> - [x] die Hypothese
> - [ ] die These
> - [ ] die Theorie
> - [ ] der Befund
>
> **Пояснення:** **Hypothese** — те, що перевіряють емпірично. *These* — твердження, яке автор обстоює аргументами; *Theorie* — ціла система пояснень; *Befund* — результат дослідження. Тема C1-14.

> [!quiz] Яка репліка на нараді висловлює незгоду дипломатично?
> level: C1 · type: single · id: de-c1-review-q19
> - [x] Ich gebe zu bedenken, dass die Frist sehr knapp ist.
> - [ ] Das ist doch völlig unrealistisch.
> - [ ] Die Frist ist falsch geplant.
> - [ ] Sie haben die Frist nicht verstanden.
>
> **Пояснення:** *Ich gebe zu bedenken, dass …* подає незгоду як аргумент для роздумів, а не як вирок. Інші три репліки звучать як оцінка (*völlig unrealistisch*, *falsch*) або як закид людині (*Sie haben … nicht verstanden*). Тема C1-15.

> [!quiz] Які прикметники описують людину схвально? Обери всі.
> level: C1 · type: multi · id: de-c1-review-q20
> - [x] sparsam
> - [x] zielstrebig
> - [x] konsequent
> - [ ] geizig
> - [ ] verbissen
> - [ ] stur
>
> **Пояснення:** пари з однаковим значенням і різною оцінкою: *sparsam* (ощадливий) — *geizig* (скупий), *zielstrebig* (цілеспрямований) — *verbissen* (запеклий, вперто зациклений), *konsequent* (послідовний) — *stur* (упертий). У відгуку чи рекомендаційному листі обирай ліве слово пари. Тема C1-16.

> [!quiz] Заповни пропуски: колокації
> level: C1 · type: fill · id: de-c1-review-q21 · bank: nehmen, machen, getroffen
>
> ```text fill
> Wer ein Unternehmen gründet, muss auch ein Risiko [[eingehen]].
> Aus den Daten lassen sich zwei Schlüsse [[ziehen]].
> Der Plan hat großes Aufsehen [[erregt]].
> ```
>
> **Пояснення:** **ein Risiko eingehen**, **Schlüsse ziehen**, **Aufsehen erregen** — сталі сполуки, дієслово тут не вибирають довільно. *Ein Risiko nehmen* — калька з англійського *take a risk*; у писемній мові кажуть *eingehen* (або *auf sich nehmen*, *in Kauf nehmen*). *Schlüsse machen* — калька з «робити висновки» (а *Schluss machen* означає «закінчити, розійтися»). *Aufsehen getroffen* не існує. Тема C1-17.

## Блок 4. Регістр, письмо, читання, говоріння, дебати, словотвір

> [!quiz] У листі з установи: «Bitte melden Sie sich fernmündlich.» Як треба звʼязатися?
> level: C1 · type: single · id: de-c1-review-q22
> - [x] телефоном
> - [ ] особисто
> - [ ] письмово
> - [ ] електронною поштою
>
> **Пояснення:** *fernmündlich* — канцелярське слово для *telefonisch*. Amtsdeutsch треба розуміти, але у відповіді установі пиши звичайною писемною мовою: *Ich rufe Sie gern an.* Тема C1-18.

> [!quiz] Частка студентів зросла з 20 % до 25 %. Які формулювання правильні? Обери всі.
> level: C1 · type: multi · id: de-c1-review-q23
> - [x] Der Anteil ist um fünf Prozentpunkte gestiegen.
> - [x] Der Anteil ist um 25 Prozent gestiegen.
> - [ ] Der Anteil ist um fünf Prozent gestiegen.
> - [ ] Der Anteil ist auf fünf Prozentpunkte gestiegen.
>
> **Пояснення:** різниця двох відсоткових значень — у **Prozentpunkte**: 25 − 20 = 5. Відносне зростання — у **Prozent**: 5 від 20 — це 25 %. *Um fünf Prozent* — типова помилка в описі графіка; *auf* називає новий рівень (*auf 25 Prozent*), а не різницю. Тема C1-19.

> [!quiz] Діловий лист за DIN 5008. Що правда? Обери всі.
> level: C1 · type: multi · id: de-c1-review-q24
> - [x] Рядок теми пишуть без слова «Betreff» і без крапки в кінці.
> - [x] Після *Mit freundlichen Grüßen* кома не ставиться.
> - [x] Після звертання *Sehr geehrte Frau Weber,* перше слово тексту — з малої літери (якщо це не іменник і не *Sie*).
> - [ ] Після *Mit freundlichen Grüßen* ставлять кому, як після звертання.
> - [ ] Рядок теми починається словом «Betreff:» і закінчується крапкою.
>
> **Пояснення:** тему можна виділити жирним (DIN 5008), але без слова *Betreff* і без крапки; після звертання — кома, і текст іде з малої (це правило правопису); прощальна формула стоїть без коми. Кома після *Mit freundlichen Grüßen* — калька з англійського листа. Тема C1-20.

> [!quiz] Клієнт не оплатив рахунок. Склади кроки фірми в правильному порядку.
> level: C1 · type: order · id: de-c1-review-q25
>
> ```text order
> Zahlungserinnerung
> Mahnung
> letzte Mahnung
> Mahnverfahren
> Abmahnung ✗
> ```
>
> **Пояснення:** у діловій практиці зазвичай спершу ввічливе нагадування (*Zahlungserinnerung*), потім *Mahnung*, *letzte Mahnung* із кінцевим строком і, якщо оплати немає, судове *Mahnverfahren*. *Abmahnung* сюди не належить: це попередження працівникові чи конкурентові про порушення, а не нагадування про борг. Тема C1-20.

> [!quiz] Що таке *das Feuilleton* у німецькій газеті?
> level: C1 · type: single · id: de-c1-review-q26
> - [x] розділ про культуру: книжки, театр, кіно, дебати
> - [ ] короткий сатиричний текст, як український фейлетон
> - [ ] передова стаття редакції
> - [ ] розділ приватних оголошень
>
> **Пояснення:** *das Feuilleton* — «хибний друг»: це розділ культури, де виходять рецензії й есеї. Іронічний короткий текст німецькою — *die Glosse*, передова стаття — *der Leitartikel*. Тема C1-21.

> [!quiz] Дискусія відійшла від теми. Яка репліка модератора повертає до неї?
> level: C1 · type: single · id: de-c1-review-q27
> - [x] Lassen Sie uns zum eigentlichen Thema zurückkommen.
> - [ ] Halten wir fest: Wir sind uns in zwei Punkten einig.
> - [ ] Möchten Sie direkt darauf antworten?
> - [ ] Zusammenfassend lässt sich sagen, dass …
>
> **Пояснення:** *zum Thema zurückkommen* — повернути до теми. *Halten wir fest* — проміжний підсумок, *Möchten Sie darauf antworten?* — дати слово, *Zusammenfassend …* — завершення. У модерації кожна з цих реплік має своє місце, але тему відновлює лише перша. Тема C1-22.

> [!quiz] Чим *Desinformation* відрізняється від *Fehlinformation*?
> level: C1 · type: single · id: de-c1-review-q28
> - [x] Desinformation поширюють навмисно, щоб ввести в оману; Fehlinformation хибна, але без такого наміру.
> - [ ] Це синоніми, які вживають однаково.
> - [ ] Desinformation — будь-яка помилка в новинах, Fehlinformation — свідома брехня.
> - [ ] Fehlinformation стосується лише чисел і статистики.
>
> **Пояснення:** вирішує **намір**: *Desinformation* — свідомо неправдива інформація, *Fehlinformation* — помилка, яку поширюють, не знаючи, що вона хибна. Третій варіант міняє значення місцями. У дебаті точний термін — частина збалансованої позиції. Тема C1-23.

> [!quiz] Який рід має *Kraftfahrzeughaftpflichtversicherung* і чому?
> level: C1 · type: single · id: de-c1-review-q29
> - [x] die — бо останнє слово (Grundwort) — *die Versicherung*
> - [ ] das — бо перше слово — *das Kraftfahrzeug*
> - [ ] der — бо довгі складні слова мають чоловічий рід
> - [ ] die або das — на вибір мовця
>
> **Пояснення:** рід, множину й основне значення складного слова дає **останній** компонент. Читай справа наліво: *Versicherung* (страхування) ← *Haftpflicht* (цивільна відповідальність) ← *Kraftfahrzeug* (механічний транспортний засіб, *Kfz*). Тема C1-24.

> [!quiz] Заповни пропуски: префікси be-, ent-, er-
> level: C1 · type: fill · id: de-c1-review-q30
>
> ```text fill
> Die Kaffeemaschine muss regelmäßig [[entkalkt]] werden. (видалити накип)
> Seine Haare sind früh [[ergraut]]. (стати сивим)
> Die Stadt will die Dächer [[begrünen]]. (засадити зеленню)
> ```
>
> **Пояснення:** **ent-** прибирає те, що названо в корені (*Kalk* → *entkalken*); **er-** означає «стати яким» (*grau* → *ergrauen*, Perfekt із *sein*); **be-** «забезпечує чимось» (*grün* → *begrünen*). Partizip II цих дієслів — без *ge-*. Тема C1-24.

## Формат Goethe-Zertifikat C1: Lesen

Модуль *Lesen* Goethe-Zertifikat C1 триває 65 хвилин, має чотири частини й 30 завдань (8 + 7 + 8 + 7); словником користуватися не можна. Teil 1 — пропуски в науково-популярному тексті (вибір з чотирьох), Teil 2 — журнальна стаття з питаннями a / b / c, Teil 3 — коментар із 8 пропусками й 10 реченнями (два зайві), Teil 4 — дописи трьох фахівців a / b / c і 7 тверджень, два з яких не належать нікому (0). Нижче — спрощені навчальні тексти й по одному-два завдання на кожну частину; справжні тексти довші, а завдань більше.

> [!example] Mehrwegbecher statt Einwegbecher (навчальний текст для Teil 1 і Teil 2)
> Wer morgens einen Kaffee zum Mitnehmen kauft, bekommt ihn meist in einem Einwegbecher. Jahr für Jahr landen so unzählige Becher im Müll, obwohl sich viele Cafés längst auf Mehrwegsysteme umstellen könnten. Umweltverbände fordern daher, dass Anbieter ihren Kunden auch Mehrwegbecher anbieten müssen. Die Betreiber sollten den Aufwand dafür nicht scheuen, sondern den Nutzen stärker in Betracht **(1)**.
>
> Allerdings ist ein Pfandbecher noch keine Lösung: Kunden vergessen ihn zu Hause, und gerade wenn es morgens schnell gehen muss, greifen sie doch wieder zum Einwegbecher. Entscheidend ist also weniger, wie viele Mehrwegbecher ausgegeben werden, als vielmehr, wie oft jeder einzelne tatsächlich benutzt wird.

> [!quiz] Welches Wort passt in Lücke (1)? (Teil 1 · a, b, c, d)
> level: C1 · type: single · id: de-c1-review-q31
> - [ ] a) nehmen
> - [x] b) ziehen
> - [ ] c) stellen
> - [ ] d) bringen
>
> **Пояснення:** сполука — **in Betracht ziehen** («взяти до уваги»). Тут пропуск перевіряє сталу сполуку: решта дієслів граматично стоять на місці, але з *in Betracht* не поєднуються. Загалом у Teil 1 пропуски перевіряють лексику, сталі сполуки, прийменники, сполучники й відносні займенники. Теми C1-03 і C1-17.

> [!quiz] Was ist laut Text entscheidend? (Teil 2 · a, b, c)
> level: C1 · type: single · id: de-c1-review-q32
> - [ ] a) dass möglichst viele Mehrwegbecher ausgegeben werden
> - [x] b) dass jeder Mehrwegbecher möglichst oft benutzt wird
> - [ ] c) dass Cafés keinen Kaffee zum Mitnehmen mehr verkaufen
>
> **Пояснення:** *Entscheidend ist also weniger, wie viele Mehrwegbecher ausgegeben werden, als vielmehr, wie oft jeder einzelne tatsächlich benutzt wird.* Конструкція *weniger … als vielmehr …* ставить на перше місце другу частину. Варіант a — пастка: ці слова є в тексті, але з *weniger*. Тема C1-21.

> [!example] Handyverbot an Schulen — ein Kommentar (навчальний текст для Teil 3)
> Kaum ein Thema erhitzt derzeit die Gemüter so sehr wie das Handyverbot an Schulen. Befürworter verweisen auf Studien, denen zufolge Schülerinnen und Schüler ohne Smartphone konzentrierter arbeiten. **[ … ]** Doch ein Verbot allein bringt Jugendlichen noch nicht bei, verantwortungsvoll mit digitalen Medien umzugehen. Wer Medienkompetenz will, muss sie unterrichten — und dafür braucht es Zeit im Lehrplan, nicht nur ein Schild an der Schultür.

> [!quiz] Welcher Satz passt in die Lücke? (Teil 3)
> level: C1 · type: single · id: de-c1-review-q33
> - [x] Das mag in vielen Fällen zutreffen.
> - [ ] Deshalb lehnen sie jedes Verbot ab.
> - [ ] Die Debatte darüber ist daher längst beendet.
>
> **Пояснення:** після пропуску стоїть *Doch …* — отже, перед ним потрібна поступка: *Das mag … zutreffen* («можливо, це й так»), а далі автор обмежує її. Другий варіант суперечить попередньому реченню (прихильники заборони не можуть бути проти неї), третій суперечить першому реченню: дебати тривають (*erhitzt derzeit die Gemüter*), а після завершених дебатів *Doch …* не стоїть. У Teil 3 шукай звʼязки: займенники, конектори, повтори. Теми C1-08 і C1-21.

> [!example] Autofreie Innenstadt? Drei Fachleute (навчальний текст для Teil 4)
> **A — Dr. Lena Hoff, Verkehrsforscherin:** Erfahrungen aus mehreren europäischen Städten zeigen: Wird eine Straße für Autos gesperrt, verlagert sich der Verkehr nur zum Teil. Ein Teil verschwindet, weil Menschen ihre Wege anders planen.
>
> **B — Markus Brenner, Einzelhändler:** Für meine Kundschaft aus dem Umland ist das Auto unverzichtbar. Ohne Parkplätze in der Nähe fährt sie ins Einkaufszentrum am Stadtrand.
>
> **C — Jonas Feld, Stadtplaner:** Entscheidend ist die Reihenfolge. Erst müssen Busse und Bahnen ausgebaut werden, dann kann man Autos zurückdrängen. Wer es umgekehrt macht, verliert die Akzeptanz der Bevölkerung.

> [!quiz] Wer hält den Ausbau von Bus und Bahn für eine Voraussetzung? (Teil 4 · A, B, C oder 0)
> level: C1 · type: single · id: de-c1-review-q34
> - [ ] A
> - [ ] B
> - [x] C
> - [ ] 0 — niemand
>
> **Пояснення:** Jonas Feld: *Erst müssen Busse und Bahnen ausgebaut werden, dann …* — *erst … dann* описує передумову. Dr. Hoff говорить про наслідки закриття вулиць, а не про громадський транспорт. Тема C1-21.

> [!quiz] Wer fordert, Autos ganz aus der Innenstadt zu verbannen? (Teil 4 · A, B, C oder 0)
> level: C1 · type: single · id: de-c1-review-q35
> - [ ] A
> - [ ] B
> - [ ] C
> - [x] 0 — niemand
>
> **Пояснення:** ніхто цього не вимагає: Hoff описує дослідження, Brenner захищає парковки, Feld хоче лише *zurückdrängen* («витіснити, обмежити») — і тільки після розбудови транспорту. У Teil 4 два твердження не належать нікому, тому варіант 0 перевіряй завжди. Тема C1-21.

## Диктант і аудіювання

> [!listen] Що ти почув?
> level: C1 · type: choice · id: de-c1-review-l01
> audio: Sollten Sie verhindert sein, sagen Sie bitte ab.
> - [x] Sollten Sie verhindert sein, sagen Sie bitte ab.
> - [ ] Wenn Sie verhindert sind, sagen Sie bitte ab.
> - [ ] Sollten Sie verhindert sein, sagen wir bitte ab.
>
> **Пояснення:** речення починається з *Sollten* — умова без *wenn*; у головній частині *sagen Sie … ab*: просять відмовитися саме Вас, а не фірму (*sagen wir*). Слухай, хто є підметом після дієслова. Тема C1-06.

> [!listen] Що ти почув?
> level: C1 · type: choice · id: de-c1-review-l02
> audio: Sie sagte, sie habe nicht kommen können.
> - [x] Sie sagte, sie habe nicht kommen können.
> - [ ] Sie sagte, sie hätte nicht kommen können.
> - [ ] Sie sagte, sie hat nicht kommen können.
>
> **Пояснення:** *habe* [ˈhaːbə] — Konjunktiv I із довгим [aː]; *hätte* має коротке [ɛ], *hat* — один склад. Konjunktiv I показує, що це чужі слова, без оцінки мовця. Тема C1-05.

> [!listen] Що ти почув?
> level: C1 · type: choice · id: de-c1-review-l03
> audio: Bitte senden Sie uns die beizufügenden Formulare bis Freitag.
> - [x] Bitte senden Sie uns die beizufügenden Formulare bis Freitag.
> - [ ] Bitte senden Sie uns die beigefügten Formulare bis Freitag.
> - [ ] Bitte senden Sie uns die beifügenden Formulare bis Freitag.
>
> **Пояснення:** *bei-zu-fügenden* — Gerundiv («які треба додати»): *zu* звучить усередині слова. *Beigefügten* — Partizip II («вже додані»), *beifügenden* — Partizip I без *zu* («ті, що додають»), що до бланків не пасує. Тема C1-01.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-review-l04
> audio: Aufgrund des starken Regens fand das Konzert in der Halle statt.
> explain: aufgrund (допустимо й auf Grund) + Genitiv: des starken Regens (із -s). stattfinden — відокремлюване: fand … statt, statt — у кінці речення. Тема C1-09.

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-review-l05
> audio: Der Vorschlag fand breite Zustimmung, wobei einige Kollegen Bedenken äußerten.
> explain: Zustimmung finden — пасивне значення без werden; wobei («причому») приєднує застереження, дієслово в кінці: äußerten (з ä і ß). Bedenken äußern — колокація. Теми C1-03, C1-08, C1-17.

## Формат Goethe-Zertifikat C1: Hören

Модуль *Hören* триває близько 40 хвилин: чотири частини, 30 завдань. **Teil 1** — подкаст-рецензія на три нові книжки (6 завдань: до якої книжки належить твердження), звучить один раз. **Teil 2** — радіоінтервʼю з фахівцем (9 тверджень: *stimmt · stimmt nicht · dazu wird nichts gesagt*), звучить двічі. **Teil 3** — розмова кількох людей у чотирьох фрагментах (8 завдань a / b / c), кожен фрагмент звучить один раз. **Teil 4** — доповідь (*Vortrag*, 7 завдань a / b / c), звучить двічі. Нижче — короткі навчальні фрагменти в тому самому порядку. Читай варіанти до прослуховування.

> [!listen] Goethe C1, Hören Teil 1 (звучить один раз): подкаст про нові книжки. Яку книжку критикують за надмірну довжину?
> level: C1 · type: answer · id: de-c1-review-l06
> audio: Heute drei Neuerscheinungen. Lea Brandts Roman erzählt eine Familiengeschichte, leider recht langatmig. Tom Webers Sachbuch erklärt die Energiewende verständlich. Und Mia Kraus? Ihr Krimi bleibt spannend bis zur letzten Seite.
> - [x] a) den Roman von Lea Brandt
> - [ ] b) das Sachbuch von Tom Weber
> - [ ] c) den Krimi von Mia Kraus
>
> **Пояснення:** *leider recht langatmig* — «на жаль, доволі затягнутий» стосується роману Lea Brandt. Сигнал оцінки — *leider*. У Teil 1 стеж, до якої з трьох книжок належить кожна оцінка: імена звучать лише раз. Тема C1-12.

> [!listen] Goethe C1, Hören Teil 2 (звучить двічі): інтервʼю з Dr. Albers. Твердження: «Laut Frau Albers lesen junge Menschen heute deutlich weniger.»
> level: C1 · type: answer · id: de-c1-review-l07
> audio: A: Frau Dr. Albers, lesen junge Menschen heute weniger?
> audio: B: Nicht unbedingt weniger, aber anders: kürzere Texte, meist am Bildschirm. Konzentriertes Lesen langer Texte muss man allerdings gezielt üben.
> - [ ] a) stimmt
> - [x] b) stimmt nicht
> - [ ] c) dazu wird nichts gesagt
>
> **Пояснення:** *Nicht unbedingt weniger, aber anders* — Frau Albers прямо заперечує, що читають менше: отже, *stimmt nicht*. «Dazu wird nichts gesagt» обирають лише тоді, коли тема не звучала зовсім. Тема C1-12.

> [!listen] Goethe C1, Hören Teil 2 (звучить двічі): продовження інтервʼю. Твердження: «Frau Albers kritisiert, dass Schulen zu wenig Geld für Bibliotheken haben.»
> level: C1 · type: answer · id: de-c1-review-l08
> audio: A: Und was können Schulen tun?
> audio: B: Feste Lesezeiten ohne Handy helfen sehr. Außerdem sollten Lehrkräfte selbst vorlesen, auch noch in der Oberstufe.
> - [ ] a) stimmt
> - [ ] b) stimmt nicht
> - [x] c) dazu wird nichts gesagt
>
> **Пояснення:** Frau Albers радить фіксований час для читання й читання вголос, а про гроші й бібліотеки не каже нічого — ні «так», ні «ні». Це і є *dazu wird nichts gesagt*. Тема C1-12.

> [!listen] Goethe C1, Hören Teil 3 (звучить один раз): розмова про чотириденний тиждень. Чого побоюється Frau Yilmaz?
> level: C1 · type: answer · id: de-c1-review-l09
> audio: A: Thema heute: die Vier-Tage-Woche. Bei mir sind Frau Yilmaz aus der Personalabteilung und Herr Roth vom Betriebsrat. Frau Yilmaz, Sie sind skeptisch?
> audio: B: Eher vorsichtig. Wenn freitags alle fehlen, wer betreut dann unsere Kunden?
> - [x] a) dass die Kunden freitags niemanden erreichen
> - [ ] b) dass die Gehälter sinken
> - [ ] c) dass der Betriebsrat nicht zustimmt
>
> **Пояснення:** ведучий на початку називає обох гостей; першою відповідає Frau Yilmaz: *wer betreut dann unsere Kunden?* — вона боїться, що клієнтів не буде кому обслуговувати. Про зарплату й згоду *Betriebsrat* не йдеться. Тема C1-12.

> [!listen] Goethe C1, Hören Teil 3 (звучить один раз): продовження розмови. Що наприкінці каже Frau Yilmaz?
> level: C1 · type: answer · id: de-c1-review-l10
> audio: A: Herr Roth?
> audio: C: Das lässt sich lösen, wenn sich die Teams abwechseln. Mir geht es um etwas anderes: Viele Kollegen sind schlicht erschöpft.
> audio: A: Frau Yilmaz, Ihre Antwort?
> audio: B: Zugegeben, aber dann reden wir über Arbeitsbelastung, nicht über Wochentage.
> - [x] a) Das eigentliche Problem sei die Arbeitsbelastung, nicht die Zahl der Arbeitstage.
> - [ ] b) Die Teams sollten sich abwechseln.
> - [ ] c) Die Kollegen seien gar nicht erschöpft.
>
> **Пояснення:** *Zugegeben, aber …* — поступка: Frau Yilmaz визнає, що люди втомлені, але переносить розмову на навантаження. Варіант b — пропозиція Herr Roth, варіант c суперечить її *zugegeben*. У Teil 3 стеж за кожним голосом окремо. Тема C1-12.

> [!listen] Goethe C1, Hören Teil 4 (1/2, звучить двічі): доповідь. Як пояснюють прокрастинацію новіші дослідження, за доповіддю?
> level: C1 · type: answer · id: de-c1-review-l11
> audio: Mein Thema heute ist das Aufschieben, die Prokrastination. Lange galt sie als Zeichen von Faulheit. Die neuere Forschung sieht darin eher ein Problem der Umgang mit Gefühlen: Wir schieben auf, was unangenehme Gefühle auslöst.
> - [ ] a) als Zeichen von Faulheit
> - [x] b) als Versuch, unangenehmen Gefühlen auszuweichen
> - [ ] c) als Folge von Zeitmangel
>
> **Пояснення:** *Lange galt sie als …* — стара думка, яку мовець далі відкидає; нова — після *Die neuere Forschung sieht darin eher …*: ми відкладаємо те, що викликає неприємні почуття. Про брак часу не сказано. Тема C1-12.

> [!listen] Goethe C1, Hören Teil 4 (2/2, звучить двічі): доповідь. Яку позицію займає автор доповіді?
> level: C1 · type: answer · id: de-c1-review-l12
> audio: Manche halten dagegen, das Problem werde überschätzt. Dem lässt sich entgegnen, dass es viele Menschen belastet. Wer die Ursache kennt, kann gezielter etwas dagegen tun, etwa indem er große Aufgaben in kleine Schritte zerlegt.
> - [ ] a) Sie stimmt den Kritikern zu.
> - [x] b) Sie hält die Kritik für unbegründet und nennt eine Strategie.
> - [ ] c) Sie meint, gegen Prokrastination könne man nichts tun.
>
> **Пояснення:** заперечення подано в Konjunktiv I (*werde überschätzt*), а позицію автора доповіді — після *Dem lässt sich entgegnen, dass …*: проблема справді обтяжує багатьох. Далі вона пропонує стратегію: ділити великі завдання на малі кроки. Тема C1-12.

## Мінімальні пари

На C1 плутають уже не окремі звуки, а схожі довгі слова, що різняться кінцем слова, суфіксом чи одним звуком. Слухай, чим закінчується слово.

> [!pair] Hypothese /hypoˈteːzə/ — Hypothek /hypoˈteːk/
> level: C1 · id: de-c1-review-p01
> say: Hypothek
> tip: обидва слова мають наголос на -te-, але Hypothese закінчується на [zə] («гіпотеза»), а Hypothek — на [k] («іпотека»). У доповіді про дослідження помилка звучить кумедно.

> [!pair] kindlich /ˈkɪntlɪç/ — kindisch /ˈkɪndɪʃ/
> level: C1 · id: de-c1-review-p02
> say: kindisch
> tip: kindlich — «дитячий» (нейтрально, *kindliche Neugier*), d перед l оглушується в [t], у кінці [ç]. Kindisch — «інфантильний» (несхвально), d дзвінке, у кінці [ʃ]. Різниця і в звуці, і в оцінці.

> [!pair] Erörterung /ɛɐ̯ˈʔœʁtəʁʊŋ/ — Erläuterung /ɛɐ̯ˈlɔʏ̯təʁʊŋ/
> level: C1 · id: de-c1-review-p03
> say: Erläuterung
> tip: Erörterung («есе-міркування») — після er- твердий приступ [ʔ] і огублене [œ]. Erläuterung («пояснення») — дифтонг [ɔʏ̯]. В обох наголос на другому складі.

> [!pair] entgegnen /ɛntˈɡeːɡnən/ — entgegen /ɛntˈɡeːɡn̩/
> level: C1 · id: de-c1-review-p04
> say: entgegnen
> tip: entgegnen («заперечити у відповідь») закінчується на [-ɡnən]: після [ɡ] одразу [n], потім ще склад -nen. Entgegen (прийменник «всупереч», з Dativ) — на [-ɡn̩] зі складотворчим [n̩]. Наголос в обох — на -ge-.

## Говоріння

> [!speak] Скажи вголос
> level: C1 · id: de-c1-review-s01
> text: Sollten Sie Fragen haben, stehe ich Ihnen gern zur Verfügung.
> ipa: /ˈzɔltn̩ ziː ˈfʁaːɡn̩ ˈhaːbn̩ ˈʃteːə ɪç ˈiːnən ɡɛʁn tsuːɐ̯ fɛɐ̯ˈfyːɡʊŋ/
> tip: Sollten — дзвінке [z] на початку, коротке [ɔ]; stehe — st = [ʃt]; Verfügung — наголос на -fü-, довге [yː]. Після першої частини — коротка пауза, мелодія мʼяка, як у листі.
> uk: Якщо у Вас виникнуть питання, я охоче на них відповім.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-review-s02
> text: Angesichts der hohen Kosten wurde das Projekt auf Eis gelegt.
> ipa: /ˈanɡəzɪçts deːɐ̯ ˈhoːən ˈkɔstn̩ ˈvʊʁdə das pʁoˈjɛkt aʊ̯f aɪ̯s ɡəˈleːkt/
> tip: angesichts — наголос на an-, у кінці [çts]; hohen — h у середині слова не вимовляється; Projekt — наголос на -jekt; gelegt — кінцеве g = [k].
> uk: Через високі витрати проєкт поставили на паузу.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-review-s03
> text: Ich habe das nicht gesagt, sondern geschrieben.
> ipa: /ɪç ˈhaːbə das nɪçt ɡəˈzaːkt ˈzɔndɐn ɡəˈʃʁiːbn̩/
> tip: контрастивний наголос: найсильніше звучать -SAGT і -SCHRIE-, решта — тихіше. Не наголошуй ich чи das — тоді зміниться зміст. gesagt — кінцеве g = [k].
> uk: Я цього не казав, а написав.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-review-s04
> text: Komm ruhig rein, das wird schon klappen.
> ipa: /kɔm ˈʁuːɪç ʁaɪ̯n das vɪʁt ʃoːn ˈklapn̩/
> tip: частки ruhig і schon — ненаголошені, наголос на REIN і KLAPpen. ruhig — у кінці [ç]; schon — довге [oː]. Тон теплий, заспокійливий.
> uk: Заходь, не соромся, усе вийде.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-review-s05
> text: Ich gebe zu bedenken, dass die Frist sehr knapp ist.
> ipa: /ɪç ˈɡeːbə tsuː bəˈdɛŋkn̩ das diː fʁɪst zeːɐ̯ knap ɪst/
> tip: bedenken — наголос на -den-, nk = [ŋk]; knapp — k перед n вимовляємо: [kn]. Говори спокійно, без натиску: це аргумент, а не докір.
> uk: Хочу звернути увагу, що строк дуже стислий.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-review-s06
> text: Halten wir fest: Der Vorschlag hat breite Zustimmung gefunden.
> ipa: /ˈhaltn̩ viːɐ̯ fɛst deːɐ̯ ˈfoːɐ̯ʃlaːk hat ˈbʁaɪ̯tə ˈtsuːʃtɪmʊŋ ɡəˈfʊndn̩/
> tip: після fest — пауза (двокрапка). Vorschlag і Zustimmung — наголос на першому складі; Vorschlag — кінцеве g = [k]; Zustimmung — z = [ts], st = [ʃt].
> uk: Підсумуймо: пропозиція отримала широку підтримку.

## Типові помилки, які ще трапляються

> [!pitfall] Гіперкорекція: Genitiv там, де потрібен Dativ
> ~~gemäß des Vertrags~~, ~~entsprechend des Antrags~~ → *gemäß **dem** Vertrag*, *entsprechend **dem** Antrag*. Не всі «офіційні» прийменники керують Genitiv: *gemäß, entsprechend, entgegen, zuliebe* — Dativ. А в розмові навпаки: *wegen dem Regen* звучить нормально, але в листі пиши *wegen des Regens*. Тема C1-09.

> [!pitfall] Кальки в колокаціях і FVG
> ~~ein Risiko nehmen~~ (у писемній мові), ~~Schlüsse machen~~, ~~Das Gesetz kommt in Kraft~~ → *ein Risiko **eingehen***, *Schlüsse **ziehen***, *Das Gesetz **tritt** in Kraft*. Українське «робити / брати» і англійське *take* підказують неправильне дієслово. Вчи іменник разом із його дієсловом і перевіряй у DWDS-Wortprofil. Теми C1-03 і C1-17.

> [!pitfall] Порядок слів: *es* і Ausklammerung
> ~~Gestern es kamen viele Gäste~~, ~~Ich habe gestern gekauft einen neuen Laptop~~ → *Gestern **kamen** viele Gäste*; *Ich habe gestern einen neuen Laptop **gekauft***. Перед змінюваним дієсловом — лише один член речення, а *es* зникає, якщо Vorfeld уже зайнятий. За праву дужку виносять порівняння й підрядні речення, а додаток в Akkusativ — ні. Тема C1-07.

> [!pitfall] Розмовний регістр в офіційному тексті
> *Das ist halt so*, *Die Kohle reicht nicht*, *Das ist echt cringe* — у розмові з друзями це нормально, але в есе, листі до установи чи на іспиті звучить недбало. Замість цього: *Daran lässt sich leider nichts ändern*, *Die Mittel reichen nicht aus*, *Das wirkt unangemessen*. Регістр — частина оцінки на Goethe C1. Теми C1-04 і C1-18.

## Чекліст «я вмію»

Познач, що вже виходить. Пункти, у яких сумніваєшся, повтори у відповідних темах.

**Писемний стиль (C1-01, 02, 03, 09)**
- [ ] Я розбираю довгі дієприкметникові означення справа наліво й утворюю Gerundiv (*die einzureichenden Unterlagen*).
- [ ] Я перетворюю Verbalstil на Nominalstil і назад (*Bei Nichteinhaltung der Frist ⇄ Wenn Sie die Frist nicht einhalten*) і вирішую, де який стиль доречний.
- [ ] Я вживаю Funktionsverbgefüge з пасивним значенням (*fand Zustimmung, kam zur Sprache*) і правильно їх заперечую.
- [ ] Я знаю, які прийменники писемної мови керують Genitiv, а які — Dativ (*aufgrund des …*, але *gemäß dem …*).

**Граматика висловлення (C1-04, 05, 06, 07, 08)**
- [ ] Я розумію й доречно вживаю частки *eben, halt, wohl, schon, ruhig, bloß* і не вживаю їх в офіційному тексті.
- [ ] Я передаю чужі слова за правилом заміни (Konjunktiv I → II → *würde*) і вибираю точне дієслово-ввід (*zurückweisen, einräumen, entgegnen*).
- [ ] Я будую умову без *wenn* (*Sollten Sie …, Hätte ich …, angenommen, …*) і стискаю її в іменник (*bei Regen*).
- [ ] Я свідомо заповнюю Vorfeld, вживаю *es* як заповнювач, виношу за дужку лише те, що можна, і будую текст «відоме → нове».
- [ ] Я звʼязую абзац відсиланнями й конекторами (*Letzterer, wobei, wodurch, darüber hinaus*) і не вживаю *daran* замість *an sie*.

**Вимова й аудіювання (C1-10, 11, 12)**
- [ ] Я ставлю контрастивний наголос (*Ich habe das nicht geSAGT*) і чую іронію та подив.
- [ ] Я розумію швидку розмову зі злитими формами й австрійський та швейцарський стандарт (*heuer, Topfen, Billett*).
- [ ] Я розкладаю лекцію чи дебати на тезу, аргумент, заперечення й висновок і відрізняю позицію мовця від переказу.

**Лексика (C1-13, 14, 15, 16, 17, 24)**
- [ ] Я розумію ідіоми з чотирьох образних полів і знаю їхній регістр (*einen Bären aufbinden, blaumachen*).
- [ ] Я вживаю мову науки: *Hypothese, These, Befund, Stichprobe*; *belegen* замість *beweisen* для емпіричних даних.
- [ ] Я модерую нараду, даю фідбек і висловлюю незгоду дипломатично (*Ich gebe zu bedenken …*).
- [ ] Я розрізняю конотації синонімів (*sparsam / geizig*) і вибираю колокації писемної мови (*Schlüsse ziehen, ein Risiko eingehen*).
- [ ] Я розбираю довгі складні слова й розумію значення префіксів *be-, ent-, er-* і суфіксів *-ismus, -ität*.

**Регістр і навички (C1-18–22)**
- [ ] Я перемикаюся між Amtsdeutsch, писемною, розмовною й молодіжною мовою й знаю правила *du / Sie* у DACH.
- [ ] Я пишу Erörterung і Stellungnahme, описую графік без плутанини *Prozent / Prozentpunkt*.
- [ ] Я пишу Anschreiben, діловий лист за DIN 5008, Mahnung і скаргу з *Nachfrist*.
- [ ] Я читаю коментар і глосу, бачу іронію, поступку й хибні аргументи.
- [ ] Я виголошую доповідь ≈ 5 хвилин, відповідаю на питання, веду дискусію й переказую чужий текст.

**Суспільні дебати (C1-23)**
- [ ] Я викладаю позиції в дебатах про міграцію, цифровізацію, клімат і памʼять збалансовано, з джерелом і точними термінами (*Duldung ≠ Aufenthaltserlaubnis, Desinformation ≠ Fehlinformation*).

Якщо ти позначив(ла) більшість пунктів і правильно відповів(ла) приблизно на 75–80 % завдань вище, переходь до рівня C2 або готуйся до іспиту C1 у розділі «Іспити».

## Фішки

> [!reel] 🎓 Goethe-Zertifikat C1: чотири модулі
> *Lesen* — 65 хвилин, 4 частини, 30 завдань, без словника. *Hören* — близько 40 хвилин, 4 частини, 30 завдань; Teil 2 і Teil 4 звучать двічі, Teil 1 і Teil 3 — один раз. *Schreiben* — 75 хвилин: допис на форумі (≈ 230 слів) і e-mail (≈ 120 слів). *Sprechen* — 20 хвилин підготовки, потім доповідь ≈ 5 хвилин із питаннями й дискусія в парі. Модулі можна складати окремо.

> [!reel] 🧭 Три питання до кожного тексту C1
> Перед тим як писати чи говорити, спитай себе: *Хто говорить?* (моя позиція, чужі слова в Konjunktiv I, припущення), *Для кого?* (колега, установа, наукова аудиторія — отже, який регістр) і *Що вже відомо, а що нове?* (відоме — у Vorfeld і займенниках, нове — ближче до кінця). Ці три питання закривають більшість помилок рівня C1.

> [!reel] ✍️ Марк Твен і «жахлива німецька мова»
> 1880 року Марк Твен додав до книжки подорожніх нотаток *A Tramp Abroad* есей *The Awful German Language*. Він жартував про рід (*das Mädchen*, але *die Rübe*), про дієслово, яке чекає в кінці речення, і про безкінечні складні слова. А 1897 року у Відні Твен сам виступив німецькою з промовою *Die Schrecken der deutschen Sprache*. На C1 ти розумієш, з чого він сміявся, і вже знаєш, як цим користуватися.

## Джерела та що почитати

- [Goethe-Institut — Modellsatz Goethe-Zertifikat C1 (PDF)](https://www.goethe.de/pro/relaunch/prf/materialien/C1_modular/c1-modular_modellsatz.pdf) — офіційний зразок усіх модулів: частини, кількість завдань, час.
- [Goethe-Institut — Goethe-Zertifikat C1, Modellsatz online](https://bfu.goethe.de/c1mod/) — інтерактивний зразок *Lesen* і *Hören*.
- [Goethe-Institut — Durchführungsbestimmungen C1 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_C1.pdf) — тривалість, склад і правила іспиту.
- [DWDS — gemäß](https://www.dwds.de/wb/gem%C3%A4%C3%9F) — керування відмінком і приклади.
- [DWDS — Prozentpunkt](https://www.dwds.de/wb/Prozentpunkt) — значення терміна.
- [DWDS — Feuilleton](https://www.dwds.de/wb/Feuilleton) — значення слова в німецькій пресі.
- [Wikipedia — The Awful German Language](https://en.wikipedia.org/wiki/The_Awful_German_Language) — есей Марка Твена (1880).
- [DW Learn German](https://learngerman.dw.com/de/overview) — безкоштовні курси й матеріали Deutsche Welle.

> [!important] Підсумок
> - Писемний стиль C1: довгі означення й Gerundiv (*die einzureichenden Unterlagen*), Nominalstil (*Bei Nichteinhaltung der Frist*), FVG з пасивним значенням (*fand Zustimmung*), прийменники з Genitiv — але *gemäß / entsprechend* з Dativ.
> - Висловлення: частки — тон, а не слово; непряма мова за правилом заміни K I → K II → *würde*; умова без *wenn* (*Sollten Sie …*); Vorfeld — один член, *es* як заповнювач, за дужку — порівняння й підрядні речення.
> - Звʼязність: *Letzterer, wobei, wodurch*, займенникові прислівники — лише для речей; контрастивний наголос змінює зміст речення.
> - Лексика: ідіоми з регістром, мова науки (*Hypothese ≠ These*), дипломатична незгода, конотації (*sparsam / geizig*), колокації (*Schlüsse ziehen, ein Risiko eingehen*), розбір складних слів справа наліво.
> - Goethe C1: *Lesen* 65 хв, 4 частини, 30 завдань; *Hören* ≈ 40 хв, 4 частини, 30 завдань (Teil 2 і 4 — двічі; 1 і 3 — один раз); у Teil 4 читання й Teil 2 слухання не забувай про варіанти «0» і *dazu wird nichts gesagt*.
