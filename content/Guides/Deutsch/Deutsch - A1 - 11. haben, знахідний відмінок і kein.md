---
title: haben, знахідний відмінок і kein
id: de-a1-akkusativ
level: A1
icon: px:puzzle
tags: [deutsch, a1, grammar, haben, akkusativ, kein]
prerequisites: ["[[Deutsch - A1 - 06. Артикль і рід — der, die, das, ein, eine]]", "[[Deutsch - A1 - 09. Питання й місце дієслова — V2 і W-Fragen]]"]
estimatedMinutes: 40
---

# haben, знахідний відмінок і kein

> [!success] Після цієї теми ти зможеш
> - відмінювати *haben* і говорити, що в тебе є: *Ich habe einen Bruder. Wir haben keine Zeit.*;
> - відрізнити підмет (Nominativ) від додатка (Akkusativ) і змінити *der → den, ein → einen*;
> - заперечити іменник через *kein / keine / keinen*, а дієслово чи прикметник — через *nicht*;
> - не казати ~~Ich habe 20 Jahre~~ і ~~Ich habe kalt~~.

## Передбач

> [!quiz] Яке речення правильне?
> level: A1 · type: single · id: de-a1-akkusativ-q01
> - [ ] Ich habe ein Bruder.
> - [x] Ich habe einen Bruder.
> - [ ] Ich habe eine Bruder.
> - [ ] Ich habe Bruder.
>
> **Пояснення:** *der Bruder* — чоловічий рід, а як **додаток** (кого я маю?) він стоїть у знахідному відмінку: *ein → **einen***. Злічуваний іменник в однині зазвичай не стоїть без артикля.

## Дієслово haben

*haben* — «мати», друге за частотою дієслово німецької після *sein*. Воно **неправильне**: у формах *du* і *er / sie / es* зникає **b**.

| Особа | haben | Приклад |
|---|---|---|
| ich | **habe** | Ich habe einen Hund. |
| du | **hast** | Du hast Zeit. |
| er / sie / es | **hat** | Sie hat zwei Kinder. |
| wir | **haben** | Wir haben ein Auto. |
| ihr | **habt** | Ihr habt Glück! |
| sie / Sie | **haben** | Haben Sie einen Termin? |

Питання з *haben* — дієслово першим: *Hast du Zeit? Haben Sie Kinder?* (див. [[Deutsch - A1 - 09. Питання й місце дієслова — V2 і W-Fragen]]).

### Що ми «маємо» німецькою

- **предмети й людей:** *Ich habe ein Auto. Ich habe einen Bruder.*
- **час, гроші, роботу:** *Ich habe Zeit. Sie hat viel Arbeit. Er hat kein Geld.*
- **деякі стани:** *Hunger haben, Durst haben, Angst haben* — дослівно «мати голод / спрагу / страх»: *Ich habe Hunger.* Також *Glück haben* (щастити), *recht haben* (мати рацію).

> [!warning] Вік і температура — не через haben
> ~~Ich habe 20 Jahre~~ → Ich **bin** 20 (Jahre alt). ~~Ich habe kalt~~ → **Mir ist** kalt. *Ich bin kalt* означало б «я холодна людина», а *Mir ist kalt* («мені холодно») — стала фраза, відмінок розберемо пізніше. Вік — через *sein* (тема [[Deutsch - A1 - 04. Числа, вік і номер телефону]]).

## Nominativ і Akkusativ

**Nominativ** — відмінок підмета: відповідає на питання **Wer? Was?** («хто? що?»): *Der Mann kommt.* **Akkusativ** — відмінок прямого додатка: **Wen? Was?** («кого? що?»): *Ich sehe **den Mann**.* Українське «знахідний» на питання «кого? що?» — це те саме.

Тема дуже проста: **змінюється лише чоловічий рід.**

| | Nominativ | Akkusativ |
|---|---|---|
| **m.** (der) | der / ein / kein | **den / einen / keinen** |
| **f.** (die) | die / eine / keine | die / eine / keine |
| **n.** (das) | das / ein / kein | das / ein / kein |
| **мн.** (die) | die / — / keine | die / — / keine |

> [!diagram] Nominativ → Akkusativ: змінюється тільки чоловічий рід
> ```yaml
> layout: compare
> columns: { a: "Nominativ · wer? was?", b: "Akkusativ · wen? was?" }
> nodes:
>   - { id: m1, col: a, label: "der · ч.", text: "der / ein / kein", tone: blue }
>   - { id: f1, col: a, label: "die · ж.", text: "die / eine / keine", tone: red }
>   - { id: n1, col: a, label: "das · с.", text: "das / ein / kein", tone: green }
>   - { id: p1, col: a, label: "die · мн.", text: "die / — / keine", tone: violet }
>   - { id: m2, col: b, label: "der · ч.", text: "den / einen / keinen", tone: blue }
>   - { id: f2, col: b, label: "die · ж.", text: "die / eine / keine", tone: red }
>   - { id: n2, col: b, label: "das · с.", text: "das / ein / kein", tone: green }
>   - { id: p2, col: b, label: "die · мн.", text: "die / — / keine", tone: violet }
> steps:
>   - { focus: [m1, m2], note: "Чоловічий рід змінюється: der → den, ein → einen, kein → keinen. Додається -(e)n." }
>   - { focus: [f1, f2], note: "Жіночий: без змін. die Tasche — і підмет, і додаток." }
>   - { focus: [n1, n2], note: "Середній: без змін." }
>   - { focus: [p1, p2], note: "Множина: без змін. Неозначеного артикля в множині немає: Ich habe Geschwister." }
> ```

Порівняй:

| Nominativ (підмет) | Akkusativ (додаток) |
|---|---|
| **Der** Hund ist groß. | Ich habe **den** Hund. |
| **Ein** Hund kommt. | Ich habe **einen** Hund. |
| **Die** Tasche ist neu. | Ich brauche **die** Tasche. |
| **Das** Problem ist klein. | Wir haben **das** Problem. |

Akkusativ ставимо після дієслів, що мають прямий додаток: *haben, brauchen, suchen, kaufen, sehen, lieben*… Питання до додатка — **Wen? Was?**: *Wen hast du? — Einen Bruder. Was suchst du? — Den Schlüssel.*

> [!tip] Як перевірити, чи потрібен Akkusativ
> 1. Знайди дієслово (*habe, brauche*).
> 2. Спитай «хто? що?» — це підмет (Nominativ): *Ich* (хто має?).
> 3. Спитай «кого? що?» — це додаток (Akkusativ): *einen Bruder* (кого маю?).
> 4. Якщо слово чоловічого роду — *der → den, ein → einen*. Решта не змінюється.
>
> Після *sein* (*Das ist ein Hund. Er ist Lehrer.*) додатка немає, тож лишається Nominativ.

## Іменники без артикля

Артикль не ставимо перед:

- **незлічуваними** іменниками, коли мова про «якусь кількість»: *Ich trinke Kaffee. Ich habe Zeit. Er hat Geld.* (в темі [[Deutsch - A1 - 06. Артикль і рід — der, die, das, ein, eine]] ми це бачили);
- **множиною** в загальному значенні (аналог *ein* у множині): *Ich habe Geschwister. Wir haben Fragen.*;
- **професією й національністю** після *sein*: *Ich bin Lehrer.*

У цих випадках для заперечення саме й потрібен *kein*.

## Заперечення: kein чи nicht

Німецька має два слова «не», і вибір простий.

> [!diagram] kein чи nicht?
> ```yaml
> layout: compare
> columns: { a: "kein / keine / keinen", b: "nicht" }
> nodes:
>   - { id: a1, col: a, label: "заперечує", text: "іменник з ein- або без артикля", tone: gray }
>   - { id: a2, col: a, label: "було", text: "Ich habe ein Auto. / Ich habe Zeit.", tone: gray }
>   - { id: a3, col: a, label: "стало", text: "Ich habe kein Auto. / Ich habe keine Zeit.", tone: yellow }
>   - { id: b1, col: b, label: "заперечує", text: "дієслово, прикметник, означений артикль, особу", tone: gray }
>   - { id: b2, col: b, label: "було", text: "Ich arbeite. / Das Auto ist neu. / Ich kenne den Mann.", tone: gray }
>   - { id: b3, col: b, label: "стало", text: "Ich arbeite nicht. / Das Auto ist nicht neu. / Ich kenne den Mann nicht.", tone: yellow }
> steps:
>   - { focus: [a1, a2, a3], note: "ein Auto → kein Auto; Zeit → keine Zeit. kein = nicht + ein: заперечуємо саме іменник." }
>   - { focus: [b1, b2, b3], note: "nicht стоїть після дієслова (або перед прикметником чи словом, яке заперечується): Ich arbeite nicht." }
> ```

**kein** відмінюється так само, як *ein*, але має **множину**:

| | m. | f. | n. | мн. |
|---|---|---|---|---|
| Nominativ | kein | keine | kein | keine |
| Akkusativ | **keinen** | keine | kein | keine |

Приклади:

- Ich habe **ein** Auto. → Ich habe **kein** Auto.
- Ich habe **einen** Hund. → Ich habe **keinen** Hund.
- Ich habe **Zeit**. → Ich habe **keine** Zeit.
- Wir haben **Geschwister**. → Wir haben **keine** Geschwister.
- Er trinkt **Kaffee**. → Er trinkt **keinen** Kaffee.
- Ich bin **Lehrer**. → Ich bin **kein** Lehrer.

**nicht** — для решти:

- Ich arbeite **nicht**. — Я не працюю.
- Das Auto ist **nicht** neu. — Автомобіль не новий.
- Ich kenne **den** Mann **nicht**. — Я не знаю цього чоловіка. (означений артикль → *nicht*, не ~~keinen Mann~~)
- Er wohnt **nicht** in Berlin. — Він не живе в Берліні.

### Подвійне заперечення

В українській «Я нікого не знаю» має два заперечення, і це норма. У німецькій **одне заперечення на речення**: *Ich kenne **niemanden**.* (а не ~~Ich kenne niemanden nicht~~). Так само: *Ich habe **nichts**.* (я нічого не маю), *Ich habe **nie** Zeit.* («ніколи не маю часу»), *Ich sehe **nirgends** einen Parkplatz.*

## Приклади

- Ich habe einen Bruder und eine Schwester. — У мене є брат і сестра.
- Hast du einen Stift? — Nein, ich habe keinen Stift. — У тебе є ручка? — Ні, ручки нема.
- Wir haben heute keine Zeit. — У нас сьогодні нема часу.
- Haben Sie einen Termin? — Ja, um zehn Uhr. — У Вас є запис? — Так, на десяту.
- Sie hat keinen Hund, aber eine Katze. — У неї немає собаки, але є кішка.
- Ich brauche einen Koffer. — Мені потрібна валіза.
- Wir suchen den Schlüssel. — Ми шукаємо ключ.
- Ich habe kein Problem. — У мене немає проблеми.
- Du hast recht! — Ти маєш рацію!
- Er hat Angst, aber er hat keinen Grund. — Він боїться, але причини немає.

## Слова

> [!word] haben
> ipa: /ˈhaːbn̩/ · pos: verb · level: A1 · id: de-a1-akkusativ-w01
> uk: мати; мати у своєму розпорядженні
> forms: ich habe · du hast · er hat · hatte · hat gehabt
> example: Ich **habe** einen Bruder. — У мене є брат.
> note: du hast, er hat — b випадає. Допоміжне дієслово Perfekt (тема A1-26).

> [!word] kein
> ipa: /kaɪ̯n/ · pos: art · level: A1 · id: de-a1-akkusativ-w02
> uk: жоден; ніякий; (не) — перед іменником
> forms: kein · keine · kein · keine (мн.) · keinen (Akk ч.)
> example: Ich habe **kein** Auto. — У мене немає автомобіля.
> note: kein = nicht + ein. Відмінюється як ein, але має множину: keine Kinder. Не плутай з «keiner» (ніхто).

> [!word] nicht
> ipa: /nɪçt/ · pos: adv · level: A1 · id: de-a1-akkusativ-w03
> uk: не
> example: Ich arbeite heute **nicht**. — Сьогодні я не працюю.
> note: ch після i = [ç]. nicht стоїть після дієслова: Ich komme nicht. Заперечує дієслово, прикметник, прислівник, означену групу.

> [!word] nichts
> ipa: /nɪçts/ · pos: pron · level: A1 · id: de-a1-akkusativ-w04
> uk: нічого
> example: Ich habe **nichts**. — У мене нічого немає.
> note: у реченні лише одне заперечення: Ich sehe nichts, не ~~Ich sehe nichts nicht~~. Походить від nicht.

> [!word] die Zeit
> ipa: /tsaɪ̯t/ · pos: noun · level: A1 · id: de-a1-akkusativ-w05
> uk: час; пора
> forms: die Zeiten
> example: Ich habe heute keine **Zeit**. — У мене сьогодні немає часу.
> note: Zeit haben — без артикля (Hast du Zeit?). Мн. die Zeiten — «епохи». Час доби — die Uhrzeit; «раз» — das Mal.

> [!word] das Geld
> ipa: /ɡɛlt/ · pos: noun · level: A1 · id: de-a1-akkusativ-w06
> uk: гроші
> forms: — (без множини)
> example: Er hat kein **Geld**. — У нього немає грошей.
> note: українське «гроші» — множина, а das Geld — однина: Das Geld ist weg. Без артикля: Ich habe Geld. (die Gelder — окремі суми, фінансові кошти.)

> [!word] die Angst
> ipa: /aŋst/ · pos: noun · level: A1 · id: de-a1-akkusativ-w07
> uk: страх
> forms: die Ängste
> example: Ich habe keine **Angst**. — Я не боюся.
> note: Angst haben = боятися: Ich habe Angst. З уточненням чого — Angst haben vor + Dat (пізніше). Наголос на єдиному складі.

> [!word] das Problem
> ipa: /pʁoˈbleːm/ · pos: noun · level: A1 · id: de-a1-akkusativ-w08
> uk: проблема
> forms: die Probleme
> example: Kein **Problem**! — Не проблема!
> note: Kein Problem! — стала фраза «без проблем». Наголос на другому складі. AT, CH те саме.

> [!word] die Frage
> ipa: /ˈfʁaːɡə/ · pos: noun · level: A1 · id: de-a1-akkusativ-w09
> uk: питання
> forms: die Fragen
> example: Haben Sie eine **Frage**? — У Вас є питання?
> note: eine Frage stellen (ставити питання), не ~~geben~~. Від fragen = питати.

> [!word] der Hund
> ipa: /hʊnt/ · pos: noun · level: A1 · id: de-a1-akkusativ-w10
> uk: собака; пес
> forms: die Hunde
> example: Mein Nachbar hat einen **Hund**. — У мого сусіда є собака.
> note: Hund — d у кінці читається [t] (оглушення). Akk: einen Hund, den Hund. h на початку — легкий видих.

> [!word] der Schlüssel
> ipa: /ˈʃlʏsl̩/ · pos: noun · level: A1 · id: de-a1-akkusativ-w11
> uk: ключ
> forms: die Schlüssel
> example: Ich suche meinen **Schlüssel**. — Я шукаю свій ключ.
> note: Sch- = «ш»; ü — губи «у», язик «і». Akk: den Schlüssel. Мн. без закінчення.

> [!word] der Stift
> ipa: /ʃtɪft/ · pos: noun · level: A1 · id: de-a1-akkusativ-w12
> uk: ручка; олівець (загалом: пишучий предмет)
> forms: die Stifte
> example: Hast du einen **Stift**? — У тебе є ручка?
> note: st- на початку = «шт». Der Kugelschreiber = кулькова ручка, der Bleistift = олівець; Stift — розмовно «чимось писати».

> [!word] die Tasche
> ipa: /ˈtaʃə/ · pos: noun · level: A1 · id: de-a1-akkusativ-w13
> uk: сумка
> forms: die Taschen
> example: Meine **Tasche** ist schwer. — Моя сумка важка.
> note: жіночий рід — не змінюється в Akk: Ich habe eine Tasche. AT: Tasche / Sackerl (пакет); CH: Tasche, Sack.

> [!word] der Koffer
> ipa: /ˈkɔfɐ/ · pos: noun · level: A1 · id: de-a1-akkusativ-w14
> uk: валіза
> forms: die Koffer
> example: Ich brauche einen großen **Koffer**. — Мені потрібна велика валіза.
> note: -er = короткий [ɐ]. Мн. без закінчення. Akk: einen Koffer, den Koffer.

> [!word] der Regenschirm
> ipa: /ˈʁeːɡn̩ˌʃɪʁm/ · pos: noun · level: A1 · id: de-a1-akkusativ-w15
> uk: парасолька
> forms: die Regenschirme
> example: Hast du einen **Regenschirm**? — У тебе є парасолька?
> note: der Regen (дощ) + der Schirm (щит, ширма). Скорочено розм. der Schirm. Горлове [ʁ] на початку.

## Слухаємо

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-akkusativ-l01
> audio: Ich habe einen Hund.
> - [ ] Ich habe keinen Hund.
> - [x] Ich habe einen Hund.
> - [ ] Ich habe einen Bruder.

> [!listen] Що ти почув?
> level: A1 · type: choice · speed: slow · id: de-a1-akkusativ-l02
> audio: Wir haben keine Zeit.
> - [x] Wir haben keine Zeit.
> - [ ] Wir haben eine Zeit.
> - [ ] Ihr habt keine Zeit.

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-akkusativ-l03
> audio: Hast du einen Stift?

> [!listen] Напиши або скажи, що почув
> level: A1 · type: dictation · speed: slow · id: de-a1-akkusativ-l04
> audio: Er hat keinen Schlüssel.
> explain: чоловічий рід в Akkusativ: kein → keinen. Der Schlüssel — він; ‘er hat’ — b випадає.

## Вимова

- **b** у *haben* — звичайне [b]: [ˈhaːbn̩]; а у формах *hast, hat* слово коротке: [hast], [hat].
- **kein** — *ei* = «ай»: [kaɪ̯n]. **keine** [ˈkaɪ̯nə], **keinen** [ˈkaɪ̯nən].
- **nicht** — *ch* = [ç], як «хь»: [nɪçt]; **nichts** [nɪçts].
- **einen** — [ˈaɪ̯nən], два склади: *ei-nen*.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-akkusativ-s01
> text: Ich habe einen Bruder.
> ipa: /ɪç ˈhaːbə ˈaɪ̯nən ˈbʁuːdɐ/
> tip: habe — довге [aː], h на початку — легкий видих. einen — ei = «ай». Bruder: горлове [ʁ], -er = короткий [ɐ].
> uk: У мене є брат.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-akkusativ-s02
> text: Hast du Zeit?
> ipa: /hast duː tsaɪ̯t/
> tip: hast — коротке [a], st в кінці. Zeit: z = «ц», ei = «ай». Питання «так / ні» — голос угору ↗.
> uk: Ти маєш час?

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-akkusativ-s03
> text: Wir haben keine Zeit.
> ipa: /viːɐ̯ ˈhaːbn̩ ˈkaɪ̯nə tsaɪ̯t/
> tip: haben — наголос на першому складі, -ben майже нечітке. keine — «кайне». Голос падає ↘.
> uk: У нас нема часу.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-akkusativ-s04
> text: Er hat keinen Hund.
> ipa: /eːɐ̯ hat ˈkaɪ̯nən hʊnt/
> tip: Hund закінчується на [t] (оглушення), h — легкий видих. hat — коротке [a], не «хаат». keinen — два склади.
> uk: У нього немає собаки.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-akkusativ-s05
> text: Ich brauche einen Schlüssel.
> ipa: /ɪç ˈbʁaʊ̯xə ˈaɪ̯nən ˈʃlʏsl̩/
> tip: brauche — au = «ау», ch після au = [x]. Schlüssel: Sch = «ш», ü — губи «у» + язик «і».
> uk: Мені потрібен ключ.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-akkusativ-s06
> text: Ich habe kein Geld.
> ipa: /ɪç ˈhaːbə kaɪ̯n ɡɛlt/
> tip: Geld — g = «ґ», кінцева d глушиться: [ɡɛlt]. kein — ei = «ай».
> uk: У мене немає грошей.

## Типові помилки українців

> [!pitfall] ~~Ich habe 20 Jahre~~ і ~~Ich habe kalt~~
> Українське «мені 20 років» німці передають через *sein*: ***Ich bin 20 (Jahre alt).*** А «мені холодно» — ***Mir ist kalt.*** (*Ich bin kalt* = «я холодна людина»). Стани *Hunger, Durst, Angst* — навпаки, через *haben*: *Ich habe Hunger.* Не копіюй українську граматику: перевіряй кожну фразу зі словником.

> [!pitfall] Забутий Akkusativ: ~~Ich habe ein Bruder~~
> Для чоловічого роду в додатку: **den / einen / keinen**. ~~Ich habe ein Bruder~~ → Ich habe **einen** Bruder. ~~Ich kenne der Mann~~ → Ich kenne **den** Mann. Жіночий і середній рід не змінюються: *Ich habe **eine** Schwester. Ich habe **ein** Kind.* Тому запамʼятай питання: «Рід чоловічий? Це додаток? → -n».

> [!pitfall] ~~Ich habe nicht Zeit~~ → Ich habe keine Zeit
> Заперечувати іменник з неозначеним артиклем або без артикля треба через **kein**: ***Ich habe keine Zeit.***, ***Er hat keinen Hund.***, ***Wir haben kein Geld.*** *Nicht* — для дієслова й прикметника: *Ich arbeite nicht.* ~~Ich habe nicht einen Hund~~ звучить неприродно (нормально — *keinen Hund*).

> [!pitfall] Подвійне заперечення: ~~Ich habe nichts nicht~~
> В українській «Я нічого не маю» — два «не». У німецькій зазвичай **одне** заперечення на речення: ***Ich habe nichts.***, ***Ich kenne niemanden.***, ***Ich habe nie Zeit.*** ~~Ich habe nicht nichts~~ — помилка, яку німці зрозуміють, але вона звучить «по-українськи».

## Ситуація: на ресепшені

> [!listen] Послухай діалог. Що є і чого нема?
> level: A1 · type: answer · speed: slow · id: de-a1-akkusativ-l05
> audio: A: Guten Tag. Haben Sie einen Termin?
> audio: B: Ja. Ich habe einen Termin um zehn Uhr.
> audio: A: Haben Sie den Brief dabei?
> audio: B: Nein, ich habe den Brief nicht. Ich habe nur meine Tasche und einen Stift.
> - [ ] Є запис і лист, але нема сумки.
> - [x] Є запис і сумка з ручкою, але листа нема.
> - [ ] Нема ні запису, ні листа.
>
> **Пояснення:** *einen Termin* — є запис. *den Brief nicht* — листа нема (означений артикль → *nicht*, не *kein*). *Tasche und einen Stift* — сумка й ручка.

> [!speak] Скажи вголос
> level: A1 · speed: slow · id: de-a1-akkusativ-s07
> text: Ich habe einen Termin um zehn Uhr.
> ipa: /ɪç ˈhaːbə ˈaɪ̯nən tɛʁˈmiːn ʊm tseːn uːɐ̯/
> tip: Termin — наголос на -min. zehn: довге [eː]. Uhr: довге [uː] + приглушене [ɐ̯].
> uk: У мене запис на десяту годину.

## Практика

> [!quiz] Яка форма haben: «Du ___ Zeit.»
> level: A1 · type: single · id: de-a1-akkusativ-q02
> - [ ] habst
> - [x] hast
> - [ ] hat
> - [ ] habe
>
> **Пояснення:** *du hast* (без *b*); *hat* — для er / sie / es; *habe* — для ich. Форми *habst* немає.

> [!quiz] Заповни: «Ich brauche ___ Koffer.» (der Koffer)
> level: A1 · type: single · id: de-a1-akkusativ-q03
> - [ ] ein
> - [x] einen
> - [ ] eine
> - [ ] einem
>
> **Пояснення:** *brauchen* бере Akkusativ; *der Koffer* — чоловічий рід, тож *ein → **einen***. *eine* — для жіночого, *einem* — для Dativ.

> [!quiz] Заповни: «Ich habe ___ Tasche.» (die Tasche)
> level: A1 · type: single · id: de-a1-akkusativ-q04
> - [ ] einen
> - [x] eine
> - [ ] ein
> - [ ] einer
>
> **Пояснення:** жіночий рід в Akkusativ не змінюється: *eine Tasche*. *einen* — лише для чоловічого.

> [!quiz] Як заперечити: «Ich habe ein Auto.»
> level: A1 · type: single · id: de-a1-akkusativ-q05
> - [ ] Ich habe nicht ein Auto.
> - [ ] Ich habe nicht Auto.
> - [x] Ich habe kein Auto.
> - [ ] Ich habe keinen Auto.
>
> **Пояснення:** іменник з *ein* заперечуємо через *kein*. *das Auto* — середній рід, тож без закінчення (*kein*), а *keinen* було б для *der*.

> [!quiz] Як сказати «У мене немає часу»?
> level: A1 · type: single · id: de-a1-akkusativ-q06
> - [ ] Ich habe nicht Zeit.
> - [x] Ich habe keine Zeit.
> - [ ] Ich habe kein Zeit.
> - [ ] Ich bin keine Zeit.
>
> **Пояснення:** *die Zeit* — жіночий рід, тому *keine*. Без артикля іменник заперечуємо через *kein*.

> [!quiz] Як сказати «Мені холодно»?
> level: A1 · type: single · id: de-a1-akkusativ-q07
> - [ ] Ich habe kalt.
> - [ ] Ich bin kalt.
> - [x] Mir ist kalt.
> - [ ] Ich ist kalt.
>
> **Пояснення:** ~~Ich habe kalt~~ — калька. *Ich bin kalt* означає «я холодна людина». Правильно — *Mir ist kalt* (стала фраза).

> [!quiz] Які речення правильні?
> level: A1 · type: multi · id: de-a1-akkusativ-q08
> - [x] Wir haben einen Hund.
> - [ ] Wir haben ein Hund.
> - [x] Sie hat eine Schwester.
> - [ ] Sie hat einen Schwester.
> - [x] Er hat kein Geld.
>
> **Пояснення:** *Hund* — чоловічий рід: *einen Hund*. *Schwester* — жіночий: *eine Schwester*. *Geld* — середній (без артикля): *kein Geld*.

> [!quiz] Де обрано правильне заперечення?
> level: A1 · type: multi · id: de-a1-akkusativ-q09
> - [x] Ich arbeite nicht.
> - [ ] Ich arbeite kein.
> - [x] Ich habe keinen Schlüssel.
> - [ ] Ich habe nicht Schlüssel.
> - [x] Das Auto ist nicht neu.
>
> **Пояснення:** *nicht* — для дієслова й прикметника, *kein* — для іменника. *Ich habe keinen Schlüssel* — чоловічий рід Akk.

> [!quiz] Заповни пропуски формами haben
> level: A1 · type: fill · bank: habst, hatt · id: de-a1-akkusativ-q10
>
> ```text fill
> Ich [[habe]] ein Auto.
> Du [[hast]] Zeit.
> Sie [[hat]] zwei Kinder.
> Wir [[haben]] Hunger.
> Ihr [[habt]] Glück!
> ```
>
> **Пояснення:** ich habe, du hast (без *b*), sie hat, wir haben, ihr habt. *habst* і *hatt* — помилкові форми.

> [!quiz] Заповни пропуски: den, einen, keinen
> level: A1 · type: fill · bank: der, ein, kein · id: de-a1-akkusativ-q11
>
> ```text fill
> Ich kaufe [[einen]] Koffer.
> Wir suchen [[den]] Schlüssel.
> Er hat [[keinen]] Hund.
> ```
>
> **Пояснення:** усі іменники чоловічого роду в Akkusativ: *einen Koffer*, *den Schlüssel*, *keinen Hund*. *der, ein, kein* — Nominativ.

> [!quiz] Заповни пропуски: kein чи nicht
> level: A1 · type: fill · bank: keinen, keiner · id: de-a1-akkusativ-q12
>
> ```text fill
> Ich habe [[keine]] Zeit.
> Er hat [[kein]] Auto.
> Wir arbeiten heute [[nicht]].
> Sie kennt den Mann [[nicht]].
> ```
>
> **Пояснення:** *Zeit* (жін.) → *keine*; *Auto* (сер.) → *kein*; дієслово → *nicht*; *den Mann* (означений артикль) → *nicht*. *keinen* — для чоловічого, *keiner* — «ніхто».

> [!quiz] Склади речення: «У мене є брат»
> level: A1 · type: order · id: de-a1-akkusativ-q13
>
> ```text order
> Ich
> habe
> einen
> Bruder.
> ein ✗
> ```
>
> **Пояснення:** *der Bruder* у Akkusativ → *einen*. *ein* було б для середнього роду.

> [!quiz] Склади речення: «У нас нема часу»
> level: A1 · type: order · id: de-a1-akkusativ-q14
>
> ```text order
> Wir
> haben
> keine
> Zeit.
> nicht ✗
> ```
>
> **Пояснення:** іменник *Zeit* заперечуємо через *keine*, а не *nicht*.

> [!quiz] Склади питання: «У тебе є ручка?»
> level: A1 · type: order · id: de-a1-akkusativ-q15
>
> ```text order
> Hast
> du
> einen
> Stift?
> ein ✗
> ```
>
> **Пояснення:** питання «так / ні» — дієслово першим. *der Stift* → *einen*.

> [!quiz] Склади речення: «Він не має собаки»
> level: A1 · type: order · id: de-a1-akkusativ-q16
>
> ```text order
> Er
> hat
> keinen
> Hund.
> nicht ✗
> ```
>
> **Пояснення:** *der Hund* у Akkusativ → *keinen*. Заперечення іменника — *kein*, а не *nicht*.

## Фішки

> [!reel] 🧬 haben ≠ habere
> Латинське *habere* («мати») і німецьке *haben* звучать майже однаково, але це **не родичі**. За етимологічним словником Pfeifer, *haben* походить від германського кореня зі значенням «тримати, брати» (давньоверхньонімецьке *habēn*, готське *haban*), спорідненого з *heben* («піднімати»). Збіг із латинською — випадковий, класична пастка «хибних родичів».

> [!reel] 🔤 nicht — це «ні-що»
> Слово *nicht* зʼявилося із середньоверхньонімецького *niht*, яке походить від давньоверхньонімецького *niowiht* — «ніщо, нічого» (*ni* + *io* + *wiht*, де *wiht* — «річ, істота»). Тобто *nicht* буквально колись означало «нічого», а потім стало ще й «не». Від того ж кореня і *nichts*.

> [!reel] 🍽 Hunger, Durst, Angst — «мають», вік — «є»
> Німці «мають» голод, спрагу, страх і навіть рацію: *Hunger haben, Durst haben, Angst haben, recht haben*. А от вік і місце — це *sein*: *Ich bin 20. Ich bin hier.* Українською ми кажемо «я голодний», «мені страшно», тож граматична рамка інша. Такі вирази вчи цілими: *Ich habe Hunger* — нормальна відповідь у кафе.

## Джерела та що почитати

- [DWDS — haben](https://www.dwds.de/wb/haben) — відмінювання, значення, етимологія (Pfeifer).
- [DWDS — kein](https://www.dwds.de/wb/kein) — вживання *kein* і відмінювання.
- [DWDS — nicht](https://www.dwds.de/wb/nicht) — значення й походження (*niowiht*).
- [DWDS — nichts](https://www.dwds.de/wb/nichts) — значення й сполучення.
- [DWDS — Schlüssel](https://www.dwds.de/wb/Schl%C3%BCssel) — слово зі зразками використання.
- [DW Learn German — Nicos Weg (A1)](https://learngerman.dw.com/en/beginners/c-36519789) — безкоштовний відеокурс Deutsche Welle з haben, Akkusativ та kein.
- Goethe-Institut — сторінка іспиту *Goethe-Zertifikat A1: Start Deutsch 1* на goethe.de: граматичний мінімум.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділи про Akkusativ і заперечення.

> [!important] Підсумок
> - *haben*: ich habe, du **hast**, er **hat**, wir haben, ihr **habt**, sie / Sie haben.
> - Akkusativ (кого? що?) змінює лише чоловічий рід: **der → den, ein → einen, kein → keinen**.
> - Іменник без артикля (незлічуваний або множина) і з *ein* заперечуємо через **kein / keine / keinen**; дієслово, прикметник і іменник із *der / die / das* — через **nicht**.
> - Вік — через *sein* (*Ich bin 20*), холод — *Mir ist kalt*; не ~~Ich habe 20 Jahre~~, не ~~Ich habe kalt~~.
> - Заперечення в реченні зазвичай одне: *Ich habe nichts.*
