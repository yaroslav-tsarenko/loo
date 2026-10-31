---
title: Підсумок B1 — тест рівня
id: de-b1-review
level: B1
icon: px:crown
tags: [deutsch, b1, review, test]
prerequisites: ["[[Deutsch - B1 - 29. Говоріння — спланувати разом, презентація, думка]]"]
estimatedMinutes: 90
---

# Підсумок B1 — тест рівня

> [!success] Після цієї теми ти зможеш
> - перевірити себе з усієї граматики B1: *Präteritum, Plusquamperfekt і часові речення, Genitiv, дієслова з прийменниками, відносні речення, Infinitiv mit zu, um … zu / damit, Konjunktiv II і нереальні умови, Passiv, порядок слів у середині речення, парні сполучники, прикметник як іменник, словотвір, модальні частки*;
> - розрізняти на слух минуле, Genitiv, ввічливу форму Konjunktiv II та Passiv і записати речення під диктовку;
> - попрацювати в форматі Goethe-Zertifikat B1: короткий текст для читання (Richtig / Falsch і вибір a / b / c) і завдання на аудіювання;
> - почути мінімальні пари (*konnte / könnte*, *wurde / würde*) і вимовити типові фрази рівня B1 вголос;
> - позначити в чеклісті «я вмію», що вже працює, а що ще варто повторити.

Це тема без нового матеріалу. Нових слів тут немає: усе, що трапляється, ти вже вивчив(ла) у темах B1-01…29 і на попередніх рівнях. Якщо щось не виходить, повернися до теми, на яку вказує підказка в поясненні.

> [!diagram] Карта речення B1: де стоїть дієслово
> ```yaml
> layout: flow
> nodes:
>   - { id: s, label: "1-ше місце", text: "Ich", tone: mint }
>   - { id: v, label: "2-ге місце · дієслово", text: "lerne", tone: orange }
>   - { id: r, label: "решта", text: "heute Deutsch.", tone: gray }
>   - { id: e, label: "кінець речення", text: "—", tone: gray }
> steps:
>   - { focus: [s, v, r], note: "Головне речення (A1-09): змінюване дієслово — на 2-му місці. Ich lerne heute Deutsch." }
>   - { set: { v: "habe", r: "gestern Deutsch", e: "gelernt" }, focus: [v, e], note: "Perfekt (A2-01): допоміжне друге, Partizip II — у кінці. У Plusquamperfekt (B1-02) допоміжне стоїть у Präteritum: Ich hatte gelernt." }
>   - { set: { v: "wird", r: "hier Deutsch", e: "gelernt" }, focus: [v, e], note: "Passiv (B1-17): werden друге, Partizip II — у кінці. Hier wird Deutsch gelernt." }
>   - { set: { s: "…, weil ich", v: "—", r: "Deutsch", e: "lerne" }, focus: [e], note: "Підрядні речення з weil, dass, wenn, als, nachdem, bevor, відносні речення (B1-08): змінюване дієслово — наприкінці. …, weil ich Deutsch lerne." }
>   - { set: { s: "…, um", v: "—", r: "in Deutschland", e: "zu arbeiten" }, focus: [e], note: "Інфінітивна група (B1-10, B1-11): zu + інфінітив — у кінці, перед нею кома. …, um in Deutschland zu arbeiten." }
> ```
> Правило таке: **змінюване дієслово — на 2-му місці в головному реченні й у кінці в підрядному**. Усе «друге» (Partizip, інфінітив, префікс, *zu* + інфінітив) стоїть наприкінці.

> [!diagram] Який час і який спосіб обрати
> ```yaml
> layout: compare
> columns: { a: "Реально й з минулого", b: "Нереально й ввічливо" }
> nodes:
>   - { id: a1, col: a, label: "Розповідь у тексті", text: "Er ging nach Hause.", note: "Präteritum (B1-01)", tone: yellow }
>   - { id: a2, col: a, label: "Раніше за іншу подію", text: "Nachdem er gegessen hatte, ging er.", note: "Plusquamperfekt (B1-02)", tone: yellow }
>   - { id: a3, col: a, label: "Дію не названо", text: "Hier wird nicht geraucht.", note: "Passiv (B1-17)", tone: yellow }
>   - { id: b1, col: b, label: "Ввічливе прохання", text: "Könnten Sie mir helfen?", note: "Konjunktiv II (B1-14)", tone: pink }
>   - { id: b2, col: b, label: "Нереальна умова", text: "Wenn ich Zeit hätte, würde ich kommen.", note: "wenn + Konjunktiv II (B1-15)", tone: pink }
> steps:
>   - { focus: [a1, a2, a3], note: "Ліва колонка — звичайні факти й події: розповідь, послідовність подій, процес чи правило." }
>   - { focus: [b1, b2], note: "Права колонка — те, чого немає насправді, або ввічливість. Форма дієслова змінюється: hätte, wäre, könnte, würde + інфінітив." }
> ```
> Кольори розрізняють лише колонки; назву теми видно з підпису в кожному блоці.

## Блок 1. Минуле: Präteritum, Plusquamperfekt і часові речення

> [!quiz] Вчора ми пішки пішли додому. Яка форма правильна? «Gestern ___ wir zu Fuß nach Hause.»
> level: B1 · type: single · id: de-b1-review-q01
> - [ ] gehten
> - [x] gingen
> - [ ] gegangen
> - [ ] gangen
>
> **Пояснення:** *gehen* — сильне дієслово, Präteritum — *ging, gingen*. *Gehten* — слабке закінчення, якого в нього немає; *gegangen* — Partizip II (для Perfekt: *sind gegangen*). Тема B1-01.

> [!quiz] Заповни пропуски формами Präteritum
> level: B1 · type: fill · id: de-b1-review-q02
>
> ```text fill
> Es [[war]] einmal ein König. (sein)
> Eines Tages [[verschwand]] seine Tochter, (verschwinden)
> und er [[schickte]] Boten in alle Länder. (schicken)
> ```
>
> **Пояснення:** *war* — Präteritum від *sein*, *verschwand* — сильне дієслово (*verschwinden – verschwand – ist verschwunden*), *schickte* — слабке: корінь + *-te*. Тема B1-01.

> [!quiz] «Коли я вчора прийшов додому, світла не було.» Яке слово пропущено? «___ ich gestern nach Hause kam, war der Strom weg.»
> level: B1 · type: single · id: de-b1-review-q03
> - [ ] Wenn
> - [x] Als
> - [ ] Wann
>
> **Пояснення:** подія одна й у минулому (*gestern*), тому *als*. *Wenn* означало б «щоразу» або стосувалося б теперішнього й майбутнього, а *wann* — лише питальне слово. Тема B1-02.

> [!quiz] «Після того як він поїв, він пішов спати.» Обери правильну частину речення. «Nachdem er ___, ging er schlafen.»
> level: B1 · type: single · id: de-b1-review-q04
> - [x] gegessen hatte
> - [ ] hatte gegessen
> - [ ] gegessen war
>
> **Пояснення:** головне речення в Präteritum (*ging*), тож у *nachdem*-реченні потрібен Plusquamperfekt: *hatte* + Partizip II, причому в підрядному реченні змінюване дієслово стоїть у кінці: *gegessen hatte*. *Essen* вимагає *haben*, не *sein*. Тема B1-02.

## Блок 2. Genitiv і дієслова з прийменниками

> [!quiz] «Попри холод вони пішли гуляти.» «Trotz ___ Kälte gingen sie spazieren.»
> level: B1 · type: single · id: de-b1-review-q05
> - [ ] die
> - [x] der
> - [ ] dem
> - [ ] den
>
> **Пояснення:** *trotz* + Genitiv; *die Kälte* — жіночий рід, Genitiv — **der Kälte**. *Dem* і *den* — Dativ і Akkusativ. Тема B1-03.

> [!quiz] Заповни пропуски: Genitiv
> level: B1 · type: fill · id: de-b1-review-q06
>
> ```text fill
> Das ist das Auto [[meines]] Vaters. (мій; чоловічий рід)
> Die Wohnung [[meiner]] Eltern ist groß. (мої; множина)
> [[Annas]] Buch liegt auf dem Tisch. (Anna)
> ```
>
> **Пояснення:** чоловічий рід — *meines Vaters* (з закінченням *-s* на іменнику), множина — *meiner Eltern*; ім’я в Genitiv — *Annas* без апострофа. Тема B1-03.

> [!quiz] «Він боїться собак.» Er hat Angst ___ Hunden.
> level: B1 · type: single · id: de-b1-review-q07
> - [ ] für
> - [x] vor
> - [ ] von
> - [ ] an
>
> **Пояснення:** сталий зворот **Angst haben vor + Dativ**. Український родовий відмінок («боїться собак») тут не допомагає: прийменник треба знати. Тема B1-06.

> [!quiz] «На що ти чекаєш? — На автобус.» «___ wartest du? — Auf den Bus.»
> level: B1 · type: single · id: de-b1-review-q08
> - [x] Worauf
> - [ ] Wofür
> - [ ] Woran
> - [ ] Womit
>
> **Пояснення:** *warten auf* — тож питання про річ або подію: **wo(r)** + *auf* = *worauf*. Для людини було б *Auf wen wartest du?* Тема B1-06.

> [!quiz] Заповни пропуски: прийменники й da-слово
> level: B1 · type: fill · id: de-b1-review-q09
>
> ```text fill
> Sie interessiert sich [[für]] Geschichte. (Akkusativ)
> Wir nehmen [[an]] einem Kurs teil. (Dativ)
> Ich freue mich [[darauf]], dich bald zu sehen. (радість наперед)
> ```
>
> **Пояснення:** *sich interessieren für + Akk*, *teilnehmen an + Dat*; перед *zu*-інфінітивом ставимо *da(r)* + прийменник: *darauf*. Теми B1-06 і B1-10.

## Блок 3. Відносні речення, Infinitiv mit zu, um … zu / damit

> [!quiz] «Це чоловік, якому я вчора допоміг.» «Das ist der Mann, ___ ich gestern geholfen habe.»
> level: B1 · type: single · id: de-b1-review-q10
> - [ ] der
> - [ ] den
> - [x] dem
> - [ ] dessen
>
> **Пояснення:** відмінок відносного займенника береться з підрядного речення. *Helfen* вимагає Dativ, а *der Mann* — чоловічий рід, тож **dem**. *Der* — підмет, *den* — прямий додаток, *dessen* — «чий». Тема B1-08.

> [!quiz] Заповни пропуски: відносні займенники
> level: B1 · type: fill · id: de-b1-review-q11
>
> ```text fill
> Der Kollege, [[mit dem]] ich arbeite, kommt aus Polen. (mit + займенник)
> Die Frau, [[deren]] Sohn hier lernt, ist nett. (чий)
> Die Stadt, [[in der|wo]] ich wohne, ist klein. (місце)
> Alles, [[was]] ich habe, gebe ich dir. (після alles)
> ```
>
> **Пояснення:** прийменник стоїть перед займенником і керує його відмінком (*mit dem* — Dativ); «чий» для жіночого роду — *deren*; для міста — *in der* або *wo*; після *alles* — *was*. Тема B1-08.

> [!quiz] «Я забув тобі зателефонувати.» «Ich habe vergessen, dich ___.»
> level: B1 · type: single · id: de-b1-review-q12
> - [ ] zu anrufen
> - [ ] an zu rufen
> - [x] anzurufen
> - [ ] anzurufen zu
>
> **Пояснення:** у відокремлюваних дієсловах *zu* стоїть **між префіксом і коренем** і пишеться разом: *an·zu·rufen*. Тема B1-10.

> [!quiz] «Я заощаджую гроші, щоб мої діти могли вчитися.» «Ich spare Geld, ___ meine Kinder studieren können.»
> level: B1 · type: single · id: de-b1-review-q13
> - [ ] um
> - [x] damit
> - [ ] dass
> - [ ] ohne
>
> **Пояснення:** підмети різні (*ich* і *meine Kinder*), тому потрібне підрядне речення з **damit**; *um … zu* вимагає того самого підмета. *Dass* не виражає мету (хіба що в розмовному *so dass*). Тема B1-11.

> [!quiz] Склади речення: «Він пішов, не попрощавшись»
> level: B1 · type: order · id: de-b1-review-q14
>
> ```text order
> Er
> ging,
> ohne
> sich
> zu
> verabschieden.
> dass ✗
> ```
>
> **Пояснення:** при одному підметі — *ohne … zu*: зворотний займенник *sich* стоїть перед *zu*, інфінітив — у кінці. *Ohne dass* потребувало б підрядного речення з власним підметом. Тема B1-11.

## Блок 4. Konjunktiv II, нереальні умови, Passiv

> [!quiz] Як ввічливо попросити незнайому людину про допомогу?
> level: B1 · type: single · id: de-b1-review-q15
> - [x] Könnten Sie mir bitte helfen?
> - [ ] Könntest du mir bitte helfen?
> - [ ] Hilf mir bitte!
> - [ ] Konntet ihr mir bitte helfen?
>
> **Пояснення:** до незнайомої людини — *Sie* і м’який Konjunktiv II: **Könnten Sie …?** *Könntest du* — це «ти» (до друга), *Hilf mir!* — наказ, *konntet ihr* — Präteritum для кількох друзів. Тема B1-14.

> [!quiz] «Якби я мав більше часу, я б більше читав.» «Wenn ich mehr Zeit ___, würde ich mehr lesen.»
> level: B1 · type: single · id: de-b1-review-q16
> - [ ] habe
> - [x] hätte
> - [ ] hatte
> - [ ] wäre
>
> **Пояснення:** нереальна умова — Konjunktiv II від *haben*: **hätte**. *Habe* — реальна умова, *hatte* — Präteritum (пасувало б до «коли в мене був час»), *wäre* — від *sein*. Тема B1-15.

> [!quiz] Склади речення: «Якби ми мали час, я б прийшов»
> level: B1 · type: order · id: de-b1-review-q17
>
> ```text order
> Wenn
> wir
> Zeit
> hätten,
> würde
> ich
> kommen.
> hatten ✗
> ```
>
> **Пояснення:** підрядне речення з *wenn* займає перше місце, у ньому *hätten* — у кінці. У головному дієслово йде першим: *würde ich kommen*. Тема B1-15.

> [!quiz] «Тут не палять.» «Hier ___ nicht geraucht.»
> level: B1 · type: single · id: de-b1-review-q18
> - [x] wird
> - [ ] ist
> - [ ] wurde
> - [ ] hat
>
> **Пояснення:** правило, що діє зараз, — Passiv Präsens: **werden** + Partizip II, для однини *wird*. *Wurde* — минулий час, а *ist … geraucht* і *hat … geraucht* — не пасив. Тема B1-17.

> [!quiz] Заповни пропуски: Passiv
> level: B1 · type: fill · id: de-b1-review-q19
>
> ```text fill
> Das Haus [[wurde]] vor zehn Jahren gebaut. (минуле)
> Die Kinder [[werden]] von der Lehrerin abgeholt. (теперішнє)
> ```
>
> **Пояснення:** *wurde* + Partizip II — Passiv Präteritum; *werden* + Partizip II — Passiv Präsens, множина. Виконавця вводимо через *von* + Dativ (*von der Lehrerin*). Тема B1-17.

## Блок 5. Порядок слів і парні сполучники

> [!quiz] Склади речення: «Завтра я їду потягом до Берліна»
> level: B1 · type: order · id: de-b1-review-q20
>
> ```text order
> Ich
> fahre
> morgen
> mit
> dem
> Zug
> nach
> Berlin.
> für ✗
> ```
>
> **Пояснення:** порядок обставин **TeKaMoLo**: *morgen* (коли), *mit dem Zug* (як), *nach Berlin* (куди). Тема B1-19.

> [!quiz] Які речення правильні? Обери всі.
> level: B1 · type: multi · id: de-b1-review-q21
> - [x] Ich habe ihn gestern nicht gesehen.
> - [x] Heute gehe ich nicht ins Büro.
> - [ ] Ich nicht habe ihn gesehen.
> - [ ] Heute ich gehe nicht ins Büro.
>
> **Пояснення:** змінюване дієслово — на 2-му місці, *nicht* стоїть у середині речення перед Partizip II або перед напрямком. У двох останніх реченнях дієслово не на другому місці. Тема B1-19.

> [!quiz] Склади речення: «Замість того щоб працювати, він спить»
> level: B1 · type: order · id: de-b1-review-q22
>
> ```text order
> Statt
> zu
> arbeiten,
> schläft
> er.
> dass ✗
> ```
>
> **Пояснення:** при одному підметі — *statt … zu* + інфінітив; після коми дієслово *schläft* стоїть перед підметом. Тема B1-11.

> [!quiz] Заповни пропуски: парні сполучники
> level: B1 · type: fill · id: de-b1-review-q23
>
> ```text fill
> Sie spricht [[sowohl]] Deutsch als auch Englisch. (і … і)
> Er ist nicht nur klug, [[sondern]] auch fleißig. (не лише … а й)
> Die Wohnung ist [[zwar]] klein, aber günstig. (хоч … але)
> Ich habe [[weder]] Zeit [[noch]] Lust. (ні … ні)
> ```
>
> **Пояснення:** *sowohl … als auch*, *nicht nur … sondern auch*, *zwar … aber*, *weder … noch* (вже містить заперечення). Тема B1-20.

> [!quiz] Склади речення: «Чим більше Анна вправляється, тим краще вона говорить»
> level: B1 · type: order · id: de-b1-review-q24
>
> ```text order
> Je
> mehr
> Anna
> übt,
> desto
> besser
> spricht
> sie.
> gut ✗
> ```
>
> **Пояснення:** *je* + Komparativ відкриває підрядне речення з дієсловом у кінці; після *desto* + Komparativ у головному реченні дієслово стоїть на другому місці: *desto besser spricht sie*. Тема B1-20.

## Блок 6. Слова: прикметник як іменник, словотвір, звороти, частки

> [!quiz] Заповни пропуски: прикметник як іменник
> level: B1 · type: fill · id: de-b1-review-q25
>
> ```text fill
> Gibt es etwas [[Neues]]? (що-небудь нове)
> [[Alles]] Gute zum Geburtstag! (усього найкращого)
> Das [[lachende]] Kind ist glücklich. (Partizip I від lachen)
> Ein [[Bekannter]] von mir wohnt hier. (знайомий)
> ```
>
> **Пояснення:** після *etwas* — **-es** і велика літера (*etwas Neues*); *alles Gute* — готове побажання; *ein Bekannter* — Nominativ чоловічого роду з неозначеним артиклем: **-er**. Тема B1-22.

> [!quiz] Який артикль у слова «Krankenversicherung» (Kranke + Versicherung)?
> level: B1 · type: single · id: de-b1-review-q26
> - [ ] der
> - [x] die
> - [ ] das
>
> **Пояснення:** рід складного слова дає **останній компонент**; *Versicherung* закінчується на *-ung*, а ці слова — *die* без винятків. Тема B1-23.

> [!quiz] Як ввічливо висловити незгоду?
> level: B1 · type: single · id: de-b1-review-q27
> - [x] Das sehe ich anders.
> - [ ] Da stimme ich dir zu.
> - [ ] Das sehe ich auch so.
> - [ ] Wie meinst du das?
>
> **Пояснення:** **Das sehe ich anders** — м’яка незгода. *Da stimme ich dir zu* і *Das sehe ich auch so* — згода, *Wie meinst du das?* — перепитування. Тема B1-24.

> [!quiz] Яка частка робить запрошення дружнім? «Komm ___ mal vorbei!»
> level: B1 · type: single · id: de-b1-review-q28
> - [x] doch
> - [ ] denn
> - [ ] ja
>
> **Пояснення:** **doch** у наказі — заохочення («зазирни до нас!»). *Denn* вживається в питаннях, *ja* — у твердженнях для здивування чи нагадування про відоме. Тема B1-25.

## Формат Goethe-Zertifikat B1: Lesen (Teil 1) і Hören

Модуль *Lesen* на Goethe B1 має п’ять частин і 30 завдань; у Teil 1 — особистий текст і шість тверджень *Richtig / Falsch*. Модуль *Hören* має чотири частини й 30 завдань; тексти в Teil 1 і Teil 4 звучать двічі, у Teil 2 і Teil 3 — один раз. Нижче — короткий текст у форматі Teil 1 і далі завдання на аудіювання в розділі «Диктант і аудіювання».

> [!example] Lenas Blog
> Seit März wohne ich in Leipzig. Die Stadt gefällt mir sehr, aber die Wohnungssuche war schwierig. Zuerst wohnte ich in einer WG, doch dort war es abends zu laut. Deshalb habe ich im Mai eine kleine Wohnung gefunden. Die Miete ist zwar höher, aber ich kann endlich in Ruhe lernen. Morgen besucht mich meine Mutter, und wir gehen zusammen ins Museum.

> [!quiz] Richtig oder falsch? «Lena wohnt seit Mai in Leipzig.»
> level: B1 · type: single · id: de-b1-review-q29
> - [ ] Richtig
> - [x] Falsch
>
> **Пояснення:** у тексті: *Seit März wohne ich in Leipzig.* Травень — це місяць, коли вона знайшла власну квартиру. У форматі Teil 1 перевіряй у тексті точну деталь: *März* ≠ *Mai*.

> [!quiz] Warum ist Lena aus der WG ausgezogen? (у стилі Teil 2 / 5 · a, b, c)
> level: B1 · type: single · id: de-b1-review-q30
> - [ ] a) Die WG war zu teuer.
> - [x] b) Es war abends zu laut.
> - [ ] c) Sie hatte Streit mit den Mitbewohnern.
>
> **Пояснення:** *Zuerst wohnte ich in einer WG, doch dort war es abends zu laut.* Про ціну WG і про сварку в тексті нічого немає, а вища орендна плата стосується нової квартири.

## Диктант і аудіювання

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-review-l01
> audio: Der Prinz ritt durch den Wald.
> - [ ] Der Prinz reitet durch den Wald.
> - [x] Der Prinz ritt durch den Wald.
> - [ ] Der Prinz ist durch den Wald geritten.
>
> **Пояснення:** *ritt* — Präteritum від *reiten* (сильне дієслово). Тема B1-01.

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-review-l02
> audio: Nachdem er gegessen hatte, ging er schlafen.
> - [ ] Nachdem er gegessen hat, geht er schlafen.
> - [ ] Bevor er gegessen hatte, ging er schlafen.
> - [x] Nachdem er gegessen hatte, ging er schlafen.
>
> **Пояснення:** *nachdem* («після того як») і *hatte gegessen* — Plusquamperfekt; *bevor* означало б «перш ніж». Тема B1-02.

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-review-l03
> audio: Wegen des Regens bleiben wir zu Hause.
> - [x] Wegen des Regens bleiben wir zu Hause.
> - [ ] Trotz des Regens bleiben wir zu Hause.
> - [ ] Während des Regens bleiben wir zu Hause.
>
> **Пояснення:** *wegen* — «через», *trotz* — «попри», *während* — «під час»; усі три з Genitiv, але значення різні. Слухай початок слова: *we-gen*, *trotz*, *wäh-rend*. Тема B1-03.

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-review-l04
> audio: Könnten Sie mir bitte helfen?
> - [ ] Können Sie mir bitte helfen?
> - [x] Könnten Sie mir bitte helfen?
> - [ ] Konnten Sie mir bitte helfen?
>
> **Пояснення:** *könnten* має [œ] і закінчення *-ten* (Konjunktiv II, ввічливо); *konnten* — [ɔ], Präteritum («чи могли Ви» у минулому). Тема B1-14.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-review-l05
> audio: Wenn ich mehr Zeit hätte, würde ich öfter reisen.
> explain: підрядне речення з wenn і hätte в кінці, у головному дієслово würde — перше після коми. Тема B1-15.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-review-l06
> audio: Das Fenster wurde gestern repariert.
> explain: Passiv Präteritum: wurde + Partizip II у кінці. Виконавця не названо. Тема B1-17.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-review-l07
> audio: Ich habe vergessen, dich anzurufen.
> explain: у відокремлюваному дієслові zu стоїть між префіксом і коренем: an·zu·rufen; перед інфінітивною групою кома. Тема B1-10.

> [!listen] Goethe B1, Hören Teil 1: голосове повідомлення. Вислухай двічі. О котрій годині починається зустріч?
> level: B1 · type: answer · id: de-b1-review-l08
> audio: Hallo Tom, hier ist Lisa. Ich wollte dir sagen, dass das Treffen morgen nicht um zehn, sondern erst um elf Uhr beginnt, weil der Chef noch einen Termin hat. Bring bitte deinen Laptop mit. Bis morgen!
> - [ ] a) о десятій
> - [x] b) об одинадцятій
> - [ ] c) о дванадцятій
>
> **Пояснення:** *nicht um zehn, sondern erst um elf Uhr* — зустріч починається об одинадцятій. Слово *sondern* виправляє назване раніше. У форматі Teil 1 такий текст звучить двічі.

> [!listen] Hören у стилі Goethe B1: розмова двох людей (a, b, c). Що радить A?
> level: B1 · type: answer · id: de-b1-review-l09
> audio: A: Hast du schon eine Wohnung gefunden?
> audio: B: Nein, leider nicht. Die Mieten sind so hoch, dass ich weder in der Stadt noch am Stadtrand etwas Bezahlbares finde. Je länger ich suche, desto frustrierter werde ich.
> audio: A: Vielleicht solltest du es mit einer WG versuchen.
> audio: B: Das habe ich auch schon überlegt.
> - [ ] Шукати квартиру далі від міста.
> - [x] Спробувати знайти кімнату в WG.
> - [ ] Попросити грошей у батьків.
>
> **Пояснення:** *Vielleicht solltest du es mit einer WG versuchen* — порада спробувати WG (*sollte* — Konjunktiv II). У модулі Hören розмови між двома людьми звучать один раз.

> [!listen] Hören у стилі Goethe B1: оголошення на вокзалі (a, b, c). Що радять мандрівникам?
> level: B1 · type: answer · id: de-b1-review-l10
> audio: Achtung, liebe Reisende. Im Hauptbahnhof wird ab Montag gebaut. Deshalb werden einige Züge von Gleis 3 auf Gleis 7 verlegt. Bitte planen Sie mindestens zehn Minuten mehr Zeit ein.
> - [ ] Купувати квитки лише онлайн.
> - [ ] Їхати в обхід через інший вокзал.
> - [x] Закласти щонайменше десять додаткових хвилин.
>
> **Пояснення:** *planen Sie mindestens zehn Minuten mehr Zeit ein* — на дорогу треба більше часу. *Wird gebaut* і *werden … verlegt* — Passiv Präsens (тема B1-17). Такі оголошення на іспиті звучать один раз.

## Мінімальні пари

Konjunktiv II часто відрізняється від Präteritum лише голосним, тож тренуй це на слух.

> [!pair] konnte /ˈkɔntə/ — könnte /ˈkœntə/
> level: B1 · id: de-b1-review-p01
> say: könnte
> tip: konnte — [ɔ], Präteritum («міг»). könnte — [œ], губи округлені, Konjunktiv II («міг би»). Різниця в голосному — саме вона робить прохання ввічливим.

> [!pair] wurde /ˈvʊʁdə/ — würde /ˈvʏʁdə/
> level: B1 · id: de-b1-review-p02
> say: würde
> tip: wurde — [ʊ], Präteritum від werden і Passiv («став», «було зроблено»). würde — [ʏ], Konjunktiv II («став би»). У würde губи для «у», язик як для «і».

> [!pair] hatte /ˈhatə/ — hätte /ˈhɛtə/
> level: B1 · id: de-b1-review-p03
> say: hätte
> tip: hatte — коротке [a], «мав». hätte — відкрите коротке [ɛ], «мав би»: «Ich hätte gern …». [h] — легкий видих.

> [!pair] vereisen /fɛɐ̯ˈʔaɪ̯zn̩/ — verreisen /fɛɐ̯ˈʁaɪ̯zn̩/
> level: B1 · id: de-b1-review-p04
> say: verreisen
> tip: у vereisen («вкритися кригою») після ver- є короткий твердий приступ перед ei-. У verreisen («поїхати у подорож») немає паузи, а r — горлове [ʁ].

## Говоріння

> [!speak] Скажи вголос
> level: B1 · id: de-b1-review-s01
> text: Wenn ich mehr Zeit hätte, würde ich öfter ins Kino gehen.
> ipa: /vɛn ɪç meːɐ̯ tsaɪ̯t ˈhɛtə ˈvʏʁdə ɪç ˈœftɐ ɪns ˈkiːno ˈɡeːən/
> tip: hätte — [ɛ], würde — [ʏ]. Після коми голос піднімається, наприкінці падає. öfter — [œ] коротке, ft.
> uk: Якби я мав більше часу, я б частіше ходив у кіно.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-review-s02
> text: Das Haus wurde vor zehn Jahren gebaut und wird jetzt renoviert.
> ipa: /das haʊ̯s ˈvʊʁdə foːɐ̯ tseːn ˈjaːʁən ɡəˈbaʊ̯t ʊnt vɪʁt jɛtst ʁenoˈviːɐ̯t/
> tip: wurde — [ʊ]. Jahren — j = «й». renoviert — наголос на -viert, без ge-. jetzt — tst наприкінці чітко.
> uk: Будинок збудували десять років тому, і зараз його ремонтують.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-review-s03
> text: Ich bin der Meinung, dass wir einen Kompromiss finden sollten.
> ipa: /ɪç bɪn deːɐ̯ ˈmaɪ̯nʊŋ das viːɐ̯ ˈaɪ̯nən kɔmpʁoˈmɪs ˈfɪndn̩ ˈzɔltn̩/
> tip: Meinung — ei = [aɪ̯], ng = [ŋ]. Kompromiss — наголос на останньому складі. Після коми перед dass — невелика пауза.
> uk: Я вважаю, що нам слід знайти компроміс.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-review-s04
> text: Er fuhr nach Hause, ohne sich zu verabschieden.
> ipa: /eːɐ̯ fuːɐ̯ naːx ˈhaʊ̯zə ˈoːnə zɪç tsu fɛɐ̯ˈʔapʃiːdn̩/
> tip: fuhr — довге [uː], r ослаблене. verabschieden — після ver- легкий твердий приступ, наголос на -ab-, sch = [ʃ].
> uk: Він поїхав додому, не попрощавшись.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-review-s05
> text: Könnten Sie mir bitte sagen, wo das Bürgeramt ist?
> ipa: /ˈkœntn̩ ziː miːɐ̯ ˈbɪtə ˈzaːɡn̩ voː das ˈbʏʁɡɐˌʔamt ɪst/
> tip: Könnten — [œ]. Bürgeramt — ü коротке, Bürger-amt із твердим приступом перед a. Голос наприкінці йде вгору ↗ (ввічливе питання).
> uk: Чи не могли б Ви сказати, де Bürgeramt?

> [!speak] Скажи вголос
> level: B1 · id: de-b1-review-s06
> text: Komm doch mal vorbei, wenn du Zeit hast!
> ipa: /kɔm dɔx maːl foːɐ̯ˈbaɪ̯ vɛn duː tsaɪ̯t hast/
> tip: doch і mal — слабко наголошені; наголос на vorbei. [h] у hast — видих, не «г».
> uk: Зазирни до мене, коли матимеш час!

## Типові помилки, які ще трапляються

> [!pitfall] Слабке закінчення сильним дієсловам і помилковий час
> ~~ich gehte~~, ~~er kommte~~, ~~Nachdem ich gegessen habe, ging ich~~ → *ich ging, er kam*; *Nachdem ich gegessen hatte, ging ich*. Більшість найчастіших дієслів сильні (*ging, kam, sah, fand*), а в Plusquamperfekt допоміжне стоїть у Präteritum. Теми B1-01 і B1-02.

> [!pitfall] Прийменник «за українським»
> ~~Ich warte für den Bus~~, ~~Ich habe Angst für Hunde~~, ~~Ich denke über dich~~ (коли пам’ятаєш) → *Ich warte **auf** den Bus*, *Angst **vor** Hunden*, *Ich denke **an** dich*. Для речей запитай *worauf? wovor?*, для людей — *auf wen? vor wem?* Тема B1-06.

> [!pitfall] Дієслово не там: після підрядного, у zu-групі й у нереальній умові
> ~~Wenn ich Zeit hätte, ich würde kommen~~, ~~Nachdem er angekommen war, er rief an~~, ~~Ich habe vergessen zu anrufen~~ → *Wenn ich Zeit hätte, **würde** ich kommen*; *Nachdem er angekommen war, **rief** er an*; *…, dich **anzurufen***. Якщо підрядне речення на першому місці, головне починається з дієслова. Теми B1-10, B1-15.

> [!pitfall] Genitiv без -s і «um … zu» при різних підметах
> ~~das Auto des Vater~~, ~~Anna's Buch~~, ~~Ich spare, um meine Kinder studieren können~~ → *das Auto des Vater**s***, *Annas Buch*, *…, **damit** meine Kinder studieren können*. Чоловічий і середній рід у Genitiv мають закінчення **-s / -es** на іменнику; *um … zu* — лише коли підмет той самий. Теми B1-03, B1-11.

## Чекліст «я вмію»

Познач, що вже виходить. Незнайомі пункти повтори у відповідних темах.

**Минуле (B1-01, 02)**
- [ ] Я утворюю Präteritum слабких, сильних і змішаних дієслів (*machte, ging, dachte*) і ставлю відокремлюваний префікс: *Sie stand früh auf.*
- [ ] Я розповідаю про події в послідовності з Plusquamperfekt (*hatte / war* + Partizip II).
- [ ] Я розрізняю *als* і *wenn* та будую речення з *nachdem, bevor, während, seit(dem), bis, sobald, solange*.

**Відмінки, прийменники, займенники (B1-03, 06, 08)**
- [ ] Я утворюю Genitiv (*des Mannes, der Frau*) і вживаю *wegen, trotz, während, statt*.
- [ ] Я знаю щонайменше 50 дієслів із прийменниками й питаю *worauf? / auf wen?*.
- [ ] Я будую відносні речення з *der / den / dem / dessen* і прийменником (*mit dem*), з *wo* і *was*.

**Інфінітив, мета, спосіб (B1-10, 11)**
- [ ] Я вживаю *zu* + інфінітив (*anzurufen*) і знаю, де *zu* не потрібне.
- [ ] Я вибираю між *um … zu*, *damit*, *ohne … zu*, *statt … zu*.

**Konjunktiv II і Passiv (B1-14, 15, 17)**
- [ ] Я ввічливо прошу й раджу: *Könnten Sie …? Ich hätte gern … Du solltest …*
- [ ] Я кажу про нереальне: *Wenn ich Zeit hätte, würde ich …; Ich wünschte, …*
- [ ] Я розумію й утворюю Passiv Präsens і Präteritum (*wird gebaut, wurde gebaut*), називаю виконавця через *von*.

**Порядок слів і зв’язки (B1-19, 20)**
- [ ] Я ставлю обставини за схемою TeKaMoLo й правильно розміщую *nicht*.
- [ ] Я вживаю *sowohl … als auch, weder … noch, entweder … oder, nicht nur … sondern auch, zwar … aber, je … desto*.

**Слова, словотвір, ситуації (B1-04, 07, 12, 16, 18, 22–26)**
- [ ] Я кажу *der Deutsche, ein Bekannter, etwas Neues, alles Gute*.
- [ ] Я визначаю рід складного слова за останньою частиною й розумію суфікси *-ung, -heit, -keit, -schaft*.
- [ ] Я висловлюю думку, згоду й незгоду і розумію частки *doch, mal, ja, denn*.
- [ ] Я розповідаю про стосунки, медіа, довкілля, роботу й житло та розумію лист від установи.

**Вимова (B1-05, 13)**
- [ ] Я ставлю твердий приступ перед голосним (*am |Abend*) і не вставляю голосних у групах приголосних.
- [ ] Я впізнаю розмовні форми (*hab', 'ne, haste, gibt's*) на слух.

**Аудіювання, читання, письмо, говоріння (B1-09, 21, 27, 28, 29)**
- [ ] Я розумію новини, інтерв’ю та розмови на слух (gist і деталі).
- [ ] Я читаю тексти в п’яти форматах Lesen і вмію знаходити потрібну деталь.
- [ ] Я пишу електронну пошту й допис на форумі (≈ 80 слів) і коротку офіційну пошту (≈ 40 слів).
- [ ] Я планую щось разом, роблю коротку презентацію й відповідаю на запитання.

Якщо ти позначив(ла) більшість пунктів і набрав(ла) ≈ 80 % у тесті вище, ти готовий(а) до наступного кроку: рівня B2.

## Фішки

> [!reel] 🎓 Goethe-Zertifikat B1: чотири модулі
> Іспит складається з модулів *Lesen* (65 хв, 5 частин, 30 завдань), *Hören* (4 частини, 30 завдань), *Schreiben* (60 хв, 3 завдання) і *Sprechen* (≈ 15 хв у парі з іншим кандидатом). Тексти в *Hören* Teil 1 і Teil 4 звучать двічі, в Teil 2 і Teil 3 — один раз. Тому читай завдання, поки звучить пауза перед текстом.

> [!reel] 🧩 Три питання до кожного речення
> Перш ніж написати речення, спитай: *Який час?* (розповідь — Präteritum, розмова — Perfekt), *Де змінюване дієслово?* (2-ге місце або кінець) і *Який відмінок після прийменника чи дієслова?* Ці три питання знімають більшість помилок рівня B1.

> [!reel] ⏳ Дієслово наприкінці: жарт Марка Твена
> Американський письменник Марк Твен 1880 року у відомому есе *The Awful German Language* жартував, що німецьке дієслово доводиться чекати до самого кінця речення. Для тебе це вже не жарт, а правило: у підрядному реченні, в Plusquamperfekt і в групі з *zu* головне слово стоїть наприкінці.

## Джерела та що почитати

- [Goethe-Institut — Modellsatz B1, Hören](https://bfu.goethe.de/b1_mod/hoeren.php) — офіційний зразок чотирьох частин модуля Hören.
- [Goethe-Institut — Durchführungsbestimmungen B1 (PDF)](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_B1.pdf) — тривалість, склад і правила іспиту.
- [DWDS — Satzklammer](https://www.dwds.de/wb/Satzklammer) — термін «дужка речення».
- [Wikipedia — The Awful German Language](https://en.wikipedia.org/wiki/The_Awful_German_Language) — есе Марка Твена (1880).
- [DW Learn German — Nicos Weg (B1)](https://learngerman.dw.com/de/niveau-b1/s-12304) — безкоштовний відеокурс Deutsche Welle.

> [!important] Підсумок
> - Розповідь у минулому — Präteritum (*ging, machte, dachte*); раніше за іншу подію — Plusquamperfekt; *als* — одна подія, *wenn* — повторення чи теперішнє.
> - Genitiv: *des Mannes, der Frau*; прийменникові дієслова вчимо парою з відмінком; про речі — *worauf / darauf*, про людей — *auf wen / auf ihn*.
> - Відносні речення: відмінок з підрядного; *zu* — між префіксом і коренем; *um … zu* при одному підметі, *damit* при різних.
> - Konjunktiv II для ввічливості й нереальних умов (*hätte, wäre, könnte, würde*); Passiv — *werden* + Partizip II.
> - Змінюване дієслово — друге в головному й останнє в підрядному реченні; обставини — TeKaMoLo.
