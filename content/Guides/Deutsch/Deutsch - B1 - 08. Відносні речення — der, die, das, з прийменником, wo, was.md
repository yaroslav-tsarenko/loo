---
title: Відносні речення — der, die, das, з прийменником, wo, was
id: de-b1-relativsaetze
level: B1
icon: px:letterTile
tags: [deutsch, b1, grammar, relativsaetze, relativpronomen]
prerequisites: ["[[Deutsch - B1 - 07. Медіа, інтернет і технології]]"]
estimatedMinutes: 40
---

# Відносні речення — der, die, das, з прийменником, wo, was

> [!success] Після цієї теми ти зможеш
> - зʼєднати два речення в одне: *Das ist der Mann, der neben mir wohnt.*;
> - вибрати форму *der / den / dem / dessen* за родом, числом і **роллю в підрядному реченні**;
> - додати прийменник: *der Kollege, mit dem ich arbeite; die Stadt, in der ich wohne*;
> - вжити *wo* про місце та *was* після *alles, nichts, das Beste*;
> - правильно поставити коми й дієслово в кінці.

## Передбач

> [!quiz] Яке слово пропущено? «Das ist der Mann, ___ neben mir wohnt.»
> level: B1 · type: single · id: de-b1-relativsaetze-q01
> - [x] der
> - [ ] den
> - [ ] dem
> - [ ] dessen
>
> **Пояснення:** в підрядному реченні *der Mann* — підмет (хто мешкає?), тому Nominativ: **der**. Те, що в головному реченні «Das ist …» — не впливає на форму займенника.

## Що таке відносне речення

Відносне речення пояснює іменник: «чоловік, **який** живе поруч». Українське «який, що, котрий» німецькою передають слова *der, die, das* — ті самі, що й означені артиклі, але з іншою роллю. Відносне речення — **підрядне**: дієслово в кінці, спереду й ззаду — **коми**. Воно стоїть зазвичай одразу після іменника, до якого відноситься.

> [!diagram] Як зʼєднати два речення
> ```yaml
> layout: flow
> nodes:
>   - { id: s1, label: "речення 1", text: "Das ist der Mann.", tone: gray }
>   - { id: s2, label: "речення 2 · хто?", text: "Der Mann", tone: mint }
>   - { id: v2, label: "дієслово", text: "wohnt", tone: orange }
>   - { id: r2, label: "решта", text: "neben mir.", tone: gray }
> steps:
>   - { focus: [s1], note: "Спершу два прості речення, що мають спільного «героя»: der Mann." }
>   - { focus: [s2, v2, r2], note: "У другому реченні der Mann — підмет (Nominativ), тому в підрядному залишиться der." }
>   - { set: { s1: "Das ist der Mann,", s2: "der", v2: "wohnt", r2: "neben mir." }, focus: [s2], note: "Іменник замінює відносний займенник: der Mann → der. Спереду — кома." }
>   - { set: { s2: "der", r2: "neben mir wohnt." }, focus: [v2], note: "Дієслово йде в кінець підрядного речення: ..., der neben mir wohnt." }
> ```
> Рід і число займенника беруться з **іменника, до якого він відноситься**. Відмінок — із **ролі займенника в підрядному реченні**.

## Відносні займенники

| | Maskulinum | Femininum | Neutrum | Plural |
|---|---|---|---|---|
| Nominativ | der | die | das | die |
| Akkusativ | den | die | das | die |
| Dativ | dem | der | dem | **denen** |
| Genitiv | **dessen** | **deren** | **dessen** | **deren** |

Форми збігаються з артиклями, окрім **Dativ Plural — denen** і всього **Genitiv**.

> [!diagram] Відносні займенники за відмінком
> ```yaml
> layout: compare
> columns: { m: "m. · der", f: "f. · die", n: "n. · das", pl: "pl. · die" }
> nodes:
>   - { id: m1, col: m, label: "Nominativ", text: "der", note: "der Mann, der wohnt", tone: blue }
>   - { id: m2, col: m, label: "Akkusativ", text: "den", note: "der Mann, den ich kenne", tone: blue }
>   - { id: m3, col: m, label: "Dativ", text: "dem", note: "der Mann, dem ich helfe", tone: blue }
>   - { id: m4, col: m, label: "Genitiv", text: "dessen", note: "der Mann, dessen Auto", tone: blue }
>   - { id: f1, col: f, label: "Nominativ", text: "die", note: "die Frau, die wohnt", tone: red }
>   - { id: f2, col: f, label: "Akkusativ", text: "die", note: "die Frau, die ich kenne", tone: red }
>   - { id: f3, col: f, label: "Dativ", text: "der", note: "die Frau, der ich helfe", tone: red }
>   - { id: f4, col: f, label: "Genitiv", text: "deren", note: "die Frau, deren Auto", tone: red }
>   - { id: n1, col: n, label: "Nominativ", text: "das", note: "das Kind, das wohnt", tone: green }
>   - { id: n2, col: n, label: "Akkusativ", text: "das", note: "das Kind, das ich kenne", tone: green }
>   - { id: n3, col: n, label: "Dativ", text: "dem", note: "das Kind, dem ich helfe", tone: green }
>   - { id: n4, col: n, label: "Genitiv", text: "dessen", note: "das Kind, dessen Auto", tone: green }
>   - { id: p1, col: pl, label: "Nominativ", text: "die", note: "die Leute, die wohnen", tone: violet }
>   - { id: p2, col: pl, label: "Akkusativ", text: "die", note: "die Leute, die ich kenne", tone: violet }
>   - { id: p3, col: pl, label: "Dativ", text: "denen", note: "die Leute, denen ich helfe", tone: violet }
>   - { id: p4, col: pl, label: "Genitiv", text: "deren", note: "die Leute, deren Auto", tone: violet }
> steps:
>   - { focus: [m1, f1, n1, p1], note: "Nominativ і Akkusativ збігаються з артиклем: der / den, die / die, das / das, die / die." }
>   - { focus: [m3, f3, n3, p3], note: "Dativ: dem, der, dem, а в множині — denen (не den): die Leute, denen ich helfe." }
>   - { focus: [m4, f4, n4, p4], note: "Genitiv: dessen (m. і n.), deren (f. і pl.). Після нього іменник — БЕЗ артикля: dessen Auto, deren Kinder." }
> ```

## Відмінок береться з підрядного речення

Це головне правило теми. Перш ніж обирати форму, спитай себе: **яка роль цього слова в підрядному реченні?**

| Роль в підрядному | Відмінок | Приклад |
|---|---|---|
| підмет (хто?) | Nominativ | Der Mann, **der** dort wartet, ist mein Chef. |
| прямий додаток (кого? що?) | Akkusativ | Der Film, **den** wir gesehen haben, war lang. |
| непрямий додаток (кому?) | Dativ | Die Frau, **der** ich geholfen habe, ist Ärztin. |
| «чий» (чия?) | Genitiv | Die Frau, **deren** Sohn hier lernt, ist nett. |

Дієслово керує відмінком так само, як у простому реченні: *helfen + Dativ* → *dem / der / denen*; *kennen + Akkusativ* → *den / die / das*.

## Прийменник + відносний займенник

Прийменник стоїть **перед** займенником і керує його відмінком:

- *mit* → Dativ: Der Kollege, **mit dem** ich arbeite, kommt aus Polen.
- *für* → Akkusativ: Das ist die Frau, **für die** ich das Geschenk kaufe.
- *in* → Dativ (де?) або Akkusativ (куди?): Die Stadt, **in der** ich wohne, … / Die Stadt, **in die** wir ziehen, …
- мн.: Freunde, **mit denen** ich reise.

Прийменник завжди стоїть **перед** займенником, а не в кінці речення: ~~Der Mann, den ich mit arbeite~~ (як це буває в англійській).

## Dessen і deren: «чий»

*Dessen* (m., n.) і *deren* (f., pl.) = «чий, чия, чиї». Вони вже містять артикль, тому далі **немає артикля**: *der Mann, **dessen** Auto*, а не ~~dessen das Auto~~. Іменник після нього відмінюється за своєю роллю: *Die Frau, **deren** Kindern ich helfe* (Dativ мн. — Kindern).

## Wo і was

**Wo** замінює «in der / in dem / in die» для місця, особливо для назв міст, країн і слів *Ort, Stadt, Haus*: *Wien, **wo** ich studiert habe, …; der Ort, **wo** wir uns trafen, …*. З іншими іменниками й для руху — зазвичай прийменник + займенник: *die Stadt, **in der** ich wohne*; *die Stadt, **in die** wir ziehen*.

**Was** — не рід, а «все, що». Зазвичай стоїть після:

- *alles, nichts, etwas, vieles, einiges*: *Alles, **was** ich habe, …*
- іменника в вищому ступені: *Das ist das Beste, **was** ich kenne.* (*das* теж трапляється, якщо мають на увазі конкретний предмет, але *was* — найнадійніший вибір)
- *das* як «те (самe)»: *Das ist das, **was** ich meine.*
- усієї ситуації: *Er hat gelogen, **was** mich ärgert.*

З прийменником після *was* використовують *wo(r)-*: *Das ist alles, **worüber** wir gesprochen haben. / Nichts, **worauf** ich warte.*

## Приклади

- Das ist der Mann, der neben mir wohnt. — Це чоловік, що живе поруч зі мною.
- Der Film, den wir gestern gesehen haben, war sehr lang. — Фільм, який ми вчора дивилися, був дуже довгий.
- Die Frau, der ich geholfen habe, ist Ärztin. — Жінка, якій я допоміг(ла), — лікарка.
- Das Kind, dessen Mutter hier arbeitet, heißt Jonas. — Дитина, мати якої тут працює, звати Йонас.
- Die Leute, denen wir helfen, kommen aus der Ukraine. — Люди, яким ми допомагаємо, приїхали з України.
- Das ist die Kollegin, mit der ich oft zusammenarbeite. — Це колега, з якою я часто працюю разом.
- Wien, wo ich studiert habe, ist wunderschön. — Відень, де я навчався, чудовий.
- Alles, was du brauchst, findest du hier. — Усе, що тобі потрібно, ти знайдеш тут.
- Das ist das Beste, was ich je gegessen habe. — Це найкраще, що я коли-небудь їв.
- Der Nachbar, dessen Hund ständig bellt, ärgert mich. — Сусід, чия собака постійно гавкає, дратує мене.

## Слова

> [!word] die Gegend
> ipa: /ˈɡeːɡn̩t/ · pos: noun · level: B1 · id: de-b1-relativsaetze-w01
> uk: місцевість, район
> forms: die Gegenden
> example: Die **Gegend**, in der wir wohnen, ist ruhig. — Місцевість, де ми живемо, тиха.
> note: g у -gend — перше [ɡ], друге звучить як [t] на кінці.

> [!word] der Eindruck
> ipa: /ˈaɪ̯ndʁʊk/ · pos: noun · level: B1 · id: de-b1-relativsaetze-w02
> uk: враження
> forms: die Eindrücke
> example: Der Film, den ich gesehen habe, hat einen guten **Eindruck** gemacht. — Фільм, який я бачив(ла), справив гарне враження.
> note: «справити враження» — einen Eindruck machen; Eindruck hinterlassen.

> [!word] der Verein
> ipa: /fɛɐ̯ˈʔaɪ̯n/ · pos: noun · level: B1 · id: de-b1-relativsaetze-w03
> uk: товариство, клуб (зареєстрований)
> forms: die Vereine
> example: Der **Verein**, in dem ich Fußball spiele, hat 200 Mitglieder. — У клубі, де я граю у футбол, 200 членів.
> note: е.V. (eingetragener Verein) у назві — зареєстроване товариство. Німці охоче беруть участь у Vereinen.

> [!word] die Gelegenheit
> ipa: /ɡəˈleːɡn̩haɪ̯t/ · pos: noun · level: B1 · id: de-b1-relativsaetze-w04
> uk: нагода, можливість
> forms: die Gelegenheiten
> example: Das ist eine **Gelegenheit**, die ich nicht verpassen möchte. — Це нагода, яку я не хочу пропустити.
> note: bei Gelegenheit — при нагоді; -heit — завжди die.

> [!word] erwähnen
> ipa: /ɛɐ̯ˈvɛːnən/ · pos: verb · level: B2 · id: de-b1-relativsaetze-w05
> uk: згадати, зазначити
> forms: er erwähnt · erwähnte · hat erwähnt
> example: Das ist das Thema, das er gestern **erwähnt** hat. — Це тема, яку він учора згадав.
> note: Partizip II без ge- (er- — невідокремлюваний префікс). ä довге: /ɛː/.

> [!word] das Ergebnis
> ipa: /ɛɐ̯ˈɡeːpnɪs/ · pos: noun · level: B1 · id: de-b1-relativsaetze-w06
> uk: результат
> forms: die Ergebnisse
> example: Das **Ergebnis**, auf das wir warten, kommt morgen. — Результат, на який ми чекаємо, буде завтра.
> note: -nis — зазвичай das; множина з -se: Ergebnisse.

> [!word] das Gerät
> ipa: /ɡəˈʁɛːt/ · pos: noun · level: B1 · id: de-b1-relativsaetze-w07
> uk: прилад, пристрій
> forms: die Geräte
> example: Das **Gerät**, das du suchst, liegt in der Küche. — Прилад, який ти шукаєш, лежить на кухні.
> note: ä довге: /ɛː/. Elektrogeräte — побутова техніка; Gerät також — «спорядження» (Sportgeräte).

> [!word] der Bewohner
> ipa: /bəˈvoːnɐ/ · pos: noun · level: B1 · id: de-b1-relativsaetze-w08
> uk: мешканець
> forms: die Bewohner
> example: Die **Bewohner**, die hier wohnen, sind sehr nett. — Мешканці, які тут живуть, дуже приємні.
> note: жінка — die Bewohnerin; w = [v].

> [!word] die Eigenschaft
> ipa: /ˈaɪ̯ɡn̩ʃaft/ · pos: noun · level: B2 · id: de-b1-relativsaetze-w09
> uk: властивість, риса
> forms: die Eigenschaften
> example: Geduld ist eine **Eigenschaft**, die ich bewundere. — Терпіння — риса, якою я захоплююсь.
> note: -schaft — завжди die. bewundern — захоплюватися (Akk).

> [!word] der Zufall
> ipa: /ˈtsuːfal/ · pos: noun · level: B1 · id: de-b1-relativsaetze-w10
> uk: випадковість
> forms: die Zufälle
> example: Ein **Zufall**, den ich nie vergesse. — Випадок, який я ніколи не забуду.
> note: zufällig — випадково; Zufälle — з умлаутом у множині.

> [!word] sich beschweren (über + Akk)
> ipa: /bəˈʃveːʁən/ · pos: verb · level: B1 · id: de-b1-relativsaetze-w11
> uk: скаржитися
> forms: er beschwert sich · beschwerte sich · hat sich beschwert
> example: Das ist der Nachbar, über den sich alle **beschweren**. — Це сусід, на якого всі скаржаться.
> note: невідокремлюване be-; Partizip II без ge-. Іменник — die Beschwerde.

> [!word] die Nachbarschaft
> ipa: /ˈnaxbaːɐ̯ʃaft/ · pos: noun · level: B1 · id: de-b1-relativsaetze-w12
> uk: сусідство; сусіди
> forms: — (без множини)
> example: Die **Nachbarschaft**, in der ich wohne, ist freundlich. — Околиця, де я живу, привітна.
> note: ch після a = [x]: «нахбаршафт»; -schaft — завжди die.

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-relativsaetze-l01
> audio: Das ist die Frau, der ich geholfen habe.
> - [ ] Das ist die Frau, die ich gesehen habe.
> - [x] Das ist die Frau, der ich geholfen habe.
> - [ ] Das ist der Mann, dem ich geholfen habe.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-relativsaetze-l02
> audio: Der Film, den wir gesehen haben, war lang.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-relativsaetze-l03
> audio: Alles, was du brauchst, ist hier.

> [!listen] Послухай і дай відповідь. Про кого говорять?
> level: B1 · type: answer · id: de-b1-relativsaetze-l04
> audio: A: Kennst du den Mann, dessen Hund immer bellt?
> audio: B: Ja, das ist Herr Weber. Er wohnt im zweiten Stock.
> - [ ] про власника кішки
> - [x] про власника собаки, що гавкає
> - [ ] про сусіда, що не вдома
>
> **Пояснення:** *dessen Hund immer bellt* — «чия собака постійно гавкає»; *dessen* = «Herr Weber».

## Вимова

У відносних реченнях займенник **der, die, das** вимовляється **слабко**: /dɛɐ̯/, /diː/, /das/ — наголошені слова це найчастіше підмет чи дієслово, а не займенник. Перед відносним реченням робимо **коротку паузу** (на письмі — кома). Інтонація: голос трохи падає на останньому слові підрядного, а потім піднімається знову, якщо головне речення триває.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-relativsaetze-s01
> text: Das ist der Mann, der neben mir wohnt.
> ipa: /das ɪst deːɐ̯ man deːɐ̯ ˈneːbn̩ miːɐ̯ voːnt/
> tip: пауза перед другим der. Neben — «не-бен» з довгим [eː].
> uk: Це чоловік, що живе поруч зі мною.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-relativsaetze-s02
> text: Die Frau, der ich geholfen habe, ist Ärztin.
> ipa: /diː fʁaʊ̯ deːɐ̯ ɪç ɡəˈhɔlfn̩ ˈhaːbə ɪst ˈɛːɐ̯tstɪn/
> tip: der тут слабке, ich — [ç]. Ärztin: довге [ɛː], потім «цтін».
> uk: Жінка, якій я допоміг(ла), — лікарка.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-relativsaetze-s03
> text: Das ist das Beste, was ich kenne.
> ipa: /das ɪst das ˈbɛstə vas ɪç ˈkɛnə/
> tip: w = [v]. Beste — наголос на першому складі.
> uk: Це найкраще, що я знаю.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-relativsaetze-s04
> text: Die Stadt, in der ich wohne, ist klein.
> ipa: /diː ʃtat ɪn deːɐ̯ ɪç ˈvoːnə ɪst klaɪ̯n/
> tip: дві коми — дві короткі паузи. Stadt: sch-подібне «шт» на початку, d наприкінці як «т».
> uk: Місто, в якому я живу, маленьке.

## Типові помилки українців

> [!pitfall] Відмінок з головного речення замість підрядного
> Українське «який» змінюється за відмінком у підрядному, так само й німецьке *der*: *Ich kenne den Mann, **der** dort wohnt* — хоч у головному реченні *den Mann* (Akkusativ), у підрядному він підмет, тож *der*. Не ~~den Mann, den dort wohnt~~.

> [!pitfall] «Die Kinder, die ich helfe»
> *Helfen* вимагає Dativ, тож у множині: *die Kinder, **denen** ich helfe*. Форма *die* — Nominativ/Akkusativ, а *deren* — Genitiv («чиї»): *die Kinder, deren Eltern …*. Не ~~die Kinder, die ich helfe~~.

> [!pitfall] Артикль після dessen і deren
> *Dessen* і *deren* самі «беруть» артикль: *der Mann, **dessen** Auto*, не ~~der Mann, dessen das Auto~~; *die Frau, **deren** Sohn*, не ~~deren der Sohn~~.

> [!pitfall] «Все, що» — це alles, was, а не alles, dass
> Українське «що» буває двох видів. Сполучник «що» (*Ich weiß, **dass** …*) — *dass*, а відносне «все, що» — **was**: *Alles, **was** ich weiß*; *nichts, **was** ich brauche*. Не ~~Alles, dass ich weiß~~. Форма *alles, das* трапляється дуже рідко — у стандартній мові ставимо *was*; а *das* — для іменника середнього роду: *das Buch, **das** …*.

## Ситуація: нові сусіди

> [!listen] Послухай діалог про нових сусідів. Хто такий пан Ковач?
> level: B1 · type: answer · id: de-b1-relativsaetze-l05
> audio: A: Weißt du, wer der Mann ist, der gestern eingezogen ist?
> audio: B: Ja, das ist Herr Kovač, der Mann, dessen Frau in der Schule arbeitet.
> audio: A: Ach so! Und die Kinder, die im Hof spielen?
> audio: B: Das sind seine Kinder. Er findet, dass die Wohnung, in der sie jetzt wohnen, zu klein ist.
> - [x] новий сусід, дружина якого працює в школі
> - [ ] учитель дітей у дворі
> - [ ] власник квартири
>
> **Пояснення:** *der Mann, dessen Frau in der Schule arbeitet* — «чоловік, чия дружина працює в школі».

> [!speak] «Це чоловік, чия дружина працює в школі.»
> level: B1 · id: de-b1-relativsaetze-s05
> text: Das ist der Mann, dessen Frau in der Schule arbeitet.
> ipa: /das ɪst deːɐ̯ man ˈdɛsn̩ fʁaʊ̯ ɪn deːɐ̯ ˈʃuːlə ˈaʁbaɪ̯tət/
> tip: dessen — «дезн». Наголос у arbeitet на першому складі.
> uk: Це чоловік, чия дружина працює в школі.

## Практика

> [!quiz] Яке слово пропущено? «Die Frau, ___ ich gestern geholfen habe, ist Ärztin.»
> level: B1 · type: single · id: de-b1-relativsaetze-q02
> - [ ] die
> - [x] der
> - [ ] den
> - [ ] deren
>
> **Пояснення:** *helfen* + Dativ, *die Frau* — жіночий рід → **der**. *Die* було б Nominativ чи Akkusativ, *deren* — Genitiv («чия»).

> [!quiz] Яке слово пропущено? «Das sind die Kollegen, ___ ich oft helfe.»
> level: B1 · type: single · id: de-b1-relativsaetze-q03
> - [ ] die
> - [x] denen
> - [ ] deren
> - [ ] dessen
>
> **Пояснення:** *helfen* + Dativ Plural → **denen**. *Deren* означало б «чиї», тоді далі був би іменник: *die Kollegen, deren Kinder …*.

> [!quiz] Яке слово пропущено? «Der Film, ___ wir gestern gesehen haben, war lang.»
> level: B1 · type: single · id: de-b1-relativsaetze-q04
> - [ ] der
> - [x] den
> - [ ] dem
> - [ ] das
>
> **Пояснення:** *sehen* + Akkusativ, *der Film* — чоловічий рід → **den**.

> [!quiz] Яке слово пропущено? «Das ist die Nachbarin, ___ Hund immer bellt.»
> level: B1 · type: single · id: de-b1-relativsaetze-q05
> - [ ] die
> - [ ] der
> - [x] deren
> - [ ] dessen
>
> **Пояснення:** «чия собака» + *die Nachbarin* (жін. рід) → **deren**. *Dessen* — лише для чоловічого й середнього роду.

> [!quiz] Яке слово пропущено? «Alles, ___ ich habe, ist für dich.»
> level: B1 · type: single · id: de-b1-relativsaetze-q06
> - [x] was
> - [ ] dass
> - [ ] wo
> - [ ] der
>
> **Пояснення:** після *alles* стоїть **was**. *Dass* — сполучник («що» як «я думаю, що»), а не відносне слово; *wo* — для місця.

> [!quiz] Обери всі правильні варіанти. «Die Stadt, ___ ich wohne, ist klein.»
> level: B1 · type: multi · id: de-b1-relativsaetze-q07
> - [x] in der
> - [x] wo
> - [ ] in die
> - [ ] in dem
>
> **Пояснення:** *wohnen* — де? → Dativ: *in der* (*die Stadt*, жін. рід). Для місця можна й **wo**. *In die* — Akkusativ (куди?), *in dem* — чоловічий/середній рід, а *Stadt* — die.

> [!quiz] Обери всі правильні речення
> level: B1 · type: multi · id: de-b1-relativsaetze-q08
> - [x] Das ist der Mann, mit dem ich arbeite.
> - [x] Die Frau, deren Sohn hier lernt, ist nett.
> - [x] Das ist das Auto, das ich kaufen möchte.
> - [ ] Das ist der Mann, mit den ich arbeite.
> - [ ] Das ist die Frau, deren das Kind hier lernt.
> - [ ] Das ist das Auto, den ich kaufen möchte.
>
> **Пояснення:** *mit* → Dativ (*dem*). Після *deren* артикля немає. *Das Auto* — середній рід, тож *das*, а не *den*.

> [!quiz] Обери всі правильно побудовані речення
> level: B1 · type: multi · id: de-b1-relativsaetze-q09
> - [x] Der Mann, der dort steht, ist mein Lehrer.
> - [x] Das Buch, das ich gelesen habe, war gut.
> - [ ] Der Mann der dort steht ist mein Lehrer.
> - [ ] Der Mann, der steht dort, ist mein Lehrer.
> - [ ] Das Buch, das ich habe gelesen, war gut.
>
> **Пояснення:** відносне речення виділяють комами з обох боків, а дієслово стоїть у кінці (в Perfekt — *gelesen habe*, допоміжне дієслово після Partizip II).

> [!quiz] Заповни відносні займенники
> level: B1 · type: fill · id: de-b1-relativsaetze-q10
>
> ```text fill
> Der Mann, [[der]] dort wartet, ist mein Chef.
> Die Frau, [[die]] ich kenne, arbeitet hier.
> Das Kind, [[dem]] ich helfe, ist krank.
> Die Leute, [[denen]] wir helfen, kommen aus der Ukraine.
> ```
>
> **Пояснення:** підмет → *der*; Akkusativ жін. → *die*; Dativ середнього роду → *dem*; Dativ множини → *denen*.

> [!quiz] Заповни прийменник і займенник
> level: B1 · type: fill · id: de-b1-relativsaetze-q11
>
> ```text fill
> Das ist der Kollege, mit [[dem]] ich arbeite.
> Das ist die Stadt, in [[der]] ich wohne.
> Das sind die Freunde, mit [[denen]] ich reise.
> ```
>
> **Пояснення:** *mit* + Dativ: *dem* (m.), *denen* (pl.); *in* + Dativ (*wohnen* — де?): *der* (f.).

> [!quiz] Заповни dessen або deren
> level: B1 · type: fill · id: de-b1-relativsaetze-q12
>
> ```text fill
> Die Frau, [[deren]] Sohn Arzt ist, wohnt hier.
> Der Mann, [[dessen]] Auto vor dem Haus steht, ist neu.
> Das Kind, [[dessen]] Mutter hier arbeitet, heißt Jonas.
> ```
>
> **Пояснення:** жіночий рід і множина → *deren*, чоловічий і середній → *dessen*; після нього артикля немає.

> [!quiz] Заповни was
> level: B1 · type: fill · id: de-b1-relativsaetze-q13
>
> ```text fill
> Alles, [[was]] du brauchst, ist hier.
> Das ist das Beste, [[was]] ich kenne.
> Ich habe nichts, [[was]] ich dir geben kann.
> ```
>
> **Пояснення:** після *alles, nichts* і вищого ступеня іменника (*das Beste*) стоїть **was**.

> [!quiz] Заповни wo або wo(r)-сполуку
> level: B1 · type: fill · id: de-b1-relativsaetze-q14
>
> ```text fill
> Wien, [[wo]] ich studiert habe, ist wunderschön.
> Das ist alles, [[worüber]] wir gesprochen haben.
> ```
>
> **Пояснення:** для міст — *wo*; після *alles* прийменник *über* зливається з *wo*: **worüber**.

> [!quiz] Склади речення: «Це чоловік, що живе поруч зі мною»
> level: B1 · type: order · id: de-b1-relativsaetze-q15
>
> ```text order
> Das
> ist
> der Mann,
> der
> neben mir
> wohnt.
> den ✗
> ```
>
> **Пояснення:** головне: *Das ist der Mann,* + відносне речення: *der neben mir wohnt* (дієслово в кінці). *Den* було б Akkusativ.

> [!quiz] Склади речення: «Жінка, якій я допоміг(ла), — лікарка»
> level: B1 · type: order · id: de-b1-relativsaetze-q16
>
> ```text order
> Die Frau,
> der
> ich
> geholfen habe,
> ist
> Ärztin.
> die ✗
> ```
>
> **Пояснення:** відносне речення вставлене в головне: коми з обох боків. *Helfen* + Dativ → *der*. *Die* — Nominativ/Akkusativ.

> [!quiz] Склади речення: «Це найкраще, що я коли-небудь їв»
> level: B1 · type: order · id: de-b1-relativsaetze-q17
>
> ```text order
> Das
> ist
> das Beste,
> was
> ich
> je
> gegessen habe.
> dass ✗
> ```
>
> **Пояснення:** після *das Beste* — **was**. Дієслово наприкінці: *gegessen habe*. *Dass* — сполучник, а не відносне слово.

> [!quiz] Склади речення: «Це колега, з якою я працюю»
> level: B1 · type: order · id: de-b1-relativsaetze-q18
>
> ```text order
> Das
> ist
> die Kollegin,
> mit der
> ich
> arbeite.
> mit die ✗
> ```
>
> **Пояснення:** прийменник стоїть перед займенником і керує Dativ: *mit der*.

## Фішки

> [!reel] 🎭 Одне слово — три ролі
> *Der, die, das* — це означений артикль (*der Mann*), вказівний займенник (*Der ist nett!* — він симпатичний) і відносний займенник (*der Mann, der …*). Форми збігаються, тому роль слова визначаємо за контекстом: чи є далі іменник, чи починається підрядне речення.

> [!reel] 🗺️ «Der Mann, wo …» — південь не питає граматику
> У швейцарській і південнонімецькій розмові *wo* часто стоїть замість будь-якого відносного займенника: *Der Mann, wo da steht …* У стандартній німецькій так писати не треба — але почуєш на вулицях Цюриха чи Мюнхена.

> [!reel] 📚 Дієслово наприкінці: жарти Марка Твена
> У додатку до книги *A Tramp Abroad* (1880) Марк Твен у есе «The Awful German Language» жартував, що німецьке дієслово ховається в кінці довгого речення. Підрядні речення, зокрема відносні, якраз і ставлять дієслово в кінець.

## Джерела та що почитати

- [DWDS — Relativsatz](https://www.dwds.de/wb/Relativsatz) — термін, значення, приклади.
- [DWDS — Relativpronomen](https://www.dwds.de/wb/Relativpronomen) — відносні займенники.
- [Deutsche Grammatik 2.0 — відносні речення](https://www.deutschegrammatik20.de/) — онлайн-граматика з тренажерами.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділ «Relativsätze».
- Duden. *Die Grammatik* — розділ про відносні речення.

> [!important] Підсумок
> - Рід і число займенника — від іменника, відмінок — від ролі в підрядному реченні.
> - Форми: der / den / dem / dessen · die / die / der / deren · das / das / dem / dessen · die / die / **denen** / deren.
> - З прийменником: прийменник стоїть перед займенником: *mit dem, in der, mit denen*.
> - *Dessen / deren* + іменник без артикля; *wo* — для місця; *was* — після alles, nichts, etwas і вищого ступеня.
> - Відносне речення відокремлюють комами, дієслово — в кінці.
